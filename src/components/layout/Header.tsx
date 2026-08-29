import React, { useState } from 'react';
import { navigationItems, ctaConfig } from '../../config/navigation';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { AnimatedLink } from '../motion/AnimatedLink';
import { MobileMenu } from './MobileMenu';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useAtmosphere } from '../../context/AtmosphereContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollDirection } = useScrollDirection();
  const { atmosphere, headerVisible } = useAtmosphere();
  const reducedMotion = useReducedMotion();
  const navSectionIds = navigationItems.map((item) => item.id);
  const activeSection = useScrollSpy(navSectionIds, 160);

  const isLightAtmosphere = atmosphere === 'light';

  // In reduced motion mode, header is always visible
  // In normal mode, header is revealed only when transformation reaches ~78-82%+ (headerVisible = true)
  // and follows auto-hide / auto-show on scroll direction
  const shouldShow = reducedMotion || headerVisible;
  const isHiddenByScroll = shouldShow && scrollDirection === 'down' && !reducedMotion;

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          !shouldShow
            ? '-translate-y-full opacity-0 pointer-events-none'
            : isHiddenByScroll
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
        } ${
          isLightAtmosphere
            ? 'bg-brand-light/95 backdrop-blur-md py-3 sm:py-3.5 md:py-4 border-b border-brand-dark/10 shadow-sm'
            : 'bg-brand-dark/95 backdrop-blur-md py-3 sm:py-3.5 md:py-4 border-b border-brand-light/10 shadow-lg'
        }`}
      >
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex items-center justify-between min-h-[58px] sm:min-h-[66px] md:min-h-[72px]">
          {/* Brand Logo Anchor */}
          <a
            href="#home"
            className="focus-visible:outline-none flex items-center flex-shrink-0"
            aria-label="Ir para o início"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <BrandLogo variant={isLightAtmosphere ? 'dark' : 'light'} size="header" />
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-7 lg:gap-9"
            aria-label="Navegação Principal"
          >
            {navigationItems.map((item) => (
              <AnimatedLink
                key={item.id}
                href={item.href}
                active={activeSection === item.id}
                theme={isLightAtmosphere ? 'light' : 'dark'}
              >
                {item.label}
              </AnimatedLink>
            ))}
          </nav>

          {/* Right Action CTA (Desktop) & Menu Toggle (Mobile) */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Button
                href={ctaConfig.targetAnchor}
                variant="primary"
                size="sm"
              >
                {ctaConfig.label}
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu de navegação"
              className={`md:hidden p-2 transition-colors cursor-pointer ${
                isLightAtmosphere
                  ? 'text-brand-dark hover:text-brand-coral'
                  : 'text-brand-light hover:text-brand-coral'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
      />
    </>
  );
};
