import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type FactReviewStatus = 'PENDING_REVIEW' | 'VERIFIED' | 'CORRECTED' | 'NEEDS_CLARIFICATION' | 'REJECTED';

export interface ReviewableFact {
  id: string;
  category: 'RIASEC' | 'APTITUDES' | 'HEXACO' | 'METIERS' | 'METADATA';
  categoryLabel: string;
  typeLabel: string;
  value: string;
  pageNumber: number;
  totalPages: number;
  rawCitation: string;
  highlightCoordinates?: { top: number; left: number; width: number; height: number };
  status: FactReviewStatus;
  history?: {
    date: string;
    author: string;
    previousValue: string;
    newValue: string;
    comment?: string;
  }[];
}

@Component({
  selector: 'app-counselor-fact-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-12">
      <!-- ================================================================== -->
      <!-- BANDEAU SUPÉRIEUR : DOSSIER EMMA D. — RÉVISION DU BILAN            -->
      <!-- ================================================================== -->
      <div class="rounded-[28px] bg-gradient-to-r from-[#170E43] via-[#3B1974] to-[#6929C4] p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xs text-purple-200 border border-white/20 flex items-center justify-center text-2xl shrink-0">
            🤖
          </div>
          <div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <h2 class="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Dossier {{ youngName }} — Révision du bilan
              </h2>
              <span class="rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-xs font-bold text-purple-100">
                Rdv {{ rdvNumber }}
              </span>
            </div>
            <p class="text-xs text-purple-200/90 mt-0.5">
              Centre des Possibles (Nice) • Conseillère : {{ counselorName }} • Rapport : {{ totalPages }} pages ({{ reportDate }})
            </p>
          </div>
        </div>

        <!-- Badges d'état rapide -->
        <div class="flex items-center gap-2 self-start md:self-center shrink-0">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-extrabold text-emerald-300">
            <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Contrôle humain actif
          </span>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- STEPPER HORIZONTAL 6 ÉTAPES (Maquette officielle)                  -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          type="button"
          (click)="selectStep(1)"
          class="rounded-2xl border p-2.5 sm:p-3 text-left transition flex items-center gap-2.5 bg-white border-purple-200 shadow-xs cursor-pointer hover:bg-purple-50/50"
        >
          <div class="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div class="min-w-0">
            <span class="text-[10px] uppercase font-bold text-gray-400 block">1</span>
            <span class="text-xs font-black text-gray-900 truncate block">Import et extraction</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectStep(2)"
          class="rounded-2xl border p-2.5 sm:p-3 text-left transition flex items-center gap-2.5 bg-white border-gray-200 shadow-xs cursor-pointer hover:bg-purple-50/50"
        >
          <div class="h-7 w-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">
            2
          </div>
          <div class="min-w-0">
            <span class="text-[10px] uppercase font-bold text-gray-400 block">2</span>
            <span class="text-xs font-bold text-gray-700 truncate block">Entretien et contexte</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectStep(3)"
          class="rounded-2xl border p-2.5 sm:p-3 text-left transition flex items-center gap-2.5 bg-white border-purple-300 shadow-sm ring-2 ring-[#7C3AED]/20 font-black"
        >
          <div class="h-7 w-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shrink-0">
            3
          </div>
          <div class="min-w-0">
            <span class="text-[10px] uppercase font-bold text-purple-600 block">3 (Actif)</span>
            <span class="text-xs font-black text-[#7C3AED] truncate block">Analyse assistée IA</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectStep(4)"
          class="rounded-2xl border p-2.5 sm:p-3 text-left transition flex items-center gap-2.5 bg-white border-gray-200 shadow-xs cursor-pointer hover:bg-purple-50/50"
        >
          <div class="h-7 w-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">
            4
          </div>
          <div class="min-w-0">
            <span class="text-[10px] uppercase font-bold text-gray-400 block">4</span>
            <span class="text-xs font-bold text-gray-700 truncate block">Révision des métiers</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectStep(5)"
          class="rounded-2xl border p-2.5 sm:p-3 text-left transition flex items-center gap-2.5 bg-white border-gray-200 shadow-xs cursor-pointer hover:bg-purple-50/50"
        >
          <div class="h-7 w-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">
            5
          </div>
          <div class="min-w-0">
            <span class="text-[10px] uppercase font-bold text-gray-400 block">5</span>
            <span class="text-xs font-bold text-gray-700 truncate block">Restitution et épisodes</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectStep(6)"
          class="rounded-2xl border p-2.5 sm:p-3 text-left transition flex items-center gap-2.5 bg-white border-gray-200 shadow-xs cursor-pointer hover:bg-purple-50/50"
        >
          <div class="h-7 w-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">
            6
          </div>
          <div class="min-w-0">
            <span class="text-[10px] uppercase font-bold text-gray-400 block">6</span>
            <span class="text-xs font-bold text-gray-700 truncate block">Validation et publication</span>
          </div>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- TITRE SECTION : RÉVISION DES FAITS EXTRAITS + 3 INDICATEURS        -->
      <!-- ================================================================== -->
      <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2.5">
              <span class="h-9 w-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-lg font-bold">
                🛡️
              </span>
              <h3 class="text-xl font-black text-[#0F1035]">Révision des faits extraits</h3>
            </div>
            <p class="text-xs sm:text-sm text-[#42466B]">
              Contrôle, correction et validation des informations extraites du rapport d'orientation.
            </p>
          </div>

          <!-- 3 Capsules Indicateurs : Détectés, Contrôlés, Publication bloquée/débloquée -->
          <div class="flex items-center gap-3 flex-wrap">
            <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] px-4 py-2 flex items-center gap-2 shadow-2xs">
              <span class="text-sm">📄</span>
              <span class="text-xs font-black text-[#0F1035]">{{ facts.length }} faits détectés</span>
            </div>

            <div class="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2 flex items-center gap-2 shadow-2xs">
              <span class="text-sm text-emerald-600">✓</span>
              <span class="text-xs font-black text-emerald-800">{{ verifiedCount }} contrôlé{{ verifiedCount > 1 ? 's' : '' }}</span>
            </div>

            <!-- Capsule Publication Bloquée ou Prête -->
            <div
              [ngClass]="isPublicationReady
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-rose-50 border-rose-200 text-rose-700'"
              class="rounded-2xl border px-4 py-2 flex items-center gap-2 shadow-2xs transition-all"
            >
              <span>{{ isPublicationReady ? '🔓' : '🔒' }}</span>
              <span class="text-xs font-black">
                {{ isPublicationReady ? 'Publication débloquée' : 'Publication bloquée' }}
              </span>
            </div>
          </div>
        </div>

        <!-- BARRE DE PROGRESSION DE VALIDATION -->
        <div class="space-y-1.5 pt-2 border-t border-gray-100">
          <div class="flex items-center justify-between text-xs font-bold text-[#42466B]">
            <span>Progression de la validation</span>
            <span class="font-black text-[#7C3AED]">{{ verifiedCount }} / {{ facts.length }}</span>
          </div>
          <div class="w-full h-3 rounded-full bg-[#EDE9FE] overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-[#7C3AED] to-[#10B981] transition-all duration-300 rounded-full"
              [style.width.%]="(verifiedCount / facts.length) * 100"
            ></div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- SPLIT VIEW : DOCUMENT SOURCE (GAUCHE 6) + EXTRACTION IA (DROITE 6) -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- ================================================================ -->
        <!-- ZONE GAUCHE (6 Cols) : DOCUMENT SOURCE (Visionneuse PDF fidèle)  -->
        <!-- ================================================================ -->
        <div class="lg:col-span-6 rounded-[28px] bg-white border border-[#E4E0F5] p-5 sm:p-6 shadow-sm space-y-4">
          <!-- En-tête Zone Gauche -->
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 class="text-base font-black text-[#0F1035]">Document source</h4>
            </div>
            <span class="rounded-full bg-purple-100 text-[#6D28D9] px-3 py-1 text-xs font-black">
              PDF original • Page {{ currentPdfPage }}
            </span>
          </div>

          <!-- Barre d'outils du lecteur PDF : < 4 / 17 > , zoom -, zoom +, plein écran, télécharger -->
          <div class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-xs">
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="prevPdfPage()"
                [disabled]="currentPdfPage <= 1"
                class="h-7 w-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center font-bold"
              >
                ‹
              </button>
              <span class="font-extrabold text-gray-800 px-1">{{ currentPdfPage }} / {{ totalPages }}</span>
              <button
                type="button"
                (click)="nextPdfPage()"
                [disabled]="currentPdfPage >= totalPages"
                class="h-7 w-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center font-bold"
              >
                ›
              </button>
            </div>

            <!-- Contrôles Zoom -->
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                (click)="zoomOut()"
                class="h-7 w-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-black"
              >
                -
              </button>
              <span class="font-bold text-gray-600 px-1">{{ pdfZoom }} %</span>
              <button
                type="button"
                (click)="zoomIn()"
                class="h-7 w-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-black"
              >
                +
              </button>
              <button
                type="button"
                (click)="downloadOriginalPdf()"
                title="Télécharger le PDF original"
                class="h-7 w-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center ml-1"
              >
                📥
              </button>
            </div>
          </div>

          <!-- Feuille de rendu fidèle du PDF source avec mise en surbrillance -->
          <div class="relative bg-gray-100 rounded-2xl border border-gray-200 p-4 min-h-[460px] overflow-hidden flex justify-center">
            <div
              [style.transform]="'scale(' + pdfZoom / 100 + ')'"
              class="origin-top transition-transform duration-150 w-full max-w-md bg-white shadow-md border border-gray-300 rounded-xl p-6 text-[#0F1035] space-y-4"
            >
              <!-- En-tête de page PDF -->
              <div class="border-b pb-2 border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
                <span class="font-bold uppercase tracking-wider text-purple-700">Centre des Possibles</span>
                <span>Rapport Rdv 2187 — Page {{ currentPdfPage }}</span>
              </div>

              <!-- Page 4 : RIASEC -->
              <div *ngIf="currentPdfPage === 4" class="space-y-4 text-xs">
                <h4 class="text-sm font-black text-[#0F1035]">2. Résultats RIASEC — Centres d’intérêt</h4>
                
                <p class="text-gray-700 leading-relaxed">
                  Le profil met en évidence une dominante
                  <mark class="bg-amber-200 text-gray-900 font-black px-1 rounded">
                    Artistique
                  </mark>, associée à un intérêt marqué pour les activités de création et d'expression.
                </p>

                <p class="text-gray-600 text-[11px]">
                  D'autres intérêts sont également présents : 
                  <span [class.bg-amber-100]="selectedFact?.value === 'Entreprenant'">Entreprenant</span> et 
                  <span [class.bg-amber-100]="selectedFact?.value === 'Réaliste'">Réaliste</span>, à un niveau modéré.
                </p>

                <!-- Tableau RIASEC représenté -->
                <div class="border border-gray-200 rounded-lg p-2.5 space-y-1.5 bg-gray-50/50 text-[11px]">
                  <div class="flex justify-between font-bold text-gray-500 border-b pb-1">
                    <span>Dimension RIASEC</span>
                    <span>Niveau relatif</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="font-black text-[#7C3AED]">Artistique (A)</span>
                    <div class="w-24 bg-purple-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-[#7C3AED] h-full w-[85%]"></div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-gray-700">Entreprenant (E)</span>
                    <div class="w-24 bg-purple-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-purple-600 h-full w-[65%]"></div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-gray-700">Réaliste (R)</span>
                    <div class="w-24 bg-purple-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-purple-500 h-full w-[55%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Page 5 : Aptitudes cognitives -->
              <div *ngIf="currentPdfPage === 5" class="space-y-4 text-xs">
                <h4 class="text-sm font-black text-[#0F1035]">3. Aptitudes Cognitives (9 Fonctions)</h4>
                <p class="text-gray-700 leading-relaxed">
                  Mesure réalisée par jeux cognitifs standardisés :
                  <mark class="bg-amber-200 text-gray-900 font-bold px-1 rounded">
                    Flexibilité des catégories, Partage du temps, Mémorisation de visages et Facilité numérique.
                  </mark>
                </p>
                <p class="text-[11px] text-gray-500 italic">
                  Observation clinique : Forte vivacité perceptive et capacité à mener des tâches d’atelier nécessitant soin et concentration visuelle.
                </p>
              </div>

              <!-- Page 6 : Personnalité HEXACO -->
              <div *ngIf="currentPdfPage === 6" class="space-y-4 text-xs">
                <h4 class="text-sm font-black text-[#0F1035]">4. Profil HEXACO (6 Dimensions)</h4>
                <p class="text-gray-700 leading-relaxed">
                  Ordre d'importance :
                  <mark class="bg-amber-200 text-gray-900 font-bold px-1 rounded">
                    1. Émotivité, 2. Ouverture à l’expérience, 3. Agréabilité, 4. Humilité-honnêteté, 5. Extraversion, 6. Caractère consciencieux.
                  </mark>
                </p>
              </div>

              <!-- Autres pages (ex: Métiers 7-16) -->
              <div *ngIf="currentPdfPage < 4 || currentPdfPage > 6" class="space-y-4 text-xs">
                <h4 class="text-sm font-black text-[#0F1035]">5. Pistes de Métiers & Zones O*NET</h4>
                <p class="text-gray-700 leading-relaxed">
                  22 métiers proposés en croisement RIASEC + Aptitudes, répartis dans 5 zones de préparation.
                </p>
                <div class="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[#6D28D9]">
                  Zone 3 : <strong>Peintre décorateur</strong> (Affinité 92%) • Barista (84%) • Guide touristique (78%).
                </div>
              </div>

              <!-- Bas de page -->
              <div class="border-t pt-2 border-gray-200 flex justify-between text-[10px] text-gray-400">
                <span>Confidentiel — Centre des Possibles</span>
                <span>Page {{ currentPdfPage }} / {{ totalPages }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================ -->
        <!-- ZONE DROITE (6 Cols) : EXTRACTION IA & CONTRÔLE HUMAIN           -->
        <!-- ================================================================ -->
        <div class="lg:col-span-6 rounded-[28px] bg-white border border-[#E4E0F5] p-5 sm:p-6 shadow-sm space-y-5">
          <!-- En-tête Zone Droite -->
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="text-purple-600 font-bold">✨</span>
              <h4 class="text-base font-black text-[#0F1035]">Extraction IA</h4>
            </div>
            <span class="rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] px-3 py-0.5 text-xs font-black">
              Extrait par l'IA
            </span>
          </div>

          <!-- Détail du fait actif sélectionné -->
          <div *ngIf="selectedFact" class="space-y-4">
            <div>
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Catégorie • {{ selectedFact.categoryLabel }}
              </span>
              <div class="mt-2 p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <h3 class="text-2xl font-black text-[#0F1035]">
                  {{ selectedFact.value }}
                </h3>
              </div>
            </div>

            <!-- Citation documentaire exacte -->
            <div class="space-y-1">
              <span class="text-xs font-bold text-gray-500">Citation documentaire originale :</span>
              <blockquote class="text-xs text-gray-700 italic bg-gray-50 p-3.5 rounded-xl border border-gray-200 leading-relaxed">
                « {{ selectedFact.rawCitation }} »
              </blockquote>
            </div>

            <!-- Métadonnées & Statut : À contrôler / Vérifié -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <span
                [ngClass]="selectedFact.status === 'VERIFIED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'"
                class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-black"
              >
                <span>{{ selectedFact.status === 'VERIFIED' ? '✓' : '⚠️' }}</span>
                <span>{{ selectedFact.status === 'VERIFIED' ? 'Vérifié' : 'À contrôler' }}</span>
              </span>

              <div class="flex items-center gap-3 text-gray-500 font-semibold">
                <span>Page source : <strong>{{ selectedFact.pageNumber }} / {{ totalPages }}</strong></span>
                <span>•</span>
                <span>Type : <strong>{{ selectedFact.typeLabel }}</strong></span>
              </div>
            </div>

            <!-- 3 Boutons d'Action : Voir la preuve PDF, Corriger, Valider -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-gray-100">
              <!-- 1. Voir la preuve PDF -->
              <button
                type="button"
                (click)="goToProofPage(selectedFact)"
                class="rounded-xl border border-gray-300 hover:border-[#7C3AED] hover:bg-purple-50 text-gray-700 hover:text-[#7C3AED] py-2.5 px-3 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>📄</span>
                <span>Voir la preuve PDF</span>
              </button>

              <!-- 2. Corriger (Ouvre modale de correction) -->
              <button
                type="button"
                (click)="openCorrectionModal(selectedFact)"
                class="rounded-xl border border-gray-300 hover:border-[#7C3AED] hover:bg-purple-50 text-gray-700 hover:text-[#7C3AED] py-2.5 px-3 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>✏️</span>
                <span>Corriger</span>
              </button>

              <!-- 3. Valider -->
              <button
                type="button"
                (click)="validateFact(selectedFact)"
                class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 px-4 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>✓</span>
                <span>{{ selectedFact.status === 'VERIFIED' ? 'Revalider' : 'Valider' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- ZONE INFÉRIEURE : LISTE DES FAITS À CONTRÔLER (7 FAITS)            -->
      <!-- ================================================================== -->
      <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="text-base text-gray-500">☰</span>
            <h4 class="text-base font-black text-[#0F1035]">
              Liste des faits à contrôler ({{ facts.length }})
            </h4>
          </div>

          <!-- Sélecteur de filtre de statut -->
          <div class="flex items-center gap-2">
            <select
              [(ngModel)]="statusFilter"
              class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">À contrôler</option>
              <option value="VERIFIED">Vérifiés</option>
            </select>
          </div>
        </div>

        <!-- Rangées des faits cliquables -->
        <div class="space-y-2.5">
          <div
            *ngFor="let fact of filteredFacts"
            (click)="selectFact(fact)"
            [ngClass]="selectedFact?.id === fact.id ? 'ring-2 ring-[#7C3AED] bg-purple-50/50' : 'bg-gray-50 hover:bg-purple-50/30'"
            class="rounded-2xl border border-gray-200 p-3.5 flex items-center justify-between gap-3 transition cursor-pointer group"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="rounded-xl bg-purple-100 text-[#7C3AED] px-2.5 py-1 text-xs font-black shrink-0">
                Page {{ fact.pageNumber }}
              </span>
              <div class="min-w-0 truncate">
                <span class="text-xs sm:text-sm font-black text-[#0F1035] group-hover:text-[#7C3AED] transition truncate">
                  {{ fact.categoryLabel }} — {{ fact.value }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <span
                [ngClass]="fact.status === 'VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'"
                class="rounded-full px-2.5 py-0.5 text-[11px] font-black flex items-center gap-1"
              >
                <span>{{ fact.status === 'VERIFIED' ? '✓' : '⚠️' }}</span>
                <span>{{ fact.status === 'VERIFIED' ? 'Vérifié' : 'À contrôler' }}</span>
              </span>
              <span class="text-gray-400 group-hover:text-[#7C3AED] font-black text-sm transition">›</span>
            </div>
          </div>
        </div>

        <!-- Navigation vers l'étape suivante lorsque tout est validé -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <p class="text-xs text-gray-500">
            <span *ngIf="!isPublicationReady">
              ⚠️ Veuillez vérifier et valider les {{ facts.length - verifiedCount }} éléments restants avant de publier.
            </span>
            <span *ngIf="isPublicationReady" class="text-emerald-700 font-bold">
              ✓ Tous les faits extraits ont été vérifiés par le professionnel.
            </span>
          </p>

          <button
            type="button"
            (click)="proceedToNextStep()"
            [disabled]="!isPublicationReady"
            [ngClass]="isPublicationReady
              ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:opacity-95 text-white shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            class="rounded-full px-6 py-2.5 text-xs font-black transition flex items-center gap-2"
          >
            <span>Passer à l'Étape 04 : Révision des métiers</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE DE CORRECTION D'UN FAIT AVEC TRAÇABILITÉ                   -->
      <!-- ================================================================== -->
      <div
        *ngIf="isCorrectionModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        (click)="closeCorrectionModal()"
      >
        <div
          class="relative w-full max-w-md rounded-[28px] bg-white shadow-2xl p-6 sm:p-7 space-y-5"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between border-b pb-3 border-gray-100">
            <h3 class="font-black text-base text-[#0F1035]">Corriger le fait extrait</h3>
            <button
              type="button"
              (click)="closeCorrectionModal()"
              class="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <div class="space-y-3" *ngIf="factToCorrect">
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-1">Valeur initialement extraite</label>
              <input
                type="text"
                [value]="factToCorrect.value"
                readonly
                class="w-full rounded-xl bg-gray-100 border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-gray-800 mb-1">Valeur corrigée par le conseiller</label>
              <input
                type="text"
                [(ngModel)]="correctedValue"
                class="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-gray-800 mb-1">Justification / Commentaire de révision</label>
              <textarea
                [(ngModel)]="correctionComment"
                rows="2"
                placeholder="Préciser le motif de rectification documentaire..."
                class="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-[#7C3AED]"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              (click)="closeCorrectionModal()"
              class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="applyCorrection()"
              class="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2 text-xs font-black shadow-sm"
            >
              Enregistrer la correction
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CounselorFactReviewComponent implements OnInit {
  @Input() youngName = 'Emma D.';
  @Input() rdvNumber = '2187';
  @Input() counselorName = 'Sarah Dupont';
  @Input() totalPages = 17;
  @Input() reportDate = '07/10/2026';

  @Output() stepChange = new EventEmitter<number>();
  @Output() factsUpdated = new EventEmitter<ReviewableFact[]>();

  currentPdfPage = 4;
  pdfZoom = 100;
  statusFilter: 'ALL' | 'PENDING' | 'VERIFIED' = 'ALL';

  // Liste des 7 faits extraits avec coordonnées et citations
  facts: ReviewableFact[] = [
    {
      id: 'fact-1',
      category: 'RIASEC',
      categoryLabel: 'RIASEC',
      typeLabel: 'Centre d\'intérêt',
      value: 'Artistique',
      pageNumber: 4,
      totalPages: 17,
      rawCitation: 'Les personnes de ce type aiment les activités qui leur permettent de s’exprimer : littérature, peinture, musique, graphisme, sculpture...',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'fact-2',
      category: 'RIASEC',
      categoryLabel: 'RIASEC',
      typeLabel: 'Centre d\'intérêt secondaire',
      value: 'Entreprenant',
      pageNumber: 4,
      totalPages: 17,
      rawCitation: 'Les personnes de ce type aiment influencer, manager, diriger les autres, les convaincre et défendre leurs idées.',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'fact-3',
      category: 'RIASEC',
      categoryLabel: 'RIASEC',
      typeLabel: 'Centre d\'intérêt tertiaire',
      value: 'Réaliste',
      pageNumber: 4,
      totalPages: 17,
      rawCitation: 'Les personnes de ce type aiment les tâches concrètes et manuelles, manipuler des outils, machines et appareils.',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'fact-4',
      category: 'APTITUDES',
      categoryLabel: 'Aptitudes cognitives',
      typeLabel: 'Fonctions psychométriques',
      value: 'Flexibilité & Partage du temps',
      pageNumber: 5,
      totalPages: 17,
      rawCitation: 'Flexibilité des catégories, Partage du temps, Mémorisation de visages et Facilité avec les nombres (Image à un instant T).',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'fact-5',
      category: 'HEXACO',
      categoryLabel: 'Personnalité HEXACO',
      typeLabel: 'Dimensions HEXACO',
      value: 'Émotivité & Ouverture',
      pageNumber: 6,
      totalPages: 17,
      rawCitation: 'Ordre de présentation : 1. Émotivité, 2. Ouvert à l’expérience, 3. Agréabilité, 4. Humilité-honnêteté, 5. Extraversion, 6. Caractère consciencieux.',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'fact-6',
      category: 'METIERS',
      categoryLabel: 'Métiers O*NET',
      typeLabel: 'Zone de préparation 3',
      value: 'Peintre décorateur',
      pageNumber: 7,
      totalPages: 17,
      rawCitation: 'Peintre décorateur — Affinité dominante 92% (Artiste + Réaliste). Activités d\'atelier et de finition.',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'fact-7',
      category: 'METIERS',
      categoryLabel: 'Méthodologie',
      typeLabel: 'Réserve déontologique',
      value: 'Pistes exploratoires',
      pageNumber: 17,
      totalPages: 17,
      rawCitation: 'Ce bilan constitue une aide à la réflexion et à l\'exploration professionnelle, en aucun cas un diagnostic médical ou un choix d\'orientation figé.',
      status: 'PENDING_REVIEW'
    }
  ];

  selectedFact: ReviewableFact | null = null;

  // Modale de correction
  isCorrectionModalOpen = false;
  factToCorrect: ReviewableFact | null = null;
  correctedValue = '';
  correctionComment = '';

  ngOnInit(): void {
    if (this.facts.length > 0) {
      this.selectedFact = this.facts[0];
      this.currentPdfPage = this.selectedFact.pageNumber;
    }
  }

  get verifiedCount(): number {
    return this.facts.filter(f => f.status === 'VERIFIED' || f.status === 'CORRECTED').length;
  }

  get isPublicationReady(): boolean {
    return this.verifiedCount === this.facts.length;
  }

  get filteredFacts(): ReviewableFact[] {
    if (this.statusFilter === 'PENDING') {
      return this.facts.filter(f => f.status === 'PENDING_REVIEW');
    }
    if (this.statusFilter === 'VERIFIED') {
      return this.facts.filter(f => f.status === 'VERIFIED' || f.status === 'CORRECTED');
    }
    return this.facts;
  }

  selectFact(fact: ReviewableFact): void {
    this.selectedFact = fact;
    this.currentPdfPage = fact.pageNumber;
  }

  goToProofPage(fact: ReviewableFact): void {
    this.currentPdfPage = fact.pageNumber;
    this.pdfZoom = 100;
  }

  validateFact(fact: ReviewableFact): void {
    fact.status = 'VERIFIED';
    this.factsUpdated.emit(this.facts);
  }

  openCorrectionModal(fact: ReviewableFact): void {
    this.factToCorrect = fact;
    this.correctedValue = fact.value;
    this.correctionComment = '';
    this.isCorrectionModalOpen = true;
  }

  closeCorrectionModal(): void {
    this.isCorrectionModalOpen = false;
  }

  applyCorrection(): void {
    if (this.factToCorrect) {
      if (!this.factToCorrect.history) this.factToCorrect.history = [];
      this.factToCorrect.history.push({
        date: new Date().toISOString(),
        author: this.counselorName,
        previousValue: this.factToCorrect.value,
        newValue: this.correctedValue,
        comment: this.correctionComment
      });
      this.factToCorrect.value = this.correctedValue;
      this.factToCorrect.status = 'CORRECTED';
      this.factsUpdated.emit(this.facts);
    }
    this.isCorrectionModalOpen = false;
  }

  // Navigation PDF
  prevPdfPage(): void {
    if (this.currentPdfPage > 1) this.currentPdfPage--;
  }

  nextPdfPage(): void {
    if (this.currentPdfPage < this.totalPages) this.currentPdfPage++;
  }

  zoomIn(): void {
    if (this.pdfZoom < 150) this.pdfZoom += 10;
  }

  zoomOut(): void {
    if (this.pdfZoom > 70) this.pdfZoom -= 10;
  }

  downloadOriginalPdf(): void {
    const content = `RAPPORT D'ORIENTATION OFFICIEL DU CENTRE DES POSSIBLES\nDOSSIER : ${this.youngName} (Rdv ${this.rdvNumber})\nTotal pages : ${this.totalPages}\nDate : ${this.reportDate}\n\nDocument source psychométrique archivé sous souveraineté régionale.`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rapport_Original_${this.rdvNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  selectStep(step: number): void {
    this.stepChange.emit(step);
  }

  proceedToNextStep(): void {
    if (this.isPublicationReady) {
      this.stepChange.emit(4); // Passe à l'étape 4 des Métiers
    }
  }
}
