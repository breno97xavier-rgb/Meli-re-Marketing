/**
 * Melière Marketing — Navigation Configuration
 * Single source of truth for anchor links, menu items, and page routing.
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const navigationItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'servicos', label: 'Serviços', href: '#servicos' },
  { id: 'metodo', label: 'Método', href: '#metodo' },
  { id: 'sobre', label: 'Sobre', href: '#sobre' },
  { id: 'contato', label: 'Contato', href: '#contato' },
];

export const allSectionIds = [
  'home',
  'introducao',
  'servicos',
  'interludio',
  'metodo',
  'acompanhamento',
  'manifesto',
  'sobre',
  'contato',
] as const;

export type SectionId = typeof allSectionIds[number];

export const ctaConfig = {
  label: 'Fale sobre seu negócio',
  targetAnchor: '#contato',
};
