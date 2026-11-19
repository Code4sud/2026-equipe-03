import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
}

export type SettingsTab = 'PROFILE' | 'SECURITY' | 'NOTIFICATIONS' | 'PREFERENCES' | 'PRIVACY';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-14">
      <!-- ================================================================== -->
      <!-- 5 ONGLETS DE NAVIGATION HORIZONTALE (Pillules blanches / violettes)-->
      <!-- ================================================================== -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <!-- 1. Mon profil -->
        <button
          type="button"
          (click)="activeTab = 'PROFILE'"
          [ngClass]="activeTab === 'PROFILE'
            ? 'bg-[#7C3AED] text-white shadow-md font-black ring-2 ring-[#7C3AED]/20'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-bold'"
          class="flex items-center justify-center gap-2 rounded-2xl px-3 sm:px-4 py-3 text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="truncate">Mon profil</span>
        </button>

        <!-- 2. Sécurité -->
        <button
          type="button"
          (click)="activeTab = 'SECURITY'"
          [ngClass]="activeTab === 'SECURITY'
            ? 'bg-[#7C3AED] text-white shadow-md font-black ring-2 ring-[#7C3AED]/20'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-bold'"
          class="flex items-center justify-center gap-2 rounded-2xl px-3 sm:px-4 py-3 text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span class="truncate">Sécurité</span>
        </button>

        <!-- 3. Notifications -->
        <button
          type="button"
          (click)="activeTab = 'NOTIFICATIONS'"
          [ngClass]="activeTab === 'NOTIFICATIONS'
            ? 'bg-[#7C3AED] text-white shadow-md font-black ring-2 ring-[#7C3AED]/20'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-bold'"
          class="flex items-center justify-center gap-2 rounded-2xl px-3 sm:px-4 py-3 text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="truncate">Notifications</span>
        </button>

        <!-- 4. Préférences -->
        <button
          type="button"
          (click)="activeTab = 'PREFERENCES'"
          [ngClass]="activeTab === 'PREFERENCES'
            ? 'bg-[#7C3AED] text-white shadow-md font-black ring-2 ring-[#7C3AED]/20'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-bold'"
          class="flex items-center justify-center gap-2 rounded-2xl px-3 sm:px-4 py-3 text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <span class="truncate">Préférences</span>
        </button>

        <!-- 5. Confidentialité -->
        <button
          type="button"
          (click)="activeTab = 'PRIVACY'"
          [ngClass]="activeTab === 'PRIVACY'
            ? 'bg-[#7C3AED] text-white shadow-md font-black ring-2 ring-[#7C3AED]/20'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-bold'"
          class="flex items-center justify-center gap-2 rounded-2xl px-3 sm:px-4 py-3 text-xs sm:text-sm transition-all shadow-xs cursor-pointer col-span-2 sm:col-span-1"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span class="truncate">Confidentialité</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- GRILLE PRINCIPALE (Col Gauche 8 cols / Col Droite Raccourcis 4)    -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- ================================================================ -->
        <!-- COLONNE GAUCHE (8 Cols) : Contenu de l'onglet actif              -->
        <!-- ================================================================ -->
        <div class="lg:col-span-8 space-y-6">
          <!-- ============================================================== -->
          <!-- ONGLET 1 : MON PROFIL                                          -->
          <!-- ============================================================== -->
          <div *ngIf="activeTab === 'PROFILE'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <svg class="h-5 w-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Mon profil</h3>
            </div>

            <!-- Bloc Photo + Identité + Actions d'image -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <!-- Avatar Rond Grand Format avec bouton caméra -->
              <div class="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-white shadow-md ring-4 ring-purple-100 bg-purple-50 flex items-center justify-center shrink-0">
                <img
                  *ngIf="photoUrl"
                  [src]="photoUrl"
                  [alt]="firstName + ' ' + lastName"
                  class="h-full w-full object-cover"
                  (error)="onImgError()"
                />
                <span *ngIf="!photoUrl" class="text-3xl font-black text-[#7C3AED]">
                  {{ getInitials() }}
                </span>

                <!-- Bouton Badge Caméra -->
                <button
                  type="button"
                  (click)="fileInput.click()"
                  class="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs shadow-md border-2 border-white hover:bg-[#6D28D9] transition cursor-pointer"
                  title="Modifier ma photo"
                  aria-label="Modifier ma photo"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <!-- Input fichier masqué -->
              <input
                #fileInput
                type="file"
                accept="image/png,image/jpeg,image/webp"
                class="hidden"
                (change)="onFileSelected($event)"
              />

              <!-- Nom, Badge Espace Jeune, Référence Dossier & Boutons -->
              <div class="flex-1 space-y-3 text-center sm:text-left">
                <div class="space-y-1.5">
                  <h4 class="text-2xl font-black text-[#0F1035] leading-tight">
                    {{ firstName }} {{ lastName }}
                  </h4>

                  <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-[#F3E8FF] text-[#6D28D9] border border-[#E9D5FF] px-3 py-0.5 text-xs font-bold">
                      <span class="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
                      Espace Jeune
                    </span>
                    <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                      <span>📁</span>
                      <span>Dossier Rdv {{ rdvNumber }}</span>
                    </span>
                  </div>
                </div>

                <!-- Boutons : Modifier ma photo + Recadrer -->
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  <button
                    type="button"
                    (click)="fileInput.click()"
                    class="rounded-full border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 font-black text-xs px-4 py-2 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    <span>Modifier ma photo</span>
                  </button>

                  <button
                    type="button"
                    (click)="openCropModal()"
                    class="rounded-full border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-bold text-xs px-4 py-2 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>⛶</span>
                    <span>Recadrer</span>
                  </button>

                  <button
                    *ngIf="photoUrl"
                    type="button"
                    (click)="removePhoto()"
                    class="text-xs font-semibold text-rose-600 hover:underline px-2 py-1 cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <!-- Formulaire Prénom & Nom affiché -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs font-black text-[#0F1035] mb-1.5">
                  Prénom <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="firstName"
                  (ngModelChange)="onFieldChange()"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] px-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition"
                  placeholder="Emma"
                />
              </div>

              <div>
                <label class="block text-xs font-black text-[#0F1035] mb-1.5">
                  Nom affiché <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="lastName"
                  (ngModelChange)="onFieldChange()"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] px-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition"
                  placeholder="D."
                />
              </div>
            </div>

            <!-- Adresse email avec bouton Modifier ouvrant la modale dédiée -->
            <div>
              <label class="block text-xs font-black text-[#0F1035] mb-1.5">
                Adresse email <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    [value]="email"
                    readonly
                    class="w-full rounded-2xl bg-gray-50 border border-[#E4E0F5] pl-11 pr-4 py-3 text-sm font-semibold text-[#0F1035] cursor-default select-all"
                  />
                </div>

                <button
                  type="button"
                  (click)="openEmailModal()"
                  class="rounded-2xl border border-gray-300 hover:border-[#7C3AED] bg-white text-gray-800 hover:text-[#7C3AED] font-black text-xs px-4 py-3 transition flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Modifier</span>
                </button>
              </div>
            </div>

            <!-- Bloc Mon accompagnement (Lecture seule, sécurisé) -->
            <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
              <div class="flex items-start sm:items-center gap-3.5">
                <div class="h-10 w-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h5 class="text-sm font-black text-[#0F1035]">Mon accompagnement</h5>
                  <p class="text-xs font-bold text-gray-700 mt-0.5">
                    Centre des Possibles — Métropole Nice Côte d'Azur
                  </p>
                  <p class="text-[11px] text-gray-400 mt-0.5">
                    Dossier Rdv {{ rdvNumber }} • Accompagnement par un professionnel
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                <span class="rounded-full bg-white border border-gray-200 text-gray-500 px-2.5 py-1 text-[11px] font-bold flex items-center gap-1">
                  <span>🔒</span>
                  <span>Non modifiable</span>
                </span>
              </div>
            </div>

            <!-- Bouton Enregistrer les modifications + Badge confirmation -->
            <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                (click)="saveChanges()"
                [disabled]="isSaving || !hasUnsavedChanges"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-black text-xs sm:text-sm px-6 py-3 shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isSaving">✓</span>
                <span *ngIf="isSaving" class="inline-block animate-spin">⏳</span>
                <span>Enregistrer les modifications</span>
              </button>

              <span
                *ngIf="savedSuccess && !hasUnsavedChanges"
                class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 text-xs font-bold animate-fadeIn"
              >
                <span>✓</span>
                <span>Modifications enregistrées</span>
              </span>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- ONGLET 2 : SÉCURITÉ                                            -->
          <!-- ============================================================== -->
          <div *ngIf="activeTab === 'SECURITY'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <svg class="h-5 w-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Sécurité de ton compte</h3>
            </div>

            <div class="space-y-4">
              <h4 class="text-sm font-black text-[#0F1035]">Modifier mon mot de passe</h4>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  [(ngModel)]="currentPassword"
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#7C3AED]"
                  placeholder="••••••••"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    [(ngModel)]="newPassword"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#7C3AED]"
                    placeholder="Min. 8 caractères"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    [(ngModel)]="confirmPassword"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#7C3AED]"
                    placeholder="Confirme ton mot de passe"
                  />
                </div>
              </div>

              <button
                type="button"
                (click)="changePassword()"
                class="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 text-xs font-black shadow-sm transition"
              >
                Mettre à jour mon mot de passe
              </button>

              <div *ngIf="passwordMsg" class="rounded-xl p-3 text-xs font-bold" [ngClass]="passwordSuccess ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'">
                {{ passwordMsg }}
              </div>
            </div>

            <!-- Sessions et appareils -->
            <div class="border-t pt-5 border-gray-100 space-y-3">
              <h4 class="text-sm font-black text-[#0F1035]">Sessions actives</h4>
              <div class="rounded-2xl bg-gray-50 border border-gray-200 p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xl">💻</span>
                  <div>
                    <p class="text-xs font-bold text-gray-900">Navigateur Web (Session actuelle)</p>
                    <p class="text-[11px] text-gray-500">Connecté depuis Nice, France • IP sécurisée</p>
                  </div>
                </div>
                <span class="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">Actif</span>
              </div>

              <button
                type="button"
                (click)="logout.emit()"
                class="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1.5"
              >
                <span>🚪</span>
                <span>Se déconnecter de tous les appareils</span>
              </button>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- ONGLET 3 : NOTIFICATIONS                                       -->
          <!-- ============================================================== -->
          <div *ngIf="activeTab === 'NOTIFICATIONS'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <svg class="h-5 w-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Mes notifications</h3>
            </div>

            <p class="text-xs text-gray-500">
              Choisis les alertes et rappels que tu souhaites recevoir pour ton accompagnement.
            </p>

            <div class="space-y-4">
              <!-- 1. Réponses du conseiller -->
              <label class="flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                <div class="pr-4">
                  <span class="text-xs font-bold text-gray-900">Nouvelle réponse du conseiller</span>
                  <p class="text-[11px] text-gray-500">Être notifiée quand Sophie M. répond à l’une de tes questions.</p>
                </div>
                <input
                  type="checkbox"
                  [(ngModel)]="notifCounselorReply"
                  (ngModelChange)="persistNotifPrefs()"
                  class="h-5 w-5 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                />
              </label>

              <!-- 2. Document publié -->
              <label class="flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                <div class="pr-4">
                  <span class="text-xs font-bold text-gray-900">Document ou synthèse validée</span>
                  <p class="text-[11px] text-gray-500">Alerte lors de la mise à disposition d'un nouveau document dans ta bibliothèque.</p>
                </div>
                <input
                  type="checkbox"
                  [(ngModel)]="notifDocPublished"
                  (ngModelChange)="persistNotifPrefs()"
                  class="h-5 w-5 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                />
              </label>

              <!-- 3. Rappels de rendez-vous -->
              <label class="flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                <div class="pr-4">
                  <span class="text-xs font-bold text-gray-900">Rappels avant rendez-vous</span>
                  <p class="text-[11px] text-gray-500">Recevoir un rappel 24h avant ton entretien au Centre des Possibles.</p>
                </div>
                <input
                  type="checkbox"
                  [(ngModel)]="notifAppointments"
                  (ngModelChange)="persistNotifPrefs()"
                  class="h-5 w-5 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                />
              </label>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- ONGLET 4 : PRÉFÉRENCES (Accessibilité & Audio)                  -->
          <!-- ============================================================== -->
          <div *ngIf="activeTab === 'PREFERENCES'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <svg class="h-5 w-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Accessibilité et préférences</h3>
            </div>

            <!-- Vitesse de lecture audio -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-black text-gray-900">Vitesse de lecture audio préférée</h4>
                  <p class="text-[11px] text-gray-500">Pour l'écoute vocale de ton bilan d'orientation</p>
                </div>
                <span class="rounded-full bg-purple-100 text-[#7C3AED] px-3 py-1 text-xs font-black">
                  {{ speechRate }}x
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  *ngFor="let rate of [0.8, 1.0, 1.2, 1.4]"
                  type="button"
                  (click)="updateSpeechRate(rate)"
                  [ngClass]="speechRate === rate ? 'bg-[#7C3AED] text-white font-black' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold'"
                  class="rounded-xl px-4 py-2 text-xs transition"
                >
                  {{ rate }}x
                </button>
              </div>
            </div>

            <!-- Taille du texte -->
            <div class="border-t pt-4 border-gray-100 space-y-3">
              <h4 class="text-xs font-black text-gray-900">Taille du texte</h4>
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  (click)="setTextSize('STANDARD')"
                  [ngClass]="textSize === 'STANDARD' ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED] font-black' : 'border-gray-200 text-gray-700 font-bold'"
                  class="rounded-xl border p-3 text-xs text-center transition"
                >
                  Standard
                </button>
                <button
                  type="button"
                  (click)="setTextSize('LARGE')"
                  [ngClass]="textSize === 'LARGE' ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED] font-black' : 'border-gray-200 text-gray-700 font-bold'"
                  class="rounded-xl border p-3 text-xs text-center transition"
                >
                  Agrandie (+15%)
                </button>
                <button
                  type="button"
                  (click)="setTextSize('XL')"
                  [ngClass]="textSize === 'XL' ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED] font-black' : 'border-gray-200 text-gray-700 font-bold'"
                  class="rounded-xl border p-3 text-xs text-center transition"
                >
                  Très grande (+30%)
                </button>
              </div>
            </div>

            <!-- Contraste renforcé & Animations -->
            <div class="border-t pt-4 border-gray-100 space-y-3">
              <label class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div>
                  <span class="text-xs font-bold text-gray-900">Contraste renforcé (WCAG AAA)</span>
                  <p class="text-[11px] text-gray-500">Accentue les bordures et les contrastes de texte.</p>
                </div>
                <input
                  type="checkbox"
                  [(ngModel)]="highContrast"
                  (ngModelChange)="toggleHighContrast()"
                  class="h-5 w-5 rounded text-[#7C3AED]"
                />
              </label>

              <label class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div>
                  <span class="text-xs font-bold text-gray-900">Réduire les animations</span>
                  <p class="text-[11px] text-gray-500">Désactive les transitions et mouvements visuels.</p>
                </div>
                <input
                  type="checkbox"
                  [(ngModel)]="reducedMotion"
                  (ngModelChange)="toggleReducedMotion()"
                  class="h-5 w-5 rounded text-[#7C3AED]"
                />
              </label>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- ONGLET 5 : CONFIDENTIALITÉ                                     -->
          <!-- ============================================================== -->
          <div *ngIf="activeTab === 'PRIVACY'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <svg class="h-5 w-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Confidentialité et données</h3>
            </div>

            <div class="rounded-2xl bg-purple-50/70 border border-purple-200 p-4 text-xs text-[#5B21B6] space-y-2">
              <p class="font-bold">🛡️ Engagement Souveraineté & RGPD Région Sud</p>
              <p class="text-[11px] leading-relaxed">
                Toutes tes données sont hébergées en France de façon chiffrée. Seuls ton conseiller référent et toi y ont accès. Tu conserves la pleine propriété de tes bilans et notes.
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 rounded-2xl border border-gray-200">
                <div>
                  <h5 class="text-xs font-black text-gray-900">Télécharger mes données (Export RGPD)</h5>
                  <p class="text-[11px] text-gray-500">Récupère une archive JSON contenant ton profil, tes questions et tes bilans.</p>
                </div>
                <button
                  type="button"
                  (click)="exportMyData()"
                  class="rounded-xl border border-gray-300 hover:border-[#7C3AED] px-4 py-2 text-xs font-black text-gray-700 hover:text-[#7C3AED] transition"
                >
                  Télécharger
                </button>
              </div>

              <div class="flex items-center justify-between p-4 rounded-2xl border border-rose-200 bg-rose-50/30">
                <div>
                  <h5 class="text-xs font-black text-rose-700">Suppression de mon compte</h5>
                  <p class="text-[11px] text-gray-500">Demande l'effacement de tes données personnelles conformément au RGPD.</p>
                </div>
                <button
                  type="button"
                  (click)="requestAccountDeletion()"
                  class="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-black transition"
                >
                  Demander l'effacement
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================ -->
        <!-- COLONNE DROITE (4 Cols) : 4 Cartes Raccourcis vers autres rubriques-->
        <!-- ================================================================ -->
        <div class="lg:col-span-4 space-y-3.5">
          <!-- 1. Sécurité de ton compte -->
          <div
            (click)="activeTab = 'SECURITY'"
            [ngClass]="activeTab === 'SECURITY' ? 'ring-2 ring-[#7C3AED] bg-purple-50/50' : 'bg-white hover:bg-purple-50/30'"
            class="rounded-[24px] border border-[#E4E0F5] p-5 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="h-10 w-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-black text-[#0F1035] group-hover:text-[#7C3AED] transition">Sécurité de ton compte</h4>
                <p class="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                  Modifie ton mot de passe et gère tes sessions de connexion.
                </p>
              </div>
            </div>
            <span class="text-gray-400 group-hover:text-[#7C3AED] font-black transition">›</span>
          </div>

          <!-- 2. Mes notifications -->
          <div
            (click)="activeTab = 'NOTIFICATIONS'"
            [ngClass]="activeTab === 'NOTIFICATIONS' ? 'ring-2 ring-[#7C3AED] bg-purple-50/50' : 'bg-white hover:bg-purple-50/30'"
            class="rounded-[24px] border border-[#E4E0F5] p-5 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="h-10 w-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-black text-[#0F1035] group-hover:text-[#7C3AED] transition">Mes notifications</h4>
                <p class="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                  Choisis les alertes et rappels que tu souhaites recevoir.
                </p>
              </div>
            </div>
            <span class="text-gray-400 group-hover:text-[#7C3AED] font-black transition">›</span>
          </div>

          <!-- 3. Accessibilité et préférences -->
          <div
            (click)="activeTab = 'PREFERENCES'"
            [ngClass]="activeTab === 'PREFERENCES' ? 'ring-2 ring-[#7C3AED] bg-purple-50/50' : 'bg-white hover:bg-purple-50/30'"
            class="rounded-[24px] border border-[#E4E0F5] p-5 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="h-10 w-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-black text-[#0F1035] group-hover:text-[#7C3AED] transition">Accessibilité et préférences</h4>
                <p class="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                  Adapte l'affichage, la taille du texte et les options de lecture.
                </p>
              </div>
            </div>
            <span class="text-gray-400 group-hover:text-[#7C3AED] font-black transition">›</span>
          </div>

          <!-- 4. Confidentialité et données -->
          <div
            (click)="activeTab = 'PRIVACY'"
            [ngClass]="activeTab === 'PRIVACY' ? 'ring-2 ring-[#7C3AED] bg-purple-50/50' : 'bg-white hover:bg-purple-50/30'"
            class="rounded-[24px] border border-[#E4E0F5] p-5 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="h-10 w-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-black text-[#0F1035] group-hover:text-[#7C3AED] transition">Confidentialité et données</h4>
                <p class="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                  Consulte tes données, gère les partages et exerce tes droits.
                </p>
              </div>
            </div>
            <span class="text-gray-400 group-hover:text-[#7C3AED] font-black transition">›</span>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE MODIFICATION EMAIL SÉCURISÉE                                -->
      <!-- ================================================================== -->
      <div
        *ngIf="isEmailModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        (click)="closeEmailModal()"
      >
        <div
          class="relative w-full max-w-md rounded-[28px] bg-white shadow-2xl p-6 sm:p-7 space-y-5"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between border-b pb-3 border-gray-100">
            <h3 class="font-black text-base text-[#0F1035]">Modifier mon adresse email</h3>
            <button
              type="button"
              (click)="closeEmailModal()"
              class="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-1">Adresse email actuelle</label>
              <input
                type="text"
                [value]="email"
                readonly
                class="w-full rounded-xl bg-gray-100 border border-gray-200 px-3.5 py-2.5 text-xs font-semibold text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-gray-800 mb-1">Nouvelle adresse email</label>
              <input
                type="email"
                [(ngModel)]="newEmailInput"
                class="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#7C3AED]"
                placeholder="nouvelle.adresse@exemple.fr"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-gray-800 mb-1">Mot de passe de confirmation</label>
              <input
                type="password"
                [(ngModel)]="emailConfirmPassword"
                class="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#7C3AED]"
                placeholder="••••••••"
              />
            </div>

            <div *ngIf="emailModalError" class="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 p-2.5 text-xs font-bold">
              {{ emailModalError }}
            </div>

            <div *ngIf="emailModalSuccess" class="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 p-2.5 text-xs font-bold">
              Un email de confirmation a été envoyé à {{ newEmailInput }}. Veuillez vérifier votre boîte.
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              (click)="closeEmailModal()"
              class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="confirmEmailChange()"
              class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2 text-xs font-black shadow-sm"
            >
              Valider le changement
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE RECADRAGE PHOTO AVEC ZOOM ET ROTATION                      -->
      <!-- ================================================================== -->
      <div
        *ngIf="isCropModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        (click)="closeCropModal()"
      >
        <div
          class="relative w-full max-w-md rounded-[28px] bg-white shadow-2xl p-6 sm:p-7 space-y-5"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between border-b pb-3 border-gray-100">
            <h3 class="font-black text-base text-[#0F1035]">Recadrer la photo</h3>
            <button
              type="button"
              (click)="closeCropModal()"
              class="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <!-- Zone de prévisualisation circulaire -->
          <div class="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl">
            <div class="relative h-44 w-44 rounded-full overflow-hidden border-4 border-[#7C3AED] shadow-inner bg-purple-100 flex items-center justify-center">
              <img
                *ngIf="photoUrl"
                [src]="photoUrl"
                alt="Aperçu recadrage"
                [style.transform]="'scale(' + cropZoom / 100 + ')'"
                class="h-full w-full object-cover transition-transform duration-100"
              />
              <span *ngIf="!photoUrl" class="text-3xl font-black text-[#7C3AED]">{{ getInitials() }}</span>
            </div>

            <!-- Curseur de zoom -->
            <div class="w-full max-w-xs mt-5 space-y-1">
              <div class="flex items-center justify-between text-xs font-bold text-gray-600">
                <span>Zoom</span>
                <span>{{ cropZoom }}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="200"
                step="5"
                [(ngModel)]="cropZoom"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              (click)="closeCropModal()"
              class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="applyCrop()"
              class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2 text-xs font-black shadow-sm"
            >
              Appliquer le recadrage
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  @Input() firstName = 'Emma';
  @Input() lastName = 'D.';
  @Input() email = 'emma.d@monbilan.fr';
  @Input() speechRate = 1.0;
  @Input() photoUrl = '';
  @Input() rdvNumber = '2187';

  @Output() photoChange = new EventEmitter<string>();
  @Output() profileSave = new EventEmitter<UserProfileData>();
  @Output() speechRateChange = new EventEmitter<number>();
  @Output() logout = new EventEmitter<void>();

  activeTab: SettingsTab = 'PROFILE';

  // Détection des modifications
  initialFirstName = '';
  initialLastName = '';
  hasUnsavedChanges = false;
  isSaving = false;
  savedSuccess = false;

  // Sécurité (Mot de passe)
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordMsg = '';
  passwordSuccess = false;

  // Notifications
  notifCounselorReply = true;
  notifDocPublished = true;
  notifAppointments = true;

  // Préférences & Accessibilité
  textSize: 'STANDARD' | 'LARGE' | 'XL' = 'STANDARD';
  highContrast = false;
  reducedMotion = false;

  // Modale Email
  isEmailModalOpen = false;
  newEmailInput = '';
  emailConfirmPassword = '';
  emailModalError = '';
  emailModalSuccess = false;

  // Modale Recadrage
  isCropModalOpen = false;
  cropZoom = 100;

  ngOnInit(): void {
    this.initialFirstName = this.firstName;
    this.initialLastName = this.lastName;
    this.loadPersistedPreferences();
  }

  getInitials(): string {
    const f = this.firstName ? this.firstName.charAt(0).toUpperCase() : '';
    const l = this.lastName ? this.lastName.charAt(0).toUpperCase() : '';
    return f + l || 'ED';
  }

  onImgError(): void {
    this.photoUrl = '';
  }

  onFieldChange(): void {
    this.hasUnsavedChanges =
      this.firstName !== this.initialFirstName ||
      this.lastName !== this.initialLastName;
    this.savedSuccess = false;
  }

  saveChanges(): void {
    if (!this.hasUnsavedChanges) return;

    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.savedSuccess = true;
      this.initialFirstName = this.firstName;
      this.initialLastName = this.lastName;
      this.hasUnsavedChanges = false;

      this.profileSave.emit({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        photoUrl: this.photoUrl
      });
    }, 400);
  }

  // Gestion Photo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Veuillez sélectionner un fichier image valide (PNG, JPEG ou WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoUrl = e.target?.result as string;
        this.photoChange.emit(this.photoUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.photoUrl = '';
    this.photoChange.emit('');
  }

  openCropModal(): void {
    this.cropZoom = 100;
    this.isCropModalOpen = true;
  }

  closeCropModal(): void {
    this.isCropModalOpen = false;
  }

  applyCrop(): void {
    this.isCropModalOpen = false;
  }

  // Modale Email
  openEmailModal(): void {
    this.newEmailInput = '';
    this.emailConfirmPassword = '';
    this.emailModalError = '';
    this.emailModalSuccess = false;
    this.isEmailModalOpen = true;
  }

  closeEmailModal(): void {
    this.isEmailModalOpen = false;
  }

  confirmEmailChange(): void {
    if (!this.newEmailInput || !this.newEmailInput.includes('@')) {
      this.emailModalError = 'Veuillez saisir une adresse email valide.';
      return;
    }
    if (!this.emailConfirmPassword) {
      this.emailModalError = 'Veuillez renseigner votre mot de passe pour confirmer.';
      return;
    }

    this.emailModalError = '';
    this.emailModalSuccess = true;
    setTimeout(() => {
      this.email = this.newEmailInput;
      this.isEmailModalOpen = false;
      this.profileSave.emit({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        photoUrl: this.photoUrl
      });
    }, 1200);
  }

  // Sécurité (Mot de passe)
  changePassword(): void {
    if (!this.currentPassword) {
      this.passwordSuccess = false;
      this.passwordMsg = 'Veuillez indiquer votre mot de passe actuel.';
      return;
    }
    if (!this.newPassword || this.newPassword.length < 8) {
      this.passwordSuccess = false;
      this.passwordMsg = 'Le nouveau mot de passe doit comporter au moins 8 caractères.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordSuccess = false;
      this.passwordMsg = 'Les deux mots de passe ne correspondent pas.';
      return;
    }

    this.passwordSuccess = true;
    this.passwordMsg = 'Votre mot de passe a été mis à jour avec succès.';
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  // Notifications
  persistNotifPrefs(): void {
    try {
      localStorage.setItem('mb_notifs', JSON.stringify({
        counselor: this.notifCounselorReply,
        docs: this.notifDocPublished,
        appointments: this.notifAppointments
      }));
    } catch {}
  }

  // Préférences & Accessibilité
  updateSpeechRate(rate: number): void {
    this.speechRate = rate;
    this.speechRateChange.emit(rate);
  }

  setTextSize(size: 'STANDARD' | 'LARGE' | 'XL'): void {
    this.textSize = size;
    try {
      localStorage.setItem('mb_text_size', size);
    } catch {}
  }

  toggleHighContrast(): void {
    try {
      localStorage.setItem('mb_high_contrast', String(this.highContrast));
    } catch {}
  }

  toggleReducedMotion(): void {
    try {
      localStorage.setItem('mb_reduced_motion', String(this.reducedMotion));
    } catch {}
  }

  private loadPersistedPreferences(): void {
    try {
      const savedNotifs = localStorage.getItem('mb_notifs');
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        this.notifCounselorReply = parsed.counselor ?? true;
        this.notifDocPublished = parsed.docs ?? true;
        this.notifAppointments = parsed.appointments ?? true;
      }
      const savedTextSize = localStorage.getItem('mb_text_size') as any;
      if (savedTextSize) this.textSize = savedTextSize;
      const savedContrast = localStorage.getItem('mb_high_contrast');
      if (savedContrast) this.highContrast = savedContrast === 'true';
      const savedMotion = localStorage.getItem('mb_reduced_motion');
      if (savedMotion) this.reducedMotion = savedMotion === 'true';
    } catch {}
  }

  // Confidentialité RGPD
  exportMyData(): void {
    const data = {
      profile: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        rdvCode: this.rdvNumber
      },
      establishment: 'Centre des Possibles — Métropole Nice Côte d\'Azur',
      counselor: 'Sophie Martin',
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Donnees_MonBilan_Rdv_${this.rdvNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  requestAccountDeletion(): void {
    const confirmed = confirm(
      'Attention : cette action transmettra une demande d\'effacement de vos données d\'orientation auprès de votre établissement (Centre des Possibles). Souhaitez-vous continuer ?'
    );
    if (confirmed) {
      alert('Votre demande d\'effacement a bien été prise en compte et transmise au délégué à la protection des données.');
    }
  }
}
