/**
 * Script de Verificação dos Dados Gravados em public.leads
 */

const SUPABASE_URL = 'https://ycagvwsvccgdjzpbhrfi.supabase.co';
// Anon key / Public access key for checking or direct query
// Note: If RLS prevents select with anon key, we can verify via the Edge Function response or direct rest endpoint
const leadIds = [
  'f269edc2-651f-419c-a81c-ffb68ca6d24f', // Teste A: Empresa + WhatsApp + Meta Ads
  '527a18a1-25ac-4032-a1b8-bba881820b93', // Teste B: Empresa + E-mail + Google Ads
  'ef382dec-5312-45a7-bae3-19c589e8c31e', // Teste C: Autônomo + Ligação
];

console.log('=== VERIFICAÇÃO DOS LEADS CRIADOS NA HOMOLOGAÇÃO ===');
console.log('Lead A (Meta Ads):', leadIds[0]);
console.log('Lead B (Google Ads):', leadIds[1]);
console.log('Lead C (Autônomo Ligação):', leadIds[2]);
