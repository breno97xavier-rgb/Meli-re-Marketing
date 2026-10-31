import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SocialMediaPage } from './pages/SocialMediaPage';
import { VisualIdentityPage } from './pages/VisualIdentityPage';
import { PaidMediaPage } from './pages/PaidMediaPage';
import { SitesPage } from './pages/SitesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { BriefingPage } from './pages/BriefingPage';
import { LinkHubPage } from './pages/LinkHubPage';
export { seoPages, hubSeo, pageSchema, agencyOrigin, hubOrigin } from './lib/seo';
const pages = { '/': HomePage, '/social-media': SocialMediaPage, '/identidade-visual': VisualIdentityPage, '/trafego-pago': PaidMediaPage, '/sites': SitesPage, '/briefing': BriefingPage, '/politica-de-privacidade': PrivacyPage, hub: LinkHubPage };
export function render(path: string) {
  const Page = pages[path as keyof typeof pages];
  return Page ? renderToString(<StaticRouter location={path === 'hub' ? '/' : path}><Page /></StaticRouter>) : '';
}
