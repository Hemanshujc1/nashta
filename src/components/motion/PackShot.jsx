import React from 'react';

// The pack cut out of its product photo using the flavour's `crop` bounds. Size it by height or width; the other follows.
export default function PackShot({ flavour, className = '', style }) {
  const [l, t, r, b] = flavour.crop ?? [0, 0, 1, 1];
  const w = r - l;
  const h = b - t;
  return (
    <div
      role="img"
      aria-label={`${flavour.name} pack`}
      className={`rounded-[6%/4%] bg-no-repeat ${className}`}
      style={{
        aspectRatio: `${w} / ${h}`,
        backgroundImage: `url(${flavour.img})`,
        backgroundSize: `${100 / w}% ${100 / h}%`,
        backgroundPosition: `${(l / (1 - w)) * 100}% ${(t / (1 - h)) * 100}%`,
        ...style,
      }}
    />
  );
}
