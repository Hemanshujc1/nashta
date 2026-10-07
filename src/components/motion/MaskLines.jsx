import React, { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion';

// Headline whose lines slide up out of a mask. `play` starts it; `trigger` ties it to scroll instead.
export default function MaskLines({ as: Tag = 'h2', lines, className = '', play = true, delay = 0, stagger = 0.09, trigger = false, style }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const inners = root.current.querySelectorAll('[data-line-inner]');
    if (prefersReducedMotion()) {
      gsap.set(inners, { yPercent: 0 });
      return undefined;
    }
    if (!play) {
      gsap.set(inners, { yPercent: 115 });
      return undefined;
    }
    const tween = gsap.fromTo(
      inners,
      { yPercent: 115, rotate: 3 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger,
        delay,
        ...(trigger ? { scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } } : {}),
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [play, delay, stagger, trigger]);

  return (
    <Tag ref={root} className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <span data-line-inner className={`block will-change-transform ${line.className || ''}`} style={line.style}>
            {line.text}
          </span>
        </span>
      ))}
    </Tag>
  );
}
