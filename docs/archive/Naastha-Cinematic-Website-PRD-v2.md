# Naastha — Cinematic Website PRD & Media Production Brief

**Version 2.0 · 7 October 2026**  
**Deliverable:** an immersive, responsive D2C website with real motion assets, interactive 3D and a working shopping experience.  
**Source:** attached “Pasted markdown.md”, the previously reviewed website reference video, and the request to substantially improve the visual experience.

## 1. The experience we are building

The previous result was rated 2/5 because it felt like a simple website and lacked the requested animations, AI-generated videos and 3D objects. This brief replaces optional visual suggestions with specific, testable production requirements.

Naastha should feel like entering a cinematic flavour studio: dark material-rich environments, beautifully lit packaging, colourful ingredients suspended in depth, a tactile flavour explorer and a box that fills as the customer chooses products. The website must also make buying easy on a phone and a computer.

The experience has three signature moments:

1. **The opening film:** a purpose-made product loop immediately establishes the premium look.
2. **The flavour studio:** customers switch between six flavours and inspect a real interactive pack.
3. **The box ritual:** choosing a flavour visibly places that pack into an open 3D box; the third choice completes the composition.

Ordinary content sections support these moments through typography, editorial imagery and intentional transitions. Generic repeated cards and identical fade-ins across every section will not satisfy this brief.

### Brand and content constants

- Working brand: **Naastha**, using the authentic red-and-white logo.
- Preserve the requested heading **“Why Choose CRISP’IT?”** in the editable design content. Confirm whether CRISP’IT is a range name or replacement brand before publishing; do not invent the relationship.
- Flavours: **Cream ’n’ Onion, Manchurian, Punjabi Tadka, Pizza, Peri Desi, Methi**.
- Supplied USPs: **0g Sugar, 0g Cholesterol, 0g Trans Fat, No Palm Oil, 12g Protein per pack**. Validate their applicability and pack-size context against approved product information before publication.
- Founder: **Shruti**. Use her real approved biography and portrait.
- Box offer: **choose any 3 flavours for ₹200**. Working assumption: three distinct flavours, one pack each; confirm duplicates, weights, tax and delivery treatment before launch.
- Customer-facing product language: “savoury snacks”, “snacks”, “packs” or “bites”. Do not describe the products as “chips”.

All timings, breakpoints and asset budgets below are proposed implementation requirements for this project. They are not claims about an existing website or guaranteed outputs from an AI generator.

## 2. Required visual deliverables

| ID | Deliverable | Placement | Launch status |
| --- | --- | --- | --- |
| V01 | AI-assisted cinematic hero loop, separate desktop/mobile compositions | S02 Hero | Required |
| G01 | Accurate reusable pack geometry with six approved artwork textures | S04 Flavour studio; product detail | Required interactive 3D |
| G02 | Open/closed branded box, animated lid, three pack positions | S05 Box builder | Required interactive 3D |
| V02 | Six short flavour atmosphere loops | S04 Behind active pack | Required media set; load only the active loop |
| V03 | Abstract ingredient/material film | S06 Why Choose | Required |
| V04 | Gifting-box reveal film | S07 Gifting | Required |
| V05 | Conceptual flavour/brand mood film | S08 Brand story | Required |
| V06 | Founder interview using authentic footage | S09 Founder | Optional, contingent on Shruti's footage |
| V07 | Three-pack closing composition | S11 Final CTA | Required; can be derived from the V01/G02 production |
| P01–P07 | Matching posters, product stills and reduced-motion images | All visual sections | Required |

**AI video and live 3D are separate deliverables.** An AI-generated film cannot respond accurately to a shopper's box selections or provide genuine product rotation. Those actions must use G01/G02 or a state-aware rendered fallback.

A working build is not visually complete when it contains empty canvases, placeholder video URLs, a CSS rectangle posing as a pack, or a generic static hero. If final media is pending, clearly mark the build as a functional prototype and keep the missing assets in a tracked production checklist.

## 3. Art direction

### Visual identity

Black/charcoal spaces, saturated red accents, large warm-white type, sculpted product lighting and realistic packaging. Flavour colours appear as controlled lighting and ingredient accents. Glass panels are used sparingly around controls; major scenes should feel spacious rather than covered in translucent cards.

| Token | Proposed value | Role |
| --- | --- | --- |
| Deep black | `#070708` | Primary canvas |
| Charcoal | `#141416` | Alternate backgrounds |
| Raised panel | `#202023` | Selectors and commerce UI |
| Naastha red | `#E52B32` | CTAs and brand accents; match actual logo later |
| Warm white | `#F6F3ED` | Primary typography |
| Muted text | `#B7B5B0` | Secondary copy |
| Gold light | `#D9B779` | Occasional story/gifting illumination |

### Composition

- Product stages can extend edge to edge; explanatory text uses a restrained readable width.
- Hero/flavour headings use a bold expressive sans serif; founder/story can use a contrasting editorial serif.
- Use responsive type with desktop hero roughly 72–112px and mobile roughly 40–56px, adjusting for actual copy and available width.
- Alternate scenes: cinematic hero → compact benefits → theatrical flavour stage → tactile builder → editorial benefits → gifting film → human story.
- Keep transparent snack/ingredient layers sparse. Use approved ingredient shapes, not generic confetti.
- All headlines, prices, nutrition claims and controls are HTML. Never bake them into generated video.

## 4. Homepage choreography

| Section | Heading/direction | Signature behaviour | Desktop | Mobile |
| --- | --- | --- | --- | --- |
| S01 | Navigation + offer | Header compacts on scroll | Full navigation and CTA | Logo, cart, menu |
| S02 | Desi flavours. Boldly reimagined. | Cinematic hero film + layered foreground | Copy left, film action right | Portrait composition with copy above product |
| S03 | Big flavour. Clear product facts. | Staggered metric reveals | Five metrics in a row | Two columns, final metric full width |
| S04 | Find your flavour | Live pack rotation + flavour world switch | Wide studio with six flavour tabs | Single-pack stage with swipeable selectors |
| S05 | Your flavours. Your box. | Pack-to-box interaction | Selector and sticky 3D preview | Compact preview + two-column selector |
| S06 | Why Choose CRISP’IT? | Ingredient film and metric emphasis | Editorial split with restrained sticky visual | Film followed by benefits |
| S07 | A box for every occasion | Cinematic box-opening film | Wide media + three collection links | Portrait media + stacked options |
| S08 | Our story, told in flavour | Full-width brand film with chapter reveals | Large editorial composition | Sequential readable chapters |
| S09 | Meet Shruti | Real portrait with moving light treatment | Portrait/story split | Portrait then story; tap-to-play if footage exists |
| S10 | Loved at snack time | Real community content | Asymmetric image/review arrangement | Scrollable real reviews |
| S11 | Build your next snack break | Three-pack closing scene | Large closing composition | Short portrait scene and CTA |
| S12 | FAQs + footer | Smooth accordion and clear links | Two-column FAQs/footer groups | Single-column FAQs/footer |

S10 is hidden until real approved reviews/community assets exist. All other core sections remain accessible even when media playback is unavailable.

## 5. Section-by-section production requirements

### S01 — Header and navigation

Offer bar: “Choose any 3 flavours for ₹200”, subject to offer confirmation. Main links: Flavours, Build a Box, Gifting, Our Story; cart badge and primary box CTA.

Header changes from spacious to compact over 200–250ms after scrolling approximately 48px. Active anchor state updates without decorative motion loops. Mobile menu opens as a full readable sheet, with focus containment, escape/close handling and normal page scroll when closed. Use a calculated anchor offset for sticky header height.

### S02 — Hero: first impression

**Required asset: V01.** Desktop uses a product action area on the right and reserved dark space behind left-aligned copy. Mobile uses a separately composed portrait film with the pack below the headline. Do not shrink the desktop film and call it a mobile layout.

Draft headline: **“Desi flavours. Boldly reimagined.”** Supporting line: “Six savoury flavours. One seriously good snack break.” Primary CTA: **Build Your Box — ₹200**; secondary: **Explore Flavours**. Final marketing copy is editable and subject to approval.

Timeline: poster and HTML appear immediately; copy reveals over 500–700ms; film starts muted when allowed; the hero settles into a slow loop. Foreground decorative elements may move up to 6–12px with fine-pointer movement. Mobile uses a small autonomous depth effect rather than pointer tracking. Provide an unobtrusive pause-motion control.

The hero contains a readable heading, an identifiable accurate pack, a clear CTA and cinematic depth. Red glow alone is insufficient. Avoid a forced logo-loading intro. Do not put the reference's phone shell or hands around the actual website.

### S03 — Benefits

Display the five supplied claims in real text. Reveal each metric once with a 350–500ms transition and 70ms stagger. Numbers start at their actual values; do not animate zero claims through contradictory intermediate numbers. Keep associated qualifiers visible.

Desktop: full-width compact band. Mobile: two-column grid with 12g Protein per pack spanning both columns. Icons can receive a brief line-draw or scale-in treatment. This section remains primarily typographic to give the visitor a visual rest.

### S04 — Flavour studio

**Required assets: G01 + V02 set.** One active realistic pack sits above a softly reflective floor, framed by a flavour-specific atmosphere. Six labelled selectors are visible and accessible. Display name, short approved taste description, weight, price and **View Flavour**/**Add to Box** actions.

On flavour change: state updates immediately; outgoing pack eases through approximately 15–25° rotation and fades; the incoming textured pack resolves over 450–650ms; backdrop atmosphere crossfades. Keep the base pack mesh reusable where packaging proportions match. Actual pack artwork determines colours.

Default slow rotation is restrained, approximately ±6–10°, with a pause control. An explicit **Inspect Pack** mode enables drag rotation and a reset button. On mobile, inspection gestures are confined to the model region; ordinary vertical page scrolling continues outside it. Flavour swiping uses the selector rail, so it does not compete with model rotation. Keyboard users can choose flavours and use labelled rotation/reset controls.

Only the active atmosphere loop plays. When changing flavour rapidly, cancel obsolete transitions and do not queue six clips. Product pages reuse the same approved pack assets.

### S05 — Animated box builder

**Required asset: G02, reusing G01.** Show an open branded box with three visible empty positions, a six-flavour selector, selection count and ₹200 base offer. Desktop: selector left, preview/summary right; preview can stick within the section. Mobile: compact preview above a two-column selector and a bottom summary bar that appears only while the builder is relevant.

Selection choreography:

1. Update the data and checkmark immediately; announce “Cream ’n’ Onion added, 1 of 3 selected”.
2. A visual pack instance appears above the box and follows a short arc into the correct slot over 550–750ms.
3. Pack settles with a soft shadow response; the corresponding slot label becomes visible.
4. Removing a choice lifts/fades that pack and restores the empty slot.
5. On the third valid selection, apply a small light sweep and briefly settle the lid toward the completed position. Keep an **Edit selections** view that clearly exposes contents.
6. **Add Box to Cart — ₹200** sends the current configured state; the purchase action never waits for lid animation to finish.

Use a fixed camera for easy comprehension. Avoid a dramatic camera orbit after every click. Rapid changes cancel visual actions safely; scene nodes reconcile to the latest selected IDs. No unbounded animation queue or duplicate packs.

| State | Required response |
| --- | --- |
| Empty | Three empty positions; “Choose 3 flavours”; disabled CTA with explanation |
| Partial | Count, readable names, remove/reset actions |
| Complete | Exact contents and enabled CTA |
| Fourth choice | Keep contents; explain that a flavour must be removed first |
| Out of stock | Label and disable that flavour |
| Server stock/price conflict | Preserve valid choices, show correction, revalidate before purchase |
| Submit pending | Prevent duplicate requests; visible progress |
| Submit failed | Keep selections; offer retry |
| 3D unavailable | Three-slot rendered preview updates to the exact same data |

Cart stores a configured box line with its three child products. Persist drafts across refresh, revalidate on return and support editing from cart. The box price and inventory rules belong on the server. Confirm whether repeated flavours are allowed; keep that rule configurable rather than embedding it in animation logic.

### S06 — Why Choose CRISP’IT?

**Required asset: V03.** Use a large ingredient/material film with benefit copy beside it, expanding the five product facts. Introduce each benefit through a short visual emphasis as it enters view. Desktop can keep the visual sticky while three compact copy groups scroll normally; do not lock or hijack scrolling. Mobile shows a 4:5 film then the content.

Suggested groups: the supplied nutrition facts; “Six flavours to explore”; “Build a box your way”. Ingredient visuals must reflect confirmed product ingredients. Include a route to actual ingredients/nutrition. Avoid invented health outcomes or competitor comparisons.

### S07 — Gifting and assorted boxes

**Required asset: V04.** A hero gifting box opens slowly under warm light; correct packs appear inside. Follow with curated collection links for assorted, gifting and custom/corporate boxes. Prices, contents and SKUs must be genuine; only the three-flavour offer has a supplied price.

Desktop supports a wide film and alternating open/closed stills. Mobile uses a dedicated portrait framing, followed by readable content and CTAs. Film playback does not determine box availability or selections. Custom enquiries collect name, contact, quantity, occasion and desired date; success/error states are clear and the destination is configured.

### S08 — Brand story

**Required asset: V05.** An editorial narrative with three draft chapter labels: **The idea**, **The flavour**, **The everyday ritual**. Use approved factual copy within these chapters. The film supplies abstract flavour atmosphere, not fabricated documentary evidence.

Desktop: spacious cinematic frame with chapter text outside or on protected dark space. Mobile: poster/film, then sequential paragraphs. Reveal chapters over 500–700ms once, with a small image offset. No giant pinned timeline that makes mobile scrolling tedious.

### S09 — Founder: Shruti

A real portrait, approved biography and quote form the core. Add subtle moving window-light or film-grain texture behind the portrait, generated separately using the founder-background prompt below. Never move or obscure the readable quote with this effect.

An interview can be included if authentic footage exists: click/tap to play, captions, controls and a text equivalent. AI may enhance the backdrop or edit provided footage subject to approval; do not invent Shruti's appearance, voice, interview or factual actions.

### S10–S12 — Community, closing CTA and footer

Real community imagery/reviews use a staggered editorial layout and simple navigation. Hide until approved content exists.

**V07** supplies a short final box/product scene, with **“Pick your three. Make it yours.”** and the box CTA in HTML. FAQ accordions animate height over approximately 200ms and remain keyboard accessible. Footer stays clean with actual contact, social and policy links. An optional support bubble must not overlap the mobile builder/cart actions.

## 6. AI video prompt pack

### Instructions for every generation

Attach the original logo, approved front/back pack artwork or product photographs, and real box reference wherever required. For six-pack scenes, use a labelled reference board to identify each pack. If these references are missing, generate a clearly marked concept only; final assets require real packaging.

**Shared production instruction:** create an asset for embedding inside a real website, not a video of a website. No browser frame, phone mockup, hands holding a device, interface, buttons, captions, pricing or nutrition text. No watermark. Preserve reference packaging geometry and artwork; do not invent or re-spell labels. Use premium CGI lighting, charcoal environments and restrained red accents. Any ingredient shown must come from the attached approved ingredient list. No audio. Keep the camera smooth, motion restrained and product stable. Aim for a clean loop with matching first/last composition; if the generator cannot produce a seamless loop, render extra handles and repair the loop in editing.

Generator duration/resolution controls vary: use its supported output, then edit/export to the requested website deliverable. A prompt does not guarantee readable labels or physical accuracy. Reject warped logos, malformed snack pieces, multiplying packs, incorrect contents and unstable shadows. Where generated artwork fails, composite the approved label onto tracked pack surfaces or use an offline 3D render.

### V01 — Hero film

**Section:** S02. **Target:** 8-second loop, desktop 16:9, mobile 9:16. Export targets: 1920×1080 desktop and 1080×1920 mobile, plus compressed web versions.

```text
Create an 8-second premium CGI product film for Naastha, using the attached authentic snack packaging and red-and-white logo references. A charcoal-black studio with a subtly reflective floor. Three realistic sealed packs float at slightly different depths: one dominant hero pack, two supporting packs behind it. Accurate packaging material, soft folds, stable artwork, realistic contact shadows and controlled reflections. Use warm rim light and a restrained deep-red background glow. A small number of approved ingredient pieces move slowly around the packs, with ample clean space between them. The hero pack turns gently by approximately 8 degrees, catches a soft light sweep and returns to its opening angle. Supporting packs drift subtly; no chaotic spinning. Smooth fixed-camera composition with tiny cinematic depth movement, no cuts. Maintain a stable matching first and last frame for looping. Desktop composition: all product action occupies the right 60 percent, left 40 percent remains dark and visually quiet for HTML copy. No baked-in text or UI. Apply the shared production instruction.
```

**Mobile composition instruction:** generate separately; place the dominant pack in the lower-middle 55% of a portrait frame, reserve the upper 30% for HTML copy, keep pack edges away from crop bou1ndaries and reduce supporting packs to one if necessary. Keep the bottom CTA area visually quiet. Do not merely crop the desktop master.

### V02 — Six flavour atmosphere loops

**Section:** S04, behind the live model. **Target:** six 5–6-second 1:1 loops, plus 4:5 variants if the mobile stage needs them. The foreground pack is rendered separately by G01; do not generate another pack in this backdrop.

```text
Create a 6-second seamless premium CGI atmosphere loop for the [FLAVOUR NAME] flavour of Naastha. Empty charcoal studio with the centre 55 percent visually clear for a separately rendered product pack. A few verified ingredient pieces from [APPROVED INGREDIENT LIST] float slowly around the outer frame at different depths. Subtle [ACCENT COLOUR] lighting against black, soft cinematic highlights, faint grounded haze only at the edges. No packaging, no labels, no text, no interface, no people. The centre stays dark and unobstructed. Slow cyclic motion, stable camera, matching opening and closing composition. Apply the shared production instruction.
```

| Flavour substitution | Provisional light accent | Ingredient input |
| --- | --- | --- |
| Cream ’n’ Onion | Teal with warm-white highlights | Approved list; onion visuals only if confirmed |
| Manchurian | Amber/brown | Approved list |
| Punjabi Tadka | Deep green with warm amber | Approved list |
| Pizza | Gold/yellow with restrained red | Approved list |
| Peri Desi | Warm red | Approved list |
| Methi | Deep green | Approved list; methi leaves only if confirmed |

All colours must be reconciled to the actual pack artwork. Do not invent recipes from the flavour name.

### V03 — Ingredient/material film

**Section:** S06 Why Choose CRISP’IT? **Target:** 7–8 seconds; desktop 16:9 and mobile 4:5.

```text
Create an 8-second macro CGI film for a premium Indian savoury snack brand. Use the attached real snack-shape photographs and approved ingredient references. In a charcoal-black studio, show a close view of the authentic snack texture, with a few ingredient pieces suspended around it. Gentle side lighting reveals realistic pores and surface texture, then a soft warm light travels across the composition. Smooth slow camera movement; no explosive particles, oil pouring, sugar cubes, cholesterol symbols, medical imagery or scientific claims. End in a stable composition suitable for looping or a soft dissolve. Desktop: product texture on the left, right 40 percent dark and quiet. Mobile: central texture with space above. No text, metrics, packaging labels or UI. Apply the shared production instruction.
```

Place all five claims as HTML outside/above the film. Do not encode claims inside generated graphics.

### V04 — Gifting-box reveal

**Section:** S07. **Target:** 8 seconds, desktop 16:9 and mobile 4:5. Nonlooping reveal, then hold or replay on user request.

```text
Create an 8-second premium CGI gifting product reveal using the attached authentic Naastha gift-box and pack references. One closed box rests on a charcoal pedestal under warm golden side light with a subtle red accent. Seconds 0–2: elegant close view of the closed box, accurate materials and branding. Seconds 2–5: the lid opens slowly with physically plausible motion, revealing exactly the approved pack count and arrangement from the reference. Seconds 5–8: camera settles into a gentle three-quarter view and holds the finished open-box composition. Crisp pack edges, consistent printed artwork, stable shadows and restrained reflections. No extra products, floating letters, invented luxury logos, text overlays or UI. Apply the shared production instruction.
```

Mobile version centres the entire box with enough room for the lid to open without cropping. Box contents must match a real offered SKU. A static open-box frame remains after completion.

### V05 — Brand-story mood film

**Section:** S08. **Target:** 10–12 seconds, assembled from three shots if one generation is unstable; desktop 16:9, mobile 4:5.

```text
Create a conceptual cinematic flavour film for Naastha using attached authentic packaging, snack-shape and approved ingredient references. Consistent charcoal, warm white and restrained brand-red palette. Shot 1: a beautiful macro arrangement of verified ingredients on a dark surface, warm side light. Shot 2: slow movement across the authentic snack texture, sensory detail and shallow depth of field. Shot 3: the actual snack packs arranged in a premium studio composition with a soft reflection and warm finishing light. Smooth dissolves, calm camera movement, coherent materials and lighting. This is abstract brand atmosphere, not a documentary: no factory, farm, founder, workers, manufacturing process or invented historical events. No embedded copy, subtitles or UI. Apply the shared production instruction.
```

The brand's real story is supplied separately as HTML copy. Export individual shots as well as the final edit if they will accompany chapters.

### Founder background — environmental layer only

**Section:** S09. **Target:** 6-second subdued 4:5 loop, used behind/beside the real portrait; a CSS light layer is also acceptable here.

```text
Create a minimal 6-second charcoal studio background with warm diagonal window-light shadows moving almost imperceptibly across a dark textured wall. Elegant, quiet editorial atmosphere, very low visual contrast where text will sit. No people, faces, silhouettes, packaging, text or logos. Fixed camera and a seamless cyclic light movement. This will sit behind an authentic founder portrait and must never suggest a fabricated interview or scene.
```

**V06 authentic footage brief:** film Shruti in soft window light, looking toward camera/interviewer; capture a short approved account of why she started the brand. Deliver original footage, a 20–40-second edit, captions and transcript. The interview is optional; the real portrait/story section is required.

### V07 — Final box scene

**Section:** S11. **Target:** 5–6-second loop, desktop 16:9 and mobile 4:5. Can reuse the hero/box render production rather than incur a separate generation.

```text
Create a 6-second cinematic closing product composition using the attached authentic Naastha three-pack box and accurate pack references. Exactly three distinct flavour packs are visible inside or immediately above the open box. Charcoal studio, soft reflection, warm edge light and restrained red halo. Camera is stable. Packs make only a tiny slow settling motion; the box and pack count remain unchanged. Desktop: action in the right half, left half dark and clear for HTML CTA copy. Mobile: centred compact box with clear space above and below. Match opening and closing composition. No prices, captions, buttons or website mockups. Apply the shared production instruction.
```

### Optional V08 — Builder explainer film

**Section:** `/build-a-box` help panel only, not the interactive selection preview. **Target:** three-pack 6–8-second demonstration using actual pack/box references. Show three packs settling into the three slots one at a time. Generate or render the demonstration from a fixed view, without UI or prices. Label the player **“See how the box works”** in HTML. The live builder must still reflect the customer's actual choices; never use this film as simulated interaction.

## 7. 3D asset and animation contract

### G01 — Product pack

Deliver reusable pack mesh(es), correct six-flavour front/back textures, physically plausible material settings, contact-shadow solution and lighting preset. Preserve real proportions; if pack shapes vary, use separate geometry. Offline source files and web-exported models must both be available. Suggested runtime format: GLB/glTF; compression is chosen during implementation.

Named animations/states: `idle`, `flavourTransition`, `inspect`, `resetView`, `enterBox`, `removeFromBox`. The scene consumes selected flavour/product IDs from the application; it never owns the catalogue or stock data.

### G02 — Box

Deliver box base, independently movable lid/flaps and three pack anchors. Anchor names: `slot_1`, `slot_2`, `slot_3`. Assets support empty, partial, full, lid-settle and reopened-for-edit states. Neutral internal lighting must make each selected flavour recognisable.

### Runtime rules

- One active WebGL renderer at a time where practical; initialise the flavour scene near viewport entry, dispose/suspend it when switching to the builder scene.
- Hero and story use video; flavour studio and builder use live 3D. Avoid several full-screen live canvases running simultaneously.
- Choose quality from measured frame behaviour and browser capabilities, not user-agent labels alone. Aim for smooth 60fps on capable desktops and at least stable 30fps during mobile interaction; downgrade effects if sustained frame time exceeds the target.
- Clamp pixel ratio, simplify mobile reflections/shadows, reuse materials and avoid loading all optional textures/loops at once.
- Handle context loss and failed model loading without losing application state.
- A subtle loaded-model transition is allowed; a blocking “wait for 3D” screen is not.

## 8. Responsive experience specification

| Width/input | Layout and visual behaviour |
| --- | --- |
| 320–767px / touch | Portrait films; stacked copy; one-pack flavour stage; two-column builder grid; compact 3D preview; no pointer-dependent functions |
| 768–1023px | Adaptive two-column sections where copy fits; smaller studio scene; tablet portrait/landscape checked separately |
| 1024–1439px / fine pointer | Full split scenes, six selectors, sticky builder preview, restrained hover/parallax |
| 1440px+ | Wider visual stages with text width capped; no oversized paragraphs or distant controls |

Use content-fit decisions inside these ranges rather than assuming every tablet has a mouse. Essential interactions work through buttons and taps on every width. Product detail and checkout remain clean and practical.

### Mobile requirements

- Use `svh`/content-aware sizing to avoid browser chrome cutting off CTAs; content may extend naturally below the initial viewport.
- No pinned scroll scene on small screens. Vertical scroll remains native; horizontal rails are deliberate and clearly bounded.
- Touch targets at least approximately 44×44px; 16px minimum form text; safe-area spacing for bottom controls.
- Only one bottom purchase bar at a time. Close/replace it when cart, menu or checkout opens. Support widgets move above it or hide temporarily.
- Keyboard opening, browser back and orientation changes must not break selections or cover inputs.
- Mobile films reserve space for copy and product; faces/pack fronts/lids are not cropped away.

### Desktop requirements

- Hero actions remain visible without hovering. Pointer parallax is an enhancement, typically under 12px.
- Builder preview sticks only within its own section. Header and summary should not create competing fixed panels.
- Ultrawide layouts maintain a clear copy/product relationship with a capped composition width.

Test 320, 360, 390, 430, 768, 820, 1024, 1280, 1440 and 1920px; include short-height landscape, touch tablet and zoomed text.

## 9. Motion and media behaviour

| Motion | Timing/range | Rule |
| --- | --- | --- |
| Hero copy | 500–700ms | Reveals once; CTA works immediately |
| Metric entry | 350–500ms, 70ms stagger | Actual value shown from the start |
| Flavour switch | 450–650ms | Cancel obsolete transitions |
| Pack-to-box | 550–750ms | Data updates before visual completion |
| Card/button feedback | 150–220ms | Small lift/colour change |
| Menu/cart sheet | 220–300ms | Accessible focus and close handling |
| Editorial reveal | 500–700ms | Different treatment from product stages |
| Idle drift | 6–10-second cycle | Small amplitude; pause available |

Use shared easing tokens; avoid spring overshoot that makes packs feel rubbery. Pause videos and animation when offscreen or the document is hidden. Decorative autoplay is muted and inline. Click-to-play story/founder media has normal controls. There is no autoplay sound.

**Reduced motion:** replace loops with approved posters, disable idle drift/parallax, shorten navigation transitions and update selections immediately. **Data saver/weak-device mode:** static hero; state-aware 2D pack/box previews; optional click-to-play media. These are purposeful accessible alternatives, not the default shortcut for all mobile users.

## 10. Media delivery and performance

Every video deliverable includes a desktop/mobile composition where specified, web encodes, matching poster, duration, dimensions, loop/nonloop designation and a verified placement ID. Suggested names: `V01-hero-desktop.mp4`, `V01-hero-mobile.mp4`, `V01-hero-mobile-poster.webp`, `V02-methi-atmosphere.mp4`. Filenames are a planned contract, not proof that assets already exist.

Generate/edit high-quality masters, then compress for the website. Suggested budgets: desktop hero loop 2–4MB, mobile hero 1–2MB, each small flavour atmosphere 0.4–1MB, secondary loop 1–2MB; initial optional live 3D scene around 2–4MB compressed where achievable. Heavy masters must not be served directly. Tune against visible quality and measured network conditions.

Only download the hero candidate appropriate to the current viewport. Use a poster for immediate layout/rendering, preload conservatively and lazy-load other media near entry. Do not ship all six atmosphere loops and all films in the initial payload. Reserve media dimensions to avoid jumps. Keep important HTML independent of media hydration.

Proposed quality targets: LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile once field data exists. Before launch, report repeatable mobile lab conditions and interaction frame behaviour. If budgets fail, reduce resolution, particles or reflection complexity while retaining the three signature scenes on capable devices.

## 11. Commerce, content and routes

Retain `/`, `/flavours`, `/products/[slug]`, `/build-a-box`, `/boxes`, `/boxes/[slug]`, `/our-story`, `/contact`, `/cart`, `/checkout`, order confirmation and policies. Founder is also accessible from the story route.

Product detail shows accurate photos/3D, flavour, price, pack weight, stock, ingredients, allergens, nutrition and storage. Cart handles individual packs and configured boxes, with quantity/removal/editing. Guest checkout validates address/delivery, stock and price, and uses the configured payment provider. Failed payment retains the cart; retries do not duplicate orders. Confirmation follows a confirmed order, not a completed decorative animation.

Keep product content, brand names, claims, box rules, prices, stock and media mappings editable. Store media records with section ID, variant, poster, accessible description and fallback. Orders snapshot box contents and purchase price. Enquiry forms need an actual monitored destination. Never populate reviews, founder history or gifting prices with invented production data.

## 12. Implementation sequence

1. **Approve scene boards and motion samples:** hero desktop/mobile first frames, live pack rotation sample, three-slot box interaction sample. Visual direction is reviewed before the entire page is built.
2. **Produce media and 3D assets early:** generate V01/V02, build G01/G02, verify artwork and mobile compositions. Keep asset production on the critical path.
3. **Build the three signature scenes:** hero, flavour studio, builder with real assets and shared application state.
4. **Complete editorial sections and commerce:** benefits, gifting, story, founder, cart and checkout.
5. **Tune responsive quality:** touch behaviour, crop selection, mobile scene complexity and lazy loading.
6. **Complete content, accessibility and commerce QA:** approved copy, motion controls, fallback states, real order paths and performance reporting.

Do not postpone all animation until a final optional polish pass. Each signature section is complete only when its media, motion, interactions and responsive variants work together.

## 13. Launch acceptance and visual-quality gate

| Area | Evidence required |
| --- | --- |
| Hero | Actual V01 plays on supported desktop/mobile; intentional crop; readable live copy; usable poster fallback |
| Flavour studio | Six accurate pack appearances; visible animated switching; inspection controls; active atmosphere; touch/keyboard support |
| Builder | Three exact selections populate three 3D slots; remove/edit/rapid changes work; cart matches preview |
| AI films | V03/V04/V05/V07 placed in the specified sections; no mock website footage or distorted final artwork |
| Responsive | Signature scenes demonstrated on phone and desktop; no essential hover-only action; no overflow/obscured CTA |
| Human story | Dedicated brand-story section and real approved Shruti content |
| Accessible motion | Pause control and reduced-motion alternative; labelled controls, visible focus, readable contrast |
| Reliability | Blocked autoplay, failed media, context loss and offline/slow asset loading preserve shopping state |
| Performance | Documented mobile load measurements and interaction checks; offscreen scenes/media paused |
| Commerce | Server rules verified; configured box preserved; stock conflicts/payment retries handled |
| Branding | Naastha/CRISP’IT relationship resolved; approved logo/labels; canonical six names |

**Visual review rubric:** score composition, motion quality, packaging accuracy, interaction delight and mobile execution separately from 1–5. Target at least 4/5 in each before calling the design complete; this is a review goal, not a guarantee of the user's rating. A static card grid with a background gradient fails the specified signature-scene deliverables.

## 14. Final inputs still needed

Authentic logo and six pack references; final Naastha/CRISP’IT relationship; confirmed snack shapes/ingredients; pack weights/prices; nutrition applicability; box artwork and duplicate-selection rule; real gifting SKUs; Shruti's portrait/biography/optional footage; actual brand story; shipping/payment/support information.

Layouts and technical prototypes can proceed with labelled placeholders. Production media and public claims must be reconciled to the real brand assets. This document supplies generation prompts and requirements; it does not claim that the videos or 3D models have already been produced.
