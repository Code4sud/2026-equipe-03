import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { STRUCTURES_BENEFITS } from '@/data/landing-content';
import { Icon } from '@/components/ui/Icon';

export function OrganizationsSection() {
  return (
    <section id="structures" aria-labelledby="structures-heading" className="py-14 lg:py-20 bg-white">
      <Container>
        <SectionHeading
          badge="Écosystème & Territoire"
          title="Conçu pour renforcer l'action des structures"
          subtitle="MonBilan+ s’articule avec les acteurs de l’orientation et de l’insertion de la Côte d'Azur pour faciliter le parcours du jeune et fluidifier la transmission d'informations."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-10 lg:mt-14 max-w-5xl mx-auto">
          {STRUCTURES_BENEFITS.map((struct) => (
            <div
              key={struct.id}
              className="rounded-3xl border border-[#E4E0F5] bg-[#FAF8FF] p-6 sm:p-7 space-y-4 hover:border-[#7C3AED] hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white text-[#7C3AED] shadow-sm flex items-center justify-center text-xl font-bold shrink-0">
                  <Icon name={struct.icon} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F1035]">
                    {struct.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#7C3AED]">
                    {struct.role}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 pt-2 border-t border-[#EDE9FE]">
                {struct.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#42466B]">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Note déontologique d'indépendance */}
        <div className="mt-8 text-center max-w-2xl mx-auto">
          <p className="text-[11px] text-[#64748B] italic">
            * MonBilan+ est un prototype innovant développé dans le cadre du Hackathon Azuréen #3 (Sujet 1). Les structures citées correspondent aux cas d'usage visés et n'engagent pas de partenariat contractuel préalable.
          </p>
        </div>
      </Container>
    </section>
  );
}
