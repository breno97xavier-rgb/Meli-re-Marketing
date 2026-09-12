/**
 * Teste B2C.3 - Verificação do estado remoto atual da Edge Function
 */

const FUNCTION_URL = 'https://ycagvwsvccgdjzpbhrfi.supabase.co/functions/v1/submit-lead';

async function testLegacyRemote() {
  console.log('--- TESTANDO PAYLOAD LEGADO CONTRA O ENDPOINT REMOTO ---');
  const payload = {
    name: 'TESTE B2C3 - LEGADO',
    business_name: 'Clínica Legada Teste B2C3',
    whatsapp: '41999998888',
    email: 'agenciameliere@gmail.com',
    service: 'social_media',
    business_stage: 'starting',
    message: 'Teste de retrocompatibilidade Fase B2C.3',
    preferred_contact: 'whatsapp',
  };

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('Status HTTP retornado:', res.status);
  const data = await res.json().catch(() => null);
  console.log('Body retornado:', data);
}

testLegacyRemote().catch(console.error);
