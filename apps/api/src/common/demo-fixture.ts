// ============================================================================
// Données vérifiées du Rapport des Possibles — Rdv 2187 (07/10/2026, 17 pages)
// - Classement RIASEC réel (p. 4) : Artistique, Entreprenant, Réaliste, Investigateur, Social, Conventionnel
// - 9 Aptitudes cognitives (p. 5) : explication qualitative vérifiée + réserve méthodologique
// - Classement HEXACO réel (p. 6) : Émotivité, Ouvert à l'expérience, Agréabilité, Humilité-honnêteté, Extraversion, Caractère consciencieux
// - Les 22 métiers proposés répartis sur les 5 zones de préparation (p. 8 à 16)
// - Réserve méthodologique finale de la page 17
// ============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  buildDeterministicEpisodes,
  buildDeterministicSourcedDraft,
  createCleanToneWavBuffer
} from '@monbilan/ai-adapters';
import {
  computeScriptHash,
  DomainCareer,
  DomainFact,
  DomainInterviewSummary,
  matchCareersWithInterview,
  ReportLifecycleStatus,
  UserRole,
  DomainImmersionProject,
  DomainPartnerCompany,
  DomainImmersionApplication,
  DomainObservationEntry,
  DomainImmersionReview,
  DomainSupportResource,
  DomainCareerCatalogItem,
  mapCareerToInterestCategory
} from '@monbilan/domain';

export const DEMO_IDS = {
  TENANT_NICE: '11111111-1111-4111-8111-111111111111',
  TENANT_ANTIBES: '22222222-2222-4222-8222-222222222222',
  COUNSELOR_SOPHIE: 'aaaa1111-1111-4111-8111-111111111111',
  COUNSELOR_MARC_UNASSIGNED: 'aaaa2222-2222-4222-8222-222222222222',
  COUNSELOR_ANTIBES: 'bbbb1111-1111-4111-8111-111111111111',
  YOUNG_USER_LEO: 'cccc1111-1111-4111-8111-111111111111',
  YOUNG_PROFILE_LEO: 'dddd1111-1111-4111-8111-111111111111',
  YOUNG_PROFILE_ANTIBES: 'dddd2222-2222-4222-8222-222222222222',
  REPORT_LEO: 'eeee1111-1111-4111-8111-111111111111',
  RESTITUTION_LEO: 'ffff1111-1111-4111-8111-111111111111'
} as const;

export interface InMemoryQuestion {
  id: string;
  tenantId: string;
  youngProfileId: string;
  reportId?: string;
  relatedTopic: string;
  questionText: string;
  counselorReply?: string | null;
  createdAt: string;
}

export interface InMemoryClaim {
  id: string;
  kind: 'PERSONAL_FACT' | 'CAREER_LINK' | 'PEDAGOGICAL_TIP' | 'PARENT_SUMMARY';
  audience: 'YOUNG' | 'PARENTS';
  displayOrder: number;
  text: string;
  sourceFactIds: string[];
  referencedCareers?: string[];
  reviewStatus: 'PENDING' | 'APPROVED' | 'EDITED' | 'REJECTED';
  reviewerNote?: string;
}

export interface InMemoryRestitution {
  id: string;
  tenantId: string;
  reportId: string;
  version: number;
  status: ReportLifecycleStatus;
  youngScript: string;
  parentsSummary: string;
  scriptHash: string;
  approvedById?: string | null;
  approvedAt?: string | null;
  publishedById?: string | null;
  publishedAt?: string | null;
  claims: InMemoryClaim[];
  audioReady: boolean;
  audioHash?: string | null;
  audioDurationSec: number;
}

export interface InMemoryReport {
  id: string;
  tenantId: string;
  youngProfileId: string;
  youngDisplayName: string;
  ageRange: string;
  rdvNumber: string;
  reportDate: string;
  pageCount: number;
  status: ReportLifecycleStatus;
  version: number;
  facts: DomainFact[];
  careers: (DomainCareer & { isFavorite?: boolean; youngNote?: string })[];
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
}

export type AppointmentStatus = 'CONFIRMED' | 'PLANNED' | 'COMPLETED' | 'TO_CONFIRM' | 'CANCELLED' | 'ABSENT';
export type AppointmentModality = 'IN_PERSON' | 'PHONE' | 'VIDEO';

export interface InMemoryAppointment {
  id: string;
  tenantId: string;
  counselorId: string;
  youngProfileId: string;
  youngName: string;
  youngAge: string;
  dossierRef: string;
  title: string;
  motif: string;
  objectives: string[];
  date: string; // '2026-11-18'
  startHour: string; // '14:00'
  endHour: string; // '15:00'
  durationMinutes: number;
  modality: AppointmentModality;
  location: string;
  meetingUrl?: string;
  status: AppointmentStatus;
  preparation?: {
    checklist: { id: string; label: string; checked: boolean }[];
    privateNotes?: string;
  };
  report?: {
    topicsDiscussed: string[];
    observations: string;
    decisions: string[];
    sharedSummary?: string;
    isPublishedToYoung: boolean;
  };
  actions?: {
    id: string;
    title: string;
    assignee: 'YOUNG' | 'COUNSELOR';
    dueDate?: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  }[];
}

export interface InMemoryFollowUpYouth {
  id: string;
  youngName: string;
  avatarUrl?: string;
  dossierRef: string;
  situation: 'INTERVIEW_COMPLETED' | 'PLANNED' | 'ACTION_PENDING' | 'IN_PROGRESS';
  situationLabel: string;
  situationBadgeClass: string;
  nextAction: string;
  nextActionIcon: string;
  dueDate?: string;
}

export function createInitialFictionalLeoFacts(): DomainFact[] {
  const tenantId = DEMO_IDS.TENANT_NICE;
  const reportId = DEMO_IDS.REPORT_LEO;

  return [
    // Métadonnées et réserves méthodologiques (Pages 1, 2, 5, 17)
    {
      id: 'fact-meta-001',
      tenantId,
      reportId,
      category: 'METADATA',
      factKey: 'rdv_meta',
      label: 'Ton rapport des possibles – Rdv 2187 (Rapport du 07/10/2026)',
      rankOrder: 1,
      numericScore: null,
      maxScore: null,
      rawExcerpt: 'Ton rapport des possibles – Rdv 2187 | Rapport du 07/10/2026 | Explore ton avenir professionnel (17 pages).',
      pageNumber: 1,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-meta-reserve-p17',
      tenantId,
      reportId,
      category: 'METADATA',
      factKey: 'methodological_disclaimer_p17',
      label: 'Réserve méthodologique du rapport (Page 17)',
      rankOrder: 2,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '« Les résultats présentés dans ce bilan proviennent de travaux expérimentaux. Ils ne peuvent pas rendre compte du profil complet d’un individu et peuvent comporter des erreurs. Ces données constituent des pistes de réflexion. »',
      pageNumber: 17,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },

    // Classement RIASEC réel du rapport 2187 (Page 4 — classé par ordre)
    {
      id: 'fact-riasec-01',
      tenantId,
      reportId,
      category: 'RIASEC_INTEREST',
      factKey: 'riasec_artistique',
      label: 'Artistique',
      rankOrder: 1,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '1. Artistique (p. 4) : Les personnes de ce type aiment les activités qui leur permettent de s’exprimer. Elles aiment créer, imaginer à travers des activités artistiques : littérature, peinture, musique, graphisme, sculpture…',
      pageNumber: 4,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-riasec-02',
      tenantId,
      reportId,
      category: 'RIASEC_INTEREST',
      factKey: 'riasec_entreprenant',
      label: 'Entreprenant',
      rankOrder: 2,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '2. Entreprenant (p. 4) : Les personnes de ce type aiment influencer, manager, diriger les autres, les convaincre. Elles savent défendre leurs idées.',
      pageNumber: 4,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-riasec-03',
      tenantId,
      reportId,
      category: 'RIASEC_INTEREST',
      factKey: 'riasec_realiste',
      label: 'Réaliste',
      rankOrder: 3,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '3. Réaliste (p. 4) : Les personnes de ce type aiment les tâches concrètes et manuelles, manipuler, utiliser des outils, machines et appareils. Elles préfèrent travailler à l’extérieur plutôt qu’à l’intérieur, se dépenser physiquement.',
      pageNumber: 4,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-riasec-04',
      tenantId,
      reportId,
      category: 'RIASEC_INTEREST',
      factKey: 'riasec_investigateur',
      label: 'Investigateur',
      rankOrder: 4,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '4. Investigateur (p. 4) : La plupart des personnes de ce type aiment résoudre des problèmes, innover, observer et analyser, réfléchir, faire des recherches scientifiques, comprendre les phénomènes.',
      pageNumber: 4,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-riasec-05',
      tenantId,
      reportId,
      category: 'RIASEC_INTEREST',
      factKey: 'riasec_social',
      label: 'Social',
      rankOrder: 5,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '5. Social (p. 4) : Les personnes de ce type aiment être en contact avec les autres dans le but de les aider, de les informer, de leur enseigner, de les soigner.',
      pageNumber: 4,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-riasec-06',
      tenantId,
      reportId,
      category: 'RIASEC_INTEREST',
      factKey: 'riasec_conventionnel',
      label: 'Conventionnel',
      rankOrder: 6,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '6. Conventionnel (p. 4) : Les personnes de ce type ont une préférence pour les activités précises, méthodiques. Elles aiment trier, organiser, préfèrent les consignes claires.',
      pageNumber: 4,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },

    // Aptitudes cognitives (Page 5 — explication qualitative vérifiée, sans inventer de score chiffré)
    {
      id: 'fact-cog-01',
      tenantId,
      reportId,
      category: 'COGNITIVE_APTITUDE',
      factKey: 'cog_flexibilite_categories',
      label: 'Flexibilité des catégories',
      rankOrder: 1,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        'Flexibilité des catégories (p. 5) : Capacité à utiliser différentes règles pour regrouper des choses de différentes manières. (Image à un instant T dépendant des conditions de passation — voir graphique p. 5).',
      pageNumber: 5,
      confidence: 'HUMAN_VERIFIED',
      isVerified: true
    },
    {
      id: 'fact-cog-02',
      tenantId,
      reportId,
      category: 'COGNITIVE_APTITUDE',
      factKey: 'cog_partage_temps',
      label: 'Partage du temps',
      rankOrder: 2,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        'Partage du temps (p. 5) : Capacité à passer d’une activité à une autre ou d’une source d’information à une autre. (Voir graphique original p. 5).',
      pageNumber: 5,
      confidence: 'HUMAN_VERIFIED',
      isVerified: true
    },
    {
      id: 'fact-cog-03',
      tenantId,
      reportId,
      category: 'COGNITIVE_APTITUDE',
      factKey: 'cog_memorisation',
      label: 'Mémorisation',
      rankOrder: 3,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        'Mémorisation (p. 5) : Capacité à se souvenir d’informations comme des mots, des nombres, des images et des procédures. (Voir graphique original p. 5).',
      pageNumber: 5,
      confidence: 'HUMAN_VERIFIED',
      isVerified: true
    },
    {
      id: 'fact-cog-04',
      tenantId,
      reportId,
      category: 'COGNITIVE_APTITUDE',
      factKey: 'cog_ensemble_p5',
      label: 'Ensemble des 9 fonctions cognitives évaluées (Page 5)',
      rankOrder: 4,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        'Originalité, Raisonnement déductif, Raisonnement inductif, Flexibilité des catégories, Facilité avec les nombres, Mémorisation, Visualisation, Attention sélective, Partage du temps. « Les scores aux jeux ne représentent qu’une image à un instant T et ne doivent pas être considérés comme une évaluation définitive. »',
      pageNumber: 5,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },

    // Classement HEXACO réel du rapport 2187 (Page 6 — classé par ordre)
    {
      id: 'fact-hexaco-01',
      tenantId,
      reportId,
      category: 'HEXACO_PERSONALITY',
      factKey: 'hexaco_emotivite',
      label: 'Emotivité',
      rankOrder: 1,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '1. Emotivité (p. 6) : Dimension évaluant la sensibilité émotionnelle ou la résistance au stress selon la position sur le continuum (voir radar p. 6).',
      pageNumber: 6,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-hexaco-02',
      tenantId,
      reportId,
      category: 'HEXACO_PERSONALITY',
      factKey: 'hexaco_ouverture',
      label: 'Ouvert à l\'expérience',
      rankOrder: 2,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '2. Ouvert à l’expérience (p. 6) : Un score élevé reflète une forte imagination, un intérêt pour la nouveauté, un attrait pour l’art et la curiosité.',
      pageNumber: 6,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-hexaco-03',
      tenantId,
      reportId,
      category: 'HEXACO_PERSONALITY',
      factKey: 'hexaco_agreabilite',
      label: 'Agréabilité',
      rankOrder: 3,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '3. Agréabilité (p. 6) : Tendance au pardon, à la coopération avec autrui et à la maîtrise de soi.',
      pageNumber: 6,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-hexaco-04',
      tenantId,
      reportId,
      category: 'HEXACO_PERSONALITY',
      factKey: 'hexaco_humilite',
      label: 'Humilité-honnêteté',
      rankOrder: 4,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '4. Humilité-honnêteté (p. 6) : Rapport à la modestie, à l’équité et au statut social.',
      pageNumber: 6,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-hexaco-05',
      tenantId,
      reportId,
      category: 'HEXACO_PERSONALITY',
      factKey: 'hexaco_extraversion',
      label: 'Extraversion',
      rankOrder: 5,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '5. Extraversion (p. 6) : Aisance dans les interactions sociales et l’animation d’un groupe.',
      pageNumber: 6,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },
    {
      id: 'fact-hexaco-06',
      tenantId,
      reportId,
      category: 'HEXACO_PERSONALITY',
      factKey: 'hexaco_consciencieux',
      label: 'Caractère consciencieux',
      rankOrder: 6,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        '6. Caractère consciencieux (p. 6) : Organisation, méthode et rapport aux objectifs.',
      pageNumber: 6,
      confidence: 'EXACT_TEXT',
      isVerified: true
    },

    // Synthèse des 5 zones de métiers (Pages 7 à 16)
    {
      id: 'fact-zones-01',
      tenantId,
      reportId,
      category: 'CAREER_ZONE',
      factKey: 'zones_overview',
      label: '22 métiers proposés répartis sur 5 zones de préparation (Pages 7 à 16)',
      rankOrder: 1,
      numericScore: null,
      maxScore: null,
      rawExcerpt:
        'Ton champ des possibles par zone de métiers (pages 7 à 16) : résultats obtenus sur la base des jeux d’aptitudes cognitifs et du questionnaire d’intérêts professionnels. Jusqu’à 5 propositions par zone de métiers (22 métiers au total dans le rapport 2187).',
      pageNumber: 7,
      confidence: 'EXACT_TEXT',
      isVerified: true
    }
  ];
}

// Les 22 métiers exacts du Rapport des Possibles — Rdv 2187 (Pages 8 à 16)
export function createInitialFictionalLeoCareers(): (DomainCareer & {
  isFavorite?: boolean;
  youngNote?: string;
})[] {
  const tenantId = DEMO_IDS.TENANT_NICE;
  const reportId = DEMO_IDS.REPORT_LEO;

  return [
    // 1ère ZONE DE MÉTIERS (0 à 6 mois — Pages 8 et 9)
    {
      id: 'career-2187-z1-1',
      tenantId,
      reportId,
      jobZone: 1,
      rankInZone: 1,
      titleFr: 'Peintre décorateur',
      description:
        'Prépare et applique des peintures, vernis et autres revêtements sur des objets comme des meubles, du verre, de la poterie, des bijoux, des jouets ou du cuir. Réalise aussi des décorations, des effets de matière ou des patines en atelier ou chez des artisans.',
      pageNumber: 8,
      isFavorite: true
    },
    {
      id: 'career-2187-z1-2',
      tenantId,
      reportId,
      jobZone: 1,
      rankInZone: 2,
      titleFr: 'Cuisinier en restauration rapide',
      description:
        'Prépare et cuit des aliments dans un restaurant à service rapide selon des recettes simples. Demande de la rapidité, de l’organisation, de la rigueur et l’esprit d’équipe.',
      pageNumber: 8,
      isFavorite: false
    },
    {
      id: 'career-2187-z1-3',
      tenantId,
      reportId,
      jobZone: 1,
      rankInZone: 3,
      titleFr: 'Barista',
      description:
        'Prépare et sert des cafés spécialisés (espresso, cappuccino, latte) et d’autres boissons. Utilise des machines à espresso, maîtrise la température du lait et le sens du service (CAP/BEP ou formation courte).',
      pageNumber: 8,
      isFavorite: false
    },
    {
      id: 'career-2187-z1-4',
      tenantId,
      reportId,
      jobZone: 1,
      rankInZone: 4,
      titleFr: 'Ouvrier agricole',
      description:
        'Plante, cultive et récolte des légumes, des fruits et d’autres cultures en plein champ, en pépinière ou en serre. Travail physique majoritairement en extérieur (CAP agricole, Bac Pro).',
      pageNumber: 8,
      isFavorite: false
    },
    {
      id: 'career-2187-z1-5',
      tenantId,
      reportId,
      jobZone: 1,
      rankInZone: 5,
      titleFr: 'Ouvrier de carrière',
      description:
        'Casse et détache des blocs de pierre directement dans la carrière, prépare le site, repère les plans de coupe et contrôle la qualité des blocs (CAP/BEP ou alternance).',
      pageNumber: 9,
      isFavorite: false
    },

    // 2ème ZONE DE MÉTIERS (3 mois à 2 ans — Pages 10 et 11)
    {
      id: 'career-2187-z2-1',
      tenantId,
      reportId,
      jobZone: 2,
      rankInZone: 1,
      titleFr: 'Acteur',
      description:
        'Joue des rôles au théâtre, à la télévision, à la radio, au cinéma ou dans des vidéos. Interprète des personnages sérieux ou comiques par la parole, les gestes et les mouvements du corps.',
      pageNumber: 10,
      isFavorite: true
    },
    {
      id: 'career-2187-z2-2',
      tenantId,
      reportId,
      jobZone: 2,
      rankInZone: 2,
      titleFr: 'Boucher',
      description:
        'Prépare et découpe la viande pour la vente aux particuliers, conseille les clients sur les morceaux et les cuissons dans le respect strict des règles d’hygiène (CAP Boucher, BP, Bac Pro).',
      pageNumber: 10,
      isFavorite: false
    },
    {
      id: 'career-2187-z2-3',
      tenantId,
      reportId,
      jobZone: 2,
      rankInZone: 3,
      titleFr: "Conducteur d'appareils de levage (palan, treuil)",
      description:
        'Manœuvre des palans et des treuils motorisés pour soulever, déplacer ou tirer des charges lourdes dans des usines, sur des chantiers ou dans les ports en toute sécurité.',
      pageNumber: 10,
      isFavorite: false
    },
    {
      id: 'career-2187-z2-4',
      tenantId,
      reportId,
      jobZone: 2,
      rankInZone: 4,
      titleFr: 'Agent funéraire',
      description:
        'Aide à l’organisation et au déroulement des obsèques, accompagne et oriente les familles avec respect, discrétion, sérieux et résistance au stress.',
      pageNumber: 10,
      isFavorite: false
    },
    {
      id: 'career-2187-z2-5',
      tenantId,
      reportId,
      jobZone: 2,
      rankInZone: 5,
      titleFr: 'Ouvrier de meulage et de polissage',
      description:
        'Utilise des outils à main ou électriques portatifs pour meuler, poncer et polir des pièces en métal, bois, pierre, argile, plastique ou verre avec dextérité et attention au détail.',
      pageNumber: 11,
      isFavorite: false
    },

    // 3ème ZONE DE MÉTIERS (1 à 4 ans — Pages 12 et 13)
    {
      id: 'career-2187-z3-1',
      tenantId,
      reportId,
      jobZone: 3,
      rankInZone: 1,
      titleFr: 'Esthéticien',
      description:
        'Réalise des soins de la peau du visage et du corps en institut, spa ou centre esthétique, et conseille les clients (CAP, BP ou BTS Métiers de l’esthétique).',
      pageNumber: 12,
      isFavorite: false
    },
    {
      id: 'career-2187-z3-2',
      tenantId,
      reportId,
      jobZone: 3,
      rankInZone: 2,
      titleFr: 'Coach sportif',
      description:
        'Encadre et entraîne des personnes ou des groupes pour améliorer leur forme physique et leur santé en salle, en club ou à domicile (BPJEPS, Licence STAPS).',
      pageNumber: 12,
      isFavorite: false
    },
    {
      id: 'career-2187-z3-3',
      tenantId,
      reportId,
      jobZone: 3,
      rankInZone: 3,
      titleFr: 'Guide touristique',
      description:
        'Accompagne des visiteurs ou des groupes lors de visites de villes, monuments ou musées, prépare le parcours et explique l’histoire et le patrimoine en une ou plusieurs langues.',
      pageNumber: 12,
      isFavorite: false
    },
    {
      id: 'career-2187-z3-4',
      tenantId,
      reportId,
      jobZone: 3,
      rankInZone: 4,
      titleFr: 'Technicien du son',
      description:
        'Installe, règle et fait fonctionner le matériel pour enregistrer, mixer, synchroniser et restituer le son (musique, voix, bruitages) pour le théâtre, le cinéma, la télévision, les vidéos, les podcasts ou les concerts.',
      pageNumber: 12,
      isFavorite: true
    },
    {
      id: 'career-2187-z3-5',
      tenantId,
      reportId,
      jobZone: 3,
      rankInZone: 5,
      titleFr: 'Technicien Solaire Thermique',
      description:
        'Installe, répare et entretient des systèmes qui captent la chaleur du soleil pour chauffer de l’eau. Mobilise des compétences en plomberie, électricité et lecture de plans.',
      pageNumber: 13,
      isFavorite: false
    },

    // 4ème ZONE DE MÉTIERS (2 à 6 ans — Pages 14 et 15)
    {
      id: 'career-2187-z4-1',
      tenantId,
      reportId,
      jobZone: 4,
      rankInZone: 1,
      titleFr: 'Guide naturaliste / Médiateur environnement',
      description:
        'Conçoit, prépare et anime des activités, visites guidées et ateliers pédagogiques pour faire connaître au public les aspects naturels et scientifiques d’un parc (BTS/BUT environnement, Licence pro).',
      pageNumber: 14,
      isFavorite: false
    },
    {
      id: 'career-2187-z4-2',
      tenantId,
      reportId,
      jobZone: 4,
      rankInZone: 2,
      titleFr: 'Animateur Radio',
      description:
        'Parle ou lit des textes à la radio ou pour d’autres médias, présente des chroniques, accueille et interviewe des invités en studio ou sur le terrain.',
      pageNumber: 14,
      isFavorite: true
    },
    {
      id: 'career-2187-z4-3',
      tenantId,
      reportId,
      jobZone: 4,
      rankInZone: 3,
      titleFr: 'Producteur / réalisateur',
      description:
        'Conçoit et dirige des spectacles, émissions, films, vidéos ou programmes radio en prenant les décisions créatives et en coordonnant l’équipe artistique et technique.',
      pageNumber: 14,
      isFavorite: false
    },
    {
      id: 'career-2187-z4-4',
      tenantId,
      reportId,
      jobZone: 4,
      rankInZone: 4,
      titleFr: 'Professeur du secondaire',
      description:
        'Enseigne une ou plusieurs matières aux élèves de collège et de lycée, prépare les cours, accompagne les élèves et conseille pour l’orientation (Master + CAPES/Agrégation).',
      pageNumber: 14,
      isFavorite: false
    },
    {
      id: 'career-2187-z4-5',
      tenantId,
      reportId,
      jobZone: 4,
      rankInZone: 5,
      titleFr: 'Professeur des écoles',
      description:
        'Enseigne les matières de base et aide les élèves de 6 à 11 ans à développer leurs compétences à l’école élémentaire (Licence + Master MEEF + CRPE).',
      pageNumber: 15,
      isFavorite: false
    },

    // 5ème ZONE DE MÉTIERS (4 à 10 ans — Page 16)
    {
      id: 'career-2187-z5-1',
      tenantId,
      reportId,
      jobZone: 5,
      rankInZone: 1,
      titleFr: "Enseignant en arts, théâtre et musique dans l'enseignement supérieur",
      description:
        'Enseigne au niveau post-bac (universités, écoles d’art, conservatoires) le théâtre, la musique, les arts plastiques ou le design, et encadre des ateliers et projets de création.',
      pageNumber: 16,
      isFavorite: false
    },
    {
      id: 'career-2187-z5-2',
      tenantId,
      reportId,
      jobZone: 5,
      rankInZone: 2,
      titleFr: 'Praticien en Activité Physique Adaptée (APA)',
      description:
        'Évalue les capacités physiques et conçoit des séances d’activité physique adaptée pour améliorer la motricité, l’autonomie et la santé de publics à besoins particuliers (Licence/Master STAPS APA).',
      pageNumber: 16,
      isFavorite: false
    }
  ];
}

export function createInitialDemoInterviewSummary(): DomainInterviewSummary {
  const now = new Date().toISOString();
  return {
    id: 'interview-2187',
    tenantId: DEMO_IDS.TENANT_NICE,
    reportId: DEMO_IDS.REPORT_LEO,
    counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
    counselorName: 'Sophie V. (Psychologue de l’Éducation Nationale)',
    interviewDate: '2026-10-14T10:00:00.000Z',
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
    isFinalized: true,
    finalizedAt: now,
    createdAt: now,
    updatedAt: now
  };
}

export function createInitialDemoState() {
  const facts = createInitialFictionalLeoFacts();
  const careers = createInitialFictionalLeoCareers();
  const interview = createInitialDemoInterviewSummary();
  const assessments = matchCareersWithInterview(careers, interview);
  const episodes = buildDeterministicEpisodes({
    restitutionId: DEMO_IDS.RESTITUTION_LEO,
    reportId: DEMO_IDS.REPORT_LEO,
    youngDisplayName: 'Emma D.',
    facts,
    careers,
    assessments,
    interview
  });

  const generated = buildDeterministicSourcedDraft({
    reportId: DEMO_IDS.REPORT_LEO,
    youngDisplayName: 'Participant — Rdv 2187',
    facts,
    careers
  });

  const scriptHash = computeScriptHash(generated.youngScript, generated.parentsSummary);

  const report: InMemoryReport = {
    id: DEMO_IDS.REPORT_LEO,
    tenantId: DEMO_IDS.TENANT_NICE,
    youngProfileId: DEMO_IDS.YOUNG_PROFILE_LEO,
    youngDisplayName: 'Dossier Démo — Rdv 2187',
    ageRange: '16-25 ans',
    rdvNumber: '2187',
    reportDate: '07/10/2026',
    pageCount: 17,
    status: 'PUBLISHED',
    version: 1,
    facts,
    careers
  };

  const restitution: InMemoryRestitution = {
    id: DEMO_IDS.RESTITUTION_LEO,
    tenantId: DEMO_IDS.TENANT_NICE,
    reportId: DEMO_IDS.REPORT_LEO,
    version: 1,
    status: 'PUBLISHED',
    youngScript: generated.youngScript,
    parentsSummary: generated.parentsSummary,
    scriptHash,
    approvedById: DEMO_IDS.COUNSELOR_SOPHIE,
    approvedAt: new Date().toISOString(),
    publishedById: DEMO_IDS.COUNSELOR_SOPHIE,
    publishedAt: new Date().toISOString(),
    claims: generated.claims.map((c, idx) => ({
      ...c,
      displayOrder: idx + 1,
      reviewStatus: 'APPROVED'
    })),
    audioReady: true,
    audioHash: scriptHash,
    audioDurationSec: 45
  };

  const questions: InMemoryQuestion[] = [
    {
      id: 'q-demo-01',
      tenantId: DEMO_IDS.TENANT_NICE,
      youngProfileId: DEMO_IDS.YOUNG_PROFILE_LEO,
      reportId: DEMO_IDS.REPORT_LEO,
      relatedTopic: 'Technicien du son (Zone 3 — p. 12)',
      questionText:
        'Comment explorer la piste Technicien du son proposée à la page 12 de mon rapport ou tester sa vidéo 360° dans l’Agora des Métiers ?',
      counselorReply:
        'Lors de notre prochain point, nous pourrons consulter les formations BTS/Alternance sur orientation-regionsud.fr et planifier un stage d’observation via la plateforme de la Métropole Nice Côte d’Azur.',
      createdAt: new Date().toISOString()
    }
  ];

  const auditEvents: AuditLogEntry[] = [
    {
      id: 'audit-01',
      tenantId: DEMO_IDS.TENANT_NICE,
      actorId: DEMO_IDS.COUNSELOR_SOPHIE,
      actorRole: 'COUNSELOR',
      action: 'REPORT_2187_IMPORTED_AND_FACTS_VERIFIED',
      entityType: 'Report',
      entityId: DEMO_IDS.REPORT_LEO,
      timestamp: new Date().toISOString()
    },
    {
      id: 'audit-02',
      tenantId: DEMO_IDS.TENANT_NICE,
      actorId: DEMO_IDS.COUNSELOR_SOPHIE,
      actorRole: 'COUNSELOR',
      action: 'RESTITUTION_APPROVED_AND_PUBLISHED_BY_PROFESSIONAL',
      entityType: 'Restitution',
      entityId: DEMO_IDS.RESTITUTION_LEO,
      timestamp: new Date().toISOString()
    }
  ];

  const partnerCompanies: DomainPartnerCompany[] = [
    {
      id: 'comp-01',
      tenantId: DEMO_IDS.TENANT_NICE,
      name: 'Atelier Décors & Patines Riviera',
      sector: 'Peinture, finitions & décors intérieurs',
      city: 'Nice Centre (Libération)',
      distanceKm: 2,
      address: '14 rue Vernier, 06000 Nice',
      contactEmail: 'contact@decors-riviera.fr',
      contactPhone: '04 93 88 12 40',
      verifiedPartner: true,
      careersOffered: ['Peintre décorateur', 'Plaquiste']
    },
    {
      id: 'comp-02',
      tenantId: DEMO_IDS.TENANT_NICE,
      name: 'Studio Riviera Son & Acoustique',
      sector: 'Audiovisuel, régie de spectacle & enregistrement',
      city: 'Nice Port',
      distanceKm: 4,
      address: '8 quai des Deux-Emmanuels, 06300 Nice',
      contactEmail: 'stages@studioriviera.fr',
      contactPhone: '04 93 55 90 12',
      verifiedPartner: true,
      careersOffered: ['Technicien du son', 'Régisseur son']
    },
    {
      id: 'comp-03',
      tenantId: DEMO_IDS.TENANT_NICE,
      name: 'Café Fika & Torréfaction Artisanale',
      sector: 'Caféterie spécialisée & hôtellerie-restauration',
      city: 'Vieux-Nice',
      distanceKm: 3,
      address: '5 rue de la Préfecture, 06300 Nice',
      contactEmail: 'bonjour@cafefika-nice.fr',
      verifiedPartner: true,
      careersOffered: ['Barista', 'Cuisinier en restauration rapide']
    },
    {
      id: 'comp-04',
      tenantId: DEMO_IDS.TENANT_NICE,
      name: 'Azur Découverte & Patrimoine',
      sector: 'Tourisme, médiation culturelle & visites guidées',
      city: 'Nice (Promenade des Anglais)',
      distanceKm: 3,
      address: '22 Promenade des Anglais, 06000 Nice',
      contactEmail: 'mediation@azur-decouverte.org',
      verifiedPartner: true,
      careersOffered: ['Guide touristique', 'Agent d’escale ferroviaire']
    }
  ];

  const immersionProjects: DomainImmersionProject[] = [
    {
      id: 'imm-emma-1',
      tenantId: DEMO_IDS.TENANT_NICE,
      youngProfileId: DEMO_IDS.YOUNG_PROFILE_LEO,
      careerId: 'c-z1-1',
      careerTitle: 'Peintre décorateur',
      step: 2,
      status: 'PREPARING',
      selectedCompany: 'Atelier Décors & Patines Riviera',
      companyContact: 'M. Laurent B. (Artisan décorateur)',
      targetDate: 'Vacances scolaires (stage 3 jours)',
      notes: 'Découverte atelier artisanale validée par Sophie V. lors de l’entretien.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const applications: DomainImmersionApplication[] = [
    {
      id: 'app-01',
      projectId: 'imm-emma-1',
      companyName: 'Atelier Décors & Patines Riviera',
      careerTitle: 'Peintre décorateur',
      targetPeriod: 'Stage d’observation de 3 jours (vacances d’automne)',
      messageBody: `Bonjour,\n\nJe m'appelle Emma D. et je suis accompagnée par le Centre des Possibles au Hub de l'Innovation à Nice.\n\nDans le cadre de mon projet d'orientation, je souhaite découvrir sur le terrain le métier de Peintre décorateur. J'admire les réalisations et le savoir-faire de votre atelier.\n\nSerait-il possible de m'accueillir pour un stage d'observation conventionné de 3 jours ?\n\nBien cordialement,\nEmma D.`,
      status: 'DRAFT',
      counselorHelp: true,
      createdAt: new Date().toISOString()
    }
  ];

  const observations: DomainObservationEntry[] = [
    {
      id: 'obs-01',
      projectId: 'imm-emma-1',
      dayNumber: 1,
      discoveredText: 'Préparation des enduits à la chaux et ponçage fin des boiseries anciennes.',
      surprisedText: 'La précision du geste pour rechampir sans ruban de masquage !',
      questionText: 'Combien de temps faut-il pour maîtriser la technique du faux marbre ?',
      createdAt: new Date().toISOString()
    }
  ];

  const reviews: DomainImmersionReview[] = [
    {
      id: 'rev-01',
      projectId: 'imm-emma-1',
      careerTitle: 'Peintre décorateur',
      companyName: 'Atelier Décors & Patines Riviera',
      likedAspects: 'Le mélange des couleurs, la créativité et le contact avec les belles matières.',
      dislikedAspects: 'L’odeur forte de certains solvants au tout début.',
      surprises: 'Il y a beaucoup de technique et de chimie dans les mélanges, pas seulement du dessin.',
      wantToPursue: true,
      questionsToAsk: 'Existe-t-il une alternance en CAP ou Bac Pro Peintre applicateur de revêtements près de Nice ?',
      sharedWithCounselor: true,
      counselorNotes: 'Projet très positif. Rapprochement avec le CFA de Carros à envisager.'
    }
  ];

  const appointments: InMemoryAppointment[] = [
    {
      id: 'apt-01',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: DEMO_IDS.YOUNG_PROFILE_LEO,
      youngName: 'Emma D.',
      youngAge: '16 ans',
      dossierRef: 'Rdv 2187',
      title: 'Bilan & pistes',
      motif: 'Débriefing complet du bilan et premières pistes professionnelles.',
      objectives: ['Restituer les résultats RIASEC et HEXACO', 'Explorer les pistes prioritaires', 'Initier le projet Immersion Pro'],
      date: '2026-11-16',
      startHour: '09:00',
      endHour: '10:00',
      durationMinutes: 60,
      modality: 'IN_PERSON',
      location: 'Centre des Possibles – Salle 1',
      status: 'COMPLETED',
      preparation: {
        checklist: [
          { id: 'chk-1', label: 'Consulter le rapport de 17 pages', checked: true },
          { id: 'chk-2', label: 'Valider les 7 faits prioritaires', checked: true }
        ],
        privateNotes: 'Très bon contact. Profil artistique marqué, confirme son attrait pour le terrain.'
      },
      report: {
        topicsDiscussed: ['Profil RIASEC', '22 pistes', 'Immersion peintre décorateur'],
        observations: 'Emma s\'est montrée très réceptive et motivée par les métiers concrets.',
        decisions: ['Lancement de la recherche d\'immersion', 'Prise de contact avec Atelier Décors'],
        sharedSummary: 'Entretien très constructif. Nous avons validé la recherche de stage découverte.',
        isPublishedToYoung: true
      }
    },
    {
      id: 'apt-02',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-noah-p',
      youngName: 'Noah P.',
      youngAge: '17 ans',
      dossierRef: 'Dossier 2192',
      title: 'Questions & orientations',
      motif: 'Répondre aux questions sur les passerelles Bac Pro / BTS.',
      objectives: ['Clarifier les conditions d\'accès aux formations'],
      date: '2026-11-16',
      startHour: '16:00',
      endHour: '17:00',
      durationMinutes: 60,
      modality: 'VIDEO',
      location: 'Visioconférence MonBilan+',
      status: 'CANCELLED'
    },
    {
      id: 'apt-03',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-aicha-d',
      youngName: 'Aïcha D.',
      youngAge: '18 ans',
      dossierRef: 'Dossier 2189',
      title: 'Orientation post-bac',
      motif: 'Échanger sur les candidatures Parcoursup et les ressources ONISEP.',
      objectives: ['Valider les vœux en communication', 'Vérifier les critères de sélection'],
      date: '2026-11-17',
      startHour: '11:00',
      endHour: '12:00',
      durationMinutes: 60,
      modality: 'IN_PERSON',
      location: 'Centre des Possibles – Bureau 3',
      status: 'COMPLETED'
    },
    {
      id: 'apt-04',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-mateo-r',
      youngName: 'Matéo R.',
      youngAge: '17 ans',
      dossierRef: 'Dossier 2190',
      title: 'Rdv 2187 — Analyse et approfondissement',
      motif: 'Échanger sur les résultats du bilan et approfondir 2 métiers.',
      objectives: [
        'Revenir sur les intérêts et aptitudes.',
        'Explorer les métiers identifiés.',
        'Définir les prochaines étapes.'
      ],
      date: '2026-11-18',
      startHour: '14:00',
      endHour: '15:00',
      durationMinutes: 60,
      modality: 'IN_PERSON',
      location: 'Centre des Possibles – Salle 2',
      status: 'CONFIRMED',
      preparation: {
        checklist: [
          { id: 'c1', label: 'Consulter le bilan Rdv 2190 et la synthèse', checked: true },
          { id: 'c2', label: 'Relire les points clés (intérêts, aptitudes, 22 pistes)', checked: true },
          { id: 'c3', label: 'Identifier les questions à approfondir', checked: false },
          { id: 'c4', label: 'Préparer des ressources (formations, stages, liens)', checked: false }
        ],
        privateNotes: 'Matéo hésite entre informatique et audiovisuel. Faire le point sur ses contraintes de transport.'
      },
      report: {
        topicsDiscussed: ['Intérêts RIASEC', 'Métiers du numérique'],
        observations: 'Discussion franche et motivée.',
        decisions: ['Préparer une immersion d\'observation'],
        sharedSummary: 'Échange constructif sur ton orientation.',
        isPublishedToYoung: false
      },
      actions: [
        {
          id: 'act-01',
          title: 'Explorer la fiche métier Développeur web',
          assignee: 'YOUNG',
          dueDate: '2026-11-25',
          priority: 'HIGH',
          status: 'IN_PROGRESS'
        },
        {
          id: 'act-02',
          title: 'Transmettre la convention d\'immersion',
          assignee: 'COUNSELOR',
          dueDate: '2026-11-22',
          priority: 'HIGH',
          status: 'TODO'
        }
      ]
    },
    {
      id: 'apt-05',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-lucas-m',
      youngName: 'Lucas M.',
      youngAge: '16 ans',
      dossierRef: 'Dossier 2188',
      title: 'Suivi projet d\'orientation',
      motif: 'Faire le point sur l\'entretien et les démarches en cours.',
      objectives: ['Valider le choix de filière', 'Fixer les prochaines étapes'],
      date: '2026-11-19',
      startHour: '09:30',
      endHour: '10:30',
      durationMinutes: 60,
      modality: 'IN_PERSON',
      location: 'Lycée Masséna – Salle d\'orientation',
      status: 'PLANNED'
    },
    {
      id: 'apt-06',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-sofia-k',
      youngName: 'Sofia K.',
      youngAge: '17 ans',
      dossierRef: 'Dossier 2191',
      title: 'Choix de formation',
      motif: 'Sélection des formations après analyse des résultats.',
      objectives: ['Comparer les lycées pro de l\'académie de Nice'],
      date: '2026-11-20',
      startHour: '15:00',
      endHour: '16:00',
      durationMinutes: 60,
      modality: 'IN_PERSON',
      location: 'Centre des Possibles – Bureau 1',
      status: 'TO_CONFIRM'
    },
    // Rendez-vous supplémentaires pour les compteurs KPI exacts (6 à venir, 4 réalisés)
    {
      id: 'apt-07',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-julien-b',
      youngName: 'Julien B.',
      youngAge: '18 ans',
      dossierRef: 'Dossier 2185',
      title: 'Bilan final',
      motif: 'Finalisation du projet professionnel.',
      objectives: ['Clôturer le bilan'],
      date: '2026-11-13',
      startHour: '14:00',
      endHour: '15:00',
      durationMinutes: 60,
      modality: 'IN_PERSON',
      location: 'Centre des Possibles',
      status: 'COMPLETED'
    },
    {
      id: 'apt-08',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-leila-m',
      youngName: 'Leïla M.',
      youngAge: '16 ans',
      dossierRef: 'Dossier 2184',
      title: 'Restitution',
      motif: 'Restitution du bilan initial.',
      objectives: ['Présentation des pistes'],
      date: '2026-11-12',
      startHour: '10:00',
      endHour: '11:00',
      durationMinutes: 60,
      modality: 'IN_PERSON',
      location: 'Centre des Possibles',
      status: 'COMPLETED'
    },
    {
      id: 'apt-09',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-clara-v',
      youngName: 'Clara V.',
      youngAge: '17 ans',
      dossierRef: 'Dossier 2193',
      title: 'Point d\'étape',
      motif: 'Point sur les recherches d\'immersion.',
      objectives: ['Revue des candidatures'],
      date: '2026-11-23',
      startHour: '11:00',
      endHour: '12:00',
      durationMinutes: 60,
      modality: 'PHONE',
      location: 'Entretien téléphonique',
      status: 'CONFIRMED'
    },
    {
      id: 'apt-10',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-yassine-k',
      youngName: 'Yassine K.',
      youngAge: '19 ans',
      dossierRef: 'Dossier 2194',
      title: 'Découverte métiers',
      motif: 'Exploration des métiers de l\'hôtellerie.',
      objectives: ['Sélection des entreprises partenaires'],
      date: '2026-11-24',
      startHour: '15:30',
      endHour: '16:30',
      durationMinutes: 60,
      modality: 'IN_PERSON',
      location: 'Centre des Possibles',
      status: 'CONFIRMED'
    },
    {
      id: 'apt-11',
      tenantId: DEMO_IDS.TENANT_NICE,
      counselorId: DEMO_IDS.COUNSELOR_SOPHIE,
      youngProfileId: 'young-camille-l',
      youngName: 'Camille L.',
      youngAge: '16 ans',
      dossierRef: 'Dossier 2195',
      title: 'Suivi Parcoursup',
      motif: 'Préparation des pièces du dossier.',
      objectives: ['Relecture des projets motivés'],
      date: '2026-11-25',
      startHour: '10:00',
      endHour: '11:00',
      durationMinutes: 60,
      modality: 'VIDEO',
      location: 'Visioconférence MonBilan+',
      status: 'PLANNED'
    }
  ];

  const followUpYouths: InMemoryFollowUpYouth[] = [
    {
      id: 'fu-1',
      youngName: 'Emma D.',
      avatarUrl: 'assets/visuals/avatar-emma.png',
      dossierRef: 'Rdv 2187',
      situation: 'INTERVIEW_COMPLETED',
      situationLabel: 'Entretien réalisé',
      situationBadgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      nextAction: 'Consulter le compte rendu',
      nextActionIcon: 'file-text',
      dueDate: undefined
    },
    {
      id: 'fu-2',
      youngName: 'Lucas M.',
      avatarUrl: 'assets/visuals/avatar-lucas.png',
      dossierRef: 'Dossier 2188',
      situation: 'PLANNED',
      situationLabel: 'Rendez-vous planifié',
      situationBadgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      nextAction: 'Préparer l\'entretien',
      nextActionIcon: 'pen-line',
      dueDate: '19 nov. 2026'
    },
    {
      id: 'fu-3',
      youngName: 'Aïcha D.',
      avatarUrl: 'assets/visuals/avatar-aicha.png',
      dossierRef: 'Dossier 2189',
      situation: 'ACTION_PENDING',
      situationLabel: 'Action en attente',
      situationBadgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
      nextAction: 'Vérifier l\'avancement (ressources, candidatures)',
      nextActionIcon: 'list-checks',
      dueDate: '21 nov. 2026'
    },
    {
      id: 'fu-4',
      youngName: 'Matéo R.',
      avatarUrl: 'assets/visuals/avatar-mateo.png',
      dossierRef: 'Dossier 2190',
      situation: 'IN_PROGRESS',
      situationLabel: 'Dossier en cours',
      situationBadgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
      nextAction: 'Examiner les éléments disponibles (extraction)',
      nextActionIcon: 'search',
      dueDate: undefined
    }
  ];

  return {
    report,
    restitution,
    questions,
    auditEvents,
    interview,
    assessments,
    episodes,
    fallbackWavBuffer: createCleanToneWavBuffer(4),
    partnerCompanies,
    immersionProjects,
    applications,
    observations,
    reviews,
    appointments,
    followUpYouths
  };
}

export const DEMO_SUPPORT_RESOURCES: DomainSupportResource[] = [
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
    badgeLabel: 'Service Public Gratuit'
  },
  {
    id: 'supp-cio-nice-valrose',
    name: "Centre d'Information et d'Orientation (CIO) Nice Valrose",
    category: 'CIO',
    categoryLabel: "CIO & Professionnels de l'orientation",
    description: 'Accompagnement personnalisé pour les lycéens, étudiants et jeunes sortis du système scolaire.',
    address: 'Campus Valrose - Bâtiment des Sciences',
    city: 'Nice',
    postalCode: '06108',
    phone: '04 93 84 89 22',
    email: 'cio-valrose@ac-nice.fr',
    websiteUrl: 'https://www.ac-nice.fr/orientation',
    isOfficialPublicService: true,
    badgeLabel: 'Service Public Gratuit'
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
    badgeLabel: '16–25 ans'
  },
  {
    id: 'supp-school-college-lycee',
    name: 'Équipes pédagogiques de ton Établissement Scolaire',
    category: 'SCHOOL',
    categoryLabel: 'Mon établissement scolaire',
    description: 'Ton professeur principal, les Psy-EN (psychologues de l’Éducation Nationale) et le référent orientation de ton collège ou lycée t’aident à formaliser ton projet et signer tes conventions de stage.',
    address: 'Auprès de ton secrétariat ou vie scolaire',
    city: 'Nice & Métropole',
    websiteUrl: 'https://www.education.gouv.fr/orientation-college-lycee',
    isOfficialPublicService: true,
    badgeLabel: 'Collège / Lycée'
  },
  {
    id: 'supp-1jeune1solution',
    name: '1jeune1solution (Gouvernement)',
    category: 'NATIONAL_PORTAL',
    categoryLabel: 'Ressources en ligne officielles',
    description: 'Plateforme nationale officielle pour trouver un emploi, une formation, une alternance ou un accompagnement près de chez toi.',
    websiteUrl: 'https://www.1jeune1solution.gouv.fr',
    isOfficialPublicService: true,
    badgeLabel: 'Portail Officiel'
  },
  {
    id: 'supp-immersion-facilee',
    name: 'Immersion Facilitée (Service Public)',
    category: 'NATIONAL_PORTAL',
    categoryLabel: 'Ressources en ligne officielles',
    description: 'Trouvez facilement une entreprise accueillante pour réaliser une période de mise en situation en milieu professionnel (PMSMP) conventionnée.',
    websiteUrl: 'https://immersion-facilee.beta.gouv.fr',
    isOfficialPublicService: true,
    badgeLabel: 'Convention PMSMP'
  }
];

let cachedOnetCatalog: DomainCareerCatalogItem[] | null = null;

export function loadOnetCareersCatalog(): DomainCareerCatalogItem[] {
  if (cachedOnetCatalog) {
    return cachedOnetCatalog;
  }

  const candidatePaths = [
    join(process.cwd(), 'prisma/seed/onet-careers.json'),
    join(process.cwd(), '2026-equipe-03/prisma/seed/onet-careers.json'),
    resolve(__dirname, '../../../../../prisma/seed/onet-careers.json')
  ];

  let rawList: any[] = [];
  for (const p of candidatePaths) {
    try {
      if (existsSync(p)) {
        const text = readFileSync(p, 'utf-8');
        rawList = JSON.parse(text);
        break;
      }
    } catch {
      // Continue to next path
    }
  }

  if (!rawList.length) {
    // Si fichier inaccessible, utiliser les 22 métiers vérifiés de la démo
    const fixture = createInitialDemoState();
    rawList = fixture.report.careers.map((c: DomainCareer) => ({
      onetSocCode: c.id,
      titleEn: c.titleFr,
      titleFr: c.titleFr,
      descriptionFr: c.description,
      jobZone: c.jobZone,
      jobZoneJustification: `Zone ${c.jobZone}`
    }));
  }

  cachedOnetCatalog = rawList.map((item, index) => {
    const cat = mapCareerToInterestCategory(item.titleFr, item.descriptionFr);
    return {
      id: item.onetSocCode ? `onet-${item.onetSocCode.replace(/[^a-zA-Z0-9]/g, '-')}` : `career-${index + 1}`,
      onetSocCode: item.onetSocCode || `soc-${index + 1}`,
      titleFr: item.titleFr,
      titleEn: item.titleEn || item.titleFr,
      descriptionFr: item.descriptionFr,
      jobZone: item.jobZone || 2,
      jobZoneJustification: item.jobZoneJustification || `Zone de préparation ${item.jobZone || 2}`,
      category: cat.category,
      categoryLabelFr: cat.label,
      suggestedActivities: [
        'Observation des activités principales et techniques employées',
        'Échange avec le tuteur sur le quotidien et les conditions de travail',
        'Visite des locaux et découverte des outils utilisés'
      ],
      suggestedQuestions: [
        'Qu’est-ce qui vous plaît le plus dans votre quotidien ?',
        'Quelles sont les compétences indispensables pour débuter ?',
        'Quel parcours ou formation conseilleriez-vous à un jeune ?'
      ],
      suggestedPathways: [
        `Voie professionnelle / apprentissage (Zone ${item.jobZone || 2})`,
        'Formations certifiées RNCP / Éducation Nationale'
      ],
      imageUrl: 'assets/visuals/career-peintre.png'
    };
  });

  return cachedOnetCatalog;
}

// ============================================================================
// Données Vérifiées Découverte Territoriale — Alpes-Maritimes & Nice (06)
// ============================================================================
import { DomainLocalOpportunity } from '@monbilan/domain';

export const DEMO_LOCAL_OPPORTUNITIES: DomainLocalOpportunity[] = [
  // Formations (18)
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

  // Organismes d'accompagnement (8)
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

  // Entreprises & immersions (12)
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
