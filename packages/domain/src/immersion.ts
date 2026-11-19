// ============================================================================
// @monbilan/domain — Module Immersion Professionnelle (Immersion Pro)
// Règles métier pures, États du parcours 6 étapes, Génération de kit & Synthèse
// ============================================================================

export type ImmersionStatus =
  | 'DRAFT'
  | 'PREPARING'
  | 'SEARCHING'
  | 'APPLICATION_PENDING'
  | 'COMPANY_ACCEPTED'
  | 'ADMIN_PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ApplicationStatus =
  | 'DRAFT'
  | 'READY_TO_SEND'
  | 'SENT'
  | 'WAITING_REPLY'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

export interface DomainImmersionProject {
  id: string;
  tenantId: string;
  youngProfileId: string;
  careerId: string;
  careerTitle: string;
  step: number; // 1 à 6
  status: ImmersionStatus;
  selectedCompany?: string;
  companyContact?: string;
  targetDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DomainPartnerCompany {
  id: string;
  tenantId: string;
  name: string;
  sector: string;
  city: string;
  distanceKm?: number;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  verifiedPartner: boolean;
  careersOffered: string[];
}

export interface DomainImmersionApplication {
  id: string;
  projectId: string;
  companyName: string;
  careerTitle: string;
  targetPeriod: string;
  messageBody: string;
  status: ApplicationStatus;
  counselorHelp: boolean;
  createdAt: string;
}

export interface DomainObservationEntry {
  id: string;
  projectId: string;
  dayNumber: number;
  discoveredText?: string;
  surprisedText?: string;
  questionText?: string;
  createdAt: string;
}

export interface DomainImmersionReview {
  id: string;
  projectId: string;
  careerTitle: string;
  companyName?: string;
  likedAspects?: string;
  dislikedAspects?: string;
  surprises?: string;
  wantToPursue: boolean;
  questionsToAsk?: string;
  sharedWithCounselor: boolean;
  counselorNotes?: string;
}

// ----------------------------------------------------------------------------
// Activités suggérées concrètes à observer (sourcées sans hallucination)
// ----------------------------------------------------------------------------
export function generateObservationActivities(careerTitle: string): string[] {
  const normalized = careerTitle.toLowerCase();

  if (normalized.includes('peintre') || normalized.includes('décorateur')) {
    return [
      'Préparation des supports : ponçage, nettoyage, rebouchage et sous-couches',
      'Découverte des outils, pigments, vernis et matériaux adaptés aux surfaces',
      'Observation des gestes techniques : rechampir, rouler, patines ou effets de matière',
      'Organisation de l’atelier ou du chantier : protection, ventilation et sécurité',
      'Échange avec le client ou chef de chantier sur le rendu visuel et les finitions'
    ];
  }

  if (normalized.includes('son') || normalized.includes('technicien')) {
    return [
      'Câblage, branchement des micros et vérification de la chaîne électroacoustique',
      'Installation et balance des instruments ou voix (soundcheck)',
      'Découverte de la console de mixage (gain, égalisation, effets, retours)',
      'Respect des niveaux sonores et normes de protection auditive',
      'Coordination avec les artistes, musiciens ou régisseurs de plateau'
    ];
  }

  if (normalized.includes('barista') || normalized.includes('restauration') || normalized.includes('cuisinier')) {
    return [
      'Réglage du moulin et extraction des expressos selon les origines de café',
      'Techniques de texturation du lait à la buse vapeur (mousse, latte art)',
      'Respect strict des normes d’hygiène alimentaire (HACCP) et chaîne du froid',
      'Gestion du flux des commandes et accueil personnalisé de la clientèle',
      'Entretien et détartrage du matériel professionnel en fin de service'
    ];
  }

  if (normalized.includes('guide') || normalized.includes('touristique')) {
    return [
      'Repérage de l’itinéraire et vérification des horaires d’accès aux monuments',
      'Prise en charge d’un groupe de visiteurs et consignes de sécurité',
      'Transmission d’éléments historiques et anecdotes avec clarté et bienveillance',
      'Gestion du temps, du rythme de marche et des questions du public',
      'Adaptation du discours en fonction du profil des visiteurs (familles, scolaires)'
    ];
  }

  // Par défaut : activités d'observation professionnelles concrètes et adaptées
  return [
    `Observation du démarrage d'une journée de travail dans le métier de ${careerTitle}`,
    'Découverte des outils, équipements de protection et logiciels utilisés',
    'Compréhension de la répartition des tâches au sein de l’équipe',
    'Sensibilisation aux consignes de sécurité et exigences de qualité',
    'Échange sur les parcours de formation et l’évolution professionnelle'
  ];
}

// ----------------------------------------------------------------------------
// Questions bienveillantes à poser au professionnel
// ----------------------------------------------------------------------------
export function generateQuestionsToAsk(careerTitle: string): string[] {
  return [
    `À quoi ressemble une journée type dans votre métier de ${careerTitle} ?`,
    'Qu’est-ce qui vous plaît le plus au quotidien dans vos missions ?',
    'Quelles sont les qualités et compétences les plus utiles pour réussir ?',
    'Quel a été votre parcours de formation pour en arriver là ?',
    'Quel conseil donneriez-vous à un jeune de 16 ans qui s’intéresse à votre métier ?'
  ];
}

// ----------------------------------------------------------------------------
// Générateur de message de candidature (stage d'observation / immersion)
// ----------------------------------------------------------------------------
export function generateApplicationDraft(
  youngName: string,
  careerTitle: string,
  companyName: string,
  targetPeriod: string = 'une période de stage d’observation de 1 à 5 jours'
): string {
  return `Objet : Demande de stage d'observation — ${careerTitle}

Bonjour,

Je m'appelle ${youngName || 'Emma'}. Je suis actuellement accompagnée par le Centre des Possibles dans le cadre de ma réflexion d'orientation professionnelle.

Dans le cadre de mon projet d'orientation, je souhaite découvrir concrètement sur le terrain le métier de ${careerTitle}. J'ai identifié votre structure (${companyName}) pour la qualité de vos réalisations.

Serait-il envisageable pour vous de m'accueillir pour ${targetPeriod}, sous réserve d'une convention de stage délivrée par mon établissement ?

Je reste à votre disposition pour convenir d'un échange ou vous transmettre ma convention.

Je vous remercie sincèrement pour l'attention portée à ma demande.

Bien cordialement,
${youngName || 'Emma D.'}`;
}
