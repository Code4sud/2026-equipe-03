import { describe, expect, it } from 'vitest';
import { mapCareerToInterestCategory } from '@monbilan/domain';
import { DEMO_SUPPORT_RESOURCES, loadOnetCareersCatalog } from '../../apps/api/src/common/demo-fixture.js';

describe('Autonomous Journey & Career Catalog (Zéro Hallucination)', () => {
  it('categorizes careers into thematic interest categories purely for navigation', () => {
    const peintre = mapCareerToInterestCategory('Peintre décorateur', 'Applique des peintures et patines artistiques');
    expect(peintre.category).toBe('CREATIVE');
    expect(peintre.label).toBe('Créer / Artistique');

    const dev = mapCareerToInterestCategory('Développeur web', 'Conçoit des logiciels et applications informatiques');
    expect(dev.category).toBe('DIGITAL');
    expect(dev.label).toBe('Numérique');

    const paysagiste = mapCareerToInterestCategory('Jardinier paysagiste', 'Aménage et entretient des espaces verts et la nature');
    expect(paysagiste.category).toBe('NATURE');
    expect(paysagiste.label).toBe('Nature / Environnement');

    const maçon = mapCareerToInterestCategory('Maçon du bâtiment', 'Construit des murs et structures sur les chantiers');
    expect(maçon.category).toBe('CRAFT');
    expect(maçon.label).toBe('Bricoler / Construire');
  });

  it('loads the real O*NET career catalog with verified job zones and descriptions', () => {
    const catalog = loadOnetCareersCatalog();
    expect(catalog.length).toBeGreaterThanOrEqual(22);

    const first = catalog[0];
    expect(first.titleFr).toBeDefined();
    expect(first.jobZone).toBeGreaterThanOrEqual(1);
    expect(first.jobZone).toBeLessThanOrEqual(5);
    expect(first.suggestedActivities.length).toBeGreaterThan(0);
    expect(first.suggestedQuestions.length).toBeGreaterThan(0);
  });

  it('provides verified public support structures with official contact details', () => {
    expect(DEMO_SUPPORT_RESOURCES.length).toBeGreaterThanOrEqual(5);

    const cio = DEMO_SUPPORT_RESOURCES.find((r) => r.category === 'CIO');
    expect(cio).toBeDefined();
    expect(cio?.isOfficialPublicService).toBe(true);
    expect(cio?.websiteUrl).toContain('https://');

    const ml = DEMO_SUPPORT_RESOURCES.find((r) => r.category === 'MISSION_LOCALE');
    expect(ml).toBeDefined();
    expect(ml?.city).toBe('Nice');

    const immersion = DEMO_SUPPORT_RESOURCES.find((r) => r.id === 'supp-immersion-facilee');
    expect(immersion).toBeDefined();
    expect(immersion?.websiteUrl).toBe('https://immersion-facilee.beta.gouv.fr');
  });
});
