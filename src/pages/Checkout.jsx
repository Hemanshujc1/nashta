import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, Smartphone, CreditCard, Banknote } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { SummaryLine, Totals, DemoNotice, primaryBtn, ghostBtn } from '../components/cart/CartParts';
import { cn } from '../lib/utils';

// Zod Validation Schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().min(10, "Please enter full address"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit PIN code"),
});

const STEPS = ['Contact', 'Delivery', 'Payment'];

const PAYMENTS = [
  { id: 'upi', label: 'UPI', note: 'Any UPI app', Icon: Smartphone },
  { id: 'card', label: 'Card', note: 'Credit or debit', Icon: CreditCard },
  { id: 'cod', label: 'Cash on delivery', note: 'Pay at the door', Icon: Banknote },
];

// Simulated processing time before the mock order is confirmed.
const MOCK_DELAY = 1600;

function Field({ label, error, className, optional, ...input }) {
  const id = `checkout-${input.name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9C9A95]">
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal text-[#6F6D69]">(optional)</span>}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'h-13 min-h-[52px] w-full rounded-xl border bg-[#050506] px-4 text-base text-[#F6F3ED] outline-none transition-colors placeholder:text-[#6F6D69] focus:border-[var(--flavour)]',
          error ? 'border-[#E52B32]' : 'border-white/12'
        )}
        {...input}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-[#FF6B70]">
          {error.message}
        </p>
      )}
    </div>
  );
}

function StepCard({ index, step, title, summary, onEdit, children }) {
  const open = step === index;
  const done = step > index;
  return (
    <section
      className={cn(
        'rounded-2xl border p-6 transition-colors duration-500 md:p-8',
        open ? 'border-white/20 bg-[#0D0D10]' : 'border-white/8 bg-transparent'
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className={cn(
            'grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors duration-500',
            done && 'border-[#D9B779] bg-[#D9B779] text-[#050506]',
            open && 'border-[var(--flavour)] text-[#F6F3ED]',
            !done && !open && 'border-white/15 text-[#6F6D69]'
          )}
        >
          {done ? <Check size={16} strokeWidth={3} /> : String(index).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={cn('font-cine text-xl font-bold normal-case md:text-2xl', step < index ? 'text-[#6F6D69]' : 'text-[#F6F3ED]')}>{title}</h2>
          {done && summary && <p className="mt-0.5 truncate text-sm text-[#9C9A95]">{summary}</p>}
        </div>
        {done && (
          <button
            type="button"
            onClick={onEdit}
            className="min-h-[44px] px-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B7B5B0] underline-offset-4 hover:text-[#F6F3ED] hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-7">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const placeOrder = useCartStore((s) => s.placeOrder);
  const total = useCartStore((s) => s.getTotal)();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const placed = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => clearTimeout(timer.current);
  }, []);

  // Nothing to check out: send the shopper to the cart's empty state.
  useEffect(() => {
    if (items.length === 0 && !placed.current) navigate('/cart', { replace: true });
  }, [items.length, navigate]);

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched'
  });

  const nextStep = async (currentStep) => {
    if (currentStep === 1) {
      const isValid = await trigger(['fullName', 'mobile', 'email']);
      if (isValid) setStep(2);
    } else if (currentStep === 2) {
      const isValid = await trigger(['address', 'apartment', 'city', 'state', 'pincode']);
      if (isValid) setStep(3);
    }
  };

  // Mock checkout: no payment provider. Waits briefly, then confirms a simulated order.
  const handlePlaceOrder = (data) => {
    setIsProcessing(true);
    timer.current = setTimeout(() => {
      placed.current = true;
      placeOrder({
        customer: data.fullName,
        city: data.city,
        pincode: data.pincode,
        payment: PAYMENTS.find((p) => p.id === paymentMethod).label,
      });
      navigate('/success', { state: { fresh: true } });
    }, MOCK_DELAY);
  };

  if (items.length === 0) return null; // handled by useEffect

  const values = getValues();

  return (
    <div className="min-h-screen w-full bg-[#050506] pb-24 pt-32 text-[#F6F3ED] md:pb-32 md:pt-40">
      <div className="container mx-auto max-w-screen-xl px-5 md:px-8">
        <Link
          to="/cart"
          className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9C9A95] transition-colors hover:text-[#F6F3ED]"
        >
          <ArrowLeft size={14} /> Back to cart
        </Link>

        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <h1 className="font-cine font-extrabold uppercase leading-[0.9] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)' }}>
            Checkout
          </h1>
          <ol className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]" aria-label="Checkout progress">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-3" aria-current={step === i + 1 ? 'step' : undefined}>
                {i > 0 && <span className={cn('block h-px w-6 md:w-10', step > i ? 'bg-[#D9B779]' : 'bg-white/15')} />}
                <span className={cn('transition-colors', step === i + 1 ? 'text-[#F6F3ED]' : step > i + 1 ? 'text-[#D9B779]' : 'text-[#6F6D69]')}>
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col-reverse gap-10 lg:flex-row lg:gap-16">
          {/* Main Form Area */}
          <form onSubmit={handleSubmit(handlePlaceOrder)} noValidate className="w-full space-y-4 lg:w-3/5">
            <StepCard index={1} step={step} title="Contact details" summary={`${values.fullName ?? ''} · ${values.mobile ?? ''}`} onEdit={() => setStep(1)}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full name" autoComplete="name" error={errors.fullName} {...register('fullName')} />
                <Field label="Mobile number" inputMode="numeric" autoComplete="tel-national" maxLength={10} error={errors.mobile} {...register('mobile')} />
                <Field label="Email" type="email" autoComplete="email" className="md:col-span-2" error={errors.email} {...register('email')} />
              </div>
              <button type="button" onClick={() => nextStep(1)} className={`${primaryBtn} mt-7`}>
                Continue to delivery <ArrowRight size={16} />
              </button>
            </StepCard>

            <StepCard index={2} step={step} title="Delivery address" summary={`${values.city ?? ''} ${values.pincode ?? ''}`} onEdit={() => setStep(2)}>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                <Field label="House, building, street" autoComplete="address-line1" className="col-span-2 md:col-span-3" error={errors.address} {...register('address')} />
                <Field label="Landmark or area" optional autoComplete="address-line2" className="col-span-2 md:col-span-3" {...register('apartment')} />
                <Field label="PIN code" inputMode="numeric" autoComplete="postal-code" maxLength={6} className="col-span-2 md:col-span-1" error={errors.pincode} {...register('pincode')} />
                <Field label="City" autoComplete="address-level2" error={errors.city} {...register('city')} />
                <Field label="State" autoComplete="address-level1" error={errors.state} {...register('state')} />
              </div>
              <div className="mt-7 flex gap-3">
                <button type="button" onClick={() => setStep(1)} aria-label="Back to contact details" className={`${ghostBtn} !px-5`}>
                  <ArrowLeft size={16} />
                </button>
                <button type="button" onClick={() => nextStep(2)} className={primaryBtn}>
                  Continue to payment <ArrowRight size={16} />
                </button>
              </div>
            </StepCard>

            <StepCard index={3} step={step} title="Payment">
              <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
                {PAYMENTS.map(({ id, label, note, Icon }) => {
                  const active = paymentMethod === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPaymentMethod(id)}
                      className={cn(
                        'flex min-h-[88px] items-center gap-3 rounded-xl border p-4 text-left transition-colors sm:flex-col sm:items-start',
                        active ? 'border-[var(--flavour)] bg-white/[0.04]' : 'border-white/12 hover:border-white/30'
                      )}
                    >
                      <Icon size={20} className={active ? 'text-[#F6F3ED]' : 'text-[#9C9A95]'} />
                      <span>
                        <span className="block text-sm font-semibold text-[#F6F3ED]">{label}</span>
                        <span className="block text-xs text-[#9C9A95]">{note}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <DemoNotice className="mt-5">
                Demo build. No payment details are collected and no payment is taken. Placing the order shows a sample confirmation.
              </DemoNotice>

              <div className="mt-7 flex gap-3">
                <button type="button" onClick={() => setStep(2)} disabled={isProcessing} aria-label="Back to delivery address" className={`${ghostBtn} !px-5`}>
                  <ArrowLeft size={16} />
                </button>
                <button type="submit" disabled={isProcessing} className={primaryBtn}>
                  {isProcessing ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                        className="block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                      />
                      Placing order
                    </>
                  ) : (
                    `Place order · ₹${total}`
                  )}
                </button>
              </div>
            </StepCard>
          </form>

          {/* Order Summary Sidebar */}
          <aside className="w-full lg:w-2/5" aria-label="Order summary">
            <div className="rounded-2xl border border-white/10 bg-[#0D0D10] p-6 md:p-8 lg:sticky lg:top-28">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#E52B32]">Your order</h2>
              <ul className="mb-4 max-h-[320px] divide-y divide-white/10 overflow-y-auto pr-2 pt-2" data-lenis-prevent>
                {items.map((item) => (
                  <SummaryLine key={item.id} item={item} />
                ))}
              </ul>
              <Totals className="border-t border-white/10 pt-4" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
