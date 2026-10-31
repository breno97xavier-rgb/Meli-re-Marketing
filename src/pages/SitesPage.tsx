import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, X, ZoomIn } from 'lucide-react';
import { captureUtmParams } from '../lib/utm';

type PortfolioImage = { file: string; title: string; alt: string; width: number; height: number };
const assetPath = '/portfolio/sites/';
const projects = [
  { name: 'Suê Elizabeth', desktop: { file: 'sue-desktop.webp', title: 'Suê Elizabeth · Desktop', alt: 'Site profissional de Suê Elizabeth em computador, com apresentação da psicóloga e contato.', width: 1897, height: 907 }, mobile: { file: 'sue-mobile.webp', title: 'Suê Elizabeth · Celular', alt: 'Site de Suê Elizabeth em celular, mostrando sua apresentação e a seção sobre o processo terapêutico.', width: 832, height: 1600 } },
  { name: 'Lanterna Mágica', desktop: { file: 'lanterna-desktop.webp', title: 'Lanterna Mágica · Desktop', alt: 'Site editorial Lanterna Mágica em computador, com menu de cinema e destaque para uma crítica.', width: 1897, height: 907 }, mobile: { file: 'lanterna-mobile.webp', title: 'Lanterna Mágica · Celular', alt: 'Site Lanterna Mágica em celular, com crítica de Ran e seção de estreias.', width: 830, height: 1600 } },
];

export const SitesPage: React.FC = () => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    captureUtmParams();
    const previousTitle = document.title;
    document.title = 'Sites | Melière Marketing';
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selected]);

  const closeImage = () => dialog.current?.close();
  const whatsapp = 'https://wa.me/5541988407253?text=' + encodeURIComponent('Olá! Conheci o trabalho de criação de Sites da Melière e gostaria de saber mais.');

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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15A3C]">Serviços · 04</p>
              <h1 className="text-[clamp(3.2rem,7.5vw,7rem)] font-medium leading-[0.98] tracking-[-0.06em]">Sites</h1>
            </div>
            <div className="max-w-xl">
              <p className="text-base leading-7 text-white/85 md:text-lg md:leading-8">Criação de sites institucionais, landing pages e sites editoriais, com layouts adaptados para computador e celular.</p>

            </div>
          </div>
        </section>

        <section aria-label="Exemplos de sites desenvolvidos" className="px-6 py-9 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto grid max-w-[1312px] gap-10 lg:grid-cols-2 lg:gap-12">
            {projects.map(project => (
              <article key={project.name}>
                <div className="relative isolate aspect-[1.6] w-full">
                  <button type="button" onClick={() => setSelected(project.desktop)} aria-label={`Ampliar site: ${project.name} no computador`} className="group absolute left-0 top-[6%] w-[94%] rounded-t-xl focus-visible:outline-offset-4">
                    <div className="relative mx-auto w-[94%] rounded-t-xl border border-[#42494B] bg-[#202628] px-[1.4%] pb-[2%] pt-[3.4%] shadow-lg">
                      <span aria-hidden="true" className="absolute left-1/2 top-[2.2%] h-1 w-1 -translate-x-1/2 rounded-full bg-[#727A7C]" />
                      <img src={assetPath + project.desktop.file} alt={project.desktop.alt} width={project.desktop.width} height={project.desktop.height} className="block aspect-[1897/907] h-auto w-full bg-[#EDEEEE] object-contain" decoding="async" />
                    </div>
                    <div aria-hidden="true" className="relative h-2.5 w-full rounded-b-[60%] border-x border-b border-[#92999B] bg-gradient-to-b from-[#D9DEDF] to-[#989FA1] md:h-3.5"><span className="absolute left-[42%] top-0 h-[45%] w-[16%] rounded-b bg-[#899193]" /></div>
                  </button>
                  <button type="button" onClick={() => setSelected(project.mobile)} aria-label={`Ampliar site: ${project.name} no celular`} className="group absolute bottom-[2%] right-0 z-10 w-[25%] overflow-hidden rounded-[14px] border-[4px] border-[#202628] bg-[#202628] shadow-xl md:rounded-[20px] md:border-[5px]">
                    <img src={assetPath + project.mobile.file} alt={project.mobile.alt} width={project.mobile.width} height={project.mobile.height} className="block h-auto w-full" decoding="async" />
                  </button>
                </div>
                <h2 className="mt-4 border-t border-[#202628]/20 pt-4 text-lg font-medium tracking-[-0.035em] md:text-xl">{project.name}</h2>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-heading" className="border-t border-[#202628]/20 px-6 py-10 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto flex max-w-[1312px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 id="contact-heading" className="text-2xl font-medium tracking-[-0.04em] md:text-3xl">Solicite um orçamento para seu site.</h2>
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

      <dialog ref={dialog} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) closeImage(); }} aria-labelledby="portfolio-dialog-title" className="fixed inset-0 m-auto max-h-[94dvh] w-[94vw] max-w-5xl overflow-y-auto border border-white/20 bg-[#202628] p-4 text-[#EDEEEE] shadow-2xl backdrop:bg-black/85 md:p-6">
        {selected && <>
          <div className="sticky -top-4 z-10 mb-4 flex items-center justify-between gap-4 bg-[#202628] py-2 md:-top-6">
            <h2 id="portfolio-dialog-title" className="text-sm font-medium">{selected.title}</h2>
            <button type="button" onClick={closeImage} aria-label="Fechar imagem" autoFocus className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 hover:bg-white/10"><X size={22} /></button>
          </div>
          <img src={assetPath + selected.file} alt={selected.alt} width={selected.width} height={selected.height} className="mx-auto block h-auto max-h-[76dvh] w-auto max-w-full object-contain" />
          <a href={assetPath + selected.file} target="_blank" rel="noopener noreferrer" className="mx-auto mt-4 flex min-h-11 w-fit items-center gap-2 text-xs underline underline-offset-4">Abrir imagem em tamanho original <ArrowUpRight size={14} /></a>
        </>}
      </dialog>
    </div>
  );
};
