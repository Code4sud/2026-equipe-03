import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { COUNSELOR_PILLARS } from '@/data/landing-content';
import { Icon } from '@/components/ui/Icon';
import { SITE_CONFIG } from '@/config/site';

export function HumanCounselorSection() {
  return (
    <section id="accompagnement" aria-labelledby="counselor-heading" className="py-14 lg:py-20 bg-[#F4F2FF] relative overflow-hidden">
      <Container>
        <SectionHeading
          badge="Médiation Humaine Garantie"
          title="Un accompagnement humain au cœur de la démarche"
          subtitle="MonBilan+ a été pensé pour renforcer et prolonger le lien entre le jeune et son conseiller, sans jamais remplacer l’écoute, l’analyse et l’expertise humaine."
          centered
        />

        {/* Grille des 5 rôles clés du conseiller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 lg:mt-14 max-w-6xl mx-auto">
          {COUNSELOR_PILLARS.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white p-6 shadow-sm border border-[#E4E0F5] space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xl font-bold">
                <Icon name={item.icon} />
              </div>
              <h3 className="text-base font-extrabold text-[#0F1035]">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}

          {/* 6ème carte : Déontologie & Non-substitution de l'IA */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1E1B4B] to-[#2E1065] text-white p-6 shadow-lg space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 text-purple-200 flex items-center justify-center text-xl font-bold">
                <Icon name="shield" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                L’IA assiste, le conseiller décide
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Aucun diagnostic automatique, aucun profilage psychologique, aucun pronostic déterministe : l'intelligence artificielle est un outil d'aide à la clarté sous la supervision intégrale du professionnel.
              </p>
            </div>
            <div className="pt-2">
              <a
                href={SITE_CONFIG.counselorAppUrl}
                className="inline-flex items-center gap-1.5 text-xs font-black text-white hover:text-purple-200 transition underline underline-offset-4"
              >
                <span>Accéder à l’Espace Conseiller</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
