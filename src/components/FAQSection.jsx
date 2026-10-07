import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import MaskLines from './motion/MaskLines';

const faqs = [
  {
    q: 'What are Naastha snacks made from?',
    a: 'Naastha snacks are savoury bites made primarily with whole-wheat flour (atta) and cooked in sunflower oil. They contain 0g added sugar, 0g trans fat, zero cholesterol, and are 100% free from palm oil and artificial preservatives.',
  },
  {
    q: 'How does the 3-flavour box offer work?',
    a: 'Choose any three flavours from our range — Cream \'n\' Onion, Manchurian, Punjabi Tadka, Pizza, Peri Desi, or Methi — and we assemble them into a single custom box for ₹200. You get exactly three 100g packs total (300g).',
  },
  {
    q: 'Can I choose duplicate flavours in a single box?',
    a: 'Our standard box builder configures three distinct flavours to give you a varied tasting flight. If you would like multiples of a single flavour, you can add individual flavour packs to your cart separately or order our 6-pack options.',
  },
  {
    q: 'What are the nutritional highlights per pack?',
    a: 'Each 100g pack delivers approximately 12g of protein, zero added sugar, zero trans fat, zero cholesterol, and wholesome dietary fiber. Refer to the nutritional label on each pack for exact certified values.',
  },
  {
    q: 'Are the snacks 100% vegetarian?',
    a: 'Yes, all six Naastha flavours are 100% vegetarian. All ingredients, seasonings, and production lines adhere strictly to vegetarian standards.',
  },
  {
    q: 'Do you offer corporate or festive bulk gifting?',
    a: 'Yes! We offer a 6-pack Discovery Box, Festive Gift Boxes with luxury sleeves, and custom corporate orders with branding options. Use the enquiry form in our Gifting section to get custom volume pricing.',
  },
  {
    q: 'What are your delivery timelines and shipping charges?',
    a: 'Standard orders typically dispatch within 24–48 hours and arrive within 3–5 business days across metropolitan areas. Free shipping applies to orders above ₹500.',
  },
];

export default function FAQSection({ titleAs = 'h2' }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="relative overflow-hidden bg-[#050506] py-24 md:py-36" aria-label="Frequently asked questions">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-5 md:px-8 max-w-screen-xl">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-px bg-[#E52B32]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E52B32]">FAQ</span>
            </div>
            <MaskLines
              as={titleAs}
              trigger
              className="font-cine font-extrabold uppercase text-[#F6F3ED] leading-[0.9] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
              lines={[{ text: 'Questions,' }, { text: 'answered.', style: { color: '#E52B32' } }]}
            />
            <p className="text-[#B7B5B0] text-base md:text-lg leading-relaxed mt-6 max-w-sm">
              Ingredients, the 3-flavour box and delivery.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center min-h-[44px] mt-6 text-[#F6F3ED] text-xs font-semibold uppercase tracking-[0.2em] border-b border-white/30 hover:border-white transition-colors"
            >
              Ask us something else
            </Link>
          </div>

          <div className="border-t border-white/10">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={faq.q} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="group w-full flex items-start gap-5 py-6 md:py-7 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E52B32] rounded-sm"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-btn-${i}`}
                  >
                    <span className="font-cine text-xs font-semibold tracking-[0.2em] text-[#9C9A95] pt-1.5 w-7 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 font-cine font-bold text-lg md:text-2xl leading-snug transition-colors duration-200 ${
                        isOpen ? 'text-[#F6F3ED]' : 'text-[#B7B5B0] group-hover:text-[#F6F3ED]'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <Plus
                      size={22}
                      className={`shrink-0 mt-1 transition-transform duration-[250ms] ${isOpen ? 'rotate-45 text-[#E52B32]' : 'text-[#F6F3ED]'}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pl-12 pr-10 pb-7 text-base text-[#B7B5B0] leading-relaxed max-w-[60ch]">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
