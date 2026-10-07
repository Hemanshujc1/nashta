import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X } from "lucide-react";

function NutritionModal({ onClose }) {
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
        className="w-full max-w-xl rounded-3xl p-6 md:p-8 bg-[#141416] border border-white/10 shadow-2xl relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nutrition-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-[#B7B5B0]"
          aria-label="Close nutrition facts modal"
        >
          <X size={20} />
        </button>

        <h3
          id="nutrition-modal-title"
          className="font-display font-black text-2xl uppercase text-[#F6F3ED] mb-2"
        >
          Nutritional Analysis & Lab Declarations
        </h3>
        <p className="text-xs text-[#B7B5B0] mb-6">
          Values tested per 100g serving standard. Applicable across the Naastha
          savoury snacks range.
        </p>

        <div className="space-y-3 mb-6">
          {[
            { label: "Energy", value: "428 kcal", dv: "21%" },
            { label: "Protein (Atta based)", value: "12.0 g", dv: "24%" },
            { label: "Total Carbohydrates", value: "64.0 g", dv: "20%" },
            { label: "Added Sugars", value: "0.0 g", dv: "0%" },
            { label: "Dietary Fiber", value: "8.5 g", dv: "30%" },
            { label: "Total Fat (Sunflower Oil)", value: "14.0 g", dv: "18%" },
            { label: "Saturated Fat", value: "2.5 g", dv: "11%" },
            { label: "Trans Fat", value: "0.0 g", dv: "0%" },
            { label: "Cholesterol", value: "0.0 mg", dv: "0%" },
            { label: "Sodium", value: "380 mg", dv: "16%" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-white/5 text-sm"
            >
              <span className="font-medium text-[#F6F3ED]">{row.label}</span>
              <div className="text-right">
                <span className="font-bold text-[#D9B779] mr-2">
                  {row.value}
                </span>
                <span className="text-xs text-[#B7B5B0]/60">
                  ({row.dv} RDA)
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-white/5 text-xs text-[#B7B5B0] leading-relaxed">
          *Percent Daily Values are based on a 2,000 calorie adult diet.
          Certified sunflower oil usage guarantees zero palm oil blending.
        </div>
      </motion.div>
    </motion.div>
  );
}

const pillars = [
  {
    id: "atta",
    index: "01",
    stat: "100%",
    unit: "Whole-wheat atta",
    title: "Atta in. Palm oil out.",
    detail:
      "Every pack starts with whole-wheat atta and is fried in pure sunflower oil. No palm oil, no shortcuts, no synthetic flavour enhancers.",
    accent: "#D9B779",
  },
  {
    id: "macros",
    index: "02",
    stat: "12g",
    unit: "Protein per pack",
    title: "Honest macros.",
    detail:
      "Zero added sugar, zero trans fat, zero cholesterol. The numbers on the pack are the numbers in the lab report.",
    accent: "#E52B32",
  },
  {
    id: "flavours",
    index: "03",
    stat: "6",
    unit: "Desi regional recipes",
    title: "Loud, on purpose.",
    detail:
      "From smoky Punjabi Tadka to fiery Peri Desi and earthy Methi, each recipe is built on real ground spices and herbs. 100% vegetarian.",
    accent: "#3FBD79",
  },
];

export default function WhyChooseCrispit() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      id="why-choose"
      className="relative py-20 md:py-28 overflow-hidden bg-[#070708]"
      aria-labelledby="crispit-heading"
    >
      <div className="container mx-auto px-5 md:px-8 max-w-screen-xl relative z-10">
        <div className="max-w-2xl mb-12 md:mb-16">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block w-6 h-px bg-[#E52B32]" />
            <span className="text-[#E52B32] text-xs font-bold uppercase tracking-[0.2em]">
              Ingredients & Integrity
            </span>
          </div>
          <h2
            id="crispit-heading"
            className="font-display font-black uppercase text-[#F6F3ED] leading-none mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
          >
            Why choose <span className="text-[#E52B32]">CRISP’IT?</span>
          </h2>
          <p className="text-[#B7B5B0] text-base md:text-lg leading-relaxed">
            Every snack brand claims great taste. We show our working.
          </p>
        </div>

        <div className="border-t border-white/10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 md:gap-14 items-center py-10 md:py-14 border-b border-white/10"
            >
              <div className="flex items-baseline gap-5 md:gap-8">
                <span className="text-xs font-semibold tracking-[0.3em] text-[#B7B5B0] tabular-nums">
                  {p.index}
                </span>
                <div>
                  <div
                    className="font-cine font-extrabold leading-[0.85] tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-2"
                    style={{ fontSize: "clamp(4.5rem, 14vw, 10rem)", color: p.accent }}
                  >
                    {p.stat}
                  </div>
                  <div className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-[#F6F3ED]">
                    {p.unit}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-display font-black uppercase text-xl md:text-3xl text-[#F6F3ED] mb-3">
                  {p.title}
                </h3>
                <p className="text-sm md:text-base text-[#B7B5B0] leading-relaxed max-w-md">
                  {p.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-10">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2.5 px-6 min-h-[48px] rounded-full bg-[#202023] border border-white/15 text-[#F6F3ED] hover:text-white hover:border-[#D9B779] text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
          >
            <FileText size={15} className="text-[#D9B779]" />
            View Full Nutrition Table & Lab Declarations
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <NutritionModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
