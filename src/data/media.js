// Video slot registry (PRD v3 §4). Drop the real AI-generated files into
// public/media/video/ using these names; until then each slot shows its poster/fallback.
const v = (name) => `/media/video/${name}`;
const p = (name) => `/media/posters/${name}`;

export const MEDIA = {
  // Supplied as one 16:9 file. Add `mobile: v('V01-hero-mobile.mp4')` back once the 9:16 render exists.
  V01: { desktop: v('V01.mp4'), poster: p('V01-hero.webp'), loop: true },
  'V02-cream-n-onion': { desktop: v('V02-creamonion.mp4'), poster: p('V02-creamonion.webp'), loop: true },
  'V02-manchurian': { desktop: v('V02-manchurian.mp4'), poster: p('V02-manchurian.webp'), loop: true },
  'V02-punjabi-tadka': { desktop: v('V02-punjabitadka.mp4'), poster: p('V02-punjabitadka.webp'), loop: true },
  'V02-pizza': { desktop: v('V02-pizza.mp4'), poster: p('V02-pizza.webp'), loop: true },
  'V02-peri-desi': { desktop: v('V02-peridesi.mp4'), poster: p('V02-peridesi.webp'), loop: true },
  'V02-methi-oregano': { desktop: v('V02-methi.mp4'), poster: p('V02-methi.webp'), loop: true },
  V03: { desktop: v('V03.mp4'), poster: p('V03-ingredient-macro.webp'), loop: true },
  V04: { desktop: v('V04.mp4'), poster: p('V04-gifting-reveal.webp'), loop: false },
  V05: { desktop: v('V05-brand-mood.mp4'), poster: p('V05-brand-mood.webp'), loop: false },
  V06: { desktop: v('V06-shruti.mp4'), poster: p('V06-shruti.webp'), loop: false },
  V07: { desktop: v('V07-closing-desktop.mp4'), mobile: v('V07-closing-mobile.mp4'), poster: p('V07-closing.webp'), loop: true },
  V08: { desktop: v('V08-box-explainer.mp4'), poster: p('V08-box-explainer.webp'), loop: false },
  BG1: { desktop: v('BG1-founder-light.mp4'), poster: p('BG1-founder-light.webp'), loop: true },
};
