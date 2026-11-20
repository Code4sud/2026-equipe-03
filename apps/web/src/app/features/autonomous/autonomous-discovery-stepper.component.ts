// ============================================================================
// MonBilan+ — Composant Autonome en 3 Étapes (Fidèle aux maquettes officielles)
// 1. Je découvre (6 univers d'activités sans test psychométrique)
// 2. J'explore (Fiche vulgarisée Graphiste + divulagation progressive O*NET)
// 3. Je passe à l'action (3 options concrètes + barre de progression)
// ============================================================================

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import { UICatalogCareer } from '../../shared/autonomous-data';
import { ONET_CAREERS_CATALOG_DATA } from '../../shared/onet-careers-data';

export type AutonomousStep = 1 | 2 | 3;

export interface DiscoveryActivityCard {
  id: string;
  category: string;
  title: string;
  iconType: 'palette' | 'tools' | 'heart-hands' | 'computer' | 'nature' | 'signpost';
  representativeCareerId: string;
}

@Component({
  selector: 'app-autonomous-discovery-stepper',
  standalone: true,
  imports: [CommonModule, FormsModule, MbIconComponent],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 pb-16 animate-fadeIn">

      <!-- ================================================================== -->
      <!-- BARRE DE STEPPER EN 3 ÉTAPES (Identique aux 3 maquettes)           -->
      <!-- ================================================================== -->
      <div class="flex items-center justify-center gap-2 sm:gap-4 pt-2">
        <!-- Étape 1 : Je découvre -->
        <button
          type="button"
          (click)="goToStep(1)"
          [class]="currentStep === 1
            ? 'bg-[#7C3AED] text-white shadow-md font-extrabold ring-4 ring-[#EDE9FE]'
            : (currentStep > 1 ? 'bg-[#EDE9FE] text-[#7C3AED] font-extrabold' : 'bg-white text-[#42466B] border border-[#E4E0F5] font-semibold')"
          class="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
        >
          <span *ngIf="currentStep > 1" class="text-xs"><mb-icon name="check"></mb-icon></span>
          <span *ngIf="currentStep <= 1"><mb-icon name="compass"></mb-icon></span>
          <span>1. Je découvre</span>
        </button>

        <span class="text-gray-300 font-bold text-xs sm:text-sm">―</span>

        <!-- Étape 2 : J'explore -->
        <button
          type="button"
          (click)="goToStep(2)"
          [class]="currentStep === 2
            ? 'bg-[#7C3AED] text-white shadow-md font-extrabold ring-4 ring-[#EDE9FE]'
            : (currentStep > 2 ? 'bg-[#EDE9FE] text-[#7C3AED] font-extrabold' : 'bg-white text-[#42466B] border border-[#E4E0F5] font-semibold')"
          class="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
        >
          <span *ngIf="currentStep > 2" class="text-xs"><mb-icon name="check"></mb-icon></span>
          <span *ngIf="currentStep <= 2"><mb-icon name="briefcase"></mb-icon></span>
          <span>2. J'explore</span>
        </button>

        <span class="text-gray-300 font-bold text-xs sm:text-sm">―</span>

        <!-- Étape 3 : Je passe à l'action -->
        <button
          type="button"
          (click)="goToStep(3)"
          [class]="currentStep === 3
            ? 'bg-[#7C3AED] text-white shadow-md font-extrabold ring-4 ring-[#EDE9FE]'
            : 'bg-white text-[#42466B] border border-[#E4E0F5] font-semibold'"
          class="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
        >
          <span><mb-icon name="flag"></mb-icon></span>
          <span>3. Je passe à l'action</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉTAPE 1 : JE DÉCOUVRE (Maquette 1 officielle)                      -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="currentStep === 1" class="space-y-8 animate-fadeIn">
        <!-- Titre & promesse bienveillante avec étincelles stylisées -->
        <div class="text-center space-y-2 pt-2">
          <!-- Petits rayons décoratifs violets -->
          <div class="flex items-center justify-center gap-1 text-[#7C3AED] text-lg font-black select-none">
            <span>\</span><span>|</span><span>/</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F1035] tracking-tight">
            Découvre ce qui te plaît
          </h1>
          <p class="text-sm sm:text-base text-[#42466B] font-medium max-w-xl mx-auto">
            Choisis une activité, sans test ni bonne ou mauvaise réponse.
          </p>
        </div>

        <!-- Grille des 6 cartes d'activités (3x2 responsive) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <div
            *ngFor="let act of activityCards"
            (click)="selectActivity(act)"
            [class.ring-4]="selectedActivity?.id === act.id"
            [class.ring-[#7C3AED]]="selectedActivity?.id === act.id"
            [class.border-[#7C3AED]]="selectedActivity?.id === act.id"
            class="group rounded-3xl bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-[#7C3AED]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px]"
          >
            <!-- Illustration vectorielle riche -->
            <div class="flex items-center justify-center py-4">
              <!-- 1. Créer, dessiner, imaginer : Palette de peinture -->
              <div *ngIf="act.iconType === 'palette'" class="relative h-20 w-24 flex items-center justify-center">
                <svg viewBox="0 0 100 80" class="h-20 w-auto drop-shadow-md">
                  <!-- Palette en bois/beige -->
                  <path d="M 15 45 C 10 20, 45 10, 75 20 C 95 30, 95 60, 75 70 C 60 78, 45 70, 40 60 C 35 50, 20 60, 15 45 Z" fill="#FDE68A" stroke="#F59E0B" stroke-width="2.5" />
                  <!-- Taches de peinture -->
                  <circle cx="35" cy="28" r="6" fill="#EF4444" />
                  <circle cx="55" cy="24" r="6" fill="#3B82F6" />
                  <circle cx="75" cy="36" r="6" fill="#10B981" />
                  <circle cx="70" cy="55" r="5" fill="#8B5CF6" />
                  <!-- Pinceau en travers -->
                  <rect x="25" y="55" width="45" height="7" rx="3.5" transform="rotate(-35 30 55)" fill="#78350F" />
                  <path d="M 65 30 L 72 26 C 75 25, 78 28, 76 31 Z" fill="#6B7280" />
                  <path d="M 72 26 L 78 22 C 80 20, 83 23, 81 26 Z" fill="#7C3AED" />
                </svg>
              </div>

              <!-- 2. Fabriquer, réparer, construire : Clé & marteau croisés -->
              <div *ngIf="act.iconType === 'tools'" class="relative h-20 w-24 flex items-center justify-center">
                <svg viewBox="0 0 100 80" class="h-20 w-auto drop-shadow-md">
                  <!-- Clé anglaise inclinée -->
                  <g transform="rotate(-30 50 40)">
                    <rect x="44" y="15" width="12" height="50" rx="4" fill="#9CA3AF" />
                    <circle cx="50" cy="20" r="12" fill="#6B7280" />
                    <rect x="46" y="10" width="8" height="12" fill="#F3F4F6" />
                  </g>
                  <!-- Marteau jaune/acier croisé -->
                  <g transform="rotate(35 50 40)">
                    <rect x="46" y="10" width="10" height="55" rx="3" fill="#F59E0B" />
                    <path d="M 38 10 L 64 10 L 64 22 L 38 22 Z" fill="#374151" rx="2" />
                  </g>
                </svg>
              </div>

              <!-- 3. Aider les autres : Deux mains soutenant un cœur -->
              <div *ngIf="act.iconType === 'heart-hands'" class="relative h-20 w-24 flex items-center justify-center">
                <svg viewBox="0 0 100 80" class="h-20 w-auto drop-shadow-md">
                  <!-- Cœur rouge vif flottant -->
                  <path d="M 50 32 C 40 18, 25 28, 38 42 L 50 54 L 62 42 C 75 28, 60 18, 50 32 Z" fill="#EF4444" />
                  <!-- Éclats d'amour -->
                  <circle cx="30" cy="20" r="2" fill="#F43F5E" />
                  <circle cx="70" cy="20" r="2" fill="#F43F5E" />
                  <!-- Main droite/gauche jaune dorée qui soutient -->
                  <path d="M 25 58 C 35 52, 45 56, 50 58 C 45 64, 30 68, 20 62 Z" fill="#FBBF24" />
                  <path d="M 75 58 C 65 52, 55 56, 50 58 C 55 64, 70 68, 80 62 Z" fill="#FBBF24" />
                </svg>
              </div>

              <!-- 4. Utiliser les ordinateurs : Laptop avec </> -->
              <div *ngIf="act.iconType === 'computer'" class="relative h-20 w-24 flex items-center justify-center">
                <svg viewBox="0 0 100 80" class="h-20 w-auto drop-shadow-md">
                  <!-- Écran laptop -->
                  <rect x="22" y="16" width="56" height="38" rx="5" fill="#312E81" stroke="#4338CA" stroke-width="2" />
                  <!-- Contenu de l'écran : </> -->
                  <text x="50" y="42" font-size="18" font-family="monospace" font-weight="900" fill="#38BDF8" text-anchor="middle">&lt;/&gt;</text>
                  <!-- Base / Clavier -->
                  <path d="M 14 54 L 86 54 L 80 64 L 20 64 Z" fill="#6366F1" />
                  <rect x="42" y="56" width="16" height="3" rx="1.5" fill="#C7D2FE" />
                </svg>
              </div>

              <!-- 5. Travailler avec la nature : Deux feuilles végétales -->
              <div *ngIf="act.iconType === 'nature'" class="relative h-20 w-24 flex items-center justify-center">
                <svg viewBox="0 0 100 80" class="h-20 w-auto drop-shadow-md">
                  <!-- Tige -->
                  <path d="M 35 68 C 45 55, 55 45, 65 25" stroke="#047857" stroke-width="3" fill="none" stroke-linecap="round" />
                  <!-- Feuille principale verte -->
                  <path d="M 65 25 C 80 30, 80 50, 58 52 C 55 40, 55 30, 65 25 Z" fill="#10B981" />
                  <!-- Feuille secondaire gauche -->
                  <path d="M 45 45 C 30 42, 28 58, 48 58 C 48 52, 45 48, 45 45 Z" fill="#34D399" />
                </svg>
              </div>

              <!-- 6. Je ne sais pas encore : Poteau indicateur coloré -->
              <div *ngIf="act.iconType === 'signpost'" class="relative h-20 w-24 flex items-center justify-center">
                <svg viewBox="0 0 100 80" class="h-20 w-auto drop-shadow-md">
                  <!-- Poteau en bois -->
                  <rect x="47" y="15" width="6" height="55" rx="3" fill="#78350F" />
                  <!-- Flèche jaune vers la gauche -->
                  <path d="M 30 25 L 50 25 L 50 35 L 30 35 L 22 30 Z" fill="#F59E0B" />
                  <!-- Flèche violette vers la droite -->
                  <path d="M 50 40 L 72 40 L 80 46 L 72 52 L 50 52 Z" fill="#7C3AED" />
                  <!-- Petite étincelle au sommet -->
                  <circle cx="50" cy="12" r="3" fill="#EC4899" />
                </svg>
              </div>
            </div>

            <!-- Titre & flèche d'action circulaire -->
            <div class="flex items-center justify-between gap-2 pt-2 border-t border-[#F0EDFA]">
              <span class="font-extrabold text-[#0F1035] text-sm sm:text-base group-hover:text-[#7C3AED] transition">
                {{ act.title }}
              </span>
              <span class="h-8 w-8 rounded-full bg-[#F3EFFE] text-[#7C3AED] flex items-center justify-center text-sm font-black group-hover:bg-[#7C3AED] group-hover:text-white transition shrink-0">
                →
              </span>
            </div>
          </div>
        </div>

        <!-- Bouton principal d'action : Voir comment présenter les métiers -->
        <div class="text-center pt-4 space-y-4">
          <button
            type="button"
            (click)="proceedToStep2()"
            class="rounded-full bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-sm sm:text-base px-8 py-4 shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2.5"
          >
            <span>Voir comment présenter les métiers</span>
            <span>→</span>
          </button>

          <!-- Lien secondaire discret vers tout le catalogue -->
          <div>
            <button
              type="button"
              (click)="openFullCatalog.emit()"
              class="text-xs sm:text-sm font-bold text-[#6B7280] hover:text-[#7C3AED] transition inline-flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <span><mb-icon name="book-open"></mb-icon></span>
              <span>Voir tout le catalogue (721 métiers)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉTAPE 2 : J'EXPLORE (Maquette 2 officielle — Fiche Graphiste)        -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="currentStep === 2 && currentCareer" class="space-y-6 animate-fadeIn">
        
        <!-- Fil d'Ariane & Retour Étape 1 -->
        <div class="flex items-center justify-between">
          <button
            type="button"
            (click)="goToStep(1)"
            class="text-xs sm:text-sm font-extrabold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>←</span>
            <span>Découvrir des métiers</span>
          </button>

          <span class="text-xs font-semibold text-[#6B7280]">
            Métier suggéré d'après ton choix d'activité
          </span>
        </div>

        <!-- Grande Carte Hero Métier (Fidèle à la Maquette 2) -->
        <div class="rounded-[32px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <!-- Visuel Métier Vectoriel (Sans image IA) -->
            <div class="md:col-span-5 relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#31104B] via-[#4C1D95] to-[#7C3AED] aspect-4/3 flex flex-col items-center justify-center p-6 text-white text-center shadow-inner">
              <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl mb-3 shadow-md border border-white/20">
                <mb-icon name="palette"></mb-icon>
              </div>
              <span class="text-sm font-extrabold tracking-wide">Fiche Découverte Métier</span>
              <span class="text-[11px] text-[#DDD6FE] mt-1">O*NET 27-1024.00 FR</span>
            </div>

            <!-- Bloc Titre, Badge & Favori -->
            <div class="md:col-span-7 space-y-3">
              <div class="flex items-center justify-between gap-2">
                <!-- Tag thématique -->
                <span class="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFFE] text-[#7C3AED] px-3.5 py-1 text-xs font-black">
                  <span><mb-icon name="palette"></mb-icon></span>
                  <span>Créer • Art • Communication</span>
                </span>

                <!-- Bouton cœur favori persistant -->
                <button
                  type="button"
                  (click)="toggleFavorite()"
                  class="h-10 w-10 rounded-full border border-[#E4E0F5] bg-white hover:bg-rose-50 flex items-center justify-center text-lg shadow-2xs transition cursor-pointer"
                  [title]="isCareerFavorite ? 'Retirer des favoris' : 'Ajouter à mes favoris'"
                >
                  <span [class.text-rose-500]="isCareerFavorite" [class.text-gray-400]="!isCareerFavorite">
                    <mb-icon name="heart" [filled]="isCareerFavorite"></mb-icon>
                  </span>
                </button>
              </div>

              <h2 class="text-3xl sm:text-4xl font-black text-[#0F1035] tracking-tight">
                {{ currentCareer.titleFr }}
              </h2>

              <p class="text-sm sm:text-base text-[#42466B] font-medium leading-relaxed">
                Un métier pour créer des images et communiquer des idées.
              </p>
            </div>
          </div>

          <!-- Section « En quoi consiste ce métier ? » -->
          <div class="pt-4 border-t border-[#F0EDFA] space-y-2">
            <h3 class="text-base sm:text-lg font-black text-[#0F1035] flex items-center gap-2">
              <span class="text-[#7C3AED] text-lg"><mb-icon name="target"></mb-icon></span>
              <span>En quoi consiste ce métier ?</span>
            </h3>
            <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed font-medium">
              Tu imagines des affiches, des logos, des visuels pour des sites internet ou des réseaux sociaux.
            </p>
          </div>

          <!-- Deux blocs côte à côte : « Ce que tu fais » et « Comment y arriver ? » -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Bloc 1 : Ce que tu fais -->
            <div class="rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] p-4 sm:p-5 flex items-start gap-3.5">
              <div class="h-11 w-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xl shrink-0">
                <mb-icon name="laptop"></mb-icon>
              </div>
              <div class="space-y-1">
                <h4 class="font-extrabold text-[#0F1035] text-sm">
                  Ce que tu fais
                </h4>
                <p class="text-xs text-[#42466B] leading-relaxed">
                  Dessiner, créer, utiliser des logiciels graphiques.
                </p>
              </div>
            </div>

            <!-- Bloc 2 : Comment y arriver ? -->
            <div class="rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] p-4 sm:p-5 flex items-start gap-3.5">
              <div class="h-11 w-11 rounded-2xl bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center text-xl shrink-0">
                <mb-icon name="graduation-cap"></mb-icon>
              </div>
              <div class="space-y-1">
                <h4 class="font-extrabold text-[#0F1035] text-sm">
                  Comment y arriver ?
                </h4>
                <p class="text-xs text-[#42466B] leading-relaxed">
                  Découvrir les formations et leurs conditions d'accès.
                </p>
              </div>
            </div>
          </div>

          <!-- Trois cartes d'action horizontales immédiates -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <!-- 1. Ce métier m'intéresse -->
            <div
              (click)="toggleFavorite()"
              class="rounded-2xl bg-white border border-[#E4E0F5] hover:border-rose-300 p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div class="flex items-center gap-2">
                <span class="text-rose-500 text-lg"><mb-icon name="heart" [filled]="true"></mb-icon></span>
                <span class="font-extrabold text-xs sm:text-sm text-[#0F1035] group-hover:text-rose-600">
                  Ce métier m'intéresse
                </span>
              </div>
              <p class="text-[11px] text-[#6B7280]">
                {{ isCareerFavorite ? 'Enregistré dans tes favoris !' : 'Je le garde pour plus tard →' }}
              </p>
            </div>

            <!-- 2. Je veux le découvrir près de chez moi (Mis en avant) -->
            <div
              (click)="openLocalOpportunities()"
              class="rounded-2xl bg-[#FEF9C3]/50 border border-[#FDE047] hover:border-amber-400 p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div class="flex items-center gap-2">
                <span class="text-amber-600 text-lg"><mb-icon name="map-pin"></mb-icon></span>
                <span class="font-extrabold text-xs sm:text-sm text-[#0F1035] group-hover:text-amber-800">
                  Je veux le découvrir près de chez moi
                </span>
              </div>
              <p class="text-[11px] text-[#6B7280]">
                Formations, structures d'aide et possibilités d'immersion →
              </p>
            </div>

            <!-- 3. J'ai une question (Coach IA) -->
            <div
              (click)="openCoachWithContext()"
              class="rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] hover:border-[#7C3AED] p-4 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div class="flex items-center gap-2">
                <span class="text-[#7C3AED] text-lg"><mb-icon name="message-circle"></mb-icon></span>
                <span class="font-extrabold text-xs sm:text-sm text-[#0F1035] group-hover:text-[#7C3AED]">
                  J'ai une question
                </span>
              </div>
              <p class="text-[11px] text-[#6B7280]">
                Je demande de l'aide au Coach IA ou à un professionnel →
              </p>
            </div>
          </div>

          <!-- Bouton Divulgation progressive « En savoir plus » -->
          <div class="text-center pt-2">
            <button
              type="button"
              (click)="showMoreDetails = !showMoreDetails"
              class="rounded-full border border-[#D8DCF0] bg-white hover:bg-[#FAF8FF] px-5 py-2.5 text-xs font-bold text-[#0F1035] transition inline-flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>ℹ</span>
              <span>{{ showMoreDetails ? 'Masquer les détails' : 'En savoir plus' }}</span>
              <span>{{ showMoreDetails ? '▲' : '▼' }}</span>
            </button>
          </div>

          <!-- Tiroir de détails O*NET FR révélé progressivement -->
          <div *ngIf="showMoreDetails" class="pt-4 border-t border-[#F0EDFA] space-y-4 animate-fadeIn text-xs sm:text-sm text-[#42466B]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-2">
                <h5 class="font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span><mb-icon name="target"></mb-icon></span>
                  <span>Missions principales (O*NET FR)</span>
                </h5>
                <ul class="list-disc list-inside space-y-1 text-xs text-[#31355B]">
                  <li>Création de chartes graphiques et logos</li>
                  <li>Mise en page de supports imprimés et digitaux</li>
                  <li>Utilisation d'outils de CAO/PAO (Photoshop, Illustrator, InDesign)</li>
                  <li>Collaboration avec clients et équipes de communication</li>
                </ul>
              </div>

              <div class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-2">
                <h5 class="font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span><mb-icon name="briefcase"></mb-icon></span>
                  <span>Conditions & Accompagnement</span>
                </h5>
                <p class="text-xs text-[#31355B]">
                  Zone de préparation O*NET : <strong>Niveau 4 (Bac+2 à Bac+4)</strong>. Accessible via BTS Design graphique, DN MADE, école d'art ou filière universitaire.
                </p>
                <p class="text-xs text-[#31355B]">
                  Salaire indicatif débutant : ~1 800 € à 2 300 € brut / mois selon le statut (agence, entreprise ou freelance).
                </p>
              </div>
            </div>
          </div>

          <!-- Passerelle vers l'Étape 3 : Je passe à l'action -->
          <div class="pt-4 border-t border-[#F0EDFA] flex items-center justify-end">
            <button
              type="button"
              (click)="goToStep(3)"
              class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <span>Passer à l'action avec ce métier</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <!-- ÉTAPE 3 : JE PASSE À L'ACTION (Maquette 3 officielle)               -->
      <!-- ================================================================== -->
      <!-- ================================================================== -->
      <div *ngIf="currentStep === 3 && currentCareer" class="space-y-8 animate-fadeIn">
        
        <!-- En-tête : Promesse d'action positive -->
        <div class="text-center space-y-2 pt-2">
          <h1 class="text-3xl sm:text-4xl font-black text-[#0F1035] tracking-tight">
            Et maintenant, tu peux passer à l'action
          </h1>
          <p class="text-sm sm:text-base text-[#42466B] font-medium max-w-xl mx-auto">
            Tu as découvert un métier qui t'intéresse. Choisis la prochaine étape qui te convient.
          </p>
        </div>

        <!-- Rappel du métier sélectionné sous forme de vignette compacte -->
        <div class="max-w-md mx-auto rounded-2xl bg-white border border-[#E4E0F5] p-3.5 flex items-center gap-3.5 shadow-xs">
          <div class="h-12 w-12 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xl shrink-0">
            <mb-icon name="palette"></mb-icon>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="font-extrabold text-sm text-[#0F1035] truncate">
              {{ currentCareer.titleFr }}
            </h4>
            <p class="text-xs text-[#6B7280] truncate">
              Un métier pour créer des images et communiquer des idées.
            </p>
          </div>
          <span *ngIf="isCareerFavorite" class="text-rose-500 text-sm" title="Favori sauvegardé"><mb-icon name="heart" [filled]="true"></mb-icon></span>
        </div>

        <!-- 3 Cartes d'action décisionnelles (Maquette 3) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <!-- Option 1 : Garder ce métier -->
          <div
            (click)="selectActionChoice('FAVORITE')"
            [class.ring-2]="selectedActionChoice === 'FAVORITE'"
            [class.ring-[#7C3AED]]="selectedActionChoice === 'FAVORITE'"
            [class.border-[#7C3AED]]="selectedActionChoice === 'FAVORITE'"
            class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div class="space-y-2">
              <span class="text-2xl"><mb-icon name="heart" [filled]="true"></mb-icon></span>
              <h3 class="text-base font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Garder ce métier
              </h3>
              <p class="text-xs text-[#42466B] leading-relaxed">
                Je le garde pour plus tard et je continue d'explorer d'autres pistes.
              </p>
            </div>
            <div class="pt-2 text-xs font-bold text-[#7C3AED] flex items-center gap-1">
              <span>{{ isCareerFavorite ? 'Déjà dans mes favoris ✓' : 'Sauvegarder dans mes favoris →' }}</span>
            </div>
          </div>

          <!-- Option 2 : Le découvrir près de chez moi (Mise en avant violette officielle) -->
          <div
            (click)="selectActionChoice('LOCAL')"
            [class.ring-4]="selectedActionChoice === 'LOCAL'"
            [class.ring-[#EDE9FE]]="selectedActionChoice === 'LOCAL'"
            class="rounded-3xl bg-[#FAF8FF] border-2 border-[#7C3AED] p-6 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between space-y-4 relative group"
          >
            <!-- Badge recommandé -->
            <span class="absolute -top-3 right-5 rounded-full bg-[#7C3AED] text-white text-[10px] font-extrabold px-3 py-0.5 shadow-2xs">
              Étape conseillée
            </span>

            <div class="space-y-2">
              <span class="text-2xl"><mb-icon name="map-pin"></mb-icon></span>
              <h3 class="text-base font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Le découvrir près de chez moi
              </h3>
              <p class="text-xs text-[#42466B] leading-relaxed">
                Formations, structures d'aide et possibilités d'immersion vérifiées.
              </p>
            </div>

            <div class="pt-2 text-xs font-black text-[#7C3AED] flex items-center justify-between">
              <span>Voir les opportunités locales</span>
              <span class="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs">→</span>
            </div>
          </div>

          <!-- Option 3 : Poser une question -->
          <div
            (click)="selectActionChoice('QUESTION')"
            [class.ring-2]="selectedActionChoice === 'QUESTION'"
            [class.ring-[#7C3AED]]="selectedActionChoice === 'QUESTION'"
            [class.border-[#7C3AED]]="selectedActionChoice === 'QUESTION'"
            class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div class="space-y-2">
              <span class="text-2xl"><mb-icon name="message-circle"></mb-icon></span>
              <h3 class="text-base font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Poser une question
              </h3>
              <p class="text-xs text-[#42466B] leading-relaxed">
                Je demande de l'aide au Coach IA ou je prépare mon entretien avec un conseiller.
              </p>
            </div>
            <div class="pt-2 text-xs font-bold text-[#7C3AED] flex items-center gap-1">
              <span>Ouvrir une discussion →</span>
            </div>
          </div>
        </div>

        <!-- Fil de progression « Ton parcours » (Maquette 3) -->
        <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs sm:text-sm font-extrabold text-[#0F1035]">
              Ton parcours
            </h4>
            <span class="text-xs font-bold text-[#7C3AED]">
              Étape 2 sur 3
            </span>
          </div>

          <!-- Barre avec 3 jalons -->
          <div class="grid grid-cols-3 gap-2 text-center text-xs">
            <!-- Jalon 1 : Validé -->
            <div class="space-y-1.5">
              <div class="h-2 rounded-full bg-emerald-500"></div>
              <p class="font-bold text-emerald-700 flex items-center justify-center gap-1">
                <span><mb-icon name="check"></mb-icon></span>
                <span>Métier découvert</span>
              </p>
            </div>

            <!-- Jalon 2 : Actif -->
            <div class="space-y-1.5">
              <div class="h-2 rounded-full bg-[#7C3AED]"></div>
              <p class="font-extrabold text-[#7C3AED] flex items-center justify-center gap-1">
                <span><mb-icon name="circle"></mb-icon></span>
                <span>Formation à explorer</span>
              </p>
            </div>

            <!-- Jalon 3 : À venir -->
            <div class="space-y-1.5">
              <div class="h-2 rounded-full bg-gray-200"></div>
              <p class="font-semibold text-gray-400">
                Première action
              </p>
            </div>
          </div>
        </div>

        <!-- Boutons d'action principaux en bas -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <!-- Bouton principal violet -->
          <button
            type="button"
            (click)="executeMainAction()"
            class="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#6328E8] via-[#7C3AED] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-sm sm:text-base px-8 py-4 shadow-lg hover:shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span><mb-icon name="graduation-cap"></mb-icon></span>
            <span>Trouver une formation ou une immersion →</span>
          </button>

          <!-- Bouton Voir un autre métier -->
          <button
            type="button"
            (click)="goToStep(1)"
            class="w-full sm:w-auto rounded-full border border-[#D8DCF0] bg-white hover:bg-gray-50 text-[#0F1035] font-extrabold text-xs sm:text-sm px-6 py-4 transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <span><mb-icon name="refresh-cw"></mb-icon></span>
            <span>Voir un autre métier</span>
          </button>

          <!-- Bouton Revenir plus tard -->
          <button
            type="button"
            (click)="goHome.emit()"
            class="w-full sm:w-auto rounded-full bg-transparent hover:bg-gray-100 text-[#6B7280] font-bold text-xs sm:text-sm px-5 py-4 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span><mb-icon name="clock"></mb-icon></span>
            <span>Revenir plus tard</span>
          </button>
        </div>

      </div>

    </div>
  `
})
export class AutonomousDiscoveryStepperComponent implements OnInit {
  @Input() initialStep: AutonomousStep = 1;
  @Input() currentFavorites: string[] = [];

  @Output() navigateToLocal = new EventEmitter<string>();
  @Output() navigateToCoach = new EventEmitter<{ careerTitle: string; prompt: string }>();
  @Output() navigateToImmersion = new EventEmitter<UICatalogCareer>();
  @Output() openFullCatalog = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();
  @Output() favoriteToggled = new EventEmitter<UICatalogCareer>();

  currentStep: AutonomousStep = 1;
  showMoreDetails = false;
  selectedActionChoice: 'FAVORITE' | 'LOCAL' | 'QUESTION' = 'LOCAL';

  // 6 Univers d'activités bienveillantes (Maquette 1)
  activityCards: DiscoveryActivityCard[] = [
    {
      id: 'CREATIVE',
      category: 'CREATIVE',
      title: 'Créer, dessiner, imaginer',
      iconType: 'palette',
      representativeCareerId: 'onet-27-1024-00' // Graphiste
    },
    {
      id: 'CRAFT',
      category: 'CRAFT',
      title: 'Fabriquer, réparer, construire',
      iconType: 'tools',
      representativeCareerId: 'onet-47-2141-00' // Peintre en bâtiment / artisanat
    },
    {
      id: 'CARE',
      category: 'CARE',
      title: 'Aider les autres',
      iconType: 'heart-hands',
      representativeCareerId: 'onet-31-1121-00' // Aide à domicile / social
    },
    {
      id: 'DIGITAL',
      category: 'DIGITAL',
      title: 'Utiliser les ordinateurs',
      iconType: 'computer',
      representativeCareerId: 'onet-15-1252-00' // Développeur / numérique
    },
    {
      id: 'NATURE',
      category: 'NATURE',
      title: 'Travailler avec la nature',
      iconType: 'nature',
      representativeCareerId: 'onet-37-3011-00' // Paysagiste / environnement
    },
    {
      id: 'EXPLORE',
      category: 'ALL',
      title: 'Je ne sais pas encore',
      iconType: 'signpost',
      representativeCareerId: 'onet-27-1024-00' // Découverte ouverte
    }
  ];

  selectedActivity: DiscoveryActivityCard = this.activityCards[0];
  currentCareer: UICatalogCareer | null = null;
  isCareerFavorite = false;

  ngOnInit(): void {
    this.currentStep = this.initialStep;
    this.loadRepresentativeCareer(this.selectedActivity.representativeCareerId);
  }

  selectActivity(activity: DiscoveryActivityCard): void {
    this.selectedActivity = activity;
    this.loadRepresentativeCareer(activity.representativeCareerId);
  }

  proceedToStep2(): void {
    this.currentStep = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStep(step: AutonomousStep): void {
    this.currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectActionChoice(choice: 'FAVORITE' | 'LOCAL' | 'QUESTION'): void {
    this.selectedActionChoice = choice;
  }

  toggleFavorite(): void {
    if (!this.currentCareer) return;
    this.isCareerFavorite = !this.isCareerFavorite;
    this.currentCareer.isFavorite = this.isCareerFavorite;
    this.favoriteToggled.emit(this.currentCareer);
  }

  openLocalOpportunities(): void {
    const query = this.currentCareer?.titleFr || 'Graphiste';
    this.navigateToLocal.emit(query);
  }

  openCoachWithContext(): void {
    const career = this.currentCareer?.titleFr || 'Graphiste';
    this.navigateToCoach.emit({
      careerTitle: career,
      prompt: `Bonjour ! J'ai exploré le métier de ${career} dans le parcours autonome. Peux-tu m'expliquer quelles sont les compétences indispensables et les perspectives dans la région de Nice ?`
    });
  }

  executeMainAction(): void {
    if (this.selectedActionChoice === 'LOCAL') {
      this.openLocalOpportunities();
    } else if (this.selectedActionChoice === 'QUESTION') {
      this.openCoachWithContext();
    } else if (this.selectedActionChoice === 'FAVORITE') {
      if (!this.isCareerFavorite) {
        this.toggleFavorite();
      }
      this.goToStep(1);
    }
  }

  onHeroImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  private loadRepresentativeCareer(careerId: string): void {
    const found = ONET_CAREERS_CATALOG_DATA.find((c) => c.id === careerId);
    if (found) {
      this.currentCareer = found;
    } else if (ONET_CAREERS_CATALOG_DATA.length > 0) {
      this.currentCareer = ONET_CAREERS_CATALOG_DATA[0];
    }
    if (this.currentCareer) {
      this.isCareerFavorite = this.currentFavorites.includes(this.currentCareer.id);
    }
  }
}
