// ============================================================================
// Composant Standalone Angular — Immersion Pro (MonBilan+)
// Conforme à la maquette : Bannière Hero, Stepper 6 étapes horizontal connecté,
// Kit téléchargeable, Recherche partenaires & Ajout libre, Carnet numérique et Bilan
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import {
  IMMERSION_STEPS,
  INITIAL_IMMERSION_PROJECT,
  PARTNER_COMPANIES_DATA,
  UIImmersionProject,
  UIImmersionStep,
  UIPartnerCompany,
  getDefaultActivitiesForCareer,
  getDefaultQuestionsForCareer
} from '../../shared/immersion-data';

@Component({
  selector: 'app-immersion-pro',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- ================================================================== -->
      <!-- 1. BANNIÈRE HÉRO « MON IMMERSION PRO » (Fidèle à la maquette)       -->
      <!-- ================================================================== -->
      <div class="rounded-3xl bg-gradient-to-r from-[#EDE9FE] via-[#E0E7FF] to-[#FAF8FF] border border-[#DDD6FE] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <!-- Décorations lumineuses abstraites -->
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-[#FDE047]/25 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute right-48 -top-10 w-48 h-48 bg-[#38BDF8]/20 rounded-full blur-2xl pointer-events-none"></div>

        <div class="flex items-center gap-5 relative z-10 max-w-2xl">
          <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg shrink-0 ring-4 ring-white/60">
            <mb-icon name="briefcase"></mb-icon>
          </div>
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F1035] tracking-tight">
                Mon immersion pro
              </h2>
              <span class="text-2xl"><mb-icon name="sparkles"></mb-icon></span>
            </div>
            <p class="text-sm sm:text-base text-[#42466B] font-medium leading-relaxed">
              Découvre un métier sur le terrain grâce à un stage d’observation et vis une expérience concrète en entreprise.
            </p>
          </div>
        </div>

        <!-- Visuel illustratif adolescent & rouleau de peinture (Maquette) -->
        <div class="relative z-10 shrink-0 hidden md:flex items-center justify-center">
          <div class="relative group cursor-pointer" (click)="goToStep(2)">
            <div
              aria-hidden="true"
              class="h-28 w-28 rounded-2xl shadow-md border-2 border-white rotate-3 group-hover:rotate-0 transition duration-200 bg-gradient-to-br from-[#EDE9FE] to-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-5xl"
            >
              <mb-icon name="palette"></mb-icon>
            </div>
            <div class="absolute -bottom-2 -left-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[#7C3AED] shadow border border-[#E4E0F5] flex items-center gap-1.5 whitespace-nowrap">
              <span><mb-icon name="palette"></mb-icon></span>
              <span>{{ project.careerTitle }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 2. STEPPER CONNECTÉ EN 6 ÉTAPES (Fidèle à la maquette)              -->
      <!-- ================================================================== -->
      <div class="rounded-3xl bg-white border border-[#E4E0F5] p-4 sm:p-5 shadow-sm overflow-x-auto">
        <div class="min-w-[700px] flex items-center justify-between relative px-2 sm:px-6">
          <!-- Ligne de progression arrière-plan -->
          <div class="absolute left-10 right-10 top-6 h-0.5 bg-[#E4E0F5] -z-0"></div>
          <!-- Ligne active violette -->
          <div
            class="absolute left-10 top-6 h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] -z-0 transition-all duration-300"
            [style.width.%]="((project.currentStep - 1) / 5) * 85"
          ></div>

          <!-- Étape 1 à 6 -->
          <div
            *ngFor="let s of steps"
            (click)="goToStep(s.number)"
            class="flex flex-col items-center relative z-10 cursor-pointer group"
          >
            <!-- Badge cercle / pilule -->
            <div
              [class]="project.currentStep === s.number
                ? 'bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white shadow-lg ring-4 ring-[#EDE9FE] scale-105 px-3 py-1.5 rounded-full'
                : (s.number < project.currentStep
                  ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-500 rounded-full h-10 w-10 sm:h-11 sm:w-11'
                  : 'bg-white text-[#6B7280] border-2 border-[#E4E0F5] rounded-full h-10 w-10 sm:h-11 sm:w-11 group-hover:border-[#7C3AED] group-hover:text-[#7C3AED]')"
              class="flex items-center justify-center transition"
            >
              <div class="flex items-center gap-1 text-xs font-black">
                <span class="text-sm" [ngSwitch]="s.number">
                  <span *ngSwitchCase="1"><mb-icon name="glasses"></mb-icon></span>
                  <span *ngSwitchCase="2"><mb-icon name="calendar"></mb-icon></span>
                  <span *ngSwitchCase="3"><mb-icon name="building-2"></mb-icon></span>
                  <span *ngSwitchCase="4"><mb-icon name="plane"></mb-icon></span>
                  <span *ngSwitchCase="5"><mb-icon name="hard-hat"></mb-icon></span>
                  <span *ngSwitchCase="6"><mb-icon name="square-check"></mb-icon></span>
                </span>
                <span *ngIf="s.number < project.currentStep && project.currentStep !== s.number" class="text-xs text-emerald-600 font-bold">✓</span>
                <span *ngIf="project.currentStep === s.number" class="text-xs font-black ml-0.5">{{ s.number }}</span>
              </div>
            </div>

            <!-- Libellé de l'étape -->
            <span
              [class]="project.currentStep === s.number
                ? 'text-[#7C3AED] font-black'
                : 'text-[#42466B] font-semibold group-hover:text-[#7C3AED]'"
              class="text-[11px] sm:text-xs text-center mt-2 max-w-[100px] leading-tight block"
            >
              {{ s.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- 3. CONTENU SELON L'ÉTAPE ACTIVE DU PARCOURS IMMERSION              -->
      <!-- ================================================================== -->

      <!-- ------------------------------------------------------------------ -->
      <!-- ÉTAPE 1 : JE DÉCOUVRE LE MÉTIER (Catalogue des 22 métiers Rdv 2187)-->
      <!-- ------------------------------------------------------------------ -->
      <div *ngIf="project.currentStep === 1" class="space-y-6">
        <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-black text-[#0F1035]">1. Choisis un métier parmi ton bilan d'orientation</h3>
            <p class="text-xs text-[#6B7280]">
              Ces 22 pistes proviennent des pages 8 à 16 de ton rapport Rdv 2187 validé par le Centre des Possibles.
            </p>
          </div>
          <!-- Recherche rapide -->
          <div class="w-full md:w-72">
            <input
              type="text"
              [(ngModel)]="searchCareerTerm"
              placeholder="Rechercher un métier..."
              class="w-full rounded-full border border-[#D8DCF0] px-4 py-2 text-xs font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>
        </div>

        <!-- Grille des 22 métiers -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div
            *ngFor="let c of filteredCareers"
            class="rounded-3xl bg-white border border-[#E4E0F5] hover:border-[#7C3AED]/40 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2">
                <span class="rounded-full px-2.5 py-0.5 text-[11px] font-bold" [ngClass]="c.sectorColor">
                  {{ c.sectorTag }}
                </span>
                <span class="text-[11px] font-semibold text-[#6B7280]">p. {{ c.pageNumber }}</span>
              </div>
              <div class="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  class="h-16 w-16 rounded-2xl shrink-0 border border-[#E4E0F5] bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-3xl"
                >
                  <mb-icon name="briefcase"></mb-icon>
                </div>
                <div>
                  <h4 class="text-base font-black text-[#0F1035] leading-snug">{{ c.titleFr }}</h4>
                  <p class="text-xs text-[#6B7280] font-medium mt-0.5">Zone {{ c.jobZone }} • {{ c.educationLevel }}</p>
                </div>
              </div>
              <p class="text-xs text-[#42466B] leading-relaxed line-clamp-2">{{ c.shortSummary }}</p>
            </div>

            <div class="flex items-center justify-between gap-2 pt-2 border-t border-[#F0EDFA]">
              <button
                type="button"
                (click)="toggleFavorite(c)"
                [class]="c.isFavorite ? 'text-rose-500' : 'text-gray-300 hover:text-rose-400'"
                class="text-xl p-1 shrink-0"
                title="Favori"
              >
                <mb-icon [name]="'heart'" [filled]="!!(c.isFavorite)"></mb-icon>
              </button>
              <button
                type="button"
                (click)="viewDetail.emit(c)"
                class="rounded-full bg-[#F3EFFE] text-[#7C3AED] hover:bg-[#E9D5FF] py-2 px-3 text-xs font-extrabold transition shrink-0"
                title="Consulter la fiche détaillée du métier"
              >
                <mb-icon name="search"></mb-icon> Fiche
              </button>
              <button
                type="button"
                (click)="selectCareerForImmersion(c)"
                class="flex-1 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white py-2 px-3 text-xs font-extrabold hover:opacity-95 shadow-sm transition text-center truncate"
              >
                Découvrir sur le terrain →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ------------------------------------------------------------------ -->
      <!-- ÉTAPE 2 : JE PRÉPARE MON IMMERSION (Conforme à la maquette !)       -->
      <!-- ------------------------------------------------------------------ -->
      <div *ngIf="project.currentStep === 2" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Colonne Gauche : Préparer mon immersion pour [Métier] (5 colonnes) -->
        <div class="lg:col-span-5 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-6">
          <!-- En-tête avec vignette du rouleau de peinture -->
          <div class="flex items-center gap-3.5 pb-4 border-b border-[#F0EDFA]">
            <div
              aria-hidden="true"
              class="h-14 w-14 rounded-2xl shadow-sm border border-[#E4E0F5] shrink-0 bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-3xl"
            >
              <mb-icon name="briefcase"></mb-icon>
            </div>
            <div>
              <span class="text-xs font-semibold text-[#6B7280] block">Préparer mon immersion pour</span>
              <h3 class="text-xl sm:text-2xl font-black text-[#0F1035] leading-tight">
                {{ project.careerTitle }}
              </h3>
            </div>
          </div>

          <!-- Section 1 : Les activités à observer -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg"><mb-icon name="clipboard-list"></mb-icon></span>
                <h4 class="text-sm font-black text-[#0F1035]">Les activités à observer</h4>
              </div>
              <span class="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
            </div>
            <p class="text-xs text-[#6B7280]">Préparation des surfaces, application des peintures, choix des couleurs...</p>
            <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3 space-y-2">
              <div *ngFor="let act of project.observationActivities; let i = index" class="flex items-start gap-2 text-xs text-[#42466B]">
                <span class="text-[#7C3AED] font-bold">•</span>
                <span>{{ act }}</span>
              </div>
              <div *ngFor="let custom of project.customActivities" class="flex items-start gap-2 text-xs text-[#7C3AED] font-semibold">
                <span>★</span>
                <span>{{ custom }}</span>
              </div>
              <!-- Ajout rapide -->
              <div class="flex gap-2 pt-1">
                <input
                  type="text"
                  [(ngModel)]="newActivityInput"
                  placeholder="Ajouter une idée d'activité à observer..."
                  class="flex-1 rounded-xl border border-[#D8DCF0] px-3 py-1.5 text-xs text-[#0F1035] bg-white focus:outline-none"
                />
                <button
                  type="button"
                  (click)="addActivity()"
                  class="rounded-xl bg-[#7C3AED] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#6D28D9]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- Bouton Continuer -->
          <button
            type="button"
            (click)="goToStep(3)"
            class="w-full rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white py-3.5 px-6 text-sm font-extrabold hover:opacity-95 shadow-md transition text-center cursor-pointer"
          >
            Continuer : trouver une entreprise →
          </button>
        </div>

        <!-- Colonne Centrale : « Mon kit d'immersion » (4 colonnes) -->
        <div class="lg:col-span-4 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="flex items-center gap-2.5 pb-3 border-b border-[#F0EDFA]">
            <span class="text-2xl"><mb-icon name="package"></mb-icon></span>
            <div>
              <h3 class="text-lg font-black text-[#0F1035]">Mon kit d'immersion</h3>
              <p class="text-xs text-[#6B7280]">Documents prêts pour ton stage</p>
            </div>
          </div>

          <!-- Item 1 : Fiche de préparation -->
          <div class="rounded-2xl border border-[#E4E0F5] hover:border-[#7C3AED]/50 p-4 transition flex items-center justify-between gap-3 bg-[#FAF8FF]">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xs font-black shrink-0">
                PDF
              </div>
              <div>
                <h4 class="text-xs sm:text-sm font-black text-[#0F1035]">Fiche de préparation</h4>
                <p class="text-[11px] text-[#6B7280]">(à télécharger)</p>
              </div>
            </div>
            <button
              type="button"
              (click)="downloadDoc('PREP')"
              class="h-9 w-9 rounded-full bg-white border border-[#D8DCF0] hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] text-[#6D28D9] flex items-center justify-center font-bold text-sm transition shadow-xs"
              title="Télécharger la fiche de préparation"
            >
              ↓
            </button>
          </div>

          <!-- Item 2 : Carnet d'observation -->
          <div class="rounded-2xl border border-[#E4E0F5] hover:border-[#7C3AED]/50 p-4 transition flex items-center justify-between gap-3 bg-[#FAF8FF]">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-base shrink-0">
                <mb-icon name="notebook"></mb-icon>
              </div>
              <div>
                <h4 class="text-xs sm:text-sm font-black text-[#0F1035]">Carnet d'observation</h4>
                <p class="text-[11px] text-[#6B7280]">(pendant l'immersion)</p>
              </div>
            </div>
            <button
              type="button"
              (click)="downloadDoc('JOURNAL')"
              class="h-9 w-9 rounded-full bg-white border border-[#D8DCF0] hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] text-[#6D28D9] flex items-center justify-center font-bold text-sm transition shadow-xs"
              title="Télécharger le carnet d'observation"
            >
              ↓
            </button>
          </div>

          <!-- Item 3 : Exemple de message de contact -->
          <div class="rounded-2xl border border-[#E4E0F5] hover:border-[#7C3AED]/50 p-4 transition flex items-center justify-between gap-3 bg-[#FAF8FF]">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-base shrink-0">
                <mb-icon name="message-circle"></mb-icon>
              </div>
              <div>
                <h4 class="text-xs sm:text-sm font-black text-[#0F1035]">Exemple de message de contact</h4>
                <p class="text-[11px] text-[#6B7280]">(pour l'entreprise)</p>
              </div>
            </div>
            <button
              type="button"
              (click)="downloadDoc('MESSAGE')"
              class="h-9 w-9 rounded-full bg-white border border-[#D8DCF0] hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] text-[#6D28D9] flex items-center justify-center font-bold text-sm transition shadow-xs"
              title="Télécharger l'exemple de message"
            >
              ↓
            </button>
          </div>

          <!-- Notification téléchargement -->
          <div *ngIf="downloadNotification" class="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <span>✓</span>
            <span>{{ downloadNotification }}</span>
          </div>
        </div>

        <!-- Colonne Droite : « Mon objectif » (3 colonnes) -->
        <div class="lg:col-span-3 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="flex items-center gap-2 pb-3 border-b border-[#F0EDFA]">
            <span class="text-2xl"><mb-icon name="target"></mb-icon></span>
            <h3 class="text-lg font-black text-[#0F1035]">Mon objectif</h3>
          </div>

          <p class="text-sm text-[#42466B] leading-relaxed font-medium">
            Vivre une première expérience pour mieux comprendre le métier et en parler avec mon conseiller.
          </p>

          <!-- Illustration Checklist avec crayon (Fidèle à la maquette) -->
          <div class="rounded-2xl bg-gradient-to-br from-[#FAF8FF] to-[#F3EFFE] border border-[#E4E0F5] p-4 text-center space-y-3">
            <div class="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-white shadow-sm border border-[#DDD6FE]">
              <span class="text-4xl"><mb-icon name="clipboard-list"></mb-icon></span>
            </div>
            <div class="space-y-1 text-left text-xs">
              <div class="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span>✓</span>
                <span>Découvrir sans pression</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span>✓</span>
                <span>Poser des questions réelles</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span>✓</span>
                <span>Bâtir mon parcours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ------------------------------------------------------------------ -->
      <!-- ÉTAPE 3 : JE TROUVE UNE ENTREPRISE (Partenaires Nice & Ajout libre) -->
      <!-- ------------------------------------------------------------------ -->
      <div *ngIf="project.currentStep === 3" class="space-y-6">
        <div class="rounded-3xl bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-xl font-black text-[#0F1035]">3. Choisis une entreprise pour ton stage d'observation</h3>
              <p class="text-xs text-[#6B7280]">
                Réseau d'entreprises partenaires du Centre des Possibles et de la Métropole Nice Côte d'Azur.
              </p>
            </div>
            <button
              type="button"
              (click)="showAddCompanyModal = true"
              class="rounded-full bg-white border-2 border-[#7C3AED] text-[#6D28D9] px-4 py-2 text-xs font-black hover:bg-[#F3EFFE] transition shrink-0"
            >
              + Renseigner une autre entreprise
            </button>
          </div>

          <!-- Liste des partenaires -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              *ngFor="let comp of partnerCompanies"
              class="rounded-2xl border p-4 transition space-y-3"
              [class]="project.selectedCompany?.id === comp.id ? 'border-2 border-[#7C3AED] bg-purple-50/50 shadow-sm' : 'border-[#E4E0F5] bg-white hover:border-[#7C3AED]/40'"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="text-sm font-black text-[#0F1035]">{{ comp.name }}</h4>
                    <span *ngIf="comp.verifiedPartner" class="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                      ✓ Partenaire vérifié
                    </span>
                  </div>
                  <p class="text-xs text-[#6B7280] mt-0.5">{{ comp.sector }} • {{ comp.city }} ({{ comp.distanceKm }} km)</p>
                </div>
              </div>
              <p class="text-xs text-[#42466B] leading-relaxed">{{ comp.description }}</p>
              <div class="flex items-center justify-between pt-2 border-t border-[#F0EDFA]">
                <span class="text-[11px] text-[#6D28D9] font-bold">Métiers : {{ comp.careersOffered.join(', ') }}</span>
                <button
                  type="button"
                  (click)="chooseCompany(comp)"
                  class="rounded-full bg-[#7C3AED] text-white px-4 py-1.5 text-xs font-extrabold hover:bg-[#6D28D9] shadow-xs transition"
                >
                  Sélectionner cette entreprise →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ------------------------------------------------------------------ -->
      <!-- ÉTAPE 4 : JE FAIS MA DEMANDE (Assistant de message personnalisé)   -->
      <!-- ------------------------------------------------------------------ -->
      <div *ngIf="project.currentStep === 4" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-8 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="pb-3 border-b border-[#F0EDFA] flex items-center justify-between">
            <div>
              <h3 class="text-xl font-black text-[#0F1035]">4. Personnalise ta demande de stage</h3>
              <p class="text-xs text-[#6B7280]">
                Destinataire : <strong>{{ project.selectedCompany?.name || 'Entreprise sélectionnée' }}</strong>
              </p>
            </div>
            <span class="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 text-xs font-bold">
              Statut : {{ project.applicationDraft.status }}
            </span>
          </div>

          <!-- Objet -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-[#0F1035]">Objet de l'email ou du courrier :</label>
            <input
              type="text"
              [(ngModel)]="project.applicationDraft.object"
              class="w-full rounded-xl border border-[#D8DCF0] px-3.5 py-2 text-xs font-bold text-[#0F1035] bg-[#FAF8FF] focus:outline-none"
            />
          </div>

          <!-- Message -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-[#0F1035]">Message à envoyer :</label>
            <textarea
              rows="8"
              [(ngModel)]="project.applicationDraft.body"
              class="w-full rounded-2xl border border-[#D8DCF0] p-4 text-xs sm:text-[13px] text-[#0F1035] font-medium leading-relaxed bg-[#FAF8FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            ></textarea>
          </div>

          <!-- Option validation conseiller -->
          <label class="flex items-center gap-2.5 text-xs text-[#42466B] font-semibold cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="project.applicationDraft.counselorHelpRequested"
              class="rounded text-[#7C3AED]"
            />
            <span>Demander la relecture et les conseils de mon conseiller avant transmission</span>
          </label>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EDFA]">
            <button
              type="button"
              (click)="saveDraft()"
              class="rounded-full bg-white border border-[#D8DCF0] text-[#0F1035] px-4 py-2 text-xs font-extrabold hover:bg-[#F3EFFE]"
            >
              <mb-icon name="save"></mb-icon> Enregistrer le brouillon
            </button>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="downloadDoc('MESSAGE')"
                class="rounded-full border border-[#7C3AED] text-[#7C3AED] px-4 py-2 text-xs font-bold hover:bg-[#F3EFFE]"
              >
                <mb-icon name="file-text"></mb-icon> Télécharger la lettre
              </button>
              <button
                type="button"
                (click)="goToStep(5)"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-5 py-2 text-xs font-extrabold shadow hover:opacity-95"
              >
                Valider et passer à l'immersion →
              </button>
            </div>
          </div>
        </div>

        <!-- Guide & Conseils -->
        <div class="lg:col-span-4 rounded-[26px] bg-[#FAF8FF] border border-[#E4E0F5] p-5 space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-xl"><mb-icon name="lightbulb"></mb-icon></span>
            <h4 class="text-sm font-black text-[#0F1035]">Conseils de ton conseiller</h4>
          </div>
          <p class="text-xs text-[#42466B] leading-relaxed">
            Un professionnel apprécie la clarté et la politesse. Explique que tu es dans une démarche de découverte accompagnée par le Centre des Possibles.
          </p>
          <div class="rounded-xl bg-white border border-[#E4E0F5] p-3 text-xs space-y-1.5">
            <p class="font-bold text-[#7C3AED]">Convention de stage :</p>
            <p class="text-[#6B7280]">Ton conseiller peut t'aider à éditer ta convention tripartite avant le premier jour.</p>
          </div>
        </div>
      </div>

      <!-- ------------------------------------------------------------------ -->
      <!-- ÉTAPE 5 : JE VIS MON IMMERSION (Carnet de terrain mobile-first)    -->
      <!-- ------------------------------------------------------------------ -->
      <div *ngIf="project.currentStep === 5" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-8 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="pb-3 border-b border-[#F0EDFA] flex items-center justify-between">
            <div>
              <h3 class="text-xl font-black text-[#0F1035]">5. Mon carnet d'observation sur le terrain</h3>
              <p class="text-xs text-[#6B7280]">
                Note ce que tu découvres au fur et à mesure de tes journées chez <strong>{{ project.selectedCompany?.name }}</strong>.
              </p>
            </div>
            <span class="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold">
              Immersion en cours
            </span>
          </div>

          <!-- Saisie d'une nouvelle note -->
          <div class="rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] p-4 space-y-3.5">
            <h4 class="text-xs font-black uppercase tracking-wider text-[#7C3AED]">Ajouter une observation du jour</h4>
            <div class="space-y-1">
              <label class="text-xs font-bold text-[#0F1035]">Aujourd'hui, j'ai découvert…</label>
              <input
                type="text"
                [(ngModel)]="newJournalDiscovered"
                placeholder="Ex: Le ponçage des moulures, le mélange des pigments..."
                class="w-full rounded-xl border border-[#D8DCF0] px-3.5 py-2 text-xs text-[#0F1035] bg-white focus:outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-[#0F1035]">Ce qui m'a surpris…</label>
              <input
                type="text"
                [(ngModel)]="newJournalSurprised"
                placeholder="Ex: La rapidité du geste, le matériel nécessaire..."
                class="w-full rounded-xl border border-[#D8DCF0] px-3.5 py-2 text-xs text-[#0F1035] bg-white focus:outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-[#0F1035]">Une question que j'aimerais poser…</label>
              <input
                type="text"
                [(ngModel)]="newJournalQuestion"
                placeholder="Ex: Combien d'années pour ouvrir son atelier ?"
                class="w-full rounded-xl border border-[#D8DCF0] px-3.5 py-2 text-xs text-[#0F1035] bg-white focus:outline-none"
              />
            </div>
            <button
              type="button"
              (click)="saveJournalEntry()"
              class="rounded-full bg-[#7C3AED] text-white px-5 py-2 text-xs font-bold hover:bg-[#6D28D9] shadow-xs"
            >
              + Enregistrer cette note
            </button>
          </div>

          <!-- Historique des notes -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase tracking-wider text-[#42466B]">Mes notes enregistrées</h4>
            <div *ngFor="let item of project.journalEntries" class="rounded-2xl border border-[#E4E0F5] p-4 space-y-2 bg-white">
              <div class="flex items-center justify-between text-xs font-bold text-[#7C3AED]">
                <span>{{ item.date }}</span>
                <span class="text-[#6B7280]">Jour {{ item.dayNumber }}</span>
              </div>
              <p *ngIf="item.discovered" class="text-xs text-[#0F1035]">
                <strong>Découverte :</strong> {{ item.discovered }}
              </p>
              <p *ngIf="item.surprised" class="text-xs text-[#42466B]">
                <strong>Surprise :</strong> {{ item.surprised }}
              </p>
              <p *ngIf="item.question" class="text-xs text-[#6D28D9]">
                <strong>Question :</strong> {{ item.question }}
              </p>
            </div>
          </div>

          <div class="pt-3 border-t border-[#F0EDFA] flex justify-end">
            <button
              type="button"
              (click)="goToStep(6)"
              class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-6 py-2.5 text-xs sm:text-sm font-extrabold shadow"
            >
              Passer au bilan final →
            </button>
          </div>
        </div>

        <div class="lg:col-span-4 rounded-[26px] bg-[#FAF8FF] border border-[#E4E0F5] p-5 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-[#7C3AED]">Rappel de tes questions</h4>
          <div class="space-y-2">
            <div *ngFor="let q of project.preparedQuestions" class="rounded-xl bg-white border border-[#E4E0F5] p-3 text-xs text-[#42466B]">
              {{ q }}
            </div>
          </div>
        </div>
      </div>

      <!-- ------------------------------------------------------------------ -->
      <!-- ÉTAPE 6 : JE FAIS LE BILAN (Questionnaire bienveillant & Partage)   -->
      <!-- ------------------------------------------------------------------ -->
      <div *ngIf="project.currentStep === 6" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-8 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
          <div class="pb-3 border-b border-[#F0EDFA]">
            <h3 class="text-xl font-black text-[#0F1035]">6. Le bilan de mon immersion</h3>
            <p class="text-xs text-[#6B7280]">
              Partage ton ressenti en quelques mots. Aucun score, juste ton avis sincère pour construire la suite.
            </p>
          </div>

          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-[#0F1035]">1. Qu'as-tu découvert concrètement ?</label>
              <textarea
                rows="2"
                [(ngModel)]="project.review.discoveredSynthesis"
                class="w-full rounded-xl border border-[#D8DCF0] p-3 text-xs bg-[#FAF8FF] focus:outline-none"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-[#0F1035]">2. Qu'est-ce qui t'a le plus plu ?</label>
              <textarea
                rows="2"
                [(ngModel)]="project.review.liked"
                class="w-full rounded-xl border border-[#D8DCF0] p-3 text-xs bg-[#FAF8FF] focus:outline-none"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-[#0F1035]">3. Qu'est-ce qui t'a moins plu ou paru difficile ?</label>
              <textarea
                rows="2"
                [(ngModel)]="project.review.disliked"
                class="w-full rounded-xl border border-[#D8DCF0] p-3 text-xs bg-[#FAF8FF] focus:outline-none"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-[#0F1035]">4. Souhaites-tu approfondir ce métier ?</label>
              <div class="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  (click)="project.review.wantToPursue = true"
                  [class]="project.review.wantToPursue ? 'bg-emerald-600 text-white shadow' : 'bg-white border text-[#42466B]'"
                  class="rounded-full px-4 py-1.5 text-xs font-bold transition"
                >
                  Oui, ça confirme mon projet !
                </button>
                <button
                  type="button"
                  (click)="project.review.wantToPursue = false"
                  [class]="!project.review.wantToPursue ? 'bg-[#7C3AED] text-white shadow' : 'bg-white border text-[#42466B]'"
                  class="rounded-full px-4 py-1.5 text-xs font-bold transition"
                >
                  Je préfère explorer une autre piste
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-[#0F1035]">5. Qu'aimerais-tu débriefer avec ton conseiller ?</label>
              <textarea
                rows="2"
                [(ngModel)]="project.review.questionsForCounselor"
                class="w-full rounded-xl border border-[#D8DCF0] p-3 text-xs bg-[#FAF8FF] focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-[#F0EDFA] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              (click)="downloadDoc('REVIEW')"
              class="rounded-full border border-[#7C3AED] text-[#7C3AED] px-4 py-2 text-xs font-bold hover:bg-[#F3EFFE]"
            >
              <mb-icon name="file-text"></mb-icon> Télécharger le bilan (PDF)
            </button>
            <button
              type="button"
              (click)="shareReviewWithCounselor()"
              class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-6 py-2.5 text-xs font-black shadow hover:opacity-95"
            >
              Partager ce bilan avec mon conseiller →
            </button>
          </div>

          <div *ngIf="isSharedSuccess" class="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <span>✓</span>
            <span>Ton bilan a été partagé avec Sophie V. (Centre des Possibles). Il sera abordé lors de votre prochain point !</span>
          </div>
        </div>

        <!-- Récapitulatif -->
        <div class="lg:col-span-4 rounded-[26px] bg-[#FAF8FF] border border-[#E4E0F5] p-5 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-[#7C3AED]">Synthèse de ton immersion</h4>
          <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 space-y-2 text-xs">
            <p><strong>Métier :</strong> {{ project.careerTitle }}</p>
            <p><strong>Entreprise :</strong> {{ project.selectedCompany?.name }}</p>
            <p><strong>Période :</strong> {{ project.targetPeriod }}</p>
            <p><strong>Notes prises :</strong> {{ project.journalEntries.length }} observation(s)</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImmersionProComponent implements OnInit {
  @Input() careers: any[] = [];
  @Input() careerAssessments: any[] = [];
  @Input() project: UIImmersionProject = JSON.parse(JSON.stringify(INITIAL_IMMERSION_PROJECT));
  @Output() careerSelected = new EventEmitter<any>();
  @Output() viewDetail = new EventEmitter<any>();

  steps: UIImmersionStep[] = IMMERSION_STEPS;
  partnerCompanies: UIPartnerCompany[] = PARTNER_COMPANIES_DATA;

  searchCareerTerm = '';
  newActivityInput = '';
  newQuestionInput = '';
  newJournalDiscovered = '';
  newJournalSurprised = '';
  newJournalQuestion = '';
  downloadNotification: string | null = null;
  isSharedSuccess = false;
  showAddCompanyModal = false;

  ngOnInit(): void {
    // Si aucun métier initial, prendre Peintre décorateur
    if (!this.project.careerTitle) {
      this.project.careerTitle = 'Peintre décorateur';
      this.project.careerImage = 'assets/visuals/career-peintre.png';
    }
  }

  get filteredCareers(): any[] {
    if (!this.searchCareerTerm.trim()) {
      return this.careers;
    }
    const q = this.searchCareerTerm.toLowerCase().trim();
    return this.careers.filter((c) => c.titleFr.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }

  goToStep(stepNumber: number): void {
    this.project.currentStep = stepNumber;
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  toggleFavorite(career: any): void {
    career.isFavorite = !career.isFavorite;
  }

  selectCareerForImmersion(career: any): void {
    this.project.careerId = career.id;
    this.project.careerTitle = career.titleFr;
    this.project.careerZone = career.jobZone;
    this.project.careerPage = career.pageNumber;
    this.project.careerImage = career.imageUrl;
    this.project.observationActivities = getDefaultActivitiesForCareer(career.titleFr);
    this.project.preparedQuestions = getDefaultQuestionsForCareer(career.titleFr);
    this.project.currentStep = 2;
    this.careerSelected.emit(career);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  addActivity(): void {
    if (this.newActivityInput.trim()) {
      this.project.customActivities.push(this.newActivityInput.trim());
      this.newActivityInput = '';
    }
  }

  addQuestion(): void {
    if (this.newQuestionInput.trim()) {
      this.project.customQuestions.push(this.newQuestionInput.trim());
      this.newQuestionInput = '';
    }
  }

  chooseCompany(company: UIPartnerCompany): void {
    this.project.selectedCompany = company;
    this.project.applicationDraft.object = `Demande de stage d'observation — ${this.project.careerTitle}`;
    this.project.applicationDraft.body = `Bonjour,\n\nJe m'appelle Emma D. et je suis accompagnée par le Centre des Possibles au Hub de l'Innovation à Nice.\n\nDans le cadre de mon projet d'orientation, je souhaite découvrir le métier de ${this.project.careerTitle} sur le terrain au sein de votre établissement (${company.name}).\n\nSerait-il envisageable pour vous de m'accueillir pour un stage d'observation conventionné de 1 à 3 jours ?\n\nBien cordialement,\nEmma D. (Dossier Rdv 2187)`;
    this.goToStep(4);
  }

  saveDraft(): void {
    this.project.applicationDraft.status = 'READY';
    this.downloadNotification = 'Brouillon de demande sauvegardé avec succès.';
    setTimeout(() => (this.downloadNotification = null), 3000);
  }

  saveJournalEntry(): void {
    if (!this.newJournalDiscovered && !this.newJournalSurprised && !this.newJournalQuestion) {
      return;
    }
    const newEntry = {
      id: `j-${Date.now()}`,
      dayNumber: this.project.journalEntries.length + 1,
      date: `Jour ${this.project.journalEntries.length + 1}`,
      discovered: this.newJournalDiscovered,
      surprised: this.newJournalSurprised,
      question: this.newJournalQuestion
    };
    this.project.journalEntries.unshift(newEntry);
    this.newJournalDiscovered = '';
    this.newJournalSurprised = '';
    this.newJournalQuestion = '';
  }

  shareReviewWithCounselor(): void {
    this.project.review.isSharedWithCounselor = true;
    this.isSharedSuccess = true;
    setTimeout(() => (this.isSharedSuccess = false), 5000);
  }

  downloadDoc(type: 'PREP' | 'JOURNAL' | 'MESSAGE' | 'REVIEW'): void {
    let filename = '';
    let content = '';

    if (type === 'PREP') {
      filename = `fiche-preparation-${this.sanitize(this.project.careerTitle)}.txt`;
      content = `=================================================================\nFICHE DE PRÉPARATION D'IMMERSION PROFESSIONNELLE — MONBILAN+\nDossier Rdv 2187 — Centre des Possibles (Nice)\n=================================================================\n\nMétier : ${this.project.careerTitle}\nZone de formation : Zone ${this.project.careerZone} (Rapport p. ${this.project.careerPage})\nCandidat : Emma D. (16 ans)\n\n--- 1. ACTIVITÉS CONCRÈTES À OBSERVER ---\n${this.project.observationActivities.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n${this.project.customActivities.map((a) => `• [Note perso] ${a}`).join('\n')}\n\n--- 2. QUESTIONS À POSER AU PROFESSIONNEL ---\n${this.project.preparedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n${this.project.customQuestions.map((q) => `• [Question perso] ${q}`).join('\n')}\n\n--- 3. CADRE LÉGAL & CONVENTION ---\n• Stage d'observation (1 à 5 jours)\n• Convention délivrée par le Centre des Possibles\n• Assurance responsabilité civile et scolaire requise\n`;
    } else if (type === 'JOURNAL') {
      filename = `carnet-observation-${this.sanitize(this.project.careerTitle)}.txt`;
      content = `=================================================================\nCARNET D'OBSERVATION SUR LE TERRAIN — MONBILAN+\nStage d'immersion : ${this.project.careerTitle}\nStructure : ${this.project.selectedCompany?.name || 'Entreprise'}\n=================================================================\n\n${this.project.journalEntries.map((e) => `[${e.date} — Jour ${e.dayNumber}]\n- Découvert : ${e.discovered || 'Non renseigné'}\n- Surpris : ${e.surprised || 'Non renseigné'}\n- Question en suspens : ${e.question || 'Non renseigné'}\n`).join('\n-----------------------------------------------------------------\n')}\n`;
    } else if (type === 'MESSAGE') {
      filename = `demande-immersion-${this.sanitize(this.project.careerTitle)}.txt`;
      content = `${this.project.applicationDraft.object}\n\n${this.project.applicationDraft.body}\n`;
    } else {
      filename = `bilan-immersion-${this.sanitize(this.project.careerTitle)}.txt`;
      content = `=================================================================\nBILAN DE STAGE D'IMMERSION — MONBILAN+\nMétier : ${this.project.careerTitle}\nStructure : ${this.project.selectedCompany?.name || 'Entreprise'}\nJeune : Emma D. — Dossier Rdv 2187\n=================================================================\n\n1. Ce qui a été découvert :\n${this.project.review.discoveredSynthesis}\n\n2. Ce qui a le plus plu :\n${this.project.review.liked}\n\n3. Ce qui a moins plu ou paru difficile :\n${this.project.review.disliked}\n\n4. Souhait de poursuivre dans cette voie :\n${this.project.review.wantToPursue ? 'OUI, piste confirmée' : 'NON, préférence pour une autre piste'}\n\n5. Questions pour le conseiller d'orientation :\n${this.project.review.questionsForCounselor}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    this.downloadNotification = `Téléchargement lancé : ${filename}`;
    setTimeout(() => (this.downloadNotification = null), 3500);
  }

  private sanitize(str: string): string {
    return (str || 'metier').toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
}
