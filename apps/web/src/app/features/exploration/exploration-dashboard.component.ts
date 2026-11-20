// ============================================================================
// MonBilan+ — Composant « Mon parcours d'exploration »
// Reproduction fidèle de la maquette officielle :
// - En-tête avec titre, description et recherche rapide
// - Bandeau héros « Tu avances à ton rythme ! »
// - Module « Ma progression globale » (2/4 étapes calculées dynamiquement)
// - Module « Mes étapes d'exploration » (4 étapes interactives avec statut réel)
// - Module « Ma prochaine action » (Recommandation contextuelle + bouton)
// - Grille de 4 raccourcis directs (Mes métiers, Mes questions, Mes entraînements, Mes immersions)
// - Module « Mes métiers favoris » avec photos, coeurs et navigation fiche métier
// - Module « Mon carnet de découvertes » avec note personnelle et édition sécurisée
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { loadSavedDrafts, SavedDraft } from '../../shared/autonomous-data';

export interface ExplorationNote {
  id: string;
  careerTitle?: string;
  text: string;
  date: string;
  isPrivate: boolean;
}

export interface ExplorationStepItem {
  id: number;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  statusLabel: string;
  icon: string;
  routeTarget: string;
}

@Component({
  selector: 'app-exploration-dashboard',
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
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] tracking-tight">
              {{ journeyMode === 'AUTONOMOUS' ? 'Mon parcours' : "Mon parcours d'exploration" }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 font-medium">
              {{ journeyMode === 'AUTONOMOUS' ? 'Retrouve tes découvertes et avance à ton rythme.' : 'Retrouve tes découvertes, suis ta progression et prépare la suite avec ton conseiller.' }}
            </p>
          </div>
        </div>

        <!-- Recherche globale -->
        <div class="relative w-full md:w-80">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keydown.enter)="onSearch()"
            placeholder="Rechercher un métier, une formation..."
            class="w-full pl-9 pr-9 py-2.5 rounded-full bg-white border border-[#E4E0F5] text-xs font-semibold text-[#0F1035] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 shadow-2xs"
          />
          <span class="absolute left-3 top-3 text-gray-400 text-xs">🔍</span>
          <span class="absolute right-3 top-3 text-purple-400 text-xs cursor-pointer hover:text-[#7C3AED]" (click)="onSearch()">✨</span>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. RANGÉE SUPÉRIEURE : BANDEAU HERO + MA PROGRESSION GLOBALE        -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- 2.1 BANDEAU PRINCIPAL HERO (7/12) -->
        <div class="lg:col-span-7 relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-[#1E1145] via-[#431B7E] to-[#6D28D9] text-white p-6 sm:p-8 shadow-md flex flex-col justify-between">
          <div class="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>

          <div class="relative z-10 max-w-md space-y-2">
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tu avances à ton rythme !
            </h2>
            <p class="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
              Explore, réfléchis et passe à l'action pour construire ton projet professionnel.
            </p>
          </div>

          <!-- Illustration fille sac à dos stylisée -->
          <div class="absolute right-4 bottom-0 w-36 sm:w-44 h-full pointer-events-none flex items-end justify-end">
            <svg class="w-full h-40 sm:h-48 text-purple-200/90" viewBox="0 0 200 200" fill="none">
              <!-- Silhouette stylisée avec sac à dos conforme à la maquette -->
              <circle cx="130" cy="55" r="28" fill="#FDE047" opacity="0.9" />
              <!-- Tête et cheveux -->
              <circle cx="120" cy="70" r="18" fill="#4C1D95" />
              <path d="M102 75 C100 60, 130 50, 135 68 C135 78, 120 85, 115 88 Z" fill="#3B0764" />
              <!-- Buste avec sac à dos violet -->
              <path d="M105 92 L145 98 L155 180 L90 180 Z" fill="#8B5CF6" />
              <rect x="80" y="105" width="22" height="45" rx="8" fill="#A78BFA" />
              <!-- Sangles sac -->
              <path d="M105 102 L95 130" stroke="#DDD6FE" stroke-width="4" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <!-- 2.2 MA PROGRESSION GLOBALE (5/12) -->
        <div class="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-[#E4E0F5] p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm font-bold">
                🎯
              </div>
              <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">
                Ma progression globale
              </h3>
            </div>
            <span class="text-xs sm:text-sm font-extrabold text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              {{ completedStepsCount }}/{{ explorationSteps.length }} étapes
            </span>
          </div>

          <!-- Barre de progression -->
          <div class="space-y-2">
            <div class="w-full h-3 rounded-full bg-[#EDE9FE] overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] rounded-full transition-all duration-500"
                [style.width.%]="progressPercentage"
              ></div>
            </div>
          </div>

          <!-- 4 Étapes visuelles connectées -->
          <div class="grid grid-cols-4 gap-2 text-center pt-2">
            <!-- 1. Découvrir -->
            <div class="space-y-1.5 flex flex-col items-center">
              <div class="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✓
              </div>
              <span class="text-[11px] font-extrabold text-[#0F1035]">Découvrir</span>
            </div>

            <!-- 2. Explorer -->
            <div class="space-y-1.5 flex flex-col items-center">
              <div class="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✓
              </div>
              <span class="text-[11px] font-extrabold text-[#0F1035]">Explorer</span>
            </div>

            <!-- 3. Réfléchir -->
            <div class="space-y-1.5 flex flex-col items-center">
              <div
                [class]="completedStepsCount >= 3 ? 'bg-[#22C55E] text-white' : 'border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400'"
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              >
                <span>{{ completedStepsCount >= 3 ? '✓' : '♡' }}</span>
              </div>
              <span class="text-[11px] font-medium text-gray-500">Réfléchir</span>
            </div>

            <!-- 4. Agir -->
            <div class="space-y-1.5 flex flex-col items-center">
              <div
                [class]="completedStepsCount >= 4 ? 'bg-[#22C55E] text-white' : 'border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400'"
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              >
                <span>{{ completedStepsCount >= 4 ? '✓' : '♡' }}</span>
              </div>
              <span class="text-[11px] font-medium text-gray-500">Agir</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 3. RANGÉE CENTRALE : MES ÉTAPES D'EXPLORATION + PROCHAINE ACTION   -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- 3.1 COLONNE GAUCHE (7/12) : MES ÉTAPES D'EXPLORATION -->
        <div class="lg:col-span-7 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-base text-[#7C3AED]">✨</span>
            <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035]">
              Mes étapes d'exploration
            </h3>
          </div>

          <div class="space-y-3">
            <!-- Étape 1 : Découvrir mon bilan -->
            <div
              (click)="navigateTo('MON_BILAN')"
              class="p-4 rounded-2xl border border-[#E4E0F5] bg-white hover:border-[#7C3AED]/40 hover:bg-[#FDFCFE] transition flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div class="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center text-base shrink-0">
                  📄
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                    Découvrir mon bilan
                  </h4>
                  <p class="text-[11px] text-gray-500 font-medium">
                    J'ai consulté mes résultats et identifié mes points forts.
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
                  ✓ Terminé
                </span>
                <span class="text-gray-400 group-hover:text-[#7C3AED] transition">›</span>
              </div>
            </div>

            <!-- Étape 2 : Explorer les métiers -->
            <div
              (click)="navigateTo('IMMERSION_PRO')"
              class="p-4 rounded-2xl border-2 border-[#7C3AED] bg-[#F9F7FE] transition flex items-center justify-between gap-3 cursor-pointer group shadow-2xs"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div class="w-9 h-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-base shrink-0">
                  💼
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">
                    Explorer les métiers
                  </h4>
                  <p class="text-[11px] text-gray-500 font-medium">
                    Je découvre des métiers, je compare et j'enregistre mes favoris.
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="px-3 py-1 rounded-full bg-purple-100 text-[#6D28D9] text-xs font-extrabold">
                  En cours
                </span>
                <span class="text-[#7C3AED] font-bold">›</span>
              </div>
            </div>

            <!-- Étape 3 : Réfléchir et me préparer -->
            <div
              (click)="navigateTo('COACH_IA')"
              class="p-4 rounded-2xl border border-[#E4E0F5] bg-white hover:border-[#7C3AED]/40 hover:bg-[#FDFCFE] transition flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base shrink-0">
                  💡
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                    Réfléchir et me préparer
                  </h4>
                  <p class="text-[11px] text-gray-500 font-medium">
                    Je note mes questions, j'échange avec le Coach IA et je prépare mon projet.
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                  À faire
                </span>
                <span class="text-gray-400 group-hover:text-[#7C3AED] transition">›</span>
              </div>
            </div>

            <!-- Étape 4 : Agir et passer à la suite -->
            <div
              (click)="navigateTo('AUTOUR_DE_MOI')"
              class="p-4 rounded-2xl border border-[#E4E0F5] bg-white hover:border-[#7C3AED]/40 hover:bg-[#FDFCFE] transition flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </div>
                <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base shrink-0">
                  🚀
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                    Agir et passer à la suite
                  </h4>
                  <p class="text-[11px] text-gray-500 font-medium">
                    Je prépare mes démarches (entreprise, immersion) et mon prochain rendez-vous.
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                  À faire
                </span>
                <span class="text-gray-400 group-hover:text-[#7C3AED] transition">›</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3.2 COLONNE DROITE (5/12) : MA PROCHAINE ACTION + 4 RACCOURCIS -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Carte Ma prochaine action (Mise en valeur) -->
          <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-2 flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-base text-[#7C3AED]">🎯</span>
                  <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">
                    Ma prochaine action
                  </h3>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  {{ nextActionRecommendation }}
                </p>
              </div>

              <!-- Illustration checklist -->
              <div class="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 p-2 flex items-center justify-center shrink-0">
                <svg class="w-10 h-10 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
              </div>
            </div>

            <button
              type="button"
              (click)="navigateTo('IMMERSION_PRO')"
              class="w-full py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continuer mon exploration</span>
              <span>→</span>
            </button>
          </div>

          <!-- 4 Raccourcis de navigation directe (Grille 2x2) -->
          <div class="grid grid-cols-2 gap-3">
            <!-- 1. Mes métiers -->
            <button
              type="button"
              (click)="navigateTo('EXPLORER_METIERS')"
              class="p-3.5 rounded-2xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 hover:bg-[#FDFCFE] text-left transition flex items-center justify-between gap-2 shadow-2xs cursor-pointer group"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm shrink-0">
                  💼
                </div>
                <div class="min-w-0">
                  <h4 class="text-xs font-extrabold text-[#0F1035] truncate group-hover:text-[#7C3AED]">Mes métiers</h4>
                  <p class="text-[10px] text-gray-500 truncate">Favoris & découverts ({{ favoriteCareersCount }})</p>
                </div>
              </div>
              <span class="text-gray-400 group-hover:text-[#7C3AED] transition">›</span>
            </button>

            <!-- 2. Mes questions OU Trouver de l'aide -->
            <button
              type="button"
              (click)="navigateTo(journeyMode === 'AUTONOMOUS' ? 'ANNUAIRE_SUPPORT' : 'MES_QUESTIONS')"
              class="p-3.5 rounded-2xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 hover:bg-[#FDFCFE] text-left transition flex items-center justify-between gap-2 shadow-2xs cursor-pointer group"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm shrink-0">
                  {{ journeyMode === 'AUTONOMOUS' ? '🏛️' : '💬' }}
                </div>
                <div class="min-w-0">
                  <h4 class="text-xs font-extrabold text-[#0F1035] truncate group-hover:text-[#7C3AED]">
                    {{ journeyMode === 'AUTONOMOUS' ? "Trouver de l'aide" : 'Mes questions' }}
                  </h4>
                  <p class="text-[10px] text-gray-500 truncate">
                    {{ journeyMode === 'AUTONOMOUS' ? 'Structures vérifiées 06' : 'Avec conseiller (' + questionsCount + ')' }}
                  </p>
                </div>
              </div>
              <span class="text-gray-400 group-hover:text-[#7C3AED] transition">›</span>
            </button>

            <!-- 3. Mes entraînements -->
            <button
              type="button"
              (click)="navigateTo('COACH_IA')"
              class="p-3.5 rounded-2xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 hover:bg-[#FDFCFE] text-left transition flex items-center justify-between gap-2 shadow-2xs cursor-pointer group"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm shrink-0">
                  🎙️
                </div>
                <div class="min-w-0">
                  <h4 class="text-xs font-extrabold text-[#0F1035] truncate group-hover:text-[#7C3AED]">Mes entraînements</h4>
                  <p class="text-[10px] text-gray-500 truncate">Coach IA oral & écrit</p>
                </div>
              </div>
              <span class="text-gray-400 group-hover:text-[#7C3AED] transition">›</span>
            </button>

            <!-- 4. Mes immersions -->
            <button
              type="button"
              (click)="navigateTo('IMMERSION_PRO')"
              class="p-3.5 rounded-2xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 hover:bg-[#FDFCFE] text-left transition flex items-center justify-between gap-2 shadow-2xs cursor-pointer group"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm shrink-0">
                  📅
                </div>
                <div class="min-w-0">
                  <h4 class="text-xs font-extrabold text-[#0F1035] truncate group-hover:text-[#7C3AED]">Mes immersions</h4>
                  <p class="text-[10px] text-gray-500 truncate">Démarches & suivi</p>
                </div>
              </div>
              <span class="text-gray-400 group-hover:text-[#7C3AED] transition">›</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 4. RANGÉE INFÉRIEURE : MES MÉTIERS FAVORIS + CARNET DE DÉCOUVERTES -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- 4.1 MES MÉTIERS FAVORIS (7/12) -->
        <div class="lg:col-span-7 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-1">
            <div class="flex items-center gap-2">
              <span class="text-base text-pink-500">♡</span>
              <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035]">
                Mes métiers favoris ({{ favoriteCareersList.length }})
              </h3>
            </div>
            <button
              type="button"
              (click)="navigateTo('EXPLORER_METIERS')"
              class="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
            >
              Voir tout →
            </button>
          </div>

          <!-- Grille des 4 vignettes métiers -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              *ngFor="let m of favoriteCareersList"
              (click)="openCareer(m.title)"
              class="rounded-2xl border border-[#E4E0F5] overflow-hidden bg-white hover:shadow-md hover:border-[#7C3AED]/40 transition cursor-pointer flex flex-col justify-between group"
            >
              <!-- Photo du métier -->
              <div class="relative h-24 sm:h-28 overflow-hidden bg-purple-50">
                <img
                  [src]="m.image"
                  [alt]="m.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <!-- Bouton Favori coeur -->
                <button
                  type="button"
                  (click)="toggleFavorite(m, $event)"
                  class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-xs shadow-xs hover:scale-110 transition cursor-pointer"
                >
                  <span [class]="m.isFavorite ? 'text-pink-500' : 'text-gray-400'">
                    {{ m.isFavorite ? '♥' : '♡' }}
                  </span>
                </button>
              </div>

              <!-- Titre du métier -->
              <div class="p-2.5">
                <h4 class="text-xs font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition truncate">
                  {{ m.title }}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <!-- 4.2 MON CARNET DE DÉCOUVERTES (5/12) -->
        <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div class="flex items-center justify-between pb-1">
            <div class="flex items-center gap-2">
              <span class="text-base text-[#7C3AED]">📝</span>
              <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035]">
                Mon carnet de découvertes
              </h3>
            </div>
            <button
              type="button"
              (click)="openNotesModal()"
              class="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
            >
              Voir mon carnet →
            </button>
          </div>

          <!-- Citation stylisée avec guillemets géants et crayon -->
          <div class="relative rounded-2xl bg-[#F8F7FF] border border-[#DDD6FE] p-5 text-[#0F1035] space-y-3">
            <div class="text-3xl font-black text-[#A78BFA] leading-none select-none">
              “
            </div>
            <p class="text-xs sm:text-sm font-medium italic text-[#2E1065] leading-relaxed pr-8">
              {{ currentNoteText }}
            </p>

            <!-- Crayon violet stylisé en bas à droite -->
            <div class="absolute right-3 bottom-3 text-2xl select-none pointer-events-none">
              ✏️
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] text-gray-400 font-medium">
              🔒 Note personnelle privée
            </span>
            <button
              type="button"
              (click)="openNotesModal()"
              class="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer"
            >
              <span>+ Ajouter une réflexion</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 5. MES MESSAGES PRÉPARÉS (Section demandée Étape 7 du parcours)     -->
      <!-- ================================================================== -->
      <div *ngIf="savedDrafts.length > 0" class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#F0EDFA]">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">✉️</span>
            <div>
              <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035]">
                Mes messages préparés ({{ savedDrafts.length }})
              </h3>
              <p class="text-xs text-gray-500">
                Brouillons d'emails et scripts d'appels créés avec le Coach IA ou Immersion Pro.
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="navigateTo('COACH_IA')"
            class="text-xs font-bold text-[#7C3AED] hover:underline self-start sm:self-auto cursor-pointer"
          >
            Créer un nouveau message →
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div
            *ngFor="let draft of savedDrafts"
            class="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] space-y-2.5 flex flex-col justify-between"
          >
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] text-[10px] font-black uppercase">
                  {{ draft.type === 'EMAIL' ? 'Email' : 'Script Appel' }}
                </span>
                <span class="text-[10px] text-gray-400 font-semibold">{{ draft.date }}</span>
              </div>
              <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] leading-tight">
                {{ draft.title }}
              </h4>
              <p class="text-[11px] text-gray-500 font-medium">
                Destinataire : <strong>{{ draft.recipient || 'Entreprise' }}</strong>
              </p>
              <p class="text-xs text-[#42466B] line-clamp-2 italic bg-white p-2.5 rounded-xl border border-[#EDE9FE]">
                « {{ draft.content }} »
              </p>
            </div>

            <div class="flex items-center justify-between pt-1">
              <button
                type="button"
                (click)="copyDraft(draft)"
                class="px-3 py-1.5 rounded-full bg-white border border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>{{ copiedDraftId === draft.id ? '✓ Copié !' : '📋 Copier le message' }}</span>
              </button>
              <button
                type="button"
                (click)="navigateTo('COACH_IA')"
                class="text-xs text-[#7C3AED] font-bold hover:underline cursor-pointer"
              >
                Modifier dans le Coach →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODAL : MON CARNET DE DÉCOUVERTES                                  -->
      <!-- ================================================================== -->
      <div *ngIf="showNotesModal" class="fixed inset-0 z-50 bg-[#0F1035]/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="w-full max-w-lg rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
            <div class="flex items-center gap-2">
              <span class="text-lg">📝</span>
              <h3 class="text-base font-extrabold text-[#0F1035]">Mon carnet de découvertes</h3>
            </div>
            <button type="button" (click)="showNotesModal = false" class="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">
              ✕
            </button>
          </div>

          <p class="text-xs text-gray-500 font-medium">
            Note ici tes impressions, ce qui t'a plu ou surpris lors de tes recherches ou immersions.
          </p>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-700">Ma réflexion :</label>
            <textarea
              rows="4"
              [(ngModel)]="currentNoteText"
              placeholder="Ex : J'aime le côté créatif du métier de peintre décorateur..."
              class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 text-xs sm:text-sm font-medium text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              (click)="showNotesModal = false"
              class="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="saveNote()"
              class="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              Enregistrer ma note
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExplorationDashboardComponent implements OnInit {
  @Input() journeyMode: 'AUTONOMOUS' | 'SUPPORTED' = 'SUPPORTED';
  @Input() immersionCareerTitle?: string;
  @Input() favoriteCareersCount: number = 4;
  @Input() questionsCount: number = 5;
  @Input() youngDisplayName: string = 'Emma D.';
  @Output() navigate = new EventEmitter<string>();
  @Output() openCareerDetail = new EventEmitter<string>();

  searchQuery: string = '';
  completedStepsCount: number = 2;
  progressPercentage: number = 50;

  savedDrafts: SavedDraft[] = [];
  copiedDraftId: string | null = null;

  explorationSteps: ExplorationStepItem[] = [
    {
      id: 1,
      title: 'Découvrir mon bilan',
      description: 'J\'ai consulté mes résultats et identifié mes points forts.',
      status: 'COMPLETED',
      statusLabel: '✓ Terminé',
      icon: '📄',
      routeTarget: 'MON_BILAN'
    },
    {
      id: 2,
      title: 'Explorer les métiers',
      description: 'Je découvre des métiers, je compare et j\'enregistre mes favoris.',
      status: 'IN_PROGRESS',
      statusLabel: 'En cours',
      icon: '💼',
      routeTarget: 'IMMERSION_PRO'
    },
    {
      id: 3,
      title: 'Réfléchir et me préparer',
      description: 'Je note mes questions, j\'échange avec le Coach IA et je prépare mon projet.',
      status: 'NOT_STARTED',
      statusLabel: 'À faire',
      icon: '💡',
      routeTarget: 'COACH_IA'
    },
    {
      id: 4,
      title: 'Agir et passer à la suite',
      description: 'Je prépare mes démarches (entreprise, immersion) et mon prochain rendez-vous.',
      status: 'NOT_STARTED',
      statusLabel: 'À faire',
      icon: '🚀',
      routeTarget: 'AUTOUR_DE_MOI'
    }
  ];

  nextActionRecommendation: string =
    'Poursuivre l\'exploration du métier de peintre décorateur et préparer 2 questions à poser lors d\'une immersion.';

  favoriteCareersList = [
    {
      id: 'peintre-decorateur',
      title: 'Peintre décorateur',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80',
      isFavorite: true
    },
    {
      id: 'barista',
      title: 'Barista',
      image: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=400&q=80',
      isFavorite: false
    },
    {
      id: 'guide-touristique',
      title: 'Guide touristique',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
      isFavorite: false
    },
    {
      id: 'developpeur-web',
      title: 'Développeur web',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
      isFavorite: false
    }
  ];

  currentNoteText: string =
    'J\'aime le côté créatif du métier de peintre décorateur, notamment la réalisation de décors et le travail en équipe.';

  showNotesModal: boolean = false;

  ngOnInit(): void {
    this.loadPersistedData();
    if (this.journeyMode === 'AUTONOMOUS') {
      this.adaptForAutonomousMode();
    }
  }

  private adaptForAutonomousMode(): void {
    this.explorationSteps[0] = {
      id: 1,
      title: 'Découvrir des métiers',
      description: 'J\'ai exploré les univers et découvert des pistes professionnelles.',
      status: 'COMPLETED',
      statusLabel: '✓ Terminé',
      icon: '🧭',
      routeTarget: 'EXPLORER_METIERS'
    };
    this.explorationSteps[2] = {
      id: 3,
      title: 'Préparer mon immersion & mes messages',
      description: 'J\'ai préparé mon message ou script avec le Coach IA.',
      status: this.savedDrafts.length > 0 ? 'COMPLETED' : 'IN_PROGRESS',
      statusLabel: this.savedDrafts.length > 0 ? '✓ Réalisé' : 'En cours',
      icon: '💡',
      routeTarget: 'COACH_IA'
    };
    this.explorationSteps[3] = {
      id: 4,
      title: 'Trouver une structure ou une entreprise',
      description: 'Je contacte une entreprise ou le CIO / Mission Locale de Nice.',
      status: 'NOT_STARTED',
      statusLabel: 'À faire',
      icon: '🏛️',
      routeTarget: 'ANNUAIRE_SUPPORT'
    };

    if (this.immersionCareerTitle) {
      this.nextActionRecommendation = `Poursuivre la préparation de l'immersion pour ${this.immersionCareerTitle} ou t'entraîner avec le Coach IA.`;
    } else if (this.favoriteCareersCount > 0) {
      this.nextActionRecommendation = `Tu as ${this.favoriteCareersCount} métier(s) en favori. Sélectionne une piste pour préparer une immersion de 1 à 3 jours.`;
    } else {
      this.nextActionRecommendation = 'Explorer le catalogue pour enregistrer un premier métier qui t’intéresse.';
    }
  }

  copyDraft(draft: SavedDraft): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(draft.content);
      this.copiedDraftId = draft.id;
      setTimeout(() => (this.copiedDraftId = null), 2500);
    }
  }

  private loadPersistedData(): void {
    try {
      this.savedDrafts = loadSavedDrafts();

      // Charger la note du carnet
      const savedNote = localStorage.getItem('monbilan_carnet_note_2187');
      if (savedNote) {
        this.currentNoteText = savedNote;
      }

      // Charger le projet d'immersion pour ajuster la recommandation
      const immersionSaved = localStorage.getItem('monbilan_immersion_project_2187');
      if (immersionSaved) {
        const proj = JSON.parse(immersionSaved);
        if (proj.careerTitle) {
          this.nextActionRecommendation = `Poursuivre l'exploration du métier de ${proj.careerTitle.toLowerCase()} et préparer 2 questions à poser lors d'une immersion.`;
        }
      }
    } catch {
      // Ignorer
    }
  }

  navigateTo(target: string): void {
    this.navigate.emit(target);
  }

  openCareer(careerTitle: string): void {
    this.openCareerDetail.emit(careerTitle);
  }

  toggleFavorite(career: any, event: Event): void {
    event.stopPropagation();
    career.isFavorite = !career.isFavorite;
  }

  openNotesModal(): void {
    this.showNotesModal = true;
  }

  saveNote(): void {
    try {
      localStorage.setItem('monbilan_carnet_note_2187', this.currentNoteText);
    } catch {
      // Ignorer
    }
    this.showNotesModal = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.navigate.emit('IMMERSION_PRO');
    }
  }
}
