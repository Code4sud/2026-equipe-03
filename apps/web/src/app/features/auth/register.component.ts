// ============================================================================
// MonBilan+ — Page d'Inscription Premium
// Reproduction fidèle de la maquette officielle (media_1795135005602_7909efe3)
// - Colonne Gauche : Dégradé violet/indigo, Logo MonBilan+, Slogan,
//                    Illustration des 3 jeunes, 3 bénéfices avec puces cochées
// - Colonne Droite : Stepper 3 étapes (Choix du parcours, Création, Confirmation)
//                    3 Cartes de situation (Autonome, Accompagné, Conseiller)
//                    Formulaires sécurisés selon le profil et accès direct
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { AuthService } from '../../core/auth.service';

export type RegisterProfileType = 'AUTONOMOUS' | 'SUPPORTED' | 'COUNSELOR';

export interface RegisterSuccessEvent {
  role: 'YOUNG' | 'COUNSELOR';
  mode: 'AUTONOMOUS' | 'SUPPORTED';
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  invitationCode?: string;
  organization?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MbIconComponent],
  template: `
    <div class="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F2FF] text-[#0F1035] font-sans">

      <!-- ================================================================== -->
      <!-- COLONNE GAUCHE (42%) : IDENTITÉ, SLOGAN, JEUNES & BÉNÉFICES         -->
      <!-- ================================================================== -->
      <div class="lg:w-[42%] bg-gradient-to-br from-[#4A1D96] via-[#6328E8] to-[#2E1065] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">

        <!-- Formes douces organiques en arrière-plan -->
        <div class="absolute -right-24 -top-24 w-96 h-96 bg-[#8B5CF6]/25 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 bottom-10 w-80 h-80 bg-[#C084FC]/20 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Vagues décoratives en haut et en bas -->
        <svg class="absolute top-0 left-0 w-full opacity-15 pointer-events-none" viewBox="0 0 500 150" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,40 L500,0 L0,0 Z" fill="#FFFFFF"></path>
        </svg>

        <!-- HAUT DE COLONNE : LOGO & ACCROCHE -->
        <div class="space-y-6 relative z-10">
          <!-- Logo MonBilan+ avec sous-titre officiel -->
          <div class="flex items-center gap-3">
            <div class="rounded-2xl bg-white px-3.5 py-1.5 shadow-md flex items-center justify-center shrink-0">
              <img src="assets/logo.png" alt="MonBilan+" class="h-8 sm:h-9 w-auto object-contain" />
            </div>
            <div>
              <p class="text-[11px] sm:text-xs font-bold tracking-wider text-[#DDD6FE]">
                Orientation · Découverte · Accompagnement
              </p>
            </div>
          </div>

          <!-- Titre principal de la maquette -->
          <div class="space-y-3 pt-4">
            <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.15]">
              Bienvenue sur<br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E8FF] to-[#DDD6FE]">
                MonBilan+
              </span>
            </h1>
            <p class="text-xs sm:text-sm text-[#E9D5FF] max-w-sm leading-relaxed">
              Crée ton compte et commence ton parcours d'orientation.
            </p>
          </div>
        </div>

        <!-- MILIEU DE COLONNE : ILLUSTRATION DES 3 JEUNES AVEC ÉCLATS LUMINEUX -->
        <div class="my-6 lg:my-8 relative z-10 flex flex-col items-center justify-center">
          <div class="relative w-full max-w-[340px] flex items-end justify-center">

            <!-- Éclats lumineux décoratifs comme sur la maquette -->
            <div class="absolute -top-3 left-4 text-[#FDE047] text-xl font-bold select-none animate-pulse">✦</div>
            <div class="absolute top-2 right-6 text-white text-lg font-bold select-none opacity-80">✦</div>
            <div class="absolute top-1/3 -left-3 flex flex-col gap-1 opacity-70">
              <span class="block w-3 h-0.5 bg-white/70 rotate-[-30deg]"></span>
              <span class="block w-2.5 h-0.5 bg-white/70 rotate-[-15deg]"></span>
            </div>
            <div class="absolute top-1/4 -right-2 flex flex-col gap-1 opacity-70">
              <span class="block w-3 h-0.5 bg-white/70 rotate-[30deg]"></span>
              <span class="block w-2.5 h-0.5 bg-white/70 rotate-[15deg]"></span>
            </div>

            <!-- Composition stylisée des 3 jeunes de la maquette -->
            <div class="relative flex items-end justify-center w-full h-[220px] sm:h-[250px]">
              <!-- Jeune 1 (Gauche) : Fille au casque audio violet et sweat -->
              <div class="absolute left-2 sm:left-4 bottom-0 z-10 w-[110px] sm:w-[130px] transition-transform hover:scale-105">
                <img
                  src="assets/visuals/hero-girl-headphones.png"
                  alt="Jeune fille au casque audio"
                  class="w-full h-auto object-contain drop-shadow-xl"
                  (error)="onImgError($event)"
                />
              </div>

              <!-- Jeune 2 (Centre) : Garçon au sac à dos et t-shirt bleu -->
              <div class="relative z-20 w-[125px] sm:w-[150px] transition-transform hover:scale-105 mb-0">
                <img
                  src="assets/visuals/hero-boy-backpack.png"
                  alt="Jeune homme au sac à dos"
                  class="w-full h-auto object-contain drop-shadow-2xl"
                  (error)="onImgError($event)"
                />
              </div>

              <!-- Jeune 3 (Droite) : Fille aux lunettes et carnet/tablette -->
              <div class="absolute right-2 sm:right-4 bottom-0 z-10 w-[110px] sm:w-[130px] transition-transform hover:scale-105">
                <img
                  src="assets/visuals/avatar-aicha.png"
                  alt="Jeune fille étudiante avec carnet"
                  class="w-full h-auto object-contain drop-shadow-xl rounded-b-2xl"
                  (error)="onImgError($event)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- BAS DE COLONNE : 3 BÉNÉFICES AVEC CHECKMARKS BLANCHES -->
        <div class="space-y-3 relative z-10 pt-2">
          <!-- Bénéfice 1 -->
          <div class="flex items-center gap-3">
            <div class="h-6 w-6 rounded-full bg-white text-[#7C3AED] flex items-center justify-center shrink-0 shadow-sm">
              <mb-icon name="check" class="text-xs font-black"></mb-icon>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-white/95">
              Explore des métiers qui te correspondent
            </p>
          </div>

          <!-- Bénéfice 2 -->
          <div class="flex items-center gap-3">
            <div class="h-6 w-6 rounded-full bg-white text-[#7C3AED] flex items-center justify-center shrink-0 shadow-sm">
              <mb-icon name="check" class="text-xs font-black"></mb-icon>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-white/95">
              Avance avec des outils simples et pratiques
            </p>
          </div>

          <!-- Bénéfice 3 -->
          <div class="flex items-center gap-3">
            <div class="h-6 w-6 rounded-full bg-white text-[#7C3AED] flex items-center justify-center shrink-0 shadow-sm">
              <mb-icon name="check" class="text-xs font-black"></mb-icon>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-white/95">
              Bénéficie d'un accompagnement si tu le souhaites
            </p>
          </div>
        </div>

      </div>

      <!-- ================================================================== -->
      <!-- COLONNE DROITE (58%) : STEPPER, CARTES & FORMULAIRE ADAPTÉ          -->
      <!-- ================================================================== -->
      <div class="lg:w-[58%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">

        <!-- HAUT : STEPPER EN 3 ÉTAPES FIDÈLE À LA MAQUETTE -->
        <div class="w-full max-w-xl mx-auto">
          <div class="flex items-center justify-between relative mb-8 sm:mb-10">
            <!-- Ligne de progression arrière-plan -->
            <div class="absolute left-8 right-8 top-4 -translate-y-1/2 h-0.5 bg-[#E4E0F5] -z-0"></div>
            <div
              class="absolute left-8 top-4 -translate-y-1/2 h-0.5 bg-[#7C3AED] transition-all duration-300 -z-0"
              [style.width]="currentStep === 1 ? '0%' : (currentStep === 2 ? '50%' : '100%')"
            ></div>

            <!-- Étape 1 : Choix du parcours -->
            <div class="flex flex-col items-center gap-1.5 z-10 bg-white px-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors shadow-xs"
                [ngClass]="currentStep >= 1 ? 'bg-[#5B21B6] text-white' : 'bg-[#E4E0F5] text-[#64748B]'"
              >
                1
              </div>
              <span class="text-[11px] sm:text-xs font-bold" [ngClass]="currentStep === 1 ? 'text-[#1E1B4B]' : 'text-[#64748B]'">
                Choix du parcours
              </span>
            </div>

            <!-- Étape 2 : Création du compte -->
            <div class="flex flex-col items-center gap-1.5 z-10 bg-white px-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors shadow-xs"
                [ngClass]="currentStep >= 2 ? 'bg-[#5B21B6] text-white' : 'bg-[#F1F0F9] text-[#64748B] border border-[#D8DCF0]'"
              >
                2
              </div>
              <span class="text-[11px] sm:text-xs font-bold" [ngClass]="currentStep === 2 ? 'text-[#1E1B4B]' : 'text-[#64748B]'">
                Création du compte
              </span>
            </div>

            <!-- Étape 3 : Confirmation -->
            <div class="flex flex-col items-center gap-1.5 z-10 bg-white px-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors shadow-xs"
                [ngClass]="currentStep >= 3 ? 'bg-[#5B21B6] text-white' : 'bg-[#F1F0F9] text-[#64748B] border border-[#D8DCF0]'"
              >
                3
              </div>
              <span class="text-[11px] sm:text-xs font-bold" [ngClass]="currentStep === 3 ? 'text-[#1E1B4B]' : 'text-[#64748B]'">
                Confirmation
              </span>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- ÉTAPE 1 : CHOIX DU PARCOURS (FIDÈLE À LA MAQUETTE OFFICIELLE)   -->
          <!-- ============================================================== -->
          <div *ngIf="currentStep === 1" class="space-y-6 animate-fadeIn">

            <!-- En-tête de section -->
            <div class="space-y-2">
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0F1035] tracking-tight">
                Quel espace te correspond ?
              </h2>
              <p class="text-xs sm:text-sm text-[#555A8A] leading-relaxed">
                Choisis la situation qui te décrit le mieux. Tu pourras toujours la faire évoluer plus tard.
              </p>
            </div>

            <!-- Les 3 Cartes de situation -->
            <div class="space-y-3.5 pt-2">

              <!-- CARTE 1 : JE DÉCOUVRE PAR MOI-MÊME (Jeune autonome) -->
              <button
                type="button"
                (click)="selectProfile('AUTONOMOUS')"
                class="w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 hover:shadow-md group"
                [ngClass]="selectedProfile === 'AUTONOMOUS'
                  ? 'border-[#7C3AED] bg-[#FAF8FF] shadow-sm'
                  : 'border-[#E9E6F7] hover:border-[#C4B5FD] bg-white'"
              >
                <div class="flex items-center gap-3.5 sm:gap-4">
                  <!-- Icône Boussole -->
                  <div class="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    <mb-icon name="compass"></mb-icon>
                  </div>
                  <div class="space-y-0.5">
                    <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035] group-hover:text-[#6328E8] transition-colors">
                      Je découvre par moi-même
                    </h3>
                    <p class="text-xs text-[#555A8A] max-w-sm sm:max-w-md line-clamp-2">
                      Je crée mon compte et j'explore librement les métiers et les possibles.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EDE9FE] text-[#6D28D9]">
                    Jeune autonome
                  </span>
                  <span class="text-[#8B5CF6] group-hover:translate-x-1 transition-transform font-bold text-lg">›</span>
                </div>
              </button>

              <!-- CARTE 2 : JE SUIS ACCOMPAGNÉ (Jeune accompagné) -->
              <button
                type="button"
                (click)="selectProfile('SUPPORTED')"
                class="w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 hover:shadow-md group"
                [ngClass]="selectedProfile === 'SUPPORTED'
                  ? 'border-[#7C3AED] bg-[#FAF8FF] shadow-sm'
                  : 'border-[#E9E6F7] hover:border-[#C4B5FD] bg-white'"
              >
                <div class="flex items-center gap-3.5 sm:gap-4">
                  <!-- Icône Groupe de personnes -->
                  <div class="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    <mb-icon name="users"></mb-icon>
                  </div>
                  <div class="space-y-0.5">
                    <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035] group-hover:text-[#6328E8] transition-colors">
                      Je suis accompagné
                    </h3>
                    <p class="text-xs text-[#555A8A] max-w-sm sm:max-w-md line-clamp-2">
                      J'ai reçu une invitation de ma structure (CIO, Mission Locale, établissement, etc.).
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EDE9FE] text-[#6D28D9]">
                    Jeune accompagné
                  </span>
                  <span class="text-[#8B5CF6] group-hover:translate-x-1 transition-transform font-bold text-lg">›</span>
                </div>
              </button>

              <!-- CARTE 3 : JE SUIS PROFESSIONNEL (Conseiller) -->
              <button
                type="button"
                (click)="selectProfile('COUNSELOR')"
                class="w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 hover:shadow-md group"
                [ngClass]="selectedProfile === 'COUNSELOR'
                  ? 'border-[#7C3AED] bg-[#FAF8FF] shadow-sm'
                  : 'border-[#E9E6F7] hover:border-[#C4B5FD] bg-white'"
              >
                <div class="flex items-center gap-3.5 sm:gap-4">
                  <!-- Icône Mallette -->
                  <div class="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    <mb-icon name="briefcase"></mb-icon>
                  </div>
                  <div class="space-y-0.5">
                    <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035] group-hover:text-[#6328E8] transition-colors">
                      Je suis professionnel
                    </h3>
                    <p class="text-xs text-[#555A8A] max-w-sm sm:max-w-md line-clamp-2">
                      J'active mon accès pour accompagner des jeunes dans leur orientation.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EDE9FE] text-[#6D28D9]">
                    Conseiller
                  </span>
                  <span class="text-[#8B5CF6] group-hover:translate-x-1 transition-transform font-bold text-lg">›</span>
                </div>
              </button>

            </div>

          </div>

          <!-- ============================================================== -->
          <!-- ÉTAPE 2 : FORMULAIRE ADAPTÉ AU PROFIL SÉLECTIONNÉ               -->
          <!-- ============================================================== -->
          <div *ngIf="currentStep === 2" class="space-y-6 animate-fadeIn">

            <!-- Bouton retour à l'étape 1 -->
            <button
              type="button"
              (click)="currentStep = 1"
              class="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#7C3AED] hover:underline"
            >
              <span>←</span>
              <span>Changer de situation</span>
            </button>

            <!-- Titre & Badge de situation -->
            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#EDE9FE] text-[#6D28D9]">
                  {{ getProfileBadge() }}
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0F1035] tracking-tight">
                {{ getStep2Title() }}
              </h2>
              <p class="text-xs sm:text-sm text-[#555A8A]">
                {{ getStep2Subtitle() }}
              </p>
            </div>

            <!-- Message d'erreur éventuel -->
            <div *ngIf="errorMessage" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <mb-icon name="triangle-alert"></mb-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Formulaire réactif -->
            <form (ngSubmit)="onSubmitStep2()" class="space-y-4 text-xs sm:text-sm">

              <!-- Prénom et Nom en grille -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div class="space-y-1.5">
                  <label for="firstName" class="font-extrabold text-[#0F1035]">
                    Prénom <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    [(ngModel)]="firstName"
                    name="firstName"
                    required
                    placeholder="Ex: Emma"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-xs sm:text-sm font-medium text-[#0F1035] outline-none transition"
                  />
                </div>

                <div class="space-y-1.5">
                  <label for="lastName" class="font-extrabold text-[#0F1035]">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    [(ngModel)]="lastName"
                    name="lastName"
                    required
                    placeholder="Ex: Dupont"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-xs sm:text-sm font-medium text-[#0F1035] outline-none transition"
                  />
                </div>
              </div>

              <!-- Champ Email -->
              <div class="space-y-1.5">
                <label for="email" class="font-extrabold text-[#0F1035]">
                  {{ selectedProfile === 'COUNSELOR' ? 'Adresse email professionnelle' : 'Adresse email' }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]">
                    <mb-icon name="mail"></mb-icon>
                  </span>
                  <input
                    id="email"
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    required
                    [placeholder]="selectedProfile === 'COUNSELOR' ? 'sophie.martin@centre-des-possibles.fr' : 'tonadresse@exemple.fr'"
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-xs sm:text-sm font-medium text-[#0F1035] outline-none transition"
                  />
                </div>
              </div>

              <!-- SPÉCIFIQUE JEUNE ACCOMPAGNÉ : Code d'invitation structure -->
              <div *ngIf="selectedProfile === 'SUPPORTED'" class="space-y-1.5 p-3.5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE]">
                <div class="flex items-center justify-between">
                  <label for="invitationCode" class="font-extrabold text-[#5B21B6] flex items-center gap-1.5">
                    <mb-icon name="ticket"></mb-icon>
                    <span>Code d'invitation de ta structure</span> <span class="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    (click)="fillDemoCode()"
                    class="text-[11px] font-bold text-[#7C3AED] hover:underline"
                  >
                    Utiliser un code test (CIO)
                  </button>
                </div>
                <input
                  id="invitationCode"
                  type="text"
                  [(ngModel)]="invitationCode"
                  name="invitationCode"
                  placeholder="Ex: CIO-NICE-2026 ou ML-06"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-[#C4B5FD] bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-xs sm:text-sm font-mono font-bold text-[#0F1035] outline-none transition uppercase"
                />
                <p class="text-[11px] text-[#6B21A8]">
                  Ce code permet de relier ton compte au bilan préparé par ton conseiller.
                </p>
              </div>

              <!-- SPÉCIFIQUE CONSEILLER : Structure & Clé d'activation pro certifiée -->
              <div *ngIf="selectedProfile === 'COUNSELOR'" class="space-y-3 p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE]">
                <div class="space-y-1.5">
                  <label for="organization" class="font-extrabold text-blue-900">
                    Structure / Établissement <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="organization"
                    type="text"
                    [(ngModel)]="organization"
                    name="organization"
                    placeholder="Ex: CIO Nice Centre, Mission Locale Côte d'Azur..."
                    class="w-full px-3.5 py-2.5 rounded-xl border border-[#93C5FD] bg-white text-xs sm:text-sm font-medium text-[#0F1035] outline-none"
                  />
                </div>

                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label for="counselorKey" class="font-extrabold text-blue-900 flex items-center gap-1">
                      <mb-icon name="shield-check"></mb-icon>
                      <span>Clé d'activation professionnelle</span> <span class="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      (click)="fillDemoCounselorKey()"
                      class="text-[11px] font-bold text-blue-700 hover:underline"
                    >
                      Clé d'activation test
                    </button>
                  </div>
                  <input
                    id="counselorKey"
                    type="password"
                    [(ngModel)]="counselorKey"
                    name="counselorKey"
                    placeholder="Clé sécurisée fournie par votre administrateur"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-[#93C5FD] bg-white text-xs sm:text-sm font-mono text-[#0F1035] outline-none"
                  />
                  <p class="text-[11px] text-blue-700">
                    Vérification stricte anti-usurpation pour protéger la confidentialité des jeunes.
                  </p>
                </div>
              </div>

              <!-- Champ Mot de passe -->
              <div class="space-y-1.5">
                <label for="password" class="font-extrabold text-[#0F1035]">
                  Mot de passe <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]">
                    <mb-icon name="lock"></mb-icon>
                  </span>
                  <input
                    id="password"
                    [type]="showPassword ? 'text' : 'password'"
                    [(ngModel)]="password"
                    name="password"
                    required
                    placeholder="Au moins 8 caractères"
                    class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-xs sm:text-sm font-medium text-[#0F1035] outline-none transition"
                  />
                  <button
                    type="button"
                    (click)="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#64748B] hover:text-[#7C3AED] transition"
                  >
                    <mb-icon [name]="showPassword ? 'eye' : 'eye-off'"></mb-icon>
                  </button>
                </div>
              </div>

              <!-- Case CGU & Confidentialité -->
              <div class="pt-1">
                <label class="flex items-start gap-2.5 cursor-pointer text-xs text-[#555A8A]">
                  <input
                    type="checkbox"
                    [(ngModel)]="acceptTerms"
                    name="acceptTerms"
                    class="mt-0.5 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <span>
                    J'accepte les <span class="font-bold text-[#7C3AED] underline">Conditions Générales d'Utilisation</span> et la <span class="font-bold text-[#7C3AED] underline">Politique de confidentialité</span>.
                  </span>
                </label>
              </div>

              <!-- Bouton de soumission Étape 2 -->
              <button
                type="submit"
                [disabled]="isLoading || !isStep2Valid()"
                class="w-full rounded-full bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] text-white font-extrabold text-sm sm:text-base py-3.5 shadow-md hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                <span *ngIf="isLoading" class="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isLoading ? 'Création en cours...' : getSubmitButtonText() }}</span>
                <span *ngIf="!isLoading">→</span>
              </button>

            </form>

          </div>

          <!-- ============================================================== -->
          <!-- ÉTAPE 3 : CONFIRMATION & BIENVENUE PERSONNALISÉE                -->
          <!-- ============================================================== -->
          <div *ngIf="currentStep === 3" class="space-y-6 text-center animate-fadeIn py-4">

            <!-- Pastille de succès animée -->
            <div class="mx-auto w-16 h-16 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-3xl shadow-md">
              <mb-icon name="check-circle"></mb-icon>
            </div>

            <!-- Titre et sous-titre -->
            <div class="space-y-2 max-w-md mx-auto">
              <span class="px-3 py-1 rounded-full text-xs font-black bg-[#EDE9FE] text-[#6D28D9]">
                {{ getProfileBadge() }} activé
              </span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0F1035] tracking-tight">
                Bienvenue, {{ firstName }} !
              </h2>
              <p class="text-xs sm:text-sm text-[#555A8A] leading-relaxed">
                {{ getConfirmationMessage() }}
              </p>
            </div>

            <!-- Récapitulatif visuel du compte créé -->
            <div class="max-w-md mx-auto bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-left space-y-2 text-xs">
              <div class="flex items-center justify-between text-[#64748B]">
                <span>Adresse email</span>
                <span class="font-bold text-[#0F1035]">{{ email }}</span>
              </div>
              <div class="flex items-center justify-between text-[#64748B]">
                <span>Espace</span>
                <span class="font-bold text-[#7C3AED]">{{ getProfileBadge() }}</span>
              </div>
              <div *ngIf="selectedProfile === 'SUPPORTED' && invitationCode" class="flex items-center justify-between text-[#64748B]">
                <span>Code dossier</span>
                <span class="font-mono font-bold text-green-700">{{ invitationCode }}</span>
              </div>
              <div *ngIf="selectedProfile === 'COUNSELOR' && organization" class="flex items-center justify-between text-[#64748B]">
                <span>Structure</span>
                <span class="font-bold text-[#0F1035]">{{ organization }}</span>
              </div>
            </div>

            <!-- Bouton direct pour entrer dans l'application -->
            <div class="max-w-md mx-auto pt-2">
              <button
                type="button"
                (click)="onEnterApp()"
                class="w-full rounded-full bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] text-white font-extrabold text-sm sm:text-base py-3.5 shadow-md hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>Accéder à mon espace</span>
                <span>→</span>
              </button>
            </div>

          </div>

        </div>

        <!-- ============================================================== -->
        <!-- BAS DE COLONNE : LIEN CONNEXION & FOOTER DISCRET                -->
        <!-- ============================================================== -->
        <div class="w-full max-w-xl mx-auto pt-8 border-t border-[#F0EDFA] mt-6 space-y-4">

          <!-- Section "J'ai déjà un compte ?" comme sur la maquette -->
          <div *ngIf="currentStep === 1" class="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <span class="text-xs sm:text-sm font-semibold text-[#555A8A]">
              J'ai déjà un compte ?
            </span>
            <button
              type="button"
              (click)="onGoToLogin()"
              class="px-4 py-2 rounded-xl border border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-2xs"
            >
              <mb-icon name="user"></mb-icon>
              <span>Me connecter</span>
            </button>
          </div>

          <!-- Footer Légal très discret (WCAG AA) -->
          <div class="flex items-center justify-center gap-4 text-[11px] text-[#64748B] flex-wrap pt-2">
            <a href="javascript:void(0)" class="hover:text-[#7C3AED] transition flex items-center gap-1">
              <mb-icon name="shield"></mb-icon>
              <span>Politique de confidentialité</span>
            </a>
            <span>•</span>
            <a href="javascript:void(0)" class="hover:text-[#7C3AED] transition flex items-center gap-1">
              <mb-icon name="file-text"></mb-icon>
              <span>Conditions d'utilisation</span>
            </a>
            <span>•</span>
            <a href="javascript:void(0)" class="hover:text-[#7C3AED] transition flex items-center gap-1">
              <mb-icon name="circle-help"></mb-icon>
              <span>Aide</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out forwards;
    }
  `]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  @Output() goToLogin = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<RegisterSuccessEvent>();

  currentStep: 1 | 2 | 3 = 1;
  selectedProfile: RegisterProfileType = 'AUTONOMOUS';

  // Champs de saisie
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  acceptTerms: boolean = true;

  // Profil spécifique Jeune Accompagné
  invitationCode: string = '';

  // Profil spécifique Conseiller
  organization: string = 'CIO Nice Centre';
  counselorKey: string = '';

  isLoading: boolean = false;
  errorMessage: string | null = null;

  selectProfile(profile: RegisterProfileType): void {
    this.selectedProfile = profile;
    this.errorMessage = null;

    // Pré-remplissage pertinent pour test fluide
    if (profile === 'AUTONOMOUS') {
      this.firstName = 'Lucas';
      this.lastName = 'Moreau';
      this.email = 'lucas.moreau@exemple.fr';
      this.password = 'MonBilan2026!';
    } else if (profile === 'SUPPORTED') {
      this.firstName = 'Emma';
      this.lastName = 'Dubois';
      this.email = 'emma.d@monbilan.fr';
      this.invitationCode = 'CIO-NICE-2026';
      this.password = 'MonBilan2026!';
    } else {
      this.firstName = 'Sophie';
      this.lastName = 'Martin';
      this.email = 'sophie.martin@centre-des-possibles.fr';
      this.organization = 'CIO Nice Centre';
      this.counselorKey = 'CONSEILLER-PRO-06';
      this.password = 'Conseiller2026!';
    }

    this.currentStep = 2;
  }

  getProfileBadge(): string {
    switch (this.selectedProfile) {
      case 'AUTONOMOUS': return 'Jeune autonome';
      case 'SUPPORTED': return 'Jeune accompagné';
      case 'COUNSELOR': return 'Conseiller';
    }
  }

  getStep2Title(): string {
    switch (this.selectedProfile) {
      case 'AUTONOMOUS': return 'Création de ton compte autonome';
      case 'SUPPORTED': return 'Activation de ton compte accompagné';
      case 'COUNSELOR': return 'Activation de votre espace pro';
    }
  }

  getStep2Subtitle(): string {
    switch (this.selectedProfile) {
      case 'AUTONOMOUS': return 'Commence ton parcours d\'exploration en toute liberté.';
      case 'SUPPORTED': return 'Relie ton compte au bilan transmis par ta structure.';
      case 'COUNSELOR': return 'Sécurisez l\'accès aux dossiers de vos jeunes accompagnés.';
    }
  }

  getSubmitButtonText(): string {
    switch (this.selectedProfile) {
      case 'AUTONOMOUS': return 'Créer mon compte et explorer';
      case 'SUPPORTED': return 'Activer mon compte accompagné';
      case 'COUNSELOR': return 'Vérifier et activer mon accès';
    }
  }

  getConfirmationMessage(): string {
    switch (this.selectedProfile) {
      case 'AUTONOMOUS':
        return 'Ton compte autonome est prêt ! Explore dès maintenant les 22 métiers d\'avenir, teste le simulateur d\'immersion et utilise ton Coach IA.';
      case 'SUPPORTED':
        return 'Ton compte a été relié avec succès au dossier préparé par ton conseiller. Retrouve tes faits révisés, ton bilan et tes actions.';
      case 'COUNSELOR':
        return 'Votre compte conseiller est vérifié et activé. Accédez à votre tableau de bord, à la gestion de vos jeunes et à l\'outil de restitution.';
    }
  }

  fillDemoCode(): void {
    this.invitationCode = 'CIO-NICE-2026';
  }

  fillDemoCounselorKey(): void {
    this.counselorKey = 'CONSEILLER-PRO-06';
  }

  isStep2Valid(): boolean {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.acceptTerms) {
      return false;
    }
    if (this.selectedProfile === 'SUPPORTED' && !this.invitationCode) {
      return false;
    }
    if (this.selectedProfile === 'COUNSELOR' && (!this.organization || !this.counselorKey)) {
      return false;
    }
    return true;
  }

  async onSubmitStep2(): Promise<void> {
    if (!this.isStep2Valid()) {
      this.errorMessage = 'Merci de compléter tous les champs requis.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const isCounselor = this.selectedProfile === 'COUNSELOR';
      const role = isCounselor ? 'COUNSELOR' : 'YOUNG';
      const mode = this.selectedProfile === 'SUPPORTED' ? 'SUPPORTED' : 'AUTONOMOUS';

      await this.authService.register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        role,
        mode,
        invitationCode: this.invitationCode,
        organization: this.organization,
        counselorKey: this.counselorKey
      });

      this.isLoading = false;
      this.currentStep = 3;
    } catch (err: any) {
      this.isLoading = false;
      this.errorMessage = err.message || 'Erreur lors de l\'inscription.';
    }
  }

  onEnterApp(): void {
    const isCounselor = this.selectedProfile === 'COUNSELOR';
    const role = isCounselor ? 'COUNSELOR' : 'YOUNG';
    const mode = this.selectedProfile === 'SUPPORTED' ? 'SUPPORTED' : 'AUTONOMOUS';
    const displayName = `${this.firstName} ${this.lastName}`.trim();

    this.registerSuccess.emit({
      role,
      mode,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      displayName,
      invitationCode: this.invitationCode,
      organization: this.organization
    });
  }

  onGoToLogin(): void {
    this.goToLogin.emit();
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}
