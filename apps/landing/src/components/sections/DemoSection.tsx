'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

type DemoTab = 'YOUNG_SPACE' | 'YOUNG_CAREERS' | 'COUNSELOR_SPACE';

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTab>('YOUNG_SPACE');

  return (
    <section
      id="demo-interactive"
      aria-labelledby="demo-title"
      className="py-16 lg:py-24 bg-[#F8F7FF]"
    >
      <Container className="space-y-10">
        <SectionHeading
          badge="Données du Rapport 2187 (07/10/2026)"
          title="Découvre les deux espaces de MonBilan+"
          subtitle="Explore la restitution vérifiée du Rapport des Possibles Rdv 2187 (profil RIASEC, aptitudes, HEXACO et les 22 métiers répartis sur 5 zones)."
        />

        <div
          role="tablist"
          aria-label="Vues de démonstration MonBilan+"
          className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'YOUNG_SPACE'}
            onClick={() => setActiveTab('YOUNG_SPACE')}
            className={`min-h-11 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition ${
              activeTab === 'YOUNG_SPACE'
                ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-cta'
                : 'bg-white text-[#1B1B62] border border-[#D8DCF0] hover:bg-[#F3EFFE]'
            }`}
          >
            <Icon name="headphones" /> 1. Espace Jeune (6 rubriques &amp; Audio)
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'YOUNG_CAREERS'}
            onClick={() => setActiveTab('YOUNG_CAREERS')}
            className={`min-h-11 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition ${
              activeTab === 'YOUNG_CAREERS'
                ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-cta'
                : 'bg-white text-[#1B1B62] border border-[#D8DCF0] hover:bg-[#F3EFFE]'
            }`}
          >
            <Icon name="compass" /> 2. Les 22 métiers proposés (Zones 1 à 5)
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'COUNSELOR_SPACE'}
            onClick={() => setActiveTab('COUNSELOR_SPACE')}
            className={`min-h-11 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition ${
              activeTab === 'COUNSELOR_SPACE'
                ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-cta'
                : 'bg-white text-[#1B1B62] border border-[#D8DCF0] hover:bg-[#F3EFFE]'
            }`}
          >
            <Icon name="stethoscope" /> 3. Espace Conseiller (8 rubriques métier)
          </button>
        </div>

        <div className="rounded-[32px] bg-white border-2 border-[#DFD5FD] shadow-floating overflow-hidden">
          <div className="bg-[#1B1B62] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
              <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
              <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
              <span className="ml-3 text-xs font-mono text-[#E7E8FB]">
                Rapport des Possibles — Rdv 2187 (07/10/2026) • 17 pages
              </span>
            </div>
            <span className="rounded-full bg-[#38A678]/25 border border-[#38A678] px-3 py-0.5 text-xs font-bold text-[#A7F3D0]">
              ✓ Restitution validée par un professionnel
            </span>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            {activeTab === 'YOUNG_SPACE' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                    {['Accueil', 'Mon bilan', 'Explorer les métiers', 'Mon parcours', 'Mes questions', 'Mes documents'].map(
                      (nav, i) => (
                        <span
                          key={nav}
                          className={`rounded-full px-3 py-1 ${
                            i === 1
                              ? 'bg-[#6D28D9] text-white'
                              : 'bg-[#F3EFFE] text-[#4C1D95]'
                          }`}
                        >
                          {nav}
                        </span>
                      )
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F1035]">
                    Explication des résultats existants avec références aux pages
                  </h3>
                  <p className="text-sm sm:text-base text-[#42466B] leading-relaxed">
                    Le jeune retrouve le profil d’intérêts RIASEC de la page 4 (Artistique, Entreprenant, Réaliste, Investigateur, Social, Conventionnel), l’explication qualitative des 9 aptitudes cognitives (page 5) et des 6 dimensions HEXACO (page 6).
                  </p>
                  <div className="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#6D28D9]">RÉSERVE MÉTHODOLOGIQUE DU RAPPORT (PAGE 17)</span>
                      <span className="rounded bg-[#EAE4FF] px-2.5 py-0.5 text-[#4C1D95]">
                        <Icon name="file-text" /> Rapport Rdv 2187 — p. 5 &amp; p. 17
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm italic text-[#0F1035]">
                      « Les résultats présentés dans ce bilan proviennent de travaux expérimentaux. Ils ne peuvent pas rendre compte du profil complet d’un individu et constituent des pistes de réflexion. »
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-[24px] bg-[#1B1B62] p-6 text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E7E8FB]">
                      Audio + Transcription accessible
                    </span>
                    <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-bold">
                      0.85x • 1x • 1.15x
                    </span>
                  </div>
                  <p className="text-lg font-extrabold">Restitution vocale — Rdv 2187</p>
                  <div className="rounded-xl bg-[#11113A] p-4 text-xs text-[#E7E8FB] leading-relaxed border border-[#5156A0]">
                    Audio généré après validation du professionnel, accompagné de sa transcription complète lisible sans son.
                  </div>
                  <PrimaryButton href={SITE_CONFIG.demoAppUrl} variant="primary" className="w-full">
                    Découvrir la démonstration →
                  </PrimaryButton>
                </div>
              </div>
            )}

            {activeTab === 'YOUNG_CAREERS' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#0F1035]">
                      Explore les métiers proposés dans ton rapport d’orientation
                    </h3>
                    <p className="text-sm text-[#42466B]">
                      Les 22 métiers issus du rapport Rdv 2187 (pages 8 à 16), présentés dans leurs 5 zones de préparation sans classement inédit.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#F3EFFE] px-4 py-1.5 text-xs font-extrabold text-[#6D28D9]">
                    22 métiers • Pages 8 à 16
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-[#E4E0F5] p-5 space-y-2 bg-[#F8F7FF]">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#6D28D9]">Zone 1 (0 à 6 mois • 5 métiers)</span>
                      <span className="text-[#42466B]">Pages 8–9</span>
                    </div>
                    <h4 className="text-base font-extrabold text-[#0F1035]">
                      Peintre décorateur • Cuisinier restauration rapide • Barista • Ouvrier agricole • Ouvrier de carrière
                    </h4>
                  </div>

                  <div className="rounded-2xl border-2 border-[#7935F5] p-5 space-y-2 bg-white shadow-sm">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#6D28D9]">Zone 3 (1 à 4 ans • 5 métiers)</span>
                      <span className="text-[#42466B]">Pages 12–13</span>
                    </div>
                    <h4 className="text-base font-extrabold text-[#0F1035]">
                      Esthéticien • Coach sportif • Guide touristique • Technicien du son • Technicien Solaire Thermique
                    </h4>
                  </div>

                  <div className="rounded-2xl border border-[#E4E0F5] p-5 space-y-2 bg-[#F8F7FF]">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#6D28D9]">Zones 2, 4 &amp; 5 (12 métiers)</span>
                      <span className="text-[#42466B]">Pages 10–16</span>
                    </div>
                    <h4 className="text-base font-extrabold text-[#0F1035]">
                      Acteur, Boucher, Guide naturaliste, Animateur Radio, Réalisateur, Professeur, Praticien APA…
                    </h4>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'COUNSELOR_SPACE' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#0F1035]">
                      Espace Conseiller : contrôle humain avant toute publication
                    </h3>
                    <p className="text-sm text-[#42466B]">
                      {SITE_CONFIG.professionalValidationNotice}
                    </p>
                  </div>
                  <PrimaryButton href={SITE_CONFIG.counselorAppUrl} variant="primary">
                    Ouvrir l’Espace Conseiller →
                  </PrimaryButton>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
                  {[
                    '1. Tableau de bord',
                    '2. Dossiers jeunes',
                    '3. Importation de rapport',
                    '4. Vérification des données',
                    '5. Validation et publication',
                    '6. Suivi et rendez-vous',
                    '7. Statistiques',
                    '8. Paramètres'
                  ].map((rubrique) => (
                    <div
                      key={rubrique}
                      className="rounded-xl bg-[#F3EFFE] border border-[#D8CEFF] p-3 text-[#0F1035]"
                    >
                      {rubrique}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
