import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, X, ZoomIn } from 'lucide-react';
import { captureUtmParams } from '../lib/utm';

type PortfolioImage = { file: string; title: string; alt: string; width: number; height: number };
const assetPath = '/portfolio/identidade-visual/';
const projects = [
  { name: 'Suê Elizabeth', description: 'Criação de logotipo e identidade visual para psicóloga.', images: [
    { file: 'sue-identidade.webp', title: 'Suê Elizabeth · Identidade', alt: 'Logotipo e símbolo de Suê Elizabeth aplicados sobre fundo azul.', width: 1080, height: 1350 },
    { file: 'sue-cartao.webp', title: 'Suê Elizabeth · Cartão de visitas', alt: 'Mockup dos cartões de visitas de Suê Elizabeth nas cores azul, marrom e bege.', width: 1080, height: 1350 },
  ] },
  { name: 'Edital Concursos', description: 'Criação de logotipo, identidade visual e capas de materiais de estudo. Projeto próprio.', images: [
    { file: 'edital-identidade.webp', title: 'Edital Concursos · Identidade', alt: 'Logotipo Edital Concursos com símbolo de livros em amarelo e lettering branco sobre fundo azul escuro.', width: 1800, height: 1800 },
    { file: 'edital-capa.webp', title: 'Edital Concursos · Capa de material', alt: 'Capa de material de estudo para agente administrativo da PRF, com a identidade da Edital Concursos em azul e amarelo.', width: 1128, height: 1800 },
  ] },
  { name: 'Mansuè Café & Bistrô', description: 'Definição de cores, tipografia e materiais de comunicação a partir do logotipo existente.', images: [
    { file: 'mansue-identidade.webp', title: 'Mansuè · Identidade', alt: 'Logotipo existente do Mansuè aplicado sobre a textura clara da identidade visual.', width: 922, height: 922 },
    { file: 'mansue-cardapio.webp', title: 'Mansuè · Cardápio de almoço', alt: 'Cardápio de almoço do Mansuè para stories, com logotipo, tipografia e fundo em fotografia.', width: 1012, height: 1800 },
  ] },
  { name: 'Lanterna Mágica', description: 'Criação de logotipo e identidade visual para publicação de cinema.', images: [
    { file: 'lanterna-identidade.webp', title: 'Lanterna Mágica · Identidade', alt: 'Logotipo do Lanterna Mágica em fundo preto.', width: 1254, height: 1254 },
    { file: 'lanterna-site.webp', title: 'Lanterna Mágica · Site', alt: 'Aplicação do logotipo no cabeçalho do site Lanterna Mágica.', width: 1685, height: 911 },
  ] },
];

export const VisualIdentityPage: React.FC = () => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    captureUtmParams();
    const previousTitle = document.title;
    document.title = 'Identidade Visual | Melière Marketing';
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
  const whatsapp = 'https://wa.me/5541988407253?text=' + encodeURIComponent('Olá! Conheci o trabalho de Identidade Visual da Melière e gostaria de saber mais.');

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
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15A3C]">Serviços · 02</p>
              <h1 className="text-[clamp(2.8rem,6.2vw,6.3rem)] font-medium leading-[0.98] tracking-[-0.06em]">Identidade Visual</h1>
            </div>
            <div className="max-w-xl">
              <p className="text-base leading-7 text-white/85 md:text-lg md:leading-8">Criação de logotipo, definição de cores, tipografia e elementos gráficos. Aplicação da identidade em materiais impressos e digitais.</p>
              
            </div>
          </div>
        </section>

        <section aria-label="Projetos de identidade visual" className="px-6 py-10 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto grid max-w-[1312px] gap-x-8 gap-y-8 lg:grid-cols-2 lg:gap-x-10">
            {projects.map((project, index) => (
              <article key={project.name} aria-labelledby={`project-${index}`}>
                <div className="mb-4 border-b border-[#202628]/20 pb-3 lg:min-h-[100px]">
                  <h2 id={`project-${index}`} className="text-xl font-medium tracking-[-0.035em]">{project.name}</h2>
                  <p className="mt-2 max-w-xl text-xs leading-5 text-[#202628]/65">{project.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {project.images.map(item => (
                    <figure key={item.file}>
                      <button type="button" onClick={() => setSelected(item)} aria-label={`Ampliar: ${item.title}`} className="group relative flex h-[210px] w-full items-center justify-center overflow-hidden border border-[#202628]/15 bg-[#E3E5E4] p-2 transition-colors hover:bg-[#DADDDC] sm:h-[270px] lg:h-[260px] xl:h-[280px]">
                        <img src={assetPath + item.file} alt={item.alt} width={item.width} height={item.height} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" className="block h-full w-full object-contain" />
                        <span aria-hidden="true" className="absolute bottom-3 right-3 rounded-full bg-[#202628]/85 p-2 text-white"><ZoomIn size={15} /></span>
                      </button>
                      <figcaption className="mt-3 text-xs text-[#202628]/65">{item.title.split(' · ')[1]}</figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-heading" className="border-t border-[#202628]/20 px-6 py-10 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto flex max-w-[1312px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 id="contact-heading" className="text-2xl font-medium tracking-[-0.04em] md:text-3xl">Solicite um orçamento de identidade visual.</h2>
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
