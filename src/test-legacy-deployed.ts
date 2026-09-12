/**
 * Testando envio completo para a função legada deployed no Supabase
 */

const FUNCTION_URL = 'https://ycagvwsvccgdjzpbhrfi.supabase.co/functions/v1/submit-lead';

async function testLegacyDeployed() {
  const payload = {
    name: 'TESTE B2C - AUDITORIA RESEND',
    business_name: 'Agência Melière Teste',
    whatsapp: '41999998888',
    email: 'agenciameliere@gmail.com',
    service: 'social_media',
    business_stage: 'starting',
    preferred_contact: 'whatsapp',
    message: 'Auditoria de homologação e Resend Fase B2C.1',
  };

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('Status HTTP:', res.status);
  const data = await res.json().catch(() => null);
  console.log('Resposta Supabase:', data);
}

testLegacyDeployed().catch(console.error);
