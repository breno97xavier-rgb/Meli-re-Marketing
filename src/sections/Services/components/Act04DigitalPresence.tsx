import React from 'react';
import { ServiceAssetCarousel } from '../../../components/ui/ServiceAssetCarousel';

interface Act04DigitalPresenceProps {
  progress?: number;
}

const mockups = [
  'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/1.png',
  'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/2.png',
];

/**
 * ATO 04 — PRESENÇA DIGITAL & IDENTIDADE
 * Prominent auto-scrolling mockup presentation featuring responsive laptop & mobile showcases.
 */
export const Act04DigitalPresence: React.FC<Act04DigitalPresenceProps> = () => {
  const auxiliaryTags = [
    'IDENTIDADE VISUAL',
    'BRANDING',
    'WEB',
    'EXPERIÊNCIA DIGITAL',
  ];

  const slides = mockups.map((mockupUrl, idx) => (
    <div key={mockupUrl} className="w-full flex items-center justify-center p-0 sm:p-1">
      <div className="w-full max-w-[650px] md:max-w-[780px] lg:max-w-[900px] xl:max-w-[1020px] 2xl:max-w-[1100px] flex items-center justify-center">
        <img
          src={mockupUrl}
          alt={`Mockup Presença Digital 0${idx + 1}`}
          loading="lazy"
          decoding="async"
          className="w-full h-auto max-h-[560px] md:max-h-[620px] lg:max-h-[680px] xl:max-h-[760px] object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.7)] transition-transform duration-700 hover:scale-[1.02]"
        />
      </div>
    </div>
  ));

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center my-auto py-1">
        {/* Left Column: Title + Copy + Auxiliary Tags (4 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Auxiliary Tags */}
          <div className="flex flex-wrap gap-2">
            {auxiliaryTags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-brand-light/85 bg-brand-light/[0.04] border border-brand-light/15 px-3.5 py-1.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4.8rem] xl:text-[5.5rem] font-bold tracking-tight text-brand-light leading-[1.03]">
            Presença Digital &<br />
            <span className="text-brand-coral">Identidade</span>
          </h3>

          {/* Descriptive Copy */}
          <p className="text-base sm:text-lg md:text-[1.1rem] text-brand-light/90 font-light leading-relaxed max-w-lg">
            A percepção de um negócio também é construída pela forma como ele se apresenta. Identidade visual e presença digital organizam essa experiência em diferentes pontos de contato.
          </p>
        </div>

        {/* Right Column: Prominent Auto-Scrolling Mockups Carousel (Enlarged to match yellow outline) */}
        <div className="lg:col-span-8 xl:col-span-8 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-[950px] xl:max-w-[1050px]">
            <ServiceAssetCarousel
              items={slides}
              autoplayInterval={4500}
              showIndicators={true}
              ariaLabel="Carrossel de Mockups de Presença Digital"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

