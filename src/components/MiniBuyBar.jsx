import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useFlavourStore } from '../store/flavourStore';
import { getFlavour, boxCartItem, BOX_SIZE, BOX_PRICE } from '../data/flavours';
import { scrollToTarget } from '../lib/motion';

const MOBILE = '(max-width: 767px)';

// Slim purchase bar that follows the scroll after the hero (PRD v3.1 §2, move 4).
// Hidden while the hero is on screen. Elements marked data-hide-buybar hide it while they are
// in view: "mobile" zones carry their own purchase UI (one bar at a time), "always" zones on every viewport.
export default function MiniBuyBar({ heroSelector = '#hero' }) {
  const activeId = useFlavourStore((s) => s.activeId);
  const box = useFlavourStore((s) => s.box);
  const setBox = useFlavourStore((s) => s.setBox);
  const addItem = useCartStore((s) => s.addItem);
  const isCartOpen = useCartStore((s) => s.isCartOpen);

  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(heroSelector);
    const zones = [...document.querySelectorAll('[data-hide-buybar]')];
    const mobile = window.matchMedia(MOBILE);
    const inView = new Set();

    const sync = () =>
      setBlocked([...inView].some((el) => el.dataset.hideBuybar === 'always' || mobile.matches));

    const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting));
    const zoneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? inView.add(entry.target) : inView.delete(entry.target)));
      sync();
    });

    if (hero) heroObserver.observe(hero);
    zones.forEach((el) => zoneObserver.observe(el));
    mobile.addEventListener('change', sync);
    return () => {
      heroObserver.disconnect();
      zoneObserver.disconnect();
      mobile.removeEventListener('change', sync);
    };
  }, [heroSelector]);

  const flavour = getFlavour(activeId);
  const inBox = box.some((f) => f.id === flavour.id);
  const full = box.length >= BOX_SIZE;

  const handleClick = () => {
    if (full) {
      addItem(boxCartItem(box));
      setBox([]);
    } else if (inBox) {
      scrollToTarget('#build-a-box');
    } else {
      setBox((prev) => [...prev, flavour]);
    }
  };

  let label = 'Add';
  let ariaLabel = `Add ${flavour.name} to your box`;
  let Icon = Plus;
  if (full) {
    label = `Add box · ₹${BOX_PRICE}`;
    ariaLabel = `Add your 3-flavour box to cart for ₹${BOX_PRICE}`;
    Icon = ShoppingBag;
  } else if (inBox) {
    label = 'In box';
    ariaLabel = `${flavour.name} is in your box. Go to the box builder`;
    Icon = Check;
  }

  return (
    <AnimatePresence>
      {pastHero && !blocked && !isCartOpen && (
        <motion.aside
          key="mini-buy-bar"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[45] inset-x-3 bottom-3 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-6 pb-[env(safe-area-inset-bottom)]"
          aria-label="Quick buy"
        >
          <div className="flex items-center gap-3 md:gap-5 pl-4 pr-1.5 py-1.5 rounded-full bg-[#141416]/90 border border-white/10 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-flavour shadow-[0_0_12px_var(--flavour)]" />
              <span className="font-display font-bold text-sm uppercase tracking-wider text-[#F6F3ED] truncate">
                {flavour.name}
              </span>
            </span>

            {/* the full-box button already carries the price, so the offer text yields to the flavour name on mobile */}
            <span className={`text-xs font-semibold uppercase tracking-wider text-[#B7B5B0] whitespace-nowrap ml-auto md:ml-0 ${full ? 'hidden sm:inline' : ''}`}>
              3 for ₹{BOX_PRICE}
              <span className="hidden sm:inline text-[#B7B5B0]/60" aria-hidden="true">
                {' '}· {box.length}/{BOX_SIZE}
              </span>
            </span>

            <button
              onClick={handleClick}
              aria-label={ariaLabel}
              className={`flex items-center justify-center gap-1.5 min-h-11 px-5 rounded-full bg-flavour text-(--flavour-ink) text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-shadow duration-300 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--flavour)_55%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${full ? 'ml-auto sm:ml-0' : ''}`}
            >
              <Icon size={14} strokeWidth={3} />
              {label}
            </button>
          </div>
          <span className="sr-only" aria-live="polite">
            {box.length} of {BOX_SIZE} flavours in your box
          </span>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
