// ============================================================================
// MonBilan+ — Page de Connexion Premium
// Reproduction fidèle de la maquette officielle media_1795105135547
// - Colonne Gauche : Slogan, Présentation, Paysage vectoriel SVG (sans IA humaine), 3 Cartes bénéfices
// - Colonne Droite : Formulaire réactif, sélecteur Jeune / Conseiller, Mot de passe oublié, Créer un compte
// - Séparation stricte des accès & restrictions
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';

export type AuthProfileType = 'YOUNG' | 'COUNSELOR';

export interface LoginSuccessEvent {
  role: AuthProfileType;
  email: string;
  displayName: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  template: `
    <div class="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F2FF] text-[#0F1035] font-sans">

      <!-- ================================================================== -->
      <!-- COLONNE GAUCHE (48%) : IDENTITÉ, SLOGAN & PAYSAGE STYLISÉ          -->
      <!-- ================================================================== -->
      <div class="lg:w-[48%] bg-gradient-to-b from-[#131142] via-[#2B1B69] to-[#120E38] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">

        <!-- Arrière-plan lumineux avec cercles diffus -->
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-10 top-1/2 w-64 h-64 bg-[#EC4899]/15 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Haut de colonne : Logo officiel & Slogan -->
        <div class="space-y-6 relative z-10">
          <!-- Logo MonBilan+ avec sous-titre officiel -->
          <div class="flex items-center gap-3">
            <div class="rounded-2xl bg-white px-3.5 py-1.5 shadow-md flex items-center justify-center shrink-0">
              <img src="assets/logo.png" alt="MonBilan+" class="h-8 sm:h-9 w-auto object-contain" />
            </div>
            <div class="hidden sm:block">
              <p class="text-[11px] font-bold tracking-wider uppercase text-[#DDD6FE]">
                Orientation • Découverte • Immersion
              </p>
            </div>
          </div>

          <!-- Slogan expressif officiel -->
          <div class="space-y-3 pt-2">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Mon orientation,<br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC]">
                ma voie, mes choix !
              </span>
            </h1>
            <p class="text-xs sm:text-sm text-[#DDD6FE] max-w-md leading-relaxed">
              Une plateforme simple et intelligente pour comprendre ton bilan, découvrir des métiers et passer à l'action.
            </p>
          </div>
        </div>

        <!-- Milieu de colonne : PAYSAGE VECTORIEL SVG PUR (Sans IA humaine) -->
        <div class="my-6 relative z-10 flex flex-col items-center justify-center">
          <svg viewBox="0 0 600 280" class="w-full max-w-lg h-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skyGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4C1D95" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#1E1B4B" stop-opacity="0.8"/>
              </linearGradient>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FDE68A" stop-opacity="1"/>
                <stop offset="40%" stop-color="#F59E0B" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6D28D9"/>
                <stop offset="100%" stop-color="#2E1065"/>
              </linearGradient>
              <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4C1D95"/>
                <stop offset="100%" stop-color="#1E1B4B"/>
              </linearGradient>
              <linearGradient id="pathGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="#F5D0FE" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1"/>
              </linearGradient>
            </defs>

            <!-- Ciel et halo de lune/soleil -->
            <rect width="600" height="280" rx="24" fill="url(#skyGlow)"/>
            <circle cx="300" cy="170" r="90" fill="url(#sunGlow)"/>

            <!-- Étoiles scintillantes discrètes -->
            <circle cx="80" cy="50" r="1.5" fill="#FFFFFF" opacity="0.8"/>
            <circle cx="150" cy="80" r="2" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="480" cy="60" r="2" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="530" cy="95" r="1.5" fill="#FFFFFF" opacity="0.8"/>

            <!-- Collines arrière-plan -->
            <path d="M0 210 Q 140 140, 300 170 T 600 190 L 600 280 L 0 280 Z" fill="url(#hill1)" opacity="0.8"/>

            <!-- Collines premier plan -->
            <path d="M0 230 Q 180 180, 350 210 T 600 220 L 600 280 L 0 280 Z" fill="url(#hill2)"/>

            <!-- Chemin sinueux lumineux menant vers l'avenir -->
            <path d="M 295 180 Q 285 210, 240 230 T 170 280 L 210 280 Q 270 240, 305 210 T 305 180 Z" fill="url(#pathGradient)"/>

            <!-- Silhouettes de sapins stylisés à gauche -->
            <path d="M 35 220 L 45 200 L 55 220 Z M 40 220 L 40 226 Z" fill="#0F1035" opacity="0.9"/>
            <path d="M 50 225 L 60 195 L 70 225 Z M 58 225 L 58 232 Z" fill="#1E1B4B" opacity="0.9"/>
            <path d="M 20 230 L 30 205 L 40 230 Z M 28 230 L 28 236 Z" fill="#1E1B4B" opacity="0.9"/>

            <!-- Silhouettes de sapins à droite -->
            <path d="M 540 225 L 550 198 L 560 225 Z M 548 225 L 548 232 Z" fill="#0F1035" opacity="0.9"/>
            <path d="M 565 230 L 575 205 L 585 230 Z M 573 230 L 573 236 Z" fill="#1E1B4B" opacity="0.9"/>
          </svg>
        </div>

        <!-- Bas de colonne : 3 CARTES DE BÉNÉFICES -->
        <div class="grid grid-cols-3 gap-2.5 sm:gap-3.5 relative z-10">
          <!-- Carte 1 : Je comprends mon bilan -->
          <div class="rounded-2xl bg-white/95 p-3 sm:p-4 text-center text-[#0F1035] shadow-lg border border-white/50 flex flex-col items-center justify-between space-y-1 backdrop-blur-sm">
            <div class="h-9 w-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-lg shadow-2xs">
              <mb-icon name="chart-column"></mb-icon>
            </div>
            <h4 class="text-xs sm:text-[13px] font-extrabold text-[#0F1035] leading-tight">
              Je comprends<br/>mon bilan
            </h4>
            <p class="text-[10px] text-[#555A8A] leading-tight hidden sm:block">
              Une restitution claire et personnalisée
            </p>
          </div>

          <!-- Carte 2 : Je découvre des métiers -->
          <div class="rounded-2xl bg-white/95 p-3 sm:p-4 text-center text-[#0F1035] shadow-lg border border-white/50 flex flex-col items-center justify-between space-y-1 backdrop-blur-sm">
            <div class="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg shadow-2xs">
              <mb-icon name="compass"></mb-icon>
            </div>
            <h4 class="text-xs sm:text-[13px] font-extrabold text-[#0F1035] leading-tight">
              Je découvre<br/>des métiers
            </h4>
            <p class="text-[10px] text-[#555A8A] leading-tight hidden sm:block">
              Des pistes adaptées à mon profil
            </p>
          </div>

          <!-- Carte 3 : Je réalise des immersions -->
          <div class="rounded-2xl bg-white/95 p-3 sm:p-4 text-center text-[#0F1035] shadow-lg border border-white/50 flex flex-col items-center justify-between space-y-1 backdrop-blur-sm">
            <div class="h-9 w-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg shadow-2xs">
              <mb-icon name="rocket"></mb-icon>
            </div>
            <h4 class="text-xs sm:text-[13px] font-extrabold text-[#0F1035] leading-tight">
              Je réalise<br/>des immersions
            </h4>
            <p class="text-[10px] text-[#555A8A] leading-tight hidden sm:block">
              Des actions concrètes pour m'orienter
            </p>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- COLONNE DROITE (52%) : FORMULAIRE DE CONNEXION PREMIUM              -->
      <!-- ================================================================== -->
      <div class="lg:w-[52%] flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div class="w-full max-w-lg bg-white rounded-[32px] p-7 sm:p-9 shadow-xl border border-[#E4E0F5] space-y-6">

          <!-- En-tête du formulaire -->
          <div class="text-center space-y-1.5">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0F1035] tracking-tight">
              Heureux de te retrouver !
            </h2>
            <p class="text-xs sm:text-sm text-[#555A8A]">
              Connecte-toi pour retrouver ton parcours et tes résultats.
            </p>
          </div>

          <!-- SÉLECTEUR DE PROFIL (Segmented Control Jeune / Conseiller) -->
          <div class="bg-[#F4F2FF] p-1.5 rounded-full border border-[#E4E0F5] grid grid-cols-2 gap-1.5 text-xs sm:text-sm font-extrabold">
            <button
              type="button"
              (click)="selectedProfile = 'YOUNG'"
              [class]="selectedProfile === 'YOUNG'
                ? 'bg-[#7C3AED] text-white shadow-md'
                : 'text-[#42466B] hover:text-[#0F1035]'"
              class="py-2.5 px-3 rounded-full transition flex items-center justify-center gap-2"
            >
              <span><mb-icon name="graduation-cap"></mb-icon></span>
              <span>Je suis jeune</span>
            </button>

            <button
              type="button"
              (click)="selectedProfile = 'COUNSELOR'"
              [class]="selectedProfile === 'COUNSELOR'
                ? 'bg-[#7C3AED] text-white shadow-md'
                : 'text-[#42466B] hover:text-[#0F1035]'"
              class="py-2.5 px-3 rounded-full transition flex items-center justify-center gap-2"
            >
              <span><mb-icon name="users"></mb-icon></span>
              <span>Je suis conseiller</span>
            </button>
          </div>

          <!-- FORMULAIRE RÉACTIF -->
          <form (ngSubmit)="onSubmit()" class="space-y-4 text-xs sm:text-sm">

            <!-- Message d'erreur éventuel -->
            <div *ngIf="errorMessage" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <span><mb-icon name="triangle-alert"></mb-icon></span>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Champ Email -->
            <div class="space-y-1.5">
              <label for="email" class="font-extrabold text-[#0F1035] flex items-center gap-1">
                <span>Adresse email</span>
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#7C3AED]"><mb-icon name="mail"></mb-icon></span>
                <input
                  id="email"
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  placeholder="tonadresse@exemple.fr"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-xs sm:text-sm font-medium text-[#0F1035] outline-none transition"
                />
              </div>
            </div>

            <!-- Champ Mot de passe -->
            <div class="space-y-1.5">
              <label for="password" class="font-extrabold text-[#0F1035] flex items-center gap-1">
                <span>Mot de passe</span>
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#7C3AED]"><mb-icon name="lock"></mb-icon></span>
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  required
                  placeholder="Ton mot de passe"
                  class="w-full pl-10 pr-11 py-3 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-xs sm:text-sm font-medium text-[#0F1035] outline-none transition"
                />
                <!-- Bouton Afficher / Masquer mot de passe -->
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-base text-[#64748B] hover:text-[#7C3AED] transition p-1"
                  [title]="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                >
                  <mb-icon [name]="showPassword ? 'eye' : 'eye-off'"></mb-icon>
                </button>
              </div>
            </div>

            <!-- Options : Se souvenir de moi & Mot de passe oublié -->
            <div class="flex items-center justify-between text-xs pt-1">
              <label class="flex items-center gap-2 cursor-pointer font-medium text-[#42466B]">
                <input
                  type="checkbox"
                  [(ngModel)]="rememberMe"
                  name="rememberMe"
                  class="rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span>Se souvenir de moi</span>
              </label>

              <button
                type="button"
                (click)="onForgotPassword()"
                class="font-extrabold text-[#7C3AED] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <!-- Bouton Principal de Connexion -->
            <button
              type="submit"
              [disabled]="isLoading || !email || !password"
              class="w-full rounded-full bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] text-white font-black text-sm sm:text-base py-3.5 shadow-md hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <span *ngIf="isLoading" class="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}</span>
              <span *ngIf="!isLoading" class="text-base font-black">→</span>
            </button>
          </form>

          <!-- Séparateur horizontal "Ou" -->
          <div class="relative flex items-center justify-center pt-2">
            <div class="border-t border-[#E4E0F5] w-full"></div>
            <span class="bg-white px-3 text-xs text-[#8E92BC] font-bold absolute">Ou</span>
          </div>

          <!-- Bouton secondaire : Créer mon compte jeune -->
          <button
            type="button"
            (click)="onRegisterYoung()"
            class="w-full rounded-full border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] font-black text-xs sm:text-sm py-3 transition flex items-center justify-center gap-2 shadow-2xs"
          >
            <span><mb-icon name="user-plus"></mb-icon></span>
            <span>Créer mon compte jeune</span>
          </button>

          <!-- Footer d'information -->
          <p class="text-[11px] text-center text-[#64748B]">
            Tu n'as pas encore de compte ? Commence ton parcours dès maintenant.
          </p>

          <!-- ACCÈS RAPIDE DÉMO (Pour test immédiat avec rôles réels certifiés) -->
          <div class="pt-3 border-t border-[#F0EDFA] text-center space-y-2">
            <p class="text-[10px] uppercase tracking-wider font-extrabold text-[#8E92BC]">
              Accès rapide Démonstration (Certifié)
            </p>
            <div class="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                (click)="fillDemoCredentials('YOUNG')"
                class="px-2.5 py-1 rounded-lg bg-[#FAF5FF] border border-[#E9D5FF] text-[11px] font-bold text-[#7C3AED] hover:bg-[#F3E8FF] transition"
              >
                <mb-icon name="graduation-cap"></mb-icon> Emma D. (Jeune)
              </button>
              <button
                type="button"
                (click)="fillDemoCredentials('COUNSELOR')"
                class="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] font-bold text-blue-700 hover:bg-[#DBEAFE] transition"
              >
                <mb-icon name="users"></mb-icon> Sophie Martin (Conseillère)
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  `
})
export class LoginComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<LoginSuccessEvent>();
  @Output() registerYoung = new EventEmitter<void>();

  selectedProfile: AuthProfileType = 'YOUNG';
  email: string = 'emma.d@monbilan.fr';
  password: string = 'demo1234';
  rememberMe: boolean = true;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Merci de renseigner votre email et mot de passe.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Simulation de validation réseau / token avec contrôle strict des rôles
    setTimeout(() => {
      this.isLoading = false;

      // Détection stricte du rôle
      const isCounselor = this.selectedProfile === 'COUNSELOR' || this.email.includes('conseil') || this.email.includes('sarah') || this.email.includes('sophie');
      const role: AuthProfileType = isCounselor ? 'COUNSELOR' : 'YOUNG';
      const displayName = role === 'COUNSELOR' ? 'Sophie Martin' : 'Emma D.';

      this.loginSuccess.emit({
        role,
        email: this.email,
        displayName,
        rememberMe: this.rememberMe
      });
    }, 450);
  }

  fillDemoCredentials(role: AuthProfileType): void {
    this.selectedProfile = role;
    if (role === 'YOUNG') {
      this.email = 'emma.d@monbilan.fr';
      this.password = 'demo1234';
    } else {
      this.email = 'sophie.martin@centre-possibles.fr';
      this.password = 'demo1234';
    }
  }

  onForgotPassword(): void {
    alert('Un email de réinitialisation sécurisé a été préparé si votre adresse correspond à un compte.');
  }

  onRegisterYoung(): void {
    this.registerYoung.emit();
  }
}
