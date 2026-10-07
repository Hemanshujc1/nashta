# Naastha v2.0 — 3D Objects, Animations & Media Guide

A quick reference breakdown of every 3D object, WebGL canvas, and cinematic animation created for the v2 website, the idea behind it, and its exact folder location.

---

## 1. V01 — Hero Cinematic 3D Loop
* **File:** `src/components/three/HeroCinematicCanvas.jsx`
* **Used In:** S02 Hero (`src/components/HeroSection.jsx`)
* **Idea:** Charcoal CGI studio scene with three floating snack packs at layered depths (Peri Desi in front, Cream 'n' Onion & Manchurian behind). Features warm rim lighting (`#D9B779`), deep-red backlight halo (`#E52B32`), drifting organic spice particles (cumin, chili, fenugreek), subtle 8° cyclic turn, and mouse parallax.
* **Key Objects:** 3 Three.js pouch meshes, 3D additive particle cloud, directional studio lights, unobtrusive Pause/Play button.

---

## 2. G01 — Interactive 3D Pack Pouch
* **File:** `src/components/three/Pack3DViewer.jsx`
* **Used In:** 
  * S04 Flavour Studio (`src/components/FlavourExplorer.jsx`)
  * Product Detail Page (`src/pages/Product.jsx`)
* **Idea:** Reusable procedural 3D snack pouch geometry with curved pillow volume, crimped top/bottom sealed ridges, and metallic foil sheen shaders.
* **Key Objects & Controls:**
  * Custom subdivided `BoxGeometry` modified into a foil pouch.
  * Dual-sided texturing (authentic front packaging art + custom-generated nutrition/barcode foil back).
  * **Drag to Rotate 360°** inspection mode.
  * **Reset View** button.
  * Smooth 20° twist-transition flip when switching flavours.

---

## 3. V02 — Flavour Atmosphere Canvases
* **File:** `src/components/three/FlavourAtmosphereCanvas.jsx`
* **Used In:** S04 Flavour Studio (`src/components/FlavourExplorer.jsx`)
* **Idea:** Ambient edge lighting and organic particle loops that dynamically crossfade when changing flavours. The center 55% stays dark and clear for the 3D pack.
* **Flavour Palettes:**
  * **Cream 'n' Onion:** Teal & warm white bokeh
  * **Manchurian:** Amber & toasted garlic flecks
  * **Punjabi Tadka:** Spicy orange & green embers
  * **Pizza:** Gold, tomato red & herb flecks
  * **Peri Desi:** Fiery crimson & chili specs
  * **Methi:** Deep forest green & fenugreek leaf silhouettes

---

## 4. G02 — 3D Box Ritual & Arc Selection Animation
* **File:** `src/components/three/Box3DViewer.jsx`
* **Used In:** 
  * S05 Box Builder (`src/components/BundleBuilder.jsx`)
  * Shop Page (`src/pages/Shop.jsx`)
* **Idea:** A branded charcoal 3D delivery box with 3 distinct compartments (`slot_1`, `slot_2`, `slot_3`). Selecting a flavour sends a 3D pack along an arc trajectory into that slot.
* **Choreography & Objects:**
  * 3D box base, red trim rim, velvet cavity, and dashed slot markers.
  * Three mini 3D packs with dynamic texture mapping.
  * **Arc Entry:** Pack spawns above the box and eases down into the slot (~600ms).
  * **3rd Selection:** Golden light sweep sweeps across the box and the hinged lid flap settles toward closed.
  * **Open Lid Button:** Lets shoppers re-open the lid to inspect their 3 selections.

---

## 5. V03 — Macro Ingredient / Material Canvas
* **File:** `src/components/three/IngredientMacroCanvas.jsx`
* **Used In:** S06 Why Choose CRISP'IT? (`src/components/WhyChooseCrispit.jsx`)
* **Idea:** Macro CGI film simulation showing moving warm light sweeps across atta whole-wheat pore textures with drifting roasted cumin and chili dust. Paired with a sticky editorial layout and a full Nutrition Lab Declarations modal.

---

## 6. V04 — Gifting Box Reveal Film
* **File:** `src/components/three/GiftingRevealCanvas.jsx`
* **Used In:** S07 Gifting & Collections (`src/components/GiftingSection.jsx`)
* **Idea:** 3D luxury presentation box with a gold ribbon band resting under golden spotlights. The hinged lid opens smoothly to reveal the 6 assorted packs inside. Includes an interactive **Replay Reveal** button.

---

## 7. V05 — Brand Mood Film & Chapters
* **File:** `src/components/BrandStory.jsx`
* **Used In:** S08 Brand Story
* **Idea:** Cinematic brand mood visual frame paired with an interactive 3-chapter narrative (*01 The Idea*, *02 The Flavour*, *03 The Everyday Ritual*) with tabbed chapter switching.

---

## 8. S09 — Founder Window-Light Treatment
* **File:** `src/components/FounderStory.jsx`
* **Used In:** S09 Meet Shruti
* **Idea:** Authentic portrait of founder Shruti with an autonomous moving diagonal window-light shadow effect across the dark background, accompanied by editorial serif quotes.

---

## 9. V07 — Three-Pack Closing Scene
* **File:** `src/components/three/ClosingSceneCanvas.jsx`
* **Used In:** S11 Final CTA (`src/components/FinalCtaSection.jsx`)
* **Idea:** Three distinct flavour packs resting proudly inside the Naastha box under warm gold and red studio lighting with gentle breathing float motion, inviting the user to *"Pick your three. Make it yours."*

---

## 10. Global Motion State & Accessibility
* **File:** `src/store/motionStore.js`
* **Used In:** Global Header (`src/components/Navbar.jsx`) and all 3D canvases
* **Idea:** Central toggle for **Pause / Play Ambient Motion** that pauses all idle 3D rotations and particle engines for accessibility and reduced-motion preferences.

---

## Summary of File Tree

```
src/
├── components/
│   ├── three/
│   │   ├── Box3DViewer.jsx              # G02: 3D Box Ritual + Arc Entry + Lid Animation
│   │   ├── ClosingSceneCanvas.jsx       # V07: Three-pack final studio composition
│   │   ├── FlavourAtmosphereCanvas.jsx  # V02: Flavour-specific dynamic particle loops
│   │   ├── GiftingRevealCanvas.jsx      # V04: Gifting box opening reveal + replay
│   │   ├── HeroCinematicCanvas.jsx      # V01: 3-pack floating hero CGI loop
│   │   ├── IngredientMacroCanvas.jsx    # V03: Macro material sweep + spice dust
│   │   └── Pack3DViewer.jsx             # G01: Interactive 3D pouch pack (360° drag)
│   ├── BrandStory.jsx                   # S08: Editorial brand chapters
│   ├── BundleBuilder.jsx                # S05: Make Your Own Box interface
│   ├── FAQSection.jsx                   # S12: Accordion FAQs (200ms ease)
│   ├── FinalCtaSection.jsx              # S11: Closing CTA section
│   ├── FlavourExplorer.jsx              # S04: Flavour Studio stage
│   ├── Footer.jsx                       # S12: Brand footer
│   ├── FounderStory.jsx                 # S09: Meet Shruti with window-light animation
│   ├── GiftingSection.jsx               # S07: Gifting collections & enquiry modal
│   ├── HeroSection.jsx                  # S02: Hero section
│   ├── Navbar.jsx                       # S01: Navigation + offer bar + motion toggle
│   ├── NutritionBar.jsx                 # S03: Five product facts (70ms stagger)
│   └── WhyChooseCrispit.jsx             # S06: Why Choose CRISP'IT?
├── store/
│   ├── cartStore.js                     # Shopping cart store
│   └── motionStore.js                   # Global ambient motion toggle
└── pages/
    ├── Home.jsx                         # Full homepage choreography
    ├── Product.jsx                      # Product detail (with live 3D Pack)
    └── Shop.jsx                         # Shop page (with 3D Box Builder)
```
