import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis, getLenis } from '../../lib/motion';
import { useMotionStore } from '../../store/motionStore';

export default function SmoothScroll() {
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!motionEnabled) return undefined;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [motionEnabled]);

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const id = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(id);
  }, [pathname]);

  return null;
}
