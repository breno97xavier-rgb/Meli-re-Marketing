import React, { useRef, useEffect } from 'react';
import { assets } from '../../../config/assets';
import { ServiceAssetCarousel } from '../../../components/ui/ServiceAssetCarousel';

interface Act02ContentProps {
  progress?: number;
  isActive?: boolean;
}

/**
 * ATO 02 — CONTEÚDO & SOCIAL MEDIA
 * Mobile: Horizontal swipeable auto-advancing carousel of real social media & living reels
 * Desktop: Layered multi-brand editorial composition (Mansuè Café, Edital Concursos, Lanterna Mágica)
 */
export const Act02Content: React.FC<Act02ContentProps> = ({
  isActive = true,
}) => {
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);

  const auxiliaryTags = [
    'DIREÇÃO CRIATIVA',
    'SOCIAL MEDIA',
    'DESIGN',
    'VÍDEO',
  ];

  // Pause / play videos based on active status to save performance
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    const vm = mobileVideoRef.current;
    if (isActive) {
      v1?.play().catch(() => {});
      v2?.play().catch(() => {});
      vm?.play().catch(() => {});
    } else {
      v1?.pause();
      v2?.pause();
      vm?.pause();
    }
  }, [isActive]);

  // Mobile Carousel Slides Items
  const mobileSlides = [
    // Slide 1: Living Reel (Mansuè)
    <div key="slide-reel-1" className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-[260px] aspect-[9/16] rounded-xl overflow-hidden bg-brand-dark/95 border border-brand-light/20 shadow-2xl relative">
        {assets.mansue.reels[0] && (
          <video
            ref={mobileVideoRef}
            src={assets.mansue.reels[0]}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            aria-label="Reel Mansuè Café & Bistrô"
          />
        )}
        <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 bg-brand-dark/90 backdrop-blur-md rounded-lg border border-brand-light/15 text-xs font-mono text-brand-light font-medium flex items-center justify-between">
          <span className="truncate">Mansuè Café // Reel</span>
          <span className="w-2 h-2 rounded-full bg-brand-coral animate-ping" />
        </div>
      </div>
    </div>,

    // Slide 2: Primary Post (Mansuè)
    <div key="slide-post-mansue" className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-[290px] aspect-square rounded-xl overflow-hidden bg-brand-dark/95 border border-brand-light/20 shadow-2xl relative">
        <img
          src={assets.mansue.posts[0]}
          alt="Post Mansuè Café & Bistrô"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-brand-dark/90 backdrop-blur-sm rounded-md text-xs font-mono text-brand-light font-medium border border-brand-light/15">
          MANSUÈ CAFÉ
        </div>
      </div>
    </div>,

    // Slide 3: Edital Concursos Post
    <div key="slide-post-edital" className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-[290px] aspect-square rounded-xl overflow-hidden bg-brand-dark/95 border border-brand-light/20 shadow-2xl relative">
        <img
          src={assets.editalSocial.posts[0]}
          alt="Post Edital Concursos"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-brand-dark/90 backdrop-blur-sm rounded-md text-xs font-mono text-brand-light font-medium border border-brand-light/15">
          EDITAL CONCURSOS
        </div>
      </div>
    </div>,

    // Slide 4: Lanterna Mágica Post
    <div key="slide-post-lanterna" className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-[290px] aspect-square rounded-xl overflow-hidden bg-brand-dark/95 border border-brand-light/20 shadow-2xl relative">
        <img
          src={assets.lanternaSocial.posts[0]}
          alt="Post Lanterna Mágica"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-brand-dark/90 backdrop-blur-sm rounded-md text-xs font-mono text-brand-light font-medium border border-brand-light/15">
          LANTERNA MÁGICA
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 items-center my-auto py-1">
        {/* Left Column: Title + Copy + Auxiliary Tags (4 cols on xl to give more space to the media showcase) */}
        <div className="lg:col-span-4 flex flex-col gap-3 sm:gap-5 lg:gap-5 xl:gap-6">
          {/* Auxiliary Tags */}
          <div className="flex flex-wrap gap-2">
            {auxiliaryTags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs uppercase tracking-[0.14em] text-brand-light/85 bg-brand-light/[0.04] border border-brand-light/15 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.75rem] 2xl:text-[5.2rem] font-bold tracking-tight text-brand-light leading-[1.04]">
            Conteúdo &<br />
            <span className="text-brand-coral">Social Media</span>
          </h3>

          {/* Descriptive Copy */}
          <p className="text-base sm:text-lg md:text-[1.05rem] xl:text-[1.15rem] text-brand-light/90 font-light leading-relaxed max-w-lg">
            Presença não se constrói com publicações isoladas. Conteúdo exige direção visual, consistência e uma comunicação capaz de manter o negócio presente na rotina do público.
          </p>
        </div>

        {/* Right Column: Media Presentation */}
        <div className="lg:col-span-8 relative flex items-center justify-center">
          {/* MOBILE VIEW (< 768px): Horizontal Carousel */}
          <div className="w-full block md:hidden">
            <ServiceAssetCarousel
              items={mobileSlides}
              autoplayInterval={4500}
              ariaLabel="Galeria de Conteúdo e Social Media da Melière"
            />
          </div>

          {/* DESKTOP VIEW (>= 768px): Layered Kinetic Media Gallery */}
          <div className="w-full hidden md:grid grid-cols-12 gap-3 lg:gap-4 xl:gap-5 items-center max-h-[58vh] lg:max-h-[62vh]">
            {/* Living Reel Column (Vertical 9:16 Video Frame) */}
            <div className="col-span-4 relative group flex justify-center">
              <div className="w-full max-w-[210px] lg:max-w-[230px] xl:max-w-[250px] aspect-[9/16] rounded-xl lg:rounded-2xl overflow-hidden bg-brand-dark/90 border border-brand-light/20 shadow-2xl relative">
                {assets.mansue.reels[0] && (
                  <video
                    ref={video1Ref}
                    src={assets.mansue.reels[0]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    aria-label="Reel Mansuè Café & Bistrô"
                  />
                )}
                {/* Discrete Label Tag */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 bg-brand-dark/90 backdrop-blur-md rounded-lg border border-brand-light/15 text-[11px] lg:text-xs font-mono text-brand-light font-medium flex items-center justify-between">
                  <span className="truncate">Mansuè Reel</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-coral animate-ping" />
                </div>
              </div>
            </div>

            {/* Central Primary Stacked Post (Mansuè + Edital + Lanterna) */}
            <div className="col-span-5 flex flex-col gap-2.5 lg:gap-3">
              {/* Main Square Post Card */}
              <div className="w-full aspect-square max-h-[28vh] lg:max-h-[32vh] rounded-xl lg:rounded-2xl overflow-hidden bg-brand-dark/90 border border-brand-light/25 shadow-2xl relative group">
                <img
                  src={assets.mansue.posts[0]}
                  alt="Post Mansuè Café & Bistrô"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-brand-dark/90 backdrop-blur-sm rounded-md text-[11px] lg:text-xs font-mono text-brand-light font-semibold border border-brand-light/20">
                  MANSUÈ
                </div>
              </div>

              {/* Secondary Post Underneath */}
              <div className="grid grid-cols-2 gap-2.5 lg:gap-3">
                <div className="aspect-square max-h-[14vh] lg:max-h-[16vh] rounded-lg lg:rounded-xl overflow-hidden bg-brand-dark/90 border border-brand-light/20 relative shadow-lg">
                  <img
                    src={assets.editalSocial.posts[0]}
                    alt="Post Edital Concursos"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-dark/90 rounded text-[10px] lg:text-[11px] font-mono text-brand-light font-medium border border-brand-light/15">
                    EDITAL
                  </div>
                </div>

                <div className="aspect-square max-h-[14vh] lg:max-h-[16vh] rounded-lg lg:rounded-xl overflow-hidden bg-brand-dark/90 border border-brand-light/20 relative shadow-lg">
                  <img
                    src={assets.lanternaSocial.posts[0]}
                    alt="Post Lanterna Mágica"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-dark/90 rounded text-[10px] lg:text-[11px] font-mono text-brand-light font-medium border border-brand-light/15">
                    LANTERNA
                  </div>
                </div>
              </div>
            </div>

            {/* Right Ambient Floating Reel/Post */}
            <div className="col-span-3 relative flex justify-center">
              <div className="w-full max-w-[170px] lg:max-w-[190px] xl:max-w-[210px] aspect-[9/16] rounded-xl lg:rounded-2xl overflow-hidden bg-brand-dark/90 border border-brand-light/20 shadow-2xl relative opacity-90 hover:opacity-100 transition-opacity">
                {assets.mansue.reels[1] && (
                  <video
                    ref={video2Ref}
                    src={assets.mansue.reels[1]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    aria-label="Reel 2 Mansuè Café & Bistrô"
                  />
                )}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1.5 bg-brand-dark/90 backdrop-blur-md rounded-lg border border-brand-light/15 text-[11px] lg:text-xs font-mono text-brand-light font-medium">
                  <span>Editorial Motion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
