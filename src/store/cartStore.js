import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const SHIPPING_COST = 50;
export const FREE_SHIPPING_THRESHOLD = 500;

// The cart used to live in localStorage, so lines from old visits reappeared on every load.
if (typeof window !== 'undefined') {
  try {
    window.localStorage.removeItem('nashta-cart-storage');
  } catch {
    // storage blocked: nothing to clean up
  }
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      // The most recent mock order, shown on the success and tracking pages.
      lastOrder: null,

      // Cart Actions
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
        get().openCart();
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      // Mock checkout: no payment is taken. Snapshots the cart as an order and empties it.
      placeOrder: (details) => {
        const state = get();
        const order = {
          orderId: `NAAS-${Math.floor(100000 + Math.random() * 900000)}`,
          placedAt: Date.now(),
          items: state.items,
          subtotal: state.getSubtotal(),
          shipping: state.getShippingInfo().cost,
          total: state.getTotal(),
          ...details,
        };
        set({ lastOrder: order, items: [], isCartOpen: false });
        return order;
      },

      // Selectors / Getters
      getSubtotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getShippingInfo: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return { cost: 0, isFree: false, progress: 0 };
        if (subtotal >= FREE_SHIPPING_THRESHOLD) {
          return { cost: 0, isFree: true, progress: 100 };
        }
        return {
          cost: SHIPPING_COST,
          isFree: false,
          progress: (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
          amountToFree: FREE_SHIPPING_THRESHOLD - subtotal
        };
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingInfo().cost;
        return subtotal + shipping;
      },

      getTotalItems: () => {
          return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      // Session-scoped: the cart survives a refresh but every new visit starts empty.
      name: 'naastha-cart',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ items: state.items, lastOrder: state.lastOrder }),
    }
  )
);
