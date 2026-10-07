# Naastha — Black Cinematic Website PRD v3.1 (redesign)

**Date:** 7 October 2026
**Replaces:** PRD v3.0. Builds on the existing codebase (section 0); nothing listed there as present is rebuilt from scratch.
**Goal:** a premium, modern, all-black D2C website that feels like a film: smooth scroll, real AI-generated videos in fixed positions, fluid animation everywhere, and a working shop.

---


## 1. Why v2 failed (what we are fixing)

| Problem in current build | Required fix in v3 |
| --- | --- |
| Animations feel basic: plain fades, identical reveals everywhere | A defined motion system: smooth scroll, scroll-scrubbed scenes, text-split reveals, magnetic buttons, clip-path transitions, parallax (section 6) |
| Not AI-generated videos: scenes are procedural Three.js canvases (particles, box meshes) | Real AI-generated MP4/WebM films in every video slot (section 5). Three.js is kept only for the interactive pack and box |
| Packs look like generated geometry, not the real product | Use real pack photos/renders. Only the live 3D viewer uses a model, and it must use the real artwork |
| Page feels like stacked sections | Continuous cinematic flow: sections overlap, pin, and transition into each other |
| Motion is not smooth | One scroll engine (Lenis) driving GSAP; everything on `transform`/`opacity`; 60fps target |

**Honest scope note:** Claude Code cannot generate the videos. You generate them with an AI video tool using the prompts in section 5. The code must be built so each video drops into its slot by filename, with a poster fallback until the file exists.

---

## 2. Design direction: "Black Cinema"

**Feel:** a dark luxury product film. Think premium audio or sneaker brand sites. Huge type, deep black, one red accent, light that moves.

### Colour tokens
| Token | Value | Use |
| --- | --- | --- |
| `--black` | `#050506` | Page background |
| `--ink` | `#0D0D10` | Alternate sections |
| `--panel` | `#17171B` | Cards, selectors |
| `--line` | `rgba(255,255,255,0.08)` | Hairline borders |
| `--red` | `#E52B32` | CTAs, accents, glow |
| `--white` | `#F6F3ED` | Headlines |
| `--muted` | `#9C9A95` | Body copy |
| `--gold` | `#D9B779` | Gifting and story light only |

### Typography (redesign: cut from five font families to three)
- Keep **Bricolage Grotesque** (display, already loaded) and **Instrument Serif** (editorial). Body uses **Inter**. Remove Oswald, Playfair Display and Caveat from `index.css`.
- Display: bold, tight, wide. Headlines 72–140px desktop, 40–60px mobile, letter-spacing -0.03em.
- Editorial: a serif (for example *Instrument Serif*) for story and founder quotes.
- Body: 16–18px, line-height 1.6, max width 60ch.

### Surface rules
- Pure black everywhere. No light sections.
- Soft red or flavour-colour glows behind products. Film grain overlay at ~4% opacity across the whole site.
- Minimal cards. Prefer large video, large type, and whitespace.
- All text, prices, and claims are HTML. Never baked into video.

---

### Redesign moves (v3.1)
1. **Act structure, not 12 equal sections.** The home page is four acts: *Arrive* (S02–S03), *Choose* (S04–S05), *Believe* (S06–S08), *Close* (S09–S12). Each act opens with a full-viewport statement line and uses one dominant colour mood (red, flavour colour, gold, red).
2. **One hero per screen.** Each section has one large media element and one headline. Remove secondary cards and decorative badges that compete with it.
3. **Flavour colour drives the page.** The active flavour sets a CSS variable `--flavour` that tints glows, the cursor ring, the scroll progress line and the buy button across the whole home page.
4. **Persistent mini buy bar.** After the hero, a slim bar (flavour name, "3 for ₹200", Add) stays reachable so the cinematic scroll never blocks purchase.
5. **Fewer, bigger type moments.** Cap each section at one headline, one line of body and one CTA.

---

## 3. Tech stack (required)

| Need | Library |
| --- | --- |
| Smooth scroll | **Lenis** |
| Scroll-driven animation, pinning, scrubbing | **GSAP + ScrollTrigger** |
| Text splitting / reveals | **GSAP SplitText** (or `split-type`) |
| Component transitions, layout, page transitions | **Framer Motion** |
| Interactive pack and box | **Three.js** (already installed, used directly). Add R3F/drei only if the viewers are rewritten. GLB models and real textures |
| Video | Native `<video>` (muted, loop, playsinline), WebM + MP4, lazy-loaded |

Rules: animate only `transform`, `opacity`, `clip-path`, `filter` (sparingly). One RAF loop (Lenis + GSAP ticker). Respect `prefers-reduced-motion`.

---

## 4. Video position map

Every video has a fixed slot, filename, aspect ratio, and behaviour. Files live in `public/media/video/` with matching posters in `public/media/posters/`.

| ID | Section | Position on page | Behaviour | Desktop | Mobile | Filename |
| --- | --- | --- | --- | --- | --- | --- |
| **V01** | S02 Hero | Full-bleed background behind headline; product action on the right 60% | Autoplay, muted, loop, 8s. Headline overlaid | 16:9 1920×1080 | 9:16 1080×1920 (separate render) | `V01-hero-desktop.mp4` / `V01-hero-mobile.mp4` |
| **V02a–f** | S04 Flavour Studio | Behind the live 3D pack, one per flavour. Centre 55% kept dark and empty | Only the active one plays. Crossfade 500ms on switch | 1:1 | 4:5 | `V02-creamonion.mp4`, `V02-manchurian.mp4`, `V02-punjabitadka.mp4`, `V02-pizza.mp4`, `V02-peridesi.mp4`, `V02-methi.mp4` |
| **V03** | S06 Why Choose CRISP'IT | Large sticky film on the left, benefit copy scrolls on the right | Scroll-triggered play; scrubs forward with scroll | 16:9 | 4:5 | `V03-ingredient-macro.mp4` |
| **V04** | S07 Gifting | Full-width cinematic band | Plays once when 50% visible, holds last frame, "Replay" button | 16:9 | 4:5 | `V04-gifting-reveal.mp4` |
| **V05** | S08 Brand Story | Full-screen pinned film; chapter text changes over it | Scroll-scrubbed across 3 chapters | 16:9 | 4:5 | `V05-brand-mood.mp4` (+ 3 shot files `V05-shot1/2/3.mp4`) |
| **V06** | S09 Founder (optional) | Beside the real portrait | Click-to-play with captions | 4:5 | 4:5 | `V06-shruti.mp4` (real footage only) |
| **V07** | S11 Final CTA | Full-bleed background behind the closing headline | Autoplay loop, 6s | 16:9 | 4:5 | `V07-closing-desktop.mp4` / `V07-closing-mobile.mp4` |
| **V08** | Build-a-box help panel (optional) | Small player in a "See how the box works" panel | Click-to-play | 16:9 | 16:9 | `V08-box-explainer.mp4` |
| **BG1** | S09 Founder | Subtle looping backdrop behind portrait | Autoplay loop, very low contrast | 4:5 | 4:5 | `BG1-founder-light.mp4` |

### Loading rules
- Every slot shows its poster instantly, then swaps to video when ready. No empty black boxes.
- Hero loads first (`preload="auto"`). Everything else lazy-loads when within ~1 viewport of entering.
- Pause any video that is off-screen or when the tab is hidden.
- Serve desktop or mobile file by viewport. Budgets: hero 2–4MB desktop, 1–2MB mobile; flavour loops 0.4–1MB each.
- If a file is missing, the slot falls back to the poster and logs a console warning. The site must never break.

---

## 5. AI video generation prompts

**Tools to use:** Google Veo 3, Kling 2.x, Runway Gen-4, or Higgsfield. Use **image-to-video** with your real pack photos as the first frame, which keeps the packaging accurate. Generate several takes per clip and pick the cleanest.

### Shared rules (add to every prompt)
> Premium CGI product film for a snack brand. No text, no captions, no logos added, no watermark, no UI, no people unless stated. Do not alter or re-spell the packaging artwork. Black studio, glossy reflective floor, smooth slow camera, cinematic lighting, shallow depth of field. No audio. Seamless loop where noted (first and last frame match).

Reject any take with warped labels, extra packs, melting shapes, or flickering shadows. If the label degrades, composite the real pack art over a tracked render in editing.

### V01 — Hero (8s loop; make desktop 16:9 and mobile 9:16 separately)
 Three sealed snack packs float in a pure black studio over a reflective black floor, one hero pack in front and two behind at different depths. Warm gold rim light and a deep red glow behind. Slow dolly-in with subtle depth drift. The hero pack rotates about 8 degrees, catches a sweeping light highlight, and returns to its start. Tiny spice pieces (cumin, chilli flakes, fenugreek leaves) drift slowly in the air, slightly out of focus. Desktop: all action on the right 60%, left 40% dark and empty. Mobile: hero pack in the lower middle, top 30% empty, bottom quiet. Seamless loop.

### V02 — Flavour atmospheres (6s loop each, no pack in frame)
> Empty black studio, centre 55% completely clear and dark. Around the outer edges, slow floating [INGREDIENTS] at different depths, lit by soft [COLOUR] light against black, faint haze at the edges only. No packs, no text. Slow cyclic motion, stable camera, seamless loop.

| Flavour | Colour light | Ingredients (confirm against real recipe) |
| --- | --- | --- |
| Cream 'n' Onion | Teal + warm white | Onion, herbs, cream wisps |
| Manchurian | Amber | Garlic, spring onion, chilli |
| Punjabi Tadka | Orange + green | Cumin, curry leaf, chilli |
| Pizza | Gold + tomato red | Tomato, oregano, basil |
| Peri Desi | Crimson | Red chilli, peri spice |
| Methi | Deep green | Fenugreek leaves |

### V03 — Ingredient macro (8s)
> Extreme macro of a crisp whole-wheat snack surface showing realistic pores and texture on a black background. Warm light slowly sweeps across it. A few roasted cumin seeds and chilli flakes drift nearby. Very slow camera glide. No smoke, no oil splash, no medical imagery. Ends on a stable frame suitable for loop or dissolve. Desktop: subject left, right 40% dark. Mobile: centred, space above.

### V04 — Gifting reveal (8s, not looped)
> A closed matte-black premium gift box with a thin gold ribbon rests on a black pedestal under warm golden side light. 0–2s: slow close view of the box. 2–5s: the lid lifts and opens smoothly, revealing six assorted snack packs neatly arranged. 5–8s: the camera settles into a three-quarter view and holds. Crisp edges, soft shadows, restrained reflections. No extra objects.

### V05 — Brand mood (10–12s, 3 shots)
> Shot 1: macro arrangement of whole spices on dark stone, warm side light, slow slide. Shot 2: slow glide across a crisp snack surface, shallow depth of field. Shot 3: the real packs arranged in a premium studio composition with a soft floor reflection and warm light. Smooth dissolves between shots. Abstract atmosphere only: no factory, farm, workers, or founder.

### V07 — Closing scene (6s loop)
> Three different flavour snack packs standing together beside an open black branded box on a reflective black floor. Warm edge light and a soft red halo behind. The packs settle with a tiny slow breathing motion. Stable camera. Desktop: action right half, left half empty. Mobile: centred with space above and below. Seamless loop.

### BG1 — Founder backdrop (6s loop)
> Dark charcoal textured wall with warm diagonal window-light shadows moving almost imperceptibly. Quiet, elegant, very low contrast. No people, no objects. Seamless loop.

### V06 — Founder interview
Real footage of Shruti only. Do not AI-generate her face, voice, or words.

---

## 6. Motion system (the "smooth, not basic" spec)

### Global
| Feature | Spec |
| --- | --- |
| **Smooth scroll** | Lenis, `lerp 0.08`, synced to GSAP ticker. Disabled under reduced-motion |
| **Page load** | Short branded intro (max 1.2s): black screen, red Naastha logo draws in, curtain wipes up to reveal hero. Skippable, shown once per session |
| **Custom cursor** (fine pointer only) | Small dot + trailing ring. Grows on links, shows "Play" over videos, "Drag" over the 3D pack |
| **Magnetic buttons** | Primary CTAs pull toward the cursor within ~80px, with a soft spring return |
| **Film grain** | Fixed 4% noise overlay, lightly animated |
| **Scroll progress** | Thin red line at the top |
| **Page transitions** | Between routes: black curtain wipe 500ms, content fades in with stagger |
| **Easing** | One token set: `out-expo` for entrances `cubic-bezier(0.16,1,0.3,1)`, `in-out-quart` for transitions. No bouncy springs on products |

### Text
- Headlines split by line, each line masked and sliding up from 110% with 80ms stagger (700ms).
- Key words can scrub colour from muted to white as the section scrolls.
- Large outlined marquee text between sections (flavour names scrolling at different speeds, reversing on scroll direction).

### Media
- Videos scale from 1.15 to 1.0 as they enter (slow zoom-settle).
- Image and video masks reveal via `clip-path` (inset to full) over 900ms.
- Parallax layers: media moves at 0.85x scroll speed; floating ingredient cut-outs at 1.2x.
- Hover on cards: lift 6px, red edge glow, image zoom 1.05 over 400ms.

### Per-section choreography
| Section | Signature motion |
| --- | --- |
| **S01 Nav** | Transparent over hero; shrinks and gains blur background after 48px scroll. Menu opens as a full-screen black sheet with staggered links |
| **S02 Hero** | V01 plays under split-text headline. Pack area has gentle pointer parallax (max 12px). Scroll: hero film scales down and darkens as S03 slides over |
| **S03 Facts** | Five facts reveal in a staggered row (70ms). Final values shown from the start (no counting through false numbers) |
| **S04 Flavour Studio** | Pinned stage. Switching flavour: pack twists out ~20°, new pack twists in (550ms), atmosphere video crossfades, background glow colour tweens, flavour name slides vertically. Drag-to-rotate in Inspect mode |
| **S05 Box Builder** | Click a flavour: a pack flies in an arc (650ms) into the slot with a soft landing shadow; slot label appears; third pick triggers a light sweep and lid settle. Sticky preview on desktop |
| **S06 Why Choose** | V03 sticky left. Copy groups on the right highlight in turn; video progress is tied to scroll. No scroll-jacking |
| **S07 Gifting** | V04 plays when 50% in view. Collection cards slide up with stagger and have hover image zoom |
| **S08 Story** | Section pins. V05 scrubs with scroll through three chapters. Chapter titles swap with masked text transitions |
| **S09 Founder** | Real portrait over BG1 light. Quote reveals line by line |
| **S11 Final CTA** | V07 behind. Headline "Pick your three. Make it yours." scales in. Button has a pulsing red halo |
| **S12 FAQ/Footer** | Accordion height animates 250ms. Footer has a giant outlined "NAASTHA" wordmark that reveals on scroll |

### Reduced-motion and weak devices
- Reduced-motion: no Lenis, no parallax, no scrubbing; videos replaced by posters; transitions under 150ms.
- Pause-motion toggle in the header (keep from v2).
- Low-power or data-saver: poster in place of hero video, click-to-play for others.

---

## 7. Interactive 3D (kept, but upgraded)

Only two live 3D pieces remain. Everything else cinematic is video.

- **G01 Pack viewer (S04, product page):** GLB pouch model with the real front and back artwork as textures. Soft environment lighting, contact shadow, subtle floor reflection. Idle sway ±6–10°, drag to rotate, reset button, pinch and drag confined to the model on mobile.
- **G02 Box viewer (S05, shop):** GLB box with a hinged lid, `slot_1`–`slot_3` anchors, arc-in animation, light sweep, and open/close button.
- If a GLB is not ready, use the current procedural model as a temporary fallback, marked in the checklist.
- One WebGL canvas active at a time. Dispose it when offscreen. Cap pixel ratio at 2. Never block the page on 3D loading.

---

## 8. Page structure

1. **S01** Nav + offer bar ("Choose any 3 flavours for ₹200")
2. **S02** Hero — V01
3. **S03** Marquee strip + five product facts
4. **S04** Flavour Studio — G01 + V02
5. **S05** Make Your Own Box — G02
6. **S06** Why Choose CRISP'IT? — V03
7. **S07** Gifting — V04
8. **S08** Brand Story — V05
9. **S09** Meet Shruti — portrait + BG1 (+ V06 optional)
10. **S10** Community/reviews — hidden until real content exists
11. **S11** Final CTA — V07
12. **S12** FAQ + Footer

Routes (as built): `/`, `/shop`, `/product/:id`, `/flavours`, `/about`, `/contact`, `/cart`, `/checkout`, `/success`, `/track`, `/faq`. Policy pages are still to add.

### Content constants
- Flavours: Cream 'n' Onion, Manchurian, Punjabi Tadka, Pizza, Peri Desi, Methi.
- USPs: 0g Sugar, 0g Cholesterol, 0g Trans Fat, No Palm Oil, 12g Protein per pack (verify before publishing).
- Offer: any 3 flavours for ₹200.
- Say "savoury snacks" or "packs". Never "chips".
- Do not invent reviews, founder history, or gifting prices. Confirm the Naastha/CRISP'IT relationship before launch.

---

## 9. Responsive rules

- Test at 360, 390, 430, 768, 1024, 1280, 1440, 1920.
- Mobile uses its own portrait videos (V01, V07) and 4:5 crops. Never just crop the desktop file.
- No pinned scroll-jack scenes on phones except S08 if smooth; otherwise sequential stacked chapters.
- Tap targets ≥ 44px. Bottom purchase bar shows only one at a time.
- Hover-only features need a tap or button equivalent.

---

## 10. Performance and quality targets

- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Hero poster visible immediately; reserve media dimensions to avoid layout shift.
- Hold 60fps scrolling on desktop and a stable 30fps+ on mid-range phones. If frames drop, reduce grain, parallax, and 3D quality first.
- Video budgets as in section 4. Provide WebM and MP4.

---

## 11. Build order (redesign pass over the existing build)

1. **Clean up:** remove leftovers listed in section 0, drop unused fonts, fix the one-ticker Lenis/GSAP sync.
2. **Media:** generate posters for every slot, then add the scrub, play-once, click-to-play and crossfade modes to `MediaSlot`.
3. **Hero (S02)** restyled to the redesign moves. Review before continuing.
4. **Flavour Studio (S04)** with the `--flavour` variable, then **Box Builder (S05)**.
5. **Scroll scenes:** S06 sticky film, S07 reveal, S08 scrubbed story.
6. **Mini buy bar, remaining sections, policy pages, real checkout.**
7. **Responsive, performance, accessibility pass.**

Review checkpoint after step 3: if the hero does not feel cinematic and smooth, stop and fix it before building the rest.

---

## 12. Acceptance checklist

- [ ] Whole site is black-themed, with consistent tokens and grain.
- [ ] Scrolling is smooth (Lenis), with no jank or layout jumps.
- [ ] Every video slot in section 4 is wired, shows a poster first, and plays the real AI video when the file is present.
- [ ] Hero, closing, and flavour loops are real AI-generated clips, not canvases.
- [ ] Headlines use masked split-text reveals; buttons are magnetic; the cursor reacts on desktop.
- [ ] Flavour switch and pack-to-box animations match the timings above, with no stuck or duplicate packs on rapid clicks.
- [ ] Story section scrubs smoothly through three chapters.
- [ ] Pause-motion toggle and reduced-motion fallback work.
- [ ] Mobile uses dedicated portrait media and has no horizontal scroll.
- [ ] Missing media never breaks the page.
- [ ] Cart, 3-flavour box, and checkout work end to end.

---

## 13. Asset production checklist (you provide)

| Asset | Status |
| --- | --- |
| Real logo (SVG) | ☐ |
| Six pack front photos / renders (transparent PNG, high-res) | ☐ |
| Six pack back photos (nutrition side) | ☐ |
| Transparent PNG cut-outs of the six packs (JPGs exist in `public/products/`) | ☐ |
| GLB pouch model (or approve procedural fallback) | ☐ |
| GLB box model (or approve procedural fallback) | ☐ |
| V01 desktop + mobile | ☐ |
| V02 × 6 | ☐ |
| V03 | ☐ |
| V04 | ☐ |
| V05 (+ shots) | ☐ |
| V07 desktop + mobile | ☐ |
| BG1 | ☐ |
| Posters for every video (WebP) | ☐ |
| Shruti portrait, bio, quote | ☐ |
| Real ingredients, weights, prices, nutrition | ☐ |
| Gifting box SKUs and prices | ☐ |

Until videos exist, the site ships with posters and is marked as a prototype. The slots and animation system are still built and tested.
