// ============================================================================
// Composant Standalone — Choix du mode de parcours (Onboarding)
// « Comment souhaites-tu avancer ? »
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { JourneyMode } from '../../shared/autonomous-data';

@Component({
  selector: 'app-journey-choice-modal',
  standalone: true,
  imports: [MbIconComponent, CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F1035]/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-choice-title"
    >
      <div
        class="w-full max-w-2xl rounded-3xl bg-white border border-[#E4E0F5] shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
      >
        <!-- Décorations subtiles -->
        <div class="absolute -right-12 -top-12 w-48 h-48 bg-[#EDE9FE]/50 rounded-full blur-2xl pointer-events-none"></div>

        <div class="space-y-2 text-center max-w-lg mx-auto">
          <span class="inline-block rounded-full bg-[#EDE9FE] text-[#7C3AED] px-3.5 py-1 text-xs font-black tracking-wide uppercase">
            Bienvenue sur MonBilan+
          </span>
          <h2 id="journey-choice-title" class="text-2xl sm:text-3xl font-black text-[#0F1035] tracking-tight">
            Comment souhaites-tu avancer ?
          </h2>
          <p class="text-sm text-[#42466B]">
            Choisis l'expérience qui correspond le mieux à ta situation actuelle. Tu pourras changer d'avis à tout moment dans tes paramètres.
          </p>
        </div>

        <!-- 2 Cartes de choix -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <!-- Option A : Je suis accompagné -->
          <div
            (click)="selectMode('SUPPORTED')"
            [class]="currentMode === 'SUPPORTED' ? 'ring-2 ring-[#7C3AED] border-[#7C3AED] bg-[#FAF8FF]' : 'border-[#E4E0F5] bg-white hover:border-[#7C3AED]/50 hover:bg-[#FAF8FF]/40'"
            class="rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 cursor-pointer transition shadow-sm group"
          >
            <div class="space-y-3">
              <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center text-2xl shadow-sm">
                <mb-icon name="handshake"></mb-icon>
              </div>
              <div>
                <span class="text-xs font-bold text-[#7C3AED] uppercase tracking-wider block">Option A</span>
                <h3 class="text-lg font-black text-[#0F1035] group-hover:text-[#7C3AED] transition">
                  Je suis accompagné
                </h3>
              </div>
              <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                J’ai un conseiller ou un professionnel du Centre des Possibles qui m’accompagne dans mon orientation et j’accède à mon bilan Rdv.
              </p>
            </div>
            <button
              type="button"
              class="w-full rounded-full py-2.5 px-4 text-xs font-black text-center transition"
              [class]="currentMode === 'SUPPORTED' ? 'bg-[#7C3AED] text-white shadow' : 'bg-[#F3EFFE] text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white'"
            >
              Parcours avec conseiller →
            </button>
          </div>

          <!-- Option B : J'avance à mon rythme -->
          <div
            (click)="selectMode('AUTONOMOUS')"
            [class]="currentMode === 'AUTONOMOUS' ? 'ring-2 ring-[#7C3AED] border-[#7C3AED] bg-[#FAF8FF]' : 'border-[#E4E0F5] bg-white hover:border-[#7C3AED]/50 hover:bg-[#FAF8FF]/40'"
            class="rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 cursor-pointer transition shadow-sm group"
          >
            <div class="space-y-3">
              <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-sm">
                <mb-icon name="compass"></mb-icon>
              </div>
              <div>
                <span class="text-xs font-bold text-amber-700 uppercase tracking-wider block">Option B</span>
                <h3 class="text-lg font-black text-[#0F1035] group-hover:text-[#7C3AED] transition">
                  J'avance à mon rythme
                </h3>
              </div>
              <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
                Je n’ai pas de conseiller. Je souhaite découvrir librement les métiers, enregistrer mes favoris et préparer une immersion en entreprise.
              </p>
            </div>
            <button
              type="button"
              class="w-full rounded-full py-2.5 px-4 text-xs font-black text-center transition"
              [class]="currentMode === 'AUTONOMOUS' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow' : 'bg-amber-50 text-amber-800 group-hover:bg-amber-500 group-hover:text-white'"
            >
              Parcours autonome libre →
            </button>
          </div>
        </div>

        <!-- Note de réassurance RGPD -->
        <div class="text-center pt-1">
          <p class="text-xs text-[#6B7280]">
            <mb-icon name="lock"></mb-icon> Aucune obligation d’import de bilan. Tes données et favoris restent strictement confidentiels.
          </p>
        </div>
      </div>
    </div>
  `
})
export class JourneyChoiceModalComponent {
  @Input() isOpen = false;
  @Input() currentMode: JourneyMode = 'SUPPORTED';
  @Output() modeSelected = new EventEmitter<JourneyMode>();
  @Output() closed = new EventEmitter<void>();

  selectMode(mode: JourneyMode): void {
    this.modeSelected.emit(mode);
  }
}
