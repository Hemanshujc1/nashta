import React from 'react';
import { motion } from 'framer-motion';
import { flavours } from '../data/flavours';
import Marquee from './motion/Marquee';

const FACTS = [
  { value: '0g', label: 'Sugar', desc: 'Zero added sugar' },
  { value: '0g', label: 'Cholesterol', desc: 'Zero cholesterol' },
  { value: '0g', label: 'Trans Fat', desc: 'No hydrogenated oils' },
  { value: 'No', label: 'Palm Oil', desc: '100% sunflower oil' },
  { value: '12g', label: 'Protein', desc: 'Per 100g pack' },
];

const NAMES = flavours.map((f) => f.name);
const OUTLINE = 'font-cine font-extrabold uppercase tracking-[-0.02em] text-[#0C0C0E] [paint-order:stroke_fill] [-webkit-text-stroke:2px_rgba(246,243,237,0.34)]';

// S03: flavour-name marquee, then five product facts shown at their final values (no count-up).
export default function NutritionBar() {
  return (
    <section className="relative overflow-hidden bg-[#0C0C0E] border-t border-white/10" aria-labelledby="facts-heading">
      <div className="pt-8 md:pt-10 leading-none" style={{ fontSize: 'clamp(2.75rem, 8vw, 7.5rem)' }}>
        <Marquee items={NAMES} speed={70} itemClassName={OUTLINE} />
        <Marquee items={[...NAMES].reverse()} speed={-40} className="mt-1 md:mt-2 opacity-60" itemClassName={OUTLINE} />
      </div>

      <div className="container mx-auto px-5 md:px-8 max-w-screen-xl py-12 md:py-16">
        <h2 id="facts-heading" className="text-[#B7B5B0] text-xs font-semibold uppercase tracking-[0.3em] mb-8 md:mb-10">
          Big flavour. Clear product facts.
        </h2>

        <ul className="grid grid-cols-2 md:grid-cols-5 gap-y-8 md:divide-x md:divide-white/10">
          {FACTS.map((fact, i) => (
            <motion.li
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`md:px-6 md:first:pl-0 ${i === FACTS.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <div className="font-cine font-extrabold text-[#F6F3ED] leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                {fact.value}
              </div>
              <div className="font-display font-bold uppercase tracking-wider text-sm text-[#E52B32] mt-3">{fact.label}</div>
              <div className="text-sm text-[#B7B5B0] mt-1">{fact.desc}</div>
            </motion.li>
          ))}
        </ul>

        <p className="text-[#B7B5B0]/70 text-xs mt-10">
          Values applicable per standard pack size. Refer to individual flavour packaging for certified lab nutrition statements.
        </p>
      </div>
    </section>
  );
}
