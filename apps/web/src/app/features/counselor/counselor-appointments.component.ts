import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';

export type AppointmentStatus = 'CONFIRMED' | 'PLANNED' | 'COMPLETED' | 'TO_CONFIRM' | 'CANCELLED' | 'ABSENT';
export type AppointmentModality = 'IN_PERSON' | 'PHONE' | 'VIDEO';

export interface AppointmentItem {
  id: string;
  youngName: string;
  youngAge: string;
  dossierRef: string;
  avatarUrl?: string;
  title: string;
  motif: string;
  objectives: string[];
  date: string; // YYYY-MM-DD
  dayLabel: string; // 'Lun 16', 'Mer 18'...
  startHour: string; // '14:00'
  endHour: string; // '15:00'
  durationLabel: string; // '1 h'
  modality: AppointmentModality;
  location: string;
  status: AppointmentStatus;
  statusLabel: string;
  preparation: {
    checklist: { id: string; label: string; checked: boolean }[];
    privateNotes: string;
  };
  report: {
    topicsDiscussed: string[];
    observations: string;
    decisions: string[];
    sharedSummary: string;
    isPublishedToYoung: boolean;
  };
  actions: {
    id: string;
    title: string;
    assignee: 'YOUNG' | 'COUNSELOR';
    dueDate?: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  }[];
}

export interface YouthFollowUpItem {
  id: string;
  youngName: string;
  avatarUrl?: string;
  dossierRef: string;
  situation: string;
  situationBadgeClass: string;
  situationIcon: string;
  nextAction: string;
  nextActionIcon: string;
  dueDate?: string;
}

@Component({
  selector: 'app-counselor-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, MbIconComponent],
  template: `
    <div class="space-y-6 pb-12">
      <!-- ================================================================== -->
      <!-- EN-TÊTE : SUIVI & RENDEZ-VOUS + BOUTON NOUVEAU RENDEZ-VOUS        -->
      <!-- ================================================================== -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] text-[#7C3AED] flex items-center justify-center text-2xl shadow-xs shrink-0">
            <mb-icon name="calendar"></mb-icon>
          </div>
          <div>
            <h2 class="text-2xl font-black text-[#0F1035] tracking-tight">Suivi &amp; rendez-vous</h2>
            <p class="text-xs sm:text-sm text-[#42466B]">
              Organisez vos entretiens et accompagnez chaque jeune dans son parcours.
            </p>
          </div>
        </div>

        <button
          type="button"
          (click)="openNewAppointmentModal()"
          class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#541fd0] hover:to-[#8228d6] text-white px-6 py-3 text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <span class="text-base font-bold">+</span>
          <span>Nouveau rendez-vous</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- 4 CARTES KPI DE PILOTAGE (Fidèle à la maquette)                     -->
      <!-- ================================================================== -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. À venir -->
        <button
          type="button"
          (click)="filterByKpi('UPCOMING')"
          class="rounded-[22px] bg-white border border-[#E4E0F5] hover:border-purple-300 p-4 sm:p-5 shadow-xs transition text-left flex items-center gap-4 cursor-pointer"
        >
          <div class="h-11 w-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
            <mb-icon name="calendar"></mb-icon>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-[#0F1035] block leading-none">6</span>
            <span class="text-xs font-bold text-[#42466B] mt-1 block">À venir</span>
          </div>
        </button>

        <!-- 2. Réalisés -->
        <button
          type="button"
          (click)="filterByKpi('COMPLETED')"
          class="rounded-[22px] bg-white border border-[#E4E0F5] hover:border-emerald-300 p-4 sm:p-5 shadow-xs transition text-left flex items-center gap-4 cursor-pointer"
        >
          <div class="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <mb-icon name="check"></mb-icon>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-[#0F1035] block leading-none">4</span>
            <span class="text-xs font-bold text-[#42466B] mt-1 block">Réalisés</span>
          </div>
        </button>

        <!-- 3. À relancer -->
        <button
          type="button"
          (click)="filterByKpi('TO_RELAUNCH')"
          class="rounded-[22px] bg-white border border-[#E4E0F5] hover:border-amber-300 p-4 sm:p-5 shadow-xs transition text-left flex items-center gap-4 cursor-pointer"
        >
          <div class="h-11 w-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <mb-icon name="bell"></mb-icon>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-[#0F1035] block leading-none">2</span>
            <span class="text-xs font-bold text-[#42466B] mt-1 block">À relancer</span>
          </div>
        </button>

        <!-- 4. Actions en attente -->
        <button
          type="button"
          (click)="filterByKpi('PENDING_ACTIONS')"
          class="rounded-[22px] bg-white border border-[#E4E0F5] hover:border-purple-300 p-4 sm:p-5 shadow-xs transition text-left flex items-center gap-4 cursor-pointer"
        >
          <div class="h-11 w-11 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center text-xl shrink-0">
            <mb-icon name="clipboard-list"></mb-icon>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-[#0F1035] block leading-none">3</span>
            <span class="text-xs font-bold text-[#42466B] mt-1 block">Actions en attente</span>
          </div>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- BARRE D'ONGLETS PRINCIPAUX : AGENDA, RENDEZ-VOUS, JEUNES À SUIVRE   -->
      <!-- ================================================================== -->
      <div class="flex flex-wrap gap-2 text-xs sm:text-sm font-extrabold">
        <button
          type="button"
          (click)="mainTab = 'AGENDA'"
          [class]="mainTab === 'AGENDA'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] border border-[#E4E0F5]'"
          class="rounded-full px-5 py-2.5 transition flex items-center gap-2 cursor-pointer"
        >
          <span><mb-icon name="calendar"></mb-icon></span>
          <span>Mon agenda</span>
        </button>

        <button
          type="button"
          (click)="mainTab = 'LISTE'"
          [class]="mainTab === 'LISTE'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] border border-[#E4E0F5]'"
          class="rounded-full px-5 py-2.5 transition flex items-center gap-2 cursor-pointer"
        >
          <span><mb-icon name="clipboard-list"></mb-icon></span>
          <span>Mes rendez-vous</span>
        </button>

        <button
          type="button"
          (click)="mainTab = 'JEUNES_SUIVI'"
          [class]="mainTab === 'JEUNES_SUIVI'
            ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow'
            : 'bg-white text-[#42466B] hover:text-[#0F1035] border border-[#E4E0F5]'"
          class="rounded-full px-5 py-2.5 transition flex items-center gap-2 cursor-pointer"
        >
          <span><mb-icon name="users"></mb-icon></span>
          <span>Jeunes à suivre</span>
        </button>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 1 : MON AGENDA (SPLIT VIEW GAUCHE AGENDA + DROITE FICHE RDV)  -->
      <!-- ================================================================== -->
      <div *ngIf="mainTab === 'AGENDA'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- COLONNE GAUCHE (7 COLS) : GRILLE HEBDOMADAIRE                    -->
          <div class="lg:col-span-7 rounded-[28px] bg-white border border-[#E4E0F5] p-5 sm:p-6 shadow-sm space-y-5">
            <!-- Navigation toolbar de l'agenda -->
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="prevWeek()"
                  class="h-8 w-8 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ‹
                </button>
                <h3 class="text-sm sm:text-base font-black text-[#0F1035]">
                  Semaine du 16 au 22 nov. 2026
                </h3>
                <button
                  type="button"
                  (click)="nextWeek()"
                  class="h-8 w-8 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ›
                </button>
              </div>

              <div class="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  (click)="today()"
                  class="rounded-full bg-purple-50 text-[#7C3AED] px-3 py-1.5 font-bold hover:bg-purple-100 cursor-pointer"
                >
                  Aujourd'hui
                </button>

                <div class="rounded-full bg-gray-100 p-0.5 flex text-[11px] font-bold">
                  <button
                    type="button"
                    (click)="calendarMode = 'JOUR'"
                    [class.bg-white]="calendarMode === 'JOUR'"
                    [class.shadow-2xs]="calendarMode === 'JOUR'"
                    class="rounded-full px-2.5 py-1 text-gray-700 cursor-pointer"
                  >
                    Jour
                  </button>
                  <button
                    type="button"
                    (click)="calendarMode = 'SEMAINE'"
                    [class.bg-[#7C3AED]]="calendarMode === 'SEMAINE'"
                    [class.text-white]="calendarMode === 'SEMAINE'"
                    class="rounded-full px-2.5 py-1 font-black cursor-pointer"
                  >
                    Semaine
                  </button>
                  <button
                    type="button"
                    (click)="calendarMode = 'MOIS'"
                    [class.bg-white]="calendarMode === 'MOIS'"
                    [class.shadow-2xs]="calendarMode === 'MOIS'"
                    class="rounded-full px-2.5 py-1 text-gray-700 cursor-pointer"
                  >
                    Mois
                  </button>
                </div>
              </div>
            </div>

            <!-- Grille du calendrier hebdomadaire (5 jours x créneaux horaires) -->
            <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white">
              <!-- En-tête des jours -->
              <div class="grid grid-cols-6 border-b border-gray-200 text-center text-xs font-bold divide-x divide-gray-100 bg-[#FBFBFE]">
                <div class="py-2.5 text-gray-400 font-normal">Heure</div>
                <div class="py-2.5 text-gray-700 font-extrabold">Lun 16</div>
                <div class="py-2.5 text-gray-700 font-extrabold">Mar 17</div>
                <!-- Mer 18 Mis en évidence -->
                <div class="py-2.5 bg-[#7C3AED] text-white font-black shadow-inner">Mer 18</div>
                <div class="py-2.5 text-gray-700 font-extrabold">Jeu 19</div>
                <div class="py-2.5 text-gray-700 font-extrabold">Ven 20</div>
              </div>

              <!-- Lignes horaires -->
              <div class="divide-y divide-gray-100 text-xs">
                <!-- 09:00 -->
                <div class="grid grid-cols-6 min-h-[58px] divide-x divide-gray-100 items-stretch">
                  <div class="p-1.5 text-gray-400 font-mono text-[11px] text-center pt-2">09:00</div>
                  <!-- Lun 16 : Emma D. Réalisé -->
                  <div class="p-1 bg-[#FDFDFF]">
                    <div
                      (click)="selectAppointment('apt-01')"
                      class="h-full rounded-xl p-1.5 text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-900 cursor-pointer hover:shadow-xs transition"
                    >
                      <div class="flex items-center gap-1 font-bold">
                        <span><mb-icon name="check"></mb-icon></span>
                        <span class="truncate">Emma D.</span>
                      </div>
                      <span class="text-[10px] text-emerald-700 block truncate">Bilan &amp; pistes</span>
                    </div>
                  </div>
                  <div class="p-1 bg-white"></div>
                  <!-- Mer 18 Column -->
                  <div class="p-1 bg-purple-50/20"></div>
                  <!-- Jeu 19 : Lucas M. Planifié (09:30) -->
                  <div class="p-1 bg-[#FDFDFF]">
                    <div
                      (click)="selectAppointment('apt-05')"
                      class="h-full rounded-xl p-1.5 text-[11px] bg-amber-50 border border-amber-200 text-amber-900 cursor-pointer hover:shadow-xs transition"
                    >
                      <div class="font-bold flex items-center gap-1">
                        <span>●</span>
                        <span class="truncate">Lucas M.</span>
                      </div>
                      <span class="text-[10px] text-amber-700 block truncate">Suivi projet</span>
                    </div>
                  </div>
                  <div class="p-1 bg-white"></div>
                </div>

                <!-- 10:00 -->
                <div class="grid grid-cols-6 min-h-[52px] divide-x divide-gray-100 items-stretch">
                  <div class="p-1.5 text-gray-400 font-mono text-[11px] text-center pt-2">10:00</div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-purple-50/20"></div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-white"></div>
                </div>

                <!-- 11:00 -->
                <div class="grid grid-cols-6 min-h-[58px] divide-x divide-gray-100 items-stretch">
                  <div class="p-1.5 text-gray-400 font-mono text-[11px] text-center pt-2">11:00</div>
                  <div class="p-1 bg-white"></div>
                  <!-- Mar 17 : Aïcha D. Réalisé -->
                  <div class="p-1 bg-[#FDFDFF]">
                    <div
                      (click)="selectAppointment('apt-03')"
                      class="h-full rounded-xl p-1.5 text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-900 cursor-pointer hover:shadow-xs transition"
                    >
                      <div class="font-bold flex items-center gap-1">
                        <span><mb-icon name="check"></mb-icon></span>
                        <span class="truncate">Aïcha D.</span>
                      </div>
                      <span class="text-[10px] text-emerald-700 block truncate">Orientation</span>
                    </div>
                  </div>
                  <div class="p-1 bg-purple-50/20"></div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-white"></div>
                </div>

                <!-- 14:00 -->
                <div class="grid grid-cols-6 min-h-[64px] divide-x divide-gray-100 items-stretch">
                  <div class="p-1.5 text-gray-400 font-mono text-[11px] text-center pt-2">14:00</div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-white"></div>
                  <!-- Mer 18 : Matéo R. SÉLECTIONNÉ -->
                  <div class="p-1 bg-purple-100/30">
                    <div
                      (click)="selectAppointment('apt-04')"
                      class="h-full rounded-xl p-2 text-[11px] bg-[#7C3AED] text-white shadow-md cursor-pointer ring-2 ring-purple-300 font-bold"
                    >
                      <div class="flex items-center gap-1 font-black">
                        <span>●</span>
                        <span class="truncate">Matéo R.</span>
                      </div>
                      <span class="text-[10px] text-purple-100 block truncate">Rdv 2187</span>
                    </div>
                  </div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-white"></div>
                </div>

                <!-- 15:00 -->
                <div class="grid grid-cols-6 min-h-[58px] divide-x divide-gray-100 items-stretch">
                  <div class="p-1.5 text-gray-400 font-mono text-[11px] text-center pt-2">15:00</div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-purple-50/20"></div>
                  <div class="p-1 bg-white"></div>
                  <!-- Ven 20 : Sofia K. Choix formation -->
                  <div class="p-1 bg-[#FDFDFF]">
                    <div
                      (click)="selectAppointment('apt-06')"
                      class="h-full rounded-xl p-1.5 text-[11px] bg-purple-100 border border-purple-200 text-purple-900 cursor-pointer hover:shadow-xs transition"
                    >
                      <div class="font-bold flex items-center gap-1">
                        <span>●</span>
                        <span class="truncate">Sofia K.</span>
                      </div>
                      <span class="text-[10px] text-purple-700 block truncate">Choix formation</span>
                    </div>
                  </div>
                </div>

                <!-- 16:00 -->
                <div class="grid grid-cols-6 min-h-[58px] divide-x divide-gray-100 items-stretch">
                  <div class="p-1.5 text-gray-400 font-mono text-[11px] text-center pt-2">16:00</div>
                  <!-- Lun 16 : Noah P. Annulé -->
                  <div class="p-1 bg-[#FDFDFF]">
                    <div
                      (click)="selectAppointment('apt-02')"
                      class="h-full rounded-xl p-1.5 text-[11px] bg-rose-50 border border-rose-200 text-rose-900 cursor-pointer hover:shadow-xs transition line-through opacity-75"
                    >
                      <div class="font-bold flex items-center gap-1">
                        <span><mb-icon name="x"></mb-icon></span>
                        <span class="truncate">Noah P.</span>
                      </div>
                      <span class="text-[10px] text-rose-700 block truncate">Questions</span>
                    </div>
                  </div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-purple-50/20"></div>
                  <div class="p-1 bg-white"></div>
                  <div class="p-1 bg-white"></div>
                </div>
              </div>
            </div>

            <!-- Légende des couleurs du calendrier -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs font-bold text-gray-600">
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-[#7C3AED]"></span>
                <span>Confirmé</span>
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <span>Planifié</span>
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span>Réalisé</span>
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-purple-300"></span>
                <span>À confirmer</span>
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <span>Annulé</span>
              </span>
            </div>
          </div>

          <!-- COLONNE DROITE (5 COLS) : FICHE DÉTAILLÉE DU RDV SÉLECTIONNÉ    -->
          <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
            <!-- En-tête de la fiche : Avatar + Nom + Badge de statut -->
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="h-12 w-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-black text-sm shrink-0">
                  {{ selectedApt.youngName.split(' ')[0][0] }}{{ selectedApt.youngName.split(' ')[1]?.[0] || 'D' }}
                </div>
                <div>
                  <h4 class="text-lg font-black text-[#0F1035] leading-tight">
                    {{ selectedApt.youngName }}
                  </h4>
                  <p class="text-xs text-gray-500">
                    {{ selectedApt.dossierRef }} • {{ selectedApt.youngAge }}
                  </p>
                </div>
              </div>

              <!-- Badge de statut dynamique -->
              <span
                [ngClass]="getStatusBadgeClass(selectedApt.status)"
                class="rounded-full px-3 py-1 text-xs font-black shadow-2xs flex items-center gap-1.5"
              >
                <mb-icon [name]="getStatusIcon(selectedApt.status)"></mb-icon>
                <span>{{ selectedApt.statusLabel }}</span>
              </span>
            </div>

            <!-- Détails temporels et géographiques -->
            <div class="space-y-1.5 text-xs text-[#42466B] bg-[#FAF8FF] border border-[#E4E0F5] rounded-2xl p-3.5">
              <div class="flex items-center gap-2">
                <span><mb-icon name="calendar"></mb-icon></span>
                <span class="font-bold text-gray-900">{{ formatAptDate(selectedApt.date) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span><mb-icon name="clock"></mb-icon></span>
                <span>{{ selectedApt.startHour }} – {{ selectedApt.endHour }} ({{ selectedApt.durationLabel }})</span>
              </div>
              <div class="flex items-center gap-2">
                <span><mb-icon name="map-pin"></mb-icon></span>
                <span>{{ selectedApt.location }}</span>
              </div>
            </div>

            <!-- 4 Sous-onglets de la fiche détaillée -->
            <div class="border-b border-gray-200 flex text-xs font-bold gap-4">
              <button
                type="button"
                (click)="detailTab = 'INFO'"
                [class.text-[#7C3AED]]="detailTab === 'INFO'"
                [class.border-[#7C3AED]]="detailTab === 'INFO'"
                [class.border-b-2]="detailTab === 'INFO'"
                class="pb-2.5 transition cursor-pointer"
              >
                Informations
              </button>
              <button
                type="button"
                (click)="detailTab = 'PREPARATION'"
                [class.text-[#7C3AED]]="detailTab === 'PREPARATION'"
                [class.border-[#7C3AED]]="detailTab === 'PREPARATION'"
                [class.border-b-2]="detailTab === 'PREPARATION'"
                class="pb-2.5 text-gray-500 hover:text-gray-900 transition cursor-pointer"
              >
                Préparation
              </button>
              <button
                type="button"
                (click)="detailTab = 'COMPTE_RENDU'"
                [class.text-[#7C3AED]]="detailTab === 'COMPTE_RENDU'"
                [class.border-[#7C3AED]]="detailTab === 'COMPTE_RENDU'"
                [class.border-b-2]="detailTab === 'COMPTE_RENDU'"
                class="pb-2.5 text-gray-500 hover:text-gray-900 transition cursor-pointer"
              >
                Compte rendu
              </button>
              <button
                type="button"
                (click)="detailTab = 'PLAN_ACTION'"
                [class.text-[#7C3AED]]="detailTab === 'PLAN_ACTION'"
                [class.border-[#7C3AED]]="detailTab === 'PLAN_ACTION'"
                [class.border-b-2]="detailTab === 'PLAN_ACTION'"
                class="pb-2.5 text-gray-500 hover:text-gray-900 transition cursor-pointer"
              >
                Plan d'action
              </button>
            </div>

            <!-- CONTENU DE L'ONGLET SÉLECTIONNÉ DANS LA FICHE -->
            <!-- 1. Informations -->
            <div *ngIf="detailTab === 'INFO'" class="space-y-4 text-xs">
              <div class="space-y-1">
                <span class="text-gray-500 font-bold block flex items-center gap-1.5">
                  <span><mb-icon name="user"></mb-icon></span>
                  <span>Motif</span>
                </span>
                <p class="text-gray-800 leading-relaxed font-medium pl-6">
                  {{ selectedApt.motif }}
                </p>
              </div>

              <div class="space-y-1.5">
                <span class="text-gray-500 font-bold block flex items-center gap-1.5">
                  <span><mb-icon name="target"></mb-icon></span>
                  <span>Objectifs</span>
                </span>
                <ul class="space-y-1 pl-6 list-disc list-inside text-gray-800">
                  <li *ngFor="let obj of selectedApt.objectives">{{ obj }}</li>
                </ul>
              </div>

              <!-- Boutons d'action -->
              <div class="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div class="flex gap-2">
                  <button
                    type="button"
                    (click)="editAppointment(selectedApt)"
                    class="rounded-full border border-gray-300 hover:bg-gray-50 px-3.5 py-1.5 font-bold text-gray-700 cursor-pointer"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    (click)="cancelAppointment(selectedApt)"
                    class="rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 px-3.5 py-1.5 font-bold cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>

                <button
                  type="button"
                  (click)="openPreparation(selectedApt)"
                  class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#541fd0] text-white px-4 py-2 font-black shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Ouvrir la préparation →</span>
                </button>
              </div>
            </div>

            <!-- 2. Préparation -->
            <div *ngIf="detailTab === 'PREPARATION'" class="space-y-4 text-xs">
              <p class="text-gray-500 font-bold">Checklist de préparation de l'échange :</p>
              <div class="space-y-2">
                <label *ngFor="let chk of selectedApt.preparation.checklist" class="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 border border-gray-200 hover:bg-purple-50/50 cursor-pointer transition">
                  <input type="checkbox" [(ngModel)]="chk.checked" class="accent-[#7C3AED] h-4 w-4 rounded" />
                  <span [class.line-through]="chk.checked" [class.text-gray-400]="chk.checked" class="font-bold text-gray-800">
                    {{ chk.label }}
                  </span>
                </label>
              </div>

              <div class="space-y-1 pt-2 border-t border-gray-100">
                <label class="font-bold text-gray-600 block">Notes internes privées du conseiller :</label>
                <textarea
                  [(ngModel)]="selectedApt.preparation.privateNotes"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 p-2 text-xs focus:outline-none focus:border-[#7C3AED]"
                  placeholder="Notes confidentielles..."
                ></textarea>
              </div>
            </div>

            <!-- 3. Compte rendu -->
            <div *ngIf="detailTab === 'COMPTE_RENDU'" class="space-y-4 text-xs">
              <div class="space-y-1">
                <label class="font-bold text-gray-700 block">Observations de l'entretien :</label>
                <textarea
                  [(ngModel)]="selectedApt.report.observations"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 p-2 text-xs focus:outline-none focus:border-[#7C3AED]"
                  placeholder="Saisissez les conclusions de l'échange..."
                ></textarea>
              </div>

              <div class="space-y-1 pt-2 border-t border-gray-100">
                <label class="font-bold text-gray-700 block">Synthèse partageable avec le jeune :</label>
                <textarea
                  [(ngModel)]="selectedApt.report.sharedSummary"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 p-2 text-xs focus:outline-none focus:border-[#7C3AED]"
                  placeholder="Synthèse visible dans l'Espace Jeune..."
                ></textarea>
              </div>

              <button
                type="button"
                (click)="markAsCompleted(selectedApt)"
                class="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 font-black shadow-sm cursor-pointer"
              >
                <mb-icon name="check"></mb-icon> Clôturer et valider l'entretien
              </button>
            </div>

            <!-- 4. Plan d'action -->
            <div *ngIf="detailTab === 'PLAN_ACTION'" class="space-y-3 text-xs">
              <p class="font-bold text-gray-600">Actions de suivi convenues :</p>
              <div *ngFor="let act of selectedApt.actions" class="p-3 rounded-xl bg-purple-50/50 border border-purple-200 flex items-start justify-between gap-2">
                <div>
                  <span class="font-black text-gray-900 block">{{ act.title }}</span>
                  <span class="text-[10px] text-gray-500">
                    Responsable : {{ act.assignee === 'YOUNG' ? 'Jeune' : 'Conseiller' }} • Échéance : {{ act.dueDate || 'Non définie' }}
                  </span>
                </div>
                <span class="rounded-full bg-purple-100 text-[#7C3AED] px-2 py-0.5 text-[10px] font-black shrink-0">
                  {{ act.status === 'DONE' ? 'Terminé' : act.status === 'IN_PROGRESS' ? 'En cours' : 'À faire' }}
                </span>
              </div>

              <button
                type="button"
                (click)="addNewAction(selectedApt)"
                class="w-full rounded-full border border-dashed border-[#7C3AED] text-[#7C3AED] py-2 font-bold hover:bg-purple-50 cursor-pointer"
              >
                + Ajouter une action de suivi
              </button>
            </div>
          </div>
        </div>

        <!-- ================================================================ -->
        <!-- SECTION INFÉRIEURE : JEUNES À SUIVRE (Fidèle à la maquette)       -->
        <!-- ================================================================ -->
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-gray-100">
            <div class="flex items-center gap-2.5">
              <span class="text-xl"><mb-icon name="users"></mb-icon></span>
              <div>
                <h3 class="text-base font-black text-[#0F1035]">Jeunes à suivre</h3>
                <p class="text-xs text-gray-400">Dossiers nécessitant une action ou un suivi prochain.</p>
              </div>
            </div>

            <button
              type="button"
              (click)="viewAllDossiers.emit()"
              class="text-xs font-black text-[#7C3AED] hover:underline cursor-pointer"
            >
              Voir tous les dossiers →
            </button>
          </div>

          <!-- Tableau des jeunes à suivre -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100">
                  <th class="pb-2.5 font-bold">Jeune</th>
                  <th class="pb-2.5 font-bold">Situation</th>
                  <th class="pb-2.5 font-bold">Prochaine action</th>
                  <th class="pb-2.5 font-bold">Échéance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-bold text-gray-800">
                <tr *ngFor="let youth of followUpYouths" class="hover:bg-purple-50/20 transition">
                  <td class="py-3">
                    <div class="flex items-center gap-2.5">
                      <div class="h-7 w-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black shrink-0">
                        {{ youth.youngName.split(' ')[0][0] }}
                      </div>
                      <span class="font-black text-gray-900">{{ youth.youngName }}</span>
                    </div>
                  </td>
                  <td class="py-3">
                    <span [class]="youth.situationBadgeClass" class="rounded-full px-3 py-1 text-[11px] font-bold shadow-2xs inline-flex items-center gap-1.5">
                      <mb-icon [name]="youth.situationIcon"></mb-icon>
                      <span>{{ youth.situation }}</span>
                    </span>
                  </td>
                  <td class="py-3 text-gray-700 font-medium">
                    <div class="flex items-center gap-1.5">
                      <mb-icon [name]="youth.nextActionIcon"></mb-icon>
                      <span>{{ youth.nextAction }}</span>
                    </div>
                  </td>
                  <td class="py-3 text-gray-500 font-mono text-[11px]">
                    {{ youth.dueDate || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 2 : MES RENDEZ-VOUS (TABLEAU COMPLET AVEC FILTRES & RECHERCHE) -->
      <!-- ================================================================== -->
      <div *ngIf="mainTab === 'LISTE'" class="space-y-6">
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          <!-- Barre de recherche et filtres de statut -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="relative flex-1 max-w-md">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><mb-icon name="search"></mb-icon></span>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Rechercher par nom, dossier ou lieu..."
                class="w-full rounded-2xl bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <!-- Filtres statut -->
            <div class="flex flex-wrap gap-1.5 text-xs font-bold">
              <button
                type="button"
                (click)="selectedStatusFilter = 'ALL'"
                [class.bg-[#7C3AED]]="selectedStatusFilter === 'ALL'"
                [class.text-white]="selectedStatusFilter === 'ALL'"
                class="rounded-full px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Tous ({{ appointments.length }})
              </button>
              <button
                type="button"
                (click)="selectedStatusFilter = 'CONFIRMED'"
                [class.bg-[#7C3AED]]="selectedStatusFilter === 'CONFIRMED'"
                [class.text-white]="selectedStatusFilter === 'CONFIRMED'"
                class="rounded-full px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Confirmés
              </button>
              <button
                type="button"
                (click)="selectedStatusFilter = 'COMPLETED'"
                [class.bg-[#7C3AED]]="selectedStatusFilter === 'COMPLETED'"
                [class.text-white]="selectedStatusFilter === 'COMPLETED'"
                class="rounded-full px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Réalisés
              </button>
              <button
                type="button"
                (click)="selectedStatusFilter = 'PLANNED'"
                [class.bg-[#7C3AED]]="selectedStatusFilter === 'PLANNED'"
                [class.text-white]="selectedStatusFilter === 'PLANNED'"
                class="rounded-full px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Planifiés
              </button>
            </div>
          </div>

          <!-- Tableau de la liste des rendez-vous -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100">
                  <th class="pb-3 font-bold">Date &amp; heure</th>
                  <th class="pb-3 font-bold">Jeune</th>
                  <th class="pb-3 font-bold">Objet / Motif</th>
                  <th class="pb-3 font-bold">Lieu / Modalité</th>
                  <th class="pb-3 font-bold">Statut</th>
                  <th class="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-bold text-gray-800">
                <tr *ngFor="let apt of filteredAppointments" class="hover:bg-purple-50/20 transition">
                  <td class="py-3 font-mono text-gray-700">
                    <span class="block font-black text-gray-900">{{ formatAptDateShort(apt.date) }}</span>
                    <span class="text-[11px] text-gray-500">{{ apt.startHour }} – {{ apt.endHour }}</span>
                  </td>
                  <td class="py-3">
                    <span class="block font-black text-[#0F1035]">{{ apt.youngName }}</span>
                    <span class="text-[10px] text-gray-400 font-normal">{{ apt.dossierRef }}</span>
                  </td>
                  <td class="py-3 text-gray-700 font-medium max-w-xs truncate">
                    {{ apt.motif }}
                  </td>
                  <td class="py-3 text-gray-500 text-[11px]">
                    {{ apt.location }}
                  </td>
                  <td class="py-3">
                    <span [class]="getStatusBadgeClass(apt.status)" class="rounded-full px-2.5 py-0.5 text-[10px] font-black inline-flex items-center gap-1">
                      <mb-icon [name]="getStatusIcon(apt.status)"></mb-icon>
                      <span>{{ apt.statusLabel }}</span>
                    </span>
                  </td>
                  <td class="py-3 text-right">
                    <button
                      type="button"
                      (click)="selectAndOpenAgenda(apt.id)"
                      class="rounded-full bg-purple-100 hover:bg-purple-200 text-[#7C3AED] px-3 py-1 text-xs font-black transition cursor-pointer"
                    >
                      Détails →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- VUE 3 : JEUNES À SUIVRE (PLEIN ÉCRAN)                              -->
      <!-- ================================================================== -->
      <div *ngIf="mainTab === 'JEUNES_SUIVI'" class="space-y-6">
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 class="text-lg font-black text-[#0F1035]">Suivi individualisé des parcours</h3>
              <p class="text-xs text-gray-500">Vue synthétique des actions et échéances de chaque jeune accompagné.</p>
            </div>
            <button
              type="button"
              (click)="viewAllDossiers.emit()"
              class="rounded-full bg-purple-50 text-[#7C3AED] px-4 py-2 text-xs font-black hover:bg-purple-100 transition cursor-pointer"
            >
              Accéder aux dossiers jeunes →
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let y of followUpYouths" class="rounded-2xl border border-gray-200 p-4 space-y-3 bg-[#FAF8FF]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-black text-sm">
                    {{ y.youngName.split(' ')[0][0] }}
                  </div>
                  <div>
                    <h4 class="font-black text-[#0F1035]">{{ y.youngName }}</h4>
                    <span class="text-xs text-gray-400">{{ y.dossierRef }}</span>
                  </div>
                </div>

                <span [class]="y.situationBadgeClass" class="rounded-full px-2.5 py-0.5 text-xs font-bold">
                  {{ y.situation }}
                </span>
              </div>

              <div class="p-3 rounded-xl bg-white border border-gray-100 space-y-1 text-xs">
                <span class="text-[10px] uppercase font-bold text-gray-400 block">Prochaine action</span>
                <p class="font-bold text-gray-800 flex items-center gap-1.5">
                  <mb-icon [name]="y.nextActionIcon"></mb-icon>
                  <span>{{ y.nextAction }}</span>
                </p>
                <span *ngIf="y.dueDate" class="text-[11px] text-amber-700 font-bold block pt-1">
                  Échéance : {{ y.dueDate }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- MODALE : CRÉER UN NOUVEAU RENDEZ-VOUS                              -->
      <!-- ================================================================== -->
      <div
        *ngIf="isNewModalOpen"
        class="fixed inset-0 z-50 bg-[#0F1035]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      >
        <div class="rounded-[28px] bg-white border border-[#E4E0F5] max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2.5">
              <span class="text-xl"><mb-icon name="calendar"></mb-icon></span>
              <h3 class="text-lg font-black text-[#0F1035]">Nouveau rendez-vous</h3>
            </div>
            <button
              type="button"
              (click)="isNewModalOpen = false"
              class="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              <mb-icon name="x"></mb-icon>
            </button>
          </div>

          <form (ngSubmit)="saveNewAppointment()" class="space-y-3.5 text-xs">
            <!-- Choix du jeune -->
            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Jeune concerné *</label>
              <select
                [(ngModel)]="newAptForm.youngName"
                name="youngName"
                required
                class="w-full rounded-xl bg-gray-50 border border-gray-300 p-2.5 font-bold text-gray-800 focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="Emma D.">Emma D. — Rdv 2187 (Centre des Possibles)</option>
                <option value="Lucas M.">Lucas M. — Dossier 2188 (Lycée Masséna)</option>
                <option value="Aïcha D.">Aïcha D. — Dossier 2189 (Lycée Apollinaire)</option>
                <option value="Matéo R.">Matéo R. — Dossier 2190 (Lycée Simone Veil)</option>
                <option value="Noah P.">Noah P. — Dossier 2192</option>
                <option value="Sofia K.">Sofia K. — Dossier 2191</option>
              </select>
            </div>

            <!-- Motif -->
            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Motif de l'échange *</label>
              <input
                type="text"
                [(ngModel)]="newAptForm.motif"
                name="motif"
                required
                placeholder="Ex : Débriefing du bilan, exploration des métiers..."
                class="w-full rounded-xl bg-gray-50 border border-gray-300 p-2.5 font-bold text-gray-800 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <!-- Date & Horaires -->
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="font-bold text-gray-700 block">Date *</label>
                <input
                  type="date"
                  [(ngModel)]="newAptForm.date"
                  name="date"
                  required
                  class="w-full rounded-xl bg-gray-50 border border-gray-300 p-2 font-bold text-gray-800 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div class="space-y-1">
                <label class="font-bold text-gray-700 block">Heure de début *</label>
                <select
                  [(ngModel)]="newAptForm.startHour"
                  name="startHour"
                  required
                  class="w-full rounded-xl bg-gray-50 border border-gray-300 p-2 font-bold text-gray-800 focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </div>
            </div>

            <!-- Modalité & Lieu -->
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="font-bold text-gray-700 block">Modalité</label>
                <select
                  [(ngModel)]="newAptForm.modality"
                  name="modality"
                  class="w-full rounded-xl bg-gray-50 border border-gray-300 p-2 font-bold text-gray-800 focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="IN_PERSON">Présentiel</option>
                  <option value="VIDEO">Visioconférence</option>
                  <option value="PHONE">Téléphone</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="font-bold text-gray-700 block">Lieu / Salle</label>
                <input
                  type="text"
                  [(ngModel)]="newAptForm.location"
                  name="location"
                  placeholder="Centre des Possibles – Salle 2"
                  class="w-full rounded-xl bg-gray-50 border border-gray-300 p-2 font-bold text-gray-800 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            <!-- Alerte conflit éventuelle -->
            <div *ngIf="conflictError" class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
              <mb-icon name="triangle-alert"></mb-icon> {{ conflictError }}
            </div>

            <!-- Boutons valider / annuler -->
            <div class="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                (click)="isNewModalOpen = false"
                class="rounded-full border border-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-5 py-2 font-black shadow cursor-pointer"
              >
                Programmer le rendez-vous
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CounselorAppointmentsComponent implements OnInit {
  @Output() viewAllDossiers = new EventEmitter<void>();
  @Output() openYoungPreparation = new EventEmitter<AppointmentItem>();

  mainTab: 'AGENDA' | 'LISTE' | 'JEUNES_SUIVI' = 'AGENDA';
  calendarMode: 'JOUR' | 'SEMAINE' | 'MOIS' = 'SEMAINE';
  detailTab: 'INFO' | 'PREPARATION' | 'COMPTE_RENDU' | 'PLAN_ACTION' = 'INFO';

  searchQuery = '';
  selectedStatusFilter: 'ALL' | 'CONFIRMED' | 'COMPLETED' | 'PLANNED' = 'ALL';

  isNewModalOpen = false;
  conflictError: string | null = null;

  newAptForm = {
    youngName: 'Lucas M.',
    motif: 'Point d\'étape orientation',
    date: '2026-11-20',
    startHour: '10:00',
    modality: 'IN_PERSON' as AppointmentModality,
    location: 'Centre des Possibles – Bureau 2'
  };

  // Liste des rendez-vous fidèles à la maquette
  appointments: AppointmentItem[] = [
    {
      id: 'apt-01',
      youngName: 'Emma D.',
      youngAge: '16 ans',
      dossierRef: 'Rdv 2187',
      title: 'Bilan & pistes',
      motif: 'Débriefing complet du bilan et premières pistes professionnelles.',
      objectives: ['Restituer les résultats RIASEC et HEXACO', 'Explorer les pistes prioritaires', 'Initier le projet Immersion Pro'],
      date: '2026-11-16',
      dayLabel: 'Lun 16',
      startHour: '09:00',
      endHour: '10:00',
      durationLabel: '1 h',
      modality: 'IN_PERSON',
      location: 'Centre des Possibles – Salle 1',
      status: 'COMPLETED',
      statusLabel: 'Réalisé',
      preparation: {
        checklist: [
          { id: 'c1', label: 'Consulter le rapport de 17 pages', checked: true },
          { id: 'c2', label: 'Valider les 7 faits prioritaires', checked: true }
        ],
        privateNotes: 'Très bon contact. Profil artistique marqué, confirme son attrait pour le terrain.'
      },
      report: {
        topicsDiscussed: ['Profil RIASEC', '22 pistes', 'Immersion peintre décorateur'],
        observations: 'Emma s\'est montrée très réceptive et motivée par les métiers concrets.',
        decisions: ['Lancement de la recherche d\'immersion', 'Prise de contact avec Atelier Décors'],
        sharedSummary: 'Entretien très constructif. Nous avons validé la recherche de stage découverte.',
        isPublishedToYoung: true
      },
      actions: [
        {
          id: 'a1',
          title: 'Signer la convention d\'immersion',
          assignee: 'YOUNG',
          dueDate: '2026-11-20',
          priority: 'HIGH',
          status: 'IN_PROGRESS'
        }
      ]
    },
    {
      id: 'apt-02',
      youngName: 'Noah P.',
      youngAge: '17 ans',
      dossierRef: 'Dossier 2192',
      title: 'Questions',
      motif: 'Répondre aux questions sur les passerelles Bac Pro / BTS.',
      objectives: ['Clarifier les conditions d\'accès aux formations'],
      date: '2026-11-16',
      dayLabel: 'Lun 16',
      startHour: '16:00',
      endHour: '17:00',
      durationLabel: '1 h',
      modality: 'VIDEO',
      location: 'Visioconférence MonBilan+',
      status: 'CANCELLED',
      statusLabel: 'Annulé',
      preparation: {
        checklist: [],
        privateNotes: 'Annulé par le jeune pour motif médical. À reprogrammer.'
      },
      report: {
        topicsDiscussed: [],
        observations: 'Entretien non réalisé.',
        decisions: [],
        sharedSummary: '',
        isPublishedToYoung: false
      },
      actions: []
    },
    {
      id: 'apt-03',
      youngName: 'Aïcha D.',
      youngAge: '18 ans',
      dossierRef: 'Dossier 2189',
      title: 'Orientation',
      motif: 'Échanger sur les candidatures Parcoursup et les ressources ONISEP.',
      objectives: ['Valider les vœux en communication', 'Vérifier les critères de sélection'],
      date: '2026-11-17',
      dayLabel: 'Mar 17',
      startHour: '11:00',
      endHour: '12:00',
      durationLabel: '1 h',
      modality: 'IN_PERSON',
      location: 'Centre des Possibles – Bureau 3',
      status: 'COMPLETED',
      statusLabel: 'Réalisé',
      preparation: {
        checklist: [
          { id: 'c1', label: 'Vérifier les critères Parcoursup', checked: true }
        ],
        privateNotes: 'Dossier solide en français et langues.'
      },
      report: {
        topicsDiscussed: ['Vœux Parcoursup'],
        observations: 'Aïcha avance méthodiquement.',
        decisions: ['Ajout de 3 vœux en BTS communication'],
        sharedSummary: 'Vœux validés ensemble.',
        isPublishedToYoung: true
      },
      actions: [
        {
          id: 'a2',
          title: 'Finaliser la lettre de motivation',
          assignee: 'YOUNG',
          dueDate: '2026-11-21',
          priority: 'HIGH',
          status: 'IN_PROGRESS'
        }
      ]
    },
    {
      id: 'apt-04',
      youngName: 'Matéo R.',
      youngAge: '17 ans',
      dossierRef: 'Dossier 2190',
      title: 'Rdv 2187',
      motif: 'Échanger sur les résultats du bilan et approfondir 2 métiers.',
      objectives: [
        'Revenir sur les intérêts et aptitudes.',
        'Explorer les métiers identifiés.',
        'Définir les prochaines étapes.'
      ],
      date: '2026-11-18',
      dayLabel: 'Mer 18',
      startHour: '14:00',
      endHour: '15:00',
      durationLabel: '1 h',
      modality: 'IN_PERSON',
      location: 'Centre des Possibles – Salle 2',
      status: 'CONFIRMED',
      statusLabel: 'Confirmé',
      preparation: {
        checklist: [
          { id: 'c1', label: 'Consulter le bilan Rdv 2190 et la synthèse', checked: true },
          { id: 'c2', label: 'Relire les points clés (intérêts, aptitudes, 22 pistes)', checked: true },
          { id: 'c3', label: 'Identifier les questions à approfondir', checked: false },
          { id: 'c4', label: 'Préparer des ressources (formations, stages, liens)', checked: false }
        ],
        privateNotes: 'Matéo hésite entre informatique et audiovisuel. Faire le point sur ses contraintes de transport.'
      },
      report: {
        topicsDiscussed: ['Intérêts RIASEC', 'Métiers du numérique'],
        observations: 'Discussion franche et motivée.',
        decisions: ['Préparer une immersion d\'observation'],
        sharedSummary: 'Échange constructif sur ton orientation.',
        isPublishedToYoung: false
      },
      actions: [
        {
          id: 'act-01',
          title: 'Explorer la fiche métier Développeur web',
          assignee: 'YOUNG',
          dueDate: '2026-11-25',
          priority: 'HIGH',
          status: 'IN_PROGRESS'
        },
        {
          id: 'act-02',
          title: 'Transmettre la convention d\'immersion',
          assignee: 'COUNSELOR',
          dueDate: '2026-11-22',
          priority: 'HIGH',
          status: 'TODO'
        }
      ]
    },
    {
      id: 'apt-05',
      youngName: 'Lucas M.',
      youngAge: '16 ans',
      dossierRef: 'Dossier 2188',
      title: 'Suivi projet',
      motif: 'Faire le point sur l\'entretien et les démarches en cours.',
      objectives: ['Valider le choix de filière', 'Fixer les prochaines étapes'],
      date: '2026-11-19',
      dayLabel: 'Jeu 19',
      startHour: '09:30',
      endHour: '10:30',
      durationLabel: '1 h',
      modality: 'IN_PERSON',
      location: 'Lycée Masséna – Salle d\'orientation',
      status: 'PLANNED',
      statusLabel: 'Planifié',
      preparation: {
        checklist: [
          { id: 'c1', label: 'Prendre contact avec l\'équipe pédagogique', checked: false }
        ],
        privateNotes: 'Accompagnement renforcé.'
      },
      report: {
        topicsDiscussed: [],
        observations: '',
        decisions: [],
        sharedSummary: '',
        isPublishedToYoung: false
      },
      actions: []
    },
    {
      id: 'apt-06',
      youngName: 'Sofia K.',
      youngAge: '17 ans',
      dossierRef: 'Dossier 2191',
      title: 'Choix formation',
      motif: 'Sélection des formations après analyse des résultats.',
      objectives: ['Comparer les lycées pro de l\'académie de Nice'],
      date: '2026-11-20',
      dayLabel: 'Ven 20',
      startHour: '15:00',
      endHour: '16:00',
      durationLabel: '1 h',
      modality: 'IN_PERSON',
      location: 'Centre des Possibles – Bureau 1',
      status: 'TO_CONFIRM',
      statusLabel: 'À confirmer',
      preparation: {
        checklist: [],
        privateNotes: ''
      },
      report: {
        topicsDiscussed: [],
        observations: '',
        decisions: [],
        sharedSummary: '',
        isPublishedToYoung: false
      },
      actions: []
    }
  ];

  selectedApt: AppointmentItem = this.appointments[3]; // Matéo R. par défaut

  followUpYouths: YouthFollowUpItem[] = [
    {
      id: 'fu-1',
      youngName: 'Emma D.',
      dossierRef: 'Rdv 2187',
      situation: 'Entretien réalisé',
      situationBadgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      situationIcon: 'check',
      nextAction: 'Consulter le compte rendu',
      nextActionIcon: 'file-text',
      dueDate: undefined
    },
    {
      id: 'fu-2',
      youngName: 'Lucas M.',
      dossierRef: 'Dossier 2188',
      situation: 'Rendez-vous planifié',
      situationBadgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      situationIcon: 'calendar',
      nextAction: 'Préparer l\'entretien',
      nextActionIcon: 'pencil',
      dueDate: '19 nov. 2026'
    },
    {
      id: 'fu-3',
      youngName: 'Aïcha D.',
      dossierRef: 'Dossier 2189',
      situation: 'Action en attente',
      situationBadgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
      situationIcon: 'hourglass',
      nextAction: 'Vérifier l\'avancement (ressources, candidatures)',
      nextActionIcon: 'clipboard-list',
      dueDate: '21 nov. 2026'
    },
    {
      id: 'fu-4',
      youngName: 'Matéo R.',
      dossierRef: 'Dossier 2190',
      situation: 'Dossier en cours',
      situationBadgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
      situationIcon: 'ellipsis',
      nextAction: 'Examiner les éléments disponibles (extraction)',
      nextActionIcon: 'search',
      dueDate: undefined
    }
  ];

  ngOnInit(): void {
    // Par défaut, sélectionner le rendez-vous de Matéo R.
    const defaultApt = this.appointments.find(a => a.id === 'apt-04');
    if (defaultApt) {
      this.selectedApt = defaultApt;
    }
  }

  selectAppointment(id: string): void {
    const found = this.appointments.find(a => a.id === id);
    if (found) {
      this.selectedApt = found;
    }
  }

  selectAndOpenAgenda(id: string): void {
    this.selectAppointment(id);
    this.mainTab = 'AGENDA';
  }

  filterByKpi(kpi: 'UPCOMING' | 'COMPLETED' | 'TO_RELAUNCH' | 'PENDING_ACTIONS'): void {
    if (kpi === 'UPCOMING') {
      this.mainTab = 'AGENDA';
    } else if (kpi === 'COMPLETED') {
      this.mainTab = 'LISTE';
      this.selectedStatusFilter = 'COMPLETED';
    } else if (kpi === 'TO_RELAUNCH' || kpi === 'PENDING_ACTIONS') {
      this.mainTab = 'JEUNES_SUIVI';
    }
  }

  get filteredAppointments(): AppointmentItem[] {
    return this.appointments.filter(a => {
      const matchSearch = !this.searchQuery ||
        a.youngName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        a.dossierRef.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        a.motif.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchStatus = this.selectedStatusFilter === 'ALL' || a.status === this.selectedStatusFilter;

      return matchSearch && matchStatus;
    });
  }

  getStatusBadgeClass(status: AppointmentStatus): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      case 'PLANNED':
        return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      case 'TO_CONFIRM':
        return 'bg-purple-100 text-purple-900 border border-purple-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-800 border border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }

  getStatusIcon(status: AppointmentStatus): string {
    switch (status) {
      case 'CONFIRMED': return 'check';
      case 'COMPLETED': return 'check';
      case 'PLANNED': return 'dot';
      case 'TO_CONFIRM': return 'dot';
      case 'CANCELLED': return 'x';
      default: return 'dot';
    }
  }

  formatAptDate(dateStr: string): string {
    return 'Mer. 18 nov. 2026';
  }

  formatAptDateShort(dateStr: string): string {
    return dateStr;
  }

  prevWeek(): void {}
  nextWeek(): void {}
  today(): void {}

  openNewAppointmentModal(): void {
    this.conflictError = null;
    this.isNewModalOpen = true;
  }

  saveNewAppointment(): void {
    this.conflictError = null;

    // Détection de conflit horaire
    const hasConflict = this.appointments.some(
      a => a.date === this.newAptForm.date && a.startHour === this.newAptForm.startHour && a.status !== 'CANCELLED'
    );
    if (hasConflict) {
      this.conflictError = `Le créneau de ${this.newAptForm.startHour} est déjà réservé le ${this.newAptForm.date}.`;
      return;
    }

    const newApt: AppointmentItem = {
      id: `apt-${Date.now()}`,
      youngName: this.newAptForm.youngName,
      youngAge: '17 ans',
      dossierRef: 'Dossier Rdv',
      title: this.newAptForm.motif,
      motif: this.newAptForm.motif,
      objectives: ['Faire le point sur le parcours'],
      date: this.newAptForm.date,
      dayLabel: 'Ven 20',
      startHour: this.newAptForm.startHour,
      endHour: '11:00',
      durationLabel: '1 h',
      modality: this.newAptForm.modality,
      location: this.newAptForm.location,
      status: 'CONFIRMED',
      statusLabel: 'Confirmé',
      preparation: { checklist: [], privateNotes: '' },
      report: { topicsDiscussed: [], observations: '', decisions: [], sharedSummary: '', isPublishedToYoung: false },
      actions: []
    };

    this.appointments.unshift(newApt);
    this.selectedApt = newApt;
    this.isNewModalOpen = false;
  }

  editAppointment(apt: AppointmentItem): void {
    this.detailTab = 'INFO';
  }

  cancelAppointment(apt: AppointmentItem): void {
    apt.status = 'CANCELLED';
    apt.statusLabel = 'Annulé';
  }

  markAsCompleted(apt: AppointmentItem): void {
    apt.status = 'COMPLETED';
    apt.statusLabel = 'Réalisé';
    apt.report.isPublishedToYoung = true;
  }

  addNewAction(apt: AppointmentItem): void {
    apt.actions.push({
      id: `act-${Date.now()}`,
      title: 'Action de suivi supplémentaire',
      assignee: 'YOUNG',
      dueDate: '2026-11-28',
      priority: 'MEDIUM',
      status: 'TODO'
    });
  }

  openPreparation(apt: AppointmentItem): void {
    this.openYoungPreparation.emit(apt);
  }
}
