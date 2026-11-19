import React from 'react';
import { Container } from '@/components/ui/Container';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FF]">
      <SiteHeader />
      <main id="main-content" className="flex-1 py-12 lg:py-16">
        <Container className="max-w-3xl space-y-6 bg-white p-8 rounded-[28px] border border-[#E4E0F5] shadow-card">
          <h1 className="text-3xl font-extrabold text-[#0F1035]">
            Politique de confidentialité &amp; Protection des données (RGPD)
          </h1>
          <p className="text-sm text-[#42466B] leading-relaxed">
            MonBilan+ applique une approche <strong>Privacy by Design</strong> et <strong>Security by Design</strong> adaptée à la protection des jeunes de 15 à 25 ans.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-[#31355B]">
            <li>
              <strong>Données fictives :</strong> Aucune donnée personnelle réelle ni aucun Rapport des Possibles réel n’est publié dans le dépôt public ou dans la démonstration en ligne.
            </li>
            <li>
              <strong>Isolation Multi-Tenant :</strong> En environnement de production, chaque établissement est cloisonné via PostgreSQL Row-Level Security (<code>FORCE ROW LEVEL SECURITY</code>) et un contrôle d’accès par dossier attribué (ABAC).
            </li>
            <li>
              <strong>IA locale &amp; Validation humaine :</strong> La génération de synthèse (Ollama / Qwen) et la synthèse vocale (Piper TTS) sont conçues pour s’exécuter localement, avec validation obligatoire du conseiller avant publication.
            </li>
          </ul>
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
