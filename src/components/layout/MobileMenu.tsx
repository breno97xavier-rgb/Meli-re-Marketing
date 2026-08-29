import React, { useEffect } from 'react';
import { navigationItems, ctaConfig } from '../../config/navigation';
import { brandTokens } from '../../config/brand';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { X, Instagram, Mail, MessageCircle } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeSection,
}) => {
  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavClick = (href: string) => {
    onClose();
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      id="mobile-navigation-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navegação Principal"
      className="fixed inset-0 z-50 bg-brand-dark flex flex-col justify-between p-6 sm:p-10 border-l border-brand-light/10 overflow-y-auto"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-brand-light/10 pb-6">
        <BrandLogo variant="light" size="sm" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="p-2 text-brand-light hover:text-brand-coral transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Large Navigation Items */}
      <nav className="py-10 flex flex-col gap-6" aria-label="Menu Mobile">
        {navigationItems.map((item, index) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className={`text-2xl sm:text-3xl font-bold uppercase tracking-[0.15em] transition-colors duration-200 flex items-baseline gap-4 ${
                isActive ? 'text-brand-coral' : 'text-brand-light hover:text-brand-coral'
              }`}
            >
              <span className="text-xs font-light text-brand-light/40 tracking-[0.2em]">
                0{index + 1}
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Information & Contacts */}
      <div className="border-t border-brand-light/10 pt-8 flex flex-col gap-6">
        <Button
          href={ctaConfig.targetAnchor}
          variant="primary"
          size="md"
          className="w-full text-center"
          onClick={onClose}
        >
          {ctaConfig.label}
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs tracking-wider uppercase text-brand-light/70">
          <a
            href={brandTokens.contact.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 hover:text-brand-coral transition-colors py-1"
          >
            <Instagram className="w-4 h-4 text-brand-coral shrink-0" />
            <span>{brandTokens.contact.instagram.handle}</span>
          </a>

          <a
            href={brandTokens.contact.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 hover:text-brand-coral transition-colors py-1"
          >
            <MessageCircle className="w-4 h-4 text-brand-coral shrink-0" />
            <span>{brandTokens.contact.whatsapp.display}</span>
          </a>

          <a
            href={`mailto:${brandTokens.contact.email}`}
            className="flex items-center gap-2.5 hover:text-brand-coral transition-colors py-1 sm:col-span-2 lowercase tracking-normal"
          >
            <Mail className="w-4 h-4 text-brand-coral shrink-0" />
            <span>{brandTokens.contact.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
