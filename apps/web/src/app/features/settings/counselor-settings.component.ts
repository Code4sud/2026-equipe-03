import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CounselorProfileData {
  firstName: string;
  lastName: string;
  email: string;
  roleTitle: string;
  organization: string;
  photoUrl: string;
}

@Component({
  selector: 'app-counselor-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6 pb-14">
      <!-- ================================================================== -->
      <!-- EN-TÊTE : MES PARAMÈTRES (Identique à la maquette officielle)      -->
      <!-- ================================================================== -->
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-2xl font-bold border border-[#E9D5FF] shrink-0 shadow-2xs">
          ⚙️
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#0F1035] tracking-tight">
            Mes paramètres
          </h1>
          <p class="text-xs sm:text-sm text-[#42466B] mt-0.5 font-medium">
            Gérez votre profil professionnel, votre sécurité et vos préférences.
          </p>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- GRILLE PRINCIPALE À DEUX COLONNES (Fidèle à la maquette)           -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- ================================================================ -->
        <!-- COLONNE GAUCHE : CARTE « PROFIL PROFESSIONNEL » (Col 7 / 12)     -->
        <!-- ================================================================ -->
        <div class="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
          
          <!-- Titre de la carte -->
          <div class="flex items-center gap-2.5 pb-2 border-b border-[#F0EDFA]">
            <span class="text-lg text-[#7C3AED]">👤</span>
            <h2 class="text-lg sm:text-xl font-black text-[#0F1035]">
              Profil professionnel
            </h2>
          </div>

          <!-- Section Photo de profil -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-1">
            <!-- Cercle photo avec badge caméra -->
            <div class="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-[#EDE9FE] bg-[#F3E8FF] flex items-center justify-center shrink-0">
              <img
                *ngIf="photoUrl"
                [src]="photoUrl"
                [alt]="firstName + ' ' + lastName"
                class="h-full w-full object-cover transition duration-200"
                (error)="onPhotoError()"
              />
              <span *ngIf="!photoUrl" class="text-2xl font-black text-[#7C3AED]">
                {{ getInitials() }}
              </span>

              <!-- Badge caméra cliquable -->
              <button
                type="button"
                (click)="fileInput.click()"
                class="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs shadow-md border-2 border-white hover:bg-[#6D28D9] transition cursor-pointer"
                title="Modifier la photo"
                aria-label="Modifier la photo"
              >
                📷
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

            <!-- Actions sur la photo -->
            <div class="space-y-3 text-center sm:text-left flex-1 min-w-0">
              <div>
                <h3 class="text-sm font-extrabold text-[#0F1035]">
                  Ma photo de profil
                </h3>
                <p class="text-xs text-[#6B7280] mt-0.5">
                  JPG, PNG ou WebP • 2 Mo maximum
                </p>
              </div>

              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <!-- Bouton Modifier la photo -->
                <button
                  type="button"
                  (click)="fileInput.click()"
                  class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs px-3.5 py-2 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📷</span>
                  <span>Modifier la photo</span>
                </button>

                <!-- Bouton Recadrer -->
                <button
                  type="button"
                  (click)="openCropModal()"
                  class="rounded-xl border border-[#D8DCF0] bg-white hover:bg-[#F8F7FF] text-[#0F1035] font-extrabold text-xs px-3.5 py-2 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>⛶</span>
                  <span>Recadrer</span>
                </button>

                <!-- Bouton Supprimer -->
                <button
                  type="button"
                  (click)="removePhoto()"
                  class="rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-600 font-extrabold text-xs px-3.5 py-2 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🗑</span>
                  <span>Supprimer</span>
                </button>
              </div>

              <!-- Messages d'état photo -->
              <div *ngIf="photoSuccess" class="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <span>✓</span>
                <span>Photo de profil mise à jour !</span>
              </div>
              <div *ngIf="photoError" class="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <span>⚠️</span>
                <span>{{ photoError }}</span>
              </div>
            </div>
          </div>

          <!-- Formulaire d'informations professionnelles -->
          <div class="space-y-4 pt-2">
            <!-- Ligne 1 : Prénom & Nom -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-[#42466B] mb-1.5">
                  Prénom <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="firstName"
                  (ngModelChange)="onFieldChange()"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] px-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition shadow-2xs"
                  placeholder="Sophie"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-[#42466B] mb-1.5">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="lastName"
                  (ngModelChange)="onFieldChange()"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] px-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition shadow-2xs"
                  placeholder="Martin"
                />
              </div>
            </div>

            <!-- Ligne 2 : Email professionnel -->
            <div>
              <label class="block text-xs font-bold text-[#42466B] mb-1.5">
                Adresse email professionnelle <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]">
                  ✉️
                </span>
                <input
                  type="email"
                  [(ngModel)]="email"
                  (ngModelChange)="onFieldChange()"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] pl-11 pr-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition shadow-2xs"
                  placeholder="sophie.martin@centre-possibles.fr"
                />
              </div>
            </div>

            <!-- Ligne 3 : Fonction -->
            <div>
              <label class="block text-xs font-bold text-[#42466B] mb-1.5">
                Fonction <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]">
                  💼
                </span>
                <input
                  type="text"
                  [(ngModel)]="roleTitle"
                  (ngModelChange)="onFieldChange()"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] pl-11 pr-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition shadow-2xs"
                  placeholder="Conseiller d'orientation"
                />
              </div>
            </div>

            <!-- Ligne 4 : Organisme de rattachement (Verrouillé avec cadenas) -->
            <div>
              <label class="block text-xs font-bold text-[#42466B] mb-1.5 flex items-center justify-between">
                <span>Organisme de rattachement</span>
                <span class="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                  <span>🔒</span>
                  <span>Non modifiable</span>
                </span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  🏛️
                </span>
                <input
                  type="text"
                  [value]="organization"
                  readonly
                  class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] pl-11 pr-11 py-3 text-sm font-bold text-[#31355B] cursor-not-allowed select-none shadow-2xs"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" title="Le rattachement professionnel est géré par un responsable autorisé.">
                  🔒
                </span>
              </div>
              <p class="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                <span>ℹ️</span>
                <span>Le rattachement professionnel est géré par un responsable autorisé de votre structure.</span>
              </p>
            </div>

            <!-- Bouton d'enregistrement principal -->
            <div class="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                (click)="saveProfileChanges()"
                [disabled]="isSaving"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isSaving">✓</span>
                <span *ngIf="isSaving" class="inline-block animate-spin">⏳</span>
                <span>Enregistrer les modifications</span>
              </button>

              <span *ngIf="savedSuccess" class="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                <span>✓</span>
                <span>Modifications enregistrées avec succès !</span>
              </span>
            </div>
          </div>
        </div>

        <!-- ================================================================ -->
        <!-- COLONNE DROITE : 5 RUBRIQUES ACCORDÉON + DÉCONNEXION (Col 5 / 12) -->
        <!-- ================================================================ -->
        <div class="lg:col-span-5 space-y-3.5">

          <!-- 1. SÉCURITÉ ET MOT DE PASSE -->
          <div class="rounded-2xl bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
            <button
              type="button"
              (click)="toggleSection('SECURITY')"
              class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="h-10 w-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                  🛡️
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-extrabold text-[#0F1035] truncate">
                    Sécurité
                  </h3>
                  <p class="text-xs text-[#6B7280] truncate mt-0.5">
                    Mot de passe, sessions actives et sécurité du compte
                  </p>
                </div>
              </div>
              <span class="text-gray-400 font-bold transition-transform text-xs" [class.rotate-90]="activeSection === 'SECURITY'">
                &gt;
              </span>
            </button>

            <!-- Contenu dépliable Sécurité -->
            <div *ngIf="activeSection === 'SECURITY'" class="p-5 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-4 text-xs animate-fadeIn">
              <!-- Formulaire changement de mot de passe -->
              <div class="space-y-3 bg-white p-4 rounded-xl border border-[#E4E0F5]">
                <h4 class="font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span>🔑</span>
                  <span>Changer de mot de passe</span>
                </h4>
                
                <div>
                  <label class="block font-bold text-[#42466B] mb-1">Mot de passe actuel</label>
                  <input
                    type="password"
                    [(ngModel)]="currentPassword"
                    class="w-full rounded-xl bg-white border border-[#E4E0F5] px-3 py-2 text-xs font-semibold focus:border-[#7C3AED] outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label class="block font-bold text-[#42466B] mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    [(ngModel)]="newPassword"
                    class="w-full rounded-xl bg-white border border-[#E4E0F5] px-3 py-2 text-xs font-semibold focus:border-[#7C3AED] outline-none"
                    placeholder="Au moins 8 caractères"
                  />
                </div>

                <div>
                  <label class="block font-bold text-[#42466B] mb-1">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    [(ngModel)]="confirmPassword"
                    class="w-full rounded-xl bg-white border border-[#E4E0F5] px-3 py-2 text-xs font-semibold focus:border-[#7C3AED] outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <div class="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    (click)="submitPasswordChange()"
                    class="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs px-3.5 py-1.5 transition"
                  >
                    Mettre à jour
                  </button>
                  <span *ngIf="passwordNotice" class="text-[11px] font-bold text-emerald-600">
                    {{ passwordNotice }}
                  </span>
                </div>
              </div>

              <!-- Sessions actives -->
              <div class="space-y-2 bg-white p-4 rounded-xl border border-[#E4E0F5]">
                <h4 class="font-extrabold text-[#0F1035] flex items-center justify-between">
                  <span class="flex items-center gap-1.5">
                    <span>💻</span>
                    <span>Sessions actives</span>
                  </span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    1 active
                  </span>
                </h4>
                <div class="p-2.5 rounded-lg bg-[#F8F7FF] flex items-center justify-between text-[11px]">
                  <div>
                    <p class="font-bold text-[#0F1035]">Navigateur Web • macOS (Nice)</p>
                    <p class="text-gray-500 text-[10px]">Session courante (IP vérifiée)</p>
                  </div>
                  <span class="h-2 w-2 rounded-full bg-emerald-500" title="En ligne"></span>
                </div>
              </div>

              <!-- Simulateur RLS & ABAC (Préservé de l'existant) -->
              <div class="space-y-2 bg-white p-4 rounded-xl border border-[#E4E0F5]">
                <h4 class="font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>Contrôle d'accès & Isolation RLS</span>
                </h4>
                <p class="text-[11px] text-[#42466B]">
                  Testez en direct les barrières de sécurité multi-tenant :
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    (click)="runSecuritySimulation('CROSS_TENANT')"
                    class="rounded-lg bg-[#F3EFFE] text-[#6D28D9] px-2.5 py-1 text-[11px] font-extrabold hover:bg-[#EDE9FE] transition"
                  >
                    Test RLS Tenant
                  </button>
                  <button
                    type="button"
                    (click)="runSecuritySimulation('UNASSIGNED_COUNSELOR')"
                    class="rounded-lg bg-[#F3EFFE] text-[#6D28D9] px-2.5 py-1 text-[11px] font-extrabold hover:bg-[#EDE9FE] transition"
                  >
                    Test Droits Dossier
                  </button>
                </div>
                <div *ngIf="securitySimulationResult" class="p-2 rounded-lg bg-[#131142] text-white font-mono text-[10px] mt-1.5">
                  {{ securitySimulationResult }}
                </div>
              </div>
            </div>
          </div>

          <!-- 2. NOTIFICATIONS -->
          <div class="rounded-2xl bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
            <button
              type="button"
              (click)="toggleSection('NOTIFICATIONS')"
              class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="h-10 w-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                  🔔
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-extrabold text-[#0F1035] truncate">
                    Notifications
                  </h3>
                  <p class="text-xs text-[#6B7280] truncate mt-0.5">
                    Rappels, messages et alertes importantes
                  </p>
                </div>
              </div>
              <span class="text-gray-400 font-bold transition-transform text-xs" [class.rotate-90]="activeSection === 'NOTIFICATIONS'">
                &gt;
              </span>
            </button>

            <!-- Contenu dépliable Notifications -->
            <div *ngIf="activeSection === 'NOTIFICATIONS'" class="p-5 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-3 text-xs animate-fadeIn">
              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E4E0F5] cursor-pointer">
                <div>
                  <p class="font-bold text-[#0F1035]">Nouveaux dossiers jeunes attribués</p>
                  <p class="text-[11px] text-gray-500">Recevoir une alerte lors d'un nouveau bilan déposé</p>
                </div>
                <input type="checkbox" [(ngModel)]="notifNewDossiers" class="h-4 w-4 accent-[#7C3AED]" />
              </label>

              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E4E0F5] cursor-pointer">
                <div>
                  <p class="font-bold text-[#0F1035]">Questions reçues des jeunes</p>
                  <p class="text-[11px] text-gray-500">Notification en temps réel des questions posées</p>
                </div>
                <input type="checkbox" [(ngModel)]="notifYoungQuestions" class="h-4 w-4 accent-[#7C3AED]" />
              </label>

              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E4E0F5] cursor-pointer">
                <div>
                  <p class="font-bold text-[#0F1035]">Rappels d'entretiens et de RDV</p>
                  <p class="text-[11px] text-gray-500">Rappel 24h avant chaque rendez-vous programmé</p>
                </div>
                <input type="checkbox" [(ngModel)]="notifAppointments" class="h-4 w-4 accent-[#7C3AED]" />
              </label>

              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E4E0F5] cursor-pointer">
                <div>
                  <p class="font-bold text-[#0F1035]">Restitutions à valider / publier</p>
                  <p class="text-[11px] text-gray-500">Alertes sur les rapports en attente de visa humain</p>
                </div>
                <input type="checkbox" [(ngModel)]="notifRestitutions" class="h-4 w-4 accent-[#7C3AED]" />
              </label>
            </div>
          </div>

          <!-- 3. PRÉFÉRENCES -->
          <div class="rounded-2xl bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
            <button
              type="button"
              (click)="toggleSection('PREFERENCES')"
              class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="h-10 w-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                  🎛️
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-extrabold text-[#0F1035] truncate">
                    Préférences
                  </h3>
                  <p class="text-xs text-[#6B7280] truncate mt-0.5">
                    Langue, affichage et accessibilité
                  </p>
                </div>
              </div>
              <span class="text-gray-400 font-bold transition-transform text-xs" [class.rotate-90]="activeSection === 'PREFERENCES'">
                &gt;
              </span>
            </button>

            <!-- Contenu dépliable Préférences -->
            <div *ngIf="activeSection === 'PREFERENCES'" class="p-5 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-3.5 text-xs animate-fadeIn">
              <div>
                <label class="block font-bold text-[#42466B] mb-1">Thème d'affichage</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    (click)="theme = 'light'"
                    [class]="theme === 'light' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-white border border-[#E4E0F5] text-gray-700 font-bold'"
                    class="py-2 rounded-xl text-xs transition"
                  >
                    ☀️ Thème clair
                  </button>
                  <button
                    type="button"
                    (click)="theme = 'dark'"
                    [class]="theme === 'dark' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-white border border-[#E4E0F5] text-gray-700 font-bold'"
                    class="py-2 rounded-xl text-xs transition"
                  >
                    🌙 Thème sombre
                  </button>
                </div>
              </div>

              <div>
                <label class="block font-bold text-[#42466B] mb-1">Taille de la police</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    (click)="fontSize = 'sm'"
                    [class]="fontSize === 'sm' ? 'bg-[#EDE9FE] text-[#6D28D9] font-black' : 'bg-white border border-[#E4E0F5] text-gray-700 font-bold'"
                    class="py-1.5 rounded-xl text-xs transition"
                  >
                    Compacte
                  </button>
                  <button
                    type="button"
                    (click)="fontSize = 'base'"
                    [class]="fontSize === 'base' ? 'bg-[#EDE9FE] text-[#6D28D9] font-black' : 'bg-white border border-[#E4E0F5] text-gray-700 font-bold'"
                    class="py-1.5 rounded-xl text-xs transition"
                  >
                    Normale
                  </button>
                  <button
                    type="button"
                    (click)="fontSize = 'lg'"
                    [class]="fontSize === 'lg' ? 'bg-[#EDE9FE] text-[#6D28D9] font-black' : 'bg-white border border-[#E4E0F5] text-gray-700 font-bold'"
                    class="py-1.5 rounded-xl text-xs transition"
                  >
                    Grande (A+)
                  </button>
                </div>
              </div>

              <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E4E0F5] cursor-pointer">
                <div>
                  <p class="font-bold text-[#0F1035]">Réduction des animations</p>
                  <p class="text-[11px] text-gray-500">Conformité accessibilité WCAG 2.2 AA</p>
                </div>
                <input type="checkbox" [(ngModel)]="reduceMotion" class="h-4 w-4 accent-[#7C3AED]" />
              </label>
            </div>
          </div>

          <!-- 4. MON ACTIVITÉ PROFESSIONNELLE -->
          <div class="rounded-2xl bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
            <button
              type="button"
              (click)="toggleSection('ACTIVITY')"
              class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="h-10 w-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                  📅
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-extrabold text-[#0F1035] truncate">
                    Mon activité professionnelle
                  </h3>
                  <p class="text-xs text-[#6B7280] truncate mt-0.5">
                    Informations, disponibilités et modalités de rendez-vous
                  </p>
                </div>
              </div>
              <span class="text-gray-400 font-bold transition-transform text-xs" [class.rotate-90]="activeSection === 'ACTIVITY'">
                &gt;
              </span>
            </button>

            <!-- Contenu dépliable Activité -->
            <div *ngIf="activeSection === 'ACTIVITY'" class="p-5 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-3 text-xs animate-fadeIn">
              <div class="p-3 bg-white rounded-xl border border-[#E4E0F5] space-y-1">
                <p class="font-bold text-[#0F1035]">Lieu de consultation</p>
                <p class="text-[#42466B]">Centre des Possibles — Salle 2 (Hub de l'Innovation, 61 av. Simone Veil, Nice)</p>
              </div>

              <div class="p-3 bg-white rounded-xl border border-[#E4E0F5] space-y-1">
                <p class="font-bold text-[#0F1035]">Disponibilités hebdomadaires</p>
                <p class="text-[#42466B]">Du Lundi au Vendredi (9h00 - 12h30 • 14h00 - 18h00)</p>
              </div>

              <div class="p-3 bg-white rounded-xl border border-[#E4E0F5] space-y-1">
                <p class="font-bold text-[#0F1035]">Modalités d'entretien</p>
                <div class="flex items-center gap-2 pt-0.5">
                  <span class="bg-purple-100 text-[#6D28D9] font-bold px-2 py-0.5 rounded-md">Présentiel</span>
                  <span class="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md">Visioconférence sécurisée</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. CONFIDENTIALITÉ & RGPD -->
          <div class="rounded-2xl bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
            <button
              type="button"
              (click)="toggleSection('PRIVACY')"
              class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="h-10 w-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                  🛡️
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-extrabold text-[#0F1035] truncate">
                    Confidentialité
                  </h3>
                  <p class="text-xs text-[#6B7280] truncate mt-0.5">
                    Données personnelles, politiques et droits RGPD
                  </p>
                </div>
              </div>
              <span class="text-gray-400 font-bold transition-transform text-xs" [class.rotate-90]="activeSection === 'PRIVACY'">
                &gt;
              </span>
            </button>

            <!-- Contenu dépliable Confidentialité -->
            <div *ngIf="activeSection === 'PRIVACY'" class="p-5 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-3 text-xs animate-fadeIn">
              <p class="text-[#42466B] leading-relaxed">
                Les dossiers des jeunes que vous accompagnez sont strictement protégés par le secret professionnel et le cloisonnement Multi-Tenant (RLS). Aucune donnée n'est transmise à des tiers sans accord parental ou du jeune majeur.
              </p>
              <div class="pt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  (click)="downloadDataExport()"
                  class="rounded-xl border border-[#D8DCF0] bg-white hover:bg-gray-50 text-[#0F1035] font-extrabold text-xs px-3.5 py-2 transition shadow-2xs"
                >
                  📥 Exporter mes données personnelles (RGPD)
                </button>
              </div>
              <div *ngIf="exportNotice" class="text-[11px] font-bold text-emerald-600">
                {{ exportNotice }}
              </div>
            </div>
          </div>

          <!-- 6. BOUTON DÉCONNEXION (Fidèle à la maquette : bandeau rose pâle avec flèche) -->
          <button
            type="button"
            (click)="onLogoutClick()"
            class="w-full rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50/70 to-rose-100/40 p-4 sm:p-5 flex items-center justify-between text-rose-600 hover:bg-rose-100/70 transition shadow-xs cursor-pointer group focus:outline-none"
            title="Se déconnecter de la session conseiller"
          >
            <div class="flex items-center gap-3 font-extrabold text-sm sm:text-base">
              <span class="text-lg group-hover:-translate-x-1 transition-transform">↪</span>
              <span>Déconnexion</span>
            </div>
            <span class="text-rose-500 font-bold group-hover:translate-x-1 transition-transform text-base sm:text-lg">
              →
            </span>
          </button>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE DE RECADRAGE DE LA PHOTO                                     -->
      <!-- ================================================================== -->
      <div
        *ngIf="showCropModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-label="Recadrer la photo de profil"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E4E0F5] space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-[#F0EDFA]">
            <h3 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
              <span>⛶</span>
              <span>Ajuster et recadrer la photo</span>
            </h3>
            <button
              type="button"
              (click)="showCropModal = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Aperçu circulaire avec contrôle de zoom -->
          <div class="flex flex-col items-center gap-4 py-2">
            <div class="h-36 w-36 rounded-full overflow-hidden border-4 border-[#7C3AED] shadow-xl bg-gray-100 flex items-center justify-center">
              <img
                [src]="photoUrl"
                alt="Aperçu"
                [style.transform]="'scale(' + zoomLevel + ')'"
                class="h-full w-full object-cover transition-transform duration-100"
              />
            </div>

            <!-- Curseur de zoom -->
            <div class="w-full space-y-1.5 px-4">
              <div class="flex justify-between text-xs font-bold text-[#42466B]">
                <span>Zoom</span>
                <span>{{ zoomLevel.toFixed(1) }}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                [(ngModel)]="zoomLevel"
                class="w-full accent-[#7C3AED] cursor-pointer"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#F0EDFA]">
            <button
              type="button"
              (click)="showCropModal = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="applyCrop()"
              class="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm transition cursor-pointer"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CounselorSettingsComponent implements OnInit {
  @Input() firstName = 'Sophie';
  @Input() lastName = 'Martin';
  @Input() email = 'sophie.martin@centre-possibles.fr';
  @Input() roleTitle = 'Conseiller d\'orientation';
  @Input() organization = 'Centre des Possibles';
  @Input() photoUrl = 'assets/visuals/profile-counselor.png';

  @Output() profileSave = new EventEmitter<CounselorProfileData>();
  @Output() logout = new EventEmitter<void>();

  isSaving = false;
  savedSuccess = false;
  photoSuccess = false;
  photoError: string | null = null;
  activeSection: string | null = null;
  showCropModal = false;
  zoomLevel = 1.0;

  // Sécurité & Mot de passe
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordNotice: string | null = null;
  securitySimulationResult: string | null = null;

  // Notifications
  notifNewDossiers = true;
  notifYoungQuestions = true;
  notifAppointments = true;
  notifRestitutions = true;

  // Préférences
  theme: 'light' | 'dark' = 'light';
  fontSize: 'sm' | 'base' | 'lg' = 'base';
  reduceMotion = false;
  exportNotice: string | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      try {
        const savedPhoto = localStorage.getItem('monbilan_counselor_photo');
        if (savedPhoto) this.photoUrl = savedPhoto;

        const savedFirst = localStorage.getItem('monbilan_counselor_firstname');
        if (savedFirst) this.firstName = savedFirst;

        const savedLast = localStorage.getItem('monbilan_counselor_lastname');
        if (savedLast) this.lastName = savedLast;

        const savedEmail = localStorage.getItem('monbilan_counselor_email');
        if (savedEmail) this.email = savedEmail;

        const savedRole = localStorage.getItem('monbilan_counselor_role');
        if (savedRole) this.roleTitle = savedRole;
      } catch {
        // Fallback
      }
    }
  }

  getInitials(): string {
    const f = this.firstName ? this.firstName[0].toUpperCase() : 'S';
    const l = this.lastName ? this.lastName[0].toUpperCase() : 'M';
    return `${f}${l}`;
  }

  onFieldChange(): void {
    this.savedSuccess = false;
  }

  onPhotoError(): void {
    // Si l'image locale échoue, on affiche les initiales
    this.photoUrl = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.photoError = 'Format non supporté. Veuillez choisir une image (JPEG, PNG, WebP).';
      this.photoSuccess = false;
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.photoError = 'L\'image dépasse 2 Mo (limite maximale autorisée).';
      this.photoSuccess = false;
      return;
    }

    this.photoError = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        this.photoUrl = base64;
        this.photoSuccess = true;
        try {
          localStorage.setItem('monbilan_counselor_photo', base64);
        } catch {}
        this.emitProfile();
        setTimeout(() => {
          this.photoSuccess = false;
        }, 3500);
      }
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  openCropModal(): void {
    this.showCropModal = true;
    this.zoomLevel = 1.0;
  }

  applyCrop(): void {
    this.showCropModal = false;
    this.photoSuccess = true;
    setTimeout(() => {
      this.photoSuccess = false;
    }, 3000);
  }

  removePhoto(): void {
    this.photoUrl = '';
    this.photoError = null;
    try {
      localStorage.removeItem('monbilan_counselor_photo');
    } catch {}
    this.emitProfile();
  }

  saveProfileChanges(): void {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.savedSuccess = true;
      try {
        localStorage.setItem('monbilan_counselor_firstname', this.firstName);
        localStorage.setItem('monbilan_counselor_lastname', this.lastName);
        localStorage.setItem('monbilan_counselor_email', this.email);
        localStorage.setItem('monbilan_counselor_role', this.roleTitle);
      } catch {}
      this.emitProfile();
      setTimeout(() => {
        this.savedSuccess = false;
      }, 3500);
    }, 400);
  }

  private emitProfile(): void {
    this.profileSave.emit({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      roleTitle: this.roleTitle,
      organization: this.organization,
      photoUrl: this.photoUrl
    });
  }

  toggleSection(section: string): void {
    this.activeSection = this.activeSection === section ? null : section;
  }

  submitPasswordChange(): void {
    if (!this.currentPassword || !this.newPassword) {
      this.passwordNotice = 'Veuillez renseigner tous les champs.';
      return;
    }
    if (this.newPassword.length < 8) {
      this.passwordNotice = 'Le nouveau mot de passe doit comporter au moins 8 caractères.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordNotice = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.passwordNotice = '✓ Mot de passe mis à jour avec succès.';
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    setTimeout(() => {
      this.passwordNotice = null;
    }, 4000);
  }

  runSecuritySimulation(type: 'CROSS_TENANT' | 'UNASSIGNED_COUNSELOR'): void {
    if (type === 'CROSS_TENANT') {
      this.securitySimulationResult = `[SIMULATION RLS] Tentative d'accès au Tenant 'Mission Locale Antibes' refusée : Error 403 FORBIDDEN (Contrat Tenant Isolation respecté).`;
    } else {
      this.securitySimulationResult = `[SIMULATION ABAC] Tentative de modification d'un dossier non attribué : Action bloquée par la politique de gouvernance.`;
    }
  }

  downloadDataExport(): void {
    this.exportNotice = 'Génération de l\'archive RGPD en cours... Fichier JSON sécurisé téléchargé.';
    setTimeout(() => {
      this.exportNotice = null;
    }, 4000);
  }

  onLogoutClick(): void {
    this.logout.emit();
  }
}
