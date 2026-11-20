// ============================================================================
// MonBilan+ — Module « Trouver de l'aide » (Refonte UX/UI Complète)
// Fidèle aux 3 maquettes officielles :
// Écran 1 : Identifier mon besoin (4 choix déculpabilisants)
// Écran 2 : Trouver les structures adaptées (CIO, Mission Locale 06 + filtres)
// Écran 3 : Préparer mon premier contact (Email, Appel, Coach IA + Démarches)
// ============================================================================

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  INITIAL_SUPPORT_RESOURCES,
  UISupportResource
} from '../../shared/autonomous-data';

export type SupportNeedId = 'UNKNOWN' | 'TRAINING' | 'JOB_INTERNSHIP' | 'TALK';
export type ContactModeId = 'EMAIL' | 'CALL' | 'COACH';

export interface SupportNeedOption {
  id: SupportNeedId;
  title: string;
  desc: string;
  icon: string;
  relevantCategory: string;
}

export interface SupportStep {
  id: string;
  label: string;
  completed: boolean;
}

@Component({
  selector: 'app-support-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉCRAN 1 : IDENTIFIER MON BESOIN (Maquette 1 officielle)            -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="activeScreen === 1" class="space-y-6 animate-fadeIn">
        
        <!-- Carte En-tête : Illustration mains & cœur + Titre chaleureux -->
        <div class="rounded-[28px] sm:rounded-[32px] bg-[#FAF8FF] border border-[#EDE9FE] p-6 sm:p-8 text-center space-y-4 shadow-xs relative overflow-hidden">
          <!-- Illustration vectorielle mains qui soutiennent le cœur violet -->
          <div class="flex items-center justify-center relative">
            <!-- Rayons lumineux décoratifs violets -->
            <div class="absolute -top-1 text-[#7C3AED] font-black text-xs select-none">
              \\ | /
            </div>
            <div class="h-20 w-24 flex items-center justify-center">
              <svg viewBox="0 0 100 80" class="h-20 w-auto drop-shadow-md">
                <!-- Cœur violet lumineux -->
                <path d="M 50 28 C 42 16, 28 24, 38 38 L 50 50 L 62 38 C 72 24, 58 16, 50 28 Z" fill="#7C3AED" />
                <!-- Deux mains ouvertes chaleureuses -->
                <path d="M 20 54 C 30 48, 42 52, 48 54 C 44 60, 28 64, 18 58 Z" fill="#FBBF24" />
                <path d="M 80 54 C 70 48, 58 52, 52 54 C 56 60, 72 64, 82 58 Z" fill="#FBBF24" />
              </svg>
            </div>
          </div>

          <!-- Titre & Sous-titre -->
          <div class="space-y-1">
            <h1 class="text-2xl sm:text-3xl font-black text-[#0F1035] tracking-tight">
              Tu n'es pas seul pour avancer !
            </h1>
            <p class="text-xs sm:text-sm text-[#42466B] font-medium max-w-md mx-auto leading-relaxed">
              On t'aide à trouver le bon interlocuteur, à ton rythme.
            </p>
          </div>
        </div>

        <!-- Grande Carte Blanche : Question & 4 cartes de besoin -->
        <div class="rounded-[32px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 class="text-base sm:text-lg font-black text-[#0F1035] text-center sm:text-left">
            Qu'est-ce qui te bloque aujourd'hui ?
          </h2>

          <!-- Grille des 4 cartes de besoins -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Carte 1 : Je ne sais pas quoi faire -->
            <div
              (click)="selectNeed('UNKNOWN')"
              [class.border-[#7C3AED]]="selectedNeedId === 'UNKNOWN'"
              [class.ring-2]="selectedNeedId === 'UNKNOWN'"
              [class.ring-[#7C3AED]]="selectedNeedId === 'UNKNOWN'"
              [class.bg-[#FAF8FF]]="selectedNeedId === 'UNKNOWN'"
              class="rounded-3xl border-2 border-[#E4E0F5] p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[150px] relative hover:border-[#7C3AED]/40 hover:shadow-xs group"
            >
              <!-- Pastille coche violette si sélectionnée -->
              <span
                *ngIf="selectedNeedId === 'UNKNOWN'"
                class="absolute top-3.5 right-3.5 h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shadow-xs"
              >
                ✓
              </span>

              <div class="h-12 w-12 rounded-full bg-[#F3EFFE] text-[#7C3AED] flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition">
                🧭
              </div>
              <h3 class="font-extrabold text-sm sm:text-base text-[#0F1035] leading-snug">
                Je ne sais pas quoi faire
              </h3>
              <p class="text-[11px] text-[#6B7280] mt-1">
                J'aimerais mieux comprendre les possibilités.
              </p>
            </div>

            <!-- Carte 2 : Je cherche une formation -->
            <div
              (click)="selectNeed('TRAINING')"
              [class.border-[#7C3AED]]="selectedNeedId === 'TRAINING'"
              [class.ring-2]="selectedNeedId === 'TRAINING'"
              [class.ring-[#7C3AED]]="selectedNeedId === 'TRAINING'"
              [class.bg-[#FAF8FF]]="selectedNeedId === 'TRAINING'"
              class="rounded-3xl border-2 border-[#E4E0F5] p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[150px] relative hover:border-[#7C3AED]/40 hover:shadow-xs group"
            >
              <span
                *ngIf="selectedNeedId === 'TRAINING'"
                class="absolute top-3.5 right-3.5 h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shadow-xs"
              >
                ✓
              </span>

              <div class="h-12 w-12 rounded-full bg-[#F3EFFE] text-[#7C3AED] flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition">
                🎓
              </div>
              <h3 class="font-extrabold text-sm sm:text-base text-[#0F1035] leading-snug">
                Je cherche une formation
              </h3>
              <p class="text-[11px] text-[#6B7280] mt-1">
                Trouver une formation adaptée à mon projet.
              </p>
            </div>

            <!-- Carte 3 : Je cherche un stage ou un emploi -->
            <div
              (click)="selectNeed('JOB_INTERNSHIP')"
              [class.border-[#7C3AED]]="selectedNeedId === 'JOB_INTERNSHIP'"
              [class.ring-2]="selectedNeedId === 'JOB_INTERNSHIP'"
              [class.ring-[#7C3AED]]="selectedNeedId === 'JOB_INTERNSHIP'"
              [class.bg-[#FAF8FF]]="selectedNeedId === 'JOB_INTERNSHIP'"
              class="rounded-3xl border-2 border-[#E4E0F5] p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[150px] relative hover:border-[#7C3AED]/40 hover:shadow-xs group"
            >
              <span
                *ngIf="selectedNeedId === 'JOB_INTERNSHIP'"
                class="absolute top-3.5 right-3.5 h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shadow-xs"
              >
                ✓
              </span>

              <div class="h-12 w-12 rounded-full bg-[#F3EFFE] text-[#7C3AED] flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition">
                💼
              </div>
              <h3 class="font-extrabold text-sm sm:text-base text-[#0F1035] leading-snug">
                Je cherche un stage ou un emploi
              </h3>
              <p class="text-[11px] text-[#6B7280] mt-1">
                Découvrir une entreprise ou démarrer mes démarches.
              </p>
            </div>

            <!-- Carte 4 : J'aimerais parler à quelqu'un -->
            <div
              (click)="selectNeed('TALK')"
              [class.border-[#7C3AED]]="selectedNeedId === 'TALK'"
              [class.ring-2]="selectedNeedId === 'TALK'"
              [class.ring-[#7C3AED]]="selectedNeedId === 'TALK'"
              [class.bg-[#FAF8FF]]="selectedNeedId === 'TALK'"
              class="rounded-3xl border-2 border-[#E4E0F5] p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[150px] relative hover:border-[#7C3AED]/40 hover:shadow-xs group"
            >
              <span
                *ngIf="selectedNeedId === 'TALK'"
                class="absolute top-3.5 right-3.5 h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shadow-xs"
              >
                ✓
              </span>

              <div class="h-12 w-12 rounded-full bg-[#F3EFFE] text-[#7C3AED] flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition">
                💬
              </div>
              <h3 class="font-extrabold text-sm sm:text-base text-[#0F1035] leading-snug">
                J'aimerais parler à quelqu'un
              </h3>
              <p class="text-[11px] text-[#6B7280] mt-1">
                J'ai des questions et je préfère un échange humain.
              </p>
            </div>
          </div>

          <!-- Bouton principal : Trouver une aide adaptée -->
          <div class="pt-4">
            <button
              type="button"
              (click)="proceedToScreen2()"
              [disabled]="!selectedNeedId"
              class="w-full rounded-full bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base py-4 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Trouver une aide adaptée</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉCRAN 2 : TROUVER LES STRUCTURES ADAPTÉES (Maquette 2 officielle)  -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="activeScreen === 2" class="space-y-6 animate-fadeIn">
        
        <!-- En-tête : Bouton retour & Titre dynamique -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="activeScreen = 1"
            class="h-10 w-10 rounded-full border border-[#D8DCF0] bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-bold text-[#0F1035] transition cursor-pointer shadow-2xs"
            title="Revenir au choix du besoin"
          >
            ←
          </button>

          <div class="flex items-center gap-3">
            <div class="h-11 w-11 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-xl font-bold border border-[#E9D5FF] shrink-0">
              🧭
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-[#0F1035] tracking-tight">
                Les aides qui peuvent t'aider
              </h2>
              <p class="text-xs sm:text-sm text-[#42466B] font-semibold">
                {{ getNeedSubtitle() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Pilules de Filtres rapides (Nice, 10 km, Gratuit) -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Filtre Ville -->
          <div class="relative">
            <select
              [(ngModel)]="searchCity"
              class="rounded-full bg-white border border-[#D8DCF0] px-4 py-2 text-xs font-bold text-[#0F1035] appearance-none pr-8 cursor-pointer shadow-2xs outline-none focus:border-[#7C3AED]"
            >
              <option value="Nice">📍 Nice</option>
              <option value="Antibes">📍 Antibes</option>
              <option value="Cannes">📍 Cannes</option>
              <option value="Grasse">📍 Grasse</option>
              <option value="ALL">📍 Tout le 06</option>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
          </div>

          <!-- Filtre Rayon -->
          <div class="relative">
            <select
              [(ngModel)]="searchRadiusKm"
              class="rounded-full bg-white border border-[#D8DCF0] px-4 py-2 text-xs font-bold text-[#0F1035] appearance-none pr-8 cursor-pointer shadow-2xs outline-none focus:border-[#7C3AED]"
            >
              <option [value]="5">🎯 5 km</option>
              <option [value]="10">🎯 10 km</option>
              <option [value]="20">🎯 20 km</option>
              <option [value]="50">🎯 50 km</option>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
          </div>

          <!-- Badge Gratuit (Actif violette/lilas) -->
          <button
            type="button"
            (click)="filterOnlyFree = !filterOnlyFree"
            [class]="filterOnlyFree ? 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]' : 'bg-white text-gray-500 border-[#D8DCF0]'"
            class="rounded-full border px-4 py-2 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <span>🏷️</span>
            <span>Gratuit</span>
          </button>
        </div>

        <!-- Liste des Cartes de Structures Vérifiées (Fidèle à la Maquette 2) -->
        <div class="space-y-4">
          <div
            *ngFor="let org of filteredOrganismes"
            class="rounded-3xl bg-white border border-[#E4E0F5] p-5 sm:p-6 shadow-xs hover:shadow-md transition space-y-4"
          >
            <!-- Ligne titre & badge Gratuit -->
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3.5">
                <div class="h-12 w-12 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-2xl font-bold shrink-0 border border-[#E9D5FF]">
                  {{ org.icon }}
                </div>
                <div class="space-y-1">
                  <h3 class="text-base sm:text-lg font-black text-[#0F1035] leading-snug">
                    {{ org.name }}
                  </h3>
                  <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed max-w-xl">
                    {{ org.description }}
                  </p>
                </div>
              </div>

              <!-- Badge vert Gratuit -->
              <span class="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 text-xs font-black shrink-0">
                Gratuit
              </span>
            </div>

            <!-- Adresse & Vérification -->
            <div class="flex items-center gap-1.5 text-xs font-semibold text-[#42466B] pl-0.5">
              <span>📍</span>
              <span>{{ org.city }} — {{ org.address }}</span>
              <span class="text-emerald-600 font-extrabold flex items-center gap-0.5 ml-1">
                <span>✓</span>
                <span>adresse vérifiée</span>
              </span>
            </div>

            <!-- Tiroir Coordonnées dépliable -->
            <div *ngIf="expandedOrgId === org.id" class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-2 text-xs text-[#0F1035] animate-fadeIn">
              <p *ngIf="org.phone"><strong>📞 Téléphone :</strong> <a [href]="'tel:' + org.phone" class="text-[#7C3AED] font-bold hover:underline">{{ org.phone }}</a></p>
              <p *ngIf="org.email"><strong>✉️ Email :</strong> <a [href]="'mailto:' + org.email" class="text-[#7C3AED] font-bold hover:underline">{{ org.email }}</a></p>
              <p *ngIf="org.websiteUrl"><strong>🌐 Site officiel :</strong> <a [href]="org.websiteUrl" target="_blank" class="text-[#7C3AED] font-bold hover:underline">Visiter le site officiel ↗</a></p>
            </div>

            <!-- Deux Boutons d'action horizontaux -->
            <div class="flex flex-wrap items-center gap-2.5 pt-1">
              <!-- Bouton Préparer le contact (Violet) -->
              <button
                type="button"
                (click)="proceedToScreen3(org)"
                class="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs px-5 py-2.5 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>💬</span>
                <span>Préparer le contact</span>
              </button>

              <!-- Bouton Coordonnées (Blanc bordé) -->
              <button
                type="button"
                (click)="toggleOrgDetails(org.id)"
                class="rounded-full border border-[#D8DCF0] bg-white hover:bg-gray-50 text-[#0F1035] font-extrabold text-xs px-4 py-2.5 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>📞</span>
                <span>{{ expandedOrgId === org.id ? 'Masquer coordonnées' : 'Coordonnées' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Bouton bas : Voir toutes les structures & Sources vérifiées -->
        <div class="text-center pt-2 space-y-3">
          <button
            type="button"
            (click)="showAllStructures = !showAllStructures"
            class="rounded-full border border-[#D8DCF0] bg-white hover:bg-gray-50 text-[#7C3AED] font-extrabold text-xs sm:text-sm px-6 py-3 transition inline-flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>Voir toutes les structures</span>
            <span>→</span>
          </button>

          <p class="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1.5">
            <span>🛡️</span>
            <span>Sources vérifiées par l'Éducation nationale et les services publics</span>
          </p>
        </div>

      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉCRAN 3 : PRÉPARER MON PREMIER CONTACT (Maquette 3 officielle)     -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="activeScreen === 3 && selectedOrg" class="space-y-6 animate-fadeIn">
        
        <!-- En-tête : Bouton retour & Titre de contact -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="activeScreen = 2"
            class="h-10 w-10 rounded-full border border-[#D8DCF0] bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-bold text-[#0F1035] transition cursor-pointer shadow-2xs"
            title="Revenir aux structures"
          >
            ←
          </button>

          <div class="flex items-center gap-3">
            <div class="h-11 w-11 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-xl font-bold border border-[#E9D5FF] shrink-0">
              ✉️
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-[#0F1035] tracking-tight">
                Préparer mon premier contact
              </h2>
              <p class="text-xs sm:text-sm text-[#42466B] font-semibold">
                Pas besoin de savoir quoi dire. Choisis comment tu préfères contacter {{ selectedOrg.name }}.
              </p>
            </div>
          </div>
        </div>

        <!-- 3 Modes de contact sélectionnables (Fidèle à la Maquette 3) -->
        <div class="space-y-2.5">
          <!-- Mode 1 : Écrire un email -->
          <div
            (click)="contactMode = 'EMAIL'"
            [class.border-[#7C3AED]]="contactMode === 'EMAIL'"
            [class.ring-2]="contactMode === 'EMAIL'"
            [class.ring-[#7C3AED]]="contactMode === 'EMAIL'"
            class="rounded-2xl bg-white border border-[#E4E0F5] p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
          >
            <div class="flex items-center gap-3">
              <span class="text-lg text-[#7C3AED]">✉️</span>
              <span class="font-extrabold text-sm text-[#0F1035]">Écrire un email</span>
            </div>
            <span class="h-5 w-5 rounded-full flex items-center justify-center text-xs font-black" [class.bg-[#7C3AED]]="contactMode === 'EMAIL'" [class.text-white]="contactMode === 'EMAIL'" [class.border]="contactMode !== 'EMAIL'" [class.border-gray-300]="contactMode !== 'EMAIL'">
              {{ contactMode === 'EMAIL' ? '✓' : '' }}
            </span>
          </div>

          <!-- Mode 2 : Préparer un appel -->
          <div
            (click)="contactMode = 'CALL'"
            [class.border-[#7C3AED]]="contactMode === 'CALL'"
            [class.ring-2]="contactMode === 'CALL'"
            [class.ring-[#7C3AED]]="contactMode === 'CALL'"
            class="rounded-2xl bg-white border border-[#E4E0F5] p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
          >
            <div class="flex items-center gap-3">
              <span class="text-lg text-[#7C3AED]">📞</span>
              <span class="font-extrabold text-sm text-[#0F1035]">Préparer un appel</span>
            </div>
            <span class="h-5 w-5 rounded-full flex items-center justify-center text-xs font-black" [class.bg-[#7C3AED]]="contactMode === 'CALL'" [class.text-white]="contactMode === 'CALL'" [class.border]="contactMode !== 'CALL'" [class.border-gray-300]="contactMode !== 'CALL'">
              {{ contactMode === 'CALL' ? '✓' : '' }}
            </span>
          </div>

          <!-- Mode 3 : M'entraîner avec le Coach IA -->
          <div
            (click)="contactMode = 'COACH'"
            [class.border-[#7C3AED]]="contactMode === 'COACH'"
            [class.ring-2]="contactMode === 'COACH'"
            [class.ring-[#7C3AED]]="contactMode === 'COACH'"
            class="rounded-2xl bg-white border border-[#E4E0F5] p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
          >
            <div class="flex items-center gap-3">
              <span class="text-lg text-[#7C3AED]">✨</span>
              <span class="font-extrabold text-sm text-[#0F1035]">M'entraîner avec le Coach IA</span>
            </div>
            <span class="h-5 w-5 rounded-full flex items-center justify-center text-xs font-black" [class.bg-[#7C3AED]]="contactMode === 'COACH'" [class.text-white]="contactMode === 'COACH'" [class.border]="contactMode !== 'COACH'" [class.border-gray-300]="contactMode !== 'COACH'">
              {{ contactMode === 'COACH' ? '✓' : '' }}
            </span>
          </div>
        </div>

        <!-- Boîte de contenu adaptée au mode choisi -->
        <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          
          <!-- Si Mode EMAIL : Exemple de message (Exactement la maquette 3) -->
          <div *ngIf="contactMode === 'EMAIL'" class="space-y-3 animate-fadeIn">
            <h3 class="font-extrabold text-sm text-[#0F1035] flex items-center gap-2">
              <span class="text-base text-[#7C3AED]">💬</span>
              <span>Exemple de message</span>
            </h3>

            <div class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] text-xs sm:text-sm text-[#0F1035] leading-relaxed font-medium">
              {{ generatedEmailMessage }}
            </div>

            <!-- Deux Boutons d'action : Copier le message & Continuer -->
            <div class="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                (click)="copyMessage()"
                class="rounded-full border border-[#D8DCF0] bg-white hover:bg-gray-50 text-[#0F1035] font-extrabold text-xs px-5 py-3 transition flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>📋</span>
                <span>{{ copiedMessage ? '✓ Message copié !' : 'Copier le message' }}</span>
              </button>

              <button
                type="button"
                (click)="openEmailClient()"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm px-6 py-3 shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Continuer</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- Si Mode CALL : Script téléphonique -->
          <div *ngIf="contactMode === 'CALL'" class="space-y-3 animate-fadeIn">
            <h3 class="font-extrabold text-sm text-[#0F1035] flex items-center gap-2">
              <span class="text-base text-[#7C3AED]">📞</span>
              <span>Script d'appel téléphonique</span>
            </h3>

            <div class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] text-xs sm:text-sm text-[#0F1035] space-y-2 leading-relaxed">
              <p><strong>1. Saluer et se présenter :</strong> "Bonjour, je m'appelle Emma. J'habite à Nice et je prépare mes choix d'orientation."</p>
              <p><strong>2. Exprimer le besoin :</strong> "J'aimerais savoir s'il est possible de rencontrer un conseiller ou de prendre un rendez-vous gratuit dans votre structure ?"</p>
              <p><strong>3. Noter la réponse :</strong> Note le jour et l'heure proposés, ou le numéro direct de la personne à rappeler.</p>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                (click)="copyCallScript()"
                class="rounded-full border border-[#D8DCF0] bg-white hover:bg-gray-50 text-[#0F1035] font-extrabold text-xs px-5 py-3 transition flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>📋</span>
                <span>{{ copiedCall ? '✓ Script copié !' : 'Copier le script' }}</span>
              </button>

              <a
                *ngIf="selectedOrg.phone"
                [href]="'tel:' + selectedOrg.phone"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm px-6 py-3 shadow-md transition inline-flex items-center gap-2"
              >
                <span>📞 Appeler ({{ selectedOrg.phone }})</span>
              </a>
            </div>
          </div>

          <!-- Si Mode COACH : Passerelle vers l'entraînement IA -->
          <div *ngIf="contactMode === 'COACH'" class="space-y-3 animate-fadeIn">
            <h3 class="font-extrabold text-sm text-[#0F1035] flex items-center gap-2">
              <span class="text-base text-[#7C3AED]">✨</span>
              <span>S'entraîner avec le Coach IA</span>
            </h3>

            <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
              Le Coach IA simule un accueil téléphonique bienveillant du {{ selectedOrg.name }} pour que tu puisses t'entraîner sans stress avant d'appeler en vrai.
            </p>

            <button
              type="button"
              (click)="openCoachTraining()"
              class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm px-6 py-3 shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Démarrer l'entraînement Coach IA</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- Bloc « Mes démarches » avec Barre de Progression (Maquette 3 officielle) -->
        <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-lg text-[#7C3AED]">📋</span>
            <h3 class="font-extrabold text-sm sm:text-base text-[#0F1035]">
              Mes démarches
            </h3>
          </div>

          <!-- 4 Étapes de démarches -->
          <div class="space-y-3 text-xs sm:text-sm">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="step1Done"
                (change)="persistSteps()"
                class="h-5 w-5 accent-[#7C3AED] rounded-md cursor-pointer"
              />
              <span [class.line-through]="step1Done" [class.text-gray-400]="step1Done" class="font-semibold text-[#0F1035]">
                J'ai trouvé une structure qui peut m'aider
              </span>
            </label>

            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="step2Done"
                (change)="persistSteps()"
                class="h-5 w-5 accent-[#7C3AED] rounded-md cursor-pointer"
              />
              <span [class.line-through]="step2Done" [class.text-gray-400]="step2Done" class="font-semibold text-[#0F1035]">
                J'ai préparé mon message
              </span>
            </label>

            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="step3Done"
                (change)="persistSteps()"
                class="h-5 w-5 accent-[#7C3AED] rounded-md cursor-pointer"
              />
              <span [class.line-through]="step3Done" [class.text-gray-400]="step3Done" class="font-semibold text-[#0F1035]">
                J'ai pris contact
              </span>
            </label>

            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="step4Done"
                (change)="persistSteps()"
                class="h-5 w-5 accent-[#7C3AED] rounded-md cursor-pointer"
              />
              <span [class.line-through]="step4Done" [class.text-gray-400]="step4Done" class="font-semibold text-[#0F1035]">
                J'ai noté la prochaine étape
              </span>
            </label>
          </div>

          <!-- Jauge de progression calculée (ex: 2 sur 4 étapes réalisées) -->
          <div class="pt-2 space-y-1.5 border-t border-[#F0EDFA]">
            <p class="font-black text-xs text-[#0F1035]">
              {{ getCompletedCount() }} sur 4 étapes réalisées
            </p>
            <div class="h-2.5 w-full bg-[#E4E0F5] rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] rounded-full transition-all duration-300"
                [style.width.%]="(getCompletedCount() / 4) * 100"
              ></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class SupportDirectoryComponent implements OnInit {
  @Input() resources: UISupportResource[] = INITIAL_SUPPORT_RESOURCES;
  @Output() goToImmersion = new EventEmitter<void>();
  @Output() navigateToCoach = new EventEmitter<string>();

  // Machine à états : Écran 1, 2 ou 3
  activeScreen: 1 | 2 | 3 = 1;

  // Écran 1 : Besoin choisi
  selectedNeedId: SupportNeedId | null = 'UNKNOWN';

  // Écran 2 : Filtres
  searchCity: string = 'Nice';
  searchRadiusKm: number = 10;
  filterOnlyFree: boolean = true;
  expandedOrgId: string | null = null;
  showAllStructures: boolean = false;

  // Organisme sélectionné pour l'Écran 3
  selectedOrg: UISupportResource | null = null;

  // Écran 3 : Modes de contact
  contactMode: ContactModeId = 'EMAIL';
  copiedMessage = false;
  copiedCall = false;

  // Démarches persistées
  step1Done = true;
  step2Done = true;
  step3Done = false;
  step4Done = false;

  generatedEmailMessage = `Bonjour,\n\nJe cherche des conseils pour mon orientation et j’aimerais savoir comment rencontrer un professionnel de votre structure.\n\nPourriez-vous m’indiquer les démarches à suivre ?\n\nMerci.`;

  ngOnInit(): void {
    if (this.resources && this.resources.length > 0) {
      this.selectedOrg = this.resources[0];
    }
    this.loadPersistedSteps();
  }

  selectNeed(need: SupportNeedId): void {
    this.selectedNeedId = need;
  }

  proceedToScreen2(): void {
    this.activeScreen = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  proceedToScreen3(org: UISupportResource): void {
    this.selectedOrg = org;
    this.updateEmailDraft(org);
    this.activeScreen = 3;
    this.step1Done = true;
    this.step2Done = true;
    this.persistSteps();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getNeedSubtitle(): string {
    switch (this.selectedNeedId) {
      case 'UNKNOWN':
        return 'Pour parler de ton orientation';
      case 'TRAINING':
        return 'Pour trouver une formation';
      case 'JOB_INTERNSHIP':
        return 'Pour trouver un stage ou un emploi';
      case 'TALK':
        return 'Pour échanger avec un conseiller';
      default:
        return 'Pour avancer dans tes démarches';
    }
  }

  get filteredOrganismes(): UISupportResource[] {
    let list = this.resources;

    // Si pas toutes les structures demandées, filtrer par pertinence du besoin
    if (!this.showAllStructures && this.selectedNeedId) {
      if (this.selectedNeedId === 'UNKNOWN' || this.selectedNeedId === 'TALK') {
        list = list.filter((r) => r.category === 'CIO' || r.category === 'MISSION_LOCALE');
      } else if (this.selectedNeedId === 'TRAINING') {
        list = list.filter((r) => r.category === 'CIO' || r.category === 'SCHOOL' || r.category === 'NATIONAL_PORTAL');
      } else if (this.selectedNeedId === 'JOB_INTERNSHIP') {
        list = list.filter((r) => r.category === 'MISSION_LOCALE' || r.category === 'NATIONAL_PORTAL');
      }
    }

    // Filtrer par ville
    if (this.searchCity !== 'ALL') {
      const q = this.searchCity.toLowerCase();
      list = list.filter((r) => !r.city || r.city.toLowerCase().includes(q));
    }

    return list;
  }

  toggleOrgDetails(orgId: string): void {
    this.expandedOrgId = this.expandedOrgId === orgId ? null : orgId;
  }

  private updateEmailDraft(org: UISupportResource): void {
    this.generatedEmailMessage = `Bonjour,\n\nJe m'appelle Emma et j'habite à Nice. Je cherche des conseils pour mon orientation et j’aimerais savoir comment rencontrer un professionnel de votre structure (${org.name}).\n\nPourriez-vous m’indiquer les démarches à suivre ou les créneaux d'accueil sans rendez-vous ?\n\nMerci beaucoup pour votre aide.\n\nCordialement,\nEmma D.`;
  }

  copyMessage(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.generatedEmailMessage);
    }
    this.copiedMessage = true;
    setTimeout(() => (this.copiedMessage = false), 3000);
  }

  copyCallScript(): void {
    const script = `Bonjour, je m'appelle Emma. J'habite à Nice et je cherche des conseils pour mon orientation. Est-ce que je peux prendre rendez-vous avec un conseiller chez vous ?`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(script);
    }
    this.copiedCall = true;
    setTimeout(() => (this.copiedCall = false), 3000);
  }

  openEmailClient(): void {
    if (this.selectedOrg?.email) {
      window.location.href = `mailto:${this.selectedOrg.email}?subject=Demande d'orientation — MonBilan+&body=${encodeURIComponent(this.generatedEmailMessage)}`;
    } else {
      this.copyMessage();
    }
  }

  openCoachTraining(): void {
    const orgName = this.selectedOrg?.name || 'du CIO de Nice';
    this.navigateToCoach.emit(`Je souhaite m'entraîner à appeler un conseiller ${orgName}. Peux-tu simuler l'accueil et me poser les questions habituelles pour m'aider à bien exprimer mon besoin ?`);
  }

  getCompletedCount(): number {
    return [this.step1Done, this.step2Done, this.step3Done, this.step4Done].filter(Boolean).length;
  }

  persistSteps(): void {
    try {
      localStorage.setItem('monbilan_young_support_steps', JSON.stringify({
        step1: this.step1Done,
        step2: this.step2Done,
        step3: this.step3Done,
        step4: this.step4Done
      }));
    } catch {}
  }

  private loadPersistedSteps(): void {
    try {
      const stored = localStorage.getItem('monbilan_young_support_steps');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.step1Done = parsed.step1 ?? true;
        this.step2Done = parsed.step2 ?? true;
        this.step3Done = parsed.step3 ?? false;
        this.step4Done = parsed.step4 ?? false;
      }
    } catch {}
  }
}
