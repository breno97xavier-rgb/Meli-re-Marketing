// Supabase Edge Function: submit-lead
// Runtime: Deno / Supabase Edge Functions
// Handles new multi-step briefing submissions (/briefing) with full backward compatibility for legacy requests.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// ============================================================================
// CONSTANTS & DICTIONARIES (PORTUGUESE LABELS & CANONICAL VALUES)
// ============================================================================

export const CANONICAL_SERVICES = [
  'social_media',
  'paid_traffic',
  'website_portfolio',
  'branding_positioning',
  'full_strategy',
  'not_sure',
] as const;
export type CanonicalService = typeof CANONICAL_SERVICES[number];

export const CANONICAL_SITUATIONS = [
  'not_started',
  'in_house',
  'active_agency_or_freelancer',
  'past_experience',
  'wants_improvement',
  'evaluating_options',
] as const;
export type CanonicalSituation = typeof CANONICAL_SITUATIONS[number];

export const CANONICAL_OBJECTIVES = [
  'attract_clients',
  'brand_perception',
  'organize_communication',
  'increase_conversion',
  'repositioning',
  'launch_or_rebrand',
  'other',
] as const;
export type CanonicalObjective = typeof CANONICAL_OBJECTIVES[number];

export const SERVICE_LABELS: Record<string, string> = {
  social_media: 'Conteúdo e Redes Sociais',
  paid_traffic: 'Tráfego Pago e Aquisição',
  website_portfolio: 'Site ou Portfólio',
  branding_positioning: 'Marca e Posicionamento',
  full_strategy: 'Estratégia Completa',
  not_sure: 'Ainda não sei exatamente',
};

export const SITUATION_LABELS: Record<string, string> = {
  not_started: 'Ainda não fazemos nada estruturado',
  in_house: 'Fazemos internamente / Faço tudo sozinho',
  active_agency_or_freelancer: 'Já trabalhamos com agência ou freelancers',
  past_experience: 'Já trabalhei com profissionais anteriormente',
  wants_improvement: 'Já tentamos antes, mas queremos melhorar',
  evaluating_options: 'Estamos apenas avaliando possibilidades',
};

export const OBJECTIVE_LABELS: Record<string, string> = {
  attract_clients: 'Atrair mais clientes qualificados',
  brand_perception: 'Melhorar percepção de marca e autoridade',
  organize_communication: 'Organizar a comunicação e presença',
  increase_conversion: 'Melhorar taxa de conversão em vendas',
  repositioning: 'Reposicionar marca ou atuação no mercado',
  launch_or_rebrand: 'Lançar ou reformular produto/serviço',
  other: 'Outro objetivo específico',
};

export const CONTACT_METHOD_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  phone: 'Ligação Telefônica',
  email: 'E-mail',
};

export const CALL_PERIOD_LABELS: Record<string, string> = {
  morning: 'Manhã (09h às 12h)',
  afternoon: 'Tarde (14h às 18h)',
};

// CORS configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ============================================================================
// HELPER LOGIC: SOURCE INFERENCE
// ============================================================================

export function inferLeadSource(params: {
  utm_source?: string;
  utm_medium?: string;
  referrer?: string;
}): string {
  const source = (params.utm_source || '').trim().toLowerCase();
  const medium = (params.utm_medium || '').trim().toLowerCase();
  const ref = (params.referrer || '').trim().toLowerCase();

  const isPaidMedium = /^(cpc|paid|ads|ppc|paid_social|boost)$/.test(medium) || /paid|cpc|ads|ppc|paid_social|boost/.test(medium);

  // 1. Google Ads (Highest priority for Google sources with paid mediums)
  const isGoogleSource = /google|adwords|gads/.test(source);
  if (isGoogleSource && isPaidMedium) {
    return 'google_ads';
  }

  // 2. Meta Ads (Explicit source OR Meta source + Paid medium)
  const isMetaSource = /facebook|meta|fb|instagram|ig/.test(source);
  if (source === 'meta_ads' || source === 'fb_ads' || (isMetaSource && isPaidMedium)) {
    return 'meta_ads';
  }

  // 3. Instagram Organic (Instagram source or referrer without paid medium)
  const isInstagramSource = /^(instagram|ig)$/.test(source) || source.includes('instagram');
  const isInstagramReferrer = ref.includes('instagram.com');
  if ((isInstagramSource || isInstagramReferrer) && !isPaidMedium) {
    return 'instagram';
  }

  // 4. Referral
  if (medium === 'referral' || source === 'referral') {
    return 'referral';
  }

  // 5. Default Website Organic
  return 'website';
}

// ============================================================================
// HELPER LOGIC: LEGACY BRIDGES (OFFICE COMPATIBILITY)
// ============================================================================

/**
 * Maps new canonical services to the legacy single service string expected by Melière Office.
 */
export function mapLegacyService(services: string[]): string {
  if (!services || services.length === 0) return 'not_sure';
  const primary = services[0];
  switch (primary) {
    case 'social_media':
      return 'social_media';
    case 'paid_traffic':
      return 'paid_traffic';
    case 'website_portfolio':
      return 'website';
    case 'branding_positioning':
      return 'branding';
    case 'full_strategy':
    case 'not_sure':
    default:
      return 'not_sure';
  }
}

/**
 * Deterministic business stage mapper based on operational maturity hierarchy.
 */
export function mapLegacyBusinessStage(situations: string[]): 'starting' | 'needs_structure' | 'has_presence' | 'professionalizing' {
  if (!situations || situations.length === 0) {
    return 'needs_structure';
  }
  // 1. Starting from scratch
  if (situations.includes('not_started')) {
    return 'starting';
  }
  // 2. Wants evolution / Professionalization
  if (situations.includes('wants_improvement') || situations.includes('evaluating_options')) {
    return 'professionalizing';
  }
  // 3. Already has active or past agency/freelancer experience
  if (situations.includes('active_agency_or_freelancer') || situations.includes('past_experience')) {
    return 'has_presence';
  }
  // 4. In-house operation needing structure
  if (situations.includes('in_house')) {
    return 'needs_structure';
  }
  return 'needs_structure';
}

/**
 * Builds a clear, formatted Portuguese executive summary for the legacy `message` field.
 */
export function generateExecutiveMessage(data: {
  lead_type: 'business' | 'self_employed';
  business_name?: string;
  professional_name?: string;
  contact_name: string;
  segment_or_profession: string;
  services_interest: string[];
  current_situation: string[];
  objectives: string[];
  website_or_instagram?: string;
  notes?: string;
  preferred_contact: 'whatsapp' | 'phone' | 'email';
  preferred_call_period?: 'morning' | 'afternoon';
}): string {
  const isBusiness = data.lead_type === 'business';
  const entityTitle = isBusiness ? `Empresa: ${data.business_name || 'Não informada'}` : `Profissional: ${data.professional_name || data.contact_name}`;
  
  const servicesList = data.services_interest.map((s) => `• ${SERVICE_LABELS[s] || s}`).join('\n');
  const situationList = data.current_situation.map((s) => `• ${SITUATION_LABELS[s] || s}`).join('\n');
  const objectivesList = data.objectives.map((o) => `• ${OBJECTIVE_LABELS[o] || o}`).join('\n');

  const contactPref = CONTACT_METHOD_LABELS[data.preferred_contact] || data.preferred_contact;
  const callPeriod = data.preferred_call_period ? ` (${CALL_PERIOD_LABELS[data.preferred_call_period] || data.preferred_call_period})` : '';

  let summary = `[BRIEFING EXECUTIVO]\n\n`;
  summary += `Perfil: ${isBusiness ? 'Empresa / Negócio' : 'Profissional Autônomo'}\n`;
  summary += `${entityTitle}\n`;
  summary += `Contato: ${data.contact_name}\n`;
  summary += `Segmento / Atuação: ${data.segment_or_profession}\n\n`;

  summary += `Interesses e Necessidades:\n${servicesList}\n\n`;
  summary += `Momento / Situação Atual:\n${situationList}\n\n`;
  summary += `Objetivos Principais:\n${objectivesList}\n\n`;

  if (data.website_or_instagram && data.website_or_instagram.trim()) {
    summary += `Presença Digital (Site/Instagram): ${data.website_or_instagram.trim()}\n\n`;
  }

  if (data.notes && data.notes.trim()) {
    summary += `Observações Adicionais:\n${data.notes.trim()}\n\n`;
  }

  summary += `Canal de Retorno Escolhido: ${contactPref}${callPeriod}`;

  return summary;
}

// ============================================================================
// RESEND EMAIL NOTIFICATION DISPATCHER
// ============================================================================

async function sendResendNotification(payload: {
  leadId: string;
  leadType: 'business' | 'self_employed';
  contactName: string;
  entityName: string;
  segmentOrProfession: string;
  servicesInterest: string[];
  currentSituation: string[];
  objectives: string[];
  websiteOrInstagram?: string;
  notes?: string;
  preferredContact: string;
  phone?: string;
  email?: string;
  preferredCallPeriod?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingUrl?: string;
}) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    console.warn('[submit-lead] RESEND_API_KEY not configured. Skipping email dispatch.');
    return;
  }

  const primaryInterest = SERVICE_LABELS[payload.servicesInterest[0]] || 'Novo Briefing';
  const subject = `Novo lead Melière — ${payload.entityName} — ${primaryInterest}`;

  const servicesHtml = payload.servicesInterest
    .map((s) => `<li style="margin-bottom: 4px;"><strong>${SERVICE_LABELS[s] || s}</strong></li>`)
    .join('');

  const situationsHtml = payload.currentSituation
    .map((s) => `<li style="margin-bottom: 4px;">${SITUATION_LABELS[s] || s}</li>`)
    .join('');

  const objectivesHtml = payload.objectives
    .map((o) => `<li style="margin-bottom: 4px;">${OBJECTIVE_LABELS[o] || o}</li>`)
    .join('');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d0d0d; color: #f4f4f4; margin: 0; padding: 24px; }
    .card { background-color: #161616; border: 1px solid #2a2a2a; border-radius: 8px; max-width: 640px; margin: 0 auto; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    .header { border-bottom: 1px solid #262626; padding-bottom: 16px; margin-bottom: 24px; }
    .badge { display: inline-block; background-color: #F15A3C; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 8px; border-radius: 4px; margin-bottom: 8px; }
    .title { font-size: 22px; font-weight: 700; margin: 0 0 6px 0; color: #ffffff; }
    .subtitle { font-size: 14px; color: #a0a0a0; margin: 0; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #F15A3C; margin-bottom: 10px; }
    .info-grid { width: 100%; border-collapse: collapse; }
    .info-grid td { padding: 6px 0; font-size: 14px; vertical-align: top; }
    .info-label { width: 140px; color: #888888; font-weight: 500; }
    .info-value { color: #ffffff; }
    ul { margin: 4px 0 0 16px; padding: 0; font-size: 14px; color: #e0e0e0; }
    .highlight-box { background-color: #1f1f1f; border-left: 3px solid #F15A3C; padding: 12px 16px; border-radius: 0 4px 4px 0; margin-top: 8px; font-size: 14px; color: #e5e5e5; }
    .utm-pill { font-family: monospace; font-size: 12px; background-color: #222222; padding: 2px 6px; border-radius: 4px; color: #ff8c73; }
    .footer { border-top: 1px solid #262626; padding-top: 16px; font-size: 12px; color: #666666; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">Novo Briefing Recebido</span>
      <h1 class="title">${payload.entityName}</h1>
      <p class="subtitle">Recebido via site Melière • ID: <span style="font-family: monospace;">${payload.leadId}</span></p>
    </div>

    <!-- IDENTIFICAÇÃO -->
    <div class="section">
      <div class="section-title">1. Identificação do Lead</div>
      <table class="info-grid">
        <tr><td class="info-label">Tipo:</td><td class="info-value"><strong>${payload.leadType === 'business' ? 'Empresa' : 'Profissional Autônomo'}</strong></td></tr>
        <tr><td class="info-label">Nome Contato:</td><td class="info-value">${payload.contactName}</td></tr>
        <tr><td class="info-label">Segmento:</td><td class="info-value">${payload.segmentOrProfession}</td></tr>
        ${payload.websiteOrInstagram ? `<tr><td class="info-label">Presença Digital:</td><td class="info-value"><a href="${payload.websiteOrInstagram.startsWith('http') ? payload.websiteOrInstagram : 'https://instagram.com/' + payload.websiteOrInstagram.replace('@', '')}" style="color: #F15A3C; text-decoration: none;">${payload.websiteOrInstagram}</a></td></tr>` : ''}
      </table>
    </div>

    <!-- CONTATO -->
    <div class="section">
      <div class="section-title">2. Canal de Retorno Preferencial</div>
      <table class="info-grid">
        <tr><td class="info-label">Preferência:</td><td class="info-value"><strong style="color: #F15A3C;">${CONTACT_METHOD_LABELS[payload.preferredContact] || payload.preferredContact}</strong></td></tr>
        ${payload.phone ? `<tr><td class="info-label">WhatsApp/Tel:</td><td class="info-value"><a href="https://wa.me/55${payload.phone.replace(/\D/g, '')}" style="color: #F15A3C; text-decoration: none; font-weight: bold;">${payload.phone}</a></td></tr>` : ''}
        ${payload.email ? `<tr><td class="info-label">E-mail:</td><td class="info-value"><a href="mailto:${payload.email}" style="color: #F15A3C; text-decoration: none;">${payload.email}</a></td></tr>` : ''}
        ${payload.preferredCallPeriod ? `<tr><td class="info-label">Período Ligação:</td><td class="info-value">${CALL_PERIOD_LABELS[payload.preferredCallPeriod] || payload.preferredCallPeriod}</td></tr>` : ''}
      </table>
    </div>

    <!-- DIAGNÓSTICO -->
    <div class="section">
      <div class="section-title">3. Diagnóstico e Interesses</div>
      <p style="font-size: 13px; color: #888888; margin: 4px 0 6px 0;">Serviços Selecionados:</p>
      <ul>${servicesHtml}</ul>

      <p style="font-size: 13px; color: #888888; margin: 12px 0 6px 0;">Momento Atual:</p>
      <ul>${situationsHtml}</ul>

      <p style="font-size: 13px; color: #888888; margin: 12px 0 6px 0;">Objetivos do Negócio:</p>
      <ul>${objectivesHtml}</ul>
    </div>

    ${payload.notes ? `
    <div class="section">
      <div class="section-title">4. Observações do Cliente</div>
      <div class="highlight-box">${payload.notes}</div>
    </div>
    ` : ''}

    <!-- ATRIBUIÇÃO & ORIGEM -->
    <div class="section">
      <div class="section-title">5. Atribuição & Rastreamento</div>
      <table class="info-grid">
        <tr><td class="info-label">Canal Inferido:</td><td class="info-value"><span class="utm-pill">${payload.source}</span></td></tr>
        ${payload.utmSource ? `<tr><td class="info-label">UTM Source:</td><td class="info-value"><span class="utm-pill">${payload.utmSource}</span></td></tr>` : ''}
        ${payload.utmMedium ? `<tr><td class="info-label">UTM Medium:</td><td class="info-value"><span class="utm-pill">${payload.utmMedium}</span></td></tr>` : ''}
        ${payload.utmCampaign ? `<tr><td class="info-label">Campanha:</td><td class="info-value"><span class="utm-pill">${payload.utmCampaign}</span></td></tr>` : ''}
        ${payload.utmContent ? `<tr><td class="info-label">Criativo/Conteúdo:</td><td class="info-value"><span class="utm-pill">${payload.utmContent}</span></td></tr>` : ''}
        ${payload.referrer ? `<tr><td class="info-label">Referrer:</td><td class="info-value" style="font-size: 12px; color: #a0a0a0;">${payload.referrer}</td></tr>` : ''}
      </table>
    </div>

    <div class="footer">
      Melière Marketing • CRM & Briefing Automation
    </div>
  </div>
</body>
</html>
  `;

  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Melière Briefing <onboarding@resend.dev>';
  const toEmailEnv = Deno.env.get('RESEND_TO_EMAIL');
  const recipients = toEmailEnv ? [toEmailEnv] : ['agenciameliere@gmail.com'];

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[submit-lead] Resend dispatch failed:', res.status, errBody);
    } else {
      const resData = await res.json().catch(() => ({}));
      console.log('[submit-lead] Resend notification sent successfully. Message ID:', resData?.id);
    }
  } catch (err) {
    console.error('[submit-lead] Resend network error:', err);
  }
}

// ============================================================================
// MAIN HTTP HANDLER
// ============================================================================

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const rawBody = await req.json().catch(() => null);

    if (!rawBody || typeof rawBody !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Payload JSON inválido.' }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // ========================================================================
    // A. LEGACY PAYLOAD DETECTOR & ADAPTER
    // (Preserves compatibility with old direct calls)
    // ========================================================================
    const isLegacy = !rawBody.lead_type && (rawBody.service || rawBody.business_stage);

    let parsedPayload: {
      lead_type: 'business' | 'self_employed';
      contact_name: string;
      business_name?: string;
      professional_name?: string;
      segment_or_profession: string;
      services_interest: string[];
      current_situation: string[];
      objectives: string[];
      website_or_instagram?: string;
      notes?: string;
      preferred_contact: 'whatsapp' | 'phone' | 'email';
      phone?: string;
      email?: string;
      preferred_call_period?: 'morning' | 'afternoon';
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string;
      utm_term?: string;
      referrer?: string;
      landing_url?: string;
    };

    if (isLegacy) {
      // Map legacy service to canonical service
      let canonicalService: CanonicalService = 'not_sure';
      if (rawBody.service === 'social_media') canonicalService = 'social_media';
      else if (rawBody.service === 'paid_traffic') canonicalService = 'paid_traffic';
      else if (rawBody.service === 'website') canonicalService = 'website_portfolio';
      else if (rawBody.service === 'branding') canonicalService = 'branding_positioning';

      // Map legacy stage to canonical situation
      let canonicalSituation: CanonicalSituation = 'in_house';
      if (rawBody.business_stage === 'starting') canonicalSituation = 'not_started';
      else if (rawBody.business_stage === 'needs_structure') canonicalSituation = 'in_house';
      else if (rawBody.business_stage === 'has_presence') canonicalSituation = 'active_agency_or_freelancer';
      else if (rawBody.business_stage === 'professionalizing') canonicalSituation = 'wants_improvement';

      // Adapt legacy structure
      parsedPayload = {
        lead_type: 'business',
        contact_name: (rawBody.name || '').trim(),
        business_name: (rawBody.business_name || '').trim(),
        segment_or_profession: 'Não especificado (legado)',
        services_interest: [canonicalService],
        current_situation: [canonicalSituation],
        objectives: ['attract_clients'],
        notes: rawBody.message || undefined,
        preferred_contact: rawBody.preferred_contact === 'email' ? 'email' : 'whatsapp',
        phone: rawBody.whatsapp || undefined,
        email: rawBody.email || undefined,
        utm_source: rawBody.utm_source,
        utm_medium: rawBody.utm_medium,
        utm_campaign: rawBody.utm_campaign,
      };
    } else {
      // Standard new briefing contract
      parsedPayload = {
        lead_type: rawBody.lead_type,
        contact_name: typeof rawBody.contact_name === 'string' ? rawBody.contact_name.trim() : (typeof rawBody.name === 'string' ? rawBody.name.trim() : ''),
        business_name: typeof rawBody.business_name === 'string' ? rawBody.business_name.trim() : undefined,
        professional_name: typeof rawBody.professional_name === 'string' ? rawBody.professional_name.trim() : undefined,
        segment_or_profession: typeof rawBody.segment_or_profession === 'string' ? rawBody.segment_or_profession.trim() : '',
        services_interest: Array.isArray(rawBody.services_interest) ? rawBody.services_interest : [],
        current_situation: Array.isArray(rawBody.current_situation) ? rawBody.current_situation : [],
        objectives: Array.isArray(rawBody.objectives) ? rawBody.objectives : [],
        website_or_instagram: typeof rawBody.website_or_instagram === 'string' ? rawBody.website_or_instagram.trim() : undefined,
        notes: typeof rawBody.notes === 'string' ? rawBody.notes.trim() : undefined,
        preferred_contact: rawBody.preferred_contact,
        phone: typeof rawBody.phone === 'string' ? rawBody.phone.trim() : (typeof rawBody.whatsapp === 'string' ? rawBody.whatsapp.trim() : undefined),
        email: typeof rawBody.email === 'string' ? rawBody.email.trim() : undefined,
        preferred_call_period: rawBody.preferred_call_period,
        utm_source: typeof rawBody.utm_source === 'string' ? rawBody.utm_source.trim() : undefined,
        utm_medium: typeof rawBody.utm_medium === 'string' ? rawBody.utm_medium.trim() : undefined,
        utm_campaign: typeof rawBody.utm_campaign === 'string' ? rawBody.utm_campaign.trim() : undefined,
        utm_content: typeof rawBody.utm_content === 'string' ? rawBody.utm_content.trim() : undefined,
        utm_term: typeof rawBody.utm_term === 'string' ? rawBody.utm_term.trim() : undefined,
        referrer: typeof rawBody.referrer === 'string' ? rawBody.referrer.trim() : undefined,
        landing_url: typeof rawBody.landing_url === 'string' ? rawBody.landing_url.trim() : undefined,
      };
    }

    // ========================================================================
    // B. RIGID VALIDATION OF NEW CONTRACT
    // ========================================================================

    // 1. lead_type validation
    if (parsedPayload.lead_type !== 'business' && parsedPayload.lead_type !== 'self_employed') {
      return new Response(
        JSON.stringify({ success: false, error: 'O tipo de perfil (lead_type) é obrigatório e deve ser "business" ou "self_employed".' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // 2. contact_name validation
    if (!parsedPayload.contact_name) {
      return new Response(
        JSON.stringify({ success: false, error: 'O nome do contato é obrigatório.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // 3. business_name validation (if lead_type === 'business')
    if (parsedPayload.lead_type === 'business' && !parsedPayload.business_name) {
      return new Response(
        JSON.stringify({ success: false, error: 'O nome da empresa é obrigatório para o perfil empresarial.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // 4. segment_or_profession validation
    if (!parsedPayload.segment_or_profession) {
      return new Response(
        JSON.stringify({ success: false, error: 'O segmento de atuação ou profissão é obrigatório.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // 5. services_interest validation
    if (!parsedPayload.services_interest || parsedPayload.services_interest.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Selecione pelo menos um serviço ou necessidade de interesse.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
    const invalidService = parsedPayload.services_interest.find((s) => !CANONICAL_SERVICES.includes(s as CanonicalService));
    if (invalidService) {
      return new Response(
        JSON.stringify({ success: false, error: `Serviço com valor inválido: "${invalidService}".` }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // 6. current_situation validation
    if (!parsedPayload.current_situation || parsedPayload.current_situation.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Selecione pelo menos uma opção sobre a situação atual.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
    const invalidSituation = parsedPayload.current_situation.find((s) => !CANONICAL_SITUATIONS.includes(s as CanonicalSituation));
    if (invalidSituation) {
      return new Response(
        JSON.stringify({ success: false, error: `Situação atual com valor inválido: "${invalidSituation}".` }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // 7. objectives validation
    if (!parsedPayload.objectives || parsedPayload.objectives.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Selecione pelo menos um objetivo principal.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
    const invalidObjective = parsedPayload.objectives.find((o) => !CANONICAL_OBJECTIVES.includes(o as CanonicalObjective));
    if (invalidObjective) {
      return new Response(
        JSON.stringify({ success: false, error: `Objetivo com valor inválido: "${invalidObjective}".` }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // 8. preferred_contact validation & associated channels
    if (!['whatsapp', 'phone', 'email'].includes(parsedPayload.preferred_contact)) {
      return new Response(
        JSON.stringify({ success: false, error: 'O canal de retorno preferencial é obrigatório (whatsapp, phone ou email).' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    if (parsedPayload.preferred_contact === 'whatsapp') {
      if (!parsedPayload.phone || parsedPayload.phone.replace(/\D/g, '').length < 8) {
        return new Response(
          JSON.stringify({ success: false, error: 'Por favor, informe um número de WhatsApp válido com DDD.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
    } else if (parsedPayload.preferred_contact === 'phone') {
      if (!parsedPayload.phone || parsedPayload.phone.replace(/\D/g, '').length < 8) {
        return new Response(
          JSON.stringify({ success: false, error: 'Por favor, informe um número de telefone válido para ligação.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
      if (!parsedPayload.preferred_call_period || !['morning', 'afternoon'].includes(parsedPayload.preferred_call_period)) {
        return new Response(
          JSON.stringify({ success: false, error: 'Para retorno por ligação, selecione o período preferencial (morning ou afternoon).' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
    } else if (parsedPayload.preferred_contact === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!parsedPayload.email || !emailRegex.test(parsedPayload.email)) {
        return new Response(
          JSON.stringify({ success: false, error: 'Por favor, informe um endereço de e-mail corporativo ou profissional válido.' }),
          { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ========================================================================
    // C. DATA NORMALIZATION & BRIDGES FOR PERSISTENCE
    // ========================================================================

    const inferredSource = inferLeadSource({
      utm_source: parsedPayload.utm_source,
      utm_medium: parsedPayload.utm_medium,
      referrer: parsedPayload.referrer,
    });

    const legacyService = mapLegacyService(parsedPayload.services_interest);
    const legacyBusinessStage = mapLegacyBusinessStage(parsedPayload.current_situation);
    const legacyMessage = generateExecutiveMessage({
      lead_type: parsedPayload.lead_type,
      business_name: parsedPayload.business_name,
      professional_name: parsedPayload.professional_name,
      contact_name: parsedPayload.contact_name,
      segment_or_profession: parsedPayload.segment_or_profession,
      services_interest: parsedPayload.services_interest,
      current_situation: parsedPayload.current_situation,
      objectives: parsedPayload.objectives,
      website_or_instagram: parsedPayload.website_or_instagram,
      notes: parsedPayload.notes,
      preferred_contact: parsedPayload.preferred_contact,
      preferred_call_period: parsedPayload.preferred_call_period,
    });

    // Business Name resolution (for autônomos, fallback to professional_name or contact_name)
    const finalBusinessName = parsedPayload.lead_type === 'business'
      ? parsedPayload.business_name || parsedPayload.contact_name
      : (parsedPayload.professional_name || parsedPayload.contact_name);

    // ========================================================================
    // D. SUPABASE DATABASE INSERTION (SERVICE ROLE)
    // ========================================================================

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[submit-lead] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
      return new Response(
        JSON.stringify({ success: false, error: 'Erro de configuração do servidor de banco de dados.' }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const leadRecord = {
      // Legacy columns
      name: parsedPayload.contact_name,
      business_name: finalBusinessName,
      whatsapp: parsedPayload.phone || null,
      email: parsedPayload.email || null,
      service: legacyService,
      business_stage: legacyBusinessStage,
      message: legacyMessage,
      preferred_contact: parsedPayload.preferred_contact,
      source: inferredSource,

      // New columns (Phase B2B)
      lead_type: parsedPayload.lead_type,
      segment_or_profession: parsedPayload.segment_or_profession,
      website_or_instagram: parsedPayload.website_or_instagram || null,
      notes: parsedPayload.notes || null,
      services_interest: parsedPayload.services_interest,
      current_situation: parsedPayload.current_situation,
      objectives: parsedPayload.objectives,
      preferred_call_period: parsedPayload.preferred_call_period || null,
      utm_source: parsedPayload.utm_source || null,
      utm_medium: parsedPayload.utm_medium || null,
      utm_campaign: parsedPayload.utm_campaign || null,
      utm_content: parsedPayload.utm_content || null,
      utm_term: parsedPayload.utm_term || null,
      referrer: parsedPayload.referrer || null,
      landing_url: parsedPayload.landing_url || null,
    };

    const { data: insertedLead, error: insertError } = await supabase
      .from('leads')
      .insert([leadRecord])
      .select('id')
      .single();

    if (insertError) {
      console.error('[submit-lead] Database insert error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Não foi possível salvar os dados do briefing no momento.' }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const leadId = insertedLead.id;

    // ========================================================================
    // E. ASYNC NOTIFICATION DISPATCH (RESEND)
    // ========================================================================

    // Fire and forget or await without blocking success response on failure
    try {
      await sendResendNotification({
        leadId: leadId,
        leadType: parsedPayload.lead_type,
        contactName: parsedPayload.contact_name,
        entityName: finalBusinessName,
        segmentOrProfession: parsedPayload.segment_or_profession,
        servicesInterest: parsedPayload.services_interest,
        currentSituation: parsedPayload.current_situation,
        objectives: parsedPayload.objectives,
        websiteOrInstagram: parsedPayload.website_or_instagram,
        notes: parsedPayload.notes,
        preferredContact: parsedPayload.preferred_contact,
        phone: parsedPayload.phone,
        email: parsedPayload.email,
        preferredCallPeriod: parsedPayload.preferred_call_period,
        source: inferredSource,
        utmSource: parsedPayload.utm_source,
        utmMedium: parsedPayload.utm_medium,
        utmCampaign: parsedPayload.utm_campaign,
        utmContent: parsedPayload.utm_content,
        utmTerm: parsedPayload.utm_term,
        referrer: parsedPayload.referrer,
        landingUrl: parsedPayload.landing_url,
      });
    } catch (resendErr) {
      console.error('[submit-lead] Background email notification error:', resendErr);
    }

    // ========================================================================
    // F. CLEAN SUCCESS RESPONSE
    // ========================================================================

    return new Response(
      JSON.stringify({
        success: true,
        lead_id: leadId,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[submit-lead] Unhandled server error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Ocorreu um erro interno ao processar sua solicitação.' }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});
