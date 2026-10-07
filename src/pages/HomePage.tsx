import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { captureUtmParams } from '../lib/utm';
import { initializeFunnelSession, trackLandingView } from '../lib/funnelTracking';

const services = [
  { number: '01', title: 'Social Media', description: 'Estratégia, conteúdo e gestão.', href: '/social-media' },
  { number: '02', title: 'Branding', description: 'Identidade, posicionamento e direção de marca.', href: '/branding' },
  { number: '03', title: 'Tráfego Pago', description: 'Campanhas, aquisição e otimização.', href: '/trafego-pago' },
  { number: '04', title: 'Sites', description: 'Sites institucionais, landing pages e portfólios.', href: '/sites' },
];

const method = [
  ['01', 'Entender', 'Negócio, contexto, objetivos e público.'],
  ['02', 'Planejar', 'Estratégia, direção e prioridades.'],
  ['03', 'Executar', 'Produção, implementação e campanhas.'],
  ['04', 'Analisar', 'Resultados, aprendizados e próximos movimentos.'],
];

const Texture: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-multiply"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${dark ? '.45' : '.3'}'/%3E%3C/svg%3E")`,
    }}
  />
);

export const HomePage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    captureUtmParams();
    initializeFunnelSession().then(() => trackLandingView()).catch(() => {});
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#202628] text-[#EDEEEE] font-sans antialiased selection:bg-[#F15A3C] selection:text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#202628]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-16">
          <button onClick={() => scrollTo('inicio')} className="relative z-10 h-12 w-32 overflow-hidden" aria-label="Voltar ao início">
            <img src="/meliere-logo-dark.png" alt="Melière Marketing" className="absolute left-1/2 top-1/2 h-[155px] w-[155px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain" />
          </button>
          <nav className="hidden items-center gap-8 text-[13px] font-medium md:flex">
            <button onClick={() => scrollTo('servicos')} className="transition-opacity hover:opacity-60">Serviços</button>
            <button onClick={() => scrollTo('metodo')} className="transition-opacity hover:opacity-60">Como trabalhamos</button>
            <button onClick={() => scrollTo('sobre')} className="transition-opacity hover:opacity-60">Sobre</button>
            <button onClick={() => scrollTo('contato')} className="transition-opacity hover:opacity-60">Contato</button>
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(v => !v)} aria-label="Abrir menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/10 bg-[#202628] px-6 py-8 md:hidden">
            {['servicos', 'metodo', 'sobre', 'contato'].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full border-b border-white/10 py-4 text-left text-lg capitalize">
                {id === 'metodo' ? 'Como trabalhamos' : id}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section id="inicio" className="relative flex min-h-screen items-end overflow-hidden bg-[#202628] px-6 pb-14 pt-32 md:px-10 md:pb-20 lg:px-16">
          <Texture dark />
          <img
            src="/meliere-symbol.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15vw] top-1/2 w-[71.25vw] max-w-[1088px] -translate-y-1/2 opacity-[0.10] select-none"
          />
          <div className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15A3C]">Curitiba · Paraná</p>
              <h1 className="max-w-5xl text-[clamp(3.7rem,9vw,9rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                Melière<br />Marketing
              </h1>
            </div>
            <div className="max-w-md lg:pb-2">
              <p className="text-xl leading-relaxed md:text-2xl">Agência de marketing e comunicação em Curitiba.</p>
              <p className="mt-8 border-t border-white/20 pt-5 text-sm leading-7 text-white/70">
                Branding · Social Media · Tráfego Pago · Sites
              </p>
              <button onClick={() => scrollTo('servicos')} className="mt-10 flex items-center gap-3 text-sm font-semibold">
                Conheça a Melière <ArrowDownRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <section id="servicos" className="relative overflow-hidden bg-[#EDEEEE] px-6 py-16 text-[#202628] md:px-10 md:py-20 lg:px-16">
          <Texture />
          <img src="/meliere-symbol-cream.png" alt="" aria-hidden="true" className="pointer-events-none absolute -left-40 -top-[160px] w-[690px] opacity-[0.045]" />
          <div className="relative z-10 mx-auto max-w-[1440px]">
            <div className="mb-10 flex items-end justify-between border-b border-[#202628]/20 pb-5 md:mb-12">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15A3C]">O que fazemos</p>
                <h2 className="text-4xl font-medium tracking-[-0.04em] md:text-6xl">Serviços</h2>
              </div>
              <span className="hidden text-sm text-[#202628]/55 md:block">04 áreas de atuação</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service, index) => (
                <a
                  key={service.title}
                  href={service.href}
                  className={`group relative flex min-h-[240px] flex-col justify-between overflow-hidden border border-[#202628]/20 p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-[#202628] hover:text-[#EDEEEE] md:min-h-[255px] md:p-8`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold tracking-[0.18em] opacity-55">{service.number}</span>
                    <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-medium tracking-[-0.04em] md:text-4xl">{service.title}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-6 opacity-65 md:text-base">{service.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="metodo" className="relative overflow-hidden bg-[#F15A3C] px-6 py-24 text-[#202628] md:px-10 md:py-32 lg:px-16">
          <Texture />
          <img src="/meliere-symbol-coral.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-64 right-[-12rem] w-[760px] opacity-[0.06]" />
          <div className="relative z-10 mx-auto max-w-[1440px]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]">Como trabalhamos</p>
            <h2 className="mb-14 max-w-4xl text-4xl font-medium tracking-[-0.045em] text-[#EDEEEE] md:mb-16 md:text-7xl">
              Uma direção.<br />Cada decisão reforça a seguinte.
            </h2>
            <div className="relative grid gap-0 md:grid-cols-4">
              <div aria-hidden="true" className="absolute left-0 right-0 top-[19px] hidden h-px bg-[#202628]/35 md:block" />
              {method.map(([n, title, copy]) => (
                <div key={n} className="relative border-b border-[#202628]/25 py-7 md:min-h-[190px] md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0">
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#202628]/45 bg-[#F15A3C] text-[11px] font-semibold tracking-[0.14em]">{n}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-medium text-[#EDEEEE]">{title}</h3>
                  <p className="mt-3 max-w-[240px] text-sm leading-6 opacity-70">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="relative overflow-hidden bg-[#202628] px-6 py-20 md:px-10 md:py-24 lg:px-16">
          <Texture dark />
          <div className="relative z-10 mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15A3C]">Sobre a Melière</p>
              <div className="relative overflow-hidden">
                <img src="/breno-matos.jpg" alt="Breno Matos, fundador da Melière Marketing" className="aspect-[4/5] w-full object-cover grayscale-[12%]" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/55">Breno Matos · Fundador</p>
            </div>
            <div className="max-w-3xl text-[clamp(0.82rem,0.82vw,0.86rem)] font-light leading-[1.42] tracking-[-0.025em] text-white/88">
              <p className="text-white">Toda agência nasce para vender um serviço.</p>
              <p className="mt-4">Eu queria construir uma que começasse por uma ideia.</p>
              <p className="mt-4">A ideia de que marketing não deveria ser uma coleção de ferramentas desconectadas. Uma empresa faz uma logo. Depois cria um Instagram. Então investe em anúncios.</p>
              <div className="my-6 border-y border-white/15 py-6 text-[clamp(1.05rem,1.3vw,1.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-[#F15A3C]">
                <p>Muda o site.</p><p>Troca a identidade.</p><p>Publica mais conteúdo.</p>
              </div>
              <p>E, no fim, continua sem entender por que não cresce.</p>
              <p className="mt-4">Foi justamente dessa inquietação que nasceu a Melière.</p>
              <p className="mt-4">Melière vem dos nomes Lumière e Méliès, fundadores do audiovisual. Homens com uma criatividade abundante para criar e encantar, marcados pela versatilidade em surpreender.</p>
              <p className="mt-4">A proposta aqui não é vender posts, anúncios ou identidades visuais separadamente.</p>
              <p className="mt-4">A proposta é estruturar empresas com criatividade e estratégia, para que cada decisão de comunicação reforce a seguinte.</p>
              <p className="mt-6 text-[clamp(1.1rem,1.4vw,1.6rem)] font-medium leading-[1.02] tracking-[-0.05em] text-white">Porque negócios crescem quando existe direção.</p>
              <p className="mt-4">E assim nasceu a nossa agência.</p>
            </div>
          </div>
        </section>

        <section id="contato" className="relative overflow-hidden bg-[#EDEEEE] px-6 py-24 text-[#202628] md:px-10 md:py-32 lg:px-16">
          <Texture />
          <div className="relative z-10 mx-auto max-w-[1440px]">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15A3C]">Contato</p>
            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.06em]">Tem um projeto<br />em mente?</h2>
            <div className="mt-16 flex flex-col gap-3 sm:flex-row">
              <a href="/briefing" className="flex min-h-16 items-center justify-between gap-8 bg-[#F15A3C] px-6 text-sm font-semibold transition-transform hover:-translate-y-1 sm:min-w-[280px]">
                Conte sobre seu projeto <ArrowUpRight size={18} />
              </a>
              <a href="https://wa.me/5541988407253" target="_blank" rel="noreferrer" className="flex min-h-16 items-center justify-between gap-8 border border-[#202628]/30 px-6 text-sm font-semibold transition-colors hover:bg-[#202628] hover:text-[#EDEEEE] sm:min-w-[280px]">
                Fale com a Melière <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-[#202628] px-6 py-12 md:px-10 lg:px-16">
        <Texture dark />
        <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="relative h-12 w-32 shrink-0 self-start overflow-hidden"><img src="/meliere-logo-dark.png" alt="Melière Marketing" className="absolute left-1/2 top-1/2 h-[155px] w-[155px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain" /></div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/65">
            <a href="https://www.instagram.com/meliere.marketing/" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <a href="mailto:agenciameliere@gmail.com" className="hover:text-white">agenciameliere@gmail.com</a>
            <a href="/politica-de-privacidade" className="hover:text-white">Política de Privacidade</a>
            <span>© 2026 Melière Marketing</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
