/**
 * Homologação Final Remota da Fase B2C
 */

const FUNCTION_URL = 'https://ycagvwsvccgdjzpbhrfi.supabase.co/functions/v1/submit-lead';

async function runFinalHomologation() {
  console.log('=== INICIANDO HOMOLOGAÇÃO FINAL REMOTA B2C ===\n');

  // 1. Teste Legado
  console.log('>>> [1/2] Testando Payload Legado (starting -> not_started)...');
  const legacyPayload = {
    name: 'TESTE B2C3 - LEGADO',
    business_name: 'Clínica Legada Teste B2C3',
    whatsapp: '41999998888',
    email: 'agenciameliere@gmail.com',
    service: 'social_media',
    business_stage: 'starting',
    message: 'Teste de retrocompatibilidade Fase B2C.3',
  };

  const res1 = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(legacyPayload),
  });

  const status1 = res1.status;
  const data1 = await res1.json().catch(() => null);
  console.log('Status HTTP (Legado):', status1);
  console.log('Body (Legado):', data1);

  // 2. Teste do Novo Contrato
  console.log('\n>>> [2/2] Testando Novo Contrato (Meta Ads)...');
  const newPayload = {
    lead_type: 'business',
    contact_name: 'Dr. Roberto Mendes B2C3',
    business_name: 'TESTE B2C3 - NOVO CONTRATO',
    segment_or_profession: 'Odontologia e Harmonização Facial',
    services_interest: ['paid_traffic', 'website_portfolio'],
    current_situation: ['in_house', 'wants_improvement'],
    objectives: ['attract_clients', 'increase_conversion'],
    website_or_instagram: '@clinicamendes_b2c3',
    notes: 'Homologação final Fase B2C.3 - Novo Contrato.',
    preferred_contact: 'whatsapp',
    phone: '(41) 99888-7766',
    utm_source: 'instagram',
    utm_medium: 'paid_social',
    utm_campaign: 'implantes_b2c3',
    utm_content: 'video_01',
    referrer: 'https://l.instagram.com/',
    landing_url: 'https://melieremarketing.com.br/briefing',
  };

  const res2 = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPayload),
  });

  const status2 = res2.status;
  const data2 = await res2.json().catch(() => null);
  console.log('Status HTTP (Novo Contrato):', status2);
  console.log('Body (Novo Contrato):', data2);

  console.log('\n=== FIM DA HOMOLOGAÇÃO ===');
}

runFinalHomologation().catch(console.error);
