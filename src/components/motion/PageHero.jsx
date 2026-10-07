import React from 'react';
import MaskLines from './MaskLines';

// Opening statement for an inner page: eyebrow, masked headline, one line of body.
export default function PageHero({ eyebrow, lines, note, colour = '#E52B32', children }) {
  const last = lines.length - 1;
  return (
    <header className="relative overflow-hidden bg-[#050506] pt-40 md:pt-52 pb-14 md:pb-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 65% 70% at 75% 20%, color-mix(in srgb, ${colour} 18%, transparent) 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10 container mx-auto max-w-screen-xl px-5 md:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="block w-8 h-px" style={{ background: colour }} />
          <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: colour }}>
            {eyebrow}
          </span>
        </div>
        <MaskLines
          as="h1"
          className="font-cine font-extrabold uppercase text-[#F6F3ED] leading-[0.9] tracking-[-0.035em]"
          style={{ fontSize: 'clamp(2.6rem, 8.5vw, 8rem)' }}
          lines={lines.map((text, i) => ({ text, style: i === last ? { color: colour } : undefined }))}
        />
        {note && <p className="text-[#B7B5B0] text-base md:text-xl mt-7 max-w-xl leading-relaxed">{note}</p>}
        {children}
      </div>
    </header>
  );
}
