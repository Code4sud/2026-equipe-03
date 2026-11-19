import React from 'react';
import { HOW_IT_WORKS_STEPS } from '@/data/landing-content';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StepCard } from '@/components/ui/StepCard';

export function HowItWorksSection() {
  return (
    <section
      id="comment-ca-marche"
      aria-labelledby="how-title"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#FFFFFF] via-[#F8F7FF] to-[#F3EFFE]"
    >
      <Container className="space-y-12">
        <SectionHeading
          badge="De ton rendez-vous à ton espace personnel"
          title="Comment ça marche ?"
          subtitle="Le Centre des Possibles produit le bilan. MonBilan+ le rend compréhensible, accessible, mémorable et exploitable après l’entretien."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <StepCard
              key={step.stepNumber}
              step={step}
              isLast={index === HOW_IT_WORKS_STEPS.length - 1}
            />
          ))}
        </div>

        {/* Bandeau inférieur rappelant explicitement la responsabilité du professionnel (§3.H) */}
        <div className="rounded-[28px] bg-gradient-to-r from-[#EDE7FE] via-[#F5F2FF] to-[#E9D5FF] border border-[#D8CEFF] p-6 sm:p-8 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D28D9]">
                Garantie méthodologique • Validation professionnelle
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F1035]">
                {SITE_CONFIG.professionalValidationNotice}
              </h3>
              <p className="text-sm sm:text-base text-[#31355B] leading-relaxed">
                MonBilan+ ne fait pas passer de tests psychométriques, ne calcule aucun nouveau score et ne pose aucun diagnostic. Chaque affirmation personnelle renvoie aux pages du rapport établi par le Centre des Possibles.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-wrap items-center justify-start lg:justify-end gap-3">
              <a
                href={SITE_CONFIG.demoAppUrl}
                className="min-h-11 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] px-6 py-3 text-sm font-bold text-white shadow-cta hover:opacity-95 transition"
              >
                Découvrir la démonstration →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
