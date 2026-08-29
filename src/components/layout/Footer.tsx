import React from 'react';
import { brandTokens } from '../../config/brand';
import { navigationItems } from '../../config/navigation';
import { BrandLogo } from '../ui/BrandLogo';
import { Mail, MessageCircle, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#161616] text-brand-light border-t border-brand-light/10 pt-16 pb-12 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20"
    >
      <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex flex-col gap-12">
        {/* Top Grid: Brand & Navigation & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <BrandLogo variant="light" size="md" />
            <p className="text-sm text-brand-light/60 max-w-sm leading-relaxed font-light">
              Estruturação, estratégia, conteúdo, tráfego e presença digital construídos com direção, acompanhamento e consistência.
            </p>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-coral">
              Navegação
            </span>
            <ul className="flex flex-col gap-2.5">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-sm text-brand-light/70 hover:text-brand-coral transition-colors font-light"
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-coral">
              Contato
            </span>
            <div className="flex flex-col gap-3 text-sm font-light text-brand-light/75">
              <a
                href={`mailto:${brandTokens.contact.email}`}
                className="flex items-center gap-2.5 hover:text-brand-coral transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-coral shrink-0" />
                <span>{brandTokens.contact.email}</span>
              </a>

              <a
                href={brandTokens.contact.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-brand-coral transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-brand-coral shrink-0" />
                <span>{brandTokens.contact.whatsapp.display}</span>
              </a>

              <a
                href={brandTokens.contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-brand-coral transition-colors"
              >
                <Instagram className="w-4 h-4 text-brand-coral shrink-0" />
                <span>{brandTokens.contact.instagram.handle}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Copyright */}
        <div className="border-t border-brand-light/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-brand-light/40">
          <p>{brandTokens.copyright}</p>
          <div className="flex items-center gap-6">
            <a
              href="#contato"
              className="hover:text-brand-light transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
