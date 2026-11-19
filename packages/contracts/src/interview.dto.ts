// ============================================================================
// @monbilan/contracts — Schémas DTO pour le compte rendu d'entretien (Étape 02)
// ============================================================================

import { z } from 'zod';

export const SaveInterviewSummarySchema = z.object({
  counselorName: z.string().min(2).max(100),
  interviewDate: z.string().min(8).max(30),
  objective: z.string().min(5).max(500),
  synthesis: z.string().min(10).max(2000),
  expressedInterests: z.array(z.string().min(2).max(100)).min(1),
  explicitCareers: z.array(z.string().min(2).max(100)).default([]),
  motivations: z.array(z.string().min(2).max(200)).default([]),
  reservations: z.array(z.string().min(2).max(200)).default([]),
  professionalConclusions: z.object({
    tracksToDeepen: z.array(z.string().min(2).max(100)).default([]),
    tracksToExplore: z.array(z.string().min(2).max(100)).default([]),
    pointsToClarify: z.array(z.string().min(2).max(200)).default([]),
    suggestedNextSteps: z.array(z.string().min(2).max(200)).default([])
  })
});

export type SaveInterviewSummaryInput = z.infer<typeof SaveInterviewSummarySchema>;
