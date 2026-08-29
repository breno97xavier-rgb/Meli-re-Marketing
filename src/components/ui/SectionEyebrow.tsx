import React from 'react';

interface SectionEyebrowProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'coral' | 'light' | 'muted';
}

export const SectionEyebrow: React.FC<SectionEyebrowProps> = ({
  children,
  className = '',
  variant = 'coral',
}) => {
  const variantStyles = {
    coral: 'text-brand-coral',
    light: 'text-brand-light',
    muted: 'text-brand-light/60',
  };

  return (
    <div className={`flex items-center gap-3 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase select-none ${variantStyles[variant]} ${className}`}>
      <span className="w-4 h-[1px] bg-current opacity-70" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
};
