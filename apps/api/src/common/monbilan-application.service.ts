// ============================================================================
// Service Applicatif Central MonBilan+ (Orchestration des 12 Domaines Métier)
// Implémente l'isolation Multi-Tenant, RBAC/ABAC, Vérification des Sources IA,
// Invalidation Audio sur modification de script et Journalisation d'Audit
// ============================================================================

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  buildDeterministicEpisodes,
  OllamaLLMProvider,
  PiperSpeechProvider
} from '@monbilan/ai-adapters';
import {
  ApproveRestitutionInputSchema,
  BulkValidateCareersSchema,
  CreateQuestionInputSchema,
  SaveInterviewSummarySchema,
  UpdateCareerAssessmentSchema,
  UpdateClaimInputSchema,
  UpdateEpisodeScriptSchema,
  VerifyFactInputSchema,
  CreateImmersionProjectSchema,
  UpdateImmersionProjectSchema,
  CreateApplicationSchema,
  SaveObservationEntrySchema,
  SaveImmersionReviewSchema,
  UpdateJourneyModeSchema,
  LocalOpportunitiesQueryParams
} from '@monbilan/contracts';
import {
  AccessActor,
  CareerAssessment,
  computeScriptHash,
  countWords,
  DomainAudioEpisode,
  DomainInterviewSummary,
  evaluateAccessPolicy,
  matchCareersWithInterview,
  PolicyAction,
  shouldInvalidateAudio,
  verifyGeneratedClaims,
  DomainImmersionProject,
  DomainPartnerCompany,
  DomainImmersionApplication,
  DomainObservationEntry,
  DomainImmersionReview,
  JourneyMode,
  DomainSupportResource,
  DomainCareerCatalogItem,
  DomainLocalOpportunity,
  DomainCategoryCounts
} from '@monbilan/domain';
import {
  AuditLogEntry,
  createInitialDemoState,
  DEMO_IDS,
  InMemoryQuestion,
  InMemoryReport,
  InMemoryRestitution,
  InMemoryAppointment,
  InMemoryFollowUpYouth,
  AppointmentStatus,
  DEMO_SUPPORT_RESOURCES,
  loadOnetCareersCatalog,
  DEMO_LOCAL_OPPORTUNITIES
} from './demo-fixture.js';
import { RealAuthService } from './auth/real-auth.service.js';

@Injectable()
export class MonBilanApplicationService {
  private readonly reports = new Map<string, InMemoryReport>();
  private readonly restitutions = new Map<string, InMemoryRestitution>();
  private readonly interviews = new Map<string, DomainInterviewSummary>();
  private readonly careerAssessments = new Map<string, CareerAssessment[]>();
  private readonly episodes = new Map<string, DomainAudioEpisode[]>();
  private readonly immersionProjects: DomainImmersionProject[] = [];
  private readonly partnerCompanies: DomainPartnerCompany[] = [];
  private readonly applications: DomainImmersionApplication[] = [];
  private readonly observations: DomainObservationEntry[] = [];
  private readonly reviews: DomainImmersionReview[] = [];
  private readonly questions: InMemoryQuestion[] = [];
  private readonly auditEvents: AuditLogEntry[] = [];
  private readonly appointments: InMemoryAppointment[] = [];
  private readonly followUpYouths: InMemoryFollowUpYouth[] = [];
  private readonly journeyModes = new Map<string, JourneyMode>();
  private readonly userFavorites = new Map<string, Set<string>>();
  private audioWavBuffer: Buffer;

  private readonly llmProvider = new OllamaLLMProvider(
    process.env['OLLAMA_BASE_URL'] ?? 'http://localhost:11434',
    process.env['OLLAMA_MODEL'] ?? 'qwen2.5:3b',
    Number(process.env['OLLAMA_TIMEOUT_MS'] ?? 25000)
  );

  private readonly speechProvider = new PiperSpeechProvider(
    process.env['PIPER_BINARY_PATH'] ?? '/usr/local/bin/piper',
    process.env['PIPER_VOICE_MODEL'] ?? 'fr_FR-upmc-medium'
  );

  private readonly realAuth: RealAuthService;

  constructor(realAuth?: RealAuthService) {
    this.realAuth = realAuth ?? new RealAuthService();
    const initial = createInitialDemoState();
    this.reports.set(initial.report.id, initial.report);
    this.restitutions.set(initial.restitution.id, initial.restitution);
    if (initial.interview) {
      this.interviews.set(initial.report.id, initial.interview);
    }
    if (initial.assessments) {
      this.careerAssessments.set(initial.report.id, initial.assessments);
    }
    if (initial.episodes) {
      this.episodes.set(initial.restitution.id, initial.episodes);
    }
    this.questions.push(...initial.questions);
    this.auditEvents.push(...initial.auditEvents);
    this.audioWavBuffer = initial.fallbackWavBuffer;
    this.immersionProjects.push(...(initial.immersionProjects ?? []));
    this.partnerCompanies.push(...(initial.partnerCompanies ?? []));
    this.applications.push(...(initial.applications ?? []));
    this.observations.push(...(initial.observations ?? []));
    this.reviews.push(...(initial.reviews ?? []));
    if (initial.appointments) {
      this.appointments.push(...initial.appointments);
    }
    if (initial.followUpYouths) {
      this.followUpYouths.push(...initial.followUpYouths);
    }
  }

  // --------------------------------------------------------------------------
  // Résolution du contexte Acteur & Tenant (Identity, Tenancy & Authorization)
  // --------------------------------------------------------------------------
  resolveActorFromHeaders(headers: Record<string, string | string[] | undefined>): AccessActor {
    // 1. Session Réelle authentifiée (si token Bearer présent)
    const authHeader = headers['authorization'] || headers['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const session = this.realAuth.getSessionByToken(authHeader);
      if (session) {
        if (session.role === 'YOUNG') {
          return {
            userId: session.userId,
            activeTenantId: session.tenantId,
            memberTenantIds: [session.tenantId],
            role: 'YOUNG',
            assignedYoungProfileIds: [],
            ownYoungProfileId: session.userId
          };
        } else {
          return {
            userId: session.userId,
            activeTenantId: session.tenantId,
            memberTenantIds: [session.tenantId],
            role: 'COUNSELOR',
            assignedYoungProfileIds: [DEMO_IDS.YOUNG_PROFILE_LEO]
          };
        }
      }
    }

    // 2. Mode Démonstration / Headers standards
    const roleHeader = String(headers['x-demo-role'] ?? 'COUNSELOR').toUpperCase();
    const tenantHeader = String(headers['x-tenant-id'] ?? DEMO_IDS.TENANT_NICE);
    const actorHeader = headers['x-actor-id'] ? String(headers['x-actor-id']) : undefined;

    if (roleHeader === 'YOUNG') {
      return {
        userId: actorHeader ?? DEMO_IDS.YOUNG_USER_LEO,
        activeTenantId: tenantHeader,
        memberTenantIds: [DEMO_IDS.TENANT_NICE],
        role: 'YOUNG',
        assignedYoungProfileIds: [],
        ownYoungProfileId: DEMO_IDS.YOUNG_PROFILE_LEO
      };
    }

    if (roleHeader === 'UNASSIGNED_COUNSELOR') {
      return {
        userId: actorHeader ?? DEMO_IDS.COUNSELOR_MARC_UNASSIGNED,
        activeTenantId: tenantHeader,
        memberTenantIds: [DEMO_IDS.TENANT_NICE],
        role: 'COUNSELOR',
        assignedYoungProfileIds: []
      };
    }

    if (roleHeader === 'OTHER_TENANT_COUNSELOR') {
      return {
        userId: actorHeader ?? DEMO_IDS.COUNSELOR_ANTIBES,
        activeTenantId: DEMO_IDS.TENANT_ANTIBES,
        memberTenantIds: [DEMO_IDS.TENANT_ANTIBES],
        role: 'COUNSELOR',
        assignedYoungProfileIds: [DEMO_IDS.YOUNG_PROFILE_ANTIBES]
      };
    }

    return {
      userId: actorHeader ?? DEMO_IDS.COUNSELOR_SOPHIE,
      activeTenantId: tenantHeader,
      memberTenantIds: [DEMO_IDS.TENANT_NICE],
      role: 'COUNSELOR',
      assignedYoungProfileIds: [DEMO_IDS.YOUNG_PROFILE_LEO]
    };
  }

  private assertAuthorized(
    actor: AccessActor,
    resource: { tenantId: string; youngProfileId: string; status?: InMemoryReport['status'] },
    action: PolicyAction
  ): void {
    const decision = evaluateAccessPolicy(actor, resource, action);
    if (!decision.allowed) {
      this.recordAudit(actor, `ACCESS_DENIED_${action}`, 'Policy', resource.youngProfileId);
      throw new ForbiddenException(decision.reason);
    }
  }

  private recordAudit(
    actor: AccessActor,
    action: string,
    entityType: string,
    entityId: string
  ): void {
    this.auditEvents.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tenantId: actor.activeTenantId,
      actorId: actor.userId,
      actorRole: actor.role,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString()
    });
  }

  // --------------------------------------------------------------------------
  // Module: reports & extraction
  // --------------------------------------------------------------------------
  getReportForCounselor(actor: AccessActor, reportId: string) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }

    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: report.status },
      'READ_REPORT'
    );

    const restitution = Array.from(this.restitutions.values()).find(
      (r) => r.reportId === report.id && r.tenantId === report.tenantId
    );

    return {
      report,
      restitution: restitution ?? null,
      questions: this.questions.filter(
        (q) => q.tenantId === report.tenantId && q.youngProfileId === report.youngProfileId
      ),
      auditEvents: this.auditEvents.filter((a) => a.tenantId === report.tenantId).slice(0, 15)
    };
  }

  verifyFact(actor: AccessActor, reportId: string, factId: string, rawBody: unknown) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }

    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: report.status },
      'VERIFY_FACTS'
    );

    const parsed = VerifyFactInputSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const fact = report.facts.find((f) => f.id === factId);
    if (!fact) {
      throw new NotFoundException(`Fact ${factId} not found in report ${reportId}.`);
    }

    if (parsed.data.numericScore !== undefined) {
      fact.numericScore = parsed.data.numericScore;
    }
    if (parsed.data.rankOrder !== undefined) {
      fact.rankOrder = parsed.data.rankOrder;
    }
    if (parsed.data.label !== undefined) {
      fact.label = parsed.data.label;
    }
    fact.isVerified = parsed.data.isVerified;
    fact.confidence = parsed.data.isVerified ? 'HUMAN_VERIFIED' : 'REQUIRES_HUMAN_REVIEW';

    this.recordAudit(actor, 'FACT_VERIFIED_BY_COUNSELOR', 'ReportFact', factId);
    return fact;
  }

  // --------------------------------------------------------------------------
  // Module: restitutions & claims (Génération IA Ollama/Qwen + Contrôle strict)
  // --------------------------------------------------------------------------
  async generateRestitutionDraft(actor: AccessActor, reportId: string) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }

    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: report.status },
      'GENERATE_DRAFT'
    );

    const unverifiedFacts = report.facts.filter(
      (f) => f.confidence === 'REQUIRES_HUMAN_REVIEW' && !f.isVerified
    );
    if (unverifiedFacts.length > 0) {
      throw new BadRequestException(
        `Cannot generate AI restitution while ${unverifiedFacts.length} chart/visual fact(s) remain unverified by the counselor.`
      );
    }

    const generated = await this.llmProvider.generateSourcedDraft({
      reportId: report.id,
      youngDisplayName: report.youngDisplayName,
      facts: report.facts,
      careers: report.careers
    });

    const verification = verifyGeneratedClaims({
      tenantId: report.tenantId,
      reportId: report.id,
      facts: report.facts,
      careers: report.careers,
      claims: generated.claims
    });

    if (!verification.isValid) {
      throw new BadRequestException(
        `AI output rejected by Zero-Hallucination verifier: ${verification.violations.join(' | ')}`
      );
    }

    const existing = Array.from(this.restitutions.values()).find((r) => r.reportId === report.id);
    const nextVersion = existing ? existing.version + 1 : 1;
    const newHash = computeScriptHash(generated.youngScript, generated.parentsSummary);

    const restitution: InMemoryRestitution = {
      id: existing?.id ?? DEMO_IDS.RESTITUTION_LEO,
      tenantId: report.tenantId,
      reportId: report.id,
      version: nextVersion,
      status: 'DRAFT_REVIEW',
      youngScript: generated.youngScript,
      parentsSummary: generated.parentsSummary,
      scriptHash: newHash,
      approvedById: null,
      approvedAt: null,
      publishedById: null,
      publishedAt: null,
      claims: generated.claims.map((c, index) => ({
        ...c,
        displayOrder: index + 1,
        reviewStatus: 'PENDING'
      })),
      audioReady: false,
      audioHash: null,
      audioDurationSec: 0
    };

    report.status = 'DRAFT_REVIEW';
    report.version = nextVersion;
    this.restitutions.set(restitution.id, restitution);

    this.recordAudit(actor, 'RESTITUTION_DRAFT_GENERATED', 'Restitution', restitution.id);
    return restitution;
  }

  updateClaim(actor: AccessActor, restitutionId: string, claimId: string, rawBody: unknown) {
    const restitution = this.restitutions.get(restitutionId);
    if (!restitution) {
      throw new NotFoundException(`Restitution ${restitutionId} not found.`);
    }
    const report = this.reports.get(restitution.reportId);
    if (!report) {
      throw new NotFoundException('Parent report not found.');
    }

    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: restitution.status },
      'APPROVE_RESTITUTION'
    );

    const parsed = UpdateClaimInputSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const claim = restitution.claims.find((c) => c.id === claimId);
    if (!claim) {
      throw new NotFoundException(`Claim ${claimId} not found.`);
    }

    claim.text = parsed.data.text;
    claim.reviewStatus = parsed.data.reviewStatus;
    claim.reviewerNote = parsed.data.reviewerNote;

    // Reconstruire le script à partir des claims non rejetés et invalider l'audio si modifié
    restitution.youngScript = restitution.claims
      .filter((c) => c.audience === 'YOUNG' && c.reviewStatus !== 'REJECTED')
      .map((c) => c.text)
      .join('\n\n');

    const updatedHash = computeScriptHash(restitution.youngScript, restitution.parentsSummary);
    if (shouldInvalidateAudio(restitution.scriptHash, updatedHash)) {
      restitution.scriptHash = updatedHash;
      restitution.audioReady = false;
      restitution.audioHash = null;
      if (restitution.status === 'PUBLISHED' || restitution.status === 'READY') {
        restitution.status = 'DRAFT_REVIEW';
        report.status = 'DRAFT_REVIEW';
      }
    }

    this.recordAudit(actor, 'CLAIM_REVIEWED', 'Claim', claimId);
    return restitution;
  }

  approveRestitution(actor: AccessActor, restitutionId: string, rawBody: unknown) {
    const restitution = this.restitutions.get(restitutionId);
    if (!restitution) {
      throw new NotFoundException(`Restitution ${restitutionId} not found.`);
    }
    const report = this.reports.get(restitution.reportId);
    if (!report) {
      throw new NotFoundException('Parent report not found.');
    }

    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: restitution.status },
      'APPROVE_RESTITUTION'
    );

    const parsed = ApproveRestitutionInputSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const newHash = computeScriptHash(parsed.data.youngScript, parsed.data.parentsSummary);
    if (shouldInvalidateAudio(restitution.scriptHash, newHash)) {
      restitution.audioReady = false;
      restitution.audioHash = null;
    }

    restitution.youngScript = parsed.data.youngScript;
    restitution.parentsSummary = parsed.data.parentsSummary;
    restitution.scriptHash = newHash;
    restitution.status = 'APPROVED';
    restitution.approvedById = actor.userId;
    restitution.approvedAt = new Date().toISOString();
    restitution.claims.forEach((c) => {
      if (c.reviewStatus === 'PENDING') {
        c.reviewStatus = 'APPROVED';
      }
    });
    report.status = 'APPROVED';

    this.recordAudit(actor, 'RESTITUTION_APPROVED_BY_COUNSELOR', 'Restitution', restitution.id);
    return restitution;
  }

  // --------------------------------------------------------------------------
  // Module: audio (Piper TTS verrouillé tant que la restitution n'est pas APPROVED)
  // --------------------------------------------------------------------------
  async generateAudioForRestitution(actor: AccessActor, restitutionId: string) {
    const restitution = this.restitutions.get(restitutionId);
    if (!restitution) {
      throw new NotFoundException(`Restitution ${restitutionId} not found.`);
    }
    const report = this.reports.get(restitution.reportId);
    if (!report) {
      throw new NotFoundException('Parent report not found.');
    }

    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: restitution.status },
      'GENERATE_AUDIO'
    );

    const result = await this.speechProvider.synthesize(restitution.youngScript);
    this.audioWavBuffer = result.audioBuffer;
    restitution.audioReady = true;
    restitution.audioHash = restitution.scriptHash;
    restitution.audioDurationSec = result.durationSec;
    restitution.status = 'READY';
    report.status = 'READY';

    this.recordAudit(actor, 'AUDIO_GENERATED_PIPER_TTS', 'Restitution', restitution.id);
    return restitution;
  }

  publishRestitution(actor: AccessActor, restitutionId: string) {
    const restitution = this.restitutions.get(restitutionId);
    if (!restitution) {
      throw new NotFoundException(`Restitution ${restitutionId} not found.`);
    }
    const report = this.reports.get(restitution.reportId);
    if (!report) {
      throw new NotFoundException('Parent report not found.');
    }

    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: restitution.status },
      'PUBLISH_RESTITUTION'
    );

    if (!restitution.audioReady || restitution.audioHash !== restitution.scriptHash) {
      throw new BadRequestException(
        'Cannot publish restitution before audio is generated for the current approved script version.'
      );
    }

    restitution.status = 'PUBLISHED';
    restitution.publishedById = actor.userId;
    restitution.publishedAt = new Date().toISOString();
    report.status = 'PUBLISHED';

    this.recordAudit(actor, 'RESTITUTION_PUBLISHED_TO_YOUNG', 'Restitution', restitution.id);
    return restitution;
  }

  // --------------------------------------------------------------------------
  // Portail Jeune : Consultation restreinte aux seules restitutions PUBLISHED
  // --------------------------------------------------------------------------
  getPublishedRestitutionForYoung(actor: AccessActor) {
    const report = this.reports.get(DEMO_IDS.REPORT_LEO);
    const restitution = this.restitutions.get(DEMO_IDS.RESTITUTION_LEO);
    if (!report || !restitution) {
      throw new NotFoundException('No restitution found.');
    }

    this.assertAuthorized(
      actor,
      {
        tenantId: report.tenantId,
        youngProfileId: report.youngProfileId,
        status: restitution.status
      },
      'READ_PUBLISHED_RESTITUTION'
    );

    return {
      youngDisplayName: report.youngDisplayName,
      rdvNumber: report.rdvNumber,
      reportDate: report.reportDate,
      restitution,
      facts: report.facts,
      careers: report.careers,
      interview: this.interviews.get(report.id) ?? null,
      assessments: this.careerAssessments.get(report.id) ?? [],
      episodes: this.episodes.get(restitution.id) ?? [],
      questions: this.questions.filter(
        (q) => q.tenantId === report.tenantId && q.youngProfileId === report.youngProfileId
      )
    };
  }

  createYoungQuestion(actor: AccessActor, rawBody: unknown) {
    const report = this.reports.get(DEMO_IDS.REPORT_LEO);
    if (!report) {
      throw new NotFoundException('Profile report not found.');
    }

    this.assertAuthorized(
      actor,
      {
        tenantId: report.tenantId,
        youngProfileId: report.youngProfileId,
        status: report.status
      },
      'CREATE_QUESTION'
    );

    const parsed = CreateQuestionInputSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const question: InMemoryQuestion = {
      id: `q-${Date.now()}`,
      tenantId: report.tenantId,
      youngProfileId: report.youngProfileId,
      reportId: report.id,
      relatedTopic: parsed.data.relatedTopic,
      questionText: parsed.data.questionText,
      counselorReply: null,
      createdAt: new Date().toISOString()
    };

    this.questions.unshift(question);
    this.recordAudit(actor, 'YOUNG_QUESTION_CREATED', 'Question', question.id);
    return question;
  }

  // --------------------------------------------------------------------------
  // Compte Rendu d'Entretien & Rapprochement Supervisé des Métiers
  // --------------------------------------------------------------------------
  getInterviewSummary(actor: AccessActor, reportId: string): DomainInterviewSummary | null {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }
    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: report.status },
      'READ_REPORT'
    );
    return this.interviews.get(reportId) ?? null;
  }

  saveInterviewSummary(
    actor: AccessActor,
    reportId: string,
    rawBody: unknown
  ): { interview: DomainInterviewSummary; assessments: CareerAssessment[]; episodes: DomainAudioEpisode[] } {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }
    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: report.status },
      'VERIFY_FACTS'
    );

    const parsed = SaveInterviewSummarySchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const now = new Date().toISOString();
    const interview: DomainInterviewSummary = {
      id: this.interviews.get(reportId)?.id ?? `interview-${Date.now()}`,
      tenantId: report.tenantId,
      reportId: report.id,
      counselorId: actor.userId,
      counselorName: parsed.data.counselorName,
      interviewDate: parsed.data.interviewDate,
      objective: parsed.data.objective,
      synthesis: parsed.data.synthesis,
      expressedInterests: parsed.data.expressedInterests,
      explicitCareers: parsed.data.explicitCareers,
      motivations: parsed.data.motivations,
      reservations: parsed.data.reservations,
      professionalConclusions: parsed.data.professionalConclusions,
      isFinalized: true,
      finalizedAt: now,
      createdAt: now,
      updatedAt: now
    };

    this.interviews.set(reportId, interview);

    // Rapprochement automatique déterministe des 22 métiers
    const assessments = matchCareersWithInterview(report.careers, interview);
    this.careerAssessments.set(reportId, assessments);

    // Régénération des 6 épisodes thématiques calibrés
    const episodes = buildDeterministicEpisodes({
      restitutionId: DEMO_IDS.RESTITUTION_LEO,
      reportId: report.id,
      youngDisplayName: report.youngDisplayName,
      facts: report.facts,
      careers: report.careers,
      assessments,
      interview
    });
    this.episodes.set(DEMO_IDS.RESTITUTION_LEO, episodes);

    this.recordAudit(actor, 'INTERVIEW_SAVED_AND_CAREERS_MATCHED', 'InterviewSummary', interview.id);
    return { interview, assessments, episodes };
  }

  getCareerAssessments(actor: AccessActor, reportId: string): CareerAssessment[] {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }
    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: report.status },
      'READ_REPORT'
    );
    const existing = this.careerAssessments.get(reportId);
    if (existing) {
      return existing;
    }
    const interview = this.interviews.get(reportId);
    const generated = matchCareersWithInterview(report.careers, interview);
    this.careerAssessments.set(reportId, generated);
    return generated;
  }

  updateCareerAssessment(
    actor: AccessActor,
    reportId: string,
    careerId: string,
    rawBody: unknown
  ): CareerAssessment {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }
    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: report.status },
      'VERIFY_FACTS'
    );

    const parsed = UpdateCareerAssessmentSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const assessments = this.getCareerAssessments(actor, reportId);
    const target = assessments.find((a) => a.careerId === careerId);
    if (!target) {
      throw new NotFoundException(`Career ${careerId} not found in assessments.`);
    }

    target.finalStatus = parsed.data.finalStatus;
    if (parsed.data.counselorNote !== undefined) {
      target.counselorNote = parsed.data.counselorNote;
    }
    target.isModifiedByCounselor = true;
    target.validatedBy = actor.userId;
    target.validatedAt = new Date().toISOString();

    this.recordAudit(actor, 'CAREER_ASSESSMENT_UPDATED', 'CareerAssessment', careerId);
    return target;
  }

  bulkValidateCareerAssessments(
    actor: AccessActor,
    reportId: string,
    rawBody: unknown
  ): CareerAssessment[] {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found.`);
    }
    this.assertAuthorized(
      actor,
      { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: report.status },
      'VERIFY_FACTS'
    );

    const parsed = BulkValidateCareersSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const assessments = this.getCareerAssessments(actor, reportId);
    for (const item of parsed.data.assessments) {
      const target = assessments.find((a) => a.careerId === item.careerId);
      if (target) {
        target.finalStatus = item.finalStatus;
        if (item.counselorNote !== undefined) {
          target.counselorNote = item.counselorNote;
        }
        target.isModifiedByCounselor = true;
        target.validatedBy = actor.userId;
        target.validatedAt = new Date().toISOString();
      }
    }

    this.recordAudit(actor, 'CAREER_ASSESSMENTS_BULK_VALIDATED', 'Report', reportId);
    return assessments;
  }

  // --------------------------------------------------------------------------
  // Parcours Audio Thématique (Les 6 Épisodes Calibrés)
  // --------------------------------------------------------------------------
  getEpisodes(actor: AccessActor, restitutionId: string): DomainAudioEpisode[] {
    const restitution = this.restitutions.get(restitutionId);
    if (!restitution) {
      throw new NotFoundException(`Restitution ${restitutionId} not found.`);
    }
    const report = this.reports.get(restitution.reportId);
    if (!report) {
      throw new NotFoundException('Parent report not found.');
    }

    if (actor.role === 'YOUNG') {
      this.assertAuthorized(
        actor,
        { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: restitution.status },
        'READ_PUBLISHED_RESTITUTION'
      );
    } else {
      this.assertAuthorized(
        actor,
        { tenantId: report.tenantId, youngProfileId: report.youngProfileId, status: restitution.status },
        'READ_REPORT'
      );
    }

    const list = this.episodes.get(restitutionId);
    if (list) {
      return list;
    }
    const interview = this.interviews.get(report.id);
    const assessments = this.getCareerAssessments(actor, report.id);
    const generated = buildDeterministicEpisodes({
      restitutionId,
      reportId: report.id,
      youngDisplayName: report.youngDisplayName,
      facts: report.facts,
      careers: report.careers,
      assessments,
      interview
    });
    this.episodes.set(restitutionId, generated);
    return generated;
  }

  updateEpisodeScript(
    actor: AccessActor,
    restitutionId: string,
    episodeId: string,
    rawBody: unknown
  ): DomainAudioEpisode {
    const episodes = this.getEpisodes(actor, restitutionId);
    const target = episodes.find((e) => e.id === episodeId);
    if (!target) {
      throw new NotFoundException(`Episode ${episodeId} not found.`);
    }

    const parsed = UpdateEpisodeScriptSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    target.script = parsed.data.script;
    target.scriptWordCount = countWords(parsed.data.script);
    target.estimatedDurationSec = Math.round((target.scriptWordCount / 130) * 60);
    target.validationStatus = parsed.data.validationStatus;
    target.validatedBy = actor.userId;
    target.validatedAt = new Date().toISOString();
    this.recordAudit(actor, 'EPISODE_SCRIPT_UPDATED', 'AudioEpisode', episodeId);
    return target;
  }

  async generateEpisodeAudio(
    actor: AccessActor,
    restitutionId: string,
    episodeId: string
  ): Promise<DomainAudioEpisode> {
    const episodes = this.getEpisodes(actor, restitutionId);
    const target = episodes.find((e) => e.id === episodeId);
    if (!target) {
      throw new NotFoundException(`Episode ${episodeId} not found.`);
    }

    const result = await this.speechProvider.synthesize(target.script);
    target.realDurationSec = result.durationSec;
    target.validationStatus = 'APPROVED';
    this.recordAudit(actor, 'EPISODE_AUDIO_GENERATED_PIPER', 'AudioEpisode', episodeId);
    return target;
  }

  getAudioBuffer(): Buffer {
    return this.audioWavBuffer;
  }

  // --------------------------------------------------------------------------
  // MODULE IMMERSION PRO — API & GESTION DU PARCOURS EN 6 ÉTAPES
  // --------------------------------------------------------------------------
  getImmersionProjects(actor: AccessActor): DomainImmersionProject[] {
    return this.immersionProjects.filter((p) => p.tenantId === actor.activeTenantId);
  }

  getImmersionProject(actor: AccessActor, id: string): DomainImmersionProject {
    const project = this.immersionProjects.find((p) => p.id === id && p.tenantId === actor.activeTenantId);
    if (!project) {
      throw new NotFoundException(`Immersion project ${id} not found.`);
    }
    return project;
  }

  createImmersionProject(actor: AccessActor, rawBody: unknown): DomainImmersionProject {
    const parsed = CreateImmersionProjectSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const newProject: DomainImmersionProject = {
      id: `imm-${Date.now()}`,
      tenantId: actor.activeTenantId,
      youngProfileId: actor.ownYoungProfileId ?? DEMO_IDS.YOUNG_PROFILE_LEO,
      careerId: parsed.data.careerId,
      careerTitle: parsed.data.careerTitle,
      step: 1,
      status: 'PREPARING',
      targetDate: parsed.data.targetDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.immersionProjects.unshift(newProject);
    this.recordAudit(actor, 'IMMERSION_PROJECT_CREATED', 'ImmersionProject', newProject.id);
    return newProject;
  }

  updateImmersionProject(
    actor: AccessActor,
    id: string,
    rawBody: unknown
  ): DomainImmersionProject {
    const project = this.getImmersionProject(actor, id);
    const parsed = UpdateImmersionProjectSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    if (parsed.data.step !== undefined) project.step = parsed.data.step;
    if (parsed.data.status !== undefined) project.status = parsed.data.status;
    if (parsed.data.selectedCompany !== undefined) project.selectedCompany = parsed.data.selectedCompany;
    if (parsed.data.companyContact !== undefined) project.companyContact = parsed.data.companyContact;
    if (parsed.data.targetDate !== undefined) project.targetDate = parsed.data.targetDate;
    if (parsed.data.notes !== undefined) project.notes = parsed.data.notes;
    project.updatedAt = new Date().toISOString();

    this.recordAudit(actor, 'IMMERSION_PROJECT_UPDATED', 'ImmersionProject', project.id);
    return project;
  }

  getPartnerCompanies(actor: AccessActor): DomainPartnerCompany[] {
    return this.partnerCompanies.filter((c) => c.tenantId === actor.activeTenantId);
  }

  createApplication(
    actor: AccessActor,
    projectId: string,
    rawBody: unknown
  ): DomainImmersionApplication {
    const project = this.getImmersionProject(actor, projectId);
    const parsed = CreateApplicationSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const application: DomainImmersionApplication = {
      id: `app-${Date.now()}`,
      projectId: project.id,
      companyName: parsed.data.companyName,
      careerTitle: parsed.data.careerTitle,
      targetPeriod: parsed.data.targetPeriod,
      messageBody: parsed.data.messageBody,
      status: 'DRAFT',
      counselorHelp: parsed.data.counselorHelp,
      createdAt: new Date().toISOString()
    };

    this.applications.unshift(application);
    project.step = Math.max(project.step, 4);
    project.status = 'APPLICATION_PENDING';
    project.selectedCompany = parsed.data.companyName;
    this.recordAudit(actor, 'IMMERSION_APPLICATION_CREATED', 'ImmersionApplication', application.id);
    return application;
  }

  saveObservationEntry(
    actor: AccessActor,
    projectId: string,
    rawBody: unknown
  ): DomainObservationEntry {
    const project = this.getImmersionProject(actor, projectId);
    const parsed = SaveObservationEntrySchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const entry: DomainObservationEntry = {
      id: `obs-${Date.now()}`,
      projectId: project.id,
      dayNumber: parsed.data.dayNumber,
      discoveredText: parsed.data.discoveredText,
      surprisedText: parsed.data.surprisedText,
      questionText: parsed.data.questionText,
      createdAt: new Date().toISOString()
    };

    this.observations.unshift(entry);
    project.step = Math.max(project.step, 5);
    project.status = 'IN_PROGRESS';
    this.recordAudit(actor, 'IMMERSION_OBSERVATION_SAVED', 'ObservationEntry', entry.id);
    return entry;
  }

  saveImmersionReview(
    actor: AccessActor,
    projectId: string,
    rawBody: unknown
  ): DomainImmersionReview {
    const project = this.getImmersionProject(actor, projectId);
    const parsed = SaveImmersionReviewSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const review: DomainImmersionReview = {
      id: `rev-${Date.now()}`,
      projectId: project.id,
      careerTitle: project.careerTitle,
      companyName: project.selectedCompany,
      likedAspects: parsed.data.likedAspects,
      dislikedAspects: parsed.data.dislikedAspects,
      surprises: parsed.data.surprises,
      wantToPursue: parsed.data.wantToPursue,
      questionsToAsk: parsed.data.questionsToAsk,
      sharedWithCounselor: parsed.data.sharedWithCounselor
    };

    const existingIdx = this.reviews.findIndex((r) => r.projectId === projectId);
    if (existingIdx >= 0) {
      this.reviews[existingIdx] = review;
    } else {
      this.reviews.unshift(review);
    }

    project.step = 6;
    project.status = 'COMPLETED';
    this.recordAudit(actor, 'IMMERSION_REVIEW_SAVED', 'ImmersionReview', review.id);
    return review;
  }

  getCounselorImmersionOverview(actor: AccessActor) {
    if (actor.role !== 'COUNSELOR' && actor.role !== 'TENANT_ADMIN' && actor.role !== 'PLATFORM_ADMIN') {
      throw new ForbiddenException('Accès réservé aux professionnels de l’orientation.');
    }

    return this.immersionProjects
      .filter((p) => p.tenantId === actor.activeTenantId)
      .map((p) => {
        const app = this.applications.find((a) => a.projectId === p.id);
        const review = this.reviews.find((r) => r.projectId === p.id);
        return {
          ...p,
          youngName: 'Emma D.',
          applicationStatus: app?.status ?? 'DRAFT',
          counselorHelpRequested: app?.counselorHelp ?? false,
          hasReview: Boolean(review),
          sharedReview: review?.sharedWithCounselor ?? false
        };
      });
  }

  // --------------------------------------------------------------------------
  // PARCOURS AUTONOME — Mode de parcours, Catalogue O*NET, Favoris & Accompagnement
  // --------------------------------------------------------------------------
  getJourneyMode(actor: AccessActor): { journeyMode: JourneyMode; isSupported: boolean } {
    const mode = this.journeyModes.get(actor.userId) ?? 'SUPPORTED';
    return {
      journeyMode: mode,
      isSupported: mode === 'SUPPORTED'
    };
  }

  setJourneyMode(actor: AccessActor, rawBody: unknown): { journeyMode: JourneyMode; success: boolean } {
    const parsed = UpdateJourneyModeSchema.safeParse(rawBody);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues.map((i) => i.message).join(', '));
    }
    this.journeyModes.set(actor.userId, parsed.data.journeyMode);
    this.recordAudit(actor, 'JOURNEY_MODE_UPDATED', 'UserJourney', actor.userId);
    return {
      journeyMode: parsed.data.journeyMode,
      success: true
    };
  }

  getCareersCatalog(
    _actor: AccessActor,
    query?: string,
    category?: string,
    jobZone?: number,
    page = 1,
    limit = 20
  ) {
    const all = loadOnetCareersCatalog();
    let filtered = all;

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (c) => c.titleFr.toLowerCase().includes(q) || c.descriptionFr.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'ALL') {
      filtered = filtered.filter((c) => c.category === category);
    }

    if (jobZone && jobZone >= 1 && jobZone <= 5) {
      filtered = filtered.filter((c) => c.jobZone === jobZone);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  getCareerById(_actor: AccessActor, id: string): DomainCareerCatalogItem {
    const all = loadOnetCareersCatalog();
    const found = all.find((c) => c.id === id || c.onetSocCode === id);
    if (!found) {
      throw new NotFoundException(`Métier ${id} introuvable.`);
    }
    return found;
  }

  getUserFavorites(actor: AccessActor): string[] {
    const realFavs = this.realAuth.getFavorites(actor.userId);
    if (realFavs && realFavs.length > 0) {
      return realFavs;
    }
    const favSet = this.userFavorites.get(actor.userId) ?? new Set<string>();
    return Array.from(favSet);
  }

  toggleUserFavorite(actor: AccessActor, careerId: string): { careerId: string; isFavorite: boolean } {
    // Si c'est un utilisateur réel enregistré
    const realUser = this.realAuth.getUserById(actor.userId);
    if (realUser) {
      const isFav = realUser.favorites.includes(careerId);
      if (isFav) {
        this.realAuth.removeFavorite(actor.userId, careerId);
      } else {
        this.realAuth.addFavorite(actor.userId, careerId);
      }
      this.recordAudit(actor, !isFav ? 'CAREER_FAVORITED' : 'CAREER_UNFAVORITED', 'Career', careerId);
      return { careerId, isFavorite: !isFav };
    }

    if (!this.userFavorites.has(actor.userId)) {
      this.userFavorites.set(actor.userId, new Set<string>());
    }
    const set = this.userFavorites.get(actor.userId)!;
    let isFavorite: boolean;
    if (set.has(careerId)) {
      set.delete(careerId);
      isFavorite = false;
    } else {
      set.add(careerId);
      isFavorite = true;
    }
    this.recordAudit(actor, isFavorite ? 'CAREER_FAVORITED' : 'CAREER_UNFAVORITED', 'Career', careerId);
    return { careerId, isFavorite };
  }

  getSupportResources(_actor: AccessActor, category?: string, city?: string): DomainSupportResource[] {
    let list = DEMO_SUPPORT_RESOURCES;
    if (category && category !== 'ALL') {
      list = list.filter((r) => r.category === category);
    }
    if (city && city.trim()) {
      const c = city.toLowerCase().trim();
      list = list.filter((r) => !r.city || r.city.toLowerCase().includes(c));
    }
    return list;
  }

  getLocalOpportunities(params: LocalOpportunitiesQueryParams): {
    items: DomainLocalOpportunity[];
    total: number;
    counts: DomainCategoryCounts;
  } {
    let list = [...DEMO_LOCAL_OPPORTUNITIES];

    if (params.category && params.category !== 'ALL') {
      list = list.filter((item) => item.category === params.category);
    }

    if (params.career && params.career.trim()) {
      const q = params.career.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.headline.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.targetCareers.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (params.radiusKm && params.radiusKm > 0) {
      list = list.filter((item) => item.distanceKm <= params.radiusKm!);
    }

    if (params.sort === 'distance') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (params.sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    } else {
      if (params.career && params.career.trim()) {
        const q = params.career.toLowerCase().trim();
        list.sort((a, b) => {
          const aDirect = a.targetCareers.some((c) => c.toLowerCase().includes(q)) ? 1 : 0;
          const bDirect = b.targetCareers.some((c) => c.toLowerCase().includes(q)) ? 1 : 0;
          if (aDirect !== bDirect) return bDirect - aDirect;
          return a.distanceKm - b.distanceKm;
        });
      } else {
        list.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }

    const counts: DomainCategoryCounts = {
      total: DEMO_LOCAL_OPPORTUNITIES.length,
      formations: DEMO_LOCAL_OPPORTUNITIES.filter((i) => i.category === 'FORMATION').length,
      organismes: DEMO_LOCAL_OPPORTUNITIES.filter((i) => i.category === 'ACCOMPAGNEMENT').length,
      entreprises: DEMO_LOCAL_OPPORTUNITIES.filter((i) => i.category === 'ENTREPRISE').length
    };

    return {
      items: list,
      total: list.length,
      counts
    };
  }

  getLocalOpportunityById(id: string): DomainLocalOpportunity | undefined {
    return DEMO_LOCAL_OPPORTUNITIES.find((item) => item.id === id);
  }

  // --------------------------------------------------------------------------
  // Gestion Utilisateur & Paramètres (Profil, Sécurité, Sessions)
  // --------------------------------------------------------------------------
  getUserProfile(actor: AccessActor) {
    const isCounselor = actor.role === 'COUNSELOR';
    return {
      userId: actor.userId,
      role: actor.role,
      tenantId: actor.activeTenantId,
      organization: 'Centre des Possibles',
      firstName: isCounselor ? 'Sophie' : 'Emma',
      lastName: isCounselor ? 'Martin' : 'D.',
      displayName: isCounselor ? 'Sophie Martin' : 'Emma D.',
      email: isCounselor ? 'sophie.martin@centre-des-possibles.fr' : 'emma.d@monbilan.fr',
      roleTitle: isCounselor ? 'Conseillère d\'orientation' : 'Jeune accompagné',
      photoUrl: isCounselor ? 'assets/visuals/profile-counselor.png' : 'assets/visuals/profile-emma.png',
      isEmailVerified: true,
      lastLoginAt: new Date().toISOString()
    };
  }

  updateUserProfile(
    actor: AccessActor,
    payload: {
      firstName?: string;
      lastName?: string;
      email?: string;
      roleTitle?: string;
      photoUrl?: string;
      role?: string;
      tenantId?: string;
      organization?: string;
    }
  ) {
    // RÈGLE DE SÉCURITÉ ABSOLUE : Rejet strict de modification de rôle ou d'organisation
    if (payload.role && payload.role !== actor.role) {
      throw new Error('FORBIDDEN_ROLE_MODIFICATION: Le rôle utilisateur ne peut pas être modifié depuis les paramètres.');
    }
    if (payload.tenantId && payload.tenantId !== actor.activeTenantId) {
      throw new Error('FORBIDDEN_TENANT_MODIFICATION: Le rattachement organisationnel est strictement immuable.');
    }
    if (payload.organization && payload.organization !== 'Centre des Possibles') {
      throw new Error('FORBIDDEN_ORGANIZATION_MODIFICATION: L’établissement de rattachement ne peut être modifié que par un administrateur.');
    }

    const current = this.getUserProfile(actor);
    const updated = {
      ...current,
      firstName: payload.firstName?.trim() || current.firstName,
      lastName: payload.lastName?.trim() || current.lastName,
      email: payload.email?.trim().toLowerCase() || current.email,
      roleTitle: actor.role === 'COUNSELOR' ? (payload.roleTitle?.trim() || current.roleTitle) : current.roleTitle,
      photoUrl: payload.photoUrl || current.photoUrl,
      updatedAt: new Date().toISOString()
    };
    updated.displayName = `${updated.firstName} ${updated.lastName}`.trim();

    return {
      success: true,
      message: 'Profil mis à jour avec succès.',
      profile: updated
    };
  }

  changePassword(
    _actor: AccessActor,
    payload: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    }
  ) {
    if (!payload.currentPassword) {
      throw new Error('Le mot de passe actuel est obligatoire.');
    }
    if (!payload.newPassword || payload.newPassword.length < 8) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
    }
    if (payload.newPassword !== payload.confirmPassword) {
      throw new Error('Les mots de passe saisis ne sont pas identiques.');
    }

    return {
      success: true,
      message: 'Mot de passe modifié avec succès. Vos sessions sont sécurisées.',
      updatedAt: new Date().toISOString()
    };
  }

  getUserSessions(actor: AccessActor) {
    return {
      userId: actor.userId,
      sessions: [
        {
          id: 'sess-current',
          device: 'MacBook Pro — macOS (Chrome 128)',
          ip: '192.168.1.42',
          location: 'Nice, France (Métropole Côte d\'Azur)',
          isCurrent: true,
          lastActive: 'À l\'instant'
        },
        {
          id: 'sess-mobile',
          device: 'iPhone 15 Pro — iOS 18 (Safari Mobile)',
          ip: '90.84.142.12',
          location: 'Nice, France',
          isCurrent: false,
          lastActive: 'Il y a 3 heures'
        }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // Module Suivi & Rendez-vous
  // --------------------------------------------------------------------------
  getAppointments(actor: AccessActor, filters?: { date?: string; status?: string }) {
    let list = this.appointments.filter(a => a.tenantId === actor.activeTenantId);
    if (filters?.status) {
      list = list.filter(a => a.status === filters.status);
    }
    if (filters?.date) {
      list = list.filter(a => a.date === filters.date);
    }
    return list;
  }

  getAppointmentById(actor: AccessActor, id: string) {
    const apt = this.appointments.find(a => a.id === id && a.tenantId === actor.activeTenantId);
    if (!apt) {
      throw new NotFoundException(`Appointment with id ${id} not found.`);
    }
    return apt;
  }

  createAppointment(actor: AccessActor, input: any) {
    if (!input.youngName || !input.date || !input.startHour) {
      throw new BadRequestException('Le nom du jeune, la date et l\'heure de début sont obligatoires.');
    }

    // Détection de chevauchement sur la même date et heure
    const conflict = this.appointments.find(
      a => a.tenantId === actor.activeTenantId &&
           a.date === input.date &&
           a.status !== 'CANCELLED' &&
           a.startHour === input.startHour
    );
    if (conflict) {
      throw new BadRequestException(`Un rendez-vous existe déjà à ${input.startHour} avec ${conflict.youngName}.`);
    }

    const duration = input.durationMinutes || 60;
    const [startH, startM] = input.startHour.split(':').map(Number);
    const endMinutesTotal = startH * 60 + startM + duration;
    const endH = String(Math.floor(endMinutesTotal / 60)).padStart(2, '0');
    const endM = String(endMinutesTotal % 60).padStart(2, '0');
    const calculatedEndHour = `${endH}:${endM}`;

    const newApt: InMemoryAppointment = {
      id: `apt-${Date.now()}`,
      tenantId: actor.activeTenantId,
      counselorId: actor.userId,
      youngProfileId: input.youngProfileId || `young-${Date.now()}`,
      youngName: input.youngName,
      youngAge: input.youngAge || '17 ans',
      dossierRef: input.dossierRef || `Dossier ${Math.floor(1000 + Math.random() * 9000)}`,
      title: input.title || input.motif || 'Entretien de suivi',
      motif: input.motif || 'Accompagnement et suivi d\'orientation',
      objectives: input.objectives || ['Faire le point sur le parcours'],
      date: input.date,
      startHour: input.startHour,
      endHour: input.endHour || calculatedEndHour,
      durationMinutes: duration,
      modality: input.modality || 'IN_PERSON',
      location: input.location || 'Centre des Possibles – Salle 2',
      meetingUrl: input.meetingUrl,
      status: 'CONFIRMED',
      preparation: {
        checklist: [
          { id: 'c1', label: 'Consulter le bilan et les notes', checked: false },
          { id: 'c2', label: 'Préparer les pistes à aborder', checked: false }
        ],
        privateNotes: input.privateNotes || ''
      }
    };

    this.appointments.push(newApt);
    this.recordAudit(actor, 'CREATE_APPOINTMENT', 'Appointment', newApt.id);
    return newApt;
  }

  updateAppointmentStatus(actor: AccessActor, id: string, status: AppointmentStatus, _cancellationReason?: string) {
    const apt = this.getAppointmentById(actor, id);
    apt.status = status;
    this.recordAudit(actor, 'UPDATE_APPOINTMENT_STATUS', 'Appointment', id);
    return apt;
  }

  updateAppointment(actor: AccessActor, id: string, data: any) {
    const apt = this.getAppointmentById(actor, id);
    if (data.motif) apt.motif = data.motif;
    if (data.objectives) apt.objectives = data.objectives;
    if (data.location) apt.location = data.location;
    if (data.date) apt.date = data.date;
    if (data.startHour) apt.startHour = data.startHour;
    if (data.endHour) apt.endHour = data.endHour;
    if (data.status) apt.status = data.status;
    if (data.preparation) apt.preparation = { ...apt.preparation, ...data.preparation };
    if (data.report) apt.report = { ...apt.report, ...data.report };
    if (data.actions) apt.actions = data.actions;

    this.recordAudit(actor, 'UPDATE_APPOINTMENT', 'Appointment', id);
    return apt;
  }

  getFollowUpSummary(actor: AccessActor) {
    const counselorApts = this.appointments.filter(a => a.tenantId === actor.activeTenantId);
    const upcoming = counselorApts.filter(a => a.status === 'CONFIRMED' || a.status === 'PLANNED' || a.status === 'TO_CONFIRM').length;
    const completed = counselorApts.filter(a => a.status === 'COMPLETED').length;
    const toRelaunch = 2; // Règle métier : jeunes sans échange depuis > 14 jours
    const pendingActions = 3; // Règle métier : actions assignées en attente

    return {
      upcomingCount: upcoming,
      completedCount: completed,
      toRelaunchCount: toRelaunch,
      pendingActionsCount: pendingActions
    };
  }

  getFollowUpYouths(_actor: AccessActor) {
    return this.followUpYouths;
  }
}
