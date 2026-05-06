/**
 * VENNA — config visual e identidade da artista para o pipeline YouTube.
 *
 * O CREF_URL é a imagem âncora da VENNA no Midjourney — usada em todos os
 * prompts via --cref para garantir consistência facial/personagem.
 */

export const VENNA_CONFIG = {
  /** URL Midjourney da imagem âncora da VENNA. Usada como --cref em cada scene prompt. */
  CREF_URL: "https://cdn.midjourney.com/9069acf8-54d1-4a88-8bc3-437608cff008/0_1.jpeg",

  /** Paleta da artista (hex). */
  PALETTE: {
    mango: "#F5803E",
    honey: "#E8B14A",
    terracotta: "#A14E2C",
    cream: "#F4E4D1",
    wine: "#3D1B2C",
    sunset_pink: "#E89B8C",
  },

  /** Fonte default para lyric overlay. */
  FONT_OVERLAY: "Cormorant Garamond",

  /** Aspect ratios. */
  ASPECT_MAIN: "16:9",
  ASPECT_SHORTS: "9:16",
} as const;
