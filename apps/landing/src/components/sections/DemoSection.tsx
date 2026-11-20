'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

type DemoTab = 'YOUNG_SPACE' | 'YOUNG_CAREERS' | 'COUNSELOR_SPACE' | 'AUTONOMOUS_SPACE';

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTab>('YOUNG_SPACE');

  return (
    <section
      id="demo"
      aria-labelledby="demo-title"
      className="py-16 lg:py-24 bg-[#F8F7FF] border-y border-[#E4E0F5]"
    >
      <Container className="space-y-10">
        <SectionHeading
          badge="Démonstration Hackathon Azuréen #3"
          title="Une démonstration 100% interactive et fonctionnelle"
          subtitle="Explore la restitution du dossier de démonstration certifié (Emma Dubois, Rdv 2187) ou l'Espace Conseiller sans aucune installation ni barrière d'accès."
          centered
        />

        {/* Avertissement de transparence sur les données fictives */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-purple-50 border border-purple-200 p-4 text-xs text-[#5B21B6] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">ℹ</span>
            <span>
              <strong>Dossier de démonstration :</strong> Les données présentées (Emma Dubois, Rdv 2187) sont entièrement fictives et créées pour le Hackathon. Aucun dossier personnel réel n'est exposé.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold shrink-0 text-[10px]">
            Hackathon #3
          </span>
        </div>

        {/* Sélecteur d'onglets de démonstration */}
        <div
          role="tablist"
          aria-label="Vues de démonstration MonBilan+"
          className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 max-w-4xl mx-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'YOUNG_SPACE'}
            onClick={() => setActiveTab('YOUNG_SPACE')}
            className={`min-h-11 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
              activeTab === 'YOUNG_SPACE'
                ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md'
                : 'bg-white text-[#1B1B62] border border-[#D8DCF0] hover:bg-[#F3EFFE]'
            }`}
          >
            <Icon name="headphones" />
            <span>1. Espace Jeune (Restitution &amp; Audio)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'YOUNG_CAREERS'}
            onClick={() => setActiveTab('YOUNG_CAREERS')}
            className={`min-h-11 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
              activeTab === 'YOUNG_CAREERS'
                ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md'
                : 'bg-white text-[#1B1B62] border border-[#D8DCF0] hover:bg-[#F3EFFE]'
            }`}
          >
            <Icon name="compass" />
            <span>2. Les 22 métiers O*NET FR</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'AUTONOMOUS_SPACE'}
            onClick={() => setActiveTab('AUTONOMOUS_SPACE')}
            className={`min-h-11 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
              activeTab === 'AUTONOMOUS_SPACE'
                ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md'
                : 'bg-white text-[#1B1B62] border border-[#D8DCF0] hover:bg-[#F3EFFE]'
            }`}
          >
            <Icon name="rocket" />
            <span>3. Immersion Pro &amp; Autonomie (06)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'COUNSELOR_SPACE'}
            onClick={() => setActiveTab('COUNSELOR_SPACE')}
            className={`min-h-11 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
              activeTab === 'COUNSELOR_SPACE'
                ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md'
                : 'bg-white text-[#1B1B62] border border-[#D8DCF0] hover:bg-[#F3EFFE]'
            }`}
          >
            <Icon name="briefcase" />
            <span>4. Espace Conseiller (Workflow 6 étapes)</span>
          </button>
        </div>

        {/* CONTENU DÉTAILLÉ DE L'ONGLET SÉLECTIONNÉ */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 lg:p-10 shadow-xl border border-[#E4E0F5] max-w-4xl mx-auto">
          {activeTab === 'YOUNG_SPACE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EDFA]">
                <div>
                  <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider block">
                    Vue Jeune Accompagné • Dossier Rdv 2187
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F1035]">
                    Restitution personnalisée &amp; Épisodes audio
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold self-start sm:self-auto">
                  Validé par le conseiller
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">5 Épisodes Audio</span>
                  <p className="text-xs text-[#42466B]">
                    Synthèse vocale chaleureuse calibrée à environ 2 minutes par thème.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">Profil RIASEC &amp; HEXACO</span>
                  <p className="text-xs text-[#42466B]">
                    Explication claire des scores dominants sans étiquette réductrice.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">Carnet de questions</span>
                  <p className="text-xs text-[#42466B]">
                    Espace sécurisé pour noter ses questions en vue du prochain rendez-vous.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#64748B]">
                  Testable immédiatement dans la démo avec le profil <strong>Emma Dubois</strong>.
                </p>
                <PrimaryButton href={SITE_CONFIG.demoAppUrl} variant="primary">
                  <span>Lancer la démo Jeune</span>
                  <span aria-hidden="true">→</span>
                </PrimaryButton>
              </div>
            </div>
          )}

          {activeTab === 'YOUNG_CAREERS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EDFA]">
                <div>
                  <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider block">
                    Référentiel O*NET FR &amp; Métiers d'avenir
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F1035]">
                    22 métiers proposés en 5 zones de temps
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EDE9FE] text-[#6D28D9] text-xs font-extrabold self-start sm:self-auto">
                  5 zones de préparation
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                  Chaque métier issu du bilan est documenté avec ses activités clés, ses compétences requises et ses équivalences de formation sur le territoire azuréen (Nice, Cannes, Sophia Antipolis).
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-bold text-center">
                  <div className="p-3 rounded-xl bg-purple-50 text-[#6D28D9]">Peintre décorateur</div>
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-800">Technicien du son</div>
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800">Animateur radio</div>
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-900">19 autres métiers...</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#64748B]">
                  Filtres par zone (de 0–6 mois à 4–10 ans d'études).
                </p>
                <PrimaryButton href={SITE_CONFIG.demoAppUrl} variant="primary">
                  <span>Explorer le catalogue métiers</span>
                  <span aria-hidden="true">→</span>
                </PrimaryButton>
              </div>
            </div>
          )}

          {activeTab === 'AUTONOMOUS_SPACE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EDFA]">
                <div>
                  <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider block">
                    Parcours Ouvert • Sans bilan préalable
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F1035]">
                    Immersion Pro, Coach IA &amp; Trouver de l'aide
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold self-start sm:self-auto">
                  100% Autonome
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">Immersion Pro (06)</span>
                  <p className="text-xs text-[#42466B]">
                    4 étapes : Découvrir le métier, trouver une entreprise niçoise, postuler et suivre son stage.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">Mon Coach IA</span>
                  <p className="text-xs text-[#42466B]">
                    Simulateur interactif pour s'entraîner aux entretiens d'immersion et générer des emails de contact.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">Trouver de l'aide</span>
                  <p className="text-xs text-[#42466B]">
                    Annuaire géolocalisé des CIO, Missions Locales et conseillers des Alpes-Maritimes.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#64748B]">
                  Accessible sans aucun prérequis de dossier.
                </p>
                <PrimaryButton href={SITE_CONFIG.demoAppUrl} variant="primary">
                  <span>Tester le parcours autonome</span>
                  <span aria-hidden="true">→</span>
                </PrimaryButton>
              </div>
            </div>
          )}

          {activeTab === 'COUNSELOR_SPACE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EDFA]">
                <div>
                  <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider block">
                    Espace Professionnel • Supervision
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F1035]">
                    Tableau de bord &amp; Workflow de validation 6 étapes
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-[#6D28D9] text-xs font-extrabold self-start sm:self-auto">
                  Accès Conseiller
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">Tableau de bord</span>
                  <p className="text-xs text-[#42466B]">
                    4 KPI clés, alertes de dossiers en attente et liste interactive des jeunes suivis.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">Import autonome</span>
                  <p className="text-xs text-[#42466B]">
                    Module d'importation de rapports PDF avec zone de drop et extraction sécurisée.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EDE9FE] space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] block">Validation &amp; Publication</span>
                  <p className="text-xs text-[#42466B]">
                    Contrôle des citations exactes, révision d'entretien et publication vers le jeune.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#64748B]">
                  Testable avec le compte certifié de <strong>Sophie Martin</strong>.
                </p>
                <a
                  href={SITE_CONFIG.counselorAppUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E1B4B] text-white font-extrabold text-xs sm:text-sm px-5 py-3 shadow-md hover:bg-[#2E1065] transition"
                >
                  <span>Ouvrir l'Espace Conseiller</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
