import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { BOX_PRICE } from '../data/flavours';
import ProductCard from '../components/ProductCard';
import BundleBuilder from '../components/BundleBuilder';
import PageHero from '../components/motion/PageHero';

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'mild', label: 'Mild', test: (p) => p.spiceLevel <= 2 },
  { id: 'spicy', label: 'Spicy', test: (p) => p.spiceLevel >= 3 },
];

export default function Shop() {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visible = products.filter(FILTERS.find((f) => f.id === filter).test);

  return (
    <div className="w-full bg-[#050506] text-[#F6F3ED]">
      <PageHero
        eyebrow="Shop"
        lines={['Build a box.', 'Or stock up.']}
        note={`Any 3 flavours for ₹${BOX_PRICE}, or single 100g packs.`}
      />

      {/* S05 Bundle Builder */}
      <BundleBuilder />

      <section className="container mx-auto max-w-screen-xl px-5 md:px-8 py-24 md:py-32" aria-labelledby="packs-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-8 border-b border-white/10">
          <div>
            <h2
              id="packs-heading"
              className="font-cine font-extrabold uppercase leading-[0.9] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
            >
              Single <span className="text-[#E52B32]">packs</span>
            </h2>
            <p className="text-[#B7B5B0] text-base md:text-lg mt-4 max-w-md">Stock up on the flavours you already love.</p>
          </div>

          <div className="flex items-center gap-1 p-1.5 rounded-full bg-[#0D0D10] border border-white/10 self-start md:self-auto" role="group" aria-label="Filter by spice">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className="relative min-h-[44px] px-6 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
              >
                {filter === f.id && (
                  <motion.span layoutId="shop-filter" className="absolute inset-0 rounded-full bg-[#F6F3ED]" transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} />
                )}
                <span className={`relative transition-colors duration-200 ${filter === f.id ? 'text-[#050506]' : 'text-[#B7B5B0]'}`}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
