/**
 * Edge Function submit-lead Unit & Scenario Tests (Fase B2C.1)
 * Validates deterministic source inference, combinations, legacy bridges, and executive messages.
 */

import {
  inferLeadSource,
  mapLegacyService,
  mapLegacyBusinessStage,
  generateExecutiveMessage,
  CANONICAL_SERVICES,
  CANONICAL_SITUATIONS,
  CANONICAL_OBJECTIVES,
} from './lib/briefingContracts';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- Iniciando Testes Unitários de Atribuição e Contratos (Fase B2C.1) ---');

// 1. Specific Source Combinations Verification
{
  // Test: google + cpc -> google_ads
  const res1 = inferLeadSource({ utm_source: 'google', utm_medium: 'cpc' });
  assert(res1 === 'google_ads', `google + cpc deve retornar google_ads, retornou ${res1}`);

  // Test: google + paid -> google_ads
  const res1b = inferLeadSource({ utm_source: 'google', utm_medium: 'paid' });
  assert(res1b === 'google_ads', `google + paid deve retornar google_ads, retornou ${res1b}`);

  // Test: adwords + ppc -> google_ads
  const res1c = inferLeadSource({ utm_source: 'adwords', utm_medium: 'ppc' });
  assert(res1c === 'google_ads', `adwords + ppc deve retornar google_ads, retornou ${res1c}`);

  // Test: facebook + cpc -> meta_ads
  const res2 = inferLeadSource({ utm_source: 'facebook', utm_medium: 'cpc' });
  assert(res2 === 'meta_ads', `facebook + cpc deve retornar meta_ads, retornou ${res2}`);

  // Test: instagram + paid_social -> meta_ads
  const res3 = inferLeadSource({ utm_source: 'instagram', utm_medium: 'paid_social' });
  assert(res3 === 'meta_ads', `instagram + paid_social deve retornar meta_ads, retornou ${res3}`);

  // Test: instagram + organic/social -> instagram
  const res4 = inferLeadSource({ utm_source: 'instagram', utm_medium: 'social' });
  assert(res4 === 'instagram', `instagram + social deve retornar instagram, retornou ${res4}`);

  const res4b = inferLeadSource({ utm_source: 'instagram', utm_medium: 'organic' });
  assert(res4b === 'instagram', `instagram + organic deve retornar instagram, retornou ${res4b}`);

  // Test: instagram referrer sem UTMs -> instagram
  const res4c = inferLeadSource({ referrer: 'https://l.instagram.com/' });
  assert(res4c === 'instagram', `referrer instagram.com sem UTM deve retornar instagram, retornou ${res4c}`);

  // Test: sem UTM -> website
  const res5 = inferLeadSource({});
  assert(res5 === 'website', `Sem UTM deve retornar website, retornou ${res5}`);

  // Test: referral -> referral
  const res6 = inferLeadSource({ utm_medium: 'referral' });
  assert(res6 === 'referral', `utm_medium referral deve retornar referral, retornou ${res6}`);

  // Test: Explicit meta_ads source
  const res7 = inferLeadSource({ utm_source: 'meta_ads' });
  assert(res7 === 'meta_ads', `utm_source meta_ads deve retornar meta_ads, retornou ${res7}`);

  console.log('✓ Todos os testes de combinação de atribuição (source) foram aprovados!');
}

// 2. Scenario 1: Empresa + WhatsApp + Meta Ads
{
  const payload = {
    lead_type: 'business' as const,
    contact_name: 'Dr. Roberto Mendes',
    business_name: 'TESTE B2C - META',
    segment_or_profession: 'Odontologia e Estética Facial',
    services_interest: ['paid_traffic', 'website_portfolio'],
    current_situation: ['in_house', 'wants_improvement'],
    objectives: ['attract_clients', 'increase_conversion'],
    website_or_instagram: '@clinicamendes',
    notes: 'Teste de homologação B2C - Meta Ads.',
    preferred_contact: 'whatsapp' as const,
    phone: '(41) 99888-7766',
    utm_source: 'facebook',
    utm_medium: 'cpc',
    utm_campaign: 'implantes_julho',
    utm_content: 'video_dr_roberto_01',
  };

  const source = inferLeadSource({
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
  });
  assert(source === 'meta_ads', 'Empresa + Facebook + CPC deve inferir meta_ads');

  const legacyService = mapLegacyService(payload.services_interest);
  assert(legacyService === 'paid_traffic', 'Primeiro serviço deve ser mapped para paid_traffic');

  const legacyStage = mapLegacyBusinessStage(payload.current_situation);
  assert(legacyStage === 'professionalizing', 'Situação com wants_improvement deve mapear para professionalizing');

  const msg = generateExecutiveMessage(payload);
  assert(msg.includes('Empresa: TESTE B2C - META'), 'Mensagem executiva deve conter a empresa');
  console.log('✓ Cenário A (Empresa + WhatsApp + Meta Ads) aprovado.');
}

// 3. Scenario 2: Empresa + E-mail + Google Ads
{
  const payload = {
    lead_type: 'business' as const,
    contact_name: 'Fernanda Lima',
    business_name: 'TESTE B2C - GOOGLE',
    segment_or_profession: 'Logística B2B',
    services_interest: ['branding_positioning', 'website_portfolio'],
    current_situation: ['active_agency_or_freelancer'],
    objectives: ['brand_perception', 'organize_communication'],
    preferred_contact: 'email' as const,
    email: 'fernanda@techlog.com.br',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'b2b_logistica',
  };

  const source = inferLeadSource({
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
  });
  assert(source === 'google_ads', 'UTM google + cpc deve inferir google_ads');

  const legacyService = mapLegacyService(payload.services_interest);
  assert(legacyService === 'branding', 'branding_positioning deve mapear para branding legado');

  const legacyStage = mapLegacyBusinessStage(payload.current_situation);
  assert(legacyStage === 'has_presence', 'active_agency_or_freelancer deve mapear para has_presence');

  const msg = generateExecutiveMessage(payload);
  assert(msg.includes('E-mail'), 'Mensagem executiva deve indicar retorno por e-mail');
  console.log('✓ Cenário B (Empresa + E-mail + Google Ads) aprovado.');
}

// 4. Scenario 3: Autônomo + Ligação
{
  const payload = {
    lead_type: 'self_employed' as const,
    contact_name: 'Lucas Nogueira',
    professional_name: 'TESTE B2C - AUTONOMO',
    segment_or_profession: 'Arquiteto de Interiores',
    services_interest: ['full_strategy'],
    current_situation: ['in_house'],
    objectives: ['repositioning', 'increase_conversion'],
    preferred_contact: 'phone' as const,
    phone: '(11) 99123-4567',
    preferred_call_period: 'afternoon' as const,
  };

  const legacyService = mapLegacyService(payload.services_interest);
  assert(legacyService === 'not_sure', 'full_strategy deve mapear para not_sure no Office legado');

  const legacyStage = mapLegacyBusinessStage(payload.current_situation);
  assert(legacyStage === 'needs_structure', 'in_house deve mapear para needs_structure');

  const msg = generateExecutiveMessage(payload);
  assert(msg.includes('Ligação Telefônica (Tarde (14h às 18h))'), 'Mensagem executiva deve conter horário da ligação');
  console.log('✓ Cenário C (Autônomo + Ligação) aprovado.');
}

// 5. Scenario 4: Dictionaries Integrity
{
  assert(CANONICAL_SERVICES.length === 6, 'Deve haver 6 serviços canônicos');
  assert(CANONICAL_SITUATIONS.length === 6, 'Deve haver 6 situações canônicas');
  assert(CANONICAL_OBJECTIVES.length === 7, 'Deve haver 7 objetivos canônicos');
  console.log('✓ Dicionários canônicos íntegros.');
}

console.log('--- TODOS OS TESTES UNITÁRIOS DA FASE B2C.1 FORAM EXECUTADOS E APROVADOS COM SUCESSO! ---');
