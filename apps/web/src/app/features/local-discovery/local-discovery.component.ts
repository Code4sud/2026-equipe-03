// ============================================================================
// Composant Angular — « Autour de moi » (MonBilan+ Web)
// Refonte et fiabilisation complète conforme aux deux maquettes officielles :
// 1. Maquette Page Cartographique (Bannière, Filtres, Carte + Volet 16 résultats, Grille 3 col)
// 2. Maquette Fiche Détaillée Interactive (Hero, Pertinence Bilan, Métiers, Immersion, Contact, Transports, Fiabilité, 3 Actions)
// ============================================================================

import { CommonModule } from '@angular/common';
import { MbIconComponent, mbIconSvg } from '../../shared/ui/mb-icon.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  filterOpportunities,
  getCategoryCounts,
  LOCAL_OPPORTUNITIES_DATA,
  LocalFilterState,
  LocalOpportunity,
  OpportunityCategory
} from '../../shared/local-discovery-data';

declare const L: any;

@Component({
  selector: 'app-local-discovery',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  styles: [`
    :host ::ng-deep .leaflet-div-icon {
      background: transparent !important;
      border: none !important;
    }
    :host ::ng-deep .leaflet-popup-content-wrapper {
      border-radius: 20px !important;
      padding: 0 !important;
      overflow: hidden !important;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
      border: 1px solid #E4E0F5 !important;
    }
    :host ::ng-deep .leaflet-popup-content {
      margin: 0 !important;
      line-height: normal !important;
    }
    :host ::ng-deep .leaflet-container {
      font-family: inherit !important;
      z-index: 10 !important;
    }
    :host ::ng-deep .leaflet-popup-tip {
      background: white !important;
    }
  `],
  template: `
    <div class="space-y-6 pb-12">
      <!-- ==================================================================== -->
      <!-- 1. BANNIÈRE VIOLETTE EN-TÊTE (Fidèle à la Maquette 1)                 -->
      <!-- ==================================================================== -->
      <div class="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-[#6929CA] via-[#7B2CBF] to-[#9D4EDD] p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10">
        <!-- Fond décoratif subtil -->
        <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-start sm:items-center gap-4 max-w-2xl">
            <!-- Carré translucide avec picto pin blanc -->
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20 shadow-md">
              <span class="text-2xl sm:text-3xl">📍</span>
            </div>
            <div class="space-y-1">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Autour de moi
              </h1>
              <p class="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                Des formations, des entreprises et des structures d'accompagnement réelles, vérifiées et proches de chez toi.
              </p>
            </div>
          </div>

          <!-- Illustration cartographique stylisée 3D avec pin jaune (Maquette 1) -->
          <div class="hidden md:flex items-center justify-center shrink-0 pr-2">
            <div class="relative w-44 h-24 flex items-center justify-center">
              <svg viewBox="0 0 160 90" fill="none" class="w-full h-full drop-shadow-xl">
                <!-- Carte pliée isométrique -->
                <path d="M20 55 L60 38 L105 52 L145 35 L145 68 L105 82 L60 70 L20 85 Z" fill="#FFFFFF" fill-opacity="0.88" />
                <path d="M20 55 L60 38 L60 70 L20 85 Z" fill="#EDE9FE" />
                <path d="M60 38 L105 52 L105 82 L60 70 Z" fill="#DDD6FE" />
                <path d="M105 52 L145 35 L145 68 L105 82 Z" fill="#EDE9FE" />
                <!-- Lignes de rues sur la carte -->
                <path d="M30 65 L55 50" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" />
                <path d="M70 48 L95 60" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" />
                <path d="M115 54 L138 42" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" />
                <!-- Pin jaune vif officiel -->
                <g transform="translate(90, 8)">
                  <ellipse cx="14" cy="38" rx="8" ry="4" fill="#000000" fill-opacity="0.25" />
                  <path d="M14 0 C6.268 0 0 6.268 0 14 C0 24.5 14 38 14 38 C14 38 28 24.5 28 14 C28 6.268 21.732 0 14 0 Z" fill="#FACC15" />
                  <circle cx="14" cy="13" r="5" fill="#78350F" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- 2. BARRE DE FILTRES OFFICIELLE (Fidèle à la Maquette 1)              -->
      <!-- ==================================================================== -->
      <div class="rounded-[24px] sm:rounded-[28px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <!-- 1. Que recherches-tu ? -->
          <div class="lg:col-span-3 space-y-1.5">
            <label class="block text-xs font-bold text-[#42466B]">
              Que recherches-tu ?
            </label>
            <div class="relative">
              <select
                [(ngModel)]="filterState.category"
                (ngModelChange)="onFilterChanged()"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#0F1035] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition cursor-pointer pr-10"
              >
                <option value="ALL">Toutes les structures</option>
                <option value="FORMATION">Formations</option>
                <option value="ENTREPRISE">Entreprises</option>
                <option value="ACCOMPAGNEMENT">Structures d'aide</option>
              </select>
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500 font-bold">⌄</span>
            </div>
          </div>

          <!-- 2. Domaine -->
          <div class="lg:col-span-3 space-y-1.5">
            <label class="block text-xs font-bold text-[#42466B]">
              Domaine
            </label>
            <div class="relative">
              <select
                [(ngModel)]="filterState.domain"
                (ngModelChange)="onFilterChanged()"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#0F1035] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition cursor-pointer pr-10"
              >
                <option value="tous">Tous les domaines</option>
                <option value="creation-communication">Création & communication</option>
                <option value="numerique">Numérique</option>
                <option value="industrie-artisanat">Industrie & artisanat</option>
                <option value="commerce-gestion">Commerce & gestion</option>
                <option value="sante-social">Santé & social</option>
              </select>
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500 font-bold">⌄</span>
            </div>
          </div>

          <!-- 3. Rayon -->
          <div class="lg:col-span-2 space-y-1.5">
            <label class="block text-xs font-bold text-[#42466B]">
              Rayon
            </label>
            <div class="relative">
              <select
                [(ngModel)]="filterState.radiusKm"
                (ngModelChange)="onFilterChanged()"
                class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#0F1035] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition cursor-pointer pr-10"
              >
                <option [ngValue]="5">5 km</option>
                <option [ngValue]="10">10 km</option>
                <option [ngValue]="25">25 km</option>
                <option [ngValue]="50">50 km</option>
              </select>
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500 font-bold">⌄</span>
            </div>
          </div>

          <!-- 4. Toggle Switch : Uniquement avec immersion possible -->
          <div class="lg:col-span-3 flex items-center gap-3 py-2 cursor-pointer select-none" (click)="toggleImmersionOnly()">
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="filterState.onlyImmersion"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              [class.bg-[#7C3AED]="filterState.onlyImmersion"
              [class.bg-gray-300]="!filterState.onlyImmersion"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"
                [class.translate-x-5]="filterState.onlyImmersion"
                [class.translate-x-0]="!filterState.onlyImmersion"
              ></span>
            </button>
            <span class="text-xs sm:text-[13px] font-bold text-[#0F1035]">
              Uniquement avec immersion possible
            </span>
          </div>

          <!-- 5. Bouton Réinitialiser -->
          <div class="lg:col-span-1">
            <button
              type="button"
              (click)="resetFilters()"
              class="w-full rounded-2xl border border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] active:scale-95 text-xs font-bold py-2.5 sm:py-3 transition cursor-pointer text-center"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- 3. CARTE DES OPPORTUNITÉS & VOLET DROIT (Fidèle à la Maquette 1)     -->
      <!-- ==================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <!-- 3.1 CARTE LEAFLET (70% Largeur) -->
        <div class="lg:col-span-8 xl:col-span-9 flex flex-col space-y-3">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <span class="text-base text-[#7C3AED]">📍</span>
              <h2 class="text-base sm:text-lg font-extrabold text-[#0F1035]">
                Carte des opportunités — Nice et alentours
              </h2>
            </div>
          </div>

          <div class="relative w-full h-[400px] sm:h-[480px] rounded-[24px] overflow-hidden border border-[#E4E0F5] shadow-sm bg-[#E5E7EB]">
            <!-- Conteneur Leaflet DOM -->
            <div #mapContainer id="real-leaflet-map" class="w-full h-full z-10"></div>

            <!-- Contrôles Zoom Haut-Droite -->
            <div class="absolute top-4 right-4 z-20 flex flex-col gap-1.5 shadow-md">
              <button
                type="button"
                (click)="zoomIn()"
                title="Zoom avant"
                class="h-9 w-9 rounded-xl bg-white text-[#0F1035] hover:bg-gray-50 flex items-center justify-center text-lg font-black transition cursor-pointer border border-[#E4E0F5]"
              >
                +
              </button>
              <button
                type="button"
                (click)="zoomOut()"
                title="Zoom arrière"
                class="h-9 w-9 rounded-xl bg-white text-[#0F1035] hover:bg-gray-50 flex items-center justify-center text-lg font-black transition cursor-pointer border border-[#E4E0F5]"
              >
                −
              </button>
            </div>

            <!-- Mention de source Bas-Droite -->
            <div class="absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-semibold text-gray-600 border border-[#E4E0F5] shadow-2xs">
              Données : OpenStreetMap • © contributeurs
            </div>
          </div>
        </div>

        <!-- 3.2 VOLET LATÉRAL DROIT : 16 RÉSULTATS VÉRIFIÉS + SOURCES (30% Largeur) -->
        <div class="lg:col-span-4 xl:col-span-3 flex flex-col justify-between space-y-4">
          <div class="rounded-[24px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
            <div class="space-y-4">
              <!-- Titre -->
              <div class="flex items-center justify-between">
                <h3 class="text-base font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <span>{{ filteredOpportunities.length }} résultats vérifiés</span>
                  <span class="text-xs text-gray-400 font-bold" title="Données officielles contrôlées">ⓘ</span>
                </h3>
              </div>

              <!-- Liste des 3 compteurs avec icônes officielles -->
              <div class="space-y-3">
                <!-- Formations -->
                <div
                  (click)="filterByCategory('FORMATION')"
                  class="flex items-center justify-between p-3 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] hover:border-[#7C3AED] transition cursor-pointer group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-base font-black shrink-0">
                      🎓
                    </div>
                    <span class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                      Formations ({{ counts.formations }})
                    </span>
                  </div>
                  <span class="text-xs text-gray-400 font-bold">›</span>
                </div>

                <!-- Entreprises -->
                <div
                  (click)="filterByCategory('ENTREPRISE')"
                  class="flex items-center justify-between p-3 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] hover:border-[#059669] transition cursor-pointer group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-base font-black shrink-0">
                      💼
                    </div>
                    <span class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-emerald-700 transition">
                      Entreprises ({{ counts.entreprises }})
                    </span>
                  </div>
                  <span class="text-xs text-gray-400 font-bold">›</span>
                </div>

                <!-- Structures d'aide -->
                <div
                  (click)="filterByCategory('ACCOMPAGNEMENT')"
                  class="flex items-center justify-between p-3 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] hover:border-[#0284C7] transition cursor-pointer group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center text-base font-black shrink-0">
                      🏛️
                    </div>
                    <span class="text-xs sm:text-sm font-extrabold text-[#0F1035] group-hover:text-[#0284C7] transition">
                      Structures d'aide ({{ counts.structuresAide }})
                    </span>
                  </div>
                  <span class="text-xs text-gray-400 font-bold">›</span>
                </div>
              </div>
            </div>

            <!-- Encadré vert Sources officielles (Fidèle à la Maquette 1) -->
            <div class="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 space-y-2 mt-4">
              <div class="flex items-center gap-2 text-emerald-800 text-xs font-extrabold">
                <span class="text-sm">🛡️</span>
                <span>Sources officielles</span>
              </div>
              <p class="text-[11px] text-emerald-900 leading-relaxed font-medium">
                Données issues de sources publiques : Onisep • CARIF-OREF PACA • Recherche d'entreprises (SIRET) • Éducation nationale • UNML.
              </p>
              <div class="pt-1 border-t border-emerald-200/80 text-[10px] text-emerald-700 font-bold">
                Dernière mise à jour : 18 nov. 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- 4. RÉSULTATS À PROXIMITÉ (Grille 3 Colonnes — Fidèle à la Maquette 1) -->
      <!-- ==================================================================== -->
      <div class="space-y-4 pt-2">
        <div class="flex items-center justify-between px-1 flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <h2 class="text-lg sm:text-xl font-extrabold text-[#0F1035]">
              Résultats à proximité
            </h2>
            <span class="text-xs px-3 py-1 rounded-full bg-purple-100 text-[#6D28D9] font-extrabold">
              {{ filteredOpportunities.length }} structures
            </span>
          </div>

          <!-- Sélecteur de Tri -->
          <div class="flex items-center gap-2 text-xs font-semibold text-[#42466B]">
            <label for="sort-select">Trier par :</label>
            <div class="relative">
              <select
                id="sort-select"
                [(ngModel)]="filterState.sortBy"
                (ngModelChange)="onFilterChanged()"
                class="bg-white border border-[#E4E0F5] rounded-xl px-3 py-1.5 text-xs font-bold text-[#0F1035] outline-none focus:border-[#7C3AED] cursor-pointer shadow-2xs pr-8"
              >
                <option value="relevance">Pertinence</option>
                <option value="distance">Distance</option>
                <option value="name">Nom</option>
              </select>
              <span class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500">⌄</span>
            </div>
          </div>
        </div>

        <!-- Grille des cartes 3 colonnes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <article
            *ngFor="let item of filteredOpportunities"
            (click)="openDetailModal(item)"
            class="bg-white rounded-[24px] overflow-hidden border border-[#E4E0F5] shadow-sm hover:shadow-md hover:border-[#C4B5FD] transition-all duration-200 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <!-- Photo de l'établissement avec badges superposés -->
              <div class="relative w-full h-44 bg-gray-100 overflow-hidden">
                <img
                  [src]="item.imageUrl"
                  [alt]="item.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  (error)="onImageError($event, item)"
                />

                <!-- Badge Catégorie flottant haut-gauche -->
                <div class="absolute top-3 left-3">
                  <span
                    [class]="item.category === 'FORMATION'
                      ? 'bg-[#7C3AED] text-white'
                      : (item.category === 'ENTREPRISE' ? 'bg-[#0284C7] text-white' : 'bg-[#2563EB] text-white')"
                    class="text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md backdrop-blur-md"
                  >
                    {{ item.categoryLabel }}
                  </span>
                </div>

                <!-- Cœur Favori flottant haut-droite (persistant) -->
                <button
                  type="button"
                  (click)="toggleFavorite($event, item)"
                  class="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-sm shadow-md hover:scale-110 active:scale-95 transition cursor-pointer"
                  [title]="item.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                >
                  <span [class]="item.isFavorite ? 'text-[#7C3AED]' : 'text-gray-400'">
                    <mb-icon name="heart" [filled]="!!item.isFavorite"></mb-icon>
                  </span>
                </button>
              </div>

              <!-- Corps de la carte -->
              <div class="p-4 sm:p-5 space-y-2">
                <h3 class="text-base sm:text-lg font-extrabold text-[#0F1035] leading-snug group-hover:text-[#7C3AED] transition">
                  {{ item.name }}
                </h3>

                <div class="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                  <span>📍</span>
                  <span>{{ item.city }} • {{ item.distanceKm }} km</span>
                </div>

                <p class="text-xs text-[#42466B] line-clamp-2 leading-relaxed pt-1">
                  {{ item.headline }}
                </p>
              </div>
            </div>

            <!-- Pied de carte : Badges de vérification officiels (Fidèle à la Maquette 1) -->
            <div class="px-4 pb-4 pt-2 border-t border-[#F0EDFA] flex items-center justify-between gap-2 flex-wrap text-[11px] font-bold">
              <!-- Badge vérification gauche (Vert) -->
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span>{{ item.verificationBadge }}</span>
              </span>

              <!-- Badge source ou immersion droite -->
              <span
                *ngIf="item.immersionBadge && item.category === 'ENTREPRISE'"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200"
              >
                <span>{{ item.immersionBadge }}</span>
              </span>
              <span
                *ngIf="!item.immersionBadge || item.category !== 'ENTREPRISE'"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"
              >
                <span>{{ item.sourceBadge }}</span>
              </span>
            </div>
          </article>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- 5. FICHE DÉTAILLÉE INTERACTIVE (MODALE — Fidèle à la Maquette 2)      -->
      <!-- ==================================================================== -->
      <div
        *ngIf="selectedOpportunity"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="selectedOpportunity.name"
      >
        <div
          class="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl border border-[#E4E0F5] overflow-hidden flex flex-col my-auto max-h-[92vh]"
          (click)="$event.stopPropagation()"
        >
          <!-- 5.1 En-tête Hero avec Image, Badges superposés et Titre grand format -->
          <div class="relative w-full h-56 sm:h-64 md:h-72 bg-slate-900 shrink-0 overflow-hidden">
            <img
              [src]="selectedOpportunity.imageUrl"
              [alt]="selectedOpportunity.name"
              class="w-full h-full object-cover"
              (error)="onImageError($event, selectedOpportunity)"
            />
            <!-- Dégradé sombre pour contraste parfait -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#0F1035] via-[#0F1035]/65 to-black/30"></div>

            <!-- Badges superposés en haut à gauche -->
            <div class="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span
                [class]="selectedOpportunity.category === 'FORMATION'
                  ? 'bg-[#7C3AED] text-white'
                  : (selectedOpportunity.category === 'ENTREPRISE' ? 'bg-[#0284C7] text-white' : 'bg-[#2563EB] text-white')"
                class="text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider"
              >
                {{ selectedOpportunity.categoryLabel }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-white text-[#0F1035] shadow-md">
                <span class="text-emerald-600 font-black">✓</span>
                <span>{{ selectedOpportunity.verificationBadge.replace('✓ ', '') }}</span>
              </span>
              <span
                *ngIf="selectedOpportunity.hasImmersion"
                class="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#C4B5FD] shadow-md"
              >
                <span class="font-black">✓</span>
                <span>Immersion possible</span>
              </span>
            </div>

            <!-- Bouton Fermeture ✕ en haut à droite -->
            <button
              type="button"
              (click)="closeDetailModal()"
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center font-bold text-base transition cursor-pointer z-10 border border-white/20"
              aria-label="Fermer"
            >
              ✕
            </button>

            <!-- Titre & Spécialité en bas de l'image -->
            <div class="absolute bottom-4 inset-x-5 sm:inset-x-7 text-white space-y-1">
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {{ selectedOpportunity.name }}
              </h2>
              <p class="text-xs sm:text-sm text-purple-100 font-semibold drop-shadow-sm">
                {{ selectedOpportunity.headline }}
              </p>
            </div>
          </div>

          <!-- 5.2 Ligne d'adresse et lien "Voir sur la carte" (Fidèle à la Maquette 2) -->
          <div class="px-5 sm:px-7 py-3 bg-[#F8F7FF] border-b border-[#E4E0F5] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-[13px] font-semibold text-[#42466B]">
            <div class="flex items-center gap-2 flex-wrap">
              <span>📍 {{ selectedOpportunity.address }}</span>
              <span>•</span>
              <span>⏱ {{ selectedOpportunity.distanceKm }} km de toi</span>
            </div>
            <button
              type="button"
              (click)="viewOnMap(selectedOpportunity)"
              class="text-[#7C3AED] hover:text-[#5B21B6] font-extrabold inline-flex items-center gap-1 transition cursor-pointer"
            >
              <span>↗ Voir sur la carte</span>
            </button>
          </div>

          <!-- 5.3 Corps en 2 Colonnes (Fidèle à la Maquette 2) -->
          <div class="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- COLONNE GAUCHE (7/12) -->
              <div class="lg:col-span-7 space-y-5">
                <!-- 1. Pourquoi c'est pertinent pour toi ? (Bloc violet clair) -->
                <div class="rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] p-4 sm:p-5 space-y-2">
                  <div class="flex items-center gap-2 text-xs font-extrabold text-[#6D28D9] uppercase tracking-wider">
                    <span class="text-base">🎯</span>
                    <span>Pourquoi c'est pertinent pour toi ?</span>
                  </div>
                  <p class="text-xs sm:text-sm text-[#4C1D95] font-medium leading-relaxed">
                    {{ selectedOpportunity.pertinenceBilan }}
                  </p>
                </div>

                <!-- 2. Métiers à découvrir -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 sm:p-5 space-y-3">
                  <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                    <span class="text-base text-[#7C3AED]">📍</span>
                    <span>Métiers à découvrir</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <div
                      *ngFor="let m of selectedOpportunity.targetCareersDetailed || []"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] text-xs font-bold text-[#0F1035] shadow-2xs hover:border-[#7C3AED] transition"
                    >
                      <span>{{ m.icon }}</span>
                      <span>{{ m.name }}</span>
                    </div>
                    <div
                      *ngIf="!selectedOpportunity.targetCareersDetailed?.length"
                      class="flex flex-wrap gap-2"
                    >
                      <span
                        *ngFor="let c of selectedOpportunity.targetCareers"
                        class="px-3 py-1.5 rounded-xl bg-[#F8F7FF] border border-[#E4E0F5] text-xs font-bold text-[#0F1035]"
                      >
                        💼 {{ c }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 3. Modalités d'immersion -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 sm:p-5 space-y-3">
                  <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                      <span class="text-base">📅</span>
                      <span>Modalités d'immersion</span>
                    </div>
                    <span
                      *ngIf="selectedOpportunity.hasImmersion"
                      class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      ✓ Immersion possible
                    </span>
                  </div>

                  <div *ngIf="selectedOpportunity.modalitesImmersion" class="space-y-2 text-xs sm:text-[13px] text-[#42466B]">
                    <div class="flex items-start gap-2">
                      <span class="font-bold text-[#0F1035] shrink-0">Type :</span>
                      <span>{{ selectedOpportunity.modalitesImmersion.type }}</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="font-bold text-[#0F1035] shrink-0">Durée :</span>
                      <span>{{ selectedOpportunity.modalitesImmersion.duree }}</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="font-bold text-[#0F1035] shrink-0">Public :</span>
                      <span>{{ selectedOpportunity.modalitesImmersion.public }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- COLONNE DROITE (5/12) -->
              <div class="lg:col-span-5 space-y-5">
                <!-- 1. Contact & Informations -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 sm:p-5 space-y-3">
                  <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                    <span class="text-base">🔍</span>
                    <span>Contact & Informations</span>
                  </div>

                  <div class="space-y-2.5 text-xs sm:text-[13px]">
                    <div *ngIf="selectedOpportunity.contactInfo.phone" class="flex items-center gap-2 font-bold text-[#0F1035]">
                      <span>📞</span>
                      <a [href]="'tel:' + selectedOpportunity.contactInfo.phone" class="hover:text-[#7C3AED] transition">
                        {{ selectedOpportunity.contactInfo.phone }}
                      </a>
                    </div>
                    <div *ngIf="selectedOpportunity.contactInfo.email" class="flex items-center gap-2 font-bold text-[#0F1035]">
                      <span>✉️</span>
                      <a [href]="'mailto:' + selectedOpportunity.contactInfo.email" class="hover:text-[#7C3AED] transition truncate">
                        {{ selectedOpportunity.contactInfo.email }}
                      </a>
                    </div>
                    <div *ngIf="selectedOpportunity.contactInfo.websiteUrl" class="flex items-center gap-2 font-bold text-[#7C3AED]">
                      <span>🌐</span>
                      <a [href]="selectedOpportunity.contactInfo.websiteUrl" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1">
                        <span>{{ selectedOpportunity.contactInfo.websiteUrl.replace('https://', '') }}</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- 2. Accès & Transports -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 sm:p-5 space-y-3">
                  <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                    <span class="text-base">🚌</span>
                    <span>Accès & Transports</span>
                  </div>

                  <div class="space-y-2 text-xs sm:text-[13px] text-[#42466B]">
                    <div *ngIf="selectedOpportunity.accessTransports.tram" class="flex items-start gap-2">
                      <span class="text-sm shrink-0">🚊</span>
                      <span class="font-medium">{{ selectedOpportunity.accessTransports.tram }}</span>
                    </div>
                    <div *ngIf="selectedOpportunity.accessTransports.bus" class="flex items-start gap-2">
                      <span class="text-sm shrink-0">🚌</span>
                      <span class="font-medium">{{ selectedOpportunity.accessTransports.bus }}</span>
                    </div>
                    <div *ngIf="selectedOpportunity.accessTransports.walking" class="flex items-start gap-2">
                      <span class="text-sm shrink-0">🚶</span>
                      <span class="font-medium">{{ selectedOpportunity.accessTransports.walking }}</span>
                    </div>
                  </div>
                </div>

                <!-- 3. Source & Fiabilité -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 sm:p-5 space-y-2">
                  <div class="flex items-center gap-2 text-xs font-extrabold text-[#0F1035]">
                    <span class="text-base text-emerald-600">🛡️</span>
                    <span>Source & Fiabilité</span>
                  </div>

                  <div class="text-[11px] text-[#6B7280] space-y-1 leading-relaxed">
                    <p *ngIf="selectedOpportunity.sourceFiabilite.siret">
                      Données : Recherche d'entreprises (gouv.fr) – SIRET : <strong class="text-gray-700">{{ selectedOpportunity.sourceFiabilite.siret }}</strong>
                    </p>
                    <p *ngIf="!selectedOpportunity.sourceFiabilite.siret">
                      Données officielles : <strong class="text-gray-700">{{ selectedOpportunity.sourceFiabilite.sourceOrg }}</strong>
                    </p>
                    <p class="text-emerald-700 font-bold pt-1">
                      Dernière vérification : {{ selectedOpportunity.sourceFiabilite.lastCheckDate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5.4 Barre d'Action Inférieure (Fidèle à la Maquette 2) -->
          <div class="p-4 sm:p-6 bg-white border-t border-[#E4E0F5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <!-- Bouton Ajouter aux favoris -->
            <button
              type="button"
              (click)="toggleFavorite($event, selectedOpportunity)"
              class="w-full sm:w-auto px-5 py-3 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-xs sm:text-sm font-bold text-[#0F1035] flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <span [class]="selectedOpportunity.isFavorite ? 'text-[#7C3AED]' : 'text-gray-500'">
                <mb-icon name="heart" [filled]="!!selectedOpportunity.isFavorite"></mb-icon>
              </span>
              <span>{{ selectedOpportunity.isFavorite ? 'Dans mes favoris' : 'Ajouter aux favoris' }}</span>
            </button>

            <div class="flex items-center gap-3 w-full sm:w-auto">
              <!-- Préparer ma demande avec Mon Coach IA -->
              <button
                type="button"
                (click)="onOpenCoachIA(selectedOpportunity)"
                class="flex-1 sm:flex-none px-5 py-3 rounded-2xl border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] active:scale-95 text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>✨</span>
                <span>Préparer ma demande avec Mon Coach IA</span>
              </button>

              <!-- Demander une immersion -->
              <button
                type="button"
                (click)="onChooseForImmersion(selectedOpportunity)"
                class="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white active:scale-95 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📅</span>
                <span>Demander une immersion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LocalDiscoveryComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() initialCareer?: string;
  @Output() navigateToCoach = new EventEmitter<{ establishmentName: string; career: string }>();
  @Output() navigateToImmersion = new EventEmitter<{ companyName: string; career: string }>();

  @ViewChild('mapContainer') mapContainerRef?: ElementRef<HTMLDivElement>;

  filterState: LocalFilterState = {
    category: 'ALL',
    domain: 'tous',
    radiusKm: 10,
    onlyImmersion: false,
    careerQuery: '',
    sortBy: 'relevance'
  };

  allOpportunities: LocalOpportunity[] = [];
  filteredOpportunities: LocalOpportunity[] = [];
  selectedOpportunity: LocalOpportunity | null = null;

  // État Leaflet
  private map: any = null;
  private markersLayer: any = null;
  private resizeObserver: any = null;

  private readonly FAVORITES_STORAGE_KEY = 'monbilan_favorite_opportunities_2187';

  get counts() {
    return getCategoryCounts(this.allOpportunities);
  }

  ngOnInit(): void {
    // 1. Initialiser le jeu de données
    this.allOpportunities = LOCAL_OPPORTUNITIES_DATA.map((opp) => ({ ...opp }));

    // 2. Charger les favoris persistants
    this.loadFavorites();

    // 3. Appliquer le filtrage initial
    this.onFilterChanged();
  }

  ngAfterViewInit(): void {
    this.ensureLeaflet(() => {
      this.initLeafletMap();
    });
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // --------------------------------------------------------------------------
  // Persistance des favoris
  // --------------------------------------------------------------------------
  private loadFavorites(): void {
    try {
      const stored = localStorage.getItem(this.FAVORITES_STORAGE_KEY);
      if (stored) {
        const favoriteIds: string[] = JSON.parse(stored);
        this.allOpportunities.forEach((opp) => {
          opp.isFavorite = favoriteIds.includes(opp.id);
        });
      } else {
        // Favori par défaut illustré sur la maquette : Riviera Print & Découpe
        const defaultFav = this.allOpportunities.find((o) => o.id === 'opp-riviera-print');
        if (defaultFav) {
          defaultFav.isFavorite = true;
          localStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify([defaultFav.id]));
        }
      }
    } catch {
      // Ignorer si indisponible
    }
  }

  private saveFavorites(): void {
    try {
      const favoriteIds = this.allOpportunities.filter((o) => o.isFavorite).map((o) => o.id);
      localStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Ignorer
    }
  }

  toggleFavorite(event: Event, opp: LocalOpportunity): void {
    event.stopPropagation();
    opp.isFavorite = !opp.isFavorite;
    this.saveFavorites();
  }

  // --------------------------------------------------------------------------
  // Filtrage et interactions
  // --------------------------------------------------------------------------
  onFilterChanged(): void {
    this.filteredOpportunities = filterOpportunities(this.allOpportunities, this.filterState);
    if (this.map) {
      this.updateMapMarkers();
    }
  }

  filterByCategory(cat: OpportunityCategory): void {
    this.filterState.category = cat;
    this.onFilterChanged();
  }

  toggleImmersionOnly(): void {
    this.filterState.onlyImmersion = !this.filterState.onlyImmersion;
    this.onFilterChanged();
  }

  resetFilters(): void {
    this.filterState = {
      category: 'ALL',
      domain: 'tous',
      radiusKm: 10,
      onlyImmersion: false,
      careerQuery: '',
      sortBy: 'relevance'
    };
    this.onFilterChanged();
    if (this.map) {
      this.map.flyTo([43.705, 7.265], 13);
    }
  }

  // --------------------------------------------------------------------------
  // Leaflet & Carte
  // --------------------------------------------------------------------------
  private ensureLeaflet(callback: () => void): void {
    if (typeof L !== 'undefined') {
      callback();
      return;
    }
    const interval = setInterval(() => {
      if (typeof L !== 'undefined') {
        clearInterval(interval);
        callback();
      }
    }, 100);
    setTimeout(() => clearInterval(interval), 4000);
  }

  private initLeafletMap(): void {
    const el = document.getElementById('real-leaflet-map');
    if (!el || typeof L === 'undefined' || this.map) return;

    // Centrage sur Nice (Place Masséna / Lepante) avec zoom idéal 13
    this.map = L.map('real-leaflet-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([43.705, 7.265], 13);

    // Fond de carte clair et lisible comme sur la Maquette 1 (CartoDB Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.updateMapMarkers();

    // Gestion du redimensionnement
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.map) this.map.invalidateSize();
      });
      this.resizeObserver.observe(el);
    }
  }

  private updateMapMarkers(): void {
    if (!this.map || !this.markersLayer || typeof L === 'undefined') return;

    this.markersLayer.clearLayers();

    this.filteredOpportunities.forEach((opp) => {
      const lat = opp.coordinates.lat;
      const lng = opp.coordinates.lng;

      // Couleurs officielles selon catégorie
      const bgColor =
        opp.category === 'FORMATION'
          ? '#7C3AED' // Violet
          : opp.category === 'ENTREPRISE'
          ? '#059669' // Vert Émeraude (comme sur la Maquette 1)
          : '#0284C7'; // Bleu Cyan

      const iconEmoji =
        opp.category === 'FORMATION'
          ? '🎓'
          : opp.category === 'ENTREPRISE'
          ? '💼'
          : '🏛️';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${bgColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 15px;
            cursor: pointer;
            transition: transform 0.15s ease-in-out;
          " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            ${iconEmoji}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: inherit; width: 220px; padding: 12px; background: #FFFFFF; border-radius: 16px;">
          <div style="display: inline-block; background: ${bgColor}15; color: ${bgColor}; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 999px; margin-bottom: 6px;">
            ${opp.categoryLabel}
          </div>
          <h4 style="font-size: 13px; font-weight: 800; color: #0F1035; margin: 0 0 4px 0; line-height: 1.2;">
            ${opp.name}
          </h4>
          <p style="font-size: 11px; color: #6B7280; margin: 0 0 6px 0;">
            📍 ${opp.city} · ${opp.distanceKm} km
          </p>
          <button id="btn-popup-${opp.id}" style="
            width: 100%;
            background: #7C3AED;
            color: #FFFFFF;
            border: none;
            border-radius: 10px;
            padding: 6px 0;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
          ">
            Voir la fiche →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${opp.id}`);
        if (btn) {
          btn.onclick = () => {
            this.openDetailModal(opp);
          };
        }
      });

      this.markersLayer.addLayer(marker);
    });
  }

  zoomIn(): void {
    if (this.map) this.map.zoomIn();
  }

  zoomOut(): void {
    if (this.map) this.map.zoomOut();
  }

  // --------------------------------------------------------------------------
  // Modale & Navigation
  // --------------------------------------------------------------------------
  openDetailModal(opp: LocalOpportunity): void {
    this.selectedOpportunity = opp;
  }

  closeDetailModal(): void {
    this.selectedOpportunity = null;
  }

  viewOnMap(opp: LocalOpportunity): void {
    this.closeDetailModal();
    if (this.map) {
      this.map.flyTo([opp.coordinates.lat, opp.coordinates.lng], 15, { duration: 1.0 });
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }
  }

  onImageError(event: Event, opp: LocalOpportunity): void {
    const imgEl = event.target as HTMLImageElement;
    if (imgEl) {
      if (opp.category === 'FORMATION') {
        imgEl.src = 'assets/visuals/institutions/cfa-btp.jpg';
      } else if (opp.category === 'ENTREPRISE') {
        imgEl.src = 'assets/visuals/institutions/atelier-decors.jpg';
      } else {
        imgEl.src = 'assets/visuals/institutions/mission-locale.jpg';
      }
    }
  }

  onOpenCoachIA(opp: LocalOpportunity): void {
    this.closeDetailModal();
    const career = opp.targetCareers[0] || 'Graphiste';
    this.navigateToCoach.emit({ establishmentName: opp.name, career });
  }

  onChooseForImmersion(opp: LocalOpportunity): void {
    this.closeDetailModal();
    const career = opp.targetCareers[0] || 'Graphiste';
    this.navigateToImmersion.emit({ companyName: opp.name, career });
  }
}
