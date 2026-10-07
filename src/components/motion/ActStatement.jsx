import React from 'react';
import MaskLines from './MaskLines';

const MOODS = {
  red: '#E52B32',
  gold: '#D9B779',
  flavour: 'var(--flavour)',
};

// Compact statement band that opens an act of the home page (PRD v3.1 §2, move 1). Sized to its content so sections flow on.
export default function ActStatement({ numeral, name, lines, mood = 'red' }) {
  const colour = MOODS[mood];
  const last = lines.length - 1;

  return (
    <section
      className="relative overflow-hidden bg-[#050506]"
      aria-label={`Act ${numeral}: ${name}`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 90% at 30% 50%, color-mix(in srgb, ${colour} 16%, transparent) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto max-w-screen-xl px-5 md:px-8 py-14 md:py-20">
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-8 h-px" style={{ background: colour }} />
          <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: colour }}>
            Act {numeral} · {name}
          </span>
        </div>

        <MaskLines
          as="p"
          trigger
          className="font-cine font-extrabold uppercase text-[#F6F3ED] leading-[0.95] tracking-[-0.035em]"
          style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
          lines={lines.map((text, i) => ({ text, style: i === last ? { color: colour } : undefined }))}
        />
      </div>
    </section>
  );
}
