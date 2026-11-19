// ============================================================================
// Modèle de Domaine — Découverte Territoriale « Autour de moi » (MonBilan+)
// ============================================================================

export type OpportunityCategory = 'ALL' | 'FORMATION' | 'ACCOMPAGNEMENT' | 'ENTREPRISE';

export interface DomainLocalOpportunity {
  id: string;
  name: string;
  category: 'FORMATION' | 'ACCOMPAGNEMENT' | 'ENTREPRISE';
  subType: string;
  city: string;
  postalCode: string;
  address: string;
  distanceKm: number;
  headline: string;
  description: string;
  targetCareers: string[];
  modalities: string[];
  diplomas?: string[];
  phone?: string;
  email?: string;
  websiteUrl?: string;
  transitInfo?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapSvgCoords: {
    x: number;
    y: number;
  };
  source: string;
  verified: boolean;
  isFavorite?: boolean;
  imageUrl?: string;
}

export interface DomainLocalFilterState {
  careerQuery?: string;
  city?: string;
  radiusKm?: number;
  category?: OpportunityCategory;
  sortBy?: 'relevance' | 'distance' | 'name';
}

export interface DomainCategoryCounts {
  total: number;
  formations: number;
  organismes: number;
  entreprises: number;
}
