import { create } from 'zustand';

export const useMotionStore = create((set) => {
  // Check user system preference
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    motionEnabled: !prefersReduced,
    toggleMotion: () => set((state) => ({ motionEnabled: !state.motionEnabled })),
    setMotionEnabled: (val) => set({ motionEnabled: val }),
  };
});
