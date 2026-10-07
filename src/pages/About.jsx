import React, { useEffect } from 'react';
import PageHero from '../components/motion/PageHero';
import Reveal from '../components/motion/Reveal';
import BrandStory from '../components/BrandStory';
import FounderStory from '../components/FounderStory';
import FinalCtaSection from '../components/FinalCtaSection';

const goesIn = ['Whole-wheat atta', 'Sunflower oil', '12g protein per pack', 'Six bold flavours'];
const staysOut = ['Palm oil', 'Added sugar', 'Trans fat', 'Cholesterol'];

const Ledger = ({ title, items, colour, struck }) => (
  <div>
    <div className="text-xs font-semibold uppercase tracking-[0.3em] mb-6" style={{ color: colour }}>
      {title}
    </div>
    <ul className="border-t border-white/10">
      {items.map((item, i) => (
        <Reveal key={item} delay={i * 0.06} y={16}>
          <li
            className={`py-5 border-b border-white/10 font-cine font-extrabold uppercase leading-none tracking-[-0.02em] ${
              struck ? 'text-[#9C9A95] line-through decoration-[#E52B32] decoration-2' : 'text-[#F6F3ED]'
            }`}
            style={{ fontSize: 'clamp(1.6rem, 3.6vw, 3.25rem)' }}
          >
            {item}
          </li>
        </Reveal>
      ))}
    </ul>
  </div>
);

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#050506] text-[#F6F3ED]">
      <PageHero
        eyebrow="Our story"
        colour="#D9B779"
        lines={['Bold flavour.', 'Honest', 'ingredients.']}
        note="Naastha makes savoury snacks with whole-wheat atta and sunflower oil. This is what goes in, what stays out, and who is behind it."
      />

      <BrandStory />

      <section className="bg-[#050506] py-24 md:py-36" aria-label="What goes in and what stays out">
        <div className="container mx-auto max-w-screen-xl px-5 md:px-8 grid md:grid-cols-2 gap-14 md:gap-20">
          <Ledger title="What goes in" items={goesIn} colour="#D9B779" />
          <Ledger title="What stays out" items={staysOut} colour="#E52B32" struck />
        </div>
      </section>

      <FounderStory />
      <FinalCtaSection />
    </div>
  );
}
