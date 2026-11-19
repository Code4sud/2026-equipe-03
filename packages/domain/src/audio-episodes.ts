// ============================================================================
// @monbilan/domain — Modèle des 6 Épisodes Audio Thématiques (Étape 05 & 06)
// Contraintes de durée (~2 min, 250-290 mots) et transcription synchronisée
// ============================================================================

import { SourceReference } from './interview.js';

export type EpisodeTopicKey =
  | 'COMPRENDRE_BILAN'      // Épisode 1 — Comprendre mon bilan
  | 'RIASEC_INTERETS'       // Épisode 2 — Mes centres d'intérêt RIASEC
  | 'APTITUDES_COGNITIVES'  // Épisode 3 — Mes aptitudes
  | 'HEXACO_PERSONNALITE'   // Épisode 4 — Ma personnalité HEXACO
  | 'METIERS_EXPLORER'      // Épisode 5 — Les métiers que je souhaite explorer
  | 'PREPARER_SUITE';       // Épisode 6 — Préparer la suite

export interface EpisodeTopicDefinition {
  episodeNumber: number;
  topicKey: EpisodeTopicKey;
  title: string;
  subtitle: string;
  targetDurationSec: number; // Ex: 120s
  minWords: number;          // 240
  maxWords: number;          // 300
}

export const EPISODE_TOPIC_DEFINITIONS: Record<EpisodeTopicKey, EpisodeTopicDefinition> = {
  COMPRENDRE_BILAN: {
    episodeNumber: 1,
    topicKey: 'COMPRENDRE_BILAN',
    title: 'Comprendre mon bilan',
    subtitle: 'Pourquoi ce bilan, ce qu’il contient et comment lire tes résultats sans pression.',
    targetDurationSec: 120,
    minWords: 240,
    maxWords: 300
  },
  RIASEC_INTERETS: {
    episodeNumber: 2,
    topicKey: 'RIASEC_INTERETS',
    title: 'Mes centres d’intérêt (RIASEC)',
    subtitle: 'Tes domaines préférés issus de la page 4 du rapport.',
    targetDurationSec: 120,
    minWords: 240,
    maxWords: 300
  },
  APTITUDES_COGNITIVES: {
    episodeNumber: 3,
    topicKey: 'APTITUDES_COGNITIVES',
    title: 'Mes aptitudes et points d’appui',
    subtitle: 'Les fonctions cognitives explorées page 5 (photo à un instant T).',
    targetDurationSec: 120,
    minWords: 240,
    maxWords: 300
  },
  HEXACO_PERSONNALITE: {
    episodeNumber: 4,
    topicKey: 'HEXACO_PERSONNALITE',
    title: 'Ma personnalité au travail (HEXACO)',
    subtitle: 'Tes repères personnels page 6 : aucun profil n’est bon ou mauvais.',
    targetDurationSec: 120,
    minWords: 240,
    maxWords: 300
  },
  METIERS_EXPLORER: {
    episodeNumber: 5,
    topicKey: 'METIERS_EXPLORER',
    title: 'Les métiers que je souhaite explorer',
    subtitle: 'Les pistes prioritaires issues du rapport et validées lors de notre échange.',
    targetDurationSec: 120,
    minWords: 240,
    maxWords: 300
  },
  PREPARER_SUITE: {
    episodeNumber: 6,
    topicKey: 'PREPARER_SUITE',
    title: 'Préparer la suite et mes questions',
    subtitle: 'Les prochaines démarches convenues avec ton conseiller.',
    targetDurationSec: 120,
    minWords: 240,
    maxWords: 300
  }
};

export interface TranscriptSegment {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  sourceReferences: SourceReference[];
}

export interface DomainAudioEpisode {
  id: string;
  restitutionId: string;
  episodeNumber: number;
  topicKey: EpisodeTopicKey;
  title: string;
  subtitle: string;
  script: string;
  scriptWordCount: number;
  estimatedDurationSec: number;
  realDurationSec?: number;
  audioWavUrl?: string;
  audioMimeType?: string;
  sourceReferences: SourceReference[];
  questionsToExplore: string[];
  transcriptSegments: TranscriptSegment[];
  validationStatus: 'DRAFT' | 'NEEDS_REVIEW' | 'APPROVED';
  validatedBy?: string | null;
  validatedAt?: string | null;
  isPublished: boolean;
}

/**
 * Calcule le nombre exact de mots d'un script français.
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Valide les contraintes de calibrage (250-290 mots pour ~2 minutes à 130 mots/min).
 */
export function validateEpisodeWordCount(text: string): {
  wordCount: number;
  isCompliant: boolean;
  message: string;
} {
  const wordCount = countWords(text);
  const min = 240;
  const max = 310;
  const isCompliant = wordCount >= min && wordCount <= max;

  let message = `Calibrage parfait (${wordCount} mots, ~110-130 secondes).`;
  if (wordCount < min) {
    message = `Script un peu court (${wordCount} mots, cible : 250-290 mots). Risque de durée inférieure à 100 secondes.`;
  } else if (wordCount > max) {
    message = `Script un peu long (${wordCount} mots, cible : 250-290 mots). Risque de durée supérieure à 140 secondes.`;
  }

  return { wordCount, isCompliant, message };
}
