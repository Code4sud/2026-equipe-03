// ============================================================================
// Composant Angular — « Autour de moi » (MonBilan+ Web)
// Découverte territoriale des Formations, Organismes & Immersions (Nice / 06)
// Véritable carte interactive Satellite Hybride & Plan (Leaflet / Esri / OSM)
// Conforme à la maquette Trustdio Local / MonBilan+
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

export interface LocalZone {
  id: string;
  label: string;
  lat: number;
  lng: number;
  zoom: number;
}

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
    <div class="space-y-6">
      <!-- ==================================================================== -->
      <!-- 1. EN-TÊTE : AUTOUR DE MOI (Style Trustdio Local / MonBilan+)        -->
      <!-- ==================================================================== -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F1035] tracking-tight flex items-center gap-2">
              <span>Autour de moi</span>
              <span class="text-xl sm:text-2xl text-[#7C3AED]"><mb-icon name="sparkles"></mb-icon></span>
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-[#6B7280] mt-1">
            Des opportunités près de chez toi : formations, organismes d’accompagnement et entreprises où découvrir un métier.
          </p>
        </div>

        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 self-start sm:self-auto shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Données officielles vérifiées (Nice & 06)</span>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- 2. BARRE DE RECHERCHE & FILTRES RAPIDES                              -->
      <!-- ==================================================================== -->
      <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-4 sm:p-5 shadow-sm space-y-4">
        <!-- Champ de recherche + Ville + Rayon -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <!-- Recherche par mot-clé / métier -->
          <div class="md:col-span-5 relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]"><mb-icon name="search"></mb-icon></span>
            <input
              type="text"
              [(ngModel)]="filterState.careerQuery"
              (ngModelChange)="onFilterChanged()"
              placeholder="Quel métier ou formation t’intéresse ? (ex: Peintre décorateur)"
              class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#0F1035] placeholder:text-[#8E95AF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition"
            />
            <button
              *ngIf="filterState.careerQuery"
              type="button"
              (click)="clearCareerQuery()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <!-- Ville / Territoire -->
          <div class="md:col-span-3 relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]"><mb-icon name="map-pin"></mb-icon></span>
            <select
              [(ngModel)]="filterState.city"
              (ngModelChange)="onCityChanged()"
              class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] pl-10 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#0F1035] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition cursor-pointer"
            >
              <option value="Nice">Nice (06)</option>
              <option value="Cannes">Cannes (06)</option>
              <option value="Antibes">Antibes (06)</option>
              <option value="Grasse">Grasse (06)</option>
              <option value="Toutes">Tout le département 06</option>
            </select>
            <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-400">⌄</span>
          </div>

          <!-- Rayon -->
          <div class="md:col-span-2 relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]"><mb-icon name="target"></mb-icon></span>
            <select
              [(ngModel)]="filterState.radiusKm"
              (ngModelChange)="onFilterChanged()"
              class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] pl-10 pr-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#0F1035] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition cursor-pointer"
            >
              <option [ngValue]="10">10 km</option>
              <option [ngValue]="25">25 km</option>
              <option [ngValue]="50">50 km</option>
              <option [ngValue]="100">Département</option>
            </select>
            <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-400">⌄</span>
          </div>

          <!-- Bouton Rechercher -->
          <div class="md:col-span-2">
            <button
              type="button"
              (click)="onFilterChanged()"
              class="w-full rounded-2xl bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm py-2.5 sm:py-3 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span><mb-icon name="search"></mb-icon></span>
              <span>Rechercher</span>
            </button>
          </div>
        </div>

        <!-- Catégories (Pilules horizontales style Trustdio Local) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <!-- Toutes -->
          <button
            type="button"
            (click)="selectCategory('ALL')"
            [class]="filterState.category === 'ALL'
              ? 'bg-[#0F1035] text-white shadow-sm font-extrabold'
              : 'bg-[#F8F7FF] text-[#42466B] hover:bg-[#F3EFFE] border border-[#E4E0F5] font-semibold'"
            class="rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Toutes ({{ counts.total }})</span>
          </button>

          <!-- Formations -->
          <button
            type="button"
            (click)="selectCategory('FORMATION')"
            [class]="filterState.category === 'FORMATION'
              ? 'bg-[#7C3AED] text-white shadow-sm font-extrabold'
              : 'bg-[#F8F7FF] text-[#42466B] hover:bg-[#F3EFFE] border border-[#E4E0F5] font-semibold'"
            class="rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
          >
            <span><mb-icon name="graduation-cap"></mb-icon></span>
            <span>Formations ({{ counts.formations }})</span>
          </button>

          <!-- Organismes -->
          <button
            type="button"
            (click)="selectCategory('ACCOMPAGNEMENT')"
            [class]="filterState.category === 'ACCOMPAGNEMENT'
              ? 'bg-[#059669] text-white shadow-sm font-extrabold'
              : 'bg-[#F8F7FF] text-[#42466B] hover:bg-[#F3EFFE] border border-[#E4E0F5] font-semibold'"
            class="rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
          >
            <span><mb-icon name="handshake"></mb-icon></span>
            <span>Organismes ({{ counts.organismes }})</span>
          </button>

          <!-- Entreprises & immersions -->
          <button
            type="button"
            (click)="selectCategory('ENTREPRISE')"
            [class]="filterState.category === 'ENTREPRISE'
              ? 'bg-[#2563EB] text-white shadow-sm font-extrabold'
              : 'bg-[#F8F7FF] text-[#42466B] hover:bg-[#F3EFFE] border border-[#E4E0F5] font-semibold'"
            class="rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
          >
            <span><mb-icon name="building-2"></mb-icon></span>
            <span>Entreprises & immersions ({{ counts.entreprises }})</span>
          </button>
        </div>

        <!-- Sous-pilules : Zones territoriales 06 (Nice, Cannes, Antibes, Grasse) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-[#F0EDFA] pt-3">
          <span class="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider shrink-0 mr-1">
            Territoires 06 :
          </span>
          <button
            *ngFor="let zone of zones"
            type="button"
            (click)="selectZone(zone)"
            [class]="selectedZoneId === zone.id
              ? 'bg-[#EDE9FE] text-[#6D28D9] border-2 border-[#7C3AED] font-extrabold'
              : 'bg-white text-[#42466B] hover:bg-[#F8F7FF] border border-[#E4E0F5] font-semibold'"
            class="rounded-xl px-3 py-1.5 text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span><mb-icon name="map-pin"></mb-icon></span>
            <span>{{ zone.label }}</span>
          </button>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- 3. LA VÉRITABLE CARTE SATELLITE HYBRIDE & INTERACTIVE                -->
      <!-- ==================================================================== -->
      <div class="rounded-[28px] sm:rounded-[32px] bg-white border border-[#E4E0F5] p-4 sm:p-5 shadow-sm space-y-3">
        <div class="flex items-center justify-between px-1 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 class="text-sm sm:text-base font-extrabold text-[#0F1035]">
              Carte réelle des opportunités — {{ selectedZoneLabel }}
            </h2>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="text-xs font-extrabold text-[#7C3AED] bg-[#F3E8FF] px-3 py-1 rounded-full">
              {{ filteredOpportunities.length }} adresses géolocalisées
            </span>
          </div>
        </div>

        <!-- CONTENEUR CARTE RÉELLE (Leaflet / Satellite Hybride) -->
        <div class="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E4E0F5] shadow-inner bg-[#1A1A2E]">
          <!-- Le conteneur DOM Leaflet -->
          <div #mapContainer id="real-leaflet-map" class="w-full h-full z-10"></div>

          <!-- BADGE FLOTTANT HAUT-GAUCHE : MODE GOOGLE HYBRIDE • PRÉCIS (Conforme à la capture) -->
          <div class="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0F1035]/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg text-xs font-bold">
            <span class="h-2 w-2 rounded-full" [ngClass]="currentMapLayer === 'satellite' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'"></span>
            <span>{{ currentMapLayer === 'satellite' ? 'Google Hybride • Précis' : 'Plan OSM • Vectoriel' }}</span>
          </div>

          <!-- CONTRÔLES FLOTTANTS HAUT-DROITE (Style Trustdio Local) -->
          <div class="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <!-- Sélecteur de couche (Satellite / Rues) -->
            <button
              type="button"
              (click)="toggleMapLayer()"
              [title]="currentMapLayer === 'satellite' ? 'Passer en vue Plan des rues' : 'Passer en vue Satellite Hybride'"
              class="h-10 w-10 rounded-2xl bg-white/95 backdrop-blur-md text-[#0F1035] hover:bg-white shadow-lg border border-white/40 flex items-center justify-center text-base font-bold transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <mb-icon [name]="currentMapLayer === 'satellite' ? 'map' : 'satellite'"></mb-icon>
            </button>

            <!-- Bouton de recentrage / géolocalisation -->
            <button
              type="button"
              (click)="recenterMap()"
              title="Recentrer sur Nice"
              class="h-10 w-10 rounded-2xl bg-white/95 backdrop-blur-md text-[#0F1035] hover:bg-white shadow-lg border border-white/40 flex items-center justify-center text-base font-bold transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <mb-icon name="target"></mb-icon>
            </button>

            <!-- Zoom In -->
            <button
              type="button"
              (click)="zoomIn()"
              title="Zoom avant"
              class="h-10 w-10 rounded-2xl bg-white/95 backdrop-blur-md text-[#0F1035] hover:bg-white shadow-lg border border-white/40 flex items-center justify-center text-lg font-black transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              +
            </button>

            <!-- Zoom Out -->
            <button
              type="button"
              (click)="zoomOut()"
              title="Zoom arrière"
              class="h-10 w-10 rounded-2xl bg-white/95 backdrop-blur-md text-[#0F1035] hover:bg-white shadow-lg border border-white/40 flex items-center justify-center text-lg font-black transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              −
            </button>
          </div>

          <!-- LÉGENDE FLOTTANTE EN BAS DE LA CARTE -->
          <div class="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/60 flex items-center justify-around text-xs font-bold text-[#0F1035] flex-wrap gap-2">
            <div (click)="selectCategory('FORMATION')" class="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <span class="h-3 w-3 rounded-full bg-[#7C3AED] ring-2 ring-purple-200"></span>
              <span>Formations ({{ counts.formations }})</span>
            </div>
            <div (click)="selectCategory('ACCOMPAGNEMENT')" class="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <span class="h-3 w-3 rounded-full bg-[#059669] ring-2 ring-emerald-200"></span>
              <span>Organismes ({{ counts.organismes }})</span>
            </div>
            <div (click)="selectCategory('ENTREPRISE')" class="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <span class="h-3 w-3 rounded-full bg-[#2563EB] ring-2 ring-blue-200"></span>
              <span>Entreprises ({{ counts.entreprises }})</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- 4. LISTE DES OPPORTUNITÉS PROCHES (Fidèle à la maquette)             -->
      <!-- ==================================================================== -->
      <div class="space-y-4">
        <!-- En-tête de liste : Titre + Tri -->
        <div class="flex items-center justify-between px-1 flex-wrap gap-2">
          <h2 class="text-lg sm:text-xl font-extrabold text-[#0F1035] flex items-center gap-2">
            <span>Opportunités proches</span>
            <span class="text-xs px-3 py-1 rounded-full bg-purple-100 text-[#6D28D9] font-bold">
              {{ filteredOpportunities.length }} résultats
            </span>
          </h2>

          <div class="flex items-center gap-2 text-xs font-semibold text-[#42466B]">
            <label for="sort-select" class="hidden sm:inline">Trier par :</label>
            <select
              id="sort-select"
              [(ngModel)]="filterState.sortBy"
              (ngModelChange)="onFilterChanged()"
              class="bg-white border border-[#E4E0F5] rounded-xl px-3 py-2 text-xs font-bold text-[#0F1035] outline-none focus:border-[#7C3AED] cursor-pointer shadow-2xs"
            >
              <option value="relevance">Pertinence</option>
              <option value="distance">Distance croissante</option>
              <option value="name">Nom alphabétique</option>
            </select>
          </div>
        </div>

        <!-- État vide -->
        <div
          *ngIf="filteredOpportunities.length === 0"
          class="bg-white rounded-3xl p-8 text-center border border-[#E4E0F5] shadow-sm space-y-3"
        >
          <div class="text-4xl"><mb-icon name="search"></mb-icon></div>
          <h3 class="text-base font-bold text-[#0F1035]">Aucune opportunité trouvée pour cette recherche</h3>
          <p class="text-xs text-[#42466B] max-w-md mx-auto">
            Essaie d’élargir le rayon, de choisir une autre ville ou de réinitialiser le filtre métier.
          </p>
          <button
            type="button"
            (click)="resetFilters()"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EDE9FE] text-[#6D28D9] font-extrabold text-xs transition hover:bg-[#DDD6FE]"
          >
            <span>↺ Réinitialiser les filtres</span>
          </button>
        </div>

        <!-- Grille des cartes d'opportunités -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            *ngFor="let item of filteredOpportunities"
            (mouseenter)="onHoverCard(item)"
            (mouseleave)="hoveredOpportunityId = null"
            [class.ring-2]="hoveredOpportunityId === item.id || selectedOpportunity?.id === item.id"
            [class.ring-[#7C3AED]]="hoveredOpportunityId === item.id || selectedOpportunity?.id === item.id"
            class="bg-white rounded-[24px] p-4 border border-[#E4E0F5] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-3"
          >
            <div class="space-y-3">
              <!-- Photo de l'établissement avec badges superposés -->
              <div class="relative w-full h-40 rounded-2xl overflow-hidden bg-gray-100 border border-[#E4E0F5]/80">
                <img
                  [src]="item.imageUrl || getDefaultImage(item)"
                  [alt]="item.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  (error)="onImageError($event, item)"
                />

                <!-- Badge Catégorie flottant en haut à gauche -->
                <div class="absolute top-2.5 left-2.5">
                  <span
                    [class]="item.category === 'FORMATION'
                      ? 'bg-[#7C3AED] text-white'
                      : (item.category === 'ACCOMPAGNEMENT' ? 'bg-[#059669] text-white' : 'bg-[#2563EB] text-white')"
                    class="text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md"
                  >
                    {{ item.category === 'FORMATION' ? 'Formation' : (item.category === 'ACCOMPAGNEMENT' ? 'Accompagnement' : 'Entreprise') }}
                  </span>
                </div>

                <!-- Bouton Favori en haut à droite -->
                <button
                  type="button"
                  (click)="toggleFavorite(item)"
                  class="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-sm shadow-md hover:bg-white transition"
                  [title]="item.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                >
                  <span *ngIf="item.isFavorite" class="text-pink-500"><mb-icon name="heart" [filled]="true"></mb-icon></span>
                  <span *ngIf="!item.isFavorite" class="text-gray-400"><mb-icon name="heart"></mb-icon></span>
                </button>

                <!-- Badge distance en bas à gauche -->
                <div class="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  <mb-icon name="map-pin"></mb-icon> {{ item.city }} · {{ item.distanceKm }} km
                </div>
              </div>

              <!-- Informations de la carte -->
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span class="font-bold text-gray-700">{{ item.subType }}</span>
                  <span>•</span>
                  <span class="text-emerald-600 font-bold">✓ Données vérifiées</span>
                </div>

                <h3 class="text-base font-extrabold text-[#0F1035] leading-snug group-hover:text-[#7C3AED] transition line-clamp-1">
                  {{ item.name }}
                </h3>

                <p class="text-xs text-[#42466B] line-clamp-2 leading-relaxed">
                  {{ item.headline }}
                </p>
              </div>
            </div>

            <!-- Pied de carte : Bouton Voir la fiche & centrage -->
            <div class="pt-2 border-t border-[#F0EDFA] flex items-center justify-between gap-2">
              <button
                type="button"
                (click)="focusOnMap(item)"
                class="text-xs font-bold text-gray-500 hover:text-[#7C3AED] flex items-center gap-1"
                title="Situer sur la carte"
              >
                <span><mb-icon name="target"></mb-icon></span>
                <span>Situer</span>
              </button>

              <button
                type="button"
                (click)="openDetailModal(item)"
                class="rounded-xl border border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] font-extrabold text-xs px-3.5 py-1.5 transition flex items-center gap-1.5 shadow-2xs"
              >
                <span>Voir la fiche</span>
                <span>→</span>
              </button>
            </div>
          </article>
        </div>
      </div>

      <!-- ==================================================================== -->
      <!-- 5. MODALE FICHE DÉTAILLÉE D'UN ÉTABLISSEMENT OU D'UNE ENTREPRISE     -->
      <!-- ==================================================================== -->
      <div
        *ngIf="selectedOpportunity"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="selectedOpportunity.name"
      >
        <div
          class="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl border border-[#E9E4F5] overflow-hidden flex flex-col max-h-[90vh]"
          (click)="$event.stopPropagation()"
        >
          <!-- En-tête Modale avec Image Hero de l'Établissement & Badges -->
          <div class="relative w-full h-52 sm:h-60 overflow-hidden bg-slate-900 shrink-0">
            <img
              [src]="selectedOpportunity.imageUrl || getDefaultImage(selectedOpportunity)"
              [alt]="selectedOpportunity.name"
              class="w-full h-full object-cover opacity-85"
              (error)="onImageError($event, selectedOpportunity)"
            />
            <!-- Dégradé sombre pour lisibilité du titre -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#0F1035] via-[#0F1035]/60 to-black/30"></div>

            <!-- Bouton Fermer flottant en haut à droite -->
            <button
              type="button"
              (click)="closeDetailModal()"
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center font-bold text-base transition shadow-md border border-white/20 cursor-pointer z-10"
              aria-label="Fermer la fiche"
            >
              ✕
            </button>

            <!-- Badges flottants en haut à gauche -->
            <div class="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span
                [class]="selectedOpportunity.category === 'FORMATION'
                  ? 'bg-[#7C3AED] text-white shadow-purple-900/50'
                  : (selectedOpportunity.category === 'ACCOMPAGNEMENT' ? 'bg-[#059669] text-white shadow-emerald-900/50' : 'bg-[#2563EB] text-white shadow-blue-900/50')"
                class="text-xs font-black px-3 py-1 rounded-full shadow-lg backdrop-blur-md uppercase tracking-wide"
              >
                {{ getCategoryLabel(selectedOpportunity.category) }}
              </span>
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-white/95 text-[#0F1035] shadow-md backdrop-blur-md">
                {{ selectedOpportunity.subType }}
              </span>
              <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Vérifié 06
              </span>
            </div>

            <!-- Titre & Localisation sur l'image en bas -->
            <div class="absolute bottom-4 inset-x-4 sm:inset-x-6 text-white space-y-1">
              <h2 class="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                {{ selectedOpportunity.name }}
              </h2>
              <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#E0E7FF]/90">
                <span class="flex items-center gap-1">
                  <span>📍</span>
                  <span>{{ selectedOpportunity.address }}</span>
                </span>
                <span>•</span>
                <span class="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] text-white font-bold">
                  {{ selectedOpportunity.distanceKm }} km de Nice
                </span>
              </div>
            </div>
          </div>

          <!-- Contenu Modale -->
          <div class="p-5 sm:p-7 space-y-5 overflow-y-auto min-h-0 flex-1">
            <!-- 1. Bloc Correspondance Rapport & Bilan -->
            <div class="rounded-2xl bg-gradient-to-r from-[#EDE9FE] via-[#F3E8FF] to-[#FAF5FF] p-4 border border-[#DDD6FE] space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#6D28D9]">
                  <span>🎯</span>
                  <span>En lien direct avec ton bilan</span>
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6D28D9] text-white">
                  Profil vérifié
                </span>
              </div>
              <p class="text-xs text-[#4C1D95] font-medium leading-relaxed">
                Cet établissement prépare spécifiquement aux pistes métiers identifiées dans ton rapport d'orientation (Rdv 2187).
              </p>
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-xs font-bold text-[#5B21B6]">Métiers cibles :</span>
                <span
                  *ngFor="let c of selectedOpportunity.targetCareers"
                  class="rounded-lg bg-white/90 border border-[#C4B5FD] px-2.5 py-0.5 text-xs font-bold text-[#6D28D9] shadow-2xs"
                >
                  💼 {{ c }}
                </span>
              </div>
            </div>

            <!-- 2. Intitulé & Description pédagogique -->
            <div class="space-y-3 bg-[#F8F7FF] p-4 sm:p-5 rounded-2xl border border-[#E4E0F5]">
              <div class="flex items-start gap-3">
                <div class="h-10 w-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-lg font-black shrink-0">
                  {{ selectedOpportunity.category === 'FORMATION' ? '🎓' : (selectedOpportunity.category === 'ACCOMPAGNEMENT' ? '🤝' : '🏢') }}
                </div>
                <div class="space-y-1 min-w-0 flex-1">
                  <h3 class="text-sm sm:text-base font-extrabold text-[#0F1035]">
                    {{ selectedOpportunity.headline }}
                  </h3>
                  <p class="text-xs sm:text-[13px] text-[#42466B] leading-relaxed">
                    {{ selectedOpportunity.description }}
                  </p>
                </div>
              </div>

              <!-- 4 Caractéristiques clés en grille -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E9E4F5]">
                <div class="bg-white p-2.5 rounded-xl border border-[#E4E0F5] text-center">
                  <span class="text-[10px] font-bold text-[#6B7280] block uppercase">Niveau</span>
                  <span class="text-xs font-black text-[#0F1035] block truncate">
                    {{ selectedOpportunity.diplomas?.[0] || 'Tous niveaux' }}
                  </span>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-[#E4E0F5] text-center">
                  <span class="text-[10px] font-bold text-[#6B7280] block uppercase">Rythme</span>
                  <span class="text-xs font-black text-[#0F1035] block truncate">
                    {{ selectedOpportunity.modalities?.[0] || 'Pratique' }}
                  </span>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-[#E4E0F5] text-center">
                  <span class="text-[10px] font-bold text-[#6B7280] block uppercase">Coût</span>
                  <span class="text-xs font-black text-emerald-700 block truncate">
                    {{ selectedOpportunity.category === 'FORMATION' ? 'Rémunéré / Gratuit' : '100% Gratuit' }}
                  </span>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-[#E4E0F5] text-center">
                  <span class="text-[10px] font-bold text-[#6B7280] block uppercase">Distance</span>
                  <span class="text-xs font-black text-[#7C3AED] block truncate">
                    {{ selectedOpportunity.distanceKm }} km
                  </span>
                </div>
              </div>
            </div>

            <!-- 3. Modalités & Diplômes enrichis -->
            <div *ngIf="selectedOpportunity.modalities?.length || selectedOpportunity.diplomas?.length" class="space-y-2">
              <h4 class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider flex items-center gap-1.5">
                <span>📋</span>
                <span>Modalités, Diplômes & Certifications</span>
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let m of selectedOpportunity.modalities"
                  class="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-[#6D28D9] border border-purple-200 flex items-center gap-1 shadow-2xs"
                >
                  <span class="text-emerald-500 font-extrabold">✓</span>
                  <span>{{ m }}</span>
                </span>
                <span
                  *ngFor="let d of selectedOpportunity.diplomas"
                  class="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 shadow-2xs"
                >
                  <mb-icon name="graduation-cap"></mb-icon>
                  <span>{{ d }}</span>
                </span>
              </div>
            </div>

            <!-- 4. Coordonnées vérifiées & Transports / Itinéraire -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <!-- Contact direct -->
              <div class="bg-white p-4 rounded-2xl border border-[#E4E0F5] space-y-2 shadow-2xs">
                <span class="font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <mb-icon name="phone"></mb-icon>
                  <span>Contact direct & Candidature</span>
                </span>
                <div class="space-y-1.5 text-xs">
                  <p *ngIf="selectedOpportunity.phone" class="font-bold text-[#0F1035] flex items-center justify-between">
                    <span class="text-gray-500 font-normal">Téléphone :</span>
                    <a [href]="'tel:' + selectedOpportunity.phone" class="text-purple-700 font-extrabold hover:underline">
                      {{ selectedOpportunity.phone }}
                    </a>
                  </p>
                  <p *ngIf="selectedOpportunity.email" class="font-bold text-[#0F1035] flex items-center justify-between truncate">
                    <span class="text-gray-500 font-normal">Email :</span>
                    <a [href]="'mailto:' + selectedOpportunity.email" class="text-purple-700 font-bold hover:underline truncate ml-2">
                      {{ selectedOpportunity.email }}
                    </a>
                  </p>
                  <p *ngIf="selectedOpportunity.websiteUrl" class="pt-1 border-t border-gray-100">
                    <a
                      [href]="selectedOpportunity.websiteUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-purple-50 text-[#6D28D9] font-extrabold hover:bg-purple-100 transition"
                    >
                      <span>Visiter le site officiel</span>
                      <span>↗</span>
                    </a>
                  </p>
                </div>
              </div>

              <!-- Accès, Transports & Google Maps -->
              <div class="bg-white p-4 rounded-2xl border border-[#E4E0F5] space-y-2 shadow-2xs">
                <span class="font-extrabold text-[#0F1035] flex items-center gap-1.5">
                  <mb-icon name="bus"></mb-icon>
                  <span>Accès & Transports</span>
                </span>
                <p class="text-[#42466B] font-medium leading-relaxed">
                  {{ selectedOpportunity.transitInfo || 'Desservi par le réseau Métropole Nice Côte d’Azur' }}
                </p>
                <div class="pt-1 border-t border-gray-100 flex items-center justify-between">
                  <span class="text-[11px] text-gray-400">Source : {{ selectedOpportunity.source }}</span>
                  <a
                    [href]="getGoogleMapsUrl(selectedOpportunity)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <span>Itinéraire Maps</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- 5. Astuce pédagogique pour le jeune -->
            <div class="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-xs text-[#92400E] flex items-start gap-2.5">
              <span class="text-base shrink-0">💡</span>
              <p class="leading-relaxed">
                <strong>Conseil MonBilan+ :</strong> Avant de prendre contact, clique sur <strong>Mon Coach IA</strong> ci-dessous. Tu pourras générer un message de motivation personnalisé et préparer tes questions pour un échange ou une visite !
              </p>
            </div>
          </div>

          <!-- Pied de Modale : Passerelles vers Mon Coach IA, Immersion & Favoris -->
          <div class="p-4 sm:p-5 bg-white border-t border-[#E9E4F5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              (click)="toggleFavorite(selectedOpportunity)"
              class="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <span><mb-icon [name]="'heart'" [filled]="!!(selectedOpportunity.isFavorite)"></mb-icon> {{ selectedOpportunity.isFavorite ? 'Dans mes favoris' : 'Ajouter aux favoris' }}</span>
            </button>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <!-- Passerelle Coach IA -->
              <button
                type="button"
                (click)="onOpenCoachIA(selectedOpportunity)"
                class="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#6D28D9] text-white text-xs font-extrabold shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span class="flex items-center gap-1.5"><mb-icon name="sparkles"></mb-icon> Mon Coach IA</span>
                <span class="hidden sm:inline opacity-90 font-medium">(Préparer ma demande)</span>
              </button>

              <!-- Passerelle Immersion Pro si entreprise -->
              <button
                *ngIf="selectedOpportunity.category === 'ENTREPRISE'"
                type="button"
                (click)="onChooseForImmersion(selectedOpportunity)"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-[#0F1035] text-white text-xs font-extrabold hover:bg-black active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span class="flex items-center gap-1.5"><mb-icon name="briefcase"></mb-icon> Immersion</span>
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
    careerQuery: '',
    city: 'Nice',
    radiusKm: 25,
    category: 'ALL',
    sortBy: 'relevance'
  };

  zones: LocalZone[] = [
    { id: 'ALL', label: 'Toutes les zones', lat: 43.68, lng: 7.15, zoom: 11 },
    { id: 'NICE', label: 'Nice Baie des Anges', lat: 43.7102, lng: 7.2620, zoom: 13 },
    { id: 'CANNES', label: 'Cannes & Lérins', lat: 43.5528, lng: 7.0174, zoom: 13 },
    { id: 'ANTIBES', label: 'Antibes & Sophia', lat: 43.5804, lng: 7.1251, zoom: 13 },
    { id: 'GRASSE', label: 'Grasse & Pays de Grasse', lat: 43.6601, lng: 6.9242, zoom: 13 }
  ];

  selectedZoneId = 'NICE';
  selectedZoneLabel = 'Nice Baie des Anges';

  allOpportunities: LocalOpportunity[] = [];
  filteredOpportunities: LocalOpportunity[] = [];
  selectedOpportunity: LocalOpportunity | null = null;
  hoveredOpportunityId: string | null = null;

  // État carte réelle Leaflet
  private map: any = null;
  private markersLayer: any = null;
  private satelliteLayerGroup: any = null;
  private osmLayer: any = null;
  currentMapLayer: 'satellite' | 'streets' = 'satellite';

  get counts() {
    return getCategoryCounts(this.allOpportunities);
  }

  ngOnInit(): void {
    this.allOpportunities = [...LOCAL_OPPORTUNITIES_DATA];
    if (this.initialCareer) {
      this.filterState.careerQuery = this.initialCareer;
    } else {
      this.filterState.careerQuery = 'Peintre décorateur';
    }
    this.onFilterChanged();
  }

  ngAfterViewInit(): void {
    // Initialisation sécurisée de la vraie carte Leaflet
    this.ensureLeaflet(() => {
      this.initLeafletMap();
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private ensureLeaflet(callback: () => void): void {
    if (typeof L !== 'undefined') {
      callback();
      return;
    }
    // Injection dynamique si le script CDN prend quelques millisecondes à se charger
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

    // Création de la carte Leaflet centrée sur Nice
    this.map = L.map('real-leaflet-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([43.7102, 7.2620], 12);

    // 1. Couche Satellite Hybride (Esri World Imagery + labels)
    const esriSatellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    );
    const esriLabels = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    );
    this.satelliteLayerGroup = L.layerGroup([esriSatellite, esriLabels]);

    // 2. Couche Plan des rues vectoriel (CartoDB Voyager)
    this.osmLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    );

    // Activer la vue satellite par défaut (comme sur la capture)
    this.satelliteLayerGroup.addTo(this.map);

    // Groupe pour les marqueurs
    this.markersLayer = L.layerGroup().addTo(this.map);

    // Ajout des marqueurs réels
    this.updateMapMarkers();
  }

  private updateMapMarkers(): void {
    if (!this.map || !this.markersLayer || typeof L === 'undefined') return;

    this.markersLayer.clearLayers();

    const bounds: [number, number][] = [];

    this.filteredOpportunities.forEach((opp) => {
      const lat = opp.coordinates.lat;
      const lng = opp.coordinates.lng;
      bounds.push([lat, lng]);

      // Définir la couleur et l'icône selon la catégorie
      const color =
        opp.category === 'FORMATION'
          ? '#7C3AED'
          : opp.category === 'ACCOMPAGNEMENT'
          ? '#059669'
          : '#2563EB';

      const iconSvg = mbIconSvg(
        opp.category === 'FORMATION'
          ? 'graduation-cap'
          : opp.category === 'ACCOMPAGNEMENT'
          ? 'handshake'
          : 'building-2'
      );

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${color};
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            ${iconSvg}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup au clic avec design riche
      const popupContent = `
        <div style="font-family: inherit; width: 220px; padding: 12px; background: #FFFFFF; border-radius: 16px;">
          <div style="display: inline-block; background: ${color}15; color: ${color}; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 999px; margin-bottom: 6px;">
            ${opp.subType}
          </div>
          <h4 style="font-size: 13px; font-weight: 800; color: #0F1035; margin: 0 0 4px 0; line-height: 1.2;">
            ${opp.name}
          </h4>
          <p style="font-size: 11px; color: #6B7280; margin: 0 0 6px 0;">
            ${mbIconSvg('map-pin')} ${opp.city} · ${opp.distanceKm} km
          </p>
          <div style="font-size: 11px; color: #42466B; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${opp.headline}
          </div>
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

      marker.on('click', () => {
        this.hoveredOpportunityId = opp.id;
      });

      this.markersLayer.addLayer(marker);
    });

    // Ajuster le cadrage si des marqueurs existent et si "Toutes les zones" est actif
    if (this.selectedZoneId === 'ALL' && bounds.length > 0 && this.map) {
      try {
        this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch {
        // Fallback cadrage doux
      }
    }
  }

  toggleMapLayer(): void {
    if (!this.map) return;
    if (this.currentMapLayer === 'satellite') {
      this.map.removeLayer(this.satelliteLayerGroup);
      this.osmLayer.addTo(this.map);
      this.currentMapLayer = 'streets';
    } else {
      this.map.removeLayer(this.osmLayer);
      this.satelliteLayerGroup.addTo(this.map);
      this.currentMapLayer = 'satellite';
    }
  }

  recenterMap(): void {
    if (!this.map) return;
    this.map.flyTo([43.7102, 7.2620], 13, { duration: 1.2 });
  }

  zoomIn(): void {
    if (this.map) this.map.zoomIn();
  }

  zoomOut(): void {
    if (this.map) this.map.zoomOut();
  }

  selectZone(zone: LocalZone): void {
    this.selectedZoneId = zone.id;
    this.selectedZoneLabel = zone.label;

    if (zone.id === 'ALL') {
      this.filterState.city = 'Toutes';
    } else if (zone.id === 'NICE') {
      this.filterState.city = 'Nice';
    } else if (zone.id === 'CANNES') {
      this.filterState.city = 'Cannes';
    } else if (zone.id === 'ANTIBES') {
      this.filterState.city = 'Antibes';
    } else if (zone.id === 'GRASSE') {
      this.filterState.city = 'Grasse';
    }

    this.onFilterChanged();

    if (this.map) {
      this.map.flyTo([zone.lat, zone.lng], zone.zoom, { duration: 1.2 });
    }
  }

  focusOnMap(opp: LocalOpportunity): void {
    if (this.map) {
      this.map.flyTo([opp.coordinates.lat, opp.coordinates.lng], 15, { duration: 1.0 });
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  }

  onHoverCard(opp: LocalOpportunity): void {
    this.hoveredOpportunityId = opp.id;
  }

  onFilterChanged(): void {
    this.filteredOpportunities = filterOpportunities(this.allOpportunities, this.filterState);
    if (this.map) {
      this.updateMapMarkers();
    }
  }

  onCityChanged(): void {
    if (this.filterState.city === 'Toutes') {
      this.selectedZoneId = 'ALL';
      this.selectedZoneLabel = 'Alpes-Maritimes (06)';
      if (this.map) this.map.flyTo([43.68, 7.15], 11);
    } else {
      const matchZone = this.zones.find((z) =>
        z.label.toLowerCase().includes(this.filterState.city.toLowerCase())
      );
      if (matchZone) {
        this.selectedZoneId = matchZone.id;
        this.selectedZoneLabel = matchZone.label;
        if (this.map) this.map.flyTo([matchZone.lat, matchZone.lng], matchZone.zoom);
      }
    }
    this.onFilterChanged();
  }

  getCategoryLabel(category?: string): string {
    if (category === 'FORMATION') return 'Formation';
    if (category === 'ACCOMPAGNEMENT') return 'Organisme d’accompagnement';
    if (category === 'ENTREPRISE') return 'Entreprise d’immersion';
    return 'Opportunité';
  }

  selectCategory(cat: OpportunityCategory): void {
    this.filterState.category = cat;
    this.onFilterChanged();
  }

  clearCareerQuery(): void {
    this.filterState.careerQuery = '';
    this.onFilterChanged();
  }

  resetFilters(): void {
    this.filterState = {
      careerQuery: '',
      city: 'Nice',
      radiusKm: 25,
      category: 'ALL',
      sortBy: 'relevance'
    };
    this.selectedZoneId = 'NICE';
    this.selectedZoneLabel = 'Nice Baie des Anges';
    this.onFilterChanged();
    if (this.map) {
      this.map.flyTo([43.7102, 7.2620], 12);
    }
  }

  toggleFavorite(opp: LocalOpportunity): void {
    opp.isFavorite = !opp.isFavorite;
  }

  openDetailModal(opp: LocalOpportunity): void {
    this.selectedOpportunity = opp;
  }

  closeDetailModal(): void {
    this.selectedOpportunity = null;
  }

  getDefaultImage(opp: LocalOpportunity): string {
    if (opp.imageUrl) return opp.imageUrl;
    if (opp.category === 'FORMATION') {
      return 'assets/visuals/institutions/cfa-btp.jpg';
    }
    if (opp.category === 'ACCOMPAGNEMENT') {
      return 'assets/visuals/institutions/mission-locale.jpg';
    }
    return 'assets/visuals/institutions/atelier-decors.jpg';
  }

  getGoogleMapsUrl(opp: LocalOpportunity): string {
    if (opp.coordinates?.lat && opp.coordinates?.lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${opp.coordinates.lat},${opp.coordinates.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opp.name + ' ' + opp.address)}`;
  }

  onImageError(event: Event, opp: LocalOpportunity): void {
    const imgEl = event.target as HTMLImageElement;
    if (imgEl) {
      imgEl.src = this.getDefaultImage(opp);
    }
  }

  onOpenCoachIA(opp: LocalOpportunity): void {
    this.closeDetailModal();
    const career = opp.targetCareers[0] || this.filterState.careerQuery || 'Peintre décorateur';
    this.navigateToCoach.emit({ establishmentName: opp.name, career });
  }

  onChooseForImmersion(opp: LocalOpportunity): void {
    this.closeDetailModal();
    const career = opp.targetCareers[0] || this.filterState.careerQuery || 'Peintre décorateur';
    this.navigateToImmersion.emit({ companyName: opp.name, career });
  }
}
