// ============================================================================
// Tests d'Isolation Multi-Tenant (Tenants A/B) & Politiques RBAC/ABAC
// ============================================================================

import { describe, expect, it } from 'vitest';
import { AccessActor, evaluateAccessPolicy } from '@monbilan/domain';
import { DEMO_IDS } from '../../apps/api/src/common/demo-fixture.js';
import { MonBilanApplicationService } from '../../apps/api/src/common/monbilan-application.service.js';

describe('Multi-Tenant Isolation & RBAC/ABAC Policy Engine', () => {
  const tenantNiceResource = {
    tenantId: DEMO_IDS.TENANT_NICE,
    youngProfileId: DEMO_IDS.YOUNG_PROFILE_LEO,
    status: 'PUBLISHED' as const
  };

  it('denies access when actor is not a member of the active tenant', () => {
    const actor: AccessActor = {
      userId: 'user-intruder',
      activeTenantId: DEMO_IDS.TENANT_NICE,
      memberTenantIds: [DEMO_IDS.TENANT_ANTIBES],
      role: 'COUNSELOR',
      assignedYoungProfileIds: [DEMO_IDS.YOUNG_PROFILE_LEO]
    };

    const res = evaluateAccessPolicy(actor, tenantNiceResource, 'READ_REPORT');
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('not a member');
  });

  it('denies cross-tenant access between Tenant B (Antibes) and Tenant A (Nice)', () => {
    const appService = new MonBilanApplicationService();
    const antibesCounselor = appService.resolveActorFromHeaders({
      'x-demo-role': 'OTHER_TENANT_COUNSELOR'
    });

    expect(() =>
      appService.getReportForCounselor(antibesCounselor, DEMO_IDS.REPORT_LEO)
    ).toThrowError(/Cross-tenant access denied/i);
  });

  it('denies intra-tenant access when a counselor is NOT assigned to the young profile', () => {
    const appService = new MonBilanApplicationService();
    const unassignedCounselor = appService.resolveActorFromHeaders({
      'x-demo-role': 'UNASSIGNED_COUNSELOR'
    });

    expect(() =>
      appService.getReportForCounselor(unassignedCounselor, DEMO_IDS.REPORT_LEO)
    ).toThrowError(/not assigned to this young profile/i);
  });

  it('allows an assigned counselor within the same tenant to read and verify facts', () => {
    const appService = new MonBilanApplicationService();
    const assignedCounselor = appService.resolveActorFromHeaders({
      'x-demo-role': 'COUNSELOR'
    });

    const bundle = appService.getReportForCounselor(assignedCounselor, DEMO_IDS.REPORT_LEO);
    expect(bundle.report.id).toBe(DEMO_IDS.REPORT_LEO);
    expect(bundle.report.tenantId).toBe(DEMO_IDS.TENANT_NICE);
  });

  it('prevents a young user from viewing a restitution that is in DRAFT_REVIEW (not PUBLISHED)', () => {
    const appService = new MonBilanApplicationService();
    const counselor = appService.resolveActorFromHeaders({ 'x-demo-role': 'COUNSELOR' });
    const young = appService.resolveActorFromHeaders({ 'x-demo-role': 'YOUNG' });

    // Le conseiller modifie un claim -> le statut repasse en DRAFT_REVIEW et l'audio est invalidé
    appService.updateClaim(counselor, DEMO_IDS.RESTITUTION_LEO, 'claim-riasec-top', {
      text: 'Nouvelle formulation pédagogique en cours de relecture par le conseiller.',
      reviewStatus: 'EDITED'
    });

    expect(() => appService.getPublishedRestitutionForYoung(young)).toThrowError(
      /only view PUBLISHED restitutions/i
    );
  });
});
