import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { getFlavour } from '../data/flavours';
import PackShot from './motion/PackShot';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const flavour = getFlavour(product.id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-[#0D0D10] border border-white/[0.08] transition-[border-color,box-shadow] duration-[400ms] hover:border-[var(--c)] hover:shadow-[0_0_44px_-10px_var(--c)] focus-within:border-[var(--c)]"
      style={{ '--c': flavour.accent }}
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden" aria-label={`View ${product.name}`}>
        <div
          className="absolute inset-0 opacity-70 transition-opacity duration-[400ms] group-hover:opacity-100"
          style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 60%, color-mix(in srgb, var(--c) 34%, transparent) 0%, transparent 72%)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <PackShot
            flavour={flavour}
            className="h-[84%] shadow-[0_24px_40px_-12px_rgba(0,0,0,0.9)] transition-transform duration-[400ms] ease-out group-hover:scale-105 group-hover:-rotate-2"
          />
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-1" aria-label={`Spice level ${product.spiceLevel} of 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="w-1.5 h-1.5 rounded-full" style={{ background: n <= product.spiceLevel ? 'var(--c)' : 'rgba(255,255,255,0.18)' }} />
          ))}
        </div>
      </Link>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-cine font-extrabold text-2xl uppercase leading-none tracking-[-0.02em] text-[#F6F3ED]">{product.name}</h3>
          </Link>
          <div className="font-cine font-bold text-xl text-[#F6F3ED]">₹{product.price}</div>
        </div>
        <p className="text-[#9C9A95] text-sm mt-2 mb-6 flex-grow">
          {flavour.tagline} · {product.weight}g
        </p>

        <button
          type="button"
          onClick={() => addItem(product)}
          className="group/btn w-full min-h-[48px] rounded-full border border-white/15 text-[#F6F3ED] text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-[var(--c)] hover:border-[var(--c)] hover:text-[var(--ink)] active:scale-[0.98]"
          style={{ '--ink': flavour.ink }}
        >
          Add to cart <Plus size={16} className="transition-transform duration-300 group-hover/btn:rotate-90" />
        </button>
      </div>
    </motion.article>
  );
}
