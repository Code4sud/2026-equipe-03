// ============================================================================
// Données vérifiées du Rapport des Possibles — Rdv 2187 (07/10/2026, 17 pages)
// - Classement RIASEC réel (p. 4) : Artistique, Entreprenant, Réaliste, Investigateur, Social, Conventionnel
// - 9 Aptitudes cognitives (p. 5) : explication qualitative vérifiée + réserve méthodologique
// - Classement HEXACO réel (p. 6) : Émotivité, Ouvert à l'expérience, Agréabilité, Humilité-honnêteté, Extraversion, Caractère consciencieux
// - Les 22 métiers proposés répartis sur les 5 zones de préparation (p. 8 à 16)
// - Réserve méthodologique finale de la page 17
// ============================================================================

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
  DomainImmersionReview
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
    reviews
  };
}
