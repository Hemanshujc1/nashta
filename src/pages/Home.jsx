import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import NutritionBar from "../components/NutritionBar";
import FlavourExplorer from "../components/FlavourExplorer";
import BundleBuilder from "../components/BundleBuilder";
import WhyChooseCrispit from "../components/WhyChooseCrispit";
import GiftingSection from "../components/GiftingSection";
import BrandStory from "../components/BrandStory";
import FounderStory from "../components/FounderStory";
import FinalCtaSection from "../components/FinalCtaSection";
import FAQSection from "../components/FAQSection";
import MiniBuyBar from "../components/MiniBuyBar";
import ActStatement from "../components/motion/ActStatement";
import { useFlavourStore } from "../store/flavourStore";
import { getFlavour } from "../data/flavours";
import { useFlavourTint } from "../lib/useFlavourTint";

const Home = () => {
  const activeId = useFlavourStore((s) => s.activeId);

  // Ensure smooth scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // The active flavour tints glows, cursor ring, scroll progress and buy buttons while Home is mounted.
  useFlavourTint(getFlavour(activeId));

  return (
    <div className="w-full bg-[#070708] text-[#F6F3ED]">
      {/* ACT I · ARRIVE (red). The hero headline is the act's opening statement. */}
      {/* S02 — Cinematic Hero Film + Layered Foreground (V01) */}
      {/* The hero is sticky inside this wrapper, so S03 slides over it. */}
      <div className="relative">
        <HeroSection />

        {/* S03 — Five Staggered Claims: Big flavour. Clear product facts. */}
        <NutritionBar />
      </div>

      {/* ACT II · CHOOSE (flavour colour) */}
      <ActStatement
        numeral="II"
        name="Choose"
        mood="flavour"
        lines={["Six flavours.", "Your three."]}
      />
      {/* S05 — Animated Box Builder: Pack-to-box 3D ritual (G02) */}
      <BundleBuilder />

      {/* S04 — Flavour Studio: Live 3D Pack Rotation + Flavour Worlds (G01 + V02) */}
      <FlavourExplorer />

      {/* ACT III · BELIEVE (gold) */}
      <ActStatement
        numeral="III"
        name="Believe"
        mood="gold"
        lines={["Atta in.", "Palm oil out."]}
      />

      {/* S06 — Why Choose CRISP'IT?: Typographic ingredient integrity + nutrition table */}
      <WhyChooseCrispit />

      {/* S07 — A Box for Every Occasion: Luxury gifting collections */}
      <GiftingSection />

      {/* S08 — Our Story, Told in Flavour: Editorial chapters (V05) */}
      <BrandStory />

      {/* ACT IV · CLOSE (red) */}
      <ActStatement
        numeral="IV"
        name="Close"
        mood="red"
        lines={["Meet", "the maker."]}
      />

      {/* S09 — Meet Shruti: Real portrait with moving window-light treatment */}
      <FounderStory />

      {/* S11 — Build Your Next Snack Break: Three-pack closing composition (V07) */}
      <FinalCtaSection />

      {/* S12 — FAQs Accordion */}
      <FAQSection />

      <MiniBuyBar />
    </div>
  );
};

export default Home;
