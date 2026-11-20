// ============================================================================
// Tests de Sécurité & Non-Régression — Mode Réel vs Mode Démo
// ============================================================================

import { describe, expect, it } from 'vitest';
import { RealAuthService } from '../../apps/api/src/common/auth/real-auth.service.js';

describe('RealAuthService — Isolation Démo & Sécurité Mode Réel', () => {
  const authService = new RealAuthService();

  it('interdit l\'écrasement ou l\'inscription sur les comptes officiels de démo', async () => {
    await expect(
      authService.register({
        email: 'emma.d@monbilan.fr',
        password: 'Password123!',
        firstName: 'Imposteur',
        lastName: 'Test',
        role: 'YOUNG',
        mode: 'AUTONOMOUS'
      })
    ).rejects.toThrow('réservée au parcours de démonstration');

    await expect(
      authService.register({
        email: 'sophie.martin@centre-des-possibles.fr',
        password: 'Password123!',
        firstName: 'Imposteur',
        lastName: 'Test',
        role: 'COUNSELOR',
        mode: 'AUTONOMOUS',
        counselorKey: 'CONSEILLER-PRO-06'
      })
    ).rejects.toThrow('réservée au parcours de démonstration');
  });

  it('bloque formellement toute inscription conseiller sans clé d\'activation certifiée', async () => {
    await expect(
      authService.register({
        email: 'faux.conseiller@test.fr',
        password: 'Password123!',
        firstName: 'Faux',
        lastName: 'Conseiller',
        role: 'COUNSELOR',
        mode: 'AUTONOMOUS',
        counselorKey: 'CLE-INVALIDE-OU-INVENTEE'
      })
    ).rejects.toThrow('Activation impossible : clé d\'activation professionnelle invalide');
  });

  it('permet l\'inscription réelle d\'un jeune autonome avec mot de passe haché et persistance', async () => {
    const testEmail = `jeune.reel.${Date.now()}@exemple.fr`;
    const res = await authService.register({
      email: testEmail,
      password: 'SecuredPassword2026!',
      firstName: 'Camille',
      lastName: 'Durand',
      role: 'YOUNG',
      mode: 'AUTONOMOUS'
    });

    expect(res.token).toBeDefined();
    expect(res.token.startsWith('mb_')).toBe(true);
    expect(res.user.email).toBe(testEmail);
    expect(res.user.role).toBe('YOUNG');
    expect(res.user.mode).toBe('AUTONOMOUS');
    // Le hash et le salt ne doivent jamais être divulgués dans le DTO public
    expect((res.user as any).passwordHash).toBeUndefined();
    expect((res.user as any).salt).toBeUndefined();

    // Connexion avec le vrai compte
    const loginRes = await authService.login(testEmail, 'SecuredPassword2026!');
    expect(loginRes.isDemo).toBe(false);
    expect(loginRes.user.displayName).toBe('Camille Durand');

    // Refus de mot de passe incorrect
    await expect(authService.login(testEmail, 'MauvaisMotDePasse')).rejects.toThrow(
      'Adresse email ou mot de passe incorrect'
    );
  });

  it('permet l\'inscription réelle d\'un conseiller avec clé officielle et vérification de structure', async () => {
    const testEmail = `conseiller.officiel.${Date.now()}@cio-nice.fr`;
    const res = await authService.register({
      email: testEmail,
      password: 'ConseillerSecret2026!',
      firstName: 'Marc',
      lastName: 'Lambert',
      role: 'COUNSELOR',
      mode: 'AUTONOMOUS',
      organization: 'CIO Nice Centre',
      counselorKey: 'CONSEILLER-PRO-06'
    });

    expect(res.token).toBeDefined();
    expect(res.user.role).toBe('COUNSELOR');
    expect(res.user.organization).toBe('CIO Nice Centre');

    const session = authService.getSessionByToken(res.token);
    expect(session).not.toBeNull();
    expect(session?.isDemo).toBe(false);
  });

  it('reconnaît et préserve les comptes de démonstration avec le flag isDemo = true', async () => {
    const demoYoung = await authService.login('emma.d@monbilan.fr', 'demo1234');
    expect(demoYoung.isDemo).toBe(true);
    expect(demoYoung.user.displayName).toBe('Emma Dubois');
    expect(demoYoung.user.role).toBe('YOUNG');

    const demoCounselor = await authService.login('sophie.martin@centre-des-possibles.fr', 'demo1234');
    expect(demoCounselor.isDemo).toBe(true);
    expect(demoCounselor.user.displayName).toBe('Sophie Martin');
    expect(demoCounselor.user.role).toBe('COUNSELOR');
  });

  it('persiste et isole les favoris d\'un utilisateur réel', async () => {
    const testEmail = `favoris.user.${Date.now()}@exemple.fr`;
    const res = await authService.register({
      email: testEmail,
      password: 'Password123456!',
      firstName: 'Alex',
      lastName: 'Test',
      role: 'YOUNG',
      mode: 'AUTONOMOUS'
    });

    expect(authService.getFavorites(res.user.id)).toEqual([]);

    authService.addFavorite(res.user.id, '47-2141.00'); // Peintre décorateur
    authService.addFavorite(res.user.id, '27-4011.00'); // Technicien son

    const favs = authService.getFavorites(res.user.id);
    expect(favs).toContain('47-2141.00');
    expect(favs).toContain('27-4011.00');

    authService.removeFavorite(res.user.id, '47-2141.00');
    expect(authService.getFavorites(res.user.id)).not.toContain('47-2141.00');
    expect(authService.getFavorites(res.user.id)).toContain('27-4011.00');
  });
});
