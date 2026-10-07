import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/motion/PageHero';
import Reveal from '../components/motion/Reveal';
import { useCartStore } from '../store/cartStore';
import { CartLine, ShippingMeter, Totals, DemoNotice, primaryBtn, ghostBtn } from '../components/cart/CartParts';

const Cart = () => {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((n, item) => n + item.quantity, 0);
  const empty = items.length === 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050506] text-[#F6F3ED]">
      <PageHero
        eyebrow="Cart"
        lines={empty ? ['Your cart', 'is empty.'] : ['Your', 'cart.']}
        note={empty ? 'Pick any three flavours and your box is ready for ₹200.' : `${count} ${count === 1 ? 'item' : 'items'}, ready when you are.`}
      >
        {empty && (
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/shop" className={`${primaryBtn} !w-auto`}>
              Build a box <ArrowRight size={16} />
            </Link>
            <Link to="/flavours" className={ghostBtn}>
              See the flavours
            </Link>
          </div>
        )}
      </PageHero>

      {!empty && (
        <section className="container mx-auto max-w-screen-xl px-5 pb-24 md:px-8 md:pb-32">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
            <ul className="border-t border-white/10">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartLine key={item.id} item={item} large />
                ))}
              </AnimatePresence>
            </ul>

            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <aside className="rounded-2xl border border-white/10 bg-[#0D0D10] p-6 md:p-8" aria-label="Order summary">
                <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#E52B32]">Summary</h2>
                <ShippingMeter className="mb-6" />
                <Totals />
                <Link to="/checkout" className={`${primaryBtn} mt-6`}>
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  to="/shop"
                  className="mt-1 flex min-h-[44px] items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-[#B7B5B0] transition-colors hover:text-[#F6F3ED]"
                >
                  Keep shopping
                </Link>
                <DemoNotice className="mt-4" />
              </aside>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
};

export default Cart;
