// ============================================================================
// Composant Standalone Angular — Immersion Pro (MonBilan+)
// Refonte intégrale et fiabilisation conforme aux 5 maquettes officielles :
// Étape 1 : Je découvre le métier (Catalogue 2 colonnes & Fiche détaillée)
// Étape 2 : Je prépare mon immersion (Objectifs, Questions & Kit téléchargeable)
// Étape 3 : Je recherche en entreprise (Filtres, Statuts réels & 12 entreprises 06)
// Étape 4 : Je contacte l'entreprise (Candidature, Timeline statuts & Convention)
// Étape 5 : Je réalise mon immersion (Carnet d'observation, Suivi & Période)
// Étape 6 : Je fais le bilan (Questionnaire réflexif & Partage conseiller)
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import {
  IMMERSION_CAREERS_CATALOG,
  IMMERSION_COMPANIES_DATA,
  IMMERSION_STEPS,
  INITIAL_IMMERSION_PROJECT,
  UIImmersionCareer,
  UIImmersionProject,
  UIImmersionStep,
  UIObservationEntry,
  UIPartnerCompany
} from '../../shared/immersion-data';

@Component({
  selector: 'app-immersion-pro',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-12">
      <!-- ================================================================== -->
      <!-- 1. BANNIÈRE HÉRO « MON IMMERSION PRO » (Fidèle aux maquettes)      -->
      <!-- ================================================================== -->
      <div class="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-[#6929CA] via-[#7B2CBF] to-[#9D4EDD] p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-start sm:items-center gap-4 max-w-2xl">
            <!-- Icône valise dans un carré translucide -->
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20 shadow-md">
              <span class="text-2xl sm:text-3xl">🧳</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Mon immersion pro
                </h1>
                <span class="text-xl sm:text-2xl">✨</span>
              </div>
              <p class="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                Découvre un métier sur le terrain grâce à un stage d’observation et vis une expérience concrète en entreprise.
              </p>
            </div>
          </div>

          <!-- Visuel adolescent avec casque de chantier (Fidèle aux maquettes 1 à 5) -->
          <div class="hidden md:flex items-center gap-3 shrink-0 pr-2">
            <!-- Badge métier sélectionné si après étape 1 -->
            <div
              *ngIf="project.currentStep >= 2"
              (click)="goToStep(1)"
              class="rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-extrabold text-[#7C3AED] shadow-md border border-white flex items-center gap-2 cursor-pointer hover:scale-105 transition"
              title="Modifier le métier sélectionné"
            >
              <span>🎨</span>
              <span>{{ project.careerTitle }}</span>
            </div>

            <!-- Illustration casque blanc / jeune fille souriante -->
            <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg relative bg-purple-900/40">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                alt="Jeune en immersion pro"
                class="w-full h-full object-cover"
              />
              <div class="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                <span class="text-xs">⛑️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. STEPPER CONNECTÉ EN 6 ÉTAPES (Fidèle aux 5 maquettes)            -->
      <!-- ================================================================== -->
      <div class="rounded-[24px] sm:rounded-[28px] bg-white border border-[#E4E0F5] p-4 sm:p-5 shadow-sm overflow-x-auto">
        <div class="min-w-[760px] flex items-center justify-between relative px-4 sm:px-8">
          <!-- Ligne de progression arrière-plan -->
          <div class="absolute left-10 right-10 top-5 h-0.5 bg-[#E4E0F5] -z-0"></div>
          <!-- Ligne de progression active violette -->
          <div
            class="absolute left-10 top-5 h-0.5 bg-[#7C3AED] -z-0 transition-all duration-300"
            [style.width.%]="((project.currentStep - 1) / 5) * 88"
          ></div>

          <!-- 6 Étapes -->
          <div
            *ngFor="let s of steps"
            (click)="goToStep(s.number)"
            class="flex flex-col items-center relative z-10 cursor-pointer group"
          >
            <!-- Badge cercle / pilule -->
            <div
              [class]="project.currentStep === s.number
                ? 'bg-[#7C3AED] text-white shadow-md ring-4 ring-[#EDE9FE] px-3.5 py-1 rounded-full'
                : (isStepCompleted(s.number)
                  ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500 rounded-full h-9 w-9'
                  : 'bg-white text-gray-400 border-2 border-[#E4E0F5] rounded-full h-9 w-9 group-hover:border-[#7C3AED] group-hover:text-[#7C3AED]')"
              class="flex items-center justify-center transition"
            >
              <div class="flex items-center gap-1 text-xs font-black">
                <span *ngIf="isStepCompleted(s.number) && project.currentStep !== s.number" class="text-sm font-bold">✓</span>
                <span *ngIf="project.currentStep === s.number" class="text-xs font-extrabold flex items-center gap-1.5">
                  <span class="text-sm">{{ getStepEmoji(s.number) }}</span>
                  <span>{{ s.number }}</span>
                </span>
                <span *ngIf="!isStepCompleted(s.number) && project.currentStep !== s.number" class="text-xs font-bold">
                  {{ s.number }}
                </span>
              </div>
            </div>

            <!-- Libellé de l'étape -->
            <span
              [class]="project.currentStep === s.number
                ? 'text-[#7C3AED] font-extrabold'
                : (isStepCompleted(s.number) ? 'text-[#0F1035] font-bold' : 'text-gray-400 font-semibold')"
              class="text-xs text-center mt-2 max-w-[110px] leading-tight block"
            >
              {{ s.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 3. CONTENU SELON L'ÉTAPE ACTIVE DU PARCOURS IMMERSION              -->
      <!-- ================================================================== -->

      <!-- ================================================================== -->
      <!-- ÉTAPE 1 : JE DÉCOUVRE LE MÉTIER (Fidèle à la Maquette 1)           -->
      <!-- ================================================================== -->
      <div *ngIf="project.currentStep === 1" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- 3.1 Colonne Gauche : Explorer les métiers (35% Largeur) -->
          <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
            <h3 class="text-lg font-extrabold text-[#0F1035]">Explorer les métiers</h3>

            <!-- Barre de recherche -->
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]">🔍</span>
              <input
                type="text"
                [(ngModel)]="searchCareerTerm"
                (ngModelChange)="onCareerFilterChanged()"
                placeholder="Rechercher un métier (ex. peintre, informaticien...)"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] pl-9 pr-8 py-2.5 text-xs font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              />
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">⚙️</span>
            </div>

            <!-- Pilules filtres domaine -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                (click)="selectCareerDomain('ALL')"
                [class]="selectedCareerDomain === 'ALL'
                  ? 'bg-[#7C3AED] text-white font-bold'
                  : 'bg-[#F8F7FF] text-[#42466B] border border-[#E4E0F5] font-semibold'"
                class="rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition cursor-pointer"
              >
                Tous
              </button>
              <button
                type="button"
                (click)="selectCareerDomain('creation')"
                [class]="selectedCareerDomain === 'creation'
                  ? 'bg-[#7C3AED] text-white font-bold'
                  : 'bg-[#F8F7FF] text-[#42466B] border border-[#E4E0F5] font-semibold'"
                class="rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition cursor-pointer"
              >
                Création & Design
              </button>
              <button
                type="button"
                (click)="selectCareerDomain('batiment')"
                [class]="selectedCareerDomain === 'batiment'
                  ? 'bg-[#7C3AED] text-white font-bold'
                  : 'bg-[#F8F7FF] text-[#42466B] border border-[#E4E0F5] font-semibold'"
                class="rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition cursor-pointer"
              >
                Bâtiment
              </button>
              <button
                type="button"
                (click)="selectCareerDomain('numerique')"
                [class]="selectedCareerDomain === 'numerique'
                  ? 'bg-[#7C3AED] text-white font-bold'
                  : 'bg-[#F8F7FF] text-[#42466B] border border-[#E4E0F5] font-semibold'"
                class="rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition cursor-pointer"
              >
                Numérique
              </button>
            </div>

            <!-- Liste verticale compacte des métiers -->
            <div class="space-y-2.5 pt-1 max-h-[560px] overflow-y-auto pr-1">
              <div
                *ngFor="let c of filteredCareersList"
                (click)="selectCareerPreview(c)"
                [class]="selectedCareerPreview.id === c.id
                  ? 'border-2 border-[#7C3AED] bg-[#F5F3FF]'
                  : 'border border-[#E4E0F5] bg-white hover:border-[#C4B5FD]'"
                class="p-3.5 rounded-2xl transition cursor-pointer flex items-center justify-between gap-3 group shadow-2xs"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    [class]="selectedCareerPreview.id === c.id ? 'bg-[#EDE9FE] text-[#7C3AED]' : 'bg-[#F8F7FF] text-gray-500'"
                    class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition"
                  >
                    <span>{{ getCareerIcon(c.title) }}</span>
                  </div>
                  <div class="truncate">
                    <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition truncate">
                      {{ c.title }}
                    </h4>
                    <p class="text-[11px] text-gray-500 truncate font-medium">
                      {{ c.tagline }}
                    </p>
                  </div>
                </div>
                <span class="text-xs text-gray-400 group-hover:text-[#7C3AED] font-bold">›</span>
              </div>
            </div>
          </div>

          <!-- 3.2 Colonne Droite : Fiche métier détaillée (65% Largeur — Fidèle à la Maquette 1) -->
          <div class="lg:col-span-7 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-6">
            <!-- En-tête photo + tag + titre -->
            <div class="space-y-4">
              <div class="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-gray-100 border border-[#E4E0F5]">
                <img
                  [src]="selectedCareerPreview.heroImage"
                  [alt]="selectedCareerPreview.title"
                  class="w-full h-full object-cover"
                />
                <!-- Tag secteur haut gauche -->
                <div class="absolute top-3 left-3">
                  <span class="bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE] text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                    {{ selectedCareerPreview.sectorTag }}
                  </span>
                </div>
                <!-- Cœur favori haut droite -->
                <button
                  type="button"
                  (click)="toggleCareerFavorite(selectedCareerPreview)"
                  class="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-sm shadow-md hover:scale-110 transition cursor-pointer"
                >
                  <span [class]="selectedCareerPreview.isFavorite ? 'text-[#7C3AED]' : 'text-gray-400'">
                    <mb-icon name="heart" [filled]="!!selectedCareerPreview.isFavorite"></mb-icon>
                  </span>
                </button>
              </div>

              <div>
                <h3 class="text-2xl sm:text-3xl font-extrabold text-[#0F1035]">
                  {{ selectedCareerPreview.title }}
                </h3>
                <p class="text-xs sm:text-sm text-[#42466B] mt-1 leading-relaxed">
                  {{ selectedCareerPreview.shortSummary }}
                </p>
              </div>
            </div>

            <!-- 4 Onglets pilules : Présentation, En image, Formations, Témoignages -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#F0EDFA]">
              <button
                type="button"
                (click)="activeCareerTab = 'PRES'"
                [class]="activeCareerTab === 'PRES' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-[#F8F7FF] text-[#42466B] font-semibold'"
                class="rounded-full px-4 py-1.5 text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📖</span>
                <span>Présentation</span>
              </button>
              <button
                type="button"
                (click)="activeCareerTab = 'IMAGE'"
                [class]="activeCareerTab === 'IMAGE' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-[#F8F7FF] text-[#42466B] font-semibold'"
                class="rounded-full px-4 py-1.5 text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>🎬</span>
                <span>En image</span>
              </button>
              <button
                type="button"
                (click)="activeCareerTab = 'FORM'"
                [class]="activeCareerTab === 'FORM' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-[#F8F7FF] text-[#42466B] font-semibold'"
                class="rounded-full px-4 py-1.5 text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>🎓</span>
                <span>Formations</span>
              </button>
              <button
                type="button"
                (click)="activeCareerTab = 'TEMO'"
                [class]="activeCareerTab === 'TEMO' ? 'bg-[#7C3AED] text-white font-bold' : 'bg-[#F8F7FF] text-[#42466B] font-semibold'"
                class="rounded-full px-4 py-1.5 text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>👥</span>
                <span>Témoignages</span>
              </button>
            </div>

            <!-- Contenu Onglet : Présentation (4 Blocs : Activités, Compétences, Conditions, Perspectives) -->
            <div *ngIf="activeCareerTab === 'PRES'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 1. Activités principales -->
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2.5">
                <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                  <span class="text-base text-[#7C3AED]">📖</span>
                  <span>Activités principales</span>
                </div>
                <ul class="space-y-1.5 text-xs text-[#42466B]">
                  <li *ngFor="let act of selectedCareerPreview.activitesPrincipales" class="flex items-start gap-1.5">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>{{ act }}</span>
                  </li>
                </ul>
              </div>

              <!-- 2. Compétences mobilisées -->
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2.5">
                <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                  <span class="text-base text-[#7C3AED]">🎖️</span>
                  <span>Compétences mobilisées</span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    *ngFor="let comp of selectedCareerPreview.competencesMobilisees"
                    class="rounded-lg bg-white border border-[#DDD6FE] px-2.5 py-1 text-[11px] font-bold text-[#6D28D9] shadow-2xs"
                  >
                    {{ comp }}
                  </span>
                </div>
              </div>

              <!-- 3. Conditions de travail -->
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2.5">
                <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                  <span class="text-base text-[#7C3AED]">💼</span>
                  <span>Conditions de travail</span>
                </div>
                <ul class="space-y-1.5 text-xs text-[#42466B]">
                  <li *ngFor="let cond of selectedCareerPreview.conditionsTravail" class="flex items-start gap-1.5">
                    <span class="text-gray-400">•</span>
                    <span>{{ cond }}</span>
                  </li>
                </ul>
              </div>

              <!-- 4. Perspectives -->
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2.5">
                <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                  <span class="text-base text-[#7C3AED]">📈</span>
                  <span>Perspectives</span>
                </div>
                <ul class="space-y-1.5 text-xs text-[#42466B]">
                  <li *ngFor="let pers of selectedCareerPreview.perspectives" class="flex items-start gap-1.5">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>{{ pers }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Contenu Onglet : Formations -->
            <div *ngIf="activeCareerTab === 'FORM'" class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-5 space-y-3">
              <h4 class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider">Filières recommandées (Nice & 06)</h4>
              <div class="space-y-2">
                <div *ngFor="let f of selectedCareerPreview.formations" class="p-3 rounded-xl bg-white border border-[#E4E0F5] flex items-center justify-between text-xs font-bold text-[#0F1035]">
                  <span>🎓 {{ f }}</span>
                  <span class="text-emerald-600">Disponible dans le 06</span>
                </div>
              </div>
            </div>

            <!-- Contenu Onglet : Témoignages -->
            <div *ngIf="activeCareerTab === 'TEMO'" class="space-y-3">
              <div *ngFor="let t of selectedCareerPreview.temoignages" class="rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] p-4 space-y-1.5">
                <p class="text-xs italic text-[#4C1D95]">« {{ t.quote }} »</p>
                <div class="text-[11px] font-extrabold text-[#7C3AED]">{{ t.author }} — {{ t.role }}</div>
              </div>
            </div>

            <!-- Bouton Centré : Choisir cette piste métier (Fidèle à la Maquette 1) -->
            <div class="pt-2 text-center">
              <button
                type="button"
                (click)="confirmCareerSelection(selectedCareerPreview)"
                class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>Choisir cette piste métier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ÉTAPE 2 : JE PRÉPARE MON IMMERSION (Fidèle à la Maquette 2)        -->
      <!-- ================================================================== -->
      <div *ngIf="project.currentStep === 2" class="space-y-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-[#0F1035]">
            2. Je prépare mon immersion
          </h2>
          <p class="text-xs sm:text-sm text-[#42466B] mt-1">
            Définis tes objectifs, prépare tes questions et télécharge tes documents pour être prêt(e) sur le terrain.
          </p>
        </div>

        <!-- Grille 3 blocs (Maquette 2) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <!-- BLOC A : Mon métier choisi & Objectifs (4/12) -->
          <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-5">
            <!-- Métier choisi -->
            <div class="space-y-3 pb-4 border-b border-[#F0EDFA]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-lg shrink-0">
                  🎨
                </div>
                <div>
                  <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Mon métier choisi</span>
                  <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035] leading-tight">
                    {{ project.careerTitle }}
                  </h3>
                </div>
              </div>
              <p class="text-xs text-[#42466B] leading-relaxed">
                Prépare et embellit les surfaces (murs, plafonds, meubles) grâce à des techniques de peinture, de décoration et de finitions.
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span class="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200 text-[11px] font-bold">+ Création</span>
                <span class="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200 text-[11px] font-bold">+ Décoration</span>
                <span class="px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-[11px] font-bold">Finitions</span>
                <span class="px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-[11px] font-bold">Travail en équipe</span>
              </div>
            </div>

            <!-- Mes objectifs d'immersion -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="text-base text-[#7C3AED]">🎯</span>
                <div>
                  <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">Mes objectifs d'immersion</h4>
                  <p class="text-[11px] text-gray-400 font-medium">Choisis ou personnalise tes objectifs (1 à 3).</p>
                </div>
              </div>

              <div class="space-y-2 text-xs text-[#0F1035]">
                <label
                  *ngFor="let obj of suggestedObjectives"
                  class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#F8F7FF] transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    [checked]="isObjectiveSelected(obj)"
                    (change)="toggleObjective(obj)"
                    class="mt-0.5 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <span class="leading-snug font-medium">{{ obj }}</span>
                </label>

                <!-- Objectifs personnalisés ajoutés -->
                <div *ngFor="let customObj of project.customObjectives; let idx = index" class="flex items-start justify-between gap-2 p-2 rounded-xl bg-purple-50 text-purple-900">
                  <span class="text-xs font-semibold leading-snug">★ {{ customObj }}</span>
                  <button type="button" (click)="removeCustomObjective(idx)" class="text-gray-400 hover:text-red-500 font-bold text-xs">✕</button>
                </div>

                <!-- Champ ajout libre -->
                <div class="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    [(ngModel)]="newObjectiveInput"
                    placeholder="Ajouter un autre objectif..."
                    (keyup.enter)="addCustomObjective()"
                    class="flex-1 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] px-3 py-1.5 text-xs text-[#0F1035] focus:outline-none focus:border-[#7C3AED]"
                  />
                  <button
                    type="button"
                    (click)="addCustomObjective()"
                    class="w-7 h-7 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-black text-sm hover:bg-[#6D28D9] transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- BLOC B : Mes questions à préparer (4/12) -->
          <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
            <div class="flex items-center gap-2 pb-2 border-b border-[#F0EDFA]">
              <span class="text-lg text-[#7C3AED]">💬</span>
              <div>
                <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">Mes questions à préparer</h3>
                <p class="text-[11px] text-gray-400 font-medium">Des idées de questions à poser pendant ton immersion.</p>
              </div>
            </div>

            <div class="space-y-2 text-xs text-[#0F1035]">
              <label
                *ngFor="let q of suggestedQuestions"
                class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#F8F7FF] transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  [checked]="isQuestionSelected(q)"
                  (change)="toggleQuestion(q)"
                  class="mt-0.5 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span class="leading-snug font-medium">{{ q }}</span>
              </label>

              <!-- Questions personnalisées ajoutées -->
              <div *ngFor="let customQ of project.customQuestions; let idx = index" class="flex items-start justify-between gap-2 p-2 rounded-xl bg-purple-50 text-purple-900">
                <span class="text-xs font-semibold leading-snug">★ {{ customQ }}</span>
                <button type="button" (click)="removeCustomQuestion(idx)" class="text-gray-400 hover:text-red-500 font-bold text-xs">✕</button>
              </div>

              <!-- Champ ajout libre -->
              <div class="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  [(ngModel)]="newQuestionInput"
                  placeholder="Ajouter ma propre question..."
                  (keyup.enter)="addCustomQuestion()"
                  class="flex-1 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] px-3 py-1.5 text-xs text-[#0F1035] focus:outline-none focus:border-[#7C3AED]"
                />
                <button
                  type="button"
                  (click)="addCustomQuestion()"
                  class="w-7 h-7 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-black text-sm hover:bg-[#6D28D9] transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- BLOC C : Mon kit d'immersion téléchargeable (4/12) -->
          <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
            <div class="flex items-center gap-2 pb-2 border-b border-[#F0EDFA]">
              <span class="text-lg text-[#7C3AED]">📚</span>
              <div>
                <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">Mon kit d'immersion</h3>
                <p class="text-[11px] text-gray-400 font-medium">Documents prêts à télécharger et à personnaliser.</p>
              </div>
            </div>

            <div class="space-y-3">
              <!-- Document 1 : Fiche de préparation -->
              <div class="p-3.5 rounded-2xl border border-[#E4E0F5] bg-[#FAF8FF] hover:border-[#7C3AED] transition flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-red-100 text-red-600 font-black text-xs flex items-center justify-center shrink-0">
                    PDF
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold text-[#0F1035]">Fiche de préparation</h4>
                    <p class="text-[10px] text-gray-500">Mes objectifs, mes questions et les points à observer</p>
                  </div>
                </div>
                <button
                  type="button"
                  (click)="downloadDocument('PREP')"
                  class="w-8 h-8 rounded-full bg-white border border-[#DDD6FE] hover:bg-[#7C3AED] hover:text-white text-[#7C3AED] flex items-center justify-center text-sm font-bold transition shadow-2xs shrink-0 cursor-pointer"
                  title="Télécharger"
                >
                  ↓
                </button>
              </div>

              <!-- Document 2 : Carnet d'observation -->
              <div class="p-3.5 rounded-2xl border border-[#E4E0F5] bg-[#FAF8FF] hover:border-[#7C3AED] transition flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-purple-100 text-[#7C3AED] font-black text-xs flex items-center justify-center shrink-0">
                    📓
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold text-[#0F1035]">Carnet d'observation</h4>
                    <p class="text-[10px] text-gray-500">Pour noter mes observations, mes échanges et mes impressions</p>
                  </div>
                </div>
                <button
                  type="button"
                  (click)="downloadDocument('JOURNAL')"
                  class="w-8 h-8 rounded-full bg-white border border-[#DDD6FE] hover:bg-[#7C3AED] hover:text-white text-[#7C3AED] flex items-center justify-center text-sm font-bold transition shadow-2xs shrink-0 cursor-pointer"
                  title="Télécharger"
                >
                  ↓
                </button>
              </div>

              <!-- Document 3 : Exemple de message -->
              <div class="p-3.5 rounded-2xl border border-[#E4E0F5] bg-[#FAF8FF] hover:border-[#7C3AED] transition flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 font-black text-xs flex items-center justify-center shrink-0">
                    ✉️
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold text-[#0F1035]">Exemple de message</h4>
                    <p class="text-[10px] text-gray-500">Modèle d'email pour contacter une entreprise</p>
                  </div>
                </div>
                <button
                  type="button"
                  (click)="downloadDocument('MESSAGE')"
                  class="w-8 h-8 rounded-full bg-white border border-[#DDD6FE] hover:bg-[#7C3AED] hover:text-white text-[#7C3AED] flex items-center justify-center text-sm font-bold transition shadow-2xs shrink-0 cursor-pointer"
                  title="Télécharger"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bandeau Bas : Conseil MonBilan+ et Bouton Enregistrer (Fidèle à la Maquette 2) -->
        <div class="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-2.5 text-xs text-[#92400E]">
            <span class="text-base shrink-0">💡</span>
            <p class="leading-relaxed">
              <strong>Conseil MonBilan+ :</strong> Sois curieux(se), prends des notes et n'hésite pas à poser des questions concrètes. Cela t'aidera à mieux comprendre le métier et à construire la suite de ton parcours.
            </p>
          </div>

          <button
            type="button"
            (click)="savePreparationAndContinue()"
            class="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition cursor-pointer shrink-0 text-center flex items-center justify-center gap-2"
          >
            <span>💾</span>
            <span>Enregistrer ma préparation</span>
          </button>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ÉTAPE 3 : JE RECHERCHE EN ENTREPRISE (Fidèle à la Maquette 3)      -->
      <!-- ================================================================== -->
      <div *ngIf="project.currentStep === 3" class="space-y-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-[#0F1035]">
            3. Je recherche en entreprise
          </h2>
          <p class="text-xs sm:text-sm text-[#42466B] mt-1">
            Trouve une structure près de chez toi et, si besoin, propose une immersion pour découvrir le métier de {{ project.careerTitle }}.
          </p>
        </div>

        <!-- Barre de filtres de l'étape 3 (Maquette 3) -->
        <div class="rounded-[24px] sm:rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <!-- Champ texte -->
            <div class="md:col-span-5 relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]">🔍</span>
              <input
                type="text"
                [(ngModel)]="companySearchTerm"
                (ngModelChange)="onCompanyFilterChanged()"
                placeholder="Rechercher une entreprise (nom, activité, ville...)"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] pl-9 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              />
            </div>

            <!-- Ville -->
            <div class="md:col-span-3 relative">
              <select
                [(ngModel)]="companyFilterCity"
                (ngModelChange)="onCompanyFilterChanged()"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1035] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 pr-8 cursor-pointer"
              >
                <option value="Nice">Nice (06)</option>
                <option value="Carros">Carros (06)</option>
                <option value="Saint-Laurent">Saint-Laurent-du-Var (06)</option>
                <option value="ALL">Tout le département 06</option>
              </select>
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold pointer-events-none">⌄</span>
            </div>

            <!-- Rayon -->
            <div class="md:col-span-2 relative">
              <select
                [(ngModel)]="companyFilterRadius"
                (ngModelChange)="onCompanyFilterChanged()"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1035] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 pr-8 cursor-pointer"
              >
                <option [ngValue]="5">5 km</option>
                <option [ngValue]="10">10 km</option>
                <option [ngValue]="25">25 km</option>
                <option [ngValue]="50">50 km</option>
              </select>
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold pointer-events-none">⌄</span>
            </div>

            <!-- Bouton Rechercher -->
            <div class="md:col-span-2">
              <button
                type="button"
                (click)="onCompanyFilterChanged()"
                class="w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-extrabold text-xs sm:text-sm py-2.5 shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🔍</span>
                <span>Rechercher</span>
              </button>
            </div>
          </div>

          <!-- Ligne filtres secondaires -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EDFA] text-xs">
            <div class="flex items-center gap-3 flex-wrap">
              <!-- Secteur -->
              <div class="flex items-center gap-1.5 font-bold text-[#42466B]">
                <span>Secteur :</span>
                <select
                  [(ngModel)]="companyFilterSector"
                  (ngModelChange)="onCompanyFilterChanged()"
                  class="bg-white border border-[#E4E0F5] rounded-xl px-2.5 py-1 text-xs font-bold text-[#0F1035] outline-none cursor-pointer"
                >
                  <option value="ALL">Tous</option>
                  <option value="creation">Création & Communication</option>
                  <option value="batiment">Bâtiment & Décoration</option>
                  <option value="formation">Organismes & CFA</option>
                </select>
              </div>

              <!-- Statut -->
              <div class="flex items-center gap-1.5 font-bold text-[#42466B]">
                <span>Statut :</span>
                <select
                  [(ngModel)]="companyFilterStatus"
                  (ngModelChange)="onCompanyFilterChanged()"
                  class="bg-white border border-[#E4E0F5] rounded-xl px-2.5 py-1 text-xs font-bold text-[#0F1035] outline-none cursor-pointer"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="IDENTIFIED">Entreprise identifiée</option>
                  <option value="TO_CONFIRM">Immersion possible — à confirmer</option>
                  <option value="CONFIRMED">Accueil confirmé</option>
                  <option value="PARTNER">Partenaire conventionné</option>
                </select>
              </div>

              <!-- Toggle Uniquement avec immersion confirmée -->
              <label class="flex items-center gap-2 font-bold text-[#0F1035] cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="onlyConfirmedImmersion"
                  (ngModelChange)="onCompanyFilterChanged()"
                  class="rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span>Uniquement avec immersion confirmée</span>
              </label>
            </div>

            <!-- Bouton Réinitialiser -->
            <button
              type="button"
              (click)="resetCompanyFilters()"
              class="rounded-xl border border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] font-bold px-3 py-1 text-xs transition cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <!-- Liste des entreprises (Maquette 3) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h3 class="text-base font-extrabold text-[#0F1035]">
              {{ filteredCompaniesList.length }} entreprises trouvées
            </h3>
            <div class="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
              <span>Trier par :</span>
              <span class="font-bold text-[#0F1035]">Pertinence ⌄</span>
            </div>
          </div>

          <!-- Cartes entreprises réelles (Maquette 3) -->
          <div class="space-y-3.5">
            <div
              *ngFor="let comp of filteredCompaniesList"
              class="p-4 sm:p-5 rounded-[24px] bg-white border border-[#E4E0F5] hover:border-[#C4B5FD] shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div class="flex items-start sm:items-center gap-4 min-w-0">
                <!-- Vignette photo -->
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 border border-[#E4E0F5] shrink-0">
                  <img [src]="comp.imageUrl" [alt]="comp.name" class="w-full h-full object-cover" />
                </div>

                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="text-base font-extrabold text-[#0F1035] leading-snug">
                      {{ comp.name }}
                    </h4>
                    <!-- Badge de statut officiel -->
                    <span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border" [ngClass]="comp.statusBadgeClass">
                      {{ comp.statusLabel }}
                    </span>
                  </div>

                  <p class="text-xs font-semibold text-gray-500">
                    {{ comp.sector }}
                  </p>

                  <div class="flex items-center gap-2 text-xs text-gray-400 font-medium flex-wrap">
                    <span>📍 {{ comp.address }}</span>
                    <span>•</span>
                    <span>{{ comp.distanceKm }} km</span>
                  </div>

                  <p class="text-xs text-[#42466B] line-clamp-1 pt-0.5">
                    {{ comp.description }}
                  </p>
                </div>
              </div>

              <!-- Boutons action droite -->
              <div class="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  (click)="toggleCompanyFavorite(comp)"
                  class="w-10 h-10 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-sm transition cursor-pointer"
                  [title]="comp.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                >
                  <span [class]="comp.isFavorite ? 'text-[#7C3AED]' : 'text-gray-400'">
                    <mb-icon name="heart" [filled]="!!comp.isFavorite"></mb-icon>
                  </span>
                </button>

                <button
                  type="button"
                  (click)="selectCompanyForApplication(comp)"
                  class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  Sélectionner cette entreprise →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ÉTAPE 4 : JE CONTACTE L'ENTREPRISE (Fidèle à la Maquette 4)        -->
      <!-- ================================================================== -->
      <div *ngIf="project.currentStep === 4" class="space-y-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-[#0F1035]">
            4. Je contacte l'entreprise
          </h2>
          <p class="text-xs sm:text-sm text-[#42466B] mt-1">
            Prépare et envoie ta demande d'immersion. Suis ensuite la réponse de l'entreprise.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- 4.1 Colonne Gauche : Formulaire de candidature (65% Largeur) -->
          <div class="lg:col-span-8 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
            <!-- En-tête 2 colonnes : Entreprise sélectionnée & Métier visé -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#F0EDFA]">
              <!-- Entreprise -->
              <div class="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5]">
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img [src]="project.selectedCompany?.imageUrl || 'assets/visuals/institutions/atelier-decors.jpg'" alt="" class="w-full h-full object-cover" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Entreprise sélectionnée</span>
                  <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] truncate">{{ project.selectedCompany?.name || 'Atelier Décors & Patines Riviera' }}</h4>
                  <div class="text-[10px] text-gray-500 font-medium">📍 {{ project.selectedCompany?.city || 'Nice Centre (06)' }} • {{ project.selectedCompany?.distanceKm || 2.0 }} km</div>
                </div>
              </div>

              <!-- Métier -->
              <div class="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5]">
                <div class="w-12 h-12 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xl shrink-0">
                  🎨
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Métier visé</span>
                  <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035] truncate">{{ project.careerTitle }}</h4>
                  <div class="text-[10px] text-gray-500 font-medium truncate">{{ project.careerTagline }}</div>
                </div>
              </div>
            </div>

            <!-- Objet de la demande -->
            <div class="space-y-1.5">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                Objet de la demande *
              </label>
              <input
                type="text"
                [(ngModel)]="project.applicationDraft.object"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              />
            </div>

            <!-- Message à l'entreprise -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-extrabold text-[#0F1035]">
                  Message à l'entreprise *
                </label>
                <span class="text-[11px] text-gray-400 font-semibold">
                  {{ project.applicationDraft.body.length }} / 1 000
                </span>
              </div>
              <textarea
                rows="7"
                [(ngModel)]="project.applicationDraft.body"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 text-xs sm:text-sm font-medium text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 leading-relaxed"
              ></textarea>
            </div>

            <!-- Bouton joindre un document -->
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <button
                type="button"
                (click)="simulateAttachCv()"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#0F1035] transition cursor-pointer shadow-2xs"
              >
                <span>📎</span>
                <span>Joindre un document (CV, présentation...)</span>
              </button>
              <span *ngIf="project.applicationDraft.attachedFileName" class="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ✓ {{ project.applicationDraft.attachedFileName }}
              </span>
              <span class="text-[11px] text-gray-400 font-medium">PDF, JPG, PNG (max. 5 Mo)</span>
            </div>

            <!-- Barre d'actions -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F0EDFA]">
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  (click)="saveDraft()"
                  class="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#0F1035] transition cursor-pointer"
                >
                  💾 Enregistrer le brouillon
                </button>
                <button
                  type="button"
                  (click)="openPreviewModal()"
                  class="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#0F1035] transition cursor-pointer"
                >
                  👁️ Prévisualiser
                </button>
              </div>

              <button
                type="button"
                (click)="submitApplication()"
                class="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>✈️</span>
                <span>Enregistrer et suivre ma demande →</span>
              </button>
            </div>
          </div>

          <!-- 4.2 Colonne Droite : Suivi de ma demande (35% Largeur) -->
          <div class="lg:col-span-4 space-y-5">
            <!-- Timeline de statut -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
              <div class="flex items-center gap-2 pb-2 border-b border-[#F0EDFA]">
                <span class="text-base text-[#7C3AED]">📋</span>
                <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">Suivi de ma demande</h3>
              </div>

              <!-- Statuts verticaux -->
              <div class="space-y-3 relative pl-6 text-xs">
                <!-- Ligne verticale -->
                <div class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#E4E0F5]"></div>

                <!-- 1. Brouillon -->
                <div class="relative flex items-start gap-2.5">
                  <span class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                  <div>
                    <h5 class="font-extrabold text-[#0F1035]">Brouillon</h5>
                    <p class="text-[11px] text-gray-500">{{ project.applicationDraft.sentDate || '18 nov. 2026' }} — Message préparé.</p>
                  </div>
                </div>

                <!-- 2. Demande envoyée -->
                <div class="relative flex items-start gap-2.5">
                  <span
                    [class]="project.applicationDraft.status !== 'DRAFT' ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 text-gray-400 border border-gray-300'"
                    class="absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  >
                    {{ project.applicationDraft.status !== 'DRAFT' ? '✓' : '○' }}
                  </span>
                  <div>
                    <h5 [class]="project.applicationDraft.status !== 'DRAFT' ? 'text-[#7C3AED] font-extrabold' : 'text-gray-400 font-semibold'">Demande envoyée</h5>
                    <p class="text-[11px] text-gray-500">Envoi à l'entreprise.</p>
                  </div>
                </div>

                <!-- 3. En attente de réponse -->
                <div class="relative flex items-start gap-2.5">
                  <span
                    [class]="project.applicationDraft.status === 'WAITING' || project.applicationDraft.status === 'ACCEPTED' ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 text-gray-400 border border-gray-300'"
                    class="absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  >
                    {{ project.applicationDraft.status === 'ACCEPTED' ? '✓' : '○' }}
                  </span>
                  <div>
                    <h5 class="font-semibold text-gray-700">En attente de réponse</h5>
                    <p class="text-[11px] text-gray-500">L'entreprise examine ma demande.</p>
                  </div>
                </div>

                <!-- 4. Acceptée -->
                <div class="relative flex items-start gap-2.5">
                  <span
                    [class]="project.applicationDraft.status === 'ACCEPTED' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 border border-gray-300'"
                    class="absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  >
                    {{ project.applicationDraft.status === 'ACCEPTED' ? '✓' : '○' }}
                  </span>
                  <div>
                    <h5 class="font-semibold text-gray-700">Acceptée</h5>
                    <p class="text-[11px] text-gray-500">Immersion confirmée.</p>
                  </div>
                </div>
              </div>

              <!-- Simuler la confirmation entreprise pour la démo jury -->
              <div class="pt-3 border-t border-[#F0EDFA]">
                <button
                  type="button"
                  (click)="simulateCompanyAcceptance()"
                  class="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] text-xs font-bold transition cursor-pointer"
                >
                  ⚡ Confirmer l'accord entreprise & passer à l'immersion →
                </button>
              </div>
            </div>

            <!-- Bloc Convention / Autorisation -->
            <div class="rounded-[28px] bg-amber-50/70 border border-amber-200 p-5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-[#92400E] flex items-center gap-1.5">
                  <span>📄</span>
                  <span>Convention / Autorisation</span>
                </span>
                <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  À préparer
                </span>
              </div>
              <p class="text-xs text-[#92400E] leading-relaxed">
                Si l'entreprise accepte, prépare avec ton conseiller : la convention de stage (obligatoire), les autorisations (parents si besoin), les dates et conditions d'accueil.
              </p>
            </div>

            <!-- Bloc Conseil de ton coach -->
            <div class="rounded-[28px] bg-[#F5F3FF] border border-[#DDD6FE] p-5 space-y-1.5">
              <span class="text-xs font-extrabold text-[#6D28D9] flex items-center gap-1.5">
                <span>✨</span>
                <span>Conseil de ton coach</span>
              </span>
              <p class="text-xs text-[#4C1D95] leading-relaxed">
                Ton message est clair et poli. Tu peux préciser tes dates de disponibilité et ajouter ton CV si tu en as un.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ÉTAPE 5 : JE RÉALISE MON IMMERSION (Fidèle à la Maquette 5)        -->
      <!-- ================================================================== -->
      <div *ngIf="project.currentStep === 5" class="space-y-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-[#0F1035]">
            5. Je réalise mon immersion
          </h2>
          <p class="text-xs sm:text-sm text-[#42466B] mt-1">
            Renseigne ton carnet d'observation au fur et à mesure de ton expérience en entreprise.
          </p>
        </div>

        <!-- Bandeau supérieur 3 blocs (Maquette 5) -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- Bloc 1 : Entreprise -->
          <div class="md:col-span-5 rounded-[24px] bg-white border border-[#E4E0F5] p-4 shadow-sm flex items-center gap-3.5">
            <div class="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
              <img [src]="project.selectedCompany?.imageUrl || 'assets/visuals/institutions/atelier-decors.jpg'" alt="" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h3 class="text-sm font-extrabold text-[#0F1035] truncate">{{ project.selectedCompany?.name || 'Atelier Décors & Patines Riviera' }}</h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ Immersion confirmée
                </span>
              </div>
              <p class="text-xs text-gray-500 font-medium">📍 {{ project.selectedCompany?.address || '18 rue Lepante, 06000 Nice' }}</p>
              <p class="text-[11px] text-[#7C3AED] font-bold truncate">{{ project.careerTagline }}</p>
            </div>
          </div>

          <!-- Bloc 2 : Période -->
          <div class="md:col-span-3 rounded-[24px] bg-white border border-[#E4E0F5] p-4 shadow-sm flex flex-col justify-center space-y-1">
            <span class="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <span>📅</span>
              <span>Période d'immersion</span>
            </span>
            <p class="text-xs font-extrabold text-[#0F1035]">
              Du lun. 24 nov. 2026 au mer. 26 nov. 2026 (3 jours)
            </p>
          </div>

          <!-- Bloc 3 : Progression jauge verte -->
          <div class="md:col-span-4 rounded-[24px] bg-[#ECFDF5] border border-[#A7F3D0] p-4 shadow-sm flex flex-col justify-center space-y-2">
            <div class="flex items-center justify-between text-xs font-extrabold text-emerald-900">
              <span class="flex items-center gap-1.5">
                <span class="text-emerald-600">▶</span>
                <span>Immersion en cours</span>
              </span>
              <span>1/3 jours réalisés</span>
            </div>
            <div class="w-full bg-emerald-200/70 h-2.5 rounded-full overflow-hidden">
              <div class="bg-[#7C3AED] h-full rounded-full transition-all" style="width: 33%"></div>
            </div>
          </div>
        </div>

        <!-- Corps de l'étape 5 (Maquette 5) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Colonne Gauche : Mon carnet d'observation (65% Largeur) -->
          <div class="lg:col-span-8 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xl text-[#7C3AED]">📓</span>
                <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035]">Mon carnet d'observation</h3>
              </div>
              <button
                type="button"
                (click)="openObservationModal()"
                class="px-4 py-2 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>+</span>
                <span>Ajouter une observation</span>
              </button>
            </div>

            <!-- État vide (Maquette 5) si aucune observation -->
            <div
              *ngIf="project.journalEntries.length === 0"
              class="rounded-3xl bg-[#FAF8FF] border border-[#E4E0F5] p-8 text-center space-y-4"
            >
              <div class="w-20 h-20 rounded-2xl bg-white shadow-sm border border-[#DDD6FE] flex items-center justify-center text-4xl mx-auto">
                📖
              </div>
              <div class="space-y-1">
                <h4 class="text-sm font-extrabold text-[#0F1035]">Aucune observation pour le moment</h4>
                <p class="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Ajoute tes premières notes pour décrire ce que tu découvres (activités, outils, ambiance, ce qui t'étonne, tes questions...).
                </p>
              </div>
              <button
                type="button"
                (click)="openObservationModal()"
                class="px-6 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>+</span>
                <span>Ajouter une observation</span>
              </button>
            </div>

            <!-- Liste des observations si existantes -->
            <div *ngIf="project.journalEntries.length > 0" class="space-y-3.5">
              <div
                *ngFor="let obs of project.journalEntries; let i = index"
                class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-2 relative"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-[#7C3AED]">Jour {{ obs.dayNumber }} — {{ obs.date }}</span>
                  <button type="button" (click)="deleteObservation(i)" class="text-xs text-gray-400 hover:text-red-500 font-bold">✕ Supprimer</button>
                </div>
                <div class="space-y-1 text-xs text-[#42466B]">
                  <p *ngIf="obs.activites"><strong>Activités :</strong> {{ obs.activites }}</p>
                  <p *ngIf="obs.liked"><strong>Ce qui m'a plu :</strong> {{ obs.liked }}</p>
                  <p *ngIf="obs.surprises"><strong>Ce qui m'a surpris :</strong> {{ obs.surprises }}</p>
                  <p *ngIf="obs.questions"><strong>Questions posées :</strong> {{ obs.questions }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne Droite : Mon suivi d'immersion (35% Largeur) -->
          <div class="lg:col-span-4 space-y-5">
            <!-- Suivi d'immersion -->
            <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
              <div class="flex items-center gap-2 pb-2 border-b border-[#F0EDFA]">
                <span class="text-base text-[#7C3AED]">📅</span>
                <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">Mon suivi d'immersion</h3>
              </div>

              <div class="space-y-3 relative pl-6 text-xs">
                <div class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#E4E0F5]"></div>

                <div class="relative flex items-start gap-2.5">
                  <span class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                  <div>
                    <h5 class="font-extrabold text-[#0F1035]">Immersion confirmée</h5>
                    <p class="text-[11px] text-gray-500">Le 20 nov. 2026</p>
                  </div>
                </div>

                <div class="relative flex items-start gap-2.5">
                  <span class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] font-bold">◉</span>
                  <div>
                    <h5 class="font-extrabold text-[#7C3AED]">Immersion en cours</h5>
                    <p class="text-[11px] text-gray-500">Du 24 au 26 nov. 2026</p>
                  </div>
                </div>

                <div class="relative flex items-start gap-2.5">
                  <span class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-gray-100 text-gray-400 border border-gray-300 flex items-center justify-center text-[10px] font-bold">○</span>
                  <div>
                    <h5 class="font-semibold text-gray-700">Bilan à compléter</h5>
                    <p class="text-[11px] text-gray-500">À la fin de l'immersion</p>
                  </div>
                </div>
              </div>

              <!-- Bouton pour passer à l'étape 6 -->
              <div class="pt-3 border-t border-[#F0EDFA]">
                <button
                  type="button"
                  (click)="goToStep(6)"
                  class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs font-extrabold shadow-sm transition cursor-pointer text-center"
                >
                  Terminer mon stage et faire le bilan →
                </button>
              </div>
            </div>

            <!-- Signaler une immersion annulée ou interrompue -->
            <button
              type="button"
              (click)="signalInterruption()"
              class="w-full p-4 rounded-2xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition cursor-pointer flex items-center justify-between gap-2 shadow-2xs"
            >
              <span class="flex items-center gap-2">
                <span>🚩</span>
                <span>Signaler une immersion annulée ou interrompue</span>
              </span>
              <span>›</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ÉTAPE 6 : JE FAIS LE BILAN                                         -->
      <!-- ================================================================== -->
      <div *ngIf="project.currentStep === 6" class="space-y-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-[#0F1035]">
            6. Je fais le bilan de mon immersion
          </h2>
          <p class="text-xs sm:text-sm text-[#42466B] mt-1">
            Prends quelques minutes pour faire le point sur ce que cette expérience t'a appris.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Colonne Gauche : Formulaire réflexif en 7 points (65% Largeur) -->
          <div class="lg:col-span-8 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
            <!-- 1. Découverte -->
            <div class="space-y-1.5">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                1. Qu'as-tu découvert concrètement pendant ce stage ?
              </label>
              <textarea
                rows="2"
                [(ngModel)]="project.review.discovered"
                placeholder="Ex : Les techniques de préparation, les outils spécifiques, l'ambiance..."
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 text-xs text-[#0F1035] focus:outline-none focus:border-[#7C3AED]"
              ></textarea>
            </div>

            <!-- 2. Ce que j'ai aimé -->
            <div class="space-y-1.5">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                2. Qu'est-ce qui t'a le plus plu ou motivé(e) ?
              </label>
              <textarea
                rows="2"
                [(ngModel)]="project.review.liked"
                placeholder="Ex : Le travail manuel, la précision, le fait de travailler en équipe..."
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 text-xs text-[#0F1035] focus:outline-none focus:border-[#7C3AED]"
              ></textarea>
            </div>

            <!-- 3. Ce qui m'a surpris -->
            <div class="space-y-1.5">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                3. Y a-t-il des aspects qui t'ont surpris(e) ?
              </label>
              <textarea
                rows="2"
                [(ngModel)]="project.review.surprises"
                placeholder="Ex : Le temps passé à préparer avant d'appliquer la couleur..."
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 text-xs text-[#0F1035] focus:outline-none focus:border-[#7C3AED]"
              ></textarea>
            </div>

            <!-- 4. Choix d'approfondissement -->
            <div class="space-y-2 pt-2">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                4. Souhaites-tu approfondir ce métier ?
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  (click)="project.review.pursueChoice = 'YES'"
                  [class]="project.review.pursueChoice === 'YES' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-[#F8F7FF] text-[#0F1035] border border-[#E4E0F5] font-semibold'"
                  class="p-3 rounded-2xl transition cursor-pointer text-center"
                >
                  Oui, je souhaite approfondir ce métier
                </button>
                <button
                  type="button"
                  (click)="project.review.pursueChoice = 'UNDECIDED'"
                  [class]="project.review.pursueChoice === 'UNDECIDED' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-[#F8F7FF] text-[#0F1035] border border-[#E4E0F5] font-semibold'"
                  class="p-3 rounded-2xl transition cursor-pointer text-center"
                >
                  Je ne sais pas encore
                </button>
                <button
                  type="button"
                  (click)="project.review.pursueChoice = 'ANOTHER_TRACK'"
                  [class]="project.review.pursueChoice === 'ANOTHER_TRACK' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-[#F8F7FF] text-[#0F1035] border border-[#E4E0F5] font-semibold'"
                  class="p-3 rounded-2xl transition cursor-pointer text-center"
                >
                  Je préfère explorer une autre piste
                </button>
              </div>
            </div>

            <!-- 5. Questions pour le conseiller -->
            <div class="space-y-1.5 pt-2">
              <label class="block text-xs font-extrabold text-[#0F1035]">
                5. Quelles questions souhaites-tu poser à ton conseiller ?
              </label>
              <textarea
                rows="2"
                [(ngModel)]="project.review.questionsForCounselor"
                placeholder="Ex : Quels lycées ou CFA proposent ce diplôme en alternance à Nice ?"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 text-xs text-[#0F1035] focus:outline-none focus:border-[#7C3AED]"
              ></textarea>
            </div>

            <!-- Partage avec le conseiller -->
            <div class="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center justify-between gap-4">
              <div class="space-y-0.5">
                <span class="text-xs font-extrabold text-[#6D28D9]">Partager ce bilan avec mon conseiller</span>
                <p class="text-[11px] text-gray-500">Ton conseiller du Centre des Possibles pourra relire tes impressions pour votre prochain rendez-vous.</p>
              </div>
              <input
                type="checkbox"
                [(ngModel)]="project.review.isSharedWithCounselor"
                class="h-5 w-5 rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
              />
            </div>

            <!-- Boutons de validation -->
            <div class="flex items-center justify-between gap-3 pt-3 border-t border-[#F0EDFA]">
              <button
                type="button"
                (click)="downloadBilanPdf()"
                class="px-5 py-2.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#0F1035] transition cursor-pointer"
              >
                📥 Télécharger mon bilan PDF
              </button>

              <button
                type="button"
                (click)="finalizeReview()"
                class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition cursor-pointer"
              >
                Valider et enregistrer mon bilan
              </button>
            </div>
          </div>

          <!-- Colonne Droite : Synthèse d'immersion (35% Largeur) -->
          <div class="lg:col-span-4 rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
            <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035] pb-2 border-b border-[#F0EDFA]">
              Récapitulatif de l'immersion
            </h3>

            <div class="space-y-3 text-xs">
              <div>
                <span class="text-gray-400 font-bold block">Métier exploré</span>
                <span class="font-extrabold text-[#0F1035] text-sm">{{ project.careerTitle }}</span>
              </div>
              <div>
                <span class="text-gray-400 font-bold block">Entreprise</span>
                <span class="font-bold text-[#0F1035]">{{ project.selectedCompany?.name || 'Atelier Décors & Patines Riviera' }}</span>
              </div>
              <div>
                <span class="text-gray-400 font-bold block">Période</span>
                <span class="font-bold text-[#0F1035]">3 jours (24 au 26 nov. 2026)</span>
              </div>
              <div>
                <span class="text-gray-400 font-bold block">Notes d'observation</span>
                <span class="font-bold text-emerald-700">{{ project.journalEntries.length }} note(s) enregistrée(s)</span>
              </div>
            </div>

            <div *ngIf="project.review.isSharedWithCounselor" class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <span>✓</span>
              <span>Transmis au conseiller référent</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE : AJOUTER UNE OBSERVATION (Étape 5)                         -->
      <!-- ================================================================== -->
      <div
        *ngIf="showObservationModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div class="bg-white w-full max-w-lg rounded-[28px] p-6 shadow-2xl border border-[#E4E0F5] space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
            <h3 class="text-base font-extrabold text-[#0F1035]">Ajouter une observation</h3>
            <button type="button" (click)="showObservationModal = false" class="text-gray-400 hover:text-gray-600 font-bold">✕</button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Jour & Date</label>
              <input
                type="text"
                [(ngModel)]="newObsDate"
                class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] px-3 py-2 text-xs font-semibold text-[#0F1035]"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Activités découvertes ou observées</label>
              <textarea
                rows="2"
                [(ngModel)]="newObsActivites"
                placeholder="Ce que j'ai vu ou fait aujourd'hui..."
                class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] p-2.5 text-xs text-[#0F1035]"
              ></textarea>
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Ce qui m'a plu</label>
              <textarea
                rows="2"
                [(ngModel)]="newObsLiked"
                placeholder="Un geste, un outil, une ambiance..."
                class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] p-2.5 text-xs text-[#0F1035]"
              ></textarea>
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Ce qui m'a surpris ou questionné</label>
              <textarea
                rows="2"
                [(ngModel)]="newObsSurprises"
                placeholder="Une difficulté, un point inattendu..."
                class="w-full rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] p-2.5 text-xs text-[#0F1035]"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#F0EDFA]">
            <button
              type="button"
              (click)="showObservationModal = false"
              class="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="saveNewObservation()"
              class="px-5 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-extrabold hover:bg-[#6D28D9]"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE : PRÉVISUALISATION COURRIER (Étape 4)                       -->
      <!-- ================================================================== -->
      <div
        *ngIf="showPreviewModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div class="bg-white w-full max-w-xl rounded-[28px] p-6 shadow-2xl border border-[#E4E0F5] space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
            <h3 class="text-base font-extrabold text-[#0F1035]">Aperçu de la demande</h3>
            <button type="button" (click)="showPreviewModal = false" class="text-gray-400 hover:text-gray-600 font-bold">✕</button>
          </div>

          <div class="p-4 rounded-2xl bg-[#FAF8FF] border border-[#DDD6FE] space-y-3 text-xs leading-relaxed text-[#0F1035]">
            <p><strong>Destinataire :</strong> {{ project.selectedCompany?.name }} ({{ project.selectedCompany?.contactEmail }})</p>
            <p><strong>Objet :</strong> {{ project.applicationDraft.object }}</p>
            <div class="whitespace-pre-line border-t border-gray-200 pt-3">{{ project.applicationDraft.body }}</div>
            <div *ngIf="project.applicationDraft.attachedFileName" class="text-[11px] font-bold text-[#7C3AED]">
              📎 Pièce jointe : {{ project.applicationDraft.attachedFileName }}
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="button"
              (click)="showPreviewModal = false"
              class="px-5 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-extrabold"
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImmersionProComponent implements OnInit {
  @Input() careers: any[] = [];
  @Output() viewDetail = new EventEmitter<any>();

  steps: UIImmersionStep[] = IMMERSION_STEPS;
  project: UIImmersionProject = { ...INITIAL_IMMERSION_PROJECT };

  // Étape 1 : Catalogue métiers
  searchCareerTerm = '';
  selectedCareerDomain = 'ALL';
  filteredCareersList: UIImmersionCareer[] = [];
  selectedCareerPreview: UIImmersionCareer = IMMERSION_CAREERS_CATALOG[0];
  activeCareerTab: 'PRES' | 'IMAGE' | 'FORM' | 'TEMO' = 'PRES';

  // Étape 2 : Préparation
  suggestedObjectives: string[] = [
    'Observer les techniques de préparation et d’application.',
    'Découvrir l’organisation et les conditions de travail.',
    'Échanger avec un professionnel sur son parcours.',
    'Comprendre les compétences attendues.'
  ];
  suggestedQuestions: string[] = [
    'Quelles sont les étapes clés d’un chantier ?',
    'Quels outils et matériaux utilisez-vous ?',
    'Quelles compétences sont les plus importantes ?',
    'Quel parcours vous a mené à ce métier ?',
    'Quels conseils pour un jeune qui débute ?'
  ];
  newObjectiveInput = '';
  newQuestionInput = '';

  // Étape 3 : Entreprises
  companySearchTerm = '';
  companyFilterCity = 'Nice';
  companyFilterRadius = 10;
  companyFilterSector = 'ALL';
  companyFilterStatus = 'ALL';
  onlyConfirmedImmersion = false;
  filteredCompaniesList: UIPartnerCompany[] = [];

  // Modales
  showObservationModal = false;
  showPreviewModal = false;
  newObsDate = 'Jour 1 — 24 nov. 2026';
  newObsActivites = '';
  newObsLiked = '';
  newObsSurprises = '';

  private readonly STORAGE_KEY = 'monbilan_immersion_project_2187';

  ngOnInit(): void {
    this.filteredCareersList = [...IMMERSION_CAREERS_CATALOG];
    this.filteredCompaniesList = [...IMMERSION_COMPANIES_DATA];
    this.loadPersistedProject();
  }

  // --------------------------------------------------------------------------
  // Persistance et navigation
  // --------------------------------------------------------------------------
  private loadPersistedProject(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.project = { ...this.project, ...parsed };
      }
    } catch {
      // Ignorer
    }
  }

  private saveProject(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.project));
    } catch {
      // Ignorer
    }
  }

  goToStep(stepNumber: number): void {
    this.project.currentStep = stepNumber;
    this.saveProject();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  isStepCompleted(stepNumber: number): boolean {
    return this.project.completedSteps?.includes(stepNumber) || stepNumber < this.project.currentStep;
  }

  getStepEmoji(stepNumber: number): string {
    switch (stepNumber) {
      case 1: return '👓';
      case 2: return '📅';
      case 3: return '🏢';
      case 4: return '✈️';
      case 5: return '⛑️';
      case 6: return '✅';
      default: return '📍';
    }
  }

  // --------------------------------------------------------------------------
  // Étape 1 : Découverte du métier
  // --------------------------------------------------------------------------
  onCareerFilterChanged(): void {
    let list = [...IMMERSION_CAREERS_CATALOG];
    if (this.selectedCareerDomain !== 'ALL') {
      list = list.filter((c) => c.domain === this.selectedCareerDomain);
    }
    if (this.searchCareerTerm && this.searchCareerTerm.trim().length > 0) {
      const q = this.searchCareerTerm.trim().toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.shortSummary.toLowerCase().includes(q)
      );
    }
    this.filteredCareersList = list;
  }

  selectCareerDomain(domain: string): void {
    this.selectedCareerDomain = domain;
    this.onCareerFilterChanged();
  }

  selectCareerPreview(career: UIImmersionCareer): void {
    this.selectedCareerPreview = career;
  }

  confirmCareerSelection(career: UIImmersionCareer): void {
    this.project.careerId = career.id;
    this.project.careerTitle = career.title;
    this.project.careerTagline = career.tagline;
    this.project.careerImage = career.heroImage;
    if (!this.project.completedSteps.includes(1)) {
      this.project.completedSteps.push(1);
    }
    this.project.currentStep = 2;
    this.saveProject();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  toggleCareerFavorite(career: UIImmersionCareer): void {
    career.isFavorite = !career.isFavorite;
  }

  getCareerIcon(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('peintre')) return '🎨';
    if (t.includes('graphiste')) return '💻';
    if (t.includes('son') || t.includes('audiovisuel')) return '🎧';
    if (t.includes('menuisier')) return '🪵';
    if (t.includes('électr')) return '⚡';
    return '💼';
  }

  // --------------------------------------------------------------------------
  // Étape 2 : Préparation
  // --------------------------------------------------------------------------
  isObjectiveSelected(obj: string): boolean {
    return this.project.selectedObjectives?.includes(obj);
  }

  toggleObjective(obj: string): void {
    if (this.isObjectiveSelected(obj)) {
      this.project.selectedObjectives = this.project.selectedObjectives.filter((o) => o !== obj);
    } else {
      this.project.selectedObjectives.push(obj);
    }
    this.saveProject();
  }

  addCustomObjective(): void {
    if (this.newObjectiveInput && this.newObjectiveInput.trim().length > 0) {
      this.project.customObjectives.push(this.newObjectiveInput.trim());
      this.newObjectiveInput = '';
      this.saveProject();
    }
  }

  removeCustomObjective(index: number): void {
    this.project.customObjectives.splice(index, 1);
    this.saveProject();
  }

  isQuestionSelected(q: string): boolean {
    return this.project.selectedQuestions?.includes(q);
  }

  toggleQuestion(q: string): void {
    if (this.isQuestionSelected(q)) {
      this.project.selectedQuestions = this.project.selectedQuestions.filter((item) => item !== q);
    } else {
      this.project.selectedQuestions.push(q);
    }
    this.saveProject();
  }

  addCustomQuestion(): void {
    if (this.newQuestionInput && this.newQuestionInput.trim().length > 0) {
      this.project.customQuestions.push(this.newQuestionInput.trim());
      this.newQuestionInput = '';
      this.saveProject();
    }
  }

  removeCustomQuestion(index: number): void {
    this.project.customQuestions.splice(index, 1);
    this.saveProject();
  }

  downloadDocument(type: 'PREP' | 'JOURNAL' | 'MESSAGE'): void {
    let filename = '';
    let content = '';

    if (type === 'PREP') {
      filename = `Fiche_de_preparation_immersion_${this.project.youngName.replace(' ', '_')}.txt`;
      content = `====================================================================
FICHE DE PRÉPARATION D'IMMERSION PROFESSIONNELLE — MONBILAN+
Dossier Jeune : ${this.project.youngName} (Rdv 2187 — Centre des Possibles)
Métier ciblé : ${this.project.careerTitle}
====================================================================

1. MES OBJECTIFS D'IMMERSION :
${this.project.selectedObjectives.map((o, i) => `  ${i + 1}. ${o}`).join('\n')}
${this.project.customObjectives.map((o) => `  * ${o}`).join('\n')}

2. MES QUESTIONS PRÉPARÉES POUR LE PROFESSIONNEL :
${this.project.selectedQuestions.map((q, i) => `  ${i + 1}. ${q}`).join('\n')}
${this.project.customQuestions.map((q) => `  * ${q}`).join('\n')}

3. CONSEILS POUR MON STAGE :
- Présente-toi avec politesse et ponctualité.
- Prends des notes dans ton carnet d'observation chaque soir.
- Demande l'autorisation avant de prendre des photos.
====================================================================`;
    } else if (type === 'JOURNAL') {
      filename = `Carnet_observation_immersion_${this.project.careerTitle.replace(' ', '_')}.txt`;
      content = `====================================================================
CARNET D'OBSERVATION EN ENTREPRISE — MONBILAN+
Jeune : ${this.project.youngName} | Métier : ${this.project.careerTitle}
Entreprise d'accueil : ${this.project.selectedCompany?.name || 'Entreprise partenaire'}
====================================================================

JOUR 1 :
- Activités découvertes : ..........................................
- Ce qui m'a surpris : ..............................................
- Ce que j'ai aimé : ...............................................
- Questions posées : ...............................................

JOUR 2 :
- Activités découvertes : ..........................................
- Ce qui m'a surpris : ..............................................
- Ce que j'ai aimé : ...............................................
- Questions posées : ...............................................

JOUR 3 :
- Activités découvertes : ..........................................
- Bilan général et impression : ....................................
====================================================================`;
    } else {
      filename = `Modele_message_contact_entreprise.txt`;
      content = `${this.project.applicationDraft.body}`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  savePreparationAndContinue(): void {
    if (!this.project.completedSteps.includes(2)) {
      this.project.completedSteps.push(2);
    }
    this.project.currentStep = 3;
    this.saveProject();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // Étape 3 : Entreprise
  // --------------------------------------------------------------------------
  onCompanyFilterChanged(): void {
    let list = [...IMMERSION_COMPANIES_DATA];
    if (this.companyFilterCity !== 'ALL') {
      list = list.filter((c) => c.city.toLowerCase().includes(this.companyFilterCity.toLowerCase()));
    }
    if (this.companyFilterRadius && this.companyFilterRadius > 0) {
      list = list.filter((c) => c.distanceKm <= this.companyFilterRadius);
    }
    if (this.companyFilterStatus !== 'ALL') {
      list = list.filter((c) => c.status === this.companyFilterStatus);
    }
    if (this.onlyConfirmedImmersion) {
      list = list.filter((c) => c.hasImmersionConfirmed);
    }
    if (this.companySearchTerm && this.companySearchTerm.trim().length > 0) {
      const q = this.companySearchTerm.trim().toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    this.filteredCompaniesList = list;
  }

  resetCompanyFilters(): void {
    this.companySearchTerm = '';
    this.companyFilterCity = 'Nice';
    this.companyFilterRadius = 10;
    this.companyFilterSector = 'ALL';
    this.companyFilterStatus = 'ALL';
    this.onlyConfirmedImmersion = false;
    this.onCompanyFilterChanged();
  }

  toggleCompanyFavorite(comp: UIPartnerCompany): void {
    comp.isFavorite = !comp.isFavorite;
  }

  selectCompanyForApplication(comp: UIPartnerCompany): void {
    this.project.selectedCompany = comp;
    if (!this.project.completedSteps.includes(3)) {
      this.project.completedSteps.push(3);
    }
    this.project.currentStep = 4;
    this.saveProject();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // Étape 4 : Candidature
  // --------------------------------------------------------------------------
  simulateAttachCv(): void {
    this.project.applicationDraft.attachedFileName = 'CV_Emma_D.pdf';
    this.saveProject();
  }

  saveDraft(): void {
    this.project.applicationDraft.status = 'DRAFT';
    this.saveProject();
    alert('Brouillon de candidature enregistré avec succès !');
  }

  openPreviewModal(): void {
    this.showPreviewModal = true;
  }

  submitApplication(): void {
    this.project.applicationDraft.status = 'WAITING';
    this.project.applicationDraft.sentDate = '18 nov. 2026';
    if (!this.project.completedSteps.includes(4)) {
      this.project.completedSteps.push(4);
    }
    this.saveProject();
    alert('Demande enregistrée ! L’état de suivi a été mis à jour.');
  }

  simulateCompanyAcceptance(): void {
    this.project.applicationDraft.status = 'ACCEPTED';
    if (!this.project.completedSteps.includes(4)) {
      this.project.completedSteps.push(4);
    }
    this.project.currentStep = 5;
    this.saveProject();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // Étape 5 : Immersion en cours & Carnet
  // --------------------------------------------------------------------------
  openObservationModal(): void {
    this.newObsDate = `Jour ${this.project.journalEntries.length + 1} — 24 nov. 2026`;
    this.newObsActivites = '';
    this.newObsLiked = '';
    this.newObsSurprises = '';
    this.showObservationModal = true;
  }

  saveNewObservation(): void {
    const entry: UIObservationEntry = {
      id: 'obs-' + Date.now(),
      dayNumber: this.project.journalEntries.length + 1,
      date: this.newObsDate,
      activites: this.newObsActivites,
      liked: this.newObsLiked,
      surprises: this.newObsSurprises,
      questions: ''
    };
    this.project.journalEntries.push(entry);
    this.showObservationModal = false;
    this.saveProject();
  }

  deleteObservation(index: number): void {
    if (confirm('Supprimer cette observation de ton carnet ?')) {
      this.project.journalEntries.splice(index, 1);
      this.saveProject();
    }
  }

  signalInterruption(): void {
    if (confirm('Souhaites-tu signaler une interruption ou un problème concernant ton stage à ton conseiller ?')) {
      alert('Signalement transmis à ton conseiller référent (Centre des Possibles).');
    }
  }

  // --------------------------------------------------------------------------
  // Étape 6 : Bilan
  // --------------------------------------------------------------------------
  downloadBilanPdf(): void {
    const content = `====================================================================
BILAN D'IMMERSION PROFESSIONNELLE — MONBILAN+
Jeune : ${this.project.youngName} (Dossier Rdv 2187)
Métier observé : ${this.project.careerTitle}
Entreprise accueillante : ${this.project.selectedCompany?.name || 'Atelier Décors & Patines Riviera'}
====================================================================

1. DÉCOUVERTES CONCRÈTES :
${this.project.review.discovered || 'Non renseigné'}

2. CE QUI M'A LE PLUS PLU :
${this.project.review.liked || 'Non renseigné'}

3. ASPECTS SURPRENANTS :
${this.project.review.surprises || 'Non renseigné'}

4. SOUHAIT D'APPROFONDISSEMENT :
${this.project.review.pursueChoice === 'YES' ? 'Oui, je souhaite approfondir ce métier' : (this.project.review.pursueChoice === 'UNDECIDED' ? 'Indécis(e)' : 'Je préfère explorer une autre piste')}

5. QUESTIONS POUR LE CONSEILLER :
${this.project.review.questionsForCounselor || 'Non renseigné'}

Observations enregistrées dans le carnet : ${this.project.journalEntries.length}
Bilan partagé avec le conseiller : ${this.project.review.isSharedWithCounselor ? 'OUI' : 'NON'}
====================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bilan_Immersion_${this.project.careerTitle.replace(' ', '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  finalizeReview(): void {
    if (!this.project.completedSteps.includes(5)) {
      this.project.completedSteps.push(5);
    }
    if (!this.project.completedSteps.includes(6)) {
      this.project.completedSteps.push(6);
    }
    this.project.status = 'COMPLETED';
    this.saveProject();
    alert('Bilan d’immersion enregistré avec succès ! Vos retours ont été sauvegardés.');
  }
}
