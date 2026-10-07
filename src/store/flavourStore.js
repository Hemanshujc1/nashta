import { create } from 'zustand';
import { DEFAULT_FLAVOUR_ID } from '../data/flavours';

// Active flavour (drives --flavour) and the in-progress 3-flavour box, shared by the
// Flavour Studio, Box Builder and mini buy bar.
export const useFlavourStore = create((set) => ({
  activeId: DEFAULT_FLAVOUR_ID,
  setActiveId: (activeId) => set({ activeId }),

  box: [],
  setBox: (next) => set((state) => ({ box: typeof next === 'function' ? next(state.box) : next })),
}));
