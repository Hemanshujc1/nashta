import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useFlavourStore } from "../store/flavourStore";
import { flavours, boxCartItem, BOX_SIZE, BOX_PRICE } from "../data/flavours";
import Box3DViewer from "./three/Box3DViewer";

const MAX = BOX_SIZE;

export default function BundleBuilder() {
  const selected = useFlavourStore((s) => s.box);
  const setSelected = useFlavourStore((s) => s.setBox);
  const [announcement, setAnnouncement] = useState(
    "Choose 3 flavours to build your box",
  );
  const [fullWarning, setFullWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addItem } = useCartStore();

  const toggle = useCallback(
    (flavour) => {
      setFullWarning(false);
      const exists = selected.find((f) => f.id === flavour.id);

      if (exists) {
        setSelected((prev) => {
          const next = prev.filter((f) => f.id !== flavour.id);
          setAnnouncement(
            `${flavour.name} removed. ${next.length} of ${MAX} selected.`,
          );
          return next;
        });
        return;
      }

      if (selected.length >= MAX) {
        setFullWarning(true);
        setAnnouncement(
          `Your box is full (3 of 3). Remove a flavour to pick another.`,
        );
        setTimeout(() => setFullWarning(false), 3500);
        return;
      }

      setSelected((prev) => {
        const next = [...prev, flavour];
        setAnnouncement(
          `${flavour.name} added, ${next.length} of ${MAX} selected.`,
        );
        return next;
      });
    },
    [selected, setSelected],
  );

  const removeSlot = useCallback(
    (idx) => {
      setSelected((prev) => {
        const removed = prev[idx];
        const next = prev.filter((_, i) => i !== idx);
        if (removed) {
          setAnnouncement(
            `${removed.name} removed. ${next.length} of ${MAX} selected.`,
          );
        }
        return next;
      });
      setFullWarning(false);
    },
    [setSelected],
  );

  const handleAddBox = useCallback(() => {
    if (selected.length !== MAX || success) return;
    addItem(boxCartItem(selected));
    setSuccess(true);
    setAnnouncement("Box successfully added to your cart!");
    setTimeout(() => {
      setSuccess(false);
      setSelected([]);
    }, 2800);
  }, [selected, success, addItem, setSelected]);

  const count = selected.length;
  const complete = count === MAX;

  return (
    <section
      id="build-a-box"
      data-hide-buybar="mobile"
      className="relative py-20 md:py-28 overflow-hidden bg-[#070708]"
      aria-labelledby="box-builder-heading"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 100%, color-mix(in srgb, var(--flavour) 10%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-5 md:px-8 max-w-350 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="block w-6 h-px bg-[#E52B32]" />
            <span className="text-[#E52B32] text-xs font-bold uppercase tracking-[0.2em]">
              Build your box
            </span>
            <span className="block w-6 h-px bg-[#E52B32]" />
          </motion.div>

          <motion.h2
            id="box-builder-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-[#F6F3ED] uppercase leading-none mb-3"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
          >
            Three packs. One box.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#B7B5B0] text-base md:text-lg font-normal font-sans max-w-md mx-auto"
          >
            Choose any{" "}
            <strong className="text-[#F6F3ED] font-bold">3 flavours</strong> for{" "}
            <strong className="text-[#E52B32] font-bold">₹{BOX_PRICE}</strong>.
            Each pick drops into your box.
          </motion.p>

          {/* Screen reader live announcement */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {announcement}
          </div>
        </div>

        {/* Builder Layout: Selector on Left, 3D Box & Summary on Right */}
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-x-10 lg:gap-y-6 items-start">
          {/* Flavour Selector Grid */}
          <div className="lg:col-start-1 lg:row-start-1">
            {/* Warning when choosing a 4th flavour */}
            <AnimatePresence>
              {fullWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl bg-[#E52B32]/15 border border-[#E52B32]/30 text-[#F6F3ED] text-sm"
                  role="alert"
                >
                  <AlertCircle
                    size={18}
                    className="text-[#E52B32] flex-shrink-0"
                  />
                  <span>
                    Your box already has 3 flavours. Click a chosen pack to
                    remove it first.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-2.5">
              {flavours.map((f) => {
                const isSelected = selected.some((s) => s.id === f.id);
                const isDisabled = !isSelected && count >= MAX;

                return (
                  <motion.button
                    key={f.id}
                    onClick={() => toggle(f)}
                    whileHover={!isDisabled ? { y: -3 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    className={`group relative text-left rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E52B32] ${
                      isSelected
                        ? "border-2 ring-2 ring-offset-2 ring-offset-[#070708]"
                        : isDisabled
                          ? "border border-white/5 opacity-50 cursor-not-allowed"
                          : "border border-white/10 hover:border-white/30"
                    }`}
                    style={{
                      borderColor: isSelected ? f.packColor : undefined,
                      "--tw-ring-color": isSelected ? f.packColor : undefined,
                      background: isSelected ? `${f.packColor}18` : "#101012",
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? "Remove" : "Select"} ${f.name} for your box`}
                  >
                    {/* Pack Image */}
                    <div className="aspect-square relative overflow-hidden bg-[#070708]">
                      <img
                        src={f.img}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101012]/60 via-transparent to-transparent" />
                    </div>

                    {/* Selection badge; the pack art already carries the flavour name */}
                    {isSelected && (
                      <div
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                        style={{ background: f.packColor }}
                      >
                        <Check size={15} strokeWidth={3} className="text-white" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Hero of the section: large sticky 3D box */}
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24">
            <Box3DViewer
              selectedFlavours={selected}
              bare
              stageClassName="h-[340px] md:h-[420px] lg:h-[calc(100vh-8rem)] lg:min-h-[480px] lg:max-h-[700px]"
            />
          </div>

          {/* Summary & Purchase Panel */}
          <div className="lg:col-start-1 lg:row-start-2 w-full">
            <div className="rounded-3xl p-6 bg-[#101012] border border-white/10">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="font-display font-bold text-lg uppercase tracking-wider text-[#F6F3ED]">
                  Your box
                </h3>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{
                    background: complete
                      ? "rgba(63,189,121,0.18)"
                      : "rgba(229,43,50,0.15)",
                    color: complete ? "#3FBD79" : "#E52B32",
                  }}
                >
                  {count} of {MAX} selected
                </span>
              </div>

              {/* Chosen Slots Chips */}
              <div className="py-4 space-y-2 border-b border-white/10">
                {[0, 1, 2].map((idx) => {
                  const f = selected[idx];
                  return f ? (
                    <div
                      key={f.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#141416] border border-white/10"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={f.img}
                          alt={f.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#F6F3ED]">
                          {f.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeSlot(idx)}
                        className="w-11 h-11 -my-2 -mr-2 flex items-center justify-center rounded-lg hover:bg-white/10 text-[#B7B5B0] hover:text-[#E52B32] transition-colors"
                        aria-label={`Remove ${f.name} from box`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-dashed border-white/15 text-xs text-[#B7B5B0]/60 uppercase tracking-wider font-semibold"
                    >
                      Slot {idx + 1} · empty
                    </div>
                  );
                })}
              </div>

              {/* Price Row */}
              <div className="flex items-end justify-between py-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-semibold text-[#B7B5B0] uppercase tracking-wider block">
                    Any 3 flavours
                  </span>
                  <span className="text-xs text-[#B7B5B0]/70 font-normal">
                    3 packs · 300g total
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#B7B5B0] line-through mr-2 font-semibold">
                    ₹{flavours[0].price * MAX}
                  </span>
                  <span className="font-display font-black text-2xl text-[#E52B32]">
                    ₹{BOX_PRICE}
                  </span>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="pt-4">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="w-full py-4 rounded-full bg-[#3FBD79] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Check size={16} strokeWidth={3} />
                      Box added to cart
                    </motion.div>
                  ) : (
                    <motion.button
                      key="cta"
                      onClick={handleAddBox}
                      disabled={!complete}
                      whileHover={
                        complete
                          ? {
                              y: -2,
                              boxShadow: "0 8px 30px rgba(229,43,50,0.4)",
                            }
                          : {}
                      }
                      whileTap={complete ? { scale: 0.98 } : {}}
                      className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 ${
                        complete
                          ? "bg-[#E52B32] cursor-pointer shadow-lg shadow-[#E52B32]/30"
                          : "bg-white/10 text-white/40 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingBag size={15} />
                      {complete
                        ? `Add box to cart · ₹${BOX_PRICE}`
                        : `Choose ${MAX - count} more flavour${MAX - count > 1 ? "s" : ""}`}
                    </motion.button>
                  )}
                </AnimatePresence>
                <p className="text-center text-[11px] text-[#B7B5B0]/70 mt-2 font-normal">
                  Standard shipping & applicable taxes calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
