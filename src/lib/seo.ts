export const agencyOrigin = 'https://agencia.melieremarketing.com.br';
export const hubOrigin = 'https://melieremarketing.com.br';
export const seoPages = {
  '/': { title: 'Agência de Marketing em Curitiba | Melière Marketing', description: 'Agência de marketing e comunicação em Curitiba. Gestão de redes sociais, identidade visual e branding, tráfego pago no Instagram e Facebook e criação de sites.' },
  '/social-media': { title: 'Gestão de Redes Sociais em Curitiba | Melière Marketing', description: 'Social media em Curitiba: estratégia, planejamento editorial, design, copywriting e gerenciamento de redes sociais. Conheça trabalhos reais da Melière.' },
  '/identidade-visual': { title: 'Identidade Visual e Branding em Curitiba | Melière Marketing', description: 'Criação de identidade visual e branding em Curitiba: posicionamento, logotipo, cores, tipografia e aplicações. Veja projetos da Melière Marketing.' },
  '/trafego-pago': { title: 'Gestão de Tráfego Pago em Curitiba | Melière Marketing', description: 'Gestão de anúncios no Instagram e Facebook em Curitiba. Planejamento, criação de anúncios, definição de públicos e otimização de campanhas com a Melière.' },
  '/sites': { title: 'Criação de Sites em Curitiba | Melière Marketing', description: 'Criação de sites institucionais, landing pages e portfólios em Curitiba, com versões para computador e celular. Conheça projetos da Melière Marketing.' },
  '/briefing': { title: 'Briefing e Orçamento | Melière Marketing', description: 'Conte sobre seu projeto e solicite um orçamento de marketing, redes sociais, identidade visual, anúncios ou sites à Melière Marketing, em Curitiba.' },
  '/politica-de-privacidade': { title: 'Política de Privacidade | Melière Marketing', description: 'Saiba como a Melière Marketing utiliza e protege os dados fornecidos nos formulários e canais de contato.' },
} as const;
export type SeoPath = keyof typeof seoPages;
export const hubSeo = { title: 'Melière Marketing | Contato e Links', description: 'Acesse o site da Melière Marketing, agência de marketing e comunicação em Curitiba, fale pelo WhatsApp ou envie seu briefing.' };
export const organization = {
  '@type': 'Organization', '@id': `${agencyOrigin}/#organization`, name: 'Melière Marketing', alternateName: 'Agência Melière', url: `${agencyOrigin}/`,
  logo: `${agencyOrigin}/meliere-logo-coral.png`, telephone: '+55-41-98840-7253', email: 'agenciameliere@gmail.com',
  areaServed: { '@type': 'City', name: 'Curitiba' }, sameAs: ['https://www.instagram.com/meliere.marketing/'],
};
export function pageSchema(path: SeoPath) {
  const url = `${agencyOrigin}${path === '/' ? '/' : path}`;
  const graph: object[] = [organization, { '@type': 'WebSite', '@id': `${agencyOrigin}/#website`, name: 'Melière Marketing', url: `${agencyOrigin}/`, inLanguage: 'pt-BR', publisher: { '@id': organization['@id'] } },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: seoPages[path].title, description: seoPages[path].description, inLanguage: 'pt-BR', isPartOf: { '@id': `${agencyOrigin}/#website` }, about: { '@id': organization['@id'] } }];
  const services = { '/social-media': 'Gestão de redes sociais', '/identidade-visual': 'Identidade visual e branding', '/trafego-pago': 'Gestão de tráfego pago no Instagram e Facebook', '/sites': 'Criação de sites' };
  if (path in services) graph.push({ '@type': 'Service', name: services[path as keyof typeof services], url, description: seoPages[path].description, provider: { '@id': organization['@id'] }, areaServed: { '@type': 'City', name: 'Curitiba' } });
  return { '@context': 'https://schema.org', '@graph': graph };
}
