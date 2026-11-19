// ============================================================================
// Composant Standalone — Accueil du Parcours Autonome (Écran 1 Maquette)
// « Construis ton avenir à ton rythme »
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-autonomous-home',
  standalone: true,
  imports: [CommonModule],
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
              🧭 Parcours Autonome
            </span>
            <span class="text-xs text-[#E7E8FB]/80 hidden sm:inline">• À ton rythme & sans pression</span>
          </div>

          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Construis ton avenir à ton rythme
          </h2>

          <p class="text-sm sm:text-base text-[#E7E8FB] font-medium leading-relaxed max-w-2xl">
            Explore des métiers, prépare une immersion et trouve un accompagnement si tu en as besoin.
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              (click)="navigateTo.emit('CATALOG')"
              class="rounded-full bg-white text-[#1B1B62] hover:bg-[#F3EFFE] px-6 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <span>🔍</span>
              <span>Explorer les 721 métiers</span>
            </button>
            <button
              type="button"
              (click)="navigateTo.emit('SUPPORT')"
              class="rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 px-5 py-3 text-xs sm:text-sm font-extrabold transition flex items-center gap-2"
            >
              <span>🏛️</span>
              <span>Besoin d’aide locale ?</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. LES 3 CARTES MAQUETTE PRINCIPALES                                -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Carte 1 — Découvrir les métiers -->
        <div
          class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-[#7C3AED]/40 transition duration-200 flex flex-col justify-between space-y-6 group"
        >
          <div class="space-y-4">
            <div
              class="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition"
            >
              🎨
            </div>
            <div class="space-y-1.5">
              <span class="text-xs font-bold text-[#7C3AED] uppercase tracking-wider block">Étape 1</span>
              <h3 class="text-xl font-black text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Découvrir les métiers
              </h3>
              <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                Explore les métiers, comprends leurs missions et enregistre tes favoris.
              </p>
            </div>

            <!-- Tags rapides -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="rounded-full bg-[#FAF8FF] border border-[#E4E0F5] px-2.5 py-1 text-[11px] font-semibold text-[#6D28D9]">
                721 fiches O*NET
              </span>
              <span class="rounded-full bg-[#FAF8FF] border border-[#E4E0F5] px-2.5 py-1 text-[11px] font-semibold text-[#6D28D9]">
                Filtres d’intérêts
              </span>
            </div>
          </div>

          <button
            type="button"
            (click)="navigateTo.emit('CATALOG')"
            class="w-full rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white py-3 px-5 text-xs font-extrabold hover:opacity-95 shadow-sm transition text-center flex items-center justify-center gap-2"
          >
            <span>Découvrir les métiers</span>
            <span>→</span>
          </button>
        </div>

        <!-- Carte 2 — Préparer une immersion -->
        <div
          class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition duration-200 flex flex-col justify-between space-y-6 group"
        >
          <div class="space-y-4">
            <div
              class="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition"
            >
              💼
            </div>
            <div class="space-y-1.5">
              <span class="text-xs font-bold text-amber-700 uppercase tracking-wider block">Étape 2</span>
              <h3 class="text-xl font-black text-[#0F1035] group-hover:text-amber-600 transition">
                Préparer une immersion
              </h3>
              <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                Organise une rencontre avec un professionnel ou prépare un stage d'observation.
              </p>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                Stage 1 à 3 jours
              </span>
              <span class="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                Kit téléchargeable
              </span>
            </div>
          </div>

          <button
            type="button"
            (click)="navigateTo.emit('IMMERSION')"
            class="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-5 text-xs font-extrabold hover:opacity-95 shadow-sm transition text-center flex items-center justify-center gap-2"
          >
            <span>Préparer mon immersion</span>
            <span>→</span>
          </button>
        </div>

        <!-- Carte 3 — Trouver un accompagnement -->
        <div
          class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-blue-400/50 transition duration-200 flex flex-col justify-between space-y-6 group"
        >
          <div class="space-y-4">
            <div
              class="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition"
            >
              🏛️
            </div>
            <div class="space-y-1.5">
              <span class="text-xs font-bold text-blue-700 uppercase tracking-wider block">Ressources</span>
              <h3 class="text-xl font-black text-[#0F1035] group-hover:text-blue-600 transition">
                Trouver un accompagnement
              </h3>
              <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                Découvre les structures qui peuvent t'aider dans ton orientation.
              </p>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-800">
                CIO & Mission Locale
              </span>
              <span class="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-800">
                1jeune1solution
              </span>
            </div>
          </div>

          <button
            type="button"
            (click)="navigateTo.emit('SUPPORT')"
            class="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-5 text-xs font-extrabold hover:opacity-95 shadow-sm transition text-center flex items-center justify-center gap-2"
          >
            <span>Trouver de l'aide</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 3. BANDEAU DE RÉASSURANCE ET DÉONTOLOGIE                            -->
      <!-- ================================================================== -->
      <div
        class="rounded-2xl bg-[#FAF8FF] border border-[#DDD6FE] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4 text-xs sm:text-sm text-[#42466B]">
          <span class="text-2xl shrink-0">ℹ️</span>
          <div>
            <strong class="text-[#0F1035] font-extrabold block">Liberté et bienveillance :</strong>
            <span>
              Tu peux avancer librement. MonBilan+ ne remplace pas un professionnel de l'orientation mais t'aide à préparer tes choix.
            </span>
          </div>
        </div>

        <button
          type="button"
          (click)="openModeModal.emit()"
          class="shrink-0 rounded-full bg-white border border-[#D8DCF0] hover:border-[#7C3AED] text-[#7C3AED] px-4 py-2 text-xs font-bold transition shadow-xs flex items-center gap-1.5"
        >
          <span>🔄</span>
          <span>Changer de mode</span>
        </button>
      </div>
    </div>
  `
})
export class AutonomousHomeComponent {
  @Input() favoriteCount = 0;
  @Output() navigateTo = new EventEmitter<'CATALOG' | 'IMMERSION' | 'SUPPORT'>();
  @Output() openModeModal = new EventEmitter<void>();
}
