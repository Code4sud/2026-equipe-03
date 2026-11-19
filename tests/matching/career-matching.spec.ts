// ============================================================================
// Tests Unitaires — Moteur de Rapprochement Supervisé Métiers / Entretien
// Vérifie le traitement des 22 métiers O*NET FR du rapport 2187
// ============================================================================

import { describe, expect, it } from 'vitest';
import {
  matchCareersWithInterview,
  normalizeCareerTitle,
  DomainCareer,
  DomainInterviewSummary
} from '@monbilan/domain';

describe('CareerMatchingEngine — Rapprochement supervisé des métiers', () => {
  const dummyCareers: DomainCareer[] = [
    {
      id: 'c-1',
      tenantId: 't-1',
      reportId: 'rep-2187',
      jobZone: 1,
      rankInZone: 1,
      titleFr: 'Peintre décorateur',
      description: 'Prépare et applique des peintures et revêtements.',
      pageNumber: 8
    },
    {
      id: 'c-2',
      tenantId: 't-1',
      reportId: 'rep-2187',
      jobZone: 1,
      rankInZone: 2,
      titleFr: 'Cuisinier en restauration rapide',
      description: 'Prépare et cuit des aliments en service rapide.',
      pageNumber: 8
    },
    {
      id: 'c-3',
      tenantId: 't-1',
      reportId: 'rep-2187',
      jobZone: 2,
      rankInZone: 2,
      titleFr: 'Boucher',
      description: 'Prépare et découpe la viande pour la vente.',
      pageNumber: 10
    },
    {
      id: 'c-4',
      tenantId: 't-1',
      reportId: 'rep-2187',
      jobZone: 3,
      rankInZone: 4,
      titleFr: 'Technicien du son',
      description: 'Enregistre et mixe le son en studio ou concert.',
      pageNumber: 12
    },
    {
      id: 'c-5',
      tenantId: 't-1',
      reportId: 'rep-2187',
      jobZone: 4,
      rankInZone: 2,
      titleFr: 'Animateur Radio',
      description: 'Présente des émissions et chroniques à la radio.',
      pageNumber: 14
    },
    {
      id: 'c-6',
      tenantId: 't-1',
      reportId: 'rep-2187',
      jobZone: 5,
      rankInZone: 2,
      titleFr: 'Praticien en Activité Physique Adaptée (APA)',
      description: 'Conçoit des séances d’activité physique adaptée.',
      pageNumber: 16
    }
  ];

  const dummyInterview: DomainInterviewSummary = {
    id: 'int-2187',
    tenantId: 't-1',
    reportId: 'rep-2187',
    counselorId: 'counselor-sophie',
    counselorName: 'Sarah Dupont',
    interviewDate: '18/11/2026',
    objective: 'Exploration des résultats et identification des premières pistes concrètes.',
    synthesis: 'Le jeune montre un très fort attrait pour l’audiovisuel, le son et la radio.',
    expressedInterests: ['Création audio', 'Studio d’enregistrement', 'Médias'],
    explicitCareers: ['Technicien du son', 'Animateur Radio'],
    motivations: ['Envie de créer des podcasts', 'Intérêt pour la musique et l’expression'],
    reservations: ['Boucher', 'Restauration rapide'],
    professionalConclusions: {
      tracksToDeepen: ['Technicien du son', 'Animateur Radio'],
      tracksToExplore: ['Peintre décorateur'],
      pointsToClarify: ['Activité Physique Adaptée'],
      suggestedNextSteps: ['Visite d’une radio associative', 'Stage d’observation en studio']
    },
    isFinalized: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('normalise les intitulés de métiers en préservant le sens', () => {
    expect(normalizeCareerTitle('Peintre décorateur')).toBe('peintre decorateur');
    expect(normalizeCareerTitle("Conducteur d'appareils de levage (palan, treuil)")).toBe(
      'conducteur d appareils de levage palan treuil'
    );
  });

  it('conserve TOUS les métiers du rapport sans exception (zéro suppression)', () => {
    const assessments = matchCareersWithInterview(dummyCareers, dummyInterview);
    expect(assessments.length).toBe(dummyCareers.length);
    expect(assessments.map((a) => a.originalTitle)).toEqual(dummyCareers.map((c) => c.titleFr));
  });

  it('qualifie en TO_DEEPEN les métiers mentionnés explicitement en entretien', () => {
    const assessments = matchCareersWithInterview(dummyCareers, dummyInterview);
    const soundTech = assessments.find((a) => a.originalTitle === 'Technicien du son');
    const radioHost = assessments.find((a) => a.originalTitle === 'Animateur Radio');

    expect(soundTech?.proposedStatus).toBe('TO_DEEPEN');
    expect(soundTech?.finalStatus).toBe('TO_DEEPEN');
    expect(soundTech?.rationale).toContain('correspond directement aux intérêts');
    expect(soundTech?.evidence.length).toBeGreaterThanOrEqual(2);

    expect(radioHost?.proposedStatus).toBe('TO_DEEPEN');
  });

  it('qualifie en DEFERRED les métiers faisant l’objet d’une réserve explicite', () => {
    const assessments = matchCareersWithInterview(dummyCareers, dummyInterview);
    const butcher = assessments.find((a) => a.originalTitle === 'Boucher');
    const fastFood = assessments.find((a) => a.originalTitle === 'Cuisinier en restauration rapide');

    expect(butcher?.proposedStatus).toBe('DEFERRED');
    expect(butcher?.rationale).toContain('Piste différée lors de l’entretien');
    expect(fastFood?.proposedStatus).toBe('DEFERRED');
  });

  it('qualifie en TO_EXPLORE les métiers du rapport non mentionnés lors de l’échange', () => {
    const assessments = matchCareersWithInterview(dummyCareers, dummyInterview);
    const painter = assessments.find((a) => a.originalTitle === 'Peintre décorateur');

    // N'a pas de réserve explicite, donc conservé en TO_EXPLORE
    expect(painter?.proposedStatus).toBe('TO_EXPLORE');
    expect(painter?.rationale).toContain('Non approfondie lors du premier entretien');
  });

  it('qualifie en NEEDS_REVIEW les métiers comportant une ambiguïté ou un point à clarifier', () => {
    const assessments = matchCareersWithInterview(dummyCareers, dummyInterview);
    const apa = assessments.find(
      (a) => a.originalTitle === 'Praticien en Activité Physique Adaptée (APA)'
    );

    expect(apa?.proposedStatus).toBe('NEEDS_REVIEW');
    expect(apa?.rationale).toContain('À clarifier avec le jeune');
  });
});
