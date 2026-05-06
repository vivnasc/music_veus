/**
 * NOVA — config visual e identidade da artista para o pipeline YouTube.
 *
 * O CREF_URL é a imagem âncora da NOVA no Midjourney — usada em todos os
 * prompts via --cref para garantir consistência visual.
 *
 * NOVA é pop ético/profético. Visual mais conceptual que o de VENNA:
 * texturas, glitch, luz crua, paleta que vai do violeta-azul (STATIC) ao
 * dourado-cream (LIGHT) ao longo dos 10 álbuns.
 */

export const NOVA_CONFIG = {
  /** URL Midjourney da imagem âncora da NOVA. Usada como --cref em cada scene prompt. */
  CREF_URL: "https://cdn.midjourney.com/9a1506d4-9af0-4530-a8e1-cb90e2902f05/0_1.jpeg",

  /** Paleta da artista por álbum (hex). */
  PALETTE: {
    static: "#3b3b6e",      // violeta-azul, ruído digital
    skin: "#a05a6e",         // rosa quente, pele
    machine: "#5a6e8a",      // azul-aço, cool
    alone: "#6e6e8a",        // cinza-violeta, vazio
    burn: "#a85a3b",         // laranja-queimado, fogo
    water: "#5a8aa8",        // azul-água, fluido
    air: "#a8c0c8",          // azul-pálido, céu
    time: "#8a7e5a",         // âmbar-castanho, ancestral
    love: "#c08aaa",          // rosa, ternura
    light: "#e8d8a8",        // dourado-cream, luz
  },

  /** Fonte default para lyric overlay. */
  FONT_OVERLAY: "Cormorant Garamond",

  /** Aspect ratios. */
  ASPECT_MAIN: "16:9",
  ASPECT_SHORTS: "9:16",
} as const;
