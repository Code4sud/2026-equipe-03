// ============================================================================
// Composant Standalone — Catalogue des Métiers Libres (Écran 2 Maquette)
// 721 Métiers O*NET FR réels, recherche, filtres d'intérêts et favoris
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import {
  CareerInterestFilter,
  INTEREST_CATEGORIES_CONFIG,
  UICatalogCareer
} from '../../shared/autonomous-data';

@Component({
  selector: 'app-career-catalog',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- ================================================================== -->
      <!-- 1. EN-TÊTE DU CATALOGUE                                             -->
      <!-- ================================================================== -->
      <div
        class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h2 class="text-2xl sm:text-3xl font-black text-[#0F1035] tracking-tight">
              Explorer les métiers
            </h2>
            <span class="rounded-full bg-[#EDE9FE] text-[#7C3AED] px-3 py-0.5 text-xs font-black">
              {{ filteredCareers.length }} métier(s)
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#42466B]">
            Découvre librement les métiers du référentiel O*NET FR, explore leurs missions et prépare une immersion.
          </p>
        </div>

        <!-- Recherche textuelle -->
        <div class="w-full md:w-80">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
              <mb-icon name="search"></mb-icon>
            </span>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="Rechercher par métier, mot-clé..."
              class="w-full rounded-full border border-[#D8DCF0] pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0F1035] bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
            />
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. PILULES DE FILTRES PAR CENTRES D'INTÉRÊT                         -->
      <!-- ================================================================== -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          *ngFor="let cat of categoriesConfig"
          type="button"
          (click)="selectedCategory = cat.id"
          [class]="selectedCategory === cat.id
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow-md font-extrabold ring-2 ring-purple-200'
            : 'bg-white text-[#0F1035] border border-[#E4E0F5] hover:border-[#7C3AED]/40 hover:bg-[#FAF8FF] font-bold'"
          class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <span><mb-icon [name]="cat.icon"></mb-icon></span>
          <span>{{ cat.label }}</span>
        </button>

        <!-- Filtre favoris -->
        <button
          type="button"
          (click)="showOnlyFavorites = !showOnlyFavorites"
          [class]="showOnlyFavorites
            ? 'bg-rose-500 text-white shadow font-extrabold'
            : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 font-bold'"
          class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5 ml-auto"
        >
          <span><mb-icon [name]="'heart'" [filled]="!!(showOnlyFavorites)"></mb-icon></span>
          <span>Mes favoris ({{ favoriteCount }})</span>
        </button>
      </div>

      <!-- Filtres secondaires : Zones de préparation O*NET -->
      <div class="flex flex-wrap items-center gap-2 text-xs text-[#42466B] pt-1">
        <span class="font-bold text-[#0F1035]">Durée d'études :</span>
        <button
          type="button"
          (click)="selectedZone = 0"
          [class]="selectedZone === 0 ? 'bg-[#7C3AED] text-white' : 'bg-white border border-[#E4E0F5] text-[#42466B]'"
          class="rounded-full px-3 py-1 font-bold transition"
        >
          Toutes
        </button>
        <button
          type="button"
          (click)="selectedZone = 1"
          [class]="selectedZone === 1 ? 'bg-[#7C3AED] text-white' : 'bg-white border border-[#E4E0F5] text-[#42466B]'"
          class="rounded-full px-3 py-1 font-bold transition"
        >
          Zone 1 (0 à 6 mois)
        </button>
        <button
          type="button"
          (click)="selectedZone = 2"
          [class]="selectedZone === 2 ? 'bg-[#7C3AED] text-white' : 'bg-white border border-[#E4E0F5] text-[#42466B]'"
          class="rounded-full px-3 py-1 font-bold transition"
        >
          Zone 2 (3 mois à 2 ans)
        </button>
        <button
          type="button"
          (click)="selectedZone = 3"
          [class]="selectedZone === 3 ? 'bg-[#7C3AED] text-white' : 'bg-white border border-[#E4E0F5] text-[#42466B]'"
          class="rounded-full px-3 py-1 font-bold transition"
        >
          Zone 3 (1 à 4 ans)
        </button>
        <button
          type="button"
          (click)="selectedZone = 4"
          [class]="selectedZone === 4 ? 'bg-[#7C3AED] text-white' : 'bg-white border border-[#E4E0F5] text-[#42466B]'"
          class="rounded-full px-3 py-1 font-bold transition"
        >
          Zone 4 (2 à 6 ans)
        </button>
        <button
          type="button"
          (click)="selectedZone = 5"
          [class]="selectedZone === 5 ? 'bg-[#7C3AED] text-white' : 'bg-white border border-[#E4E0F5] text-[#42466B]'"
          class="rounded-full px-3 py-1 font-bold transition"
        >
          Zone 5 (4 à 10 ans)
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- 3. GRILLE DES CARTES MÉTIERS                                        -->
      <!-- ================================================================== -->
      <div *ngIf="paginatedCareers.length > 0; else emptyState" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          *ngFor="let career of paginatedCareers"
          class="rounded-3xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 hover:shadow-lg transition p-5 flex flex-col justify-between space-y-4 group"
        >
          <div class="space-y-3">
            <!-- Header carte : Tag catégorie + Bouton favori -->
            <div class="flex items-center justify-between gap-2">
              <span
                class="rounded-full bg-[#FAF8FF] border border-[#E4E0F5] px-2.5 py-0.5 text-[11px] font-bold text-[#6D28D9] flex items-center gap-1"
              >
                <span><mb-icon [name]="career.categoryIcon"></mb-icon></span>
                <span>{{ career.categoryLabelFr }}</span>
              </span>

              <button
                type="button"
                (click)="toggleFavorite(career)"
                [class]="career.isFavorite ? 'text-rose-500 scale-110' : 'text-gray-300 hover:text-rose-400'"
                class="text-xl p-1 transition transform cursor-pointer"
                title="Ajouter aux favoris"
              >
                <mb-icon [name]="'heart'" [filled]="!!(career.isFavorite)"></mb-icon>
              </button>
            </div>

            <!-- Titre et Zone -->
            <div>
              <h3
                (click)="selectCareerDetail.emit(career)"
                class="text-base font-black text-[#0F1035] group-hover:text-[#7C3AED] transition cursor-pointer leading-snug"
              >
                {{ career.titleFr }}
              </h3>
              <p class="text-xs text-[#6B7280] font-semibold mt-0.5">
                Zone {{ career.jobZone }} • Code O*NET {{ career.onetSocCode }}
              </p>
            </div>

            <!-- Description pédagogique -->
            <p class="text-xs text-[#42466B] leading-relaxed line-clamp-3">
              {{ career.descriptionFr }}
            </p>
          </div>

          <!-- Actions de la carte -->
          <div class="pt-3 border-t border-[#F0EDFA] flex items-center justify-between gap-2">
            <button
              type="button"
              (click)="selectCareerDetail.emit(career)"
              class="rounded-full bg-[#F3EFFE] text-[#7C3AED] hover:bg-[#E9D5FF] px-3.5 py-2 text-xs font-black transition"
            >
              <mb-icon name="search"></mb-icon> Fiche
            </button>

            <button
              type="button"
              (click)="startImmersion.emit(career)"
              class="flex-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:opacity-95 px-3.5 py-2 text-xs font-black shadow-xs transition text-center truncate flex items-center justify-center gap-1.5"
            >
              <span><mb-icon name="briefcase"></mb-icon></span>
              <span>Immersion Pro →</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination simple -->
      <div *ngIf="totalPages > 1" class="flex items-center justify-center gap-3 pt-4">
        <button
          type="button"
          (click)="currentPage = currentPage - 1"
          [disabled]="currentPage === 1"
          class="rounded-full bg-white border border-[#E4E0F5] px-4 py-2 text-xs font-bold text-[#0F1035] disabled:opacity-40"
        >
          ← Précédent
        </button>
        <span class="text-xs font-extrabold text-[#7C3AED]">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        <button
          type="button"
          (click)="currentPage = currentPage + 1"
          [disabled]="currentPage === totalPages"
          class="rounded-full bg-white border border-[#E4E0F5] px-4 py-2 text-xs font-bold text-[#0F1035] disabled:opacity-40"
        >
          Suivant →
        </button>
      </div>

      <!-- État vide explicite -->
      <ng-template #emptyState>
        <div class="rounded-3xl bg-white border border-[#E4E0F5] p-12 text-center space-y-4">
          <div class="h-16 w-16 mx-auto rounded-3xl bg-[#FAF8FF] text-[#7C3AED] flex items-center justify-center text-3xl">
            <mb-icon name="search"></mb-icon>
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-black text-[#0F1035]">Aucun métier ne correspond à ces critères</h3>
            <p class="text-xs text-[#6B7280] max-w-md mx-auto">
              Essaie d'élargir ta recherche ou de réinitialiser les filtres pour voir d'autres suggestions.
            </p>
          </div>
          <button
            type="button"
            (click)="resetFilters()"
            class="rounded-full bg-[#7C3AED] text-white px-5 py-2.5 text-xs font-extrabold shadow"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </ng-template>
    </div>
  `
})
export class CareerCatalogComponent implements OnInit {
  @Input() allCareers: UICatalogCareer[] = [];
  @Output() selectCareerDetail = new EventEmitter<UICatalogCareer>();
  @Output() startImmersion = new EventEmitter<UICatalogCareer>();
  @Output() favoriteToggled = new EventEmitter<UICatalogCareer>();

  categoriesConfig = INTEREST_CATEGORIES_CONFIG;
  searchTerm = '';
  selectedCategory: CareerInterestFilter = 'ALL';
  selectedZone = 0;
  showOnlyFavorites = false;
  currentPage = 1;
  pageSize = 18;

  ngOnInit(): void {}

  get favoriteCount(): number {
    return this.allCareers.filter((c) => c.isFavorite).length;
  }

  get filteredCareers(): UICatalogCareer[] {
    let list = this.allCareers;

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase().trim();
      list = list.filter((c) => c.titleFr.toLowerCase().includes(q) || c.descriptionFr.toLowerCase().includes(q));
    }

    if (this.selectedCategory !== 'ALL') {
      list = list.filter((c) => c.category === this.selectedCategory);
    }

    if (this.selectedZone > 0) {
      list = list.filter((c) => c.jobZone === this.selectedZone);
    }

    if (this.showOnlyFavorites) {
      list = list.filter((c) => c.isFavorite);
    }

    return list;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCareers.length / this.pageSize));
  }

  get paginatedCareers(): UICatalogCareer[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCareers.slice(start, start + this.pageSize);
  }

  toggleFavorite(career: UICatalogCareer): void {
    career.isFavorite = !career.isFavorite;
    this.favoriteToggled.emit(career);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'ALL';
    this.selectedZone = 0;
    this.showOnlyFavorites = false;
    this.currentPage = 1;
  }
}
