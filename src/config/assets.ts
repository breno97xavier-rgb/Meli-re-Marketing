/**
 * Melière Marketing — Centralized Assets Configuration
 * 
 * Central asset registry for the application.
 * All brand marks, media placeholders, and upcoming URLs must be registered here.
 * Components must NEVER hardcode external media URLs directly.
 */

export interface AssetCategory {
  [key: string]: string | null;
}

export const assets = {
  brand: {
    // Official logo & symbol URLs (Transparent PNGs)
    logoDark: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/1.png',          // Dark logo for light backgrounds (1.png)
    logoLight: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/2.png',         // Light logo for dark backgrounds (2.png)
    symbolLight: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/4.png',       // Isolated light symbol (4.png)
    symbolCoralWhite: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/5%20(2).png', // Coral symbol with white accent (5 (2).png) - for dark bg
    symbolCoralBlack: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3.png',       // Coral symbol with black accent (3.png) - for light bg
    wordmarkOfficial: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Logos/Design%20sem%20nome%20(22).png', // Official typography wordmark with symbol in 'è' + marketing & estruturação
    pattern: null as string | null, // Brand texture/pattern
  },

  // -------------------------------------------------------------
  // ATO 02: CONTEÚDO & SOCIAL MEDIA
  // -------------------------------------------------------------
  mansue: {
    name: 'Mansuè Café & Bistrô',
    posts: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Mansue/7.png',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Mansue/8.png',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Mansue/9.png',
    ],
    reels: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Img%20e%20videos/2.mp4',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Img%20e%20videos/5.mp4',
    ],
  },

  editalSocial: {
    name: 'Edital Concursos',
    posts: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Edital/1.png',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Edital/12.png',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Edital/6.png',
    ],
  },

  lanternaSocial: {
    name: 'Lanterna Mágica',
    posts: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Lanterna/SaveClip.App_474059739_18355947340131451_8568047276582953469_n.jpg',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Lanterna/SaveClip.App_476232300_18358191577131451_1514655873799063041_n.jpg',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/3%20Posts%20Lanterna/SaveClip.App_774196597_18437429719131451_6793006346319876249_n.jpg',
    ],
  },

  // -------------------------------------------------------------
  // ATO 03: PERFORMANCE & TRÁFEGO PAGO
  // -------------------------------------------------------------
  editalAds: {
    name: 'Edital Concursos — Campanhas',
    creatives: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Anuncios%20Edital/1.png',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Anuncios%20Edital/2.png',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Anuncios%20Edital/3.png',
    ],
  },

  // -------------------------------------------------------------
  // ATO 04: PRESENÇA DIGITAL & IDENTIDADE
  // -------------------------------------------------------------
  editalWeb: {
    name: 'Edital Concursos — Presença Web & Identidade',
    desktop: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/Captura%20de%20tela%202026-08-27%20124602.png',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/Captura%20de%20tela%202026-08-27%20124616.png',
    ],
    mobile: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/WhatsApp%20Image%202026-08-26%20at%2010.06.51.jpeg',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/WhatsApp%20Image%202026-08-26%20at%2010.07.17.jpeg',
    ],
    branding: {
      logo: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Editora/Logos/1.png',
      symbol: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Editora/Logos/2.png',
    },
  },

  lanternaWeb: {
    name: 'Lanterna Mágica — Presença Web & Identidade',
    desktop: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/Captura%20de%20tela%202026-08-27%20124715.png',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/Captura%20de%20tela%202026-08-27%20124744.png',
    ],
    mobile: [
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/WhatsApp%20Image%202026-08-26%20at%2010.06.20.jpeg',
      'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Site/Screenshots/WhatsApp%20Image%202026-08-26%20at%2010.06.33.jpeg',
    ],
    branding: {
      logo: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Editora/Logos/1%20(2).png',
      symbol: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Editora/Logos/2%20(1).png',
    },
  },

  social: {
    instagramIcon: null as string | null,
    whatsappIcon: null as string | null,
    emailIcon: null as string | null,
  },

  video: {
    heroShowreel: null as string | null,
    methodExplainer: null as string | null,
  },

  about: {
    // 01. Protagonist Editorial Photograph (Main Founder Portrait)
    founderMain: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Editora/Fotos%20minhas/ChatGPT%20Image%2024%20de%20ago.%20de%202026,%2017_57_20.png',
    // 02. Secondary Editorial Photograph (Offset supporting moment)
    founderSecondary: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Editora/Fotos%20minhas/ChatGPT%20Image%2024%20de%20ago.%20de%202026,%2017_52_39.png',
    // 03. Institutional Reserve Photograph (Registered for future use - not used in current home)
    institutionalReserve: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Editora/Fotos%20minhas/ChatGPT%20Image%2024%20de%20ago.%20de%202026,%2018_12_27.png',
    // 04. Fourth Photograph (Registered for future use - not used in current home)
    fourthPhotoReserve: 'https://ycagvwsvccgdjzpbhrfi.supabase.co/storage/v1/object/public/Editora/Fotos%20minhas/ChatGPT%20Image%2024%20de%20ago.%20de%202026,%2017_54_41.png',
    foundingPortrait: null as string | null,
    workspaceAmbient: null as string | null,
  },

  openGraph: {
    mainBanner: null as string | null,
    cardPreview: null as string | null,
  },
} as const;

export type AssetsConfig = typeof assets;
