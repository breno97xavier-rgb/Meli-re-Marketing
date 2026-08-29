import React from 'react';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { RevealText } from '../../components/motion/RevealText';
import { brandTokens } from '../../config/brand';
import { MessageCircle, Mail, Instagram, MapPin, Clock } from 'lucide-react';
import { BriefingForm } from './components/BriefingForm';

export const ContactCTASection: React.FC = () => {
  return (
    <SectionContainer id="contato" theme="dark" className="border-b-0">
      <div className="w-full flex flex-col gap-12 sm:gap-16">
        {/* Section Header */}
        <div className="max-w-4xl flex flex-col items-start gap-5">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[2px] bg-brand-coral rounded-full" />
            <span className="text-xs font-mono tracking-widest uppercase text-brand-coral font-medium">
              Contato & Briefing Inicial
            </span>
          </div>

          <RevealText tag="h2" className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-light leading-[1.12]">
            Seu negócio já existe.{' '}
            <span className="text-brand-coral block sm:inline">
              Vamos estruturar como ele se apresenta ao mundo.
            </span>
          </RevealText>

          <RevealText tag="p" delay={0.1} className="text-base sm:text-xl text-brand-light/75 font-light leading-relaxed max-w-2xl">
            Conte para a Melière sobre seu negócio, o momento em que ele está e o que você pretende construir.
          </RevealText>
        </div>

        {/* Two-Column Grid: Context / Direct Channels + Interactive Briefing Form */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct channels and structural info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Operational Commitment Box */}
            <div className="p-6 sm:p-8 bg-[#161616] border border-brand-light/10 space-y-6">
              <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-brand-coral font-semibold">
                <Clock className="w-4 h-4 text-brand-coral" />
                <span>Primeiro Passo</span>
              </div>

              <div className="space-y-4 text-sm text-brand-light/80 font-light leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-brand-coral font-semibold pt-0.5">01</span>
                  <p><strong className="text-brand-light font-medium">Compreensão inicial:</strong> Lemos atentamente as informações para entender o segmento, tamanho e objetivos.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-brand-coral font-semibold pt-0.5">02</span>
                  <p><strong className="text-brand-light font-medium">Contato direto:</strong> Retornamos pelo canal de sua preferência para aprofundar o cenário.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-brand-coral font-semibold pt-0.5">03</span>
                  <p><strong className="text-brand-light font-medium">Proposta clara:</strong> Desenhamos a estrutura de marketing ideal, sem fórmulas genéricas.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-light/10 flex items-center gap-2 text-xs font-mono text-brand-light/50 tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-brand-coral shrink-0" />
                <span>CURITIBA — PR // ATENDIMENTO NACIONAL</span>
              </div>
            </div>

            {/* Direct Communication Channels Grid */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-light/50 block">
                Canais Diretos de Atendimento
              </span>

              <div className="flex flex-col gap-3">
                <a
                  href={brandTokens.contact.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-[#161616] border border-brand-light/10 hover:border-brand-coral transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-light/5 rounded-none text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono tracking-widest uppercase text-brand-light/60">
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
                  className="flex items-center justify-between p-4 bg-[#161616] border border-brand-light/10 hover:border-brand-coral transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-light/5 rounded-none text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono tracking-widest uppercase text-brand-light/60">
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
                  className="flex items-center justify-between p-4 bg-[#161616] border border-brand-light/10 hover:border-brand-coral transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-light/5 rounded-none text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-colors">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono tracking-widest uppercase text-brand-light/60">
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
            </div>
          </div>

          {/* Right Column: Interactive Supabase Edge Function Briefing Form (7 cols) */}
          <div className="lg:col-span-7">
            <BriefingForm />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
