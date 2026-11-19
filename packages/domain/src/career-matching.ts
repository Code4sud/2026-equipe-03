// ============================================================================
// @monbilan/domain — Moteur de Rapprochement Supervisé Métiers / Entretien (Étape 03 & 04)
// Règles déterministes, traçabilité des preuves et garde-fous stricts
// ============================================================================

import { DomainCareer } from './index.js';
import { DomainInterviewSummary, SourceReference } from './interview.js';

export type CareerStatus =
  | 'TO_DEEPEN'     // Intérêt explicite ou décision conjointe de l'approfondir
  | 'TO_EXPLORE'    // Métier du rapport non discuté en profondeur, piste restant ouverte
  | 'DEFERRED'      // Piste mise de côté temporairement selon le compte rendu
  | 'NEEDS_REVIEW'; // Ambiguïté nécessitant un arbitrage humain

export interface CareerAssessment {
  id: string;
  careerId: string;
  reportId: string;
  jobZone: number;
  rankInZone: number;
  originalTitle: string;
  normalizedTitle: string;
  description: string;
  pageNumber: number;
  proposedStatus: CareerStatus;
  rationale: string;
  evidence: SourceReference[];
  finalStatus: CareerStatus;
  counselorNote?: string;
  validatedBy?: string | null;
  validatedAt?: string | null;
  isModifiedByCounselor: boolean;
}

/**
 * Normalise un titre de métier pour comparaison sémantique sans altérer son sens.
 */
export function normalizeCareerTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .replace(/[^a-z0-9]/g, ' ')     // supprime la ponctuation
    .replace(/\s+/g, ' ')           // normalise les espaces
    .trim();
}

/**
 * Vérifie si deux intitulés correspondent via inclusion ou synonymie contrôlée.
 */
function matchesCareer(careerTitle: string, expression: string): boolean {
  const normCareer = normalizeCareerTitle(careerTitle);
  const normExpr = normalizeCareerTitle(expression);

  if (normCareer === normExpr) return true;
  if (normCareer.includes(normExpr) || normExpr.includes(normCareer)) return true;

  // Dictionnaire de correspondances contrôlées
  const synonyms: Record<string, string[]> = {
    'peintre decorateur': ['peinture', 'decoration', 'decorateur', 'artisanat d art'],
    'cuisinier en restauration rapide': ['fast food', 'cuisine rapide', 'restauration rapide'],
    'barista': ['cafe', 'coffee shop', 'boissons'],
    'acteur': ['theatre', 'cinema', 'comedien', 'comedie', 'jeu d acteur'],
    'coach sportif': ['sport', 'entraineur', 'fitness', 'remise en forme'],
    'technicien du son': ['son', 'musique', 'studio', 'mixage', 'podcast', 'audio'],
    'animateur radio': ['radio', 'chroniqueur', 'media', 'podcast', 'animation'],
    'producteur realisateur': ['cinema', 'audiovisuel', 'realisation', 'tournage'],
    'professeur des ecoles': ['instituteur', 'ecole primaire', 'enfants', 'enseignement']
  };

  for (const [key, list] of Object.entries(synonyms)) {
    if (normCareer.includes(key)) {
      if (list.some((syn) => normExpr.includes(syn))) return true;
    }
  }

  return false;
}

/**
 * Rapprochement supervisé des métiers du rapport avec le compte rendu d'entretien.
 * 
 * RÈGLES NON NÉGOCIABLES :
 * 1. Aucun métier du rapport n'est supprimé ou occulté.
 * 2. L'absence de mention n'est JAMAIS une preuve de désintérêt (statut TO_EXPLORE).
 * 3. Seule une mention explicite de mise de côté donne le statut DEFERRED.
 * 4. Une mention d'intérêt ou un choix professionnel donne TO_DEEPEN.
 * 5. Toute ambiguïté donne NEEDS_REVIEW.
 */
export function matchCareersWithInterview(
  careers: DomainCareer[],
  interview?: DomainInterviewSummary | null
): CareerAssessment[] {
  return careers.map((career) => {
    const originalTitle = career.titleFr;
    const normalizedTitle = normalizeCareerTitle(originalTitle);

    if (!interview) {
      return {
        id: `assessment-${career.id}`,
        careerId: career.id,
        reportId: career.reportId,
        jobZone: career.jobZone,
        rankInZone: career.rankInZone,
        originalTitle,
        normalizedTitle,
        description: career.description,
        pageNumber: career.pageNumber,
        proposedStatus: 'TO_EXPLORE',
        rationale: `Piste issue du Rapport des Possibles (Zone de préparation ${career.jobZone}). À explorer lors du prochain entretien avec le conseiller.`,
        evidence: [
          {
            documentId: `report-${career.reportId}`,
            page: career.pageNumber,
            excerpt: career.description,
            extractionMethod: 'REPORT_CAREER_ZONE'
          }
        ],
        finalStatus: 'TO_EXPLORE',
        isModifiedByCounselor: false
      };
    }

    // 1. Recherche dans les réserves explicites (DEFERRED)
    const matchingReservation = interview.reservations.find((res) =>
      matchesCareer(originalTitle, res)
    );
    if (matchingReservation) {
      const rationale = `Piste différée lors de l’entretien : le jeune a exprimé une réserve (« ${matchingReservation} »). Le métier reste consultable et pourra être réactivé ultérieurement.`;
      const evidence: SourceReference[] = [
        {
          documentId: `report-${career.reportId}`,
          page: career.pageNumber,
          excerpt: career.description,
          extractionMethod: 'REPORT_CAREER_ZONE'
        },
        {
          documentId: `interview-${interview.id}`,
          page: 1,
          excerpt: `Réserve exprimée : ${matchingReservation}`,
          extractionMethod: 'INTERVIEW_RESERVATION'
        }
      ];

      return {
        id: `assessment-${career.id}`,
        careerId: career.id,
        reportId: career.reportId,
        jobZone: career.jobZone,
        rankInZone: career.rankInZone,
        originalTitle,
        normalizedTitle,
        description: career.description,
        pageNumber: career.pageNumber,
        proposedStatus: 'DEFERRED',
        rationale,
        evidence,
        finalStatus: 'DEFERRED',
        isModifiedByCounselor: false
      };
    }

    // 2. Recherche dans les intérêts explicites ou conclusions professionnelles (TO_DEEPEN)
    const matchingExplicitCareer = interview.explicitCareers.find((c) =>
      matchesCareer(originalTitle, c)
    );
    const matchingInterest = interview.expressedInterests.find((i) =>
      matchesCareer(originalTitle, i)
    );
    const matchingTrack = interview.professionalConclusions.tracksToDeepen.find((t) =>
      matchesCareer(originalTitle, t)
    );

    if (matchingExplicitCareer || matchingInterest || matchingTrack) {
      const matchedTrigger = matchingExplicitCareer ?? matchingTrack ?? matchingInterest ?? '';
      const rationale = `Piste prioritaire à approfondir : correspond directement aux intérêts ou métiers explicitement validés en entretien (« ${matchedTrigger} »).`;
      const evidence: SourceReference[] = [
        {
          documentId: `report-${career.reportId}`,
          page: career.pageNumber,
          excerpt: career.description,
          extractionMethod: 'REPORT_CAREER_ZONE'
        },
        {
          documentId: `interview-${interview.id}`,
          page: 1,
          excerpt: `Intérêt validé en entretien : ${matchedTrigger}`,
          extractionMethod: 'INTERVIEW_INTENTION'
        }
      ];

      return {
        id: `assessment-${career.id}`,
        careerId: career.id,
        reportId: career.reportId,
        jobZone: career.jobZone,
        rankInZone: career.rankInZone,
        originalTitle,
        normalizedTitle,
        description: career.description,
        pageNumber: career.pageNumber,
        proposedStatus: 'TO_DEEPEN',
        rationale,
        evidence,
        finalStatus: 'TO_DEEPEN',
        isModifiedByCounselor: false
      };
    }

    // 3. Recherche dans les points à clarifier (NEEDS_REVIEW)
    const matchingClarify = interview.professionalConclusions.pointsToClarify.find((p) =>
      matchesCareer(originalTitle, p)
    );
    if (matchingClarify) {
      const rationale = `À clarifier avec le jeune : des interrogations ou conditions particulières ont été relevées (« ${matchingClarify} »).`;
      const evidence: SourceReference[] = [
        {
          documentId: `report-${career.reportId}`,
          page: career.pageNumber,
          excerpt: career.description,
          extractionMethod: 'REPORT_CAREER_ZONE'
        },
        {
          documentId: `interview-${interview.id}`,
          page: 1,
          excerpt: `Point à clarifier : ${matchingClarify}`,
          extractionMethod: 'INTERVIEW_POINT_TO_CLARIFY'
        }
      ];

      return {
        id: `assessment-${career.id}`,
        careerId: career.id,
        reportId: career.reportId,
        jobZone: career.jobZone,
        rankInZone: career.rankInZone,
        originalTitle,
        normalizedTitle,
        description: career.description,
        pageNumber: career.pageNumber,
        proposedStatus: 'NEEDS_REVIEW',
        rationale,
        evidence,
        finalStatus: 'NEEDS_REVIEW',
        isModifiedByCounselor: false
      };
    }

    // 4. Par défaut : TO_EXPLORE (Présent dans le rapport, non encore exploré)
    const rationale = `Piste ouverte du rapport (Zone ${career.jobZone}, page ${career.pageNumber}). Non approfondie lors du premier entretien mais conservée comme opportunité d’exploration.`;
    const evidence: SourceReference[] = [
      {
        documentId: `report-${career.reportId}`,
        page: career.pageNumber,
        excerpt: career.description,
        extractionMethod: 'REPORT_CAREER_ZONE'
      }
    ];

    return {
      id: `assessment-${career.id}`,
      careerId: career.id,
      reportId: career.reportId,
      jobZone: career.jobZone,
      rankInZone: career.rankInZone,
      originalTitle,
      normalizedTitle,
      description: career.description,
      pageNumber: career.pageNumber,
      proposedStatus: 'TO_EXPLORE',
      rationale,
      evidence,
      finalStatus: 'TO_EXPLORE',
      isModifiedByCounselor: false
    };
  });
}
