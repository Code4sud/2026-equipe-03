// ============================================================================
// Tests Unitaires — Module Territorial « Autour de moi »
// ============================================================================

import { describe, expect, it } from 'vitest';
import {
  filterOpportunities,
  getCategoryCounts,
  LOCAL_OPPORTUNITIES_DATA,
  LocalFilterState
} from '../../apps/web/src/app/shared/local-discovery-data.js';

describe('Local Discovery Module — Alpes-Maritimes & Nice (06)', () => {
  it('should have a verified catalogue of real local opportunities', () => {
    expect(LOCAL_OPPORTUNITIES_DATA.length).toBeGreaterThanOrEqual(16);
    const counts = getCategoryCounts(LOCAL_OPPORTUNITIES_DATA);
    expect(counts.formations).toBeGreaterThanOrEqual(6);
    expect(counts.structuresAide).toBeGreaterThanOrEqual(5);
    expect(counts.entreprises).toBeGreaterThanOrEqual(5);
  });

  it('should filter by category FORMATION', () => {
    const filters: LocalFilterState = {
      careerQuery: '',
      city: 'Nice',
      radiusKm: 25,
      category: 'FORMATION',
      sortBy: 'distance'
    };
    const results = filterOpportunities(LOCAL_OPPORTUNITIES_DATA, filters);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.category === 'FORMATION')).toBe(true);
  });

  it('should filter by career "Peintre décorateur" and return relevant CFA, Lycée and companies', () => {
    const filters: LocalFilterState = {
      careerQuery: 'Peintre décorateur',
      city: 'Nice',
      radiusKm: 25,
      category: 'ALL',
      sortBy: 'relevance'
    };
    const results = filterOpportunities(LOCAL_OPPORTUNITIES_DATA, filters);
    expect(results.length).toBeGreaterThan(0);
    const names = results.map((r) => r.name);
    expect(names).toContain('Lycée Professionnel Vauban');
    expect(names).toContain('Atelier Décors & Patines Riviera');
  });

  it('should filter by radius correctly', () => {
    const filtersClose: LocalFilterState = {
      careerQuery: '',
      city: 'Nice',
      radiusKm: 5,
      category: 'ALL',
      sortBy: 'distance'
    };
    const results = filterOpportunities(LOCAL_OPPORTUNITIES_DATA, filtersClose);
    expect(results.every((item) => item.distanceKm <= 5)).toBe(true);
  });

  it('should sort opportunities by distance correctly', () => {
    const filters: LocalFilterState = {
      careerQuery: '',
      city: 'Nice',
      radiusKm: 50,
      category: 'ALL',
      sortBy: 'distance'
    };
    const results = filterOpportunities(LOCAL_OPPORTUNITIES_DATA, filters);
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].distanceKm).toBeLessThanOrEqual(results[i + 1].distanceKm);
    }
  });

  it('should provide complete geolocation coordinates and transit information for each establishment', () => {
    for (const opp of LOCAL_OPPORTUNITIES_DATA) {
      expect(opp.coordinates.lat).toBeGreaterThan(43.5);
      expect(opp.coordinates.lat).toBeLessThan(44.0);
      expect(opp.coordinates.lng).toBeGreaterThan(6.8);
      expect(opp.coordinates.lng).toBeLessThan(7.5);
      expect(opp.address).toBeDefined();
      expect(opp.city).toBeDefined();
      expect(opp.sourceBadge || opp.sourceFiabilite).toBeDefined();
    }
  });
});
