import React from 'react';
import { Container } from '@/components/ui/Container';
import { SITE_CONFIG } from '@/config/site';
import { Icon } from '@/components/ui/Icon';

export function FinalCtaSection() {
  return (
    <section aria-labelledby="final-cta-heading" className="py-16 lg:py-24 bg-gradient-to-br from-[#1E1B4B] via-[#2B1B69] to-[#120E38] text-white relative overflow-hidden">
      {/* Halos décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#EC4899]/15 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
        {/* Badge d'action */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-black text-purple-200">
          <span>★</span>
          <span>Ton orientation commence maintenant</span>
        </div>

        {/* Titre officiel exigé */}
        <h2
          id="final-cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight"
        >
          Tes possibles ne s'arrêtent pas à ton bilan.
        </h2>

        {/* Sous-titre */}
        <p className="text-sm sm:text-base lg:text-lg text-purple-100 max-w-2xl mx-auto leading-relaxed">
          Que tu disposes déjà d’un Rapport des Possibles ou que tu découvres ton orientation en toute autonomie, accède à des outils simples, pratiques et conçus pour toi.
        </p>

        {/* Les 2 CTA exigés */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* CTA 1 : Commencer mon parcours */}
          <a
            href={SITE_CONFIG.registerAppUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] text-white font-black text-base py-3.5 px-8 shadow-xl hover:brightness-110 active:scale-98 transition"
          >
            <span>Commencer mon parcours</span>
            <span aria-hidden="true">→</span>
          </a>

          {/* CTA 2 : Découvrir la démo */}
          <a
            href={SITE_CONFIG.demoAppUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-extrabold text-base py-3.5 px-8 transition"
          >
            <Icon name="play" />
            <span>Découvrir la démo</span>
          </a>
        </div>

        {/* Rappel des 3 promesses */}
        <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-semibold text-purple-200">
          <span>✓ 100% gratuit pour le jeune</span>
          <span>✓ Aucun compte obligatoire pour la démo</span>
          <span>✓ Conforme RGPD &amp; RLS</span>
        </div>
      </Container>
    </section>
  );
}
