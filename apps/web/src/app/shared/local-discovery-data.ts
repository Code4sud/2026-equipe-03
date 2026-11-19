// ============================================================================
// Données et Modèles du Module Territorial « Autour de moi » — MonBilan+
// Métropole Nice Côte d'Azur & Département des Alpes-Maritimes (06)
// ============================================================================

export type OpportunityCategory = 'ALL' | 'FORMATION' | 'ACCOMPAGNEMENT' | 'ENTREPRISE';

export interface LocalOpportunity {
  id: string;
  name: string;
  category: 'FORMATION' | 'ACCOMPAGNEMENT' | 'ENTREPRISE';
  subType: string; // "CFA", "Lycée professionnel", "Mission Locale", "CIO", "Entreprise vérifiée", etc.
  city: string;
  postalCode: string;
  address: string;
  distanceKm: number;
  headline: string; // Ex: "CAP / BP Peintre Applicateur de Revêtements et Décorateur - Alternance"
  description: string;
  targetCareers: string[];
  modalities: string[]; // Alternance, Scolaire, Stage d'observation, Accompagnement gratuit
  diplomas?: string[];
  phone?: string;
  email?: string;
  websiteUrl?: string;
  transitInfo?: string; // Ex: "Lignes d'Azur Tram 1 arrêt Vauban"
  coordinates: {
    lat: number;
    lng: number;
  };
  mapSvgCoords: {
    x: number; // Coordonnées relatives 0..100 sur la carte vectorielle de Nice
    y: number;
  };
  source: string;
  verified: boolean;
  isFavorite?: boolean;
  imageUrl?: string;
}

export interface LocalFilterState {
  careerQuery: string;
  city: string;
  radiusKm: number;
  category: OpportunityCategory;
  sortBy: 'relevance' | 'distance' | 'name';
}

// ----------------------------------------------------------------------------
// Annuaire Vérifié des Opportunités — Nice & Alpes-Maritimes (06)
// ----------------------------------------------------------------------------
export const LOCAL_OPPORTUNITIES_DATA: LocalOpportunity[] = [
  // ==================== FORMATIONS (18) ====================
  {
    id: 'opp-cfa-btp-nice',
    name: 'CFA BTP Nice Côte d\'Azur',
    category: 'FORMATION',
    subType: 'CFA',
    city: 'Nice / Carros',
    postalCode: '06510',
    address: '1ère Avenue - BP 445, Z.I. Carros (Métropole Nice Côte d\'Azur)',
    distanceKm: 6.2,
    headline: 'CAP / BP Peintre Applicateur de Revêtements et Décorateur - Alternance',
    description: 'Centre de formation des apprentis du bâtiment leader dans le 06. Plateaux techniques modernes pour l\'apprentissage de la peinture, décoration d\'intérieur, plâtrerie et finitions.',
    targetCareers: ['Peintre décorateur', 'Plaquiste', 'Solier moquettiste', 'Électricien du bâtiment', 'Plombier'],
    modalities: ['Alternance', 'Contrat d\'apprentissage', 'Formation continue'],
    diplomas: ['CAP Peintre applicateur', 'BP Métiers du plâtre', 'Bac Pro Finition Bâtiment'],
    phone: '04 92 08 20 80',
    email: 'contact.btp06@cfa-paca.fr',
    websiteUrl: 'https://www.cfa-btp-paca.com',
    transitInfo: 'Lignes d\'Azur Bus 22 & 73 depuis la Gare Thiers / Tram 3 Grand Arénas',
    coordinates: { lat: 43.785, lng: 7.198 },
    mapSvgCoords: { x: 26, y: 32 },
    source: 'CFA BTP PACA / Académie de Nice',
    verified: true,
    imageUrl: 'assets/visuals/institutions/cfa-btp.jpg'
  },
  {
    id: 'opp-lycee-vauban',
    name: 'Lycée Professionnel Vauban',
    category: 'FORMATION',
    subType: 'Lycée professionnel',
    city: 'Nice',
    postalCode: '06300',
    address: '25 rue Vauban, 06300 Nice',
    distanceKm: 4.8,
    headline: 'Bac Pro Aménagement et Finition du Bâtiment (option peinture-décoration)',
    description: 'Lycée des métiers du second œuvre et de l\'habitat. Formation d\'excellence avec ateliers de peinture, patines, pose de revêtements muraux et techniques décoratives.',
    targetCareers: ['Peintre décorateur', 'Menuisier agenceur', 'Plaquiste', 'Décorateur d\'intérieur'],
    modalities: ['Sous statut scolaire', 'Périodes de stage en entreprise (PFMP)'],
    diplomas: ['Bac Pro AFB', 'CAP Peintre applicateur', 'CAP Ébéniste'],
    phone: '04 93 89 22 44',
    email: 'ce.0060032j@ac-nice.fr',
    websiteUrl: 'https://www.lycee-vauban-nice.fr',
    transitInfo: 'Tramway Ligne 1 — Station Vauban (à 2 min à pied)',
    coordinates: { lat: 43.7088, lng: 7.2845 },
    mapSvgCoords: { x: 62, y: 44 },
    source: 'Académie de Nice / Éducation Nationale',
    verified: true,
    imageUrl: 'assets/visuals/institutions/lycee-vauban.jpg'
  },
  {
    id: 'opp-lycee-pasteur',
    name: 'Lycée Professionnel Louis Pasteur',
    category: 'FORMATION',
    subType: 'Lycée professionnel',
    city: 'Nice',
    postalCode: '06300',
    address: '88 rue de Roquebillière, 06300 Nice',
    distanceKm: 5.1,
    headline: 'CAP & Bac Pro Métiers de l\'Artisanat et de la Finition',
    description: 'Établissement public préparant aux métiers de la finition, de la carrosserie et des métiers techniques de précision.',
    targetCareers: ['Peintre décorateur', 'Carrossier peintre', 'Technicien de maintenance'],
    modalities: ['Scolaire', 'Apprentissage (GRETA)'],
    diplomas: ['CAP Peintre', 'Bac Pro Finition', 'Mention Complémentaire'],
    phone: '04 92 00 77 77',
    email: 'ce.0060034l@ac-nice.fr',
    websiteUrl: 'https://lycee-pasteur-nice.fr',
    transitInfo: 'Tram L1 — Station Saint-Roch',
    coordinates: { lat: 43.712, lng: 7.289 },
    mapSvgCoords: { x: 68, y: 39 },
    source: 'Académie de Nice',
    verified: true
  },
  {
    id: 'opp-don-bosco-nice',
    name: 'Lycée des Métiers Don Bosco',
    category: 'FORMATION',
    subType: 'Lycée polyvalent / CFA',
    city: 'Nice',
    postalCode: '06000',
    address: '40 avenue Thiers, 06000 Nice',
    distanceKm: 1.8,
    headline: 'Bac Pro Métiers du Design, Aménagement & Graphisme',
    description: 'Pôle d\'enseignement professionnel réputé au cœur de Nice. Sections graphisme, décors et agencement de l\'espace.',
    targetCareers: ['Peintre décorateur', 'Graphiste', 'Infographiste 3D', 'Menuisier'],
    modalities: ['Scolaire', 'Alternance'],
    diplomas: ['Bac Pro Artisanat & Métiers d\'Art', 'BTS Design d\'espace'],
    phone: '04 93 88 56 12',
    email: 'contact@donbosco-nice.org',
    websiteUrl: 'https://donbosco-nice.org',
    transitInfo: 'Gare SNCF Nice Ville / Tram L1 Gare Thiers',
    coordinates: { lat: 43.7045, lng: 7.2612 },
    mapSvgCoords: { x: 52, y: 56 },
    source: 'Académie de Nice / Enseignement Privé sous contrat',
    verified: true
  },
  {
    id: 'opp-greta-cotedazur',
    name: 'GRETA Côte d\'Azur — Agence de Nice',
    category: 'FORMATION',
    subType: 'Organisme de formation continue',
    city: 'Nice',
    postalCode: '06200',
    address: '4 boulevard Paul Montel, 06200 Nice Arénas',
    distanceKm: 5.6,
    headline: 'Titre Professionnel Peintre en bâtiment et Décoration intérieure',
    description: 'Formations qualifiantes pour adultes et jeunes en reconversion ou poursuite de qualification. Titres certifiés par l\'État.',
    targetCareers: ['Peintre décorateur', 'Plaquiste', 'Solier', 'Agent d\'entretien du bâtiment'],
    modalities: ['Contrat de professionnalisation', 'Financement Région Sud / CPF'],
    diplomas: ['Titre Pro RNCP Niveau 3', 'Certificat de qualification professionnelle'],
    phone: '04 92 29 40 40',
    email: 'contact@gretacotedazur.fr',
    websiteUrl: 'https://greta-cotedazur.fr',
    transitInfo: 'Tram L2 & L3 — Grand Arénas',
    coordinates: { lat: 43.6698, lng: 7.2155 },
    mapSvgCoords: { x: 34, y: 73 },
    source: 'Réseau GRETA Éducation Nationale',
    verified: true
  },
  {
    id: 'opp-lycee-magnan',
    name: 'Lycée Professionnel Magnan',
    category: 'FORMATION',
    subType: 'Lycée professionnel',
    city: 'Nice',
    postalCode: '06000',
    address: '8 avenue de la Bornala, 06200 Nice',
    distanceKm: 3.4,
    headline: 'Bac Pro Métiers du Commerce, Accueil & Relation Client',
    description: 'Pôle de référence des métiers du tertiaire et de la relation client avec stages professionnels intégrés.',
    targetCareers: ['Conseiller de vente', 'Chargé d\'accueil', 'Télévendeur'],
    modalities: ['Scolaire', 'Alternance'],
    diplomas: ['CAP Équipier polyvalent', 'Bac Pro Métiers du Commerce'],
    phone: '04 93 86 52 44',
    websiteUrl: 'https://lycee-magnan.fr',
    transitInfo: 'Tram L2 — Magnan',
    coordinates: { lat: 43.689, lng: 7.241 },
    mapSvgCoords: { x: 44, y: 68 },
    source: 'Académie de Nice',
    verified: true
  },
  {
    id: 'opp-lycee-eucalyptus',
    name: 'Lycée Polyvalent Les Eucalyptus',
    category: 'FORMATION',
    subType: 'Lycée technologique & professionnel',
    city: 'Nice',
    postalCode: '06200',
    address: '7 avenue des Eucalyptus, 06200 Nice',
    distanceKm: 4.9,
    headline: 'Bac Pro & BTS Systèmes Numériques, Électrotechnique & Énergie',
    description: 'Pôle scientifique et industriel majeur de la Métropole Nice Côte d\'Azur.',
    targetCareers: ['Technicien réseau', 'Électricien', 'Domoticien', 'Technicien de maintenance'],
    modalities: ['Scolaire', 'Apprentissage'],
    diplomas: ['Bac Pro CIEL', 'BTS Électrotechnique', 'Bac STI2D'],
    phone: '04 92 15 30 00',
    websiteUrl: 'https://lycee-eucalyptus.fr',
    transitInfo: 'Tram L2 — Cadam / Parc Phoenix',
    coordinates: { lat: 43.676, lng: 7.221 },
    mapSvgCoords: { x: 38, y: 69 },
    source: 'Académie de Nice',
    verified: true
  },
  {
    id: 'opp-lycee-parc-imperial',
    name: 'Lycée Polyvalent du Parc Impérial',
    category: 'FORMATION',
    subType: 'Lycée général & technologique',
    city: 'Nice',
    postalCode: '06000',
    address: 'Avenue Suzanne Lenglen, 06000 Nice',
    distanceKm: 2.3,
    headline: 'Filières Générales, STMG et BTS Gestion des Entreprises',
    description: 'Établissement historique proposant des formations d\'orientation vers le management et la gestion.',
    targetCareers: ['Assistant de gestion', 'Comptable', 'Chargé de communication'],
    modalities: ['Scolaire', 'Poursuite d\'études'],
    diplomas: ['Bac Général', 'Bac STMG', 'BTS SAM'],
    phone: '04 92 15 24 24',
    transitInfo: 'Bus Lignes d\'Azur 75 & 71',
    coordinates: { lat: 43.708, lng: 7.252 },
    mapSvgCoords: { x: 49, y: 48 },
    source: 'Académie de Nice',
    verified: true
  },
  {
    id: 'opp-ecole-condes-nice',
    name: 'École de Condé Nice (Design & Arts Graphiques)',
    category: 'FORMATION',
    subType: 'École d\'enseignement supérieur',
    city: 'Nice',
    postalCode: '06000',
    address: '40 avenue Notre Dame, 06000 Nice',
    distanceKm: 1.5,
    headline: 'Bachelor Design d\'Espace, Décoration & Scénographie',
    description: 'Enseignement supérieur privé préparant aux métiers créatifs, aménagement intérieur et architecture commerciale.',
    targetCareers: ['Peintre décorateur', 'Décorateur d\'intérieur', 'Designer d\'espace', 'Scénographe'],
    modalities: ['Formation initiale', 'Stages longs'],
    diplomas: ['Bachelor Design certifié RNCP Niveau 6'],
    phone: '04 93 80 50 40',
    websiteUrl: 'https://www.ecoles-conde.com/campus/nice/',
    transitInfo: 'Tram L1 — Jean Médecin',
    coordinates: { lat: 43.7025, lng: 7.2685 },
    mapSvgCoords: { x: 55, y: 58 },
    source: 'Enseignement Supérieur Privé RNCP',
    verified: true
  },
  {
    id: 'opp-afpa-nice',
    name: 'AFPA Côte d\'Azur — Centre de Nice Saint-Roch',
    category: 'FORMATION',
    subType: 'Centre de formation qualifiante',
    city: 'Nice',
    postalCode: '06300',
    address: '150 boulevard Virgile Barel, 06300 Nice',
    distanceKm: 5.4,
    headline: 'Titre Pro Peintre en bâtiment intérieur & extérieur',
    description: 'Formations certifiantes accélérées avec plateaux grandeur nature et apprentissage des gestes professionnels.',
    targetCareers: ['Peintre décorateur', 'Façadier', 'Plâtrier plaquiste'],
    modalities: ['Contrat de professionnalisation', 'Financement public'],
    diplomas: ['Titre Professionnel Ministère du Travail'],
    phone: '3936',
    websiteUrl: 'https://www.afpa.fr',
    transitInfo: 'Tram L1 — Pont Michel / Saint-Roch',
    coordinates: { lat: 43.721, lng: 7.295 },
    mapSvgCoords: { x: 71, y: 34 },
    source: 'AFPA PACA',
    verified: true
  },
  {
    id: 'opp-compagnons-tour-de-france',
    name: 'Fédération Compagnonnique des Métiers du Bâtiment 06',
    category: 'FORMATION',
    subType: 'CFA / Compagnonnage',
    city: 'Nice / Cagnes-sur-Mer',
    postalCode: '06800',
    address: 'Avenue de la Gaude, 06800 Cagnes-sur-Mer',
    distanceKm: 9.8,
    headline: 'CAP & Perfectionnement Métiers d\'Art : Peinture, Patines, Trompe-l\'œil',
    description: 'Transmission d\'excellence des savoir-faire artisanaux, éthique du travail bien fait et itinérance professionnelle.',
    targetCareers: ['Peintre décorateur', 'Staffeur ornementiste', 'Menuisier traditionnel'],
    modalities: ['Apprentissage', 'Tour de France Compagnonnique'],
    diplomas: ['CAP', 'Brevet Professionnel', 'Titre de Compagnon'],
    phone: '04 93 20 62 62',
    websiteUrl: 'https://compagnonsdutourdefrance.org',
    transitInfo: 'Bus 200 & 9 / Train TER Cagnes-sur-Mer',
    coordinates: { lat: 43.664, lng: 7.148 },
    mapSvgCoords: { x: 18, y: 72 },
    source: 'Fédération Compagnonnique',
    verified: true
  },
  {
    id: 'opp-inphb-grasse',
    name: 'Campus Sud Métiers & Parfumerie (Grasse / Valbonne)',
    category: 'FORMATION',
    subType: 'Pôle de formation',
    city: 'Grasse (06)',
    postalCode: '06130',
    address: 'Route de Pégomas, 06130 Grasse',
    distanceKm: 28.5,
    headline: 'Formations de Chimie, Formulation & Métiers Créatifs',
    description: 'Pôle de compétences du Pays de Grasse pour les métiers techniques et sensoriels.',
    targetCareers: ['Chimiste formulateur', 'Technicien de laboratoire', 'Conditionneur'],
    modalities: ['Alternance', 'Scolaire'],
    phone: '04 93 70 80 90',
    coordinates: { lat: 43.658, lng: 6.924 },
    mapSvgCoords: { x: 10, y: 65 },
    source: 'CCI Nice Côte d\'Azur',
    verified: true
  },
  {
    id: 'opp-cfa-metropole-nice',
    name: 'Campus Régional d\'Apprentissage Métropole Nice',
    category: 'FORMATION',
    subType: 'CFA Métropolitain',
    city: 'Nice Plaine du Var',
    postalCode: '06200',
    address: 'Boulevard du Mercantour, 06200 Nice',
    distanceKm: 7.1,
    headline: 'CAP & Bac Pro Métiers Verts, Espaces Urbains & Environnement',
    description: 'Pôle de formation aux métiers de l\'environnement, des parcs et de la gestion urbaine durable.',
    targetCareers: ['Jardinier paysagiste', 'Agent technique environnement', 'Horticulteur'],
    modalities: ['Alternance', 'Apprentissage'],
    phone: '04 97 13 20 00',
    transitInfo: 'Tram L3 — Stade Allianz Riviera',
    coordinates: { lat: 43.705, lng: 7.192 },
    mapSvgCoords: { x: 28, y: 52 },
    source: 'Métropole Nice Côte d\'Azur',
    verified: true
  },
  {
    id: 'opp-lycee-paul-arane',
    name: 'Lycée Professionnel Paul Arène',
    category: 'FORMATION',
    subType: 'Lycée professionnel',
    city: 'Grasse (06)',
    postalCode: '06130',
    address: 'Avenue Paul Arène, 06130 Grasse',
    distanceKm: 27.2,
    headline: 'Bac Pro Métiers du Bâtiment & Gros Œuvre',
    description: 'Formations spécialisées en construction et restauration du patrimoine bâti provençal.',
    targetCareers: ['Maçon', 'Charpentier', 'Tailleur de pierre'],
    modalities: ['Scolaire'],
    phone: '04 93 40 60 00',
    coordinates: { lat: 43.662, lng: 6.931 },
    mapSvgCoords: { x: 12, y: 60 },
    source: 'Académie de Nice',
    verified: true
  },
  {
    id: 'opp-lycee-st-vincent-paul',
    name: 'Lycée Privé Saint-Vincent de Paul',
    category: 'FORMATION',
    subType: 'Lycée professionnel',
    city: 'Nice',
    postalCode: '06000',
    address: '5 rue Vernier, 06000 Nice',
    distanceKm: 1.9,
    headline: 'CAP & Bac Pro Métiers du Soin, de l\'Aide et du Médico-Social',
    description: 'Filières humaines préparant aux carrières d\'aide à la personne et d\'animation sociale.',
    targetCareers: ['Aide-soignant', 'Accompagnant éducatif', 'Auxiliaire de puériculture'],
    modalities: ['Scolaire', 'Stages cliniques'],
    phone: '04 93 88 15 22',
    transitInfo: 'Tram L1 — Libération',
    coordinates: { lat: 43.706, lng: 7.263 },
    mapSvgCoords: { x: 53, y: 52 },
    source: 'Académie de Nice',
    verified: true
  },
  {
    id: 'opp-univ-cote-azur-iut',
    name: 'IUT Nice Côte d\'Azur — Site Fabron',
    category: 'FORMATION',
    subType: 'Institut Universitaire Technologique',
    city: 'Nice',
    postalCode: '06200',
    address: 'Boulevard Napoléon III, 06200 Nice',
    distanceKm: 4.1,
    headline: 'BUT Génie Civil & Construction Durable',
    description: 'Formation bac+3 de conducteur de travaux, chargé d\'affaires BTP et maîtrise d\'œuvre.',
    targetCareers: ['Conducteur de travaux', 'Dessinateur projeteur BTP', 'Chef de chantier'],
    modalities: ['Initiale', 'Alternance en 2e/3e année'],
    phone: '04 89 15 30 00',
    transitInfo: 'Bus 51 & 62 / Proche voie Mathis',
    coordinates: { lat: 43.684, lng: 7.229 },
    mapSvgCoords: { x: 40, y: 64 },
    source: 'Université Côte d\'Azur',
    verified: true
  },
  {
    id: 'opp-lycee-pierre-sola',
    name: 'Lycée Polyvalent Pierre Sola',
    category: 'FORMATION',
    subType: 'Lycée des métiers',
    city: 'Nice',
    postalCode: '06300',
    address: '2 rue Pierre Sola, 06300 Nice',
    distanceKm: 4.5,
    headline: 'Bac Pro Métiers de l\'Hôtellerie-Restauration & Cuisine',
    description: 'École hôtelière de renom avec restaurant d\'application ouvert au public.',
    targetCareers: ['Cuisinier', 'Serveur en salle', 'Pâtissier'],
    modalities: ['Scolaire', 'Alternance'],
    phone: '04 93 56 40 40',
    transitInfo: 'Tram L1 — Palais des Expositions',
    coordinates: { lat: 43.706, lng: 7.282 },
    mapSvgCoords: { x: 60, y: 49 },
    source: 'Académie de Nice',
    verified: true
  },
  {
    id: 'opp-ecole-superieure-art-arson',
    name: 'Villa Arson — École Nationale Supérieure d\'Art',
    category: 'FORMATION',
    subType: 'École nationale supérieure d\'art',
    city: 'Nice',
    postalCode: '06100',
    address: '20 avenue Stephen Liégeard, 06105 Nice',
    distanceKm: 3.7,
    headline: 'Diplôme National d\'Art (DNA) & Master Création Plastique',
    description: 'Institution prestigieuse sur la colline de Saint-Barthélémy. Ateliers monumentaux de sculpture, peinture, céramique et nouveaux médias.',
    targetCareers: ['Artiste plasticien', 'Scénographe', 'Restaurateur d\'œuvres d\'art', 'Décorateur'],
    modalities: ['Enseignement supérieur public', 'Ateliers de recherche'],
    diplomas: ['DNA (Bac+3)', 'DNSEP (Bac+5 grade Master)'],
    phone: '04 92 07 73 73',
    websiteUrl: 'https://www.villa-arson.fr',
    transitInfo: 'Tram L1 — arrêt Valrose Université ou Henri Sappia puis Bus 7',
    coordinates: { lat: 43.722, lng: 7.254 },
    mapSvgCoords: { x: 50, y: 32 },
    source: 'Ministère de la Culture',
    verified: true
  },

  // ==================== ORGANISMES D'ACCOMPAGNEMENT (8) ====================
  {
    id: 'opp-mission-locale-nice-centre',
    name: 'Mission Locale Nice Côte d\'Azur',
    category: 'ACCOMPAGNEMENT',
    subType: 'Mission Locale',
    city: 'Nice',
    postalCode: '06300',
    address: '5 rue Arson, 06300 Nice (Place Arson / Port)',
    distanceKm: 2.9,
    headline: 'Accompagnement des 16-25 ans : formation, emploi, alternance, immersion',
    description: 'Service public de proximité dédié aux jeunes de 16 à 25 ans. Conseillers dédiés, aides au financement, conventions de stages d\'immersion (PMSMP), parrainage d\'entreprises.',
    targetCareers: ['Tous métiers', 'Peintre décorateur', 'Artisanat', 'Numérique', 'Services'],
    modalities: ['Gratuit', 'Sans rendez-vous le matin', 'Contrat d\'Engagement Jeune (CEJ)'],
    phone: '04 93 89 69 49',
    email: 'contact@mlnice.fr',
    websiteUrl: 'https://www.missionlocale-nice.org',
    transitInfo: 'Tram L1 — Garibaldi / Tram L2 — Port Lympia',
    coordinates: { lat: 43.7011, lng: 7.2858 },
    mapSvgCoords: { x: 61, y: 62 },
    source: 'Réseau National des Missions Locales',
    verified: true,
    imageUrl: 'assets/visuals/institutions/mission-locale.jpg'
  },
  {
    id: 'opp-cio-nice-centre',
    name: 'Centre d\'Information et d\'Orientation (CIO) Nice Centre',
    category: 'ACCOMPAGNEMENT',
    subType: 'Service Public Éducation Nationale',
    city: 'Nice',
    postalCode: '06000',
    address: '15 rue Delille, 06000 Nice',
    distanceKm: 1.2,
    headline: 'Conseil personnalisé d\'orientation scolaire et professionnelle gratuit',
    description: 'Psychologues de l\'Éducation nationale pour faire le point sur ses aptitudes, comprendre son dossier d\'orientation et choisir ses filières d\'études.',
    targetCareers: ['Tous métiers', 'Orientation scolaire', 'Réorientation post-bac'],
    modalities: ['Service public gratuit', 'Sur rendez-vous ou accueil libre'],
    phone: '04 93 62 49 49',
    email: 'cio-nice@ac-nice.fr',
    websiteUrl: 'https://www.ac-nice.fr/orientation',
    transitInfo: 'Tram L1 — Durandy / Tram L2 — Garibaldi Le Château',
    coordinates: { lat: 43.7008, lng: 7.2735 },
    mapSvgCoords: { x: 57, y: 60 },
    source: 'Académie de Nice / Ministère de l\'Éducation Nationale',
    verified: true
  },
  {
    id: 'opp-cio-nice-valrose',
    name: 'CIO Nice Valrose — Pôle Universités & Étudiants',
    category: 'ACCOMPAGNEMENT',
    subType: 'CIO Spécialisé',
    city: 'Nice',
    postalCode: '06108',
    address: 'Parc Valrose - Bâtiment des Sciences, 06108 Nice',
    distanceKm: 2.7,
    headline: 'Orientation études supérieures, passerelles et reconversion jeunes',
    description: 'Documentation spécialisée sur les cursus universitaires, les BTS et les poursuites d\'études courtes.',
    targetCareers: ['Études supérieures', 'Carrières scientifiques et techniques'],
    modalities: ['Gratuit', 'Consultation libre de la documentation Onisep'],
    phone: '04 93 84 89 22',
    email: 'cio-valrose@ac-nice.fr',
    transitInfo: 'Tram L1 — Valrose Université',
    coordinates: { lat: 43.715, lng: 7.265 },
    mapSvgCoords: { x: 54, y: 40 },
    source: 'Académie de Nice',
    verified: true
  },
  {
    id: 'opp-centre-des-possibles-nice',
    name: 'Centre des Possibles — Hub de l\'Innovation Nice',
    category: 'ACCOMPAGNEMENT',
    subType: 'Accélérateur d\'insertion et d\'orientation',
    city: 'Nice',
    postalCode: '06200',
    address: '1-3 Boulevard René Cassin, 06200 Nice Arénas',
    distanceKm: 5.7,
    headline: 'Dispositif d\'expérimentation, mentorat pro et découverte métiers',
    description: 'Structure innovante de la Métropole Côte d\'Azur accompagnant les jeunes vers des projets concrets, bilans d\'orientation et immersions sur le terrain.',
    targetCareers: ['Tous métiers', 'Projet professionnel individualisé'],
    modalities: ['Ateliers collectifs', 'Coaching individuel', 'Rapprochement employeurs'],
    phone: '04 97 13 54 00',
    email: 'centredespossibles@nicecotedazur.org',
    websiteUrl: 'https://www.nicecotedazur.org/orientation-jeunesse',
    transitInfo: 'Tram L2 — Parc Phoenix / Grand Arénas',
    coordinates: { lat: 43.669, lng: 7.218 },
    mapSvgCoords: { x: 36, y: 74 },
    source: 'Métropole Nice Côte d\'Azur',
    verified: true
  },
  {
    id: 'opp-france-travail-nice-centre',
    name: 'France Travail — Agence Nice Centre',
    category: 'ACCOMPAGNEMENT',
    subType: 'Service Public pour l\'Emploi',
    city: 'Nice',
    postalCode: '06300',
    address: '22 boulevard Jean Jaurès, 06300 Nice',
    distanceKm: 1.6,
    headline: 'Espace Jeunes, immersion professionnelle (PMSMP) et offres en alternance',
    description: 'Conseillers référents alternance, dispositifs d\'immersion en entreprise conventionnés d\'une journée à un mois pour tester un métier.',
    targetCareers: ['Tous secteurs', 'Artisanat', 'Tertiaire', 'BTP'],
    modalities: ['Convention PMSMP gratuite', 'Ateliers CV et préparation d\'entretien'],
    phone: '3949',
    websiteUrl: 'https://www.francetravail.fr',
    transitInfo: 'Tram L1 — Cathédrale Vieille-Ville',
    coordinates: { lat: 43.698, lng: 7.275 },
    mapSvgCoords: { x: 58, y: 64 },
    source: 'France Travail PACA',
    verified: true
  },
  {
    id: 'opp-crij-paca-nice',
    name: 'Info Jeunes Nice — CRIJ Côte d\'Azur',
    category: 'ACCOMPAGNEMENT',
    subType: 'Information Jeunesse',
    city: 'Nice',
    postalCode: '06000',
    address: '19 rue Gioffredo, 06000 Nice',
    distanceKm: 0.8,
    headline: 'Information globale, mobilité, logement et jobs d\'été pour les jeunes',
    description: 'Point d\'accueil sans condition pour tous les jeunes : guides d\'orientation, ateliers mobilité internationale, aide aux démarches administratives.',
    targetCareers: ['Tous métiers', 'Mobilité européenne', 'Vie pratique'],
    modalities: ['Accès libre et anonyme', 'Wifi gratuit et ordinateurs à disposition'],
    phone: '04 93 80 12 69',
    email: 'nice@infojeunes-paca.fr',
    websiteUrl: 'https://www.infojeunes-paca.fr',
    transitInfo: 'Tram L1 & L2 — Jean Médecin',
    coordinates: { lat: 43.699, lng: 7.269 },
    mapSvgCoords: { x: 54, y: 62 },
    source: 'Réseau Info Jeunes France',
    verified: true
  },
  {
    id: 'opp-cap-emploi-06',
    name: 'Cap Emploi 06 — Accompagnement Spécifique',
    category: 'ACCOMPAGNEMENT',
    subType: 'Organisme d\'insertion spécialisée',
    city: 'Nice',
    postalCode: '06200',
    address: 'Immeuble Nice Plaza, 455 Promenade des Anglais, 06200 Nice',
    distanceKm: 5.9,
    headline: 'Accompagnement orientation et immersion pour jeunes en situation de handicap',
    description: 'Expertise sur les aménagements de poste, choix des filières accessibles et sécurisation des parcours de formation.',
    targetCareers: ['Tous métiers adaptés', 'Métiers du numérique', 'Artisanat adapté'],
    modalities: ['Gratuit', 'Sur prescription MDPH / Mission Locale'],
    phone: '04 92 29 70 80',
    email: 'contact@capemploi06.com',
    transitInfo: 'Tram L2 — Ferber / Grand Arénas',
    coordinates: { lat: 43.666, lng: 7.212 },
    mapSvgCoords: { x: 33, y: 76 },
    source: 'Association Gestionnaire Cap Emploi 06',
    verified: true
  },
  {
    id: 'opp-point-orientation-metiers-06',
    name: 'Point A — Chambre de Métiers et de l\'Artisanat (CMA 06)',
    category: 'ACCOMPAGNEMENT',
    subType: 'Chambre Consulaire',
    city: 'Saint-Laurent-du-Var',
    postalCode: '06700',
    address: '81 avenue Léon Bérenger, 06700 Saint-Laurent-du-Var',
    distanceKm: 7.4,
    headline: 'Bourse de l\'apprentissage dans l\'artisanat & conventions de stage découverte',
    description: 'La Chambre des Métiers aide les collégiens et lycéens à trouver un maître d\'apprentissage ou un stage d\'initiation pendant les vacances scolaires.',
    targetCareers: ['Peintre décorateur', 'Ébéniste', 'Pâtissier', 'Coiffeur', 'Artisans du BTP'],
    modalities: ['Conventions "Pass Métiers" (stages vacances 1 à 5 jours)', 'Gratuit'],
    phone: '04 92 12 53 00',
    email: 'point-a@cmar-paca.fr',
    websiteUrl: 'https://www.cmar-paca.fr',
    transitInfo: 'Bus 200 & 54 / Gare SNCF Saint-Laurent-du-Var',
    coordinates: { lat: 43.668, lng: 7.189 },
    mapSvgCoords: { x: 24, y: 75 },
    source: 'Chambre de Métiers et de l\'Artisanat PACA',
    verified: true
  },

  // ==================== ENTREPRISES & IMMERSIONS (12) ====================
  {
    id: 'opp-atelier-decors-riviera',
    name: 'Atelier Décors & Patines Riviera',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Nice Centre (Libération)',
    postalCode: '06000',
    address: '14 rue Vernier, 06000 Nice',
    distanceKm: 2.1,
    headline: 'Entreprise artisanale d\'art — Finitions décoratives, patines et enduits chaux',
    description: 'Atelier spécialisé dans les finitions décoratives haut de gamme, rénovation de villas Belle Époque et décors muraux écologiques. Accueille régulièrement des jeunes en stage d\'observation.',
    targetCareers: ['Peintre décorateur', 'Plaquiste', 'Solier'],
    modalities: ['Stage d\'observation de 1 à 5 jours', 'Accueil d\'apprentis CAP/BP'],
    phone: '04 93 88 12 40',
    email: 'contact@decors-riviera.fr',
    websiteUrl: 'https://www.decors-riviera.fr',
    transitInfo: 'Tram L1 — Libération (3 min)',
    coordinates: { lat: 43.7052, lng: 7.2595 },
    mapSvgCoords: { x: 51, y: 53 },
    source: 'MonBilan+ Entreprises Partenaires Vérifiées',
    verified: true,
    imageUrl: 'assets/visuals/institutions/atelier-decors.jpg'
  },
  {
    id: 'opp-decor-couleurs-azur',
    name: 'Décor & Couleurs Azur Rénovation',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Nice Est (Riquier)',
    postalCode: '06300',
    address: '38 rue Arson, 06300 Nice',
    distanceKm: 3.2,
    headline: 'Travaux de peinture intérieure, revêtements de sols souples & ravalement',
    description: 'Entreprise familiale de 8 compagnons peintres intervenant sur la Métropole Nice Côte d\'Azur. Partenaire actif de l\'immersion professionnelle.',
    targetCareers: ['Peintre décorateur', 'Solier moquettiste', 'Façadier'],
    modalities: ['Stage PMSMP', 'Alternance'],
    phone: '04 93 55 41 20',
    email: 'recrutement@decor-couleurs-azur.fr',
    transitInfo: 'Gare SNCF Nice Riquier / Tram L1 Saint-Jean-d\'Angély',
    coordinates: { lat: 43.703, lng: 7.288 },
    mapSvgCoords: { x: 63, y: 58 },
    source: 'Fédération Française du Bâtiment 06',
    verified: true
  },
  {
    id: 'opp-studio-riviera-son',
    name: 'Studio Riviera Son & Acoustique',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Nice Port',
    postalCode: '06300',
    address: '8 quai des Deux-Emmanuels, 06300 Nice',
    distanceKm: 3.8,
    headline: 'Enregistrement sonore, acoustique architecturale et régie spectacle',
    description: 'Studio professionnel accueillant pour faire découvrir les métiers du son, le traitement acoustique des parois et le mixage.',
    targetCareers: ['Technicien du son', 'Régisseur son', 'Acousticien'],
    modalities: ['Stage d\'observation de 3 jours'],
    phone: '04 93 55 90 12',
    email: 'stages@studioriviera.fr',
    transitInfo: 'Tram L2 — Port Lympia',
    coordinates: { lat: 43.695, lng: 7.286 },
    mapSvgCoords: { x: 62, y: 69 },
    source: 'Réseau Culture & Audiovisuel Côte d\'Azur',
    verified: true
  },
  {
    id: 'opp-azur-peinture-finition',
    name: 'Azur Finitions & Revêtements',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Saint-Laurent-du-Var',
    postalCode: '06700',
    address: '12 impasse des Jardins, 06700 Saint-Laurent-du-Var',
    distanceKm: 6.8,
    headline: 'Pose de revêtements muraux d\'art, staffs et peintures minérales',
    description: 'Chantiers de rénovation résidentielle haut de gamme sur la Côte d\'Azur.',
    targetCareers: ['Peintre décorateur', 'Staffeur', 'Plaquiste'],
    modalities: ['Stage conventionné'],
    phone: '04 93 31 10 00',
    email: 'contact@azur-finitions.com',
    coordinates: { lat: 43.671, lng: 7.185 },
    mapSvgCoords: { x: 22, y: 73 },
    source: 'CMA 06',
    verified: true
  },
  {
    id: 'opp-menuiserie-baie-des-anges',
    name: 'Atelier Menuiserie Baie des Anges',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Nice Ouest (Saint-Augustin)',
    postalCode: '06200',
    address: '42 boulevard du Mercantour, 06200 Nice',
    distanceKm: 6.5,
    headline: 'Agencement sur mesure, ébénisterie et pose de menuiseries contemporaines',
    description: 'Atelier d\'agencement bois et finitions vernies. Encadrement bienveillant pour stages découverte.',
    targetCareers: ['Menuisier agenceur', 'Ébéniste', 'Peintre décorateur'],
    modalities: ['Stage découverte 3e/Seconde', 'Alternance'],
    phone: '04 93 29 88 70',
    email: 'atelier@menuiserie-bda.fr',
    transitInfo: 'Tram L3 — Eco-Parc',
    coordinates: { lat: 43.682, lng: 7.205 },
    mapSvgCoords: { x: 31, y: 66 },
    source: 'Compagnons du Devoir 06',
    verified: true
  },
  {
    id: 'opp-espace-vert-provence',
    name: 'Azur Paysage & Jardins Méditerranéens',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'La Trinité (06)',
    postalCode: '06340',
    address: 'Route de Laghet, 06340 La Trinité',
    distanceKm: 7.9,
    headline: 'Création de jardins paysagers, arrosage automatique et murets en pierre',
    description: 'Chantiers de valorisation végétale dans l\'arrière-pays niçois.',
    targetCareers: ['Jardinier paysagiste', 'Conducteur d\'engins espaces verts'],
    modalities: ['Stage immersion'],
    phone: '04 93 54 12 34',
    coordinates: { lat: 43.744, lng: 7.315 },
    mapSvgCoords: { x: 77, y: 24 },
    source: 'UNEP Méditerranée',
    verified: true
  },
  {
    id: 'opp-imprimerie-riviera-print',
    name: 'Riviera Print & Découpe Graphique',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Nice Centre',
    postalCode: '06000',
    address: '18 rue Lepante, 06000 Nice',
    distanceKm: 1.1,
    headline: 'Impression numérique grand format, enseignes et covering adhésif',
    description: 'Atelier créatif combinant PAO et pose manuelle de lettrages et décors grand format.',
    targetCareers: ['Graphiste', 'Opérateur d\'impression', 'Peintre décorateur'],
    modalities: ['Stage d\'observation'],
    phone: '04 93 62 18 18',
    email: 'info@rivieraprint.fr',
    transitInfo: 'Tram L1 — Jean Médecin',
    coordinates: { lat: 43.702, lng: 7.268 },
    mapSvgCoords: { x: 55, y: 59 },
    source: 'Club Entreprises Nice Centre',
    verified: true
  },
  {
    id: 'opp-electricite-azur-connect',
    name: 'Azur Énergie & Domotique',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Nice (Plaine du Var)',
    postalCode: '06200',
    address: 'Avenue Simone Veil, 06200 Nice',
    distanceKm: 6.9,
    headline: 'Installations électriques écologiques, solaire photovoltaïque et bornes de recharge',
    description: 'Entreprise moderne axée sur la transition énergétique et les chantiers connectés.',
    targetCareers: ['Électricien', 'Monteur photovoltaïque', 'Domoticien'],
    modalities: ['Alternance', 'Stage découverte'],
    phone: '04 92 00 11 22',
    coordinates: { lat: 43.688, lng: 7.195 },
    mapSvgCoords: { x: 29, y: 62 },
    source: 'FFIE PACA',
    verified: true
  },
  {
    id: 'opp-plomberie-chauffage-baie',
    name: 'Bain & Rénovation Côte d\'Azur',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Cagnes-sur-Mer',
    postalCode: '06800',
    address: 'Avenue des Alpes, 06800 Cagnes-sur-Mer',
    distanceKm: 11.2,
    headline: 'Rénovation complète de salles de bains, plomberie sanitaire et faïence',
    description: 'Chantiers de second œuvre combinant plomberie soignée et finitions carrelage.',
    targetCareers: ['Plombier chauffagiste', 'Carreleur', 'Installateur sanitaire'],
    modalities: ['Stage d\'immersion PMSMP'],
    phone: '04 93 20 45 50',
    coordinates: { lat: 43.661, lng: 7.142 },
    mapSvgCoords: { x: 16, y: 74 },
    source: 'CAPEB 06',
    verified: true
  },
  {
    id: 'opp-boulangerie-artisanale-nice',
    name: 'Maison Saint-François Pains & Délices',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Vieux-Nice',
    postalCode: '06300',
    address: 'Place Saint-François, 06300 Nice',
    distanceKm: 1.4,
    headline: 'Fournil artisanal au levain naturel et viennoiseries pur beurre',
    description: 'Fournil ouvert dès 4h du matin, idéal pour tester la réalité et la passion du métier d\'artisan boulanger.',
    targetCareers: ['Boulanger', 'Pâtissier', 'Vendeur en boulangerie'],
    modalities: ['Stage découverte 3 jours'],
    phone: '04 93 85 20 10',
    transitInfo: 'Tram L1 — Garibaldi',
    coordinates: { lat: 43.699, lng: 7.279 },
    mapSvgCoords: { x: 59, y: 61 },
    source: 'Fédération des Artisans Boulangers du 06',
    verified: true
  },
  {
    id: 'opp-fleuriste-jardin-fleurs',
    name: 'L\'Atelier Végétal Riviera',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Nice Centre',
    postalCode: '06000',
    address: '11 boulevard Victor Hugo, 06000 Nice',
    distanceKm: 1.3,
    headline: 'Création florale de saison, scénographie d\'événements et mariages',
    description: 'Boutique-atelier fleuriste haut de gamme avec compositions artistiques.',
    targetCareers: ['Fleuriste', 'Décorateur floral', 'Conseiller de vente'],
    modalities: ['Stage conventionné'],
    phone: '04 93 88 77 00',
    transitInfo: 'Tram L2 — Alsace-Lorraine',
    coordinates: { lat: 43.6995, lng: 7.2625 },
    mapSvgCoords: { x: 52, y: 62 },
    source: 'Chambre de Métiers 06',
    verified: true
  },
  {
    id: 'opp-restauration-patrimoine-nice',
    name: 'Patrimoine & Couleurs de Nice',
    category: 'ENTREPRISE',
    subType: 'Entreprise vérifiée',
    city: 'Villefranche-sur-Mer / Nice',
    postalCode: '06230',
    address: 'Quai de la Corderie, 06230 Villefranche-sur-Mer',
    distanceKm: 5.8,
    headline: 'Restauration de fresques murales, façades historiques et trompe-l\'œil',
    description: 'Spécialistes de la restauration du patrimoine historique niçois et ligurien. Interventions sur façades classées.',
    targetCareers: ['Peintre décorateur', 'Restaurateur du patrimoine', 'Staffeur'],
    modalities: ['Stage d\'observation guidé', 'Échange avec le chef d\'atelier'],
    phone: '04 93 01 88 99',
    email: 'contact@patrimoine-couleurs.fr',
    transitInfo: 'Train TER Villefranche-sur-Mer / Bus 15 & 607',
    coordinates: { lat: 43.704, lng: 7.311 },
    mapSvgCoords: { x: 80, y: 58 },
    source: 'Architectes des Bâtiments de France / Partenaire MonBilan+',
    verified: true
  }
];

// ----------------------------------------------------------------------------
// Fonctions utilitaires de calcul de distance et filtrage
// ----------------------------------------------------------------------------

export function filterOpportunities(
  items: LocalOpportunity[],
  filters: LocalFilterState
): LocalOpportunity[] {
  let result = [...items];

  // 1. Filtre par Catégorie
  if (filters.category !== 'ALL') {
    result = result.filter((item) => item.category === filters.category);
  }

  // 2. Filtre par Métier (insensible à la casse, match partiel sur nom ou targetCareers ou headline)
  if (filters.careerQuery && filters.careerQuery.trim()) {
    const q = filters.careerQuery.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.headline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.targetCareers.some((c) => c.toLowerCase().includes(q))
    );
  }

  // 3. Filtre par Rayon kilométrique (si renseigné)
  if (filters.radiusKm && filters.radiusKm > 0) {
    result = result.filter((item) => item.distanceKm <= filters.radiusKm);
  }

  // 4. Tri
  if (filters.sortBy === 'distance') {
    result.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (filters.sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  } else {
    // Par pertinence : met en avant les items dont le métier correspond exactement puis tri par distance
    if (filters.careerQuery && filters.careerQuery.trim()) {
      const q = filters.careerQuery.toLowerCase().trim();
      result.sort((a, b) => {
        const aDirect = a.targetCareers.some((c) => c.toLowerCase().includes(q)) ? 1 : 0;
        const bDirect = b.targetCareers.some((c) => c.toLowerCase().includes(q)) ? 1 : 0;
        if (aDirect !== bDirect) return bDirect - aDirect;
        return a.distanceKm - b.distanceKm;
      });
    } else {
      result.sort((a, b) => a.distanceKm - b.distanceKm);
    }
  }

  return result;
}

export function getCategoryCounts(items: LocalOpportunity[]): {
  total: number;
  formations: number;
  organismes: number;
  entreprises: number;
} {
  return {
    total: items.length,
    formations: items.filter((i) => i.category === 'FORMATION').length,
    organismes: items.filter((i) => i.category === 'ACCOMPAGNEMENT').length,
    entreprises: items.filter((i) => i.category === 'ENTREPRISE').length
  };
}
