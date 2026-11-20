// ============================================================================
// Configuration du site MonBilan+ (Navigation, URLs, Positionnement officiel)
// ============================================================================

import { NavItem } from '@/types/landing';

export const SITE_CONFIG = {
  name: 'MonBilan+',
  tagline: 'Comprendre son bilan • Explorer ses possibles • Passer à l’action',
  valueProposition: 'Ton bilan prend tout son sens. Ton avenir prend forme.',
  signature: 'Comprendre son bilan. Explorer ses possibles. Passer à l’action.',
  description:
    'MonBilan+ prolonge la restitution du Rapport des Possibles grâce à des audios pédagogiques de 2 minutes, puis accompagne le jeune dans la découverte des métiers et la préparation de ses démarches.',
  professionalValidationNotice:
    'Les restitutions sont vérifiées et validées par un professionnel avant d’être mises à disposition du jeune.',
  demoAppUrl: './app/index.html',
  counselorAppUrl: './app/index.html#counselor',
  registerAppUrl: './app/index.html',
  hackathonTeamNumber: '03',
  hackathonRepoUrl: 'https://github.com/Code4sud/2026-equipe-03'
} as const;

export const MAIN_NAVIGATION: NavItem[] = [
  { label: 'Accueil', href: '#accueil' },
  { label: '2 façons de commencer', href: '#deux-parcours' },
  { label: 'Audios 2 min', href: '#audios' },
  { label: 'De la compréhension à l’action', href: '#parcours-action' },
  { label: 'Accompagnement humain', href: '#accompagnement' },
  { label: 'Pour les structures', href: '#structures' },
  { label: 'Démonstration', href: '#demo' },
  { label: 'Méthodologie & RGPD', href: '#methodologie' },
  { label: 'FAQ', href: '#faq' }
];
