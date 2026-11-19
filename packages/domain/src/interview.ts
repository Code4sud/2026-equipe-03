// ============================================================================
// @monbilan/domain — Modèle d'Entretien Structuré avec le Psychologue (Étape 02)
// Saisie qualitative et factuelle sans enregistrement intrusif
// ============================================================================

export interface SourceReference {
  documentId: string;
  page: number;
  excerpt: string;
  extractionMethod: string;
  confidence?: number;
}

export interface InterviewIntention {
  id: string;
  category: 'INTEREST' | 'RESERVATION' | 'CAREER_MENTION' | 'QUESTION' | 'MOTIVATION';
  statement: string;
  relatedDomainOrJob?: string;
  tone?: 'POSITIVE' | 'NEUTRAL' | 'RESERVED';
}

export interface DomainInterviewSummary {
  id: string;
  tenantId: string;
  reportId: string;
  counselorId: string;
  counselorName: string;
  interviewDate: string; // ISO ou DD/MM/YYYY
  objective: string;
  synthesis: string;
  expressedInterests: string[];
  explicitCareers: string[];
  motivations: string[];
  reservations: string[];
  professionalConclusions: {
    tracksToDeepen: string[];
    tracksToExplore: string[];
    pointsToClarify: string[];
    suggestedNextSteps: string[];
  };
  isFinalized: boolean;
  finalizedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
