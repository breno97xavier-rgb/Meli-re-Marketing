import React, { useEffect, useRef } from 'react';
import { MethodOpening } from './components/MethodOpening';
import { MethodPinnedExperience } from './components/MethodPinnedExperience';
import { MethodClosing } from './components/MethodClosing';
import { useAtmosphere } from '../../context/AtmosphereContext';
import { ScrollTrigger } from '../../lib/gsap';

/**
 * Seção de Método da Melière Marketing (Fase 4)
 * Responde à pergunta: "Como a Melière trabalha?"
 * Composta por:
 * 1. Abertura editorial com espaço negativo ("Antes de executar, é preciso entender.")
 * 2. Experiência cinética pinned das 6 etapas contínuas com núcleo visual em evolução
 * 3. Fechamento com respiro ("Estratégia não é um documento entregue no início...")
 */
export const MethodSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { setAtmosphere } = useAtmosphere();

  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => setAtmosphere('light'),
      onEnterBack: () => setAtmosphere('light'),
    });

    return () => {
      st.kill();
    };
  }, [setAtmosphere]);

  return (
    <section ref={sectionRef} id="metodo" className="w-full bg-brand-light relative">
      {/* 1. Abertura Conceitual */}
      <MethodOpening />

      {/* 2. Experiência Cinética Pinned dos 6 Atos */}
      <MethodPinnedExperience />

      {/* 3. Fechamento e Conexão com Acompanhamento */}
      <MethodClosing />
    </section>
  );
};
