// ============================================================================
// DTOs & Schémas Zod — Parcours Autonome (MonBilan+)
// ============================================================================

import { z } from 'zod';

export const UpdateJourneyModeSchema = z.object({
  journeyMode: z.enum(['AUTONOMOUS', 'SUPPORTED']),
  reason: z.string().optional()
});
export type UpdateJourneyModeDto = z.infer<typeof UpdateJourneyModeSchema>;

export const CareerCatalogQuerySchema = z.object({
  query: z.string().optional(),
  category: z.enum(['ALL', 'CREATIVE', 'CRAFT', 'CARE', 'ORGANIZATION', 'DIGITAL', 'NATURE']).optional(),
  jobZone: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});
export type CareerCatalogQueryDto = z.infer<typeof CareerCatalogQuerySchema>;

export const CareerFavoriteSchema = z.object({
  careerId: z.string().min(1)
});
export type CareerFavoriteDto = z.infer<typeof CareerFavoriteSchema>;

export const SupportResourceQuerySchema = z.object({
  category: z.enum(['SCHOOL', 'MISSION_LOCALE', 'CIO', 'NATIONAL_PORTAL']).optional(),
  city: z.string().optional()
});
export type SupportResourceQueryDto = z.infer<typeof SupportResourceQuerySchema>;
