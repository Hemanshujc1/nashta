import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PackageCheck, Box, Truck, MapPin, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/motion/PageHero';
import { useCartStore } from '../store/cartStore';
import { useMotionStore } from '../store/motionStore';
import { SummaryLine, Totals, DemoNotice, primaryBtn } from '../components/cart/CartParts';
import { cn } from '../lib/utils';

const DAY = 24 * 60 * 60 * 1000;
const fmt = (ms) => new Date(ms).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

// Mock timeline: every order sits at "Packed". `day` is the offset from the order date.
const STAGES = [
  { title: 'Order confirmed', desc: 'We have your order.', Icon: PackageCheck, day: 0 },
  { title: 'Packed', desc: 'Your packs are boxed and sealed.', Icon: Box, day: 1 },
  { title: 'Shipped', desc: 'Handed to the delivery partner.', Icon: Truck, day: 2 },
  { title: 'Out for delivery', desc: 'On the way to your door.', Icon: MapPin, day: 4 },
  { title: 'Delivered', desc: 'Enjoy your Naastha.', Icon: CheckCircle2, day: 4 },
];
const CURRENT = 1;

export default function TrackOrder() {
  const order = useCartStore((s) => s.lastOrder);
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  // The line draws up to the current stage shortly after the page opens.
  const [active, setActive] = useState(motionEnabled ? 0 : CURRENT);

  useEffect(() => {
    window.scrollTo(0, 0);
    const id = setTimeout(() => setActive(CURRENT), 700);
    return () => clearTimeout(id);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen w-full bg-[#050506] text-[#F6F3ED]">
        <PageHero eyebrow="Track order" lines={['Nothing', 'to track.']} note="Orders placed in this visit show up here with their delivery progress.">
          <Link to="/shop" className={`${primaryBtn} mt-10 !w-auto`}>
            Build a box <ArrowRight size={16} />
          </Link>
        </PageHero>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050506] text-[#F6F3ED]">
      <PageHero
        eyebrow={`Order ${order.orderId}`}
        lines={['Being', 'packed.']}
        colour="#D9B779"
        note={`Placed ${fmt(order.placedAt)}. Arriving in ${order.city} by ${fmt(order.placedAt + 5 * DAY)}.`}
      />

      <section className="container mx-auto max-w-screen-xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-20">
          <ol className="relative border-t border-white/10 pt-10">
            {STAGES.map(({ title, desc, Icon, day }, index) => {
              const isActive = index === active;
              const isCompleted = index < active;
              const last = index === STAGES.length - 1;
              return (
                <motion.li
                  key={title}
                  initial={motionEnabled ? { opacity: 0, x: -20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex gap-5 pb-10 last:pb-0 md:gap-7"
                  aria-current={isActive ? 'step' : undefined}
                >
                  {!last && (
                    <span className="absolute bottom-0 left-6 top-12 w-px -translate-x-1/2 bg-white/10">
                      <span
                        className="block w-full bg-[#D9B779] transition-[height] duration-1000 ease-out"
                        style={{ height: isCompleted ? '100%' : '0%' }}
                      />
                    </span>
                  )}
                  <span
                    className={cn(
                      'relative grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-colors duration-700',
                      isActive && 'border-[#D9B779] bg-[#D9B779] text-[#050506] shadow-[0_0_30px_rgba(217,183,121,0.45)]',
                      isCompleted && 'border-[#D9B779] text-[#D9B779]',
                      !isActive && !isCompleted && 'border-white/15 text-[#6F6D69]'
                    )}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h2
                        className={cn(
                          'font-cine text-xl font-bold normal-case transition-colors duration-700 md:text-2xl',
                          isActive || isCompleted ? 'text-[#F6F3ED]' : 'text-[#6F6D69]'
                        )}
                      >
                        {title}
                      </h2>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9C9A95]">
                        {isCompleted ? fmt(order.placedAt + day * DAY) : `Est. ${fmt(order.placedAt + day * DAY)}`}
                      </span>
                    </div>
                    <p className={cn('mt-1 text-sm md:text-base', isActive || isCompleted ? 'text-[#B7B5B0]' : 'text-[#6F6D69]')}>{desc}</p>
                    {isActive && (
                      <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9B779]">
                        <span className={cn('block h-2 w-2 rounded-full bg-[#D9B779]', motionEnabled && 'animate-pulse')} />
                        In progress
                      </span>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <aside className="rounded-2xl border border-white/10 bg-[#0D0D10] p-6 md:p-8 lg:sticky lg:top-28 lg:self-start" aria-label="Order summary">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#E52B32]">In this order</h2>
            <ul className="mb-4 divide-y divide-white/10 pt-2">
              {order.items.map((item) => (
                <SummaryLine key={item.id} item={item} />
              ))}
            </ul>
            <Totals order={order} className="border-t border-white/10 pt-4" />
            <DemoNotice className="mt-5">Demo build. This timeline is a sample: no real shipment exists for this order.</DemoNotice>
          </aside>
        </div>
      </section>
    </div>
  );
}
