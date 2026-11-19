import React from 'react';
import { Container } from '@/components/ui/Container';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FF]">
      <SiteHeader />
      <main id="main-content" className="flex-1 py-12 lg:py-16">
        <Container className="max-w-3xl space-y-6 bg-white p-8 rounded-[28px] border border-[#E4E0F5] shadow-card">
          <h1 className="text-3xl font-extrabold text-[#0F1035]">
            Mentions légales — MonBilan+ (Hackathon Azuréen #3)
          </h1>
          <p className="text-sm text-[#42466B] leading-relaxed">
            Ce site et cette démonstration ont été conçus par l’<strong>Équipe 03</strong> (Bastien Ozil, Mathilde Poirier, Saidou Yaya Diallo — 42 Nice) dans le cadre du <strong>Hackathon Azuréen #3</strong> organisé par Code4Sud les 18, 19 et 20 novembre 2026 à Nice, sur le thème « L’orientation et l’employabilité grâce à l’IA ».
          </p>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F1035]">Propriété intellectuelle &amp; Licence</h2>
            <p className="text-sm text-[#42466B] leading-relaxed">
              Le code source du prototype MonBilan+ est publié sous licence <strong>MIT</strong> sur le dépôt GitHub de l’événement : <code>Code4sud/2026-equipe-03</code>. L’utilisation des références visuelles du Centre des Possibles s’inscrit exclusivement dans le cadre pédagogique du sujet 1 du hackathon.
            </p>
          </div>
          <div className="pt-4">
            <a href="../" className="text-sm font-bold text-[#6D28D9] underline">
              ← Retour à l’accueil MonBilan+
            </a>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
