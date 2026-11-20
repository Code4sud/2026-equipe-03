// ============================================================================
// MonBilan+ — Module « Immersion Pro » pour le Jeune Autonome
// Parcours épuré et rassurant en 4 étapes (Fidèle à la maquette officielle) :
// 1. Je découvre un métier (Hero Card Peintre décorateur + 3 onglets d'activités)
// 2. Je prépare mon immersion (Intentions, Disponibilités souples sans convention)
// 3. Je contacte une entreprise (Structures 06 réelles, Coach IA & Suivi démarches)
// 4. Je fais le bilan (Message d'attente OU Questionnaire réflexif d'expérience)
// Assistant contextuel latéral : « Besoin d'un coup de main ? »
// ============================================================================

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveDraftItem } from '../../shared/autonomous-data';
import {
  IMMERSION_CAREERS_CATALOG,
  IMMERSION_COMPANIES_DATA,
  INITIAL_IMMERSION_PROJECT,
  UIImmersionCareer,
  UIImmersionProject,
  UIPartnerCompany
} from '../../shared/immersion-data';

export type ImmersionActiveTab = 1 | 2 | 3 | 4;

export interface ContactProgressStep {
  id: string;
  label: string;
  completed: boolean;
}

@Component({
  selector: 'app-immersion-pro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">

      <!-- ================================================================== -->
      <!-- 1. EN-TÊTE : FIL D'ARIANE, TITRE & PROGRESSION EN 4 ÉTAPES         -->
      <!-- ================================================================== -->
      <div class="space-y-4">
        <!-- Fil d'Ariane -->
        <div class="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6B7280]">
          <button
            type="button"
            (click)="goToStep(1)"
            class="text-[#7C3AED] hover:text-[#6D28D9] font-bold transition cursor-pointer flex items-center gap-1"
          >
            <span>← Immersion Pro</span>
          </button>
          <span>&gt;</span>
          <span class="text-[#0F1035] font-extrabold">{{ getStepBreadcrumb() }}</span>
        </div>

        <!-- Titre & Sous-titre -->
        <div class="flex items-center gap-3.5">
          <div class="h-12 w-12 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-2xl font-bold border border-[#E9D5FF] shrink-0 shadow-2xs">
            💼
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#0F1035] tracking-tight">
              Immersion Pro
            </h1>
            <p class="text-xs sm:text-sm text-[#42466B] font-medium mt-0.5">
              Découvre un métier, puis passe à l'action pour le découvrir en entreprise.
            </p>
          </div>
        </div>

        <!-- Stepper en 4 étapes reliées par des lignes (Identique à la maquette) -->
        <div class="flex items-center justify-between relative px-2 sm:px-6 py-2 overflow-x-auto">
          <!-- Ligne grise d'arrière-plan -->
          <div class="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#E4E0F5] -z-0"></div>

          <!-- Étape 1 -->
          <button
            type="button"
            (click)="goToStep(1)"
            [class]="activeStep === 1
              ? 'bg-[#7C3AED] text-white shadow-md ring-4 ring-[#EDE9FE]'
              : (activeStep > 1 ? 'bg-white border-2 border-[#7C3AED] text-[#7C3AED]' : 'bg-white border-2 border-[#E4E0F5] text-[#6B7280]')"
            class="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-extrabold flex items-center gap-2 relative z-10 transition cursor-pointer shadow-2xs"
          >
            <span class="h-5 w-5 rounded-full bg-white text-[#7C3AED] flex items-center justify-center text-[11px] font-black" *ngIf="activeStep === 1">1</span>
            <span class="h-5 w-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[11px] font-black" *ngIf="activeStep > 1">✓</span>
            <span class="h-5 w-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[11px] font-black" *ngIf="activeStep < 1">1</span>
            <span>Je découvre un métier</span>
          </button>

          <!-- Étape 2 -->
          <button
            type="button"
            (click)="goToStep(2)"
            [class]="activeStep === 2
              ? 'bg-[#7C3AED] text-white shadow-md ring-4 ring-[#EDE9FE]'
              : (activeStep > 2 ? 'bg-white border-2 border-[#7C3AED] text-[#7C3AED]' : 'bg-white border-2 border-[#E4E0F5] text-[#6B7280]')"
            class="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-extrabold flex items-center gap-2 relative z-10 transition cursor-pointer shadow-2xs"
          >
            <span class="h-5 w-5 rounded-full bg-white text-[#7C3AED] flex items-center justify-center text-[11px] font-black" *ngIf="activeStep === 2">2</span>
            <span class="h-5 w-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[11px] font-black" *ngIf="activeStep > 2">✓</span>
            <span class="h-5 w-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[11px] font-black" *ngIf="activeStep < 2">2</span>
            <span>Je prépare mon immersion</span>
          </button>

          <!-- Étape 3 -->
          <button
            type="button"
            (click)="goToStep(3)"
            [class]="activeStep === 3
              ? 'bg-[#7C3AED] text-white shadow-md ring-4 ring-[#EDE9FE]'
              : (activeStep > 3 ? 'bg-white border-2 border-[#7C3AED] text-[#7C3AED]' : 'bg-white border-2 border-[#E4E0F5] text-[#6B7280]')"
            class="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-extrabold flex items-center gap-2 relative z-10 transition cursor-pointer shadow-2xs"
          >
            <span class="h-5 w-5 rounded-full bg-white text-[#7C3AED] flex items-center justify-center text-[11px] font-black" *ngIf="activeStep === 3">3</span>
            <span class="h-5 w-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[11px] font-black" *ngIf="activeStep > 3">✓</span>
            <span class="h-5 w-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[11px] font-black" *ngIf="activeStep < 3">3</span>
            <span>Je contacte une entreprise</span>
          </button>

          <!-- Étape 4 -->
          <button
            type="button"
            (click)="goToStep(4)"
            [class]="activeStep === 4
              ? 'bg-[#7C3AED] text-white shadow-md ring-4 ring-[#EDE9FE]'
              : 'bg-white border-2 border-[#E4E0F5] text-[#6B7280]'"
            class="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-extrabold flex items-center gap-2 relative z-10 transition cursor-pointer shadow-2xs"
          >
            <span class="h-5 w-5 rounded-full bg-white text-[#7C3AED] flex items-center justify-center text-[11px] font-black" *ngIf="activeStep === 4">4</span>
            <span class="h-5 w-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[11px] font-black" *ngIf="activeStep < 4">4</span>
            <span>Je fais le bilan</span>
          </button>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉTAPE 1 : JE DÉCOUVRE UN MÉTIER (Fidèle à la maquette officielle)  -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="activeStep === 1" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
        
        <!-- Colonne Principale : Fiche Peintre décorateur (Col 8/12) -->
        <div class="lg:col-span-8 rounded-[32px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            
            <!-- Visuel Métier Vectoriel (Sans image IA) -->
            <div class="sm:col-span-5 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#31104B] via-[#4C1D95] to-[#7C3AED] shadow-md aspect-4/3 relative flex flex-col items-center justify-center p-6 text-white text-center">
              <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl mb-3 shadow-md border border-white/20">
                <mb-icon name="palette"></mb-icon>
              </div>
              <span class="text-sm font-extrabold tracking-wide">Fiche Métier Immersion</span>
              <span class="text-[11px] text-[#DDD6FE] mt-1">Code ROME : B1301</span>
            </div>

            <!-- Bloc Identité Métier -->
            <div class="sm:col-span-7 space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <!-- Tag thématique -->
                <span class="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFFE] text-[#7C3AED] px-3.5 py-1 text-xs font-black">
                  <span>🎨</span>
                  <span>Création • Bâtiment • Décoration</span>
                </span>

                <!-- Bouton Favori Cœur -->
                <button
                  type="button"
                  (click)="toggleFavorite()"
                  class="h-10 w-10 rounded-full border border-[#E4E0F5] bg-white hover:bg-rose-50 flex items-center justify-center text-lg shadow-2xs transition cursor-pointer"
                  [title]="isCareerFavorite ? 'Retirer des favoris' : 'Enregistrer pour plus tard'"
                >
                  <span [class.text-rose-500]="isCareerFavorite" [class.text-gray-400]="!isCareerFavorite">
                    {{ isCareerFavorite ? '❤️' : '🤍' }}
                  </span>
                </button>
              </div>

              <h2 class="text-3xl font-black text-[#0F1035] tracking-tight">
                {{ selectedCareer.title }}
              </h2>

              <p class="text-xs sm:text-sm text-[#42466B] font-medium leading-relaxed">
                Un peintre décorateur prépare les surfaces, applique des peintures et réalise des finitions pour embellir des espaces.
              </p>
            </div>
          </div>

          <!-- 3 Sous-onglets : Une journée type / Compétences / Conditions -->
          <div class="space-y-4 pt-2">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                (click)="step1SubTab = 'DAY'"
                [class]="step1SubTab === 'DAY'
                  ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm'
                  : 'bg-[#F8F7FF] text-[#42466B] hover:bg-purple-100 font-semibold'"
                class="rounded-full px-4 py-2 text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>📅</span>
                <span>Une journée type</span>
              </button>

              <button
                type="button"
                (click)="step1SubTab = 'SKILLS'"
                [class]="step1SubTab === 'SKILLS'
                  ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm'
                  : 'bg-[#F8F7FF] text-[#42466B] hover:bg-purple-100 font-semibold'"
                class="rounded-full px-4 py-2 text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>⭐</span>
                <span>Compétences</span>
              </button>

              <button
                type="button"
                (click)="step1SubTab = 'CONDITIONS'"
                [class]="step1SubTab === 'CONDITIONS'
                  ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm'
                  : 'bg-[#F8F7FF] text-[#42466B] hover:bg-purple-100 font-semibold'"
                class="rounded-full px-4 py-2 text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>🏗️</span>
                <span>Conditions</span>
              </button>
            </div>

            <!-- Contenu Onglet 1 : Une journée type (Fidèle aux 3 puces de la maquette) -->
            <div *ngIf="step1SubTab === 'DAY'" class="rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] p-5 space-y-3 text-xs sm:text-sm animate-fadeIn">
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Préparer les murs et les surfaces (nettoyage, ponçage, enduit)</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Choisir les couleurs et les matériaux avec le client ou l'équipe</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Appliquer les peintures et réaliser les finitions (effets décoratifs, vernis)</span>
              </div>
            </div>

            <!-- Contenu Onglet 2 : Compétences -->
            <div *ngIf="step1SubTab === 'SKILLS'" class="rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] p-5 space-y-3 text-xs sm:text-sm animate-fadeIn">
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Sens du détail et harmonie des couleurs</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Maîtrise des gestes techniques (rouleaux, brosses, pistolet)</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Rigueur et respect des consignes de propreté du chantier</span>
              </div>
            </div>

            <!-- Contenu Onglet 3 : Conditions -->
            <div *ngIf="step1SubTab === 'CONDITIONS'" class="rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] p-5 space-y-3 text-xs sm:text-sm animate-fadeIn">
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Chantiers intérieurs et extérieurs, parfois en hauteur sur escabeau</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Équipements de protection fournis (masque, gants, combinaison)</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">✓</span>
                <span class="text-[#0F1035] font-semibold pt-0.5">Horaires réguliers de journée (généralement 8h00 - 16h30)</span>
              </div>
            </div>
          </div>

          <!-- Barre des actions inférieures (Maquette officielle) -->
          <div class="pt-4 border-t border-[#F0EDFA] flex flex-wrap items-center gap-3 justify-between">
            <!-- Bouton violet principal -->
            <button
              type="button"
              (click)="goToStep(2)"
              class="rounded-full bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm px-6 sm:px-7 py-3.5 shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <span>🚀</span>
              <span>Ce métier m'intéresse → Préparer mon immersion</span>
            </button>

            <!-- Bouton secondaire Enregistrer pour plus tard -->
            <button
              type="button"
              (click)="toggleFavorite()"
              class="rounded-full border border-[#D8DCF0] bg-white hover:bg-gray-50 text-[#0F1035] font-extrabold text-xs px-5 py-3.5 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>🔖</span>
              <span>{{ isCareerFavorite ? 'Enregistré dans mes favoris ✓' : 'Enregistrer pour plus tard' }}</span>
            </button>
          </div>
        </div>

        <!-- Colonne Latérale : Assistant contextuel Coach IA (Col 4/12) -->
        <div class="lg:col-span-4 rounded-[32px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          <!-- En-tête Assistant avec Robot IA -->
          <div class="text-center space-y-2">
            <div class="h-14 w-14 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-3xl mx-auto shadow-2xs border border-[#E9D5FF]">
              🤖
            </div>
            <h3 class="text-base sm:text-lg font-black text-[#0F1035]">
              Besoin d'un coup de main ?
            </h3>
            <p class="text-xs text-[#6B7280] leading-relaxed">
              Le Coach IA t'aide à mieux comprendre le métier, à préparer ton immersion et à réussir tes démarches.
            </p>
          </div>

          <!-- Bouton Poser une question -->
          <div class="pt-1">
            <button
              type="button"
              (click)="askCoach('Bonjour ! Peux-tu m\\'expliquer le métier de Peintre décorateur en quelques mots simples ?')"
              class="w-full rounded-full border border-[#7C3AED] bg-white hover:bg-[#FAF8FF] text-[#7C3AED] font-extrabold text-xs py-2.5 transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>💬</span>
              <span>Poser une question</span>
            </button>
          </div>

          <!-- Suggestions à puces (Maquette officielle) -->
          <div class="pt-2 border-t border-[#F0EDFA] space-y-2 text-xs">
            <button
              type="button"
              (click)="askCoach('Comment m\\'assurer que le métier de Peintre décorateur me correspond ?')"
              class="w-full text-left font-bold text-[#42466B] hover:text-[#7C3AED] flex items-center gap-2 transition p-1.5 rounded-lg hover:bg-[#FAF8FF]"
            >
              <span class="text-[#7C3AED] font-black">✓</span>
              <span>Comprendre le métier</span>
            </button>
            <button
              type="button"
              (click)="askCoach('Comment rédiger un message poli pour demander un stage d\\'observation ?')"
              class="w-full text-left font-bold text-[#42466B] hover:text-[#7C3AED] flex items-center gap-2 transition p-1.5 rounded-lg hover:bg-[#FAF8FF]"
            >
              <span class="text-[#7C3AED] font-black">✓</span>
              <span>Préparer un message</span>
            </button>
            <button
              type="button"
              (click)="askCoach('Où trouver des entreprises de peinture et décoration prêtes à accueillir un jeune à Nice ?')"
              class="w-full text-left font-bold text-[#42466B] hover:text-[#7C3AED] flex items-center gap-2 transition p-1.5 rounded-lg hover:bg-[#FAF8FF]"
            >
              <span class="text-[#7C3AED] font-black">✓</span>
              <span>Trouver des entreprises</span>
            </button>
            <button
              type="button"
              (click)="askCoach('Quelles sont les questions importantes à poser à un professionnel lors d\\'un premier contact ?')"
              class="w-full text-left font-bold text-[#42466B] hover:text-[#7C3AED] flex items-center gap-2 transition p-1.5 rounded-lg hover:bg-[#FAF8FF]"
            >
              <span class="text-[#7C3AED] font-black">✓</span>
              <span>Savoir quoi demander</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉTAPE 2 : JE PRÉPARE MON IMMERSION                                -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="activeStep === 2" class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div class="rounded-[32px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
          
          <!-- Bloc A : Mon métier -->
          <div class="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl">🎨</span>
              <div>
                <h3 class="text-lg font-black text-[#0F1035]">
                  {{ selectedCareer.title }}
                </h3>
                <p class="text-xs text-[#6B7280]">
                  Création • Bâtiment • Décoration
                </p>
              </div>
            </div>
            <button
              type="button"
              (click)="goToStep(1)"
              class="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
            >
              Changer de métier
            </button>
          </div>

          <!-- Bloc B : Ce que je veux découvrir (multi-choix) -->
          <div class="space-y-3">
            <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">
              Ce que je veux découvrir en priorité :
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                *ngFor="let goal of availableGoals"
                [class.bg-[#FAF8FF]]="isGoalSelected(goal)"
                [class.border-[#7C3AED]]="isGoalSelected(goal)"
                class="p-3.5 rounded-2xl border border-[#E4E0F5] flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition"
              >
                <input
                  type="checkbox"
                  [checked]="isGoalSelected(goal)"
                  (change)="toggleGoal(goal)"
                  class="h-4 w-4 accent-[#7C3AED]"
                />
                <span class="text-xs font-semibold text-[#0F1035]">{{ goal }}</span>
              </label>
            </div>
          </div>

          <!-- Bloc C : Mes disponibilités -->
          <div class="space-y-4 pt-2 border-t border-[#F0EDFA]">
            <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">
              Mes disponibilités souhaitées :
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-[#42466B] mb-1">Ville ou secteur de recherche</label>
                <input
                  type="text"
                  [(ngModel)]="searchCity"
                  placeholder="Ex: Nice et alentours (06)"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] px-4 py-2.5 text-xs font-semibold text-[#0F1035] outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-[#42466B] mb-1">Période souhaitée</label>
                <select
                  [(ngModel)]="selectedPeriod"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] px-4 py-2.5 text-xs font-semibold text-[#0F1035] outline-none focus:border-[#7C3AED] cursor-pointer"
                >
                  <option value="Vacances de février">Vacances de février</option>
                  <option value="Vacances de printemps">Vacances de printemps</option>
                  <option value="Mercredis après-midi">Mercredis après-midi</option>
                  <option value="Semaine de stage scolaire">Semaine de stage scolaire</option>
                  <option value="Dates souples à convenir">Dates souples à convenir avec l'entreprise</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#42466B] mb-1">Commentaire facultatif</label>
              <textarea
                [(ngModel)]="userComment"
                rows="2"
                placeholder="Ex: Je suis véhiculé en scooter, disponible sur Nice Ouest et Cagnes-sur-Mer."
                class="w-full rounded-2xl bg-white border border-[#E4E0F5] p-3 text-xs font-medium text-[#0F1035] outline-none focus:border-[#7C3AED]"
              ></textarea>
            </div>
          </div>

          <!-- Bloc D : Projet prêt & Validation -->
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5">
            <span class="text-base">ℹ️</span>
            <span>Pas besoin d'avoir déjà une convention pour préparer ta démarche. Nous t'expliquerons comment formaliser l'accueil le moment venu selon ta situation.</span>
          </div>

          <div class="pt-2 flex items-center justify-between">
            <button
              type="button"
              (click)="goToStep(1)"
              class="px-5 py-2.5 rounded-full border border-[#D8DCF0] text-xs font-extrabold text-[#42466B] hover:bg-gray-50 transition cursor-pointer"
            >
              ← Retour
            </button>

            <button
              type="button"
              (click)="goToStep(3)"
              class="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Continuer → Trouver une entreprise</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉTAPE 3 : JE CONTACTE UNE ENTREPRISE (3 espaces clairs)           -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="activeStep === 3" class="space-y-6 animate-fadeIn">
        
        <!-- Navigation des 3 espaces de l'Étape 3 -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="step3SubSpace = 'SEARCH'"
            [class]="step3SubSpace === 'SEARCH' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-white border border-[#E4E0F5] text-[#42466B] font-bold'"
            class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🏢</span>
            <span>A. Trouver une structure</span>
          </button>

          <button
            type="button"
            (click)="step3SubSpace = 'COACH'"
            [class]="step3SubSpace === 'COACH' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-white border border-[#E4E0F5] text-[#42466B] font-bold'"
            class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>💬</span>
            <span>B. Préparer ma demande avec le Coach IA</span>
          </button>

          <button
            type="button"
            (click)="step3SubSpace = 'TRACKING'"
            [class]="step3SubSpace === 'TRACKING' ? 'bg-[#7C3AED] text-white font-extrabold shadow-sm' : 'bg-white border border-[#E4E0F5] text-[#42466B] font-bold'"
            class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>📋</span>
            <span>C. Suivre mes démarches ({{ followedCompanies.length }})</span>
          </button>
        </div>

        <!-- ESPACE A : Trouver une structure vérifiée dans le 06 -->
        <div *ngIf="step3SubSpace === 'SEARCH'" class="space-y-4 animate-fadeIn">
          <div class="rounded-3xl bg-white border border-[#E4E0F5] p-5 shadow-xs flex items-center justify-between">
            <div>
              <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">
                Structures vérifiées dans les Alpes-Maritimes
              </h3>
              <p class="text-xs text-[#6B7280]">
                Entreprises et ateliers proposant la découverte du métier de {{ selectedCareer.title }}.
              </p>
            </div>
            <span class="rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1">
              ✓ Sources vérifiées
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              *ngFor="let comp of partnerCompanies"
              class="rounded-3xl bg-white border border-[#E4E0F5] p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-[#7C3AED] bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {{ comp.city }} • {{ comp.distanceKm }} km
                  </span>
                  <span class="text-xs font-bold text-emerald-700">✓ Référencé</span>
                </div>
                <h4 class="font-extrabold text-[#0F1035] text-base leading-snug">
                  {{ comp.name }}
                </h4>
                <p class="text-xs text-[#42466B] leading-relaxed">
                  {{ comp.headline }}
                </p>
                <div class="pt-1 text-xs text-gray-500 space-y-0.5">
                  <p>📍 {{ comp.address }}</p>
                  <p>📞 {{ comp.contactPhone || 'Non communiqué' }}</p>
                </div>
              </div>

              <div class="pt-2 border-t border-[#F0EDFA] flex items-center justify-between">
                <button
                  type="button"
                  (click)="selectCompanyForContact(comp)"
                  class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-extrabold px-3.5 py-2 transition cursor-pointer"
                >
                  Contacter cette structure →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ESPACE B : Préparer ma demande avec le Coach IA -->
        <div *ngIf="step3SubSpace === 'COACH'" class="rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div class="flex items-center justify-between">
            <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035]">
              Préparation de contact avec {{ currentTargetCompany?.name || 'l\'entreprise' }}
            </h3>
            <span class="text-xs text-purple-700 bg-purple-50 px-3 py-1 rounded-full font-bold">
              Coach IA MonBilan+
            </span>
          </div>

          <!-- 3 options de contact -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Option 1 : Rédiger un email -->
            <div class="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] space-y-3">
              <h4 class="font-extrabold text-xs sm:text-sm text-[#0F1035] flex items-center gap-1.5">
                <span>✉️</span>
                <span>Option 1 — Préparer un email</span>
              </h4>
              <p class="text-xs text-[#6B7280]">
                Brouillon prêt à envoyer pour une demande d'observation.
              </p>
              <textarea
                [(ngModel)]="emailDraft"
                rows="5"
                class="w-full rounded-xl bg-white border border-[#E4E0F5] p-2.5 text-xs font-medium text-[#0F1035] outline-none"
              ></textarea>
              <button
                type="button"
                (click)="copyEmailDraft()"
                class="w-full py-2 rounded-xl bg-white border border-[#7C3AED] text-[#7C3AED] font-extrabold text-xs hover:bg-purple-50 transition cursor-pointer"
              >
                {{ emailCopied ? '✓ Message copié !' : '📋 Copier le texte' }}
              </button>
            </div>

            <!-- Option 2 : Préparer un appel -->
            <div class="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] space-y-3">
              <h4 class="font-extrabold text-xs sm:text-sm text-[#0F1035] flex items-center gap-1.5">
                <span>📞</span>
                <span>Option 2 — Préparer un appel</span>
              </h4>
              <p class="text-xs text-[#6B7280]">
                Script court pour te présenter et demander la bonne personne.
              </p>
              <div class="p-2.5 bg-white rounded-xl border border-[#E4E0F5] text-xs text-[#0F1035] space-y-1.5 font-medium">
                <p><strong>1. Phrase d'accroche :</strong> "Bonjour, je m'appelle Emma et je m'intéresse au métier de peintre décorateur..."</p>
                <p><strong>2. Question clé :</strong> "Est-il possible d'échanger avec le responsable d'atelier pour une journée d'observation ?"</p>
              </div>
              <button
                type="button"
                (click)="copyPhoneScript()"
                class="w-full py-2 rounded-xl bg-white border border-[#7C3AED] text-[#7C3AED] font-extrabold text-xs hover:bg-purple-50 transition cursor-pointer"
              >
                {{ scriptCopied ? '✓ Script copié !' : '📋 Copier le script' }}
              </button>
            </div>

            <!-- Option 3 : M'entraîner -->
            <div class="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] space-y-3 flex flex-col justify-between">
              <div class="space-y-2">
                <h4 class="font-extrabold text-xs sm:text-sm text-[#0F1035] flex items-center gap-1.5">
                  <span>🎙️</span>
                  <span>Option 3 — M'entraîner</span>
                </h4>
                <p class="text-xs text-[#6B7280]">
                  Simule un appel ou une question avec le Coach IA avant de te lancer.
                </p>
              </div>
              <button
                type="button"
                (click)="askCoach('Je souhaite m\\'entraîner à appeler une entreprise pour un stage de peintre décorateur. Joue le rôle du responsable d\\'atelier.')"
                class="w-full py-2.5 rounded-xl bg-[#7C3AED] text-white font-extrabold text-xs hover:bg-[#6D28D9] transition cursor-pointer"
              >
                Démarrer la simulation →
              </button>
            </div>
          </div>
        </div>

        <!-- ESPACE C : Suivi de mes démarches -->
        <div *ngIf="step3SubSpace === 'TRACKING'" class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4 animate-fadeIn">
          <div class="flex items-center justify-between">
            <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035]">
              Tableau de suivi de mes démarches
            </h3>
            <span class="text-xs text-gray-500">Mise à jour en direct</span>
          </div>

          <div class="space-y-3">
            <div
              *ngFor="let item of followedCompanies"
              class="p-4 rounded-2xl border border-[#E4E0F5] bg-[#FAF8FF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <h4 class="font-extrabold text-sm text-[#0F1035]">{{ item.companyName }}</h4>
                <p class="text-xs text-[#6B7280]">Contacté le {{ item.contactDate }}</p>
              </div>

              <div class="flex items-center gap-2">
                <select
                  [(ngModel)]="item.status"
                  (change)="onStatusChange(item)"
                  class="rounded-xl bg-white border border-[#D8DCF0] px-3 py-1.5 text-xs font-bold text-[#0F1035] cursor-pointer"
                >
                  <option value="A_CONTACTER">À contacter</option>
                  <option value="CONTACTE">Contacté</option>
                  <option value="EN_ATTENTE">En attente de réponse</option>
                  <option value="REPONSE_RECUE">Réponse reçue</option>
                  <option value="RELANCE">À relancer</option>
                  <option value="CONFIRME">Immersion confirmée ✓</option>
                </select>

                <button
                  *ngIf="item.status === 'CONFIRME'"
                  type="button"
                  (click)="goToStep(4)"
                  class="rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-extrabold hover:bg-emerald-700 transition"
                >
                  Faire le bilan →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Passerelle vers le Bilan -->
        <div class="flex items-center justify-between pt-2">
          <button
            type="button"
            (click)="goToStep(2)"
            class="px-5 py-2.5 rounded-full border border-[#D8DCF0] text-xs font-extrabold text-[#42466B] hover:bg-gray-50 transition cursor-pointer"
          >
            ← Retour à la préparation
          </button>

          <button
            type="button"
            (click)="goToStep(4)"
            class="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 shadow-md transition cursor-pointer"
          >
            Passer à l'étape suivante : Faire le bilan →
          </button>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉTAPE 4 : JE FAIS LE BILAN                                         -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="activeStep === 4" class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        
        <!-- ÉTAT A : Si aucune immersion n'a encore eu lieu -->
        <div *ngIf="!hasCompletedImmersion" class="rounded-[32px] bg-white border border-[#E4E0F5] p-8 text-center space-y-4 shadow-sm">
          <div class="h-16 w-16 rounded-3xl bg-[#FAF8FF] text-[#7C3AED] flex items-center justify-center text-3xl mx-auto border border-[#E9D5FF]">
            🕒
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-[#0F1035]">
            Tu n'as pas encore réalisé d'immersion
          </h2>
          <p class="text-xs sm:text-sm text-[#42466B] max-w-md mx-auto leading-relaxed">
            Tu peux continuer tes démarches avec les entreprises, préparer tes messages ou revenir plus tard lorsque ton stage aura eu lieu.
          </p>

          <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              (click)="goToStep(3)"
              class="px-6 py-3 rounded-full bg-[#7C3AED] text-white text-xs sm:text-sm font-extrabold hover:bg-[#6D28D9] transition cursor-pointer shadow-md"
            >
              ← Reprendre mes démarches
            </button>

            <button
              type="button"
              (click)="unlockReflectionForm()"
              class="px-5 py-3 rounded-full border border-[#D8DCF0] bg-white text-[#0F1035] text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
            >
              J'ai déjà réalisé mon immersion (remplir le bilan)
            </button>
          </div>
        </div>

        <!-- ÉTAT B : Questionnaire bilan réflexif après immersion -->
        <div *ngIf="hasCompletedImmersion" class="rounded-[32px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
          <div class="border-b border-[#F0EDFA] pb-3">
            <h2 class="text-xl sm:text-2xl font-black text-[#0F1035]">
              Mon bilan d'immersion — {{ selectedCareer.title }}
            </h2>
            <p class="text-xs text-[#6B7280]">
              Prends quelques minutes pour faire le point sur ce que tu as découvert.
            </p>
          </div>

          <div class="space-y-4 text-xs sm:text-sm">
            <div>
              <label class="block font-bold text-[#0F1035] mb-1">1. Qu'as-tu découvert pendant cette expérience ?</label>
              <textarea [(ngModel)]="reflection.discovered" rows="2" class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 outline-none focus:border-[#7C3AED]"></textarea>
            </div>

            <div>
              <label class="block font-bold text-[#0F1035] mb-1">2. Qu'est-ce qui t'a le plus plu ?</label>
              <textarea [(ngModel)]="reflection.liked" rows="2" class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 outline-none focus:border-[#7C3AED]"></textarea>
            </div>

            <div>
              <label class="block font-bold text-[#0F1035] mb-1">3. Qu'est-ce qui t'a moins plu ou surpris ?</label>
              <textarea [(ngModel)]="reflection.surprised" rows="2" class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 outline-none focus:border-[#7C3AED]"></textarea>
            </div>

            <div>
              <label class="block font-bold text-[#0F1035] mb-1">4. As-tu envie d'explorer davantage ce métier ?</label>
              <div class="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  (click)="reflection.continueInField = 'YES'"
                  [class]="reflection.continueInField === 'YES' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-gray-100 text-gray-700'"
                  class="px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Oui, tout à fait !
                </button>
                <button
                  type="button"
                  (click)="reflection.continueInField = 'MAYBE'"
                  [class]="reflection.continueInField === 'MAYBE' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-gray-100 text-gray-700'"
                  class="px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Peut-être / À confirmer
                </button>
                <button
                  type="button"
                  (click)="reflection.continueInField = 'NO'"
                  [class]="reflection.continueInField === 'NO' ? 'bg-[#7C3AED] text-white font-extrabold' : 'bg-gray-100 text-gray-700'"
                  class="px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Je préfère tester un autre métier
                </button>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-[#F0EDFA] flex items-center justify-between">
            <button
              type="button"
              (click)="saveReflection()"
              class="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 transition shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>💾</span>
              <span>Enregistrer mon bilan</span>
            </button>

            <span *ngIf="reflectionSaved" class="text-xs font-bold text-emerald-600">
              ✓ Bilan sauvegardé avec succès !
            </span>
          </div>
        </div>

      </div>

    </div>
  `
})
export class ImmersionProComponent implements OnInit {
  @Input() careers: any[] = [];
  @Input() careerAssessments: any[] = [];
  @Input() project: UIImmersionProject = INITIAL_IMMERSION_PROJECT;

  @Output() careerSelected = new EventEmitter<any>();
  @Output() viewDetail = new EventEmitter<any>();
  @Output() navigateToCoach = new EventEmitter<string>();

  activeStep: ImmersionActiveTab = 1;
  step1SubTab: 'DAY' | 'SKILLS' | 'CONDITIONS' = 'DAY';
  step3SubSpace: 'SEARCH' | 'COACH' | 'TRACKING' = 'SEARCH';

  // Métier sélectionné (Peintre décorateur par défaut, fidèle à la maquette)
  selectedCareer: UIImmersionCareer = IMMERSION_CAREERS_CATALOG[0];
  isCareerFavorite = true;

  // Intentions Étape 2
  availableGoals = [
    'Observer une journée de travail',
    'Découvrir les outils et les activités',
    'Discuter avec un professionnel',
    'Comprendre les formations possibles',
    'Vérifier si ce métier pourrait me plaire'
  ];
  selectedGoals: string[] = [
    'Observer une journée de travail',
    'Découvrir les outils et les activités'
  ];
  searchCity = 'Nice et alentours (06)';
  selectedPeriod = 'Vacances de février';
  userComment = '';

  // Entreprises partenaires Étape 3
  partnerCompanies: UIPartnerCompany[] = IMMERSION_COMPANIES_DATA;
  currentTargetCompany: UIPartnerCompany | null = IMMERSION_COMPANIES_DATA[0];

  emailDraft = `Bonjour,\n\nJe m'appelle Emma et je prépare mon orientation professionnelle. Dans le cadre de mon projet pour découvrir le métier de Peintre décorateur, je souhaiterais observer vos activités et échanger avec votre équipe lors d'un court stage d'observation.\n\nSeriez-vous disposés à m'accueillir pendant quelques jours ?\n\nMerci pour votre temps et votre retour.\n\nCordialement,\nEmma D.`;
  emailCopied = false;
  scriptCopied = false;

  followedCompanies = [
    {
      companyName: 'Atelier Décors & Patines Riviera',
      contactDate: '18 nov. 2026',
      status: 'CONTACTE'
    },
    {
      companyName: 'Azur Peinture Décorative',
      contactDate: '19 nov. 2026',
      status: 'A_CONTACTER'
    }
  ];

  // Bilan Étape 4
  hasCompletedImmersion = false;
  reflection = {
    discovered: 'J\'ai appris comment préparer un mur avant de le peindre (enduit, ponçage).',
    liked: 'Le choix des couleurs et la pose des enduits décoratifs à la chaux.',
    surprised: 'Le temps passé sur la préparation minutieuse des surfaces.',
    continueInField: 'YES'
  };
  reflectionSaved = false;

  ngOnInit(): void {
    this.updateCareerFromProject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']) {
      this.updateCareerFromProject();
    }
  }

  private updateCareerFromProject(): void {
    if (this.project?.careerTitle) {
      const found = IMMERSION_CAREERS_CATALOG.find(
        (c) => c.title.toLowerCase() === this.project?.careerTitle.toLowerCase()
      );
      if (found) {
        this.selectedCareer = found;
      } else {
        this.selectedCareer = {
          id: this.project.careerId || 'custom-immersion',
          title: this.project.careerTitle,
          tagline: 'Découverte professionnelle • Terrain',
          domain: 'decouverte',
          domainTag: 'Orientation libre',
          sectorTag: 'Métiers d’avenir',
          sectorColor: 'bg-purple-100 text-[#7C3AED]',
          pageNumber: 1,
          jobZone: this.project.careerZone || 2,
          educationLevel: 'Selon filière',
          shortSummary: `Découvre le métier de ${this.project.careerTitle} en entreprise lors d'un court stage d'observation.`,
          heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          activitesPrincipales: [
            `Observer les missions quotidiennes d'un(e) ${this.project.careerTitle}`,
            'Comprendre l’environnement de travail et les outils utilisés',
            'Poser des questions aux professionnels de l’équipe'
          ],
          competencesMobilisees: ['Curiosité', 'Sens du contact', 'Rigueur'],
          conditionsTravail: ['En journée, en entreprise ou sur site', 'Au sein d\'une équipe de professionnels'],
          perspectives: ['Opportunités de stage, alternance ou formation continue'],
          formations: ['Consulter les formations recommandées sur MonBilan+'],
          temoignages: []
        };
      }
      this.emailDraft = `Bonjour,\n\nJe m'appelle Emma et je prépare mon orientation professionnelle. Dans le cadre de mon projet pour découvrir le métier de ${this.selectedCareer.title}, je souhaiterais observer vos activités et échanger avec votre équipe lors d'un court stage d'observation.\n\nSeriez-vous disposés à m'accueillir pendant quelques jours ?\n\nMerci pour votre temps et votre retour.\n\nCordialement,\nEmma D.`;
    }
  }

  getStepBreadcrumb(): string {
    switch (this.activeStep) {
      case 1:
        return 'Je découvre un métier';
      case 2:
        return 'Je prépare mon immersion';
      case 3:
        return 'Je contacte une entreprise';
      case 4:
        return 'Je fais le bilan';
    }
  }

  goToStep(step: ImmersionActiveTab): void {
    this.activeStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFavorite(): void {
    this.isCareerFavorite = !this.isCareerFavorite;
  }

  isGoalSelected(goal: string): boolean {
    return this.selectedGoals.includes(goal);
  }

  toggleGoal(goal: string): void {
    if (this.isGoalSelected(goal)) {
      this.selectedGoals = this.selectedGoals.filter((g) => g !== goal);
    } else {
      this.selectedGoals.push(goal);
    }
  }

  selectCompanyForContact(comp: UIPartnerCompany): void {
    this.currentTargetCompany = comp;
    this.step3SubSpace = 'COACH';
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  copyEmailDraft(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.emailDraft);
    }
    this.emailCopied = true;
    saveDraftItem({
      id: 'immersion-email-' + Date.now(),
      type: 'EMAIL',
      title: 'Demande immersion — ' + this.selectedCareer.title,
      careerTitle: this.selectedCareer.title,
      recipient: this.currentTargetCompany?.name || 'Entreprise 06',
      content: this.emailDraft,
      date: new Date().toLocaleDateString('fr-FR')
    });
    setTimeout(() => (this.emailCopied = false), 3000);
  }

  copyPhoneScript(): void {
    const script = `Bonjour, je m'appelle Emma et je m'intéresse au métier de ${this.selectedCareer.title}. Est-il possible d'échanger avec le responsable d'atelier pour une journée d'observation ?`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(script);
    }
    this.scriptCopied = true;
    saveDraftItem({
      id: 'immersion-phone-' + Date.now(),
      type: 'CALL_SCRIPT',
      title: 'Script appel — ' + this.selectedCareer.title,
      careerTitle: this.selectedCareer.title,
      recipient: this.currentTargetCompany?.name || 'Entreprise 06',
      content: script,
      date: new Date().toLocaleDateString('fr-FR')
    });
    setTimeout(() => (this.scriptCopied = false), 3000);
  }

  askCoach(prompt: string): void {
    this.navigateToCoach.emit(prompt);
  }

  onStatusChange(item: any): void {
    if (item.status === 'CONFIRME') {
      this.hasCompletedImmersion = true;
    }
  }

  unlockReflectionForm(): void {
    this.hasCompletedImmersion = true;
  }

  saveReflection(): void {
    this.reflectionSaved = true;
    setTimeout(() => (this.reflectionSaved = false), 3500);
  }

  onPhotoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/visuals/career-peintre.png';
  }
}
