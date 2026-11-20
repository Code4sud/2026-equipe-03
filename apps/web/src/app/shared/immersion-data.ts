// ============================================================================
// Données & Modèles du Module Immersion Pro — MonBilan+
// 6 étapes du parcours d'immersion professionnelle sur le terrain
// Conforme aux 5 maquettes officielles : Étape 1 à 6
// ============================================================================

export type ImmersionCompanyStatus =
  | 'IDENTIFIED' // Entreprise identifiée
  | 'TO_CONFIRM' // Immersion possible — à confirmer
  | 'CONFIRMED'  // Accueil confirmé
  | 'PARTNER';   // Partenaire conventionné

export interface UIImmersionStep {
  number: number;
  id: string;
  label: string;
  shortDesc: string;
  icon: string;
}

export interface UIImmersionCareer {
  id: string;
  title: string;
  tagline: string;
  domain: string;
  domainTag: string;
  sectorTag: string;
  sectorColor: string;
  pageNumber: number;
  jobZone: number;
  educationLevel: string;
  shortSummary: string;
  heroImage: string;
  activitesPrincipales: string[];
  competencesMobilisees: string[];
  conditionsTravail: string[];
  perspectives: string[];
  formations: string[];
  temoignages: Array<{ author: string; role: string; quote: string }>;
  isFavorite?: boolean;
}

export interface UIPartnerCompany {
  id: string;
  name: string;
  sector: string;
  status: ImmersionCompanyStatus;
  statusLabel: string;
  statusBadgeClass: string;
  city: string;
  postalCode: string;
  distanceKm: number;
  address: string;
  contactEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  verifiedPartner: boolean;
  hasImmersionConfirmed: boolean;
  careersOffered: string[];
  headline: string;
  description: string;
  imageUrl: string;
  isFavorite?: boolean;
}

export interface UIObservationEntry {
  id: string;
  dayNumber: number;
  date: string;
  activites: string;
  liked: string;
  surprises: string;
  questions: string;
}

export interface UIImmersionProject {
  id: string;
  youngProfileId: string;
  youngName: string;
  careerId: string;
  careerTitle: string;
  careerTagline: string;
  careerImage: string;
  careerZone?: number;
  careerPage?: number;
  currentStep: number; // 1 à 6
  completedSteps: number[]; // Liste des étapes validées
  status:
    | 'DRAFT'
    | 'PREPARING'
    | 'SEARCHING'
    | 'APPLICATION_DRAFT'
    | 'APPLICATION_SENT'
    | 'COMPANY_ACCEPTED'
    | 'COMPANY_REJECTED'
    | 'IMMERSION_CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'INTERRUPTED';
  // Étape 2 : Préparation
  selectedObjectives: string[];
  customObjectives: string[];
  selectedQuestions: string[];
  customQuestions: string[];
  observationActivities?: string[];
  preparedQuestions?: string[];
  // Étape 3 : Entreprise
  selectedCompany?: UIPartnerCompany | null;
  customCompanyName?: string;
  // Étape 4 : Candidature
  applicationDraft: {
    object: string;
    body: string;
    attachedFileName?: string;
    status: 'DRAFT' | 'SENT' | 'WAITING' | 'ACCEPTED' | 'REJECTED';
    sentDate?: string;
  };
  // Étape 5 : Immersion en cours & Carnet
  immersionPeriod: {
    startDate: string;
    endDate: string;
    durationDays: number;
    daysCompleted: number;
  };
  journalEntries: UIObservationEntry[];
  // Étape 6 : Bilan
  review: {
    discovered: string;
    liked: string;
    surprises: string;
    difficulties: string;
    pursueChoice: 'YES' | 'UNDECIDED' | 'ANOTHER_TRACK' | '';
    questionsForCounselor: string;
    nextAction: string;
    isSharedWithCounselor: boolean;
    sharedAt?: string;
    counselorFeedback?: string;
  };
}

// ----------------------------------------------------------------------------
// 6 ÉTAPES OFFICIELLES DU PARCOURS (Conforme aux maquettes)
// ----------------------------------------------------------------------------
export const IMMERSION_STEPS: UIImmersionStep[] = [
  {
    number: 1,
    id: 'DISCOVERY',
    label: 'Je découvre le métier',
    shortDesc: 'Explorer les métiers et choisir une piste',
    icon: 'glasses'
  },
  {
    number: 2,
    id: 'PREPARATION',
    label: 'Je prépare mon immersion',
    shortDesc: 'Objectifs, questions & kit d’immersion',
    icon: 'calendar'
  },
  {
    number: 3,
    id: 'COMPANY',
    label: 'Je trouve une entreprise',
    shortDesc: 'Rechercher une structure dans le 06',
    icon: 'building-2'
  },
  {
    number: 4,
    id: 'APPLICATION',
    label: 'Je fais ma demande',
    shortDesc: 'Contacter l’entreprise et suivre la réponse',
    icon: 'plane'
  },
  {
    number: 5,
    id: 'JOURNAL',
    label: 'Je vis mon immersion',
    shortDesc: 'Carnet de bord sur le terrain',
    icon: 'hard-hat'
  },
  {
    number: 6,
    id: 'REVIEW',
    label: 'Je fais le bilan',
    shortDesc: 'Retour d’expérience & partage conseiller',
    icon: 'square-check'
  }
];

// ----------------------------------------------------------------------------
// CATALOGUE DES MÉTIERS — Étape 1 (Maquette 1)
// ----------------------------------------------------------------------------
export const IMMERSION_CAREERS_CATALOG: UIImmersionCareer[] = [
  {
    id: 'c-peintre-decorateur',
    title: 'Peintre décorateur',
    tagline: 'Création • Aménagement • Finition',
    domain: 'creation',
    domainTag: 'Création & Design',
    sectorTag: 'Métiers de la création',
    sectorColor: 'bg-purple-100 text-[#7C3AED]',
    pageNumber: 8,
    jobZone: 1,
    educationLevel: 'CAP à Bac Pro',
    shortSummary: 'Embellit et protège les espaces intérieurs et extérieurs en appliquant des peintures, des enduits et des effets décoratifs.',
    heroImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    activitesPrincipales: [
      'Préparer les supports (nettoyage, ponçage, enduit)',
      'Appliquer des peintures, vernis et revêtements',
      'Réaliser des effets décoratifs (patines, fresques, matières)',
      'Conseiller sur les couleurs et les finitions'
    ],
    competencesMobilisees: [
      'Sens du détail',
      'Créativité',
      'Rigueur et précision',
      'Habileté manuelle',
      'Sens de l’esthétique',
      'Travail en équipe'
    ],
    conditionsTravail: [
      'En atelier, chez des particuliers ou sur chantier',
      'Horaires généralement en journée',
      'Activité physique et travail en hauteur possible',
      'En autonomie ou en équipe'
    ],
    perspectives: [
      'Métiers accessibles dès un CAP ou Bac Pro',
      'Une demande régulière dans le bâtiment et la rénovation',
      'Des possibilités d’évolution (chef d’équipe, artisan à son compte)'
    ],
    formations: [
      'CAP Peintre applicateur de revêtements',
      'Bac Pro Aménagement et finition du bâtiment',
      'BP Métiers du plâtre et de la décoration'
    ],
    temoignages: [
      {
        author: 'Julien M.',
        role: 'Artisan décorateur à Nice',
        quote: 'Ce métier allie la technicité du bâtiment et le plaisir créatif de transformer complètement un lieu.'
      }
    ]
  },
  {
    id: 'c-graphiste',
    title: 'Graphiste',
    tagline: 'Communication • Design • Visuel',
    domain: 'creation',
    domainTag: 'Création & Design',
    sectorTag: 'Communication visuelle',
    sectorColor: 'bg-purple-100 text-[#7C3AED]',
    pageNumber: 9,
    jobZone: 2,
    educationLevel: 'Bac à Bac+3',
    shortSummary: 'Conçoit et réalise des identités visuelles, des affiches, des logos et des supports imprimés ou numériques.',
    heroImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    activitesPrincipales: [
      'Analyser le besoin et le cahier des charges du client',
      'Créer des concepts visuels, maquettes et chartes graphiques',
      'Maîtriser les logiciels de PAO (Photoshop, Illustrator, InDesign)',
      'Préparer les fichiers pour l’impression ou la mise en ligne'
    ],
    competencesMobilisees: [
      'Créativité & imagination',
      'Sens de la composition et des typographies',
      'Écoute client',
      'Culture visuelle et graphique'
    ],
    conditionsTravail: [
      'En agence de communication, en studio ou en freelance',
      'Travail sur écran et tablette graphique',
      'Horaires réguliers avec des périodes d’échéances denses'
    ],
    perspectives: [
      'Évolution vers directeur artistique ou lead designer UI',
      'Possibilité de créer son propre studio créatif'
    ],
    formations: [
      'Bac Pro Artisanat et métiers d’art option communication visuelle',
      'BTS Design graphique / DN MADE',
      'Bachelor Design de Condé Nice'
    ],
    temoignages: [
      {
        author: 'Sophie L.',
        role: 'Graphiste chez Riviera Print',
        quote: 'Voir ses créations imprimées en grand format dans les rues de Nice est une immense fierté.'
      }
    ]
  },
  {
    id: 'c-technicien-audiovisuel',
    title: 'Technicien du son',
    tagline: 'Son • Acoustique • Régie',
    domain: 'creation',
    domainTag: 'Création & Audiovisuel',
    sectorTag: 'Spectacle & Audiovisuel',
    sectorColor: 'bg-indigo-100 text-[#4F46E5]',
    pageNumber: 12,
    jobZone: 3,
    educationLevel: 'Bac à Bac+2 / BTS Audiovisuel',
    shortSummary: 'Assure la captation du son, l’installation des micros et la régie technique lors d’événements culturels, tournages ou concerts.',
    heroImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    activitesPrincipales: [
      'Installer et régler le matériel de captation et de diffusion',
      'Assurer la prise de son et le mixage live ou post-production',
      'Gérer les câblages, micros, consoles numériques et retours de scène'
    ],
    competencesMobilisees: [
      'Oreille musicale et sens acoustique',
      'Rigueur technique et gestion du stress',
      'Esprit d’équipe en direct'
    ],
    conditionsTravail: [
      'En studio, salles de spectacle ou en extérieur',
      'Horaires décalés (soirées et week-ends fréquents)'
    ],
    perspectives: [
      'Régisseur général, ingénieur du son ou chef opérateur'
    ],
    formations: [
      'Bac Pro Métiers du son et de l’image',
      'BTS Métiers de l’audiovisuel option son'
    ],
    temoignages: [
      {
        author: 'Marc V.',
        role: 'Technicien au Studio Riviera Son',
        quote: 'L’immersion sur un concert permet de comprendre immédiatement le travail d’équipe en direct.'
      }
    ]
  },
  {
    id: 'c-menuisier',
    title: 'Menuisier',
    tagline: 'Bois • Fabrication • Agencement',
    domain: 'batiment',
    domainTag: 'Bâtiment',
    sectorTag: 'Artisanat du bâtiment',
    sectorColor: 'bg-amber-100 text-[#B45309]',
    pageNumber: 11,
    jobZone: 1,
    educationLevel: 'CAP à Bac Pro',
    shortSummary: 'Conçoit, fabrique et pose des aménagements sur mesure en bois, aluminium ou matériaux composites.',
    heroImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    activitesPrincipales: [
      'Prendre des mesures et dessiner des plans d’agencement',
      'Découper, raboter, assembler les éléments de menuiserie',
      'Poser des parquets, placards, escaliers et meubles d’intérieur'
    ],
    competencesMobilisees: [
      'Précision géométrique et habileté manuelle',
      'Connaissance des essences de bois',
      'Autonomie sur chantier'
    ],
    conditionsTravail: [
      'Atelier de fabrication et déplacements sur chantiers',
      'Port de charges et travail avec machines d’usinage'
    ],
    perspectives: [
      'Artisan menuisier, conducteur de travaux d’agencement'
    ],
    formations: [
      'CAP Menuisier fabricant',
      'Bac Pro Technicien menuisier agenceur'
    ],
    temoignages: [
      {
        author: 'Antoine B.',
        role: 'Menuisier agenceur',
        quote: 'Le travail du bois demande de la patience et offre des résultats durables qu’on touche du doigt.'
      }
    ]
  },
  {
    id: 'c-electricien',
    title: 'Électricien',
    tagline: 'Installation • Maintenance • Sécurité',
    domain: 'batiment',
    domainTag: 'Bâtiment',
    sectorTag: 'Énergie & Équipement',
    sectorColor: 'bg-sky-100 text-[#0284C7]',
    pageNumber: 12,
    jobZone: 1,
    educationLevel: 'CAP à Bac Pro',
    shortSummary: 'Installe, raccorde et entretient les réseaux électriques, systèmes domotiques et énergies renouvelables.',
    heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    activitesPrincipales: [
      'Poser les chemins de câbles et tirer les conducteurs',
      'Raccorder les tableaux électriques et appareillages',
      'Mettre en service et sécuriser les installations'
    ],
    competencesMobilisees: [
      'Rigueur absolue dans les normes de sécurité',
      'Lecture de schémas électriques',
      'Méthode et logique de diagnostic'
    ],
    conditionsTravail: [
      'Chantiers neufs ou rénovation, interventions de dépannage',
      'Travail dynamique en mobilité'
    ],
    perspectives: [
      'Technicien domotique, chef de chantier ou artisan électricien'
    ],
    formations: [
      'CAP Électricien',
      'Bac Pro Métiers de l’électricité et de ses environnements connectés'
    ],
    temoignages: [
      {
        author: 'Karim D.',
        role: 'Électricien du bâtiment',
        quote: 'Le métier a beaucoup évolué avec la domotique et les bornes de recharge écologique.'
      }
    ]
  }
];

// ----------------------------------------------------------------------------
// ANNUAIRE DES 12 ENTREPRISES RÉELLES DU 06 — Étape 3 (Maquette 3)
// ----------------------------------------------------------------------------
export const IMMERSION_COMPANIES_DATA: UIPartnerCompany[] = [
  {
    id: 'comp-riviera-print',
    name: 'Riviera Print & Découpe',
    sector: 'Impression & communication visuelle',
    status: 'IDENTIFIED',
    statusLabel: 'Entreprise identifiée',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    city: 'Nice',
    postalCode: '06000',
    distanceKm: 1.1,
    address: '18 rue Lepante, 06000 Nice',
    contactEmail: 'info@rivieraprint.fr',
    contactPhone: '04 93 62 18 18',
    websiteUrl: 'https://www.rivieraprint.fr',
    verifiedPartner: true,
    hasImmersionConfirmed: false,
    careersOffered: ['Graphiste', 'Opérateur d’impression', 'Poseur d’enseignes'],
    headline: 'Atelier d’impression numérique, enseignes et covering adhésif.',
    description: 'Atelier d’impression numérique, enseignes et covering adhésif pour commerces et professionnels niçois.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    isFavorite: false
  },
  {
    id: 'comp-decors-patines',
    name: 'Atelier Décors & Patines Riviera',
    sector: 'Décoration • Peinture • Rénovation',
    status: 'TO_CONFIRM',
    statusLabel: 'Immersion possible — à confirmer',
    statusBadgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    city: 'Nice Centre (Libération)',
    postalCode: '06000',
    distanceKm: 2.0,
    address: '14 rue Vernier, 06000 Nice',
    contactEmail: 'contact@decors-riviera.fr',
    contactPhone: '04 93 88 12 40',
    websiteUrl: 'https://www.decors-riviera.fr',
    verifiedPartner: true,
    hasImmersionConfirmed: false,
    careersOffered: ['Peintre décorateur', 'Plaquiste', 'Solier'],
    headline: 'Atelier spécialisé dans les finitions décoratives, patines et peintures écologiques.',
    description: 'Atelier spécialisé dans les finitions décoratives, patines et peintures écologiques pour villas et appartements Belle Époque.',
    imageUrl: 'assets/visuals/institutions/atelier-decors.jpg',
    isFavorite: true
  },
  {
    id: 'comp-azur-batiment',
    name: 'Azur Bâtiment Décoration',
    sector: 'Peinture • Revêtement • Rénovation',
    status: 'CONFIRMED',
    statusLabel: 'Accueil confirmé',
    statusBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    city: 'Saint-Laurent-du-Var',
    postalCode: '06700',
    distanceKm: 6.8,
    address: '81 avenue Léon Bérenger, 06700 Saint-Laurent-du-Var',
    contactEmail: 'stages@azur-batiment.fr',
    contactPhone: '04 92 12 40 00',
    websiteUrl: 'https://www.azur-batiment.fr',
    verifiedPartner: true,
    hasImmersionConfirmed: true,
    careersOffered: ['Peintre décorateur', 'Plaquiste', 'Solier moquettiste'],
    headline: 'Entreprise de peinture et décoration intérieure. Accueil possible pour un stage d’observation (1 à 5 jours).',
    description: 'Entreprise de peinture et décoration intérieure. Accueil possible pour un stage d’observation conventionné de 1 à 5 jours.',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    isFavorite: false
  },
  {
    id: 'comp-afpa-nice',
    name: 'AFPA Nice',
    sector: 'Formation • Transition professionnelle',
    status: 'PARTNER',
    statusLabel: 'Partenaire conventionné',
    statusBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    city: 'Nice La Plaine',
    postalCode: '06200',
    distanceKm: 4.3,
    address: 'Boulevard du Mercantour, 06200 Nice',
    contactEmail: 'contact.nice@afpa.fr',
    contactPhone: '04 93 18 30 00',
    websiteUrl: 'https://www.afpa.fr',
    verifiedPartner: true,
    hasImmersionConfirmed: true,
    careersOffered: ['Peintre décorateur', 'Plaquiste', 'Menuisier'],
    headline: 'Centre de formation référencé proposant des parcours en peinture, revêtements et décoration.',
    description: 'Centre de formation référencé proposant des plateaux techniques d’immersion en peinture, revêtements et décoration.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    isFavorite: false
  },
  {
    id: 'comp-studio-son',
    name: 'Studio Riviera Son & Acoustique',
    sector: 'Audiovisuel & Régie spectacle',
    status: 'IDENTIFIED',
    statusLabel: 'Entreprise identifiée',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    city: 'Nice Port',
    postalCode: '06300',
    distanceKm: 3.8,
    address: '8 quai des Deux-Emmanuels, 06300 Nice',
    contactEmail: 'stages@studioriviera.fr',
    contactPhone: '04 93 55 90 12',
    verifiedPartner: true,
    hasImmersionConfirmed: false,
    careersOffered: ['Technicien du son', 'Régisseur son'],
    headline: 'Enregistrement sonore, acoustique architecturale et régie spectacle.',
    description: 'Studio professionnel accueillant pour découvrir les métiers du son et les installations de spectacle vivant.',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'comp-cfa-btp',
    name: 'CFA BTP Nice Côte d’Azur',
    sector: 'Centre de formation d’apprentis',
    status: 'PARTNER',
    statusLabel: 'Partenaire conventionné',
    statusBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    city: 'Carros',
    postalCode: '06510',
    distanceKm: 6.2,
    address: '1ère Avenue, Z.I. Carros (06)',
    contactEmail: 'contact.btp06@cfa-paca.fr',
    contactPhone: '04 92 08 20 80',
    verifiedPartner: true,
    hasImmersionConfirmed: true,
    careersOffered: ['Peintre décorateur', 'Électricien', 'Plaquiste'],
    headline: 'Plateaux d’immersion pratique et ateliers "Mercredis de l’Apprentissage".',
    description: 'Ateliers équipés pour tester concrètement le métier de peintre décorateur avec des formateurs compagnons.',
    imageUrl: 'assets/visuals/institutions/cfa-btp.jpg'
  },
  {
    id: 'comp-lycee-vauban',
    name: 'Lycée des Métiers Vauban',
    sector: 'Établissement public de formation',
    status: 'PARTNER',
    statusLabel: 'Partenaire conventionné',
    statusBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    city: 'Nice',
    postalCode: '06300',
    distanceKm: 4.8,
    address: '25 rue Vauban, 06300 Nice',
    contactEmail: 'ce.0060032j@ac-nice.fr',
    contactPhone: '04 93 89 22 44',
    verifiedPartner: true,
    hasImmersionConfirmed: true,
    careersOffered: ['Peintre décorateur', 'Menuisier agenceur'],
    headline: 'Stages de découverte en atelier de finition du bâtiment.',
    description: 'Immersion scolaire conventionnée en ateliers de peinture et décors muraux.',
    imageUrl: 'assets/visuals/institutions/lycee-vauban.jpg'
  },
  {
    id: 'comp-decor-azur',
    name: 'Décor & Couleurs Azur',
    sector: 'Peinture intérieure & Finitions',
    status: 'TO_CONFIRM',
    statusLabel: 'Immersion possible — à confirmer',
    statusBadgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    city: 'Nice Riquier',
    postalCode: '06300',
    distanceKm: 3.2,
    address: '38 rue Arson, 06300 Nice',
    contactEmail: 'contact@decor-couleurs-azur.fr',
    contactPhone: '04 93 55 41 20',
    verifiedPartner: true,
    hasImmersionConfirmed: false,
    careersOffered: ['Peintre décorateur', 'Solier'],
    headline: 'Entreprise artisanale de rénovation intérieure et pose de revêtements.',
    description: 'Équipe de compagnons peintres acceptant d’examiner des demandes d’immersion d’observation.',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'comp-azur-tech',
    name: 'Azur Tech Prototypage & 3D',
    sector: 'Conception 3D & Design produit',
    status: 'IDENTIFIED',
    statusLabel: 'Entreprise identifiée',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    city: 'Nice Arénas',
    postalCode: '06200',
    distanceKm: 5.4,
    address: '455 Promenade des Anglais, 06200 Nice',
    contactEmail: 'contact@azurtech-3d.fr',
    contactPhone: '04 92 29 88 50',
    verifiedPartner: true,
    hasImmersionConfirmed: false,
    careersOffered: ['Modélisateur 3D', 'Graphiste'],
    headline: 'Atelier de fabrication numérique et impression 3D.',
    description: 'Bureau d’études et atelier de prototypage rapide pour le design et l’industrie.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'comp-ecole-conde',
    name: 'École de Condé Nice',
    sector: 'Enseignement supérieur Design',
    status: 'PARTNER',
    statusLabel: 'Partenaire conventionné',
    statusBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    city: 'Nice',
    postalCode: '06000',
    distanceKm: 1.5,
    address: '40 avenue Notre Dame, 06000 Nice',
    contactEmail: 'contact-nice@ecoles-conde.com',
    contactPhone: '04 93 80 50 40',
    verifiedPartner: true,
    hasImmersionConfirmed: true,
    careersOffered: ['Graphiste', 'Designer d’espace'],
    headline: 'Workshops découverte des métiers du design graphique.',
    description: 'Immersion d’une journée en atelier de création et design graphique.',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'comp-villa-arson',
    name: 'Villa Arson – Centre d’Art',
    sector: 'Institution artistique nationale',
    status: 'IDENTIFIED',
    statusLabel: 'Entreprise identifiée',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    city: 'Nice',
    postalCode: '06100',
    distanceKm: 3.7,
    address: '20 avenue Stephen Liégeard, 06105 Nice',
    contactEmail: 'contact@villa-arson.fr',
    contactPhone: '04 92 07 73 73',
    verifiedPartner: true,
    hasImmersionConfirmed: false,
    careersOffered: ['Artiste plasticien', 'Scénographe'],
    headline: 'Visites et découverte des ateliers monumentaux d’art contemporain.',
    description: 'Centre d’art et école nationale supérieure sur la colline de Saint-Barthélémy.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'comp-mission-locale',
    name: 'Mission Locale Nice Côte d’Azur',
    sector: 'Service public d’insertion',
    status: 'PARTNER',
    statusLabel: 'Partenaire conventionné',
    statusBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    city: 'Nice',
    postalCode: '06300',
    distanceKm: 1.8,
    address: '5 rue Arson, 06300 Nice',
    contactEmail: 'contact@mlnice.org',
    contactPhone: '04 93 89 68 00',
    verifiedPartner: true,
    hasImmersionConfirmed: true,
    careersOffered: ['Conseiller d’orientation', 'Médiateur'],
    headline: 'Délivrance de conventions de stage PMSMP gratuites et sécurisées.',
    description: 'Accompagne les jeunes de 16 à 25 ans dans leurs démarches d’immersion en entreprise.',
    imageUrl: 'assets/visuals/institutions/mission-locale.jpg'
  }
];

// ----------------------------------------------------------------------------
// PROJET IMMERSION INITIAL POUR EMMA D. (Dossier Rdv 2187)
// Conforme à la maquette : Étape 2 en cours par défaut
// ----------------------------------------------------------------------------
export const INITIAL_IMMERSION_PROJECT: UIImmersionProject = {
  id: 'imm-emma-2187',
  youngProfileId: 'dddd1111-1111-4111-8111-111111111111',
  youngName: 'Emma D.',
  careerId: 'c-peintre-decorateur',
  careerTitle: 'Peintre décorateur',
  careerTagline: 'Création • Aménagement • Finition',
  careerImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
  currentStep: 2,
  completedSteps: [1],
  status: 'PREPARING',
  selectedCompany: IMMERSION_COMPANIES_DATA[1], // Atelier Décors & Patines Riviera
  selectedObjectives: [
    'Observer les techniques de préparation et d’application.',
    'Découvrir l’organisation et les conditions de travail.'
  ],
  customObjectives: [],
  selectedQuestions: [
    'Quelles sont les étapes clés d’un chantier ?',
    'Quels outils et matériaux utilisez-vous ?'
  ],
  customQuestions: [],
  applicationDraft: {
    object: 'Demande de stage d’observation — Peintre décorateur',
    body: `Bonjour,\n\nJe m'appelle Emma D. et je suis actuellement accompagnée par le Centre des Possibles au Hub de l'Innovation à Nice.\n\nDans le cadre de mon projet d'orientation, je souhaite découvrir le métier de Peintre décorateur au sein de votre atelier. J'aimerais observer vos activités, les techniques utilisées et échanger avec votre équipe sur les compétences du métier.\n\nSerait-il possible de m'accueillir pour un stage d'observation de 3 jours ?\n\nMerci par avance pour votre retour.\nCordialement,\nEmma D.`,
    attachedFileName: 'CV_Emma_D.pdf',
    status: 'DRAFT',
    sentDate: '18 nov. 2026'
  },
  immersionPeriod: {
    startDate: 'Lun. 24 nov. 2026',
    endDate: 'Mer. 26 nov. 2026',
    durationDays: 3,
    daysCompleted: 1
  },
  journalEntries: [],
  review: {
    discovered: '',
    liked: '',
    surprises: '',
    difficulties: '',
    pursueChoice: '',
    questionsForCounselor: '',
    nextAction: '',
    isSharedWithCounselor: false
  }
};

export const PARTNER_COMPANIES_DATA = IMMERSION_COMPANIES_DATA;

export function getDefaultActivitiesForCareer(careerTitle: string): string[] {
  const norm = (careerTitle || '').toLowerCase();
  if (norm.includes('peintre') || norm.includes('décorateur')) {
    return [
      'Préparation des surfaces (rebouchage, ponçage, nettoyage soigné)',
      'Découverte des outils et matériaux (peintures écologiques, pigments, vernis)',
      'Observation des techniques d’application des peintures et patines',
      'Compréhension de l’organisation du travail en atelier et sur chantier',
      'Découverte des règles de sécurité et de protection'
    ];
  }
  return [
    `Découverte de la journée type d’un professionnel : ${careerTitle}`,
    'Observation des outils et équipements utilisés',
    'Compréhension des interactions d’équipe et des échanges clients',
    'Sensibilisation aux exigences professionnelles de qualité et sécurité'
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

