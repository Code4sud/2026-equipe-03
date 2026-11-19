import React from 'react';
import { MAIN_NAVIGATION, SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E4E0F5] bg-[#0F1035] text-white">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          <div className="md:col-span-5 space-y-4">
            <div className="inline-block rounded-xl bg-white px-3 py-1.5">
              <img
                src="images/logo.png"
                alt="MonBilan+"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-base font-bold text-[#E7E8FB]">
              « {SITE_CONFIG.signature} »
            </p>
            <p className="text-sm text-[#E7E8FB]/80 max-w-md leading-relaxed">
              Plateforme de restitution accessible, audio et 100 % vérifiable des Rapports des Possibles. Projet réalisé par l’Équipe 03 lors du Hackathon Azuréen #3 organisé par Code4Sud à Nice.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E0349B]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {MAIN_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-[#E7E8FB]/85 hover:text-white transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E0349B]">
              Accès &amp; Conformité
            </h3>
            <ul className="space-y-2 text-sm text-[#E7E8FB]/85">
              <li>
                <a href={SITE_CONFIG.demoAppUrl} className="hover:text-white font-semibold underline">
                  Ouvrir l’application MonBilan+ (Espace Jeune &amp; Conseiller) →
                </a>
              </li>
              <li>
                <a href="./mentions-legales/" className="hover:text-white transition">
                  Mentions légales &amp; Licence MIT
                </a>
              </li>
              <li>
                <a href="./confidentialite/" className="hover:text-white transition">
                  Confidentialité, RGPD &amp; Données fictives
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.hackathonRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Dépôt GitHub Code4sud/2026-equipe-03
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#E7E8FB]/70">
          <p>
            © 2026 Équipe 03 (Bastien Ozil, Mathilde Poirier, Saidou Yaya Diallo) — Hackathon Azuréen #3.
          </p>
          <p>
            Note : Les résultats présentés dans la démonstration reposent sur un profil fictif. L’outil accompagne la médiation humaine sans poser de diagnostic.
          </p>
        </div>
      </Container>
    </footer>
  );
}
