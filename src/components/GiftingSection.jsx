import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowUpRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const giftBoxes = [
  {
    id: 'discovery-box',
    type: 'assorted',
    index: '01',
    name: 'Discovery Tasting Box',
    subtitle: '6-Pack',
    description: 'One of every flavour in a single presentation box. A full tasting flight across all six Naastha flavours.',
    contents: ["Cream 'n' Onion", 'Manchurian', 'Punjabi Tadka', 'Pizza', 'Peri Desi', 'Methi'],
    packs: 6,
    price: 399,
    accent: '#D9B779',
    image: '/products/cream-n-onion.jpg',
  },
  {
    id: 'gifting-box',
    type: 'gift',
    index: '02',
    name: 'Festive Celebration Box',
    subtitle: 'Gold Ribbon Rigid Box',
    description: 'Six handpicked flavours in a rigid presentation box finished with a gold ribbon. Made for gifting.',
    contents: ['Six curated savoury snack packs', 'Rigid box with gold ribbon', 'Personalised greeting card option'],
    packs: 6,
    price: 499,
    accent: '#E52B32',
    image: '/products/peri-desi.jpg',
    featured: true,
  },
  {
    id: 'custom-box',
    type: 'custom',
    index: '03',
    name: 'Bespoke Corporate & Wedding',
    subtitle: 'Custom Volume Quotation',
    description: 'Custom packaging and flavour curation at scale for teams, weddings, Diwali hampers and milestone celebrations.',
    contents: ['Custom branding & sleeves available', 'Tiered volume pricing', 'Dedicated logistics coordinator'],
    packs: null,
    price: null,
    accent: '#D9B779',
    image: '/products/methi-oregano.jpg',
  },
];

function EnquiryModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    quantity: '',
    occasion: '',
    date: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-3xl p-6 md:p-8 bg-[#101012] border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-[#B7B5B0]"
          aria-label="Close enquiry form"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#3FBD79]/20 border-2 border-[#3FBD79]">
              <Check size={28} className="text-[#3FBD79]" strokeWidth={3} />
            </div>
            <h3 className="font-display font-black text-2xl text-[#F6F3ED] uppercase mb-2">
              Enquiry Received!
            </h3>
            <p className="text-[#B7B5B0] text-sm leading-relaxed mb-6">
              Thank you, <strong className="text-white">{formData.name}</strong>. Our corporate gifting team will contact you at <strong className="text-white">{formData.contact}</strong> within 24 hours with a customised volume quote.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#E52B32] text-white font-bold text-xs uppercase tracking-widest"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <h3 id="enquiry-modal-title" className="font-display font-black text-2xl uppercase text-[#F6F3ED] mb-2">
              Corporate & Custom Enquiry
            </h3>
            <p className="text-xs text-[#B7B5B0] mb-6">
              Tell us about your team size or event. We will assemble samples and volume quotation for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B7B5B0] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shruti Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#070708] border border-white/10 text-[#F6F3ED] text-sm focus:outline-none focus:ring-2 focus:ring-[#E52B32]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B7B5B0] mb-1">
                  Work Email or Mobile *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. shruti@company.com"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#070708] border border-white/10 text-[#F6F3ED] text-sm focus:outline-none focus:ring-2 focus:ring-[#E52B32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B7B5B0] mb-1">
                    Approx. Boxes *
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    placeholder="e.g. 50"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#070708] border border-white/10 text-[#F6F3ED] text-sm focus:outline-none focus:ring-2 focus:ring-[#E52B32]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B7B5B0] mb-1">
                    Desired Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#070708] border border-white/10 text-[#F6F3ED] text-sm focus:outline-none focus:ring-2 focus:ring-[#E52B32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B7B5B0] mb-1">
                  Occasion & Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Diwali gifting, employee anniversary, custom branding preferences..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#070708] border border-white/10 text-[#F6F3ED] text-sm focus:outline-none focus:ring-2 focus:ring-[#E52B32] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#E52B32] hover:bg-[#E52B32]/90 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl"
              >
                {loading ? 'Submitting Enquiry...' : 'Submit Custom Enquiry'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function GiftingSection() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [addedBoxId, setAddedBoxId] = useState(null);
  const { addItem } = useCartStore();

  const handleAddToCart = (box) => {
    addItem({
      id: box.id,
      name: box.name,
      price: box.price,
      image: box.image,
      weight: box.packs * 100,
      description: box.description,
    });
    setAddedBoxId(box.id);
    setTimeout(() => setAddedBoxId(null), 2500);
  };

  return (
    <>
      <section
        id="gifting"
        className="relative py-20 md:py-28 overflow-hidden bg-[#070708]"
        aria-labelledby="gifting-heading"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(217,183,121,0.09) 0%, transparent 70%)' }}
        />
        <div className="container mx-auto px-5 md:px-8 max-w-screen-xl relative z-10">
          <div className="max-w-2xl mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-[#D9B779]" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D9B779]">
                Gifting & Collections
              </span>
            </div>
            <h2
              id="gifting-heading"
              className="font-display font-black uppercase text-[#F6F3ED] leading-none mb-4"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            >
              A box for every <span className="text-[#D9B779]">occasion</span>
            </h2>
            <p className="text-[#B7B5B0] text-base md:text-lg max-w-lg">
              Tasting sets, celebration hampers and corporate gifting at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {giftBoxes.map((box, i) => (
              <motion.article
                key={box.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#101012] border transition-colors duration-500 hover:border-[#D9B779]/60 focus-within:border-[#D9B779]/60"
                style={{ borderColor: box.featured ? 'rgba(217,183,121,0.35)' : 'rgba(255,255,255,0.08)' }}
              >
                <div className="relative h-64 md:h-72 overflow-hidden bg-[#070708]">
                  <img
                    src={box.image}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110 group-focus-within:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101012] via-[#101012]/30 to-transparent" />
                  <span className="absolute top-4 left-5 text-xs font-semibold tracking-[0.3em] text-[#F6F3ED]/80 tabular-nums">
                    {box.index}
                  </span>
                  {box.featured && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#070708]/80 backdrop-blur-md border border-[#D9B779]/40 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D9B779]">
                      Gift ready
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6 md:p-7 -mt-8 relative">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: box.accent }}>
                    {box.subtitle}
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase leading-tight text-[#F6F3ED] mb-3">
                    {box.name}
                  </h3>
                  <p className="text-sm text-[#B7B5B0] leading-relaxed mb-5">{box.description}</p>

                  <ul className="space-y-2 mb-7">
                    {box.contents.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-[#F6F3ED]/90 font-medium">
                        <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: box.accent }} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 border-t border-white/10">
                    {box.type === 'custom' ? (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-display font-black text-lg text-[#F6F3ED] leading-tight">Custom quote</div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-[#B7B5B0]">Volume pricing</div>
                        </div>
                        <button
                          onClick={() => setEnquiryOpen(true)}
                          className="flex-1 min-h-[48px] px-4 rounded-full border border-[#D9B779] text-[#D9B779] hover:bg-[#D9B779] hover:text-[#070708] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                          Corporate Enquiry <ArrowUpRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-display font-black text-2xl text-[#F6F3ED]">₹{box.price}</div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-[#B7B5B0]">
                            {box.packs} packs included
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCart(box)}
                          className="flex-1 min-h-[48px] px-4 rounded-full font-bold text-xs uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 hover:brightness-110"
                          style={{ background: box.accent === '#D9B779' ? '#E52B32' : box.accent }}
                        >
                          {addedBoxId === box.id ? (
                            <>
                              <Check size={14} /> Added
                            </>
                          ) : (
                            'Add to Cart'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {enquiryOpen && <EnquiryModal onClose={() => setEnquiryOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
