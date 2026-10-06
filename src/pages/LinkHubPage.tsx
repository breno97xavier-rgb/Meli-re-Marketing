import React from 'react';
import { ArrowUpRight, Instagram, Mail } from 'lucide-react';

const links = [
  { label: 'Conheça a Melière', href: '/site', external: false },
  { label: 'Fale com a Melière', href: 'https://wa.me/5541988407253', external: true },
  { label: 'Conte sobre seu projeto', href: '/briefing', external: false },
];

export const LinkHubPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-dark text-brand-light selection:bg-brand-coral selection:text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-start overflow-hidden">
        <img
          src="/meliere-symbol.png"
          alt=""
          className="w-[min(197.4vw,1596px)] max-w-none -translate-x-[32%] opacity-[0.15] select-none"
        />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-8 sm:px-8 sm:py-10">
        <header className="flex justify-center">
          <div className="text-center">
            <div className="text-xl font-bold tracking-[-0.04em] sm:text-2xl">melière</div>
            <div className="mt-0.5 text-[0.58rem] font-medium uppercase tracking-[0.38em] text-brand-light/70">Marketing</div>
          </div>
        </header>

        <section className="flex flex-1 items-center py-12 sm:py-16" aria-label="Links principais">
          <nav className="w-full space-y-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="group flex min-h-16 w-full items-center justify-between rounded-2xl bg-brand-coral px-5 py-4 text-base font-semibold text-white shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 sm:min-h-18 sm:px-6 sm:text-lg"
              >
                <span>{link.label}</span>
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </nav>
        </section>

        <footer className="space-y-5 text-center text-xs text-brand-light/65">
          <div className="flex items-center justify-center gap-5">
            <a href="https://www.instagram.com/meliere.marketing/" target="_blank" rel="noreferrer" aria-label="Instagram da Melière" className="inline-flex items-center gap-2 transition-colors hover:text-brand-light">
              <Instagram className="h-4 w-4" aria-hidden="true" />
              @meliere.marketing
            </a>
            <a href="mailto:agenciameliere@gmail.com" className="inline-flex items-center gap-2 transition-colors hover:text-brand-light">
              <Mail className="h-4 w-4" aria-hidden="true" />
              E-mail
            </a>
          </div>
          <div className="space-y-2 border-t border-brand-light/10 pt-5">
            <p>agenciameliere@gmail.com</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span>© 2026 Melière Marketing. Todos os direitos reservados.</span>
              <a href="/politica-de-privacidade" className="underline decoration-brand-light/30 underline-offset-4 transition-colors hover:text-brand-light">
                Política de Privacidade
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
