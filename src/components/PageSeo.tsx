import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { agencyOrigin, hubOrigin, hubSeo, pageSchema, seoPages, type SeoPath } from '../lib/seo';

export function PageSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = (pathname.replace(/\/$/, '') || '/') === '/site' ? '/' : (pathname.replace(/\/$/, '') || '/');
    const hostname = window.location.hostname;
    const isAgencyHost = hostname.startsWith('agencia.') || (hostname.endsWith('.vercel.app') && hostname !== 'meliere-marketing.vercel.app');
    const isHub = path === '/' && !isAgencyHost;
    const known = path in seoPages;
    const meta = isHub ? hubSeo : known ? seoPages[path as SeoPath] : { title: 'Página não encontrada | Melière Marketing', description: 'A página solicitada não foi encontrada.' };
    document.title = meta.title;
    const setMeta = (selector: string, attribute: string, key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); }
      element.content = content;
    };
    setMeta('meta[name="description"]', 'name', 'description', meta.description);
    setMeta('meta[name="robots"]', 'name', 'robots', known ? 'index,follow' : 'noindex,follow');
    const canonicalUrl = isHub ? `${hubOrigin}/` : `${agencyOrigin}${path === '/' ? '/' : path}`;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
    for (const [key, value] of Object.entries({ 'og:title': meta.title, 'og:description': meta.description, 'og:url': canonicalUrl })) setMeta(`meta[property="${key}"]`, 'property', key, value);
    let schema = document.head.querySelector<HTMLScriptElement>('#seo-schema');
    if (!schema) { schema = document.createElement('script'); schema.id = 'seo-schema'; schema.type = 'application/ld+json'; document.head.appendChild(schema); }
    schema.textContent = known && !isHub ? JSON.stringify(pageSchema(path as SeoPath)) : '{}';
  }, [pathname]);
  return null;
}
