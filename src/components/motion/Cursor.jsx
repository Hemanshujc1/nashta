import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/motion';

// Dot + trailing ring. Fine pointers only. Use data-cursor="Play" | "Drag" | "View" on elements.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);
  const fill = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    document.documentElement.classList.add('has-cursor');
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' });
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' });
    gsap.set([dot.current, ring.current], { opacity: 0 });

    const move = (e) => {
      xd(e.clientX);
      yd(e.clientY);
      xr(e.clientX);
      yr(e.clientY);
      gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3, overwrite: 'auto' });
    };
    const over = (e) => {
      const t = e.target.closest?.('[data-cursor], a, button, [role="button"], input, select, textarea');
      const text = t?.getAttribute?.('data-cursor') || '';
      label.current.textContent = text;
      gsap.to(ring.current, {
        scale: text ? 2.6 : t ? 1.7 : 1,
        duration: 0.35,
        ease: 'power3.out',
      });
      gsap.to(fill.current, { opacity: text ? 0.92 : 0, duration: 0.35, ease: 'power3.out' });
      gsap.to(dot.current, { scale: text ? 0 : 1, duration: 0.2 });
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="fixed top-0 left-0 z-[500] pointer-events-none -ml-5 -mt-5 w-10 h-10 rounded-full border border-flavour flex items-center justify-center">
        <span ref={fill} className="absolute inset-0 rounded-full bg-flavour opacity-0" />
        <span ref={label} className="relative text-[6px] font-bold uppercase tracking-wider text-white" />
      </div>
      <div ref={dot} className="fixed top-0 left-0 z-[500] pointer-events-none -ml-[3px] -mt-[3px] w-[6px] h-[6px] rounded-full bg-flavour" />
    </>
  );
}
