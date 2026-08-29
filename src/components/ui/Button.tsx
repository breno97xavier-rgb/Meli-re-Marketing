import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  id,
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-brand-coral focus-visible:outline-offset-2';

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-xs rounded-none gap-2',
    md: 'px-7 py-3.5 text-xs sm:text-sm rounded-none gap-2.5',
    lg: 'px-9 py-4.5 text-sm sm:text-base rounded-none gap-3',
  };

  const variantClasses = {
    primary:
      'bg-brand-coral text-white hover:bg-[#de492c] active:bg-[#c93d22] shadow-sm',
    secondary:
      'bg-brand-light text-brand-dark hover:bg-white active:bg-[#e0e1e1]',
    outline:
      'border border-brand-light/30 text-brand-light hover:border-brand-coral hover:text-brand-coral bg-transparent',
    ghost:
      'text-brand-light/80 hover:text-brand-coral bg-transparent hover:bg-brand-light/5',
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    const isAnchor = href.startsWith('#');
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isAnchor) {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
      if (onClick) {
        onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    };

    return (
      <a
        id={id}
        href={href}
        onClick={handleAnchorClick}
        target={isExternal && !href.startsWith('mailto:') ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={combinedClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      id={id}
      type="button"
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
