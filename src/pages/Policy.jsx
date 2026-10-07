import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '../components/motion/PageHero';
import Reveal from '../components/motion/Reveal';
import { policies, POLICY_ORDER } from '../data/policies';

export default function Policy({ slug }) {
  const policy = policies[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="w-full bg-[#050506] text-[#F6F3ED]">
      <PageHero key={slug} eyebrow="Policies" lines={policy.lines} note={policy.note} />

      <div className="container mx-auto max-w-screen-xl px-5 md:px-8 pb-24 md:pb-36">
        <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-20 border-t border-white/10 pt-10 md:pt-14">
          <nav aria-label="Policies" className="lg:sticky lg:top-36 lg:self-start">
            <ul className="flex lg:flex-col gap-x-6 gap-y-1 overflow-x-auto">
              {POLICY_ORDER.map((id) => (
                <li key={id} className="shrink-0">
                  <Link
                    to={`/${id}`}
                    aria-current={id === slug ? 'page' : undefined}
                    className={`flex items-center gap-3 min-h-[44px] text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                      id === slug ? 'text-[#F6F3ED]' : 'text-[#9C9A95] hover:text-[#F6F3ED]'
                    }`}
                  >
                    <span className={`block h-px transition-all duration-300 ${id === slug ? 'w-8 bg-[#E52B32]' : 'w-3 bg-white/25'}`} />
                    {policies[id].nav}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-[62ch]">
            <p className="mb-12 rounded-xl border border-[#D9B779]/25 bg-[#D9B779]/[0.06] px-5 py-4 text-sm leading-relaxed text-[#D9B779]">
              Demo build. This is sample policy text: no real orders, payments or deliveries are made through this site.
            </p>

            {policy.sections.map((section, i) => (
              <Reveal key={section.title} delay={Math.min(i * 0.05, 0.2)} className="mb-12 last:mb-0">
                <section className="grid grid-cols-[2.5rem_1fr] gap-x-3">
                  <span className="font-cine text-xs font-semibold tracking-[0.2em] text-[#9C9A95] pt-2">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-cine font-bold text-xl md:text-2xl normal-case text-[#F6F3ED] mb-3">{section.title}</h2>
                    {section.body.map((text) => (
                      <p key={text} className="text-[#B7B5B0] text-base md:text-lg leading-relaxed mb-3 last:mb-0">
                        {text}
                      </p>
                    ))}
                    {section.link && (
                      <Link
                        to={section.link.to}
                        className="inline-flex items-center gap-2 min-h-[44px] mt-2 text-[#F6F3ED] text-xs font-semibold uppercase tracking-[0.2em] border-b border-white/30 hover:border-white transition-colors"
                      >
                        {section.link.label}
                        <ArrowUpRight size={14} />
                      </Link>
                    )}
                  </div>
                </section>
              </Reveal>
            ))}

            <p className="mt-16 pt-8 border-t border-white/10 text-[#9C9A95] text-sm">
              Questions about this policy?{' '}
              <Link to="/contact" className="text-[#F6F3ED] underline underline-offset-4 hover:text-[#E52B32] transition-colors">
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
