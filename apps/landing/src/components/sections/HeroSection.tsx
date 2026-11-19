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
      {/* Vagues violettes décoratives à droite comme sur la maquette MonBilan+ _ Révèle ton potentiel.webp */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[560px] w-[52%] rounded-bl-[180px] bg-gradient-to-bl from-[#A855F7]/35 via-[#C084FC]/20 to-transparent"
      />

      <Container className="relative z-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Colonne gauche : Badge, Titre, Sous-titre, 2 CTA et 3 garanties */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAE4FF] border border-[#D3C4FF] px-4 py-1.5 text-xs sm:text-sm font-extrabold text-[#3B1D8F] shadow-sm">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#7935F5] text-white text-[11px]">
                ★
              </span>
              <span>IA • Orientation • Employabilité</span>
            </div>

            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#0F1035] leading-[1.12]"
            >
              Ton bilan d’orientation,{' '}
              <span className="mt-1 inline-flex flex-wrap items-center gap-2.5">
                <span>enfin</span>
                <span className="inline-block rounded-2xl bg-gradient-to-r from-[#7935F5] via-[#8B3DFF] to-[#A855F7] px-4 py-1 text-white shadow-cta">
                  facile à comprendre.
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#31355B] leading-relaxed max-w-xl">
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

          {/* Colonne droite : Visuel exact de la maquette (Jeune fille au casque + 3 cartes blanches flottantes inclinées) */}
          <div className="lg:col-span-6 relative sm:min-h-[450px] flex flex-col sm:flex-row items-center justify-center">
            {/* Image centrale du personnage avec casque audio */}
            <div className="relative z-10 w-[240px] xs:w-[270px] sm:w-[300px] xl:w-[320px] rounded-[36px] overflow-hidden shadow-floating border-4 border-white/80">
              <img
                src="images/visuals/hero-girl-headphones.png"
                alt="Jeune écoutant sa restitution audio MonBilan+ au casque"
                width={380}
                height={515}
                className="w-full h-auto object-cover"
              />
            </div>

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

            {/* Carte flottante 1 (Haut gauche) : Mon bilan */}
            <div className="hidden sm:block absolute left-0 top-4 z-20 w-[195px] xl:w-[225px] rounded-[22px] bg-white p-4 shadow-floating border border-[#E4E0F5] -rotate-3">
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

            {/* Carte flottante 2 (Bas gauche) : Métiers proposés dans le bilan */}
            <div className="hidden sm:block absolute left-0 bottom-4 z-20 w-[240px] rounded-[22px] bg-white p-4 shadow-floating border border-[#E4E0F5] -rotate-2">
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

            {/* Carte flottante 3 (Droite) : Mon parcours */}
            <div className="hidden sm:block absolute right-0 top-1/3 z-20 w-[195px] rounded-[22px] bg-white p-4 shadow-floating border border-[#E4E0F5] rotate-3">
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
