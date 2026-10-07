import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import MaskLines from '../components/motion/MaskLines';
import Reveal from '../components/motion/Reveal';
import { useCartStore } from '../store/cartStore';
import { useMotionStore } from '../store/motionStore';
import { SummaryLine, Totals, DemoNotice, primaryBtn, ghostBtn } from '../components/cart/CartParts';

export default function OrderSuccess() {
  const location = useLocation();
  const order = useCartStore((s) => s.lastOrder);
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const fresh = Boolean(location.state?.fresh);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // One burst from each side, only when arriving straight from checkout.
  useEffect(() => {
    if (!order || !fresh || !motionEnabled) return undefined;
    const colors = ['#E52B32', '#D9B779', '#F6F3ED'];
    const id = setTimeout(() => {
      confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors });
    }, 500);
    return () => clearTimeout(id);
  }, [order, fresh, motionEnabled]);

  if (!order) {
    return (
      <div className="grid min-h-screen w-full place-items-center bg-[#050506] px-5 text-center text-[#F6F3ED]">
        <div>
          <p className="font-serif-cine text-4xl italic md:text-5xl">No recent order.</p>
          <p className="mx-auto mt-3 max-w-[32ch] text-[#9C9A95]">Orders placed in this visit show up here.</p>
          <Link to="/shop" className={`${primaryBtn} mt-8 !w-auto`}>
            Build a box <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050506] pb-24 pt-36 text-[#F6F3ED] md:pb-32 md:pt-48">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 20%, rgba(217,183,121,0.2) 0%, transparent 70%)',
          animation: motionEnabled ? 'halo-pulse 5s ease-in-out infinite' : 'none',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-screen-xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-20">
          <div>
            <motion.div
              initial={motionEnabled ? { scale: 0, rotate: -45 } : false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
              className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-[#D9B779] text-[#050506]"
            >
              <Check size={30} strokeWidth={3} />
            </motion.div>

            <div className="mb-6 flex items-center gap-3">
              <span className="block h-px w-8 bg-[#D9B779]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D9B779]">Order {order.orderId}</span>
            </div>

            <MaskLines
              as="h1"
              className="font-cine font-extrabold uppercase leading-[0.9] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 7.5rem)' }}
              lines={[{ text: 'Order' }, { text: 'confirmed.', style: { color: '#D9B779' } }]}
            />

            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#B7B5B0] md:text-xl">
              Thank you, <span className="text-[#F6F3ED]">{order.customer}</span>. Your box is headed to {order.city} {order.pincode}.
            </p>

            <dl className="mt-10 grid max-w-xl grid-cols-2 border-t border-white/10 sm:grid-cols-3">
              <div className="pr-4 pt-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9C9A95]">Payment</dt>
                <dd className="mt-1 font-cine font-bold">{order.payment}</dd>
              </div>
              <div className="pr-4 pt-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9C9A95]">Delivery</dt>
                <dd className="mt-1 font-cine font-bold">3 to 5 business days</dd>
              </div>
              <div className="pr-4 pt-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9C9A95]">Total</dt>
                <dd className="mt-1 font-cine font-bold tabular-nums">₹{order.total}</dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/track" className={`${primaryBtn} !w-auto`}>
                Track order <ArrowRight size={16} />
              </Link>
              <Link to="/shop" className={ghostBtn}>
                Keep shopping
              </Link>
            </div>
          </div>

          <Reveal delay={0.3} className="lg:self-start">
            <aside className="rounded-2xl border border-white/10 bg-[#0D0D10] p-6 md:p-8" aria-label="Order summary">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#E52B32]">What you ordered</h2>
              <ul className="mb-4 divide-y divide-white/10 pt-2">
                {order.items.map((item) => (
                  <SummaryLine key={item.id} item={item} />
                ))}
              </ul>
              <Totals order={order} className="border-t border-white/10 pt-4" />
              <DemoNotice className="mt-5">Demo build. This is a sample confirmation: no payment was taken and nothing will be shipped.</DemoNotice>
            </aside>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
