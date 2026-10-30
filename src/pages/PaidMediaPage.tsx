import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { captureUtmParams } from '../lib/utm';

export const PaidMediaPage: React.FC = () => {
  useEffect(() => {
    captureUtmParams();
    const previousTitle = document.title;
    document.title = 'Tráfego Pago | Melière Marketing';
    return () => { document.title = previousTitle; };
  }, []);

  const pauseOtherVideos = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const current = event.currentTarget;
    current.closest('section')?.querySelectorAll('video').forEach(video => {
      if (video !== current) video.pause();
    });
  };

  const whatsapp = 'https://wa.me/5541988407253?text=' + encodeURIComponent('Olá! Conheci o trabalho de Tráfego Pago da Melière e gostaria de saber mais.');

  return (
    <div className="min-h-screen bg-[#EDEEEE] font-sans text-[#202628] antialiased selection:bg-[#F15A3C] selection:text-white">
      <header className="border-b border-white/15 bg-[#202628] text-[#EDEEEE]">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-6 md:px-10 lg:px-16">
          <Link to="/site" className="relative h-12 w-32 shrink-0 overflow-hidden" aria-label="Melière Marketing — início">
            <img src="/meliere-logo-dark.png" alt="Melière Marketing" className="absolute left-1/2 top-1/2 h-[155px] w-[155px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain" />
          </Link>
          <Link to="/site" className="flex min-h-11 items-center gap-2 text-xs transition-opacity hover:opacity-60 md:text-sm"><ArrowLeft size={16} />Voltar ao site</Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#202628] px-6 py-12 text-[#EDEEEE] md:px-10 md:py-16 lg:px-16">
          <img src="/meliere-symbol.png" alt="" aria-hidden="true" className="pointer-events-none absolute -right-28 -top-32 w-[500px] opacity-[0.06]" />
          <div className="relative mx-auto grid max-w-[1312px] gap-7 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15A3C]">Serviços · 03</p>
              <h1 className="text-[clamp(3.2rem,7.5vw,7rem)] font-medium leading-[0.98] tracking-[-0.06em]">Tráfego Pago</h1>
            </div>
            <div className="max-w-xl">
              <p className="text-base leading-7 text-white/85 md:text-lg md:leading-8">Gestão de campanhas no Instagram e Facebook: planejamento, definição de públicos, criação de anúncios, acompanhamento e otimização. Captação e edição de vídeos conforme o escopo contratado.</p>
              
            </div>
          </div>
        </section>

        <section aria-label="Vídeos produzidos para anúncios" className="px-6 py-8 md:px-10 md:py-10 lg:px-16">
          <div className="mx-auto grid max-w-[880px] justify-items-center gap-5 sm:grid-cols-3 md:gap-8">
            {['01', '02', '03'].map(number => (
              <video key={number} controls playsInline preload="none" poster={`/portfolio/trafego-pago/anuncio-${number}.jpg`} aria-label={`Reproduzir anúncio ${number}`} onPlay={pauseOtherVideos} className="aspect-[9/16] w-full max-w-[250px] border border-[#202628]/20 bg-[#202628] object-contain">
                <source src={`/portfolio/trafego-pago/anuncio-${number}.mp4`} type="video/mp4" />
                Seu navegador não suporta vídeos. <a href={`/portfolio/trafego-pago/anuncio-${number}.mp4`}>Abrir vídeo</a>
              </video>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-heading" className="border-t border-[#202628]/20 px-6 py-10 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto flex max-w-[1312px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 id="contact-heading" className="text-2xl font-medium tracking-[-0.04em] md:text-3xl">Solicite um orçamento de tráfego pago.</h2>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between gap-6 bg-[#F15A3C] px-5 text-sm font-semibold text-[#202628] transition-colors hover:bg-[#dc4e32]">Fale com a Melière <ArrowUpRight size={18} /></a>
              <Link to="/briefing" className="flex min-h-14 items-center justify-between gap-6 border border-[#202628]/35 px-5 text-sm font-semibold transition-colors hover:bg-[#202628] hover:text-[#EDEEEE]">Preencha o briefing <ArrowUpRight size={18} /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#202628] px-6 py-7 text-[#EDEEEE] md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1312px] flex-wrap items-center justify-between gap-5 text-xs text-white/65">
          <span>© 2026 Melière Marketing</span>
          <div className="flex gap-6"><a href="https://www.instagram.com/meliere.marketing/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a><Link to="/politica-de-privacidade" className="hover:text-white">Política de Privacidade</Link></div>
        </div>
      </footer>

    </div>
  );
};
