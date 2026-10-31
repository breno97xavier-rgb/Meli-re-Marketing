import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, X, ZoomIn } from 'lucide-react';
import { captureUtmParams } from '../lib/utm';

type PortfolioImage = { file: string; title: string; alt: string; width: number; height: number };
const assetPath = '/portfolio/social-media/';
const profiles: PortfolioImage[] = [
  { file: 'perfil-mansue.webp', title: 'Mansuè Café & Bistrô', alt: 'Perfil do Mansuè Café & Bistrô no Instagram, com a organização das publicações no feed.', width: 798, height: 1600 },
  { file: 'perfil-sante.webp', title: 'Santé Café', alt: 'Perfil do Santé Café no Instagram, com publicações de produtos e ambiente.', width: 792, height: 1600 },
  { file: 'perfil-sue.webp', title: 'Suê Elizabeth', alt: 'Perfil da psicóloga Suê Elizabeth no Instagram, com conteúdos sobre psicologia.', width: 792, height: 1600 },
];
const posts: PortfolioImage[] = [
  { file: 'peca-01.webp', title: 'Melière Marketing', alt: 'Publicação da Melière Marketing com composição gráfica em vermelho e texto sobre comunicação.', width: 1080, height: 1350 },
  { file: 'peca-02.webp', title: 'Mansuè Café & Bistrô', alt: 'Publicação do Mansuè com fotografia de uma fatia de bolo e a chamada Quem te deve essa fatia?', width: 1080, height: 1350 },
  { file: 'peca-03.webp', title: 'Suê Elizabeth', alt: 'Publicação de Suê Elizabeth com retrato e texto sobre compreender antes de tentar curar.', width: 1080, height: 1350 },
  { file: 'peca-04.webp', title: 'Santé Café', alt: 'Publicação do Santé Café com fotografia de iced latte e bolo.', width: 1080, height: 1350 },
];

export const SocialMediaPage: React.FC = () => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    captureUtmParams();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selected]);

  const closeImage = () => dialog.current?.close();
  const whatsapp = 'https://wa.me/5541988407253?text=' + encodeURIComponent('Olá! Conheci o trabalho de Social Media da Melière e gostaria de saber mais.');

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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15A3C]">Serviços · 01</p>
              <h1 className="text-[clamp(3.2rem,7.5vw,7rem)] font-medium leading-[0.98] tracking-[-0.06em]">Social Media</h1>
            </div>
            <div className="max-w-xl">
              <p className="text-base leading-7 text-white/85 md:text-lg md:leading-8">Estratégia, planejamento editorial, direção de conteúdo, design, copywriting e gerenciamento de redes sociais.</p>
              <p className="mt-4 text-xs leading-6 text-white/55">Captação e edição de fotos e vídeos conforme o escopo contratado.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="profiles-heading" className="px-6 pt-10 md:px-10 md:pt-12 lg:px-16">
          <div className="mx-auto max-w-[1312px]">
            <div className="mb-7 flex items-baseline justify-between gap-4 border-b border-[#202628]/20 pb-4">
              <h2 id="profiles-heading" className="text-xl font-medium tracking-[-0.035em] md:text-2xl">Perfis gerenciados</h2>
              <span className="hidden text-xs text-[#202628]/55 sm:block">03 clientes</span>
            </div>
            <div className="grid gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-8">
              {profiles.map(profile => (
                <figure key={profile.file}>
                  <button type="button" onClick={() => setSelected(profile)} aria-label={`Ampliar perfil: ${profile.title}`} className="group flex w-full items-center justify-center overflow-hidden border border-[#202628]/15 bg-[#E3E5E4] px-5 py-6 transition-colors hover:bg-[#DADDDC] md:py-7">
                    <div className="relative w-[210px] max-w-full overflow-hidden rounded-[22px] border-[5px] border-[#202628] bg-[#202628] shadow-lg md:w-[225px]">
                      <img src={assetPath + profile.file} alt={profile.alt} width={profile.width} height={profile.height} className="block h-auto w-full" decoding="async" />
                      <span aria-hidden="true" className="absolute bottom-3 right-3 rounded-full bg-[#202628]/90 p-2 text-white transition-transform group-hover:scale-110"><ZoomIn size={15} /></span>
                    </div>
                  </button>
                  <figcaption className="mt-3 text-sm font-medium">{profile.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="posts-heading" className="px-6 py-10 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto max-w-[1312px]">
            <div className="mb-7 flex items-baseline justify-between gap-4 border-b border-[#202628]/20 pb-4">
              <h2 id="posts-heading" className="text-xl font-medium tracking-[-0.035em] md:text-2xl">Publicações selecionadas</h2>
              <span className="hidden text-xs text-[#202628]/55 sm:block">Clique para ampliar</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-6">
              {posts.map(post => (
                <figure key={post.file}>
                  <button type="button" onClick={() => setSelected(post)} aria-label={`Ampliar publicação: ${post.title}`} className="group relative block w-full overflow-hidden bg-[#202628]/5">
                    <img src={assetPath + post.file} alt={post.alt} width={post.width} height={post.height} loading="lazy" decoding="async" className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none" />
                    <span aria-hidden="true" className="absolute bottom-3 right-3 rounded-full bg-[#202628]/85 p-2 text-white"><ZoomIn size={15} /></span>
                  </button>
                  <figcaption className="mt-3 text-xs font-medium md:text-sm">{post.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="contact-heading" className="border-t border-[#202628]/20 px-6 py-10 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto flex max-w-[1312px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 id="contact-heading" className="text-2xl font-medium tracking-[-0.04em] md:text-3xl">Converse sobre a gestão das suas redes sociais.</h2>
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
