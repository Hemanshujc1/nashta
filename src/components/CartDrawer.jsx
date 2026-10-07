import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { CartLine, ShippingMeter, Totals, primaryBtn } from './cart/CartParts';

export default function CartDrawer() {
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const count = items.reduce((n, item) => n + item.quantity, 0);

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, closeCart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 top-0 z-[90] flex w-full flex-col border-l border-white/10 bg-[#0D0D10] text-[#F6F3ED] md:w-[460px]"
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 className="font-cine text-3xl font-extrabold uppercase leading-none tracking-[-0.03em]">
                Your cart
                <span className="ml-2 align-top text-sm font-semibold tracking-normal text-[#9C9A95]">{count}</span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition-colors hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {items.length > 0 && <ShippingMeter className="px-6 pb-4" />}

            <div className="flex-grow overflow-y-auto border-t border-white/10 px-6" data-lenis-prevent>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-serif-cine text-4xl italic leading-tight text-[#F6F3ED]">Nothing here yet.</p>
                  <p className="mt-3 max-w-[26ch] text-sm text-[#9C9A95]">Pick any three flavours and your box is ready for ₹200.</p>
                  <Link to="/shop" onClick={closeCart} className={`${primaryBtn} mt-8 !w-auto`}>
                    Build a box <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartLine key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 bg-[#141416] px-6 pb-6 pt-4">
                <Totals />
                <Link to="/checkout" onClick={closeCart} className={`${primaryBtn} mt-5`}>
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="mt-1 flex min-h-[44px] items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-[#B7B5B0] transition-colors hover:text-[#F6F3ED]"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
