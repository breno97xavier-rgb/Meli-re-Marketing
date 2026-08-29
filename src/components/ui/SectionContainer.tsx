import React from 'react';

interface SectionContainerProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  theme?: 'dark' | 'light' | 'coral';
  children: React.ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  className = '',
  containerClassName = '',
  theme = 'dark',
  children,
}) => {
  const themeClasses = {
    dark: 'bg-brand-dark text-brand-light',
    light: 'bg-brand-light text-brand-dark',
    coral: 'bg-brand-coral text-brand-light',
  };

  return (
    <section
      id={id}
      data-section-theme={theme}
      className={`relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-brand-light/10 transition-colors duration-300 ${themeClasses[theme]} ${className}`}
    >
      <div className={`w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
};
