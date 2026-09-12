/**
 * Script de Homologação Real Remota - Fase B2C.2
 * Executa as 4 requisições contra o endpoint em produção no Supabase.
 */

const FUNCTION_URL = 'https://ycagvwsvccgdjzpbhrfi.supabase.co/functions/v1/submit-lead';

async function runHomologation() {
  console.log('=====================================================');
  console.log('HOMOLOGAÇÃO REMOTA SUPABASE EDGE FUNCTION: submit-lead');
  console.log('Endpoint:', FUNCTION_URL);
  console.log('=====================================================\n');

  const results: Record<string, any> = {};

  // -------------------------------------------------------------------------
  // 1. TESTE A: Empresa + WhatsApp + Meta Ads
  // -------------------------------------------------------------------------
  console.log('>>> [1/4] Executando Teste A: Empresa + WhatsApp + Meta Ads...');
  const payloadA = {
    lead_type: 'business',
    contact_name: 'Dr. Roberto Mendes',
    business_name: 'TESTE B2C2 - META',
    segment_or_profession: 'Odontologia e Estética Facial',
    services_interest: ['paid_traffic', 'website_portfolio', 'social_media'],
    current_situation: ['in_house', 'wants_improvement'],
    objectives: ['attract_clients', 'increase_conversion', 'brand_perception'],
    website_or_instagram: '@clinicamendes',
    notes: 'Homologação B2C.2 - Meta Ads com múltiplos serviços e objetivos.',
    preferred_contact: 'whatsapp',
    phone: '(41) 99888-7766',
    utm_source: 'instagram',
    utm_medium: 'paid_social',
    utm_campaign: 'teste_b2c2',
    utm_content: 'video_01',
    referrer: 'https://l.instagram.com/',
    landing_url: 'https://melieremarketing.com.br/briefing',
  };

  const resA = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadA),
  });
  const statusA = resA.status;
  const jsonA = await resA.json().catch(() => null);
  console.log(`Status HTTP: ${statusA}`);
  console.log('Body:', jsonA);
  results.testeA = { status: statusA, data: jsonA, payload: payloadA };

  // -------------------------------------------------------------------------
  // 2. TESTE B: Empresa + E-mail + Google Ads
  // -------------------------------------------------------------------------
  console.log('\n>>> [2/4] Executando Teste B: Empresa + E-mail + Google Ads...');
  const payloadB = {
    lead_type: 'business',
    contact_name: 'Fernanda Lima',
    business_name: 'TESTE B2C2 - GOOGLE',
    segment_or_profession: 'Logística B2B e Comércio Exterior',
    services_interest: ['branding_positioning', 'website_portfolio'],
    current_situation: ['active_agency_or_freelancer'],
    objectives: ['brand_perception', 'organize_communication'],
    website_or_instagram: 'https://techlog.com.br',
    notes: 'Homologação B2C.2 - Google Ads com retorno exclusivo por e-mail.',
    preferred_contact: 'email',
    email: 'fernanda@techlog.com.br',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'teste_b2c2_google',
    landing_url: 'https://melieremarketing.com.br/briefing',
  };

  const resB = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadB),
  });
  const statusB = resB.status;
  const jsonB = await resB.json().catch(() => null);
  console.log(`Status HTTP: ${statusB}`);
  console.log('Body:', jsonB);
  results.testeB = { status: statusB, data: jsonB, payload: payloadB };

  // -------------------------------------------------------------------------
  // 3. TESTE C: Autônomo + Ligação
  // -------------------------------------------------------------------------
  console.log('\n>>> [3/4] Executando Teste C: Autônomo + Ligação (Sem UTM)...');
  const payloadC = {
    lead_type: 'self_employed',
    contact_name: 'Lucas Nogueira',
    professional_name: 'TESTE B2C2 - AUTONOMO',
    segment_or_profession: 'Arquiteto de Interiores',
    services_interest: ['full_strategy'],
    current_situation: ['in_house'],
    objectives: ['repositioning', 'increase_conversion'],
    notes: 'Homologação B2C.2 - Autônomo com ligação no período da tarde.',
    preferred_contact: 'phone',
    phone: '(11) 99123-4567',
    preferred_call_period: 'afternoon',
    landing_url: 'https://melieremarketing.com.br/briefing',
  };

  const resC = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadC),
  });
  const statusC = resC.status;
  const jsonC = await resC.json().catch(() => null);
  console.log(`Status HTTP: ${statusC}`);
  console.log('Body:', jsonC);
  results.testeC = { status: statusC, data: jsonC, payload: payloadC };

  // -------------------------------------------------------------------------
  // 4. TESTE RETROCOMPATIBILIDADE: Payload Legado
  // -------------------------------------------------------------------------
  console.log('\n>>> [4/4] Executando Teste de Retrocompatibilidade (Payload Legado)...');
  const payloadLegacy = {
    name: 'TESTE B2C2 - RETROCOMPATIBILIDADE',
    business_name: 'Clínica Legada Teste',
    whatsapp: '41999998888',
    email: 'agenciameliere@gmail.com',
    service: 'social_media',
    business_stage: 'starting',
    message: 'Mensagem enviada através da estrutura legada para teste de retrocompatibilidade.',
    preferred_contact: 'whatsapp',
  };

  const resLegacy = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadLegacy),
  });
  const statusLegacy = resLegacy.status;
  const jsonLegacy = await resLegacy.json().catch(() => null);
  console.log(`Status HTTP: ${statusLegacy}`);
  console.log('Body:', jsonLegacy);
  results.testeLegacy = { status: statusLegacy, data: jsonLegacy };

  console.log('\n=====================================================');
  console.log('RESUMO DA HOMOLOGAÇÃO:');
  console.log(JSON.stringify(results, null, 2));
}

runHomologation().catch(console.error);
