import React from 'react';
import { AUDIENCE_CARDS } from '@/data/landing-content';
import { Container } from '@/components/ui/Container';

export function AudienceSection() {
  return (
    <section
      id="pour-qui"
      aria-labelledby="audience-title"
      className="bg-gradient-to-r from-[#241763] via-[#3B1D8F] to-[#5B21B6] py-10 lg:py-12 text-white"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-3 space-y-1.5">
            <h2 id="audience-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Pour qui ?
            </h2>
            <p className="text-sm sm:text-base text-[#E7E8FB]/90">
              Une restitution adaptée à chaque parcours.
            </p>
          </div>

          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            {AUDIENCE_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.href}
                className="group rounded-[22px] bg-white p-5 text-[#0F1035] shadow-md hover:shadow-xl hover:-translate-y-0.5 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3EFFE] text-[#6D28D9]"
                  >
                    {card.icon === 'cap' && (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    )}
                    {card.icon === 'users' && (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    )}
                    {card.icon === 'briefcase' && (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <rect x="3" y="7" width="18" height="13" rx="2" />
                        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F1035] group-hover:text-[#6D28D9] transition">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#42466B] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="text-lg font-black text-[#6D28D9] group-hover:translate-x-1 transition"
                >
                  ›
                </span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
