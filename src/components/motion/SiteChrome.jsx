import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { gsap } from '../../lib/motion';

// Film grain + scroll progress bar + route curtain.
export function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    const set = gsap.quickSetter(bar.current, 'scaleX');
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      set(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div ref={bar} className="fixed top-0 left-0 right-0 h-[2px] z-[260] bg-flavour origin-left pointer-events-none" style={{ transform: 'scaleX(0)' }} />;
}

export const Grain = () => <div className="film-grain" aria-hidden="true" />;

export function PageCurtain() {
  const { pathname } = useLocation();
  const prev = useRef(pathname);
  const [key, setKey] = React.useState(0);
  useEffect(() => {
    if (prev.current !== pathname) {
      prev.current = pathname;
      setKey((k) => k + 1);
    }
  }, [pathname]);
  if (!key) return null;
  return (
    <motion.div
      key={key}
      initial={{ y: '0%' }}
      animate={{ y: '-100%' }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
      className="fixed inset-0 z-[300] bg-[#050506] pointer-events-none"
    />
  );
}
