import React from 'react';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { RevealText } from '../../components/motion/RevealText';

export const IntroductionSection: React.FC = () => {
  return (
    <SectionContainer id="introducao" theme="dark">
      <div className="max-w-4xl">
        <SectionEyebrow variant="coral" className="mb-6">
          Estruturação de Marketing
        </SectionEyebrow>

        <RevealText tag="h2" className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-light leading-snug mb-8">
          Crescer sem estrutura transforma marketing em improviso.
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          <div className="md:col-span-8">
            <RevealText tag="p" delay={0.1} className="text-base sm:text-lg text-brand-light/80 font-light leading-relaxed">
              A Melière organiza a presença do seu negócio antes de tentar acelerá-la. Estratégia, identidade, conteúdo, tráfego e acompanhamento trabalham juntos para construir uma comunicação consistente, profissional e preparada para crescer.
            </RevealText>
          </div>
        </div>

        {/* Editorial Statement Footer */}
        <div className="border-l-2 border-brand-coral pl-6 py-2">
          <RevealText tag="p" delay={0.2} className="text-sm sm:text-base font-medium text-brand-light tracking-wide">
            Marketing não deveria ser uma sequência de ações isoladas. Ele precisa funcionar como estrutura.
          </RevealText>
        </div>
      </div>
    </SectionContainer>
  );
};
