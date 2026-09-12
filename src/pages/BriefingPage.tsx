import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
import {
  BriefingState,
  INITIAL_BRIEFING_STATE,
  LeadType,
  PreferredContactMethod,
  CallPeriod,
} from '../types/briefing';
import { captureUtmParams, getStoredUtmParams } from '../lib/utm';
import {
  mapBriefingStateToPayload,
  submitBriefingLead,
} from '../lib/briefingContracts';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  User,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const BriefingPage: React.FC = () => {
  const navigate = useNavigate();

  // Step 0 to Step 5 (+ Step 6 as Completion)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [formData, setFormData] = useState<BriefingState>(INITIAL_BRIEFING_STATE);

  // Submission lifecycle states
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load UTMs on mount and restore any existing session UTMs
  useEffect(() => {
    const utms = captureUtmParams();
    const stored = getStoredUtmParams();
    const merged = { ...stored, ...utms };
    setFormData((prev) => ({
      ...prev,
      utm_source: merged.utm_source,
      utm_medium: merged.utm_medium,
      utm_campaign: merged.utm_campaign,
      utm_content: merged.utm_content,
      utm_term: merged.utm_term,
      referrer: merged.referrer,
    }));
  }, []);

  const totalSteps = 6; // 0, 1, 2, 3, 4, 5 (Step 6 is completion)

  // Navigate forward
  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate backward
  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Briefing Lead to Supabase Endpoint
  const handleSubmitBriefing = async () => {
    if (submitStatus === 'submitting' || submitStatus === 'success') return;
    if (!isStepValid()) return;

    setSubmitStatus('submitting');
    setErrorMessage(null);

    const payload = mapBriefingStateToPayload(formData);
    const res = await submitBriefingLead(payload);

    if (res.success && res.lead_id) {
      setSubmittedLeadId(res.lead_id);
      setSubmitStatus('success');
      setDirection(1);
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitStatus('error');
      setErrorMessage(
        res.error ||
          'Não conseguimos enviar agora. Suas respostas foram preservadas. Tente novamente em alguns instantes.'
      );
    }
  };

  // Step 0: Lead Profile
  const handleSelectLeadType = (type: LeadType) => {
    setFormData((prev) => ({ ...prev, leadType: type }));
    setDirection(1);
    setCurrentStep(1);
  };

  // Toggle multi-select items
  const toggleArrayItem = (
    field: 'servicesInterest' | 'currentSituation' | 'objectives',
    item: string
  ) => {
    setFormData((prev) => {
      const currentList = prev[field];
      const exists = currentList.includes(item);
      const updated = exists
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      return { ...prev, [field]: updated };
    });
  };

  // Select preferred contact
  const handleSelectContactMethod = (method: PreferredContactMethod) => {
    setFormData((prev) => ({ ...prev, preferredContact: method }));
  };

  // Check validity for the Continue button on each step
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return formData.leadType !== null;
      case 1:
        return formData.servicesInterest.length > 0;
      case 2:
        return formData.currentSituation.length > 0;
      case 3:
        if (formData.objectives.length === 0) return false;
        if (
          formData.objectives.includes('Outro') &&
          !formData.otherObjective?.trim()
        ) {
          return false;
        }
        return true;
      case 4:
        if (formData.leadType === 'business') {
          return (
            (formData.businessName?.trim().length || 0) >= 2 &&
            (formData.segmentOrProfession?.trim().length || 0) >= 2
          );
        } else {
          return (
            (formData.professionalName?.trim().length || 0) >= 2 &&
            (formData.segmentOrProfession?.trim().length || 0) >= 2
          );
        }
      case 5:
        if (!formData.preferredContact) return false;
        if (!formData.contactName.trim()) return false;
        if (formData.preferredContact === 'whatsapp') {
          return (formData.phone?.trim().length || 0) >= 8;
        }
        if (formData.preferredContact === 'phone') {
          return (
            (formData.phone?.trim().length || 0) >= 8 &&
            formData.preferredCallPeriod !== undefined
          );
        }
        if (formData.preferredContact === 'email') {
          return (
            (formData.email?.trim().length || 0) >= 5 &&
            formData.email?.includes('@') === true
          );
        }
        return false;
      default:
        return true;
    }
  };

  // Options configuration based on chosen profile
  const isBusiness = formData.leadType === 'business';

  const servicesOptions = isBusiness
    ? [
        'Conteúdo e redes sociais',
        'Tráfego pago e aquisição',
        'Site ou portfólio',
        'Marca e posicionamento',
        'Estratégia mais completa',
        'Ainda não sei exatamente',
      ]
    : [
        'Conteúdo e redes sociais',
        'Tráfego pago e aquisição de clientes',
        'Site ou portfólio',
        'Marca e posicionamento profissional',
        'Estratégia mais completa',
        'Ainda não sei exatamente',
      ];

  const situationOptions = isBusiness
    ? [
        'Ainda não fazemos nada estruturado',
        'Fazemos internamente',
        'Já trabalhamos com profissionais ou agência',
        'Já tentamos antes, mas queremos melhorar',
        'Estamos apenas avaliando possibilidades',
      ]
    : [
        'Ainda não faço nada estruturado',
        'Faço tudo sozinho',
        'Já trabalho com algum profissional',
        'Já trabalhei com profissionais anteriormente',
        'Já tentei antes, mas quero melhorar',
        'Estou apenas avaliando possibilidades',
      ];

  const objectivesOptions = isBusiness
    ? [
        'Atrair mais clientes',
        'Melhorar a percepção da marca',
        'Organizar a comunicação',
        'Melhorar conversão',
        'Lançar ou reformular algo',
        'Outro',
      ]
    : [
        'Atrair mais clientes',
        'Transmitir mais profissionalismo',
        'Organizar minha comunicação',
        'Melhorar conversão',
        'Posicionar melhor meu trabalho',
        'Lançar ou reformular algo',
        'Outro',
      ];

  // Motion animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
    }),
  };

  // Progress percentage
  const progressPercent =
    currentStep === 6 ? 100 : Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light flex flex-col selection:bg-brand-coral selection:text-white font-sans antialiased">
      {/* Background Architectural Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-10" aria-hidden="true">
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-light/20" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-md border-b border-brand-light/10">
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo -> Home */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-coral"
            aria-label="Voltar para a página inicial"
          >
            <BrandLogo variant="light" size="header" />
          </button>

          {/* Right Action: Voltar ao site */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs sm:text-sm font-mono uppercase tracking-wider text-brand-light/70 hover:text-brand-coral transition-colors py-2 px-3 border border-transparent hover:border-brand-light/10 cursor-pointer"
            >
              Voltar ao site
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        {currentStep < 6 && (
          <div className="w-full h-[2px] bg-brand-light/10 relative overflow-hidden">
            <motion.div
              className="h-full bg-brand-coral"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        )}
      </header>

      {/* Main Form Canvas */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16 flex flex-col justify-between relative z-10">
        <div className="w-full">
          {/* Step Indicator Header (Steps 0 to 5) */}
          {currentStep < 6 && (
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <div className="flex items-center gap-3">
                <span className="w-4 h-[2px] bg-brand-coral rounded-full" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-coral font-medium">
                  Briefing Melière
                </span>
              </div>
              <span className="text-xs font-mono tracking-wider text-brand-light/50 uppercase">
                Etapa {currentStep + 1} de {totalSteps}
              </span>
            </div>
          )}

          {/* Animated Step Container */}
          <AnimatePresence mode="wait" custom={direction}>
            {/* =============================================================
                STEP 0: Initial Profile Choice (Empresa vs Autônomo)
               ============================================================= */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-8 sm:gap-10"
              >
                <div className="space-y-3">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-light leading-tight">
                    Como você atua hoje?
                  </h1>
                  <p className="text-base sm:text-lg text-brand-light/70 font-light max-w-xl">
                    Selecione o perfil que melhor define a sua estrutura atual para personalizarmos o diagnóstico.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
                  {/* Option 1: Empresa */}
                  <button
                    type="button"
                    onClick={() => handleSelectLeadType('business')}
                    className={`group p-6 sm:p-8 text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:min-h-[190px] ${
                      formData.leadType === 'business'
                        ? 'border-brand-coral bg-brand-coral/[0.08] shadow-[0_0_24px_rgba(241,90,60,0.15)]'
                        : 'border-brand-light/15 bg-[#161616] hover:border-brand-coral hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-4">
                      <div className="p-3 bg-brand-light/5 text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-colors">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono text-brand-coral opacity-0 group-hover:opacity-100 transition-opacity">
                        Selecionar →
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-brand-light group-hover:text-brand-coral transition-colors mb-1.5">
                        Tenho uma empresa
                      </h2>
                      <p className="text-xs sm:text-sm text-brand-light/60 font-light leading-relaxed">
                        Tenho sócios, equipe ou operação estruturada no mercado.
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Autônomo */}
                  <button
                    type="button"
                    onClick={() => handleSelectLeadType('self_employed')}
                    className={`group p-6 sm:p-8 text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:min-h-[190px] ${
                      formData.leadType === 'self_employed'
                        ? 'border-brand-coral bg-brand-coral/[0.08] shadow-[0_0_24px_rgba(241,90,60,0.15)]'
                        : 'border-brand-light/15 bg-[#161616] hover:border-brand-coral hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-4">
                      <div className="p-3 bg-brand-light/5 text-brand-coral group-hover:bg-brand-coral group-hover:text-white transition-colors">
                        <User className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono text-brand-coral opacity-0 group-hover:opacity-100 transition-opacity">
                        Selecionar →
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-brand-light group-hover:text-brand-coral transition-colors mb-1.5">
                        Trabalho como autônomo
                      </h2>
                      <p className="text-xs sm:text-sm text-brand-light/60 font-light leading-relaxed">
                        Atuo de forma independente ou presto serviços profissionais especializados.
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* =============================================================
                STEP 1: Services / Needs (Multi-select)
               ============================================================= */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-6 sm:gap-8"
              >
                <div className="space-y-2.5">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-light leading-tight">
                    {isBusiness
                      ? 'O que você gostaria de melhorar no seu negócio hoje?'
                      : 'O que você gostaria de melhorar na sua presença profissional hoje?'}
                  </h1>
                  <p className="text-xs sm:text-sm font-mono text-brand-coral/90 tracking-wide uppercase">
                    Você pode selecionar mais de uma opção.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-2">
                  {servicesOptions.map((opt) => {
                    const isSelected = formData.servicesInterest.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleArrayItem('servicesInterest', opt)}
                        className={`p-4 sm:p-5 text-left border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 min-h-[64px] ${
                          isSelected
                            ? 'border-brand-coral bg-brand-coral/[0.12] text-white shadow-sm'
                            : 'border-brand-light/15 bg-[#161616] text-brand-light/85 hover:border-brand-coral/50 hover:bg-[#1c1c1c]'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-medium leading-snug">
                          {opt}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-none border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-brand-coral border-brand-coral text-white'
                              : 'border-brand-light/30 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* =============================================================
                STEP 2: Current Situation (Multi-select)
               ============================================================= */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-6 sm:gap-8"
              >
                <div className="space-y-2.5">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-light leading-tight">
                    {isBusiness
                      ? 'Como essa área funciona hoje na sua empresa?'
                      : 'Como você cuida dessa parte hoje?'}
                  </h1>
                  <p className="text-xs sm:text-sm font-mono text-brand-coral/90 tracking-wide uppercase">
                    Você pode selecionar mais de uma opção.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:gap-4 pt-2">
                  {situationOptions.map((opt) => {
                    const isSelected = formData.currentSituation.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleArrayItem('currentSituation', opt)}
                        className={`p-4 sm:p-5 text-left border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 min-h-[58px] ${
                          isSelected
                            ? 'border-brand-coral bg-brand-coral/[0.12] text-white shadow-sm'
                            : 'border-brand-light/15 bg-[#161616] text-brand-light/85 hover:border-brand-coral/50 hover:bg-[#1c1c1c]'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-medium leading-snug">
                          {opt}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-none border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-brand-coral border-brand-coral text-white'
                              : 'border-brand-light/30 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* =============================================================
                STEP 3: Objectives (Multi-select + Other input)
               ============================================================= */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-6 sm:gap-8"
              >
                <div className="space-y-2.5">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-light leading-tight">
                    Qual é o principal objetivo agora?
                  </h1>
                  <p className="text-xs sm:text-sm font-mono text-brand-coral/90 tracking-wide uppercase">
                    Você pode selecionar mais de uma opção.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-2">
                  {objectivesOptions.map((opt) => {
                    const isSelected = formData.objectives.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleArrayItem('objectives', opt)}
                        className={`p-4 sm:p-5 text-left border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 min-h-[60px] ${
                          isSelected
                            ? 'border-brand-coral bg-brand-coral/[0.12] text-white shadow-sm'
                            : 'border-brand-light/15 bg-[#161616] text-brand-light/85 hover:border-brand-coral/50 hover:bg-[#1c1c1c]'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-medium leading-snug">
                          {opt}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-none border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-brand-coral border-brand-coral text-white'
                              : 'border-brand-light/30 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Conditional Text Field when "Outro" is selected */}
                {formData.objectives.includes('Outro') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-[#161616] border border-brand-coral/40 flex flex-col gap-2"
                  >
                    <label
                      htmlFor="other-objective-input"
                      className="text-xs font-mono uppercase tracking-wider text-brand-coral"
                    >
                      Especifique o seu objetivo:
                    </label>
                    <input
                      id="other-objective-input"
                      type="text"
                      value={formData.otherObjective || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          otherObjective: e.target.value,
                        }))
                      }
                      placeholder="Ex: Abrir filial em outra cidade, reposicionar para público premium..."
                      className="w-full bg-brand-dark/80 border border-brand-light/20 px-4 py-3 text-sm text-brand-light focus:outline-none focus:border-brand-coral"
                      autoFocus
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* =============================================================
                STEP 4: Business or Professional Info Details
               ============================================================= */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-6 sm:gap-8"
              >
                <div className="space-y-2.5">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-light leading-tight">
                    {isBusiness
                      ? 'Conte um pouco sobre a empresa.'
                      : 'Conte um pouco sobre o seu trabalho.'}
                  </h1>
                  <p className="text-sm sm:text-base text-brand-light/70 font-light">
                    {isBusiness
                      ? 'Informações básicas para compreendermos seu contexto e mercado.'
                      : 'Informações básicas para compreendermos sua atuação e posicionamento.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 pt-2">
                  {/* Field 1: Name */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="primary-name-input"
                      className="text-xs font-mono uppercase tracking-wider text-brand-light/70 flex items-center justify-between"
                    >
                      <span>
                        {isBusiness ? 'Nome da empresa' : 'Seu nome completo'}{' '}
                        <span className="text-brand-coral">*</span>
                      </span>
                    </label>
                    <input
                      id="primary-name-input"
                      type="text"
                      value={
                        isBusiness
                          ? formData.businessName || ''
                          : formData.professionalName || ''
                      }
                      onChange={(e) =>
                        setFormData((prev) =>
                          isBusiness
                            ? { ...prev, businessName: e.target.value }
                            : { ...prev, professionalName: e.target.value }
                        )
                      }
                      placeholder={
                        isBusiness
                          ? 'Ex: Grupo Silva, Construtora Alpha, Melière...'
                          : 'Ex: Dra. Juliana Costa, Lucas Mendes...'
                      }
                      className="w-full bg-[#161616] border border-brand-light/20 px-4 py-3.5 text-sm sm:text-base text-brand-light focus:outline-none focus:border-brand-coral transition-colors"
                    />
                  </div>

                  {/* Field 2: Segment / Profession */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="segment-input"
                      className="text-xs font-mono uppercase tracking-wider text-brand-light/70"
                    >
                      {isBusiness ? 'Segmento' : 'Profissão / Área de atuação'}{' '}
                      <span className="text-brand-coral">*</span>
                    </label>
                    <input
                      id="segment-input"
                      type="text"
                      value={formData.segmentOrProfession || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          segmentOrProfession: e.target.value,
                        }))
                      }
                      placeholder={
                        isBusiness
                          ? 'Ex: Tecnologia, Moda, Saúde, Indústria, Consultoria...'
                          : 'Ex: Advogado, Arquiteto, Cirurgião-dentista, Designer...'
                      }
                      className="w-full bg-[#161616] border border-brand-light/20 px-4 py-3.5 text-sm sm:text-base text-brand-light focus:outline-none focus:border-brand-coral transition-colors"
                    />
                  </div>

                  {/* Field 3: Site or Instagram (Optional) */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="website-input"
                      className="text-xs font-mono uppercase tracking-wider text-brand-light/50"
                    >
                      Site ou Instagram <span className="text-brand-light/40">(opcional)</span>
                    </label>
                    <input
                      id="website-input"
                      type="text"
                      value={formData.websiteOrInstagram || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          websiteOrInstagram: e.target.value,
                        }))
                      }
                      placeholder="Ex: @seuperfil ou www.suaempresa.com.br"
                      className="w-full bg-[#161616] border border-brand-light/20 px-4 py-3.5 text-sm sm:text-base text-brand-light focus:outline-none focus:border-brand-coral transition-colors"
                    />
                  </div>

                  {/* Field 4: Notes (Optional) */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="notes-input"
                      className="text-xs font-mono uppercase tracking-wider text-brand-light/50"
                    >
                      Algo importante que devemos saber?{' '}
                      <span className="text-brand-light/40">(opcional)</span>
                    </label>
                    <textarea
                      id="notes-input"
                      rows={3}
                      value={formData.notes || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Desafios pontuais, histórico anterior, prazos ou qualquer detalhe relevante..."
                      className="w-full bg-[#161616] border border-brand-light/20 px-4 py-3 text-sm text-brand-light focus:outline-none focus:border-brand-coral transition-colors resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* =============================================================
                STEP 5: Contact Preference & Final Details
               ============================================================= */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-6 sm:gap-8"
              >
                <div className="space-y-2.5">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-light leading-tight">
                    Como você prefere que a gente entre em contato?
                  </h1>
                  <p className="text-sm sm:text-base text-brand-light/70 font-light">
                    Selecione o canal mais confortável para receber nosso retorno.
                  </p>
                </div>

                {/* 3 Contact Method Choice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleSelectContactMethod('whatsapp')}
                    className={`p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 text-center min-h-[110px] ${
                      formData.preferredContact === 'whatsapp'
                        ? 'border-brand-coral bg-brand-coral/[0.12] text-white shadow-sm'
                        : 'border-brand-light/15 bg-[#161616] text-brand-light/80 hover:border-brand-coral hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="p-2.5 bg-brand-light/5 text-brand-coral">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider">
                      WhatsApp
                    </span>
                  </button>

                  {/* Ligação */}
                  <button
                    type="button"
                    onClick={() => handleSelectContactMethod('phone')}
                    className={`p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 text-center min-h-[110px] ${
                      formData.preferredContact === 'phone'
                        ? 'border-brand-coral bg-brand-coral/[0.12] text-white shadow-sm'
                        : 'border-brand-light/15 bg-[#161616] text-brand-light/80 hover:border-brand-coral hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="p-2.5 bg-brand-light/5 text-brand-coral">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Ligação
                    </span>
                  </button>

                  {/* E-mail */}
                  <button
                    type="button"
                    onClick={() => handleSelectContactMethod('email')}
                    className={`p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 text-center min-h-[110px] ${
                      formData.preferredContact === 'email'
                        ? 'border-brand-coral bg-brand-coral/[0.12] text-white shadow-sm'
                        : 'border-brand-light/15 bg-[#161616] text-brand-light/80 hover:border-brand-coral hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="p-2.5 bg-brand-light/5 text-brand-coral">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider">
                      E-mail
                    </span>
                  </button>
                </div>

                {/* Dynamic Contact Fields based on preference */}
                {formData.preferredContact && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 sm:p-8 bg-[#161616] border border-brand-light/15 flex flex-col gap-5 mt-2"
                  >
                    {/* Common Field: Contact Name */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-name-input"
                        className="text-xs font-mono uppercase tracking-wider text-brand-light/70"
                      >
                        Seu nome <span className="text-brand-coral">*</span>
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        value={formData.contactName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            contactName: e.target.value,
                          }))
                        }
                        placeholder="Como devemos lhe chamar?"
                        className="w-full bg-brand-dark/80 border border-brand-light/20 px-4 py-3.5 text-sm sm:text-base text-brand-light focus:outline-none focus:border-brand-coral transition-colors"
                      />
                    </div>

                    {/* WhatsApp Specific */}
                    {formData.preferredContact === 'whatsapp' && (
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="contact-whatsapp-input"
                          className="text-xs font-mono uppercase tracking-wider text-brand-light/70"
                        >
                          Número de WhatsApp com DDD{' '}
                          <span className="text-brand-coral">*</span>
                        </label>
                        <input
                          id="contact-whatsapp-input"
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="(00) 00000-0000"
                          className="w-full bg-brand-dark/80 border border-brand-light/20 px-4 py-3.5 text-sm sm:text-base text-brand-light focus:outline-none focus:border-brand-coral transition-colors"
                        />
                      </div>
                    )}

                    {/* Ligação Specific */}
                    {formData.preferredContact === 'phone' && (
                      <>
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="contact-phone-input"
                            className="text-xs font-mono uppercase tracking-wider text-brand-light/70"
                          >
                            Telefone para contato com DDD{' '}
                            <span className="text-brand-coral">*</span>
                          </label>
                          <input
                            id="contact-phone-input"
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="(00) 00000-0000"
                            className="w-full bg-brand-dark/80 border border-brand-light/20 px-4 py-3.5 text-sm sm:text-base text-brand-light focus:outline-none focus:border-brand-coral transition-colors"
                          />
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <span className="text-xs font-mono uppercase tracking-wider text-brand-light/70">
                            Melhor período para ligarmos{' '}
                            <span className="text-brand-coral">*</span>
                          </span>
                          <div className="grid grid-cols-2 gap-3">
                            {(['morning', 'afternoon'] as CallPeriod[]).map(
                              (period) => (
                                <button
                                  key={period}
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      preferredCallPeriod: period,
                                    }))
                                  }
                                  className={`py-3 px-4 text-xs font-mono uppercase tracking-wider border cursor-pointer transition-colors ${
                                    formData.preferredCallPeriod === period
                                      ? 'border-brand-coral bg-brand-coral text-white font-semibold'
                                      : 'border-brand-light/20 bg-brand-dark/50 text-brand-light/80 hover:border-brand-coral'
                                  }`}
                                >
                                  {period === 'morning'
                                    ? 'Manhã (09h - 12h)'
                                    : 'Tarde (14h - 18h)'}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* E-mail Specific */}
                    {formData.preferredContact === 'email' && (
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="contact-email-input"
                          className="text-xs font-mono uppercase tracking-wider text-brand-light/70"
                        >
                          Seu melhor e-mail{' '}
                          <span className="text-brand-coral">*</span>
                        </label>
                        <input
                          id="contact-email-input"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="nome@empresa.com.br"
                          className="w-full bg-brand-dark/80 border border-brand-light/20 px-4 py-3.5 text-sm sm:text-base text-brand-light focus:outline-none focus:border-brand-coral transition-colors"
                        />
                      </div>
                    )}

                    {/* Submission Error Banner */}
                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-950/30 border border-red-500/40 text-red-200 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
                        <div>
                          <p className="font-semibold text-red-100">Não conseguimos enviar agora.</p>
                          <p className="text-xs text-red-300 font-light mt-0.5">
                            {errorMessage || 'Suas respostas foram preservadas. Tente novamente em alguns instantes.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSubmitBriefing}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono uppercase tracking-wider transition-colors shrink-0 cursor-pointer font-medium"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* =============================================================
                STEP 6: Confirmation / Completion Screen
               ============================================================= */}
            {currentStep === 6 && (
              <motion.div
                key="step-6"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-start gap-8 sm:gap-10 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-coral/10 border border-brand-coral text-brand-coral">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-mono tracking-widest uppercase text-brand-coral font-medium block">
                      RECEBEMOS SUA SOLICITAÇÃO
                    </span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-light">
                      Recebemos. Agora é com a gente.
                    </h1>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-brand-light/80 font-light leading-relaxed max-w-2xl">
                  Vamos analisar as informações que você enviou e entrar em contato pelo canal escolhido.
                </p>

                {/* Summary Card */}
                <div className="w-full p-6 sm:p-8 bg-[#161616] border border-brand-light/15 flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-brand-light/10 pb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-coral font-semibold">
                      Resumo da Solicitação
                    </span>
                    <span className="text-xs font-mono text-brand-light/50 uppercase">
                      {isBusiness ? 'Empresa' : 'Autônomo'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <span className="text-xs font-mono uppercase text-brand-light/50 block mb-1">
                        {isBusiness ? 'Empresa' : 'Profissional'}
                      </span>
                      <p className="font-semibold text-brand-light">
                        {isBusiness
                          ? formData.businessName
                          : formData.professionalName}
                      </p>
                      <p className="text-xs text-brand-light/60">
                        {formData.segmentOrProfession}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-mono uppercase text-brand-light/50 block mb-1">
                        Canal de Retorno
                      </span>
                      <p className="font-semibold text-brand-light">
                        {formData.contactName} ({formData.preferredContact})
                      </p>
                      <p className="text-xs text-brand-light/60">
                        {formData.phone || formData.email}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-xs font-mono uppercase text-brand-light/50 block mb-2">
                        Áreas de Interesse
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {formData.servicesInterest.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 bg-brand-light/5 border border-brand-light/10 text-xs font-mono text-brand-light/85"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Button
                    onClick={() => navigate('/')}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <span>Voltar ao site</span>
                  </Button>

                  <Button
                    onClick={() => navigate('/#servicos')}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <span>Conhecer nossos serviços</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Control Bar (Steps 1 to 5) */}
        {currentStep >= 1 && currentStep < 6 && (
          <div className="flex items-center justify-between pt-10 sm:pt-14 border-t border-brand-light/10 mt-10">
            {/* Back Button */}
            <button
              type="button"
              onClick={prevStep}
              disabled={submitStatus === 'submitting'}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-brand-light/70 hover:text-brand-coral transition-colors py-3 px-2 ${
                submitStatus === 'submitting' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            {/* Continue / Finish Button */}
            {currentStep === 5 ? (
              <Button
                onClick={handleSubmitBriefing}
                disabled={!isStepValid() || submitStatus === 'submitting'}
                variant="primary"
                size="md"
                className={`gap-2.5 shadow-md ${
                  !isStepValid() || submitStatus === 'submitting'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {submitStatus === 'submitting' ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Concluir Briefing</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                variant="primary"
                size="md"
                className={`gap-2.5 shadow-md ${
                  !isStepValid() ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
