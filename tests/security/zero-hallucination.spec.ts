// ============================================================================
// Tests de Sécurité IA : Zéro-Hallucination, Interdiction de Diagnostic,
// Vérification Humaine Obligatoire des Graphiques & Invalidation Audio
// ============================================================================

import { describe, expect, it } from 'vitest';
import {
  canTransitionReportStatus,
  computeScriptHash,
  shouldInvalidateAudio,
  verifyGeneratedClaims
} from '@monbilan/domain';
import {
  createInitialFictionalLeoCareers,
  createInitialFictionalLeoFacts,
  DEMO_IDS
} from '../../apps/api/src/common/demo-fixture.js';
import { MonBilanApplicationService } from '../../apps/api/src/common/monbilan-application.service.js';
import { buildIdempotentJobKey, validateWorkerJobPayload, QUEUE_NAMES } from '../../apps/worker/src/main.js';

describe('Zero-Hallucination Verifier & Human-in-the-Loop Security', () => {
  const facts = createInitialFictionalLeoFacts();
  const careers = createInitialFictionalLeoCareers();

  it('accepts a valid restitution where every claim references verified report facts and listed careers', () => {
    const result = verifyGeneratedClaims({
      tenantId: DEMO_IDS.TENANT_NICE,
      reportId: DEMO_IDS.REPORT_LEO,
      facts,
      careers,
      claims: [
        {
          id: 'claim-1',
          kind: 'PERSONAL_FACT',
          audience: 'YOUNG',
          text: 'Ton intérêt principal est Artistique (page 4), complété par une flexibilité cognitive de 6/7 (page 5).',
          sourceFactIds: ['fact-riasec-01', 'fact-cog-01'],
          referencedCareers: ['Technicien du son']
        }
      ]
    });

    expect(result.isValid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('rejects a claim that invents a non-existent sourceFactId', () => {
    const result = verifyGeneratedClaims({
      tenantId: DEMO_IDS.TENANT_NICE,
      reportId: DEMO_IDS.REPORT_LEO,
      facts,
      careers,
      claims: [
        {
          id: 'claim-hallucinated-fact',
          kind: 'PERSONAL_FACT',
          audience: 'YOUNG',
          text: 'Tu as obtenu un score parfait au test spatial.',
          sourceFactIds: ['fact-invented-999']
        }
      ]
    });

    expect(result.isValid).toBe(false);
    expect(result.violations.join(' ')).toContain('unknown or cross-tenant factId');
  });

  it('rejects a claim that cites a career not present in the report O*NET zones', () => {
    const result = verifyGeneratedClaims({
      tenantId: DEMO_IDS.TENANT_NICE,
      reportId: DEMO_IDS.REPORT_LEO,
      facts,
      careers,
      claims: [
        {
          id: 'claim-hallucinated-career',
          kind: 'CAREER_LINK',
          audience: 'YOUNG',
          text: 'Ton rapport te recommande de devenir Pilote de chasse.',
          sourceFactIds: ['fact-zones-01'],
          referencedCareers: ['Pilote de chasse']
        }
      ]
    });

    expect(result.isValid).toBe(false);
    expect(result.violations.join(' ')).toContain('not present in the report');
  });

  it('rejects any psychological diagnostic or deterministic destiny phrasing', () => {
    const result = verifyGeneratedClaims({
      tenantId: DEMO_IDS.TENANT_NICE,
      reportId: DEMO_IDS.REPORT_LEO,
      facts,
      careers,
      claims: [
        {
          id: 'claim-diagnostic',
          kind: 'PERSONAL_FACT',
          audience: 'YOUNG',
          text: 'Tes résultats révèlent un trouble TDAH et un quotient intellectuel supérieur.',
          sourceFactIds: ['fact-cog-01']
        }
      ]
    });

    expect(result.isValid).toBe(false);
    expect(result.violations.join(' ')).toContain('forbidden psychological diagnostic');
  });

  it('blocks AI draft generation if a cognitive chart score has not been verified by the counselor', async () => {
    const appService = new MonBilanApplicationService();
    const counselor = appService.resolveActorFromHeaders({ 'x-demo-role': 'COUNSELOR' });

    // Décocher la vérification humaine d'un score graphique de la page 5
    appService.verifyFact(counselor, DEMO_IDS.REPORT_LEO, 'fact-cog-01', {
      numericScore: 6,
      isVerified: false
    });

    await expect(
      appService.generateRestitutionDraft(counselor, DEMO_IDS.REPORT_LEO)
    ).rejects.toThrowError(/remain unverified by the counselor/i);
  });

  it('invalidates previous audio when an approved script is modified', () => {
    const hashV1 = computeScriptHash('Script initial validé', 'Résumé parents');
    const hashV2 = computeScriptHash('Script modifié par le conseiller', 'Résumé parents');

    expect(shouldInvalidateAudio(hashV1, hashV2)).toBe(true);
    expect(shouldInvalidateAudio(hashV1, hashV1)).toBe(false);
  });

  it('enforces valid state machine transitions and idempotent BullMQ payloads without PII', () => {
    expect(canTransitionReportStatus('UPLOADED', 'PUBLISHED')).toBe(false);
    expect(canTransitionReportStatus('APPROVED', 'AUDIO_GENERATING')).toBe(true);

    const jobKey = buildIdempotentJobKey({
      tenantId: DEMO_IDS.TENANT_NICE,
      entityId: DEMO_IDS.REPORT_LEO,
      operation: 'extract-report',
      version: 1
    });

    const validation = validateWorkerJobPayload(QUEUE_NAMES.EXTRACT_REPORT, {
      jobKey,
      tenantId: DEMO_IDS.TENANT_NICE,
      reportId: DEMO_IDS.REPORT_LEO,
      version: 1
    });
    expect(validation.valid).toBe(true);
  });
});
