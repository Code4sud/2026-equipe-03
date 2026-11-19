import React from 'react';
import { HERO_PILLARS } from '@/data/landing-content';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function HeroSection() {
  return (
    <section
      id="accueil"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5F2FF] via-[#F8F7FF] to-[#EFEAFC] pt-8 pb-12 lg:pt-12 lg:pb-14"
    >
      {/* Bandeau : texte à gauche (aligné sur le Container) + zone violette des bulles collée au bord droit */}
      <div className="relative z-10 flex flex-col lg:flex-row">
          {/* Colonne gauche : Badge, Titre, Sous-titre, 2 CTA et 3 garanties */}
          <div className="px-4 sm:px-6 lg:w-[62%] xl:w-[66%] lg:self-center lg:pr-10 lg:pl-[max(2rem,calc((100%_-_80rem)/2_+_2rem))] space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAE4FF] border border-[#D3C4FF] px-4 py-1.5 text-xs sm:text-sm font-extrabold text-[#3B1D8F] shadow-sm">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#7935F5] text-white text-[11px]">
                ★
              </span>
              <span>IA • Orientation • Employabilité</span>
            </div>

            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-[clamp(34px,3.4vw,48px)] font-extrabold tracking-tight text-[#0F1035] leading-[1.3]"
            >
              Ton bilan d’orientation,{' '}
              <span className="mt-2 inline-flex flex-wrap lg:flex-nowrap lg:whitespace-nowrap items-center gap-x-2.5 gap-y-2">
                <span>enfin</span>
                <span className="inline-block rounded-2xl bg-gradient-to-r from-[#7935F5] via-[#8B3DFF] to-[#A855F7] px-4 py-1 text-white shadow-cta">
                  facile à comprendre.
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg xl:text-xl text-[#31355B] leading-relaxed max-w-2xl">
              Après ton rendez-vous au Centre des Possibles, retrouve ton bilan sous une forme simple, interactive et accessible. Écoute tes résultats, découvre les métiers proposés et prépare la suite avec ton conseiller.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <PrimaryButton href={SITE_CONFIG.demoAppUrl} variant="primary" className="w-full sm:w-auto justify-center">
                <span>Découvrir la démonstration</span>
                <span aria-hidden="true">→</span>
              </PrimaryButton>

              <PrimaryButton href="#comment-ca-marche" variant="secondary" className="w-full sm:w-auto justify-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3EFFE] text-[#6D28D9] text-xs">
                  ▶
                </span>
                <span>Comment ça marche ?</span>
              </PrimaryButton>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs sm:text-sm font-bold text-[#1B1B62]">
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs">
                  ✓
                </span>
                <span>Simple et rapide</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs">
                  ✓
                </span>
                <span>Personnalisé &amp; sourcé</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs">
                  🛡️
                </span>
                <span>Sécurisé (RGPD)</span>
              </li>
            </ul>
          </div>

          {/* Colonne droite : 3 cartes blanches flottantes inclinées */}
          {/* Zone violette : de la ligne jusqu'au bord droit, bulles centrées dedans */}
          <div className="relative mt-8 lg:-mt-12 lg:w-[38%] xl:w-[34%] px-4 sm:px-6 lg:py-12 flex flex-col sm:flex-row items-center justify-center lg:rounded-bl-[180px] lg:bg-gradient-to-bl lg:from-[#A855F7]/35 lg:via-[#C084FC]/20 lg:to-transparent">
            {/* Grille mobile (< sm) des 3 cartes repères pour éviter tout chevauchement sur smartphone */}
            <div className="grid grid-cols-1 gap-2.5 w-full mt-4 sm:hidden">
              <div className="rounded-2xl bg-white p-3.5 shadow-card border border-[#E4E0F5] flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#0F1035]">📋 Mon bilan</span>
                <span className="text-[11px] font-bold text-[#1B1B62]">Intérêts • Aptitudes • Personnalité</span>
              </div>
              <div className="rounded-2xl bg-white p-3.5 shadow-card border border-[#E4E0F5] flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#0F1035]">💼 Métiers du bilan</span>
                <span className="text-[11px] font-bold text-[#1B1B62]">Peintre • Technicien son • Radio</span>
              </div>
              <div className="rounded-2xl bg-white p-3.5 shadow-card border border-[#E4E0F5] flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#0F1035]">🔗 Mon parcours</span>
                <span className="text-[11px] font-bold text-[#1B1B62]">Formations • Étapes • Questions</span>
              </div>
            </div>

            {/* Pile centrale des 3 cartes qui se chevauchent (≥ sm) */}
            <div className="hidden sm:block relative w-[320px] h-[380px]">
            {/* Carte 1 (haut, à l'arrière) : Mon bilan */}
            <div className="absolute left-0 top-0 z-10 w-[225px] rounded-[22px] bg-white p-4 shadow-floating border border-[#E4E0F5] -rotate-3">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EFFE] text-[#6D28D9] text-sm font-bold">
                  📋
                </span>
                <span className="text-base font-extrabold text-[#0F1035]">Mon bilan</span>
              </div>
              <ul className="space-y-1.5 text-xs font-bold text-[#1B1B62]">
                <li className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-white text-[10px]">
                    ✓
                  </span>
                  <span>Centres d’intérêt</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-white text-[10px]">
                    ✓
                  </span>
                  <span>Aptitudes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-white text-[10px]">
                    ✓
                  </span>
                  <span>Personnalité</span>
                </li>
              </ul>
            </div>

            {/* Carte 2 (bas, au premier plan) : Métiers proposés dans le bilan */}
            <div className="absolute left-4 bottom-0 z-30 w-[240px] rounded-[22px] bg-white p-4 shadow-floating border border-[#E4E0F5] -rotate-2">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EFFE] text-[#6D28D9] text-sm font-bold">
                  💼
                </span>
                <span className="text-sm font-extrabold text-[#0F1035]">Métiers du bilan</span>
              </div>
              <ul className="space-y-2 text-xs font-bold text-[#1B1B62]">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFEDD5] text-[#EA580C]">
                    🎨
                  </span>
                  <span>Peintre décorateur</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3EFFE] text-[#6D28D9]">
                    🎧
                  </span>
                  <span>Technicien du son</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D1FAE5] text-[#059669]">
                    📻
                  </span>
                  <span>Animateur Radio</span>
                </li>
              </ul>
            </div>

            {/* Carte 3 (milieu droite) : Mon parcours */}
            <div className="absolute right-0 top-[115px] z-20 w-[200px] rounded-[22px] bg-white p-4 shadow-floating border border-[#E4E0F5] rotate-3">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EFFE] text-[#6D28D9] text-sm font-bold">
                  🔗
                </span>
                <span className="text-sm font-extrabold text-[#0F1035]">Mon parcours</span>
              </div>
              <ul className="space-y-2 text-xs font-bold text-[#1B1B62]">
                <li className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-white text-[10px]">
                    ✓
                  </span>
                  <span>Formations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-white text-[10px]">
                    ✓
                  </span>
                  <span>Étapes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-white text-[10px]">
                    ✓
                  </span>
                  <span>Questions</span>
                </li>
              </ul>
            </div>
            </div>
          </div>
      </div>

      <Container className="relative z-10 mt-10">
        {/* Barre horizontale blanche des 4 piliers (en bas du Hero) */}
        <div className="rounded-[28px] bg-white/95 border border-[#E4E0F5] p-6 sm:p-7 shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-[#E4E0F5]">
            {HERO_PILLARS.map((pillar, index) => (
              <div
                key={pillar.id}
                className={`flex items-start gap-4 ${index > 0 ? 'lg:pl-6' : ''}`}
              >
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3EFFE] text-[#6D28D9]"
                >
                  {pillar.icon === 'target' && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  )}
                  {pillar.icon === 'compass' && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <circle cx="12" cy="12" r="9" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                  )}
                  {pillar.icon === 'route' && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <circle cx="6" cy="18" r="2.5" />
                      <circle cx="18" cy="6" r="2.5" />
                      <path d="M8.5 18H12a3 3 0 003-3V9a3 3 0 013-3" />
                    </svg>
                  )}
                  {pillar.icon === 'bolt' && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#0F1035]">
                    {pillar.title}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#42466B] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
