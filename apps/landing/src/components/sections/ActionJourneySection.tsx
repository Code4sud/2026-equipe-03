import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACTION_STEPS } from '@/data/landing-content';
import { Icon } from '@/components/ui/Icon';

export function ActionJourneySection() {
  return (
    <section id="parcours-action" aria-labelledby="action-journey-heading" className="py-14 lg:py-20 bg-white">
      <Container>
        <SectionHeading
          badge="Passer à l’action"
          title="De la compréhension à l’action"
          subtitle="MonBilan+ ne s’arrête pas à la lecture d’un bilan : la plateforme t'accompagne pas-à-pas pour transformer tes découvertes en démarches concrètes."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 lg:mt-14">
          {ACTION_STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border-2 border-[#E4E0F5] bg-[#FAF8FF] p-6 flex flex-col justify-between space-y-5 hover:border-[#7C3AED] hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Pastille numéro & icône */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6328E8] to-[#9333EA] text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white text-[#7C3AED] shadow-2xs flex items-center justify-center text-base">
                    <Icon name={step.icon} />
                  </div>
                </div>

                {/* Titre & Sous-titre */}
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#0F1035] group-hover:text-[#6328E8] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold text-[#7C3AED]">
                    {step.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                  {step.description}
                </p>

                {/* Tag de repère */}
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#EDE9FE] text-[#6D28D9]">
                    {step.tag}
                  </span>
                </div>
              </div>

              {/* Liste à puces des fonctionnalités clés */}
              <ul className="space-y-2 pt-3 border-t border-[#EDE9FE] text-xs font-medium text-[#1E1B4B]">
                {step.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
