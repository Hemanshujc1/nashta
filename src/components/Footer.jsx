import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMotionStore } from '../store/motionStore';

const WORDMARK = 'NAASTHA'.split('');

export default function Footer() {
  const year = new Date().getFullYear();
  const motionEnabled = useMotionStore((s) => s.motionEnabled);

  return (
    <footer
      data-hide-buybar="always"
      className="relative pt-16 pb-6 bg-[#050506] border-t border-white/10 overflow-hidden"
    >
      {/* Warm top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D9B779]/20 to-transparent" />

      <div className="container mx-auto px-5 md:px-8 max-w-screen-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-5" aria-label="Naastha Home">
              <img
                src="/nashta-logo.png"
                alt="Naastha"
                className="h-12 object-contain"
              />
            </Link>
            <p className="text-[#B7B5B0] text-sm leading-relaxed mb-5 font-normal font-sans max-w-xs">
              Premium Indian savoury snacks. Six bold flavours, boldly reimagined.
              Made with whole-wheat atta, cooked in sunflower oil, zero shortcuts.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#B7B5B0] hover:text-white border border-white/10 hover:border-white/30 transition-all bg-[#141416]"
                aria-label="Naastha on Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#B7B5B0] hover:text-white border border-white/10 hover:border-white/30 transition-all bg-[#141416]"
                aria-label="Naastha on YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96C1 8.12 1 12 1 12s0 3.88.46 5.58a2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95C23 15.88 23 12 23 12s0-3.88-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#B7B5B0] hover:text-white border border-white/10 hover:border-white/30 transition-all bg-[#141416] text-xs font-bold"
                aria-label="Naastha on X"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-[#F6F3ED] mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'All Flavours', to: '/flavours' },
                { label: 'Build a Box — ₹200', to: '/shop' },
                { label: 'Gifting & Hampers', to: '/shop' },
                { label: 'Shop All', to: '/shop' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[#B7B5B0] text-sm hover:text-white transition-colors font-normal font-sans"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-[#F6F3ED] mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Our Story', to: '/about' },
                { label: 'Meet Shruti', to: '/about#founder' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'FAQs', to: '/faq' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[#B7B5B0] text-sm hover:text-white transition-colors font-normal font-sans"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-[#F6F3ED] mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Track Order', to: '/track' },
                { label: 'Shipping & Delivery', to: '/shipping' },
                { label: 'Returns & Refunds', to: '/returns' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[#B7B5B0] text-sm hover:text-white transition-colors font-normal font-sans"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5"
        >
          <p className="text-[#B7B5B0]/70 text-xs font-normal font-sans">
            © {year} Naastha. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[#B7B5B0]/70 text-xs font-normal font-sans">
            <span>Made in India</span>
            <span className="hidden md:inline" aria-hidden="true">·</span>
            <span className="hidden md:inline">Savoury snacks, made with atta.</span>
          </div>
        </div>
      </div>

      {/* Giant outlined wordmark; letters rise out of a mask as the footer arrives */}
      <motion.div
        aria-hidden="true"
        initial={motionEnabled ? 'hidden' : false}
        whileInView="shown"
        viewport={{ once: true, amount: 0.4 }}
        transition={{ staggerChildren: 0.06 }}
        className="mt-12 flex justify-center overflow-hidden select-none font-cine font-extrabold leading-[0.82] tracking-[0.02em]"
        style={{ fontSize: 'clamp(3rem, 16.5vw, 19rem)' }}
      >
        {WORDMARK.map((letter, i) => (
          <motion.span
            key={i}
            variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#050506] hover:text-[#E52B32] transition-colors duration-300"
            style={{ WebkitTextStroke: '2px rgba(246, 243, 237, 0.55)', paintOrder: 'stroke fill' }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </footer>
  );
}
