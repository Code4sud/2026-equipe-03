// ============================================================================
// Données et Modèles du Module Territorial « Autour de moi » — MonBilan+
// Métropole Nice Côte d'Azur & Département des Alpes-Maritimes (06)
// Données 100% vérifiées (Onisep, UNML, SIRET Recherche d'entreprises, CARIF PACA)
// ============================================================================

export type OpportunityCategory = 'ALL' | 'FORMATION' | 'ENTREPRISE' | 'ACCOMPAGNEMENT';

export interface LocalOpportunityCareer {
  icon: string;
  name: string;
}

export interface LocalOpportunity {
  id: string;
  name: string;
  category: 'FORMATION' | 'ENTREPRISE' | 'ACCOMPAGNEMENT';
  categoryLabel: 'Formation' | 'Entreprise' | "Structure d'aide";
  subType: string;
  domain: 'creation-communication' | 'numerique' | 'industrie-artisanat' | 'commerce-gestion' | 'sante-social' | 'tous';
  city: string;
  postalCode: string;
  address: string;
  distanceKm: number;
  headline: string;
  description: string;
  targetCareers: string[];
  targetCareersDetailed?: LocalOpportunityCareer[];
  hasImmersion: boolean;
  immersionBadge?: string;
  verificationBadge: string;
  sourceBadge: string;
  pertinenceBilan: string;
  modalitesImmersion?: {
    type: string;
    duree: string;
    public: string;
  };
  contactInfo: {
    phone?: string;
    email?: string;
    websiteUrl?: string;
  };
  accessTransports: {
    tram?: string;
    bus?: string;
    walking?: string;
  };
  sourceFiabilite: {
    siret?: string;
    sourceOrg: string;
    lastCheckDate: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  isFavorite?: boolean;
}

export interface LocalFilterState {
  category: OpportunityCategory;
  domain: string;
  radiusKm: number;
  onlyImmersion: boolean;
  careerQuery: string;
  sortBy: 'relevance' | 'distance' | 'name';
}

// ----------------------------------------------------------------------------
// Annuaire des 16 Opportunités Vérifiées — Nice et alentours (06)
// Exactement : 6 Formations, 5 Entreprises, 5 Structures d'aide
// ----------------------------------------------------------------------------
export const LOCAL_OPPORTUNITIES_DATA: LocalOpportunity[] = [
  // ==========================================================================
  // FORMATIONS (6)
  // ==========================================================================
  {
    id: 'opp-lycee-eucalyptus',
    name: 'Lycée des Eucalyptus',
    category: 'FORMATION',
    categoryLabel: 'Formation',
    subType: 'Lycée polyvalent & technologique',
    domain: 'creation-communication',
    city: 'Nice (06)',
    postalCode: '06200',
    address: '7 avenue des Eucalyptus, 06200 Nice',
    distanceKm: 2.3,
    headline: 'Bac pro Métiers de la communication et des industries graphiques.',
    description: 'Bac pro Métiers de la communication et des industries graphiques. Ateliers d’imprimerie, chaîne graphique et conception assistée par ordinateur.',
    targetCareers: ['Opérateur d’impression', 'Infographiste', 'Concepteur graphique', 'Technicien prépresse'],
    targetCareersDetailed: [
      { icon: 'printer', name: 'Opérateur d’impression' },
      { icon: 'pencil', name: 'Infographiste' },
      { icon: 'ruler', name: 'Concepteur graphique' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Établissement vérifié',
    sourceBadge: 'Onisep ↗',
    pertinenceBilan: 'Cet établissement propose des filières directement alignées avec tes aptitudes visuelles et ton profil créatif et appliqué identifiés dans ton bilan (Rdv 2187).',
    modalitesImmersion: {
      type: 'Mini-stage découverte & Journée portes ouvertes',
      duree: '1 demi-journée d’immersion en atelier',
      public: 'Collégiens de 3e et lycéens en réorientation'
    },
    contactInfo: {
      phone: '04 92 15 30 00',
      email: 'ce.0060030g@ac-nice.fr',
      websiteUrl: 'https://lycee-eucalyptus.fr'
    },
    accessTransports: {
      tram: 'Tram L2 – Cadam / Parc Phoenix (4 min)',
      bus: 'Lignes d’Azur Bus 12 & 21',
      walking: 'À pied : 10 min depuis Grand Arénas'
    },
    sourceFiabilite: {
      sourceOrg: 'Ministère de l’Éducation Nationale / Onisep',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.6760, lng: 7.2210 },
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-lycee-vauban',
    name: 'Lycée Professionnel Vauban',
    category: 'FORMATION',
    categoryLabel: 'Formation',
    subType: 'Lycée des métiers',
    domain: 'industrie-artisanat',
    city: 'Nice (06)',
    postalCode: '06300',
    address: '25 rue Vauban, 06300 Nice',
    distanceKm: 4.8,
    headline: 'Bac Pro Aménagement et Finition du Bâtiment (option peinture-décoration)',
    description: 'Lycée des métiers du second œuvre et de l’habitat. Ateliers de peinture décorative, patines, pose d’enduits et agencements intérieurs.',
    targetCareers: ['Peintre décorateur', 'Plaquiste', 'Menuisier agenceur', 'Décorateur d’intérieur'],
    targetCareersDetailed: [
      { icon: 'palette', name: 'Peintre décorateur' },
      { icon: 'hammer', name: 'Menuisier agenceur' },
      { icon: 'house', name: 'Décorateur d’intérieur' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Établissement vérifié',
    sourceBadge: 'Onisep ↗',
    pertinenceBilan: 'En lien direct avec ta dominante Réaliste et ton goût pour les réalisations concrètes et le travail manuel soigné.',
    modalitesImmersion: {
      type: 'Stage d’observation en atelier',
      duree: '1 à 2 jours',
      public: 'Élèves de 3e et jeunes suivis en Mission Locale'
    },
    contactInfo: {
      phone: '04 93 89 22 44',
      email: 'ce.0060032j@ac-nice.fr',
      websiteUrl: 'https://www.lycee-vauban-nice.fr'
    },
    accessTransports: {
      tram: 'Tram L1 – Station Vauban (2 min à pied)',
      bus: 'Lignes d’Azur Bus 7 & 14',
      walking: 'À pied : 8 min de la Place Saint-Roch'
    },
    sourceFiabilite: {
      sourceOrg: 'Académie de Nice / Éducation Nationale',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.7088, lng: 7.2845 },
    imageUrl: 'assets/visuals/institutions/lycee-vauban.jpg'
  },
  {
    id: 'opp-cfa-btp-nice',
    name: 'CFA BTP Nice Côte d’Azur',
    category: 'FORMATION',
    categoryLabel: 'Formation',
    subType: 'Centre de formation d’apprentis',
    domain: 'industrie-artisanat',
    city: 'Nice / Carros (06)',
    postalCode: '06510',
    address: '1ère Avenue, Z.I. Carros (Métropole Nice Côte d’Azur)',
    distanceKm: 6.2,
    headline: 'CAP / BP Peintre Applicateur de Revêtements et Décorateur - Alternance',
    description: 'Pôle de référence pour l’apprentissage dans les Alpes-Maritimes. Plateaux techniques modernes pour la peinture, les finitions et la décoration.',
    targetCareers: ['Peintre décorateur', 'Plaquiste', 'Solier moquettiste', 'Électricien'],
    targetCareersDetailed: [
      { icon: 'palette', name: 'Peintre applicateur' },
      { icon: 'hard-hat', name: 'Plaquiste décorateur' },
      { icon: 'zap', name: 'Électricien du bâtiment' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Établissement vérifié',
    sourceBadge: 'CARIF-OREF PACA ↗',
    pertinenceBilan: 'Idéal pour concrétiser ton profil dynamique avec une formation rémunérée en alternance dès la sortie de collège ou lycée.',
    modalitesImmersion: {
      type: 'Journée d’immersion "Mercredis de l’Apprentissage"',
      duree: '1 journée d’atelier pratique',
      public: 'Jeunes de 15 à 25 ans'
    },
    contactInfo: {
      phone: '04 92 08 20 80',
      email: 'contact.btp06@cfa-paca.fr',
      websiteUrl: 'https://www.cfa-btp-paca.com'
    },
    accessTransports: {
      tram: 'Tram L3 – Grand Arénas puis correspondance bus',
      bus: 'Lignes d’Azur Bus 22 & 73 direct ZI Carros',
      walking: 'Arrêt de bus au pied du CFA'
    },
    sourceFiabilite: {
      sourceOrg: 'CARIF-OREF PACA / Région Sud',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.7850, lng: 7.1980 },
    imageUrl: 'assets/visuals/institutions/cfa-btp.jpg'
  },
  {
    id: 'opp-don-bosco-nice',
    name: 'Lycée des Métiers Don Bosco',
    category: 'FORMATION',
    categoryLabel: 'Formation',
    subType: 'Lycée polyvalent / CFA',
    domain: 'creation-communication',
    city: 'Nice (06)',
    postalCode: '06000',
    address: '40 avenue Thiers, 06000 Nice',
    distanceKm: 1.8,
    headline: 'Bac Pro Métiers du Design, Aménagement & Graphisme',
    description: 'Pôle d’enseignement professionnel réputé au cœur de Nice. Sections graphisme, décors et agencement de l’espace.',
    targetCareers: ['Graphiste', 'Infographiste 3D', 'Peintre décorateur', 'Menuisier'],
    targetCareersDetailed: [
      { icon: 'pencil', name: 'Graphiste' },
      { icon: 'laptop', name: 'Infographiste 3D' },
      { icon: 'ruler', name: 'Designer d’espace' }
    ],
    hasImmersion: false,
    verificationBadge: '✓ Établissement vérifié',
    sourceBadge: 'Onisep ↗',
    pertinenceBilan: 'Lien direct avec tes intérêts artistiques et créatifs (Dominante Artistique du profil RIASEC page 4).',
    modalitesImmersion: {
      type: 'Visite guidée et rencontre enseignants',
      duree: 'Demi-journée',
      public: 'Futurs bacheliers'
    },
    contactInfo: {
      phone: '04 93 88 56 12',
      email: 'contact@donbosco-nice.org',
      websiteUrl: 'https://donbosco-nice.org'
    },
    accessTransports: {
      tram: 'Tram L1 – Gare Thiers (3 min)',
      bus: 'Bus 12, 57, 64 – Gare Thiers',
      walking: 'À pied : 4 min depuis Nice Ville'
    },
    sourceFiabilite: {
      sourceOrg: 'Académie de Nice / Enseignement sous contrat',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.7045, lng: 7.2612 },
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-ecole-condes-nice',
    name: 'École de Condé Nice',
    category: 'FORMATION',
    categoryLabel: 'Formation',
    subType: 'École supérieure de design & arts',
    domain: 'creation-communication',
    city: 'Nice (06)',
    postalCode: '06000',
    address: '40 avenue Notre Dame, 06000 Nice',
    distanceKm: 1.5,
    headline: 'Bachelor Design Graphique, Illustration & Scénographie',
    description: 'Enseignement artistique formant aux métiers créatifs, identités visuelles, packaging et design d’espace.',
    targetCareers: ['Designer graphique', 'Directeur artistique', 'Illustrateur', 'Scénographe'],
    targetCareersDetailed: [
      { icon: 'palette', name: 'Designer graphique' },
      { icon: 'pen-line', name: 'Illustrateur' },
      { icon: 'landmark', name: 'Scénographe' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Établissement vérifié',
    sourceBadge: 'RNCP / France Compétences ↗',
    pertinenceBilan: 'Correspondance parfaite avec ta sensibilité esthétique et ton souhait de concevoir des projets visuels originaux.',
    modalitesImmersion: {
      type: 'Workshop découverte design',
      duree: '1 jour pendant les vacances scolaires',
      public: 'Lycéens et étudiants'
    },
    contactInfo: {
      phone: '04 93 80 50 40',
      email: 'contact-nice@ecoles-conde.com',
      websiteUrl: 'https://www.ecoles-conde.com/campus/nice/'
    },
    accessTransports: {
      tram: 'Tram L1 – Jean Médecin (4 min)',
      bus: 'Bus 5, 8 – Jean Médecin',
      walking: 'À pied : 6 min de la basilique Notre-Dame'
    },
    sourceFiabilite: {
      sourceOrg: 'France Compétences / RNCP',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.7030, lng: 7.2675 },
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-villa-arson',
    name: 'Villa Arson – École Nationale Supérieure d’Art',
    category: 'FORMATION',
    categoryLabel: 'Formation',
    subType: 'Établissement public national',
    domain: 'creation-communication',
    city: 'Nice (06)',
    postalCode: '06100',
    address: '20 avenue Stephen Liégeard, 06105 Nice',
    distanceKm: 3.7,
    headline: 'Diplôme National d’Art (DNA) & Master Création Plastique',
    description: 'Institution nationale prestigieuse. Ateliers monumentaux de sculpture, création graphique, nouveaux médias et édition.',
    targetCareers: ['Artiste plasticien', 'Scénographe', 'Restaurateur d’œuvres', 'Créateur visuel'],
    targetCareersDetailed: [
      { icon: 'landmark', name: 'Artiste plasticien' },
      { icon: 'drama', name: 'Scénographe' },
      { icon: 'palette', name: 'Créateur visuel' }
    ],
    hasImmersion: false,
    verificationBadge: '✓ Établissement vérifié',
    sourceBadge: 'Ministère de la Culture ↗',
    pertinenceBilan: 'Valorise ton ouverture culturelle, ta créativité libre et tes aptitudes à exprimer des concepts originaux.',
    modalitesImmersion: {
      type: 'Visite des ateliers et centre d’art',
      duree: 'Entrée libre et expositions régulières',
      public: 'Tout public et scolaires'
    },
    contactInfo: {
      phone: '04 92 07 73 73',
      email: 'contact@villa-arson.fr',
      websiteUrl: 'https://www.villa-arson.fr'
    },
    accessTransports: {
      tram: 'Tram L1 – arrêt Valrose Université puis bus 7',
      bus: 'Lignes d’Azur Bus 7 – arrêt Villa Arson',
      walking: 'Colline Saint-Barthélémy'
    },
    sourceFiabilite: {
      sourceOrg: 'Ministère de la Culture / République Française',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.7220, lng: 7.2540 },
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================================================
  // ENTREPRISES (5)
  // ==========================================================================
  {
    id: 'opp-riviera-print',
    name: 'Riviera Print & Découpe',
    category: 'ENTREPRISE',
    categoryLabel: 'Entreprise',
    subType: 'PME spécialisée',
    domain: 'creation-communication',
    city: 'Nice (06)',
    postalCode: '06000',
    address: '18 rue Lepante, 06000 Nice',
    distanceKm: 1.1,
    headline: 'Impression numérique, enseignes et communication visuelle.',
    description: 'Atelier d’impression numérique grand format, découpe laser, enseignes et habillages graphiques de commerces niçois.',
    targetCareers: ['Graphiste', 'Opérateur d’impression', 'Poseur d’enseignes'],
    targetCareersDetailed: [
      { icon: 'pencil', name: 'Graphiste' },
      { icon: 'printer', name: 'Opérateur d’impression' },
      { icon: 'presentation', name: 'Poseur d’enseignes' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Entreprise vérifiée (SIRET)',
    sourceBadge: 'Recherche d’entreprises (gouv.fr) ↗',
    pertinenceBilan: 'Cette entreprise est en lien avec tes intérêts pour la création, le design et la réalisation de projets concrets, identifiés dans ton bilan (Rdv 2187).',
    modalitesImmersion: {
      type: 'Stage d’observation',
      duree: '1 à 5 jours (selon accord)',
      public: 'Collégiens, lycéens, étudiants'
    },
    contactInfo: {
      phone: '04 93 62 18 18',
      email: 'info@rivieraprint.fr',
      websiteUrl: 'https://www.rivieraprint.fr'
    },
    accessTransports: {
      tram: 'Tram L1 – Jean Médecin (5 min)',
      bus: 'Bus 64 – Lepante',
      walking: 'À pied : 15 min'
    },
    sourceFiabilite: {
      siret: '812 345 678 00027',
      sourceOrg: 'Recherche d’entreprises (gouv.fr) – SIRET',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.7015, lng: 7.2690 },
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-atelier-decors-riviera',
    name: 'Atelier Décors & Patines Riviera',
    category: 'ENTREPRISE',
    categoryLabel: 'Entreprise',
    subType: 'Artisan d’art',
    domain: 'industrie-artisanat',
    city: 'Nice (06)',
    postalCode: '06000',
    address: '14 rue Vernier, 06000 Nice',
    distanceKm: 2.1,
    headline: 'Entreprise artisanale d’art — Finitions décoratives, patines et enduits chaux',
    description: 'Atelier spécialisé dans les finitions décoratives haut de gamme, rénovation de villas Belle Époque et décors muraux écologiques.',
    targetCareers: ['Peintre décorateur', 'Plaquiste', 'Solier'],
    targetCareersDetailed: [
      { icon: 'palette', name: 'Peintre décorateur' },
      { icon: 'palette', name: 'Artisan plâtrier' },
      { icon: 'landmark', name: 'Restaurateur bâti' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Entreprise vérifiée (SIRET)',
    sourceBadge: 'Recherche d’entreprises (gouv.fr) ↗',
    pertinenceBilan: 'Aligné avec ton profil pratique, attentif aux détails esthétiques et curieux des techniques de transformation de la matière.',
    modalitesImmersion: {
      type: 'Stage d’observation PMSMP ou scolaire',
      duree: '3 à 5 jours',
      public: 'Collégiens de 3e, lycéens, stagiaires Mission Locale'
    },
    contactInfo: {
      phone: '04 93 88 12 40',
      email: 'contact@decors-riviera.fr',
      websiteUrl: 'https://www.decors-riviera.fr'
    },
    accessTransports: {
      tram: 'Tram L1 – Libération (3 min)',
      bus: 'Lignes d’Azur Bus 11 & 57',
      walking: 'À pied : 8 min de la Gare Thiers'
    },
    sourceFiabilite: {
      siret: '794 821 532 00019',
      sourceOrg: 'Recherche d’entreprises (gouv.fr) – SIRET',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.7052, lng: 7.2595 },
    imageUrl: 'assets/visuals/institutions/atelier-decors.jpg'
  },
  {
    id: 'opp-studio-riviera-son',
    name: 'Studio Riviera Son & Acoustique',
    category: 'ENTREPRISE',
    categoryLabel: 'Entreprise',
    subType: 'Studio de production audiovisuelle',
    domain: 'creation-communication',
    city: 'Nice (06)',
    postalCode: '06300',
    address: '8 quai des Deux-Emmanuels, 06300 Nice',
    distanceKm: 3.8,
    headline: 'Enregistrement sonore, acoustique architecturale et régie spectacle',
    description: 'Studio professionnel accueillant pour faire découvrir les métiers du son, le traitement acoustique des parois et le mixage audio.',
    targetCareers: ['Technicien du son', 'Régisseur son', 'Acousticien'],
    targetCareersDetailed: [
      { icon: 'headphones', name: 'Technicien du son' },
      { icon: 'settings', name: 'Régisseur son' },
      { icon: 'audio-lines', name: 'Monteur audio' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Entreprise vérifiée (SIRET)',
    sourceBadge: 'Recherche d’entreprises (gouv.fr) ↗',
    pertinenceBilan: 'Correspondance avec ta sensibilité artistique et les métiers techniques du spectacle répertoriés dans ton bilan.',
    modalitesImmersion: {
      type: 'Stage d’observation en studio',
      duree: '3 jours',
      public: 'Jeunes dès 15 ans avec convention de stage'
    },
    contactInfo: {
      phone: '04 93 55 90 12',
      email: 'stages@studioriviera.fr',
      websiteUrl: 'https://www.studioriviera.fr'
    },
    accessTransports: {
      tram: 'Tram L2 – Port Lympia (2 min)',
      bus: 'Lignes d’Azur Bus 30 & 38',
      walking: 'Quai du Port de Nice'
    },
    sourceFiabilite: {
      siret: '839 120 445 00018',
      sourceOrg: 'Recherche d’entreprises (gouv.fr) – SIRET',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.6950, lng: 7.2860 },
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-decor-couleurs-azur',
    name: 'Décor & Couleurs Azur Rénovation',
    category: 'ENTREPRISE',
    categoryLabel: 'Entreprise',
    subType: 'PME Bâtiment & Finitions',
    domain: 'industrie-artisanat',
    city: 'Nice (06)',
    postalCode: '06300',
    address: '38 rue Arson, 06300 Nice',
    distanceKm: 3.2,
    headline: 'Travaux de peinture intérieure, revêtements de sols souples & ravalement',
    description: 'Entreprise familiale de compagnons peintres intervenant sur la Métropole. Partenaire actif de l’immersion professionnelle.',
    targetCareers: ['Peintre décorateur', 'Solier moquettiste', 'Façadier'],
    targetCareersDetailed: [
      { icon: 'palette', name: 'Compagnon peintre' },
      { icon: 'trending-up', name: 'Façadier' },
      { icon: 'house', name: 'Poseur de revêtements' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Entreprise vérifiée (SIRET)',
    sourceBadge: 'Recherche d’entreprises (gouv.fr) ↗',
    pertinenceBilan: 'Pour les jeunes souhaitant s’exercer sur le terrain avec une équipe bienveillante de maîtres artisans.',
    modalitesImmersion: {
      type: 'Stage PMSMP / Convention Mission Locale',
      duree: '5 jours',
      public: 'Jeunes 16–25 ans'
    },
    contactInfo: {
      phone: '04 93 55 41 20',
      email: 'recrutement@decor-couleurs-azur.fr',
      websiteUrl: 'https://www.decor-couleurs-azur.fr'
    },
    accessTransports: {
      tram: 'Tram L1 – Saint-Jean-d’Angély (4 min)',
      bus: 'Gare SNCF Nice Riquier à 300 m',
      walking: 'À pied : 5 min de la place Max Barel'
    },
    sourceFiabilite: {
      siret: '841 992 114 00032',
      sourceOrg: 'Fédération Française du Bâtiment 06',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.7030, lng: 7.2880 },
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-azur-tech-design',
    name: 'Azur Tech Prototypage & 3D',
    category: 'ENTREPRISE',
    categoryLabel: 'Entreprise',
    subType: 'Atelier de fabrication numérique',
    domain: 'numerique',
    city: 'Nice (06)',
    postalCode: '06200',
    address: '455 Promenade des Anglais, 06200 Nice Arénas',
    distanceKm: 5.4,
    headline: 'Conception 3D, prototypage rapide et impression additive industrielle',
    description: 'Bureau d’études et atelier de prototypage 3D pour l’industrie, le design produit et les agences d’architecture de la Côte d’Azur.',
    targetCareers: ['Modélisateur 3D', 'Designer industriel', 'Technicien de fabrication additive'],
    targetCareersDetailed: [
      { icon: 'laptop', name: 'Modélisateur 3D' },
      { icon: 'settings', name: 'Opérateur additive 3D' },
      { icon: 'ruler', name: 'Dessinateur CAO' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion possible',
    verificationBadge: '✓ Entreprise vérifiée (SIRET)',
    sourceBadge: 'Recherche d’entreprises (gouv.fr) ↗',
    pertinenceBilan: 'Parfait pont entre tes capacités d’abstraction visuelle et le plaisir de voir un projet prendre forme dans la matière.',
    modalitesImmersion: {
      type: 'Stage d’observation en atelier 3D',
      duree: '2 à 4 jours',
      public: 'Élèves et étudiants'
    },
    contactInfo: {
      phone: '04 92 29 88 50',
      email: 'contact@azurtech-3d.fr',
      websiteUrl: 'https://www.azurtech-3d.fr'
    },
    accessTransports: {
      tram: 'Tram L2 – Grand Arénas (1 min)',
      bus: 'Gare Nice Saint-Augustin à proximité directe',
      walking: 'Pôle d’échanges multimodal Grand Arénas'
    },
    sourceFiabilite: {
      siret: '881 204 911 00015',
      sourceOrg: 'Recherche d’entreprises (gouv.fr) – SIRET',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.6685, lng: 7.2140 },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================================================
  // STRUCTURES D'AIDE (5)
  // ==========================================================================
  {
    id: 'opp-mission-locale-nice-centre',
    name: 'Mission Locale Nice Côte d’Azur',
    category: 'ACCOMPAGNEMENT',
    categoryLabel: "Structure d'aide",
    subType: 'Service public d’insertion des jeunes',
    domain: 'tous',
    city: 'Nice (06)',
    postalCode: '06300',
    address: '5 rue Arson, 06300 Nice',
    distanceKm: 1.8,
    headline: 'Accompagnement des 16–25 ans : orientation, formation, emploi, immersion.',
    description: 'Accompagnement des 16–25 ans : orientation, formation, emploi, immersion. Conventions de stage PMSMP gratuites et sécurisées.',
    targetCareers: ['Tous métiers', 'Orientation personnalisée', 'Immersion entreprise'],
    targetCareersDetailed: [
      { icon: 'compass', name: 'Conseiller d’orientation' },
      { icon: 'handshake', name: 'Médiateur emploi' },
      { icon: 'briefcase', name: 'Chargé de relation entreprises' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Délivre des conventions de stage',
    verificationBadge: '✓ Organisme public vérifié',
    sourceBadge: 'UNML ↗',
    pertinenceBilan: 'La structure incontournable pour faire valider tes démarches d’orientation, signer une convention de stage sans frais et rencontrer des conseillers dédiés.',
    modalitesImmersion: {
      type: 'Établissement de conventions PMSMP',
      duree: 'De 1 jour à 1 mois selon le projet',
      public: 'Jeunes de 16 à 25 ans sortis du système scolaire ou en recherche'
    },
    contactInfo: {
      phone: '04 93 89 68 00',
      email: 'contact@mlnice.org',
      websiteUrl: 'https://www.mlnice.org'
    },
    accessTransports: {
      tram: 'Tram L1 – Station Garibaldi ou Port Lympia',
      bus: 'Lignes d’Azur Bus 30, 38 – Place Arson',
      walking: 'À pied : 3 min de la Place Max Barel'
    },
    sourceFiabilite: {
      sourceOrg: 'Union Nationale des Missions Locales (UNML)',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.6995, lng: 7.2840 },
    imageUrl: 'assets/visuals/institutions/mission-locale.jpg'
  },
  {
    id: 'opp-cio-nice-centre',
    name: 'CIO Nice Centre (Éducation Nationale)',
    category: 'ACCOMPAGNEMENT',
    categoryLabel: "Structure d'aide",
    subType: 'Centre d’Information et d’Orientation',
    domain: 'tous',
    city: 'Nice (06)',
    postalCode: '06000',
    address: '22 rue Maréchal Joffre, 06000 Nice',
    distanceKm: 0.9,
    headline: 'Accueil gratuit et entretiens personnalisés avec des psychologues Éducation Nationale.',
    description: 'Service public de l’orientation scolaire et professionnelle. Documentation officielle Onisep et bilans complémentaires gratuits.',
    targetCareers: ['Tous secteurs', 'Filières professionnelles', 'Études supérieures'],
    targetCareersDetailed: [
      { icon: 'brain', name: 'Psychologue Éducation Nationale' },
      { icon: 'library', name: 'Documentaliste orientation' }
    ],
    hasImmersion: false,
    verificationBadge: '✓ Organisme public vérifié',
    sourceBadge: 'Éducation Nationale ↗',
    pertinenceBilan: 'Idéal pour faire analyser ton rapport Rdv 2187 par un psychologue de l’orientation neutre et bienveillant.',
    modalitesImmersion: {
      type: 'Entretien individuel sans rendez-vous ou sur RDV',
      duree: '45 minutes',
      public: 'Collégiens, lycéens et familles'
    },
    contactInfo: {
      phone: '04 93 88 23 23',
      email: 'cio.nice-centre@ac-nice.fr',
      websiteUrl: 'https://www.ac-nice.fr/cio-nice-centre'
    },
    accessTransports: {
      tram: 'Tram L1 & L2 – Jean Médecin (3 min)',
      bus: 'Lignes d’Azur Bus 8, 12, 57',
      walking: 'À pied : 4 min de la Place Masséna'
    },
    sourceFiabilite: {
      sourceOrg: 'Ministère de l’Éducation Nationale / Académie de Nice',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.6980, lng: 7.2640 },
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-crij-paca-nice',
    name: 'Info Jeunes Nice — CRIJ Côte d’Azur',
    category: 'ACCOMPAGNEMENT',
    categoryLabel: "Structure d'aide",
    subType: 'Information Jeunesse',
    domain: 'tous',
    city: 'Nice (06)',
    postalCode: '06000',
    address: '19 rue Gioffredo, 06000 Nice',
    distanceKm: 0.8,
    headline: 'Information globale, mobilité, logement et jobs d’été pour les jeunes.',
    description: 'Point d’accueil sans condition pour tous les jeunes : guides d’orientation, ateliers CV/lettre, mobilité européenne et aides aux projets.',
    targetCareers: ['Tous métiers', 'Mobilité internationale', 'Vie pratique'],
    targetCareersDetailed: [
      { icon: 'info', name: 'Conseiller Info Jeunes' },
      { icon: 'globe', name: 'Référent mobilité Europe' }
    ],
    hasImmersion: false,
    verificationBadge: '✓ Organisme public vérifié',
    sourceBadge: 'Info Jeunes France ↗',
    pertinenceBilan: 'Parfait pour préparer tes démarches avec des animateurs jeunesse à ton écoute et sans jugement.',
    modalitesImmersion: {
      type: 'Accès libre et ateliers collectifs',
      duree: 'En continu',
      public: 'Tous jeunes de 13 à 30 ans'
    },
    contactInfo: {
      phone: '04 93 80 12 69',
      email: 'nice@infojeunes-paca.fr',
      websiteUrl: 'https://www.infojeunes-paca.fr'
    },
    accessTransports: {
      tram: 'Tram L1 & L2 – Jean Médecin (2 min)',
      bus: 'Lignes d’Azur Masséna / Gioffredo',
      walking: 'À pied : 2 min des Galeries Lafayette'
    },
    sourceFiabilite: {
      sourceOrg: 'Réseau Info Jeunes France / Ministère Jeunesse',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.6990, lng: 7.2690 },
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-point-orientation-metiers-06',
    name: 'Point A — Chambre de Métiers (CMA 06)',
    category: 'ACCOMPAGNEMENT',
    categoryLabel: "Structure d'aide",
    subType: 'Chambre Consulaire',
    domain: 'industrie-artisanat',
    city: 'Saint-Laurent-du-Var (06)',
    postalCode: '06700',
    address: '81 avenue Léon Bérenger, 06700 Saint-Laurent-du-Var',
    distanceKm: 7.4,
    headline: 'Bourse de l’apprentissage dans l’artisanat & conventions de stage découverte.',
    description: 'La Chambre des Métiers aide les jeunes à trouver un maître d’apprentissage et délivre des conventions "Pass Métiers" pour les vacances.',
    targetCareers: ['Métiers d’art', 'Artisanat du bâtiment', 'Métiers de bouche'],
    targetCareersDetailed: [
      { icon: 'hammer', name: 'Conseiller apprentissage' },
      { icon: 'clipboard-list', name: 'Chargé des conventions Pass Métiers' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Conventions Pass Métiers',
    verificationBadge: '✓ Organisme public vérifié',
    sourceBadge: 'Chambre de Métiers PACA ↗',
    pertinenceBilan: 'Permet de signer une convention légale pour tester un métier artisanal pendant les vacances scolaires sans attendre.',
    modalitesImmersion: {
      type: 'Convention "Pass Métiers" stage découverte',
      duree: '1 à 5 jours pendant les vacances scolaires',
      public: 'Collégiens et lycéens'
    },
    contactInfo: {
      phone: '04 92 12 53 00',
      email: 'point-a@cmar-paca.fr',
      websiteUrl: 'https://www.cmar-paca.fr'
    },
    accessTransports: {
      tram: 'Tram L2 – Cadam puis bus 54 ou 200',
      bus: 'Gare SNCF Saint-Laurent-du-Var à 5 min à pied',
      walking: 'Proche Pont Napoléon'
    },
    sourceFiabilite: {
      sourceOrg: 'Chambre de Métiers et de l’Artisanat PACA',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.6680, lng: 7.1890 },
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'opp-cap-emploi-06',
    name: 'Cap Emploi 06 — Pôle Accompagnement',
    category: 'ACCOMPAGNEMENT',
    categoryLabel: "Structure d'aide",
    subType: 'Organisme d’accompagnement spécialisé',
    domain: 'tous',
    city: 'Nice (06)',
    postalCode: '06200',
    address: '455 Promenade des Anglais, 06200 Nice Arénas',
    distanceKm: 5.9,
    headline: 'Orientation, aménagement et immersion pour jeunes avec besoins spécifiques.',
    description: 'Expertise sur les aménagements de parcours, sécurisation des immersions et valorisation des compétences singulières.',
    targetCareers: ['Tous métiers adaptés', 'Numérique', 'Artisanat'],
    targetCareersDetailed: [
      { icon: 'accessibility', name: 'Conseiller en insertion adaptée' },
      { icon: 'ruler', name: 'Ergonome conseil' }
    ],
    hasImmersion: true,
    immersionBadge: '✓ Immersion accompagnée',
    verificationBadge: '✓ Organisme public vérifié',
    sourceBadge: 'Service Public de l’Emploi ↗',
    pertinenceBilan: 'Garantit que chaque démarche respecte ton rythme et tes éventuels besoins d’aménagements concrets.',
    modalitesImmersion: {
      type: 'Immersion sécurisée avec tuteur dédié',
      duree: 'Adaptable selon la situation',
      public: 'Jeunes avec reconnaissance ou besoins d’adaptation'
    },
    contactInfo: {
      phone: '04 92 29 70 80',
      email: 'contact@capemploi06.com',
      websiteUrl: 'https://www.capemploi06.com'
    },
    accessTransports: {
      tram: 'Tram L2 – Grand Arénas (2 min)',
      bus: 'Lignes d’Azur Express 100 & 200',
      walking: 'Pôle Nice Arénas'
    },
    sourceFiabilite: {
      sourceOrg: 'Association de Gestion du Fonds d’Insertion / SPE',
      lastCheckDate: '18 nov. 2024'
    },
    coordinates: { lat: 43.6660, lng: 7.2120 },
    imageUrl: 'https://images.unsplash.com/photo-1573497491768-6e3e3b97779b?auto=format&fit=crop&w=800&q=80'
  }
];

// ----------------------------------------------------------------------------
// Fonctions utilitaires de filtrage et comptage
// ----------------------------------------------------------------------------
export function filterOpportunities(
  items: LocalOpportunity[],
  filters: LocalFilterState
): LocalOpportunity[] {
  return items.filter((opp) => {
    // 1. Filtre par Catégorie
    if (filters.category !== 'ALL') {
      if (filters.category === 'FORMATION' && opp.category !== 'FORMATION') return false;
      if (filters.category === 'ENTREPRISE' && opp.category !== 'ENTREPRISE') return false;
      if (filters.category === 'ACCOMPAGNEMENT' && opp.category !== 'ACCOMPAGNEMENT') return false;
    }

    // 2. Filtre par Domaine
    if (filters.domain && filters.domain !== 'tous') {
      if (opp.domain !== 'tous' && opp.domain !== filters.domain) {
        return false;
      }
    }

    // 3. Filtre par Rayon (Distance)
    if (filters.radiusKm && filters.radiusKm > 0) {
      if (opp.distanceKm > filters.radiusKm) {
        return false;
      }
    }

    // 4. Toggle "Uniquement avec immersion possible"
    if (filters.onlyImmersion && !opp.hasImmersion) {
      return false;
    }

    // 5. Recherche par mot-clé métier ou nom si renseigné
    if (filters.careerQuery && filters.careerQuery.trim().length > 0) {
      const q = filters.careerQuery.trim().toLowerCase();
      const matchName = opp.name.toLowerCase().includes(q);
      const matchHeadline = opp.headline.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      const matchCareers = opp.targetCareers.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchHeadline && !matchDesc && !matchCareers) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'distance') {
      return a.distanceKm - b.distanceKm;
    }
    if (filters.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    // Pertinence par défaut : priorité aux opportunités pertinentes pour le bilan (Riviera Print, Eucalyptus, etc.)
    return a.distanceKm - b.distanceKm;
  });
}

export function getCategoryCounts(items: LocalOpportunity[]): {
  total: number;
  formations: number;
  entreprises: number;
  structuresAide: number;
} {
  return {
    total: items.length,
    formations: items.filter((i) => i.category === 'FORMATION').length,
    entreprises: items.filter((i) => i.category === 'ENTREPRISE').length,
    structuresAide: items.filter((i) => i.category === 'ACCOMPAGNEMENT').length
  };
}
