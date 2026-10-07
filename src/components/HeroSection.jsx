import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, scrollToTarget, prefersReducedMotion } from "../lib/motion";
import { useUiStore } from "../store/uiStore";
import { useMotionStore } from "../store/motionStore";
import MediaSlot from "./motion/MediaSlot";
import HeroFallback from "./motion/HeroFallback";
import MaskLines from "./motion/MaskLines";
import Magnetic from "./motion/Magnetic";

const PARALLAX = 12; // px, PRD v3 §6 S02
// The supplied V01 is centre-composed: nudge it right on desktop so the packs clear the headline,
// (its left edge fades out so no seam shows), and frame the front pack on the portrait crop.
const FILM_FRAMING =
  "object-[62%_50%] md:object-center md:translate-x-[14%] md:[mask-image:linear-gradient(to_right,transparent,black_20%)]";

export default function HeroSection() {
  const ready = useUiStore((s) => s.ready);
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const root = useRef(null);
  const stage = useRef(null);
  const film = useRef(null);
  const drift = useRef(null);
  const content = useRef(null);
  const [filmReady, setFilmReady] = useState(false);

  // Reveal secondary copy once the intro curtain lifts.
  useEffect(() => {
    if (!ready) return undefined;
    const items = root.current.querySelectorAll("[data-fade]");
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return undefined;
    }
    const t = gsap.fromTo(
      items,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.55,
      },
    );
    return () => t.kill();
  }, [ready]);

  // Scroll: the hero stays pinned (sticky) while S03 slides over it; the film recedes and darkens.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          start: 0,
          end: () => window.innerHeight,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(stage.current, { scale: 0.92, borderRadius: 28, duration: 1 }, 0)
        .to(film.current, { opacity: 0.3, duration: 1 }, 0)
        .to(content.current, { yPercent: -10, opacity: 0, duration: 0.4 }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  // Pointer parallax on the film. The fallback scene runs its own per-pack parallax.
  useEffect(() => {
    if (
      !filmReady ||
      !motionEnabled ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return undefined;
    const el = drift.current;
    const x = gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" });
    const onMove = (e) => {
      x(-(e.clientX / window.innerWidth - 0.5) * 2 * PARALLAX);
      y(-(e.clientY / window.innerHeight - 0.5) * 2 * PARALLAX);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [filmReady, motionEnabled]);

  const go = (target) => (e) => {
    e.preventDefault();
    scrollToTarget(target);
  };

  return (
    <section
      ref={root}
      id="hero"
      className="sticky top-0 h-[100svh] min-h-[640px] -mt-8 overflow-hidden bg-[#050506]"
      aria-label="Naastha: Desi flavours, boldly reimagined"
    >
      <div
        ref={stage}
        className="relative h-full overflow-hidden will-change-transform origin-[50%_40%]"
      >
        {/* V01 hero film (falls back to the floating-pack scene) */}
        <div ref={film} className="absolute inset-0">
          <div ref={drift} className="absolute -inset-3 will-change-transform">
            <MediaSlot
              id="V01"
              eager
              className="absolute inset-0"
              mediaClassName={FILM_FRAMING}
              onVideoReady={() => setFilmReady(true)}
            >
              <HeroFallback />
            </MediaSlot>
          </div>
        </div>
        {/* readable copy zone: left on desktop, top and bottom on mobile */}
        <div className="hidden md:block absolute inset-0 pointer-events-none bg-gradient-to-r from-[#050506] via-[#050506]/60 via-40% to-transparent to-75%" />
        <div className="absolute inset-x-0 top-0 h-[45%] md:h-40 pointer-events-none bg-gradient-to-b from-[#050506] via-[#050506]/70 md:via-[#050506]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] md:h-40 pointer-events-none bg-gradient-to-t from-[#050506] via-[#050506]/75 md:via-[#050506]/40 to-transparent" />

        <div
          ref={content}
          className="relative z-10 h-full container mx-auto max-w-screen-xl px-5 md:px-8 flex flex-col justify-between md:justify-center pt-28 pb-10 md:pb-24"
        >
          <div className="max-w-4xl">
            <div
              data-fade
              className="flex items-center gap-3 mb-5 md:mb-6 opacity-0"
            >
              <span className="block w-8 h-px bg-[#E52B32]" />
              <span className="text-[#E52B32] text-xs font-semibold uppercase tracking-[0.3em]">
                Act I · Arrive
              </span>
            </div>

            <MaskLines
              as="h1"
              play={ready}
              delay={0.15}
              className="font-cine font-extrabold uppercase text-[#F6F3ED] leading-[0.88] tracking-[-0.035em] md:mb-8"
              style={{ fontSize: "clamp(2.9rem, 7.4vw, 7.5rem)" }}
              lines={[
                { text: "Desi flavours." },
                {
                  text: "Boldly",
                  className:
                    "font-serif-cine italic normal-case font-normal text-[#D9B779] tracking-[-0.02em]",
                },
                { text: "reimagined.", className: "text-[#E52B32]" },
              ]}
            />
          </div>

          <div className="max-w-md md:max-w-xl">
            <p
              data-fade
              className="text-[#B7B5B0] text-base md:text-xl leading-relaxed mb-6 md:mb-10 opacity-0"
            >
              Six savoury flavours. Made with atta, zero palm oil.
            </p>

            <div data-fade className="flex opacity-0">
              <Magnetic>
                <a
                  href="#build-a-box"
                  onClick={go("#build-a-box")}
                  id="hero-cta-build"
                  data-cursor="Build"
                  className="group flex items-center justify-center gap-3 bg-[#E52B32] text-white font-bold uppercase tracking-[0.18em] text-xs md:text-sm px-9 py-5 rounded-full transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(229,43,50,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Build your box
                  <span className="bg-white/20 text-[11px] px-2.5 py-0.5 rounded-full tracking-normal">
                    3 for ₹200
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div
          data-fade
          className="hidden md:flex absolute z-10 bottom-7 right-8 items-center gap-3 text-[#9C9A95] text-[10px] font-semibold uppercase tracking-[0.3em] opacity-0"
          aria-hidden="true"
        >
          Scroll
          <span className="relative block w-px h-12 bg-white/15 overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-[#E52B32] animate-[scrollcue_1.8s_ease-in-out_infinite]" />
          </span>
          <ArrowDown size={12} />
        </div>
      </div>
    </section>
  );
}
