import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight, Plus, Check } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useFlavourStore } from '../store/flavourStore';
import { useMotionStore } from '../store/motionStore';
import { flavours, BOX_SIZE, BOX_PRICE } from '../data/flavours';
import { gsap, scrollToTarget } from '../lib/motion';
import Pack3DViewer from './three/Pack3DViewer';
import FlavourAtmosphereCanvas from './three/FlavourAtmosphereCanvas';
import { MediaCrossfade } from './motion/MediaSlot';

const V02_IDS = flavours.map((f) => `V02-${f.id}`);
const EXPO = [0.16, 1, 0.3, 1];
const STACK = '[grid-area:1/1]'; // outgoing and incoming copy share one grid cell, so the layout never jumps
const ARROW =
  'absolute top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center bg-[#141416]/80 hover:bg-[#202023] border border-white/15 text-[#F6F3ED] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white backdrop-blur-md';

function SpiceIndicator({ level }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Spice level ${level} of 5`} role="img">
      <span className="text-[#B7B5B0] text-xs uppercase tracking-wider font-semibold mr-1">Spice</span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${i < level ? 'bg-flavour' : 'bg-white/15'}`} />
      ))}
    </div>
  );
}

// S04 Flavour Studio. On large screens the stage pins for a beat while the flavour film settles behind
// the pack (`pin:` variant, see index.css). Phones and short viewports get the same stage unpinned.
export default function FlavourExplorer() {
  const activeId = useFlavourStore((s) => s.activeId);
  const setActiveId = useFlavourStore((s) => s.setActiveId);
  const box = useFlavourStore((s) => s.box);
  const setBox = useFlavourStore((s) => s.setBox);
  const addItem = useCartStore((s) => s.addItem);
  const motionEnabled = useMotionStore((s) => s.motionEnabled);

  const root = useRef(null);
  const film = useRef(null);
  const [dir, setDir] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const active = Math.max(0, flavours.findIndex((f) => f.id === activeId));
  const current = flavours[active];
  const inBox = box.some((f) => f.id === current.id);
  const boxFull = box.length >= BOX_SIZE;

  // Always step from the store's latest value, so rapid clicks never act on a stale index.
  const goTo = (idx) => {
    const from = flavours.findIndex((f) => f.id === useFlavourStore.getState().activeId);
    const next = (idx + flavours.length) % flavours.length;
    if (next === from) return;
    setDir(idx > from ? 1 : -1);
    setActiveId(flavours[next].id);
  };
  const step = (delta) => goTo(flavours.findIndex((f) => f.id === useFlavourStore.getState().activeId) + delta);

  useEffect(() => {
    if (!addedNotice) return undefined;
    const id = setTimeout(() => setAddedNotice(false), 2500);
    return () => clearTimeout(id);
  }, [addedNotice]);

  // Flavour film zoom-settles (1.15 to 1) as the stage scrolls through.
  useEffect(() => {
    if (!motionEnabled) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        film.current,
        { scale: 1.15 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } }
      );
    }, root);
    return () => ctx.revert();
  }, [motionEnabled]);

  const handleAddToCart = () => {
    addItem({ id: current.id, name: current.name, price: current.price, image: current.img, weight: 100, description: current.desc });
    setAddedNotice(true);
  };

  const handleBox = () => {
    if (inBox || boxFull) scrollToTarget('#build-a-box');
    else setBox((prev) => [...prev, current]);
  };

  const onRailKey = (e) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  };

  const slide = motionEnabled
    ? { initial: { y: `${dir * 105}%` }, animate: { y: 0 }, exit: { y: `${dir * -105}%` }, transition: { duration: 0.55, ease: EXPO } }
    : { initial: false, animate: { y: 0 }, exit: { opacity: 0, transition: { duration: 0 } } };

  return (
    <section ref={root} id="flavours" className="relative bg-[#070708] pin:h-[150svh]" aria-labelledby="flavours-heading">
      <div className="relative overflow-hidden pin:sticky pin:top-0 pin:h-[100svh]">
        {/* V02: flavour world film behind the active pack (falls back to the atmosphere canvas) */}
        <div ref={film} className="absolute inset-0 will-change-transform">
          <MediaCrossfade
            ids={V02_IDS}
            activeId={`V02-${current.id}`}
            duration={500}
            className="absolute inset-0"
            fallback={<FlavourAtmosphereCanvas flavourId={current.id} />}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#070708] via-transparent to-[#070708]" />

        <div className="relative z-10 container mx-auto max-w-screen-xl px-5 md:px-8 pt-24 pb-28 pin:h-full pin:pt-36 flex flex-col">
          <div className="flex items-center justify-between mb-6 pin:mb-2">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-flavour" />
              <h2 id="flavours-heading" className="text-flavour text-xs font-semibold uppercase tracking-[0.3em]">
                Flavour Studio
              </h2>
            </div>
            <span className="text-[#B7B5B0] text-xs font-semibold tracking-[0.3em] tabular-nums" aria-hidden="true">
              0{active + 1} / 0{flavours.length}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-6 lg:gap-12 items-center flex-1 min-h-0">
            {/* Pack stage */}
            <div className="relative lg:order-2">
              <div
                className="absolute inset-0 pointer-events-none blur-2xl"
                style={{ background: 'radial-gradient(circle at 50% 55%, color-mix(in srgb, var(--flavour) 30%, transparent) 0%, transparent 62%)' }}
              />
              <Pack3DViewer flavour={current} bare stageClassName="h-[46svh] min-h-[320px] max-h-[520px] pin:h-[52svh]" className="max-w-[460px] mx-auto" />
              <button type="button" onClick={() => step(-1)} className={`${ARROW} left-0`} aria-label="Previous flavour">
                <ChevronLeft size={22} />
              </button>
              <button type="button" onClick={() => step(1)} className={`${ARROW} right-0`} aria-label="Next flavour">
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Flavour copy */}
            <div className="lg:order-1" aria-live="polite">
              <h3
                className="grid min-h-[1.9em] overflow-hidden font-cine font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-flavour pb-[0.06em]"
                style={{ fontSize: 'clamp(2.6rem, 6.4vw, 6rem)' }}
              >
                <AnimatePresence initial={false}>
                  <motion.span key={current.id} className={`${STACK} block self-end`} {...slide}>
                    {current.name}
                  </motion.span>
                </AnimatePresence>
              </h3>

              <div className="grid mt-4">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.id}
                    className={STACK}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.35, delay: motionEnabled ? 0.2 : 0 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    <p className="text-[#F6F3ED] font-semibold text-lg md:text-xl mb-3">{current.tagline}</p>
                    <p className="text-[#B7B5B0] text-base leading-relaxed max-w-md mb-5">{current.desc}</p>
                    <div className="flex items-center gap-5 flex-wrap">
                      <span className="font-cine font-extrabold text-[#F6F3ED] text-3xl leading-none">₹{current.price}</span>
                      <span className="text-[#B7B5B0] text-xs font-semibold uppercase tracking-wider">{current.weight} pack</span>
                      <SpiceIndicator level={current.spice} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-3 mt-7">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="min-h-12 px-7 font-bold uppercase tracking-widest text-xs md:text-sm bg-flavour text-(--flavour-ink) rounded-full transition-shadow duration-300 hover:shadow-[0_0_40px_color-mix(in_srgb,var(--flavour)_50%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-2"
                  aria-label={`Add ${current.name} to cart for ₹${current.price}`}
                >
                  {addedNotice ? (
                    <>
                      <Check size={16} /> Added to cart
                    </>
                  ) : (
                    `Add to cart · ₹${current.price}`
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBox}
                  className="min-h-12 px-6 font-bold uppercase tracking-widest text-xs md:text-sm text-[#F6F3ED] rounded-full border border-white/25 hover:border-white/60 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-2"
                  aria-label={
                    inBox
                      ? `${current.name} is in your box. Go to the box builder`
                      : boxFull
                      ? 'Your box is full. Go to the box builder'
                      : `Add ${current.name} to your 3 for ₹${BOX_PRICE} box`
                  }
                >
                  {inBox ? <Check size={16} /> : <Plus size={16} />}
                  {inBox ? `In box · ${box.length}/${BOX_SIZE}` : boxFull ? 'Box full' : 'Add to box'}
                </button>

                <Link
                  to={`/product/${current.id}`}
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-white/25 text-[#F6F3ED] hover:bg-white/10 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={`View ${current.name} product details`}
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Flavour rail */}
          <div className="flex items-start justify-center gap-2 md:gap-4 flex-wrap mt-8 pin:mt-4" onKeyDown={onRailKey} role="group" aria-label="Choose a flavour">
            {flavours.map((f, i) => (
              <button
                type="button"
                key={f.id}
                onClick={() => goTo(i)}
                className="group flex flex-col items-center gap-2 p-1.5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={`Select ${f.name} flavour`}
                aria-pressed={i === active}
              >
                <span
                  className="block w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    border: i === active ? `2px solid ${f.accent}` : '2px solid rgba(255,255,255,0.12)',
                    boxShadow: i === active ? `0 0 24px ${f.packColor}70` : 'none',
                    transform: i === active ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <img src={f.img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </span>
                <span
                  className="text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                  style={{ color: i === active ? f.accent : 'rgba(255,255,255,0.5)' }}
                >
                  {f.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
