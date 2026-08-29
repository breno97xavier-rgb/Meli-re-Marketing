import React from 'react';

interface MethodIndicatorProps {
  currentStep: number; // 1 to 6
  progress: number; // 0 to 1
  className?: string;
}

/**
 * Indicador discreto e elegante para as 6 etapas do Método Melière.
 * Exibe "01 / 06" ... "06 / 06" acompanhado por linha sutil e nome da etapa.
 */
export const MethodIndicator: React.FC<MethodIndicatorProps> = ({
  currentStep,
  progress,
  className = '',
}) => {
  const steps = [
    { num: '01', label: 'Entender' },
    { num: '02', label: 'Diagnosticar' },
    { num: '03', label: 'Estruturar' },
    { num: '04', label: 'Executar' },
    { num: '05', label: 'Acompanhar' },
    { num: '06', label: 'Ajustar' },
  ];

  const safeStep = Math.min(6, Math.max(1, currentStep));
  const formattedStep = `0${safeStep}`;

  return (
    <div
      className={`flex items-center gap-4 sm:gap-6 pointer-events-none select-none ${className}`}
      aria-label={`Método etapa ${safeStep} de 6`}
    >
      {/* Current Step Counter */}
      <div className="flex items-baseline gap-1.5 font-mono text-sm tracking-widest text-brand-dark">
        <span className="font-bold text-brand-coral">{formattedStep}</span>
        <span className="text-brand-dark/30">/</span>
        <span className="text-brand-dark/50">06</span>
      </div>

      {/* Progress Track & Fill */}
      <div className="hidden sm:flex items-center gap-1.5 w-28 md:w-36 h-[2px] bg-brand-dark/10 relative overflow-hidden rounded-full">
        <div
          className="h-full bg-brand-coral transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Discrete Step Label */}
      <div className="hidden lg:block text-xs sm:text-[13px] font-mono tracking-[0.2em] uppercase text-brand-dark/60 font-semibold">
        {steps[safeStep - 1].label}
      </div>
    </div>
  );
};
