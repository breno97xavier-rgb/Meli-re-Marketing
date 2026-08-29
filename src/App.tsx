import React from 'react';
import { AtmosphereProvider } from './context/AtmosphereContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingContactCTA } from './components/ui/FloatingContactCTA';
import { HeroIntroExperience } from './sections/HeroIntro/HeroIntroExperience';
import { ServicesSection } from './sections/Services/ServicesSection';
import { EditorialInterludeSection } from './sections/EditorialInterlude/EditorialInterludeSection';
import { MethodSection } from './sections/Method/MethodSection';
import { FollowUpSection } from './sections/FollowUp/FollowUpSection';
import { ManifestoSection } from './sections/Manifesto/ManifestoSection';
import { AboutSection } from './sections/About/AboutSection';
import { ContactCTASection } from './sections/ContactCTA/ContactCTASection';

export default function App() {
  return (
    <AtmosphereProvider>
      <div className="min-h-screen bg-brand-dark text-brand-light flex flex-col selection:bg-brand-coral selection:text-white">
        {/* Fixed / Adaptive Header */}
        <Header />

        {/* Main Structural Flow */}
        <main id="main-content" className="flex-1 w-full">
          {/* 01 + 02. Transformative Hero & Introduction Experience */}
          <HeroIntroExperience />

          {/* 03. Services */}
          <ServicesSection />

          {/* 04. Editorial Interlude */}
          <EditorialInterludeSection />

          {/* 05. Method */}
          <MethodSection />

          {/* 06. Follow-up / Acompanhamento */}
          <FollowUpSection />

          {/* 07. Manifesto */}
          <ManifestoSection />

          {/* 08. About */}
          <AboutSection />

          {/* 09. Contact CTA */}
          <ContactCTASection />
        </main>

        {/* Floating Global Contact CTA */}
        <FloatingContactCTA />

        {/* Global Footer */}
        <Footer />
      </div>
    </AtmosphereProvider>
  );
}


