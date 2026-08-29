import React from 'react';

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  theme?: 'light' | 'dark';
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  href,
  children,
  className = '',
  active = false,
  theme = 'dark',
  onClick,
}) => {
  const isAnchor = href.startsWith('#');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnchor) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (onClick) {
      onClick(e);
    }
  };

  const getTextColor = () => {
    if (active) return 'text-brand-coral font-semibold';
    if (theme === 'light') return 'text-brand-dark hover:text-brand-coral font-medium';
    return 'text-brand-light/75 hover:text-brand-light font-medium';
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`group relative inline-flex items-center py-1 text-xs uppercase tracking-[0.2em] transition-colors duration-200 ${getTextColor()} ${className}`}
    >
      <span>{children}</span>
      <span
        className={`absolute bottom-0 left-0 h-[1.5px] bg-brand-coral transition-all duration-300 ${
          active ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
        aria-hidden="true"
      />
    </a>
  );
};
