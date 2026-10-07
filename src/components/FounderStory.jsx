import React from 'react';
import { motion } from 'framer-motion';
import MediaSlot from './motion/MediaSlot';
import MaskLines from './motion/MaskLines';
import Reveal from './motion/Reveal';
import { useMotionStore } from '../store/motionStore';

// Placeholder brand statement. Swap for Shruti's own quote and bio once the owner supplies them
// (PRD §8: no invented founder history or words).
const statement = ['Bold desi flavour.', 'Whole-wheat atta.', 'Sunflower oil, never palm.', 'That is the whole brief.'];

const facts = [
  { title: '100% atta', sub: 'No maida in the base' },
  { title: '12g protein', sub: 'Per pack' },
  { title: 'Sunflower oil', sub: 'No palm oil' },
];

// Stand-in for BG1 while the film is missing: warm window light drifting across a charcoal wall.
function WindowLight() {
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  return (
    <div className="absolute inset-0 bg-[#0D0D10]" aria-hidden="true">
      <div
        className="absolute -inset-[25%] blur-2xl"
        style={{
          background:
            'repeating-linear-gradient(90deg, transparent 0 8%, rgba(217,183,121,0.22) 8% 14%, transparent 14% 18%, rgba(217,183,121,0.14) 18% 27%, transparent 27% 42%)',
          transform: 'skewX(-16deg)',
          animation: motionEnabled ? 'light-drift 16s ease-in-out infinite alternate' : 'none',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 35% 45%, transparent 0%, #050506 85%)' }} />
    </div>
  );
}

export default function FounderStory() {
  const motionEnabled = useMotionStore((s) => s.motionEnabled);

  return (
    <section id="founder" className="relative overflow-hidden bg-[#050506] py-24 md:py-36" aria-label="Meet Shruti">
      <MediaSlot id="BG1" className="absolute inset-0">
        <WindowLight />
      </MediaSlot>

      <div className="relative z-10 container mx-auto px-5 md:px-8 max-w-screen-xl">
        <div className="grid lg:grid-cols-[0.8fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Real portrait, revealed from the bottom edge with a slow zoom-settle */}
          <motion.figure
            initial={motionEnabled ? { clipPath: 'inset(100% 0% 0% 0%)' } : false}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-2xl"
          >
            <motion.img
              src="/founder_shruti_1790090437838.jpg"
              alt="Shruti Kashyap, founder of Naastha"
              initial={motionEnabled ? { scale: 1.15 } : false}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-transparent" />
            <div
              className="absolute inset-0 mix-blend-soft-light pointer-events-none"
              style={{ background: 'linear-gradient(120deg, rgba(217,183,121,0.45) 0%, transparent 45%)' }}
            />
            <figcaption className="absolute bottom-5 left-5 right-5">
              <div className="font-serif-cine italic text-2xl text-[#F6F3ED]">Shruti Kashyap</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D9B779] mt-1">Founder · Naastha</div>
            </figcaption>
          </motion.figure>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-px bg-[#E52B32]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E52B32]">The founder</span>
            </div>

            <MaskLines
              trigger
              className="font-cine font-extrabold uppercase text-[#F6F3ED] leading-[0.9] tracking-[-0.035em] mb-10"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
              lines={[{ text: 'Meet' }, { text: 'Shruti.', style: { color: '#D9B779' } }]}
            />

            <MaskLines
              as="p"
              trigger
              stagger={0.16}
              delay={0.2}
              className="font-serif-cine italic text-[#F6F3ED] leading-[1.15] mb-8"
              style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.75rem)' }}
              lines={statement.map((text) => ({ text }))}
            />

            <Reveal delay={0.3}>
              <p className="text-[#B7B5B0] text-base md:text-lg leading-relaxed max-w-[52ch] mb-10">
                Naastha makes six savoury snacks with whole-wheat atta, cooked in sunflower oil and seasoned boldly.
              </p>
              <dl className="grid grid-cols-3 border-t border-white/10">
                {facts.map((fact) => (
                  <div key={fact.title} className="pt-5 pr-4">
                    <dt className="font-cine font-bold text-sm md:text-base uppercase tracking-wide text-[#F6F3ED]">{fact.title}</dt>
                    <dd className="text-xs md:text-sm text-[#9C9A95] mt-1">{fact.sub}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
