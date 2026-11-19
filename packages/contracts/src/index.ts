// ============================================================================
// @monbilan/contracts — Schémas Zod, Contrats DTO REST & Payloads BullMQ (Sans PII)
// ============================================================================

import { z } from 'zod';

// 1. Payloads de jobs BullMQ — Strictement limités aux identifiants (Zéro PII dans Redis)
export const ExtractReportJobSchema = z.object({
  jobKey: z.string().min(1),
  tenantId: z.string().uuid(),
  reportId: z.string().uuid(),
  version: z.number().int().positive()
});

export const GenerateDraftJobSchema = z.object({
  jobKey: z.string().min(1),
  tenantId: z.string().uuid(),
  reportId: z.string().uuid(),
  requestedById: z.string().uuid(),
  version: z.number().int().positive()
});

export const GenerateAudioJobSchema = z.object({
  jobKey: z.string().min(1),
  tenantId: z.string().uuid(),
  restitutionId: z.string().uuid(),
  scriptHash: z.string().min(32),
  version: z.number().int().positive()
});

export type ExtractReportJobPayload = z.infer<typeof ExtractReportJobSchema>;
export type GenerateDraftJobPayload = z.infer<typeof GenerateDraftJobSchema>;
export type GenerateAudioJobPayload = z.infer<typeof GenerateAudioJobSchema>;

// 2. Schémas d'entrée API REST (Validation stricte côté contrôleur)
export const VerifyFactInputSchema = z.object({
  numericScore: z.number().min(0).max(7).optional(),
  rankOrder: z.number().int().min(1).max(10).optional(),
  label: z.string().min(2).max(200).optional(),
  isVerified: z.boolean()
});

export const UpdateClaimInputSchema = z.object({
  text: z.string().min(10).max(1500),
  reviewStatus: z.enum(['APPROVED', 'EDITED', 'REJECTED']),
  reviewerNote: z.string().max(500).optional()
});

export const ApproveRestitutionInputSchema = z.object({
  youngScript: z.string().min(30).max(8000),
  parentsSummary: z.string().min(30).max(5000),
  reviewerComment: z.string().max(1000).optional()
});

export const CreateQuestionInputSchema = z.object({
  reportId: z.string().uuid().optional(),
  relatedTopic: z.string().min(2).max(120),
  questionText: z.string().min(5).max(1000)
});

// 3. Schéma de sortie JSON strict imposé au LLM (Ollama / Qwen)
export const LLMGeneratedDraftSchema = z.object({
  youngScript: z.string().min(30),
  parentsSummary: z.string().min(30),
  claims: z.array(
    z.object({
      id: z.string(),
      kind: z.enum(['PERSONAL_FACT', 'CAREER_LINK', 'PEDAGOGICAL_TIP', 'PARENT_SUMMARY']),
      audience: z.enum(['YOUNG', 'PARENTS']),
      text: z.string().min(10),
      sourceFactIds: z.array(z.string()).min(1),
      referencedCareers: z.array(z.string()).optional()
    })
  ).min(1)
});

export type LLMGeneratedDraft = z.infer<typeof LLMGeneratedDraftSchema>;

// 4. Exports des contrats du parcours en 6 étapes
export * from './interview.dto.js';
export * from './career-matching.dto.js';
export * from './audio-episodes.dto.js';
export * from './immersion.dto.js';
export * from './autonomous.dto.js';

