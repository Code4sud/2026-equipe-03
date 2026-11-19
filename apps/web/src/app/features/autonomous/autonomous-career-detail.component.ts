// ============================================================================
// Composant Standalone — Fiche Métier Simplifiée (Écran 3 Maquette)
// Pédagogique, sourcée O*NET FR, sans scores psychométriques inventés
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UICatalogCareer } from '../../shared/autonomous-data';

@Component({
  selector: 'app-autonomous-career-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="career" class="space-y-6 animate-fadeIn">
      <!-- ================================================================== -->
      <!-- 1. BANNIÈRE EN-TÊTE DU MÉTIER                                       -->
      <!-- ================================================================== -->
      <div
        class="rounded-[28px] bg-gradient-to-r from-[#1B1B62] via-[#2E1A7D] to-[#7C3AED] text-white p-6 sm:p-8 shadow-lg relative overflow-hidden"
      >
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div class="space-y-2 max-w-2xl">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-white/20 text-white px-3 py-1 text-xs font-black">
                {{ career.categoryIcon }} {{ career.categoryLabelFr }}
              </span>
              <span class="rounded-full bg-purple-400/30 text-purple-100 border border-purple-300/30 px-3 py-1 text-xs font-bold">
                Zone {{ career.jobZone }} ({{ getZoneLabel(career.jobZone) }})
              </span>
            </div>

            <h2 class="text-3xl sm:text-4xl font-black tracking-tight">
              {{ career.titleFr }}
            </h2>

            <p class="text-sm text-[#E7E8FB] font-medium leading-relaxed">
              {{ career.descriptionFr }}
            </p>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              (click)="startImmersion.emit(career)"
              class="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#7C3AED] text-white px-6 py-3 text-xs font-black shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <span>💼</span>
              <span>Préparer une immersion →</span>
            </button>

            <button
              type="button"
              (click)="toggleFavorite(career)"
              class="rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-5 py-2.5 text-xs font-extrabold transition flex items-center justify-center gap-2"
            >
              <span>{{ career.isFavorite ? '❤️ Dans mes favoris' : '🤍 Ajouter aux favoris' }}</span>
            </button>

            <button
              type="button"
              (click)="backToCatalog.emit()"
              class="rounded-full bg-white text-[#1B1B62] hover:bg-[#F3EFFE] px-5 py-2.5 text-xs font-extrabold transition flex items-center justify-center gap-1.5"
            >
              <span>← Retour au catalogue</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. CONTENU PÉDAGOGIQUE EN GRILLE                                    -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Colonne Principale (8 colonnes) -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Ce que fait ce professionnel -->
          <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🎯</span>
              <h3 class="text-lg font-black text-[#0F1035]">Ce que fait ce professionnel</h3>
            </div>
            <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
              {{ career.descriptionFr }}
            </p>
          </div>

          <!-- Les activités principales -->
          <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📋</span>
              <h3 class="text-lg font-black text-[#0F1035]">Les activités principales à observer</h3>
            </div>
            <div class="space-y-2.5">
              <div
                *ngFor="let act of career.suggestedActivities; let i = index"
                class="rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] p-3.5 flex items-start gap-3 text-xs sm:text-sm text-[#0F1035]"
              >
                <span class="h-6 w-6 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-black flex items-center justify-center shrink-0 text-xs">
                  {{ i + 1 }}
                </span>
                <span class="font-medium leading-relaxed">{{ act }}</span>
              </div>
            </div>
          </div>

          <!-- Les questions utiles pour une rencontre pro -->
          <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">💬</span>
              <h3 class="text-lg font-black text-[#0F1035]">Les questions à poser lors d'une rencontre</h3>
            </div>
            <p class="text-xs text-[#6B7280]">
              Ces questions bienveillantes te permettent d'engager la discussion avec un artisan, technicien ou responsable d'entreprise.
            </p>
            <div class="space-y-2.5">
              <div
                *ngFor="let q of career.suggestedQuestions"
                class="rounded-2xl bg-amber-50/60 border border-amber-200 p-3.5 flex items-start gap-3 text-xs sm:text-sm text-amber-950"
              >
                <span class="text-base shrink-0">💡</span>
                <span class="font-medium leading-relaxed">« {{ q }} »</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne Latérale (4 colonnes) : Parcours, Cadre & Aide -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Les parcours et durées possibles -->
          <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <h4 class="text-sm font-black text-[#0F1035] uppercase tracking-wider flex items-center gap-2">
              <span>🎓</span>
              <span>Voies d'accès vérifiées</span>
            </h4>
            <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2 text-xs text-[#42466B]">
              <p><strong>Niveau de préparation :</strong> Zone {{ career.jobZone }}</p>
              <p class="text-[11px] text-[#6B7280] leading-snug">{{ career.jobZoneJustification }}</p>
              <hr class="border-[#E4E0F5] my-2" />
              <p><strong>Filières possibles :</strong></p>
              <ul class="list-disc list-inside space-y-1 text-[11px]">
                <li *ngFor="let path of career.suggestedPathways">{{ path }}</li>
              </ul>
            </div>
          </div>

          <!-- Besoin d'un coup de main ? -->
          <div class="rounded-3xl bg-gradient-to-br from-[#FAF8FF] to-[#EDE9FE] border border-[#DDD6FE] p-6 shadow-sm space-y-3">
            <div class="flex items-center gap-2 text-[#7C3AED]">
              <span class="text-xl">🤝</span>
              <h4 class="text-sm font-black uppercase tracking-wider">Besoin d'un coup de main ?</h4>
            </div>
            <p class="text-xs text-[#42466B] leading-relaxed">
              Des professionnels de l'orientation (CIO, Mission Locale, professeurs) peuvent t'aider gratuitement à affiner ton projet.
            </p>
            <button
              type="button"
              (click)="findSupport.emit()"
              class="w-full rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 px-4 text-xs font-black shadow transition text-center"
            >
              Voir les structures d’aide locale →
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AutonomousCareerDetailComponent {
  @Input() career: UICatalogCareer | null = null;
  @Output() backToCatalog = new EventEmitter<void>();
  @Output() startImmersion = new EventEmitter<UICatalogCareer>();
  @Output() findSupport = new EventEmitter<void>();
  @Output() favoriteToggled = new EventEmitter<UICatalogCareer>();

  toggleFavorite(career: UICatalogCareer): void {
    career.isFavorite = !career.isFavorite;
    this.favoriteToggled.emit(career);
  }

  getZoneLabel(zone: number): string {
    switch (zone) {
      case 1: return '0 à 6 mois';
      case 2: return '3 mois à 2 ans';
      case 3: return '1 à 4 ans';
      case 4: return '2 à 6 ans';
      case 5: return '4 à 10 ans';
      default: return 'Variable';
    }
  }
}
