import React, { useEffect } from 'react';
import PageHero from '../components/motion/PageHero';
import Marquee from '../components/motion/Marquee';
import FlavourExplorer from '../components/FlavourExplorer';
import BundleBuilder from '../components/BundleBuilder';
import { useFlavourStore } from '../store/flavourStore';
import { useFlavourTint } from '../lib/useFlavourTint';
import { flavours, getFlavour, BOX_PRICE } from '../data/flavours';

export default function Flavours() {
  const activeId = useFlavourStore((s) => s.activeId);
  useFlavourTint(getFlavour(activeId));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#050506] text-[#F6F3ED]">
      <PageHero
        eyebrow="The flavours"
        colour="var(--flavour)"
        lines={['Six flavours.', 'Choose', 'your three.']}
        note={`Turn each pack around in the studio, then box any three for ₹${BOX_PRICE}.`}
      />
      <Marquee
        items={flavours.map((f) => f.name)}
        speed={70}
        className="py-6 border-y border-white/10"
        itemClassName="font-cine font-extrabold uppercase text-outline text-5xl md:text-8xl tracking-[-0.03em]"
      />
      <FlavourExplorer />
      <BundleBuilder />
    </div>
  );
}
