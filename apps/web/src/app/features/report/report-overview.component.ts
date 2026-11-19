// ============================================================================
// MonBilan+ — Composant Premium « Mon bilan d'orientation »
// Refonte intégrale conforme à la maquette officielle (media_1795103774117)
// - Hero « Découvre ce que dit ton bilan »
// - 4 onglets : Comprendre mon bilan | J'écoute mon bilan | Mes résultats | Je prépare la suite
// - « Ton bilan en quelques mots » avec repères à pastilles vertes & illustration 3D
// - « J'écoute mon bilan » avec 6 épisodes thématiques ~2 min & lecteur audio compact docké
// - « Mes résultats » sans boutons destructeurs (+ Activer supprimé), sans faux scores
// - « Mes pistes de métiers » avec les 22 métiers réels du rapport et vignettes photos
// - « Et maintenant ? » avec passerelles Immersion Pro, Questions, et Conseiller/Annuaire
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JourneyMode } from '../../shared/autonomous-data';
import { UIEpisode } from '../../shared/restitution-data';

export type ReportSubTab = 'COMPRENDRE' | 'AUDIO' | 'RESULTATS' | 'SUITE';

export interface UICareer {
  id: string;
  jobZone: number;
  rankInZone: number;
  titleFr: string;
  sectorTag: string;
  sectorColor: string;
  educationLevel: string;
  shortSummary: string;
  description: string;
  imageUrl: string;
  pageNumber?: number;
  isFavorite?: boolean;
}

export interface UIRiasecItem {
  letter: string;
  name: string;
  keywords: string;
  rank: number;
  selected: boolean;
  badgeClass: string;
  selectedContainerClass: string;
  selectedBadgePillClass: string;
  checkBadgeClass: string;
  accentColor: string;
  description?: string;
  pdfPage?: number;
}

export interface UIAptitudeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  pdfPage: number;
  tag: string;
}

export interface UIHexacoItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  pdfPage: number;
}

@Component({
  selector: 'app-report-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- ================================================================== -->
      <!-- BANNIÈRE HERO : « Découvre ce que dit ton bilan »                    -->
      <!-- ================================================================== -->
      <div class="rounded-[28px] bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9333EA] text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <!-- Décorations lumineuses en arrière-plan -->
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute left-1/3 -bottom-20 w-80 h-80 bg-[#C084FC]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <!-- Texte et icône livre -->
          <div class="md:col-span-8 flex items-start gap-4 sm:gap-5">
            <div class="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm text-2xl sm:text-3xl">
              📖
            </div>
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#E9D5FF] border border-white/20">
                <span>✨ Restitution certifiée</span>
                <span>•</span>
                <span>Rdv {{ rdvNumber }}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Découvre ce que dit ton bilan
              </h2>
              <p class="text-xs sm:text-sm text-[#E7E8FB] max-w-2xl leading-relaxed">
                Une restitution claire et personnalisée pour comprendre tes résultats, explorer des métiers et préparer la suite.
              </p>
            </div>
          </div>

          <!-- Visuel adolescent souriant à droite -->
          <div class="md:col-span-4 flex justify-center md:justify-end">
            <div class="relative">
              <img
                src="assets/visuals/hero-boy-backpack.png"
                alt="Jeune souriant MonBilan+"
                class="h-36 sm:h-44 object-contain filter drop-shadow-xl"
                onerror="this.style.display='none'"
              />
              <div class="absolute -top-2 -left-2 bg-amber-400 text-[#0F1035] rounded-full p-1.5 shadow-md text-xs font-black animate-bounce">
                ✨
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- NAVIGATION INTERNE : 4 ONGLET CLAIRS                               -->
      <!-- ================================================================== -->
      <div class="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          (click)="setSubTab('COMPRENDRE')"
          [class]="activeSubTab === 'COMPRENDRE'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] hover:bg-[#F5F3FF] border border-[#E4E0F5] font-bold'"
          class="rounded-full px-5 py-2.5 text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <span>💼</span>
          <span>Comprendre mon bilan</span>
        </button>

        <button
          type="button"
          (click)="setSubTab('AUDIO')"
          [class]="activeSubTab === 'AUDIO'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] hover:bg-[#F5F3FF] border border-[#E4E0F5] font-bold'"
          class="rounded-full px-5 py-2.5 text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <span>🎧</span>
          <span>J'écoute mon bilan</span>
          <span class="rounded-full bg-white/20 text-[10px] px-1.5 py-0.2 font-extrabold">6</span>
        </button>

        <button
          type="button"
          (click)="setSubTab('RESULTATS')"
          [class]="activeSubTab === 'RESULTATS'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] hover:bg-[#F5F3FF] border border-[#E4E0F5] font-bold'"
          class="rounded-full px-5 py-2.5 text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <span>📊</span>
          <span>Mes résultats</span>
        </button>

        <button
          type="button"
          (click)="setSubTab('SUITE')"
          [class]="activeSubTab === 'SUITE'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] hover:bg-[#F5F3FF] border border-[#E4E0F5] font-bold'"
          class="rounded-full px-5 py-2.5 text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <span>🧭</span>
          <span>Je prépare la suite</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 1 : COMPRENDRE MON BILAN (Vue Principale fidèle au Mockup)       -->
      <!-- ================================================================== -->
      <div *ngIf="activeSubTab === 'COMPRENDRE'" class="space-y-6">

        <!-- GRILLE PRINCIPALE SUPÉRIEURE (2 Colonnes) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          <!-- COLONNE GAUCHE (7/12) : « Ton bilan en quelques mots » -->
          <div class="lg:col-span-6 xl:col-span-6 rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <!-- En-tête -->
              <div class="flex items-center justify-between">
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#0F1035] flex items-center gap-2.5">
                  <span class="text-amber-400 text-xl">✨</span>
                  <span>Ton bilan en quelques mots</span>
                </h3>
              </div>

              <!-- Texte de synthèse pédagogique -->
              <div class="flex items-start gap-4">
                <p class="text-sm sm:text-base text-[#31355B] leading-relaxed flex-1">
                  Ton rapport met en avant des centres d'intérêt
                  <strong class="text-[#8B5CF6] font-extrabold">artistiques</strong>,
                  <strong class="text-[#10B981] font-extrabold">réalistes</strong> et
                  <strong class="text-[#F97316] font-extrabold">sociaux</strong>.
                  Il présente aussi tes aptitudes, des éléments de ta personnalité et propose
                  <strong class="text-[#7C3AED] font-extrabold">{{ careers.length }} métiers</strong> à explorer.
                </p>

                <!-- Illustration 3D Bloc-notes / Checklist -->
                <div class="h-20 w-16 sm:h-24 sm:w-20 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#F5F3FF] border-2 border-[#C084FC]/40 flex flex-col items-center justify-center p-2 shadow-inner shrink-0 text-center">
                  <div class="w-8 h-2 bg-[#7C3AED] rounded-full mb-1"></div>
                  <div class="space-y-1 w-full px-1">
                    <div class="h-1.5 bg-[#A855F7]/30 rounded-full flex items-center px-0.5">
                      <span class="text-[8px] text-emerald-600 font-bold">✔</span>
                    </div>
                    <div class="h-1.5 bg-[#A855F7]/30 rounded-full flex items-center px-0.5">
                      <span class="text-[8px] text-emerald-600 font-bold">✔</span>
                    </div>
                    <div class="h-1.5 bg-[#A855F7]/30 rounded-full flex items-center px-0.5">
                      <span class="text-[8px] text-emerald-600 font-bold">✔</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4 Repères à pastilles vertes -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <button
                  type="button"
                  (click)="goToResultSection('RIASEC')"
                  class="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 text-center text-xs font-bold text-[#065F46] hover:bg-[#D1FAE5] transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span class="text-emerald-600 font-black">✓</span>
                  <span class="truncate">Tes centres d'intérêt</span>
                </button>

                <button
                  type="button"
                  (click)="goToResultSection('APTITUDES')"
                  class="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 text-center text-xs font-bold text-[#065F46] hover:bg-[#D1FAE5] transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span class="text-emerald-600 font-black">✓</span>
                  <span class="truncate">Tes aptitudes</span>
                </button>

                <button
                  type="button"
                  (click)="goToResultSection('HEXACO')"
                  class="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 text-center text-xs font-bold text-[#065F46] hover:bg-[#D1FAE5] transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span class="text-emerald-600 font-black">✓</span>
                  <span class="truncate">Ta personnalité</span>
                </button>

                <button
                  type="button"
                  (click)="onExploreCareers()"
                  class="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 text-center text-xs font-bold text-[#065F46] hover:bg-[#D1FAE5] transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span class="text-emerald-600 font-black">✓</span>
                  <span class="truncate">{{ careers.length }} métiers</span>
                </button>
              </div>
            </div>

            <!-- Note rassurante au bas -->
            <div class="pt-3 border-t border-[#F0EDFA] flex items-center gap-2 text-xs text-[#555A8A]">
              <span class="text-[#7C3AED] text-sm">💡</span>
              <p>Ce sont des pistes de réflexion, à discuter avec ton conseiller.</p>
            </div>
          </div>

          <!-- COLONNE DROITE (6/12) : « J'écoute mon bilan » (Épisodes + Lecteur compact) -->
          <div class="lg:col-span-6 xl:col-span-6 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#0F1035] flex items-center gap-2.5">
                  <span class="text-[#7C3AED]">🎧</span>
                  <span>J'écoute mon bilan</span>
                </h3>
                <span class="text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-1 rounded-full">
                  6 épisodes sourcés
                </span>
              </div>
              <p class="text-xs text-[#64748B] mb-3">
                Des explications audio courtes et simples.
              </p>

              <!-- Liste des 6 Épisodes thématiques -->
              <div class="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                <div
                  *ngFor="let ep of audioEpisodes; let idx = index"
                  (click)="selectAndPlayEpisode(idx)"
                  [class]="selectedEpisodeIndex === idx
                    ? 'bg-[#F5F3FF] border-2 border-[#7C3AED] shadow-xs'
                    : 'bg-[#FAFAFC] hover:bg-[#F3F0FE] border border-transparent'"
                  class="p-2.5 rounded-2xl flex items-center justify-between gap-3 transition cursor-pointer"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      [class]="selectedEpisodeIndex === idx && isPlaying
                        ? 'bg-[#7C3AED] text-white shadow-md'
                        : 'bg-white text-[#7C3AED] border border-[#E4E0F5]'"
                      class="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition"
                    >
                      {{ (selectedEpisodeIndex === idx && isPlaying) ? '⏸' : '▶' }}
                    </button>
                    <div class="min-w-0">
                      <p class="text-xs sm:text-[13px] font-black text-[#0F1035] truncate">
                        {{ ep.title }}
                      </p>
                      <p class="text-[11px] text-[#64748B] truncate">
                        {{ ep.subtitle }}
                      </p>
                    </div>
                  </div>
                  <span class="text-[11px] font-bold text-[#64748B] shrink-0 bg-white px-2 py-0.5 rounded-md border border-[#E4E0F5]">
                    ~ 2 min
                  </span>
                </div>
              </div>
            </div>

            <!-- LECTEUR AUDIO COMPACT DOCKÉ EN BAS DE CARTE -->
            <div class="rounded-2xl bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white p-3.5 shadow-md flex items-center justify-between gap-3 sm:gap-4">
              <!-- Bouton Play/Pause blanc -->
              <button
                type="button"
                (click)="toggleAudioPlay()"
                class="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white text-[#6D28D9] flex items-center justify-center font-black text-sm shadow-md transition hover:scale-105 active:scale-95 shrink-0"
              >
                {{ isPlaying ? '⏸' : '▶' }}
              </button>

              <!-- Titre et Barre de progression -->
              <div class="flex-1 min-w-0 space-y-1">
                <div class="flex items-center justify-between text-xs font-extrabold text-white">
                  <span class="truncate">{{ currentEpisode?.title || 'Comprendre mon bilan' }}</span>
                  <span class="text-[11px] text-[#DDD6FE] font-mono shrink-0 ml-2">
                    {{ formatTime(audioProgressSec) }} / {{ formatTime(audioDurationSec) }}
                  </span>
                </div>
                <!-- Barre de progression interactive -->
                <div class="w-full bg-white/25 rounded-full h-1.5 overflow-hidden cursor-pointer" (click)="onProgressBarClick($event)">
                  <div
                    class="bg-white h-full rounded-full transition-all duration-200"
                    [style.width.%]="audioProgressPercent"
                  ></div>
                </div>
              </div>

              <!-- Contrôles Vitesse & Transcription -->
              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  (click)="cyclePlaybackRate()"
                  class="rounded-lg bg-white/15 hover:bg-white/25 text-white px-2 py-1 text-xs font-bold transition"
                  title="Vitesse de lecture"
                >
                  {{ playbackRate }}x
                </button>

                <button
                  type="button"
                  (click)="showTranscriptModal = true"
                  class="rounded-xl bg-white text-[#6D28D9] hover:bg-[#F5F3FF] px-2.5 py-1 text-xs font-black shadow-xs flex items-center gap-1 transition"
                  title="Afficher la transcription"
                >
                  <span>📄</span>
                  <span class="hidden sm:inline">Transcription</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- GRILLE INFÉRIEURE : MES RÉSULTATS + MES PISTES DE MÉTIERS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- CARTE 1 : MES RÉSULTATS -->
          <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div>
                <h3 class="text-xl font-extrabold text-[#0F1035] flex items-center gap-2">
                  <span class="text-[#7C3AED]">📊</span>
                  <span>Mes résultats</span>
                </h3>
                <p class="text-xs text-[#555A8A] mt-0.5">
                  Comprends les grandes idées de ton bilan, sans jargon.
                </p>
              </div>

              <!-- Lignes interactives vers les dimensions -->
              <div class="space-y-2 pt-1">
                <div
                  (click)="goToResultSection('RIASEC')"
                  class="p-3.5 rounded-2xl bg-[#F8F7FF] hover:bg-[#F3E8FF] border border-[#E4E0F5] flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#0F1035] cursor-pointer transition shadow-2xs group"
                >
                  <div class="flex items-center gap-3">
                    <span class="h-8 w-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm shadow-2xs">
                      🎯
                    </span>
                    <span>Centres d'intérêt (RIASEC)</span>
                  </div>
                  <span class="text-[#7C3AED] group-hover:translate-x-1 transition font-black text-base">›</span>
                </div>

                <div
                  (click)="goToResultSection('APTITUDES')"
                  class="p-3.5 rounded-2xl bg-[#F8F7FF] hover:bg-[#F3E8FF] border border-[#E4E0F5] flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#0F1035] cursor-pointer transition shadow-2xs group"
                >
                  <div class="flex items-center gap-3">
                    <span class="h-8 w-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm shadow-2xs">
                      ⭐
                    </span>
                    <span>Aptitudes</span>
                  </div>
                  <span class="text-[#7C3AED] group-hover:translate-x-1 transition font-black text-base">›</span>
                </div>

                <div
                  (click)="goToResultSection('HEXACO')"
                  class="p-3.5 rounded-2xl bg-[#F8F7FF] hover:bg-[#F3E8FF] border border-[#E4E0F5] flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#0F1035] cursor-pointer transition shadow-2xs group"
                >
                  <div class="flex items-center gap-3">
                    <span class="h-8 w-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm shadow-2xs">
                      👥
                    </span>
                    <span>Personnalité (HEXACO)</span>
                  </div>
                  <span class="text-[#7C3AED] group-hover:translate-x-1 transition font-black text-base">›</span>
                </div>
              </div>
            </div>

            <div class="text-[11px] text-[#555A8A] flex items-center justify-between pt-2 border-t border-[#F0EDFA]">
              <span>Rapport du Centre des Possibles</span>
              <span class="font-bold text-[#7C3AED]">Pages 4 à 6</span>
            </div>
          </div>

          <!-- CARTE 2 : MES PISTES DE MÉTIERS -->
          <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div>
                <h3 class="text-xl font-extrabold text-[#0F1035] flex items-center gap-2">
                  <span class="text-[#7C3AED]">💼</span>
                  <span>Mes pistes de métiers</span>
                </h3>
                <p class="text-xs text-[#555A8A] mt-0.5">
                  Les {{ careers.length }} métiers proposés dans ton rapport.
                </p>
              </div>

              <!-- 3 Vignettes de métiers avec photos réelles -->
              <div class="grid grid-cols-3 gap-2.5 pt-1">
                <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-2 flex flex-col items-center text-center space-y-1.5 shadow-2xs">
                  <img
                    src="assets/visuals/career-peintre.png"
                    alt="Peintre décorateur"
                    class="h-16 w-full object-cover rounded-xl"
                    onerror="this.src='assets/visuals/step3-career-cards.png'"
                  />
                  <p class="text-[11px] font-extrabold text-[#0F1035] line-clamp-1">Peintre décorateur</p>
                  <span class="text-[9px] font-bold text-[#6D28D9] bg-[#F3E8FF] px-1.5 py-0.2 rounded-full">Zone 1</span>
                </div>

                <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-2 flex flex-col items-center text-center space-y-1.5 shadow-2xs">
                  <img
                    src="assets/visuals/career-barista.png"
                    alt="Cuisinier / Barista"
                    class="h-16 w-full object-cover rounded-xl"
                    onerror="this.src='assets/visuals/step3-career-cards.png'"
                  />
                  <p class="text-[11px] font-extrabold text-[#0F1035] line-clamp-1">Cuisinier / Barista</p>
                  <span class="text-[9px] font-bold text-[#BE185D] bg-[#FCE7F3] px-1.5 py-0.2 rounded-full">Zone 1</span>
                </div>

                <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-2 flex flex-col items-center text-center space-y-1.5 shadow-2xs">
                  <img
                    src="assets/visuals/career-son.png"
                    alt="Technicien son"
                    class="h-16 w-full object-cover rounded-xl"
                    onerror="this.src='assets/visuals/step3-career-cards.png'"
                  />
                  <p class="text-[11px] font-extrabold text-[#0F1035] line-clamp-1">Technicien du son</p>
                  <span class="text-[9px] font-bold text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.2 rounded-full">Zone 2</span>
                </div>
              </div>
            </div>

            <!-- Bouton large violet -->
            <button
              type="button"
              (click)="onExploreCareers()"
              class="w-full rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] border-2 border-[#7C3AED] text-[#7C3AED] font-extrabold text-sm py-3 transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>Explorer les {{ careers.length }} métiers</span>
              <span class="text-base font-black">→</span>
            </button>
          </div>
        </div>

        <!-- RANGÉE INFÉRIEURE COMPLÈTE : « ET MAINTENANT ? » -->
        <div class="rounded-[28px] bg-[#F8F7FF] border border-[#E4E0F5] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h4 class="text-lg font-black text-[#0F1035] flex items-center gap-2">
              <span class="text-[#7C3AED]">🧭</span>
              <span>Et maintenant ?</span>
            </h4>
            <p class="text-xs text-[#555A8A]">
              Poursuis ton exploration et passe à l'action.
            </p>
          </div>

          <!-- 3 Boutons d'action concrets -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              (click)="onNavigate('IMMERSION_PRO')"
              class="rounded-xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED] text-[#0F1035] hover:text-[#7C3AED] px-4 py-2.5 text-xs font-extrabold shadow-2xs transition flex items-center gap-2"
            >
              <span>💼</span>
              <span>Préparer une immersion</span>
            </button>

            <button
              type="button"
              (click)="onNavigate('MES_QUESTIONS')"
              class="rounded-xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED] text-[#0F1035] hover:text-[#7C3AED] px-4 py-2.5 text-xs font-extrabold shadow-2xs transition flex items-center gap-2"
            >
              <span>✨</span>
              <span>Poser mes questions</span>
            </button>

            <!-- Échanger avec mon conseiller si accompagné, ou Trouver un accompagnement si autonome -->
            <button
              *ngIf="journeyMode === 'SUPPORTED'"
              type="button"
              (click)="onNavigate('MES_QUESTIONS')"
              class="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] text-[#065F46] px-4 py-2.5 text-xs font-extrabold shadow-2xs transition flex items-center gap-2"
            >
              <span>👥</span>
              <span>Échanger avec mon conseiller</span>
            </button>

            <button
              *ngIf="journeyMode === 'AUTONOMOUS'"
              type="button"
              (click)="onNavigate('ANNUAIRE_SUPPORT')"
              class="rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] hover:bg-[#E0E7FF] text-[#4338CA] px-4 py-2.5 text-xs font-extrabold shadow-2xs transition flex items-center gap-2"
            >
              <span>🏛️</span>
              <span>Trouver un accompagnement</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 2 : J'ÉCOUTE MON BILAN (Vue approfondie Audio & Transcription)  -->
      <!-- ================================================================== -->
      <div *ngIf="activeSubTab === 'AUDIO'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <!-- Lecteur interactif principal à gauche -->
          <div class="lg:col-span-7 rounded-[28px] bg-gradient-to-br from-[#161144] via-[#3B1278] to-[#6D28D9] text-white p-6 sm:p-7 shadow-xl space-y-5">
            <div class="flex items-center justify-between gap-2">
              <span class="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#E9D5FF] border border-white/20">
                🎙️ Épisode {{ currentEpisode?.episodeNumber || 1 }} sur {{ audioEpisodes.length }}
              </span>
              <span class="text-xs text-[#DDD6FE]">
                ~ 2 min par thème
              </span>
            </div>

            <div>
              <h3 class="text-2xl sm:text-3xl font-extrabold">{{ currentEpisode?.title }}</h3>
              <p class="text-xs sm:text-sm text-[#E7E8FB] mt-1">{{ currentEpisode?.subtitle }}</p>
            </div>

            <!-- Lecteur avec onde sonore animée -->
            <div class="rounded-2xl bg-black/25 border border-white/20 p-4 space-y-3 backdrop-blur-sm">
              <div class="flex items-center justify-between gap-3">
                <button
                  type="button"
                  (click)="toggleAudioPlay()"
                  class="h-12 w-12 rounded-full bg-white text-[#6D28D9] flex items-center justify-center font-black text-lg shadow-lg transition hover:scale-105 active:scale-95 shrink-0"
                >
                  {{ isPlaying ? '⏸' : '▶' }}
                </button>

                <!-- Onde sonore -->
                <div class="flex items-center gap-1 h-8 px-2 overflow-hidden flex-1 justify-center">
                  <span *ngFor="let h of [3,5,4,7,6,8,5,4,7,9,6,4,7,5,3,6,8,5,4,3]; let i = index"
                    class="w-1 rounded-full transition-all duration-150"
                    [ngClass]="isPlaying ? 'bg-[#38BDF8] animate-pulse' : 'bg-[#C084FC]'"
                    [style.height.px]="isPlaying ? ((h * 3.2) + ((i % 4) * 2)) : (h * 2.5)">
                  </span>
                </div>

                <div class="text-xs font-mono font-bold text-white/90 shrink-0">
                  {{ formatTime(audioProgressSec) }} / {{ formatTime(audioDurationSec) }}
                </div>
              </div>

              <!-- Barre de progression -->
              <div class="w-full bg-white/20 rounded-full h-2 cursor-pointer" (click)="onProgressBarClick($event)">
                <div class="bg-white h-full rounded-full transition-all" [style.width.%]="audioProgressPercent"></div>
              </div>
            </div>

            <!-- Références documentaires vérifiées -->
            <div class="rounded-xl bg-white/10 p-3.5 space-y-2 border border-white/15">
              <span class="text-xs font-extrabold text-[#E9D5FF] flex items-center gap-1.5">
                <span>📖</span>
                <span>Sources vérifiables du rapport :</span>
              </span>
              <div class="space-y-1">
                <div
                  *ngFor="let ref of currentEpisode?.sourceReferences"
                  class="text-[11px] text-[#DDD6FE] flex items-start gap-1.5"
                >
                  <span class="font-bold text-white shrink-0">Page {{ ref.page }} :</span>
                  <span class="italic">« {{ ref.excerpt }} »</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Liste des épisodes et transcription à droite -->
          <div class="lg:col-span-5 space-y-4">
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <h4 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                <span>🎧</span>
                <span>Choisir un épisode</span>
              </h4>
              <div class="space-y-2">
                <div
                  *ngFor="let ep of audioEpisodes; let i = index"
                  (click)="selectAndPlayEpisode(i)"
                  [class]="selectedEpisodeIndex === i
                    ? 'border-2 border-[#7C3AED] bg-[#F5F3FF]'
                    : 'border border-[#E4E0F5] bg-white hover:bg-[#FAFAFC]'"
                  class="p-3 rounded-2xl flex items-center justify-between gap-3 transition cursor-pointer"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span
                      [class]="selectedEpisodeIndex === i ? 'bg-[#7C3AED] text-white' : 'bg-[#F0EDFA] text-[#7C3AED]'"
                      class="h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                    >
                      {{ i + 1 }}
                    </span>
                    <div class="min-w-0">
                      <p class="text-xs font-extrabold text-[#0F1035] truncate">{{ ep.title }}</p>
                      <p class="text-[10px] text-[#64748B] truncate">{{ ep.subtitle }}</p>
                    </div>
                  </div>
                  <span class="text-[11px] font-bold text-[#64748B] shrink-0">~ 2 min</span>
                </div>
              </div>
            </div>

            <!-- Transcription synchronisée -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                  <span>📄</span>
                  <span>Transcription textuelle</span>
                </h4>
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  100% Fidèle
                </span>
              </div>
              <div class="p-3 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] text-xs text-[#31355B] leading-relaxed max-h-48 overflow-y-auto">
                {{ currentEpisode?.script }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 3 : MES RÉSULTATS (RIASEC sans +Activer, Aptitudes, HEXACO)     -->
      <!-- ================================================================== -->
      <div *ngIf="activeSubTab === 'RESULTATS'" class="space-y-6">

        <!-- En-tête explicatif -->
        <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <h3 class="text-lg font-extrabold text-[#0F1035] flex items-center gap-2">
              <span>📊</span>
              <span>Résultats officiels du rapport Rdv {{ rdvNumber }}</span>
            </h3>
            <p class="text-xs text-[#555A8A]">
              Ces résultats ont été établis par les psychologues du Centre des Possibles et ne sont pas modifiables.
            </p>
          </div>
          <span class="text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] border border-[#E4E0F5] px-3 py-1.5 rounded-full shrink-0">
            🔒 Données certifiées
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <!-- 1. RIASEC (Col 1..4) -->
          <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div>
              <div class="flex items-center justify-between">
                <h4 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                  <span>🎯</span>
                  <span>Centres d'intérêt (RIASEC)</span>
                </h4>
                <span class="text-[11px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-md">Page 4</span>
              </div>
              <p class="text-xs text-[#64748B] mt-1">
                Classement officiel issu de tes réponses au questionnaire.
              </p>
            </div>

            <!-- Liste sans bouton "+ Activer" : affichage respectueux et fidèle -->
            <div class="space-y-2">
              <div
                *ngFor="let r of riasecOrderedDisplay"
                [class]="r.selected
                  ? 'border-2 border-[#7C3AED] bg-[#FDF4FF]'
                  : 'border border-[#E4E0F5] bg-[#FAFAFC]'"
                class="p-3 rounded-2xl flex items-center justify-between transition"
              >
                <div class="flex items-center gap-3">
                  <span
                    [class]="r.badgeClass"
                    class="h-7 w-7 rounded-full text-white font-black flex items-center justify-center text-xs shrink-0"
                  >
                    {{ r.letter }}
                  </span>
                  <div>
                    <p class="text-xs font-black text-[#0F1035]">{{ r.letter }} – {{ r.name }}</p>
                    <p class="text-[10px] text-[#64748B]">{{ r.keywords }}</p>
                  </div>
                </div>

                <span
                  *ngIf="r.selected"
                  class="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full"
                >
                  Dominante
                </span>
                <span
                  *ngIf="!r.selected"
                  class="text-[10px] font-medium text-[#94A3B8]"
                >
                  Secondaire
                </span>
              </div>
            </div>

            <p class="text-[11px] text-[#64748B] italic pt-2 border-t border-[#F0EDFA]">
              Note : Aucun score chiffré réducteur n'est attribué.
            </p>
          </div>

          <!-- 2. APTITUDES (Col 5..8) -->
          <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div>
              <div class="flex items-center justify-between">
                <h4 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                  <span>⭐</span>
                  <span>Aptitudes cognitives</span>
                </h4>
                <span class="text-[11px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-md">Page 5</span>
              </div>
              <p class="text-xs text-[#64748B] mt-1">
                9 fonctions observées lors des jeux au Centre des Possibles.
              </p>
            </div>

            <div class="space-y-2">
              <div
                *ngFor="let apt of aptitudesList"
                class="p-2.5 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] flex items-center justify-between text-xs font-bold text-[#0F1035]"
              >
                <div class="flex items-center gap-2">
                  <span>{{ apt.icon }}</span>
                  <span>{{ apt.title }}</span>
                </div>
                <span class="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-extrabold">
                  {{ apt.tag }}
                </span>
              </div>
            </div>

            <!-- Réserve méthodologique explicite -->
            <div class="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3 text-[11px] text-[#78350F] leading-relaxed">
              <strong>Réserve méthodologique (p. 5) :</strong> Ces résultats représentent une photo prise le jour du test et ne constituent en aucun cas une limite figée de ton potentiel.
            </div>
          </div>

          <!-- 3. HEXACO (Col 9..12) -->
          <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div>
              <div class="flex items-center justify-between">
                <h4 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                  <span>👥</span>
                  <span>Personnalité (HEXACO)</span>
                </h4>
                <span class="text-[11px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-md">Page 6</span>
              </div>
              <p class="text-xs text-[#64748B] mt-1">
                6 dimensions personnelles explorées au travail.
              </p>
            </div>

            <div class="space-y-2">
              <div
                *ngFor="let h of hexacoList"
                class="p-2.5 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-1"
              >
                <div class="flex items-center justify-between text-xs font-extrabold text-[#0F1035]">
                  <span class="flex items-center gap-1.5">
                    <span>{{ h.icon }}</span>
                    <span>{{ h.name }}</span>
                  </span>
                  <span class="text-[10px] text-[#7C3AED]">Page 6</span>
                </div>
                <p class="text-[11px] text-[#64748B] leading-tight">{{ h.description }}</p>
              </div>
            </div>

            <!-- Rappel bienveillant -->
            <div class="rounded-xl bg-[#F5F3FF] border border-[#E4E0F5] p-3 text-[11px] text-[#4C1D95] leading-relaxed">
              <strong>Principe clé (p. 6) :</strong> Aucun profil n'est bon ou mauvais. Chaque façon d'être apporte des forces adaptées à différents métiers.
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 4 : JE PRÉPARE LA SUITE                                        -->
      <!-- ================================================================== -->
      <div *ngIf="activeSubTab === 'SUITE'" class="space-y-6">
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
          <div class="space-y-1">
            <h3 class="text-xl font-extrabold text-[#0F1035] flex items-center gap-2">
              <span>🧭</span>
              <span>Construire la suite de ton parcours</span>
            </h3>
            <p class="text-xs sm:text-sm text-[#555A8A]">
              Ton bilan te donne des pistes. Voici les 3 manières concrètes d'avancer dès aujourd'hui.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <!-- 1. Immersion Pro -->
            <div class="rounded-2xl bg-gradient-to-br from-[#FAF5FF] to-white border border-[#E4E0F5] p-5 space-y-3 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="h-10 w-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xl">
                  💼
                </div>
                <h4 class="text-base font-extrabold text-[#0F1035]">Immersion Pro</h4>
                <p class="text-xs text-[#555A8A] leading-relaxed">
                  Prépare un stage d'observation d'une semaine pour tester un métier sur le terrain.
                </p>
              </div>
              <button
                type="button"
                (click)="onNavigate('IMMERSION_PRO')"
                class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-extrabold py-2.5 px-4 transition text-center shadow-xs"
              >
                Accéder à Immersion Pro →
              </button>
            </div>

            <!-- 2. Poser mes questions -->
            <div class="rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-white border border-[#E4E0F5] p-5 space-y-3 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  💬
                </div>
                <h4 class="text-base font-extrabold text-[#0F1035]">Mes questions</h4>
                <p class="text-xs text-[#555A8A] leading-relaxed">
                  Note toutes tes interrogations pour ne rien oublier lors de ton prochain échange.
                </p>
              </div>
              <button
                type="button"
                (click)="onNavigate('MES_QUESTIONS')"
                class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-2.5 px-4 transition text-center shadow-xs"
              >
                Ouvrir mes questions →
              </button>
            </div>

            <!-- 3. Trouver de l'aide / Conseiller -->
            <div class="rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-white border border-[#E4E0F5] p-5 space-y-3 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                  🏛️
                </div>
                <h4 class="text-base font-extrabold text-[#0F1035]">Structures d'aide</h4>
                <p class="text-xs text-[#555A8A] leading-relaxed">
                  CIO, Mission Locale de Nice et professionnels de l'orientation gratuits près de chez toi.
                </p>
              </div>
              <button
                type="button"
                (click)="onNavigate('ANNUAIRE_SUPPORT')"
                class="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2.5 px-4 transition text-center shadow-xs"
              >
                Voir les structures d'aide →
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ==================================================================== -->
    <!-- MODAL TRANSCRIPTION COMPLÈTE                                         -->
    <!-- ==================================================================== -->
    <div
      *ngIf="showTranscriptModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      (click)="showTranscriptModal = false"
    >
      <div
        class="w-full max-w-2xl rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-center justify-between border-b border-[#F0EDFA] pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">📄</span>
            <div>
              <h3 class="text-lg font-extrabold text-[#0F1035]">
                Transcription — {{ currentEpisode?.title }}
              </h3>
              <p class="text-xs text-[#64748B]">Bilan Rdv {{ rdvNumber }} • Épisode {{ selectedEpisodeIndex + 1 }}/{{ audioEpisodes.length }}</p>
            </div>
          </div>
          <button
            type="button"
            (click)="showTranscriptModal = false"
            class="h-9 w-9 rounded-full bg-[#F3EFFE] text-[#6D28D9] flex items-center justify-center font-bold hover:bg-[#E9D5FF] transition"
          >
            ✕
          </button>
        </div>

        <!-- Segments temporels -->
        <div class="flex-1 overflow-y-auto space-y-3 pr-2 text-xs sm:text-sm text-[#31355B] leading-relaxed">
          <div
            *ngFor="let seg of currentEpisode?.transcriptSegments"
            class="p-3 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-1"
          >
            <span class="text-[10px] font-mono font-bold text-[#7C3AED] bg-white px-2 py-0.5 rounded border border-[#E4E0F5]">
              {{ formatTime(seg.startMs / 1000) }} – {{ formatTime(seg.endMs / 1000) }}
            </span>
            <p>{{ seg.text }}</p>
          </div>

          <div class="pt-3 border-t border-[#F0EDFA] text-xs text-[#64748B]">
            <strong>Sources citées :</strong>
            <ul class="list-disc pl-5 mt-1 space-y-0.5">
              <li *ngFor="let s of currentEpisode?.sourceReferences">
                Page {{ s.page }} : « {{ s.excerpt }} »
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-3 border-t border-[#F0EDFA] flex justify-end">
          <button
            type="button"
            (click)="showTranscriptModal = false"
            class="rounded-xl bg-[#7C3AED] text-white px-5 py-2 text-xs font-bold hover:bg-[#6D28D9] transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  `
})
export class ReportOverviewComponent implements OnInit, OnDestroy {
  @Input() rdvNumber: string = '2187';
  @Input() pageCount: number = 17;
  @Input() reportDate: string = '12/11/2026';
  @Input() journeyMode: JourneyMode = 'SUPPORTED';
  @Input() careers: UICareer[] = [];
  @Input() audioEpisodes: UIEpisode[] = [];
  @Input() riasecOrderedDisplay: UIRiasecItem[] = [];

  @Output() navigateTab = new EventEmitter<string>();
  @Output() exploreCareers = new EventEmitter<void>();

  activeSubTab: ReportSubTab = 'COMPRENDRE';
  selectedEpisodeIndex: number = 0;
  isPlaying: boolean = false;
  playbackRate: number = 1;
  audioProgressSec: number = 45;
  audioDurationSec: number = 128; // 2:08
  showTranscriptModal: boolean = false;

  private timerInterval: any = null;

  aptitudesList: UIAptitudeItem[] = [
    { id: 'apt-1', title: 'Flexibilité des catégories', description: 'Capacité à changer de point de vue', icon: '☆', pdfPage: 5, tag: 'Observé' },
    { id: 'apt-2', title: 'Partage du temps', description: 'Gestion de plusieurs sollicitations', icon: '⏱️', pdfPage: 5, tag: 'Observé' },
    { id: 'apt-3', title: 'Mémorisation visuelle', description: 'Retenir et manipuler des formes', icon: '🧠', pdfPage: 5, tag: 'Observé' },
    { id: 'apt-4', title: 'Raisonnement déductif', description: 'Déduire une règle logique', icon: '💡', pdfPage: 5, tag: 'Observé' }
  ];

  hexacoList: UIHexacoItem[] = [
    { id: 'h-1', name: 'Ouvert à l’expérience', description: 'Curiosité culturelle et sensibilité créative', icon: '💡', color: '#D97706', pdfPage: 6 },
    { id: 'h-2', name: 'Agréabilité', description: 'Recherche de coopération et climat harmonieux', icon: '🤝', color: '#059669', pdfPage: 6 },
    { id: 'h-3', name: 'Extraversion', description: 'Goût pour le partage et l’énergie d’équipe', icon: '💬', color: '#7C3AED', pdfPage: 6 },
    { id: 'h-4', name: 'Humilité-honnêteté', description: 'Transparence et authenticité dans les relations', icon: '⚖️', color: '#2563EB', pdfPage: 6 }
  ];

  get currentEpisode(): UIEpisode | undefined {
    return this.audioEpisodes[this.selectedEpisodeIndex] || this.audioEpisodes[0];
  }

  get audioProgressPercent(): number {
    if (!this.audioDurationSec || this.audioDurationSec <= 0) return 0;
    return Math.min(100, Math.max(0, (this.audioProgressSec / this.audioDurationSec) * 100));
  }

  ngOnInit(): void {
    if (this.currentEpisode) {
      this.audioDurationSec = this.currentEpisode.targetDurationSec || 120;
    }
  }

  ngOnDestroy(): void {
    this.stopAudio();
  }

  setSubTab(tab: ReportSubTab): void {
    this.activeSubTab = tab;
  }

  goToResultSection(dimension: 'RIASEC' | 'APTITUDES' | 'HEXACO'): void {
    this.activeSubTab = 'RESULTATS';
  }

  selectAndPlayEpisode(idx: number): void {
    this.stopAudio();
    this.selectedEpisodeIndex = idx;
    const ep = this.audioEpisodes[idx];
    if (ep) {
      this.audioDurationSec = ep.targetDurationSec || 120;
      this.audioProgressSec = 0;
      this.startAudio();
    }
  }

  toggleAudioPlay(): void {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.startAudio();
    }
  }

  startAudio(): void {
    this.isPlaying = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = this.currentEpisode?.script || 'Lecture de ton épisode.';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = this.playbackRate;
      utterance.onend = () => {
        this.isPlaying = false;
        this.clearTimer();
      };
      utterance.onerror = () => {
        this.isPlaying = false;
        this.clearTimer();
      };
      window.speechSynthesis.speak(utterance);
    }

    this.clearTimer();
    this.timerInterval = setInterval(() => {
      if (this.audioProgressSec < this.audioDurationSec) {
        this.audioProgressSec += 1;
      } else {
        this.stopAudio();
      }
    }, 1000 / this.playbackRate);
  }

  pauseAudio(): void {
    this.isPlaying = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.clearTimer();
  }

  stopAudio(): void {
    this.isPlaying = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  cyclePlaybackRate(): void {
    if (this.playbackRate === 1) {
      this.playbackRate = 1.15;
    } else if (this.playbackRate === 1.15) {
      this.playbackRate = 0.85;
    } else {
      this.playbackRate = 1;
    }
    if (this.isPlaying) {
      this.startAudio();
    }
  }

  onProgressBarClick(e: MouseEvent): void {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    this.audioProgressSec = Math.round(ratio * this.audioDurationSec);
  }

  formatTime(totalSec: number): string {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  onExploreCareers(): void {
    this.exploreCareers.emit();
  }

  onNavigate(tab: string): void {
    this.navigateTab.emit(tab);
  }
}
