// ============================================================================
// @monbilan/contracts — Schémas DTO pour la validation des métiers (Étape 04)
// ============================================================================

import { z } from 'zod';

export const CareerStatusSchema = z.enum([
  'TO_DEEPEN',
  'TO_EXPLORE',
  'DEFERRED',
  'NEEDS_REVIEW'
]);

export const UpdateCareerAssessmentSchema = z.object({
  finalStatus: CareerStatusSchema,
  counselorNote: z.string().max(500).optional(),
  correctedTitle: z.string().max(150).optional()
});

export const BulkValidateCareersSchema = z.object({
  assessments: z.array(
    z.object({
      careerId: z.string().min(1),
      finalStatus: CareerStatusSchema,
      counselorNote: z.string().max(500).optional()
    })
  )
});

export type UpdateCareerAssessmentInput = z.infer<typeof UpdateCareerAssessmentSchema>;
export type BulkValidateCareersInput = z.infer<typeof BulkValidateCareersSchema>;
