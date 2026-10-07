import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/motion';
import { useMotionStore } from '../../store/motionStore';

// Endless text strip (PRD v3 §6 Text). `speed` is px/s; negative runs right. Reverses with scroll direction.
export default function Marquee({ items, speed = 60, className = '', itemClassName = '', separator = '·' }) {
  const track = useRef(null);
  const motionEnabled = useMotionStore((s) => s.motionEnabled);

  useEffect(() => {
    if (!motionEnabled) return undefined;
    const el = track.current;
    const half = el.scrollWidth / 2;
    const base = Math.sign(speed) || 1;
    const tween = gsap.fromTo(el, { x: 0 }, { x: -half, duration: half / Math.abs(speed), ease: 'none', repeat: -1 });
    tween.totalTime(tween.duration() * 500); // far from the start so it can also run backwards
    tween.timeScale(base);
    const st = ScrollTrigger.create({
      onUpdate: (self) => gsap.to(tween, { timeScale: base * self.direction, duration: 0.5, overwrite: true }),
    });
    return () => {
      st.kill();
      gsap.killTweensOf(tween);
      tween.kill();
      gsap.set(el, { x: 0 });
    };
  }, [motionEnabled, speed, items]);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <div ref={track} className="inline-flex will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {items.map((item) => (
              <span key={item} className={`shrink-0 ${itemClassName}`}>
                {item}
                <span className="mx-[0.35em]">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
