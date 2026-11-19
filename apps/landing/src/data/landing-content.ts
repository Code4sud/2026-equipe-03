// ============================================================================
// Contenu vérifié métier de la Landing Page MonBilan+ (Rectification Sujet 1)
// - Fidèle au Rapport des Possibles Rdv 2187 (17 pages, 22 métiers, 5 zones)
// - MonBilan+ intervient APRÈS la production du rapport par le Centre des Possibles
// - Zéro statistique non démontrée, zéro modèle commercial inventé,
//   zéro promesse de passation de test ou de diagnostic psychologique.
// ============================================================================

import {
  AudienceCardItem,
  DeploymentModeCard,
  EcosystemBenefitCard,
  FaqItem,
  FeatureItem,
  HeroPillar,
  HowItWorksStep,
  ImpactMetricItem
} from '@/types/landing';

export const HERO_PILLARS: HeroPillar[] = [
  {
    id: 'restitution-audio',
    title: 'Restitution audio & texte',
    description: 'Écoute l’essentiel de ton rapport validé par ton conseiller et lis la transcription accessible.',
    icon: 'target'
  },
  {
    id: 'metiers-proposes',
    title: 'Métiers proposés dans ton bilan',
    description: 'Explore les métiers présents dans ton rapport d’orientation, répartis sur 5 zones de préparation.',
    icon: 'compass'
  },
  {
    id: 'references-sources',
    title: 'Sources vérifiables (p. 1 à 17)',
    description: 'Chaque explication sur tes résultats RIASEC, aptitudes et HEXACO renvoie à la page du document original.',
    icon: 'route'
  },
  {
    id: 'preparation-echange',
    title: 'Carnet de questions',
    description: 'Conserve tes découvertes et prépare tes prochaines questions pour ton conseiller d’orientation.',
    icon: 'bolt'
  }
];

export const AUDIENCE_CARDS: AudienceCardItem[] = [
  {
    id: 'lyceens',
    title: 'Collégiens & Lycéens',
    description: 'Comprendre et retenir son Rapport des Possibles après son rendez-vous au Centre.',
    icon: 'cap',
    href: './app/index.html'
  },
  {
    id: 'etudiants',
    title: 'Étudiants',
    description: 'Explorer les pistes de métiers présentes dans son bilan selon le temps de préparation souhaité.',
    icon: 'users',
    href: './app/index.html'
  },
  {
    id: 'insertion',
    title: 'Jeunes en insertion (15–25 ans)',
    description: 'S’approprier ses résultats grâce à une restitution vocale claire, sans barrière de l’écrit.',
    icon: 'briefcase',
    href: './app/index.html'
  }
];

// Section §3.B — Les 4 étapes exactes du parcours
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: 1,
    title: 'Ton bilan est réalisé',
    description:
      'Le Centre des Possibles réalise les évaluations et l’entretien d’orientation.',
    badgeText: 'Au Centre des Possibles',
    icon: 'clipboard'
  },
  {
    stepNumber: 2,
    title: 'Ton rapport est transformé',
    description:
      'MonBilan+ structure les informations du rapport et prépare une restitution pédagogique.',
    badgeText: 'Structuration sourcée',
    icon: 'chart'
  },
  {
    stepNumber: 3,
    title: 'Ton conseiller vérifie',
    description:
      'Le professionnel contrôle les informations et valide la restitution avant sa publication.',
    badgeText: 'Validation humaine',
    icon: 'briefcase'
  },
  {
    stepNumber: 4,
    title: 'Tu explores tes possibles',
    description:
      'Le jeune écoute son bilan, comprend ses résultats, découvre les métiers proposés et prépare ses prochaines questions.',
    badgeText: 'Audio & Exploration',
    icon: 'route'
  }
];

// Section §3.C — Les 8 fonctionnalités exactes relevant du Sujet 1
export const FEATURES_GRID: FeatureItem[] = [
  {
    id: 'restitution-audio-personnalisee',
    title: '1. Restitution audio personnalisée',
    description: 'Écoute une synthèse vocale claire de ton bilan, générée à partir du script validé par ton conseiller.',
    statusLabel: 'Opérationnel (Démo)',
    isOperational: true,
    icon: 'headphones',
    visualKind: 'audio'
  },
  {
    id: 'transcription-accessible',
    title: '2. Transcription accessible',
    description: 'Lis l’intégralité du texte synchronisé avec l’audio, ajuste la vitesse de lecture et navigue au clavier.',
    statusLabel: 'Opérationnel (Démo)',
    isOperational: true,
    icon: 'shield',
    visualKind: 'security'
  },
  {
    id: 'explication-resultats-existants',
    title: '3. Explication des résultats existants',
    description: 'Comprends tes dimensions RIASEC, tes aptitudes cognitives et ta personnalité HEXACO sans nouveau calcul ni diagnostic.',
    statusLabel: 'Opérationnel (Démo)',
    isOperational: true,
    icon: 'target',
    visualKind: 'bilan'
  },
  {
    id: 'references-verifiables-rapport',
    title: '4. Références vérifiables au rapport',
    description: 'Chaque affirmation personnelle affiche le numéro de page et l’extrait exact de ton Rapport des Possibles.',
    statusLabel: 'Opérationnel (Démo)',
    isOperational: true,
    icon: 'folder',
    visualKind: 'documents'
  },
  {
    id: 'exploration-metiers-proposes',
    title: '5. Exploration des métiers proposés',
    description: 'Explore les métiers proposés dans ton rapport d’orientation (22 métiers répartis sur 5 zones de préparation).',
    statusLabel: 'Opérationnel (Démo)',
    isOperational: true,
    icon: 'briefcase',
    visualKind: 'careers'
  },
  {
    id: 'carnet-de-questions',
    title: '6. Carnet de questions',
    description: 'Note tes questions au fil de ta lecture ou de ton écoute pour préparer ton prochain échange avec ton conseiller.',
    statusLabel: 'Opérationnel (Démo)',
    isOperational: true,
    icon: 'chat',
    visualKind: 'questions'
  },
  {
    id: 'conservation-des-documents',
    title: '7. Conservation des documents',
    description: 'Retrouve ton rapport d’orientation PDF original, ta synthèse écrite et tes fiches de pistes au même endroit.',
    statusLabel: 'Opérationnel (Démo)',
    isOperational: true,
    icon: 'route',
    visualKind: 'roadmap'
  },
  {
    id: 'validation-professionnelle',
    title: '8. Validation professionnelle avant publication',
    description: 'Les restitutions sont vérifiées et validées par un professionnel avant d’être mises à disposition du jeune.',
    statusLabel: 'Opérationnel (Démo)',
    isOperational: true,
    icon: 'users',
    visualKind: 'counselor'
  }
];

export const IMPACT_PILLS: { title: string; subtitle: string; icon: 'check' | 'cap' | 'briefcase' | 'leaf' }[] = [
  {
    title: 'Meilleure mémorisation',
    subtitle: 'conserver l’essentiel après l’entretien de 15 minutes',
    icon: 'check'
  },
  {
    title: 'Fidélité au rapport original',
    subtitle: 'aucune donnée ni aucun score inventés par l’IA',
    icon: 'cap'
  },
  {
    title: 'Exploration structurée',
    subtitle: 'découvrir les métiers proposés par zone de préparation',
    icon: 'briefcase'
  },
  {
    title: 'Médiation humaine préservée',
    subtitle: 'validation obligatoire par le conseiller avant publication',
    icon: 'leaf'
  }
];

// Repères structurels vérifiables issus du Rapport des Possibles 2187 (aucun KPI d'impact non démontré)
export const IMPACT_METRICS: ImpactMetricItem[] = [
  {
    id: 'pages-rapport',
    value: '17 pages',
    label: 'du Rapport des Possibles',
    sublabel: 'Structurées en explications simples, audio et références par page',
    icon: 'chart'
  },
  {
    id: 'metiers-rapport-2187',
    value: '22 métiers',
    label: 'proposés dans le bilan 2187',
    sublabel: 'Présentés dans leurs 5 zones de préparation sans classement inédit',
    icon: 'cap'
  },
  {
    id: 'zones-preparation',
    value: '5 zones',
    label: 'de temps de préparation',
    sublabel: 'De 0–6 mois (Zone 1) jusqu’aux cursus longs 4–10 ans (Zone 5)',
    icon: 'target'
  },
  {
    id: 'validation-pro',
    value: '100 %',
    label: 'validé par un professionnel',
    sublabel: 'Contrôle humain systématique avant génération audio et publication',
    icon: 'users'
  }
];

export const ECOSYSTEM_BENEFITS: EcosystemBenefitCard[] = [
  {
    id: 'jeunes',
    title: 'Pour le jeune (15–25 ans)',
    icon: 'cap',
    bullets: [
      'Retrouver son bilan dans un format audio et visuel accessible',
      'Explorer les métiers proposés dans son rapport sans jargon',
      'Noter ses questions pour préparer la suite de son parcours'
    ]
  },
  {
    id: 'conseillers',
    title: 'Pour le psychologue / conseiller',
    icon: 'users',
    bullets: [
      'Prolonger l’impact de l’entretien individuel de restitution',
      'Vérifier les données extraites et valider chaque formulation',
      'Suivre les questions préparées par le jeune entre deux échanges'
    ]
  },
  {
    id: 'structures',
    title: 'Pour les structures partenaires',
    icon: 'building',
    bullets: [
      'Respect strict de la méthodologie du Centre des Possibles',
      'Cloisonnement des dossiers par établissement (Multi-Tenant RLS)',
      'Traitement local respectueux de la confidentialité (RGPD)'
    ]
  }
];

// Section §3.G — Présentation du projet, des espaces et du cadre institutionnel (aucun tarif ni offre commerciale)
export const DEPLOYMENT_MODES: DeploymentModeCard[] = [
  {
    id: 'espace-jeune',
    name: 'Espace Jeune',
    subtitle: 'Restitution après le rendez-vous au Centre des Possibles.',
    badgeLabel: '6 rubriques',
    badgeSub: 'de consultation',
    icon: 'user',
    features: [
      'Accueil & résumé de la restitution publiée',
      'Mon bilan : RIASEC, aptitudes et HEXACO sourcés',
      'Explorer les métiers proposés (Zones 1 à 5)',
      'Mon parcours, Mes questions & Mes documents'
    ],
    ctaLabel: 'Découvrir l’Espace Jeune',
    ctaHref: './app/index.html'
  },
  {
    id: 'espace-conseiller',
    name: 'Espace Conseiller',
    subtitle: 'Supervision, contrôle des sources et publication.',
    badgeLabel: '8 rubriques',
    badgeSub: 'métier',
    recommended: true,
    icon: 'cap',
    features: [
      'Tableau de bord & gestion des Dossiers jeunes',
      'Importation de rapport PDF & Vérification des données',
      'Validation et publication (avec synthèse vocale Piper TTS)',
      'Suivi et rendez-vous, Statistiques & Paramètres'
    ],
    ctaLabel: 'Découvrir l’Espace Conseiller',
    ctaHref: './app/index.html'
  },
  {
    id: 'fidelite-rapport',
    name: 'Fidélité Documentaire',
    subtitle: 'Basé sur le Rapport des Possibles (ex. Rdv 2187).',
    badgeLabel: 'Zéro invention',
    badgeSub: 'Sources p. 1–17',
    icon: 'building',
    features: [
      'Profil RIASEC et HEXACO fidèle au document',
      'Aucun score numérique inventé sur les graphiques',
      'Présentation des 22 métiers proposés par zone',
      'Rappel systématique des réserves méthodologiques'
    ],
    ctaLabel: 'Inspecter le rapport 2187',
    ctaHref: './app/index.html'
  },
  {
    id: 'cadre-hackathon',
    name: 'Hackathon Azuréen #3',
    subtitle: 'Sujet 1 — Équipe 03 (Code4Sud).',
    badgeLabel: 'Open Source',
    badgeSub: 'Licence MIT',
    icon: 'users',
    features: [
      'Monolithe modulaire NestJS & PostgreSQL RLS',
      'Interface Angular + Landing Next.js (WCAG 2.2 AA)',
      'IA locale (Ollama / Qwen) & voix locale (Piper TTS)',
      'Aucun rapport personnel réel publié dans le dépôt'
    ],
    ctaLabel: 'Explorer la démonstration',
    ctaHref: './app/index.html'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Est-ce que MonBilan+ fait passer des tests d’orientation ?',
    answer:
      'Non. C’est le Centre des Possibles qui accueille le jeune, réalise les évaluations ludiques (intérêts professionnels RIASEC, aptitudes cognitives, personnalité HEXACO, psychomotricité), génère le Rapport des Possibles et assure l’entretien avec un psychologue du travail. MonBilan+ intervient uniquement après pour rendre ce rapport facile à comprendre, écoutable en audio et consultable dans la durée.'
  },
  {
    id: 'faq-2',
    question: 'Quel est le rôle du psychologue ou du conseiller dans MonBilan+ ?',
    answer:
      'Les restitutions sont vérifiées et validées par un professionnel avant d’être mises à disposition du jeune. Le conseiller importe le rapport, contrôle les données extraites, relit et corrige si besoin le script pédagogique, puis autorise la synthèse vocale et la publication.'
  },
  {
    id: 'faq-3',
    question: 'Comment sont présentés les métiers et les graphiques du rapport ?',
    answer:
      'MonBilan+ affiche exclusivement les métiers proposés dans le rapport d’orientation du jeune (par exemple les 22 métiers répartis sur 5 zones de préparation dans le rapport 2187), sans créer de classement inédit ni garantir une correspondance. Pour les graphiques dont les valeurs ne sont pas extractibles en texte brut, MonBilan+ fournit une explication qualitative vérifiée et renvoie à la page originale du rapport.'
  },
  {
    id: 'faq-4',
    question: 'Les résultats du bilan sont-ils définitifs ?',
    answer:
      'Non. Comme l’indiquent les pages 5 et 17 du Rapport des Possibles, les résultats proviennent de travaux expérimentaux et représentent une image à un instant T. Ils ne peuvent pas rendre compte du profil complet d’un individu et constituent des pistes de réflexion à explorer avec un conseiller.'
  }
];
