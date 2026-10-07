import { useEffect } from 'react';

// Tints glows, cursor ring, scroll progress and buy buttons with a flavour colour while the caller is mounted.
export function useFlavourTint({ accent, ink }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--flavour', accent);
    root.style.setProperty('--flavour-ink', ink);
    return () => {
      root.style.removeProperty('--flavour');
      root.style.removeProperty('--flavour-ink');
    };
  }, [accent, ink]);
}
