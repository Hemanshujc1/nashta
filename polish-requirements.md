# Naastha Demo — Polish Requirements & Section Map

This document maps all home page sections, their exact file paths, current state, and the polish tasks required.

---

## 1. Home Page Section Map & File Locations

| Section ID | Section Title | Component File Path | Current Status & Notes |
| :--- | :--- | :--- | :--- |
| **S01** | Navigation & Header | `src/components/Navbar.jsx` | Fixed header with cart trigger and links. |
| **Act I** | Arrive (Hero) | `src/components/HeroSection.jsx`<br>`src/components/NutritionBar.jsx` | Hero with V01 film/fallback; NutritionBar with 5 product claims. |
| **Act II** | Choose (Flavours & Box) | `src/components/motion/ActStatement.jsx`<br>`src/components/FlavourExplorer.jsx`<br>`src/components/BundleBuilder.jsx` | • `ActStatement.jsx` currently takes full 100vh.<br>• `FlavourExplorer.jsx`: 3D pack viewer + carousel.<br>• `BundleBuilder.jsx`: 3D box ritual + selection grid. |
| **Act III** | Believe (Integrity & Story) | `src/components/motion/ActStatement.jsx`<br>`src/components/WhyChooseCrispit.jsx`<br>`src/components/GiftingSection.jsx`<br>`src/components/BrandStory.jsx` | • `WhyChooseCrispit.jsx`: Ingredient integrity.<br>• `GiftingSection.jsx`: Celebration & corporate boxes.<br>• `BrandStory.jsx`: 3 editorial chapters. |
| **Act IV** | Close (Founder & CTA) | `src/components/motion/ActStatement.jsx`<br>`src/components/FounderStory.jsx`<br>`src/components/FinalCtaSection.jsx`<br>`src/components/FAQSection.jsx`<br>`src/components/Footer.jsx` | • `FounderStory.jsx`: Shruti portrait & quote.<br>• `FinalCtaSection.jsx`: Closing trio composition.<br>• `FAQSection.jsx`: Accordion.<br>• `Footer.jsx`: Large wordmark & links. |
| **Global** | Persistent Buy Bar | `src/components/MiniBuyBar.jsx` | Appears post-hero with quick-purchase CTA. |

---

## 2. Issues Identified & Specific Polish Requirements

### Issue A: Page Flow & Repetitive Layout / Full-Screen Act Dividers
- **Location**: `src/pages/Home.jsx`, `src/components/motion/ActStatement.jsx`
- **Problem**: `ActStatement` had `min-h-[100svh]`, creating massive empty viewports that broke natural scroll cadence and repeated headlines.
- **Requirement**:
  - Streamline `Home.jsx` layout so sections transition seamlessly without awkward full-viewport empty spacers.
  - Eliminate duplicated headline copy between Act cards and section titles.

### Issue B: "Why Choose CRISP’IT?" (`WhyChooseCrispit.jsx`)
- **Location**: `src/components/WhyChooseCrispit.jsx`
- **Problem**: The V03 macro video / placeholder was disliked by the user and felt visually disruptive.
- **Requirement**:
  - Remove the video (`MediaSlot` V03) entirely.
  - Redesign as a clean, editorial, typographic section highlighting:
    - 100% Whole-Wheat Atta & Zero Palm Oil
    - Honest Macronutrients (12g Protein, 0g Sugar, Zero Trans Fat)
    - 6 Desi Regional Flavour Recipes
  - Keep the interactive "View Full Nutrition Table & Lab Declarations" modal.

### Issue C: "A Box for Every Occasion" (`GiftingSection.jsx`)
- **Location**: `src/components/GiftingSection.jsx`
- **Problem**: Neither the video nor the previous grey-card design met aesthetic standards.
- **Requirement**:
  - Remove the V04 video entirely.
  - Completely redesign the section with a luxury, black-cinema gifting aesthetic:
    - Pure black `#070708` and deep charcoal `#101012` surfaces with gold `#D9B779` and red `#E52B32` accents.
    - Curated showcase for the 3 collections:
      1. **Discovery Tasting Box (6-Pack)** — ₹399
      2. **Festive Celebration Box (Gold Ribbon Rigid Box)** — ₹499
      3. **Bespoke Corporate & Wedding Gifting** — Custom Volume Quotation
    - Premium imagery with hover zoom, clear SKU details, and fast "Add to Cart" / "Corporate Enquiry".

### Issue D: "Build Your Box" / 3D Box Ritual (`BundleBuilder.jsx` & `Box3DViewer.jsx`)
- **Location**: `src/components/BundleBuilder.jsx`, `src/components/three/Box3DViewer.jsx`
- **Problem**:
  - Cluttered copy with duplicate labels ("Cream 'n' Onion Cream 'n' Onion", "Manchurian Manchurian").
  - 3D box cramped inside a card with a distracting white border.
  - Lid stayed open and required manual clicking to close.
  - Box was plain charcoal with no brand identity.
- **Requirement**:
  - **Remove the border** outside the 3D box; let the 3D canvas float seamlessly on a rich black stage.
  - **Branded Box**: Print crisp golden "NAASTHA" wordmark on the box lid and front face, and if possible add the logo also.
  - **Auto-Close Lid**: When the 3rd flavour is picked, the lid automatically closes with a smooth animation and settles.
  - **Clean Selection Grid**: Remove redundant text labels and polish the card layout so each flavour is clear, clickable, and visually premium.
  - **Allow Manual Reopen/Close**: Keep a subtle toggle so the user can inspect inside if desired.
