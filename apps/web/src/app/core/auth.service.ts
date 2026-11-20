// ============================================================================
// MonBilan+ — Service d'Authentification & Persistance Frontend
// Gère l'isolation étanche entre le Mode Démonstration et le Mode Réel
// ============================================================================

import { Injectable } from '@angular/core';

export interface UserSession {
  token: string;
  userId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: 'YOUNG' | 'COUNSELOR';
  mode: 'AUTONOMOUS' | 'SUPPORTED';
  tenantId: string;
  organization?: string;
  isDemo: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'YOUNG' | 'COUNSELOR';
  mode: 'AUTONOMOUS' | 'SUPPORTED';
  invitationCode?: string;
  organization?: string;
  counselorKey?: string;
}

const LOCAL_STORAGE_USERS_KEY = 'monbilan_real_users_store_v1';
const LOCAL_STORAGE_SESSION_KEY = 'monbilan_auth_session_v1';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentSession: UserSession | null = null;
  private readonly apiBaseUrl = 'http://localhost:3000/v1';

  constructor() {
    this.restoreSession();
  }

  get session(): UserSession | null {
    return this.currentSession;
  }

  get isAuthenticated(): boolean {
    return !!this.currentSession;
  }

  get isDemoMode(): boolean {
    return this.currentSession?.isDemo ?? false;
  }

  restoreSession(): UserSession | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (raw) {
        this.currentSession = JSON.parse(raw);
        return this.currentSession;
      }
    } catch {
      this.currentSession = null;
    }
    return null;
  }

  /**
   * Connexion réelle avec appel API et fallback de persistance locale étanche
   */
  async login(emailInput: string, passwordInput: string): Promise<UserSession> {
    const email = (emailInput || '').trim().toLowerCase();

    // 1. Détection prioritaire du Mode Démo Hackathon
    if (email === 'emma.d@monbilan.fr') {
      const demoSession: UserSession = {
        token: `demo-token-young-${Date.now()}`,
        userId: 'aaaa1111-1111-4111-8111-111111111111',
        email,
        displayName: 'Emma Dubois',
        firstName: 'Emma',
        lastName: 'Dubois',
        role: 'YOUNG',
        mode: 'SUPPORTED',
        tenantId: '00000000-0000-4000-8000-000000000001',
        isDemo: true
      };
      this.setSession(demoSession);
      return demoSession;
    }

    if (email === 'sophie.martin@centre-des-possibles.fr' || email === 'sophie.martin@monbilan.fr') {
      const demoSession: UserSession = {
        token: `demo-token-counselor-${Date.now()}`,
        userId: '22222222-2222-4222-8222-222222222222',
        email,
        displayName: 'Sophie Martin',
        firstName: 'Sophie',
        lastName: 'Martin',
        role: 'COUNSELOR',
        mode: 'AUTONOMOUS',
        tenantId: '00000000-0000-4000-8000-000000000001',
        organization: 'Centre des Possibles',
        isDemo: true
      };
      this.setSession(demoSession);
      return demoSession;
    }

    if (email === 'lucas.moreau@exemple.fr') {
      const demoSession: UserSession = {
        token: `demo-token-lucas-${Date.now()}`,
        userId: 'lucas-demo-uuid-2026',
        email,
        displayName: 'Lucas Moreau',
        firstName: 'Lucas',
        lastName: 'Moreau',
        role: 'YOUNG',
        mode: 'AUTONOMOUS',
        tenantId: '00000000-0000-4000-8000-000000000001',
        isDemo: true
      };
      this.setSession(demoSession);
      return demoSession;
    }

    // 2. Tentative via l'API NestJS
    try {
      const res = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordInput })
      });

      if (res.ok) {
        const data = await res.json();
        const realSession: UserSession = {
          token: data.token,
          userId: data.user.id,
          email: data.user.email,
          displayName: data.user.displayName,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role,
          mode: data.user.mode,
          tenantId: data.user.tenantId,
          organization: data.user.organization,
          isDemo: data.isDemo
        };
        this.setSession(realSession);
        return realSession;
      }
    } catch {
      // Si l'API HTTP n'est pas démarrée, vérification dans le store réel local
    }

    // 3. Fallback store réel persistant
    const realUsers = this.getStoredRealUsers();
    const user = realUsers.find((u) => u.email === email);
    if (!user) {
      throw new Error('Adresse email ou mot de passe incorrect.');
    }

    if (user.password !== passwordInput) {
      throw new Error('Adresse email ou mot de passe incorrect.');
    }

    const localSession: UserSession = {
      token: `mb_local_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      email: user.email,
      displayName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      mode: user.mode,
      tenantId: '00000000-0000-4000-8000-000000000001',
      organization: user.organization,
      isDemo: false
    };
    this.setSession(localSession);
    return localSession;
  }

  /**
   * Inscription d'un utilisateur réel
   */
  async register(payload: RegisterPayload): Promise<UserSession> {
    const email = (payload.email || '').trim().toLowerCase();

    // Protection des comptes démo
    if (
      email === 'emma.d@monbilan.fr' ||
      email === 'sophie.martin@centre-des-possibles.fr' ||
      email === 'lucas.moreau@exemple.fr'
    ) {
      throw new Error('Cette adresse email est réservée au parcours de démonstration.');
    }

    // Tentative via l'API NestJS
    try {
      const res = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const session: UserSession = {
          token: data.token,
          userId: data.user.id,
          email: data.user.email,
          displayName: data.user.displayName,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role,
          mode: data.user.mode,
          tenantId: data.user.tenantId,
          organization: data.user.organization,
          isDemo: false
        };
        this.setSession(session);
        return session;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Erreur lors de l\'inscription.');
      }
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') {
        throw e;
      }
    }

    // Fallback store persistant local
    const realUsers = this.getStoredRealUsers();
    if (realUsers.some((u) => u.email === email)) {
      throw new Error('Un compte existe déjà avec cette adresse email.');
    }

    // Sécurité stricte Conseiller
    if (payload.role === 'COUNSELOR') {
      const key = (payload.counselorKey || '').trim().toUpperCase();
      const validKeys = ['CONSEILLER-PRO-06', 'CIO-NICE-CENTRE-PRO', 'ML-COTE-AZUR-PRO'];
      if (!validKeys.includes(key)) {
        throw new Error(
          'Activation impossible : clé d\'activation professionnelle invalide ou non reconnue.'
        );
      }
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      email,
      password: payload.password,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      role: payload.role,
      mode: payload.mode || 'AUTONOMOUS',
      organization: payload.organization,
      createdAt: new Date().toISOString()
    };

    realUsers.push(newUser);
    this.saveStoredRealUsers(realUsers);

    const session: UserSession = {
      token: `mb_local_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: newUser.id,
      email: newUser.email,
      displayName: `${newUser.firstName} ${newUser.lastName}`,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      mode: newUser.mode,
      tenantId: '00000000-0000-4000-8000-000000000001',
      organization: newUser.organization,
      isDemo: false
    };

    this.setSession(session);
    return session;
  }

  logout(): void {
    if (this.currentSession?.token && !this.currentSession.isDemo) {
      fetch(`${this.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.currentSession.token}`
        }
      }).catch(() => {});
    }
    this.currentSession = null;
    try {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    } catch {}
  }

  private setSession(session: UserSession): void {
    this.currentSession = session;
    try {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch {}
  }

  private getStoredRealUsers(): any[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveStoredRealUsers(users: any[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {}
  }
}
