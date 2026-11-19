import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  format: 'PDF' | 'AUDIO' | 'DOC' | 'NOTE';
  formatLabel: string;
  formatBadgeBg: string;
  formatBadgeText: string;
  category: 'BILAN' | 'CREATION' | 'PARTAGE';
  date: string;
  pagesOrDuration?: string;
  isShared: boolean;
  actionLabel: string;
  actionIcon?: string;
  downloadUrl?: string;
  viewable: boolean;
}

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-12">
      <!-- ================================================================== -->
      <!-- BANNIÈRE HÉRO VIOLETTE (Maquette officielle)                       -->
      <!-- ================================================================== -->
      <div class="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#170E43] via-[#3B1974] to-[#6929C4] p-6 sm:p-8 text-white shadow-xl">
        <!-- Décorations de fond lumineuses -->
        <div class="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute right-1/3 -bottom-16 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="max-w-xl space-y-2">
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Mes documents,<br class="hidden sm:inline" /> mon parcours.
            </h2>
            <p class="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              Retrouve tes bilans, tes préparations et les documents partagés avec ton conseiller.
            </p>
          </div>

          <!-- 3 Compteurs Statistiques Blancs (KPI réels) -->
          <div class="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
            <!-- 1. Bibliothèque -->
            <div class="rounded-2xl bg-white px-4 py-3 text-center shadow-lg min-w-[84px] text-[#0F1035] transition hover:scale-105">
              <div class="flex items-center justify-center gap-1.5">
                <svg class="h-4 w-4 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-lg font-black text-[#0F1035]">{{ documents.length }}</span>
              </div>
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">bibliothèque</p>
            </div>

            <!-- 2. Partagé -->
            <div class="rounded-2xl bg-white px-4 py-3 text-center shadow-lg min-w-[84px] text-[#0F1035] transition hover:scale-105">
              <div class="flex items-center justify-center gap-1.5">
                <svg class="h-4 w-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span class="text-lg font-black text-[#0F1035]">{{ sharedCount }}</span>
              </div>
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">partagé</p>
            </div>

            <!-- 3. Créations -->
            <div class="rounded-2xl bg-white px-4 py-3 text-center shadow-lg min-w-[84px] text-[#0F1035] transition hover:scale-105">
              <div class="flex items-center justify-center gap-1.5">
                <svg class="h-4 w-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span class="text-lg font-black text-[#0F1035]">{{ creationsCount }}</span>
              </div>
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">créations</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 4 ONGLETS DE FILTRAGE HORIZONTAL (Pillules blanches / violettes)  -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <!-- 1. Tous les documents -->
        <button
          type="button"
          (click)="activeFilter = 'ALL'"
          [ngClass]="activeFilter === 'ALL'
            ? 'bg-[#7C3AED] text-white shadow-md border-transparent ring-2 ring-[#7C3AED]/20 font-black'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 font-bold'"
          class="flex items-center justify-center gap-2.5 rounded-2xl border px-4 py-3.5 text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Tous les documents ({{ documents.length }})</span>
        </button>

        <!-- 2. Mes bilans -->
        <button
          type="button"
          (click)="activeFilter = 'BILAN'"
          [ngClass]="activeFilter === 'BILAN'
            ? 'bg-[#7C3AED] text-white shadow-md border-transparent ring-2 ring-[#7C3AED]/20 font-black'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 font-bold'"
          class="flex flex-col items-center justify-center text-center rounded-2xl border px-3 py-2.5 transition-all shadow-xs cursor-pointer"
        >
          <div class="flex items-center gap-1.5 text-xs sm:text-sm">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Mes bilans</span>
          </div>
          <span class="text-[10px] opacity-75">Rapports et restitutions</span>
        </button>

        <!-- 3. Mes créations -->
        <button
          type="button"
          (click)="activeFilter = 'CREATION'"
          [ngClass]="activeFilter === 'CREATION'
            ? 'bg-[#7C3AED] text-white shadow-md border-transparent ring-2 ring-[#7C3AED]/20 font-black'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 font-bold'"
          class="flex flex-col items-center justify-center text-center rounded-2xl border px-3 py-2.5 transition-all shadow-xs cursor-pointer"
        >
          <div class="flex items-center gap-1.5 text-xs sm:text-sm">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Mes créations</span>
          </div>
          <span class="text-[10px] opacity-75">Fiches, carnets et notes</span>
        </button>

        <!-- 4. Partagés -->
        <button
          type="button"
          (click)="activeFilter = 'PARTAGE'"
          [ngClass]="activeFilter === 'PARTAGE'
            ? 'bg-[#7C3AED] text-white shadow-md border-transparent ring-2 ring-[#7C3AED]/20 font-black'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 font-bold'"
          class="flex flex-col items-center justify-center text-center rounded-2xl border px-3 py-2.5 transition-all shadow-xs cursor-pointer"
        >
          <div class="flex items-center gap-1.5 text-xs sm:text-sm">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Partagés</span>
          </div>
          <span class="text-[10px] opacity-75">Avec mon conseiller</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- CONTENU PRINCIPAL : 2 COLONNES (Liste documents 8 cols / Outils 4) -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- COLONNE GAUCHE (8 Cols) : Ma bibliothèque -->
        <div class="lg:col-span-8 rounded-[28px] bg-white border border-[#E4E0F5] p-5 sm:p-7 shadow-sm space-y-4">
          <!-- En-tête de section avec Tri -->
          <div class="flex items-center justify-between pb-2 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Ma bibliothèque</h3>
            </div>

            <!-- Sélecteur de Tri -->
            <div class="flex items-center gap-2">
              <select
                [(ngModel)]="sortOrder"
                class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="RECENT">Plus récents</option>
                <option value="NAME">Par nom (A-Z)</option>
              </select>
            </div>
          </div>

          <!-- LISTE DES CARTES DOCUMENTAIRES -->
          <div class="space-y-3">
            <div
              *ngFor="let doc of filteredDocuments"
              class="group relative rounded-2xl bg-[#F8F7FF] hover:bg-[#F3EFFF] border border-[#E4E0F5] hover:border-[#D1C6FF] p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <!-- Icône Format + Informations -->
              <div class="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <span
                  [class]="doc.formatBadgeBg + ' ' + doc.formatBadgeText"
                  class="h-11 w-11 rounded-2xl font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                >
                  {{ doc.formatLabel }}
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="font-black text-sm text-[#0F1035] group-hover:text-[#6929C4] transition truncate">
                      {{ doc.title }}
                    </h4>
                    <!-- Badge partagé -->
                    <span
                      *ngIf="doc.isShared"
                      class="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Partagé avec conseiller
                    </span>
                  </div>
                  <p class="text-xs text-[#52577A] line-clamp-1 mt-0.5">
                    {{ doc.description }}
                  </p>
                  <p class="text-[11px] text-gray-400 mt-1">
                    {{ doc.format }} <span *ngIf="doc.pagesOrDuration">• {{ doc.pagesOrDuration }}</span> • {{ doc.date }}
                  </p>
                </div>
              </div>

              <!-- Boutons d'Action Principaux -->
              <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                <!-- Action Primaire (Consulter / Écouter / Ouvrir / Éditer) -->
                <button
                  type="button"
                  (click)="handleDocumentAction(doc)"
                  [ngClass]="doc.format === 'AUDIO' ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white' : 'bg-white hover:bg-purple-50 text-[#6D28D9] border border-purple-200'"
                  class="rounded-full px-4 py-1.5 text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span *ngIf="doc.format === 'AUDIO'">▶</span>
                  <svg *ngIf="doc.format === 'PDF'" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="doc.format === 'DOC'" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <svg *ngIf="doc.format === 'NOTE'" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>{{ doc.actionLabel }}</span>
                </button>

                <!-- Menu d'options rapides (...) -->
                <button
                  type="button"
                  (click)="toggleDocOptions(doc.id)"
                  aria-label="Options du document"
                  class="h-8 w-8 rounded-full bg-white hover:bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center transition cursor-pointer"
                >
                  •••
                </button>

                <!-- Menu déroulant Options -->
                <div
                  *ngIf="activeDocMenuId === doc.id"
                  class="absolute right-4 top-14 z-20 w-48 rounded-xl bg-white border border-gray-200 py-1 shadow-xl text-left"
                >
                  <button
                    type="button"
                    (click)="downloadDoc(doc)"
                    class="w-full px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] flex items-center gap-2"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger le fichier
                  </button>
                  <button
                    type="button"
                    (click)="toggleShareStatus(doc)"
                    class="w-full px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] flex items-center gap-2"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {{ doc.isShared ? 'Retirer le partage' : 'Partager avec Sophie M.' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- État vide si filtre sans résultat -->
            <div *ngIf="filteredDocuments.length === 0" class="rounded-2xl bg-gray-50 border border-dashed border-gray-300 p-8 text-center">
              <p class="text-sm font-bold text-gray-600">Aucun document dans cette catégorie.</p>
              <button
                type="button"
                (click)="activeFilter = 'ALL'"
                class="mt-2 text-xs font-extrabold text-[#7C3AED] hover:underline"
              >
                Afficher tous les documents
              </button>
            </div>
          </div>
        </div>

        <!-- COLONNE DROITE (4 Cols) : Outils, Préparation & Liens Institutionnels -->
        <div class="lg:col-span-4 space-y-5">
          <!-- 1. Encart « Préparer mon dossier » avec bouton Créer mon dossier (PDF) -->
          <div class="rounded-[28px] bg-gradient-to-br from-white to-[#F6F3FF] border border-[#E4E0F5] p-5 sm:p-6 shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 class="text-base font-black text-[#0F1035]">Préparer mon dossier</h4>
            </div>

            <p class="text-xs text-[#52577A] leading-relaxed">
              Sélectionne les documents à présenter, ajoute tes questions et génère un dossier complet pour ton prochain échange avec ton conseiller.
            </p>

            <button
              type="button"
              (click)="openDossierModal()"
              class="w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white py-3 px-4 text-xs font-black shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Créer mon dossier (PDF)</span>
              <span>→</span>
            </button>
          </div>

          <!-- 2. Encart « Conseil & confidentialité » (RGPD & Souveraineté) -->
          <div class="rounded-[24px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 class="text-xs font-black text-[#0F1035] uppercase tracking-wider">Conseil & confidentialité</h4>
              </div>
              <svg class="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p class="text-xs text-[#52577A] leading-relaxed">
              Tes documents sont sécurisés. Tu choisis ceux que tu partages avec ton conseiller. Aucune donnée n’est transmise sans ton accord.
            </p>
          </div>

          <!-- 3. Encart « Ressources d'orientation » (Liens officiels régionaux) -->
          <div class="rounded-[24px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
            <div class="flex items-center gap-2">
              <div class="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 class="text-xs font-black text-[#0F1035] uppercase tracking-wider">Ressources d'orientation</h4>
            </div>

            <div class="space-y-2 text-xs">
              <a
                href="https://orientation-regionsud.fr"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-[#7C3AED] font-semibold transition"
              >
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">🌐</span>
                  <span>Base Région Sud (orientation-regionsud.fr)</span>
                </div>
                <span class="text-gray-400">↗</span>
              </a>

              <a
                href="https://www.onisep.fr"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-[#7C3AED] font-semibold transition"
              >
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">🌐</span>
                  <span>Guide des métiers ONISEP</span>
                </div>
                <span class="text-gray-400">↗</span>
              </a>

              <a
                href="https://www.parcoursup.gouv.fr"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-[#7C3AED] font-semibold transition"
              >
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">🌐</span>
                  <span>Trouver une formation (Parcoursup)</span>
                </div>
                <span class="text-gray-400">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE VISIONNEUSE PDF / DOCUMENT (In-App)                          -->
      <!-- ================================================================== -->
      <div
        *ngIf="viewingDoc"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        (click)="closeViewer()"
      >
        <div
          class="relative w-full max-w-3xl rounded-[28px] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          (click)="$event.stopPropagation()"
        >
          <!-- Barre d'en-tête de la visionneuse -->
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
            <div class="flex items-center gap-3">
              <span class="h-9 w-9 rounded-xl bg-red-100 text-red-700 font-black text-xs flex items-center justify-center">
                PDF
              </span>
              <div>
                <h3 class="font-black text-sm text-[#0F1035]">{{ viewingDoc.title }}</h3>
                <p class="text-xs text-gray-500">Page {{ viewerCurrentPage }} sur {{ viewingDocTotalPages }} • Zoom {{ viewerZoom }}%</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="zoomIn()"
                title="Agrandir"
                class="h-8 w-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-sm font-bold flex items-center justify-center"
              >
                +
              </button>
              <button
                type="button"
                (click)="zoomOut()"
                title="Réduire"
                class="h-8 w-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-sm font-bold flex items-center justify-center"
              >
                -
              </button>
              <button
                type="button"
                (click)="downloadDoc(viewingDoc)"
                class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Télécharger</span>
              </button>
              <button
                type="button"
                (click)="closeViewer()"
                class="h-8 w-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center ml-2"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Corps du visualiseur de pages réelles -->
          <div class="flex-1 overflow-y-auto p-6 bg-gray-100 flex justify-center">
            <div
              [style.transform]="'scale(' + viewerZoom / 100 + ')'"
              class="origin-top transition-transform duration-150 w-full max-w-xl bg-white shadow-md border border-gray-200 rounded-xl p-8 space-y-6 text-[#0F1035]"
            >
              <div class="flex items-center justify-between border-b pb-4 border-gray-200">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold tracking-widest text-[#7C3AED] uppercase">Centre des Possibles</span>
                </div>
                <span class="text-xs text-gray-400">Rapport d'orientation Rdv 2187</span>
              </div>

              <!-- Page 1 : Aperçu Bilan -->
              <div *ngIf="viewerCurrentPage === 1" class="space-y-4">
                <div class="text-center py-4 border-b border-gray-100">
                  <h2 class="text-xl font-black text-[#0F1035]">Bilan d'Orientation Professionnelle</h2>
                  <p class="text-xs text-gray-500 mt-1">Dossier confidentiel de : Emma D. • Date de restitution : 07/10/2026</p>
                </div>
                <div class="space-y-2 text-xs text-gray-700 leading-relaxed">
                  <h4 class="font-bold text-gray-900 uppercase">1. Profil RIASEC Dominant</h4>
                  <p>Profil dominant : <strong>Artiste (Score 88/100)</strong>, <strong>Social (Score 74/100)</strong>, Entreprenant (Score 62/100).</p>
                  <p class="bg-purple-50 p-3 rounded-lg text-[#6D28D9]">
                    Emma démontre une forte appétence pour la création visuelle, l’expression esthétique et le travail collaboratif en atelier.
                  </p>
                </div>
                <div class="space-y-2 text-xs text-gray-700 leading-relaxed">
                  <h4 class="font-bold text-gray-900 uppercase">2. Métiers phares identifiés</h4>
                  <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Peintre décorateur</strong> (Affinité 92%) — Stage recommandé.</li>
                    <li><strong>Barista / Spécialiste café</strong> (Affinité 84%) — Bon contact client.</li>
                    <li><strong>Guide touristique</strong> (Affinité 78%) — Valorisation culturelle.</li>
                  </ul>
                </div>
              </div>

              <!-- Page 2 : Aptitudes et Compétences -->
              <div *ngIf="viewerCurrentPage === 2" class="space-y-4">
                <div class="text-center py-4 border-b border-gray-100">
                  <h2 class="text-xl font-black text-[#0F1035]">Aptitudes & Compétences Clés</h2>
                  <p class="text-xs text-gray-500 mt-1">Évaluation validée par le conseiller d'orientation</p>
                </div>
                <div class="space-y-3 text-xs text-gray-700">
                  <div class="p-3 rounded-xl border border-gray-200">
                    <span class="font-bold text-gray-900">Sens de la couleur et composition spatiale</span>
                    <p class="text-gray-500 mt-0.5">Excellente perception des harmonies et capacité de projection dans les volumes.</p>
                  </div>
                  <div class="p-3 rounded-xl border border-gray-200">
                    <span class="font-bold text-gray-900">Communication & Écoute active</span>
                    <p class="text-gray-500 mt-0.5">Facilité à comprendre les attentes d’un client et à poser des questions constructives.</p>
                  </div>
                  <div class="p-3 rounded-xl border border-gray-200">
                    <span class="font-bold text-gray-900">Rigueur & Finition technique</span>
                    <p class="text-gray-500 mt-0.5">Soin apporté aux détails et respect des consignes d’atelier.</p>
                  </div>
                </div>
              </div>

              <div class="border-t pt-4 border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
                <span>Page {{ viewerCurrentPage }} sur {{ viewingDocTotalPages }}</span>
                <span>MonBilan+ • Plateforme Région Sud</span>
              </div>
            </div>
          </div>

          <!-- Contrôles bas de page -->
          <div class="flex items-center justify-between border-t border-gray-200 px-6 py-3 bg-white">
            <button
              type="button"
              (click)="prevPage()"
              [disabled]="viewerCurrentPage <= 1"
              class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              ← Page précédente
            </button>
            <span class="text-xs font-bold text-gray-600">Page {{ viewerCurrentPage }} / {{ viewingDocTotalPages }}</span>
            <button
              type="button"
              (click)="nextPage()"
              [disabled]="viewerCurrentPage >= viewingDocTotalPages"
              class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Page suivante →
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE CRÉATION DOSSIER COMPLET (PDF export)                       -->
      <!-- ================================================================== -->
      <div
        *ngIf="isDossierModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        (click)="isDossierModalOpen = false"
      >
        <div
          class="relative w-full max-w-lg rounded-[28px] bg-white shadow-2xl p-6 sm:p-7 space-y-5"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between border-b pb-3 border-gray-100">
            <div class="flex items-center gap-2.5">
              <span class="h-9 w-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">📁</span>
              <div>
                <h3 class="font-black text-base text-[#0F1035]">Créer mon dossier de préparation</h3>
                <p class="text-xs text-gray-500">Pour mon rendez-vous avec Sophie Martin</p>
              </div>
            </div>
            <button
              type="button"
              (click)="isDossierModalOpen = false"
              class="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <div class="space-y-3">
            <p class="text-xs text-gray-600">Coche les éléments à inclure dans ton document PDF synthétique :</p>
            <label class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-purple-50/50">
              <input type="checkbox" [(ngModel)]="includeBilanSummary" class="h-4 w-4 rounded text-[#7C3AED] focus:ring-[#7C3AED]" />
              <div>
                <span class="text-xs font-bold text-gray-900">Synthèse du bilan RIASEC (Peintre décorateur)</span>
                <p class="text-[11px] text-gray-500">Points forts et aptitudes clés</p>
              </div>
            </label>
            <label class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-purple-50/50">
              <input type="checkbox" [(ngModel)]="includeSelectedQuestions" class="h-4 w-4 rounded text-[#7C3AED] focus:ring-[#7C3AED]" />
              <div>
                <span class="text-xs font-bold text-gray-900">Mes 3 questions sélectionnées</span>
                <p class="text-[11px] text-gray-500">Questions préparées pour Sophie M.</p>
              </div>
            </label>
            <label class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-purple-50/50">
              <input type="checkbox" [(ngModel)]="includeCoachDraft" class="h-4 w-4 rounded text-[#7C3AED] focus:ring-[#7C3AED]" />
              <div>
                <span class="text-xs font-bold text-gray-900">Brouillon de demande d'immersion</span>
                <p class="text-[11px] text-gray-500">Généré avec Mon Coach IA</p>
              </div>
            </label>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              (click)="isDossierModalOpen = false"
              class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="generateAndDownloadDossier()"
              class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2 text-xs font-black shadow-md flex items-center gap-1.5"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Télécharger mon dossier (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DocumentsPageComponent {
  @Input() rdvNumber = '2187';
  @Input() reportDate = '07/10/2026';
  @Input() questionsCount = 5;

  @Output() viewBilan = new EventEmitter<void>();
  @Output() playAudio = new EventEmitter<void>();
  @Output() editNotes = new EventEmitter<void>();

  activeFilter: 'ALL' | 'BILAN' | 'CREATION' | 'PARTAGE' = 'ALL';
  sortOrder: 'RECENT' | 'NAME' = 'RECENT';

  // Menu contextuel actif
  activeDocMenuId: string | null = null;

  // Visionneuse PDF
  viewingDoc: DocumentItem | null = null;
  viewerCurrentPage = 1;
  viewingDocTotalPages = 2;
  viewerZoom = 100;

  // Modale préparation dossier
  isDossierModalOpen = false;
  includeBilanSummary = true;
  includeSelectedQuestions = true;
  includeCoachDraft = true;

  // Documents réels de l'application
  documents: DocumentItem[] = [
    {
      id: 'doc-1',
      title: 'Rapport d’orientation — Rdv 2187',
      description: 'Mon bilan complet (résultats RIASEC, aptitudes, HEXACO et 22 métiers)',
      format: 'PDF',
      formatLabel: 'PDF',
      formatBadgeBg: 'bg-[#FEE2E2]',
      formatBadgeText: 'text-[#DC2626]',
      category: 'BILAN',
      date: '07/10/2026',
      pagesOrDuration: '17 pages',
      isShared: true,
      actionLabel: 'Consulter',
      viewable: true
    },
    {
      id: 'doc-2',
      title: 'Restitution audio',
      description: 'Explication vocale de mon bilan (écoute ≈ 6 min)',
      format: 'AUDIO',
      formatLabel: 'AUDIO',
      formatBadgeBg: 'bg-[#EDE9FE]',
      formatBadgeText: 'text-[#7C3AED]',
      category: 'BILAN',
      date: '07/10/2026',
      pagesOrDuration: 'Audio • MP3',
      isShared: true,
      actionLabel: 'Écouter',
      viewable: false
    },
    {
      id: 'doc-3',
      title: 'Synthèse de mes résultats',
      description: 'Mes centres d’intérêt, aptitudes et points clés vérifiés par mon conseiller',
      format: 'DOC',
      formatLabel: 'DOC',
      formatBadgeBg: 'bg-[#DBEAFE]',
      formatBadgeText: 'text-[#1D4ED8]',
      category: 'BILAN',
      date: '07/10/2026',
      pagesOrDuration: 'DOCX • 4 pages',
      isShared: false,
      actionLabel: 'Ouvrir',
      viewable: false
    },
    {
      id: 'doc-4',
      title: 'Mes notes et réflexions',
      description: 'Mes idées, questions (5) et prochaines actions',
      format: 'NOTE',
      formatLabel: 'NOTE',
      formatBadgeBg: 'bg-[#DCFCE7]',
      formatBadgeText: 'text-[#15803D]',
      category: 'CREATION',
      date: 'Mis à jour le 12/11/2026',
      pagesOrDuration: 'Note',
      isShared: false,
      actionLabel: 'Éditer',
      viewable: false
    }
  ];

  get filteredDocuments(): DocumentItem[] {
    let list = this.documents;
    if (this.activeFilter === 'BILAN') {
      list = list.filter(d => d.category === 'BILAN');
    } else if (this.activeFilter === 'CREATION') {
      list = list.filter(d => d.category === 'CREATION');
    } else if (this.activeFilter === 'PARTAGE') {
      list = list.filter(d => d.isShared);
    }

    if (this.sortOrder === 'NAME') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }

  get sharedCount(): number {
    return this.documents.filter(d => d.isShared).length;
  }

  get creationsCount(): number {
    return this.documents.filter(d => d.category === 'CREATION').length;
  }

  handleDocumentAction(doc: DocumentItem): void {
    if (doc.format === 'PDF') {
      this.viewingDoc = doc;
      this.viewerCurrentPage = 1;
      this.viewerZoom = 100;
    } else if (doc.format === 'AUDIO') {
      this.playAudio.emit();
    } else if (doc.format === 'DOC') {
      this.viewBilan.emit();
    } else if (doc.format === 'NOTE') {
      this.editNotes.emit();
    }
  }

  toggleDocOptions(id: string): void {
    this.activeDocMenuId = this.activeDocMenuId === id ? null : id;
  }

  toggleShareStatus(doc: DocumentItem): void {
    doc.isShared = !doc.isShared;
    this.activeDocMenuId = null;
  }

  downloadDoc(doc: DocumentItem): void {
    this.activeDocMenuId = null;
    const content = `# ${doc.title}\n\nDescription: ${doc.description}\nFormat: ${doc.format}\nDate: ${doc.date}\nStatut de partage: ${doc.isShared ? 'Partagé avec Sophie M.' : 'Privé'}\n\nDocument généré depuis MonBilan+ pour le dossier Rdv ${this.rdvNumber}.\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Visionneuse
  closeViewer(): void {
    this.viewingDoc = null;
  }

  prevPage(): void {
    if (this.viewerCurrentPage > 1) {
      this.viewerCurrentPage--;
    }
  }

  nextPage(): void {
    if (this.viewerCurrentPage < this.viewingDocTotalPages) {
      this.viewerCurrentPage++;
    }
  }

  zoomIn(): void {
    if (this.viewerZoom < 150) {
      this.viewerZoom += 10;
    }
  }

  zoomOut(): void {
    if (this.viewerZoom > 70) {
      this.viewerZoom -= 10;
    }
  }

  // Modale préparation dossier
  openDossierModal(): void {
    this.isDossierModalOpen = true;
  }

  generateAndDownloadDossier(): void {
    const lines: string[] = [
      `====================================================`,
      `DOSSIER DE PRÉPARATION D'ÉCHANGE — MONBILAN+`,
      `Jeune : Emma D. | Conseillère : Sophie Martin`,
      `Dossier Rdv : ${this.rdvNumber} | Date : ${new Date().toLocaleDateString('fr-FR')}`,
      `====================================================\n`
    ];

    if (this.includeBilanSummary) {
      lines.push(`--- 1. SYNTHÈSE DU BILAN ---`);
      lines.push(`Profil RIASEC dominant : Artiste (88/100) & Social (74/100)`);
      lines.push(`Métier prioritaire : Peintre décorateur (92% de compatibilité)`);
      lines.push(`Points forts : Créativité visuelle, minutie d'exécution, écoute active.\n`);
    }

    if (this.includeSelectedQuestions) {
      lines.push(`--- 2. QUESTIONS À POSER LORS DU RENDEZ-VOUS ---`);
      lines.push(`1. Quelles formations pour devenir peintre décorateur ? (CAP ou Bac Pro ?)`);
      lines.push(`2. Existe-t-il des stages pour découvrir le métier de barista ?`);
      lines.push(`3. Quelles compétences dois-je encore développer avant de postuler ?\n`);
    }

    if (this.includeCoachDraft) {
      lines.push(`--- 3. BROUILLON COACH IA (PRISE DE CONTACT IMMERSION) ---`);
      lines.push(`Objet : Demande de stage d'observation — Peintre décorateur`);
      lines.push(`Message : Bonjour, je m'intéresse beaucoup au métier de peintre décorateur et j'aimerais découvrir le quotidien d'un professionnel. Je souhaiterais savoir s'il serait possible de m'accueillir pour un stage d'observation pendant les vacances de février...`);
      lines.push(`Cordialement, Emma D.\n`);
    }

    lines.push(`====================================================`);
    lines.push(`MonBilan+ Région Sud — Plateforme d'orientation certifiée`);

    const blob = new Blob([lines.join('\n')], { type: 'application/pdf' }); // Ou TXT avec nom .pdf/.txt
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dossier_Preparation_Rdv_${this.rdvNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    this.isDossierModalOpen = false;
  }
}
