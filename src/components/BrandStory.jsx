import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaSlot from './motion/MediaSlot';
import { gsap, ScrollTrigger } from '../lib/motion';
import { useMotionStore } from '../store/motionStore';
import PackShot from './motion/PackShot';
import { flavours } from '../data/flavours';

const chapters = [
  {
    id: 'idea',
    number: '01',
    title: 'The Idea',
    headline: 'Breaking the compromise between craving and health.',
    body: 'For generations, the evening Indian snack break was sacred — hot chai, crispy namkeen, and conversation. But modern retail shelves turned it into a guilty habit filled with palm oil, hydrogenated trans fats, and hidden sugars. Naastha began with a singular resolve: rebuild the authentic Indian snack with whole-wheat atta, high protein, and zero compromises.',
    quote: '“Why must snacking well mean eating bland cardboard? We built snacks that satisfy like street food, but fuel like clean nutrition.”',
  },
  {
    id: 'flavour',
    number: '02',
    title: 'The Flavour',
    headline: 'Six regional masteries. Unapologetically bold.',
    body: 'India does not have one flavour; it has thousands. So we made six distinct recipes instead of one generic snack: the buttery crunch of Cream ’n’ Onion, the street-wok garlic rush of Manchurian, the charred mustard and cumin of Punjabi Tadka, herbal Pizza nostalgia, fiery bird’s eye Peri Desi, and the earthy magic of roasted fenugreek Methi.',
    quote: '“Each bite respects where the spice came from. Authentic, roasted, and unmistakably desi.”',
  },
  {
    id: 'ritual',
    number: '03',
    title: 'The Everyday Ritual',
    headline: 'Your 4 PM break, elevated.',
    body: 'Snacking is not a luxury reserved for holidays; it is your everyday recharge between meetings, study sessions, and family evenings. Naastha is designed to live on your desk, in your bag, and in your pantry — providing 12g of protein per pack with clean sunflower oil crunch so you finish your snack energized rather than lethargic.',
    quote: '“Snack time is not a mistake to regret. It is a moment of pure everyday joy.”',
  },
];

const Chapter = ({ ch }) => (
  <div className="space-y-4">
    <div className="overflow-hidden">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9B779] block">
        Chapter {ch.number} · {ch.title}
      </span>
    </div>
    <div className="overflow-hidden">
      <h3 className="font-cine font-black text-2xl md:text-4xl text-[#F6F3ED] uppercase leading-[1.05] tracking-tight">
        {ch.headline}
      </h3>
    </div>
    <p className="text-[#B7B5B0] text-base md:text-lg leading-relaxed font-sans">{ch.body}</p>
    <blockquote className="pl-5 border-l-2 border-[#D9B779] text-[#F6F3ED] font-serif-cine italic text-lg md:text-xl leading-snug">
      {ch.quote}
    </blockquote>
  </div>
);

// Stand-in for V05 while the film is missing: one still per chapter, crossfading with a slow push-in.
const STILL = '/rustic-snacks-hero.jpg';

function StoryStills({ active }) {
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const drift = (seconds) => ({ animation: motionEnabled ? `kenburns ${seconds}s ease-in-out infinite alternate` : 'none' });
  const layer = (i) => `absolute inset-0 transition-opacity duration-1000 ease-out ${i === active ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className="absolute inset-0 bg-[#050506]" aria-hidden="true">
      <div className={layer(0)}>
        <img src={STILL} alt="" className="w-full h-full object-cover object-[60%_50%] opacity-75" style={drift(18)} />
      </div>
      <div className={layer(1)}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 60% at 68% 50%, rgba(229,43,50,0.28) 0%, transparent 70%)' }} />
        <div className="absolute inset-y-0 right-[3%] w-[46%] flex items-center justify-center" style={drift(14)}>
          {flavours.map((flavour, i) => (
            <PackShot
              key={flavour.id}
              flavour={flavour}
              className="h-[28%] -mx-[5%] shadow-[0_24px_40px_-10px_rgba(0,0,0,0.9)]"
              style={{ transform: `rotate(${(i - 2.5) * 5}deg) translateY(${Math.abs(i - 2.5) * 9}%)` }}
            />
          ))}
        </div>
      </div>
      <div className={layer(2)}>
        <img src={STILL} alt="" className="w-full h-full object-cover object-right-top opacity-75 origin-top-right" style={drift(16)} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 45% 55% at 85% 25%, rgba(217,183,121,0.22) 0%, transparent 70%)' }} />
      </div>
    </div>
  );
}

const Backdrop = ({ scrub, trigger, start, end, active = 0 }) => (
  <MediaSlot id="V05" mode={scrub ? 'scrub' : 'auto'} scrubTrigger={trigger} scrubStart={start} scrubEnd={end} className="absolute inset-0">
    <StoryStills active={active} />
  </MediaSlot>
);

export default function BrandStory() {
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const root = useRef(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  // Desktop with motion: pin the section; V05 scrubs and the chapter swaps with scroll progress.
  // Phones and reduced-motion get stacked chapters instead (PRD §9).
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      if (!motionEnabled) return undefined;
      setPinned(true);
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        onUpdate: (self) => setActive(Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length))),
      });
      return () => {
        st.kill();
        setPinned(false);
        setActive(0);
      };
    });
    return () => mm.revert();
  }, [motionEnabled]);

  const current = chapters[active];

  return (
    <section id="our-story" ref={root} className="relative overflow-hidden bg-[#070708]" aria-labelledby="story-heading">
      <div className={pinned ? 'relative h-screen' : 'relative'}>
        {pinned ? (
          <>
            <div className="absolute inset-0">
              <Backdrop scrub trigger={root.current} start="top top" end="+=300%" active={active} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#070708] via-[#070708]/70 to-transparent" />
            <div className="relative z-10 h-full container mx-auto px-8 max-w-screen-xl flex flex-col justify-center">
              <h2 id="story-heading" className="font-cine font-black uppercase text-[#F6F3ED] leading-none mb-10 tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
                Our story, <span className="font-serif-cine italic normal-case text-[#D9B779]">told in flavour</span>
              </h2>
              <div className="max-w-xl min-h-[22rem]">
                <AnimatePresence mode="wait">
                  <motion.div key={current.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                    <Chapter ch={current} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="absolute bottom-10 left-8 right-8 flex gap-2" aria-hidden="true">
                {chapters.map((ch, i) => (
                  <span key={ch.id} className={`h-0.5 flex-1 transition-colors duration-500 ${i <= active ? 'bg-[#E52B32]' : 'bg-white/15'}`} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-5 md:px-8 max-w-screen-xl py-20 md:py-28">
            <h2 id="story-heading-mobile" className="font-cine font-black uppercase text-[#F6F3ED] leading-none mb-10 tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
              Our story, <span className="font-serif-cine italic normal-case text-[#D9B779]">told in flavour</span>
            </h2>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-10 border border-white/10">
              <Backdrop />
            </div>
            <div className="space-y-12 max-w-2xl">
              {chapters.map((ch) => (
                <div key={ch.id}>
                  <Chapter ch={ch} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
