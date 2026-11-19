import React from 'react';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function FinalCtaSection() {
  return (
    <section aria-labelledby="final-cta-title" className="py-16 lg:py-20 bg-white">
      <Container>
        <div className="rounded-[32px] bg-gradient-to-r from-[#241763] via-[#4C1D95] to-[#7935F5] p-8 sm:p-12 lg:p-14 text-white shadow-floating relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block rounded-full bg-white/15 border border-white/25 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#E7E8FB]">
              Démonstration interactive • Hackathon Azuréen #3
            </span>
            <h2
              id="final-cta-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
            >
              Prêt à explorer un Rapport des Possibles augmenté ?
            </h2>
            <p className="text-base sm:text-lg text-[#E7E8FB]/90 leading-relaxed max-w-2xl mx-auto">
              Teste dès maintenant l’Espace Jeune (audio + preuves PDF + métiers par zone) et le Studio Conseiller (contrôle des faits + validation humaine + sécurité RLS) sur un dossier 100 % fictif.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <PrimaryButton href={SITE_CONFIG.demoAppUrl} variant="outline-white">
                <span>Ouvrir l’application MonBilan+</span>
                <span aria-hidden="true">→</span>
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
