import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AtmosphereProvider } from './context/AtmosphereContext';
import { HomePage } from './pages/HomePage';
import { BriefingPage } from './pages/BriefingPage';
import { initMetaPixel, trackMetaPageView } from './lib/metaPixel';

// Helper to scroll to top whenever pathname changes (e.g. going from / to /briefing)
const RouteScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Helper to track Meta Pixel PageView on route transitions and initial mount
const MetaPixelTracker: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    initMetaPixel();
    trackMetaPageView();
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <AtmosphereProvider>
        <RouteScrollToTop />
        <MetaPixelTracker />
        <Routes>
          {/* Main Institutional Website */}
          <Route path="/" element={<HomePage />} />

          {/* New Dedicated Briefing Experience */}
          <Route path="/briefing" element={<BriefingPage />} />

          {/* Fallback to Home for unknown routes */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AtmosphereProvider>
    </BrowserRouter>
  );
}
