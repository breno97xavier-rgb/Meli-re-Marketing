import React, { useEffect, useRef } from 'react';
import { ServicesOpening } from './ServicesOpening';
import { ServicesPinnedExperience } from './ServicesPinnedExperience';
import { useAtmosphere } from '../../context/AtmosphereContext';
import { gsap, ScrollTrigger } from '../../lib/gsap';

/**
 * Seção de Serviços da Melière Marketing (Fase 3)
 * Composta por:
 * 1. Abertura editorial com espaço negativo ("Estrutura antes de escala.")
 * 2. Experiência cinética pinned com os 4 atos estruturais e assets reais.
 */
export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { setAtmosphere } = useAtmosphere();

  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => setAtmosphere('dark'),
      onEnterBack: () => setAtmosphere('dark'),
    });

    return () => {
      st.kill();
    };
  }, [setAtmosphere]);

  return (
    <section ref={sectionRef} id="servicos" className="w-full bg-brand-dark relative">
      {/* 1. Abertura conceitual */}
      <ServicesOpening />

      {/* 2. Experiência cinética pinned dos 4 atos */}
      <ServicesPinnedExperience />
    </section>
  );
};
