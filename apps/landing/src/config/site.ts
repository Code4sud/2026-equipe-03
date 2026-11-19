// ============================================================================
// Configuration du site MonBilan+ (Navigation, URLs, Positionnement officiel)
// ============================================================================

import { NavItem } from '@/types/landing';

export const SITE_CONFIG = {
  name: 'MonBilan+',
  tagline: 'Orientation • Parcours • Employabilité',
  valueProposition: "Ton bilan d'orientation, enfin facile à comprendre.",
  signature: 'Comprends ton bilan. Explore tes possibles.',
  description:
    "MonBilan+ transforme ton rapport d'orientation en une expérience audio et interactive, avec des explications simples, des sources vérifiables et des pistes à explorer avec ton conseiller.",
  professionalValidationNotice:
    'Les restitutions sont vérifiées et validées par un professionnel avant d’être mises à disposition du jeune.',
  demoAppUrl: './app/index.html',
  counselorAppUrl: './app/index.html#counselor',
  hackathonTeamNumber: '03',
  hackathonRepoUrl: 'https://github.com/Code4sud/2026-equipe-03'
} as const;

export const MAIN_NAVIGATION: NavItem[] = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Comment ça marche ?', href: '#comment-ca-marche' },
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Pour qui ?', href: '#pour-qui' },
  { label: 'Démonstration', href: '#demo-interactive' },
  { label: 'Bénéfices', href: '#impact' },
  { label: 'Cadre & Partenaires', href: '#cadre-projet' },
  { label: 'FAQ', href: '#faq' }
];
