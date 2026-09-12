/**
 * Script de Homologação Real HTTP da Edge Function e Supabase Leads
 */

const FUNCTION_URL = 'https://ycagvwsvccgdjzpbhrfi.supabase.co/functions/v1/submit-lead';

async function runTests() {
  console.log('=== TESTE HTTP REAL NO SUPABASE (Ambiente Remoto) ===\n');

  // Teste 1: Testando com payload novo
  console.log('1. Teste com Payload Novo (Fase B2C/B2C.1):');
  const payloadNovo = {
    lead_type: 'business',
    contact_name: 'Dr. Roberto Mendes',
    business_name: 'TESTE B2C - META',
    segment_or_profession: 'Odontologia',
    services_interest: ['paid_traffic'],
    current_situation: ['in_house'],
    objectives: ['attract_clients'],
    preferred_contact: 'whatsapp',
    phone: '(41) 99888-7766',
  };

  const resNovo = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadNovo),
  });
  console.log('Status HTTP (Payload Novo):', resNovo.status);
  const dataNovo = await resNovo.json().catch(() => null);
  console.log('Body Retornado:', dataNovo);

  // Teste 2: Testando com payload legado
  console.log('\n2. Teste com Payload Legado (antigo):');
  const payloadLegado = {
    name: 'TESTE B2C - LEGADO',
    business_name: 'Clínica Teste Legado',
    whatsapp: '41999998888',
    service: 'social_media',
    business_stage: 'starting',
    preferred_contact: 'whatsapp',
  };

  const resLegado = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadLegado),
  });
  console.log('Status HTTP (Payload Legado):', resLegado.status);
  const dataLegado = await resLegado.json().catch(() => null);
  console.log('Body Retornado:', dataLegado);
}

runTests().catch(console.error);
