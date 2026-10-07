import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/motion';
import { useMotionStore } from '../../store/motionStore';

// Hero scene shown until V01 exists: real pack photos, cropped to the pouch, floating at depth
// over black with a red halo, light sweep and pointer parallax. Replaced by the AI film when present.
const PACKS = [
  { src: '/products/cream-n-onion.jpg', cls: 'left-[52%] top-[17%] w-[26%] -rotate-[7deg]', depth: 10, z: 1, blur: 1.5, opacity: 0.8 },
  { src: '/products/manchurian.jpg', cls: 'left-[76%] top-[24%] w-[24%] rotate-[8deg]', depth: 13, z: 1, blur: 1.5, opacity: 0.8 },
  { src: '/products/peri-desi.jpg', cls: 'left-[62%] top-[30%] w-[34%] rotate-[-2deg]', depth: 24, z: 2, blur: 0, opacity: 1 },
];
const CROP = 'inset(11.5% 25.2% 10% 25.2% round 2.6%)';

export default function HeroFallback() {
  const root = useRef(null);
  const motionEnabled = useMotionStore((s) => s.motionEnabled);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const packs = gsap.utils.toArray('[data-pack]');
      gsap.fromTo(packs, { y: 80, opacity: 0, scale: 0.92 }, { y: 0, opacity: (i) => PACKS[i].opacity, scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.14, delay: 0.3 });
      if (!motionEnabled) return;
      packs.forEach((p, i) => {
        gsap.to(p.firstChild, { y: i === 2 ? -16 : -10, rotate: i === 2 ? 1.2 : 0, duration: 3.6 + i * 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
      gsap.fromTo('[data-sweep]', { xPercent: -140 }, { xPercent: 260, duration: 3.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 3.2 });
      gsap.to('[data-halo]', { scale: 1.12, opacity: 0.85, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }, root);

    let onMove;
    if (motionEnabled && window.matchMedia('(pointer: fine)').matches) {
      const setters = PACKS.map((_, i) => ({
        x: gsap.quickTo(root.current.querySelectorAll('[data-pack]')[i], 'x', { duration: 1.1, ease: 'power3' }),
        y: gsap.quickTo(root.current.querySelectorAll('[data-pack]')[i], 'y', { duration: 1.1, ease: 'power3' }),
      }));
      onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s, i) => {
          s.x(-nx * PACKS[i].depth);
          s.y(-ny * PACKS[i].depth * 0.6);
        });
      };
      window.addEventListener('mousemove', onMove, { passive: true });
    }
    return () => {
      ctx.revert();
      if (onMove) window.removeEventListener('mousemove', onMove);
    };
  }, [motionEnabled]);

  return (
    <div ref={root} className="absolute inset-0 bg-[#050506]" aria-hidden="true">
      <div data-halo className="absolute left-[44%] top-[10%] w-[70%] aspect-square rounded-full opacity-60 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(229,43,50,0.5) 0%, rgba(229,43,50,0.08) 55%, transparent 70%)' }} />
      <div className="absolute right-0 top-0 w-1/2 h-1/2" style={{ background: 'radial-gradient(circle at 80% 0%, rgba(217,183,121,0.16), transparent 60%)' }} />
      {PACKS.map((p) => (
        <div key={p.src} data-pack className={`absolute ${p.cls} aspect-square opacity-0`} style={{ zIndex: p.z, filter: `drop-shadow(0 40px 50px rgba(0,0,0,0.65)) ${p.blur ? `blur(${p.blur}px)` : ''}` }}>
          <img src={p.src} alt="" draggable="false" className="w-full h-full object-cover select-none" style={{ clipPath: CROP, transform: 'scale(1)' }} />
        </div>
      ))}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-soft-light">
        <div data-sweep className="absolute -top-1/4 left-0 w-1/4 h-[150%] -rotate-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,235,200,0.55), transparent)' }} />
      </div>
      {/* reflective floor */}
      <div className="absolute inset-x-0 bottom-0 h-[28%]" style={{ background: 'linear-gradient(to top, #050506 15%, transparent)' }} />
    </div>
  );
}
