// ============================================================================
// Données et Définitions — Parcours Autonome (MonBilan+ Web)
// ============================================================================

export type JourneyMode = 'AUTONOMOUS' | 'SUPPORTED';

export type CareerInterestFilter =
  | 'ALL'
  | 'CREATIVE'
  | 'CRAFT'
  | 'CARE'
  | 'ORGANIZATION'
  | 'DIGITAL'
  | 'NATURE';

export interface UICatalogCareer {
  id: string;
  onetSocCode: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  jobZone: number;
  jobZoneJustification: string;
  category: CareerInterestFilter;
  categoryLabelFr: string;
  categoryIcon: string;
  suggestedActivities: string[];
  suggestedQuestions: string[];
  suggestedPathways: string[];
  imageUrl: string;
  isFavorite: boolean;
}

export interface UISupportResource {
  id: string;
  name: string;
  category: 'SCHOOL' | 'MISSION_LOCALE' | 'CIO' | 'NATIONAL_PORTAL';
  categoryLabel: string;
  description: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  websiteUrl: string;
  isOfficialPublicService: boolean;
  badgeLabel: string;
  icon: string;
}

export const INTEREST_CATEGORIES_CONFIG: Array<{
  id: CareerInterestFilter;
  label: string;
  icon: string;
  colorClass: string;
}> = [
  { id: 'ALL', label: 'Tous les métiers', icon: 'sparkles', colorClass: 'bg-purple-100 text-purple-800' },
  { id: 'CREATIVE', label: 'Créer / Artistique', icon: 'palette', colorClass: 'bg-pink-100 text-pink-800' },
  { id: 'CRAFT', label: 'Bricoler / Construire', icon: 'hammer', colorClass: 'bg-amber-100 text-amber-800' },
  { id: 'CARE', label: 'Aider / Accompagner', icon: 'handshake', colorClass: 'bg-emerald-100 text-emerald-800' },
  { id: 'ORGANIZATION', label: 'Organiser / Gérer', icon: 'chart-column', colorClass: 'bg-blue-100 text-blue-800' },
  { id: 'DIGITAL', label: 'Numérique', icon: 'laptop', colorClass: 'bg-indigo-100 text-indigo-800' },
  { id: 'NATURE', label: 'Nature / Environnement', icon: 'leaf', colorClass: 'bg-teal-100 text-teal-800' }
];

export const INITIAL_SUPPORT_RESOURCES: UISupportResource[] = [
  {
    id: 'supp-cio-nice-centre',
    name: "Centre d'Information et d'Orientation (CIO) Nice Centre",
    category: 'CIO',
    categoryLabel: "CIO & Professionnels de l'orientation",
    description: "Service public gratuit de l'Éducation nationale pour vous conseiller dans vos choix d'orientation, d'études et de formation.",
    address: '15 rue Delille',
    city: 'Nice',
    postalCode: '06000',
    phone: '04 93 62 49 49',
    email: 'cio-nice@ac-nice.fr',
    websiteUrl: 'https://www.ac-nice.fr/orientation',
    isOfficialPublicService: true,
    badgeLabel: 'Service Public Gratuit',
    icon: 'landmark'
  },
  {
    id: 'supp-cio-nice-valrose',
    name: "Centre d'Information et d'Orientation (CIO) Nice Valrose",
    category: 'CIO',
    categoryLabel: "CIO & Professionnels de l'orientation",
    description: 'Accompagnement personnalisé pour les collégiens, lycéens, étudiants et jeunes en recherche de voie.',
    address: 'Campus Valrose - Bâtiment des Sciences',
    city: 'Nice',
    postalCode: '06108',
    phone: '04 93 84 89 22',
    email: 'cio-valrose@ac-nice.fr',
    websiteUrl: 'https://www.ac-nice.fr/orientation',
    isOfficialPublicService: true,
    badgeLabel: 'Service Public Gratuit',
    icon: 'graduation-cap'
  },
  {
    id: 'supp-ml-nice',
    name: 'Mission Locale Nice Côte d’Azur',
    category: 'MISSION_LOCALE',
    categoryLabel: 'Mission Locale',
    description: 'Accompagnement global des jeunes de 16 à 25 ans vers l’emploi, la formation, le logement, la citoyenneté et la santé.',
    address: 'Hub de l’Innovation - 1-3 Bd René Cassin',
    city: 'Nice',
    postalCode: '06200',
    phone: '04 93 18 35 00',
    email: 'contact@mlnice.fr',
    websiteUrl: 'https://www.missionlocale-nice.org',
    isOfficialPublicService: true,
    badgeLabel: '16–25 ans',
    icon: 'handshake'
  },
  {
    id: 'supp-school-college-lycee',
    name: 'Équipes pédagogiques de ton Établissement Scolaire',
    category: 'SCHOOL',
    categoryLabel: 'Mon établissement scolaire',
    description: 'Ton professeur principal, les psychologues de l’Éducation Nationale (Psy-EN) et le secrétariat t’aident à formaliser tes démarches et valident tes conventions de stage.',
    address: 'Auprès de ton secrétariat ou vie scolaire',
    city: 'Nice & Métropole',
    websiteUrl: 'https://www.education.gouv.fr/orientation-college-lycee',
    isOfficialPublicService: true,
    badgeLabel: 'Collège / Lycée',
    icon: 'school'
  },
  {
    id: 'supp-1jeune1solution',
    name: '1jeune1solution (Gouvernement)',
    category: 'NATIONAL_PORTAL',
    categoryLabel: 'Ressources en ligne officielles',
    description: 'Plateforme nationale officielle pour trouver un stage, une formation, une alternance ou un accompagnement de proximité.',
    websiteUrl: 'https://www.1jeune1solution.gouv.fr',
    isOfficialPublicService: true,
    badgeLabel: 'Portail Officiel',
    icon: 'flag'
  },
  {
    id: 'supp-immersion-facilee',
    name: 'Immersion Facilitée (Service Public)',
    category: 'NATIONAL_PORTAL',
    categoryLabel: 'Ressources en ligne officielles',
    description: 'Trouvez facilement une entreprise accueillante pour réaliser une immersion professionnelle (PMSMP) conventionnée.',
    websiteUrl: 'https://immersion-facilee.beta.gouv.fr',
    isOfficialPublicService: true,
    badgeLabel: 'Convention PMSMP',
    icon: 'briefcase'
  }
];

export function mapCategoryIcon(category: CareerInterestFilter): string {
  switch (category) {
    case 'CREATIVE': return 'palette';
    case 'CRAFT': return 'hammer';
    case 'CARE': return 'handshake';
    case 'ORGANIZATION': return 'chart-column';
    case 'DIGITAL': return 'laptop';
    case 'NATURE': return 'leaf';
    default: return 'briefcase';
  }
}

export interface SavedDraft {
  id: string;
  type: 'EMAIL' | 'CALL_SCRIPT' | 'SUPPORT_MESSAGE';
  title: string;
  careerTitle?: string;
  recipient?: string;
  content: string;
  date: string;
}

export function loadSavedDrafts(): SavedDraft[] {
  try {
    const raw = localStorage.getItem('monbilan_young_saved_drafts');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDraftItem(draft: SavedDraft): void {
  try {
    const drafts = loadSavedDrafts().filter(d => d.id !== draft.id);
    drafts.unshift(draft);
    localStorage.setItem('monbilan_young_saved_drafts', JSON.stringify(drafts.slice(0, 10)));
  } catch {
    // ignore
  }
}

