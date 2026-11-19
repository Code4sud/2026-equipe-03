// ============================================================================
// @monbilan/contracts — Schémas d'entrées API REST pour le module Immersion Pro
// ============================================================================

import { z } from 'zod';

export const ImmersionStatusSchema = z.enum([
  'DRAFT',
  'PREPARING',
  'SEARCHING',
  'APPLICATION_PENDING',
  'COMPANY_ACCEPTED',
  'ADMIN_PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
]);

export const ApplicationStatusSchema = z.enum([
  'DRAFT',
  'READY_TO_SEND',
  'SENT',
  'WAITING_REPLY',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED'
]);

export const CreateImmersionProjectSchema = z.object({
  careerId: z.string().min(1),
  careerTitle: z.string().min(2),
  targetDate: z.string().optional()
});

export const UpdateImmersionProjectSchema = z.object({
  step: z.number().int().min(1).max(6).optional(),
  status: ImmersionStatusSchema.optional(),
  selectedCompany: z.string().max(200).optional(),
  companyContact: z.string().max(200).optional(),
  targetDate: z.string().max(100).optional(),
  notes: z.string().max(1000).optional()
});

export const CreateApplicationSchema = z.object({
  companyName: z.string().min(2).max(200),
  careerTitle: z.string().min(2).max(200),
  targetPeriod: z.string().min(2).max(200),
  messageBody: z.string().min(10).max(4000),
  counselorHelp: z.boolean().default(false)
});

export const SaveObservationEntrySchema = z.object({
  dayNumber: z.number().int().min(1).max(30),
  discoveredText: z.string().max(2000).optional(),
  surprisedText: z.string().max(2000).optional(),
  questionText: z.string().max(2000).optional()
});

export const SaveImmersionReviewSchema = z.object({
  likedAspects: z.string().max(2000).optional(),
  dislikedAspects: z.string().max(2000).optional(),
  surprises: z.string().max(2000).optional(),
  wantToPursue: z.boolean().default(false),
  questionsToAsk: z.string().max(2000).optional(),
  sharedWithCounselor: z.boolean().default(false)
});

export type CreateImmersionProjectInput = z.infer<typeof CreateImmersionProjectSchema>;
export type UpdateImmersionProjectInput = z.infer<typeof UpdateImmersionProjectSchema>;
export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type SaveObservationEntryInput = z.infer<typeof SaveObservationEntrySchema>;
export type SaveImmersionReviewInput = z.infer<typeof SaveImmersionReviewSchema>;
