/**
 * Melière Marketing — Brand Identity & Central Configuration
 * Official tokens for color, typography, contact points and metadata.
 */

export const brandTokens = {
  name: 'Melière Marketing',
  legalName: 'Melière Marketing Ltda.',
  year: 2026,
  copyright: '© Melière Marketing — 2026',

  // Official color palette (Phase 1 source of truth)
  colors: {
    coral: '#F15A3C', // Institutional Coral
    light: '#EDEEEE', // Brand Light
    dark: '#1D1D1D',  // Brand Dark
  },

  // Typography tokens
  typography: {
    fontFamily: 'Alexandria, sans-serif',
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Official contact information
  contact: {
    email: 'agenciameliere@gmail.com',
    whatsapp: {
      display: '(41) 98859-5077',
      raw: '5541988595077',
      url: 'https://wa.me/5541988595077?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20a%20estrutura%C3%A7%C3%A3o%20de%20marketing%20do%20meu%20neg%C3%B3cio.',
    },
    instagram: {
      handle: '@meliere.marketing',
      url: 'https://instagram.com/meliere.marketing',
    },
  },

  // Core brand positioning
  tagline: 'Seu negócio não precisa apenas aparecer. Precisa construir presença.',
  subtagline: 'Estruturação, estratégia, conteúdo, tráfego e presença digital construídos com direção, acompanhamento e consistência.',
  ctaText: 'Fale sobre seu negócio',
  pillars: ['Entender', 'Estruturar', 'Comunicar', 'Acompanhar'],
} as const;

export type BrandTokens = typeof brandTokens;
