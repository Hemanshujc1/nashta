import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, X, Menu, ChevronRight, Play, Pause } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useMotionStore } from '../store/motionStore';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToTarget } from '../lib/motion';

export default function Navbar() {
  const { toggleCart, getTotalItems } = useCartStore();
  const { motionEnabled, toggleMotion } = useMotionStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Escape key closes menu
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const navLinks = [
    { label: 'Flavours', to: '/flavours', anchor: '#flavours' },
    { label: 'Build a Box', to: '/shop', anchor: '#build-a-box' },
    { label: 'Gifting', to: '/shop', anchor: '#gifting' },
    { label: 'Our Story', to: '/about', anchor: '#our-story' },
  ];

  const handleNavClick = (link, e) => {
    if (location.pathname === '/' && link.anchor) {
      e.preventDefault();
      scrollToTarget(link.anchor);
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* S01: Offer Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#E52B32] text-[#F6F3ED] text-center text-xs md:text-sm font-semibold tracking-wide py-2 px-4 shadow-md">
        <span>🎉 Choose any 3 flavours for ₹200</span>
        <span className="hidden md:inline text-white/80 ml-2">· Sunflower oil · 12g Protein · No Palm Oil</span>
        <a
          href="#build-a-box"
          onClick={(e) => handleNavClick({ anchor: '#build-a-box' }, e)}
          className="ml-3 underline underline-offset-2 font-bold hover:no-underline transition-all"
        >
          Build Your Box →
        </a>
      </div>

      {/* Main Header with compacting scroll animation (200-250ms) */}
      <header
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-250 ${
          isScrolled
            ? 'bg-[#070708]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-2'
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between max-w-screen-xl">

          {/* Authentic Brand Logo */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0 -ml-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
            aria-label="Naastha Home"
          >
            <img
              src="/nashta-logo.png"
              alt="Naastha"
              className={`object-contain transition-all duration-200 ${
                isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-14'
              }`}
              style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))' }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={location.pathname === '/' ? link.anchor : link.to}
                onClick={(e) => handleNavClick(link, e)}
                className="text-sm font-semibold uppercase tracking-widest text-[#B7B5B0] hover:text-[#F6F3ED] transition-colors duration-200 focus:outline-none focus:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Ambient Motion Toggle Button */}
            <button
              onClick={toggleMotion}
              className="p-2 rounded-full border border-white/10 hover:border-white/30 text-text-muted hover:text-text transition-all bg-[#141416]/60 backdrop-blur-sm"
              title={motionEnabled ? 'Pause 3D and ambient motion' : 'Resume 3D and ambient motion'}
              aria-label={motionEnabled ? 'Pause Motion' : 'Play Motion'}
            >
              {motionEnabled ? <Pause size={15} /> : <Play size={15} className="text-[#D9B779]" />}
            </button>

            {/* Desktop Primary CTA: Build a Box — ₹200 */}
            <a
              href="#build-a-box"
              onClick={(e) => handleNavClick({ anchor: '#build-a-box' }, e)}
              className="hidden md:flex items-center gap-2 bg-[#E52B32] hover:bg-[#E52B32]/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#E52B32]/30 hover:-translate-y-0.5"
            >
              Build a Box <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">₹200</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Open shopping cart, ${totalItems} items`}
            >
              <ShoppingBag size={20} className="text-[#F6F3ED]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#E52B32] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={20} className="text-[#F6F3ED]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[80]"
              aria-hidden="true"
            />
            <motion.nav
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm z-[90] flex flex-col bg-[#141416] border-l border-white/10"
              aria-label="Mobile navigation"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <img src="/nashta-logo.png" alt="Naastha" className="h-10 object-contain" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-[#B7B5B0]"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto px-6 py-8">
                <ul className="space-y-2">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.08 }}
                    >
                      <a
                        href={location.pathname === '/' ? link.anchor : link.to}
                        onClick={(e) => handleNavClick(link, e)}
                        className="flex items-center justify-between py-4 text-xl font-display font-semibold uppercase tracking-wider text-[#F6F3ED] hover:text-[#E52B32] transition-colors border-b border-white/5"
                      >
                        {link.label}
                        <ChevronRight size={18} className="text-[#B7B5B0]" />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile Motion Control */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Ambient Motion
                  </span>
                  <button
                    onClick={toggleMotion}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-white/15 bg-white/5 text-text"
                  >
                    {motionEnabled ? <Pause size={12} /> : <Play size={12} />}
                    {motionEnabled ? 'Enabled' : 'Paused'}
                  </button>
                </div>
              </div>

              <div className="px-6 pb-8 pt-4 border-t border-white/10">
                <a
                  href="#build-a-box"
                  onClick={(e) => handleNavClick({ anchor: '#build-a-box' }, e)}
                  className="w-full flex items-center justify-center gap-2 bg-[#E52B32] text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl"
                >
                  Build Your Box — ₹200
                </a>
                <button
                  onClick={() => {
                    toggleCart();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 mt-3 border border-white/15 text-[#F6F3ED] py-3.5 rounded-full font-semibold text-sm hover:bg-white/5 transition-colors"
                >
                  <ShoppingBag size={16} />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
