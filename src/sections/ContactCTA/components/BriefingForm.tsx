import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, ArrowUpRight, Loader2, MessageSquare, Building2, User, Phone, Mail } from 'lucide-react';
import { brandTokens } from '../../../config/brand';

export type ServiceOption = 'social_media' | 'paid_traffic' | 'website' | 'branding' | 'not_sure';
export type BusinessStageOption = 'starting' | 'needs_structure' | 'has_presence' | 'professionalizing';
export type PreferredContactOption = 'whatsapp' | 'email';

export interface BriefingFormData {
  name: string;
  business_name: string;
  whatsapp: string;
  email: string;
  service: ServiceOption;
  business_stage: BusinessStageOption;
  message: string;
  preferred_contact: PreferredContactOption;
}

const SERVICE_OPTIONS: { value: ServiceOption; label: string }[] = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'paid_traffic', label: 'Tráfego Pago' },
  { value: 'website', label: 'Site / Portfólio' },
  { value: 'branding', label: 'Branding' },
  { value: 'not_sure', label: 'Ainda não sei exatamente' },
];

const STAGE_OPTIONS: { value: BusinessStageOption; label: string }[] = [
  { value: 'starting', label: 'Começando agora' },
  { value: 'needs_structure', label: 'Precisa se estruturar melhor' },
  { value: 'has_presence', label: 'Já possui presença digital' },
  { value: 'professionalizing', label: 'Busca profissionalização' },
];

const CONTACT_PREFERENCES: { value: PreferredContactOption; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
];

const INITIAL_FORM_DATA: BriefingFormData = {
  name: '',
  business_name: '',
  whatsapp: '',
  email: '',
  service: 'social_media',
  business_stage: 'needs_structure',
  message: '',
  preferred_contact: 'whatsapp',
};

const SUBMIT_ENDPOINT = 'https://ycagvwsvccgdjzpbhhfi.supabase.co/functions/v1/submit-lead';

export const BriefingForm: React.FC = () => {
  const [formData, setFormData] = useState<BriefingFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof BriefingFormData, string>>>({});

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof BriefingFormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = 'Por favor, informe seu nome.';
    }

    if (!formData.business_name.trim()) {
      errors.business_name = 'Por favor, informe o nome do seu negócio.';
    }

    if (!formData.whatsapp.trim()) {
      errors.whatsapp = 'Por favor, informe seu WhatsApp.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Por favor, informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Por favor, informe um e-mail válido.';
    }

    if (!formData.service) {
      errors.service = 'Por favor, selecione uma opção de serviço.';
    }

    if (!formData.business_stage) {
      errors.business_stage = 'Por favor, selecione o momento do seu negócio.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Por favor, conte um pouco sobre seu negócio e seus objetivos.';
    }

    if (!formData.preferred_contact) {
      errors.preferred_contact = 'Selecione como prefere receber nosso contato.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    field: keyof BriefingFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      const payload = {
        name: formData.name.trim(),
        business_name: formData.business_name.trim(),
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim(),
        service: formData.service,
        business_stage: formData.business_stage,
        message: formData.message.trim(),
        preferred_contact: formData.preferred_contact,
      };

      const response = await fetch(SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success === true) {
        setStatus('success');
        setFormData(INITIAL_FORM_DATA);
        setFieldErrors({});
      } else {
        setStatus('error');
        setErrorMessage(
          'Não foi possível enviar as informações no momento. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'Ocorreu uma falha de conexão ao enviar o formulário. Verifique sua rede e tente novamente.'
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage(null);
    setFieldErrors({});
  };

  if (status === 'success') {
    return (
      <div className="w-full bg-[#181818] border border-brand-light/15 rounded-xl p-8 sm:p-12 flex flex-col items-start gap-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 text-brand-coral">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-brand-coral">
            Briefing Enviado com Sucesso
          </span>
        </div>

        <div className="space-y-3 max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-light">
            Obrigado pelo contato.
          </h3>
          <p className="text-base sm:text-lg text-brand-light/80 font-light leading-relaxed">
            Recebemos as informações do seu negócio. Nossa equipe entrará em contato em breve através do canal de sua preferência para dar o próximo passo.
          </p>
        </div>

        <div className="w-full pt-4 border-t border-brand-light/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-light/60 hover:text-brand-coral transition-colors cursor-pointer text-left sm:text-center py-2"
          >
            ← Enviar outro briefing
          </button>

          <a
            href={brandTokens.contact.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-coral text-white text-xs uppercase font-medium tracking-wider hover:bg-[#de492c] transition-colors shadow-sm"
          >
            <span>Falar no WhatsApp</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full bg-[#181818] border border-brand-light/15 rounded-xl p-6 sm:p-10 flex flex-col gap-8 shadow-2xl relative"
    >
      {/* Form Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-brand-light/10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-brand-coral tracking-[0.2em] uppercase font-semibold">
            Briefing Inicial
          </span>
          <span className="font-mono text-xs text-brand-light/50 tracking-wider">
            DIAGNÓSTICO
          </span>
        </div>
        <p className="text-xs sm:text-sm text-brand-light/70 font-light">
          Preencha os campos abaixo para que possamos entender o contexto do seu negócio.
        </p>
      </div>

      {/* Error Alert if Submission Failed */}
      {status === 'error' && errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-brand-coral shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-brand-light">Não foi possível concluir o envio</p>
            <p className="text-xs text-brand-light/80 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Row 1: Personal & Business Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="lead-name" className="text-xs font-mono uppercase tracking-wider text-brand-light/80 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-brand-coral" />
            <span>Seu Nome <strong className="text-brand-coral">*</strong></span>
          </label>
          <input
            id="lead-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex: Ana Silva"
            disabled={status === 'submitting'}
            aria-invalid={!!fieldErrors.name}
            className={`w-full px-4 py-3 bg-brand-dark/70 border rounded-none text-sm text-brand-light placeholder:text-brand-light/30 focus:outline-none transition-colors ${
              fieldErrors.name
                ? 'border-brand-coral focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
                : 'border-brand-light/15 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
            }`}
          />
          {fieldErrors.name && (
            <span className="text-xs font-mono text-brand-coral">{fieldErrors.name}</span>
          )}
        </div>

        {/* Business Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="lead-business-name" className="text-xs font-mono uppercase tracking-wider text-brand-light/80 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-brand-coral" />
            <span>Nome do Negócio <strong className="text-brand-coral">*</strong></span>
          </label>
          <input
            id="lead-business-name"
            type="text"
            value={formData.business_name}
            onChange={(e) => handleChange('business_name', e.target.value)}
            placeholder="Ex: Studio Arquitetura"
            disabled={status === 'submitting'}
            aria-invalid={!!fieldErrors.business_name}
            className={`w-full px-4 py-3 bg-brand-dark/70 border rounded-none text-sm text-brand-light placeholder:text-brand-light/30 focus:outline-none transition-colors ${
              fieldErrors.business_name
                ? 'border-brand-coral focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
                : 'border-brand-light/15 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
            }`}
          />
          {fieldErrors.business_name && (
            <span className="text-xs font-mono text-brand-coral">{fieldErrors.business_name}</span>
          )}
        </div>
      </div>

      {/* Row 2: WhatsApp & E-mail */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* WhatsApp */}
        <div className="flex flex-col gap-2">
          <label htmlFor="lead-whatsapp" className="text-xs font-mono uppercase tracking-wider text-brand-light/80 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-brand-coral" />
            <span>WhatsApp <strong className="text-brand-coral">*</strong></span>
          </label>
          <input
            id="lead-whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="(41) 99999-9999"
            disabled={status === 'submitting'}
            aria-invalid={!!fieldErrors.whatsapp}
            className={`w-full px-4 py-3 bg-brand-dark/70 border rounded-none text-sm text-brand-light placeholder:text-brand-light/30 focus:outline-none transition-colors ${
              fieldErrors.whatsapp
                ? 'border-brand-coral focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
                : 'border-brand-light/15 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
            }`}
          />
          {fieldErrors.whatsapp && (
            <span className="text-xs font-mono text-brand-coral">{fieldErrors.whatsapp}</span>
          )}
        </div>

        {/* E-mail */}
        <div className="flex flex-col gap-2">
          <label htmlFor="lead-email" className="text-xs font-mono uppercase tracking-wider text-brand-light/80 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-brand-coral" />
            <span>E-mail Corporativo <strong className="text-brand-coral">*</strong></span>
          </label>
          <input
            id="lead-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contato@seunegocio.com.br"
            disabled={status === 'submitting'}
            aria-invalid={!!fieldErrors.email}
            className={`w-full px-4 py-3 bg-brand-dark/70 border rounded-none text-sm text-brand-light placeholder:text-brand-light/30 focus:outline-none transition-colors ${
              fieldErrors.email
                ? 'border-brand-coral focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
                : 'border-brand-light/15 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
            }`}
          />
          {fieldErrors.email && (
            <span className="text-xs font-mono text-brand-coral">{fieldErrors.email}</span>
          )}
        </div>
      </div>

      {/* Row 3: Service Selector Chips */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-mono uppercase tracking-wider text-brand-light/80">
          Serviço ou Necessidade Principal <strong className="text-brand-coral">*</strong>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SERVICE_OPTIONS.map((opt) => {
            const isSelected = formData.service === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChange('service', opt.value)}
                disabled={status === 'submitting'}
                className={`text-left px-4 py-3 text-xs sm:text-sm font-light border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-brand-coral/15 border-brand-coral text-white font-medium'
                    : 'bg-brand-dark/40 border-brand-light/15 text-brand-light/80 hover:border-brand-light/30 hover:bg-brand-dark/70'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    isSelected ? 'bg-brand-coral scale-110' : 'bg-brand-light/20'
                  }`}
                />
              </button>
            );
          })}
        </div>
        {fieldErrors.service && (
          <span className="text-xs font-mono text-brand-coral">{fieldErrors.service}</span>
        )}
      </div>

      {/* Row 4: Business Stage Selector Chips */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-mono uppercase tracking-wider text-brand-light/80">
          Momento Atual do Negócio <strong className="text-brand-coral">*</strong>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_OPTIONS.map((opt) => {
            const isSelected = formData.business_stage === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChange('business_stage', opt.value)}
                disabled={status === 'submitting'}
                className={`text-left px-4 py-3 text-xs sm:text-sm font-light border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-brand-coral/15 border-brand-coral text-white font-medium'
                    : 'bg-brand-dark/40 border-brand-light/15 text-brand-light/80 hover:border-brand-light/30 hover:bg-brand-dark/70'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    isSelected ? 'bg-brand-coral scale-110' : 'bg-brand-light/20'
                  }`}
                />
              </button>
            );
          })}
        </div>
        {fieldErrors.business_stage && (
          <span className="text-xs font-mono text-brand-coral">{fieldErrors.business_stage}</span>
        )}
      </div>

      {/* Row 5: Message Textarea */}
      <div className="flex flex-col gap-2">
        <label htmlFor="lead-message" className="text-xs font-mono uppercase tracking-wider text-brand-light/80 flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-brand-coral" />
          <span>Conte sobre seu negócio e seus objetivos <strong className="text-brand-coral">*</strong></span>
        </label>
        <textarea
          id="lead-message"
          rows={4}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Ex: Atuamos no segmento de serviços corporativos e queremos reestruturar nosso posicionamento, presença digital e captação de clientes qualificados."
          disabled={status === 'submitting'}
          aria-invalid={!!fieldErrors.message}
          className={`w-full px-4 py-3 bg-brand-dark/70 border rounded-none text-sm text-brand-light placeholder:text-brand-light/30 focus:outline-none transition-colors resize-none ${
            fieldErrors.message
              ? 'border-brand-coral focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
              : 'border-brand-light/15 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral'
          }`}
        />
        {fieldErrors.message && (
          <span className="text-xs font-mono text-brand-coral">{fieldErrors.message}</span>
        )}
      </div>

      {/* Row 6: Preferred Contact Channel & Submit Button */}
      <div className="pt-4 border-t border-brand-light/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Preferred contact channel */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-light/70">
            Preferência de Retorno:
          </span>
          <div className="flex items-center gap-3">
            {CONTACT_PREFERENCES.map((pref) => {
              const isSelected = formData.preferred_contact === pref.value;
              return (
                <button
                  key={pref.value}
                  type="button"
                  onClick={() => handleChange('preferred_contact', pref.value)}
                  disabled={status === 'submitting'}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-coral text-white border-brand-coral'
                      : 'bg-brand-dark/40 border-brand-light/15 text-brand-light/70 hover:border-brand-light/30'
                  }`}
                >
                  {pref.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-9 py-4.5 bg-brand-coral text-white text-xs sm:text-sm font-medium tracking-wider uppercase hover:bg-[#de492c] active:bg-[#c93d22] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-sm select-none"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Enviando briefing...</span>
            </>
          ) : (
            <>
              <span>Enviar Briefing</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
