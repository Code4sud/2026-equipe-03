import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { METHODOLOGY_PILLARS } from '@/data/landing-content';
import { Icon } from '@/components/ui/Icon';

export function MethodologySection() {
  return (
    <section id="methodologie" aria-labelledby="methodology-heading" className="py-14 lg:py-20 bg-white">
      <Container>
        <SectionHeading
          badge="Éthique & Rigueur Scientifique"
          title="Méthodologie, Transparence & Protection des Données"
          subtitle="MonBilan+ applique des principes stricts de déontologie pour protéger les jeunes et garantir l’intégrité des démarches d’orientation."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 lg:mt-14 max-w-6xl mx-auto">
          {METHODOLOGY_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="rounded-3xl border border-[#E4E0F5] bg-[#FAF8FF] p-6 space-y-3 hover:border-[#7C3AED] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-white text-[#7C3AED] shadow-xs flex items-center justify-center text-lg font-bold">
                <Icon name={pillar.icon} />
              </div>
              <h3 className="text-base font-extrabold text-[#0F1035]">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Encadré d'avertissement méthodologique officiel */}
        <div className="mt-10 max-w-4xl mx-auto rounded-3xl bg-[#F5F3FF] border border-[#DDD6FE] p-6 sm:p-7 space-y-2">
          <div className="flex items-center gap-2 text-[#5B21B6] font-extrabold text-sm">
            <Icon name="info" />
            <span>Avertissement déontologique officiel (Rapport des Possibles, p. 5 &amp; 17)</span>
          </div>
          <p className="text-xs sm:text-sm text-[#42466B] leading-relaxed">
            Les évaluations psychométriques constituent une photographie à un instant T dans des conditions données. Elles ne peuvent en aucun cas résumer la complexité d’une personne ni prédire de manière déterministe son avenir. MonBilan+ fournit des repères d’exploration et encourage toujours l’échange approfondi avec un conseiller d’orientation ou un psychologue du travail.
          </p>
        </div>
      </Container>
    </section>
  );
}
