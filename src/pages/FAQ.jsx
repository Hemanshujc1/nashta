import React, { useEffect } from 'react';
import FAQSection from '../components/FAQSection';

export default function FAQ() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#050506] pt-20 md:pt-24">
      <FAQSection titleAs="h1" />
    </div>
  );
}
