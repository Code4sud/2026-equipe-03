// ============================================================================
// Composant Standalone — Annuaire des Structures d'Accompagnement (Écran 6)
// CIO, Mission Locale Nice, Établissements scolaires, 1jeune1solution
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import {
  INITIAL_SUPPORT_RESOURCES,
  UISupportResource
} from '../../shared/autonomous-data';

@Component({
  selector: 'app-support-directory',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-fadeIn">
      <!-- ================================================================== -->
      <!-- 1. BANNIÈRE HERO                                                   -->
      <!-- ================================================================== -->
      <div
        class="rounded-[28px] bg-gradient-to-r from-[#1B1B62] via-[#253275] to-[#3B82F6] text-white p-6 sm:p-10 shadow-lg relative overflow-hidden"
      >
        <div class="max-w-3xl space-y-3 relative z-10">
          <div class="flex items-center gap-2">
            <span class="inline-block rounded-full bg-white/20 text-white px-3.5 py-1 text-xs font-black tracking-wide uppercase">
              <mb-icon name="landmark"></mb-icon> Annuaire d'Orientation
            </span>
            <span class="text-xs text-[#E7E8FB]/80 hidden sm:inline">• Services publics gratuits & bienveillants</span>
          </div>

          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Trouver un accompagnement
          </h2>

          <p class="text-sm sm:text-base text-[#E7E8FB] font-medium leading-relaxed max-w-2xl">
            Des professionnels peuvent t'aider à avancer dans ton orientation et tes projets d'immersion.
          </p>

          <div class="pt-2 flex flex-wrap gap-2 text-xs">
            <span class="rounded-full bg-white/15 px-3 py-1 font-semibold">✓ 100 % gratuit</span>
            <span class="rounded-full bg-white/15 px-3 py-1 font-semibold">✓ Sans engagement</span>
            <span class="rounded-full bg-white/15 px-3 py-1 font-semibold">✓ Présent sur tout le territoire</span>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. RECHERCHE ET FILTRES DES STRUCTURES                             -->
      <!-- ================================================================== -->
      <div class="rounded-3xl bg-white border border-[#E4E0F5] p-5 sm:p-6 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Filtres de catégories -->
          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              (click)="selectedCategory = 'ALL'"
              [class]="selectedCategory === 'ALL'
                ? 'bg-[#3B82F6] text-white shadow font-extrabold'
                : 'bg-white text-[#0F1035] border border-[#E4E0F5] hover:bg-[#F8FAFC] font-semibold'"
              class="rounded-full px-4 py-2 text-xs transition cursor-pointer"
            >
              Tous
            </button>
            <button
              type="button"
              (click)="selectedCategory = 'SCHOOL'"
              [class]="selectedCategory === 'SCHOOL'
                ? 'bg-[#3B82F6] text-white shadow font-extrabold'
                : 'bg-white text-[#0F1035] border border-[#E4E0F5] hover:bg-[#F8FAFC] font-semibold'"
              class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span><mb-icon name="school"></mb-icon></span>
              <span>Mon établissement</span>
            </button>
            <button
              type="button"
              (click)="selectedCategory = 'MISSION_LOCALE'"
              [class]="selectedCategory === 'MISSION_LOCALE'
                ? 'bg-[#3B82F6] text-white shadow font-extrabold'
                : 'bg-white text-[#0F1035] border border-[#E4E0F5] hover:bg-[#F8FAFC] font-semibold'"
              class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span><mb-icon name="handshake"></mb-icon></span>
              <span>Mission Locale</span>
            </button>
            <button
              type="button"
              (click)="selectedCategory = 'CIO'"
              [class]="selectedCategory === 'CIO'
                ? 'bg-[#3B82F6] text-white shadow font-extrabold'
                : 'bg-white text-[#0F1035] border border-[#E4E0F5] hover:bg-[#F8FAFC] font-semibold'"
              class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span><mb-icon name="landmark"></mb-icon></span>
              <span>CIO</span>
            </button>
            <button
              type="button"
              (click)="selectedCategory = 'NATIONAL_PORTAL'"
              [class]="selectedCategory === 'NATIONAL_PORTAL'
                ? 'bg-[#3B82F6] text-white shadow font-extrabold'
                : 'bg-white text-[#0F1035] border border-[#E4E0F5] hover:bg-[#F8FAFC] font-semibold'"
              class="rounded-full px-4 py-2 text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span><mb-icon name="flag"></mb-icon></span>
              <span>Portails officiels</span>
            </button>
          </div>

          <!-- Recherche par ville -->
          <div class="w-full sm:w-64">
            <input
              type="text"
              [(ngModel)]="searchCity"
              placeholder="Filtrer par ville (ex: Nice)..."
              class="w-full rounded-full border border-[#D8DCF0] px-4 py-2 text-xs font-semibold text-[#0F1035] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 3. LISTE DES STRUCTURES D'ACCOMPAGNEMENT                            -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let res of filteredResources"
          class="rounded-3xl bg-white border border-[#E4E0F5] hover:border-[#3B82F6]/50 hover:shadow-lg transition p-6 flex flex-col justify-between space-y-5 group"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-2">
              <span
                class="rounded-full bg-blue-50 border border-blue-200 text-blue-800 px-3 py-0.5 text-xs font-black flex items-center gap-1.5"
              >
                <span><mb-icon [name]="res.icon"></mb-icon></span>
                <span>{{ res.categoryLabel }}</span>
              </span>
              <span class="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold">
                {{ res.badgeLabel }}
              </span>
            </div>

            <div class="space-y-1">
              <h3 class="text-lg font-black text-[#0F1035] group-hover:text-[#3B82F6] transition leading-snug">
                {{ res.name }}
              </h3>
              <p *ngIf="res.address" class="text-xs text-[#6B7280]">
                <mb-icon name="map-pin"></mb-icon> {{ res.address }}, {{ res.postalCode }} {{ res.city }}
              </p>
            </div>

            <p class="text-xs sm:text-sm text-[#42466B] leading-relaxed">
              {{ res.description }}
            </p>

            <!-- Contact direct -->
            <div *ngIf="res.phone || res.email" class="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs text-[#334155] space-y-1">
              <p *ngIf="res.phone" class="font-bold"><mb-icon name="phone"></mb-icon> Téléphone : <span class="text-[#0F1035]">{{ res.phone }}</span></p>
              <p *ngIf="res.email" class="font-medium truncate"><mb-icon name="mail"></mb-icon> Email : <span class="text-[#3B82F6]">{{ res.email }}</span></p>
            </div>
          </div>

          <!-- Bouton vers le site officiel vérifié -->
          <a
            [href]="res.websiteUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full bg-[#F1F5F9] hover:bg-[#3B82F6] text-[#1E293B] hover:text-white py-2.5 px-4 text-xs font-extrabold transition text-center flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Consulter le site officiel</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 4. PASSERELLE VERS IMMERSION PRO                                    -->
      <!-- ================================================================== -->
      <div
        class="rounded-3xl bg-gradient-to-r from-[#EDE9FE] via-[#FAF8FF] to-[#E0E7FF] border border-[#DDD6FE] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div class="space-y-1.5 max-w-xl text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2">
            <span class="text-2xl"><mb-icon name="briefcase"></mb-icon></span>
            <h3 class="text-lg sm:text-xl font-black text-[#0F1035]">
              Tu as déjà une idée de métier en tête ?
            </h3>
          </div>
          <p class="text-xs sm:text-sm text-[#42466B]">
            Prépare ton immersion d’observation pas à pas, trouve une entreprise accueillante et télécharge ton carnet de bord.
          </p>
        </div>

        <button
          type="button"
          (click)="goToImmersion.emit()"
          class="shrink-0 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-6 py-3 text-xs sm:text-sm font-black shadow-md hover:scale-105 transition"
        >
          Préparer une immersion pro →
        </button>
      </div>
    </div>
  `
})
export class SupportDirectoryComponent implements OnInit {
  @Input() resources: UISupportResource[] = INITIAL_SUPPORT_RESOURCES;
  @Output() goToImmersion = new EventEmitter<void>();

  selectedCategory: string = 'ALL';
  searchCity: string = '';

  ngOnInit(): void {}

  get filteredResources(): UISupportResource[] {
    let list = this.resources;
    if (this.selectedCategory !== 'ALL') {
      list = list.filter((r) => r.category === this.selectedCategory);
    }
    if (this.searchCity.trim()) {
      const q = this.searchCity.toLowerCase().trim();
      list = list.filter((r) => !r.city || r.city.toLowerCase().includes(q));
    }
    return list;
  }
}
