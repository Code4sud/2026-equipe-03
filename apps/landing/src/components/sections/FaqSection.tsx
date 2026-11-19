'use client';

import React, { useState } from 'react';
import { FAQ_ITEMS } from '@/data/landing-content';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function FaqSection() {
  const [openId, setOpenId] = useState<string>(FAQ_ITEMS[0]?.id ?? '');

  return (
    <section id="faq" aria-labelledby="faq-title" className="py-16 lg:py-24 bg-[#F8F7FF]">
      <Container className="max-w-4xl space-y-10">
        <SectionHeading
          badge="Questions fréquentes"
          title="Tout comprendre sur MonBilan+"
          subtitle="Comment fonctionnent la restitution audio, la vérification des sources et la protection de tes données."
        />

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-[#E4E0F5] shadow-card overflow-hidden"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setOpenId(isOpen ? '' : item.id)}
                    className="w-full min-h-14 px-6 py-4 text-left flex items-center justify-between gap-4 font-extrabold text-base sm:text-lg text-[#0F1035] hover:bg-[#F5F2FF] transition"
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3EFFE] text-[#6D28D9] font-black"
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={`faq-panel-${item.id}`}
                    className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#42466B] leading-relaxed border-t border-[#F0EDFA]"
                  >
                    {item.answer}
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
