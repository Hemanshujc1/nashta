import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark', // Default to dark as per PRD
      
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        
        // Update DOM
        if (newTheme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
        
        return { theme: newTheme };
      }),
      
      setTheme: (theme) => set(() => {
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
        return { theme };
      }),
    }),
    {
      name: 'nashta-theme-storage',
      onRehydrateStorage: () => (state) => {
        // Run this when state is loaded from localStorage
        if (state) {
          if (state.theme === 'light') {
            document.documentElement.classList.add('light');
          } else {
            document.documentElement.classList.remove('light');
          }
        }
      },
    }
  )
);
