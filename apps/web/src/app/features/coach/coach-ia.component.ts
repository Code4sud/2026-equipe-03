// ============================================================================
// MonBilan+ — Composant « Mon Coach IA » (Atelier de communication)
// Intégration en direct avec Ollama (Qwen 2.5 / Mistral) & Mode Autonome
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';

export type CoachToolKind = 'EMAIL' | 'CALL_SCRIPT' | 'FOLLOWUP' | 'TRAINING';
export type MessageStyle = 'SIMPLE_NATUREL' | 'FORMEL';

@Component({
  selector: 'app-coach-ia',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- ================================================================== -->
      <!-- BANNIÈRE HERO MON COACH IA                                         -->
      <!-- ================================================================== -->
      <div class="rounded-[28px] bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9333EA] text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div class="relative z-10 flex items-start gap-4 sm:gap-5">
          <!-- Robot 3D -->
          <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm text-3xl sm:text-4xl">
            <mb-icon name="bot"></mb-icon>
          </div>
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#E9D5FF] border border-white/20">
              <span><mb-icon name="sparkles"></mb-icon> Assistant pédagogique IA</span>
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Mon Coach IA
            </h2>
            <p class="text-xs sm:text-sm text-[#E7E8FB] max-w-2xl leading-relaxed">
              Ton assistant pour trouver les bons mots, préparer tes contacts et communiquer avec les professionnels.
            </p>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- BANDEAU DE STATUT DU MOTEUR IA (OLLAMA LOCAL VS AUTONOME)           -->
      <!-- ================================================================== -->
      <div
        class="rounded-2xl p-3.5 px-4.5 flex flex-wrap items-center justify-between gap-2.5 text-xs font-bold border transition-all duration-200"
        [ngClass]="ollamaConnected
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800 shadow-2xs'
          : 'bg-[#F6F3FF] border-[#E9D5FF] text-[#6D28D9]'"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <span
            class="h-2.5 w-2.5 rounded-full shrink-0"
            [ngClass]="ollamaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-[#7C3AED]'"
          ></span>
          <span class="truncate">
            {{ ollamaConnected
              ? 'Moteur IA actif : Ollama local (' + ollamaModel + ') connecté sur votre machine'
              : 'Moteur IA : Assistant embarqué MonBilan+ (Mode autonome Zéro-Hallucination)' }}
          </span>
        </div>

        <button
          type="button"
          (click)="checkOllama()"
          class="text-[11px] font-extrabold hover:underline cursor-pointer flex items-center gap-1 shrink-0"
          title="Vérifier la connexion avec Ollama"
        >
          <span>{{ ollamaConnected ? '✓ Vérifié' : '🔄 Vérifier Ollama' }}</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- 4 CARTES D'OUTILS SÉLECTIONNABLES                                   -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <!-- 1. Rédiger un email -->
        <button
          type="button"
          (click)="selectTool('EMAIL')"
          [class]="selectedTool === 'EMAIL'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-xs'"
          class="p-4 rounded-2xl text-left transition flex items-start gap-3.5 cursor-pointer"
        >
          <div
            [class]="selectedTool === 'EMAIL' ? 'bg-[#7C3AED] text-white' : 'bg-[#F3E8FF] text-[#7C3AED]'"
            class="h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 transition"
          >
            <mb-icon name="mail"></mb-icon>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">Rédiger un email</h4>
            <p class="text-[11px] text-[#64748B] mt-0.5 leading-snug">
              Un message professionnel, poli et personnalisé.
            </p>
          </div>
        </button>

        <!-- 2. Préparer un appel -->
        <button
          type="button"
          (click)="selectTool('CALL_SCRIPT')"
          [class]="selectedTool === 'CALL_SCRIPT'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-xs'"
          class="p-4 rounded-2xl text-left transition flex items-start gap-3.5 cursor-pointer"
        >
          <div
            [class]="selectedTool === 'CALL_SCRIPT' ? 'bg-[#7C3AED] text-white' : 'bg-[#EFF6FF] text-blue-600'"
            class="h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 transition"
          >
            <mb-icon name="phone"></mb-icon>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">Préparer un appel</h4>
            <p class="text-[11px] text-[#64748B] mt-0.5 leading-snug">
              Un script clair et naturel pour contacter une entreprise.
            </p>
          </div>
        </button>

        <!-- 3. Préparer une relance -->
        <button
          type="button"
          (click)="selectTool('FOLLOWUP')"
          [class]="selectedTool === 'FOLLOWUP'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-xs'"
          class="p-4 rounded-2xl text-left transition flex items-start gap-3.5 cursor-pointer"
        >
          <div
            [class]="selectedTool === 'FOLLOWUP' ? 'bg-[#7C3AED] text-white' : 'bg-[#FEF3C7] text-amber-700'"
            class="h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 transition"
          >
            <mb-icon name="message-circle"></mb-icon>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">Préparer une relance</h4>
            <p class="text-[11px] text-[#64748B] mt-0.5 leading-snug">
              Relancer sans insister si tu n’as pas encore de réponse.
            </p>
          </div>
        </button>

        <!-- 4. Simuler un entretien -->
        <button
          type="button"
          (click)="selectTool('TRAINING')"
          [class]="selectedTool === 'TRAINING'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-xs'"
          class="p-4 rounded-2xl text-left transition flex items-start gap-3.5 cursor-pointer"
        >
          <div
            [class]="selectedTool === 'TRAINING' ? 'bg-[#7C3AED] text-white' : 'bg-[#ECFDF5] text-emerald-700'"
            class="h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 transition"
          >
            <mb-icon name="mic"></mb-icon>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">S'entraîner à l'oral</h4>
            <p class="text-[11px] text-[#64748B] mt-0.5 leading-snug">
              S'exercer aux questions types avec ton coach.
            </p>
          </div>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- GRILLE PRINCIPALE À 3 COLONNES                                     -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <!-- COLONNE GAUCHE (4/12) : FORMULAIRE DE PARAMÉTRAGE -->
        <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
            <h3 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
              <span class="text-[#7C3AED]"><mb-icon name="mail"></mb-icon></span>
              {{ selectedTool === 'EMAIL' ? 'Créer mon email de demande' : selectedTool === 'CALL_SCRIPT' ? 'Préparer mon appel' : selectedTool === 'FOLLOWUP' ? 'Préparer ma relance' : 'Paramétrer ma simulation' }}
            </h3>
          </div>

          <div class="space-y-4 text-xs">
            <!-- Métier -->
            <div class="space-y-1.5">
              <label class="font-extrabold text-[#0F1035] flex items-center justify-between">
                <span>Métier à découvrir <span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-sm text-[#7C3AED]"><mb-icon name="hammer"></mb-icon></span>
                <select
                  [(ngModel)]="selectedCareer"
                  (ngModelChange)="onParamChange()"
                  class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-xs font-bold text-[#0F1035] outline-none cursor-pointer"
                >
                  <option value="Peintre décorateur">Peintre décorateur</option>
                  <option value="Technicien du son">Technicien du son</option>
                  <option value="Cuisinier en restauration rapide">Cuisinier en restauration rapide</option>
                  <option value="Barista">Barista</option>
                  <option value="Guide touristique">Guide touristique</option>
                  <option value="Graphiste">Graphiste</option>
                  <option value="Photographe">Photographe</option>
                  <option value="Animateur radio">Animateur radio</option>
                </select>
              </div>
            </div>

            <!-- Entreprise -->
            <div class="space-y-1.5">
              <label class="font-extrabold text-[#0F1035]">
                Entreprise <span class="text-[#8E92BC] font-normal">(facultatif)</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-sm text-[#7C3AED]"><mb-icon name="building-2"></mb-icon></span>
                <input
                  type="text"
                  [(ngModel)]="companyName"
                  (ngModelChange)="onParamChange()"
                  placeholder="Ex : Décor & Couleurs"
                  class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-xs font-bold text-[#0F1035] outline-none"
                />
              </div>
            </div>

            <!-- Période -->
            <div class="space-y-1.5">
              <label class="font-extrabold text-[#0F1035]">
                Période souhaitée <span class="text-[#8E92BC] font-normal">(facultatif)</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-sm text-[#7C3AED]"><mb-icon name="calendar"></mb-icon></span>
                <input
                  type="text"
                  [(ngModel)]="periodName"
                  (ngModelChange)="onParamChange()"
                  placeholder="Ex : Pendant les vacances de février"
                  class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-xs font-bold text-[#0F1035] outline-none"
                />
              </div>
            </div>

            <!-- Style du message -->
            <div class="space-y-2 pt-2">
              <label class="font-extrabold text-[#0F1035] block">Style du message</label>
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#D8DCF0] hover:border-[#7C3AED] cursor-pointer transition">
                <input
                  type="radio"
                  name="messageStyle"
                  [(ngModel)]="messageStyle"
                  (ngModelChange)="onParamChange()"
                  value="SIMPLE_NATUREL"
                  class="text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <div class="flex items-center justify-between flex-1">
                  <span class="font-bold text-[#0F1035]">Simple et naturel</span>
                  <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">Recommandé</span>
                </div>
              </label>

              <label class="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#D8DCF0] hover:border-[#7C3AED] cursor-pointer transition">
                <input
                  type="radio"
                  name="messageStyle"
                  [(ngModel)]="messageStyle"
                  (ngModelChange)="onParamChange()"
                  value="FORMEL"
                  class="text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span class="font-bold text-[#0F1035]">Plus formel (entreprise, service RH...)</span>
              </label>
            </div>

            <!-- Bouton Générer avec l'IA -->
            <button
              type="button"
              (click)="generateMessageWithOllama()"
              [disabled]="isGenerating"
              class="w-full rounded-2xl bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] text-white font-extrabold text-xs sm:text-sm py-3 px-4 shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isGenerating"><mb-icon name="sparkles"></mb-icon></span>
              <span *ngIf="isGenerating" class="inline-block animate-spin">⏳</span>
              <span>{{ isGenerating ? 'Génération IA en cours...' : (ollamaConnected ? 'Générer avec Ollama IA' : 'Générer mon message') }}</span>
            </button>
          </div>
        </div>

        <!-- COLONNE CENTRALE (5/12) : PROPOSITION DE MESSAGE -->
        <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
              <h3 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                <span class="text-[#7C3AED]"><mb-icon name="sparkles"></mb-icon></span>
                <span>Proposition de message</span>
              </h3>
              <span
                class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition"
                [ngClass]="ollamaConnected && generatedBy.includes('Ollama')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200'"
              >
                {{ generatedBy }}
              </span>
            </div>

            <!-- Carte du message -->
            <div class="rounded-2xl bg-[#FAFAFC] border border-[#E4E0F5] p-4 text-xs sm:text-[13px] text-[#31355B] space-y-3 relative overflow-hidden leading-relaxed">
              <div class="font-black text-[#0F1035]">
                Objet : {{ getMessageSubject() }}
              </div>

              <!-- Écran de chargement pendant génération IA -->
              <div *ngIf="isGenerating" class="py-10 flex flex-col items-center justify-center gap-3 text-center animate-fadeIn">
                <div class="h-9 w-9 rounded-full border-3 border-[#7C3AED] border-t-transparent animate-spin"></div>
                <div>
                  <p class="font-extrabold text-[#7C3AED] text-xs">Ollama ({{ ollamaModel }}) rédige votre texte...</p>
                  <p class="text-[11px] text-gray-500 mt-0.5">Inférence locale, souveraine et 100% confidentielle</p>
                </div>
              </div>

              <!-- Texte généré en lecture -->
              <div *ngIf="!isEditingMessage && !isGenerating" class="space-y-2 whitespace-pre-line text-[#1E1B4B]">
                {{ editableMessageText }}
              </div>

              <!-- Zone d'édition si l'utilisateur clique sur Modifier -->
              <div *ngIf="isEditingMessage" class="space-y-2">
                <textarea
                  [(ngModel)]="editableMessageText"
                  rows="8"
                  class="w-full p-2.5 rounded-xl border border-[#7C3AED] text-xs font-medium text-[#0F1035] outline-none"
                ></textarea>
                <button
                  type="button"
                  (click)="saveEditedMessage()"
                  class="rounded-lg bg-[#7C3AED] text-white px-3 py-1 text-xs font-bold cursor-pointer"
                >
                  Valider les modifications
                </button>
              </div>

              <!-- Illustration enveloppe -->
              <div class="flex justify-end pt-2">
                <div class="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl shadow-xs">
                  <mb-icon name="mail"></mb-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Barre d'actions -->
          <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-[#F0EDFA]">
            <button
              type="button"
              (click)="isEditingMessage = !isEditingMessage"
              class="rounded-xl border border-[#D8DCF0] hover:border-[#7C3AED] px-3 py-1.5 text-xs font-extrabold text-[#0F1035] transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span><mb-icon name="pencil"></mb-icon></span>
              <span>Modifier</span>
            </button>

            <button
              type="button"
              (click)="copyToClipboard()"
              class="rounded-xl border border-[#D8DCF0] hover:border-[#7C3AED] px-3 py-1.5 text-xs font-extrabold text-[#0F1035] transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span><mb-icon name="clipboard-list"></mb-icon></span>
              <span>{{ copyToast ? 'Copié !' : 'Copier le texte' }}</span>
            </button>

            <button
              type="button"
              (click)="downloadPdf()"
              class="rounded-xl border border-[#D8DCF0] hover:border-[#7C3AED] px-3 py-1.5 text-xs font-extrabold text-[#0F1035] transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span><mb-icon name="download"></mb-icon></span>
              <span>Télécharger (PDF)</span>
            </button>

            <button
              type="button"
              (click)="saveToImmersion()"
              class="rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6D28D9] font-extrabold text-xs px-3 py-1.5 transition ml-auto flex items-center gap-1.5 cursor-pointer"
            >
              <span><mb-icon name="briefcase"></mb-icon></span>
              <span>Lier à mon immersion</span>
            </button>
          </div>
        </div>

        <!-- COLONNE DROITE (3/12) : CONSEILS ET RASSURANCE -->
        <div class="lg:col-span-3 space-y-4">
          <!-- 💡 Conseils du coach -->
          <div class="rounded-[28px] bg-[#F8F7FF] border border-[#E4E0F5] p-5 shadow-sm space-y-3">
            <h4 class="text-sm font-black text-[#0F1035] flex items-center gap-2">
              <span class="text-amber-500"><mb-icon name="lightbulb"></mb-icon></span>
              <span>Conseils du coach</span>
            </h4>
            <ul class="space-y-2 text-xs font-bold text-[#31355B]">
              <li class="flex items-center gap-2 text-emerald-700">
                <span class="text-emerald-500">✓</span>
                <span>Sois clair(e) sur ton objectif.</span>
              </li>
              <li class="flex items-center gap-2 text-emerald-700">
                <span class="text-emerald-500">✓</span>
                <span>Reste poli(e) et courtois(e).</span>
              </li>
              <li class="flex items-center gap-2 text-emerald-700">
                <span class="text-emerald-500">✓</span>
                <span>Indique une période réaliste.</span>
              </li>
              <li class="flex items-center gap-2 text-emerald-700">
                <span class="text-emerald-500">✓</span>
                <span>Propose un échange si besoin.</span>
              </li>
            </ul>
          </div>

          <!-- Et ensuite ? -->
          <div class="rounded-[28px] bg-[#F8F7FF] border border-[#E4E0F5] p-5 shadow-sm space-y-3">
            <h4 class="text-sm font-black text-[#0F1035] flex items-center gap-2">
              <span class="text-[#7C3AED]"><mb-icon name="target"></mb-icon></span>
              <span>Et ensuite ?</span>
            </h4>
            <p class="text-[11px] text-[#64748B]">Tu peux :</p>
            <ul class="space-y-2 text-xs font-medium text-[#31355B]">
              <li class="flex items-start gap-1.5">
                <span class="text-[#7C3AED] font-bold">→</span>
                <span>Envoyer ton email depuis ta messagerie.</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-[#7C3AED] font-bold">→</span>
                <span>Préparer un appel si tu préfères un contact direct.</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-[#7C3AED] font-bold">→</span>
                <span>Enregistrer ce message dans ton projet d'immersion.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CoachIaComponent implements OnInit {
  @Input() youngDisplayName: string = 'Emma D.';
  @Output() saveImmersion = new EventEmitter<string>();

  selectedTool: CoachToolKind = 'EMAIL';
  selectedCareer: string = 'Peintre décorateur';
  companyName: string = 'Décor & Couleurs';
  periodName: string = 'Pendant les vacances de février';
  messageStyle: MessageStyle = 'SIMPLE_NATUREL';

  isEditingMessage: boolean = false;
  editableMessageText: string = '';
  copyToast: boolean = false;
  isGenerating: boolean = false;

  ollamaConnected: boolean = false;
  ollamaModel: string = 'qwen2.5:3b';
  generatedBy: string = 'Généré par MonBilan+';

  async ngOnInit(): Promise<void> {
    this.editableMessageText = this.buildCurrentMessage();
    await this.checkOllama();
  }

  async checkOllama(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('http://localhost:11434/api/tags', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        this.ollamaConnected = true;
        if (data.models && data.models.length > 0) {
          const foundQwen = data.models.find((m: any) => m.name && m.name.toLowerCase().includes('qwen'));
          if (foundQwen) {
            this.ollamaModel = foundQwen.name;
          } else {
            this.ollamaModel = data.models[0].name;
          }
        }
      } else {
        this.ollamaConnected = false;
      }
    } catch {
      this.ollamaConnected = false;
    }
  }

  selectTool(tool: CoachToolKind): void {
    this.selectedTool = tool;
    this.generateMessage();
  }

  onParamChange(): void {
    // Ne régénère pas automatiquement pour laisser l'utilisateur cliquer
  }

  generateMessage(): void {
    this.editableMessageText = this.buildCurrentMessage();
    this.isEditingMessage = false;
    this.generatedBy = 'Généré par MonBilan+';
  }

  getMessageSubject(): string {
    switch (this.selectedTool) {
      case 'EMAIL':
        return `Demande de stage d'observation – ${this.selectedCareer}`;
      case 'CALL_SCRIPT':
        return `Guide d'appel – Contact avec ${this.companyName || 'l\'entreprise'}`;
      case 'FOLLOWUP':
        return `Relance cordiale – Candidature stage ${this.selectedCareer}`;
      case 'TRAINING':
        return `Simulation d'entretien – Métier : ${this.selectedCareer}`;
    }
  }

  async generateMessageWithOllama(): Promise<void> {
    this.isGenerating = true;
    this.isEditingMessage = false;

    let formatDesc = 'un email de demande de stage d’observation';
    if (this.selectedTool === 'CALL_SCRIPT') {
      formatDesc = 'un script d’appel téléphonique naturel pour contacter une entreprise au téléphone';
    } else if (this.selectedTool === 'FOLLOWUP') {
      formatDesc = 'un court message de relance poli et respectueux';
    } else if (this.selectedTool === 'TRAINING') {
      formatDesc = 'les 3 questions clés qu’un professionnel risque de poser lors d’un entretien et comment y répondre simplement';
    }

    const styleDesc = this.messageStyle === 'FORMEL'
      ? 'professionnel, soigné et formel (adapté à un service RH)'
      : 'simple, naturel, poli et chaleureux (adapté à un artisan ou une PME)';

    const prompt = `Tu es le Coach IA de MonBilan+, une plateforme bienveillante d'aide à l'orientation pour les jeunes.
Rédige ${formatDesc} pour une jeune de 16 ans nommée ${this.youngDisplayName}.
Métier souhaité : "${this.selectedCareer}".
Entreprise ciblée : "${this.companyName || 'votre établissement'}".
Période souhaitée : "${this.periodName || 'prochainement'}".
Style attendu : ${styleDesc}.
Règles strictes :
- Rédige UNIQUEMENT le texte final prêt à être envoyé ou dit (pas de bavardage d'introduction type "Voici votre email:").
- Pas de jargon compliqué, sois clair, poli et encourageant.
- Termine par une formule de politesse adaptée et la signature "${this.youngDisplayName}".`;

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt,
          stream: false,
          options: {
            temperature: 0.3
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.response && data.response.trim()) {
          this.editableMessageText = data.response.trim();
          this.generatedBy = `Généré en direct par Ollama (${this.ollamaModel})`;
          this.ollamaConnected = true;
          this.isGenerating = false;
          return;
        }
      }
    } catch {
      // Fallback automatique transparent
    }

    // Fallback déterministe qualitatif si Ollama n'a pas répondu
    this.editableMessageText = this.buildCurrentMessage();
    this.generatedBy = 'Généré par MonBilan+';
    this.isGenerating = false;
  }

  buildCurrentMessage(): string {
    if (this.selectedTool === 'CALL_SCRIPT') {
      return `[Script d'appel téléphonique]\n\n1. Présentation :\n« Bonjour Madame / Monsieur, je m'appelle ${this.youngDisplayName}, j'ai 16 ans et je suis accompagné(e) dans mon projet d'orientation au Centre des Possibles. »\n\n2. Objet de l'appel :\n« Je m'intéresse beaucoup au métier de ${this.selectedCareer.toLowerCase()} et j'aimerais savoir si vous accueillez des jeunes pour un court stage d'observation (d'une durée de 1 à 5 jours) ${this.periodName ? this.periodName.toLowerCase() : 'prochainement'}. »\n\n3. Clôture :\n« Pourriez-vous m'indiquer à qui je peux envoyer ma convention de stage ou s'il serait possible de vous rencontrer quelques minutes ? Je vous remercie pour votre accueil. »`;
    }

    if (this.selectedTool === 'FOLLOWUP') {
      return `Bonjour,\n\nJe me permets de revenir vers vous concernant mon message précédent au sujet d'une demande de stage d'observation en tant que ${this.selectedCareer.toLowerCase()}.\n\nJe reste très motivé(e) à l'idée de découvrir votre entreprise ${this.companyName ? '(' + this.companyName + ') ' : ''}et vos savoir-faire sur le terrain.\n\nSi une période est envisageable pour vous ${this.periodName ? this.periodName.toLowerCase() : 'dans les prochaines semaines'}, je serais ravi(e) de vous transmettre ma convention de stage délivrée par le Centre des Possibles.\n\nEn vous remerciant pour votre temps et votre bienveillance.\n\nCordialement,\n${this.youngDisplayName}`;
    }

    if (this.selectedTool === 'TRAINING') {
      return `[Entraînement aux questions clés]\n\n❓ Question 1 : Pourquoi vous intéressez-vous à ce métier ?\n💡 Conseil de réponse : « J'ai découvert le métier de ${this.selectedCareer.toLowerCase()} lors de mon bilan d'orientation. Mes points d'appui sont la créativité et le sens pratique, et j'aimerais voir la réalité du terrain avant de choisir ma formation. »\n\n❓ Question 2 : Quelles sont vos disponibilités ?\n💡 Conseil de réponse : « Je suis disponible ${this.periodName ? this.periodName.toLowerCase() : 'pendant les vacances scolaires'}, avec une convention de stage officielle qui me couvre entièrement en responsabilité civile. »\n\n❓ Question 3 : Qu'attendez-vous de cette semaine ?\n💡 Conseil de réponse : « Découvrir votre quotidien, observer vos gestes professionnels et vous poser quelques questions pour confirmer mon orientation. »`;
    }

    // Défaut : EMAIL
    if (this.messageStyle === 'FORMEL') {
      return `Madame, Monsieur,\n\nActuellement dans une démarche de construction de mon projet professionnel avec le Centre des Possibles, je porte un vif intérêt au secteur de la création et plus particulièrement au métier de ${this.selectedCareer.toLowerCase()}.\n\nDans le cadre de mon parcours, j'aimerais solliciter auprès de votre établissement, ${this.companyName || 'votre entreprise'}, une période d'immersion professionnelle d'observation ${this.periodName ? this.periodName.toLowerCase() : 'au cours des prochaines semaines'}.\n\nCe stage conventionné de quelques jours me permettrait de confronter mes aptitudes au terrain et d'échanger avec vos équipes sur les compétences requises.\n\nJe reste à votre entière disposition pour tout renseignement complémentaire ou entretien à votre convenance.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${this.youngDisplayName}`;
    }

    return `Bonjour,\n\nJe m'intéresse beaucoup au métier de ${this.selectedCareer.toLowerCase()} et j'aimerais découvrir le quotidien d'un professionnel dans ce domaine.\n\nJe souhaiterais savoir si votre entreprise, ${this.companyName || 'votre établissement'}, pourrait m'accueillir pour un stage d'observation ${this.periodName ? this.periodName.toLowerCase() : 'prochainement'}.\n\nCe stage est encadré par une convention officielle délivrée par le Centre des Possibles. Je serais ravi(e) d'échanger avec vous sur les modalités d'accueil.\n\nJe vous remercie pour votre attention et votre retour.\n\nBien cordialement,\n${this.youngDisplayName}`;
  }

  saveEditedMessage(): void {
    this.isEditingMessage = false;
  }

  copyToClipboard(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.editableMessageText);
      this.copyToast = true;
      setTimeout(() => (this.copyToast = false), 2500);
    }
  }

  downloadPdf(): void {
    const blob = new Blob([this.editableMessageText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monbilan-message-${this.selectedCareer.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  saveToImmersion(): void {
    this.saveImmersion.emit(this.editableMessageText);
    alert('Message enregistré dans ton projet d’immersion !');
  }
}
