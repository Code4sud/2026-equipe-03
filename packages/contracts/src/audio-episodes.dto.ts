// ============================================================================
// @monbilan/contracts — Schémas DTO pour les 6 Épisodes Audio Thématiques (Étape 05)
// ============================================================================

import { z } from 'zod';

export const EpisodeTopicKeySchema = z.enum([
  'COMPRENDRE_BILAN',
  'RIASEC_INTERETS',
  'APTITUDES_COGNITIVES',
  'HEXACO_PERSONNALITE',
  'METIERS_EXPLORER',
  'PREPARER_SUITE'
]);

export const UpdateEpisodeScriptSchema = z.object({
  script: z.string().min(50).max(4000),
  validationStatus: z.enum(['DRAFT', 'NEEDS_REVIEW', 'APPROVED']),
  reviewerComment: z.string().max(500).optional()
});

export const GenerateEpisodesJobSchema = z.object({
  jobKey: z.string().min(1),
  tenantId: z.string().uuid(),
  reportId: z.string().uuid(),
  restitutionId: z.string().uuid(),
  version: z.number().int().positive()
});

export type UpdateEpisodeScriptInput = z.infer<typeof UpdateEpisodeScriptSchema>;
export type GenerateEpisodesJobPayload = z.infer<typeof GenerateEpisodesJobSchema>;
