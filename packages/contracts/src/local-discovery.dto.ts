// ============================================================================
// DTOs & Validation Zod — Découverte Territoriale « Autour de moi » (MonBilan+)
// ============================================================================

import { z } from 'zod';

export const LocalOpportunitiesQuerySchema = z.object({
  career: z.string().optional(),
  city: z.string().optional(),
  radiusKm: z.coerce.number().min(1).max(200).optional().default(25),
  category: z.enum(['ALL', 'FORMATION', 'ACCOMPAGNEMENT', 'ENTREPRISE']).optional().default('ALL'),
  sort: z.enum(['relevance', 'distance', 'name']).optional().default('relevance')
});

export type LocalOpportunitiesQueryParams = z.infer<typeof LocalOpportunitiesQuerySchema>;

export const LocalOpportunityDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['FORMATION', 'ACCOMPAGNEMENT', 'ENTREPRISE']),
  subType: z.string(),
  city: z.string(),
  postalCode: z.string(),
  address: z.string(),
  distanceKm: z.number(),
  headline: z.string(),
  description: z.string(),
  targetCareers: z.array(z.string()),
  modalities: z.array(z.string()),
  diplomas: z.array(z.string()).optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  websiteUrl: z.string().optional(),
  transitInfo: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  mapSvgCoords: z.object({
    x: z.number(),
    y: z.number()
  }),
  source: z.string(),
  verified: z.boolean(),
  isFavorite: z.boolean().optional(),
  imageUrl: z.string().optional()
});

export type LocalOpportunityDTO = z.infer<typeof LocalOpportunityDTOSchema>;
