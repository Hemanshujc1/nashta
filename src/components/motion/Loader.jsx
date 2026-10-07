import React, { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { useUiStore } from '../../store/uiStore';

const KEY = 'naastha-intro-seen';

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

export default function Loader() {
  const setReady = useUiStore((s) => s.setReady);
  const [show] = useState(() => !alreadySeen() && !prefersReducedMotion());
  const [done, setDone] = useState(!show);
  const root = useRef(null);
  const inner = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    if (!show) {
      setReady(true);
      return undefined;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        try {
          sessionStorage.setItem(KEY, '1');
        } catch {
          /* ignore */
        }
      },
    });
    tl.fromTo(inner.current, { opacity: 0, y: 24, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' })
      .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '<0.1')
      .to(inner.current, { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, '+=0.1')
      .call(() => setReady(true))
      .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1');
    return () => tl.kill();
  }, [show, setReady]);

  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[400] bg-[#050506] flex items-center justify-center" aria-hidden="true">
      <div ref={inner} className="flex flex-col items-center gap-6">
        <img src="/nashta-logo.png" alt="" className="w-28 h-28 md:w-36 md:h-36 object-contain" />
        <div className="w-40 h-px bg-white/10 overflow-hidden">
          <div ref={bar} className="h-full bg-[#E52B32] origin-left" />
        </div>
      </div>
    </div>
  );
}
