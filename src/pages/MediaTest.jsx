import React, { useState } from 'react';
import MediaSlot, { MediaCrossfade } from '../components/motion/MediaSlot';
import HeroFallback from '../components/motion/HeroFallback';
import FlavourAtmosphereCanvas from '../components/three/FlavourAtmosphereCanvas';
import IngredientMacroCanvas from '../components/three/IngredientMacroCanvas';
import GiftingRevealCanvas from '../components/three/GiftingRevealCanvas';
import ClosingSceneCanvas from '../components/three/ClosingSceneCanvas';
import { MEDIA } from '../data/media';

// Dev-only route (/media-test): every slot in the registry, in the mode the PRD v3 §4 gives it.
const FLAVOUR_IDS = Object.keys(MEDIA).filter((id) => id.startsWith('V02-'));
const SLOTS = [
  { id: 'V01', mode: 'auto', aspect: 'aspect-video', fallback: <HeroFallback /> },
  { id: 'V03', mode: 'scrub', aspect: 'aspect-video', fallback: <IngredientMacroCanvas /> },
  { id: 'V04', mode: 'once', aspect: 'h-[320px] md:h-[400px]', fallback: <GiftingRevealCanvas /> },
  { id: 'V05', mode: 'scrub', aspect: 'aspect-video' },
  { id: 'V06', mode: 'click', aspect: 'aspect-[4/5] max-w-sm' },
  { id: 'V07', mode: 'auto', aspect: 'h-[320px] md:h-[420px]', fallback: <ClosingSceneCanvas /> },
  { id: 'V08', mode: 'click', aspect: 'aspect-video' },
  { id: 'BG1', mode: 'auto', aspect: 'aspect-[4/5] max-w-sm' },
];

const Label = ({ children }) => (
  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#B7B5B0] font-sans">{children}</p>
);

export default function MediaTest() {
  const [flavour, setFlavour] = useState(FLAVOUR_IDS[0]);

  return (
    <div className="container mx-auto max-w-screen-lg px-5 md:px-8 py-24 text-[#F6F3ED]">
      <h1 className="font-display font-black uppercase text-3xl mb-10">Media slots</h1>

      <section className="mb-12">
        <Label>V02 · crossfade · {flavour}</Label>
        <MediaCrossfade
          ids={FLAVOUR_IDS}
          activeId={flavour}
          className="aspect-square max-w-xl rounded-3xl border border-white/10"
          fallback={<FlavourAtmosphereCanvas flavourId={flavour.replace('V02-', '')} />}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {FLAVOUR_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFlavour(id)}
              aria-pressed={id === flavour}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${id === flavour ? 'border-[#E52B32] text-[#F6F3ED]' : 'border-white/10 text-[#B7B5B0]'}`}
            >
              {id.replace('V02-', '')}
            </button>
          ))}
        </div>
      </section>

      {SLOTS.map(({ id, mode, aspect, fallback }) => (
        <section key={id} className="mb-12">
          <Label>
            {id} · {mode} · {fallback ? 'canvas fallback' : 'poster only'}
          </Label>
          <MediaSlot id={id} mode={mode} className={`${aspect} rounded-3xl border border-white/10`}>
            {fallback}
          </MediaSlot>
        </section>
      ))}
    </div>
  );
}
