/**
 * Briefing Canonical Dictionaries, Types & Compatibility Bridges
 * Shared across Edge Functions and Frontend.
 */

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

export function mapLegacyBusinessStage(situations: string[]): 'starting' | 'needs_structure' | 'has_presence' | 'professionalizing' {
  if (!situations || situations.length === 0) {
    return 'needs_structure';
  }
  if (situations.includes('not_started')) {
    return 'starting';
  }
  if (situations.includes('wants_improvement') || situations.includes('evaluating_options')) {
    return 'professionalizing';
  }
  if (situations.includes('active_agency_or_freelancer') || situations.includes('past_experience')) {
    return 'has_presence';
  }
  if (situations.includes('in_house')) {
    return 'needs_structure';
  }
  return 'needs_structure';
}

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
  const entityTitle = isBusiness
    ? `Empresa: ${data.business_name || 'Não informada'}`
    : `Profissional: ${data.professional_name || data.contact_name}`;
  
  const servicesList = data.services_interest.map((s) => `• ${SERVICE_LABELS[s] || s}`).join('\n');
  const situationList = data.current_situation.map((s) => `• ${SITUATION_LABELS[s] || s}`).join('\n');
  const objectivesList = data.objectives.map((o) => `• ${OBJECTIVE_LABELS[o] || o}`).join('\n');

  const contactPref = CONTACT_METHOD_LABELS[data.preferred_contact] || data.preferred_contact;
  const callPeriod = data.preferred_call_period
    ? ` (${CALL_PERIOD_LABELS[data.preferred_call_period] || data.preferred_call_period})`
    : '';

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

export interface BriefingSubmissionPayload {
  lead_type: 'business' | 'self_employed';
  services_interest: string[];
  current_situation: string[];
  objectives: string[];
  business_name?: string;
  professional_name?: string;
  segment_or_profession: string;
  website_or_instagram?: string;
  notes?: string;
  preferred_contact: 'whatsapp' | 'phone' | 'email';
  contact_name: string;
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
}

export const SUBMIT_LEAD_ENDPOINT = 'https://ycagvwsvccgdjzpbhrfi.supabase.co/functions/v1/submit-lead';

export function mapUiServiceToCanonical(val: string): CanonicalService {
  if (CANONICAL_SERVICES.includes(val as CanonicalService)) {
    return val as CanonicalService;
  }
  const lower = val.toLowerCase();
  if (lower.includes('conteúdo') || lower.includes('redes') || lower.includes('social')) return 'social_media';
  if (lower.includes('tráfego') || lower.includes('aquisição') || lower.includes('traffic')) return 'paid_traffic';
  if (lower.includes('site') || lower.includes('portfólio') || lower.includes('portfolio') || lower.includes('website')) return 'website_portfolio';
  if (lower.includes('marca') || lower.includes('posicionamento') || lower.includes('branding')) return 'branding_positioning';
  if (lower.includes('completa') || lower.includes('estratégia') || lower.includes('full')) return 'full_strategy';
  return 'not_sure';
}

export function mapUiSituationToCanonical(val: string): CanonicalSituation {
  if (CANONICAL_SITUATIONS.includes(val as CanonicalSituation)) {
    return val as CanonicalSituation;
  }
  const lower = val.toLowerCase();
  if (lower.includes('não') && (lower.includes('estruturado') || lower.includes('comecei') || lower.includes('nada'))) return 'not_started';
  if (lower.includes('internamente') || lower.includes('sozinho') || lower.includes('in_house')) return 'in_house';
  if (lower.includes('agência') || lower.includes('já trabalho com') || lower.includes('já trabalhamos')) {
    if (lower.includes('anteriormente') || lower.includes('passado')) return 'past_experience';
    return 'active_agency_or_freelancer';
  }
  if (lower.includes('anteriormente')) return 'past_experience';
  if (lower.includes('melhorar') || lower.includes('tentamos antes') || lower.includes('tentei antes')) return 'wants_improvement';
  if (lower.includes('avaliando') || lower.includes('possibilidades')) return 'evaluating_options';
  return 'not_started';
}

export function mapUiObjectiveToCanonical(val: string): CanonicalObjective {
  if (CANONICAL_OBJECTIVES.includes(val as CanonicalObjective)) {
    return val as CanonicalObjective;
  }
  const lower = val.toLowerCase();
  if (lower.includes('atrair') || lower.includes('clientes')) return 'attract_clients';
  if (lower.includes('percepção') || lower.includes('autoridade') || lower.includes('profissionalismo')) return 'brand_perception';
  if (lower.includes('organizar') || lower.includes('comunicação')) return 'organize_communication';
  if (lower.includes('conversão') || lower.includes('vendas')) return 'increase_conversion';
  if (lower.includes('posicionar') || lower.includes('trabalho') || lower.includes('reposicionamento')) return 'repositioning';
  if (lower.includes('lançar') || lower.includes('reformular') || lower.includes('rebrand')) return 'launch_or_rebrand';
  return 'other';
}

export function mapBriefingStateToPayload(state: {
  leadType: 'business' | 'self_employed' | null;
  servicesInterest: string[];
  currentSituation: string[];
  objectives: string[];
  otherObjective?: string;
  businessName?: string;
  professionalName?: string;
  segmentOrProfession: string;
  websiteOrInstagram?: string;
  notes?: string;
  preferredContact: 'whatsapp' | 'phone' | 'email' | null;
  contactName: string;
  phone?: string;
  email?: string;
  preferredCallPeriod?: 'morning' | 'afternoon';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}): BriefingSubmissionPayload {
  const canonicalServices = state.servicesInterest.map(mapUiServiceToCanonical);
  const canonicalSituations = state.currentSituation.map(mapUiSituationToCanonical);
  const canonicalObjectives = state.objectives.map(mapUiObjectiveToCanonical);

  let combinedNotes = (state.notes || '').trim();
  if (state.objectives.includes('Outro') && state.otherObjective && state.otherObjective.trim()) {
    const customObjNote = `[Objetivo específico]: ${state.otherObjective.trim()}`;
    combinedNotes = combinedNotes ? `${combinedNotes}\n\n${customObjNote}` : customObjNote;
  }

  const payload: BriefingSubmissionPayload = {
    lead_type: state.leadType || 'business',
    services_interest: canonicalServices,
    current_situation: canonicalSituations,
    objectives: canonicalObjectives,
    business_name: state.leadType === 'business' ? (state.businessName || '').trim() || undefined : undefined,
    professional_name: state.leadType === 'self_employed' ? (state.professionalName || '').trim() || undefined : undefined,
    segment_or_profession: (state.segmentOrProfession || '').trim(),
    website_or_instagram: (state.websiteOrInstagram || '').trim() || undefined,
    notes: combinedNotes || undefined,
    preferred_contact: state.preferredContact || 'whatsapp',
    contact_name: (state.contactName || '').trim(),
    phone: (state.phone || '').trim() || undefined,
    email: (state.email || '').trim() || undefined,
    preferred_call_period: state.preferredContact === 'phone' ? state.preferredCallPeriod : undefined,
    utm_source: state.utm_source || undefined,
    utm_medium: state.utm_medium || undefined,
    utm_campaign: state.utm_campaign || undefined,
    utm_content: state.utm_content || undefined,
    utm_term: state.utm_term || undefined,
    referrer: state.referrer || (typeof document !== 'undefined' && document.referrer ? document.referrer : undefined),
    landing_url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  return payload;
}

export async function submitBriefingLead(payload: BriefingSubmissionPayload): Promise<{
  success: boolean;
  lead_id?: string;
  error?: string;
}> {
  try {
    const res = await fetch(SUBMIT_LEAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage =
        (data && typeof data.error === 'string' && data.error) ||
        'Não foi possível concluir o envio no momento. Suas respostas foram salvas.';
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (data && data.success && data.lead_id) {
      return {
        success: true,
        lead_id: data.lead_id,
      };
    }

    return {
      success: true,
      lead_id: data?.lead_id || undefined,
    };
  } catch (networkError) {
    console.error('[submitBriefingLead] Network error:', networkError);
    return {
      success: false,
      error: 'Não conseguimos enviar agora. Suas respostas foram preservadas. Tente novamente em alguns instantes.',
    };
  }
}
