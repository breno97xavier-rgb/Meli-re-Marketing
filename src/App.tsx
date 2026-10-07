import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AtmosphereProvider } from './context/AtmosphereContext';
import { HomePage } from './pages/HomePage';
import { BriefingPage } from './pages/BriefingPage';
import { LinkHubPage } from './pages/LinkHubPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { initMetaPixel, trackMetaPageView } from './lib/metaPixel';

const RouteScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const MetaPixelTracker: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { initMetaPixel(); trackMetaPageView(); }, [pathname]);
  return null;
};

export default function App() {
  const isAgencyHost = window.location.hostname.toLowerCase().startsWith('agencia.');

  return (
    <BrowserRouter>
      <AtmosphereProvider>
        <RouteScrollToTop />
        <MetaPixelTracker />
        <Routes>
          <Route path="/" element={isAgencyHost ? <HomePage /> : <LinkHubPage />} />
          <Route path="/site" element={<HomePage />} />
          <Route path="/briefing" element={<BriefingPage />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPage />} />
          <Route path="*" element={isAgencyHost ? <HomePage /> : <LinkHubPage />} />
        </Routes>
      </AtmosphereProvider>
    </BrowserRouter>
  );
}
