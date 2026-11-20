// ============================================================================
// Composant Standalone — Accueil du Parcours Autonome (Étape 1 du Parcours Cible)
// « Bienvenue sur MonBilan+ ! »
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { loadSavedDrafts, SavedDraft } from '../../shared/autonomous-data';

@Component({
  selector: 'app-autonomous-home',
  standalone: true,
  imports: [MbIconComponent, CommonModule],
  template: `
    <div class="space-y-8 animate-fadeIn">
      <!-- ================================================================== -->
      <!-- 1. BANNIÈRE HERO PRINCIPALE                                        -->
      <!-- ================================================================== -->
      <div
        class="rounded-[28px] bg-gradient-to-r from-[#1B1B62] via-[#3B1D8F] to-[#7C3AED] text-white p-6 sm:p-10 shadow-lg relative overflow-hidden"
      >
        <!-- Halos décoratifs subtils -->
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-[#E0349B]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute right-48 -top-12 w-48 h-48 bg-[#38BDF8]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div class="max-w-3xl space-y-3 relative z-10">
          <div class="flex items-center gap-2">
            <span class="inline-block rounded-full bg-white/20 text-white px-3.5 py-1 text-xs font-black tracking-wide uppercase">
              <mb-icon name="compass"></mb-icon> Parcours Libre
            </span>
            <span class="text-xs text-[#E7E8FB]/80 hidden sm:inline">• À ton rythme & sans pression</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Bienvenue sur MonBilan+ !
          </h1>

          <p class="text-sm sm:text-base text-[#E7E8FB] font-medium leading-relaxed max-w-2xl">
            Pas besoin d'avoir déjà un projet. On avance ensemble, à ton rythme.
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              (click)="navigateTo.emit('CATALOG')"
              class="rounded-full bg-white text-[#1B1B62] hover:bg-[#F3EFFE] px-6 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <span><mb-icon name="search"></mb-icon></span>
              <span>Commencer par explorer les métiers</span>
            </button>
            <button
              type="button"
              (click)="navigateTo.emit('SUPPORT')"
              class="rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 px-5 py-3 text-xs sm:text-sm font-extrabold transition flex items-center gap-2"
            >
              <span><mb-icon name="landmark"></mb-icon></span>
              <span>Trouver une aide locale</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. BLOC INTELLIGENT : « REPRENDRE LÀ OÙ J'EN ÉTAIS »               -->
      <!-- Uniquement affiché si une activité réelle est enregistrée          -->
      <!-- ================================================================== -->
      <div
        *ngIf="hasActiveProgress"
        class="rounded-[26px] bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE] to-[#FAF8FF] border-2 border-[#DDD6FE] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div class="flex items-start gap-4">
          <div class="h-12 w-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center text-xl shrink-0 shadow-md">
            <span><mb-icon name="timer"></mb-icon></span>
          </div>
          <div class="space-y-1">
            <span class="text-[11px] font-black uppercase tracking-wider text-[#7C3AED] block">
              Activité enregistrée
            </span>
            <h3 class="text-base sm:text-lg font-black text-[#0F1035]">
              Reprendre là où j'en étais
            </h3>
            <p class="text-xs sm:text-sm text-[#42466B]">
              <span *ngIf="favoriteCount > 0" class="font-bold text-[#7C3AED]">{{ favoriteCount }} métier(s) en favori</span>
              <span *ngIf="favoriteCount > 0 && (recentDraft || hasImmersionProject)"> • </span>
              <span *ngIf="hasImmersionProject" class="font-bold text-amber-700">Immersion en cours : {{ immersionCareerTitle || 'Peintre décorateur' }}</span>
              <span *ngIf="hasImmersionProject && recentDraft"> • </span>
              <span *ngIf="recentDraft" class="font-bold text-blue-700">1 message préparé</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            (click)="navigateToDashboard.emit()"
            class="w-full sm:w-auto rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Voir mon parcours</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 3. LES 3 GRANDES POSSIBILITÉS (Section 4 — Étape 1 du Prompt)       -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Possibilité 1 — Je découvre les métiers -->
        <div
          class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-[#7C3AED]/50 transition duration-200 flex flex-col justify-between space-y-6 group"
        >
          <div class="space-y-4">
            <div
              class="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition"
            >
              <mb-icon name="compass"></mb-icon>
            </div>
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-[#7C3AED] uppercase tracking-wider block">Option 1</span>
              <h2 class="text-xl font-black text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Je découvre les métiers
              </h2>
              <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                Explore des professions et trouve celles qui t'intéressent, sans test ni score éliminatoire.
              </p>
            </div>

            <!-- Tags rapides -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="rounded-full bg-[#FAF8FF] border border-[#E4E0F5] px-2.5 py-1 text-[11px] font-semibold text-[#6D28D9]">
                721 métiers O*NET
              </span>
              <span class="rounded-full bg-[#FAF8FF] border border-[#E4E0F5] px-2.5 py-1 text-[11px] font-semibold text-[#6D28D9]">
                Fiches concrètes
              </span>
            </div>
          </div>

          <button
            type="button"
            (click)="navigateTo.emit('CATALOG')"
            class="w-full rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white py-3 px-5 text-xs font-extrabold hover:opacity-95 shadow-sm transition text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explorer les métiers</span>
            <span>→</span>
          </button>
        </div>

        <!-- Possibilité 2 — J'ai déjà une idée -->
        <div
          class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition duration-200 flex flex-col justify-between space-y-6 group"
        >
          <div class="space-y-4">
            <div
              class="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition"
            >
              <mb-icon name="briefcase"></mb-icon>
            </div>
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-amber-700 uppercase tracking-wider block">Option 2</span>
              <h2 class="text-xl font-black text-[#0F1035] group-hover:text-amber-600 transition">
                J'ai déjà une idée
              </h2>
              <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                Découvre comment passer de ton idée à une expérience concrète sur le terrain.
              </p>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                Immersion 1 à 3 jours
              </span>
              <span class="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                Préparation guidée
              </span>
            </div>
          </div>

          <button
            type="button"
            (click)="navigateTo.emit('IMMERSION')"
            class="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-5 text-xs font-extrabold hover:opacity-95 shadow-sm transition text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Préparer mon immersion</span>
            <span>→</span>
          </button>
        </div>

        <!-- Possibilité 3 — J'ai besoin d'aide -->
        <div
          class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-blue-400/50 transition duration-200 flex flex-col justify-between space-y-6 group"
        >
          <div class="space-y-4">
            <div
              class="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition"
            >
              <mb-icon name="landmark"></mb-icon>
            </div>
            <div class="space-y-1.5">
              <span class="text-xs font-extrabold text-blue-700 uppercase tracking-wider block">Option 3</span>
              <h2 class="text-xl font-black text-[#0F1035] group-hover:text-blue-600 transition">
                J'ai besoin d'aide
              </h2>
              <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                Trouve un professionnel (CIO, Mission Locale) pour t'accompagner gratuitement.
              </p>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-800">
                Structures vérifiées 06
              </span>
              <span class="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-800">
                Gratuit & public
              </span>
            </div>
          </div>

          <button
            type="button"
            (click)="navigateTo.emit('SUPPORT')"
            class="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-5 text-xs font-extrabold hover:opacity-95 shadow-sm transition text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Trouver de l'aide</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 4. BANDEAU DE RÉASSURANCE ET DÉONTOLOGIE                            -->
      <!-- ================================================================== -->
      <div
        class="rounded-2xl bg-[#FAF8FF] border border-[#DDD6FE] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4 text-xs sm:text-sm text-[#42466B]">
          <span class="text-2xl shrink-0"><mb-icon name="info"></mb-icon></span>
          <div>
            <strong class="text-[#0F1035] font-extrabold block">Liberté et bienveillance :</strong>
            <span>
              Tu peux avancer librement. MonBilan+ ne remplace pas un professionnel de l'orientation mais t'aide à préparer tes choix en toute sérénité.
            </span>
          </div>
        </div>

        <button
          type="button"
          (click)="openModeModal.emit()"
          class="shrink-0 rounded-full bg-white border border-[#D8DCF0] hover:border-[#7C3AED] text-[#7C3AED] px-4 py-2 text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span><mb-icon name="refresh-cw"></mb-icon></span>
          <span>Changer de mode</span>
        </button>
      </div>
    </div>
  `
})
export class AutonomousHomeComponent implements OnInit {
  @Input() favoriteCount = 0;
  @Input() immersionCareerTitle?: string;
  @Input() hasImmersionProject = false;
  @Output() navigateTo = new EventEmitter<'CATALOG' | 'IMMERSION' | 'SUPPORT'>();
  @Output() navigateToDashboard = new EventEmitter<void>();
  @Output() openModeModal = new EventEmitter<void>();

  recentDraft: SavedDraft | null = null;

  ngOnInit(): void {
    const drafts = loadSavedDrafts();
    if (drafts.length > 0) {
      this.recentDraft = drafts[0];
    }
  }

  get hasActiveProgress(): boolean {
    return this.favoriteCount > 0 || this.hasImmersionProject || !!this.recentDraft;
  }
}
