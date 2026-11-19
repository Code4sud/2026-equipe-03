// ============================================================================
// MonBilan+ — Composant « Mon Coach IA »
// Intégration complète unifiée des trois maquettes officielles :
// 1. Maquette Entraînement Texte (Dialogue multi-tours, Conseils, Retour)
// 2. Maquette Entraînement Vocal (Ondes audio, Micro, STT / TTS, Répéter, Pause)
// 3. Maquette Atelier Rédaction (5 onglets, Projet actuel, Proposition IA / Ollama, Conseils)
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import {
  COACH_TRAINING_SCENARIOS,
  TrainingScenario,
  TrainingScenarioId
} from '../../shared/coach-training-data';

export type CoachActiveTab = 'EMAIL' | 'CALL_SCRIPT' | 'FOLLOWUP' | 'TRAINING' | 'CHAT';
export type TrainingMode = 'TEXT' | 'VOCAL';
export type VoiceEngineState = 'IDLE' | 'LISTENING' | 'SPEAKING' | 'PAUSED';

@Component({
  selector: 'app-coach-ia',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  styles: [`
    @keyframes pulseWaves {
      0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
      50% { transform: scaleY(1.0); opacity: 1; }
    }
    .wave-bar {
      animation: pulseWaves 1.2s ease-in-out infinite;
    }
  `],
  template: `
    <div class="space-y-6 pb-12">
      <!-- ================================================================== -->
      <!-- 1. BANNIÈRE HERO « MON COACH IA » (Fidèle aux maquettes 1, 2, 3)    -->
      <!-- ================================================================== -->
      <div class="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9333EA] text-white p-6 sm:p-8 shadow-xl shadow-purple-950/10">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-start sm:items-center gap-4 max-w-2xl">
            <!-- Avatar Robot Mascotte dans carré translucide -->
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20 shadow-md">
              <span class="text-3xl sm:text-4xl">🤖</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  Mon Coach IA
                </h1>
                <span class="text-xs font-extrabold px-3 py-1 rounded-full bg-white/20 text-purple-100 border border-white/20 backdrop-blur-md">
                  Assistant d'orientation
                </span>
              </div>
              <p class="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                Un accompagnement personnalisé pour t'aider à contacter une entreprise, préparer ton immersion et progresser dans ton projet.
              </p>
            </div>
          </div>

          <!-- Robot interactif animé à droite (Mascotte officielle MonBilan+) -->
          <div class="hidden lg:flex items-center gap-3 shrink-0 pr-2">
            <div class="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg p-2">
              <span class="text-5xl animate-bounce">👋🤖</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. BARRE DE NAVIGATION SUPÉRIEURE DES ONGLETS (Maquette 3)         -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <!-- 1. Rédiger un email -->
        <button
          type="button"
          (click)="selectTab('EMAIL')"
          [class]="activeTab === 'EMAIL'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-2xs'"
          class="p-3.5 sm:p-4 rounded-2xl text-left transition flex items-start gap-3 cursor-pointer"
        >
          <div
            [class]="activeTab === 'EMAIL' ? 'bg-[#7C3AED] text-white' : 'bg-purple-100 text-[#7C3AED]'"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition"
          >
            ✉️
          </div>
          <div class="min-w-0">
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] truncate">Rédiger un email</h4>
            <p class="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
              Un message professionnel, clair et personnalisé.
            </p>
          </div>
        </button>

        <!-- 2. Préparer un appel -->
        <button
          type="button"
          (click)="selectTab('CALL_SCRIPT')"
          [class]="activeTab === 'CALL_SCRIPT'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-2xs'"
          class="p-3.5 sm:p-4 rounded-2xl text-left transition flex items-start gap-3 cursor-pointer"
        >
          <div
            [class]="activeTab === 'CALL_SCRIPT' ? 'bg-[#7C3AED] text-white' : 'bg-blue-100 text-blue-600'"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition"
          >
            📞
          </div>
          <div class="min-w-0">
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] truncate">Préparer un appel</h4>
            <p class="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
              Un script et des conseils pour contacter une entreprise.
            </p>
          </div>
        </button>

        <!-- 3. Préparer une relance -->
        <button
          type="button"
          (click)="selectTab('FOLLOWUP')"
          [class]="activeTab === 'FOLLOWUP'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-2xs'"
          class="p-3.5 sm:p-4 rounded-2xl text-left transition flex items-start gap-3 cursor-pointer"
        >
          <div
            [class]="activeTab === 'FOLLOWUP' ? 'bg-[#7C3AED] text-white' : 'bg-amber-100 text-amber-700'"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition"
          >
            🔄
          </div>
          <div class="min-w-0">
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] truncate">Préparer une relance</h4>
            <p class="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
              Un message de suivi poli et efficace.
            </p>
          </div>
        </button>

        <!-- 4. S'entraîner à l'oral / écrit (Maquettes 1 et 2) -->
        <button
          type="button"
          (click)="selectTab('TRAINING')"
          [class]="activeTab === 'TRAINING'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-2xs'"
          class="p-3.5 sm:p-4 rounded-2xl text-left transition flex items-start gap-3 cursor-pointer"
        >
          <div
            [class]="activeTab === 'TRAINING' ? 'bg-[#7C3AED] text-white' : 'bg-emerald-100 text-emerald-700'"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition"
          >
            🎙️
          </div>
          <div class="min-w-0">
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] truncate">S'entraîner</h4>
            <p class="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
              Un échange simulé pour gagner en confiance (Oral/Écrit).
            </p>
          </div>
        </button>

        <!-- 5. Discuter avec le Coach -->
        <button
          type="button"
          (click)="selectTab('CHAT')"
          [class]="activeTab === 'CHAT'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-2xs'"
          class="p-3.5 sm:p-4 rounded-2xl text-left transition flex items-start gap-3 cursor-pointer col-span-2 sm:col-span-1"
        >
          <div
            [class]="activeTab === 'CHAT' ? 'bg-[#7C3AED] text-white' : 'bg-pink-100 text-pink-600'"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition"
          >
            💬
          </div>
          <div class="min-w-0">
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] truncate">Discuter</h4>
            <p class="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
              Pose tes questions sur ton projet ou l'immersion.
            </p>
          </div>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- 3. VUE PRINCIPALE : ENTRAÎNEMENT (Maquette 1 & Maquette 2)          -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'TRAINING'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- 3.1 COLONNE GAUCHE (7/12) : ZONE D'ENTRAÎNEMENT INTERACTIF -->
          <div class="lg:col-span-7 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-6">
            <!-- En-tête : Mon entraînement avec le Coach -->
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xl text-[#7C3AED]">🎯</span>
                <h3 class="text-lg sm:text-xl font-extrabold text-[#0F1035]">
                  Mon entraînement avec le Coach
                </h3>
              </div>
              <p class="text-xs sm:text-sm text-gray-500">
                Entraîne-toi à ton rythme, par écrit ou à voix haute.
              </p>
            </div>

            <!-- Comment souhaites-tu t'entraîner ? (Sélecteur Vocal / Texte) -->
            <div class="space-y-2">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                Comment souhaites-tu t'entraîner ?
              </label>
              <div class="grid grid-cols-2 gap-3 max-w-md">
                <!-- Bouton Vocal -->
                <button
                  type="button"
                  (click)="setTrainingMode('VOCAL')"
                  [class]="trainingMode === 'VOCAL'
                    ? 'bg-[#7C3AED] text-white shadow-md font-extrabold'
                    : 'bg-white border border-[#E4E0F5] text-[#42466B] hover:bg-[#F8F7FF] font-semibold'"
                  class="py-2.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>🎙️</span>
                  <span>Vocal</span>
                </button>

                <!-- Bouton Texte -->
                <button
                  type="button"
                  (click)="setTrainingMode('TEXT')"
                  [class]="trainingMode === 'TEXT'
                    ? 'bg-[#7C3AED] text-white shadow-md font-extrabold'
                    : 'bg-white border border-[#E4E0F5] text-[#42466B] hover:bg-[#F8F7FF] font-semibold'"
                  class="py-2.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>💬</span>
                  <span>Texte</span>
                </button>
              </div>
            </div>

            <!-- Choisis une situation : (4 Radios avec mise en surbrillance) -->
            <div class="space-y-2.5">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                Choisis une situation :
              </label>
              <div class="space-y-2">
                <label
                  *ngFor="let sc of scenariosList"
                  class="flex items-center gap-3 p-3 rounded-2xl border transition cursor-pointer"
                  [ngClass]="activeScenario.id === sc.id
                    ? 'border-[#7C3AED] bg-[#F5F3FF] shadow-2xs'
                    : 'border-[#E4E0F5] bg-white hover:bg-[#FAFAFC]'"
                >
                  <input
                    type="radio"
                    name="scenarioSelect"
                    [checked]="activeScenario.id === sc.id"
                    (change)="selectScenario(sc)"
                    class="text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-sm shrink-0">{{ getScenarioEmoji(sc.id) }}</span>
                    <span class="text-xs sm:text-sm font-bold text-[#0F1035] truncate">{{ sc.title }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- ============================================================ -->
            <!-- CAS A : INTERACTION EN MODE TEXTE (Maquette 1)              -->
            <!-- ============================================================ -->
            <div *ngIf="trainingMode === 'TEXT'" class="space-y-4 pt-2 border-t border-[#F0EDFA]">
              <!-- Boîte Coach IA • Simulation -->
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 sm:p-5 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-base shrink-0">
                      🤖
                    </div>
                    <div>
                      <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">
                        Coach IA • Simulation
                      </h4>
                    </div>
                  </div>
                  <span class="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">
                    {{ activeScenario.badgeLabel }}
                  </span>
                </div>

                <!-- Bulle de la question du coach -->
                <div class="p-3.5 rounded-2xl bg-white border border-[#DDD6FE] text-xs sm:text-sm text-[#0F1035] font-semibold leading-relaxed shadow-2xs">
                  {{ getCurrentCoachQuestion() }}
                </div>
              </div>

              <!-- Champ de saisie pour la réponse du jeune -->
              <div class="space-y-1.5">
                <textarea
                  rows="3"
                  [(ngModel)]="userTextResponse"
                  maxlength="500"
                  placeholder="Écris ici ce que tu répondrais à ton interlocuteur..."
                  class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 text-xs sm:text-sm font-medium text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                ></textarea>
                <div class="flex justify-end text-[11px] text-gray-400 font-semibold">
                  {{ userTextResponse.length }} / 500
                </div>
              </div>

              <!-- Barre d'actions en mode texte (Maquette 1) -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  (click)="sendUserResponse()"
                  [disabled]="!userTextResponse.trim()"
                  class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>✈️</span>
                  <span>Envoyer ma réponse</span>
                </button>

                <button
                  type="button"
                  (click)="setTrainingMode('VOCAL')"
                  class="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🎙️</span>
                  <span>Basculer en mode vocal</span>
                </button>
              </div>

              <div class="text-center text-[11px] text-gray-400 font-medium">
                ⓘ Tu peux changer de mode à tout moment.
              </div>
            </div>

            <!-- ============================================================ -->
            <!-- CAS B : INTERACTION EN MODE VOCAL (Maquette 2)              -->
            <!-- ============================================================ -->
            <div *ngIf="trainingMode === 'VOCAL'" class="space-y-4 pt-2 border-t border-[#F0EDFA]">
              <!-- Boîte Coach IA • Simulation avec badge Étape 1 / 4 -->
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 sm:p-5 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-base shrink-0">
                      🤖
                    </div>
                    <div>
                      <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">
                        Coach IA • Simulation
                      </h4>
                      <p class="text-[10px] text-gray-500 font-medium">{{ activeScenario.badgeLabel }}</p>
                    </div>
                  </div>

                  <!-- Indicateur d'étape (Maquette 2) -->
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-extrabold text-[#7C3AED]">
                      Étape {{ currentStepIndex + 1 }} / {{ activeScenario.steps.length }}
                    </span>
                    <div class="flex items-center gap-1">
                      <span
                        *ngFor="let st of activeScenario.steps; let idx = index"
                        class="w-2 h-2 rounded-full"
                        [ngClass]="idx <= currentStepIndex ? 'bg-[#7C3AED]' : 'bg-gray-300'"
                      ></span>
                    </div>
                  </div>
                </div>

                <!-- Bulle de question Coach -->
                <div class="p-3.5 rounded-2xl bg-white border border-[#DDD6FE] text-xs sm:text-sm text-[#0F1035] font-semibold leading-relaxed shadow-2xs">
                  {{ getCurrentCoachQuestion() }}
                </div>
              </div>

              <!-- Zone centrale avec ondes vocales animées et micro (Maquette 2) -->
              <div class="rounded-3xl bg-[#FAF8FF] border border-[#E4E0F5] p-6 sm:p-8 flex flex-col items-center justify-center space-y-4 text-center">
                <!-- Ondes audio visuelles -->
                <div class="flex items-center gap-1.5 h-12">
                  <span class="w-1.5 h-6 bg-[#C4B5FD] rounded-full wave-bar" style="animation-delay: 0.1s"></span>
                  <span class="w-1.5 h-10 bg-[#A78BFA] rounded-full wave-bar" style="animation-delay: 0.2s"></span>
                  <span class="w-1.5 h-4 bg-[#C4B5FD] rounded-full wave-bar" style="animation-delay: 0.3s"></span>

                  <!-- Cercle central Micro -->
                  <div
                    (click)="toggleVoiceListening()"
                    [class]="voiceState === 'LISTENING' ? 'bg-red-500 ring-4 ring-red-200 scale-110' : 'bg-[#7C3AED] hover:scale-105'"
                    class="w-14 h-14 rounded-full text-white flex items-center justify-center text-2xl shadow-lg mx-2 transition cursor-pointer"
                  >
                    <span>🎙️</span>
                  </div>

                  <span class="w-1.5 h-4 bg-[#C4B5FD] rounded-full wave-bar" style="animation-delay: 0.4s"></span>
                  <span class="w-1.5 h-10 bg-[#A78BFA] rounded-full wave-bar" style="animation-delay: 0.5s"></span>
                  <span class="w-1.5 h-6 bg-[#C4B5FD] rounded-full wave-bar" style="animation-delay: 0.6s"></span>
                </div>

                <div class="space-y-1">
                  <p class="text-xs sm:text-sm font-extrabold text-[#0F1035]">
                    {{ getVoiceStateMessage() }}
                  </p>
                  <p *ngIf="transcribedLiveSpeech" class="text-xs text-[#7C3AED] font-semibold italic">
                    « {{ transcribedLiveSpeech }} »
                  </p>
                </div>

                <!-- Bouton violet Commencer l'entraînement vocal -->
                <button
                  type="button"
                  (click)="toggleVoiceListening()"
                  class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{{ voiceState === 'LISTENING' ? '⏹️ Terminer ma réponse' : '▶ Commencer l\'entraînement vocal' }}</span>
                </button>

                <!-- Ligne de contrôles : Pause et Répéter la question (Maquette 2) -->
                <div class="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    (click)="togglePauseVoice()"
                    class="px-4 py-2 rounded-xl bg-white border border-[#E4E0F5] hover:bg-gray-50 text-xs font-bold text-[#0F1035] transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>{{ voiceState === 'PAUSED' ? '▶ Reprendre' : '⏸ Pause' }}</span>
                  </button>

                  <button
                    type="button"
                    (click)="replayCurrentQuestion()"
                    class="px-4 py-2 rounded-xl bg-white border border-[#E4E0F5] hover:bg-gray-50 text-xs font-bold text-[#0F1035] transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>🔄 Répéter la question</span>
                  </button>
                </div>

                <!-- Lien Passer en mode texte -->
                <button
                  type="button"
                  (click)="setTrainingMode('TEXT')"
                  class="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>💬 Passer en mode texte</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 3.2 COLONNE DROITE (5/12) : CONSEILS ET MON RETOUR D'ENTRAÎNEMENT -->
          <div class="lg:col-span-5 space-y-5">
            <!-- 1. Conseils pour répondre (si mode texte) ou Conseils pour réussir (si mode vocal) -->
            <div *ngIf="trainingMode === 'TEXT'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-amber-500">💡</span>
                <span>Conseils pour répondre</span>
              </div>
              <ul class="space-y-2 text-xs font-medium text-[#42466B]">
                <li *ngFor="let tip of activeScenario.tipsForAnswering" class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>

            <!-- 2. Mon retour d'entraînement (Maquette 1 & 2) -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035] pb-2 border-b border-[#F0EDFA]">
                <span class="text-base text-[#7C3AED]">🎯</span>
                <span>Mon retour d'entraînement</span>
              </div>

              <!-- Ce que tu as bien fait (Vert) -->
              <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div class="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                  <span>✓</span>
                  <span>Ce que tu as bien fait</span>
                </div>
                <p class="text-xs text-emerald-900 leading-relaxed font-medium">
                  {{ activeScenario.defaultFeedback.wellDone }}
                </p>
              </div>

              <!-- Ce que tu peux améliorer (Ambre) -->
              <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div class="flex items-center gap-1.5 text-xs font-extrabold text-amber-800">
                  <span>💡</span>
                  <span>Ce que tu peux améliorer</span>
                </div>
                <p class="text-xs text-amber-900 leading-relaxed font-medium">
                  {{ activeScenario.defaultFeedback.toImprove }}
                </p>
              </div>

              <!-- Ton prochain défi (Violet / Jaune) -->
              <div class="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div class="flex items-center gap-1.5 text-xs font-extrabold text-[#7C3AED]">
                  <span>🎯</span>
                  <span>Ton prochain défi</span>
                </div>
                <p class="text-xs text-[#5B21B6] leading-relaxed font-medium">
                  {{ activeScenario.defaultFeedback.nextChallenge }}
                </p>
              </div>
            </div>

            <!-- 3. Conseils pour réussir + Cible (si mode vocal — Maquette 2) -->
            <div *ngIf="trainingMode === 'VOCAL'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-blue-500">ℹ️</span>
                <span>Conseils pour réussir</span>
              </div>
              <ul class="space-y-2 text-xs font-medium text-[#42466B]">
                <li *ngFor="let tip of activeScenario.tipsForSuccess" class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Bandeau de réassurance confidentialité en bas (Maquette 2) -->
        <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 text-center text-xs text-gray-500 font-semibold flex items-center justify-center gap-2">
          <span>🔒</span>
          <span>Ton audio n'est pas enregistré par défaut. L'entraînement est confidentiel et bienveillant.</span>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 4. VUE ATELIER : RÉDIGER UN EMAIL / APPEL / RELANCE (Maquette 3)   -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'EMAIL' || activeTab === 'CALL_SCRIPT' || activeTab === 'FOLLOWUP' || activeTab === 'CHAT'" class="space-y-6">
        <!-- Bandeau d'état IA (Ollama vs Mode Autonome) -->
        <div class="rounded-2xl p-3 px-4 flex items-center justify-between text-xs font-bold border"
          [ngClass]="ollamaConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-[#F8F7FF] border-[#E4E0F5] text-[#6D28D9]'">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" [ngClass]="ollamaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-[#7C3AED]'"></span>
            <span>{{ ollamaConnected ? 'Moteur IA actif : Ollama (' + ollamaModel + ')' : 'Assistant MonBilan+ (Mode autonome Zéro-Hallucination)' }}</span>
          </div>
          <button type="button" (click)="checkOllama()" class="hover:underline cursor-pointer">
            {{ ollamaConnected ? '✓ Vérifié' : '🔄 Vérifier Ollama' }}
          </button>
        </div>

        <!-- Grille 3 Colonnes de la Maquette 3 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- 4.1 Colonne 1 : Mon projet actuel + Formulaire (4/12) -->
          <div class="lg:col-span-4 space-y-5">
            <!-- Bloc Mon projet actuel (Depuis Immersion Pro — Maquette 3) -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span class="text-[#7C3AED]">🎯</span>
                  <span>Mon projet actuel</span>
                </span>
                <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Depuis Immersion Pro
                </span>
              </div>

              <div class="space-y-2 text-xs text-[#0F1035]">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">🔨 Métier :</span>
                  <span class="font-bold">{{ selectedCareer }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">🏢 Entreprise :</span>
                  <span class="font-bold">{{ companyName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">🚩 Étape :</span>
                  <span class="font-bold">Préparation de la prise de contact</span>
                </div>
              </div>
            </div>

            <!-- Bloc Créer mon email de demande -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider">
                Créer mon email de demande
              </h3>

              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-gray-700 mb-1">Objet du message *</label>
                  <input
                    type="text"
                    [(ngModel)]="emailSubject"
                    class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] px-3 py-2 text-xs font-semibold text-[#0F1035]"
                  />
                </div>

                <div>
                  <label class="block font-bold text-gray-700 mb-1">Période souhaitée</label>
                  <input
                    type="text"
                    [(ngModel)]="periodName"
                    class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] px-3 py-2 text-xs font-semibold text-[#0F1035]"
                  />
                </div>

                <div class="space-y-1.5 pt-1">
                  <label class="block font-bold text-gray-700">Style du message</label>
                  <label class="flex items-center gap-2 p-2 rounded-xl border border-[#E4E0F5] cursor-pointer">
                    <input type="radio" name="mStyle" [(ngModel)]="messageStyle" value="SIMPLE" class="text-[#7C3AED]" />
                    <span class="font-bold text-[#0F1035] flex-1">Simple et naturel</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Recommandé</span>
                  </label>
                  <label class="flex items-center gap-2 p-2 rounded-xl border border-[#E4E0F5] cursor-pointer">
                    <input type="radio" name="mStyle" [(ngModel)]="messageStyle" value="FORMEL" class="text-[#7C3AED]" />
                    <span class="font-bold text-[#0F1035]">Plus formel (entreprise, service RH...)</span>
                  </label>
                </div>

                <button
                  type="button"
                  (click)="generateMessage()"
                  class="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>✨</span>
                  <span>Générer mon message</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 4.2 Colonne 2 : Proposition de message (5/12 — Maquette 3) -->
          <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
              <span class="text-xs font-extrabold text-[#0F1035] flex items-center gap-2">
                <span class="text-[#7C3AED]">✨</span>
                <span>Proposition de message</span>
              </span>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200">
                Généré par MonBilan+
              </span>
            </div>

            <!-- Carte du message généré -->
            <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 text-xs space-y-3 leading-relaxed">
              <div class="font-extrabold text-[#0F1035]">
                Objet : {{ emailSubject }}
              </div>
              <div class="whitespace-pre-line text-[#1E1B4B]">
                {{ generatedBodyText }}
              </div>
            </div>

            <!-- Actions sur le message (Maquette 3) -->
            <div class="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                (click)="copyMessage()"
                class="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-[#0F1035] hover:bg-gray-50 transition cursor-pointer flex items-center gap-1"
              >
                <span>📋</span>
                <span>{{ copiedToast ? 'Copié !' : 'Copier le texte' }}</span>
              </button>
              <button
                type="button"
                (click)="downloadMessagePdf()"
                class="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-[#0F1035] hover:bg-gray-50 transition cursor-pointer flex items-center gap-1"
              >
                <span>📥</span>
                <span>Télécharger (PDF)</span>
              </button>
            </div>

            <div class="space-y-2 pt-2 border-t border-[#F0EDFA]">
              <button
                type="button"
                (click)="saveToImmersionProject()"
                class="w-full py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>Enregistrer dans mon projet</span>
              </button>
              <button
                type="button"
                (click)="saveToImmersionProject()"
                class="w-full py-2 rounded-2xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-[#6D28D9] font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🔗</span>
                <span>Lier à mon immersion</span>
              </button>
            </div>
          </div>

          <!-- 4.3 Colonne 3 : Conseils & Et après ? (3/12 — Maquette 3) -->
          <div class="lg:col-span-3 space-y-4">
            <!-- Conseils du Coach -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-amber-500">💡</span>
                <span>Conseils du Coach</span>
              </div>
              <ul class="space-y-2 text-xs font-medium text-emerald-800">
                <li class="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>Sois clair(e) sur ton objectif.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>Reste poli(e) et courtois(e).</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>Indique une période réaliste.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span>✓</span>
                  <span>Montre ta motivation pour le métier.</span>
                </li>
              </ul>
            </div>

            <!-- Et après ? -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-[#7C3AED]">⏱️</span>
                <span>Et après ?</span>
              </div>
              <div class="space-y-2 text-xs text-[#42466B]">
                <div class="flex items-start gap-2">
                  <span class="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] font-black text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Relis et personnalise le message.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] font-black text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Envoie-le depuis ta messagerie (ou copie le texte).</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] font-black text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Enregistre l'envoi dans ton Immersion Pro pour suivre la réponse.</span>
                </div>
              </div>
            </div>

            <!-- Besoin d'aide ? -->
            <div class="rounded-[28px] bg-[#F5F3FF] border border-[#DDD6FE] p-5 space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#6D28D9]">
                <span class="text-base">💬</span>
                <span>Besoin d'aide ?</span>
              </div>
              <p class="text-[11px] text-[#4C1D95]">Tu peux me poser une question, par exemple :</p>
              <ul class="text-[11px] text-[#4C1D95] space-y-1">
                <li>• Comment me présenter au téléphone ?</li>
                <li>• Que faire si l'entreprise ne répond pas ?</li>
                <li>• Quelles questions poser pendant l'immersion ?</li>
              </ul>
              <button
                type="button"
                (click)="selectTab('TRAINING')"
                class="w-full py-2 rounded-xl bg-white border border-[#DDD6FE] hover:bg-purple-100 text-[#6D28D9] font-extrabold text-xs transition cursor-pointer"
              >
                Discuter maintenant →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CoachIaComponent implements OnInit, OnDestroy {
  @Input() youngDisplayName: string = 'Emma D.';
  @Output() saveImmersion = new EventEmitter<string>();

  activeTab: CoachActiveTab = 'TRAINING'; // Par défaut sur l'entraînement
  trainingMode: TrainingMode = 'TEXT';    // Par défaut sur le mode texte (Maquette 1)
  voiceState: VoiceEngineState = 'IDLE';

  scenariosList: TrainingScenario[] = COACH_TRAINING_SCENARIOS;
  activeScenario: TrainingScenario = COACH_TRAINING_SCENARIOS[0];
  currentStepIndex: number = 0;

  // Mode texte
  userTextResponse: string = '';

  // Mode vocal (STT / Web Speech)
  transcribedLiveSpeech: string = '';
  private recognition: any = null;

  // Rédaction (Maquette 3)
  selectedCareer: string = 'Peintre décorateur';
  companyName: string = 'Atelier Décors & Patines Riviera';
  periodName: string = 'Vacances de février';
  emailSubject: string = 'Demande de stage d\'observation — Peintre décorateur';
  messageStyle: 'SIMPLE' | 'FORMEL' = 'SIMPLE';
  generatedBodyText: string = '';
  copiedToast: boolean = false;

  ollamaConnected: boolean = false;
  ollamaModel: string = 'qwen2.5:3b';

  async ngOnInit(): Promise<void> {
    this.initImmersionDataLink();
    this.generateMessage();
    await this.checkOllama();
  }

  ngOnDestroy(): void {
    this.stopSpeech();
    this.stopVoiceRecognition();
  }

  // Connexion automatique avec le projet Immersion Pro existant
  private initImmersionDataLink(): void {
    try {
      const stored = localStorage.getItem('monbilan_immersion_project_2187');
      if (stored) {
        const proj = JSON.parse(stored);
        if (proj.careerTitle) this.selectedCareer = proj.careerTitle;
        if (proj.selectedCompany?.name) this.companyName = proj.selectedCompany.name;
      }
    } catch {
      // Ignorer
    }
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

  selectTab(tab: CoachActiveTab): void {
    this.activeTab = tab;
    this.stopSpeech();
    this.stopVoiceRecognition();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  setTrainingMode(mode: TrainingMode): void {
    this.trainingMode = mode;
    this.stopSpeech();
    this.stopVoiceRecognition();
    if (mode === 'VOCAL') {
      this.speakCoachQuestion(this.getCurrentCoachQuestion());
    }
  }

  selectScenario(sc: TrainingScenario): void {
    this.activeScenario = sc;
    this.currentStepIndex = 0;
    this.userTextResponse = '';
    this.transcribedLiveSpeech = '';
    this.stopSpeech();
    this.stopVoiceRecognition();
    if (this.trainingMode === 'VOCAL') {
      this.speakCoachQuestion(this.getCurrentCoachQuestion());
    }
  }

  getScenarioEmoji(id: TrainingScenarioId): string {
    switch (id) {
      case 'SCENARIO_CALL': return '📞';
      case 'SCENARIO_INTERVIEW': return '👤';
      case 'SCENARIO_QUESTIONS': return '❓';
      case 'SCENARIO_PRESENTATION': return '📊';
      default: return '💬';
    }
  }

  getCurrentCoachQuestion(): string {
    const step = this.activeScenario.steps[this.currentStepIndex];
    return step ? step.coachQuestion : this.activeScenario.steps[0].coachQuestion;
  }

  sendUserResponse(): void {
    if (!this.userTextResponse.trim()) return;
    this.userTextResponse = '';
    if (this.currentStepIndex < this.activeScenario.steps.length - 1) {
      this.currentStepIndex++;
    } else {
      alert('Bravo ! Tu as terminé les 4 étapes de cette simulation. Consulte ton retour d’entraînement à droite pour voir tes progrès !');
    }
  }

  // --------------------------------------------------------------------------
  // Mode Vocal : STT (Speech to Text) & TTS (Text to Speech)
  // --------------------------------------------------------------------------
  toggleVoiceListening(): void {
    if (this.voiceState === 'LISTENING') {
      this.stopVoiceRecognition();
      if (this.transcribedLiveSpeech) {
        if (this.currentStepIndex < this.activeScenario.steps.length - 1) {
          this.currentStepIndex++;
        }
        setTimeout(() => {
          this.speakCoachQuestion(this.getCurrentCoachQuestion());
        }, 600);
      }
    } else {
      this.startVoiceRecognition();
    }
  }

  private startVoiceRecognition(): void {
    this.stopSpeech();
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('La reconnaissance vocale n’est pas supportée nativement par ce navigateur. Tu peux utiliser le mode Texte à tout moment !');
      this.trainingMode = 'TEXT';
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fr-FR';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.voiceState = 'LISTENING';
        this.transcribedLiveSpeech = '';
      };

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        this.transcribedLiveSpeech = transcript;
      };

      this.recognition.onerror = () => {
        this.voiceState = 'IDLE';
      };

      this.recognition.onend = () => {
        if (this.voiceState === 'LISTENING') {
          this.voiceState = 'IDLE';
        }
      };

      this.recognition.start();
    } catch {
      this.voiceState = 'IDLE';
    }
  }

  private stopVoiceRecognition(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignorer
      }
      this.recognition = null;
    }
    this.voiceState = 'IDLE';
  }

  speakCoachQuestion(text: string): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    this.stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      this.voiceState = 'SPEAKING';
    };
    utterance.onend = () => {
      this.voiceState = 'IDLE';
    };
    utterance.onerror = () => {
      this.voiceState = 'IDLE';
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeech(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (this.voiceState === 'SPEAKING') {
        this.voiceState = 'IDLE';
      }
    }
  }

  replayCurrentQuestion(): void {
    this.speakCoachQuestion(this.getCurrentCoachQuestion());
  }

  togglePauseVoice(): void {
    if (this.voiceState === 'PAUSED') {
      this.voiceState = 'IDLE';
      this.replayCurrentQuestion();
    } else {
      this.stopSpeech();
      this.stopVoiceRecognition();
      this.voiceState = 'PAUSED';
    }
  }

  getVoiceStateMessage(): string {
    switch (this.voiceState) {
      case 'LISTENING': return '🎤 Je t\'écoute... Parle naturellement !';
      case 'SPEAKING': return '🗣️ Le coach te pose la question...';
      case 'PAUSED': return '⏸️ Entraînement en pause.';
      default: return 'Prêt(e) ? Parle quand tu es prêt(e).';
    }
  }

  // --------------------------------------------------------------------------
  // Mode Rédaction (Maquette 3)
  // --------------------------------------------------------------------------
  generateMessage(): void {
    if (this.messageStyle === 'FORMEL') {
      this.emailSubject = `Candidature stage d’observation — ${this.selectedCareer}`;
      this.generatedBodyText = `Madame, Monsieur,\n\nActuellement accompagnée par le Centre des Possibles au Hub de l'Innovation à Nice dans la construction de mon projet d'orientation, je m'intéresse vivement aux métiers de la finition et tout particulièrement au métier de ${this.selectedCareer.toLowerCase()}.\n\nJ'aimerais solliciter auprès de votre établissement, ${this.companyName}, l'opportunité d'effectuer une période d'immersion conventionnée de 3 jours ${this.periodName ? 'pendant les ' + this.periodName.toLowerCase() : 'prochainement'}.\n\nCe stage d'observation me permettrait de confronter mes aptitudes au terrain, de découvrir le quotidien de vos équipes et de confirmer mon choix d'orientation.\n\nJe reste à votre disposition pour vous transmettre ma convention officielle et convenir d'un échange.\n\nJe vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.\n\n${this.youngDisplayName}`;
    } else {
      this.emailSubject = `Demande de stage d'observation — ${this.selectedCareer}`;
      this.generatedBodyText = `Bonjour,\n\nJe m'intéresse beaucoup au métier de ${this.selectedCareer.toLowerCase()} et j'aimerais découvrir le quotidien d'un professionnel dans ce domaine.\n\nJe souhaiterais savoir s'il serait possible de m'accueillir pour un stage d'observation pendant les ${this.periodName.toLowerCase()}, ainsi que les modalités d'accueil (durée, organisation, démarches éventuelles).\n\nJe reste à votre disposition pour tout complément d'information et vous remercie par avance pour votre réponse.\n\nCordialement,\n${this.youngDisplayName}`;
    }
  }

  copyMessage(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.generatedBodyText);
      this.copiedToast = true;
      setTimeout(() => (this.copiedToast = false), 2000);
    }
  }

  downloadMessagePdf(): void {
    const text = `OBJET : ${this.emailSubject}\n\n${this.generatedBodyText}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Message_Contact_${this.selectedCareer.replace(' ', '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  saveToImmersionProject(): void {
    this.saveImmersion.emit(this.generatedBodyText);
    alert('Message enregistré dans ton projet d’immersion ! Tu peux le retrouver à l’Étape 4 de Mon Immersion Pro.');
  }
}
