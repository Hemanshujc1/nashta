import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import PackShot from '../motion/PackShot';
import { flavours } from '../../data/flavours';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '../../store/cartStore';
import { cn } from '../../lib/utils';

const FAN = [
  { rotate: -14, x: '-58%', z: 1 },
  { rotate: 12, x: '58%', z: 1 },
  { rotate: 0, x: '0%', z: 2 },
];

const boxFlavours = (item) => {
  const picked = item.boxIds
    ? item.boxIds.map((id) => flavours.find((f) => f.id === id))
    : (item.boxFlavours ?? []).map((name) => flavours.find((f) => f.name === name));
  return picked.filter(Boolean);
};

const lineMeta = (item) => (item.isBox ? item.boxFlavours.join(' · ') : `${item.weight}g`);

// Square tile for a cart line: the cut-out pack for a single flavour, a fan of three for a box, the photo otherwise.
export function CartThumb({ item, className = '' }) {
  const flavour = flavours.find((f) => f.id === item.id);
  const trio = item.isBox ? boxFlavours(item) : [];
  const glow = flavour?.accent ?? trio[0]?.accent ?? '#D9B779';

  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#141416]', className)}>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 60%, color-mix(in srgb, ${glow} 38%, transparent) 0%, transparent 70%)` }}
      />
      {flavour && <PackShot flavour={flavour} className="absolute left-1/2 top-1/2 h-[78%] -translate-x-1/2 -translate-y-1/2 shadow-lg" />}
      {trio.length > 0 &&
        trio.map((f, i) => (
          <div
            key={f.id}
            className="absolute left-1/2 top-1/2 h-[62%]"
            style={{ transform: `translate(-50%, -50%) translateX(${FAN[i].x}) rotate(${FAN[i].rotate}deg)`, zIndex: FAN[i].z }}
          >
            <PackShot flavour={f} className="h-full shadow-lg" />
          </div>
        ))}
      {!flavour && trio.length === 0 && <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />}
    </div>
  );
}

export function QtyStepper({ item }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  return (
    <div className="inline-flex items-center rounded-full border border-white/15">
      <button
        type="button"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
        aria-label={`Decrease quantity of ${item.name}`}
        className="grid h-11 w-11 place-items-center rounded-full text-[#F6F3ED] transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        aria-label={`Increase quantity of ${item.name}`}
        className="grid h-11 w-11 place-items-center rounded-full text-[#F6F3ED] transition-colors hover:bg-white/10"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// One editable cart line, shared by the drawer and the cart page.
export function CartLine({ item, large = false }) {
  const removeItem = useCartStore((s) => s.removeItem);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex gap-4 border-b border-white/10', large ? 'py-6 md:gap-6' : 'py-5')}
    >
      <CartThumb item={item} className={large ? 'h-24 w-24 md:h-32 md:w-32' : 'h-24 w-24'} />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={cn('font-cine font-bold normal-case leading-tight text-[#F6F3ED]', large ? 'text-lg md:text-2xl' : 'text-base')}>
              {item.name}
            </h3>
            <p className="mt-1 text-xs leading-snug text-[#9C9A95] md:text-sm">{lineMeta(item)}</p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
            className="-mr-3 -mt-3 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#9C9A95] transition-colors hover:text-[#E52B32]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <QtyStepper item={item} />
          <span className={cn('font-cine font-bold tabular-nums text-[#F6F3ED]', large ? 'text-xl md:text-2xl' : 'text-lg')}>
            ₹{item.price * item.quantity}
          </span>
        </div>
      </div>
    </motion.li>
  );
}

export function ShippingMeter({ className = '' }) {
  // Subscribing to items keeps the meter in step with the cart.
  useCartStore((s) => s.items);
  const info = useCartStore.getState().getShippingInfo();
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B7B5B0]">
        {info.isFree ? (
          <span className="text-[#D9B779]">Free shipping unlocked</span>
        ) : (
          <>
            <span className="text-[#F6F3ED]">₹{info.amountToFree}</span> to free shipping
          </>
        )}
      </p>
      <div
        className="h-[3px] w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-label={`Progress to free shipping at ₹${FREE_SHIPPING_THRESHOLD}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(info.progress)}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: info.isFree ? '#D9B779' : 'var(--flavour)' }}
          initial={false}
          animate={{ width: `${info.progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

// Subtotal, shipping and total. Pass an order to show a placed order; defaults to the live cart.
export function Totals({ order, className = '' }) {
  useCartStore((s) => s.items);
  const cart = useCartStore.getState();
  const subtotal = order ? order.subtotal : cart.getSubtotal();
  const shipping = order ? order.shipping : cart.getShippingInfo().cost;
  const total = order ? order.total : cart.getTotal();
  return (
    <dl className={cn('text-sm', className)}>
      <div className="flex justify-between py-1.5">
        <dt className="text-[#9C9A95]">Subtotal</dt>
        <dd className="tabular-nums text-[#F6F3ED]">₹{subtotal}</dd>
      </div>
      <div className="flex justify-between py-1.5">
        <dt className="text-[#9C9A95]">Shipping</dt>
        <dd className="tabular-nums text-[#F6F3ED]">
          {shipping === 0 ? <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9B779]">Free</span> : `₹${shipping}`}
        </dd>
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-4">
        <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B7B5B0]">Total</dt>
        <dd className="font-cine text-3xl font-extrabold tabular-nums text-[#F6F3ED]">₹{total}</dd>
      </div>
    </dl>
  );
}

// Read-only line for order summaries.
export function SummaryLine({ item }) {
  return (
    <li className="flex items-center gap-4 py-3">
      <div className="relative">
        <CartThumb item={item} className="h-16 w-16" />
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#F6F3ED] px-1 text-[10px] font-bold text-[#050506]">
          {item.quantity}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-cine text-sm font-bold leading-tight text-[#F6F3ED]">{item.name}</p>
        <p className="mt-0.5 truncate text-xs text-[#9C9A95]">{lineMeta(item)}</p>
      </div>
      <span className="text-sm font-semibold tabular-nums text-[#F6F3ED]">₹{item.price * item.quantity}</span>
    </li>
  );
}

export const primaryBtn =
  'inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--flavour)] px-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--flavour-ink)] transition-[filter,gap] hover:gap-3 hover:brightness-110 disabled:cursor-wait disabled:opacity-70';
export const ghostBtn =
  'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/20 px-8 text-xs font-bold uppercase tracking-[0.2em] text-[#F6F3ED] transition-colors hover:border-white/60';

export function DemoNotice({ children, className = '' }) {
  return (
    <p className={cn('rounded-xl border border-[#D9B779]/25 bg-[#D9B779]/[0.06] px-4 py-3 text-xs leading-relaxed text-[#D9B779]', className)}>
      {children ?? 'Demo build. No payment is taken and nothing is shipped.'}
    </p>
  );
}
