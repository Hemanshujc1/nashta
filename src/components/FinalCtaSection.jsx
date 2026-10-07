import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MediaSlot from './motion/MediaSlot';
import Magnetic from './motion/Magnetic';
import PackShot from './motion/PackShot';
import { gsap, scrollToTarget } from '../lib/motion';
import { useMotionStore } from '../store/motionStore';
import { useFlavourStore } from '../store/flavourStore';
import { getFlavour, BOX_SIZE, BOX_PRICE } from '../data/flavours';

const DEFAULT_TRIO = ['cream-n-onion', 'peri-desi', 'punjabi-tadka'].map(getFlavour);
const TILT = [-9, 0, 9];

// Stand-in for V07 while the film is missing: the shopper's three packs (or a default trio)
// breathing over a red halo, with a soft floor reflection.
function ClosingStage({ trio }) {
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  return (
    <div className="absolute inset-0 bg-[#050506]" aria-hidden="true">
      <div className="absolute inset-x-0 top-[13%] h-[40%] lg:inset-y-0 lg:left-auto lg:right-[7%] lg:w-[46%] lg:h-auto flex items-center justify-center">
        <div
          className="absolute w-[85%] lg:w-[90%] aspect-square rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(229,43,50,0.62) 0%, rgba(217,183,121,0.16) 45%, transparent 70%)',
            animation: motionEnabled ? 'halo-pulse 6s ease-in-out infinite' : 'none',
          }}
        />
        <div className="relative flex items-center justify-center h-[60%] lg:h-[48%]">
          {trio.map((flavour, i) => (
            <div
              key={flavour.id}
              className={`h-full ${i === 1 ? 'z-10' : '-mx-[4%] mt-[8%]'}`}
              style={{ animation: motionEnabled ? `pack-float 6s ease-in-out ${i * -2}s infinite` : 'none' }}
            >
              <PackShot
                flavour={flavour}
                className={`${i === 1 ? 'h-full' : 'h-[86%]'} shadow-[0_30px_60px_-10px_rgba(0,0,0,0.9)]`}
                style={{
                  transform: `rotate(${TILT[i]}deg)`,
                  WebkitBoxReflect: 'below 10px linear-gradient(transparent 72%, rgba(0,0,0,0.22))',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FinalCtaSection() {
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const box = useFlavourStore((s) => s.box);
  const trio = box.length === BOX_SIZE ? box : DEFAULT_TRIO;
  const root = useRef(null);
  const headline = useRef(null);

  // Headline scales in as the section arrives.
  useLayoutEffect(() => {
    if (!motionEnabled) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headline.current,
        { scale: 1.22, opacity: 0.1 },
        { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 20%', scrub: true } }
      );
    }, root);
    return () => ctx.revert();
  }, [motionEnabled]);

  // Scroll to the section when it is on this page; otherwise let the link navigate.
  const goTo = (selector) => (e) => {
    if (!document.querySelector(selector)) return;
    e.preventDefault();
    scrollToTarget(selector);
  };

  return (
    <section
      ref={root}
      data-hide-buybar="mobile"
      className="relative min-h-[100svh] flex items-end lg:items-center overflow-hidden bg-[#050506]"
      aria-labelledby="final-cta-heading"
    >
      <MediaSlot id="V07" className="absolute inset-0">
        <ClosingStage trio={trio} />
      </MediaSlot>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050506] via-[#050506]/50 to-transparent lg:bg-gradient-to-r lg:via-[#050506]/40" />

      <div className="relative z-10 container mx-auto px-5 md:px-8 max-w-screen-xl pt-[50svh] pb-16 lg:py-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[#E52B32]" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E52B32]">Build your box</span>
          </div>

          <h2
            id="final-cta-heading"
            ref={headline}
            className="font-cine font-extrabold uppercase text-[#F6F3ED] leading-[0.9] tracking-[-0.035em] origin-left will-change-transform"
            style={{ fontSize: 'clamp(2.6rem, 7.5vw, 7rem)' }}
          >
            Pick your three. <span className="block text-[#E52B32]">Make it yours.</span>
          </h2>

          <p className="text-[#B7B5B0] text-base md:text-xl leading-relaxed mt-7 max-w-md">
            Any 3 savoury flavours for ₹{BOX_PRICE}. Whole-wheat atta, no palm oil.
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 mt-10">
            <Magnetic>
              <span className="relative inline-block">
                <span
                  className="absolute -inset-2 rounded-full bg-[#E52B32] blur-xl"
                  style={{ animation: motionEnabled ? 'halo-pulse 2.6s ease-in-out infinite' : 'none', opacity: 0.6 }}
                  aria-hidden="true"
                />
                <Link
                  to="/shop"
                  onClick={goTo('#build-a-box')}
                  className="relative inline-flex items-center gap-3 min-h-[52px] px-9 rounded-full bg-[#E52B32] text-white font-bold text-xs uppercase tracking-[0.2em] transition-transform active:scale-95"
                >
                  Build your box · ₹{BOX_PRICE}
                  <ArrowRight size={16} />
                </Link>
              </span>
            </Magnetic>

            <Link
              to="/flavours"
              onClick={goTo('#flavours')}
              className="inline-flex items-center min-h-[44px] text-[#F6F3ED] text-xs font-semibold uppercase tracking-[0.2em] border-b border-white/30 hover:border-white transition-colors"
            >
              Explore the six flavours
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
