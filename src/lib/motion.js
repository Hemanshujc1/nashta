import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Shared easing tokens (PRD v3 §6)
export const EASE = {
  out: 'expo.out',
  inOut: 'expo.inOut',
  soft: 'power3.out',
};

let lenis = null;
export const setLenis = (instance) => {
  lenis = instance;
};
export const getLenis = () => lenis;

// Smooth-scroll to an element/selector/number, using Lenis when it is active.
export const scrollToTarget = (target, offset = -88) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (lenis) {
    lenis.scrollTo(el ?? target, { offset, duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else if (el?.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };
