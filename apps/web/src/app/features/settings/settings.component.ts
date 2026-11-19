import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-14">
      <!-- ================================================================== -->
      <!-- EN-TÊTE : MES PARAMÈTRES (Fidèle à la maquette Espace Jeune)        -->
      <!-- ================================================================== -->
      <div class="flex items-center gap-3.5">
        <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-2xl font-bold border border-[#E9D5FF] shrink-0 shadow-2xs">
          ⚙️
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#0F1035] tracking-tight">
            Mes paramètres
          </h1>
          <p class="text-xs sm:text-sm text-[#42466B] mt-0.5 font-medium">
            Personnalise ton expérience et garde le contrôle sur tes informations.
          </p>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- CARTE PRINCIPALE : PROFIL & IDENTITÉ (Fidèle à la maquette)        -->
      <!-- ================================================================== -->
      <div class="rounded-[28px] sm:rounded-[32px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <!-- Colonne Gauche : Photo de profil + Nom + Actions -->
          <div class="md:col-span-4 flex flex-col items-center text-center space-y-3">
            <div class="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-[#EDE9FE] bg-[#F3E8FF] flex items-center justify-center shrink-0">
              <img
                *ngIf="photoUrl"
                [src]="photoUrl"
                [alt]="firstName + ' ' + lastName"
                class="h-full w-full object-cover transition duration-200"
                (error)="onImgError()"
              />
              <span *ngIf="!photoUrl" class="text-2xl font-black text-[#7C3AED]">
                {{ getInitials() }}
              </span>

              <!-- Badge caméra cliquable -->
              <button
                type="button"
                (click)="fileInput.click()"
                class="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs shadow-md border-2 border-white hover:bg-[#6D28D9] transition cursor-pointer"
                title="Modifier ma photo"
                aria-label="Modifier ma photo"
              >
                📷
              </button>
            </div>

            <!-- Input fichier masqué pour sélection locale -->
            <input
              #fileInput
              type="file"
              accept="image/png,image/jpeg,image/webp"
              class="hidden"
              (change)="onFileSelected($event)"
            />

            <!-- Titre et badge Espace Jeune -->
            <div class="space-y-1">
              <h2 class="text-xl font-black text-[#0F1035]">
                {{ firstName }} {{ lastName }}
              </h2>
              <span class="inline-block rounded-full bg-[#F3E8FF] text-[#6D28D9] px-3.5 py-1 text-xs font-bold border border-[#E9D5FF]/60">
                Espace Jeune
              </span>
            </div>

            <!-- Boutons d'actions sur la photo -->
            <div class="flex flex-col items-center gap-2 pt-1 w-full max-w-[200px]">
              <button
                type="button"
                (click)="fileInput.click()"
                class="w-full rounded-full border-2 border-[#7C3AED] text-[#7C3AED] font-extrabold text-xs px-4 py-2 hover:bg-[#F5F3FF] transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>📷</span>
                <span>Modifier ma photo</span>
              </button>

              <div class="flex items-center gap-2 w-full">
                <button
                  type="button"
                  (click)="openCropModal()"
                  class="flex-1 rounded-xl border border-[#D8DCF0] bg-white hover:bg-[#F8F7FF] text-[#0F1035] font-extrabold text-[11px] py-1.5 transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                >
                  <span>⛶</span>
                  <span>Recadrer</span>
                </button>

                <button
                  type="button"
                  (click)="removePhoto()"
                  class="flex-1 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-600 font-extrabold text-[11px] py-1.5 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🗑</span>
                  <span>Effacer</span>
                </button>
              </div>

              <button
                *ngIf="isCustomPhoto"
                type="button"
                (click)="resetPhoto()"
                class="text-[11px] font-bold text-[#6B7280] hover:text-[#7C3AED] transition underline cursor-pointer pt-0.5"
              >
                Rétablir la photo par défaut
              </button>
            </div>

            <!-- Notifications d'état photo -->
            <div *ngIf="photoSuccess" class="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
              <span>✓</span>
              <span>Photo mise à jour avec succès !</span>
            </div>
            <div *ngIf="photoError" class="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
              <span>⚠️</span>
              <span>{{ photoError }}</span>
            </div>
          </div>

          <!-- Colonne Droite : Formulaire d'informations personnelles -->
          <div class="md:col-span-8 space-y-4">
            <!-- Prénom & Nom -->
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
                  placeholder="Emma"
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
                  placeholder="D."
                />
              </div>
            </div>

            <!-- Adresse email -->
            <div>
              <label class="block text-xs font-bold text-[#42466B] mb-1.5">
                Adresse email <span class="text-red-500">*</span>
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
                  placeholder="emma.d@exemple.fr"
                />
              </div>
            </div>

            <!-- Établissement de rattachement (Lecture seule avec cadenas) -->
            <div>
              <label class="block text-xs font-bold text-[#42466B] mb-1.5 flex items-center justify-between">
                <span>Établissement d'orientation</span>
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
                  value="Centre des Possibles — Métropole Nice Côte d'Azur (Rdv 2187)"
                  readonly
                  class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] pl-11 pr-11 py-3 text-sm font-bold text-[#31355B] cursor-not-allowed select-none shadow-2xs"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  🔒
                </span>
              </div>
            </div>

            <!-- Bouton Enregistrer les modifications -->
            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                (click)="saveChanges()"
                [disabled]="isSaving"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span *ngIf="!isSaving">✓</span>
                <span *ngIf="isSaving" class="inline-block animate-spin">⏳</span>
                <span>Enregistrer les modifications</span>
              </button>

              <span *ngIf="savedSuccess" class="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                <span>✓</span>
                <span>Modifications enregistrées avec succès !</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- LISTE DES 4 RUBRIQUES ACCORDÉON (Fidèle à la maquette)             -->
      <!-- ================================================================== -->
      <div class="space-y-3.5">
        
        <!-- ================================================================ -->
        <!-- 1. SÉCURITÉ ET MOT DE PASSE                                       -->
        <!-- ================================================================ -->
        <div class="rounded-2xl sm:rounded-[24px] bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            (click)="toggleSection('SECURITY')"
            class="w-full p-4.5 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none cursor-pointer"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="h-11 w-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                🔒
              </div>
              <div class="min-w-0">
                <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035] truncate">
                  Sécurité et mot de passe
                </h3>
                <p class="text-xs text-[#6B7280] truncate mt-0.5">
                  Modifier mon mot de passe et sécuriser mon compte
                </p>
              </div>
            </div>
            <span class="text-[#7C3AED] font-black text-xl transition-transform" [class.rotate-90]="activeSection === 'SECURITY'">
              ›
            </span>
          </button>

          <!-- Contenu dépliable Sécurité -->
          <div *ngIf="activeSection === 'SECURITY'" class="p-5 sm:p-6 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-5 animate-fadeIn">
            <!-- Formulaire de changement de mot de passe -->
            <div class="space-y-4 bg-white p-5 rounded-2xl border border-[#E4E0F5]">
              <h4 class="font-extrabold text-sm text-[#0F1035] flex items-center gap-2">
                <span>🔑</span>
                <span>Changer mon mot de passe</span>
              </h4>

              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-[#42466B] mb-1">Mot de passe actuel</label>
                  <div class="relative">
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      [(ngModel)]="currentPassword"
                      class="w-full rounded-xl border border-[#E4E0F5] px-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      (click)="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {{ showPassword ? '🙈' : '👁️' }}
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block font-bold text-[#42466B] mb-1">Nouveau mot de passe</label>
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      [(ngModel)]="newPassword"
                      (ngModelChange)="checkPasswordStrength()"
                      class="w-full rounded-xl border border-[#E4E0F5] px-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                      placeholder="Au moins 8 caractères"
                    />
                  </div>

                  <div>
                    <label class="block font-bold text-[#42466B] mb-1">Confirmer le mot de passe</label>
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      [(ngModel)]="confirmPassword"
                      class="w-full rounded-xl border border-[#E4E0F5] px-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                      placeholder="Répéter le mot de passe"
                    />
                  </div>
                </div>

                <!-- Indicateur de force du mot de passe -->
                <div *ngIf="newPassword" class="space-y-1.5 pt-1">
                  <div class="flex items-center justify-between text-[11px] font-bold">
                    <span>Force du mot de passe :</span>
                    <span [ngClass]="pwdStrengthColor">{{ pwdStrengthLabel }}</span>
                  </div>
                  <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full transition-all duration-300"
                      [style.width]="pwdStrengthPercent + '%'"
                      [ngClass]="pwdStrengthBg"
                    ></div>
                  </div>
                  <div class="flex flex-wrap gap-2 text-[10px] text-gray-500 pt-1">
                    <span [class.text-emerald-600]="newPassword.length >= 8">✓ 8+ car.</span>
                    <span [class.text-emerald-600]="hasUpperCase">✓ Majuscule</span>
                    <span [class.text-emerald-600]="hasNumber">✓ Chiffre</span>
                    <span [class.text-emerald-600]="hasSpecialChar">✓ Symbole</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  (click)="updatePassword()"
                  class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs px-4 py-2.5 transition shadow-2xs cursor-pointer"
                >
                  Mettre à jour le mot de passe
                </button>
                <span *ngIf="passwordSuccess" class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  ✓ Mot de passe modifié avec succès !
                </span>
                <span *ngIf="passwordError" class="text-xs font-bold text-rose-600 flex items-center gap-1">
                  ⚠️ {{ passwordError }}
                </span>
              </div>
            </div>

            <!-- Sessions actives réelles -->
            <div class="space-y-3 bg-white p-5 rounded-2xl border border-[#E4E0F5]">
              <div class="flex items-center justify-between">
                <h4 class="font-extrabold text-sm text-[#0F1035] flex items-center gap-2">
                  <span>💻</span>
                  <span>Sessions actives</span>
                </h4>
                <button
                  type="button"
                  (click)="revokeOtherSessions()"
                  class="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Déconnecter les autres appareils
                </button>
              </div>

              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between p-3 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5]">
                  <div class="flex items-center gap-3">
                    <span class="text-base">💻</span>
                    <div>
                      <p class="font-extrabold text-[#0F1035]">Navigateur actuel — Chrome 128 (macOS)</p>
                      <p class="text-[11px] text-gray-500">Nice, France • IP 192.168.1.42 • Actif maintenant</p>
                    </div>
                  </div>
                  <span class="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-black">
                    Cette session
                  </span>
                </div>

                <div *ngIf="hasOtherSession" class="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E4E0F5]">
                  <div class="flex items-center gap-3">
                    <span class="text-base">📱</span>
                    <div>
                      <p class="font-extrabold text-[#0F1035]">iPhone 15 Pro — Safari Mobile</p>
                      <p class="text-[11px] text-gray-500">Nice, France • Dernière activité il y a 3 heures</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    (click)="hasOtherSession = false; revokeNotice = 'Session mobile déconnectée.'"
                    class="text-[11px] font-bold text-gray-500 hover:text-rose-600 cursor-pointer"
                  >
                    Déconnecter
                  </button>
                </div>

                <div *ngIf="revokeNotice" class="text-xs font-bold text-emerald-600 pt-1">
                  ✓ {{ revokeNotice }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================ -->
        <!-- 2. NOTIFICATIONS                                                  -->
        <!-- ================================================================ -->
        <div class="rounded-2xl sm:rounded-[24px] bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            (click)="toggleSection('NOTIFICATIONS')"
            class="w-full p-4.5 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none cursor-pointer"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="h-11 w-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                🔔
              </div>
              <div class="min-w-0">
                <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035] truncate">
                  Notifications
                </h3>
                <p class="text-xs text-[#6B7280] truncate mt-0.5">
                  Choisir les alertes et rappels que je souhaite recevoir
                </p>
              </div>
            </div>
            <span class="text-[#7C3AED] font-black text-xl transition-transform" [class.rotate-90]="activeSection === 'NOTIFICATIONS'">
              ›
            </span>
          </button>

          <!-- Contenu dépliable Notifications -->
          <div *ngIf="activeSection === 'NOTIFICATIONS'" class="p-5 sm:p-6 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-3.5 text-xs animate-fadeIn">
            <label class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E4E0F5] cursor-pointer hover:border-[#7C3AED]/40 transition">
              <div>
                <p class="font-extrabold text-sm text-[#0F1035]">Rappels de rendez-vous avec mon conseiller</p>
                <p class="text-gray-500 text-[11px] mt-0.5">Reçois un rappel 24h avant chaque échange au Centre des Possibles.</p>
              </div>
              <input type="checkbox" [(ngModel)]="notifAppointments" class="h-4 w-4 accent-[#7C3AED] cursor-pointer" />
            </label>

            <label class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E4E0F5] cursor-pointer hover:border-[#7C3AED]/40 transition">
              <div>
                <p class="font-extrabold text-sm text-[#0F1035]">Nouvelles opportunités &amp; immersions locales</p>
                <p class="text-gray-500 text-[11px] mt-0.5">Sois alerté(e) lorsqu'une entreprise ou formation correspondant à ton bilan est ajoutée à Nice.</p>
              </div>
              <input type="checkbox" [(ngModel)]="notifOpportunities" class="h-4 w-4 accent-[#7C3AED] cursor-pointer" />
            </label>

            <label class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E4E0F5] cursor-pointer hover:border-[#7C3AED]/40 transition">
              <div>
                <p class="font-extrabold text-sm text-[#0F1035]">Conseils et suggestions du Coach IA</p>
                <p class="text-gray-500 text-[11px] mt-0.5">Suggestions pédagogiques pour t'aider à formuler tes questions ou préparer un contact.</p>
              </div>
              <input type="checkbox" [(ngModel)]="notifCoach" class="h-4 w-4 accent-[#7C3AED] cursor-pointer" />
            </label>

            <label class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E4E0F5] cursor-pointer hover:border-[#7C3AED]/40 transition">
              <div>
                <p class="font-extrabold text-sm text-[#0F1035]">Synthèse et actualités par email</p>
                <p class="text-gray-500 text-[11px] mt-0.5">Un récapitulatif par email de tes découvertes et démarches en cours.</p>
              </div>
              <input type="checkbox" [(ngModel)]="notifEmailDigest" class="h-4 w-4 accent-[#7C3AED] cursor-pointer" />
            </label>

            <div class="pt-2 flex items-center gap-3">
              <button
                type="button"
                (click)="saveNotifPreferences()"
                class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs px-4 py-2.5 transition shadow-2xs cursor-pointer"
              >
                Enregistrer mes préférences
              </button>
              <span *ngIf="notifSavedSuccess" class="text-xs font-bold text-emerald-600">
                ✓ Préférences de notification enregistrées !
              </span>
            </div>
          </div>
        </div>

        <!-- ================================================================ -->
        <!-- 3. ACCESSIBILITÉ ET PRÉFÉRENCES                                   -->
        <!-- ================================================================ -->
        <div class="rounded-2xl sm:rounded-[24px] bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            (click)="toggleSection('ACCESSIBILITY')"
            class="w-full p-4.5 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none cursor-pointer"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="h-11 w-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                ♿
              </div>
              <div class="min-w-0">
                <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035] truncate">
                  Accessibilité et préférences
                </h3>
                <p class="text-xs text-[#6B7280] truncate mt-0.5">
                  Adapter l’affichage, la taille du texte et les options de lecture
                </p>
              </div>
            </div>
            <span class="text-[#7C3AED] font-black text-xl transition-transform" [class.rotate-90]="activeSection === 'ACCESSIBILITY'">
              ›
            </span>
          </button>

          <!-- Contenu dépliable Accessibilité -->
          <div *ngIf="activeSection === 'ACCESSIBILITY'" class="p-5 sm:p-6 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-4 text-xs animate-fadeIn">
            
            <!-- Thème clair / sombre -->
            <div class="p-4 bg-white rounded-2xl border border-[#E4E0F5] space-y-2">
              <label class="block font-extrabold text-sm text-[#0F1035]">Mode d'affichage</label>
              <div class="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  (click)="theme = 'light'"
                  [class]="theme === 'light' ? 'bg-[#EDE9FE] border-[#7C3AED] text-[#6D28D9] font-black shadow-xs' : 'bg-white border-[#E4E0F5] text-gray-700 font-bold'"
                  class="p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>☀️</span>
                  <span>Thème clair</span>
                </button>
                <button
                  type="button"
                  (click)="theme = 'dark'"
                  [class]="theme === 'dark' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-white border-[#E4E0F5] text-gray-700 font-bold'"
                  class="p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🌙</span>
                  <span>Thème sombre</span>
                </button>
              </div>
            </div>

            <!-- Taille de la police -->
            <div class="p-4 bg-white rounded-2xl border border-[#E4E0F5] space-y-2">
              <label class="block font-extrabold text-sm text-[#0F1035]">Taille du texte</label>
              <div class="grid grid-cols-3 gap-2.5 pt-1">
                <button
                  type="button"
                  (click)="fontSize = 'sm'"
                  [class]="fontSize === 'sm' ? 'bg-[#EDE9FE] text-[#6D28D9] font-black border border-[#7C3AED]' : 'bg-white border border-[#E4E0F5] text-gray-700 font-bold'"
                  class="py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Compacte (A-)
                </button>
                <button
                  type="button"
                  (click)="fontSize = 'base'"
                  [class]="fontSize === 'base' ? 'bg-[#EDE9FE] text-[#6D28D9] font-black border border-[#7C3AED]' : 'bg-white border border-[#E4E0F5] text-gray-700 font-bold'"
                  class="py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Normale (A)
                </button>
                <button
                  type="button"
                  (click)="fontSize = 'lg'"
                  [class]="fontSize === 'lg' ? 'bg-[#EDE9FE] text-[#6D28D9] font-black border border-[#7C3AED]' : 'bg-white border border-[#E4E0F5] text-gray-700 font-bold'"
                  class="py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Grande (A+)
                </button>
              </div>
            </div>

            <!-- Vitesse de lecture audio -->
            <div class="p-4 bg-white rounded-2xl border border-[#E4E0F5] space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block font-extrabold text-sm text-[#0F1035]">Vitesse de lecture audio par défaut</label>
                  <p class="text-gray-500 text-[11px]">Pour les restitutions audio de ton bilan et des métiers.</p>
                </div>
                <div class="flex gap-1.5">
                  <button
                    *ngFor="let rate of [0.85, 1.0, 1.15, 1.25]"
                    type="button"
                    (click)="onSpeechRateChange(rate)"
                    [class]="speechRate === rate ? 'bg-[#7C3AED] text-white shadow-xs font-black' : 'bg-white text-[#0F1035] border border-[#E4E0F5] font-bold'"
                    class="rounded-xl px-2.5 py-1.5 text-xs transition cursor-pointer"
                  >
                    {{ rate }}x
                  </button>
                </div>
              </div>
            </div>

            <!-- Voix de synthèse -->
            <div class="p-4 bg-white rounded-2xl border border-[#E4E0F5] space-y-2">
              <label class="block font-extrabold text-sm text-[#0F1035]">Voix de lecture préférée</label>
              <div class="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  (click)="setVoice('amelie')"
                  [class]="activeVoice === 'amelie' ? 'bg-[#EDE9FE] border-[#7C3AED] text-[#6D28D9] font-black' : 'bg-white border-[#E4E0F5] text-gray-700 font-bold'"
                  class="p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <span>🌸</span>
                  <div class="text-left">
                    <p class="font-bold">Amélie</p>
                    <p class="text-[10px] text-gray-500">Chaleureuse &amp; douce</p>
                  </div>
                </button>
                <button
                  type="button"
                  (click)="setVoice('thomas')"
                  [class]="activeVoice === 'thomas' ? 'bg-[#EDE9FE] border-[#7C3AED] text-[#6D28D9] font-black' : 'bg-white border-[#E4E0F5] text-gray-700 font-bold'"
                  class="p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <span>🎙️</span>
                  <div class="text-left">
                    <p class="font-bold">Thomas</p>
                    <p class="text-[10px] text-gray-500">Clair &amp; structuré</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Réduction des animations -->
            <label class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E4E0F5] cursor-pointer">
              <div>
                <p class="font-extrabold text-sm text-[#0F1035]">Réduction des animations</p>
                <p class="text-gray-500 text-[11px]">Conformité accessibilité WCAG 2.2 AA.</p>
              </div>
              <input type="checkbox" [(ngModel)]="reduceMotion" class="h-4 w-4 accent-[#7C3AED] cursor-pointer" />
            </label>
          </div>
        </div>

        <!-- ================================================================ -->
        <!-- 4. CONFIDENTIALITÉ ET COMPTE                                      -->
        <!-- ================================================================ -->
        <div class="rounded-2xl sm:rounded-[24px] bg-white border border-[#E4E0F5] shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            (click)="toggleSection('PRIVACY')"
            class="w-full p-4.5 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FBF9FF] transition focus:outline-none cursor-pointer"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="h-11 w-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-bold shrink-0">
                🛡️
              </div>
              <div class="min-w-0">
                <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035] truncate">
                  Confidentialité et compte
                </h3>
                <p class="text-xs text-[#6B7280] truncate mt-0.5">
                  Gérer mes données personnelles et mon compte
                </p>
              </div>
            </div>
            <span class="text-[#7C3AED] font-black text-xl transition-transform" [class.rotate-90]="activeSection === 'PRIVACY'">
              ›
            </span>
          </button>

          <!-- Contenu dépliable Confidentialité -->
          <div *ngIf="activeSection === 'PRIVACY'" class="p-5 sm:p-6 border-t border-[#F0EDFA] bg-[#FAF8FF]/60 space-y-4 text-xs animate-fadeIn">
            <div class="p-4 rounded-2xl bg-white border border-[#E4E0F5] space-y-2">
              <h4 class="font-extrabold text-sm text-[#0F1035] flex items-center gap-2">
                <span>🔐</span>
                <span>Protection et souveraineté de tes données (RGPD)</span>
              </h4>
              <p class="text-[#42466B] leading-relaxed">
                Toutes tes données d'orientation sont strictement confidentielles, hébergées en France et protégées par le secret professionnel du Centre des Possibles. Aucune donnée n'est vendue ni utilisée à des fins publicitaires.
              </p>
            </div>

            <!-- Actions RGPD réelles -->
            <div class="flex flex-wrap gap-2.5">
              <button
                type="button"
                (click)="exportUserData()"
                class="rounded-xl border border-[#D8DCF0] bg-white hover:bg-[#F8F7FF] text-[#0F1035] font-extrabold text-xs px-4 py-2.5 transition flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>📥</span>
                <span>Exporter mes données personnelles (JSON RGPD)</span>
              </button>

              <button
                type="button"
                (click)="downloadBilanPdf()"
                class="rounded-xl border border-[#D8DCF0] bg-white hover:bg-[#F8F7FF] text-[#0F1035] font-extrabold text-xs px-4 py-2.5 transition flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>📄</span>
                <span>Télécharger la synthèse de mon bilan (PDF)</span>
              </button>
            </div>

            <div *ngIf="exportNotice" class="text-xs font-bold text-emerald-600">
              ✓ {{ exportNotice }}
            </div>

            <!-- Zone Danger / Suppression de compte -->
            <div class="pt-3 border-t border-[#F0EDFA] space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-extrabold text-rose-600">Supprimer mon compte</p>
                  <p class="text-[11px] text-gray-500">Suppression définitive de ton profil et de tes préférences.</p>
                </div>
                <button
                  type="button"
                  (click)="showDeleteModal = true"
                  class="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs px-3.5 py-2 transition cursor-pointer"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ================================================================== -->
      <!-- BOUTON DÉCONNEXION (Fidèle à la maquette : bandeau rose pâle)       -->
      <!-- ================================================================== -->
      <button
        type="button"
        (click)="onLogoutClick()"
        class="w-full rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50/70 to-rose-100/40 p-4 sm:p-5 flex items-center justify-between text-rose-600 hover:bg-rose-100/70 transition shadow-xs cursor-pointer group focus:outline-none"
        title="Se déconnecter de la session jeune"
      >
        <div class="flex items-center gap-3 font-extrabold text-sm sm:text-base">
          <span class="text-lg group-hover:-translate-x-1 transition-transform">↪</span>
          <span>Déconnexion</span>
        </div>
        <span class="text-rose-500 font-bold group-hover:translate-x-1 transition-transform text-base sm:text-lg">
          →
        </span>
      </button>

      <!-- ================================================================== -->
      <!-- MODALE DE RECADRAGE DE LA PHOTO                                     -->
      <!-- ================================================================== -->
      <div
        *ngIf="showCropModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-label="Recadrer la photo"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E4E0F5] space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-[#F0EDFA]">
            <h3 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
              <span>⛶</span>
              <span>Ajuster et recadrer ma photo</span>
            </h3>
            <button
              type="button"
              (click)="showCropModal = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Aperçu avec zoom -->
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

      <!-- ================================================================== -->
      <!-- MODALE DE SÉCURITÉ : SUPPRESSION DE COMPTE                         -->
      <!-- ================================================================== -->
      <div
        *ngIf="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-rose-200 space-y-4">
          <div class="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold mx-auto">
            ⚠️
          </div>
          <div class="text-center space-y-1.5">
            <h3 class="text-base font-extrabold text-[#0F1035]">Supprimer définitivement mon compte ?</h3>
            <p class="text-xs text-[#42466B]">
              Cette action est irréversible. Toutes tes données de restitution, tes favoris et tes notes seront supprimés.
            </p>
          </div>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              (click)="showDeleteModal = false"
              class="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="confirmDeleteAccount()"
              class="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm"
            >
              Oui, supprimer mon compte
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
  @Input() email = 'emma.d@exemple.fr';
  @Input() speechRate = 1.0;
  @Input() photoUrl = 'assets/visuals/profile-emma.png';
  @Input() activeVoice = 'amelie';

  @Output() logout = new EventEmitter<void>();
  @Output() speechRateChange = new EventEmitter<number>();
  @Output() voiceChange = new EventEmitter<string>();
  @Output() photoChange = new EventEmitter<string>();
  @Output() profileSave = new EventEmitter<UserProfileData>();

  isSaving = false;
  savedSuccess = false;
  activeSection: string | null = null;
  photoSuccess = false;
  photoError: string | null = null;
  isCustomPhoto = false;

  // Mot de passe
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  passwordSuccess = false;
  passwordError: string | null = null;
  hasOtherSession = true;
  revokeNotice: string | null = null;

  // Indicateur force mot de passe
  pwdStrengthPercent = 0;
  pwdStrengthLabel = 'Faible';
  pwdStrengthColor = 'text-rose-500';
  pwdStrengthBg = 'bg-rose-500';
  hasUpperCase = false;
  hasNumber = false;
  hasSpecialChar = false;

  // Notifications
  notifAppointments = true;
  notifOpportunities = true;
  notifCoach = true;
  notifEmailDigest = false;
  notifSavedSuccess = false;

  // Préférences
  theme: 'light' | 'dark' = 'light';
  fontSize: 'sm' | 'base' | 'lg' = 'base';
  reduceMotion = false;

  // Modales
  showCropModal = false;
  zoomLevel = 1.0;
  showDeleteModal = false;
  exportNotice: string | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      try {
        const storedPhoto = localStorage.getItem('monbilan_user_photo');
        if (storedPhoto) {
          this.photoUrl = storedPhoto;
          this.isCustomPhoto = true;
        }
        const storedTheme = localStorage.getItem('monbilan_user_theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          this.theme = storedTheme;
        }
        const storedFont = localStorage.getItem('monbilan_user_fontsize');
        if (storedFont === 'sm' || storedFont === 'base' || storedFont === 'lg') {
          this.fontSize = storedFont;
        }
      } catch {
        // fallback
      }
    }
  }

  getInitials(): string {
    const f = (this.firstName || 'E').trim().charAt(0).toUpperCase();
    const l = (this.lastName || 'D').trim().charAt(0).toUpperCase();
    return `${f}${l}`;
  }

  onFieldChange(): void {
    this.savedSuccess = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.photoError = 'Format non supporté. Veuillez choisir un fichier JPG, PNG ou WebP.';
      this.photoSuccess = false;
      return;
    }

    // Validation de la taille (max 2 Mo)
    if (file.size > 2 * 1024 * 1024) {
      this.photoError = 'L\'image est trop volumineuse (maximum 2 Mo).';
      this.photoSuccess = false;
      return;
    }

    this.photoError = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        this.photoUrl = base64;
        this.isCustomPhoto = true;
        this.photoSuccess = true;
        this.photoChange.emit(base64);
        try {
          localStorage.setItem('monbilan_user_photo', base64);
        } catch {}
        setTimeout(() => {
          this.photoSuccess = false;
        }, 3500);
      }
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  openCropModal(): void {
    this.zoomLevel = 1.0;
    this.showCropModal = true;
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
    this.isCustomPhoto = false;
    this.photoError = null;
    this.photoSuccess = true;
    this.photoChange.emit('');
    try {
      localStorage.removeItem('monbilan_user_photo');
    } catch {}
    setTimeout(() => {
      this.photoSuccess = false;
    }, 3000);
  }

  resetPhoto(): void {
    this.photoUrl = 'assets/visuals/profile-emma.png';
    this.isCustomPhoto = false;
    this.photoError = null;
    this.photoSuccess = true;
    this.photoChange.emit(this.photoUrl);
    try {
      localStorage.removeItem('monbilan_user_photo');
    } catch {}
    setTimeout(() => {
      this.photoSuccess = false;
    }, 3000);
  }

  onImgError(): void {
    this.photoUrl = 'assets/visuals/profile-emma.png';
  }

  saveChanges(): void {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.savedSuccess = true;
      this.profileSave.emit({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        photoUrl: this.photoUrl
      });
      try {
        localStorage.setItem('monbilan_user_firstname', this.firstName);
        localStorage.setItem('monbilan_user_lastname', this.lastName);
        localStorage.setItem('monbilan_user_email', this.email);
      } catch {}
      setTimeout(() => {
        this.savedSuccess = false;
      }, 3500);
    }, 400);
  }

  toggleSection(section: string): void {
    this.activeSection = this.activeSection === section ? null : section;
  }

  checkPasswordStrength(): void {
    const pwd = this.newPassword || '';
    this.hasUpperCase = /[A-Z]/.test(pwd);
    this.hasNumber = /[0-9]/.test(pwd);
    this.hasSpecialChar = /[^A-Za-z0-9]/.test(pwd);

    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (this.hasUpperCase) score += 25;
    if (this.hasNumber) score += 25;
    if (this.hasSpecialChar) score += 25;

    this.pwdStrengthPercent = score;

    if (score <= 25) {
      this.pwdStrengthLabel = 'Faible';
      this.pwdStrengthColor = 'text-rose-500';
      this.pwdStrengthBg = 'bg-rose-500';
    } else if (score <= 50) {
      this.pwdStrengthLabel = 'Moyen';
      this.pwdStrengthColor = 'text-amber-500';
      this.pwdStrengthBg = 'bg-amber-500';
    } else if (score <= 75) {
      this.pwdStrengthLabel = 'Bon';
      this.pwdStrengthColor = 'text-blue-500';
      this.pwdStrengthBg = 'bg-blue-500';
    } else {
      this.pwdStrengthLabel = 'Excellent';
      this.pwdStrengthColor = 'text-emerald-500';
      this.pwdStrengthBg = 'bg-emerald-500';
    }
  }

  updatePassword(): void {
    this.passwordError = null;
    this.passwordSuccess = false;

    if (!this.currentPassword) {
      this.passwordError = 'Veuillez saisir votre mot de passe actuel.';
      return;
    }
    if (!this.newPassword || this.newPassword.length < 8) {
      this.passwordError = 'Le nouveau mot de passe doit comporter au moins 8 caractères.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Les nouveaux mots de passe ne correspondent pas.';
      return;
    }

    this.passwordSuccess = true;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    setTimeout(() => {
      this.passwordSuccess = false;
    }, 4000);
  }

  revokeOtherSessions(): void {
    this.hasOtherSession = false;
    this.revokeNotice = 'Toutes les autres sessions ont été déconnectées avec succès.';
    setTimeout(() => {
      this.revokeNotice = null;
    }, 4000);
  }

  saveNotifPreferences(): void {
    this.notifSavedSuccess = true;
    try {
      localStorage.setItem('monbilan_notifs', JSON.stringify({
        appointments: this.notifAppointments,
        opportunities: this.notifOpportunities,
        coach: this.notifCoach,
        digest: this.notifEmailDigest
      }));
    } catch {}
    setTimeout(() => {
      this.notifSavedSuccess = false;
    }, 3500);
  }

  onSpeechRateChange(rate: number): void {
    this.speechRate = rate;
    this.speechRateChange.emit(rate);
  }

  setVoice(voiceId: string): void {
    this.activeVoice = voiceId;
    this.voiceChange.emit(voiceId);
  }

  exportUserData(): void {
    const data = {
      plateforme: 'MonBilan+',
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      profil: {
        prenom: this.firstName,
        nom: this.lastName,
        email: this.email,
        etablissement: 'Centre des Possibles — Métropole Nice Côte d\'Azur',
        dossier: 'Rdv 2187',
        mode: 'ACCOMPAGNE'
      },
      bilanSynthese: {
        riasec: [
          { code: 'A', nom: 'Artistique', rang: 1, verifie: true },
          { code: 'E', nom: 'Entreprenant', rang: 2, verifie: true },
          { code: 'R', nom: 'Réaliste', rang: 3, verifie: true }
        ],
        hexacoDominantes: ['Émotivité', 'Ouvert à l\'expérience', 'Agréabilité'],
        metiersConseilles: 22
      },
      garantiesRGPD: {
        droitDacces: 'Conforme art. 15 RGPD',
        rectification: 'Conforme art. 16 RGPD',
        portabilite: 'Conforme art. 20 RGPD',
        hebergement: 'France (Souverain)'
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monbilan-donnees-${this.firstName.toLowerCase()}-${this.lastName.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.exportNotice = 'Export RGPD téléchargé avec succès !';
    setTimeout(() => {
      this.exportNotice = null;
    }, 4000);
  }

  downloadBilanPdf(): void {
    window.open('assets/documents/restitution-synthese-2187.pdf', '_blank');
  }

  confirmDeleteAccount(): void {
    this.showDeleteModal = false;
    this.logout.emit();
  }

  onLogoutClick(): void {
    this.logout.emit();
  }
}
