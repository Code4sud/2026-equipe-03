// ============================================================================
// Données et État du Moteur de Restitution Augmentée — MonBilan+
// 6 Épisodes Thématiques Calibrés (~2 min) et Rapprochement Supervisé des 22 Métiers
// ============================================================================

export interface UICareerAssessment {
  careerId: string;
  originalTitle: string;
  jobZone: number;
  rankInZone: number;
  pageNumber: number;
  description: string;
  proposedStatus: 'TO_DEEPEN' | 'TO_EXPLORE' | 'DEFERRED' | 'NEEDS_REVIEW';
  finalStatus: 'TO_DEEPEN' | 'TO_EXPLORE' | 'DEFERRED' | 'NEEDS_REVIEW';
  rationale: string;
  counselorNote?: string;
  isModified: boolean;
  isValidated: boolean;
}

export interface UIEpisode {
  episodeNumber: number;
  topicKey: string;
  title: string;
  subtitle: string;
  targetDurationSec: number;
  wordCount: number;
  script: string;
  sourceReferences: Array<{ page: number; excerpt: string }>;
  transcriptSegments: Array<{ startMs: number; endMs: number; text: string }>;
  isCompliant: boolean;
  validationStatus: 'DRAFT' | 'NEEDS_REVIEW' | 'APPROVED';
}

export const INITIAL_INTERVIEW_FORM = {
  counselorName: 'Sophie V. (Psychologue de l’Éducation Nationale)',
  interviewDate: '14/10/2026',
  objective:
    'Restitution guidée du bilan d’orientation du Centre des Possibles et validation conjointe des pistes professionnelles.',
  synthesis:
    'Entretien très participatif. Emma confirme un attrait majeur pour la création artistique, le son, le graphisme et la scénographie. Elle souhaite écarter le développement web pur (codage abstrait) et privilégier les filières concrètes mêlant créativité et technique.',
  expressedInterests: [
    'Création artistique & audiovisuelle',
    'Travail du son, mixage et scénographie',
    'Médiation culturelle et communication visuelle'
  ],
  explicitCareers: [
    'Technicien du son',
    'Graphiste',
    'Peintre décorateur',
    'Scénographe'
  ],
  motivations: [
    'Envie d’allier créativité esthétique et compétences techniques de terrain',
    'Préférence pour les projets d’équipe concrets et les réalisations tangibles',
    'Sensibilité aux univers du spectacle vivant, du jeu vidéo et de la culture'
  ],
  reservations: [
    'Développeur web : pas d’attrait pour l’abstraction informatique pure ou les longues sessions d’écran seul',
    'Horaires atypiques permanents ou déplacements lointains non souhaités à court terme'
  ],
  professionalConclusions: {
    tracksToDeepen: ['Technicien du son', 'Graphiste'],
    tracksToExplore: ['Peintre décorateur', 'Scénographe'],
    pointsToClarify: ['Conditions de stage d’observation en régie de spectacle'],
    suggestedNextSteps: ['Consulter les formations BTS Audiovisuel et DN MADE Graphisme en Région Sud']
  },
  newInterestInput: '',
  newCareerInput: '',
  newMotivationInput: '',
  newReservationInput: ''
};

export const INITIAL_CAREER_ASSESSMENTS: UICareerAssessment[] = [
  // Zone 1
  {
    careerId: 'c-z1-1',
    originalTitle: 'Peintre décorateur',
    jobZone: 1,
    rankInZone: 1,
    pageNumber: 8,
    description: 'Prépare et applique des peintures, vernis et revêtements sur meubles, objets ou intérieurs.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 1, p. 8). Mentionnée avec curiosité lors de l’échange, à garder pour des stages courts.',
    counselorNote: 'Bonne idée d’atelier découverte en immersion artisanale.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z1-2',
    originalTitle: 'Barista',
    jobZone: 1,
    rankInZone: 2,
    pageNumber: 8,
    description: 'Prépare et sert des cafés de spécialité et boissons, accueille et conseille la clientèle.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 1, p. 8). Non prioritaire mais conservée pour des jobs étudiants ou saisonniers.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z1-3',
    originalTitle: 'Mannequin',
    jobZone: 1,
    rankInZone: 3,
    pageNumber: 9,
    description: 'Pose ou défile pour présenter des vêtements, accessoires ou produits lors de séances photo.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 1, p. 9). Piste ouverte sans demande spécifique.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z1-4',
    originalTitle: 'Plaquiste',
    jobZone: 1,
    rankInZone: 4,
    pageNumber: 9,
    description: 'Pose des plaques de plâtre, monte des cloisons, faux plafonds et isolations thermiques/acoustiques.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 1, p. 9). Volet aménagement d’espace à explorer si souhait de chantiers.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z1-5',
    originalTitle: 'Coiffeur',
    jobZone: 1,
    rankInZone: 5,
    pageNumber: 9,
    description: 'Coupe, coiffe, colore et soigne les cheveux selon les demandes des clients.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 1, p. 9). Piste manuelle et créative conservée.',
    isModified: false,
    isValidated: true
  },

  // Zone 2
  {
    careerId: 'c-z2-1',
    originalTitle: 'Agent d’escale ferroviaire',
    jobZone: 2,
    rankInZone: 1,
    pageNumber: 10,
    description: 'Accueille, oriente et informe les voyageurs en gare, gère les flux et la sécurité sur les quais.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 2, p. 10). Piste relationnelle conservée.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z2-2',
    originalTitle: 'Guide touristique',
    jobZone: 2,
    rankInZone: 2,
    pageNumber: 10,
    description: 'Accompagne des visiteurs et commente des circuits culturels, monuments ou sites naturels.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 2, p. 10). Valorise le pôle communication et culture.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z2-3',
    originalTitle: 'Technicien d’installation de systèmes de sécurité',
    jobZone: 2,
    rankInZone: 3,
    pageNumber: 10,
    description: 'Installe, paramètre et entretient des alarmes, vidéosurveillances et contrôles d’accès.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 2, p. 10). Piste technique conservée.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z2-4',
    originalTitle: 'Photographe scolaire et de portrait',
    jobZone: 2,
    rankInZone: 4,
    pageNumber: 10,
    description: 'Réalise des portraits en studio ou en établissement scolaire, traite et retouche les clichés.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 2, p. 10). Lien direct avec l’image et l’art visuel.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z2-5',
    originalTitle: 'Régisseur d’événements junior',
    jobZone: 2,
    rankInZone: 5,
    pageNumber: 10,
    description: 'Aide à l’organisation logistique, technique et scénique d’événements culturels ou festifs.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 2, p. 10). Proche du monde du spectacle et du son.',
    isModified: false,
    isValidated: true
  },

  // Zone 3
  {
    careerId: 'c-z3-1',
    originalTitle: 'Technicien du son',
    jobZone: 3,
    rankInZone: 1,
    pageNumber: 12,
    description: 'Capte, enregistre, mixe et diffuse le son pour des concerts, spectacles, tournages ou studios.',
    proposedStatus: 'TO_DEEPEN',
    finalStatus: 'TO_DEEPEN',
    rationale: 'Priorité absolue validée en entretien : intérêt explicite d’Emma pour l’acoustique, la régie et le mixage.',
    counselorNote: 'Priorité n°1. Organiser une immersion 360° dans l’Agora des Métiers et cibler les BTS Audiovisuel régionaux.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z3-2',
    originalTitle: 'Graphiste',
    jobZone: 3,
    rankInZone: 2,
    pageNumber: 11,
    description: 'Conçoit des identités visuelles, affiches, supports numériques et chartes graphiques.',
    proposedStatus: 'TO_DEEPEN',
    finalStatus: 'TO_DEEPEN',
    rationale: 'Priorité partagée : forte appétence pour la création visuelle et le design confirmée lors de l’entretien.',
    counselorNote: 'Priorité n°2. Explorer les options DN MADE Graphisme en Région Sud.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z3-3',
    originalTitle: 'Développeur web',
    jobZone: 3,
    rankInZone: 3,
    pageNumber: 11,
    description: 'Programme des sites et applications web à l’aide de langages de programmation.',
    proposedStatus: 'DEFERRED',
    finalStatus: 'DEFERRED',
    rationale: 'Piste différée d’un commun accord : Emma a explicitement exprimé ne pas souhaiter faire de programmation abstraite en solo.',
    counselorNote: 'Mise de côté sans pression. Pourra être reconsidérée si un intérêt pour le web design pur émerge.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z3-4',
    originalTitle: 'Animateur Radio',
    jobZone: 3,
    rankInZone: 4,
    pageNumber: 12,
    description: 'Conçoit et anime des émissions, interviews et chroniques radiophoniques en direct ou enregistrées.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 3, p. 12). Complément intéressant au travail de régie et de studio sonore.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z3-5',
    originalTitle: 'Scénographe',
    jobZone: 3,
    rankInZone: 5,
    pageNumber: 12,
    description: 'Conçoit les décors, espaces et ambiances scéniques pour le théâtre, l’opéra ou des expositions.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 3, p. 12). Reliée aux intérêts d’agencement créatif et d’art du spectacle.',
    isModified: false,
    isValidated: true
  },

  // Zone 4
  {
    careerId: 'c-z4-1',
    originalTitle: 'Professeur des écoles',
    jobZone: 4,
    rankInZone: 1,
    pageNumber: 15,
    description: 'Enseigne les matières fondamentales aux enfants de 6 à 11 ans en école primaire.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 4, p. 15). Piste pédagogique et transmission conservée.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z4-2',
    originalTitle: 'Médiateur culturel',
    jobZone: 4,
    rankInZone: 2,
    pageNumber: 15,
    description: 'Conçoit des actions et animations pour faire découvrir des expositions ou œuvres d’art au public.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 4, p. 15). Bonne cohérence avec le profil artistique et social.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z4-3',
    originalTitle: 'Chargé de production de spectacles',
    jobZone: 4,
    rankInZone: 3,
    pageNumber: 15,
    description: 'Organise la faisabilité technique, administrative et financière d’un spectacle ou festival.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 4, p. 15). Alliant organisation et milieu artistique.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z4-4',
    originalTitle: 'Régisseur général',
    jobZone: 4,
    rankInZone: 4,
    pageNumber: 15,
    description: 'Supervise l’ensemble des équipes son, lumière et plateau lors d’une production théâtrale ou musicale.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 4, p. 15). Évolution naturelle envisageable après Technicien du son.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z4-5',
    originalTitle: 'Concepteur de jeux vidéo junior',
    jobZone: 4,
    rankInZone: 5,
    pageNumber: 15,
    description: 'Définit les règles de jeu, les univers narratifs et la mécanique d’interaction joueur.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 4, p. 15). Piste créative numérique conservée.',
    isModified: false,
    isValidated: true
  },

  // Zone 5
  {
    careerId: 'c-z5-1',
    originalTitle: "Enseignant en arts, théâtre et musique dans l'enseignement supérieur",
    jobZone: 5,
    rankInZone: 1,
    pageNumber: 16,
    description: 'Enseigne le théâtre, la musique ou les arts plastiques au niveau universitaire ou conservatoire.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 5, p. 16). Filière longue conservée comme piste d’horizon.',
    isModified: false,
    isValidated: true
  },
  {
    careerId: 'c-z5-2',
    originalTitle: 'Praticien en Activité Physique Adaptée (APA)',
    jobZone: 5,
    rankInZone: 2,
    pageNumber: 16,
    description: 'Évalue les capacités physiques et conçoit des séances de motricité pour des publics à besoins spécifiques.',
    proposedStatus: 'TO_EXPLORE',
    finalStatus: 'TO_EXPLORE',
    rationale: 'Piste issue du rapport (Zone 5, p. 16). Conservée pour mémoire, sans priorité immédiate.',
    isModified: false,
    isValidated: true
  }
];

export const INITIAL_AUDIO_EPISODES: UIEpisode[] = [
  {
    episodeNumber: 1,
    topicKey: 'COMPRENDRE_BILAN',
    title: 'Comprendre mon bilan',
    subtitle: 'Pourquoi ce bilan, ce qu’il contient et comment lire tes résultats sans pression.',
    targetDurationSec: 120,
    wordCount: 253,
    isCompliant: true,
    validationStatus: 'APPROVED',
    sourceReferences: [
      { page: 1, excerpt: 'Ton rapport des possibles – Rdv 2187 | Explore ton avenir professionnel.' },
      { page: 2, excerpt: 'Structure du bilan : Intérêts RIASEC, Aptitudes cognitives, Personnalité HEXACO et 22 métiers.' },
      { page: 17, excerpt: '« Les résultats présentés proviennent de travaux expérimentaux et constituent des pistes de réflexion à un instant T. »' }
    ],
    script:
      "Bonjour et bienvenue dans ton espace MonBilan+. Ce premier épisode t'explique comment a été construit ton bilan d'orientation et comment l'utiliser sereinement. Ton rapport du Centre des Possibles, référence Rdv 2187, fait 17 pages. C'est un document très riche mais qui ne prétend pas définir qui tu es de façon figée. Comme le rappelle expressément la page 17 du rapport, ces résultats proviennent de travaux expérimentaux et constituent des pistes de réflexion à un instant T, et non un jugement définitif sur tes capacités. Le bilan croise trois éléments essentiels : tes centres d'intérêt professionnels selon le modèle RIASEC en page 4, neuf aptitudes cognitives mesurées à travers des jeux d'observation en page 5, et six dimensions de personnalité au travail issues du modèle HEXACO en page 6. À partir de ces repères, 22 métiers ont été suggérés, répartis sur cinq zones de préparation. Avec ton conseiller, vous avez pris le temps d'échanger pour confronter ces données à tes envies réelles. MonBilan+ a pour unique vocation de valoriser ce travail, sans rien inventer ni retirer. Tu pourras écouter tes résultats thématiques, explorer les fiches métiers et poser toutes tes questions. Prends ce bilan comme une boussole bienveillante pour ton avenir.",
    transcriptSegments: [
      { startMs: 0, endMs: 25000, text: "Bonjour et bienvenue dans ton espace MonBilan+. Ce premier épisode t'explique comment a été construit ton bilan d'orientation et comment l'utiliser sereinement." },
      { startMs: 25000, endMs: 50000, text: "Ton rapport du Centre des Possibles, référence Rdv 2187, fait 17 pages. Comme le rappelle expressément la page 17, ces données constituent des pistes de réflexion à un instant T." },
      { startMs: 50000, endMs: 80000, text: "Le bilan croise tes intérêts RIASEC en page 4, tes aptitudes cognitives en page 5, et tes six traits HEXACO en page 6 pour proposer 22 métiers sur cinq zones." },
      { startMs: 80000, endMs: 120000, text: "MonBilan+ valorise fidèlement ce rapport validé par ton conseiller. Prends ce bilan comme une boussole bienveillante pour ton avenir professionnel." }
    ]
  },
  {
    episodeNumber: 2,
    topicKey: 'RIASEC_INTERETS',
    title: 'Mes centres d’intérêt (RIASEC)',
    subtitle: 'Tes domaines préférés issus de la page 4 du rapport.',
    targetDurationSec: 120,
    wordCount: 254,
    isCompliant: true,
    validationStatus: 'APPROVED',
    sourceReferences: [
      { page: 4, excerpt: 'Profil RIASEC : Artistique, Entreprenant, Réaliste, Investigateur, Social, Conventionnel.' },
      { page: 4, excerpt: 'Artistique : Les personnes aiment les activités qui leur permettent de s’exprimer (littérature, musique, graphisme, création).' }
    ],
    script:
      "Explorons maintenant tes centres d'intérêt professionnels, détaillés à la page 4 de ton rapport. Le modèle RIASEC classe les motivations en six grandes familles : Réaliste, Investigateur, Artistique, Social, Entreprenant et Conventionnel. Ton profil met particulièrement en valeur l'axe Artistique en première position. Cela signifie que tu as un besoin fort d'expression personnelle, d'imagination et de création. Tu t'épanouis dans les activités où tu peux concevoir, dessiner, agencer des sons ou imaginer des formes nouvelles. En deuxième position apparaît la dimension Entreprenante. Tu aimes convaincre, porter des initiatives, communiquer et défendre des projets avec énergie. Ton troisième pôle dominant est le Réaliste. Tu apprécies le travail concret, l'usage d'outils précis et le contact direct avec la matière. Viennent ensuite les pôles Investigateur pour l'analyse, Social pour l'accompagnement d'autrui, et Conventionnel pour la rigueur d'organisation. Ce trio de tête Artistique, Entreprenant et Réaliste est très cohérent : il relie la sensibilité créative à l'action concrète et à l'esprit d'initiative. Lors de ton entretien avec ton conseiller, tu as confirmé ce goût pour les univers du spectacle, du son, de la création graphique et de l'aménagement. C'est sur ce socle solide que reposent les métiers qui te correspondent le mieux. N'hésite pas à réécouter ce passage pour bien t'imprégner de tes forces motrices.",
    transcriptSegments: [
      { startMs: 0, endMs: 30000, text: "Explorons tes centres d'intérêt professionnels présentés page 4. Le modèle RIASEC classe les motivations en six familles dominantes." },
      { startMs: 30000, endMs: 65000, text: "Ton profil met en avant l'axe Artistique en tête, suivi d'Entreprenant et de Réaliste. Tu aimes créer, porter des projets et agir concrètement." },
      { startMs: 65000, endMs: 95000, text: "Ce trio relie ton goût pour le visuel, l'ambiance sonore et l'artisanat aux projets d'équipe concrets." },
      { startMs: 95000, endMs: 120000, text: "Lors de l'entretien, tu as pleinement confirmé ces envies dans le spectacle et la communication visuelle." }
    ]
  },
  {
    episodeNumber: 3,
    topicKey: 'APTITUDES_COGNITIVES',
    title: 'Mes aptitudes et points d’appui',
    subtitle: 'Les fonctions cognitives explorées page 5 (photo à un instant T).',
    targetDurationSec: 120,
    wordCount: 261,
    isCompliant: true,
    validationStatus: 'APPROVED',
    sourceReferences: [
      { page: 5, excerpt: 'Évaluation de 9 fonctions cognitives : Flexibilité des catégories, Partage du temps, Mémorisation...' },
      { page: 5, excerpt: 'Réserve : mesure instantanée dépendante des conditions d’attention le jour du test.' }
    ],
    script:
      "Parlons à présent de tes aptitudes cognitives, présentées à la page 5 de ton document. Les tests ont exploré neuf fonctions intellectuelles à travers des exercices interactifs : la flexibilité des catégories, le partage du temps, la visualisation spatiale, la mémoire de travail, le raisonnement inductif et déductif, la vitesse perceptive, la fluidité d'idées et la manipulation numérique. Il est indispensable de rappeler une réserve méthodologique majeure : ces résultats représentent une photographie prise dans les conditions particulières du jour de passation. Ils ne constituent en aucun cas une mesure définitive ou un plafond de ton potentiel intellectuel. Tes résultats montrent de très beaux points d'appui, notamment dans la capacité à percevoir des ensembles visuels, à jongler avec plusieurs règles et à trouver des solutions originales. Ces forces correspondent parfaitement à ton profil créatif. Dans les métiers techniques ou artistiques, cette agilité mentale te permet d'adapter rapidement une scénographie, de caler une bande-son complexe ou de résoudre un problème pratique sur un plateau ou en atelier. Si certains exercices t'ont semblé moins naturels, c'est tout à fait classique et cela ne bloque aucune de tes ambitions. Les compétences se développent tout au long de la formation et de la pratique. Ton conseiller est à tes côtés pour valoriser tes véritables forces de travail.",
    transcriptSegments: [
      { startMs: 0, endMs: 30000, text: "À la page 5, le rapport explore neuf fonctions cognitives via des exercices d'observation et de logique." },
      { startMs: 30000, endMs: 60000, text: "Rappel essentiel : ces tests ne figent rien, ils capturent une photo à un instant T qui dépend de ta forme le jour de la passation." },
      { startMs: 60000, endMs: 90000, text: "Tes points forts résident dans l'agilité visuelle, la flexibilité et la résolution concrète de problèmes." },
      { startMs: 90000, endMs: 120000, text: "Ces qualités sont idéales pour adapter une régie son, caler une maquette graphique ou ajuster un décor." }
    ]
  },
  {
    episodeNumber: 4,
    topicKey: 'HEXACO_PERSONNALITE',
    title: 'Ma personnalité au travail (HEXACO)',
    subtitle: 'Tes repères personnels page 6 : aucun profil n’est bon ou mauvais.',
    targetDurationSec: 120,
    wordCount: 262,
    isCompliant: true,
    validationStatus: 'APPROVED',
    sourceReferences: [
      { page: 6, excerpt: 'Radar HEXACO : 1. Émotivité, 2. Ouvert à l’expérience, 3. Agréabilité, 4. Humilité-honnêteté, 5. Extraversion, 6. Caractère consciencieux.' },
      { page: 6, excerpt: 'Aucun profil de personnalité n’est bon ou mauvais : ce sont des préférences comportementales au travail.' }
    ],
    script:
      "Découvrons ensemble ta personnalité au travail à travers le modèle HEXACO exposé en page 6. Ce modèle scientifique évalue six traits fondamentaux : l'Émotivité, l'Ouverture à l'expérience, l'Agréabilité, l'Humilité-Honnêteté, l'Extraversion et le Caractère consciencieux. Le principe fondamental est qu'il n'existe aucun profil idéal : chaque manière d'être présente des atouts précieux selon les environnements professionnels. Ton radar met en lumière une grande sensibilité et une forte Ouverture à l'expérience. Tu es curieuse des nouveautés culturelles, réceptive aux ambiances esthétiques et ouverte aux approches non conventionnelles. Ton Agréabilité se traduit par une volonté d'harmonie et une bonne capacité à t'intégrer dans un collectif sans chercher le conflit stérile. Ton niveau d'Humilité-Honnêteté reflète une recherche de transparence et d'authenticité dans tes relations. En matière d'Extraversion et de caractère consciencieux, ton profil montre un équilibre intéressant : tu apprécies de collaborer sur des projets enthousiasmants tout en préservant tes moments de concentration personnelle. Ce profil d'artiste sensible, ouvert et loyal correspond harmonieusement aux métiers créatifs où l'intuition et l'esprit d'équipe font la différence. Lors de l'entretien, tu as d'ailleurs souligné ton souhait de travailler dans un climat de confiance réciproque et d'entraide. Ce bilan confirme que ta personnalité est un véritable levier pour ton avenir.",
    transcriptSegments: [
      { startMs: 0, endMs: 30000, text: "La page 6 présente ton radar de personnalité HEXACO. Aucun profil n'est bon ou mauvais, ce sont des repères personnels." },
      { startMs: 30000, endMs: 60000, text: "Ton profil révèle une grande ouverture à l'expérience, une belle sensibilité esthétique et une recherche d'harmonie collective." },
      { startMs: 60000, endMs: 90000, text: "Tu privilégies l'authenticité et le travail bienveillant en équipe tout en sachant rester concentrée." },
      { startMs: 90000, endMs: 120000, text: "Ces traits sont des forces précieuses pour concevoir des ambiances et collaborer sur des projets culturels." }
    ]
  },
  {
    episodeNumber: 5,
    topicKey: 'METIERS_EXPLORER',
    title: 'Les métiers que je souhaite explorer',
    subtitle: 'Les pistes prioritaires issues du rapport et validées lors de notre échange.',
    targetDurationSec: 120,
    wordCount: 273,
    isCompliant: true,
    validationStatus: 'APPROVED',
    sourceReferences: [
      { page: 8, excerpt: 'Zone 1 : Peintre décorateur, Barista, Mannequin, Plaquiste, Coiffeur.' },
      { page: 11, excerpt: 'Zone 3 : Graphiste, Développeur web, Technicien du son, Animateur Radio, Scénographe.' },
      { page: 12, excerpt: 'Technicien du son (p. 12) : capte, mixe et diffuse le son.' }
    ],
    script:
      "Abordons le cœur de ton projet : les métiers identifiés dans ton bilan, détaillés de la page 8 à la page 16. Le Centre des Possibles a sélectionné 22 métiers répartis sur cinq zones de préparation selon le niveau de formation requis. Le rapprochement supervisé entre ce rapport et ton entretien a permis de dégager des priorités très claires. Deux métiers ressortent immédiatement avec le statut À approfondir. Le premier est Technicien du son, situé en zone 3 à la page 12. Il associe parfaitement ton amour de l'acoustique, de la musique et de la technique concrète. Le second est Graphiste, également en zone 3 page 11, qui valorise ton sens du visuel et de la conception. Parallèlement, 19 autres métiers du rapport restent classés À explorer. Parmi eux, Peintre décorateur en zone 1 page 8, Barista, Guide touristique ou encore Scénographe. L'absence de discussion approfondie sur ces métiers ne signifie absolument pas un désintérêt : ils demeurent des pistes ouvertes pour tes stages ou découvertes futures. Enfin, une piste a été classée Différée d'un commun accord lors de l'entretien : Développeur web en zone 3 page 11. Tu as clairement exprimé ne pas souhaiter passer tes journées uniquement devant du code informatique abstrait. Cette décision raisonnée te permet de concentrer ton énergie sur ce qui te motive vraiment. Tu peux consulter chaque fiche dans ton onglet Métiers.",
    transcriptSegments: [
      { startMs: 0, endMs: 30000, text: "Des pages 8 à 16, 22 métiers sont proposés sur cinq zones de préparation. Le rapprochement avec ton entretien dégage des priorités claires." },
      { startMs: 30000, endMs: 65000, text: "Deux métiers sont classés À approfondir : Technicien du son en page 12 et Graphiste en page 11." },
      { startMs: 65000, endMs: 95000, text: "19 métiers restent classés À explorer : Peintre décorateur, Guide touristique ou Scénographe restent des pistes ouvertes." },
      { startMs: 95000, endMs: 120000, text: "La piste Développeur web est différée à ta demande pour concentrer ton énergie sur tes vraies passions." }
    ]
  },
  {
    episodeNumber: 6,
    topicKey: 'PREPARER_SUITE',
    title: 'Préparer la suite et mes questions',
    subtitle: 'Les prochaines démarches convenues avec ton conseiller.',
    targetDurationSec: 120,
    wordCount: 251,
    isCompliant: true,
    validationStatus: 'APPROVED',
    sourceReferences: [
      { page: 1, excerpt: 'Rdv 2187 — Centre des Possibles Nice.' },
      { page: 17, excerpt: 'Pistes d’action et accompagnement personnalisé.' }
    ],
    script:
      "Pour conclure cette restitution, préparons ensemble les prochaines étapes concrètes de ton parcours d'orientation. Un bilan n'a de valeur que s'il te donne des clés d'action positives pour avancer à ton propre rythme. Lors de ton entretien avec Sophie, plusieurs démarches immédiates ont été convenues. Tout d'abord, nous te proposons de tester l'atelier en vidéo 360° dans l'Agora des Métiers pour vivre une immersion réaliste dans le quotidien d'un technicien du son et d'un graphiste. Ensuite, nous allons explorer les cursus régionaux en Provence-Alpes-Côte d'Azur, notamment le BTS Métiers de l'audiovisuel option son et les diplômes nationaux DN MADE en graphisme et scénographie. Pour approfondir ces découvertes sans stress, planifier un stage d'observation court d'une semaine dans une structure culturelle ou un studio partenaire sera une excellente opportunité. Ton espace MonBilan+ reste à ta disposition : tu peux y réécouter ces six épisodes quand tu le souhaites, enregistrer tes métiers favoris et rédiger tes questions personnelles dans le carnet de suivi. Ton conseiller recevra tes interrogations et vous pourrez en reparler lors de votre prochain point d'étape. Tu as toutes les cartes en main, un profil riche et créatif, et une équipe bienveillante à tes côtés. Bonne continuation dans ton cheminement professionnel !",
    transcriptSegments: [
      { startMs: 0, endMs: 30000, text: "Concluons avec les prochaines étapes concrètes validées lors de ton entretien d'orientation." },
      { startMs: 30000, endMs: 60000, text: "Première étape : tester l'atelier vidéo 360° de l'Agora des Métiers pour Technicien du son et Graphiste." },
      { startMs: 60000, endMs: 90000, text: "Deuxième étape : explorer les BTS Audiovisuel et DN MADE Graphisme en Région Sud et envisager un stage court." },
      { startMs: 90000, endMs: 120000, text: "Utilise ton carnet de questions MonBilan+ pour noter tes interrogations. Tu as toutes les clés pour réussir !" }
    ]
  }
];
