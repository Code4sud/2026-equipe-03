// ============================================================================
// Tests Unitaires — Modèle et Génération des 6 Épisodes Audio Thématiques
// Vérifie le calibrage en mots (250-290 mots), les timestamps et les sources
// ============================================================================

import { describe, expect, it } from 'vitest';
import {
  countWords,
  validateEpisodeWordCount,
  EPISODE_TOPIC_DEFINITIONS
} from '@monbilan/domain';
import { buildDeterministicEpisodes } from '@monbilan/ai-adapters';

describe('AudioEpisodesEngine — Génération des 6 Épisodes Thématiques', () => {
  it('définit rigoureusement les 6 thématiques normées', () => {
    const keys = Object.keys(EPISODE_TOPIC_DEFINITIONS);
    expect(keys).toEqual([
      'COMPRENDRE_BILAN',
      'RIASEC_INTERETS',
      'APTITUDES_COGNITIVES',
      'HEXACO_PERSONNALITE',
      'METIERS_EXPLORER',
      'PREPARER_SUITE'
    ]);
  });

  it('génère exactement 6 épisodes complets', () => {
    const episodes = buildDeterministicEpisodes({
      restitutionId: 'rest-demo-1',
      reportId: 'rep-2187',
      youngDisplayName: 'Emma',
      facts: [],
      careers: [],
      assessments: [
        {
          id: 'as-1',
          careerId: 'c-1',
          reportId: 'rep-2187',
          jobZone: 3,
          rankInZone: 4,
          originalTitle: 'Technicien du son',
          normalizedTitle: 'technicien du son',
          description: 'Mixe le son.',
          pageNumber: 12,
          proposedStatus: 'TO_DEEPEN',
          rationale: 'Validé en entretien',
          evidence: [],
          finalStatus: 'TO_DEEPEN',
          isModifiedByCounselor: false
        }
      ]
    });

    expect(episodes.length).toBe(6);
    expect(episodes.map((e) => e.episodeNumber)).toEqual([1, 2, 3, 4, 5, 6]);

    for (const ep of episodes) {
      // 1. Vérification du calibrage (~250 à 290 mots)
      const wordCount = countWords(ep.script);
      expect(wordCount).toBeGreaterThanOrEqual(240);
      expect(wordCount).toBeLessThanOrEqual(310);

      const validation = validateEpisodeWordCount(ep.script);
      expect(validation.isCompliant).toBe(true);

      // 2. Vérification des segments de transcription
      expect(ep.transcriptSegments.length).toBeGreaterThanOrEqual(3);
      let previousEnd = -1;
      for (const seg of ep.transcriptSegments) {
        expect(seg.startMs).toBeGreaterThanOrEqual(previousEnd);
        expect(seg.endMs).toBeGreaterThan(seg.startMs);
        expect(seg.text.length).toBeGreaterThan(15);
        expect(seg.sourceReferences.length).toBeGreaterThan(0);
        previousEnd = seg.endMs;
      }

      // 3. Vérification des sources documentaires
      expect(ep.sourceReferences.length).toBeGreaterThan(0);
      for (const src of ep.sourceReferences) {
        expect(src.page).toBeGreaterThanOrEqual(1);
        expect(src.page).toBeLessThanOrEqual(17);
        expect(src.excerpt.length).toBeGreaterThan(10);
      }
    }
  });
});
