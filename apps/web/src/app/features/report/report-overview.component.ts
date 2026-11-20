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
      <!-- BANNIÈRE HERO « Découvre ce que dit ton bilan » (Affichée sur Suite) -->
      <!-- ================================================================== -->
      <div *ngIf="activeSubTab === 'SUITE'" class="rounded-[28px] bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9333EA] text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute left-1/3 -bottom-20 w-80 h-80 bg-[#C084FC]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex items-center justify-between gap-6 relative z-10">
          <div class="flex items-center gap-4 sm:gap-5">
            <div class="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm text-2xl sm:text-3xl">
              <mb-icon name="target"></mb-icon>
            </div>
            <div class="space-y-1.5">
              <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Découvre ce que dit ton bilan
              </h2>
              <p class="text-xs sm:text-sm text-[#E7E8FB] max-w-2xl leading-relaxed">
                Une restitution claire et personnalisée pour comprendre tes résultats, explorer des métiers et préparer la suite.
              </p>
            </div>
          </div>
          <div class="hidden lg:flex items-center justify-center pr-6 text-4xl sm:text-5xl select-none">
            🏔️🚩
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- NAVIGATION INTERNE : 3 ONGLETS CONFORMES À LA MAQUETTE             -->
      <!-- ================================================================== -->
      <div class="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          (click)="setSubTab('COMPRENDRE')"
          [class]="activeSubTab === 'COMPRENDRE'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] hover:bg-[#F5F3FF] border border-[#E4E0F5] font-bold'"
          class="rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer"
        >
          <span><mb-icon name="sliders"></mb-icon></span>
          <span>Comprendre mon bilan</span>
        </button>

        <button
          type="button"
          (click)="setSubTab('AUDIO')"
          [class]="activeSubTab === 'AUDIO'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] hover:bg-[#F5F3FF] border border-[#E4E0F5] font-bold'"
          class="rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer"
        >
          <span><mb-icon name="headphones"></mb-icon></span>
          <span>J'écoute mon bilan</span>
          <span class="rounded-full bg-[#F5F3FF] text-[#6328E8] text-[11px] px-2 py-0.5 font-black border border-[#DDD6FE]">6</span>
        </button>

        <button
          type="button"
          (click)="setSubTab('SUITE')"
          [class]="activeSubTab === 'SUITE'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] hover:bg-[#F5F3FF] border border-[#E4E0F5] font-bold'"
          class="rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer"
        >
          <span><mb-icon name="target"></mb-icon></span>
          <span>Je prépare la suite</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 1 : COMPRENDRE MON BILAN (Vue Principale 2 Colonnes 50% / 50%) -->
      <!-- ================================================================== -->
      <div *ngIf="activeSubTab === 'COMPRENDRE'" class="space-y-6">

        <!-- GRILLE 2 COLONNES (50% / 50%) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          <!-- ============================================================== -->
          <!-- COLONNE GAUCHE (6/12) : Mon bilan en quelques mots             -->
          <!-- ============================================================== -->
          <div class="lg:col-span-6 flex flex-col justify-between space-y-6">

            <!-- CARTE 1 : MON BILAN EN QUELQUES MOTS -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-5">
              
              <!-- En-tête avec titre et badge IA éthique -->
              <div class="space-y-2">
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#0F1035] flex items-center gap-2">
                  <span class="text-amber-400 text-xl"><mb-icon name="sparkles"></mb-icon></span>
                  <span>Mon bilan en quelques mots</span>
                </h3>
                
                <div>
                  <button
                    type="button"
                    (click)="toggleAIInfoModal()"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition cursor-pointer shadow-2xs"
                    title="En savoir plus sur l'assistance par IA"
                  >
                    <span>🌿</span>
                    <span>Explication assistée par IA</span>
                    <span class="text-[11px] font-normal text-[#059669]">ⓘ</span>
                  </button>
                </div>
              </div>

              <!-- 3 Segments pills (Filtres de vulgarisation) -->
              <div class="flex items-center gap-1.5 p-1 bg-[#F8F7FF] rounded-2xl border border-[#E4E0F5] text-xs font-bold">
                <button
                  type="button"
                  (click)="selectAIMode('SIMPLE')"
                  [class]="aiMode === 'SIMPLE'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#42466B] hover:text-[#0F1035]'"
                  class="flex-1 py-2 px-3 rounded-xl transition text-center cursor-pointer font-bold"
                >
                  🌟 En clair &amp; simple
                </button>
                <button
                  type="button"
                  (click)="selectAIMode('PARENTS')"
                  [class]="aiMode === 'PARENTS'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#42466B] hover:text-[#0F1035]'"
                  class="flex-1 py-2 px-3 rounded-xl transition text-center cursor-pointer font-bold"
                >
                  👥 Pour mes proches
                </button>
                <button
                  type="button"
                  (click)="selectAIMode('WORK')"
                  [class]="aiMode === 'WORK'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#42466B] hover:text-[#0F1035]'"
                  class="flex-1 py-2 px-3 rounded-xl transition text-center cursor-pointer font-bold"
                >
                  💼 Dans la vraie vie
                </button>
              </div>

              <!-- Synthèse structurée certifiée du Rapport 2187 (Zéro invention) -->
              <div class="space-y-3 pt-1">
                <p class="text-xs sm:text-sm font-bold text-[#0F1035]">
                  {{ synthesisIntro }}
                </p>

                <!-- Point 1 -->
                <div class="flex items-start gap-3">
                  <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </span>
                  <p class="text-xs sm:text-sm text-[#1E1B4B] leading-relaxed">
                    {{ synthesisPoint1 }}
                  </p>
                </div>

                <!-- Point 2 -->
                <div class="flex items-start gap-3">
                  <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </span>
                  <p class="text-xs sm:text-sm text-[#1E1B4B] leading-relaxed">
                    {{ synthesisPoint2 }}
                  </p>
                </div>

                <!-- Point 3 -->
                <div class="flex items-start gap-3">
                  <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    3
                  </span>
                  <p class="text-xs sm:text-sm text-[#1E1B4B] leading-relaxed">
                    {{ synthesisPoint3 }}
                  </p>
                </div>
              </div>

              <!-- Encadré lavande « En bref » -->
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 text-xs sm:text-[13px] text-[#31355B] leading-relaxed flex items-start gap-2.5">
                <span class="text-base shrink-0 mt-0.5">💡</span>
                <p>
                  <strong>En bref :</strong> {{ synthesisEnBref }}
                </p>
              </div>

              <!-- 4 Repères à pastilles (Accès direct aux rubriques) -->
              <div class="space-y-2">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    type="button"
                    (click)="toggleDetailCard('RIASEC')"
                    [class]="activeDetailCard === 'RIASEC'
                      ? 'bg-[#10B981] text-white border-emerald-600 shadow-sm'
                      : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] hover:bg-[#D1FAE5]'"
                    class="rounded-xl border p-2 text-center text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>✓</span>
                    <span class="truncate">Centres d'intérêt</span>
                  </button>

                  <button
                    type="button"
                    (click)="toggleDetailCard('APTITUDES')"
                    [class]="activeDetailCard === 'APTITUDES'
                      ? 'bg-[#10B981] text-white border-emerald-600 shadow-sm'
                      : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] hover:bg-[#D1FAE5]'"
                    class="rounded-xl border p-2 text-center text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>✓</span>
                    <span class="truncate">Aptitudes</span>
                  </button>

                  <button
                    type="button"
                    (click)="toggleDetailCard('HEXACO')"
                    [class]="activeDetailCard === 'HEXACO'
                      ? 'bg-[#10B981] text-white border-emerald-600 shadow-sm'
                      : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] hover:bg-[#D1FAE5]'"
                    class="rounded-xl border p-2 text-center text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>✓</span>
                    <span class="truncate">Personnalité</span>
                  </button>

                  <button
                    type="button"
                    (click)="onExploreCareers()"
                    class="rounded-xl bg-[#FAF5FF] border border-[#DDD6FE] p-2 text-center text-xs font-extrabold text-[#7C3AED] hover:bg-[#F3E8FF] transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>🚀</span>
                    <span class="truncate">{{ careers.length }} métiers</span>
                  </button>
                </div>

                <!-- Volet déroulant interactif certifié (sans jargon) -->
                <div *ngIf="activeDetailCard === 'RIASEC'" class="p-4 rounded-2xl bg-white border-2 border-emerald-500/40 space-y-2.5 text-xs text-[#1E1B4B] animate-fadeIn shadow-xs">
                  <div class="flex items-center justify-between pb-1 border-b border-emerald-100">
                    <span class="font-black text-[#0F1035] flex items-center gap-1.5">
                      <span>🎨</span>
                      <span>Tes centres d'intérêt réels (p. 4 du rapport) :</span>
                    </span>
                    <button type="button" (click)="activeDetailCard = null" class="text-gray-400 hover:text-gray-600 font-bold cursor-pointer">✕</button>
                  </div>
                  <p>• <strong>Artistique (dominant)</strong> : Tu aimes créer, concevoir et inventer sans être enfermée dans une routine.</p>
                  <p>• <strong>Entreprenant (fort)</strong> : Tu as de l'énergie pour proposer des idées et mener des projets.</p>
                  <p>• <strong>Réaliste (présent)</strong> : Tu as besoin d'actions concrètes et de voir le résultat de tes efforts.</p>

                  <!-- Interaction réflexive : Qu'est-ce que tu en penses ? -->
                  <div class="mt-3 pt-2 border-t border-emerald-100/60 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] font-extrabold text-[#0F1035] flex items-center gap-1">
                        <span>💭</span>
                        <span>Qu'est-ce que tu en penses ?</span>
                      </span>
                      <span *ngIf="userFeelings['riasec']" class="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ✓ Noté
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        (click)="setFeeling('riasec', 'RECOGNIZED', 'Centres d’intérêt RIASEC')"
                        [class]="userFeelings['riasec'] === 'RECOGNIZED' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        😊 Je me reconnais
                      </button>
                      <button
                        type="button"
                        (click)="setFeeling('riasec', 'NOT_SURE', 'Centres d’intérêt RIASEC')"
                        [class]="userFeelings['riasec'] === 'NOT_SURE' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        🤔 Pas sûr
                      </button>
                      <button
                        type="button"
                        (click)="setFeeling('riasec', 'WANT_TO_DISCUSS', 'Centres d’intérêt RIASEC')"
                        [class]="userFeelings['riasec'] === 'WANT_TO_DISCUSS' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        💬 En parler au conseiller
                      </button>
                    </div>
                    <div class="flex items-center gap-2 pt-1 text-[11px]">
                      <button type="button" (click)="onNotUnderstood('Centres d’intérêt RIASEC')" class="text-amber-700 hover:underline cursor-pointer font-bold">
                        ❓ Je n'ai pas compris
                      </button>
                      <span class="text-gray-300">•</span>
                      <button type="button" (click)="onNoteQuestion('Centres d’intérêt RIASEC')" class="text-[#7C3AED] hover:underline cursor-pointer font-bold">
                        📝 Noter une question
                      </button>
                    </div>
                  </div>
                </div>

                <div *ngIf="activeDetailCard === 'APTITUDES'" class="p-4 rounded-2xl bg-white border-2 border-emerald-500/40 space-y-2.5 text-xs text-[#1E1B4B] animate-fadeIn shadow-xs">
                  <div class="flex items-center justify-between pb-1 border-b border-emerald-100">
                    <span class="font-black text-[#0F1035] flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Tes aptitudes observées (p. 5 du rapport) :</span>
                    </span>
                    <button type="button" (click)="activeDetailCard = null" class="text-gray-400 hover:text-gray-600 font-bold cursor-pointer">✕</button>
                  </div>
                  <p>• <strong>Flexibilité mentale</strong> : Tu t'adaptes rapidement quand la consigne ou la situation change.</p>
                  <p>• <strong>Mémoire visuelle</strong> : Tu retiens facilement les images, schémas et agencements d'espace.</p>
                  <p>• <strong>Partage du temps</strong> : Tu sais mener plusieurs petites tâches de front sans paniquer.</p>
                  <p>• <strong>Logique déductive</strong> : Tu rassembles les indices pour trouver la solution logique.</p>

                  <!-- Interaction réflexive : Qu'est-ce que tu en penses ? -->
                  <div class="mt-3 pt-2 border-t border-emerald-100/60 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] font-extrabold text-[#0F1035] flex items-center gap-1">
                        <span>💭</span>
                        <span>Qu'est-ce que tu en penses ?</span>
                      </span>
                      <span *ngIf="userFeelings['aptitudes']" class="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ✓ Noté
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        (click)="setFeeling('aptitudes', 'RECOGNIZED', 'Aptitudes cognitives')"
                        [class]="userFeelings['aptitudes'] === 'RECOGNIZED' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        😊 Je me reconnais
                      </button>
                      <button
                        type="button"
                        (click)="setFeeling('aptitudes', 'NOT_SURE', 'Aptitudes cognitives')"
                        [class]="userFeelings['aptitudes'] === 'NOT_SURE' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        🤔 Pas sûr
                      </button>
                      <button
                        type="button"
                        (click)="setFeeling('aptitudes', 'WANT_TO_DISCUSS', 'Aptitudes cognitives')"
                        [class]="userFeelings['aptitudes'] === 'WANT_TO_DISCUSS' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        💬 En parler au conseiller
                      </button>
                    </div>
                    <div class="flex items-center gap-2 pt-1 text-[11px]">
                      <button type="button" (click)="onNotUnderstood('Aptitudes observées')" class="text-amber-700 hover:underline cursor-pointer font-bold">
                        ❓ Je n'ai pas compris
                      </button>
                      <span class="text-gray-300">•</span>
                      <button type="button" (click)="onNoteQuestion('Aptitudes observées')" class="text-[#7C3AED] hover:underline cursor-pointer font-bold">
                        📝 Noter une question
                      </button>
                    </div>
                  </div>
                </div>

                <div *ngIf="activeDetailCard === 'HEXACO'" class="p-4 rounded-2xl bg-white border-2 border-emerald-500/40 space-y-2.5 text-xs text-[#1E1B4B] animate-fadeIn shadow-xs">
                  <div class="flex items-center justify-between pb-1 border-b border-emerald-100">
                    <span class="font-black text-[#0F1035] flex items-center gap-1.5">
                      <span>🤝</span>
                      <span>Ta personnalité au travail (p. 6 du rapport) :</span>
                    </span>
                    <button type="button" (click)="activeDetailCard = null" class="text-gray-400 hover:text-gray-600 font-bold cursor-pointer">✕</button>
                  </div>
                  <p>• <strong>Curiosité &amp; Ouverture</strong> : Tu t'intéresses à ce qui est nouveau et créatif.</p>
                  <p>• <strong>Esprit d'équipe &amp; Agréabilité</strong> : Tu privilégies la bonne entente et l'écoute mutuelle.</p>
                  <p>• <strong>Sincérité &amp; Humilité</strong> : Tu apprécies la franchise et le respect mutuel.</p>

                  <!-- Interaction réflexive : Qu'est-ce que tu en penses ? -->
                  <div class="mt-3 pt-2 border-t border-emerald-100/60 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] font-extrabold text-[#0F1035] flex items-center gap-1">
                        <span>💭</span>
                        <span>Qu'est-ce que tu en penses ?</span>
                      </span>
                      <span *ngIf="userFeelings['hexaco']" class="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ✓ Noté
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        (click)="setFeeling('hexaco', 'RECOGNIZED', 'Personnalité au travail')"
                        [class]="userFeelings['hexaco'] === 'RECOGNIZED' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        😊 Je me reconnais
                      </button>
                      <button
                        type="button"
                        (click)="setFeeling('hexaco', 'NOT_SURE', 'Personnalité au travail')"
                        [class]="userFeelings['hexaco'] === 'NOT_SURE' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        🤔 Pas sûr
                      </button>
                      <button
                        type="button"
                        (click)="setFeeling('hexaco', 'WANT_TO_DISCUSS', 'Personnalité au travail')"
                        [class]="userFeelings['hexaco'] === 'WANT_TO_DISCUSS' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                        class="px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
                      >
                        💬 En parler au conseiller
                      </button>
                    </div>
                    <div class="flex items-center gap-2 pt-1 text-[11px]">
                      <button type="button" (click)="onNotUnderstood('Personnalité au travail')" class="text-amber-700 hover:underline cursor-pointer font-bold">
                        ❓ Je n'ai pas compris
                      </button>
                      <span class="text-gray-300">•</span>
                      <button type="button" (click)="onNoteQuestion('Personnalité au travail')" class="text-[#7C3AED] hover:underline cursor-pointer font-bold">
                        📝 Noter une question
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CARTE 2 : UNE QUESTION SUR TON BILAN ? -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
              <div class="space-y-1">
                <h4 class="text-base sm:text-lg font-extrabold text-[#0F1035] flex items-center gap-2">
                  <span class="text-[#7C3AED]"><mb-icon name="message-circle"></mb-icon></span>
                  <span>Une question sur ton bilan ?</span>
                </h4>
              </div>

              <!-- 3 suggestions de questions en 1 clic -->
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  (click)="askPredefinedQuestion(1)"
                  class="rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] hover:border-[#7C3AED] hover:bg-[#F3E8FF] px-3 py-1.5 text-xs font-bold text-[#42466B] hover:text-[#7C3AED] transition cursor-pointer shadow-2xs"
                >
                  🎨 Dominante artistique ?
                </button>
                <button
                  type="button"
                  (click)="askPredefinedQuestion(2)"
                  class="rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] hover:border-[#7C3AED] hover:bg-[#F3E8FF] px-3 py-1.5 text-xs font-bold text-[#42466B] hover:text-[#7C3AED] transition cursor-pointer shadow-2xs"
                >
                  ❓ Pas de notes ?
                </button>
                <button
                  type="button"
                  (click)="askPredefinedQuestion(3)"
                  class="rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] hover:border-[#7C3AED] hover:bg-[#F3E8FF] px-3 py-1.5 text-xs font-bold text-[#42466B] hover:text-[#7C3AED] transition cursor-pointer shadow-2xs"
                >
                  📈 Résultats évolutifs ?
                </button>
              </div>

              <!-- Champ de saisie et bouton Demander -->
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  [(ngModel)]="userBilanQuestion"
                  (keyup.enter)="askBilanQuestion(userBilanQuestion)"
                  placeholder="Pose ta question (ex. : Quel métier me correspond le plus ?)"
                  class="flex-1 bg-[#F8F7FF] border border-[#E4E0F5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white"
                />
                <button
                  type="button"
                  (click)="askBilanQuestion(userBilanQuestion)"
                  [disabled]="isAnsweringQuestion || !userBilanQuestion.trim()"
                  class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer disabled:opacity-40 flex items-center gap-2 shadow-xs shrink-0"
                >
                  <span>{{ isAnsweringQuestion ? '...' : 'Demander' }}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </button>
              </div>

              <!-- Réponse bienveillante de l'IA (ou fallback déterministe certifié) -->
              <div *ngIf="aiQuestionAnswer" class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#DDD6FE] text-xs sm:text-sm text-[#1E1B4B] space-y-2 animate-fadeIn shadow-xs">
                <div class="flex items-center justify-between text-xs font-extrabold text-[#7C3AED]">
                  <span class="flex items-center gap-1.5">
                    <mb-icon name="sparkles"></mb-icon>
                    <span>Réponse certifiée · Rapport Rdv {{ rdvNumber }}</span>
                  </span>
                  <button type="button" (click)="aiQuestionAnswer = null" class="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
                </div>
                <p class="leading-relaxed">{{ aiQuestionAnswer }}</p>

                <!-- Action pour enregistrer dans "Mes questions" pour le conseiller -->
                <div class="pt-2 border-t border-[#E4E0F5] flex flex-wrap items-center justify-between gap-2">
                  <span class="text-[11px] text-[#555A8A]">Garder pour ton conseiller :</span>
                  <button
                    type="button"
                    (click)="saveCurrentQuestionToQuestions()"
                    class="rounded-xl bg-[#6328E8] hover:bg-[#521BC6] text-white px-3 py-1.5 text-xs font-extrabold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span><mb-icon name="plus-circle"></mb-icon></span>
                    <span>{{ questionAlreadySaved ? '✓ Enregistrée dans tes questions' : 'Ajouter à "Mes questions"' }}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- ============================================================== -->
          <!-- COLONNE DROITE (6/12) : J'écoute mon bilan & Lecteur Docké    -->
          <!-- ============================================================== -->
          <div class="lg:col-span-6 flex flex-col justify-between space-y-6">

            <!-- CARTE DES 6 ÉPISODES AUDIO -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-xl sm:text-2xl font-extrabold text-[#0F1035] flex items-center gap-2.5">
                    <span class="text-[#7C3AED]"><mb-icon name="headphones"></mb-icon></span>
                    <span>J'écoute mon bilan</span>
                  </h3>
                  <span class="text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] px-3 py-1 rounded-full">
                    6 épisodes
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-[#64748B] mb-4">
                  Des explications audio courtes et simples, issues de ton rapport.
                </p>

                <!-- Liste des 6 chapitres thématiques sans coupure -->
                <div class="space-y-2.5">
                  <div
                    *ngFor="let ep of audioEpisodes; let idx = index"
                    (click)="selectAndPlayEpisode(idx)"
                    [class]="selectedEpisodeIndex === idx
                      ? 'bg-[#F5F3FF] border-2 border-[#7C3AED] shadow-xs'
                      : 'bg-white hover:bg-[#FAFAFC] border border-[#E4E0F5]'"
                    class="p-3.5 rounded-2xl flex items-center justify-between gap-3 transition cursor-pointer"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        [class]="selectedEpisodeIndex === idx && isPlaying
                          ? 'bg-[#7C3AED] text-white shadow-md'
                          : 'bg-white text-[#7C3AED] border border-[#E4E0F5]'"
                        class="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition"
                      >
                        <mb-icon [name]="(selectedEpisodeIndex === idx && isPlaying) ? 'pause' : 'play'"></mb-icon>
                      </button>
                      <div class="min-w-0">
                        <p class="text-xs sm:text-sm font-extrabold text-[#0F1035] truncate">
                          {{ ep.title }}
                        </p>
                        <p class="text-[11px] sm:text-xs text-[#64748B] truncate">
                          {{ ep.subtitle }}
                        </p>
                      </div>
                    </div>
                    <span class="text-[11px] font-bold text-[#64748B] shrink-0 bg-white px-2.5 py-1 rounded-md border border-[#E4E0F5]">
                      ~ 2 min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- LECTEUR AUDIO PREMIUM DOCKÉ EN BAS DE LA COLONNE DROITE -->
            <div class="rounded-2xl bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] text-white p-3.5 sm:p-4 shadow-lg flex items-center justify-between gap-3 sm:gap-4">
              <!-- Bouton Play/Pause blanc -->
              <button
                type="button"
                (click)="toggleAudioPlay()"
                class="h-11 w-11 rounded-full bg-white text-[#6328E8] flex items-center justify-center font-black text-sm shadow-md transition hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                <mb-icon [name]="isPlaying ? 'pause' : 'play'"></mb-icon>
              </button>

              <!-- Titre et Barre de progression blanche -->
              <div class="flex-1 min-w-0 space-y-1">
                <div class="flex items-center justify-between text-xs font-extrabold text-white">
                  <span class="truncate">{{ currentEpisodeTitle }}</span>
                  <span class="text-[11px] text-[#DDD6FE] font-mono shrink-0 ml-2">
                    {{ formattedCurrentTime }} / {{ formattedDuration }}
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
                  class="rounded-lg bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 text-xs font-bold transition cursor-pointer"
                  title="Vitesse de lecture"
                >
                  {{ playbackRate }}x
                </button>

                <button
                  type="button"
                  (click)="showTranscriptModal = true"
                  class="rounded-xl bg-white text-[#6328E8] hover:bg-[#F5F3FF] px-3 py-1.5 text-xs font-black shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Afficher la transcription"
                >
                  <span><mb-icon name="file-text"></mb-icon></span>
                  <span class="hidden sm:inline">Transcription</span>
                </button>
              </div>
            </div>

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
                <span class="text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-0.5 rounded-full border border-[#DDD6FE]">
                  Transcription de l'épisode
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
      <!-- VUE 3 : JE PRÉPARE LA SUITE (Conforme Maquette media_1795124752587) -->
      <!-- ================================================================== -->
      <div *ngIf="activeSubTab === 'SUITE'" class="space-y-6">

        <!-- SECTION 1 : LES MÉTIERS QUE JE SOUHAITE EXPLORER -->
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center shrink-0 text-xl font-bold">
                <mb-icon name="briefcase"></mb-icon>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-extrabold text-[#0F1035]">Les métiers que je souhaite explorer</h3>
                <p class="text-xs text-[#555A8A]">Des pistes issues de ton rapport pour t'aider à découvrir ce qui te correspond.</p>
              </div>
            </div>

            <button
              type="button"
              (click)="onExploreCareers()"
              class="rounded-full bg-white border border-[#E4E0F5] hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#0F1035] px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Voir toutes mes pistes métiers</span>
              <span>→</span>
            </button>
          </div>

          <!-- Filtres et recherche sur les 22 métiers -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs font-bold text-[#555A8A] mr-1">Filtrer par niveau d'études :</span>
              <button
                type="button"
                (click)="selectedZoneFilter = 'ALL'"
                [class]="selectedZoneFilter === 'ALL' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                class="px-2.5 py-1 rounded-full text-xs transition cursor-pointer"
              >
                Tous ({{ careers.length }})
              </button>
              <button
                *ngFor="let z of [1, 2, 3, 4, 5]"
                type="button"
                (click)="selectedZoneFilter = z"
                [class]="selectedZoneFilter === z ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                class="px-2.5 py-1 rounded-full text-xs transition cursor-pointer"
              >
                Zone {{ z }}
              </button>
            </div>

            <div class="w-full sm:w-64">
              <input
                type="text"
                [(ngModel)]="careersSearchTerm"
                placeholder="Rechercher un métier du bilan..."
                class="w-full bg-[#F8F7FF] border border-[#E4E0F5] rounded-xl px-3 py-1.5 text-xs font-medium text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white"
              />
            </div>
          </div>

          <!-- Grille des métiers réels du rapport -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            <div
              *ngFor="let c of displayedReportCareers"
              class="rounded-2xl border border-[#E4E0F5] hover:border-[#7C3AED] bg-white p-4 flex flex-col justify-between gap-3 shadow-2xs transition group"
            >
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <img
                      *ngIf="c.imageUrl"
                      [src]="c.imageUrl"
                      [alt]="c.titleFr"
                      class="h-11 w-11 rounded-xl object-cover border border-[#E4E0F5] shrink-0"
                    />
                    <div *ngIf="!c.imageUrl" class="h-11 w-11 rounded-xl bg-[#FAF5FF] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center shrink-0 font-bold">
                      💼
                    </div>
                    <div class="min-w-0">
                      <h4 class="font-extrabold text-sm text-[#0F1035] group-hover:text-[#7C3AED] transition leading-tight">
                        {{ c.titleFr }}
                      </h4>
                      <p class="text-[11px] text-[#64748B] truncate mt-0.5">
                        {{ c.sectorTag || c.educationLevel || 'Zone ' + c.jobZone }}
                      </p>
                    </div>
                  </div>
                  <span class="rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-purple-200 px-2 py-0.5 text-[10px] font-extrabold shrink-0">
                    Zone {{ c.jobZone }}
                  </span>
                </div>

                <p *ngIf="c.shortSummary" class="text-xs text-[#555A8A] line-clamp-2 leading-relaxed mb-3">
                  {{ c.shortSummary }}
                </p>

                <!-- Boutons de qualification du ressenti / préférence -->
                <div class="space-y-1.5 pt-2 border-t border-[#F0EDFA]">
                  <p class="text-[10px] font-bold text-[#64748B] flex items-center justify-between">
                    <span>Mon ressenti :</span>
                    <span *ngIf="careerPreferences[c.id]" class="text-emerald-700 font-extrabold">
                      {{ getPreferenceLabel(careerPreferences[c.id]) }}
                    </span>
                  </p>
                  <div class="grid grid-cols-2 gap-1 text-[10px]">
                    <button
                      type="button"
                      (click)="setCareerPreference(c.id, 'INTERESTED', c.titleFr)"
                      [class]="careerPreferences[c.id] === 'INTERESTED' ? 'bg-emerald-600 text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                      class="px-2 py-1 rounded-lg transition text-left truncate cursor-pointer hover:border-emerald-400"
                    >
                      ❤️ Ça m'intéresse
                    </button>
                    <button
                      type="button"
                      (click)="setCareerPreference(c.id, 'LEARN_MORE', c.titleFr)"
                      [class]="careerPreferences[c.id] === 'LEARN_MORE' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                      class="px-2 py-1 rounded-lg transition text-left truncate cursor-pointer hover:border-[#7C3AED]"
                    >
                      🔍 En savoir plus
                    </button>
                    <button
                      type="button"
                      (click)="setCareerPreference(c.id, 'NOT_SURE', c.titleFr)"
                      [class]="careerPreferences[c.id] === 'NOT_SURE' ? 'bg-amber-600 text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                      class="px-2 py-1 rounded-lg transition text-left truncate cursor-pointer hover:border-amber-400"
                    >
                      ❓ Pas sûr
                    </button>
                    <button
                      type="button"
                      (click)="setCareerPreference(c.id, 'DISCUSS', c.titleFr)"
                      [class]="careerPreferences[c.id] === 'DISCUSS' ? 'bg-[#2563EB] text-white font-extrabold' : 'bg-[#FAF8FF] border border-[#DDD6FE] text-[#42466B] font-bold'"
                      class="px-2 py-1 rounded-lg transition text-left truncate cursor-pointer hover:border-blue-400"
                    >
                      💬 En parler
                    </button>
                  </div>
                </div>
              </div>

              <!-- Passerelle Immersion Pro -->
              <button
                type="button"
                (click)="onPrepareImmersion(c)"
                class="w-full mt-2 rounded-xl bg-[#FAF5FF] hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white border border-[#DDD6FE] hover:border-transparent py-2 px-3 text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:bg-[#7C3AED] group-hover:text-white"
              >
                <span>🚀 Préparer une immersion</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- Afficher plus / Réduire -->
          <div *ngIf="!careersSearchTerm && selectedZoneFilter === 'ALL' && careers.length > 6" class="pt-2 text-center">
            <button
              type="button"
              (click)="showAllReportCareers = !showAllReportCareers"
              class="rounded-full bg-[#FAF8FF] border border-[#DDD6FE] hover:border-[#7C3AED] text-[#7C3AED] font-extrabold px-5 py-2 text-xs transition cursor-pointer"
            >
              {{ showAllReportCareers ? '▲ Afficher moins de métiers' : '▼ Découvrir les 22 métiers conseillés du bilan (' + careers.length + ')' }}
            </button>
          </div>
        </div>

        <!-- SECTION 2 : CONSTRUIRE LA SUITE DE TON PARCOURS -->
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center shrink-0 text-xl font-bold">
              <mb-icon name="compass"></mb-icon>
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-extrabold text-[#0F1035]">Construire la suite de ton parcours</h3>
              <p class="text-xs text-[#555A8A]">Ton bilan te donne des pistes. Voici 3 manières concrètes d'avancer dès aujourd'hui.</p>
            </div>
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
                  Découvre un métier sur le terrain et prépare une immersion adaptée à ta situation.
                </p>
              </div>
              <button
                type="button"
                (click)="onNavigate('IMMERSION_PRO')"
                class="rounded-xl bg-[#6328E8] hover:bg-[#521BC6] text-white text-xs font-extrabold py-2.5 px-4 transition text-center shadow-xs cursor-pointer"
              >
                Accéder à l'Immersion Pro →
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
                class="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold py-2.5 px-4 transition text-center shadow-xs cursor-pointer"
              >
                Ouvrir mes questions →
              </button>
            </div>

            <!-- 3. Structures d'aide -->
            <div class="rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-white border border-[#E4E0F5] p-5 space-y-3 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                  <mb-icon name="landmark"></mb-icon>
                </div>
                <h4 class="text-base font-extrabold text-[#0F1035]">Structures d'aide</h4>
                <p class="text-xs text-[#555A8A] leading-relaxed">
                  CIO, Mission Locale, CFA... Des professionnels pour t'accompagner près de chez toi.
                </p>
              </div>
              <button
                type="button"
                (click)="onNavigate('AUTOUR_DE_MOI')"
                class="rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold py-2.5 px-4 transition text-center shadow-xs cursor-pointer"
              >
                Voir les structures d'aide →
              </button>
            </div>
          </div>
        </div>

        <!-- SECTION 3 : MES PROCHAINES ACTIONS -->
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center shrink-0 text-xl font-bold">
                <mb-icon name="clipboard"></mb-icon>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-extrabold text-[#0F1035]">Mes prochaines actions</h3>
                <p class="text-xs text-[#555A8A]">Retrouve ici les démarches que tu as lancées et leurs statuts.</p>
              </div>
            </div>

            <button
              type="button"
              (click)="onNavigate('MON_PARCOURS')"
              class="rounded-full bg-white border border-[#E4E0F5] hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#0F1035] px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Voir mon parcours</span>
              <span>→</span>
            </button>
          </div>

          <!-- Liste des démarches datées -->
          <div class="space-y-2.5 pt-1">
            <!-- Action 1 -->
            <div
              (click)="onNavigate('IMMERSION_PRO')"
              class="rounded-2xl border border-[#E4E0F5] hover:border-[#7C3AED] bg-white hover:bg-[#FAFAFC] p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 transition cursor-pointer group"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <span class="text-lg shrink-0">🎨</span>
                <span class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">Explorer le métier de Designer graphique</span>
              </div>
              <div class="flex items-center gap-4 text-xs font-bold">
                <span class="rounded-full bg-[#EDE9FE] text-[#6D28D9] px-3 py-1 font-extrabold">En cours</span>
                <span class="text-[#64748B] flex items-center gap-1 font-medium"><mb-icon name="calendar"></mb-icon> Ajouté le 17 nov.</span>
                <span class="text-[#7C3AED] font-bold group-hover:translate-x-1 transition">→</span>
              </div>
            </div>

            <!-- Action 2 -->
            <div
              (click)="onNavigate('MES_QUESTIONS')"
              class="rounded-2xl border border-[#E4E0F5] hover:border-[#7C3AED] bg-white hover:bg-[#FAFAFC] p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 transition cursor-pointer group"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <span class="text-lg shrink-0">💬</span>
                <span class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">Préparer mes questions pour le conseiller</span>
              </div>
              <div class="flex items-center gap-4 text-xs font-bold">
                <span class="rounded-full bg-[#FEF3C7] text-[#B45309] px-3 py-1 font-extrabold">À faire</span>
                <span class="text-[#64748B] flex items-center gap-1 font-medium"><mb-icon name="calendar"></mb-icon> Ajouté le 17 nov.</span>
                <span class="text-[#7C3AED] font-bold group-hover:translate-x-1 transition">→</span>
              </div>
            </div>

            <!-- Action 3 -->
            <div
              (click)="onNavigate('IMMERSION_PRO')"
              class="rounded-2xl border border-[#E4E0F5] hover:border-[#7C3AED] bg-white hover:bg-[#FAFAFC] p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 transition cursor-pointer group"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <span class="text-lg shrink-0">💼</span>
                <span class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">Me renseigner sur une immersion</span>
              </div>
              <div class="flex items-center gap-4 text-xs font-bold">
                <span class="rounded-full bg-[#FEF3C7] text-[#B45309] px-3 py-1 font-extrabold">À faire</span>
                <span class="text-[#64748B] flex items-center gap-1 font-medium"><mb-icon name="calendar"></mb-icon> Ajouté le 18 nov.</span>
                <span class="text-[#7C3AED] font-bold group-hover:translate-x-1 transition">→</span>
              </div>
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

    <!-- ==================================================================== -->
    <!-- MODAL ASSISTANCE IA RESPONSABLE & ÉTHIQUE                            -->
    <!-- ==================================================================== -->
    <div
      *ngIf="showAIInfoModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      (click)="showAIInfoModal = false"
    >
      <div
        class="w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl space-y-4"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-center justify-between border-b border-[#F0EDFA] pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">🌿</span>
            <h3 class="text-lg font-extrabold text-[#0F1035]">
              Explication assistée par IA
            </h3>
          </div>
          <button
            type="button"
            (click)="showAIInfoModal = false"
            class="h-9 w-9 rounded-full bg-[#F3EFFE] text-[#6D28D9] flex items-center justify-center font-bold hover:bg-[#E9D5FF] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="space-y-3 text-xs sm:text-sm text-[#31355B] leading-relaxed">
          <p class="font-bold text-[#0F1035]">
            Cette synthèse facilite la lecture de ton rapport. Elle ne remplace pas l'interprétation de ton conseiller.
          </p>
          <div class="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-2 text-xs">
            <div class="flex items-center gap-2 text-[#7C3AED] font-extrabold">
              <mb-icon name="sparkles"></mb-icon>
              <span>IA Souveraine &amp; Responsable (Ollama Qwen 2.5)</span>
            </div>
            <p class="text-[#42466B]">
              • <strong>Zéro fuite :</strong> L'intelligence artificielle s'exécute localement sur ta machine, aucune donnée personnelle n'est envoyée dans le cloud.<br/>
              • <strong>Zéro hallucination :</strong> L'IA a interdiction stricte d'inventer des scores ou des conclusions non présentes dans ton rapport certifié Rdv {{ rdvNumber }}.<br/>
              • <strong>Langage accessible :</strong> Les termes techniques sont traduits en phrases claires et bienveillantes.
            </p>
          </div>
        </div>

        <div class="pt-3 border-t border-[#F0EDFA] flex justify-end">
          <button
            type="button"
            (click)="showAIInfoModal = false"
            class="rounded-xl bg-[#7C3AED] text-white px-5 py-2 text-xs font-bold hover:bg-[#6D28D9] transition cursor-pointer"
          >
            J'ai compris
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
  @Output() saveQuestion = new EventEmitter<{ text: string; answer?: string }>();
  @Output() prepareImmersion = new EventEmitter<UICareer>();

  questionAlreadySaved: boolean = false;

  userFeelings: Record<string, string> = {};
  careerPreferences: Record<string, string> = {};
  careersSearchTerm: string = '';
  showAllReportCareers: boolean = false;
  selectedZoneFilter: number | 'ALL' = 'ALL';

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

  // --------------------------------------------------------------------------
  // IA SOUVERAINE & VULGARISATION PÉDAGOGIQUE (OLLAMA QWEN 2.5)
  // --------------------------------------------------------------------------
  ollamaConnected: boolean = false;
  ollamaModel: string = 'qwen2.5:3b';
  isGeneratingAI: boolean = false;
  aiMode: 'SIMPLE' | 'PARENTS' | 'WORK' = 'SIMPLE';
  activeDetailCard: 'RIASEC' | 'APTITUDES' | 'HEXACO' | null = null;
  aiExplanationText: string = '';
  isSpeakingAI: boolean = false;

  // Questions interactives sur le bilan
  userBilanQuestion: string = '';
  isAnsweringQuestion: boolean = false;
  aiQuestionAnswer: string | null = null;
  selectedPredefinedQuestion: string | null = null;

  async ngOnInit(): Promise<void> {
    if (this.currentEpisode) {
      this.audioDurationSec = this.currentEpisode.targetDurationSec || 120;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const feelingsRaw = localStorage.getItem('monbilan_young_feelings_' + this.rdvNumber);
        if (feelingsRaw) this.userFeelings = JSON.parse(feelingsRaw);
        const prefsRaw = localStorage.getItem('monbilan_career_prefs_' + this.rdvNumber);
        if (prefsRaw) this.careerPreferences = JSON.parse(prefsRaw);
      } catch (e) {
        console.warn('Erreur chargement localStorage', e);
      }
    }
    this.aiExplanationText = this.getFallbackExplanation('SIMPLE');
    await this.checkOllama();
  }

  setFeeling(domainKey: string, feeling: string, domainLabel: string): void {
    this.userFeelings[domainKey] = feeling;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('monbilan_young_feelings_' + this.rdvNumber, JSON.stringify(this.userFeelings));
      } catch (e) {}
    }
    if (feeling === 'WANT_TO_DISCUSS') {
      this.saveQuestion.emit({
        text: `J'aimerais échanger sur le point : ${domainLabel} (mon ressenti : en parler avec le conseiller)`,
        answer: undefined
      });
    }
  }

  onNotUnderstood(topicLabel: string): void {
    this.saveQuestion.emit({
      text: `Je n'ai pas bien compris la section : ${topicLabel}. Peux-tu me la réexpliquer lors de notre rdv ?`,
      answer: undefined
    });
  }

  onNoteQuestion(topicLabel: string): void {
    if (typeof window !== 'undefined') {
      const q = window.prompt(`Quelle question souhaites-tu noter à propos de "${topicLabel}" ?`);
      if (q && q.trim()) {
        this.saveQuestion.emit({
          text: `[${topicLabel}] ${q.trim()}`,
          answer: undefined
        });
      }
    }
  }

  setCareerPreference(careerId: string, pref: string, careerTitle: string): void {
    this.careerPreferences[careerId] = pref;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('monbilan_career_prefs_' + this.rdvNumber, JSON.stringify(this.careerPreferences));
      } catch (e) {}
    }
    if (pref === 'DISCUSS') {
      this.saveQuestion.emit({
        text: `J'aimerais échanger sur le métier : ${careerTitle} (conseillé dans mon bilan)`,
        answer: undefined
      });
    }
  }

  getPreferenceLabel(pref: string): string {
    switch (pref) {
      case 'INTERESTED': return '❤️ Ça m\'intéresse';
      case 'LEARN_MORE': return '🔍 En savoir plus';
      case 'NOT_SURE': return '❓ Pas sûr';
      case 'DISCUSS': return '💬 En parler';
      default: return '';
    }
  }

  onPrepareImmersion(career: UICareer): void {
    this.prepareImmersion.emit(career);
  }

  get displayedReportCareers(): UICareer[] {
    let list = this.careers || [];
    if (this.selectedZoneFilter !== 'ALL') {
      list = list.filter(c => c.jobZone === this.selectedZoneFilter);
    }
    if (this.careersSearchTerm && this.careersSearchTerm.trim()) {
      const q = this.careersSearchTerm.toLowerCase().trim();
      list = list.filter(c =>
        (c.titleFr || '').toLowerCase().includes(q) ||
        (c.sectorTag || '').toLowerCase().includes(q) ||
        (c.shortSummary || '').toLowerCase().includes(q)
      );
    }
    if (!this.showAllReportCareers && !this.careersSearchTerm.trim() && this.selectedZoneFilter === 'ALL') {
      return list.slice(0, 6);
    }
    return list;
  }

  async checkOllama(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('http://localhost:11434/api/tags', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        this.ollamaConnected = true;
        if (data.models && data.models.length > 0) {
          const found = data.models.find((m: any) => m.name && m.name.toLowerCase().includes('qwen'));
          this.ollamaModel = found ? found.name : data.models[0].name;
        }
      }
    } catch {
      this.ollamaConnected = false;
    }
  }

  async selectAIMode(mode: 'SIMPLE' | 'PARENTS' | 'WORK'): Promise<void> {
    this.aiMode = mode;
    this.stopSpeakingAI();
    await this.generateAIExplanation();
  }

  toggleDetailCard(card: 'RIASEC' | 'APTITUDES' | 'HEXACO'): void {
    this.activeDetailCard = this.activeDetailCard === card ? null : card;
  }

  getFallbackExplanation(mode: 'SIMPLE' | 'PARENTS' | 'WORK'): string {
    if (mode === 'SIMPLE') {
      return `Ton bilan d'orientation met en valeur trois forces motrices :
1. Une vive imagination et le besoin d'inventer (ton profil Artistique).
2. L'envie de lancer des projets et de prendre des initiatives (Entreprenant).
3. Le besoin de concret et de voir les résultats réels de ton travail (Réaliste).

Dans les exercices pratiques, tes forces observées sont une excellente mémoire visuelle et une grande adaptabilité. Les 22 métiers conseillés sont des pistes pour t'épanouir, sans note scolaire ni pression !`;
    } else if (mode === 'PARENTS') {
      return `Ce document n'est pas un bulletin scolaire avec des notes, mais une boussole d'orientation réalisée avec une psychologue du Centre des Possibles.

Il révèle une personnalité créative, curieuse et motivée par des réalisations concrètes. Les tests montrent une excellente mémoire visuelle et une forte capacité à s'adapter au changement. Les 22 métiers proposés sont des pistes réelles pour construire sereinement un projet d'avenir qui a du sens.`;
    } else {
      return `En entreprise ou au sein d'une équipe, tes atouts professionnels sont évidents :
- Tu visualises très vite le résultat final d'un projet et tu apportes des idées originales.
- Tu as de l'énergie pour proposer des solutions et tu n'as pas peur de prendre des initiatives.
- Tu travailles avec franchise et tu t'épanouis dans un climat d'équipe bienveillant.

Les métiers conseillés (designer, paysagiste, multimédia...) valorisent tous cette alliance de créativité et de sens pratique.`;
    }
  }

  async generateAIExplanation(): Promise<void> {
    this.isGeneratingAI = true;
    const fallback = this.getFallbackExplanation(this.aiMode);

    if (!this.ollamaConnected) {
      setTimeout(() => {
        this.aiExplanationText = fallback;
        this.isGeneratingAI = false;
      }, 350);
      return;
    }

    const modePrompt = this.aiMode === 'SIMPLE'
      ? 'Explique le bilan en 2 à 3 petits paragraphes simples, chaleureux et encourageants pour une jeune de 16 ans, sans aucun mot compliqué ni jargon.'
      : this.aiMode === 'PARENTS'
      ? 'Explique ce bilan simplement de façon à ce qu un jeune puisse le lire à ses parents pour valoriser son potentiel et son avenir.'
      : 'Explique concrètement comment ces aptitudes et ces traits s expriment dans la vraie vie en milieu professionnel.';

    const prompt = `Tu es le conseiller d'orientation bienveillant de MonBilan+.
RÈGLES ABSOLUES :
- ZÉRO INVENTION, ZÉRO HALLUCINATION.
- Base-toi UNIQUEMENT sur les données certifiées du rapport Rdv ${this.rdvNumber} :
  * Intérêts RIASEC : Dominante Artistique (A, création, originalité), Entreprenant (E, projets, initiatives), Réaliste (R, concret).
  * Aptitudes observées (p. 5) : Flexibilité d'esprit (s'adapte vite), Mémoire visuelle (sens du détail), Partage du temps (polyvalence), Logique déductive.
  * Personnalité HEXACO (p. 6) : Curiosité, esprit d'équipe, sincérité.
  * Métiers : ${this.careers.length} métiers conseillés.
- INTERDICTION de mots compliqués (pas de "psychométrie", "scores stanines", "facteurs latents").
- Phrases courtes, directes, valorisantes.
${modePrompt}`;

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt,
          stream: false,
          options: { temperature: 0.2 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        this.aiExplanationText = data.response?.trim() || fallback;
      } else {
        this.aiExplanationText = fallback;
      }
    } catch {
      this.aiExplanationText = fallback;
    } finally {
      this.isGeneratingAI = false;
    }
  }

  toggleSpeechAI(): void {
    if (this.isSpeakingAI) {
      this.stopSpeakingAI();
    } else {
      this.startSpeakingAI();
    }
  }

  startSpeakingAI(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.stopAudio();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(this.aiExplanationText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.onend = () => { this.isSpeakingAI = false; };
    utterance.onerror = () => { this.isSpeakingAI = false; };
    this.isSpeakingAI = true;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeakingAI(): void {
    this.isSpeakingAI = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  async askBilanQuestion(questionText: string): Promise<void> {
    if (!questionText || !questionText.trim()) return;
    this.selectedPredefinedQuestion = questionText;
    this.isAnsweringQuestion = true;
    this.aiQuestionAnswer = null;
    this.questionAlreadySaved = false;

    const lower = questionText.toLowerCase();
    let fallback = `Dans ton rapport Rdv ${this.rdvNumber}, chaque observation t'aide à te situer pour explorer les ${this.careers.length} métiers conseillés, sans jamais te juger !`;
    if (lower.includes('artistique')) {
      fallback = `La dominante Artistique (p. 4) signifie que tu as besoin de créer, d'imaginer et d'apporter ta touche personnelle. C'est une force recherchée dans les métiers de la création, du visuel et du design !`;
    } else if (lower.includes('note') || lower.includes('chiffr')) {
      fallback = `C'est une règle d'or du Centre des Possibles (p. 5) : un bilan d'orientation n'est pas un examen scolaire. Il observe tes forces et tes motivations, sans note éliminatoire.`;
    } else if (lower.includes('évoluer') || lower.includes('changer')) {
      fallback = `Oui, totalement ! La page 5 précise que ce bilan est une photographie à un instant T. Au fil de tes découvertes et de tes stages, tes aptitudes continueront à grandir avec toi.`;
    }

    if (!this.ollamaConnected) {
      setTimeout(() => {
        this.aiQuestionAnswer = fallback;
        this.isAnsweringQuestion = false;
      }, 300);
      return;
    }

    const prompt = `Tu es le conseiller d'orientation bienveillant de MonBilan+.
Question posée par Emma (16 ans) sur son bilan Rdv ${this.rdvNumber} : "${questionText}".
RÈGLES STRICTES :
- Réponds en 2 phrases simples, claires et positives.
- Aucun mot compliqué, pas de jargon.
- Zéro invention : base-toi uniquement sur le rapport certifié du Centre des Possibles (Dominante Artistique/Entreprenante, 22 métiers, aptitudes sans notes scolaires).`;

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt,
          stream: false,
          options: { temperature: 0.1 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        this.aiQuestionAnswer = data.response?.trim() || fallback;
      } else {
        this.aiQuestionAnswer = fallback;
      }
    } catch {
      this.aiQuestionAnswer = fallback;
    } finally {
      this.isAnsweringQuestion = false;
    }
  }

  saveCurrentQuestionToQuestions(): void {
    const qText = this.selectedPredefinedQuestion || this.userBilanQuestion;
    if (!qText || !qText.trim()) return;
    this.saveQuestion.emit({ text: qText.trim(), answer: this.aiQuestionAnswer || undefined });
    this.questionAlreadySaved = true;
  }

  askPredefinedQuestion(id: number): void {
    if (id === 1) {
      this.askBilanQuestion('C\'est quoi la dominante Artistique ?');
    } else if (id === 2) {
      this.askBilanQuestion('Pourquoi il n\'y a pas de notes chiffrées ?');
    } else {
      this.askBilanQuestion('Est-ce que mes résultats peuvent changer ?');
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

  // --------------------------------------------------------------------------
  // GETTERS PÉDAGOGIQUES ET LABELS (Éviter toute expression complexe dans le template)
  // --------------------------------------------------------------------------
  showAIInfoModal: boolean = false;

  toggleAIInfoModal(): void {
    this.showAIInfoModal = !this.showAIInfoModal;
  }

  get currentEpisodeTitle(): string {
    return this.currentEpisode?.title || 'Comprendre mon bilan';
  }

  get formattedCurrentTime(): string {
    return this.formatTime(this.audioProgressSec);
  }

  get formattedDuration(): string {
    return this.formatTime(this.audioDurationSec);
  }

  get synthesisIntro(): string {
    if (this.aiMode === 'PARENTS') {
      return "Ce document valorise les points d'appui réels observés lors du bilan :";
    } else if (this.aiMode === 'WORK') {
      return "En milieu professionnel et en équipe, tes repères au travail :";
    }
    return "Ton bilan d'orientation met en valeur trois forces motrices :";
  }

  get synthesisPoint1(): string {
    if (this.aiMode === 'PARENTS') {
      return "Une vive sensibilité créative et artistique (Profil Artistique).";
    } else if (this.aiMode === 'WORK') {
      return "Imaginer des solutions visuelles et créatives originales (ton profil Artistique).";
    }
    return "Une vive imagination et le besoin d'inventer (ton profil Artistique).";
  }

  get synthesisPoint2(): string {
    if (this.aiMode === 'PARENTS') {
      return "L'envie de porter des projets et de prendre des initiatives (Entreprenant).";
    } else if (this.aiMode === 'WORK') {
      return "Proposer des idées avec énergie et stimuler la dynamique d'équipe (Entreprenant).";
    }
    return "L'envie de lancer des projets et de prendre des initiatives (Entreprenant).";
  }

  get synthesisPoint3(): string {
    if (this.aiMode === 'PARENTS') {
      return "Le goût des réalisations concrètes et des actions de terrain (Réaliste).";
    } else if (this.aiMode === 'WORK') {
      return "Mener des tâches tangibles avec précision et bon sens pratique (Réaliste).";
    }
    return "Le besoin de concret et de voir les résultats réels de ton travail (Réaliste).";
  }

  get synthesisEnBref(): string {
    if (this.aiMode === 'PARENTS') {
      return "ce bilan n'est pas un classement scolaire avec des notes. C'est une boussole d'orientation bienveillante qui met en valeur ses forces réelles et 22 pistes de métiers concrets pour préparer sereinement son avenir.";
    } else if (this.aiMode === 'WORK') {
      return "tes exercices pratiques révèlent une excellente mémoire visuelle et une grande adaptabilité face aux imprévus. Les 22 métiers conseillés valorisent ces atouts concrets sur le terrain.";
    }
    return "tu as un profil créatif, dynamique et orienté vers l'action. Tes exercices pratiques montrent une bonne mémoire visuelle et une grande adaptabilité. Les 22 métiers proposés sont des pistes pour t'épanouir, sans note scolaire ni pression.";
  }
}
