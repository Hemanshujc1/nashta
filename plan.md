# Naastha Black Cinematic Website: Build Plan (v3.1 redesign)

Source: `docs/archive/Naastha-Cinematic-Website-PRD-v3.md`. Section references (§) point to the PRD. §0 lists what already exists; this plan only covers changes, not rebuilds.

## Decisions

- **Stack (as built):** React 19 + Vite 7 + JavaScript (JSX) + Tailwind 4, React Router, Lenis, GSAP, Framer Motion, Three.js, zustand. No TypeScript migration.
- **Media:** Videos are supplied by the owner. `public/media/video` and `public/media/posters` are empty, so every slot shows a poster, then the procedural canvas as fallback, until its file exists.
- **Commerce:** This is a demo build, not a store taking real orders. zustand cart exists. Checkout stays a mock permanently — no payment provider will be integrated. "Place order" simulates success and routes to `OrderSuccess` with a fake order number.
- **Copy rules:** "savoury snacks" or "packs", never "chips". No invented reviews, founder history, or gifting prices.

## Already done (do not redo)

- Foundation: `SmoothScroll`, `Loader`, `Cursor`, `Magnetic`, `MaskLines`, `Grain`, `ScrollProgress`, `PageCurtain`, `motionStore`.
- `MediaSlot` and the `data/media.js` registry (V01–V08, BG1).
- Sections: Hero, NutritionBar, FlavourExplorer, BundleBuilder, WhyChooseCrispit, GiftingSection, BrandStory, FounderStory, FinalCtaSection, FAQSection, Navbar, MobileNav, Footer, CartDrawer.
- Pages and routes: Home, Shop, Product, Flavours, About, Contact, Cart, Checkout, OrderSuccess, TrackOrder, FAQ.
- Viewers: `Pack3DViewer`, `Box3DViewer`, plus five procedural scene canvases (to become fallbacks).

## Phases

Each phase ends with a gate. Don't start the next until it passes.

### Phase 1: Clean up
- Grep each leftover in PRD §0 (`ThemeContext`, `themeStore`, `ReelCarousel`, `GlobalSection`, `BeliefSection`, `BentoFeatures`, `scaffold*.js`, `fix-escapes.js`, `Xoriant.pdf`, `dist/`, old PRDs, `CINEMATIC_ASSETS_GUIDE.md`). Delete or move to `docs/` if unused.
- Remove Oswald, Playfair Display and Caveat from `index.css`; keep Bricolage Grotesque, Instrument Serif, Inter. Replace usages.
- Confirm Lenis runs on the GSAP ticker (one RAF loop) and is off under reduced-motion.
- **Gate:** `npm run build` and `npm run lint` pass; no visual change except fonts.

### Phase 2: Media pipeline (§4)
- Generate dark placeholder posters (WebP) for every ID in `data/media.js` into `public/media/posters/`.
- Extend `MediaSlot` with modes: `scrub` (tied to scroll), `once` (play at 50% visible, hold last frame, Replay), `click` (click-to-play), crossfade between slots (for V02).
- Show the matching procedural canvas as `children` fallback for V01, V02, V03, V04, V07 only while the video is missing.
- Low-power / data-saver: poster only.
- **Gate:** a test route renders every slot with no files present and nothing breaks.

### Phase 3: Redesign foundation (§2 redesign moves)
- Add the `--flavour` CSS variable, driven by the active flavour; wire it to glows, cursor ring, scroll progress and buy button.
- Add act-opening statement lines (Arrive, Choose, Believe, Close) in `Home.jsx`.
- Persistent mini buy bar after the hero (hidden at top, one purchase bar at a time on mobile).


### Phase 4: Hero (S02), review checkpoint
- Restyle `HeroSection` to one headline, one CTA, V01 full-bleed; keep existing split-text and pointer parallax; add scale-down and darken as S03 slides over.
- **Gate (§11):** if the hero is not cinematic and smooth, fix it before continuing.

### Phase 5: Flavour Studio + Box Builder (S03–S05)
- `NutritionBar`: marquee plus five facts, final values only.
- `FlavourExplorer`: pinned stage, V02 crossfade, twist 550ms, glow tween, name slide, rapid-click safety, drag/reset. Connect to `--flavour`.
- `BundleBuilder`: 650ms arc-in, landing shadow, third-pick sweep and lid settle, "3 for ₹200" logic. Needs transparent pack PNGs.
- One WebGL canvas at a time, disposed off-screen, pixel ratio ≤ 2.

### Phase 6: Scroll scenes (S06–S08)
- `WhyChooseCrispit`: V03 sticky left, copy groups highlight in turn, progress tied to scroll.
- `GiftingSection`: V04 play-once and hold, Replay button, card hover zoom.
- `BrandStory`: pinned, V05 scrubbed over three chapters; stacked chapters on mobile if the pin isn't smooth.

### Phase 7: Close + remaining pages (S09–S12)
- `FounderStory` (portrait, BG1, line-by-line quote, optional V06), `FinalCtaSection` (V07, pulsing halo), `FAQSection` (250ms), `Footer` giant outlined wordmark.
- S10 reviews stays hidden until real content exists.
- Add policy pages (shipping, returns, privacy, terms). Restyle About, Flavours, Shop, Product to black cinema.

### Phase 8: Commerce (mock checkout, demo-only)
- Restyle `CartDrawer`, `Cart`, `Checkout`, `OrderSuccess`, `TrackOrder` on the existing `cartStore`.
- No payment provider. Checkout collects shipping details, then "Place order" simulates success (short delay, no real transaction) and routes to `OrderSuccess` with a mock order number. `TrackOrder` shows a mock status timeline.
- **Gate:** cart → 3-flavour box → mock checkout → order success works end to end.

### Phase 9: Polish (§9, §10)
- Responsive at 360, 390, 430, 768, 1024, 1280, 1440, 1920; no horizontal scroll; tap targets ≥ 44px; tap equivalents for hover.
- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1; degrade grain, parallax, 3D first.
- Accessibility pass and the §12 checklist. Delete the procedural scene canvases once real videos ship.

## Dependencies on the owner (§13)

| Needed by | Item |
| --- | --- |
| Phase 1 | Logo SVG (PNG exists) |
| Phase 5 | Transparent pack PNGs (JPGs exist); GLB pouch and box, or approve the procedural fallback |
| Phase 2 onward | AI videos V01–V07 and BG1 into `public/media/video/` by filename |
| Phase 7 | Shruti bio and quote (portrait exists) |
| Phase 7–8 | Ingredients, weights, prices, nutrition, gifting SKUs and prices |

## Status

- [x] Foundation, MediaSlot basics, sections, pages, cart (pre-existing)
- [x] Phase 1 Clean up
- [x] Phase 2 Media pipeline
- [x] Phase 3 Redesign foundation
- [x] Phase 4 Hero (built; owner review pending)
- [x] Phase 5 Flavour Studio + Box Builder
- [x] Phase 6 Scroll scenes
- [x] Phase 7 Close + pages (V05, V07, BG1 use video-free fallbacks; V06 skipped; founder quote and policy text are placeholders)
- [x] Phase 8 Commerce (mock checkout, demo-only — no payment provider; cart is session-scoped so each visit starts empty)
- [ ] Phase 9 Polish
