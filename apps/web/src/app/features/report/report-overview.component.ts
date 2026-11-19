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
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import { JourneyMode } from '../../shared/autonomous-data';
import { UIEpisode } from '../../shared/restitution-data';

export type ReportSubTab = 'COMPRENDRE' | 'AUDIO' | 'SUITE';

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
  imports: [MbIconComponent, CommonModule, FormsModule],
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
              <mb-icon name="book-open"></mb-icon>
            </div>
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#E9D5FF] border border-white/20">
                <span><mb-icon name="sparkles"></mb-icon> Restitution certifiée</span>
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
          <span><mb-icon name="briefcase"></mb-icon></span>
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
          <span><mb-icon name="headphones"></mb-icon></span>
          <span>J'écoute mon bilan</span>
          <span class="rounded-full bg-white/20 text-[10px] px-1.5 py-0.2 font-extrabold">6</span>
        </button>



        <button
          type="button"
          (click)="setSubTab('SUITE')"
          [class]="activeSubTab === 'SUITE'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] hover:bg-[#F5F3FF] border border-[#E4E0F5] font-bold'"
          class="rounded-full px-5 py-2.5 text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <span><mb-icon name="compass"></mb-icon></span>
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
                  <span class="text-amber-400 text-xl"><mb-icon name="sparkles"></mb-icon></span>
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
                      <span class="text-[8px] text-emerald-600 font-bold">✓</span>
                    </div>
                    <div class="h-1.5 bg-[#A855F7]/30 rounded-full flex items-center px-0.5">
                      <span class="text-[8px] text-emerald-600 font-bold">✓</span>
                    </div>
                    <div class="h-1.5 bg-[#A855F7]/30 rounded-full flex items-center px-0.5">
                      <span class="text-[8px] text-emerald-600 font-bold">✓</span>
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
              <span class="text-[#7C3AED] text-sm"><mb-icon name="lightbulb"></mb-icon></span>
              <p>Ce sont des pistes de réflexion, à discuter avec ton conseiller.</p>
            </div>
          </div>

          <!-- COLONNE DROITE (6/12) : « J'écoute mon bilan » (Épisodes + Lecteur compact) -->
          <div class="lg:col-span-6 xl:col-span-6 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#0F1035] flex items-center gap-2.5">
                  <span class="text-[#7C3AED]"><mb-icon name="headphones"></mb-icon></span>
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
                      <mb-icon [name]="(selectedEpisodeIndex === idx && isPlaying) ? 'pause' : 'play'"></mb-icon>
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
                <mb-icon [name]="isPlaying ? 'pause' : 'play'"></mb-icon>
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
                  <span><mb-icon name="file-text"></mb-icon></span>
                  <span class="hidden sm:inline">Transcription</span>
                </button>
              </div>
            </div>
          </div>
        </div>



        <!-- RANGÉE INFÉRIEURE COMPLÈTE : « ET MAINTENANT ? » -->
        <div class="rounded-[28px] bg-[#F8F7FF] border border-[#E4E0F5] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h4 class="text-lg font-black text-[#0F1035] flex items-center gap-2">
              <span class="text-[#7C3AED]"><mb-icon name="compass"></mb-icon></span>
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
              <span><mb-icon name="briefcase"></mb-icon></span>
              <span>Préparer une immersion</span>
            </button>

            <button
              type="button"
              (click)="onNavigate('MES_QUESTIONS')"
              class="rounded-xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED] text-[#0F1035] hover:text-[#7C3AED] px-4 py-2.5 text-xs font-extrabold shadow-2xs transition flex items-center gap-2"
            >
              <span><mb-icon name="sparkles"></mb-icon></span>
              <span>Poser mes questions</span>
            </button>

            <!-- Échanger avec mon conseiller si accompagné, ou Trouver un accompagnement si autonome -->
            <button
              *ngIf="journeyMode === 'SUPPORTED'"
              type="button"
              (click)="onNavigate('MES_QUESTIONS')"
              class="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] text-[#065F46] px-4 py-2.5 text-xs font-extrabold shadow-2xs transition flex items-center gap-2"
            >
              <span><mb-icon name="users"></mb-icon></span>
              <span>Échanger avec mon conseiller</span>
            </button>

            <button
              *ngIf="journeyMode === 'AUTONOMOUS'"
              type="button"
              (click)="onNavigate('ANNUAIRE_SUPPORT')"
              class="rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] hover:bg-[#E0E7FF] text-[#4338CA] px-4 py-2.5 text-xs font-extrabold shadow-2xs transition flex items-center gap-2"
            >
              <span><mb-icon name="landmark"></mb-icon></span>
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
                <mb-icon name="mic"></mb-icon> Épisode {{ currentEpisode?.episodeNumber || 1 }} sur {{ audioEpisodes.length }}
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
                  <mb-icon [name]="isPlaying ? 'pause' : 'play'"></mb-icon>
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
                <span><mb-icon name="book-open"></mb-icon></span>
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
                <span><mb-icon name="headphones"></mb-icon></span>
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
                  <span><mb-icon name="file-text"></mb-icon></span>
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
      <!-- VUE 4 : JE PRÉPARE LA SUITE                                        -->
      <!-- ================================================================== -->
      <div *ngIf="activeSubTab === 'SUITE'" class="space-y-6">
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
          <div class="space-y-1">
            <h3 class="text-xl font-extrabold text-[#0F1035] flex items-center gap-2">
              <span><mb-icon name="compass"></mb-icon></span>
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
                  <mb-icon name="briefcase"></mb-icon>
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
                  <mb-icon name="message-circle"></mb-icon>
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
                  <mb-icon name="landmark"></mb-icon>
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
            <span class="text-2xl"><mb-icon name="file-text"></mb-icon></span>
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
    { id: 'apt-1', title: 'Flexibilité des catégories', description: 'Capacité à changer de point de vue', icon: 'star', pdfPage: 5, tag: 'Observé' },
    { id: 'apt-2', title: 'Partage du temps', description: 'Gestion de plusieurs sollicitations', icon: 'timer', pdfPage: 5, tag: 'Observé' },
    { id: 'apt-3', title: 'Mémorisation visuelle', description: 'Retenir et manipuler des formes', icon: 'brain', pdfPage: 5, tag: 'Observé' },
    { id: 'apt-4', title: 'Raisonnement déductif', description: 'Déduire une règle logique', icon: 'lightbulb', pdfPage: 5, tag: 'Observé' }
  ];

  hexacoList: UIHexacoItem[] = [
    { id: 'h-1', name: 'Ouvert à l’expérience', description: 'Curiosité culturelle et sensibilité créative', icon: 'lightbulb', color: '#D97706', pdfPage: 6 },
    { id: 'h-2', name: 'Agréabilité', description: 'Recherche de coopération et climat harmonieux', icon: 'handshake', color: '#059669', pdfPage: 6 },
    { id: 'h-3', name: 'Extraversion', description: 'Goût pour le partage et l’énergie d’équipe', icon: 'message-circle', color: '#7C3AED', pdfPage: 6 },
    { id: 'h-4', name: 'Humilité-honnêteté', description: 'Transparence et authenticité dans les relations', icon: 'scale', color: '#2563EB', pdfPage: 6 }
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
    if (dimension === 'RIASEC') {
      this.selectAndPlayEpisode(1);
    } else if (dimension === 'APTITUDES') {
      this.selectAndPlayEpisode(2);
    } else {
      this.selectAndPlayEpisode(3);
    }
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
