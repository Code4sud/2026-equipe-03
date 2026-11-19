// ============================================================================
// @monbilan/domain — Règles métier pures, Machine à États, ABAC & Zéro Hallucination
// Aucune dépendance externe (ni NestJS, ni Prisma, ni Redis, ni Ollama)
// ============================================================================

import { createHash } from 'node:crypto';

export type UserRole = 'PLATFORM_ADMIN' | 'TENANT_ADMIN' | 'COUNSELOR' | 'YOUNG';

export type ReportLifecycleStatus =
  | 'UPLOADED'
  | 'EXTRACTING'
  | 'EXTRACTION_REVIEW'
  | 'DRAFTING'
  | 'DRAFT_REVIEW'
  | 'APPROVED'
  | 'AUDIO_GENERATING'
  | 'READY'
  | 'PUBLISHED'
  | 'FAILED'
  | 'REJECTED'
  | 'SUPERSEDED';

export type FactCategory =
  | 'METADATA'
  | 'RIASEC_INTEREST'
  | 'COGNITIVE_APTITUDE'
  | 'HEXACO_PERSONALITY'
  | 'PSYCHOMOTOR'
  | 'CAREER_ZONE';

export type ExtractionConfidence =
  | 'EXACT_TEXT'
  | 'REQUIRES_HUMAN_REVIEW'
  | 'HUMAN_VERIFIED';

export type ClaimKind =
  | 'PERSONAL_FACT'
  | 'CAREER_LINK'
  | 'PEDAGOGICAL_TIP'
  | 'PARENT_SUMMARY';

export interface DomainFact {
  id: string;
  tenantId: string;
  reportId: string;
  category: FactCategory;
  factKey: string;
  label: string;
  rankOrder?: number | null;
  numericScore?: number | null;
  maxScore?: number | null;
  rawExcerpt: string;
  pageNumber: number;
  confidence: ExtractionConfidence;
  isVerified: boolean;
}

export interface DomainCareer {
  id: string;
  tenantId: string;
  reportId: string;
  jobZone: number;
  rankInZone: number;
  titleFr: string;
  description: string;
  pageNumber: number;
}

export interface DraftClaimCandidate {
  id: string;
  kind: ClaimKind;
  audience: 'YOUNG' | 'PARENTS';
  text: string;
  sourceFactIds: string[];
  referencedCareers?: string[];
}

export interface ClaimVerificationResult {
  isValid: boolean;
  violations: string[];
}

// ----------------------------------------------------------------------------
// 1. Machine à états stricte du workflow de restitution
// ----------------------------------------------------------------------------
const ALLOWED_TRANSITIONS: Record<ReportLifecycleStatus, ReportLifecycleStatus[]> = {
  UPLOADED: ['EXTRACTING', 'FAILED'],
  EXTRACTING: ['EXTRACTION_REVIEW', 'FAILED'],
  EXTRACTION_REVIEW: ['DRAFTING', 'REJECTED'],
  DRAFTING: ['DRAFT_REVIEW', 'FAILED'],
  DRAFT_REVIEW: ['APPROVED', 'EXTRACTION_REVIEW', 'REJECTED'],
  APPROVED: ['AUDIO_GENERATING', 'DRAFT_REVIEW', 'SUPERSEDED'],
  AUDIO_GENERATING: ['READY', 'FAILED'],
  READY: ['PUBLISHED', 'DRAFT_REVIEW', 'SUPERSEDED'],
  PUBLISHED: ['SUPERSEDED'],
  FAILED: ['EXTRACTING', 'DRAFTING', 'AUDIO_GENERATING'],
  REJECTED: ['EXTRACTION_REVIEW'],
  SUPERSEDED: []
};

export function canTransitionReportStatus(
  from: ReportLifecycleStatus,
  to: ReportLifecycleStatus
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidStatusTransition(
  from: ReportLifecycleStatus,
  to: ReportLifecycleStatus
): void {
  if (!canTransitionReportStatus(from, to)) {
    throw new Error(`Invalid report status transition from ${from} to ${to}`);
  }
}

// ----------------------------------------------------------------------------
// 2. Garde-fou "Zéro Hallucination" — Vérification des Claims et des Sources
// ----------------------------------------------------------------------------
const FORBIDDEN_DIAGNOSTIC_PATTERNS = [
  /\b(trouble|pathologie|tdah|autisme|dépression|bipolaire|dyslexie|diagnostic clinique|qi|quotient intellectuel)\b/i,
  /\b(tu es condamné|ton destin est|tu ne pourras jamais|impossible pour toi)\b/i
];

export function verifyGeneratedClaims(params: {
  tenantId: string;
  reportId: string;
  facts: DomainFact[];
  careers: DomainCareer[];
  claims: DraftClaimCandidate[];
}): ClaimVerificationResult {
  const violations: string[] = [];
  const factMap = new Map<string, DomainFact>();

  for (const fact of params.facts) {
    if (fact.tenantId !== params.tenantId || fact.reportId !== params.reportId) {
      violations.push(`Fact ${fact.id} does not belong to tenant/report context.`);
      continue;
    }
    factMap.set(fact.id, fact);
  }

  const allowedCareerTitles = new Set(
    params.careers
      .filter((c) => c.tenantId === params.tenantId && c.reportId === params.reportId)
      .map((c) => c.titleFr.trim().toLowerCase())
  );

  if (params.claims.length === 0) {
    violations.push('Restitution must contain at least one sourced claim.');
  }

  for (const claim of params.claims) {
    if (!claim.text || claim.text.trim().length < 10) {
      violations.push(`Claim ${claim.id} has empty or too short text.`);
    }

    for (const pattern of FORBIDDEN_DIAGNOSTIC_PATTERNS) {
      if (pattern.test(claim.text)) {
        violations.push(
          `Claim ${claim.id} contains forbidden psychological diagnostic or deterministic phrasing.`
        );
      }
    }

    if (!claim.sourceFactIds || claim.sourceFactIds.length === 0) {
      violations.push(`Claim ${claim.id} has no sourceFactIds (ungrounded claim forbidden).`);
      continue;
    }

    for (const sourceId of claim.sourceFactIds) {
      const sourceFact = factMap.get(sourceId);
      if (!sourceFact) {
        violations.push(`Claim ${claim.id} references unknown or cross-tenant factId "${sourceId}".`);
        continue;
      }
      if (sourceFact.confidence === 'REQUIRES_HUMAN_REVIEW' && !sourceFact.isVerified) {
        violations.push(
          `Claim ${claim.id} relies on unverified visual/chart fact "${sourceId}" (page ${sourceFact.pageNumber}). Counselor verification required first.`
        );
      }
    }

    if (claim.referencedCareers && claim.referencedCareers.length > 0) {
      for (const careerTitle of claim.referencedCareers) {
        if (!allowedCareerTitles.has(careerTitle.trim().toLowerCase())) {
          violations.push(
            `Claim ${claim.id} cites career "${careerTitle}" which is not present in the report's O*NET zones.`
          );
        }
      }
    }
  }

  return {
    isValid: violations.length === 0,
    violations
  };
}

// ----------------------------------------------------------------------------
// 3. Empreinte cryptographique du script (Invalidation Audio automatique)
// ----------------------------------------------------------------------------
export function computeScriptHash(youngScript: string, parentsSummary: string): string {
  return createHash('sha256')
    .update(`${youngScript.trim()}||${parentsSummary.trim()}`, 'utf8')
    .digest('hex');
}

export function shouldInvalidateAudio(previousHash: string, currentHash: string): boolean {
  return previousHash !== currentHash;
}

// ----------------------------------------------------------------------------
// 4. Moteur de politique d'accès RBAC + ABAC (Multi-Tenant & Dossier)
// ----------------------------------------------------------------------------
export interface AccessActor {
  userId: string;
  activeTenantId: string;
  memberTenantIds: string[];
  role: UserRole;
  assignedYoungProfileIds: string[];
  ownYoungProfileId?: string | null;
}

export interface ResourceDescriptor {
  tenantId: string;
  youngProfileId: string;
  status?: ReportLifecycleStatus;
}

export type PolicyAction =
  | 'READ_REPORT'
  | 'VERIFY_FACTS'
  | 'GENERATE_DRAFT'
  | 'APPROVE_RESTITUTION'
  | 'GENERATE_AUDIO'
  | 'PUBLISH_RESTITUTION'
  | 'READ_PUBLISHED_RESTITUTION'
  | 'CREATE_QUESTION';

export function evaluateAccessPolicy(
  actor: AccessActor,
  resource: ResourceDescriptor,
  action: PolicyAction
): { allowed: boolean; reason: string } {
  // Règle 1 : L'utilisateur doit être membre du tenant actif
  if (!actor.memberTenantIds.includes(actor.activeTenantId)) {
    return { allowed: false, reason: 'Actor is not a member of the active tenant.' };
  }

  // Règle 2 : Isolation stricte inter-tenant (aucune exception)
  if (actor.activeTenantId !== resource.tenantId) {
    return { allowed: false, reason: 'Cross-tenant access denied.' };
  }

  // Règle 3 : Politique par rôle et par attributs du dossier (ABAC)
  if (actor.role === 'TENANT_ADMIN' || actor.role === 'PLATFORM_ADMIN') {
    if (action === 'CREATE_QUESTION') {
      return { allowed: false, reason: 'Only young users can submit personal questions.' };
    }
    return { allowed: true, reason: 'Tenant admin access granted within tenant boundary.' };
  }

  if (actor.role === 'COUNSELOR') {
    const isAssigned = actor.assignedYoungProfileIds.includes(resource.youngProfileId);
    if (!isAssigned) {
      return {
        allowed: false,
        reason: 'Counselor is not assigned to this young profile within the tenant.'
      };
    }

    if (action === 'GENERATE_AUDIO' && resource.status !== 'APPROVED' && resource.status !== 'READY') {
      return {
        allowed: false,
        reason: 'Audio generation requires an explicitly APPROVED restitution.'
      };
    }

    if (action === 'PUBLISH_RESTITUTION' && resource.status !== 'READY' && resource.status !== 'APPROVED') {
      return {
        allowed: false,
        reason: 'Publication requires an APPROVED or READY restitution.'
      };
    }

    return { allowed: true, reason: 'Assigned counselor access granted.' };
  }

  if (actor.role === 'YOUNG') {
    if (!actor.ownYoungProfileId || actor.ownYoungProfileId !== resource.youngProfileId) {
      return { allowed: false, reason: 'Young user cannot access another young profile.' };
    }

    if (action === 'READ_PUBLISHED_RESTITUTION') {
      if (resource.status !== 'PUBLISHED') {
        return {
          allowed: false,
          reason: 'Young user can only view PUBLISHED restitutions (drafts are hidden).'
        };
      }
      return { allowed: true, reason: 'Young user reading own published restitution.' };
    }

    if (action === 'CREATE_QUESTION') {
      return { allowed: true, reason: 'Young user creating question on own profile.' };
    }

    return { allowed: false, reason: `Action ${action} is forbidden for role YOUNG.` };
  }

  return { allowed: false, reason: 'Unhandled role or policy condition.' };
}

// ----------------------------------------------------------------------------
// 5. Exports des nouveaux domaines du parcours 6 étapes
// ----------------------------------------------------------------------------
export * from './interview.js';
export * from './career-matching.js';
export * from './audio-episodes.js';

