import React from 'react';
import { ECOSYSTEM_BENEFITS, IMPACT_METRICS, IMPACT_PILLS } from '@/data/landing-content';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function ImpactSection() {
  return (
    <section
      id="impact"
      aria-labelledby="impact-title"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#FFFFFF] via-[#F5F2FF] to-[#EFEAFC]"
    >
      <Container className="space-y-12">
        {/* Partie haute : Titre à gauche + 4 pills horizontales à droite (fidèle à la maquette L'impact concret) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAE4FF] border border-[#D3C4FF] px-4 py-1.5 text-xs font-extrabold text-[#5B21B6]">
              <span>📊</span>
              <span>Notre approche</span>
            </span>

            <h2
              id="impact-title"
              className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-[#0F1035] leading-[1.3]"
            >
              Un impact concret sur l’orientation,{' '}
              <span className="mt-2 inline-flex flex-wrap items-center gap-x-2.5 gap-y-2">
                <span>la</span>
                <span className="inline-block rounded-2xl bg-gradient-to-r from-[#6D28D9] via-[#7935F5] to-[#9333EA] px-4 py-1 text-white shadow-cta">
                  compréhension
                </span>
                <span>et l’employabilité</span>
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#31355B] leading-relaxed max-w-2xl">
              MonBilan+ aide les jeunes à retenir l’essentiel de leur bilan après leur passage au Centre des Possibles, à explorer des pistes réalistes et à préparer activement la suite de leur parcours.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <PrimaryButton href={SITE_CONFIG.demoAppUrl} variant="primary">
                <span>Découvrir un bilan restitué</span>
                <span aria-hidden="true">→</span>
              </PrimaryButton>
              <PrimaryButton href="#comment-ca-marche" variant="secondary">
                <span>Voir la méthodologie</span>
              </PrimaryButton>
            </div>
          </div>

          {/* 4 bulles en grille 2 x 2 qui occupent toute la colonne de droite */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {IMPACT_PILLS.map((pill) => (
                <div
                  key={pill.title}
                  className="rounded-[22px] bg-white/95 border border-[#E4E0F5] p-5 shadow-card flex flex-col gap-3 hover:border-[#7935F5] transition"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3EFFE] text-[#6D28D9] font-extrabold text-base"
                  >
                    {pill.icon === 'check' && '✓'}
                    {pill.icon === 'cap' && '🎓'}
                    {pill.icon === 'briefcase' && '💼'}
                    {pill.icon === 'leaf' && '🌱'}
                  </span>
                  <div>
                    <p className="text-sm sm:text-base font-extrabold text-[#0F1035] leading-snug">
                      {pill.title}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-[#42466B] leading-snug">
                      {pill.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rangée centrale : 4 Cartes de repères méthodologiques vérifiables (0 statistique inventée) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {IMPACT_METRICS.map((metric) => (
            <div
              key={metric.id}
              className="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-card flex items-start gap-4"
            >
              <div
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3EFFE] text-[#6D28D9] font-extrabold text-lg"
              >
                {metric.icon === 'users' && '🧩'}
                {metric.icon === 'cap' && '🎓'}
                {metric.icon === 'chart' && '📄'}
                {metric.icon === 'target' && '🎯'}
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#0F1035]">
                  {metric.value}
                </p>
                <p className="text-sm font-bold text-[#1B1B62] mt-0.5">
                  {metric.label}
                </p>
                <p className="text-xs text-[#42466B] mt-1 leading-snug">
                  {metric.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Partie basse : "Des bénéfices pour tout l'écosystème" + 3 cartes */}
        <div className="rounded-[32px] bg-white/90 border border-[#E4E0F5] p-6 sm:p-8 lg:p-10 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F1035] leading-tight">
                Des bénéfices pour tout l’écosystème
              </h3>
              <p className="text-sm text-[#42466B] leading-relaxed">
                Une solution utile pour les jeunes, les structures d’accompagnement et les conseillers.
              </p>
            </div>

            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-5">
              {ECOSYSTEM_BENEFITS.map((card) => (
                <div
                  key={card.id}
                  className="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE4FF] text-[#6D28D9] font-bold"
                    >
                      {card.icon === 'cap' && '🎓'}
                      {card.icon === 'users' && '👨‍👩‍👦'}
                      {card.icon === 'building' && '🏛️'}
                    </span>
                    <h4 className="text-base font-extrabold text-[#0F1035]">
                      {card.title}
                    </h4>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-[#31355B]">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="text-[#6D28D9] font-extrabold">✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
