import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => (
  <main className="min-h-screen bg-brand-dark px-5 py-10 text-brand-light sm:px-8">
    <article className="mx-auto max-w-3xl">
      <Link to="/" className="text-sm text-brand-coral hover:underline">← Voltar</Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Política de Privacidade</h1>
      <div className="mt-8 space-y-5 text-sm leading-7 text-brand-light/75">
        <p>A Melière Marketing utiliza os dados fornecidos voluntariamente em seus canais de contato e formulários exclusivamente para responder solicitações, compreender projetos apresentados e manter comunicações relacionadas aos serviços da agência.</p>
        <p>Os dados podem incluir nome, e-mail, telefone e informações fornecidas no briefing. Essas informações não são comercializadas.</p>
        <p>O site pode utilizar tecnologias de mensuração para compreender acessos e desempenho de campanhas. Dados técnicos e parâmetros de origem podem ser registrados para fins de análise.</p>
        <p>Para solicitar informações sobre seus dados ou tratar de questões relacionadas à privacidade, entre em contato pelo e-mail agenciameliere@gmail.com.</p>
        <p>Esta política poderá ser atualizada para refletir mudanças nos serviços, integrações ou requisitos aplicáveis.</p>
      </div>
    </article>
  </main>
);
