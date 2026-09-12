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
