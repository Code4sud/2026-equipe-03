// ============================================================================
// Composant Standalone — Fiche Métier Découverte (Étape 3 du Parcours Cible)
// Pédagogique, accessible, structurée en 5 sections sourcées
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { UICatalogCareer } from '../../shared/autonomous-data';

@Component({
  selector: 'app-autonomous-career-detail',
  standalone: true,
  imports: [MbIconComponent, CommonModule],
  template: `
    <div *ngIf="career" class="space-y-6 animate-fadeIn pb-12">
      <!-- ================================================================== -->
      <!-- EN-TÊTE DU MÉTIER : HERO & ACTIONS RAPIDES                         -->
      <!-- ================================================================== -->
      <div
        class="rounded-[28px] bg-gradient-to-r from-[#1B1B62] via-[#2E1A7D] to-[#7C3AED] text-white p-6 sm:p-8 shadow-lg relative overflow-hidden"
      >
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div class="space-y-2 max-w-2xl">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-white/20 text-white px-3 py-1 text-xs font-black">
                <mb-icon [name]="career.categoryIcon"></mb-icon> {{ career.categoryLabelFr }}
              </span>
              <span class="rounded-full bg-purple-400/30 text-purple-100 border border-purple-300/30 px-3 py-1 text-xs font-bold">
                Zone O*NET {{ career.jobZone }} ({{ getZoneLabel(career.jobZone) }})
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-black tracking-tight">
              {{ career.titleFr }}
            </h1>

            <p class="text-sm text-[#E7E8FB] font-medium leading-relaxed">
              {{ career.descriptionFr }}
            </p>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <!-- Bouton principal : Ce métier m'intéresse -->
            <button
              type="button"
              (click)="onInterestClick(career)"
              class="rounded-full bg-gradient-to-r from-[#EC4899] to-[#D946EF] hover:opacity-95 text-white px-6 py-3 text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span><mb-icon [name]="'heart'" [filled]="!!(career.isFavorite)"></mb-icon></span>
              <span>{{ career.isFavorite ? 'Enregistré dans mes pistes ✓' : "Ce métier m'intéresse" }}</span>
            </button>

            <button
              type="button"
              (click)="startImmersion.emit(career)"
              class="rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-5 py-2.5 text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span><mb-icon name="briefcase"></mb-icon></span>
              <span>Préparer une immersion →</span>
            </button>

            <button
              type="button"
              (click)="backToCatalog.emit()"
              class="rounded-full bg-white text-[#1B1B62] hover:bg-[#F3EFFE] px-5 py-2 text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>← Retour au catalogue</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- LES 5 SECTIONS DU PARCOURS CIBLE                                    -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- COLONNE PRINCIPALE (8 colonnes) -->
        <div class="lg:col-span-8 space-y-6">

          <!-- SECTION 1 — En bref -->
          <section class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <span class="h-10 w-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xl shrink-0">
                <mb-icon name="info"></mb-icon>
              </span>
              <div>
                <span class="text-xs font-black text-[#7C3AED] uppercase tracking-wider block">Section 1</span>
                <h2 class="text-lg font-black text-[#0F1035]">En bref</h2>
              </div>
            </div>

            <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
              {{ career.descriptionFr }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div class="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] space-y-1">
                <span class="text-xs font-bold text-[#7C3AED] block">À quoi ressemble le quotidien ?</span>
                <p class="text-xs text-[#42466B]">
                  Rythme varié entre autonomie, contacts avec l'équipe ou des clients, et tâches techniques spécialisées.
                </p>
              </div>
              <div class="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] space-y-1">
                <span class="text-xs font-bold text-[#7C3AED] block">Où peut-il travailler ?</span>
                <p class="text-xs text-[#42466B]">
                  En entreprise, en atelier, chez des particuliers, sur site ou en travail hybride selon les métiers.
                </p>
              </div>
            </div>
          </section>

          <!-- SECTION 2 — Ce que tu pourrais faire -->
          <section class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <span class="h-10 w-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">
                <mb-icon name="clipboard-list"></mb-icon>
              </span>
              <div>
                <span class="text-xs font-black text-blue-700 uppercase tracking-wider block">Section 2</span>
                <h2 class="text-lg font-black text-[#0F1035]">Ce que tu pourrais faire</h2>
              </div>
            </div>

            <p class="text-xs text-[#6B7280]">
              Activités réelles et concrètes observées dans cette profession :
            </p>

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
          </section>

          <!-- SECTION 3 — Les compétences utiles -->
          <section class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <span class="h-10 w-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0">
                <mb-icon name="sparkles"></mb-icon>
              </span>
              <div>
                <span class="text-xs font-black text-amber-700 uppercase tracking-wider block">Section 3</span>
                <h2 class="text-lg font-black text-[#0F1035]">Les compétences utiles</h2>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <span class="text-xs font-extrabold text-[#0F1035] block">Qualités professionnelles appréciées</span>
                <ul class="space-y-1.5 text-xs text-[#42466B]">
                  <li class="flex items-center gap-2">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>Curiosité et envie d'apprendre</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>Sens de l'écoute et esprit d'équipe</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>Rigueur et organisation</span>
                  </li>
                </ul>
              </div>

              <div class="space-y-2">
                <span class="text-xs font-extrabold text-[#0F1035] block">Ce qui s'apprend en formation</span>
                <ul class="space-y-1.5 text-xs text-[#42466B]">
                  <li class="flex items-center gap-2">
                    <span class="text-[#7C3AED] font-bold">•</span>
                    <span>L'utilisation des outils et logiciels spécialisés</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-[#7C3AED] font-bold">•</span>
                    <span>Les normes de sécurité et bonnes pratiques</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-[#7C3AED] font-bold">•</span>
                    <span>La gestion des projets et délais</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- SECTION 5 — Découvrir ce métier en vrai -->
          <section class="rounded-3xl bg-gradient-to-br from-[#F5F3FF] via-white to-[#EDE9FE] border-2 border-[#DDD6FE] p-6 sm:p-7 shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <span class="h-10 w-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                <mb-icon name="rocket"></mb-icon>
              </span>
              <div>
                <span class="text-xs font-black text-[#7C3AED] uppercase tracking-wider block">Section 5</span>
                <h2 class="text-lg font-black text-[#0F1035]">Découvrir ce métier en vrai</h2>
              </div>
            </div>

            <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
              Pour savoir si ce métier te plaît vraiment, rien ne remplace une immersion d'observation de 1 à 3 jours ou une rencontre avec un professionnel.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                (click)="startImmersion.emit(career)"
                class="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3 text-xs sm:text-sm font-black shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span><mb-icon name="briefcase"></mb-icon></span>
                <span>Préparer une immersion pour ce métier →</span>
              </button>

              <button
                type="button"
                (click)="findSupport.emit()"
                class="rounded-full bg-white border border-[#DDD6FE] hover:bg-[#F3EFFE] text-[#7C3AED] px-5 py-3 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <span><mb-icon name="landmark"></mb-icon></span>
                <span>Trouver une aide locale (Nice)</span>
              </button>
            </div>
          </section>
        </div>

        <!-- COLONNE LATÉRALE (4 colonnes) : SECTION 4 — Comment y accéder ? -->
        <div class="lg:col-span-4 space-y-6">
          <!-- SECTION 4 — Comment y accéder ? -->
          <section class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
            <div class="flex items-center gap-2.5">
              <span class="h-8 w-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-base shrink-0">
                <mb-icon name="graduation-cap"></mb-icon>
              </span>
              <div>
                <span class="text-[10px] font-black text-[#7C3AED] uppercase tracking-wider block">Section 4</span>
                <h3 class="text-sm font-black text-[#0F1035]">Comment y accéder ?</h3>
              </div>
            </div>

            <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2.5 text-xs text-[#42466B]">
              <p>
                <strong>Préparation indicative :</strong><br />
                <span class="text-[11px] text-[#6B7280]">Zone O*NET {{ career.jobZone }} : {{ getZoneLabel(career.jobZone) }}</span>
              </p>
              <p class="text-[11px] text-[#6B7280] leading-snug">
                {{ career.jobZoneJustification }}
              </p>
              <hr class="border-[#E4E0F5] my-2" />
              <p><strong>Parcours de formation en France :</strong></p>
              <ul class="list-disc list-inside space-y-1.5 text-[11px] text-[#42466B]">
                <li *ngFor="let path of career.suggestedPathways">{{ path }}</li>
              </ul>
              <div class="mt-3 p-2.5 rounded-xl bg-white border border-[#DDD6FE] text-[10px] text-[#6B7280]">
                ℹ️ <em>Sources vérifiées O*NET FR & Onisep. Les filières peuvent varier selon ton profil.</em>
              </div>
            </div>
          </section>

          <!-- Questions à poser lors d'une rencontre -->
          <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3">
            <h4 class="text-xs font-black text-[#0F1035] uppercase tracking-wider flex items-center gap-2">
              <span class="text-amber-500"><mb-icon name="lightbulb"></mb-icon></span>
              <span>Questions pour un pro</span>
            </h4>
            <div class="space-y-2">
              <div
                *ngFor="let q of career.suggestedQuestions.slice(0, 3)"
                class="rounded-xl bg-amber-50/60 border border-amber-200 p-2.5 text-[11px] font-medium text-amber-950"
              >
                « {{ q }} »
              </div>
            </div>
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

  onInterestClick(career: UICatalogCareer): void {
    career.isFavorite = !career.isFavorite;
    this.favoriteToggled.emit(career);
  }

  getZoneLabel(zone: number): string {
    switch (zone) {
      case 1: return '0 à 6 mois (courte)';
      case 2: return '3 mois à 2 ans (CAP / Bac Pro)';
      case 3: return '1 à 4 ans (BTS / BUT)';
      case 4: return '2 à 6 ans (Licence / Master)';
      case 5: return '4 à 10 ans (Études longues)';
      default: return 'Formation variable';
    }
  }
}
