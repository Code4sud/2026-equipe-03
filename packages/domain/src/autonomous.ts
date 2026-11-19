// ============================================================================
// Modèle de Domaine — Parcours Autonome (MonBilan+)
// ============================================================================

export type JourneyMode = 'AUTONOMOUS' | 'SUPPORTED';

export type CareerOrigin = 'GENERAL_CATALOG' | 'ORIENTATION_REPORT';

export type CareerInterestCategory =
  | 'ALL'
  | 'CREATIVE'       // Créer / Artistique
  | 'CRAFT'          // Bricoler / Construire
  | 'CARE'           // Aider / Accompagner
  | 'ORGANIZATION'   // Organiser / Gérer
  | 'DIGITAL'        // Numérique / Informatique
  | 'NATURE';        // Nature / Environnement

export interface DomainCareerCatalogItem {
  id: string;
  onetSocCode: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  jobZone: number;
  jobZoneJustification: string;
  category: CareerInterestCategory;
  categoryLabelFr: string;
  suggestedActivities: string[];
  suggestedQuestions: string[];
  suggestedPathways: string[];
  imageUrl?: string;
}

export type SupportCategory =
  | 'SCHOOL'           // Établissement scolaire
  | 'MISSION_LOCALE'   // Mission Locale
  | 'CIO'              // Centre d'Information et d'Orientation
  | 'NATIONAL_PORTAL'; // Portail national officiel

export interface DomainSupportResource {
  id: string;
  name: string;
  category: SupportCategory;
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
}

export interface DomainAutonomousJourneyState {
  userId: string;
  journeyMode: JourneyMode;
  favoriteCareerIds: string[];
  customQuestions: Array<{
    id: string;
    careerId?: string;
    question: string;
    createdAt: string;
  }>;
  selectedCareerId?: string;
  activeImmersionProjectId?: string;
  updatedAt: string;
}

/**
 * Associe un métier O*NET à une catégorie de centre d'intérêt pour la navigation libre.
 * (Purement indicatif pour faciliter l'exploration, sans score psychologique calculé).
 */
export function mapCareerToInterestCategory(
  titleFr: string,
  descriptionFr: string
): { category: CareerInterestCategory; label: string } {
  const text = `${titleFr} ${descriptionFr}`.toLowerCase();

  if (
    text.includes('art') ||
    text.includes('décor') ||
    text.includes('peint') ||
    text.includes('graph') ||
    text.includes('design') ||
    text.includes('musique') ||
    text.includes('théâtre') ||
    text.includes('spectacle') ||
    text.includes('photo') ||
    text.includes('mode') ||
    text.includes('stylis')
  ) {
    return { category: 'CREATIVE', label: 'Créer / Artistique' };
  }

  if (
    text.includes('bâtiment') ||
    text.includes('chantier') ||
    text.includes('maçon') ||
    text.includes('menuis') ||
    text.includes('électric') ||
    text.includes('plomb') ||
    text.includes('mécan') ||
    text.includes('construc') ||
    text.includes('soud') ||
    text.includes('ouvrier') ||
    text.includes('usin')
  ) {
    return { category: 'CRAFT', label: 'Bricoler / Construire' };
  }

  if (
    text.includes('santé') ||
    text.includes('infirm') ||
    text.includes('soin') ||
    text.includes('éduc') ||
    text.includes('social') ||
    text.includes('animat') ||
    text.includes('aide') ||
    text.includes('psycholog') ||
    text.includes('enseign') ||
    text.includes('accompagn') ||
    text.includes('service')
  ) {
    return { category: 'CARE', label: 'Aider / Accompagner' };
  }

  if (
    text.includes('informati') ||
    text.includes('développ') ||
    text.includes('logiciel') ||
    text.includes('web') ||
    text.includes('réseau') ||
    text.includes('cybersécur') ||
    text.includes('données') ||
    text.includes('data') ||
    text.includes('numérique')
  ) {
    return { category: 'DIGITAL', label: 'Numérique' };
  }

  if (
    text.includes('agricol') ||
    text.includes('forêt') ||
    text.includes('environn') ||
    text.includes('nature') ||
    text.includes('jardin') ||
    text.includes('paysag') ||
    text.includes('animal') ||
    text.includes('vétérin') ||
    text.includes('écolog') ||
    text.includes('mer') ||
    text.includes('eau')
  ) {
    return { category: 'NATURE', label: 'Nature / Environnement' };
  }

  return { category: 'ORGANIZATION', label: 'Organiser / Gérer' };
}
