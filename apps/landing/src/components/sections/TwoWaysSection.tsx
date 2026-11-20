import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TWO_WAYS_START } from '@/data/landing-content';
import { Icon } from '@/components/ui/Icon';

export function TwoWaysSection() {
  return (
    <section id="deux-parcours" aria-labelledby="two-ways-heading" className="py-14 lg:py-20 bg-white">
      <Container>
        <SectionHeading
          badge="Flexibilité & Inclusion"
          title="Deux façons de commencer"
          subtitle="Que tu aies déjà réalisé un bilan d'orientation ou que tu démarres de zéro en toute autonomie, choisis la voie qui te correspond."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-10 lg:mt-14 max-w-5xl mx-auto">
          {TWO_WAYS_START.map((card) => (
            <div
              key={card.id}
              className="rounded-3xl border-2 border-[#E4E0F5] bg-[#FAF8FF] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#7C3AED] hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Badge d'espace */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${card.badgeBg}`}>
                    {card.badge}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#7C3AED] shadow-sm flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    <Icon name={card.icon} />
                  </div>
                </div>

                {/* Titre & Citation officielle */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F1035] group-hover:text-[#6328E8] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#7C3AED] italic">
                    {card.quote}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                  {card.description}
                </p>

                {/* Liste des fonctionnalités */}
                <ul className="space-y-2.5 pt-2 border-t border-[#EDE9FE]">
                  {card.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#0F1035] font-medium">
                      <span className="flex h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] items-center justify-center font-bold mt-0.5 shrink-0">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bouton d'action */}
              <div className="pt-2">
                <a
                  href={card.ctaHref}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white font-extrabold text-sm py-3 px-5 shadow-md hover:brightness-110 transition"
                >
                  <span>{card.ctaLabel}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
