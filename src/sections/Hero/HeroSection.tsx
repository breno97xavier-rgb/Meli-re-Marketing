import React from 'react';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { Button } from '../../components/ui/Button';
import { RevealText } from '../../components/motion/RevealText';
import { ArrowUpRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <SectionContainer
      id="home"
      theme="dark"
      className="min-h-[90vh] flex items-center pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Editorial Headline & Copy */}
        <div className="lg:col-span-8 flex flex-col items-start">
          <SectionEyebrow variant="coral" className="mb-6">
            Melière Marketing
          </SectionEyebrow>

          <RevealText tag="h1" className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-light leading-[1.12] mb-8">
            Seu negócio não precisa apenas aparecer.{' '}
            <span className="text-brand-coral block sm:inline">Precisa construir presença.</span>
          </RevealText>

          <RevealText tag="p" delay={0.15} className="text-base sm:text-lg md:text-xl text-brand-light/75 font-light leading-relaxed max-w-2xl mb-10">
            Estruturação, estratégia, conteúdo, tráfego e presença digital construídos com direção, acompanhamento e consistência.
          </RevealText>

          <RevealText delay={0.25}>
            <Button href="#contato" variant="primary" size="lg" id="hero-cta-button">
              <span>Fale sobre seu negócio</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </RevealText>
        </div>

        {/* Right Column: Architectural Neutral Visual Placeholder (Ready for Phase 2 Organic Element) */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div
            className="w-full max-w-xs sm:max-w-sm aspect-square border border-brand-light/10 p-8 flex flex-col justify-between relative overflow-hidden bg-brand-dark/40"
            aria-hidden="true"
          >
            {/* Subtle editorial guide lines */}
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-brand-light/30 uppercase">
              <span>ESTRUTURA</span>
              <span>01 / 04</span>
            </div>

            <div className="my-auto flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 border border-brand-coral/40 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-brand-coral" />
              </div>
              <span className="text-xs font-mono tracking-widest text-brand-light/40 uppercase">
                Melière Visual System
              </span>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-brand-light/30">
              <span>PR.2026</span>
              <span className="text-brand-coral">#F15A3C</span>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
