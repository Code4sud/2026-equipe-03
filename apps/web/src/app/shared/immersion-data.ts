// ============================================================================
// Données & Modèles du Module Immersion Pro — MonBilan+
// 6 étapes du parcours d'immersion professionnelle sur le terrain
// ============================================================================

export interface UIImmersionStep {
  number: number;
  id: string;
  label: string;
  shortDesc: string;
  icon: string;
  status: 'DISCOVER' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING' | 'ACTION_REQUIRED';
}

export interface UIPartnerCompany {
  id: string;
  name: string;
  sector: string;
  city: string;
  distanceKm: number;
  address: string;
  contactEmail: string;
  contactPhone?: string;
  verifiedPartner: boolean;
  careersOffered: string[];
  description: string;
}

export interface UIImmersionProject {
  id: string;
  youngProfileId: string;
  youngName: string;
  careerId: string;
  careerTitle: string;
  careerZone: number;
  careerPage: number;
  careerImage: string;
  currentStep: number; // 1 à 6
  status:
    | 'DRAFT'
    | 'PREPARING'
    | 'SEARCHING'
    | 'APPLICATION_PENDING'
    | 'COMPANY_ACCEPTED'
    | 'ADMIN_PENDING'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED';
  selectedCompany?: UIPartnerCompany | null;
  customCompanyName?: string;
  customCompanyCity?: string;
  targetPeriod: string;
  observationActivities: string[];
  customActivities: string[];
  preparedQuestions: string[];
  customQuestions: string[];
  applicationDraft: {
    object: string;
    body: string;
    counselorHelpRequested: boolean;
    status: 'DRAFT' | 'READY' | 'SENT' | 'ACCEPTED' | 'REJECTED';
    sentDate?: string;
  };
  journalEntries: Array<{
    id: string;
    dayNumber: number;
    date: string;
    discovered: string;
    surprised: string;
    question: string;
  }>;
  review: {
    discoveredSynthesis: string;
    liked: string;
    disliked: string;
    surprises: string;
    wantToPursue: boolean;
    questionsForCounselor: string;
    isSharedWithCounselor: boolean;
    counselorNotes?: string;
  };
}

export const IMMERSION_STEPS: UIImmersionStep[] = [
  {
    number: 1,
    id: 'DISCOVERY',
    label: 'Je découvre le métier',
    shortDesc: 'Explorer les 22 métiers de mon bilan',
    icon: 'binoculars',
    status: 'COMPLETED'
  },
  {
    number: 2,
    id: 'PREPARATION',
    label: 'Je prépare mon immersion',
    shortDesc: 'Activités, questions & kit d’immersion',
    icon: 'calendar',
    status: 'IN_PROGRESS'
  },
  {
    number: 3,
    id: 'COMPANY',
    label: 'Je trouve une entreprise',
    shortDesc: 'Partenaires vérifiés & ajout libre',
    icon: 'building',
    status: 'DISCOVER'
  },
  {
    number: 4,
    id: 'APPLICATION',
    label: 'Je fais ma demande',
    shortDesc: 'Assistant de candidature & brouillon',
    icon: 'send',
    status: 'DISCOVER'
  },
  {
    number: 5,
    id: 'JOURNAL',
    label: 'Je vis mon immersion',
    shortDesc: 'Carnet d’observation sur le terrain',
    icon: 'hard-hat',
    status: 'DISCOVER'
  },
  {
    number: 6,
    id: 'REVIEW',
    label: 'Je fais le bilan',
    shortDesc: 'Retour d’expérience & synthèse partagée',
    icon: 'check-square',
    status: 'DISCOVER'
  }
];

export const PARTNER_COMPANIES_DATA: UIPartnerCompany[] = [
  {
    id: 'comp-nice-1',
    name: 'Atelier Décors & Patines Riviera',
    sector: 'Artisanat d’art, Peinture & Rénovation',
    city: 'Nice Centre (Libération)',
    distanceKm: 2,
    address: '14 rue Vernier, 06000 Nice',
    contactEmail: 'contact@decors-riviera.fr',
    contactPhone: '04 93 88 12 40',
    verifiedPartner: true,
    careersOffered: ['Peintre décorateur', 'Plaquiste'],
    description: 'Atelier artisanal spécialisé dans les finitions décoratives, patines, peintures écologiques et restauration de boiseries d’époque.'
  },
  {
    id: 'comp-nice-2',
    name: 'Studio Riviera Son & Acoustique',
    sector: 'Audiovisuel & Régie du spectacle vivant',
    city: 'Nice Port',
    distanceKm: 4,
    address: '8 quai des Deux-Emmanuels, 06300 Nice',
    contactEmail: 'stages@studioriviera.fr',
    contactPhone: '04 93 55 90 12',
    verifiedPartner: true,
    careersOffered: ['Technicien du son', 'Régisseur son'],
    description: 'Structure d’enregistrement, mastering et sonorisation d’événements culturels et concerts en Région Sud.'
  },
  {
    id: 'comp-nice-3',
    name: 'Café Fika & Torréfaction Artisanale',
    sector: 'Caféterie spécialisée & Accueil',
    city: 'Vieux-Nice',
    distanceKm: 3,
    address: '5 rue de la Préfecture, 06300 Nice',
    contactEmail: 'bonjour@cafefika-nice.fr',
    contactPhone: '04 93 62 10 05',
    verifiedPartner: true,
    careersOffered: ['Barista', 'Cuisinier en restauration rapide'],
    description: 'Coffee shop artisanal engagé dans le sourcing équitable de cafés fins, extraction barista et petite restauration saine.'
  },
  {
    id: 'comp-nice-4',
    name: 'Azur Découverte & Médiation Patrimoine',
    sector: 'Tourisme, Culture & Animation territoriale',
    city: 'Nice (Promenade des Anglais)',
    distanceKm: 3,
    address: '22 Promenade des Anglais, 06000 Nice',
    contactEmail: 'mediation@azur-decouverte.org',
    contactPhone: '04 92 14 46 10',
    verifiedPartner: true,
    careersOffered: ['Guide touristique', 'Agent d’escale ferroviaire'],
    description: 'Association de valorisation culturelle de la Baie des Anges et du patrimoine historique niçois pour tous les publics.'
  },
  {
    id: 'comp-nice-5',
    name: 'Métallerie & Agencement Azuréen',
    sector: 'Bâtiment, Métallerie & Aménagement',
    city: 'Nice Saint-Isidore',
    distanceKm: 8,
    address: 'Z.I. Saint-Isidore, 06200 Nice',
    contactEmail: 'contact@metallerie-azureenne.fr',
    contactPhone: '04 93 29 80 15',
    verifiedPartner: true,
    careersOffered: ['Plaquiste', 'Ouvrier agricole'],
    description: 'PME locale concevant des structures métalliques, cloisons modulaires et verrières pour l’habitat et le commerce.'
  }
];

export function getDefaultActivitiesForCareer(careerTitle: string): string[] {
  const norm = (careerTitle || '').toLowerCase();
  if (norm.includes('peintre') || norm.includes('décorateur')) {
    return [
      'Préparation des surfaces (rebouchage, ponçage, nettoyage soigné)',
      'Découverte des outils (rouleaux, pinceaux à rechampir, couteaux à enduire) et matériaux',
      'Observation des techniques d’application des peintures et effets de matière',
      'Compréhension de l’organisation du travail en atelier et sur chantier',
      'Découverte des règles de sécurité, ventilation et protection des sols'
    ];
  }
  if (norm.includes('son') || norm.includes('technicien')) {
    return [
      'Câblage, branchement et vérification de la chaîne son (micros, D.I., enceintes)',
      'Observation de la balance acoustique des instruments et réglages des retours',
      'Découverte de la console numérique (égalisation, dynamique, départs d’effets)',
      'Sensibilisation aux seuils de décibels et protection du système auditif',
      'Coordination avec les régisseurs de lumière et les artistes'
    ];
  }
  if (norm.includes('barista') || norm.includes('restauration') || norm.includes('café')) {
    return [
      'Calibrage du moulin selon l’humidité et extraction des espressos',
      'Techniques de texturation du lait à la buse vapeur et principes du latte art',
      'Application rigoureuse des règles d’hygiène alimentaire (normes HACCP)',
      'Observation de la gestion des commandes en période de pointe',
      'Entretien quotidien des filtres et détartrage du groupe thermique'
    ];
  }
  if (norm.includes('guide') || norm.includes('touristique')) {
    return [
      'Préparation de la feuille de route et vérification des autorisations d’accès',
      'Accueil bienveillant d’un groupe et annonce du déroulé de la visite',
      'Observation de l’élocution, du rythme et de la gestuelle face au public',
      'Gestion des imprévus (retardataires, météo, questions inattendues)',
      'Découverte des fiches de documentation historique et patrimoniale'
    ];
  }
  return [
    `Découverte de la journée type d’un professionnel dans le domaine : ${careerTitle}`,
    'Observation des outils, logiciels spécialisés et équipements utilisés',
    'Compréhension des interactions d’équipe et des échanges avec les clients',
    'Sensibilisation aux exigences professionnelles de qualité et de sécurité',
    'Échange sur les voies d’accès au métier et les réalités du secteur'
  ];
}

export function getDefaultQuestionsForCareer(careerTitle: string): string[] {
  return [
    `À quoi ressemble concrètement une journée habituelle de travail dans le métier de ${careerTitle} ?`,
    'Qu’est-ce qui te plaît et te motive le plus dans ton quotidien ?',
    'Quelles sont les qualités ou compétences les plus indispensables selon toi ?',
    'Comment as-tu appris ce métier ? Quel diplôme ou formation conseilles-tu ?',
    'Quel conseil donnerais-tu à un jeune qui débute et souhaite s’orienter dans cette voie ?'
  ];
}

export const INITIAL_IMMERSION_PROJECT: UIImmersionProject = {
  id: 'imm-emma-2187',
  youngProfileId: 'dddd1111-1111-4111-8111-111111111111',
  youngName: 'Emma D.',
  careerId: 'c-z1-1',
  careerTitle: 'Peintre décorateur',
  careerZone: 1,
  careerPage: 8,
  careerImage: 'assets/visuals/career-peintre.png',
  currentStep: 2, // Conforme à la maquette : Étape 2 en cours
  status: 'PREPARING',
  selectedCompany: PARTNER_COMPANIES_DATA[0],
  targetPeriod: 'Stage d’observation de 3 jours (vacances d’automne)',
  observationActivities: [
    'Préparation des surfaces (rebouchage, ponçage, nettoyage soigné)',
    'Découverte des outils et matériaux (peintures écologiques, pigments, vernis)',
    'Observation des techniques d’application des peintures et patines',
    'Compréhension de l’organisation du travail en atelier et sur chantier',
    'Découverte des règles de sécurité et de protection'
  ],
  customActivities: [],
  preparedQuestions: [
    'À quoi ressemble une journée type d’un peintre décorateur en atelier ?',
    'Qu’est-ce qui vous plaît le plus dans la création de patines et décors ?',
    'Quelles compétences manuelles ou artistiques sont les plus importantes ?',
    'Comment s’est déroulé votre parcours d’apprentissage ?',
    'Quel conseil donneriez-vous à un jeune de 16 ans qui commence ?'
  ],
  customQuestions: [
    'Est-il possible d’apprendre ce métier en alternance à Nice dès le niveau CAP ?'
  ],
  applicationDraft: {
    object: 'Demande de stage d’observation — Peintre décorateur',
    body: `Bonjour,\n\nJe m'appelle Emma D. et je suis actuellement accompagnée par le Centre des Possibles au Hub de l'Innovation à Nice.\n\nDans le cadre de mon projet d'orientation, je souhaite découvrir le métier de Peintre décorateur sur le terrain. J'admire la qualité des finitions et le savoir-faire de votre atelier.\n\nSerait-il possible de m'accueillir pour un stage d'observation conventionné de 3 jours pendant les vacances scolaires ?\n\nJe reste à votre disposition pour vous présenter ma motivation et ma convention de stage.\n\nBien cordialement,\nEmma D. (Dossier Rdv 2187)`,
    counselorHelpRequested: true,
    status: 'DRAFT'
  },
  journalEntries: [
    {
      id: 'j-1',
      dayNumber: 1,
      date: 'Jour 1',
      discovered: 'La préparation minutieuse du bois ancien avec les sous-couches naturelles et les pigments à l’eau.',
      surprised: 'La précision impressionnante pour tracer des lignes droites sans adhésif.',
      question: 'Combien de couches de vernis mat sont nécessaires pour protéger le meuble ?'
    }
  ],
  review: {
    discoveredSynthesis: 'J’ai pu observer les techniques de préparation, la création de teintes sur mesure et le vernissage.',
    liked: 'Le côté manuel créatif, le choix des harmonies de couleurs et l’ambiance d’atelier calme.',
    disliked: 'La poussière du ponçage fin au début de la matinée (même avec le masque).',
    surprises: 'Il y a beaucoup de réflexion et de chimie dans les mélanges, ce n’est pas juste peindre un mur !',
    wantToPursue: true,
    questionsForCounselor: 'Pouvez-vous m’aider à identifier les CFA et lycées professionnels qui préparent au CAP/Bac Pro Peintre applicateur de revêtements dans la Métropole Nice Côte d’Azur ?',
    isSharedWithCounselor: true,
    counselorNotes: 'Projet d’immersion très bien mené par Emma. Affinité artistique confirmée. Point d’orientation fixé pour analyser l’offre du CFA de Carros.'
  }
};
