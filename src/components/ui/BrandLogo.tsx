import React from 'react';
import { assets } from '../../config/assets';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'coral';
  showSymbolOnly?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'header' | 'footer';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  showSymbolOnly = false,
  className = '',
  size = 'md',
}) => {
  // Determine correct official PNG asset based on requested context
  const customUrl = (() => {
    if (showSymbolOnly) {
      if (variant === 'light') return assets.brand.symbolLight;
      if (variant === 'dark') return assets.brand.symbolCoralBlack;
      // Default coral symbol with white accent for dark backgrounds
      return assets.brand.symbolCoralWhite;
    }
    // Full horizontal logo:
    // Dark variant is for light backgrounds (1.png)
    // Light variant is for dark backgrounds (2.png)
    if (variant === 'dark') return assets.brand.logoDark;
    return assets.brand.logoLight;
  })();

  // Dimensions of the outer visual wrapper box (matches the exact perceived graphic bounds)
  const wrapperDimensions = {
    sm: showSymbolOnly
      ? 'w-7 h-7'
      : 'w-[125px] sm:w-[145px] h-[28px] sm:h-[32px]',
    header: showSymbolOnly
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : 'w-[155px] sm:w-[170px] md:w-[185px] h-[34px] sm:h-[38px] md:h-[42px]',
    md: showSymbolOnly
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : 'w-[150px] sm:w-[170px] h-[34px] sm:h-[38px]',
    lg: showSymbolOnly
      ? 'w-11 h-11'
      : 'w-[195px] sm:w-[230px] h-[44px] sm:h-[52px]',
    footer: showSymbolOnly
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : 'w-[145px] sm:w-[165px] h-[32px] sm:h-[36px]',
  };

  if (customUrl) {
    if (showSymbolOnly) {
      return (
        <div className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}>
          <img
            src={customUrl}
            alt="Melière"
            className={`object-contain transition-all duration-300 block ${wrapperDimensions[size]}`}
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </div>
      );
    }

    // Visual crop window solution:
    // Compensates for internal transparent whitespace inside 1.png / 2.png
    // The wrapper defines the EXACT visible bounds & hitbox.
    // The inner <img> is centered and scaled up so the visible wordmark fits the box edge-to-edge.
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden flex-shrink-0 select-none ${wrapperDimensions[size]} ${className}`}
      >
        <img
          src={customUrl}
          alt="Melière Marketing"
          className="absolute w-[220%] h-[220%] max-w-none max-h-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none transition-all duration-300"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
    );
  }

  // Fallback typographic rendering
  const sizeClasses = {
    sm: 'text-sm tracking-[0.18em]',
    header: 'text-base tracking-[0.18em]',
    md: 'text-base sm:text-lg tracking-[0.2em]',
    lg: 'text-xl sm:text-2xl tracking-[0.22em]',
    footer: 'text-base tracking-[0.18em]',
  };

  const getTextColor = () => {
    if (variant === 'dark') return 'text-brand-dark';
    if (variant === 'coral') return 'text-brand-coral';
    return 'text-brand-light';
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold select-none ${getTextColor()} ${sizeClasses[size]} ${className}`}>
      <span>MELIÈRE</span>
    </div>
  );
};
