// ============================================================================
// MonBilan+ — Composant « Mon Coach IA »
// Intégration complète unifiée des cinq onglets interactifs et des trois maquettes officielles :
// 1. Rédiger un email (Atelier de rédaction, styles, copie, téléchargement, liaison)
// 2. Préparer un appel (Script d'appel guidé étape par étape, gestion des objections, mémo)
// 3. Préparer une relance (Paramètres de délai, message poli et efficace, conseils)
// 4. S'entraîner (Oral & Écrit avec STT / TTS, ondes audio, progression multi-étapes, débriefing)
// 5. Discuter avec le Coach (Chat en temps réel, suggestions en 1 clic, Ollama / autonome)
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import { saveDraftItem } from '../../shared/autonomous-data';
import {
  COACH_TRAINING_SCENARIOS,
  TrainingScenario,
  TrainingScenarioId
} from '../../shared/coach-training-data';

export type CoachActiveTab = 'EMAIL' | 'CALL_SCRIPT' | 'FOLLOWUP' | 'TRAINING' | 'CHAT';
export type TrainingMode = 'TEXT' | 'VOCAL';
export type VoiceEngineState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'PAUSED';

export interface SimulationTurn {
  stepIndex: number;
  userText: string;
  feedback: string;
  coachReply: string;
  timestamp: string;
}

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
      <!-- 1. BANNIÈRE HERO « MON COACH IA »                                 -->
      <!-- ================================================================== -->
      <div class="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9333EA] text-white p-6 sm:p-8 shadow-xl shadow-purple-950/10">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-start sm:items-center gap-4 max-w-2xl">
            <!-- Icône Étincelle (Sparkle) conforme à la maquette -->
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/25 shadow-md">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
                <path d="M19 16L19.9 19.1L23 20L19.9 20.9L19 24L18.1 20.9L15 20L18.1 19.1L19 16Z" opacity="0.7" />
              </svg>
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

          <!-- Sélecteur rapide de projet métier pour la simulation & immersion -->
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-xs space-y-2 shrink-0">
            <div class="flex items-center justify-between gap-3 text-purple-100 font-bold">
              <span><mb-icon name="target"></mb-icon> Projet en cours :</span>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-extrabold">Dossier Rdv 2187</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="setCareer('Technicien du son')"
                [class]="selectedCareer === 'Technicien du son' ? 'bg-white text-[#7C3AED] shadow-md font-black' : 'bg-white/15 text-white hover:bg-white/25 font-bold'"
                class="px-3 py-1.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5"
              >
                <span><mb-icon name="headphones"></mb-icon></span>
                <span>Technicien du son (p. 12)</span>
              </button>
              <button
                type="button"
                (click)="setCareer('Peintre décorateur')"
                [class]="selectedCareer === 'Peintre décorateur' ? 'bg-white text-[#7C3AED] shadow-md font-black' : 'bg-white/15 text-white hover:bg-white/25 font-bold'"
                class="px-3 py-1.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5"
              >
                <span><mb-icon name="palette"></mb-icon></span>
                <span>Peintre décorateur (p. 8)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. BARRE DE NAVIGATION SUPÉRIEURE DES 5 ONGLETS                   -->
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
            <mb-icon name="mail"></mb-icon>
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
            <mb-icon name="phone"></mb-icon>
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
            <mb-icon name="refresh-cw"></mb-icon>
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
            <mb-icon name="mic"></mb-icon>
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
            <mb-icon name="message-circle"></mb-icon>
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
      <!-- VUE 1 : RÉDIGER UN EMAIL (Maquette 3)                              -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'EMAIL'" class="space-y-6">
        <!-- Grille 3 Colonnes de la Maquette 3 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Colonne 1 : Mon projet actuel + Formulaire (4/12) -->
          <div class="lg:col-span-4 space-y-5">
            <!-- Bloc Mon projet actuel -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span class="text-[#7C3AED]"><mb-icon name="target"></mb-icon></span>
                  <span>Mon projet actuel</span>
                </span>
                <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Depuis Immersion Pro
                </span>
              </div>

              <div class="space-y-2 text-xs text-[#0F1035]">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="hammer"></mb-icon> Métier :</span>
                  <span class="font-bold">{{ selectedCareer }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="building-2"></mb-icon> Entreprise :</span>
                  <span class="font-bold">{{ companyName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="flag"></mb-icon> Étape :</span>
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
                    class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] px-3 py-2 text-xs font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                  />
                </div>

                <div>
                  <label class="block font-bold text-gray-700 mb-1">Période souhaitée</label>
                  <input
                    type="text"
                    [(ngModel)]="periodName"
                    class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] px-3 py-2 text-xs font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                  />
                </div>

                <div class="space-y-1.5 pt-1">
                  <label class="block font-bold text-gray-700">Style du message</label>
                  <label class="flex items-center gap-2 p-2 rounded-xl border border-[#E4E0F5] cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="mStyle" [(ngModel)]="messageStyle" value="SIMPLE" (change)="generateMessage()" class="text-[#7C3AED]" />
                    <span class="font-bold text-[#0F1035] flex-1">Simple et naturel</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Recommandé</span>
                  </label>
                  <label class="flex items-center gap-2 p-2 rounded-xl border border-[#E4E0F5] cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="mStyle" [(ngModel)]="messageStyle" value="FORMEL" (change)="generateMessage()" class="text-[#7C3AED]" />
                    <span class="font-bold text-[#0F1035]">Plus formel (entreprise, service RH...)</span>
                  </label>
                </div>

                <button
                  type="button"
                  (click)="generateMessage()"
                  class="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span><mb-icon name="sparkles"></mb-icon></span>
                  <span>Générer mon message</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Colonne 2 : Proposition de message (5/12) -->
          <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
              <span class="text-xs font-extrabold text-[#0F1035] flex items-center gap-2">
                <span class="text-[#7C3AED]"><mb-icon name="sparkles"></mb-icon></span>
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

            <!-- Actions sur le message -->
            <div class="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                (click)="copyMessage()"
                class="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-[#0F1035] hover:bg-gray-50 transition cursor-pointer flex items-center gap-1"
              >
                <span><mb-icon name="clipboard-list"></mb-icon></span>
                <span>{{ copiedToast ? 'Copié !' : 'Copier le texte' }}</span>
              </button>
              <button
                type="button"
                (click)="downloadMessagePdf()"
                class="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-[#0F1035] hover:bg-gray-50 transition cursor-pointer flex items-center gap-1"
              >
                <span><mb-icon name="download"></mb-icon></span>
                <span>Télécharger (TXT / PDF)</span>
              </button>
            </div>

            <div class="space-y-2 pt-2 border-t border-[#F0EDFA]">
              <button
                type="button"
                (click)="saveToImmersionProject()"
                class="w-full py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span><mb-icon name="save"></mb-icon></span>
                <span>Enregistrer dans mon projet</span>
              </button>
              <button
                type="button"
                (click)="saveToImmersionProject()"
                class="w-full py-2 rounded-2xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-[#6D28D9] font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span><mb-icon name="link"></mb-icon></span>
                <span>Lier à mon immersion</span>
              </button>
            </div>
          </div>

          <!-- Colonne 3 : Conseils & Et après ? (3/12) -->
          <div class="lg:col-span-3 space-y-4">
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-amber-500"><mb-icon name="lightbulb"></mb-icon></span>
                <span>Conseils du Coach</span>
              </div>
              <ul class="space-y-2 text-xs font-medium text-emerald-800">
                <li class="flex items-start gap-1.5">
                  <span><mb-icon name="check"></mb-icon></span>
                  <span>Sois clair(e) sur ton objectif.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span><mb-icon name="check"></mb-icon></span>
                  <span>Reste poli(e) et courtois(e).</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span><mb-icon name="check"></mb-icon></span>
                  <span>Indique une période réaliste.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span><mb-icon name="check"></mb-icon></span>
                  <span>Montre ta motivation pour le métier.</span>
                </li>
              </ul>
            </div>

            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-[#7C3AED]"><mb-icon name="timer"></mb-icon></span>
                <span>Et après ?</span>
              </div>
              <div class="space-y-2 text-xs text-[#42466B]">
                <div class="flex items-start gap-2">
                  <span class="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] font-black text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Relis et personnalise le message.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] font-black text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Envoie-le depuis ta messagerie.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] font-black text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Enregistre l'envoi pour suivre la réponse.</span>
                </div>
              </div>
            </div>

            <!-- Besoin d'aide ? -->
            <div class="rounded-[28px] bg-[#F5F3FF] border border-[#DDD6FE] p-5 space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#6D28D9]">
                <span class="text-base"><mb-icon name="message-circle"></mb-icon></span>
                <span>Besoin d'aide ?</span>
              </div>
              <p class="text-[11px] text-[#4C1D95]">Tu hésites sur la formulation ? Viens échanger avec moi.</p>
              <button
                type="button"
                (click)="selectTab('CHAT')"
                class="w-full py-2 rounded-xl bg-white border border-[#DDD6FE] hover:bg-purple-100 text-[#6D28D9] font-extrabold text-xs transition cursor-pointer"
              >
                Discuter avec le Coach →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 2 : PRÉPARER UN APPEL                                         -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'CALL_SCRIPT'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Colonne 1 : Contexte de l'appel (4/12) -->
          <div class="lg:col-span-4 space-y-5">
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span class="text-blue-600"><mb-icon name="phone"></mb-icon></span>
                  <span>Entreprise à contacter</span>
                </span>
                <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Immersion Pro
                </span>
              </div>

              <div class="space-y-2 text-xs text-[#0F1035]">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="building-2"></mb-icon> Structure :</span>
                  <span class="font-bold">{{ companyName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="hammer"></mb-icon> Métier :</span>
                  <span class="font-bold">{{ selectedCareer }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="phone"></mb-icon> Téléphone :</span>
                  <span class="font-bold text-[#7C3AED]">{{ callPhoneNumber }}</span>
                </div>
              </div>
            </div>

            <!-- Choix de l'objectif de l'appel -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider">
                Objectif de mon appel
              </h3>

              <div class="space-y-2 text-xs">
                <label class="flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition"
                  [ngClass]="callObjective === 'DEMANDE' ? 'border-[#7C3AED] bg-purple-50/50' : 'border-[#E4E0F5] hover:bg-gray-50'">
                  <input type="radio" name="callObj" [(ngModel)]="callObjective" value="DEMANDE" class="text-[#7C3AED]" />
                  <div>
                    <div class="font-bold text-[#0F1035]">1. Première prise de contact</div>
                    <div class="text-[10px] text-gray-500">Demander si un accueil en stage d'observation est possible.</div>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition"
                  [ngClass]="callObjective === 'CONFIRMATION' ? 'border-[#7C3AED] bg-purple-50/50' : 'border-[#E4E0F5] hover:bg-gray-50'">
                  <input type="radio" name="callObj" [(ngModel)]="callObjective" value="CONFIRMATION" class="text-[#7C3AED]" />
                  <div>
                    <div class="font-bold text-[#0F1035]">2. Confirmer les dates & convention</div>
                    <div class="text-[10px] text-gray-500">L'entreprise est d'accord de principe, caler l'organisation.</div>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition"
                  [ngClass]="callObjective === 'RELANCE' ? 'border-[#7C3AED] bg-purple-50/50' : 'border-[#E4E0F5] hover:bg-gray-50'">
                  <input type="radio" name="callObj" [(ngModel)]="callObjective" value="RELANCE" class="text-[#7C3AED]" />
                  <div>
                    <div class="font-bold text-[#0F1035]">3. Prendre des nouvelles d'un email</div>
                    <div class="text-[10px] text-gray-500">Tu as envoyé une demande il y a quelques jours sans réponse.</div>
                  </div>
                </label>
              </div>

              <!-- Interlocuteur -->
              <div class="space-y-1.5 pt-2 border-t border-[#F0EDFA] text-xs">
                <label class="block font-bold text-gray-700">Qui as-tu au bout du fil ?</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    (click)="callRecipient = 'ACCUEIL'"
                    [class]="callRecipient === 'ACCUEIL' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-gray-100 text-gray-700'"
                    class="py-2 px-3 rounded-xl text-xs transition cursor-pointer"
                  >
                    Standard / Accueil
                  </button>
                  <button
                    type="button"
                    (click)="callRecipient = 'RESPONSABLE'"
                    [class]="callRecipient === 'RESPONSABLE' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-gray-100 text-gray-700'"
                    class="py-2 px-3 rounded-xl text-xs transition cursor-pointer"
                  >
                    Responsable / Artisan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne 2 : Script téléphonique guidé (5/12) -->
          <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
              <span class="text-xs font-extrabold text-[#0F1035] flex items-center gap-2">
                <span class="text-blue-600"><mb-icon name="file-text"></mb-icon></span>
                <span>Mon script téléphonique guidé</span>
              </span>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Pense-bête en direct
              </span>
            </div>

            <!-- Étapes du script -->
            <div class="space-y-3 text-xs leading-relaxed">
              <!-- Étape 1 : Salutation -->
              <div class="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-1">
                <div class="text-[10px] font-extrabold text-[#7C3AED] uppercase">1. Salutation & Présentation</div>
                <p class="font-medium text-[#0F1035]">
                  « Bonjour, je m'appelle <strong>{{ youngDisplayName }}</strong>. Je vous contacte dans le cadre de la construction de mon projet professionnel avec le Centre des Possibles à Nice. »
                </p>
              </div>

              <!-- Étape 2 : Le motif -->
              <div class="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-1">
                <div class="text-[10px] font-extrabold text-[#7C3AED] uppercase">2. La raison de mon appel</div>
                <p *ngIf="callObjective === 'DEMANDE'" class="font-medium text-[#0F1035]">
                  « J'aimerais beaucoup découvrir le métier de <strong>{{ selectedCareer }}</strong> sur le terrain. Est-ce que votre entreprise accueillerait un jeune pour un stage d'observation conventionné de 3 jours pendant les {{ periodName.toLowerCase() }} ? »
                </p>
                <p *ngIf="callObjective === 'CONFIRMATION'" class="font-medium text-[#0F1035]">
                  « Je vous appelle pour faire suite à notre premier échange au sujet de mon immersion. Je souhaitais savoir à qui je peux transmettre ma convention signée par ma structure d'accompagnement. »
                </p>
                <p *ngIf="callObjective === 'RELANCE'" class="font-medium text-[#0F1035]">
                  « Je me permets de vous contacter pour faire suite à l'email que je vous ai transmis la semaine passée concernant une immersion en {{ selectedCareer }}. Avez-vous eu le temps d'en prendre connaissance ? »
                </p>
              </div>

              <!-- Étape 3 : Demande du contact -->
              <div *ngIf="callRecipient === 'ACCUEIL'" class="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-1">
                <div class="text-[10px] font-extrabold text-[#7C3AED] uppercase">3. Cibler le responsable</div>
                <p class="font-medium text-[#0F1035]">
                  « Pourriez-vous me mettre en relation avec la personne qui gère les ateliers ou les demandes de stage ? »
                </p>
              </div>

              <!-- Boîte à outils : Si on te dit... -->
              <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div class="text-[11px] font-extrabold text-amber-900 flex items-center gap-1.5">
                  <span><mb-icon name="lightbulb"></mb-icon></span>
                  <span>Que répondre si...</span>
                </div>
                <div class="text-[11px] space-y-1.5 text-amber-950">
                  <div>
                    <strong>• Si on te dit « Envoyez un email » :</strong><br/>
                    « Très bien, à quelle adresse puis-je vous l'envoyer et à quelle attention ? Merci ! »
                  </div>
                  <div>
                    <strong>• Si le responsable est absent :</strong><br/>
                    « Quel serait le meilleur moment pour que je rappelle ? Puis-je laisser mon nom et numéro ? »
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0EDFA]">
              <button
                type="button"
                (click)="copyCallScript()"
                class="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span><mb-icon name="clipboard-list"></mb-icon></span>
                <span>{{ copiedToast ? 'Script copié !' : 'Copier tout le script' }}</span>
              </button>
              <button
                type="button"
                (click)="selectTab('TRAINING')"
                class="px-4 py-2 rounded-xl border border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <span><mb-icon name="headphones"></mb-icon></span>
                <span>S'entraîner à voix haute</span>
              </button>
            </div>
          </div>

          <!-- Colonne 3 : Conseils d'or pour téléphoner (3/12) -->
          <div class="lg:col-span-3 space-y-4">
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-amber-500"><mb-icon name="target"></mb-icon></span>
                <span>Conseils avant d'appeler</span>
              </div>
              <ul class="space-y-2 text-xs font-medium text-[#42466B]">
                <li class="flex items-start gap-1.5">
                  <span class="text-emerald-600 font-bold"><mb-icon name="check"></mb-icon></span>
                  <span>Prends une grande inspiration et souris : ça s'entend au téléphone !</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-emerald-600 font-bold"><mb-icon name="check"></mb-icon></span>
                  <span>Aie un bloc-notes et un stylo prêt pour noter le nom de la personne.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-emerald-600 font-bold"><mb-icon name="check"></mb-icon></span>
                  <span>Appelle de préférence le matin entre 9h30 et 11h30.</span>
                </li>
              </ul>
            </div>

            <div class="rounded-[28px] bg-blue-50 border border-blue-200 p-5 space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-blue-900">
                <span class="text-base"><mb-icon name="rocket"></mb-icon></span>
                <span>Peur d'appeler ?</span>
              </div>
              <p class="text-[11px] text-blue-950">
                Teste d'abord ton appel avec le Coach en simulation vocale. Tu seras deux fois plus à l'aise !
              </p>
              <button
                type="button"
                (click)="selectTab('TRAINING')"
                class="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition cursor-pointer shadow-xs"
              >
                Lancer la simulation →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 3 : PRÉPARER UNE RELANCE                                      -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'FOLLOWUP'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Colonne 1 : Paramètres de la relance (4/12) -->
          <div class="lg:col-span-4 space-y-5">
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span class="text-amber-600"><mb-icon name="refresh-cw"></mb-icon></span>
                  <span>Entreprise relancée</span>
                </span>
                <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Suivi de contact
                </span>
              </div>

              <div class="space-y-2 text-xs text-[#0F1035]">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="building-2"></mb-icon> Entreprise :</span>
                  <span class="font-bold">{{ companyName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="hammer"></mb-icon> Métier :</span>
                  <span class="font-bold">{{ selectedCareer }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"><mb-icon name="calendar"></mb-icon> 1ère demande :</span>
                  <span class="font-bold">Il y a quelques jours</span>
                </div>
              </div>
            </div>

            <!-- Réglages de la relance -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider">
                Paramètres de ma relance
              </h3>

              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-gray-700 mb-1">Délai écoulé sans réponse</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      (click)="followupDelay = '5J'; updateFollowupMessage()"
                      [class]="followupDelay === '5J' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-gray-100 text-gray-700'"
                      class="py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      5 jours
                    </button>
                    <button
                      type="button"
                      (click)="followupDelay = '7J'; updateFollowupMessage()"
                      [class]="followupDelay === '7J' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-gray-100 text-gray-700'"
                      class="py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      7 jours (recommandé)
                    </button>
                    <button
                      type="button"
                      (click)="followupDelay = '10J'; updateFollowupMessage()"
                      [class]="followupDelay === '10J' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-gray-100 text-gray-700'"
                      class="py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      10 jours +
                    </button>
                  </div>
                </div>

                <div class="space-y-1.5 pt-1">
                  <label class="block font-bold text-gray-700">Tonalité du message</label>
                  <label class="flex items-center gap-2 p-2 rounded-xl border border-[#E4E0F5] cursor-pointer">
                    <input type="radio" name="fTone" [(ngModel)]="followupTone" value="COURTOIS" (change)="updateFollowupMessage()" class="text-[#7C3AED]" />
                    <span class="font-bold text-[#0F1035] flex-1">Courtois et bienveillant</span>
                  </label>
                  <label class="flex items-center gap-2 p-2 rounded-xl border border-[#E4E0F5] cursor-pointer">
                    <input type="radio" name="fTone" [(ngModel)]="followupTone" value="ENTHOUSIASTE" (change)="updateFollowupMessage()" class="text-[#7C3AED]" />
                    <span class="font-bold text-[#0F1035]">Dynamique & motivé(e)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne 2 : Message de relance généré (5/12) -->
          <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
              <span class="text-xs font-extrabold text-[#0F1035] flex items-center gap-2">
                <span class="text-amber-600"><mb-icon name="sparkles"></mb-icon></span>
                <span>Message de relance optimisé</span>
              </span>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Poli & Performatif
              </span>
            </div>

            <!-- Carte du message -->
            <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 text-xs space-y-3 leading-relaxed">
              <div class="font-extrabold text-[#0F1035]">
                Objet : {{ followupSubject }}
              </div>
              <div class="whitespace-pre-line text-[#1E1B4B]">
                {{ followupBodyText }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                (click)="copyFollowupMessage()"
                class="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-[#0F1035] hover:bg-gray-50 transition cursor-pointer flex items-center gap-1"
              >
                <span><mb-icon name="clipboard-list"></mb-icon></span>
                <span>{{ copiedToast ? 'Copié !' : 'Copier le message' }}</span>
              </button>
              <button
                type="button"
                (click)="downloadFollowupPdf()"
                class="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-[#0F1035] hover:bg-gray-50 transition cursor-pointer flex items-center gap-1"
              >
                <span><mb-icon name="download"></mb-icon></span>
                <span>Télécharger</span>
              </button>
            </div>

            <div class="pt-2 border-t border-[#F0EDFA]">
              <button
                type="button"
                (click)="saveToImmersionProject()"
                class="w-full py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span><mb-icon name="save"></mb-icon></span>
                <span>Enregistrer dans mon suivi d'immersion</span>
              </button>
            </div>
          </div>

          <!-- Colonne 3 : Règles d'or de la relance (3/12) -->
          <div class="lg:col-span-3 space-y-4">
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-amber-500"><mb-icon name="lightbulb"></mb-icon></span>
                <span>Pourquoi relancer ?</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Les artisans et dirigeants sont très sollicités. Une relance polie après une semaine ne dérange jamais : au contraire, elle prouve ta vraie motivation !
              </p>
              <ul class="space-y-1.5 text-xs font-medium text-emerald-800">
                <li class="flex items-start gap-1">
                  <span><mb-icon name="check"></mb-icon></span>
                  <span>Reste toujours positif.</span>
                </li>
                <li class="flex items-start gap-1">
                  <span><mb-icon name="check"></mb-icon></span>
                  <span>Ne fais aucun reproche.</span>
                </li>
                <li class="flex items-start gap-1">
                  <span><mb-icon name="check"></mb-icon></span>
                  <span>Précise ta flexibilité sur les dates.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 4 : S'ENTRAÎNER (Maquette 1 & Maquette 2)                      -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'TRAINING'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Colonne gauche (7/12) : Zone d'entraînement interactif -->
          <div class="lg:col-span-7 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-6">
            <!-- En-tête -->
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <mb-icon name="target" class="text-xl text-[#7C3AED]"></mb-icon>
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
                <button
                  type="button"
                  (click)="setTrainingMode('VOCAL')"
                  [class]="trainingMode === 'VOCAL'
                    ? 'bg-[#7C3AED] text-white shadow-md font-extrabold'
                    : 'bg-white border border-[#E4E0F5] text-[#42466B] hover:bg-[#F8F7FF] font-semibold'"
                  class="py-2.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <mb-icon name="mic" class="text-base"></mb-icon>
                  <span>Vocal</span>
                </button>

                <button
                  type="button"
                  (click)="setTrainingMode('TEXT')"
                  [class]="trainingMode === 'TEXT'
                    ? 'bg-[#7C3AED] text-white shadow-md font-extrabold'
                    : 'bg-white border border-[#E4E0F5] text-[#42466B] hover:bg-[#F8F7FF] font-semibold'"
                  class="py-2.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <mb-icon name="keyboard" class="text-base"></mb-icon>
                  <span>Texte</span>
                </button>
              </div>
            </div>

            <!-- Choisis une situation : 4 scénarios -->
            <div class="space-y-2.5">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                Choisis une situation :
              </label>

              <div class="space-y-2">
                <div
                  *ngFor="let sc of scenariosList"
                  (click)="selectScenario(sc)"
                  [class]="activeScenario.id === sc.id
                    ? 'border-[#7C3AED] bg-purple-50/60 ring-2 ring-[#7C3AED]/20 shadow-xs'
                    : 'border-[#E4E0F5] bg-white hover:border-[#7C3AED]/40 hover:bg-[#FDFCFE]'"
                  class="p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div
                      [class]="activeScenario.id === sc.id ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 text-gray-500'"
                      class="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 transition"
                    >
                      <mb-icon *ngIf="activeScenario.id === sc.id" name="check" class="text-[11px]"></mb-icon>
                    </div>
                    <span class="text-xs sm:text-sm font-extrabold text-[#0F1035]">
                      {{ sc.title }}
                    </span>
                  </div>
                  <mb-icon
                    [name]="getScenarioIcon(sc.id)"
                    class="text-lg"
                    [ngClass]="activeScenario.id === sc.id ? 'text-[#7C3AED]' : 'text-gray-400'"
                  ></mb-icon>
                </div>
              </div>
            </div>

            <!-- CAS A : INTERACTION EN MODE TEXTE (Maquette 1) -->
            <div *ngIf="trainingMode === 'TEXT'" class="space-y-4 pt-2 border-t border-[#F0EDFA]">
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 sm:p-5 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                      <svg class="w-4 h-4 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="M12 7v4"></path>
                        <circle cx="8.5" cy="16" r="1" fill="currentColor"></circle>
                        <circle cx="15.5" cy="16" r="1" fill="currentColor"></circle>
                      </svg>
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

                <div class="p-3.5 rounded-2xl bg-white border border-[#DDD6FE] text-xs sm:text-sm text-[#0F1035] font-semibold leading-relaxed shadow-2xs">
                  {{ getCurrentCoachQuestion() }}
                </div>
              </div>

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

              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  (click)="sendUserResponse()"
                  [disabled]="!userTextResponse.trim()"
                  class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span><mb-icon name="plane"></mb-icon></span>
                  <span>Envoyer ma réponse</span>
                </button>

                <button
                  type="button"
                  (click)="setTrainingMode('VOCAL')"
                  class="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span><mb-icon name="mic"></mb-icon></span>
                  <span>Basculer en mode vocal</span>
                </button>
              </div>

              <div class="text-center text-[11px] text-gray-400 font-medium">
                <mb-icon name="info"></mb-icon> Tu peux changer de mode à tout moment.
              </div>
            </div>

            <!-- CAS B : INTERACTION EN MODE VOCAL (Maquette 2) -->
            <div *ngIf="trainingMode === 'VOCAL'" class="space-y-4 pt-2 border-t border-[#F0EDFA]">
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 sm:p-5 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                      <svg class="w-4 h-4 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="M12 7v4"></path>
                        <circle cx="8.5" cy="16" r="1" fill="currentColor"></circle>
                        <circle cx="15.5" cy="16" r="1" fill="currentColor"></circle>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">
                        Coach IA • Simulation
                      </h4>
                      <p class="text-[10px] text-gray-500 font-medium">{{ activeScenario.badgeLabel }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-xs font-extrabold text-[#7C3AED]">
                      Étape {{ currentStepIndex + 1 }} / {{ activeScenario.steps.length }}
                    </span>
                    <div class="flex items-center gap-1">
                      <span
                        *ngFor="let s of activeScenario.steps; let idx = index"
                        [class]="idx <= currentStepIndex ? 'bg-[#7C3AED] w-3' : 'bg-gray-300 w-1.5'"
                        class="h-1.5 rounded-full transition-all"
                      ></span>
                    </div>
                  </div>
                </div>

                <div class="p-3.5 rounded-2xl bg-white border border-[#DDD6FE] text-xs sm:text-sm text-[#0F1035] font-semibold leading-relaxed shadow-2xs">
                  {{ getCurrentCoachQuestion() }}
                </div>
              </div>

              <!-- Zone d'ondes sonores et contrôles vocaux -->
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div class="flex items-center justify-center gap-1.5 h-12">
                  <span class="w-1.5 h-6 bg-[#C4B5FD] rounded-full wave-bar" [class.animate-pulse]="voiceState === 'SPEAKING' || voiceState === 'LISTENING'" style="animation-delay: 0.1s"></span>
                  <span class="w-1.5 h-10 bg-[#A78BFA] rounded-full wave-bar" [class.animate-pulse]="voiceState === 'SPEAKING' || voiceState === 'LISTENING'" style="animation-delay: 0.2s"></span>
                  <span class="w-1.5 h-4 bg-[#C4B5FD] rounded-full wave-bar" [class.animate-pulse]="voiceState === 'SPEAKING' || voiceState === 'LISTENING'" style="animation-delay: 0.3s"></span>

                  <!-- Bouton Micro Central -->
                  <div
                    (click)="toggleVoiceListening()"
                    [class]="voiceState === 'LISTENING' 
                      ? 'bg-red-500 ring-4 ring-red-200 scale-110 animate-pulse' 
                      : voiceState === 'THINKING' 
                        ? 'bg-amber-500 ring-4 ring-amber-200 animate-spin' 
                        : voiceState === 'SPEAKING'
                          ? 'bg-purple-600 ring-4 ring-purple-200 scale-105'
                          : 'bg-[#7C3AED] hover:scale-105'"
                    class="w-14 h-14 rounded-full text-white flex items-center justify-center text-2xl shadow-lg mx-2 transition cursor-pointer"
                    title="Cliquer pour parler ou arrêter"
                  >
                    <span *ngIf="voiceState !== 'THINKING'"><mb-icon name="mic"></mb-icon></span>
                    <span *ngIf="voiceState === 'THINKING'" class="text-sm"><mb-icon name="hourglass"></mb-icon></span>
                  </div>

                  <span class="w-1.5 h-4 bg-[#C4B5FD] rounded-full wave-bar" [class.animate-pulse]="voiceState === 'SPEAKING' || voiceState === 'LISTENING'" style="animation-delay: 0.4s"></span>
                  <span class="w-1.5 h-10 bg-[#A78BFA] rounded-full wave-bar" [class.animate-pulse]="voiceState === 'SPEAKING' || voiceState === 'LISTENING'" style="animation-delay: 0.5s"></span>
                  <span class="w-1.5 h-6 bg-[#C4B5FD] rounded-full wave-bar" [class.animate-pulse]="voiceState === 'SPEAKING' || voiceState === 'LISTENING'" style="animation-delay: 0.6s"></span>
                </div>

                <div class="space-y-1 max-w-lg">
                  <p class="text-xs sm:text-sm font-extrabold text-[#0F1035]">
                    {{ getVoiceStateMessage() }}
                  </p>
                  <p *ngIf="transcribedLiveSpeech" class="text-xs text-[#7C3AED] font-semibold italic bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                    « {{ transcribedLiveSpeech }} »
                  </p>
                </div>

                <!-- Boutons d'action vocale -->
                <div class="flex flex-col sm:flex-row items-center gap-2 w-full justify-center">
                  <button
                    type="button"
                    (click)="toggleVoiceListening()"
                    class="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <mb-icon [name]="voiceState === 'LISTENING' ? 'square' : 'mic'" [filled]="voiceState === 'LISTENING'"></mb-icon>
                    <span>{{ voiceState === 'LISTENING' ? 'Valider ma réponse vocale' : 'Activer le micro & parler' }}</span>
                  </button>

                  <!-- Filet de sécurité démo jury : Réponse type instantanée en 1 clic -->
                  <button
                    type="button"
                    (click)="simulateLiveResponseForDemo()"
                    class="w-full sm:w-auto px-4 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    title="Génère une réponse type réaliste si le micro n'est pas disponible"
                  >
                    <span><mb-icon name="zap"></mb-icon> Réponse type Démo</span>
                  </button>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    (click)="togglePauseVoice()"
                    class="px-3 py-1.5 rounded-xl bg-white border border-[#E4E0F5] hover:bg-gray-50 text-xs font-bold text-[#0F1035] transition flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <mb-icon [name]="voiceState === 'PAUSED' ? 'play' : 'pause'" [filled]="true"></mb-icon>
                    <span>{{ voiceState === 'PAUSED' ? 'Reprendre' : 'Pause' }}</span>
                  </button>

                  <button
                    type="button"
                    (click)="replayCurrentQuestion()"
                    class="px-3 py-1.5 rounded-xl bg-white border border-[#E4E0F5] hover:bg-gray-50 text-xs font-bold text-[#0F1035] transition flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span><mb-icon name="refresh-cw"></mb-icon> Répéter la question</span>
                  </button>

                  <button
                    type="button"
                    (click)="finishTrainingNow()"
                    class="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-xs font-bold text-[#7C3AED] transition flex items-center gap-1 cursor-pointer"
                  >
                    <span><mb-icon name="flag"></mb-icon> Conclure la simulation</span>
                  </button>
                </div>

                <button
                  type="button"
                  (click)="setTrainingMode('TEXT')"
                  class="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span><mb-icon name="message-circle"></mb-icon> Passer en mode texte</span>
                </button>
              </div>

              <!-- FIL HISTORIQUE DES ÉCHANGES DE SIMULATION -->
              <div *ngIf="simulationTurns.length > 0" class="space-y-3 pt-3 border-t border-[#F0EDFA]">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-extrabold text-[#0F1035] flex items-center gap-1.5">
                    <span class="text-base text-[#7C3AED]"><mb-icon name="message-circle"></mb-icon></span>
                    <span>Échanges de la simulation</span>
                  </h4>
                  <span class="text-[11px] font-bold text-gray-400">
                    {{ simulationTurns.length }} réplique{{ simulationTurns.length > 1 ? 's' : '' }}
                  </span>
                </div>

                <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
                  <div *ngFor="let turn of simulationTurns; let i = index" class="space-y-2 text-xs">
                    <!-- Réplique du jeune -->
                    <div class="flex justify-end">
                      <div class="rounded-2xl rounded-tr-sm bg-purple-100 text-[#0F1035] p-3 max-w-[85%] space-y-1 shadow-2xs">
                        <div class="flex items-center justify-between gap-2 text-[10px] text-purple-700 font-bold">
                          <span><mb-icon name="user"></mb-icon> Toi (Étape {{ turn.stepIndex + 1 }})</span>
                          <span>{{ turn.timestamp }}</span>
                        </div>
                        <p class="font-medium text-xs leading-relaxed">« {{ turn.userText }} »</p>
                      </div>
                    </div>

                    <!-- Écoute active bienveillante & réponse du Coach -->
                    <div class="flex justify-start">
                      <div class="rounded-2xl rounded-tl-sm bg-[#F8F7FF] border border-[#DDD6FE] text-[#0F1035] p-3 max-w-[90%] space-y-1.5 shadow-2xs">
                        <div class="flex items-center gap-1.5 text-xs font-extrabold text-[#7C3AED]">
                          <span><mb-icon name="bot"></mb-icon> Coach IA</span>
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Écoute active</span>
                        </div>
                        <div *ngIf="turn.feedback" class="text-emerald-800 font-semibold text-xs bg-emerald-50/80 p-2 rounded-xl border border-emerald-200/60">
                          <mb-icon name="sparkles"></mb-icon> {{ turn.feedback }}
                        </div>
                        <div *ngIf="turn.coachReply" class="text-xs font-semibold text-[#1E1B4B] pt-0.5">
                          {{ turn.coachReply }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- BANDEAU DE FIN DE SIMULATION : DÉBRIEFING & PASSAGE À L'ACTION -->
              <div *ngIf="isTrainingCompleted" class="rounded-[24px] bg-gradient-to-r from-emerald-600 via-teal-600 to-[#7C3AED] text-white p-6 shadow-xl space-y-4">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/25">
                    <mb-icon name="sparkles"></mb-icon>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <h4 class="text-base sm:text-lg font-black">Simulation validée avec succès !</h4>
                      <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white">Prêt pour le terrain</span>
                    </div>
                    <p class="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                      Bravo Emma ! Tu t'es exprimée avec clarté, politesse et conviction. Tu as toutes les clés pour contacter l'entreprise et organiser ton immersion en {{ selectedCareer }}.
                    </p>
                  </div>
                </div>

                <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    (click)="goToImmersion()"
                    class="flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-emerald-50 text-[#0F1035] font-black text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                  >
                    <span><mb-icon name="target"></mb-icon> Passer à l'action : Préparer mon immersion pour {{ selectedCareer }} →</span>
                  </button>

                  <button
                    type="button"
                    (click)="resetTraining()"
                    class="py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition cursor-pointer text-center"
                  >
                    <mb-icon name="refresh-cw"></mb-icon> Recommencer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne droite (5/12) : Conseils et retour d'entraînement -->
          <div class="lg:col-span-5 space-y-5">
            <div *ngIf="trainingMode === 'TEXT'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-amber-500"><mb-icon name="lightbulb"></mb-icon></span>
                <span>Conseils pour répondre</span>
              </div>
              <ul class="space-y-2 text-xs font-medium text-[#42466B]">
                <li *ngFor="let tip of activeScenario.tipsForAnswering" class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold"><mb-icon name="check"></mb-icon></span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>

            <!-- Mon retour d'entraînement -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035] pb-2 border-b border-[#F0EDFA]">
                <span class="text-base text-[#7C3AED]"><mb-icon name="target"></mb-icon></span>
                <span>Mon retour d'entraînement</span>
              </div>

              <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div class="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                  <span><mb-icon name="check"></mb-icon></span>
                  <span>Ce que tu as bien fait</span>
                </div>
                <p class="text-xs text-emerald-900 leading-relaxed font-medium">
                  {{ dynamicFeedback?.wellDone || activeScenario.defaultFeedback.wellDone }}
                </p>
              </div>

              <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div class="flex items-center gap-1.5 text-xs font-extrabold text-amber-800">
                  <span><mb-icon name="lightbulb"></mb-icon></span>
                  <span>Ce que tu peux améliorer</span>
                </div>
                <p class="text-xs text-amber-900 leading-relaxed font-medium">
                  {{ dynamicFeedback?.toImprove || activeScenario.defaultFeedback.toImprove }}
                </p>
              </div>

              <div class="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div class="flex items-center gap-1.5 text-xs font-extrabold text-[#7C3AED]">
                  <span><mb-icon name="target"></mb-icon></span>
                  <span>Ton prochain défi</span>
                </div>
                <p class="text-xs text-[#5B21B6] leading-relaxed font-medium">
                  {{ dynamicFeedback?.nextChallenge || activeScenario.defaultFeedback.nextChallenge }}
                </p>
              </div>
            </div>

            <div *ngIf="trainingMode === 'VOCAL'" class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-blue-500">ℹ</span>
                <span>Conseils pour réussir</span>
              </div>
              <ul class="space-y-2 text-xs font-medium text-[#42466B]">
                <li *ngFor="let tip of activeScenario.tipsForSuccess" class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold"><mb-icon name="check"></mb-icon></span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 text-center text-xs text-gray-500 font-semibold flex items-center justify-center gap-2">
          <span><mb-icon name="lock"></mb-icon></span>
          <span>Ton audio n'est pas enregistré par défaut. L'entraînement est confidentiel et bienveillant.</span>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 5 : DISCUTER AVEC LE COACH (Chat en direct avec le Coach IA)  -->
      <!-- ================================================================== -->
      <div *ngIf="activeTab === 'CHAT'" class="space-y-6">
        <!-- Bandeau d'état IA -->
        <div class="rounded-2xl p-3 px-4 flex items-center justify-between text-xs font-bold border"
          [ngClass]="ollamaConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-[#F8F7FF] border-[#E4E0F5] text-[#6D28D9]'">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" [ngClass]="ollamaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-[#7C3AED]'"></span>
            <span>{{ ollamaConnected ? 'Coach IA en ligne : Modèle ' + ollamaModel : 'Coach IA en ligne (Mode sécurisé bienveillant & souverain)' }}</span>
          </div>
          <button type="button" (click)="checkOllama()" class="hover:underline cursor-pointer">
            <mb-icon [name]="ollamaConnected ? 'check' : 'refresh-cw'"></mb-icon> {{ ollamaConnected ? 'Connecté' : 'Actualiser' }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Colonne gauche (8/12) : Fenêtre de discussion interactive -->
          <div class="lg:col-span-8 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[#F0EDFA]">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                  <svg class="w-4 h-4 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <circle cx="8.5" cy="16" r="1" fill="currentColor"></circle>
                    <circle cx="15.5" cy="16" r="1" fill="currentColor"></circle>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">Discussion avec mon Coach IA</h3>
                  <p class="text-[10px] text-gray-500 font-medium">À l'écoute pour ton projet en {{ selectedCareer }}</p>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                En direct
              </span>
            </div>

            <!-- Fil des messages -->
            <div class="space-y-3 min-h-[340px] max-h-[460px] overflow-y-auto pr-1">
              <div
                *ngFor="let msg of chatMessages"
                [class]="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
                class="flex gap-2.5"
              >
                <!-- Avatar si coach -->
                <div *ngIf="msg.sender === 'coach'" class="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-xs border border-purple-200">
                  <mb-icon name="bot"></mb-icon>
                </div>

                <div
                  [class]="msg.sender === 'user'
                    ? 'bg-[#7C3AED] text-white rounded-2xl rounded-tr-xs'
                    : 'bg-[#F8F7FF] text-[#0F1035] border border-[#E4E0F5] rounded-2xl rounded-tl-xs'"
                  class="p-3.5 max-w-[85%] text-xs font-medium leading-relaxed shadow-2xs space-y-1"
                >
                  <div class="whitespace-pre-line">{{ msg.text }}</div>
                  <div class="text-[9px] opacity-60 text-right">{{ msg.time }}</div>
                </div>
              </div>

              <!-- Indicateur de frappe IA -->
              <div *ngIf="isCoachThinking" class="flex gap-2.5 justify-start">
                <div class="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-xs border border-purple-200">
                  <mb-icon name="bot"></mb-icon>
                </div>
                <div class="bg-[#F8F7FF] border border-[#E4E0F5] p-3 rounded-2xl rounded-tl-xs flex items-center gap-1.5 text-xs text-[#7C3AED]">
                  <span class="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-pulse"></span>
                  <span class="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-pulse" style="animation-delay: 0.2s"></span>
                  <span class="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-pulse" style="animation-delay: 0.4s"></span>
                  <span class="text-[11px] font-semibold text-gray-500 ml-1">Le Coach te répond...</span>
                </div>
              </div>
            </div>

            <!-- Suggestions de questions rapides -->
            <div class="space-y-1.5 pt-2 border-t border-[#F0EDFA]">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Suggestions en 1 clic :</span>
              <div class="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  (click)="sendChatMessage('Comment me présenter en 1 minute ?')"
                  class="px-2.5 py-1 rounded-full bg-[#F5F3FF] hover:bg-purple-100 text-[#6D28D9] text-[11px] font-bold transition cursor-pointer border border-purple-200"
                >
                  <mb-icon name="message-circle"></mb-icon> Comment me présenter en 1 min ?
                </button>
                <button
                  type="button"
                  (click)="sendChatMessage('Quelles questions poser le 1er jour de mon immersion ?')"
                  class="px-2.5 py-1 rounded-full bg-[#F5F3FF] hover:bg-purple-100 text-[#6D28D9] text-[11px] font-bold transition cursor-pointer border border-purple-200"
                >
                  <mb-icon name="message-circle-question"></mb-icon> Quelles questions poser le 1er jour ?
                </button>
                <button
                  type="button"
                  (click)="sendChatMessage('Que faire si je suis timide au téléphone ?')"
                  class="px-2.5 py-1 rounded-full bg-[#F5F3FF] hover:bg-purple-100 text-[#6D28D9] text-[11px] font-bold transition cursor-pointer border border-purple-200"
                >
                  <mb-icon name="sprout"></mb-icon> Que faire si je suis timide ?
                </button>
              </div>
            </div>

            <!-- Barre de saisie -->
            <div class="flex items-center gap-2 pt-1">
              <input
                type="text"
                [(ngModel)]="chatInputText"
                (keydown.enter)="sendChatMessage()"
                placeholder="Pose ta question à ton Coach IA..."
                class="flex-1 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] px-4 py-3 text-xs sm:text-sm font-medium text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              />
              <button
                type="button"
                (click)="sendChatMessage()"
                [disabled]="!chatInputText.trim() || isCoachThinking"
                class="px-5 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Envoyer</span>
                <span><mb-icon name="plane"></mb-icon></span>
              </button>
            </div>
          </div>

          <!-- Colonne droite (4/12) : Rôle du Coach & Pistes d'échange -->
          <div class="lg:col-span-4 space-y-4">
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                <span class="text-base text-[#7C3AED]"><mb-icon name="handshake"></mb-icon></span>
                <span>Mon espace bienveillant</span>
              </div>
              <p class="text-xs text-[#42466B] leading-relaxed">
                Ici, il n'y a pas de mauvaise question ni de jugement. Ton Coach IA t'aide à préparer tes démarches pas à pas.
              </p>
              <div class="p-3 rounded-xl bg-purple-50 text-[11px] text-[#5B21B6] space-y-1 font-medium">
                <div>• Projet : <strong>{{ selectedCareer }}</strong></div>
                <div>• Entreprise cible : <strong>{{ companyName }}</strong></div>
                <div>• Statut : <strong>Préparation de contact</strong></div>
              </div>
            </div>

            <div class="rounded-[28px] bg-emerald-50 border border-emerald-200 p-5 space-y-3">
              <div class="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
                <span class="text-base"><mb-icon name="lightbulb"></mb-icon></span>
                <span>Idées de sujets à aborder</span>
              </div>
              <ul class="space-y-1.5 text-xs text-emerald-950 font-medium">
                <li>• Quelle tenue porter pour mon premier jour ?</li>
                <li>• Comment expliquer mes points forts du bilan ?</li>
                <li>• Comment remercier mon tuteur à la fin du stage ?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CoachIaComponent implements OnInit, OnDestroy {
  @Input() youngDisplayName: string = 'Emma D.';
  @Input() initialChatMessage: string = '';
  @Input() initialTab?: CoachActiveTab;
  @Output() saveImmersion = new EventEmitter<string>();
  @Output() openImmersion = new EventEmitter<string>();

  activeTab: CoachActiveTab = 'TRAINING'; // Par défaut sur l'entraînement
  trainingMode: TrainingMode = 'VOCAL';   // Par défaut sur le mode vocal pour la démo jury
  voiceState: VoiceEngineState = 'IDLE';

  scenariosList: TrainingScenario[] = COACH_TRAINING_SCENARIOS;
  activeScenario: TrainingScenario = COACH_TRAINING_SCENARIOS[0];
  currentStepIndex: number = 0;

  // Historique et dynamique de la simulation
  isTrainingCompleted: boolean = false;
  simulationTurns: SimulationTurn[] = [];
  dynamicFeedback: { wellDone: string; toImprove: string; nextChallenge: string } | null = null;

  // Mode texte
  userTextResponse: string = '';

  // Mode vocal (STT / Web Speech)
  transcribedLiveSpeech: string = '';
  private recognition: any = null;

  // Rédaction (Maquette 3) — Par défaut Technicien du son pour Emma Dubois (p. 12 du rapport Rdv 2187)
  selectedCareer: string = 'Technicien du son';
  companyName: string = 'Studio Riviera Acoustique & Son';
  periodName: string = 'Vacances de février';
  emailSubject: string = 'Demande de stage d\'observation — Technicien du son';
  messageStyle: 'SIMPLE' | 'FORMEL' = 'SIMPLE';
  generatedBodyText: string = '';
  copiedToast: boolean = false;

  // Onglet CALL_SCRIPT
  callObjective: 'DEMANDE' | 'CONFIRMATION' | 'RELANCE' = 'DEMANDE';
  callRecipient: 'ACCUEIL' | 'RESPONSABLE' = 'ACCUEIL';
  callPhoneNumber: string = '04 93 88 45 20';

  // Onglet FOLLOWUP
  followupDelay: '5J' | '7J' | '10J' = '7J';
  followupTone: 'COURTOIS' | 'ENTHOUSIASTE' = 'COURTOIS';
  followupSubject: string = '';
  followupBodyText: string = '';

  // Onglet CHAT
  chatInputText: string = '';
  isCoachThinking: boolean = false;
  chatMessages: Array<{ sender: 'user' | 'coach'; text: string; time: string }> = [
    {
      sender: 'coach',
      text: 'Bonjour Emma ! Je suis ton Coach IA d’orientation. Je connais ton profil créatif et ton projet pour découvrir le métier de Technicien du son (ou Peintre décorateur). Tu peux me poser toutes tes questions pour préparer ton immersion, contacter une entreprise ou surmonter tes doutes. De quoi souhaites-tu parler aujourd’hui ?',
      time: '10:00'
    }
  ];

  ollamaConnected: boolean = false;
  ollamaModel: string = 'qwen2.5:3b';

  async ngOnInit(): Promise<void> {
    if (this.initialTab) {
      this.activeTab = this.initialTab;
    }
    if (this.initialChatMessage) {
      this.activeTab = 'CHAT';
      this.chatInputText = this.initialChatMessage;
    }
    this.initImmersionDataLink();
    this.generateMessage();
    this.updateFollowupMessage();
    await this.checkOllama();
  }

  ngOnDestroy(): void {
    this.stopSpeech();
    this.stopVoiceRecognition();
  }

  // Changement rapide de métier pour la démo jury
  setCareer(careerTitle: string): void {
    if (careerTitle.toLowerCase().includes('son')) {
      this.selectedCareer = 'Technicien du son';
      this.companyName = 'Studio Riviera Acoustique & Son';
      this.callPhoneNumber = '04 93 88 45 20';
    } else {
      this.selectedCareer = 'Peintre décorateur';
      this.companyName = 'Atelier Décors & Patines Riviera';
      this.callPhoneNumber = '04 93 62 18 18';
    }
    this.generateMessage();
    this.updateFollowupMessage();
  }

  // Connexion automatique avec le projet Immersion Pro existant
  private initImmersionDataLink(): void {
    try {
      const stored = localStorage.getItem('monbilan_immersion_project_2187');
      if (stored) {
        const proj = JSON.parse(stored);
        if (proj.careerTitle) this.selectedCareer = proj.careerTitle;
        if (proj.selectedCompany?.name) this.companyName = proj.selectedCompany.name;
        if (proj.selectedCompany?.phone) this.callPhoneNumber = proj.selectedCompany.phone;
      } else {
        // Métier par défaut : Technicien du son (Zone 3, p. 12 du rapport Rdv 2187 d'Emma Dubois)
        this.selectedCareer = 'Technicien du son';
        this.companyName = 'Studio Riviera Acoustique & Son';
        this.callPhoneNumber = '04 93 88 45 20';
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
    window.scrollTo({ top: 120, behavior: 'smooth' });
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
    this.isTrainingCompleted = false;
    this.simulationTurns = [];
    this.userTextResponse = '';
    this.transcribedLiveSpeech = '';
    this.stopSpeech();
    this.stopVoiceRecognition();
    if (this.trainingMode === 'VOCAL') {
      this.speakCoachQuestion(this.getCurrentCoachQuestion());
    }
  }

  /** Icône <mb-icon> illustrant chaque situation d'entraînement. */
  getScenarioIcon(id: TrainingScenarioId): string {
    switch (id) {
      case 'SCENARIO_CALL': return 'phone';
      case 'SCENARIO_INTERVIEW': return 'handshake';
      case 'SCENARIO_QUESTIONS': return 'message-circle-question';
      case 'SCENARIO_PRESENTATION': return 'presentation';
      default: return 'message-circle';
    }
  }

  getCurrentCoachQuestion(): string {
    const step = this.activeScenario.steps[this.currentStepIndex];
    return step ? step.coachQuestion : this.activeScenario.steps[0].coachQuestion;
  }

  sendUserResponse(): void {
    if (!this.userTextResponse.trim()) return;
    const txt = this.userTextResponse.trim();
    this.userTextResponse = '';
    this.processUserVocalResponse(txt);
  }

  // --------------------------------------------------------------------------
  // Mode Vocal : STT (Speech to Text) & TTS (Text to Speech) & Écoute active
  // --------------------------------------------------------------------------
  toggleVoiceListening(): void {
    if (this.voiceState === 'LISTENING') {
      this.validateVocalStep();
    } else if (this.voiceState === 'IDLE' || this.voiceState === 'PAUSED') {
      this.startVoiceRecognition();
    }
  }

  validateVocalStep(): void {
    this.stopVoiceRecognition();
    const spoken = (this.transcribedLiveSpeech || '').trim();
    const finalText = spoken || `Bonjour, je m'appelle ${this.youngDisplayName}. Je construis mon projet avec le Centre des Possibles et je souhaite découvrir le métier de ${this.selectedCareer}.`;
    this.processUserVocalResponse(finalText);
  }

  // Sécurité démo jury : permet de simuler une réponse orale naturelle en 1 clic
  simulateLiveResponseForDemo(): void {
    this.stopSpeech();
    this.stopVoiceRecognition();
    
    let demoText = '';
    switch (this.currentStepIndex) {
      case 0:
        demoText = `Bonjour, je m'appelle ${this.youngDisplayName}. Je vous contacte dans le cadre de mon orientation avec le Centre des Possibles à Nice pour solliciter un stage d'observation en ${this.selectedCareer}.`;
        break;
      case 1:
        demoText = `J'aimerais beaucoup effectuer une immersion de 3 jours pendant les ${this.periodName.toLowerCase()}. Je suis passionnée par l'acoustique, la régie et le travail sur console son.`;
        break;
      case 2:
        demoText = `Oui tout à fait, ma convention de stage est entièrement prise en charge et délivrée par le Centre des Possibles et ma Mission Locale.`;
        break;
      default:
        demoText = `C'est noté, vous pouvez me joindre au 06 12 34 56 78 ou par email. Je vous remercie beaucoup pour votre accueil et votre disponibilité !`;
        break;
    }
    
    this.transcribedLiveSpeech = demoText;
    this.processUserVocalResponse(demoText);
  }

  private startVoiceRecognition(): void {
    this.stopSpeech();
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback démo si le navigateur n'a pas activé les API Speech
      this.simulateLiveResponseForDemo();
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
      this.simulateLiveResponseForDemo();
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
    if (this.voiceState === 'LISTENING') {
      this.voiceState = 'IDLE';
    }
  }

  async processUserVocalResponse(userText: string): Promise<void> {
    this.voiceState = 'THINKING';
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // 1. Écoute active bienveillante et feedback adapté
    const feedback = this.generateActiveListeningFeedback(userText, this.currentStepIndex);
    const isLastStep = this.currentStepIndex >= this.activeScenario.steps.length - 1;

    let nextCoachSpeech = '';
    let coachReplyText = '';

    if (!isLastStep) {
      const nextStep = this.activeScenario.steps[this.currentStepIndex + 1];
      coachReplyText = nextStep.coachQuestion;
      nextCoachSpeech = `${feedback} ${nextStep.coachQuestion}`;
    } else {
      coachReplyText = `Parfait Emma ! Tu as validé toutes les étapes avec clarté. Ton projet est prêt pour le terrain.`;
      nextCoachSpeech = `${feedback} Bravo Emma ! Tu as complété avec succès toutes les étapes de cette simulation. Tes formulations sont claires, polies et professionnelles. Tu es fin prête pour ton immersion !`;
    }

    // 2. Enregistrement dans l'historique visuel
    this.simulationTurns.push({
      stepIndex: this.currentStepIndex,
      userText,
      feedback,
      coachReply: coachReplyText,
      timestamp: timeStr
    });

    // 3. Avancement d'étape
    if (!isLastStep) {
      this.currentStepIndex++;
    } else {
      this.isTrainingCompleted = true;
      this.computeDynamicFeedback();
    }

    // 4. Prononciation par le Coach (TTS) avec micro verrouillé
    setTimeout(() => {
      this.speakCoachQuestion(nextCoachSpeech);
      this.transcribedLiveSpeech = '';
    }, 400);
  }

  generateActiveListeningFeedback(userText: string, stepIndex: number): string {
    const text = (userText || '').toLowerCase();
    if (text.includes('emma') || text.includes('bonjour') || text.includes('contacte')) {
      return `Superbe entrée en matière ! Ta salutation est polie et ta présentation est très claire.`;
    }
    if (text.includes('technicien') || text.includes('son') || text.includes('peintre') || text.includes('passion') || text.includes('découvrir') || text.includes('métier')) {
      return `Très bien formulé ! Expliquer précisément ton attrait pour ce métier donne tout de suite confiance à l'entreprise.`;
    }
    if (text.includes('convention') || text.includes('stage') || text.includes('possibles') || text.includes('organisme') || text.includes('mission')) {
      return `Exactement, mentionner ta convention rassure l'entreprise sur le cadre officiel de l'immersion.`;
    }
    if (text.includes('merci') || text.includes('joindre') || text.includes('coordonnées') || text.includes('bonne journée')) {
      return `Excellente conclusion, très courtoise et engageante !`;
    }
    switch (stepIndex) {
      case 0: return `Très bien, ton ton est posé et naturel.`;
      case 1: return `C'est noté, ta motivation ressort avec authenticité.`;
      case 2: return `Précision parfaite pour rassurer ton interlocuteur.`;
      default: return `Bien répondu, les informations essentielles sont transmises.`;
    }
  }

  computeDynamicFeedback(): void {
    this.dynamicFeedback = {
      wellDone: `Excellente clarté d'élocution. Tu as su présenter ton parcours et ton projet en ${this.selectedCareer} avec politesse et assurance.`,
      toImprove: `Garde toujours à portée de main les dates précises de tes disponibilités et ta convention délivrée par le Centre des Possibles.`,
      nextChallenge: `Prends contact directement avec l'entreprise via l'Immersion Pro ou le script téléphonique !`
    };
  }

  finishTrainingNow(): void {
    this.stopSpeech();
    this.stopVoiceRecognition();
    this.isTrainingCompleted = true;
    this.computeDynamicFeedback();
    const finalSpeech = `Bravo ${this.youngDisplayName} ! Tu as validé cette simulation. Tes formulations sont prêtes pour passer à l'action sur le terrain.`;
    this.speakCoachQuestion(finalSpeech);
  }

  resetTraining(): void {
    this.stopSpeech();
    this.stopVoiceRecognition();
    this.currentStepIndex = 0;
    this.isTrainingCompleted = false;
    this.simulationTurns = [];
    this.transcribedLiveSpeech = '';
    this.userTextResponse = '';
    this.voiceState = 'IDLE';
    this.speakCoachQuestion(this.getCurrentCoachQuestion());
  }

  goToImmersion(): void {
    this.stopSpeech();
    this.stopVoiceRecognition();
    this.openImmersion.emit(this.selectedCareer);
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
      case 'LISTENING': return 'Je t\'écoute... Parle naturellement !';
      case 'SPEAKING': return 'Le coach te pose la question...';
      case 'PAUSED': return 'Entraînement en pause.';
      default: return 'Prêt(e) ? Parle quand tu es prêt(e).';
    }
  }

  // --------------------------------------------------------------------------
  // Onglet 1 : Mode Rédaction (Maquette 3)
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
      saveDraftItem({
        id: 'coach-email-' + Date.now(),
        type: 'EMAIL',
        title: this.emailSubject || 'Email pour ' + this.selectedCareer,
        careerTitle: this.selectedCareer,
        recipient: this.companyName || 'Entreprise',
        content: this.generatedBodyText,
        date: new Date().toLocaleDateString('fr-FR')
      });
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
    saveDraftItem({
      id: 'coach-immersion-draft-' + Date.now(),
      type: 'EMAIL',
      title: 'Demande immersion — ' + this.selectedCareer,
      careerTitle: this.selectedCareer,
      recipient: this.companyName || 'Entreprise',
      content: this.generatedBodyText,
      date: new Date().toLocaleDateString('fr-FR')
    });
    alert('Action enregistrée dans ton projet d’immersion ! Tu peux la retrouver dans « Mon parcours ».');
  }

  // --------------------------------------------------------------------------
  // Onglet 2 : Préparer un appel
  // --------------------------------------------------------------------------
  copyCallScript(): void {
    const script = `SCRIPT D'APPEL TÉLÉPHONIQUE — ${this.selectedCareer.toUpperCase()}
Entreprise : ${this.companyName} (${this.callPhoneNumber})
Objectif : ${this.callObjective}

1. SALUTATION & PRÉSENTATION :
« Bonjour, je m'appelle ${this.youngDisplayName}. Je vous contacte dans le cadre de la construction de mon projet d'orientation avec le Centre des Possibles à Nice. »

2. RAISON DE L'APPEL :
« J'aimerais beaucoup découvrir le métier de ${this.selectedCareer} sur le terrain. Est-ce que votre entreprise accueillerait un jeune pour un stage d'observation conventionné de 3 jours pendant les ${this.periodName.toLowerCase()} ? »

3. SI CONTACT AVEC L'ACCUEIL :
« Pourriez-vous me mettre en relation avec la personne qui gère les ateliers ou les demandes d'immersion ? »

4. RÉPONSES AUX SITUATIONS COURANTES :
• Si on demande un email : « Très bien, à quelle adresse puis-je l'envoyer et à quelle attention ? »
• Si le responsable est absent : « Quel serait le meilleur moment pour rappeler ? »
• Si refus poli : « Je comprends tout à fait, merci pour votre temps et bonne continuation. »`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(script);
      this.copiedToast = true;
      saveDraftItem({
        id: 'coach-script-' + Date.now(),
        type: 'CALL_SCRIPT',
        title: 'Script appel — ' + this.selectedCareer,
        careerTitle: this.selectedCareer,
        recipient: this.companyName || 'Entreprise 06',
        content: script,
        date: new Date().toLocaleDateString('fr-FR')
      });
      setTimeout(() => (this.copiedToast = false), 2000);
    }
  }

  // --------------------------------------------------------------------------
  // Onglet 3 : Préparer une relance
  // --------------------------------------------------------------------------
  updateFollowupMessage(): void {
    this.followupSubject = `[Relance] Demande de stage d'observation — ${this.selectedCareer}`;
    const delayText = this.followupDelay === '5J' ? 'il y a 5 jours' : this.followupDelay === '7J' ? 'la semaine passée' : 'il y a une dizaine de jours';

    if (this.followupTone === 'ENTHOUSIASTE') {
      this.followupBodyText = `Bonjour,\n\nJe me permets de revenir vers vous avec enthousiasme concernant mon message envoyé ${delayText} au sujet d'un stage d'observation en ${this.selectedCareer.toLowerCase()} au sein de votre établissement, ${this.companyName}.\n\nJe suis particulièrement motivée par vos réalisations et j'aimerais sincèrement avoir l'opportunité de passer 3 jours d'immersion conventionnée à vos côtés.\n\nPensez-vous qu'une période d'accueil soit envisageable prochainement ? Je me tiens à votre entière disposition pour échanger par téléphone ou vous transmettre ma convention.\n\nJe vous remercie par avance et vous souhaite une très belle journée.\n\nBien cordialement,\n${this.youngDisplayName}`;
    } else {
      this.followupBodyText = `Bonjour,\n\nJe me permets de faire suite à mon précédent message envoyé ${delayText} concernant une demande de stage d'observation conventionné de 3 jours dans le métier de ${this.selectedCareer.toLowerCase()}.\n\nJe souhaitais m'assurer que vous aviez bien reçu ma demande et savoir s'il vous était possible d'accueillir une stagiaire pendant les ${this.periodName.toLowerCase()}.\n\nJe reste à votre entière disposition pour tout renseignement complémentaire.\n\nEn vous remerciant pour votre attention,\n\nCordialement,\n${this.youngDisplayName}`;
    }
  }

  copyFollowupMessage(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.followupBodyText);
      this.copiedToast = true;
      saveDraftItem({
        id: 'coach-relance-' + Date.now(),
        type: 'EMAIL',
        title: this.followupSubject,
        careerTitle: this.selectedCareer,
        recipient: this.companyName || 'Entreprise 06',
        content: this.followupBodyText,
        date: new Date().toLocaleDateString('fr-FR')
      });
      setTimeout(() => (this.copiedToast = false), 2000);
    }
  }

  downloadFollowupPdf(): void {
    const text = `OBJET : ${this.followupSubject}\n\n${this.followupBodyText}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relance_${this.selectedCareer.replace(' ', '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // --------------------------------------------------------------------------
  // Onglet 5 : Chat avec le Coach IA
  // --------------------------------------------------------------------------
  async sendChatMessage(preset?: string): Promise<void> {
    const query = preset || this.chatInputText.trim();
    if (!query) return;
    this.chatInputText = '';

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    this.chatMessages.push({
      sender: 'user',
      text: query,
      time: timeStr
    });

    this.isCoachThinking = true;

    // Si Ollama est disponible
    if (this.ollamaConnected) {
      try {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.ollamaModel,
            prompt: `Tu es le Coach IA d'orientation bienveillant de MonBilan+ pour Emma D. Son projet est de faire un stage d'observation en ${this.selectedCareer} chez ${this.companyName}. Réponds en 2 à 4 phrases claires, simples, positives et très pratiques, sans jargon technique ni terme complexe. Question : "${query}"`,
            stream: false
          })
        });
        if (response.ok) {
          const data = await response.json();
          this.chatMessages.push({
            sender: 'coach',
            text: data.response?.trim() || this.getSmartFallbackAnswer(query),
            time: timeStr
          });
          this.isCoachThinking = false;
          return;
        }
      } catch {
        // En cas d'échec réseau Ollama, fallback gracieux
      }
    }

    // Moteur autonome de réponse sans hallucination
    setTimeout(() => {
      this.chatMessages.push({
        sender: 'coach',
        text: this.getSmartFallbackAnswer(query),
        time: timeStr
      });
      this.isCoachThinking = false;
    }, 450);
  }

  private getSmartFallbackAnswer(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('présenter') || q.includes('1 minute') || q.includes('qui suis-je')) {
      return `Pour te présenter en 1 minute : commence par ton prénom, explique que tu construis ton projet d'orientation avec le Centre des Possibles, et dis précisément ce qui t'attire dans ce métier (la créativité, le travail des matières et le rendu visuel). Reste souriante et naturelle, c'est ce qui compte le plus !`;
    }
    if (q.includes('timide') || q.includes('peur') || q.includes('stress')) {
      return `C'est tout à fait normal de ressentir un peu d'appréhension ! Dis-toi que les professionnels aiment voir des jeunes qui osent faire la démarche. Mon astuce : écris tes 2 phrases clés sur un papier avant d'appeler, et respire profondément 3 fois. Tu en es tout à fait capable !`;
    }
    if (q.includes('question') || q.includes('1er jour') || q.includes('poser')) {
      return `Le premier jour, pose des questions simples pour observer : « Quels outils ou techniques utilisez-vous le plus ? », « Comment s'organise une journée type sur un chantier ? », « Qu'est-ce qui vous plaît le plus dans votre métier ? ». N'hésite pas à avoir un carnet de notes avec toi !`;
    }
    if (q.includes('tenue') || q.includes('habiller') || q.includes('porter')) {
      return `Pour une immersion en peinture décorative, prévois une tenue confortable dans laquelle tu n'as pas peur d'avoir quelques taches, des chaussures fermées adaptées (type baskets solides ou chaussures de sécurité si l'entreprise le demande), et un carnet avec un stylo.`;
    }
    if (q.includes('relance') || q.includes('pas de réponse') || q.includes('répond pas')) {
      return `Si une entreprise ne te répond pas après 7 jours, c'est très souvent par manque de temps ! Utilise notre modèle de relance polie dans l'onglet « Préparer une relance » : cela montre ta ténacité et ton sérieux sans insister lourdement.`;
    }
    return `C'est une excellente question pour ton projet en ${this.selectedCareer} ! Ton immersion de 3 jours est faite pour te permettre de regarder, poser des questions et tester ton envie sans aucune pression de résultat. Tu avances très bien dans ta préparation !`;
  }
}
