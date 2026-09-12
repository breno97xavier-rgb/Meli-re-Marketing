import React from 'react';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { RevealText } from '../../components/motion/RevealText';
import { Button } from '../../components/ui/Button';
import { brandTokens } from '../../config/brand';
import { MessageCircle, Mail, Instagram, ArrowUpRight, MapPin } from 'lucide-react';

export const ContactCTASection: React.FC = () => {
  return (
    <SectionContainer id="contato" theme="dark" className="border-b-0">
      <div className="w-full flex flex-col gap-12 sm:gap-16">
        {/* Main Editorial Block */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Monumental Headline & Narrative (8 cols) */}
          <div className="lg:col-span-8 flex flex-col items-start gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[2px] bg-brand-coral rounded-full" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-coral font-medium">
                PRÓXIMO PASSO
              </span>
            </div>

            <RevealText
              tag="h2"
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-light leading-[1.12]"
            >
              Vamos entender o que o seu negócio precisa.
            </RevealText>

            <RevealText
              tag="p"
              delay={0.1}
              className="text-base sm:text-xl text-brand-light/75 font-light leading-relaxed max-w-2xl"
            >
              Antes de falar em pacote, serviço ou orçamento, queremos entender onde você está e o que deseja melhorar.
            </RevealText>

            {/* Large Primary Action Button */}
            <div className="pt-2 sm:pt-4">
              <Button
                href="/briefing"
                variant="primary"
                size="lg"
                id="main-contact-section-cta"
                className="group relative overflow-hidden transition-all duration-300 shadow-md gap-3 text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-5"
              >
                <span>Fale sobre seu negócio</span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
          </div>

          {/* Right Column: Direct Channels & Location Badge (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 p-6 sm:p-8 bg-[#161616] border border-brand-light/10">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-light/50 block">
              Canais Diretos de Atendimento
            </span>

            <div className="flex flex-col gap-3">
              <a
                href={brandTokens.contact.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-brand-dark/50 border border-brand-light/5 hover:border-brand-coral transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-light/5 text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-brand-light/50">
                      WhatsApp
                    </span>
                    <span className="text-sm font-medium text-brand-light group-hover:text-brand-coral transition-colors">
                      {brandTokens.contact.whatsapp.display}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs text-brand-coral opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </a>

              <a
                href={`mailto:${brandTokens.contact.email}`}
                className="flex items-center justify-between p-3.5 bg-brand-dark/50 border border-brand-light/5 hover:border-brand-coral transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-light/5 text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-brand-light/50">
                      E-mail
                    </span>
                    <span className="text-sm font-medium text-brand-light group-hover:text-brand-coral transition-colors">
                      {brandTokens.contact.email}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs text-brand-coral opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </a>

              <a
                href={brandTokens.contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-brand-dark/50 border border-brand-light/5 hover:border-brand-coral transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-light/5 text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-brand-light/50">
                      Instagram
                    </span>
                    <span className="text-sm font-medium text-brand-light group-hover:text-brand-coral transition-colors">
                      {brandTokens.contact.instagram.handle}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs text-brand-coral opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </a>
            </div>

            <div className="pt-4 border-t border-brand-light/10 flex items-center gap-2 text-xs font-mono text-brand-light/50 tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-brand-coral shrink-0" />
              <span>CURITIBA — PR // ATENDIMENTO NACIONAL</span>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
