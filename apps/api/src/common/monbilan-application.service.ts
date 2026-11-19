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
  VerifyFactInputSchema
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
  verifyGeneratedClaims
} from '@monbilan/domain';
import {
  AuditLogEntry,
  createInitialDemoState,
  DEMO_IDS,
  InMemoryQuestion,
  InMemoryReport,
  InMemoryRestitution
} from './demo-fixture.js';

@Injectable()
export class MonBilanApplicationService {
  private readonly reports = new Map<string, InMemoryReport>();
  private readonly restitutions = new Map<string, InMemoryRestitution>();
  private readonly interviews = new Map<string, DomainInterviewSummary>();
  private readonly careerAssessments = new Map<string, CareerAssessment[]>();
  private readonly episodes = new Map<string, DomainAudioEpisode[]>();
  private readonly questions: InMemoryQuestion[] = [];
  private readonly auditEvents: AuditLogEntry[] = [];
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

  constructor() {
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
  }

  // --------------------------------------------------------------------------
  // Résolution du contexte Acteur & Tenant (Identity, Tenancy & Authorization)
  // --------------------------------------------------------------------------
  resolveActorFromHeaders(headers: Record<string, string | string[] | undefined>): AccessActor {
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
}
