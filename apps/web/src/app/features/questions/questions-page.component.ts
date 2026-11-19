// ============================================================================
// MonBilan+ — Composant « Mes questions »
// Reproduction fidèle de la maquette officielle :
// - En-tête avec titre, description et recherche rapide (⌘K)
// - Bandeau violet héro avec les 3 indicateurs dynamiques :
//   * 5 questions
//   * 1 réponse
//   * 3 sélectionnées pour le rendez-vous
// - 3 onglets complets :
//   1. Mes questions (Liste filtrable, accordéon réponse conseiller, sélection RDV)
//   2. Préparer mon échange (Synthèse RDV du 18 nov., export PDF, partage conseiller)
//   3. Mes notes & idées (Carnet personnel, conversion en question)
// - 3 blocs latéraux (Prochain RDV, Fiche de préparation PDF, Aide Coach IA)
// - Modale d'ajout/modification avec assistant de formulation IA
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';

export type QuestionCategory =
  | 'Métiers'
  | 'Parcours'
  | 'Conditions'
  | 'Compétences'
  | 'Suite'
  | 'Formations'
  | 'Immersion'
  | 'Autre';

export type CommunicationStatus = 'PRIVATE' | 'SHARED' | 'ANSWERED';
export type FollowUpStatus = 'TO_DISCUSS' | 'NEEDS_FOLLOW_UP' | 'RESOLVED';

export interface QuestionItem {
  id: string;
  category: QuestionCategory;
  categoryTagClass: string;
  questionText: string;
  relatedTopic?: string;
  selectedForMeeting: boolean;
  communicationStatus: CommunicationStatus;
  followUpStatus: FollowUpStatus;
  followUpStatusLabel: string;
  followUpStatusClass: string;
  createdAt: string;
  counselorReply?: {
    counselorName: string;
    publishedAt: string;
    text: string;
  } | null;
  expanded?: boolean;
}

export interface PersonalJournalNote {
  id: string;
  content: string;
  careerTitle?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-questions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MbIconComponent],
  template: `
    <div class="space-y-6 pb-12">
      <!-- ================================================================== -->
      <!-- 1. EN-TÊTE DE PAGE : TITRE, DESCRIPTION ET RECHERCHE               -->
      <!-- ================================================================== -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-[#7C3AED] shrink-0 mt-0.5 shadow-2xs">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] tracking-tight">
              Mes questions
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 font-medium">
              Note tes questions, prépare ton échange et avance avec ton conseiller.
            </p>
          </div>
        </div>

        <!-- Recherche globale -->
        <div class="relative w-full md:w-84">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Rechercher une question, un métier..."
            class="w-full pl-9 pr-12 py-2.5 rounded-full bg-white border border-[#E4E0F5] text-xs font-semibold text-[#0F1035] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 shadow-2xs"
          />
          <span class="absolute left-3 top-3 text-gray-400 text-xs">🔍</span>
          <span class="absolute right-3 top-2.5 px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-500">⌘K</span>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. BANDEAU PRINCIPAL HERO + 3 INDICATEURS DYNAMIQUES               -->
      <!-- ================================================================== -->
      <div class="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-[#1E1145] via-[#431B7E] to-[#6D28D9] text-white p-6 sm:p-8 shadow-md">
        <div class="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="max-w-md space-y-2">
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tes questions méritent des réponses.
            </h2>
            <p class="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
              Note ce qui te préoccupe, prépare ton échange et avance avec ton conseiller.
            </p>
          </div>

          <!-- 3 Cartes d'indicateurs dynamiques -->
          <div class="grid grid-cols-3 gap-3 shrink-0">
            <!-- 1. Total questions -->
            <div class="rounded-2xl bg-white p-3.5 sm:p-4 text-center text-[#0F1035] shadow-sm min-w-[90px] sm:min-w-[110px] space-y-1">
              <div class="text-lg sm:text-xl text-[#7C3AED] leading-none">💬</div>
              <div class="text-xl sm:text-2xl font-black text-[#0F1035] leading-none">{{ questionsList.length }}</div>
              <div class="text-[10px] sm:text-[11px] font-bold text-gray-500">questions</div>
            </div>

            <!-- 2. Réponses reçues -->
            <div class="rounded-2xl bg-white p-3.5 sm:p-4 text-center text-[#0F1035] shadow-sm min-w-[90px] sm:min-w-[110px] space-y-1">
              <div class="text-lg sm:text-xl text-emerald-600 leading-none">✓</div>
              <div class="text-xl sm:text-2xl font-black text-[#0F1035] leading-none">{{ answeredCount }}</div>
              <div class="text-[10px] sm:text-[11px] font-bold text-gray-500">réponse{{ answeredCount > 1 ? 's' : '' }}</div>
            </div>

            <!-- 3. Sélectionnées RDV -->
            <div class="rounded-2xl bg-white p-3.5 sm:p-4 text-center text-[#0F1035] shadow-sm min-w-[90px] sm:min-w-[110px] space-y-1">
              <div class="text-lg sm:text-xl text-[#7C3AED] leading-none">📅</div>
              <div class="text-xl sm:text-2xl font-black text-[#0F1035] leading-none">{{ selectedForMeetingCount }}</div>
              <div class="text-[9px] sm:text-[10px] font-bold text-gray-500 leading-tight">sélectionnées pour le rdv</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 3. BARRE DE NAVIGATION DES 3 ONGLETS                               -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
        <button
          type="button"
          (click)="activeTab = 'QUESTIONS'"
          [class]="activeTab === 'QUESTIONS'
            ? 'bg-[#7C3AED] text-white shadow-md font-extrabold'
            : 'bg-white border border-[#E4E0F5] text-[#42466B] hover:bg-[#F8F7FF] font-semibold'"
          class="py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>💬</span>
          <span>Mes questions ({{ questionsList.length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab = 'MEETING'"
          [class]="activeTab === 'MEETING'
            ? 'bg-[#7C3AED] text-white shadow-md font-extrabold'
            : 'bg-white border border-[#E4E0F5] text-[#42466B] hover:bg-[#F8F7FF] font-semibold'"
          class="py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>📅</span>
          <span>Préparer mon échange</span>
        </button>

        <button
          type="button"
          (click)="activeTab = 'NOTES'"
          [class]="activeTab === 'NOTES'
            ? 'bg-[#7C3AED] text-white shadow-md font-extrabold'
            : 'bg-white border border-[#E4E0F5] text-[#42466B] hover:bg-[#F8F7FF] font-semibold'"
          class="py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>📝</span>
          <span>Mes notes & idées</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 1 : MES QUESTIONS ENREGISTRÉES                                 -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'QUESTIONS'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Colonne gauche (7/12) : Liste des questions -->
        <div class="lg:col-span-7 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
            <div class="flex items-center gap-2">
              <span class="text-base text-[#7C3AED]">💬</span>
              <h3 class="text-base font-extrabold text-[#0F1035]">
                Mes questions enregistrées
              </h3>
            </div>

            <!-- Filtre par catégorie -->
            <select
              [(ngModel)]="selectedCategoryFilter"
              class="rounded-xl border border-[#E4E0F5] bg-[#F8F7FF] px-3 py-1.5 text-xs font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            >
              <option value="ALL">Toutes les catégories</option>
              <option value="Métiers">Métiers</option>
              <option value="Parcours">Parcours</option>
              <option value="Conditions">Conditions</option>
              <option value="Compétences">Compétences</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          <!-- Liste des cartes questions -->
          <div class="space-y-3">
            <div
              *ngFor="let q of filteredQuestions"
              class="rounded-2xl border transition overflow-hidden"
              [ngClass]="q.selectedForMeeting ? 'border-purple-200 bg-[#FAF8FF]' : 'border-[#E4E0F5] bg-white hover:border-[#7C3AED]/40'"
            >
              <!-- Ligne principale -->
              <div class="p-3.5 flex items-center justify-between gap-3 cursor-pointer" (click)="toggleAccordion(q)">
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Case à cocher pour sélection au prochain RDV -->
                  <button
                    type="button"
                    (click)="toggleSelectForMeeting(q, $event)"
                    class="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition shrink-0 cursor-pointer"
                    [ngClass]="q.selectedForMeeting ? 'bg-[#7C3AED] text-white shadow-xs' : 'border-2 border-gray-300 hover:border-[#7C3AED] bg-white'"
                  >
                    <span *ngIf="q.selectedForMeeting">✓</span>
                  </button>

                  <!-- Badge Catégorie -->
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold shrink-0" [ngClass]="q.categoryTagClass">
                    {{ q.category }}
                  </span>

                  <!-- Texte de la question -->
                  <span class="text-xs sm:text-sm font-bold text-[#0F1035] truncate">
                    {{ q.questionText }}
                  </span>
                </div>

                <!-- Statut + Chevron -->
                <div class="flex items-center gap-2 shrink-0">
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold" [ngClass]="q.followUpStatusClass">
                    {{ q.followUpStatusLabel }}
                  </span>
                  <span class="text-gray-400 text-xs font-bold transition-transform" [ngClass]="q.expanded ? 'rotate-180' : ''">
                    {{ q.expanded ? '∧' : '›' }}
                  </span>
                </div>
              </div>

              <!-- Bloc Accordéon déplié (Réponse du conseiller ou détails) -->
              <div *ngIf="q.expanded" class="p-4 bg-purple-50/50 border-t border-purple-100 space-y-3 text-xs">
                <!-- Réponse du conseiller si existante -->
                <div *ngIf="q.counselorReply" class="p-3 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-1.5">
                  <div class="flex items-center justify-between text-[11px] font-extrabold text-[#7C3AED]">
                    <div class="flex items-center gap-1.5">
                      <span>💬</span>
                      <span>Réponse du conseiller ({{ q.counselorReply.counselorName }})</span>
                    </div>
                    <span class="text-gray-400 font-medium">{{ q.counselorReply.publishedAt }}</span>
                  </div>
                  <p class="text-xs text-[#0F1035] font-medium leading-relaxed">
                    {{ q.counselorReply.text }}
                  </p>
                </div>

                <!-- Actions sur la question -->
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] text-gray-500 font-medium">
                    Sujet lié : {{ q.relatedTopic || 'Général' }}
                  </span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="openEditModal(q, $event)"
                      class="px-2.5 py-1 rounded-lg text-xs font-bold text-[#7C3AED] hover:bg-purple-100 transition cursor-pointer"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      (click)="deleteQuestion(q.id, $event)"
                      class="px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bas de liste : Ajouter + Compteur sélectionnés -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F0EDFA]">
            <button
              type="button"
              (click)="openAddModal()"
              class="px-5 py-2.5 rounded-full border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>+</span>
              <span>Ajouter une question</span>
            </button>

            <span class="text-xs font-extrabold text-[#7C3AED] flex items-center gap-1.5">
              <span>☑</span>
              <span>{{ selectedForMeetingCount }} questions sélectionnées</span>
            </span>
          </div>
        </div>

        <!-- Colonne droite (5/12) : 3 Blocs d'accompagnement -->
        <div class="lg:col-span-5 space-y-5">
          <!-- Bloc 1 : Mon prochain rendez-vous (Maquette) -->
          <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-[#7C3AED]">📅</span>
                <span>Mon prochain rendez-vous</span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
                Confirmé
              </span>
            </div>

            <div class="flex items-center gap-4">
              <div class="rounded-2xl bg-[#F3EFFE] px-4 py-2.5 text-center shrink-0 border border-purple-100">
                <span class="text-[10px] font-bold text-[#6D28D9] block">MER</span>
                <span class="text-2xl font-black text-[#0F1035] leading-none">18</span>
                <span class="text-[10px] font-bold text-gray-500 block">NOV</span>
              </div>

              <div class="space-y-1 text-xs">
                <h4 class="font-extrabold text-[#0F1035] text-sm">Échange avec mon conseiller</h4>
                <p class="text-gray-500 font-medium">🕒 14h30 – 15h30</p>
                <p class="text-gray-500 font-medium">📍 Centre des Possibles (Nice)</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                (click)="activeTab = 'MEETING'"
                class="py-2.5 px-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs transition cursor-pointer text-center shadow-xs"
              >
                Préparer mon échange →
              </button>
              <button
                type="button"
                (click)="showRdvDetails = !showRdvDetails"
                class="py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-[#0F1035] font-bold text-xs transition cursor-pointer text-center"
              >
                {{ showRdvDetails ? 'Masquer' : 'Voir les détails' }}
              </button>
            </div>

            <div *ngIf="showRdvDetails" class="p-3 rounded-xl bg-purple-50 text-xs text-[#5B21B6] space-y-1 border border-purple-200">
              <div>Conseillère référente : <strong>Sophie M.</strong></div>
              <div>Objectif : Bilan d'étape, point sur l'immersion Peintre décorateur.</div>
            </div>
          </div>

          <!-- Bloc 2 : Ma fiche de préparation -->
          <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                  <span class="text-base text-blue-600">📄</span>
                  <span>Ma fiche de préparation</span>
                </div>
                <p class="text-xs text-gray-500 leading-relaxed font-medium">
                  Rassemble tes questions, notes et idées pour un échange efficace.
                </p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-xl shrink-0">
                📝
              </div>
            </div>

            <button
              type="button"
              (click)="downloadPreparationPdf()"
              class="w-full py-2.5 rounded-xl border border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>📥</span>
              <span>Générer ma fiche (PDF)</span>
            </button>
          </div>

          <!-- Bloc 3 : Besoin d'aide pour formuler une question ? -->
          <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                <svg class="w-5 h-5 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                  <circle cx="12" cy="5" r="2"></circle>
                  <path d="M12 7v4"></path>
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-[#0F1035]">Besoin d'aide pour formuler ?</h4>
                <p class="text-[11px] text-gray-500 font-medium">Le Coach IA peut t'aider à clarifier ta pensée.</p>
              </div>
            </div>

            <p class="text-xs text-gray-600 leading-relaxed font-medium">
              Tu ne sais pas comment poser ta question ? Le Coach IA t'aide à la formuler simplement et en toute bienveillance.
            </p>

            <button
              type="button"
              (click)="openCoachHelperModal()"
              class="w-full py-2.5 rounded-xl border border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Demander de l'aide au Coach IA →</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 2 : PRÉPARER MON ÉCHANGE                                       -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'MEETING'" class="space-y-6">
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EDFA]">
            <div>
              <h3 class="text-lg font-extrabold text-[#0F1035]">
                Fiche de préparation — RDV du Mercredi 18 novembre 2025
              </h3>
              <p class="text-xs text-gray-500 font-medium">
                Conseillère : Sophie M. • Lieu : Centre des Possibles (Nice)
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="downloadPreparationPdf()"
                class="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>📥 Télécharger PDF</span>
              </button>
              <button
                type="button"
                (click)="shareWithCounselor()"
                class="px-4 py-2 rounded-xl border border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>🤝 {{ sharedSuccess ? '✓ Transmis à Sophie M.' : 'Partager avec mon conseiller' }}</span>
              </button>
            </div>
          </div>

          <!-- Section 1 : Questions sélectionnées -->
          <div class="space-y-3">
            <h4 class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider flex items-center gap-2">
              <span>1. Questions prioritaires pour l'échange</span>
              <span class="text-purple-600 font-bold">({{ selectedForMeetingCount }})</span>
            </h4>

            <div class="space-y-2">
              <div
                *ngFor="let q of getSelectedQuestions(); let idx = index"
                class="p-3.5 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] flex items-center justify-between gap-3 text-xs"
              >
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="q.categoryTagClass">
                    {{ q.category }}
                  </span>
                  <span class="font-bold text-[#0F1035]">{{ q.questionText }}</span>
                </div>
                <button
                  type="button"
                  (click)="toggleSelectForMeeting(q, $event)"
                  class="text-gray-400 hover:text-red-600 text-xs font-bold cursor-pointer"
                >
                  Retirer
                </button>
              </div>
            </div>
          </div>

          <!-- Section 2 : Notes préparatoires -->
          <div class="space-y-2">
            <h4 class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider">
              2. Ce que j'aimerais expliquer à mon conseiller
            </h4>
            <textarea
              rows="4"
              [(ngModel)]="meetingNotes"
              placeholder="Ex : J'aimerais faire le point sur mon immersion en Peintre décorateur chez Atelier Décors & Patines Riviera et valider ma convention..."
              class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 text-xs sm:text-sm font-medium text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 3 : MES NOTES & IDÉES                                          -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'NOTES'" class="space-y-6">
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-[#F0EDFA]">
            <div>
              <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035]">Mon carnet personnel d'idées</h3>
              <p class="text-xs text-gray-500 font-medium">Tes réflexions sont privées par défaut (RGPD).</p>
            </div>
            <button
              type="button"
              (click)="openNewNoteModal()"
              class="px-4 py-2 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              + Nouvelle note
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              *ngFor="let n of notesList"
              class="rounded-2xl border border-[#E4E0F5] bg-[#FDFCFE] p-4 space-y-3 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between text-[11px] text-gray-400">
                  <span class="font-bold text-[#7C3AED]">{{ n.careerTitle || 'Réflexion générale' }}</span>
                  <span>{{ n.updatedAt }}</span>
                </div>
                <p class="text-xs sm:text-sm font-medium text-[#0F1035] leading-relaxed">
                  {{ n.content }}
                </p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-[#F0EDFA] text-xs">
                <button
                  type="button"
                  (click)="convertNoteToQuestion(n)"
                  class="text-[#7C3AED] hover:underline font-bold text-[11px] cursor-pointer"
                >
                  ➔ Convertir en question
                </button>
                <button
                  type="button"
                  (click)="deleteNote(n.id)"
                  class="text-red-500 hover:text-red-700 font-bold text-[11px] cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE : AJOUTER / MODIFIER UNE QUESTION                          -->
      <!-- ================================================================== -->
      <div *ngIf="showQuestionModal" class="fixed inset-0 z-50 bg-[#0F1035]/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="w-full max-w-lg rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
            <h3 class="text-base font-extrabold text-[#0F1035]">
              {{ editingQuestionId ? 'Modifier la question' : 'Ajouter une nouvelle question' }}
            </h3>
            <button type="button" (click)="showQuestionModal = false" class="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">
              ✕
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Catégorie *</label>
              <select
                [(ngModel)]="modalCategory"
                class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] px-3 py-2 font-semibold text-[#0F1035]"
              >
                <option value="Métiers">Métiers</option>
                <option value="Parcours">Parcours</option>
                <option value="Conditions">Conditions</option>
                <option value="Compétences">Compétences</option>
                <option value="Suite">Suite de mon projet</option>
                <option value="Formations">Formations</option>
                <option value="Immersion">Immersion</option>
              </select>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="font-bold text-gray-700">Ta question *</label>
                <button
                  type="button"
                  (click)="askCoachToReformulate()"
                  class="text-[11px] text-[#7C3AED] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>✨ Aide Coach IA</span>
                </button>
              </div>
              <textarea
                rows="3"
                [(ngModel)]="modalText"
                placeholder="Ex : Quelles sont les démarches pour valider ma convention ?"
                class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 font-semibold text-[#0F1035]"
              ></textarea>
            </div>

            <label class="flex items-center gap-2 p-2 rounded-xl bg-purple-50 text-[#6D28D9] font-bold cursor-pointer">
              <input type="checkbox" [(ngModel)]="modalSelectedForMeeting" class="text-[#7C3AED] rounded" />
              <span>Sélectionner pour mon prochain rendez-vous (18 nov.)</span>
            </label>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#F0EDFA]">
            <button
              type="button"
              (click)="showQuestionModal = false"
              class="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="saveQuestionModal()"
              [disabled]="!modalText.trim()"
              class="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE : AIDE COACH IA À LA FORMULATION                            -->
      <!-- ================================================================== -->
      <div *ngIf="showCoachHelper" class="fixed inset-0 z-50 bg-[#0F1035]/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="w-full max-w-md rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-2xl space-y-4">
          <div class="flex items-center gap-2 text-sm font-extrabold text-[#7C3AED]">
            <span>✨ Coach IA — Aide à la formulation</span>
          </div>

          <p class="text-xs text-gray-600 leading-relaxed font-medium">
            Voici une proposition de reformulation claire et positive pour ton conseiller :
          </p>

          <div class="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs font-bold text-[#5B21B6] leading-relaxed">
            « {{ coachSuggestion }} »
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              (click)="showCoachHelper = false"
              class="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 cursor-pointer"
            >
              Refuser
            </button>
            <button
              type="button"
              (click)="acceptCoachSuggestion()"
              class="px-5 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              Adopter cette question
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuestionsPageComponent implements OnInit {
  @Input() youngDisplayName: string = 'Emma D.';
  @Output() navigate = new EventEmitter<string>();

  activeTab: 'QUESTIONS' | 'MEETING' | 'NOTES' = 'QUESTIONS';
  searchQuery: string = '';
  selectedCategoryFilter: string = 'ALL';
  showRdvDetails: boolean = false;
  sharedSuccess: boolean = false;

  // Liste initiale des 5 questions de la maquette officielle
  questionsList: QuestionItem[] = [
    {
      id: 'q-1',
      category: 'Métiers',
      categoryTagClass: 'bg-purple-100 text-[#7C3AED]',
      questionText: 'Quelles formations pour devenir peintre décorateur ?',
      relatedTopic: 'Peintre décorateur',
      selectedForMeeting: true,
      communicationStatus: 'ANSWERED',
      followUpStatus: 'RESOLVED',
      followUpStatusLabel: '✓ Réponse reçue',
      followUpStatusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      createdAt: '10 nov. 2025',
      counselorReply: {
        counselorName: 'Sophie M.',
        publishedAt: '12 nov. 2025',
        text: 'Tu peux viser un CAP Peintre-applicateur de revêtements ou un Bac pro Aménagement et finition du bâtiment, souvent accessibles en alternance.'
      },
      expanded: true
    },
    {
      id: 'q-2',
      category: 'Parcours',
      categoryTagClass: 'bg-blue-100 text-blue-700',
      questionText: 'Existe-t-il des stages pour découvrir le métier de barista ?',
      relatedTopic: 'Barista',
      selectedForMeeting: true,
      communicationStatus: 'PRIVATE',
      followUpStatus: 'TO_DISCUSS',
      followUpStatusLabel: 'À poser',
      followUpStatusClass: 'bg-purple-100 text-[#7C3AED]',
      createdAt: '11 nov. 2025',
      counselorReply: null,
      expanded: false
    },
    {
      id: 'q-3',
      category: 'Conditions',
      categoryTagClass: 'bg-emerald-100 text-emerald-800',
      questionText: 'Quelles sont les conditions de travail d’un guide touristique ?',
      relatedTopic: 'Guide touristique',
      selectedForMeeting: false,
      communicationStatus: 'PRIVATE',
      followUpStatus: 'NEEDS_FOLLOW_UP',
      followUpStatusLabel: 'À approfondir',
      followUpStatusClass: 'bg-amber-100 text-amber-800',
      createdAt: '12 nov. 2025',
      counselorReply: null,
      expanded: false
    },
    {
      id: 'q-4',
      category: 'Compétences',
      categoryTagClass: 'bg-pink-100 text-pink-700',
      questionText: 'Quelles compétences dois-je encore développer ?',
      relatedTopic: 'Bilan général',
      selectedForMeeting: true,
      communicationStatus: 'SHARED',
      followUpStatus: 'TO_DISCUSS',
      followUpStatusLabel: 'Transmise',
      followUpStatusClass: 'bg-blue-100 text-blue-700',
      createdAt: '14 nov. 2025',
      counselorReply: null,
      expanded: false
    },
    {
      id: 'q-5',
      category: 'Suite',
      categoryTagClass: 'bg-orange-100 text-orange-800',
      questionText: 'Quelles sont les prochaines étapes après ce bilan ?',
      relatedTopic: 'Orientation',
      selectedForMeeting: false,
      communicationStatus: 'PRIVATE',
      followUpStatus: 'TO_DISCUSS',
      followUpStatusLabel: 'À poser',
      followUpStatusClass: 'bg-purple-100 text-[#7C3AED]',
      createdAt: '15 nov. 2025',
      counselorReply: null,
      expanded: false
    }
  ];

  // Notes personnelles pour le carnet
  notesList: PersonalJournalNote[] = [
    {
      id: 'n-1',
      content: 'J\'aime le côté créatif du métier de peintre décorateur, notamment la réalisation de décors et le travail en équipe.',
      careerTitle: 'Peintre décorateur',
      createdAt: '12 nov. 2025',
      updatedAt: '12 nov. 2025'
    },
    {
      id: 'n-2',
      content: 'Vérifier si le CFA du Bâtiment d\'Antibes propose des journées portes ouvertes pour la formation de peintre applicateur.',
      careerTitle: 'Formations',
      createdAt: '14 nov. 2025',
      updatedAt: '14 nov. 2025'
    }
  ];

  meetingNotes: string =
    'J\'aimerais faire le point sur mon immersion en Peintre décorateur chez Atelier Décors & Patines Riviera et valider ma convention pour les vacances de février.';

  // État Modale Question
  showQuestionModal: boolean = false;
  editingQuestionId: string | null = null;
  modalCategory: QuestionCategory = 'Métiers';
  modalText: string = '';
  modalSelectedForMeeting: boolean = true;

  // État Modale Coach IA
  showCoachHelper: boolean = false;
  coachSuggestion: string = '';

  ngOnInit(): void {
    this.loadPersistedData();
  }

  get answeredCount(): number {
    return this.questionsList.filter(q => q.counselorReply !== null && q.counselorReply !== undefined).length;
  }

  get selectedForMeetingCount(): number {
    return this.questionsList.filter(q => q.selectedForMeeting).length;
  }

  get filteredQuestions(): QuestionItem[] {
    return this.questionsList.filter(q => {
      const matchCat = this.selectedCategoryFilter === 'ALL' || q.category === this.selectedCategoryFilter;
      const matchSearch =
        !this.searchQuery.trim() ||
        q.questionText.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  getSelectedQuestions(): QuestionItem[] {
    return this.questionsList.filter(q => q.selectedForMeeting);
  }

  private loadPersistedData(): void {
    try {
      const saved = localStorage.getItem('monbilan_questions_list_2187');
      if (saved) {
        this.questionsList = JSON.parse(saved);
      }
      const savedNotes = localStorage.getItem('monbilan_meeting_notes_2187');
      if (savedNotes) {
        this.meetingNotes = savedNotes;
      }
    } catch {
      // Ignorer
    }
  }

  private persistData(): void {
    try {
      localStorage.setItem('monbilan_questions_list_2187', JSON.stringify(this.questionsList));
      localStorage.setItem('monbilan_meeting_notes_2187', this.meetingNotes);
    } catch {
      // Ignorer
    }
  }

  toggleAccordion(q: QuestionItem): void {
    q.expanded = !q.expanded;
  }

  toggleSelectForMeeting(q: QuestionItem, event: Event): void {
    event.stopPropagation();
    q.selectedForMeeting = !q.selectedForMeeting;
    this.persistData();
  }

  openAddModal(): void {
    this.editingQuestionId = null;
    this.modalCategory = 'Métiers';
    this.modalText = '';
    this.modalSelectedForMeeting = true;
    this.showQuestionModal = true;
  }

  openEditModal(q: QuestionItem, event: Event): void {
    event.stopPropagation();
    this.editingQuestionId = q.id;
    this.modalCategory = q.category;
    this.modalText = q.questionText;
    this.modalSelectedForMeeting = q.selectedForMeeting;
    this.showQuestionModal = true;
  }

  deleteQuestion(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Souhaites-tu vraiment supprimer cette question ?')) {
      this.questionsList = this.questionsList.filter(q => q.id !== id);
      this.persistData();
    }
  }

  saveQuestionModal(): void {
    if (!this.modalText.trim()) return;

    if (this.editingQuestionId) {
      const target = this.questionsList.find(q => q.id === this.editingQuestionId);
      if (target) {
        target.questionText = this.modalText.trim();
        target.category = this.modalCategory;
        target.categoryTagClass = this.getTagClassForCategory(this.modalCategory);
        target.selectedForMeeting = this.modalSelectedForMeeting;
      }
    } else {
      const newId = 'q-' + Date.now();
      this.questionsList.push({
        id: newId,
        category: this.modalCategory,
        categoryTagClass: this.getTagClassForCategory(this.modalCategory),
        questionText: this.modalText.trim(),
        selectedForMeeting: this.modalSelectedForMeeting,
        communicationStatus: 'PRIVATE',
        followUpStatus: 'TO_DISCUSS',
        followUpStatusLabel: 'À poser',
        followUpStatusClass: 'bg-purple-100 text-[#7C3AED]',
        createdAt: 'Aujourd\'hui',
        counselorReply: null,
        expanded: false
      });
    }

    this.persistData();
    this.showQuestionModal = false;
  }

  private getTagClassForCategory(cat: QuestionCategory): string {
    switch (cat) {
      case 'Métiers': return 'bg-purple-100 text-[#7C3AED]';
      case 'Parcours': return 'bg-blue-100 text-blue-700';
      case 'Conditions': return 'bg-emerald-100 text-emerald-800';
      case 'Compétences': return 'bg-pink-100 text-pink-700';
      case 'Suite': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  openCoachHelperModal(): void {
    this.coachSuggestion = 'Quelles sont les opportunités d’alternance et de stage pour découvrir concrètement ce métier sur le bassin niçois ?';
    this.showCoachHelper = true;
  }

  askCoachToReformulate(): void {
    if (!this.modalText.trim()) {
      this.coachSuggestion = 'Comment s’organise une semaine type dans ce métier et quelles compétences sont indispensables pour débuter ?';
    } else {
      this.coachSuggestion = `Pourriez-vous m’éclairer sur : « ${this.modalText.trim()} » et les étapes recommandées pour mon parcours ?`;
    }
    this.showCoachHelper = true;
  }

  acceptCoachSuggestion(): void {
    this.modalText = this.coachSuggestion;
    this.showCoachHelper = false;
  }

  downloadPreparationPdf(): void {
    const selected = this.getSelectedQuestions();
    let content = `MONBILAN+ — FICHE DE PRÉPARATION DE L'ÉCHANGE CONSEILLER\n`;
    content += `Bénéficiaire : ${this.youngDisplayName} (Dossier Rdv 2187)\n`;
    content += `Date du rendez-vous : Mercredi 18 novembre 2025 • 14h30 – 15h30\n`;
    content += `Lieu : Centre des Possibles (Nice) • Conseillère : Sophie M.\n\n`;
    content += `============================================================\n`;
    content += `1. QUESTIONS PRIORITAIRES POUR L'ÉCHANGE (${selected.length}) :\n`;
    content += `============================================================\n`;
    selected.forEach((q, idx) => {
      content += `${idx + 1}. [${q.category}] ${q.questionText}\n`;
      if (q.counselorReply) {
        content += `   ↳ Réponse précédente de ${q.counselorReply.counselorName} : ${q.counselorReply.text}\n`;
      }
    });
    content += `\n============================================================\n`;
    content += `2. NOTES PERSONNELLES ET POINTS À ABORDER :\n`;
    content += `============================================================\n`;
    content += `${this.meetingNotes}\n\n`;
    content += `Document édité le ${new Date().toLocaleDateString('fr-FR')} via la plateforme MonBilan+.\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Fiche_Preparation_RDV_${this.youngDisplayName.replace(' ', '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  shareWithCounselor(): void {
    if (confirm('Confirmez-vous la transmission de vos questions sélectionnées et de vos notes à votre conseillère Sophie M. ?')) {
      this.sharedSuccess = true;
      this.questionsList.forEach(q => {
        if (q.selectedForMeeting && q.communicationStatus === 'PRIVATE') {
          q.communicationStatus = 'SHARED';
          q.followUpStatusLabel = 'Transmise';
          q.followUpStatusClass = 'bg-blue-100 text-blue-700';
        }
      });
      this.persistData();
      alert('Vos questions et votre fiche ont été transmises avec succès à Sophie M. !');
    }
  }

  // Carnet personnel
  openNewNoteModal(): void {
    const text = prompt('Écris ta réflexion pour ton carnet personnel :');
    if (text && text.trim()) {
      this.notesList.unshift({
        id: 'n-' + Date.now(),
        content: text.trim(),
        careerTitle: 'Réflexion personnelle',
        createdAt: 'Aujourd\'hui',
        updatedAt: 'Aujourd\'hui'
      });
    }
  }

  deleteNote(id: string): void {
    if (confirm('Supprimer cette note ?')) {
      this.notesList = this.notesList.filter(n => n.id !== id);
    }
  }

  convertNoteToQuestion(note: PersonalJournalNote): void {
    this.modalText = note.content;
    this.modalCategory = 'Métiers';
    this.modalSelectedForMeeting = true;
    this.editingQuestionId = null;
    this.activeTab = 'QUESTIONS';
    this.showQuestionModal = true;
  }
}
