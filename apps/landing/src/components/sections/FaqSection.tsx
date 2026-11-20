'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FAQ_ITEMS } from '@/data/landing-content';
import { Icon } from '@/components/ui/Icon';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 lg:py-24 bg-[#F8F7FF]">
      <Container>
        <SectionHeading
          badge="Foire Aux Questions"
          title="Questions fréquentes"
          subtitle="Tout ce que tu dois savoir sur le fonctionnement de MonBilan+, les audios de 2 minutes, l’accompagnement et la protection de tes données."
          centered
        />

        <div className="max-w-3xl mx-auto mt-10 lg:mt-14 space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'bg-white border-[#7C3AED] shadow-md' : 'bg-white/80 border-[#E4E0F5] hover:border-[#C4B5FD]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-[#0F1035] focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xs font-black shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item.question}</span>
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full bg-[#F4F2FF] text-[#7C3AED] flex items-center justify-center text-sm font-bold transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#7C3AED] text-white' : ''
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#42466B] leading-relaxed border-t border-[#F0EDFA]">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
