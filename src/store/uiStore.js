import { create } from 'zustand';

// `ready` flips true once the intro curtain starts lifting, so hero choreography can begin.
export const useUiStore = create((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
}));
