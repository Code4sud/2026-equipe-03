// ============================================================================
// Contenu vérifié métier de la Landing Page MonBilan+ (Refonte Premium)
// Positionnement : « Comprendre son bilan. Explorer ses possibles. Passer à l'action. »
// - Prolonge la restitution du Rapport des Possibles (audios 2 min sourcés)
// - Accompagne le jeune dans la découverte des métiers et l'action
// - Parcours autonome pour les jeunes sans bilan
// - Zéro partenariat institutionnel inventé, zéro fausse promesse, RGPD strict.
// ============================================================================

export interface TwoWayCard {
  id: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  quote: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  icon: string;
}

export interface AudioEpisodeItem {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  duration: string;
  pageRef: string;
  summary: string;
  scriptExcerpt: string;
}

export interface ActionStepItem {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  features: string[];
  icon: string;
}

export interface CounselorRoleItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StructureBenefitItem {
  id: string;
  name: string;
  role: string;
  benefits: string[];
  icon: string;
}

export interface MethodologyPillarItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// ----------------------------------------------------------------------------
// Section 2 : Deux façons de commencer
// ----------------------------------------------------------------------------
export const TWO_WAYS_START: TwoWayCard[] = [
  {
    id: 'avec-rapport',
    badge: 'Jeune accompagné',
    badgeBg: 'bg-[#EDE9FE] text-[#6D28D9]',
    badgeText: 'Jeune accompagné',
    title: 'J’ai un Rapport des Possibles',
    quote: '« Je retrouve mon bilan, je comprends mes résultats et j’avance avec mon conseiller. »',
    description:
      'Tu as réalisé un bilan au Centre des Possibles ou dans ta structure. Retrouve tes résultats sous forme d’épisodes audio clairs et prépare tes prochains rendez-vous d’orientation.',
    features: [
      '5 épisodes audio de 2 minutes vérifiés par ton conseiller',
      'Explications simples de ton profil RIASEC, aptitudes et HEXACO',
      '22 métiers d’avenir proposés et classés par zone de préparation',
      'Carnet de questions pour préparer ton prochain entretien'
    ],
    ctaLabel: 'Accéder avec mon rapport',
    ctaHref: './app/index.html',
    icon: 'clipboard-list'
  },
  {
    id: 'autonome',
    badge: 'Jeune autonome',
    badgeBg: 'bg-[#E0F2FE] text-[#0369A1]',
    badgeText: 'Jeune autonome',
    title: 'Je découvre par moi-même',
    quote: '« J’explore les métiers, mes envies et les ressources disponibles, sans bilan préalable. »',
    description:
      'Tu n’as pas encore réalisé de bilan d’orientation ? Découvre librement les métiers d’avenir, teste notre simulateur d’immersion professionnelle et trouve une aide près de chez toi.',
    features: [
      'Catalogue libre de 22 métiers d’avenir (O*NET FR & Référentiel France)',
      'Simulateur d’Immersion Pro avec entreprises partenaires du 06',
      'Entraînement aux appels et emails de stage avec le Coach IA',
      'Annuaire géolocalisé des structures d’aide (CIO, Mission Locale)'
    ],
    ctaLabel: 'Explorer librement',
    ctaHref: './app/index.html',
    icon: 'compass'
  }
];

// ----------------------------------------------------------------------------
// Section 3 : Comprendre en deux minutes (Les 5 épisodes audio)
// ----------------------------------------------------------------------------
export const AUDIO_EPISODES_PREVIEW: AudioEpisodeItem[] = [
  {
    id: 'ep-1',
    number: 1,
    title: 'Ma personnalité',
    subtitle: 'Dimensions HEXACO & style de relation',
    duration: '02:08',
    pageRef: 'Rapport des Possibles, pages 8–10',
    summary: 'Comprendre tes traits dominants, ta manière de communiquer et tes points d’appui sans aucun jugement ni étiquette.',
    scriptExcerpt: '« Ton profil met en valeur un tempérament curieux, attentif aux détails et particulièrement à l’aise lorsqu’il s’agit d’organiser un projet concret... »'
  },
  {
    id: 'ep-2',
    number: 2,
    title: 'Mes centres d’intérêt',
    subtitle: 'Profil RIASEC : Créativité & Organisation',
    duration: '02:15',
    pageRef: 'Rapport des Possibles, pages 4–6',
    summary: 'Décrypter tes affinités dominantes (Artistique, Conventionnel, Social) pour identifier les environnements de travail où tu t’épanouiras.',
    scriptExcerpt: '« Tes résultats révèlent une forte affinité pour les activités créatives alliées à un besoin d’ordre et de méthode. C’est un duo précieux dans les métiers d’art et du numérique... »'
  },
  {
    id: 'ep-3',
    number: 3,
    title: 'Mes aptitudes',
    subtitle: 'Forces cognitives & psychomotricité',
    duration: '01:54',
    pageRef: 'Rapport des Possibles, pages 11–13',
    summary: 'Mettre en lumière tes facilités de raisonnement spatial, de mémoire visuelle et de coordination technique observées lors des ateliers.',
    scriptExcerpt: '« Lors des épreuves pratiques, ta coordination motrice fine et ta visualisation dans l’espace sont ressorties parmi tes forces majeures... »'
  },
  {
    id: 'ep-4',
    number: 4,
    title: 'Mes envies et mes souhaits',
    subtitle: 'Ce qui compte vraiment pour toi',
    duration: '02:02',
    pageRef: 'Entretien de restitution & Carnet de souhaits',
    summary: 'Faire le lien entre tes aspirations personnelles exprimées lors de l’entretien et la réalité des environnements professionnels.',
    scriptExcerpt: '« Tu as souligné ton envie d’exercer une activité qui ait un résultat visible chaque jour, avec une autonomie dans ton organisation... »'
  },
  {
    id: 'ep-5',
    number: 5,
    title: 'Mes pistes professionnelles',
    subtitle: '22 métiers explorés par zone de préparation',
    duration: '02:26',
    pageRef: 'Rapport des Possibles, pages 14–17',
    summary: 'Découvrir les métiers en cohérence avec ton profil, répartis du court terme (0–6 mois) aux filières plus longues.',
    scriptExcerpt: '« Plusieurs pistes concrètes ressortent : les métiers du décor et du second œuvre, les métiers techniques du spectacle et du son, ou encore la gestion de projets culturels... »'
  }
];

// ----------------------------------------------------------------------------
// Section 4 : De la compréhension à l'action (Les 4 étapes)
// ----------------------------------------------------------------------------
export const ACTION_STEPS: ActionStepItem[] = [
  {
    number: 1,
    title: 'Je comprends',
    subtitle: 'S’approprier son bilan sans barrière',
    description:
      'J’écoute les 5 audios de 2 minutes sur mon téléphone ou mon ordinateur. Je lis la transcription synchronisée et je vérifie les renvois aux pages de mon rapport original.',
    tag: 'Audios 2 min • Sources vérifiées',
    features: ['Synthèse vocale chaleureuse', 'Références page par page', 'Lecture à son rythme'],
    icon: 'headphones'
  },
  {
    number: 2,
    title: 'J’explore',
    subtitle: 'Découvrir des métiers qui me correspondent',
    description:
      'Je navigue parmi les 22 métiers proposés dans mon bilan ou dans le catalogue ouvert. Je découvre les compétences réelles, les conditions de travail et les formations locales.',
    tag: '22 métiers • 5 zones de temps',
    features: ['Fiches détaillées illustrées', 'Formations dans le 06', 'Mise en favoris immédiate'],
    icon: 'compass'
  },
  {
    number: 3,
    title: 'Je prépare',
    subtitle: 'Garder le fil et s’entraîner',
    description:
      'Je note mes questions pour mon conseiller dans mon carnet personnel. J’utilise le Coach IA pour simuler un appel de candidature ou rédiger un email de stage percutant.',
    tag: 'Carnet de questions • Coach IA',
    features: ['Questions pour le conseiller', 'Simulateur d’appel téléphonique', 'Modèles d’emails de stage'],
    icon: 'clipboard-list'
  },
  {
    number: 4,
    title: 'J’agis',
    subtitle: 'Tester le terrain en immersion réelle',
    description:
      'Je choisis une entreprise vérifiée sur la Côte d’Azur, j’édite ma convention d’immersion professionnelle et je réalise mes premiers pas concrets dans le monde du travail.',
    tag: 'Immersion Pro • Entreprises du 06',
    features: ['Entreprises partenaires réelles', 'Convention simplifiée', 'Suivi pas-à-pas des démarches'],
    icon: 'rocket'
  }
];

// ----------------------------------------------------------------------------
// Section 5 : Un accompagnement humain (Rôle du conseiller)
// ----------------------------------------------------------------------------
export const COUNSELOR_PILLARS: CounselorRoleItem[] = [
  {
    id: 'c-verif',
    title: 'Vérifier les informations',
    description:
      'Le conseiller contrôle rigoureusement les données issues du rapport PDF et élimine toute erreur d’interprétation avant la restitution.',
    icon: 'shield-check'
  },
  {
    id: 'c-valide',
    title: 'Valider la restitution',
    description:
      'Chaque script audio est relu, corrigé et approuvé par un professionnel certifié avant d’être mis à la disposition du jeune.',
    icon: 'circle-check'
  },
  {
    id: 'c-accompagne',
    title: 'Accompagner le jeune',
    description:
      'La plateforme ne remplace jamais l’échange humain : elle sert de tremplin aux entretiens d’orientation et de base de discussion.',
    icon: 'users'
  },
  {
    id: 'c-suit',
    title: 'Suivre les éléments partagés',
    description:
      'Le conseiller accède uniquement aux questions et aux démarches que le jeune a choisi de partager volontairement.',
    icon: 'file-text'
  },
  {
    id: 'c-facilite',
    title: 'Faciliter les prochaines étapes',
    description:
      'Aider le jeune à transformer ses réflexions en actions concrètes : choix de filière, candidature en formation ou immersion.',
    icon: 'route'
  }
];

// ----------------------------------------------------------------------------
// Section 6 : Pour les structures
// ----------------------------------------------------------------------------
export const STRUCTURES_BENEFITS: StructureBenefitItem[] = [
  {
    id: 'centre-possibles',
    name: 'Centre des Possibles',
    role: 'Prolonger l’impact de l’évaluation',
    benefits: [
      'Garantir que le jeune retient l’essentiel après l’entretien de 15 minutes',
      'Fournir un support accessible, pérenne et réécoutable avec sa famille',
      'Conserver une fidélité documentaire stricte aux 17 pages du rapport'
    ],
    icon: 'sparkles'
  },
  {
    id: 'structures-orientation',
    name: 'Structures d’orientation & d’insertion',
    role: 'Missions Locales, CIO, France Travail',
    benefits: [
      'Faciliter le premier échange grâce aux questions préparées par le jeune',
      'Disposer d’un outil pratique pour formaliser les démarches d’immersion',
      'Assurer la traçabilité des étapes sans alourdir la charge administrative'
    ],
    icon: 'building'
  },
  {
    id: 'collectivites',
    name: 'Collectivités territoriales',
    role: 'Région Sud, Métropoles & Départements',
    benefits: [
      'Valoriser les filières d’avenir et les métiers en tension du territoire azuréen',
      'Rapprocher les jeunes des entreprises et artisans locaux (Sophia, Nice, Cannes)',
      'Respecter les standards de souveraineté numérique et d’accessibilité WCAG AA'
    ],
    icon: 'landmark'
  },
  {
    id: 'organismes-formation',
    name: 'Organismes de formation',
    role: 'CFA, Lycées Professionnels, Universités',
    benefits: [
      'Rendre visibles les parcours de formation adaptés aux métiers du bilan',
      'Accueillir des candidats motivés ayant mûri leur projet d’orientation',
      'Faciliter la mise en relation avec des tuteurs et maîtres d’apprentissage'
    ],
    icon: 'graduation-cap'
  }
];

// ----------------------------------------------------------------------------
// Section 8 : Méthodologie et confidentialité
// ----------------------------------------------------------------------------
export const METHODOLOGY_PILLARS: MethodologyPillarItem[] = [
  {
    id: 'm-fidelite',
    title: 'Fidélité au rapport original',
    description:
      'Chaque fait restitué (RIASEC, HEXACO, aptitudes) renvoie précisément à la page correspondante du Rapport des Possibles (p. 1 à 17). Aucune affirmation n’est inventée.',
    icon: 'folder'
  },
  {
    id: 'm-validation',
    title: 'Validation humaine obligatoire',
    description:
      'Aucun audio ni synthèse n’est publié sans la vérification préalable et la signature d’un conseiller ou psychologue d’orientation.',
    icon: 'users'
  },
  {
    id: 'm-scores',
    title: 'Absence de nouveaux scores',
    description:
      'MonBilan+ n’administre aucun test et ne recalcule aucun score psychométrique. La plateforme se concentre sur l’explication pédagogique des résultats déjà établis.',
    icon: 'chart-column'
  },
  {
    id: 'm-reserves',
    title: 'Réserves méthodologiques affichées',
    description:
      'Un bilan est une photographie à un instant T et ne résume jamais une personne. Ces résultats constituent des repères de discussion et non une trajectoire figée.',
    icon: 'info'
  },
  {
    id: 'm-rgpd',
    title: 'Confidentialité & RGPD strict',
    description:
      'Minimisation des données, pseudonymisation des dossiers, hébergement local souverain et contrôle strict des accès : les données du jeune lui appartiennent.',
    icon: 'shield'
  },
  {
    id: 'm-tenancy',
    title: 'Cloisonnement multi-établissements',
    description:
      'Chaque structure bénéficie d’un environnement étanche garanti par la politique PostgreSQL Row-Level Security (RLS) : aucune fuite de données inter-structures.',
    icon: 'lock'
  }
];

// ----------------------------------------------------------------------------
// Section 9 : FAQ (Les 7 questions officielles demandées)
// ----------------------------------------------------------------------------
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'À qui s’adresse MonBilan+ ?',
    answer:
      'MonBilan+ s’adresse à tous les jeunes de 15 à 25 ans (collégiens, lycéens, étudiants, jeunes en recherche de voie ou en insertion) ainsi qu’aux professionnels de l’orientation (conseillers du Centre des Possibles, CIO, Missions Locales, établissements scolaires). La plateforme propose deux entrées adaptées : un parcours avec rapport pour comprendre son bilan, et un parcours autonome pour explorer librement les métiers.'
  },
  {
    id: 'faq-2',
    question: 'Dois-je avoir un Rapport des Possibles ?',
    answer:
      'Non, ce n’est pas obligatoire. Si tu as déjà passé un bilan au Centre des Possibles, MonBilan+ te permet de retrouver ton rapport, d’écouter tes audios personnalisés et de préparer tes rendez-vous. Si tu n’en as pas, le parcours autonome te donne accès à l’ensemble du catalogue des 22 métiers d’avenir, au simulateur d’immersion professionnelle et à l’annuaire des structures d’aide.'
  },
  {
    id: 'faq-3',
    question: 'Comment fonctionnent les audios de deux minutes ?',
    answer:
      'Les audios de 2 minutes sont des synthèses vocales pédagogiques conçues à partir des extractions exactes de ton Rapport des Possibles (personnalité, intérêts RIASEC, aptitudes, envies, pistes métiers). Chaque script est relu, corrigé et validé par ton conseiller avant d’être généré. Tu peux les écouter à tout moment, lire la transcription écrite synchronisée et retrouver le numéro de page d’origine.'
  },
  {
    id: 'faq-4',
    question: 'Qui valide mes résultats ?',
    answer:
      'C’est un professionnel de l’orientation (psychologue du travail, conseiller d’orientation) qui contrôle les informations extraites et valide la restitution avant sa publication. L’intelligence artificielle intervient uniquement comme outil d’assistance à la mise en forme et à la synthèse vocale, sous le contrôle absolu du conseiller.'
  },
  {
    id: 'faq-5',
    question: 'Puis-je utiliser MonBilan+ sans conseiller ?',
    answer:
      'Oui, via le mode « Je découvre par moi-même ». Tu peux explorer les métiers d’avenir, consulter les fiches détaillées, t’entraîner avec le Coach IA pour préparer un email de stage, et trouver les coordonnées du CIO ou de la Mission Locale la plus proche lorsque tu souhaiteras rencontrer un professionnel.'
  },
  {
    id: 'faq-6',
    question: 'Mes données sont-elles protégées ?',
    answer:
      'Oui, de façon très stricte. MonBilan+ applique le Règlement Général sur la Protection des Données (RGPD). Les dossiers sont pseudonymisés (code Rdv), aucune donnée personnelle n’est revendue ni utilisée pour entraîner des modèles publics, et l’architecture PostgreSQL intègre une sécurité au niveau des lignes (Row-Level Security) pour isoler rigoureusement chaque structure.'
  },
  {
    id: 'faq-7',
    question: 'Comment fonctionne la démonstration ?',
    answer:
      'La démonstration officielle du Hackathon Azuréen #3 est accessible immédiatement sans création de compte via le bouton « Découvrir la démonstration ». Elle s’appuie sur un dossier fictif certifié (Emma Dubois, Rdv 2187) et permet de tester en conditions réelles l’écoute audio, la consultation du bilan, l’Espace Conseiller et le simulateur d’immersion.'
  }
];

