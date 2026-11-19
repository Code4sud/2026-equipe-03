import { Icon } from '@/components/ui/Icon';
import React from 'react';
import { DEPLOYMENT_MODES } from '@/data/landing-content';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const INSTITUTIONAL_ECOSYSTEM = [
  { label: 'Centre des Possibles', icon: 'star' },
  { label: 'Métropole Nice Côte d’Azur', icon: 'landmark' },
  { label: 'Université Côte d’Azur', icon: 'graduation-cap' },
  { label: 'Académie de Nice', icon: 'book-open' },
  { label: 'Hackathon Code4Sud', icon: 'laptop' }
];

export function DeploymentModesSection() {
  return (
    <section
      id="cadre-projet"
      aria-labelledby="deployment-title"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#EFEAFC] via-[#F8F7FF] to-[#FFFFFF]"
    >
      <Container className="space-y-12">
        <SectionHeading
          badge="Architecture & Cadre du Projet"
          title="Un outil conçu en complément du parcours du Centre des Possibles"
          subtitle={SITE_CONFIG.professionalValidationNotice}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-2">
          {DEPLOYMENT_MODES.map((mode) => (
            <article
              key={mode.id}
              className={`relative rounded-[28px] p-6 flex flex-col justify-between transition ${
                mode.recommended
                  ? 'bg-gradient-to-b from-[#6D28D9] via-[#5B21B6] to-[#2E1065] text-white shadow-floating border-2 border-[#A855F7]'
                  : 'bg-white text-[#0F1035] border border-[#E4E0F5] shadow-card'
              }`}
            >
              {mode.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#FACC15] px-4 py-1 text-xs font-extrabold text-[#0F1035] shadow-md">
                  ★ Validation professionnelle
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div
                    aria-hidden="true"
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                      mode.recommended
                        ? 'bg-white/15 text-white border border-white/25'
                        : 'bg-[#F3EFFE] text-[#6D28D9]'
                    }`}
                  >
                    {mode.icon === 'user' && <Icon name="headphones" />}
                    {mode.icon === 'cap' && <Icon name="stethoscope" />}
                    {mode.icon === 'building' && <Icon name="file-text" />}
                    {mode.icon === 'users' && <Icon name="settings" />}
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-extrabold ${
                        mode.recommended ? 'text-white' : 'text-[#0F1035]'
                      }`}
                    >
                      {mode.name}
                    </h3>
                    <p
                      className={`text-xs mt-0.5 ${
                        mode.recommended ? 'text-[#E7E8FB]/90' : 'text-[#42466B]'
                      }`}
                    >
                      {mode.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-1 pb-2 border-b border-current/10">
                  <span
                    className={`text-2xl font-extrabold ${
                      mode.recommended ? 'text-white' : 'text-[#0F1035]'
                    }`}
                  >
                    {mode.badgeLabel}
                  </span>
                  {mode.badgeSub && (
                    <span
                      className={`ml-2 text-xs font-bold ${
                        mode.recommended ? 'text-[#E7E8FB]' : 'text-[#6D28D9]'
                      }`}
                    >
                      {mode.badgeSub}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {mode.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <span
                        className={`font-extrabold ${
                          mode.recommended ? 'text-[#E7E8FB]' : 'text-[#6D28D9]'
                        }`}
                      >
                        ✓
                      </span>
                      <span className={mode.recommended ? 'text-white/95' : 'text-[#31355B]'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6">
                <a
                  href={mode.ctaHref}
                  className={`min-h-11 w-full inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
                    mode.recommended
                      ? 'bg-white text-[#5B21B6] hover:bg-[#F5F2FF] shadow-md'
                      : 'border-2 border-[#6D28D9] text-[#6D28D9] hover:bg-[#F3EFFE]'
                  }`}
                >
                  {mode.ctaLabel}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-[24px] bg-white border border-[#E4E0F5] px-6 py-5 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-3">
              <p className="text-base font-extrabold text-[#6D28D9]">
                Cadre du Hackathon #3
              </p>
              <p className="text-xs text-[#42466B]">
                Sujet 1 inspiré par le dispositif du Centre des Possibles à Nice.
              </p>
            </div>

            <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {INSTITUTIONAL_ECOSYSTEM.map((actor) => (
                <div
                  key={actor.label}
                  className="flex items-center gap-2.5 text-xs font-bold text-[#1B1B62]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3EFFE] text-base">
                    <Icon name={actor.icon} />
                  </span>
                  <span>{actor.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
