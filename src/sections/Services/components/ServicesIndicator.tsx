import React from 'react';

interface ServicesIndicatorProps {
  currentAct: number; // 1 to 4
  progress: number; // 0 to 1
  className?: string;
}

/**
 * Discrete indicator for the 4 acts of the Services experience.
 * Displays "01 / 04", "02 / 04", "03 / 04", "04 / 04" with a delicate linked progress line.
 */
export const ServicesIndicator: React.FC<ServicesIndicatorProps> = ({
  currentAct,
  progress,
  className = '',
}) => {
  const acts = [
    { num: '01', label: 'Estratégia' },
    { num: '02', label: 'Conteúdo' },
    { num: '03', label: 'Performance' },
    { num: '04', label: 'Presença Digital' },
  ];

  const formattedAct = `0${Math.min(4, Math.max(1, currentAct))}`;

  return (
    <div
      className={`flex items-center gap-4 sm:gap-6 pointer-events-none select-none ${className}`}
      aria-label={`Serviço ato ${currentAct} de 4`}
    >
      {/* Current Act Counter */}
      <div className="flex items-baseline gap-1.5 font-mono text-xs sm:text-sm tracking-widest text-brand-light">
        <span className="font-semibold text-brand-coral">{formattedAct}</span>
        <span className="text-brand-light/30">/</span>
        <span className="text-brand-light/50">04</span>
      </div>

      {/* Progress Track & Fill */}
      <div className="hidden sm:flex items-center gap-1.5 w-28 md:w-36 h-[2px] bg-brand-light/10 relative overflow-hidden rounded-full">
        <div
          className="h-full bg-brand-coral transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Discrete Act Label */}
      <div className="hidden lg:block text-xs font-mono tracking-[0.2em] uppercase text-brand-light/60">
        {acts[Math.min(3, Math.max(0, currentAct - 1))].label}
      </div>
    </div>
  );
};
