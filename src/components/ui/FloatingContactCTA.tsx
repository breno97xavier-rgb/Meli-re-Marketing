import React, { useState, useEffect } from 'react';
import { useAtmosphere } from '../../context/AtmosphereContext';
import { ArrowUpRight } from 'lucide-react';

export const FloatingContactCTA: React.FC = () => {
  const { headerVisible } = useAtmosphere();
  const [isHeroPassed, setIsHeroPassed] = useState<boolean>(false);
  const [isContactVisible, setIsContactVisible] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const checkVisibility = () => {
      // 1. Check if Hero experience has finished / scrolled past
      const heroContainer = document.getElementById('home-experience');
      const servicesSection = document.getElementById('servicos');
      const contactSection = document.getElementById('contato');

      let heroPassed = false;
      if (headerVisible) {
        heroPassed = true;
      } else if (servicesSection) {
        const servicesRect = servicesSection.getBoundingClientRect();
        // If the top of services is within or above the viewport
        if (servicesRect.top < window.innerHeight * 0.9) {
          heroPassed = true;
        }
      } else if (heroContainer) {
        const heroRect = heroContainer.getBoundingClientRect();
        if (heroRect.bottom < window.innerHeight * 0.5) {
          heroPassed = true;
        }
      } else {
        // Fallback for simple scroll threshold
        if (window.scrollY > window.innerHeight * 0.8) {
          heroPassed = true;
        }
      }

      setIsHeroPassed(heroPassed);

      // 2. Check if Contact section is significantly in viewport
      if (contactSection) {
        const contactRect = contactSection.getBoundingClientRect();
        // Contact is visible when its top is within viewport
        const contactInView =
          contactRect.top <= window.innerHeight * 0.75 &&
          contactRect.bottom >= window.innerHeight * 0.1;
        setIsContactVisible(contactInView);
      } else {
        setIsContactVisible(false);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkVisibility);
        ticking = true;
      }
    };

    // Initial check
    checkVisibility();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Also observe the contact section with IntersectionObserver for precision
    let observer: IntersectionObserver | null = null;
    const contactElem = document.getElementById('contato');
    if (contactElem && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // When contact section enters significantly
            setIsContactVisible(entry.isIntersecting);
          });
        },
        {
          rootMargin: '-10% 0px -15% 0px',
          threshold: [0, 0.15, 0.5],
        }
      );
      observer.observe(contactElem);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [headerVisible]);

  // Determine if CTA should be visible
  const isVisible = isHeroPassed && !isContactVisible;

  const scrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const contactElem = document.getElementById('contato');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed z-40 right-4 sm:right-6 md:right-8 lg:right-10 bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] sm:bottom-6 md:bottom-8 transition-all duration-400 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <button
        id="floating-contact-cta"
        type="button"
        onClick={scrollToContact}
        aria-label="Ir para seção de contato e falar conosco"
        className="group relative inline-flex items-center justify-center gap-2 sm:gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-3.5 min-h-[44px] min-w-[44px] bg-brand-coral text-white font-medium text-xs sm:text-[13px] uppercase tracking-wider select-none cursor-pointer shadow-[0_8px_24px_rgba(238,77,45,0.35)] hover:shadow-[0_12px_32px_rgba(238,77,45,0.5)] hover:bg-[#de492c] active:bg-[#c93d22] active:scale-[0.98] border border-white/15 focus-visible:outline-2 focus-visible:outline-brand-coral focus-visible:outline-offset-2 transition-all duration-200"
      >
        <span>Fale conosco</span>
        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
};
