// ============================================================================
// MonBilan+ — Composant « Mon Coach IA » (Atelier de communication)
// Reproduction fidèle de la maquette media_1795103212997
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
          class="p-4 rounded-2xl text-left transition flex items-start gap-3.5"
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
          class="p-4 rounded-2xl text-left transition flex items-start gap-3.5"
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
          class="p-4 rounded-2xl text-left transition flex items-start gap-3.5"
        >
          <div
            [class]="selectedTool === 'FOLLOWUP' ? 'bg-[#7C3AED] text-white' : 'bg-[#FFFBEB] text-amber-600'"
            class="h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 transition"
          >
            <mb-icon name="message-circle"></mb-icon>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">Préparer une relance</h4>
            <p class="text-[11px] text-[#64748B] mt-0.5 leading-snug">
              Relancer avec tact après un premier contact.
            </p>
          </div>
        </button>

        <!-- 4. M'entraîner à parler -->
        <button
          type="button"
          (click)="selectTool('TRAINING')"
          [class]="selectedTool === 'TRAINING'
            ? 'bg-white border-2 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
            : 'bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 shadow-xs'"
          class="p-4 rounded-2xl text-left transition flex items-start gap-3.5"
        >
          <div
            [class]="selectedTool === 'TRAINING' ? 'bg-[#7C3AED] text-white' : 'bg-[#ECFDF5] text-emerald-600'"
            class="h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 transition"
          >
            <mb-icon name="mic"></mb-icon>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">M'entraîner à parler</h4>
            <p class="text-[11px] text-[#64748B] mt-0.5 leading-snug">
              Simuler un échange avec un professionnel.
            </p>
          </div>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- 3 COLONNES DE TRAVAIL                                              -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- COLONNE GAUCHE (4/12) : FORMULAIRE DE PARAMÉTRAGE -->
        <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="flex items-center gap-2.5 pb-2 border-b border-[#F0EDFA]">
            <span class="text-xl text-[#7C3AED]"><mb-icon name="mail"></mb-icon></span>
            <h3 class="text-base font-extrabold text-[#0F1035]">
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
                  class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8DCF0] bg-[#FAFAFC] focus:bg-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-xs font-bold text-[#0F1035] outline-none"
                >
                  <option value="Peintre décorateur">Peintre décorateur</option>
                  <option value="Technicien du son">Technicien du son</option>
                  <option value="Cuisinier en restauration rapide">Cuisinier en restauration rapide</option>
                  <option value="Barista">Barista</option>
                  <option value="Graphiste">Graphiste</option>
                  <option value="Photographe">Photographe</option>
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
                  value="FORMEL"
                  class="text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span class="font-bold text-[#0F1035]">Plus formel (entreprise, service RH...)</span>
              </label>
            </div>

            <!-- Bouton Générer avec l'IA -->
            <button
              type="button"
              (click)="generateMessage()"
              class="w-full rounded-2xl bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] text-white font-extrabold text-xs sm:text-sm py-3 px-4 shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 mt-4"
            >
              <span><mb-icon name="sparkles"></mb-icon></span>
              <span>Générer mon email avec l'IA</span>
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
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Généré par MonBilan+
              </span>
            </div>

            <!-- Carte du message -->
            <div class="rounded-2xl bg-[#FAFAFC] border border-[#E4E0F5] p-4 text-xs sm:text-[13px] text-[#31355B] space-y-3 relative overflow-hidden leading-relaxed">
              <div class="font-black text-[#0F1035]">
                Objet : Demande de stage d'observation – {{ selectedCareer }}
              </div>

              <div *ngIf="!isEditingMessage" class="space-y-2 whitespace-pre-line">
                <p>Bonjour,</p>
                <p>Je m'intéresse au métier de {{ selectedCareer.toLowerCase() }} et j'aimerais découvrir le quotidien d'un professionnel dans ce domaine.</p>
                <p>Je souhaiterais savoir si votre entreprise, {{ companyName || 'votre établissement' }}, pourrait accueillir un jeune pour une période d'observation {{ periodName ? periodName.toLowerCase() : 'prochainement' }}.</p>
                <p>Je serais ravi(e) d'échanger avec vous sur les possibilités d'accueil et les démarches nécessaires.</p>
                <p>Je vous remercie pour votre attention.</p>
                <p class="font-bold">Cordialement,<br/>Emma D.</p>
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
                  class="rounded-lg bg-[#7C3AED] text-white px-3 py-1 text-xs font-bold"
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
              class="rounded-xl border border-[#D8DCF0] hover:border-[#7C3AED] px-3 py-1.5 text-xs font-extrabold text-[#0F1035] transition flex items-center gap-1.5 shadow-2xs"
            >
              <span><mb-icon name="pencil"></mb-icon></span>
              <span>Modifier</span>
            </button>

            <button
              type="button"
              (click)="copyToClipboard()"
              class="rounded-xl border border-[#D8DCF0] hover:border-[#7C3AED] px-3 py-1.5 text-xs font-extrabold text-[#0F1035] transition flex items-center gap-1.5 shadow-2xs"
            >
              <span><mb-icon name="clipboard-list"></mb-icon></span>
              <span>{{ copyToast ? 'Copié !' : 'Copier le texte' }}</span>
            </button>

            <button
              type="button"
              (click)="downloadPdf()"
              class="rounded-xl border border-[#D8DCF0] hover:border-[#7C3AED] px-3 py-1.5 text-xs font-extrabold text-[#0F1035] transition flex items-center gap-1.5 shadow-2xs"
            >
              <span><mb-icon name="download"></mb-icon></span>
              <span>Télécharger (PDF)</span>
            </button>

            <button
              type="button"
              (click)="saveToImmersion()"
              class="rounded-xl bg-[#F5F3FF] border border-[#C084FC] text-[#7C3AED] hover:bg-[#EDE9FE] px-3 py-1.5 text-xs font-extrabold transition flex items-center gap-1.5 shadow-2xs"
            >
              <span><mb-icon name="heart" [filled]="true"></mb-icon></span>
              <span>Enregistrer</span>
            </button>
          </div>
        </div>

        <!-- COLONNE DROITE (3/12) : CONSEILS & ET ENSUITE -->
        <div class="lg:col-span-3 space-y-5">
          <!-- Nos conseils -->
          <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
            <h4 class="text-sm font-black text-[#0F1035] flex items-center gap-2">
              <span class="text-amber-500"><mb-icon name="lightbulb"></mb-icon></span>
              <span>Nos conseils</span>
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

  ngOnInit(): void {
    this.editableMessageText = this.buildCurrentMessage();
  }

  selectTool(tool: CoachToolKind): void {
    this.selectedTool = tool;
  }

  generateMessage(): void {
    this.editableMessageText = this.buildCurrentMessage();
    this.isEditingMessage = false;
  }

  buildCurrentMessage(): string {
    return `Bonjour,\n\nJe m'intéresse au métier de ${this.selectedCareer.toLowerCase()} et j'aimerais découvrir le quotidien d'un professionnel dans ce domaine.\n\nJe souhaiterais savoir si votre entreprise, ${this.companyName || 'votre établissement'}, pourrait accueillir un jeune pour une période d'observation ${this.periodName ? this.periodName.toLowerCase() : 'prochainement'}.\n\nJe serais ravi(e) d'échanger avec vous sur les possibilités d'accueil et les démarches nécessaires.\n\nJe vous remercie pour votre attention.\n\nCordialement,\n${this.youngDisplayName}`;
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
    alert('Le document a été préparé pour le téléchargement PDF.');
  }

  saveToImmersion(): void {
    this.saveImmersion.emit(this.editableMessageText);
    alert('Message enregistré dans ton projet d’immersion !');
  }
}
