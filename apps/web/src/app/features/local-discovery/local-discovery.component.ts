// ============================================================================
// Composant Angular — « Autour de moi » (MonBilan+ Web)
// Découverte territoriale des Formations, Organismes & Immersions (Nice / 06)
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  filterOpportunities,
  getCategoryCounts,
  LOCAL_OPPORTUNITIES_DATA,
  LocalFilterState,
  LocalOpportunity,
  OpportunityCategory
} from '../../shared/local-discovery-data';

@Component({
  selector: 'app-local-discovery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- ==================================================================== -->
      <!-- 1. EN-TÊTE AVEC BANDEAU PANORAMIQUE BAIE DES ANGES (NICE 06)        -->
      <!-- ==================================================================== -->
      <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2A1668] via-[#48209E] to-[#6D28D9] text-white shadow-xl p-6 sm:p-8"
        aria-label="En-tête Autour de moi"
      >
        <!-- Illustration panoramique SVG légère (Baie des Anges, mer Méditerranée, collines niçoises) -->
        <div class="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen overflow-hidden">
          <svg class="w-full h-full object-cover" viewBox="0 0 1200 320" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Ciel & Dégradé d'horizon -->
            <path d="M0 0h1200v320H0z" fill="url(#sky-gradient)"/>
            <!-- Collines de Nice & Mont Boron -->
            <path d="M0 240 C 200 180, 450 250, 700 190 C 950 130, 1100 200, 1200 170 L 1200 320 L 0 320 Z" fill="#6B21A8" fill-opacity="0.4"/>
            <path d="M0 260 C 250 210, 500 280, 850 220 C 1050 180, 1150 230, 1200 210 L 1200 320 L 0 320 Z" fill="#4338CA" fill-opacity="0.5"/>
            <!-- Courbe de la Baie des Anges & Promenade des Anglais -->
            <path d="M0 290 Q 300 270, 600 290 T 1200 280 L 1200 320 L 0 320 Z" fill="#38BDF8" fill-opacity="0.35"/>
            <!-- Soleils & reflets d'or -->
            <circle cx="1080" cy="80" r="45" fill="#FDE047" fill-opacity="0.15"/>
            <defs>
              <linearGradient id="sky-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#4C1D95"/>
                <stop offset="100%" stop-color="#1E1B4B"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="relative z-10 max-w-3xl space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-purple-100 border border-white/20">
            <span>📍 Alpes-Maritimes & Métropole Nice Côte d'Azur</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Données vérifiées</span>
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <span class="text-3xl sm:text-4xl text-[#C084FC]">📍</span>
            <span>Autour de moi</span>
          </h1>

          <p class="text-sm sm:text-base text-purple-100/90 leading-relaxed max-w-2xl">
            Des opportunités près de chez toi : formations, organismes d'accompagnement et entreprises où découvrir un métier.
          </p>
        </div>
      </section>

      <!-- ==================================================================== -->
      <!-- 2. BARRE DE RECHERCHE 3 CHAMPS + BOUTON                              -->
      <!-- ==================================================================== -->
      <section
        class="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-[#E9E4F5]"
        aria-label="Filtres de recherche géographique"
      >
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          <!-- 1. Métier recherché avec autocomplétion -->
          <div class="md:col-span-4 relative">
            <label for="career-search" class="block text-xs font-bold text-[#42466B] mb-1">
              Quel métier t'intéresse ?
            </label>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-lg pointer-events-none text-purple-600">💼</span>
              <input
                id="career-search"
                type="text"
                [(ngModel)]="filterState.careerQuery"
                (ngModelChange)="onFilterChanged()"
                placeholder="Ex : Peintre décorateur, Menuisier..."
                class="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] text-sm font-semibold text-[#0F1035] placeholder:text-[#9A9EB2] focus:bg-white focus:border-[#8B3DFF] focus:ring-2 focus:ring-[#8B3DFF]/20 outline-none transition"
              />
              <button
                *ngIf="filterState.careerQuery"
                type="button"
                (click)="clearCareerQuery()"
                class="absolute right-3 text-xs text-gray-400 hover:text-gray-700"
                title="Effacer le métier"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- 2. Ma ville -->
          <div class="md:col-span-3">
            <label for="city-select" class="block text-xs font-bold text-[#42466B] mb-1">
              Ma ville
            </label>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-lg pointer-events-none text-purple-600">📍</span>
              <select
                id="city-select"
                [(ngModel)]="filterState.city"
                (ngModelChange)="onFilterChanged()"
                class="w-full pl-11 pr-8 py-2.5 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] text-sm font-semibold text-[#0F1035] focus:bg-white focus:border-[#8B3DFF] focus:ring-2 focus:ring-[#8B3DFF]/20 outline-none appearance-none transition cursor-pointer"
              >
                <option value="Nice">Nice (06)</option>
                <option value="Cagnes-sur-Mer">Cagnes-sur-Mer (06)</option>
                <option value="Saint-Laurent-du-Var">Saint-Laurent-du-Var (06)</option>
                <option value="Grasse">Grasse (06)</option>
                <option value="Cannes">Cannes (06)</option>
                <option value="Antibes">Antibes (06)</option>
              </select>
              <span class="absolute right-3.5 pointer-events-none text-xs text-gray-400">▼</span>
            </div>
          </div>

          <!-- 3. Rayon -->
          <div class="md:col-span-2">
            <label for="radius-select" class="block text-xs font-bold text-[#42466B] mb-1">
              Rayon
            </label>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-lg pointer-events-none text-purple-600">🎯</span>
              <select
                id="radius-select"
                [(ngModel)]="filterState.radiusKm"
                (ngModelChange)="onFilterChanged()"
                class="w-full pl-11 pr-8 py-2.5 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] text-sm font-semibold text-[#0F1035] focus:bg-white focus:border-[#8B3DFF] focus:ring-2 focus:ring-[#8B3DFF]/20 outline-none appearance-none transition cursor-pointer"
              >
                <option [ngValue]="5">5 km</option>
                <option [ngValue]="10">10 km</option>
                <option [ngValue]="25">25 km</option>
                <option [ngValue]="50">50 km</option>
                <option [ngValue]="100">100 km</option>
              </select>
              <span class="absolute right-3.5 pointer-events-none text-xs text-gray-400">▼</span>
            </div>
          </div>

          <!-- 4. Bouton Rechercher -->
          <div class="md:col-span-3 pt-4 md:pt-5">
            <button
              type="button"
              (click)="triggerSearchAnimation()"
              class="w-full py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#6D28D9] text-white text-sm font-extrabold shadow-md shadow-purple-500/25 hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <span class="text-base">🔍</span>
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ==================================================================== -->
      <!-- 3. ONGLETS DE CATÉGORIES AVEC COMPTEURS DYNAMIQUES                   -->
      <!-- ==================================================================== -->
      <nav class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Catégories d'opportunités">
        <!-- 1. Tout voir -->
        <button
          type="button"
          (click)="selectCategory('ALL')"
          [class]="filterState.category === 'ALL'
            ? 'bg-[#8B3DFF] text-white shadow-md shadow-purple-500/20 font-extrabold'
            : 'bg-white text-[#42466B] hover:bg-purple-50 border border-[#E9E4F5] font-semibold'"
          class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm whitespace-nowrap transition cursor-pointer"
        >
          <span class="text-base">⊞</span>
          <span>Tout voir ({{ counts.total }})</span>
        </button>

        <!-- 2. Formations -->
        <button
          type="button"
          (click)="selectCategory('FORMATION')"
          [class]="filterState.category === 'FORMATION'
            ? 'bg-[#8B3DFF] text-white shadow-md shadow-purple-500/20 font-extrabold'
            : 'bg-white text-[#42466B] hover:bg-purple-50 border border-[#E9E4F5] font-semibold'"
          class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm whitespace-nowrap transition cursor-pointer"
        >
          <span class="text-base">🎓</span>
          <span>Formations ({{ counts.formations }})</span>
        </button>

        <!-- 3. Organismes d'accompagnement -->
        <button
          type="button"
          (click)="selectCategory('ACCOMPAGNEMENT')"
          [class]="filterState.category === 'ACCOMPAGNEMENT'
            ? 'bg-[#8B3DFF] text-white shadow-md shadow-purple-500/20 font-extrabold'
            : 'bg-white text-[#42466B] hover:bg-purple-50 border border-[#E9E4F5] font-semibold'"
          class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm whitespace-nowrap transition cursor-pointer"
        >
          <span class="text-base">🤝</span>
          <span>Organismes d'accompagnement ({{ counts.organismes }})</span>
        </button>

        <!-- 4. Entreprises & immersions -->
        <button
          type="button"
          (click)="selectCategory('ENTREPRISE')"
          [class]="filterState.category === 'ENTREPRISE'
            ? 'bg-[#8B3DFF] text-white shadow-md shadow-purple-500/20 font-extrabold'
            : 'bg-white text-[#42466B] hover:bg-purple-50 border border-[#E9E4F5] font-semibold'"
          class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm whitespace-nowrap transition cursor-pointer"
        >
          <span class="text-base">🏢</span>
          <span>Entreprises & immersions ({{ counts.entreprises }})</span>
        </button>
      </nav>

      <!-- ==================================================================== -->
      <!-- 4. SPLIT-SCREEN : LISTE DES RÉSULTATS (GAUCHE) & CARTE (DROITE)       -->
      <!-- ==================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- ------------------------------------------------------------------ -->
        <!-- COLONNE GAUCHE : LISTE DES CARTES                                  -->
        <!-- ------------------------------------------------------------------ -->
        <div class="lg:col-span-7 space-y-4">
          <!-- Barre de tri & Décompte -->
          <div class="flex items-center justify-between px-1">
            <h2 class="text-base sm:text-lg font-extrabold text-[#0F1035] flex items-center gap-2">
              <span>Résultats près de {{ filterState.city }}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6D28D9] font-bold">
                {{ filteredOpportunities.length }}
              </span>
            </h2>

            <div class="flex items-center gap-2 text-xs font-semibold text-[#42466B]">
              <label for="sort-select" class="hidden sm:inline">Trier par :</label>
              <select
                id="sort-select"
                [(ngModel)]="filterState.sortBy"
                (ngModelChange)="onFilterChanged()"
                class="bg-white border border-[#E4E0F5] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#0F1035] outline-none focus:border-[#8B3DFF] cursor-pointer"
              >
                <option value="relevance">Pertinence</option>
                <option value="distance">Distance croissante</option>
                <option value="name">Nom alphabétique</option>
              </select>
            </div>
          </div>

          <!-- État aucun résultat -->
          <div
            *ngIf="filteredOpportunities.length === 0"
            class="bg-white rounded-3xl p-8 text-center border border-[#E9E4F5] shadow-sm space-y-3"
          >
            <div class="text-4xl">🔍</div>
            <h3 class="text-base font-bold text-[#0F1035]">Aucune opportunité trouvée pour cette recherche</h3>
            <p class="text-xs text-[#42466B] max-w-md mx-auto">
              Essaie d'élargir le rayon, de sélectionner une autre commune des Alpes-Maritimes ou de supprimer le filtre par métier.
            </p>
            <button
              type="button"
              (click)="resetFilters()"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-[#6D28D9] hover:bg-purple-100 font-bold text-xs transition"
            >
              <span>↺ Réinitialiser les filtres</span>
            </button>
          </div>

          <!-- Liste des cartes d'opportunités -->
          <div class="space-y-3.5">
            <article
              *ngFor="let item of filteredOpportunities"
              (mouseenter)="hoveredOpportunityId = item.id"
              (mouseleave)="hoveredOpportunityId = null"
              [class.ring-2]="hoveredOpportunityId === item.id || selectedOpportunity?.id === item.id"
              [class.ring-[#8B3DFF]]="hoveredOpportunityId === item.id || selectedOpportunity?.id === item.id"
              class="bg-white rounded-2xl p-4 sm:p-5 border border-[#E9E4F5] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 relative group"
            >
              <!-- Visuel d'illustration stylisé de l'établissement -->
              <div class="w-full sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-50 border border-purple-100/60 flex-shrink-0 flex flex-col items-center justify-center p-3 text-center overflow-hidden relative">
                <span class="text-3xl sm:text-4xl mb-1 transform group-hover:scale-110 transition duration-200">
                  {{ item.category === 'FORMATION' ? '🎓' : (item.category === 'ACCOMPAGNEMENT' ? '🤝' : '🏢') }}
                </span>
                <span class="text-[10px] font-bold text-[#6D28D9] truncate max-w-full">
                  {{ item.subType }}
                </span>
              </div>

              <!-- Corps de la carte -->
              <div class="flex-1 min-w-0 space-y-2">
                <!-- Badges & Distance -->
                <div class="flex items-center justify-between gap-2 flex-wrap">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <!-- Badge Catégorie -->
                    <span
                      [class]="item.category === 'FORMATION'
                        ? 'bg-purple-100 text-[#6D28D9]'
                        : (item.category === 'ACCOMPAGNEMENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800')"
                      class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full"
                    >
                      {{ item.category === 'FORMATION' ? 'Formation' : (item.category === 'ACCOMPAGNEMENT' ? 'Accompagnement' : 'Entreprise') }}
                    </span>

                    <!-- Badge Sous-type -->
                    <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {{ item.subType }}
                    </span>
                  </div>

                  <!-- Bouton Favori -->
                  <button
                    type="button"
                    (click)="toggleFavorite(item)"
                    [attr.aria-label]="item.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition hover:bg-pink-50"
                  >
                    <span *ngIf="item.isFavorite" class="text-pink-500 scale-110">❤️</span>
                    <span *ngIf="!item.isFavorite" class="text-gray-300 hover:text-pink-400">🤍</span>
                  </button>
                </div>

                <!-- Nom de l'établissement -->
                <h3 class="text-base font-extrabold text-[#0F1035] leading-snug group-hover:text-[#6D28D9] transition truncate">
                  {{ item.name }}
                </h3>

                <!-- Localisation & distance -->
                <div class="flex items-center gap-2 text-xs text-[#5E6482]">
                  <span class="text-purple-600 font-bold">📍 {{ item.city }}</span>
                  <span>—</span>
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {{ item.distanceKm }} km
                  </span>
                </div>

                <!-- Description / Intitulé de formation ou service -->
                <p class="text-xs text-[#42466B] line-clamp-2 leading-relaxed font-medium">
                  {{ item.headline }}
                </p>

                <!-- Actions du bas de carte -->
                <div class="pt-2 flex items-center justify-between gap-3 border-t border-gray-100 mt-2">
                  <span class="text-[11px] text-gray-400 truncate hidden sm:inline">
                    {{ item.transitInfo ? item.transitInfo : item.address }}
                  </span>

                  <button
                    type="button"
                    (click)="openDetailModal(item)"
                    class="ml-auto inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-purple-300 text-xs font-extrabold text-[#6D28D9] hover:bg-purple-50 active:scale-95 transition"
                  >
                    <span>Voir la fiche</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- ------------------------------------------------------------------ -->
        <!-- COLONNE DROITE : CARTE GÉOGRAPHIQUE VECTORIELLE INTERACTIVE       -->
        <!-- ------------------------------------------------------------------ -->
        <div class="lg:col-span-5 sticky top-24">
          <div class="bg-white rounded-3xl p-4 border border-[#E9E4F5] shadow-lg overflow-hidden space-y-3">
            <div class="flex items-center justify-between px-1">
              <span class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider flex items-center gap-1.5">
                <span>🗺️</span>
                <span>Carte interactive — Nice & Environs</span>
              </span>
              <span class="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                {{ filteredOpportunities.length }} adresses
              </span>
            </div>

            <!-- Conteneur Carte SVG interactif -->
            <div class="relative w-full h-[460px] rounded-2xl bg-[#E0F2FE] border border-blue-200/60 overflow-hidden select-none">
              <!-- SVG du fond de carte de Nice (Baie des Anges, relief, autoroute A8, fleuve Paillon) -->
              <svg
                class="w-full h-full object-cover transition-transform duration-300"
                [style.transform]="'scale(' + zoomLevel + ')'"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="sea-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#38BDF8"/>
                    <stop offset="100%" stop-color="#0284C7"/>
                  </linearGradient>
                  <linearGradient id="land-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ECFDF5"/>
                    <stop offset="100%" stop-color="#D1FAE5"/>
                  </linearGradient>
                </defs>

                <!-- Terre ferme (Côte d'Azur) -->
                <path
                  d="M0 0 L100 0 L100 68 C 90 70, 75 80, 68 76 C 58 70, 48 85, 30 84 C 18 84, 5 95, 0 95 Z"
                  fill="url(#land-grad)"
                />

                <!-- Mer Méditerranée / Baie des Anges -->
                <path
                  d="M0 95 C 5 95, 18 84, 30 84 C 48 85, 58 70, 68 76 C 75 80, 90 70, 100 68 L100 100 L0 100 Z"
                  fill="url(#sea-grad)"
                  opacity="0.85"
                />

                <!-- Plage de galets & Promenade des Anglais -->
                <path
                  d="M0 94 C 5 94, 18 83, 30 83 C 48 84, 58 69, 68 75 C 75 79, 90 69, 100 67"
                  stroke="#FDE047"
                  stroke-width="1.2"
                  fill="none"
                />

                <!-- Voie Rapide / Autoroute A8 (Tracé courbe jaune-orangé) -->
                <path
                  d="M0 45 C 20 40, 40 48, 60 35 C 80 25, 95 30, 100 28"
                  stroke="#F59E0B"
                  stroke-width="1.8"
                  fill="none"
                  stroke-linecap="round"
                />
                <text x="8" y="44" font-size="3" fill="#D97706" font-weight="bold">A8</text>

                <!-- Fleuve Paillon et Vallée du Var -->
                <path d="M68 0 Q 64 35, 58 70" stroke="#7DD3FC" stroke-width="1.5" fill="none"/>
                <path d="M26 0 Q 24 40, 20 85" stroke="#7DD3FC" stroke-width="2" fill="none"/>

                <!-- Villes et toponymes -->
                <text x="48" y="66" font-size="3.5" fill="#0F1035" font-weight="800">Nice</text>
                <text x="6" y="80" font-size="2.6" fill="#334155" font-weight="600">Saint-Laurent</text>
                <text x="75" y="62" font-size="2.6" fill="#334155" font-weight="600">Villefranche</text>
                <text x="60" y="24" font-size="2.6" fill="#334155" font-weight="600">Saint-André</text>
                <text x="78" y="20" font-size="2.6" fill="#334155" font-weight="600">La Trinité</text>
              </svg>

              <!-- Marqueurs interactifs dynamiques -->
              <div
                *ngFor="let item of filteredOpportunities"
                [style.left.%]="item.mapSvgCoords.x"
                [style.top.%]="item.mapSvgCoords.y"
                (click)="openDetailModal(item)"
                (mouseenter)="hoveredOpportunityId = item.id"
                (mouseleave)="hoveredOpportunityId = null"
                class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-200"
                [class.scale-125]="hoveredOpportunityId === item.id || selectedOpportunity?.id === item.id"
                [class.z-20]="hoveredOpportunityId === item.id || selectedOpportunity?.id === item.id"
              >
                <!-- Pin circulaire stylisé -->
                <div
                  [class]="item.category === 'FORMATION'
                    ? 'bg-[#7C3AED] ring-[#C4B5FD]'
                    : (item.category === 'ACCOMPAGNEMENT' ? 'bg-[#059669] ring-[#A7F3D0]' : 'bg-[#2563EB] ring-[#BFDBFE]')"
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white shadow-lg flex items-center justify-center text-xs sm:text-sm font-bold ring-2 ring-white hover:brightness-110 active:scale-90 transition"
                  [title]="item.name + ' (' + item.distanceKm + ' km)'"
                >
                  <span>{{ item.category === 'FORMATION' ? '🎓' : (item.category === 'ACCOMPAGNEMENT' ? '🤝' : '🏢') }}</span>
                </div>

                <!-- Infobulle au survol -->
                <div
                  *ngIf="hoveredOpportunityId === item.id"
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-44 bg-[#0F1035] text-white text-[11px] p-2 rounded-xl shadow-xl pointer-events-none z-30 text-center animate-fadeIn"
                >
                  <p class="font-bold truncate">{{ item.name }}</p>
                  <p class="text-purple-300 font-semibold">{{ item.city }} · {{ item.distanceKm }} km</p>
                </div>
              </div>

              <!-- Contrôles de zoom en bas à droite -->
              <div class="absolute bottom-16 right-3 flex flex-col gap-1 z-20">
                <button
                  type="button"
                  (click)="zoomIn()"
                  class="w-8 h-8 rounded-xl bg-white shadow-md text-gray-700 hover:bg-gray-100 flex items-center justify-center font-extrabold text-sm border border-gray-200"
                  title="Zoom avant"
                >
                  +
                </button>
                <button
                  type="button"
                  (click)="zoomOut()"
                  class="w-8 h-8 rounded-xl bg-white shadow-md text-gray-700 hover:bg-gray-100 flex items-center justify-center font-extrabold text-sm border border-gray-200"
                  title="Zoom arrière"
                >
                  -
                </button>
              </div>

              <!-- Légende flottante en bas de carte -->
              <div class="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-gray-100 flex items-center justify-around text-[11px] font-bold text-[#42466B]">
                <div class="flex items-center gap-1.5 cursor-pointer" (click)="selectCategory('FORMATION')">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"></span>
                  <span>Formations ({{ counts.formations }})</span>
                </div>
                <div class="flex items-center gap-1.5 cursor-pointer" (click)="selectCategory('ACCOMPAGNEMENT')">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                  <span>Organismes ({{ counts.organismes }})</span>
                </div>
                <div class="flex items-center gap-1.5 cursor-pointer" (click)="selectCategory('ENTREPRISE')">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                  <span>Entreprises ({{ counts.entreprises }})</span>
                </div>
              </div>
            </div>
          </div>
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
          class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E9E4F5] overflow-hidden flex flex-col max-h-[90vh]"
          (click)="$event.stopPropagation()"
        >
          <!-- En-tête Modale -->
          <div class="p-6 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-pink-50 border-b border-[#E9E4F5] flex items-start justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <span
                  [class]="selectedOpportunity.category === 'FORMATION'
                    ? 'bg-purple-100 text-[#6D28D9]'
                    : (selectedOpportunity.category === 'ACCOMPAGNEMENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800')"
                  class="text-xs font-extrabold px-3 py-0.5 rounded-full"
                >
                  {{ getCategoryLabel(selectedOpportunity.category) }}
                </span>
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200">
                  {{ selectedOpportunity.subType }}
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-[#0F1035]">
                {{ selectedOpportunity.name }}
              </h2>
              <p class="text-xs sm:text-sm font-semibold text-purple-700 flex items-center gap-1.5">
                <span>📍 {{ selectedOpportunity.address }}</span>
                <span>({{ selectedOpportunity.distanceKm }} km de Nice)</span>
              </p>
            </div>

            <button
              type="button"
              (click)="closeDetailModal()"
              class="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 flex items-center justify-center font-bold text-lg shadow-sm border border-gray-200"
              aria-label="Fermer la fiche"
            >
              ✕
            </button>
          </div>

          <!-- Contenu Modale -->
          <div class="p-6 space-y-5 overflow-y-auto min-h-0 flex-1">
            <!-- Intitulé & description -->
            <div class="space-y-2 bg-[#F8F7FF] p-4 rounded-2xl border border-purple-100">
              <h3 class="text-sm font-bold text-[#0F1035]">
                {{ selectedOpportunity.headline }}
              </h3>
              <p class="text-xs text-[#42466B] leading-relaxed">
                {{ selectedOpportunity.description }}
              </p>
            </div>

            <!-- Modalités & Diplômes -->
            <div *ngIf="selectedOpportunity.modalities?.length || selectedOpportunity.diplomas?.length" class="space-y-2">
              <h4 class="text-xs font-extrabold text-[#0F1035] uppercase tracking-wider">
                Modalités & Certifications
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let m of selectedOpportunity.modalities"
                  class="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-[#6D28D9] border border-purple-200"
                >
                  ✓ {{ m }}
                </span>
                <span
                  *ngFor="let d of selectedOpportunity.diplomas"
                  class="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  🎓 {{ d }}
                </span>
              </div>
            </div>

            <!-- Coordonnées vérifiées & Transports -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-1.5">
                <span class="font-bold text-gray-700 block">📞 Contact direct</span>
                <p *ngIf="selectedOpportunity.phone" class="font-semibold text-[#0F1035]">
                  Tél : <a [href]="'tel:' + selectedOpportunity.phone" class="text-purple-600 hover:underline">{{ selectedOpportunity.phone }}</a>
                </p>
                <p *ngIf="selectedOpportunity.email" class="font-semibold text-[#0F1035] truncate">
                  Email : <a [href]="'mailto:' + selectedOpportunity.email" class="text-purple-600 hover:underline">{{ selectedOpportunity.email }}</a>
                </p>
                <p *ngIf="selectedOpportunity.websiteUrl">
                  <a [href]="selectedOpportunity.websiteUrl" target="_blank" rel="noopener noreferrer" class="text-purple-600 font-bold hover:underline inline-flex items-center gap-1">
                    <span>Visiter le site officiel</span>
                    <span>↗</span>
                  </a>
                </p>
              </div>

              <div class="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-1.5">
                <span class="font-bold text-gray-700 block">🚌 Transports Lignes d'Azur</span>
                <p class="text-gray-600 font-medium">
                  {{ selectedOpportunity.transitInfo || 'Desservi par le réseau Métropole Nice Côte d’Azur' }}
                </p>
                <p class="text-[11px] text-gray-400">
                  Source : {{ selectedOpportunity.source }}
                </p>
              </div>
            </div>
          </div>

          <!-- Pied de Modale : Passerelles vers Mon Coach IA & Immersion Pro -->
          <div class="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              (click)="toggleFavorite(selectedOpportunity)"
              class="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2 transition"
            >
              <span>{{ selectedOpportunity.isFavorite ? '❤️ Dans mes favoris' : '🤍 Ajouter aux favoris' }}</span>
            </button>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <!-- Passerelle Coach IA -->
              <button
                type="button"
                (click)="onOpenCoachIA(selectedOpportunity)"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#6D28D9] text-white text-xs font-extrabold shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <span>✨ Mon Coach IA</span>
                <span class="hidden sm:inline">(Préparer ma demande)</span>
              </button>

              <!-- Passerelle Immersion Pro si entreprise -->
              <button
                *ngIf="selectedOpportunity.category === 'ENTREPRISE'"
                type="button"
                (click)="onChooseForImmersion(selectedOpportunity)"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-[#0F1035] text-white text-xs font-extrabold hover:bg-black active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <span>💼 Immersion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LocalDiscoveryComponent implements OnInit {
  @Input() initialCareer?: string;
  @Output() navigateToCoach = new EventEmitter<{ establishmentName: string; career: string }>();
  @Output() navigateToImmersion = new EventEmitter<{ companyName: string; career: string }>();

  filterState: LocalFilterState = {
    careerQuery: '',
    city: 'Nice',
    radiusKm: 25,
    category: 'ALL',
    sortBy: 'relevance'
  };

  allOpportunities: LocalOpportunity[] = [];
  filteredOpportunities: LocalOpportunity[] = [];
  selectedOpportunity: LocalOpportunity | null = null;
  hoveredOpportunityId: string | null = null;
  zoomLevel = 1.0;

  get counts() {
    return getCategoryCounts(this.allOpportunities);
  }

  ngOnInit(): void {
    this.allOpportunities = [...LOCAL_OPPORTUNITIES_DATA];
    if (this.initialCareer) {
      this.filterState.careerQuery = this.initialCareer;
    } else {
      // Valeur initiale de la maquette
      this.filterState.careerQuery = 'Peintre décorateur';
    }
    this.onFilterChanged();
  }

  onFilterChanged(): void {
    this.filteredOpportunities = filterOpportunities(this.allOpportunities, this.filterState);
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
    this.onFilterChanged();
  }

  triggerSearchAnimation(): void {
    this.onFilterChanged();
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

  zoomIn(): void {
    if (this.zoomLevel < 1.6) {
      this.zoomLevel = Number((this.zoomLevel + 0.15).toFixed(2));
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.85) {
      this.zoomLevel = Number((this.zoomLevel - 0.15).toFixed(2));
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
