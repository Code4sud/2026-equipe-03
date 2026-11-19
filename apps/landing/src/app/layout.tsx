import type { Metadata } from 'next';
import React from 'react';
import { SITE_CONFIG } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: 'MonBilan+ | Comprends ton bilan. Explore tes possibles. — Équipe 03',
  description: SITE_CONFIG.description,
  openGraph: {
    title: 'MonBilan+ — Restitution audio, interactive et vérifiable des Rapports des Possibles',
    description: SITE_CONFIG.description,
    locale: 'fr_FR',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Lien d'évitement clavier WCAG 2.2 AA */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus:bg-[#1B1B62] focus:px-4 focus:py-2.5 focus:text-white focus:font-bold"
        >
          Aller au contenu principal
        </a>

        {/* Bandeau commun obligatoire du Hackathon Azuréen #3 (Équipe 03) */}
        <script
          src="https://orientation.code4sud.fr/bandeau.js"
          data-equipe="03"
          defer
        ></script>

        {children}
      </body>
    </html>
  );
}
