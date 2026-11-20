import React from 'react';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Icon } from '@/components/ui/Icon';

export function HeroSection() {
  return (
    <section
      id="accueil"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5F2FF] via-[#F8F7FF] to-[#EFEAFC] pt-8 pb-14 lg:pt-14 lg:pb-20"
    >
      {/* Halos lumineux d'arrière-plan */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* COLONNE GAUCHE (7 cols) : Titre officiel, sous-titre et 3 CTA */}
          <div className="lg:col-span-7 space-y-6">

            {/* Badge officiel de positionnement */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] px-4 py-1.5 text-xs sm:text-sm font-extrabold text-[#5B21B6] shadow-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#7C3AED] text-white text-[11px] font-bold">
                ★
              </span>
              <span>Orientation • Restitution Audio • Immersion Pro</span>
            </div>

            {/* Titre officiel exigé */}
            <h1
              id="hero-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold tracking-tight text-[#0F1035] leading-[1.2]"
            >
              Ton bilan prend tout son sens.{' '}
              <span className="block mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA]">
                Ton avenir prend forme.
              </span>
            </h1>

            {/* Sous-titre officiel exigé */}
            <p className="text-base sm:text-lg text-[#31355B] leading-relaxed max-w-2xl">
              Comprends les résultats de ton Rapport des Possibles grâce à des audios de deux minutes, explore les métiers qui t'intéressent et prépare tes prochaines étapes avec un accompagnement adapté.
            </p>

            {/* LES 3 CTA EXIGÉS */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              {/* CTA 1 : Découvrir la démonstration */}
              <PrimaryButton
                href={SITE_CONFIG.demoAppUrl}
                variant="primary"
                className="w-full sm:w-auto justify-center shadow-lg hover:shadow-xl font-extrabold"
              >
                <span>Découvrir la démonstration</span>
                <span aria-hidden="true">→</span>
              </PrimaryButton>

              {/* CTA 2 : Créer mon compte */}
              <a
                href={SITE_CONFIG.registerAppUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#7C3AED] bg-white px-5 py-3 text-sm font-extrabold text-[#7C3AED] hover:bg-[#F5F3FF] transition shadow-xs"
              >
                <Icon name="user" />
                <span>Créer mon compte</span>
              </a>

              {/* CTA 3 : Je suis professionnel */}
              <a
                href={SITE_CONFIG.counselorAppUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8DCF0] bg-white/80 px-4 py-3 text-xs sm:text-sm font-bold text-[#42466B] hover:text-[#0F1035] hover:bg-white transition"
              >
                <Icon name="briefcase" />
                <span>Je suis professionnel</span>
              </a>
            </div>

            {/* 3 Garanties déontologiques */}
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm font-bold text-[#1B1B62]">
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-black">
                  ✓
                </span>
                <span>Audios pédagogiques de 2 min</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-black">
                  ✓
                </span>
                <span>Validé par un conseiller</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black">
                  <Icon name="shield" />
                </span>
                <span>Sécurisé (RGPD &amp; RLS)</span>
              </li>
            </ul>

          </div>

          {/* COLONNE DROITE (5 cols) : Composition premium illustrant l'interface MonBilan+ */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-md mx-auto space-y-3.5">

              {/* CARTE 1 : LECTEUR AUDIO DÉMO (2 MINUTES SOURCÉES) */}
              <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-xl border border-[#E4E0F5] space-y-3 transition-transform hover:-translate-y-1 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold">
                      <Icon name="headphones" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-wider block">
                        Épisode 2 • 02:15
                      </span>
                      <h3 className="text-sm font-extrabold text-[#0F1035]">
                        Mes centres d'intérêt (RIASEC)
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Vérifié p. 4
                  </span>
                </div>

                {/* Forme d'onde audio & curseur */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                    <span>01:12</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-3 bg-[#7C3AED] rounded-full animate-pulse" />
                      <span className="w-1 h-5 bg-[#7C3AED] rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-[#7C3AED] rounded-full animate-pulse delay-150" />
                      <span className="w-1 h-4 bg-[#C4B5FD] rounded-full" />
                      <span className="w-1 h-3 bg-[#C4B5FD] rounded-full" />
                      <span className="w-1 h-5 bg-[#C4B5FD] rounded-full" />
                      <span className="w-1 h-2 bg-[#C4B5FD] rounded-full" />
                      <span className="w-1 h-4 bg-[#E4E0F5] rounded-full" />
                    </div>
                    <span>02:15</span>
                  </div>
                  <div className="w-full bg-[#F1F0F9] h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#6328E8] to-[#9333EA] h-full w-[54%] rounded-full" />
                  </div>
                </div>

                {/* Extrait transcription */}
                <p className="text-[11px] text-[#42466B] italic bg-[#FAF8FF] p-2.5 rounded-xl border border-[#EDE9FE] line-clamp-2">
                  « Tes résultats révèlent une forte affinité pour les activités créatives alliées à un besoin d’ordre et de méthode... »
                </p>
              </div>

              {/* CARTE 2 : CARTE MÉTIER RECOMMANDÉ D'AVENIR */}
              <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-lg border border-[#E4E0F5] flex items-center justify-between gap-3 transition-transform hover:-translate-y-1 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0 font-bold">
                    <Icon name="briefcase" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#0F1035]">
                        Peintre décorateur
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#6D28D9]">
                        Zone 2
                      </span>
                    </div>
                    <p className="text-[11px] text-[#555A8A]">
                      Second œuvre • Atelier Décors Riviera (Nice 06)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-1 rounded-xl">
                  92% affinité
                </span>
              </div>

              {/* CARTE 3 : PROCHAINE ÉTAPE CONCRÈTE (IMMERSION / CONTACT) */}
              <div className="rounded-3xl bg-gradient-to-r from-[#1E1B4B] to-[#2E1065] text-white p-4 sm:p-5 shadow-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    <Icon name="rocket" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block">
                      Prochaine étape concrète
                    </span>
                    <p className="text-xs font-extrabold text-white">
                      Préparer une immersion professionnelle (06)
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-white text-[#1E1B4B] px-3 py-1.5 rounded-full font-black shrink-0 hover:bg-purple-100 transition">
                  Agir →
                </span>
              </div>

            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
