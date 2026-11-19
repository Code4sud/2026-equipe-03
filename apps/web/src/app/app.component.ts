// ============================================================================
// MonBilan+ — Application Principale Angular fidèle aux maquettes de captures/
// - Layout Dashboard exact : Sidebar fixe Bleu Nuit à gauche (avec illustration
//   du phare et slogan) + Zone principale claire (#F5F3FF) avec Topbar
// - Espace Jeune (6 vues fidèles à captures/interface jeune/) :
//   1. Accueil (Bannière violette + 4 pilules inclinées + Mon profil en bref +
//      Métiers proposés avec vignettes photos + Mon parcours 2/4 + Prochain RDV)
//   2. Mon bilan (5 sous-onglets + Lecteur audio avec chapitres et transcription
//      synchronisée + Centres d'intérêt RIASEC + Aptitudes + Sources Rdv 2187)
//   3. Explorer les métiers (Bannière "sans pression !" + Encadré "À retenir" +
//      Colonne filtres + Cartes métiers avec photos + Fiche détaillée Peintre décorateur)
//   4. Mon parcours (Timeline verticale 1..4 + Jauge circulaire 2/4 + Favoris)
//   5. Mes questions (Checklist par tags + Prochain RDV + Notes 0/500)
//   6. Mes documents (4 documents téléchargeables + Jauge 24 Mo/100 Mo + Liens utiles)
// - Espace Conseiller (8 vues fidèles à captures/interface conseiller/) :
//   Tableau de bord, Dossiers jeunes, Importer un rapport, Vérification des données,
//   Validations & publications, Suivi & rendez-vous, Statistiques, Paramètres.
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MbIconComponent } from './shared/ui/mb-icon.component';
import { FormsModule } from '@angular/forms';
import { ImmersionProComponent } from './features/immersion/immersion-pro.component';
import { JourneyChoiceModalComponent } from './features/autonomous/journey-choice-modal.component';
import { AutonomousHomeComponent } from './features/autonomous/autonomous-home.component';
import { CareerCatalogComponent } from './features/autonomous/career-catalog.component';
import { AutonomousCareerDetailComponent } from './features/autonomous/autonomous-career-detail.component';
import { SupportDirectoryComponent } from './features/autonomous/support-directory.component';
import { ReportOverviewComponent } from './features/report/report-overview.component';
import { CoachIaComponent } from './features/coach/coach-ia.component';
import { LoginComponent, LoginSuccessEvent } from './features/auth/login.component';
import { LocalDiscoveryComponent } from './features/local-discovery/local-discovery.component';
import { SettingsComponent } from './features/settings/settings.component';
import { ExplorationDashboardComponent } from './features/exploration/exploration-dashboard.component';
import { CounselorSettingsComponent, CounselorProfileData } from './features/settings/counselor-settings.component';
import {
  JourneyMode,
  UICatalogCareer,
  UISupportResource,
  INITIAL_SUPPORT_RESOURCES
} from './shared/autonomous-data';
import { ONET_CAREERS_CATALOG_DATA } from './shared/onet-careers-data';
import {
  INITIAL_AUDIO_EPISODES,
  INITIAL_CAREER_ASSESSMENTS,
  INITIAL_INTERVIEW_FORM,
  UICareerAssessment,
  UIEpisode
} from './shared/restitution-data';
import {
  IMMERSION_STEPS,
  INITIAL_IMMERSION_PROJECT,
  PARTNER_COMPANIES_DATA,
  UIImmersionProject,
  UIImmersionStep,
  UIPartnerCompany,
  getDefaultActivitiesForCareer,
  getDefaultQuestionsForCareer
} from './shared/immersion-data';

export type YoungTab =
  | 'ACCUEIL'
  | 'ACCUEIL_AUTONOME'
  | 'CATALOGUE_METIERS'
  | 'ANNUAIRE_SUPPORT'
  | 'AUTOUR_DE_MOI'
  | 'MON_BILAN'
  | 'IMMERSION_PRO'
  | 'COACH_IA'
  | 'EXPLORER_METIERS'
  | 'MON_PARCOURS'
  | 'MES_QUESTIONS'
  | 'MES_DOCUMENTS'
  | 'PARAMETRES_JEUNE';

export type CounselorTab =
  | 'TABLEAU_DE_BORD'
  | 'DOSSIERS_JEUNES'
  | 'IMPORTER_RAPPORT'
  | 'VERIFICATION_DONNEES'
  | 'VALIDATIONS_PUBLICATIONS'
  | 'SUIVI_RDV'
  | 'STATISTIQUES'
  | 'PARAMETRES';

export interface UIFact {
  id: string;
  category: 'METADATA' | 'RIASEC_INTEREST' | 'COGNITIVE_APTITUDE' | 'HEXACO_PERSONALITY' | 'CAREER_ZONE';
  label: string;
  codeLetter?: string;
  shortDesc?: string;
  badgeColor?: string;
  rankOrder?: number | null;
  rawExcerpt: string;
  pageNumber: number;
  isVerified: boolean;
}

export interface UICareer {
  id: string;
  jobZone: number;
  rankInZone: number;
  titleFr: string;
  sectorTag: string;
  sectorColor: string;
  educationLevel: string;
  shortSummary: string;
  description: string;
  imageUrl: string;
  pageNumber: number;
  isFavorite?: boolean;
  missions?: string[];
  workConditions?: string[];
  qualities?: string[];
  formations?: string[];
  evolutions?: string[];
}

export interface UIClaim {
  id: string;
  kind: 'PERSONAL_FACT' | 'CAREER_LINK' | 'PEDAGOGICAL_TIP';
  displayOrder: number;
  timestamp: string;
  chapterTitle: string;
  text: string;
  sourceFactIds: string[];
  reviewStatus: 'PENDING' | 'APPROVED' | 'EDITED';
}

export interface UIQuestion {
  id: string;
  tagLabel: string;
  tagColor: string;
  relatedTopic: string;
  questionText: string;
  checked: boolean;
  counselorReply?: string | null;
}

export type CounselorWorkflowStep = 1 | 2 | 3 | 4 | 5 | 6;

export type VoiceTone = 'WARM' | 'CALM' | 'DYNAMIC' | 'PEDAGOGICAL';

export interface VoicePersona {
  id: string;
  name: string;
  gender: 'female' | 'male';
  tag: string;
  tone: VoiceTone;
  pitch: number;
  rate: number;
  avatarIcon: string;
  previewSample: string;
  description: string;
}

export interface ToneOption {
  id: VoiceTone;
  label: string;
  icon: string;
  pitchOffset: number;
  rateMultiplier: number;
  description: string;
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'amelie',
    name: 'Amélie',
    gender: 'female',
    tag: 'Féminine • Chaleureuse & Douce',
    tone: 'WARM',
    pitch: 1.05,
    rate: 1.0,
    avatarIcon: 'flower-2',
    previewSample: "Bonjour ! Je suis Amélie. Découvrons ensemble les pistes passionnantes et positives de ton bilan d'orientation !",
    description: 'Voix bienveillante et naturelle, parfaite pour une restitution rassurante et décontractée.'
  },
  {
    id: 'thomas',
    name: 'Thomas',
    gender: 'male',
    tag: 'Masculin • Posé & Rassurant',
    tone: 'CALM',
    pitch: 0.92,
    rate: 0.95,
    avatarIcon: 'compass',
    previewSample: "Bonjour. Je suis Thomas. Prenons le temps d'analyser posément tes talents et tes domaines d'intérêt.",
    description: 'Voix posée et calme, idéale pour explorer les options méthodiquement sans aucune pression.'
  },
  {
    id: 'camille',
    name: 'Camille',
    gender: 'female',
    tag: 'Féminine • Dynamique & Inspirante',
    tone: 'DYNAMIC',
    pitch: 1.14,
    rate: 1.06,
    avatarIcon: 'zap',
    previewSample: "Salut ! Je suis Camille. C'est parti pour explorer 22 superbes opportunités professionnelles !",
    description: "Voix énergique et motivante, pleine d'enthousiasme pour te projeter vers l'avenir."
  },
  {
    id: 'nicolas',
    name: 'Nicolas',
    gender: 'male',
    tag: 'Masculin • Pédagogique & Structuré',
    tone: 'PEDAGOGICAL',
    pitch: 0.98,
    rate: 0.96,
    avatarIcon: 'graduation-cap',
    previewSample: "Bonjour. Je suis Nicolas. Passons en revue de manière claire et structurée chaque axe de ton rapport.",
    description: 'Voix claire et didactique, parfaite pour bien comprendre la méthode RIASEC et HEXACO.'
  }
];

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'WARM',
    label: 'Chaleureuse',
    icon: 'heart',
    pitchOffset: 0.05,
    rateMultiplier: 1.0,
    description: 'Bienveillante, douce et valorisante'
  },
  {
    id: 'CALM',
    label: 'Posée',
    icon: 'leaf',
    pitchOffset: -0.06,
    rateMultiplier: 0.93,
    description: 'Calme, sereine et rassurante'
  },
  {
    id: 'DYNAMIC',
    label: 'Dynamique',
    icon: 'rocket',
    pitchOffset: 0.09,
    rateMultiplier: 1.06,
    description: 'Énergique, stimulante et entraînante'
  },
  {
    id: 'PEDAGOGICAL',
    label: 'Pédagogique',
    icon: 'library',
    pitchOffset: 0.0,
    rateMultiplier: 0.98,
    description: 'Claire, structurée et explicative'
  }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MbIconComponent, 
    CommonModule,
    FormsModule,
    ImmersionProComponent,
    JourneyChoiceModalComponent,
    AutonomousHomeComponent,
    CareerCatalogComponent,
    AutonomousCareerDetailComponent,
    SupportDirectoryComponent,
    ReportOverviewComponent,
    CoachIaComponent,
    LocalDiscoveryComponent,
    ExplorationDashboardComponent,
    SettingsComponent,
    CounselorSettingsComponent,
    LoginComponent
  ],
  template: `
    <!-- Page de Connexion Premium (Maquette officielle) -->
    <app-login
      *ngIf="!isAuthenticated"
      (loginSuccess)="onLoginSuccess($event)"
      (registerYoung)="onRegisterYoung()"
    ></app-login>

    <!-- Shell Applicatif Protégé (Authentifié) -->
    <div *ngIf="isAuthenticated" class="min-h-screen flex flex-col lg:flex-row bg-[#F4F2FF] text-[#0F1035] font-sans overflow-x-hidden">
      <!-- ================================================================== -->
      <!-- BARRE SUPÉRIEURE MOBILE & TABLETTE (< lg)                          -->
      <!-- ================================================================== -->
      <div class="lg:hidden sticky top-0 z-40 bg-gradient-to-r from-[#131142] via-[#1B1659] to-[#131142] text-white px-4 py-3 flex items-center justify-between gap-2 border-b border-white/15 shadow-md">
        <a href="../" class="flex items-center gap-2.5">
          <div class="rounded-xl bg-white px-2.5 py-1 shadow flex items-center justify-center shrink-0">
            <img src="assets/logo.png" alt="MonBilan+" class="h-6 w-auto object-contain" />
          </div>
          <span class="text-xs font-semibold text-[#C4B5FD] hidden sm:inline-block">
            {{ activePortal === 'YOUNG' ? 'Espace jeune' : 'Espace conseiller' }}
          </span>
        </a>

        <div class="flex items-center gap-2">
          <!-- Badge de rôle strict sur mobile (sans bascule non autorisée) -->
          <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-bold text-[#C4B5FD]">
            <span class="h-1.5 w-1.5 rounded-full" [ngClass]="activePortal === 'YOUNG' ? 'bg-[#10B981]' : 'bg-[#38BDF8]'"></span>
            {{ activePortal === 'YOUNG' ? 'Espace Jeune' : 'Espace Conseiller' }}
          </span>

          <!-- Bouton Hamburger Tiroir Mobile -->
          <button
            type="button"
            (click)="isMobileMenuOpen = !isMobileMenuOpen"
            [attr.aria-expanded]="isMobileMenuOpen"
            aria-label="Ouvrir ou fermer le menu de navigation"
            class="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg font-extrabold text-white"
          >
            {{ isMobileMenuOpen ? '✕' : '☰' }}
          </button>
        </div>
      </div>

      <!-- Fond assombri du tiroir mobile (< lg) -->
      <div
        *ngIf="isMobileMenuOpen"
        (click)="isMobileMenuOpen = false"
        aria-hidden="true"
        class="lg:hidden fixed inset-0 z-40 bg-[#0F1035]/60 backdrop-blur-xs"
      ></div>

      <!-- ================================================================== -->
      <!-- SIDEBAR FIXE À GAUCHE (Desktop) / TIROIR COULISSANT (Mobile < lg)  -->
      <!-- ================================================================== -->
      <aside
        [class]="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        class="fixed inset-y-0 left-0 z-40 w-[280px] max-w-[85vw] lg:w-[280px] shrink-0 h-dvh bg-gradient-to-b from-[#131142] via-[#1B1659] to-[#120E38] text-white flex flex-col justify-between overflow-hidden border-r border-white/10 transition-transform duration-200 ease-out shadow-2xl lg:shadow-none"
      >
        <!-- En-tête / Logo (Fixe, shrink-0) -->
        <div class="p-4 sm:p-5 shrink-0 border-b border-white/10 space-y-3">
          <div class="flex items-center justify-between">
            <a href="../" class="group flex flex-col gap-1.5 w-full focus:outline-none" title="Retour à la landing page MonBilan+">
              <div class="rounded-xl bg-white px-3 py-1.5 shadow-sm group-hover:shadow-md transition flex items-center justify-center">
                <img
                  src="assets/logo.png"
                  alt="MonBilan+"
                  class="h-8 w-auto object-contain"
                />
              </div>
              <div class="px-1">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[11px] font-bold text-[#C4B5FD]">
                  <span class="h-1.5 w-1.5 rounded-full" [ngClass]="activePortal === 'YOUNG' ? 'bg-[#10B981]' : 'bg-[#38BDF8]'"></span>
                  {{ activePortal === 'YOUNG' ? 'Espace Jeune' : 'Espace Conseiller' }}
                </span>
              </div>
            </a>
            <button
              type="button"
              (click)="isMobileMenuOpen = false"
              aria-label="Fermer le menu"
              class="lg:hidden h-8 w-8 rounded-lg bg-white/10 text-white text-sm font-bold flex items-center justify-center shrink-0 ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Navigation défilable indépendamment (min-h-0 flex-1 overflow-y-auto overscroll-contain) -->
        <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-4 space-y-1">

          <!-- MENU ESPACE JEUNE -->
          <nav *ngIf="activePortal === 'YOUNG'" aria-label="Menu Espace Jeune" class="space-y-1">
            <button
              *ngFor="let item of currentYoungNavItems"
              type="button"
              (click)="selectYoungTab(item.id)"
              [class]="(activeYoungTab === item.id || (item.id === 'IMMERSION_PRO' && activeYoungTab === 'EXPLORER_METIERS'))
                ? 'bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white shadow-md font-extrabold'
                : 'text-[#E7E8FB]/85 hover:bg-white/10 hover:text-white font-medium'"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] transition text-left"
            >
              <span class="flex items-center gap-3 truncate">
                <span class="w-4 h-4 flex items-center justify-center flex-shrink-0" [ngSwitch]="item.id">
                  <svg *ngSwitchCase="'ACCUEIL'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <svg *ngSwitchCase="'ACCUEIL_AUTONOME'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <svg *ngSwitchCase="'CATALOGUE_METIERS'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <svg *ngSwitchCase="'ANNUAIRE_SUPPORT'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  <svg *ngSwitchCase="'AUTOUR_DE_MOI'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <svg *ngSwitchCase="'MON_BILAN'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"/></svg>
                  <svg *ngSwitchCase="'IMMERSION_PRO'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <svg *ngSwitchCase="'COACH_IA'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z"/></svg>
                  <svg *ngSwitchCase="'MON_PARCOURS'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                  <svg *ngSwitchCase="'MES_QUESTIONS'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  <svg *ngSwitchCase="'MES_DOCUMENTS'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                  <svg *ngSwitchCase="'PARAMETRES_JEUNE'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span *ngSwitchDefault class="text-sm"><mb-icon [name]="item.icon"></mb-icon></span>
                </span>
                <span class="truncate">{{ item.label }}</span>
              </span>
              <span
                *ngIf="item.badge"
                class="rounded-full bg-emerald-400/25 border border-emerald-300/40 text-emerald-300 font-extrabold px-1.5 py-0.2 text-[9px] uppercase tracking-wider ml-1"
              >
                {{ item.badge }}
              </span>
            </button>
          </nav>

          <!-- MENU ESPACE CONSEILLER -->
          <nav *ngIf="activePortal === 'COUNSELOR'" aria-label="Menu Espace Conseiller" class="space-y-1">
            <button
              *ngFor="let item of counselorNavItems"
              type="button"
              (click)="selectCounselorTab(item.id)"
              [class]="(activeCounselorTab === item.id || (item.id === 'IMPORTER_RAPPORT' && (activeCounselorTab === 'VERIFICATION_DONNEES' || activeCounselorTab === 'VALIDATIONS_PUBLICATIONS')))
                ? 'bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white shadow-md font-extrabold'
                : 'text-[#E7E8FB]/85 hover:bg-white/10 hover:text-white font-medium'"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] transition text-left"
            >
              <span class="flex items-center gap-3 truncate">
                <span class="w-4 h-4 flex items-center justify-center flex-shrink-0" [ngSwitch]="item.id">
                  <svg *ngSwitchCase="'TABLEAU_DE_BORD'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <svg *ngSwitchCase="'DOSSIERS_JEUNES'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  <svg *ngSwitchCase="'IMPORTER_RAPPORT'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  <svg *ngSwitchCase="'VERIFICATION_DONNEES'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  <svg *ngSwitchCase="'VALIDATIONS_PUBLICATIONS'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  <svg *ngSwitchCase="'SUIVI_RDV'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <svg *ngSwitchCase="'STATISTIQUES'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  <svg *ngSwitchCase="'PARAMETRES'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span *ngSwitchDefault class="text-sm"><mb-icon [name]="item.icon"></mb-icon></span>
                </span>
                <span class="truncate">{{ item.label }}</span>
              </span>
              <span
                *ngIf="item.badge"
                class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold text-white ml-1.5"
              >
                {{ item.badge }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Partie basse de la Sidebar : Profil utilisateur & Déconnexion (Fidèle à la maquette) -->
        <div class="p-3.5 pt-0 shrink-0 space-y-2">
          <!-- Carte Jeune Passe à l'action (Mockup Officiel) -->
          <div
            *ngIf="activePortal === 'YOUNG'"
            (click)="selectYoungTab('AUTOUR_DE_MOI')"
            class="rounded-2xl bg-gradient-to-br from-[#8B3DFF]/35 to-[#581C87]/45 border border-[#A855F7]/35 p-3 text-left space-y-1.5 shadow-md backdrop-blur-sm cursor-pointer hover:border-[#A855F7]/60 transition group mb-2"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-2xl group-hover:scale-110 transition flex-shrink-0"><mb-icon name="target"></mb-icon></span>
              <div class="min-w-0">
                <p class="text-xs font-black text-white group-hover:text-purple-200 transition">
                  Passe à l'action !
                </p>
                <p class="text-[10px] text-[#E7E8FB]/80 leading-tight">
                  Trouve une formation, un organisme ou une immersion près de toi.
                </p>
              </div>
            </div>
          </div>

          <!-- Carte Profil & Se Déconnecter -->
          <div class="rounded-2xl bg-gradient-to-br from-[#241B5C]/90 to-[#171242]/90 border border-white/15 p-3 text-left space-y-2.5 shadow-lg backdrop-blur-sm">
            <div
              (click)="activePortal === 'YOUNG' ? selectYoungTab('PARAMETRES_JEUNE') : selectCounselorTab('PARAMETRES')"
              class="flex items-center gap-2.5 cursor-pointer group"
              title="Accéder aux paramètres du compte"
            >
              <!-- Photo de profil -->
              <div class="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border-2 border-[#A855F7]/60 bg-gradient-to-br from-[#7C3AED] to-[#6328E8] flex items-center justify-center text-white font-black text-xs shadow-md">
                <img
                  *ngIf="activePortal === 'YOUNG'"
                  [src]="userPhotoUrl"
                  alt="Photo de profil"
                  class="h-full w-full object-cover"
                  onerror="this.style.display='none'"
                />
                <img
                  *ngIf="activePortal === 'COUNSELOR' && counselorPhotoUrl"
                  [src]="counselorPhotoUrl"
                  alt="Sophie Martin"
                  class="h-full w-full object-cover"
                  onerror="this.style.display='none'"
                />
                <span *ngIf="activePortal === 'YOUNG'">ED</span>
                <span *ngIf="activePortal === 'COUNSELOR' && !counselorPhotoUrl">{{ getCounselorInitials() }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-black text-white group-hover:text-purple-200 transition truncate leading-tight">
                  {{ activePortal === 'YOUNG' ? currentUserDisplayName : counselorDisplayName }}
                </p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="h-1.5 w-1.5 rounded-full" [ngClass]="activePortal === 'YOUNG' ? 'bg-[#10B981]' : 'bg-[#38BDF8]'"></span>
                  <span class="text-[10px] font-bold text-[#C4B5FD] truncate">
                    {{ activePortal === 'YOUNG' ? 'Espace Jeune' : 'Espace Conseiller' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Bouton Se déconnecter -->
            <button
              type="button"
              (click)="logout()"
              class="flex items-center justify-center gap-2 w-full rounded-xl bg-white/10 hover:bg-rose-500/25 text-[#F1F0FB] hover:text-white border border-white/10 hover:border-rose-400/40 py-2 text-xs font-extrabold transition shadow-xs cursor-pointer group"
              title="Se déconnecter de la session"
            >
              <svg class="h-4 w-4 text-[#F1F0FB] group-hover:text-rose-200 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- ================================================================== -->
      <!-- ZONE PRINCIPALE (TOPBAR + CONTENU DE LA VUE ACTIVE)                -->
      <!-- ================================================================== -->
      <div class="flex-1 flex flex-col min-w-0 lg:ml-[280px] min-h-dvh overflow-y-auto">
        <!-- TOPBAR (Titre / Salutation à gauche + Recherche, Cloche SVG & Profil alignés à droite) -->
        <header *ngIf="activeYoungTab !== 'MON_BILAN' || activePortal === 'COUNSELOR'" class="bg-white/90 backdrop-blur-md border-b border-[#E4E0F5] px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30">
          <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <!-- Titre dynamique à gauche (min-w-0 flex-1 pour ne jamais pousser le bloc droit à la ligne) -->
            <div class="min-w-0 flex-1">
              <ng-container *ngIf="activePortal === 'YOUNG'">
                <div *ngIf="activeYoungTab === 'ACCUEIL' && journeyMode === 'SUPPORTED'">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] truncate">
                    Bonjour Emma
                  </h1>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    Bienvenue sur <strong>MonBilan+</strong>, ton espace pour comprendre ton bilan (Rdv {{ rdvNumber }}) et explorer des pistes de métiers.
                  </p>
                </div>
                <div *ngIf="activeYoungTab === 'ACCUEIL_AUTONOME' || (journeyMode === 'AUTONOMOUS' && activeYoungTab === 'ACCUEIL')">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] truncate">
                    Parcours Autonome
                  </h1>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    Explore les métiers librement, prépare une immersion et trouve un accompagnement si tu en as besoin.
                  </p>
                </div>
                <div *ngIf="activeYoungTab === 'CATALOGUE_METIERS'">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] truncate">
                    Catalogue des Métiers O*NET FR
                  </h1>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    721 métiers officiels traduits et structurés par durée d'études et centres d'intérêt.
                  </p>
                </div>
                <div *ngIf="activeYoungTab === 'ANNUAIRE_SUPPORT'">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] truncate">
                    Trouver un accompagnement
                  </h1>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    CIO, Mission Locale de Nice, équipes scolaires et dispositifs publics gratuits.
                  </p>
                </div>
                <div *ngIf="activeYoungTab === 'AUTOUR_DE_MOI'" class="flex items-center gap-2">
                  <div class="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#6D28D9]">
                    <span class="text-base"><mb-icon name="house"></mb-icon></span>
                    <span>&gt;</span>
                    <span class="text-[#0F1035] font-extrabold">Autour de moi</span>
                  </div>
                </div>
                <div *ngIf="activeYoungTab === 'MON_BILAN'">
                  <div class="flex items-center gap-2">
                    <span class="text-xl"><mb-icon name="briefcase"></mb-icon></span>
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] truncate">
                      Mon bilan d'orientation
                    </h1>
                  </div>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    Dossier Rdv {{ rdvNumber }} · Rapport de 17 pages
                  </p>
                </div>
                <div *ngIf="activeYoungTab === 'COACH_IA'" class="flex items-center gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#6D28D9]">
                      <span>Mon Coach IA</span>
                      <span>&gt;</span>
                      <span class="text-[#0F1035] font-extrabold">Atelier de communication</span>
                    </div>
                    <p class="text-xs text-[#42466B] line-clamp-1 hidden sm:block">
                      Ton assistant pour trouver les bons mots, préparer tes contacts et communiquer avec les professionnels.
                    </p>
                  </div>
                </div>
                <div *ngIf="activeYoungTab === 'IMMERSION_PRO' || activeYoungTab === 'EXPLORER_METIERS'" class="flex items-center gap-3">
                  <button
                    *ngIf="immersionStepActive > 1"
                    type="button"
                    (click)="immersionStepActive = immersionStepActive - 1"
                    class="h-9 w-9 shrink-0 rounded-full bg-white border border-[#D8DCF0] flex items-center justify-center font-bold text-[#1B1B62] hover:bg-[#F3EFFE] transition shadow-xs"
                    title="Revenir à l’étape précédente"
                  >
                    ←
                  </button>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#6D28D9]">
                      <button type="button" (click)="immersionStepActive = 1" class="hover:underline">Immersion Pro</button>
                      <span class="text-[#A78BFA]">&gt;</span>
                      <span class="text-[#0F1035] font-extrabold truncate">Mon projet d'immersion</span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1 mt-0.5">
                      Découvre un métier sur le terrain grâce à un stage d'observation et vis une expérience concrète en entreprise.
                    </p>
                  </div>
                </div>
                <div *ngIf="activeYoungTab === 'MON_PARCOURS'">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] flex items-center gap-2.5 truncate">
                    <svg class="h-6 w-6 text-[#7C3AED] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                    <span class="truncate">Mon parcours d’exploration</span>
                  </h1>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    Suis tes étapes, enregistre tes découvertes et prépare la suite avec ton conseiller.
                  </p>
                </div>
                <div *ngIf="activeYoungTab === 'MES_QUESTIONS'">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] flex items-center gap-2.5 truncate">
                    <svg class="h-6 w-6 text-[#7C3AED] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    <span class="truncate">Mes questions</span>
                  </h1>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    Note tes questions, tes idées et tes doutes pour préparer ton prochain échange avec ton conseiller.
                  </p>
                </div>
                <div *ngIf="activeYoungTab === 'MES_DOCUMENTS'">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] flex items-center gap-2.5 truncate">
                    <svg class="h-6 w-6 text-[#7C3AED] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    <span class="truncate">Mes documents</span>
                  </h1>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    Retrouve ici ton rapport Rdv {{ rdvNumber }}, tes restitutions et tous les documents utiles à ton orientation.
                  </p>
                </div>
                <div *ngIf="activeYoungTab === 'PARAMETRES_JEUNE'">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] flex items-center gap-2.5 truncate">
                    <svg class="h-6 w-6 text-[#7C3AED] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span class="truncate">Mes paramètres</span>
                  </h1>
                  <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                    Personnalise ton expérience et garde le contrôle sur tes informations.
                  </p>
                </div>
              </ng-container>

              <ng-container *ngIf="activePortal === 'COUNSELOR'">
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F1035] truncate">
                  {{ getCounselorHeaderTitle() }}
                </h1>
                <p class="text-xs sm:text-sm text-[#42466B] line-clamp-1">
                  {{ getCounselorHeaderSubtitle() }}
                </p>
              </ng-container>
            </div>

            <!-- BLOC DROIT TOUJOURS ALIGNÉ À DROITE : Recherche SVG + Cloche Notification + Menu Profil -->
            <div class="shrink-0 flex items-center justify-end gap-2.5 sm:gap-3.5 ml-auto">
              <!-- Barre de recherche vectorielle avec badge ⌘K fidèle aux maquettes -->
              <div class="relative hidden md:block">
                <svg
                  class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6D28D9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path stroke-linecap="round" d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  [(ngModel)]="searchQuery"
                  [placeholder]="activePortal === 'YOUNG' ? 'Rechercher un métier, une formation…' : 'Rechercher un jeune, un dossier…'"
                  class="w-56 lg:w-72 rounded-full bg-[#F6F4FF] border border-[#DFD8F7] pl-10 pr-12 py-2.5 text-xs font-semibold text-[#0F1035] placeholder-[#6E7191] shadow-[inset_0_1px_2px_rgba(15,16,53,0.03)] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition"
                />
                <kbd class="pointer-events-none hidden lg:inline-flex items-center rounded-md bg-white border border-[#E2DCFA] px-1.5 py-0.5 text-[10px] font-extrabold text-[#6D28D9] absolute right-3 top-1/2 -translate-y-1/2 shadow-2xs">
                  ⌘K
                </kbd>
              </div>

              <!-- Cloche de notification vectorielle + Popover de notifications aligné à droite -->
              <div class="relative">
                <button
                  type="button"
                  (click)="toggleNotificationsPanel()"
                  [attr.aria-expanded]="isNotificationsOpen"
                  aria-label="Ouvrir les notifications"
                  class="relative h-11 w-11 rounded-full bg-white border border-[#E2DCFA] flex items-center justify-center text-[#1B1659] shadow-[0_2px_10px_rgba(109,40,217,0.08)] hover:bg-[#F5F2FF] hover:border-[#7C3AED] transition focus:outline-none"
                >
                  <!-- Icône Cloche SVG propre (comme sur la maquette) -->
                  <svg class="h-5 w-5 text-[#1B1659]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>

                  <!-- Pastille compteur de notifications -->
                  <span
                    *ngIf="unreadNotificationsCount > 0"
                    class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-[#EF4444] to-[#EC4899] text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-sm"
                  >
                    {{ unreadNotificationsCount }}
                  </span>
                </button>

                <!-- Popover de notifications déroulant à droite -->
                <div
                  *ngIf="isNotificationsOpen"
                  class="absolute right-0 top-[calc(100%+10px)] w-80 sm:w-96 rounded-[24px] bg-white border border-[#E2DCFA] shadow-[0_18px_45px_rgba(19,17,66,0.16)] p-4 z-50 space-y-3"
                >
                  <div class="flex items-center justify-between pb-2.5 border-b border-[#F0EDFA]">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-extrabold text-[#0F1035]">Notifications</span>
                      <span class="rounded-full bg-[#F3EFFE] text-[#6D28D9] px-2 py-0.5 text-[11px] font-extrabold">
                        {{ unreadNotificationsCount }} nouvelle(s)
                      </span>
                    </div>
                    <button
                      type="button"
                      (click)="markAllNotificationsRead()"
                      class="text-[11px] font-extrabold text-[#6D28D9] hover:underline"
                    >
                      Tout marquer lu
                    </button>
                  </div>

                  <div class="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                    <button
                      *ngFor="let notif of currentNotifications"
                      type="button"
                      (click)="onNotificationClick(notif)"
                      [class]="notif.unread ? 'bg-[#F6F3FF] border-[#D8CEFF]' : 'bg-[#FAFAFE] border-[#ECE9F9]'"
                      class="w-full text-left rounded-2xl border p-3 hover:border-[#7C3AED] transition flex items-start gap-3"
                    >
                      <span
                        [class]="notif.badgeBg"
                        class="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-extrabold"
                      >
                        <mb-icon [name]="notif.icon"></mb-icon>
                      </span>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-2">
                          <p class="text-xs font-extrabold text-[#0F1035] truncate">{{ notif.title }}</p>
                          <span *ngIf="notif.unread" class="h-2 w-2 rounded-full bg-[#7C3AED] shrink-0"></span>
                        </div>
                        <p class="text-[11px] text-[#42466B] leading-snug mt-0.5">{{ notif.message }}</p>
                        <span class="text-[10px] font-bold text-[#6D28D9] mt-1 block">{{ notif.time }}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Pilule Profil Utilisateur à droite avec avatar + nom + chevron SVG -->
              <div class="relative">
                <button
                  type="button"
                  (click)="toggleProfileMenu()"
                  [attr.aria-expanded]="isProfileMenuOpen"
                  class="rounded-full bg-white border border-[#E2DCFA] pl-1.5 pr-2.5 sm:pr-3.5 py-1.5 shadow-[0_2px_10px_rgba(109,40,217,0.06)] hover:border-[#7C3AED] transition flex items-center gap-2.5 focus:outline-none"
                >
                  <div class="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-[#7C3AED] to-[#6328E8] text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
                    <img
                      *ngIf="activePortal === 'YOUNG'"
                      [src]="userPhotoUrl"
                      alt="Emma D."
                      class="h-full w-full object-cover"
                      onerror="this.style.display='none'"
                    />
                    <img
                      *ngIf="activePortal === 'COUNSELOR' && counselorPhotoUrl"
                      [src]="counselorPhotoUrl"
                      alt="Sophie Martin"
                      class="h-full w-full object-cover"
                      onerror="this.style.display='none'"
                    />
                    <span *ngIf="activePortal === 'YOUNG'">ED</span>
                    <span *ngIf="activePortal === 'COUNSELOR' && !counselorPhotoUrl">{{ getCounselorInitials() }}</span>
                  </div>
                  <div class="hidden sm:block text-left">
                    <span class="text-xs font-extrabold text-[#0F1035] block leading-tight">
                      {{ activePortal === 'YOUNG' ? currentUserDisplayName : counselorDisplayName }}
                    </span>
                    <span class="text-[11px] text-[#42466B] block leading-tight">
                      {{ activePortal === 'YOUNG' ? (journeyMode === 'AUTONOMOUS' ? 'Parcours autonome' : 'Dossier Rdv 2187') : 'Conseiller' }}
                    </span>
                  </div>
                  <svg class="h-4 w-4 text-[#42466B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Menu déroulant Profil à droite -->
                <div
                  *ngIf="isProfileMenuOpen"
                  class="absolute right-0 top-[calc(100%+10px)] w-60 rounded-[22px] bg-white border border-[#E2DCFA] shadow-[0_18px_45px_rgba(19,17,66,0.16)] p-2.5 z-50 space-y-1 text-xs font-bold text-[#0F1035]"
                >
                  <div class="px-3 py-2 border-b border-[#F0EDFA] flex items-center gap-2.5">
                    <div class="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-[#7C3AED] to-[#6328E8] text-white font-black text-xs flex items-center justify-center shrink-0">
                      <img
                        *ngIf="activePortal === 'YOUNG'"
                        [src]="userPhotoUrl"
                        alt="Photo"
                        class="h-full w-full object-cover"
                        onerror="this.style.display='none'"
                      />
                      <img
                        *ngIf="activePortal === 'COUNSELOR' && counselorPhotoUrl"
                        [src]="counselorPhotoUrl"
                        alt="Photo"
                        class="h-full w-full object-cover"
                        onerror="this.style.display='none'"
                      />
                      <span *ngIf="activePortal === 'YOUNG'">ED</span>
                      <span *ngIf="activePortal === 'COUNSELOR' && !counselorPhotoUrl">{{ getCounselorInitials() }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="font-extrabold text-[#0F1035] truncate">{{ activePortal === 'YOUNG' ? (journeyMode === 'AUTONOMOUS' ? 'Jeune Autonome' : currentUserDisplayName) : counselorDisplayName }}</p>
                      <p class="text-[11px] text-[#42466B] font-normal truncate">{{ activePortal === 'YOUNG' ? (journeyMode === 'AUTONOMOUS' ? 'Parcours libre • Nice' : 'Centre des Possibles • Nice') : 'Conseiller • Nice' }}</p>
                    </div>
                  </div>
                  <div *ngIf="activePortal === 'YOUNG'" class="p-1 border-b border-[#F0EDFA]">
                    <button
                      type="button"
                      (click)="isJourneyChoiceModalOpen = true; isProfileMenuOpen = false"
                      class="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F3EFFE] text-[#7C3AED] font-extrabold text-xs flex items-center justify-between"
                    >
                      <span>Mode : <mb-icon [name]="journeyMode === 'AUTONOMOUS' ? 'compass' : 'handshake'"></mb-icon> {{ journeyMode === 'AUTONOMOUS' ? 'Autonome' : 'Accompagné' }}</span>
                      <span class="text-xs"><mb-icon name="refresh-cw"></mb-icon></span>
                    </button>
                  </div>
                  <button
                    type="button"
                    (click)="openSettingsFromProfileMenu()"
                    class="w-full text-left rounded-xl px-3 py-2 hover:bg-[#F5F2FF] text-[#0F1035] flex items-center gap-2.5"
                  >
                    <span><mb-icon name="settings"></mb-icon></span>
                    <span>Paramètres &amp; Confidentialité</span>
                  </button>
                  <button
                    type="button"
                    (click)="logout(); isProfileMenuOpen = false"
                    class="w-full text-left rounded-xl px-3 py-2 hover:bg-red-50 text-red-600 font-extrabold flex items-center gap-2.5 border-t border-[#F0EDFA] mt-1 pt-2"
                  >
                    <span><mb-icon name="door-open"></mb-icon></span>
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Notification flash -->
        <div *ngIf="statusBanner" class="mx-6 mt-4">
          <div class="max-w-7xl mx-auto rounded-2xl bg-white border-2 border-[#7C3AED] px-5 py-3 shadow-md flex items-center justify-between text-xs sm:text-sm font-bold text-[#0F1035]">
            <span>{{ statusBanner }}</span>
            <button type="button" (click)="statusBanner = ''" class="text-[#7C3AED] underline ml-4">Fermer</button>
          </div>
        </div>

        <!-- CONTENU PRINCIPAL DÉFILANT -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 pb-28 sm:pb-32 lg:pb-36 max-w-7xl w-full mx-auto space-y-6">

          <!-- ============================================================== -->
          <!-- PORTAIL 1 : ESPACE JEUNE                                       -->
          <!-- ============================================================== -->
          <ng-container *ngIf="activePortal === 'YOUNG'">
            <!-- Garde si le conseiller a dépublié le dossier -->
            <div
              *ngIf="restitutionStatus !== 'PUBLISHED'"
              class="rounded-3xl bg-white border-2 border-[#F59E0B] p-8 text-center shadow-sm space-y-4 my-6"
            >
              <div class="text-4xl"><mb-icon name="hourglass"></mb-icon></div>
              <h2 class="text-2xl font-extrabold text-[#0F1035]">
                Ta restitution est en cours de vérification par ton conseiller
              </h2>
              <p class="text-sm text-[#42466B] max-w-xl mx-auto">
                Les restitutions sont vérifiées et validées par un professionnel avant d’être mises à disposition du jeune.
              </p>
              <button
                type="button"
                (click)="openCounselorValidation()"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-6 py-3 text-sm font-bold shadow"
              >
                Basculer sur l’Espace Conseiller pour valider et publier →
              </button>
            </div>

            <ng-container *ngIf="restitutionStatus === 'PUBLISHED'">
              <!-- ========================================================== -->
              <!-- VUES DU PARCOURS AUTONOME (Écrans 1, 2, 3, 6 des maquettes)-->
              <!-- ========================================================== -->
              <!-- ÉCRAN 1 : ACCUEIL AUTONOME -->
              <div *ngIf="activeYoungTab === 'ACCUEIL_AUTONOME' || (journeyMode === 'AUTONOMOUS' && activeYoungTab === 'ACCUEIL')" class="space-y-6">
                <app-autonomous-home
                  [favoriteCount]="catalogFavoritesCount"
                  (navigateTo)="handleAutonomousHomeNav($event)"
                  (openModeModal)="isJourneyChoiceModalOpen = true"
                ></app-autonomous-home>
              </div>

              <!-- ÉCRAN 2 & 3 : CATALOGUE DES 721 MÉTIERS ET FICHE SIMPLIFIÉE -->
              <div *ngIf="activeYoungTab === 'CATALOGUE_METIERS'" class="space-y-6">
                <app-career-catalog
                  *ngIf="!selectedAutonomousCareerDetail"
                  [allCareers]="catalogCareers"
                  (selectCareerDetail)="selectedAutonomousCareerDetail = $event"
                  (startImmersion)="startImmersionFromCatalog($event)"
                  (favoriteToggled)="onCatalogFavoriteToggled($event)"
                ></app-career-catalog>

                <app-autonomous-career-detail
                  *ngIf="selectedAutonomousCareerDetail"
                  [career]="selectedAutonomousCareerDetail"
                  (backToCatalog)="selectedAutonomousCareerDetail = null"
                  (startImmersion)="startImmersionFromCatalog($event)"
                  (findSupport)="selectYoungTab('ANNUAIRE_SUPPORT')"
                  (favoriteToggled)="onCatalogFavoriteToggled($event)"
                ></app-autonomous-career-detail>
              </div>

              <!-- ÉCRAN 6 : ANNUAIRE DES STRUCTURES D'ACCOMPAGNEMENT -->
              <div *ngIf="activeYoungTab === 'ANNUAIRE_SUPPORT'" class="space-y-6">
                <app-support-directory
                  [resources]="supportResources"
                  (goToImmersion)="selectYoungTab('IMMERSION_PRO')"
                ></app-support-directory>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE 1 : ACCUEIL ACCOMPAGNÉ (Fidèle à Tableau de bord Emma) -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'ACCUEIL' && journeyMode === 'SUPPORTED'" class="space-y-6">
                <!-- Bannière Hero violette avec Emma au casque + 2 CTA + 4 pilules inclinées à droite -->
                <div class="relative rounded-[28px] bg-gradient-to-r from-[#1A1354] via-[#4C1D95] to-[#6D28D9] text-white p-6 sm:p-8 shadow-lg overflow-hidden">
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                    <div class="lg:col-span-7 space-y-4">
                      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                        Découvre ton bilan,<br />
                        <span class="inline-block rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#A855F7] px-3.5 py-0.5 mt-1">explore tes possibles !</span>
                      </h2>
                      <p class="text-sm text-[#E7E8FB] leading-relaxed max-w-xl">
                        Écoute ta restitution, comprends tes résultats et découvre des métiers qui s’y rapportent (Rapport Rdv {{ rdvNumber }}).
                      </p>
                      <div class="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="button"
                          (click)="openAudioRestitutionView()"
                          class="rounded-full bg-gradient-to-r from-[#EC4899] to-[#D946EF] hover:opacity-95 text-white px-5 py-2.5 text-sm font-extrabold shadow-md flex items-center gap-2"
                        >
                          <span>▶</span>
                          <span>Écouter mon bilan (≈ 6 min)</span>
                        </button>
                        <button
                          type="button"
                          (click)="selectYoungTab('MES_DOCUMENTS')"
                          class="rounded-full bg-white/15 hover:bg-white/25 border border-white/40 text-white px-5 py-2.5 text-sm font-bold flex items-center gap-2"
                        >
                          <span><mb-icon name="file-text"></mb-icon></span>
                          <span>Voir mon rapport</span>
                        </button>
                      </div>
                    </div>

                    <!-- 4 pilules blanches inclinées à droite -->
                    <div class="lg:col-span-5 space-y-2.5">
                      <button
                        type="button"
                        (click)="selectYoungTab('MON_BILAN')"
                        class="w-full rounded-full bg-white/95 text-[#0F1035] px-5 py-2.5 text-sm font-extrabold shadow flex items-center gap-3 hover:translate-x-1 transition -rotate-1"
                      >
                        <span class="text-[#EC4899]">♡</span>
                        <span>Mes intérêts (RIASEC)</span>
                      </button>
                      <button
                        type="button"
                        (click)="selectYoungTab('MON_BILAN')"
                        class="w-full rounded-full bg-white/95 text-[#0F1035] px-5 py-2.5 text-sm font-extrabold shadow flex items-center gap-3 hover:translate-x-1 transition"
                      >
                        <span class="text-[#7C3AED]"><mb-icon name="chart-column"></mb-icon></span>
                        <span>Mes aptitudes</span>
                      </button>
                      <button
                        type="button"
                        (click)="selectYoungTab('EXPLORER_METIERS')"
                        class="w-full rounded-full bg-white/95 text-[#0F1035] px-5 py-2.5 text-sm font-extrabold shadow flex items-center gap-3 hover:translate-x-1 transition rotate-1"
                      >
                        <span class="text-[#EC4899]"><mb-icon name="briefcase"></mb-icon></span>
                        <span>Des métiers à découvrir ({{ careers.length }})</span>
                      </button>
                      <button
                        type="button"
                        (click)="selectYoungTab('MON_PARCOURS')"
                        class="w-full rounded-full bg-white/95 text-[#0F1035] px-5 py-2.5 text-sm font-extrabold shadow flex items-center gap-3 hover:translate-x-1 transition"
                      >
                        <span class="text-[#7C3AED]"><mb-icon name="target"></mb-icon></span>
                        <span>Mes prochaines étapes</span>
                      </button>
                    </div>
                  </div>
                </div>



                <!-- Rangée du bas : "Mon parcours d'exploration (2/4)" + "Mon prochain rendez-vous (MAR 18 NOV)" -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <!-- Stepper horizontal 1..4 + Jauge 2/4 étapes -->
                  <div class="lg:col-span-6 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div class="space-y-4 flex-1">
                      <h3 class="text-lg font-extrabold text-[#0F1035] flex items-center gap-2">
                        <span class="text-[#7C3AED]"><mb-icon name="target"></mb-icon></span>
                        <span>Mon parcours d’exploration</span>
                      </h3>
                      <div class="grid grid-cols-4 gap-2 text-center text-xs">
                        <div class="space-y-1">
                          <span class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#7C3AED] text-white font-bold">✓</span>
                          <span class="block font-bold text-[#0F1035]">Découvrir mon bilan</span>
                        </div>
                        <div class="space-y-1">
                          <span class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#7C3AED] text-white font-bold">2</span>
                          <span class="block font-bold text-[#0F1035]">Explorer des métiers</span>
                        </div>
                        <div class="space-y-1">
                          <span class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#F3EFFE] text-[#6D28D9] font-bold">3</span>
                          <span class="block text-[#42466B]">Noter mes questions</span>
                        </div>
                        <div class="space-y-1">
                          <span class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#F3EFFE] text-[#6D28D9] font-bold">4</span>
                          <span class="block text-[#42466B]">Préparer mon RDV</span>
                        </div>
                      </div>
                    </div>

                    <div class="h-24 w-24 rounded-full border-8 border-[#EDE9FE] border-t-[#7C3AED] border-r-[#7C3AED] flex flex-col items-center justify-center shrink-0">
                      <span class="text-xl font-extrabold text-[#0F1035]">2/4</span>
                      <span class="text-[11px] text-[#42466B]">étapes</span>
                    </div>
                  </div>

                  <!-- Mon prochain rendez-vous -->
                  <div class="lg:col-span-6 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                    <h3 class="text-lg font-extrabold text-[#0F1035] flex items-center gap-2">
                      <span class="text-[#7C3AED]"><mb-icon name="calendar"></mb-icon></span>
                      <span>Mon prochain rendez-vous</span>
                    </h3>
                    <div class="flex flex-wrap items-center justify-between gap-4">
                      <div class="flex items-center gap-4">
                        <div class="rounded-2xl bg-[#F3EFFE] border border-[#D8CEFF] px-4 py-2.5 text-center">
                          <span class="text-[11px] font-extrabold uppercase text-[#6D28D9] block">MER</span>
                          <span class="text-2xl font-black text-[#0F1035] leading-none">18</span>
                          <span class="text-[11px] font-bold text-[#42466B] block">NOV</span>
                        </div>
                        <div class="space-y-1 text-xs sm:text-sm">
                          <p class="font-extrabold text-[#0F1035]">Échange avec mon conseiller</p>
                          <p class="text-[#42466B]"><mb-icon name="clock"></mb-icon> 14h30 – 15h30 • <mb-icon name="map-pin"></mb-icon> Centre des Possibles (Nice)</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        (click)="selectYoungTab('MES_QUESTIONS')"
                        class="rounded-full border-2 border-[#7C3AED] text-[#6D28D9] hover:bg-[#F3EFFE] px-5 py-2 text-xs font-extrabold transition"
                      >
                        Préparer mes questions →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE 2 : MON BILAN (Refonte Premium conforme Maquette) -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'MON_BILAN'" class="space-y-6">
                <app-report-overview
                  [rdvNumber]="rdvNumber"
                  [pageCount]="17"
                  [reportDate]="reportDate"
                  [journeyMode]="journeyMode"
                  [careers]="careers"
                  [audioEpisodes]="audioEpisodes"
                  [riasecOrderedDisplay]="riasecOrderedDisplay"
                  (navigateTab)="selectYoungTab($any($event))"
                  (exploreCareers)="selectYoungTab('IMMERSION_PRO')"
                  (saveQuestion)="onSaveQuestionFromBilan($event)"
                ></app-report-overview>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE : AUTOUR DE MOI (Découverte territoriale Nice 06) -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'AUTOUR_DE_MOI'">
                <app-local-discovery
                  [initialCareer]="selectedLocalCareer"
                  (navigateToCoach)="handleLocalToCoach($event)"
                  (navigateToImmersion)="handleLocalToImmersion($event)"
                ></app-local-discovery>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE : MON COACH IA (Atelier de communication)         -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'COACH_IA'" class="space-y-6">
                <app-coach-ia
                  [youngDisplayName]="'Emma D.'"
                  (saveImmersion)="onSaveImmersionMessage($event)"
                ></app-coach-ia>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE 3 : IMMERSION PRO (Conforme à la maquette & cahier des charges) -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'IMMERSION_PRO' || activeYoungTab === 'EXPLORER_METIERS'" class="space-y-6">
                <!-- Parcours Immersion Pro en 6 étapes (Maquette) -->
                <app-immersion-pro
                  *ngIf="!selectedCareerDetail"
                  [careers]="careers"
                  [careerAssessments]="careerAssessments"
                  [project]="immersionProject"
                  (careerSelected)="startImmersionForCareer($event)"
                  (viewDetail)="selectedCareerDetail = $event"
                ></app-immersion-pro>

                <!-- FICHE MÉTIER DÉTAILLÉE (Maquette "Découvrir le métier de peintre décorateur.webp") -->
                <div *ngIf="selectedCareerDetail" class="space-y-6">
                  <!-- Bannière illustrée du métier -->
                  <div class="relative rounded-[28px] overflow-hidden bg-[#1B1B62] text-white shadow-lg">
                    <div aria-hidden="true" class="w-full h-56 bg-gradient-to-br from-[#4C1D95] to-[#7C3AED]"></div>
                    <div class="absolute inset-0 bg-gradient-to-r from-[#0F1035]/90 via-[#1B1B62]/70 to-transparent p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
                      <div class="space-y-2 max-w-xl">
                        <span class="inline-block rounded-full bg-[#F3E8FF] text-[#6D28D9] px-3.5 py-1 text-xs font-extrabold">
                          {{ selectedCareerDetail.sectorTag }} • Zone {{ selectedCareerDetail.jobZone }} (Rapport p. {{ selectedCareerDetail.pageNumber }})
                        </span>
                        <h2 class="text-3xl sm:text-4xl font-extrabold">{{ selectedCareerDetail.titleFr }}</h2>
                        <p class="text-sm text-[#E7E8FB]">{{ selectedCareerDetail.shortSummary }}</p>
                      </div>

                      <div class="flex flex-col gap-2">
                        <button
                          type="button"
                          (click)="selectedCareerDetail.isFavorite = !selectedCareerDetail.isFavorite"
                          class="rounded-full bg-white text-[#0F1035] px-5 py-2 text-xs font-extrabold shadow"
                        >
                          {{ selectedCareerDetail.isFavorite ? 'Retiré / Ajouté aux favoris' : '♡ Ajouter aux favoris' }}
                        </button>
                        <button
                          type="button"
                          (click)="startImmersionForCareer(selectedCareerDetail)"
                          class="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#7C3AED] text-white px-5 py-2 text-xs font-black shadow-lg hover:scale-105 transition flex items-center gap-1.5 justify-center"
                        >
                          <span><mb-icon name="briefcase"></mb-icon></span>
                          <span>Démarrer mon immersion pro →</span>
                        </button>
                        <button
                          type="button"
                          (click)="selectedCareerDetail = null"
                          class="rounded-full bg-[#7C3AED] text-white border border-white/40 px-5 py-2 text-xs font-extrabold shadow"
                        >
                          ↗ Retour à mon immersion pro
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Barre des 5 sous-onglets de la fiche métier -->
                  <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-extrabold">
                    <span class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white py-2.5 px-4 text-center shadow">
                      <mb-icon name="shield-check"></mb-icon> Vue d’ensemble
                    </span>
                    <span class="rounded-full bg-white text-[#0F1035] border border-[#E4E0F5] py-2.5 px-4 text-center">
                      <mb-icon name="coins"></mb-icon> Salaire &amp; Marché
                    </span>
                    <span class="rounded-full bg-white text-[#0F1035] border border-[#E4E0F5] py-2.5 px-4 text-center">
                      <mb-icon name="briefcase"></mb-icon> Conditions réelles
                    </span>
                    <span class="rounded-full bg-white text-[#0F1035] border border-[#E4E0F5] py-2.5 px-4 text-center">
                      <mb-icon name="graduation-cap"></mb-icon> Formation &amp; Accès
                    </span>
                    <a
                      [href]="getMetiers360Url(selectedCareerDetail)"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Vivre une immersion en réalité virtuelle sur Métiers360 (nouvel onglet)"
                      class="rounded-full bg-white text-[#0F1035] border border-[#E4E0F5] py-2.5 px-4 text-center hover:bg-[#F3EFFE] hover:border-[#7C3AED] transition cursor-pointer"
                    >
                      <mb-icon name="handshake"></mb-icon> Immersion Pro <span class="text-[#7C3AED]">↗</span>
                    </a>
                  </div>

                  <!-- Grille 2 colonnes de la fiche métier -->
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <!-- Colonne gauche : Missions, Salaire, Conditions, Faculté d'adaptation -->
                    <div class="lg:col-span-7 space-y-5">
                      <!-- 1. Missions principales -->
                      <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3">
                        <div class="flex items-center justify-between">
                          <h3 class="text-lg font-extrabold text-[#0F1035]"><mb-icon name="target"></mb-icon> Les missions principales (Rapport p. {{ selectedCareerDetail.pageNumber }})</h3>
                          <span class="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-bold text-[#6D28D9]">Zone {{ selectedCareerDetail.jobZone }}</span>
                        </div>
                        <p class="text-sm text-[#31355B] leading-relaxed">
                          {{ selectedCareerDetail.description }}
                        </p>
                      </div>

                      <!-- 2. Salaire & Rémunération indicative -->
                      <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3.5">
                        <div class="flex items-center justify-between">
                          <h4 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                            <span class="text-[#10B981]"><mb-icon name="coins"></mb-icon></span>
                            <span>Salaire &amp; Rémunération indicative</span>
                          </h4>
                          <span class="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-black">
                            Marché France / PACA
                          </span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div class="rounded-2xl bg-[#F0FDF4] border border-emerald-200 p-3.5 space-y-1">
                            <span class="text-[11px] font-bold text-emerald-700 block"><mb-icon name="circle" [filled]="true"></mb-icon> Débutant</span>
                            <strong class="text-sm sm:text-base font-black text-[#0F1035] block leading-tight">
                              {{ getCareerSalary(selectedCareerDetail).starter }}
                            </strong>
                            <span class="text-[10px] text-emerald-800 block">À l’embauche</span>
                          </div>

                          <div class="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 space-y-1">
                            <span class="text-[11px] font-bold text-blue-700 block"><mb-icon name="circle" [filled]="true"></mb-icon> Confirmé / Artisan</span>
                            <strong class="text-sm sm:text-base font-black text-[#0F1035] block leading-tight">
                              {{ getCareerSalary(selectedCareerDetail).experienced }}
                            </strong>
                            <span class="text-[10px] text-blue-800 block">Après 3 à 5 ans</span>
                          </div>

                          <div class="rounded-2xl bg-[#FAF5FF] border border-purple-200 p-3.5 space-y-1">
                            <span class="text-[11px] font-bold text-purple-700 block"><mb-icon name="circle" [filled]="true"></mb-icon> Annuel médian</span>
                            <strong class="text-sm sm:text-base font-black text-[#0F1035] block leading-tight">
                              {{ getCareerSalary(selectedCareerDetail).median }}
                            </strong>
                            <span class="text-[10px] text-purple-800 block">Brut / an</span>
                          </div>
                        </div>

                        <p class="text-[11px] text-[#555A8A] leading-relaxed bg-[#F8F7FF] rounded-xl p-3 border border-[#E4E0F5]">
                          <mb-icon name="info"></mb-icon> <strong>Bon à savoir :</strong> {{ getCareerSalary(selectedCareerDetail).note }}
                        </p>
                      </div>

                      <!-- 3. Conditions de travail détaillées -->
                      <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3">
                        <h4 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                          <span class="text-[#7C3AED]"><mb-icon name="briefcase"></mb-icon></span>
                          <span>Conditions de travail</span>
                        </h4>
                        <ul class="space-y-2 text-xs text-[#31355B] leading-relaxed">
                          <li *ngFor="let cond of getCareerWorkConditions(selectedCareerDetail)" class="flex items-start gap-2">
                            <span>{{ cond }}</span>
                          </li>
                        </ul>
                      </div>

                      <!-- 4. Faculté d'adaptation (Compétence clé du bilan cognitif p. 5) -->
                      <div class="rounded-[26px] bg-gradient-to-br from-[#FAF5FF] to-[#F3EFFE] border-2 border-[#D8CEFF] p-6 shadow-sm space-y-3">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                          <h4 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                            <span class="text-[#7C3AED]"><mb-icon name="brain"></mb-icon></span>
                            <span>Faculté d’adaptation — Atout de ton profil</span>
                          </h4>
                          <span class="rounded-full bg-[#7C3AED] text-white px-3 py-0.5 text-[11px] font-extrabold shadow-xs">
                            Bilan cognitif (p. 5)
                          </span>
                        </div>

                        <div class="rounded-xl bg-white/80 border border-[#D8CEFF] p-3.5 text-xs text-[#31355B] leading-relaxed space-y-2">
                          <p class="font-bold text-[#5B21B6]">
                            <mb-icon name="target"></mb-icon> {{ getCareerAdaptationFaculty(selectedCareerDetail).cognitiveLink }}
                          </p>
                          <p>
                            {{ getCareerAdaptationFaculty(selectedCareerDetail).concreteRole }}
                          </p>
                          <p class="text-[11px] text-[#555A8A] italic">
                            <mb-icon name="lightbulb"></mb-icon> {{ getCareerAdaptationFaculty(selectedCareerDetail).advice }}
                          </p>
                        </div>

                        <div class="flex flex-wrap gap-1.5 text-xs font-bold text-[#5B21B6] pt-1">
                          <span class="rounded-full bg-white border border-[#D8CEFF] px-3 py-1">Flexibilité cognitive (p. 5)</span>
                          <span class="rounded-full bg-white border border-[#D8CEFF] px-3 py-1">Créativité</span>
                          <span class="rounded-full bg-white border border-[#D8CEFF] px-3 py-1">Sens du détail</span>
                          <span class="rounded-full bg-white border border-[#D8CEFF] px-3 py-1">Réactivité</span>
                          <span class="rounded-full bg-white border border-[#D8CEFF] px-3 py-1">Esprit d’équipe</span>
                        </div>
                      </div>
                    </div>

                    <!-- Colonne droite : Profil RIASEC, Formation, Évolutions, Mise en relation pro -->
                    <div class="lg:col-span-5 space-y-5">
                      <!-- Pourquoi ce métier peut t'intéresser -->
                      <div class="rounded-[26px] bg-[#F3EFFE] border border-[#D8CEFF] p-6 space-y-2">
                        <h3 class="text-base font-extrabold text-[#0F1035]"><mb-icon name="sparkles"></mb-icon> Pourquoi ce métier peut t’intéresser ?</h3>
                        <p class="text-xs sm:text-sm text-[#31355B] leading-relaxed">
                          Il correspond à tes centres d'intérêt du Rapport Rdv {{ rdvNumber }} (profil RIASEC : <strong>Artistique</strong>, <strong>Entreprenant</strong>, <strong>Réaliste</strong>) et figure parmi les propositions de la <strong>Zone {{ selectedCareerDetail.jobZone }}</strong> (page {{ selectedCareerDetail.pageNumber }}).
                        </p>
                      </div>

                      <!-- 5. Accessibilité de la formation -->
                      <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3">
                        <div class="flex items-center justify-between">
                          <h3 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                            <span class="text-[#7C3AED]"><mb-icon name="graduation-cap"></mb-icon></span>
                            <span>Accessibilité de la formation</span>
                          </h3>
                          <span class="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-black">
                            Zone {{ selectedCareerDetail.jobZone }}
                          </span>
                        </div>

                        <div class="rounded-xl bg-[#F0FDF4] border border-emerald-200 p-3 text-xs text-emerald-900 font-bold">
                          ✓ {{ getCareerTrainingAccessibility(selectedCareerDetail).accessLevel }}
                        </div>

                        <div class="space-y-1.5 text-xs text-[#31355B]">
                          <strong class="text-[#0F1035] block">Filières recommandées :</strong>
                          <ul class="space-y-1 text-[#42466B]">
                            <li *ngFor="let pathway of getCareerTrainingAccessibility(selectedCareerDetail).pathways" class="flex items-start gap-1.5">
                              <span class="text-[#7C3AED] font-bold">›</span>
                              <span>{{ pathway }}</span>
                            </li>
                          </ul>
                        </div>

                        <div class="pt-2 border-t border-[#F0EDFA] text-[11px] text-[#555A8A] space-y-1">
                          <p>
                            <strong>Prérequis :</strong> {{ getCareerTrainingAccessibility(selectedCareerDetail).prerequisites }}
                          </p>
                          <p>
                            <strong>Organismes locaux :</strong> {{ getCareerTrainingAccessibility(selectedCareerDetail).localFunding }}
                          </p>
                        </div>
                      </div>

                      <!-- Évolutions de carrière -->
                      <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-5 shadow-sm space-y-3">
                        <h3 class="text-base font-extrabold text-[#0F1035]"><mb-icon name="trending-up"></mb-icon> Évolutions possibles</h3>
                        <div class="flex flex-wrap items-center gap-1.5 text-xs font-extrabold">
                          <span class="rounded-full bg-[#7C3AED] text-white px-3 py-1.5">{{ selectedCareerDetail.titleFr }}</span>
                          <span class="text-[#7C3AED]">→</span>
                          <span class="rounded-full bg-[#F3EFFE] text-[#0F1035] border border-[#D8CEFF] px-3 py-1.5">Chef d’équipe</span>
                          <span class="text-[#7C3AED]">→</span>
                          <span class="rounded-full bg-[#F3EFFE] text-[#0F1035] border border-[#D8CEFF] px-3 py-1.5">Responsable / Artisan</span>
                        </div>
                      </div>

                      <!-- 6. Mise en relation avec un professionnel du secteur avec validation du conseiller -->
                      <div class="rounded-[26px] bg-gradient-to-br from-[#1E144F] via-[#3B177D] to-[#6D28D9] text-white p-6 shadow-xl space-y-4 relative overflow-hidden">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-extrabold text-[#E9D5FF] border border-white/25">
                              <mb-icon name="handshake"></mb-icon> Immersion &amp; Découverte terrain
                            </span>
                            <h3 class="text-lg sm:text-xl font-black mt-1">Rencontrer un professionnel du secteur</h3>
                          </div>
                          <span class="rounded-full bg-amber-400 text-amber-950 px-2.5 py-1 text-[10px] font-black shrink-0 flex items-center gap-1 shadow">
                            <span><mb-icon name="lock"></mb-icon></span>
                            <span>Validation conseiller requise</span>
                          </span>
                        </div>

                        <p class="text-xs text-[#E7E8FB] leading-relaxed">
                          Découvre le quotidien d'un <strong>{{ selectedCareerDetail.titleFr }}</strong> sur le terrain : stage d'immersion d'une semaine (PMSMP), visite d'atelier ou échange avec un pro partenaire.
                        </p>

                        <!-- Cadre de validation obligatoire du conseiller -->
                        <div class="rounded-2xl bg-white/10 border border-white/20 p-3.5 space-y-1.5 backdrop-blur-sm text-xs">
                          <div class="flex items-start gap-2 text-white">
                            <span class="text-sm"><mb-icon name="user-round"></mb-icon></span>
                            <div>
                              <strong class="text-white block font-extrabold">Accompagnement supervisé par Sarah Dupont</strong>
                              <span class="text-[#DDD6FE] leading-relaxed block mt-0.5 text-[11px]">
                                Toute démarche de mise en relation est <strong>strictement soumise à la validation préalable de ton conseiller</strong> (Centre des Possibles). Vous vérifierez ensemble que ce stage correspond à tes objectifs lors de votre prochain rendez-vous.
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- Immersion VR Métiers360 (accessible sans validation) -->
                        <a
                          [href]="getMetiers360Url(selectedCareerDetail)"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white py-2.5 px-4 text-xs font-black transition flex items-center justify-center gap-2"
                        >
                          <span><mb-icon name="glasses"></mb-icon></span>
                          <span>Vivre une immersion VR 360° sur Métiers360</span>
                          <span>↗</span>
                        </a>

                        <!-- Bouton d'action ou confirmation de demande -->
                        <div *ngIf="!careerProContactRequested[selectedCareerDetail.id]" class="pt-1">
                          <button
                            type="button"
                            (click)="requestProContact(selectedCareerDetail)"
                            class="w-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] hover:brightness-110 text-white py-3 px-4 text-xs font-black shadow-lg transition flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                          >
                            <span><mb-icon name="handshake"></mb-icon></span>
                            <span>Demander une mise en relation avec un pro</span>
                            <span>→</span>
                          </button>
                          <span class="text-[10px] text-center block text-[#DDD6FE] mt-1.5 opacity-80">
                            Durée : observation d'1 jour ou stage PMSMP d'1 semaine
                          </span>
                        </div>

                        <div *ngIf="careerProContactRequested[selectedCareerDetail.id]" class="rounded-2xl bg-emerald-500/25 border-2 border-emerald-400 p-3.5 text-xs text-emerald-100 flex items-center justify-between gap-3 animate-fadeIn">
                          <div class="flex items-center gap-2">
                            <span class="text-lg"><mb-icon name="circle-check"></mb-icon></span>
                            <div>
                              <strong class="text-white block font-black">Demande transmise avec succès !</strong>
                              <span class="text-emerald-200 text-[11px]">Sarah Dupont examinera cette opportunité lors de ton prochain RDV (mardi 18 nov).</span>
                            </div>
                          </div>
                          <span class="rounded-full bg-emerald-400 text-emerald-950 px-2 py-0.5 text-[10px] font-black shrink-0">En attente</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Barre inférieure "En résumé" + Boutons d'action -->
                  <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5">
                      <span class="h-10 w-10 rounded-2xl bg-[#F3EFFE] text-[#6D28D9] flex items-center justify-center font-bold"><mb-icon name="file-text"></mb-icon></span>
                      <div class="text-xs sm:text-sm">
                        <strong class="text-[#0F1035]">En résumé :</strong>
                        <span class="text-[#42466B] ml-1.5">
                          Une piste de la Zone {{ selectedCareerDetail.jobZone }} ({{ getZoneDurationLabel(selectedCareerDetail.jobZone) }}) présente à la page {{ selectedCareerDetail.pageNumber }} de ton rapport.
                        </span>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        (click)="requestProContact(selectedCareerDetail)"
                        [class]="careerProContactRequested[selectedCareerDetail.id] ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'"
                        class="rounded-full border px-4 py-2.5 text-xs font-extrabold transition flex items-center gap-1.5"
                      >
                        <span><mb-icon name="handshake"></mb-icon></span>
                        <span>{{ careerProContactRequested[selectedCareerDetail.id] ? 'Mise en relation demandée' : 'Mise en relation pro' }}</span>
                      </button>
                      <button
                        type="button"
                        (click)="prefillQuestionWithCareer(selectedCareerDetail)"
                        class="rounded-full border-2 border-[#7C3AED] text-[#6D28D9] px-5 py-2.5 text-xs font-extrabold hover:bg-[#F3EFFE]"
                      >
                        <mb-icon name="message-circle"></mb-icon> Poser une question
                      </button>
                      <button
                        type="button"
                        (click)="startImmersionForCareer(selectedCareerDetail)"
                        class="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 text-xs sm:text-sm font-extrabold shadow"
                      >
                        <mb-icon name="briefcase"></mb-icon> Préparer mon immersion en entreprise
                      </button>
                      <button
                        type="button"
                        (click)="selectedCareerDetail.isFavorite = true; selectYoungTab('MON_PARCOURS')"
                        class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-6 py-2.5 text-xs sm:text-sm font-extrabold shadow"
                      >
                        <mb-icon name="map"></mb-icon> Ajouter à mon parcours
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE 4 : MON PARCOURS (Maquette officielle d'exploration) -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'MON_PARCOURS'">
                <app-exploration-dashboard
                  [favoriteCareersCount]="favoriteCareers.length || 4"
                  [questionsCount]="questions.length || 5"
                  [youngDisplayName]="'Emma D.'"
                  (navigate)="selectYoungTab($any($event))"
                  (openCareerDetail)="handleOpenCareerByName($event)"
                ></app-exploration-dashboard>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE 5 : MES QUESTIONS (Maquette "Tableau de bord _ Mes questions.webp") -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'MES_QUESTIONS'" class="space-y-6">
                <div class="rounded-[28px] bg-gradient-to-r from-[#1A1354] via-[#4C1D95] to-[#7C3AED] text-white p-6 sm:p-8 shadow-lg">
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div class="lg:col-span-8 space-y-2">
                      <h2 class="text-2xl sm:text-3xl font-extrabold">
                        Prépare ton échange avec <span class="inline-block rounded-2xl bg-[#EC4899] px-3 py-0.5">ton conseiller !</span>
                      </h2>
                      <p class="text-sm text-[#E7E8FB]">
                        Rassemble ici toutes tes questions, tes idées et tes points à clarifier sur ton bilan Rdv {{ rdvNumber }} et les métiers.
                      </p>
                    </div>
                    <div class="lg:col-span-4 space-y-2 text-xs font-extrabold text-[#0F1035]">
                      <div class="rounded-full bg-white px-4 py-2"><mb-icon name="calendar"></mb-icon> Noter mes questions</div>
                      <div class="rounded-full bg-white px-4 py-2"><mb-icon name="folders"></mb-icon> Organiser mes idées</div>
                      <div class="rounded-full bg-white px-4 py-2"><mb-icon name="users"></mb-icon> Préparer le rendez-vous</div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <!-- Liste checklist des questions + Formulaire d'ajout -->
                  <div class="lg:col-span-7 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
                    <h3 class="text-xl font-extrabold text-[#0F1035]"><mb-icon name="message-circle"></mb-icon> Mes questions ({{ questions.length }})</h3>

                    <div class="space-y-2.5">
                      <div
                        *ngFor="let q of questions"
                        class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3.5 space-y-2"
                      >
                        <div class="flex items-center gap-3">
                          <input type="checkbox" [(ngModel)]="q.checked" class="h-4 w-4 accent-[#7C3AED] rounded" />
                          <span [class]="q.tagColor" class="rounded-full px-3 py-0.5 text-xs font-extrabold">
                            {{ q.tagLabel }}
                          </span>
                          <span class="text-sm font-bold text-[#0F1035] flex-1">{{ q.questionText }}</span>
                        </div>
                        <div *ngIf="q.counselorReply" class="ml-7 p-2.5 rounded-xl bg-white border-l-4 border-[#7C3AED] text-xs text-[#31355B]">
                          <strong>Réponse du conseiller :</strong> {{ q.counselorReply }}
                        </div>
                      </div>
                    </div>

                    <!-- Ajout d'une nouvelle question -->
                    <form (ngSubmit)="submitYoungQuestion()" class="pt-3 border-t border-[#F0EDFA] flex flex-wrap gap-2">
                      <input
                        type="text"
                        [(ngModel)]="newQuestionTopic"
                        name="topic"
                        placeholder="Catégorie (ex: Métiers, Parcours…)"
                        class="w-40 rounded-xl bg-[#F4F2FF] border border-[#D8DCF0] px-3 py-2 text-xs font-semibold"
                        required
                      />
                      <input
                        type="text"
                        [(ngModel)]="newQuestionText"
                        name="text"
                        placeholder="Écris ta nouvelle question pour ton conseiller…"
                        class="flex-1 rounded-xl bg-[#F4F2FF] border border-[#D8DCF0] px-3.5 py-2 text-xs font-semibold"
                        required
                      />
                      <button
                        type="submit"
                        class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-5 py-2 text-xs font-extrabold shadow"
                      >
                        + Ajouter une question
                      </button>
                    </form>
                  </div>

                  <!-- Prochain RDV + Mes notes & idées (0/500) -->
                  <div class="lg:col-span-5 space-y-6">
                    <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                      <div class="flex items-center justify-between">
                        <h3 class="text-lg font-extrabold text-[#0F1035]"><mb-icon name="calendar"></mb-icon> Mon prochain rendez-vous</h3>
                        <span class="rounded-full bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 text-xs font-extrabold">Confirmé</span>
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="rounded-2xl bg-[#F3EFFE] px-4 py-2.5 text-center">
                          <span class="text-[11px] font-bold text-[#6D28D9] block">MER</span>
                          <span class="text-2xl font-black text-[#0F1035]">18</span>
                          <span class="text-[11px] font-bold text-[#42466B] block">NOV</span>
                        </div>
                        <div class="text-xs space-y-1">
                          <p class="font-extrabold text-sm text-[#0F1035]">Échange avec mon conseiller</p>
                          <p class="text-[#42466B]"><mb-icon name="clock"></mb-icon> 14h30 – 15h30</p>
                          <p class="text-[#42466B]"><mb-icon name="map-pin"></mb-icon> Centre des Possibles</p>
                        </div>
                      </div>
                    </div>

                    <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3">
                      <h3 class="text-lg font-extrabold text-[#0F1035]"><mb-icon name="notebook-pen"></mb-icon> Mes notes &amp; idées</h3>
                      <textarea
                        [(ngModel)]="personalNotes"
                        maxlength="500"
                        rows="4"
                        placeholder="Mes réflexions, idées, envies, points à discuter…"
                        class="w-full rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-3.5 text-xs text-[#0F1035]"
                      ></textarea>
                      <div class="text-right text-[11px] text-[#42466B]">
                        {{ personalNotes.length }} / 500
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE 6 : MES DOCUMENTS (Maquette "Tableau de bord _ Mes documents.webp") -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'MES_DOCUMENTS'" class="space-y-6">
                <div class="rounded-[28px] bg-gradient-to-r from-[#1A1354] via-[#4C1D95] to-[#7C3AED] text-white p-6 sm:p-8 shadow-lg">
                  <h2 class="text-2xl sm:text-3xl font-extrabold">
                    Tous mes documents <span class="inline-block rounded-2xl bg-[#EC4899] px-3 py-0.5">au même endroit !</span>
                  </h2>
                  <p class="text-sm text-[#E7E8FB] mt-2">
                    Consulte, télécharge et conserve les documents de ton bilan d’orientation Rdv {{ rdvNumber }} en toute simplicité.
                  </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div class="lg:col-span-8 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                    <h3 class="text-xl font-extrabold text-[#0F1035]"><mb-icon name="file-text"></mb-icon> Mes documents (4)</h3>

                    <div class="space-y-3">
                      <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                          <span class="h-11 w-11 rounded-2xl bg-[#FEE2E2] text-[#DC2626] font-extrabold text-xs flex items-center justify-center">PDF</span>
                          <div>
                            <h4 class="font-extrabold text-sm text-[#0F1035]">Rapport d’orientation — Rdv {{ rdvNumber }}</h4>
                            <p class="text-xs text-[#42466B]">Mon bilan complet (résultats RIASEC, aptitudes, HEXACO et 22 métiers) • PDF • 17 pages • {{ reportDate }}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          (click)="selectYoungTab('MON_BILAN')"
                          class="rounded-full bg-white border border-[#D8DCF0] px-4 py-1.5 text-xs font-extrabold text-[#6D28D9]"
                        >
                          Consulter
                        </button>
                      </div>

                      <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                          <span class="h-11 w-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] font-extrabold text-xs flex items-center justify-center">WAV</span>
                          <div>
                            <h4 class="font-extrabold text-sm text-[#0F1035]">Restitution audio</h4>
                            <p class="text-xs text-[#42466B]">Explication vocale de mon bilan (écoute ≈ 6 min) • Piper TTS</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          (click)="openAudioRestitutionView()"
                          class="rounded-full bg-[#7C3AED] text-white px-4 py-1.5 text-xs font-extrabold"
                        >
                          ▶ Écouter
                        </button>
                      </div>

                      <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                          <span class="h-11 w-11 rounded-2xl bg-[#DBEAFE] text-[#1D4ED8] font-extrabold text-xs flex items-center justify-center">DOC</span>
                          <div>
                            <h4 class="font-extrabold text-sm text-[#0F1035]">Synthèse de mes résultats</h4>
                            <p class="text-xs text-[#42466B]">Mes centres d’intérêt, aptitudes et points clés vérifiés par mon conseiller</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          (click)="selectYoungTab('MON_BILAN')"
                          class="rounded-full bg-white border border-[#D8DCF0] px-4 py-1.5 text-xs font-extrabold text-[#6D28D9]"
                        >
                          Ouvrir
                        </button>
                      </div>

                      <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                          <span class="h-11 w-11 rounded-2xl bg-[#DCFCE7] text-[#15803D] font-extrabold text-xs flex items-center justify-center">✓</span>
                          <div>
                            <h4 class="font-extrabold text-sm text-[#0F1035]">Mes notes et réflexions</h4>
                            <p class="text-xs text-[#42466B]">Mes idées, questions ({{ questions.length }}) et prochaines actions</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          (click)="selectYoungTab('MES_QUESTIONS')"
                          class="rounded-full bg-white border border-[#D8DCF0] px-4 py-1.5 text-xs font-extrabold text-[#6D28D9]"
                        >
                          Éditer
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="lg:col-span-4 space-y-6">
                    <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3">
                      <h3 class="text-base font-extrabold text-[#0F1035]"><mb-icon name="briefcase"></mb-icon> Mon espace personnel</h3>
                      <div class="flex justify-between text-xs font-bold text-[#42466B]">
                        <span>24 Mo utilisés sur 100 Mo</span>
                        <span>24 %</span>
                      </div>
                      <div class="w-full h-2.5 rounded-full bg-[#EDE9FE] overflow-hidden">
                        <div class="w-1/4 h-full bg-[#7C3AED] rounded-full"></div>
                      </div>
                    </div>

                    <!-- Carte Mode d'accompagnement (Parcours Autonome vs Accompagné) -->
                    <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3.5">
                      <div class="flex items-center justify-between">
                        <h3 class="text-base font-extrabold text-[#0F1035] flex items-center gap-2">
                          <span><mb-icon name="compass"></mb-icon></span>
                          <span>Mode d'accompagnement</span>
                        </h3>
                        <span
                          [class]="journeyMode === 'AUTONOMOUS' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-purple-100 text-purple-800 border-purple-300'"
                          class="rounded-full px-2.5 py-0.5 text-[10px] font-black border"
                        >
                          {{ journeyMode === 'AUTONOMOUS' ? 'Autonome' : 'Accompagné' }}
                        </span>
                      </div>
                      <p class="text-xs text-[#42466B] leading-relaxed">
                        {{ journeyMode === 'AUTONOMOUS'
                          ? 'Tu avances librement à ton rythme sans conseiller référent. Tu explores 721 métiers O*NET et prépares tes immersions.'
                          : 'Tu es accompagnée par un professionnel du Centre des Possibles et accèdes à la restitution de ton bilan Rdv 2187.' }}
                      </p>
                      <button
                        type="button"
                        (click)="isJourneyChoiceModalOpen = true"
                        class="w-full rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white py-2 px-4 text-xs font-black shadow-xs hover:opacity-95 transition text-center flex items-center justify-center gap-1.5"
                      >
                        <span><mb-icon name="refresh-cw"></mb-icon></span>
                        <span>Changer de mode d'accompagnement</span>
                      </button>
                    </div>

                    <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-3">
                      <h3 class="text-base font-extrabold text-[#0F1035]"><mb-icon name="library"></mb-icon> Ressources d’orientation</h3>
                      <ul class="space-y-2 text-xs font-bold text-[#0F1035]">
                        <li>
                          <a href="https://www.orientation-regionsud.fr" target="_blank" rel="noopener" class="block rounded-xl bg-[#F8F7FF] p-3 hover:bg-[#F3EFFE]">
                            <mb-icon name="globe"></mb-icon> Base Région Sud (orientation-regionsud.fr) ↗
                          </a>
                        </li>
                        <li>
                          <a href="https://www.onisep.fr" target="_blank" rel="noopener" class="block rounded-xl bg-[#F8F7FF] p-3 hover:bg-[#F3EFFE]">
                            <mb-icon name="book-open"></mb-icon> Guide des métiers ONISEP ↗
                          </a>
                        </li>
                        <li>
                          <a href="https://www.metiers360.com" target="_blank" rel="noopener" class="block rounded-xl bg-[#F8F7FF] p-3 hover:bg-[#F3EFFE]">
                            <mb-icon name="glasses"></mb-icon> Vidéos VR Métiers 360° (Agora) ↗
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================================== -->
              <!-- VUE JEUNE : MES PARAMÈTRES (Conforme à la maquette officielle) -->
              <!-- ========================================================== -->
              <div *ngIf="activeYoungTab === 'PARAMETRES_JEUNE'">
                <app-settings
                  [firstName]="userFirstName"
                  [lastName]="userLastName"
                  [email]="currentUserEmail"
                  [speechRate]="speechRate"
                  [photoUrl]="userPhotoUrl"
                  (photoChange)="onUserPhotoChange($event)"
                  (profileSave)="onUserProfileSave($event)"
                  (speechRateChange)="setSpeechRate($event)"
                  (logout)="logout()"
                ></app-settings>
              </div>
            </ng-container>
          </ng-container>

          <!-- ============================================================== -->
          <!-- PORTAIL 2 : ESPACE CONSEILLER (Fidèle à captures/interface conseiller/) -->
          <!-- ============================================================== -->
          <ng-container *ngIf="activePortal === 'COUNSELOR'">
            <!-- VUE CONSEILLER 1 : TABLEAU DE BORD (Maquette "Tableau de bord MonBilan+ lumineux.webp") -->
            <div *ngIf="activeCounselorTab === 'TABLEAU_DE_BORD'" class="space-y-6">
              <!-- Bannière Hero Conseiller épurée -->
              <div class="rounded-[28px] bg-gradient-to-r from-[#1A1354] via-[#3B1D8F] to-[#6D28D9] text-white p-6 sm:p-8 shadow-lg">
                <div class="max-w-3xl space-y-4">
                  <span class="inline-block rounded-full bg-white/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider">
                    ESPACE CONSEILLER
                  </span>
                  <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                    Gérez, personnalisez et validez les bilans d’orientation
                  </h2>
                  <p class="text-xs sm:text-sm sm:text-base text-[#E7E8FB] leading-relaxed">
                    Importez un rapport du Centre des Possibles, contrôlez les informations extraites, personnalisez la restitution et publiez-la pour le jeune.
                  </p>
                  <div class="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      (click)="activeCounselorTab = 'IMPORTER_RAPPORT'"
                      class="inline-flex items-center gap-2 rounded-full bg-white text-[#1A1354] hover:bg-[#F3EFFE] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all"
                    >
                      <svg class="h-4 w-4 text-[#6D28D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Importer un rapport</span>
                    </button>
                    <button
                      type="button"
                      (click)="activeCounselorTab = 'DOSSIERS_JEUNES'"
                      class="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-extrabold backdrop-blur-sm transition-all"
                    >
                      <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span>Voir les dossiers jeunes</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 4 Cartes compteurs de suivi avec icônes vectorielles propres (Fidèle à la maquette Tableau de bord lumineux) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <!-- Carte 1 : Dossiers actifs -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-sm hover:shadow-md transition space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="h-11 w-11 rounded-2xl bg-purple-50 text-[#7C3AED] ring-1 ring-purple-100 flex items-center justify-center">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/60">
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      +12 %
                    </span>
                  </div>
                  <div>
                    <span class="text-3xl font-black text-[#0F1035] tracking-tight">24</span>
                    <span class="text-xs font-semibold text-[#42466B] block mt-0.5">Dossiers actifs</span>
                  </div>
                </div>

                <!-- Carte 2 : Restitutions publiées -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-sm hover:shadow-md transition space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 flex items-center justify-center">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/60">
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      +20 %
                    </span>
                  </div>
                  <div>
                    <span class="text-3xl font-black text-[#0F1035] tracking-tight">18</span>
                    <span class="text-xs font-semibold text-[#42466B] block mt-0.5">Restitutions publiées</span>
                  </div>
                </div>

                <!-- Carte 3 : En attente de validation -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-sm hover:shadow-md transition space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="h-11 w-11 rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100 flex items-center justify-center">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200/60">
                      À contrôler
                    </span>
                  </div>
                  <div>
                    <span class="text-3xl font-black text-[#0F1035] tracking-tight">4</span>
                    <span class="text-xs font-semibold text-[#42466B] block mt-0.5">En attente de validation</span>
                  </div>
                </div>

                <!-- Carte 4 : Rendez-vous cette semaine -->
                <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-sm hover:shadow-md transition space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="h-11 w-11 rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 flex items-center justify-center">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200/60">
                      Nice
                    </span>
                  </div>
                  <div>
                    <span class="text-3xl font-black text-[#0F1035] tracking-tight">6</span>
                    <span class="text-xs font-semibold text-[#42466B] block mt-0.5">Rendez-vous cette semaine</span>
                  </div>
                </div>
              </div>

              <!-- Dossiers récents + Workflow d'un dossier (Human-in-the-loop) -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Dossiers récents (5 colonnes) avec photos réelles extraites des maquettes -->
                <div class="lg:col-span-5 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-[#F0EDFA]">
                    <div class="flex items-center gap-2.5">
                      <div class="h-9 w-9 rounded-xl bg-purple-50 text-[#7C3AED] ring-1 ring-purple-100 flex items-center justify-center">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Dossiers récents</h3>
                        <p class="text-xs text-[#6B7280]">Suivi des jeunes accompagnés</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="activeCounselorTab = 'DOSSIERS_JEUNES'"
                      class="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#7C3AED] hover:text-[#6D28D9] transition group"
                    >
                      <span>Voir tous les dossiers</span>
                      <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div class="divide-y divide-[#F0EDFA]">
                    <div
                      *ngFor="let d of counselorDossiers"
                      class="py-3.5 flex items-center justify-between gap-3 hover:bg-[#FBFBFE] px-2 rounded-xl transition"
                    >
                      <div class="flex items-center gap-3 min-w-0">
                        <img
                          *ngIf="hasAvatar(d.avatarUrl); else dossierListInitials"
                          [src]="d.avatarUrl"
                          [alt]="d.name"
                          (error)="markAvatarFailed(d.avatarUrl)"
                          class="h-10 w-10 rounded-full object-cover ring-2 ring-purple-100 shadow-sm flex-shrink-0"
                        />
                        <ng-template #dossierListInitials>
                          <span
                            [attr.aria-label]="d.name"
                            class="h-10 w-10 rounded-full bg-[#EDE9FE] text-[#6D28D9] ring-2 ring-purple-100 shadow-sm flex-shrink-0 flex items-center justify-center text-sm font-extrabold"
                          >{{ getInitials(d.name) }}</span>
                        </ng-template>
                        <div class="truncate">
                          <span class="font-extrabold text-[#0F1035] text-sm block leading-tight">{{ d.name }}</span>
                          <span class="text-xs text-[#6B7280] block">{{ d.age }} • {{ d.rdv }}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-3 flex-shrink-0">
                        <span class="hidden sm:inline text-xs text-[#9CA3AF]">{{ d.date }}</span>
                        <span
                          [class]="d.badgeClass"
                          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold shadow-sm"
                        >
                          <span *ngIf="d.statusLabel.includes('Publié')" class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          <span *ngIf="d.statusLabel.includes('valider')" class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          <span *ngIf="d.statusLabel.includes('Extraction')" class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                          <span>{{ d.statusLabel }}</span>
                        </span>
                        <button
                          type="button"
                          (click)="activeCounselorTab = 'VALIDATIONS_PUBLICATIONS'"
                          title="Consulter le dossier"
                          class="h-8 w-8 rounded-lg border border-[#E4E0F5] hover:border-[#7C3AED] hover:bg-purple-50 text-[#6B7280] hover:text-[#7C3AED] flex items-center justify-center transition"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Workflow d'un dossier (Human-in-the-loop - 7 colonnes) -->
                <div class="lg:col-span-7 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
                  <div class="flex items-center justify-between pb-3 border-b border-[#F0EDFA]">
                    <div class="flex items-center gap-2.5">
                      <div class="h-9 w-9 rounded-xl bg-purple-50 text-[#7C3AED] ring-1 ring-purple-100 flex items-center justify-center">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Workflow d’un dossier</h3>
                        <p class="text-xs text-[#6B7280]">Garantie Human-in-the-loop : aucune restitution sans validation humaine</p>
                      </div>
                    </div>
                    <span class="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-[#7C3AED] ring-1 ring-purple-200">
                      <span class="h-1.5 w-1.5 rounded-full bg-[#7C3AED] animate-pulse"></span>
                      Étape {{ counselorWorkflowStep }} / 6
                    </span>
                  </div>

                  <!-- Stepper connecté horizontalement : 6 étapes conformes MonBilan+ (grille responsive sans dépassement) -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 text-center">
                    <!-- Étape 1 -->
                    <button
                      type="button"
                      (click)="openDossierWorkflow(1)"
                      [class]="counselorWorkflowStep === 1 ? 'border-2 border-[#7C3AED] bg-purple-50' : 'border border-[#E4E0F5] bg-white'"
                      class="p-2 sm:p-2.5 rounded-2xl shadow-xs flex flex-col items-center hover:bg-purple-50/50 transition cursor-pointer min-w-0 overflow-hidden"
                    >
                      <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-1 shadow-xs text-xs">
                        ✓
                      </div>
                      <span class="text-[11px] font-black text-[#0F1035] block leading-tight truncate w-full">01. Importer</span>
                      <span class="text-[9px] text-emerald-700 font-bold truncate w-full">PDF 17p</span>
                    </button>

                    <!-- Étape 2 -->
                    <button
                      type="button"
                      (click)="openDossierWorkflow(2)"
                      [class]="counselorWorkflowStep === 2 ? 'border-2 border-[#7C3AED] bg-purple-50' : 'border border-[#E4E0F5] bg-white'"
                      class="p-2 sm:p-2.5 rounded-2xl shadow-xs flex flex-col items-center hover:bg-purple-50/50 transition cursor-pointer min-w-0 overflow-hidden"
                    >
                      <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold mb-1 text-xs">
                        <mb-icon name="pen-line"></mb-icon>
                      </div>
                      <span class="text-[11px] font-black text-[#0F1035] block leading-tight truncate w-full">02. Entretien</span>
                      <span class="text-[9px] text-[#7C3AED] font-bold truncate w-full">Fiche saisie</span>
                    </button>

                    <!-- Étape 3 -->
                    <button
                      type="button"
                      (click)="openDossierWorkflow(3)"
                      [class]="counselorWorkflowStep === 3 ? 'border-2 border-[#7C3AED] bg-purple-50' : 'border border-[#E4E0F5] bg-white'"
                      class="p-2 sm:p-2.5 rounded-2xl shadow-xs flex flex-col items-center hover:bg-purple-50/50 transition cursor-pointer min-w-0 overflow-hidden"
                    >
                      <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold mb-1 text-xs">
                        <mb-icon name="zap"></mb-icon>
                      </div>
                      <span class="text-[11px] font-black text-[#0F1035] block leading-tight truncate w-full">03. Rapprochement</span>
                      <span class="text-[9px] text-purple-700 font-bold truncate w-full">Sélection IA</span>
                    </button>

                    <!-- Étape 4 -->
                    <button
                      type="button"
                      (click)="openDossierWorkflow(4)"
                      [class]="counselorWorkflowStep === 4 ? 'border-2 border-[#7C3AED] bg-purple-50' : 'border border-[#E4E0F5] bg-white'"
                      class="p-2 sm:p-2.5 rounded-2xl shadow-xs flex flex-col items-center hover:bg-purple-50/50 transition cursor-pointer min-w-0 overflow-hidden"
                    >
                      <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-1 text-xs">
                        <mb-icon name="search"></mb-icon>
                      </div>
                      <span class="text-[11px] font-black text-[#0F1035] block leading-tight truncate w-full">04. Métiers</span>
                      <span class="text-[9px] text-emerald-700 font-bold truncate w-full">22 validés</span>
                    </button>

                    <!-- Étape 5 -->
                    <button
                      type="button"
                      (click)="openDossierWorkflow(5)"
                      [class]="counselorWorkflowStep === 5 ? 'border-2 border-[#7C3AED] bg-purple-50' : 'border border-[#E4E0F5] bg-white'"
                      class="p-2 sm:p-2.5 rounded-2xl shadow-xs flex flex-col items-center hover:bg-purple-50/50 transition cursor-pointer min-w-0 overflow-hidden"
                    >
                      <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold mb-1 text-xs">
                        <mb-icon name="headphones"></mb-icon>
                      </div>
                      <span class="text-[11px] font-black text-[#0F1035] block leading-tight truncate w-full">05. Épisodes</span>
                      <span class="text-[9px] text-purple-700 font-bold truncate w-full">6 pistes</span>
                    </button>

                    <!-- Étape 6 -->
                    <button
                      type="button"
                      (click)="openDossierWorkflow(6)"
                      [class]="counselorWorkflowStep === 6 ? 'border-2 border-[#7C3AED] bg-purple-50' : 'border border-[#E4E0F5] bg-white'"
                      class="p-2 sm:p-2.5 rounded-2xl shadow-xs flex flex-col items-center hover:bg-purple-50/50 transition cursor-pointer min-w-0 overflow-hidden"
                    >
                      <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold mb-1 text-xs">
                        <mb-icon name="rocket"></mb-icon>
                      </div>
                      <span class="text-[11px] font-black text-[#0F1035] block leading-tight truncate w-full">06. Publication</span>
                      <span class="text-[9px] text-green-700 font-bold truncate w-full">Publié jeune</span>
                    </button>
                  </div>

                  <!-- Fiche dossier en cours d'extraction -->
                  <div class="rounded-2xl bg-gradient-to-br from-[#FAF8FF] to-[#F3EFFE] border border-[#E4E0F5] p-4 sm:p-5 space-y-3.5">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div class="flex items-center gap-2.5">
                        <div class="h-9 w-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center flex-shrink-0">
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <strong class="text-xs sm:text-sm font-extrabold text-[#0F1035] block">rapport-des-possibles-2187.pdf</strong>
                          <span class="text-[11px] text-[#6B7280]">17 pages extraites • Fiche Emma D. (16 ans)</span>
                        </div>
                      </div>
                      <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Extraction 100 % vérifiée
                      </span>
                    </div>

                    <!-- 3 capsules de métriques du rapport -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div class="rounded-xl bg-white border border-[#E4E0F5] p-2.5 flex items-center gap-2 shadow-2xs">
                        <span class="h-7 w-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center flex-shrink-0 font-extrabold text-xs">R</span>
                        <div>
                          <span class="text-[10px] text-[#6B7280] block uppercase tracking-wider font-bold">RIASEC</span>
                          <strong class="text-xs text-[#0F1035] font-black">6 dimensions</strong>
                        </div>
                      </div>
                      <div class="rounded-xl bg-white border border-[#E4E0F5] p-2.5 flex items-center gap-2 shadow-2xs">
                        <span class="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-extrabold text-xs">9</span>
                        <div>
                          <span class="text-[10px] text-[#6B7280] block uppercase tracking-wider font-bold">Aptitudes</span>
                          <strong class="text-xs text-[#0F1035] font-black">9 cognitives</strong>
                        </div>
                      </div>
                      <div class="rounded-xl bg-white border border-[#E4E0F5] p-2.5 flex items-center gap-2 shadow-2xs">
                        <span class="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold text-xs">22</span>
                        <div>
                          <span class="text-[10px] text-[#6B7280] block uppercase tracking-wider font-bold">Métiers O*NET</span>
                          <strong class="text-xs text-[#0F1035] font-black">22 fiches</strong>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center justify-between pt-1">
                      <span class="text-xs text-[#6B7280] flex items-center gap-1.5">
                        <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Sources traçables page par page
                      </span>
                      <button
                        type="button"
                        (click)="openDossierWorkflow(1)"
                        class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:opacity-95 text-white px-4 py-2 text-xs font-extrabold shadow-md transition"
                      >
                        <span>Contrôler les faits</span>
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ligne inférieure (Fidèle à la maquette Tableau de bord lumineux) : Activité récente + Répartition + Évolution -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Activité récente (5 colonnes) -->
                <div class="lg:col-span-5 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                  <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
                    <div class="flex items-center gap-2.5">
                      <div class="h-8 w-8 rounded-xl bg-purple-50 text-[#7C3AED] ring-1 ring-purple-100 flex items-center justify-center">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 class="text-base font-extrabold text-[#0F1035]">Activité récente</h3>
                    </div>
                    <span class="text-xs text-[#6B7280]">Aujourd’hui</span>
                  </div>

                  <div class="space-y-3.5 text-xs">
                    <div class="flex items-start gap-3">
                      <div class="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div class="flex-1">
                        <strong class="text-[#0F1035] block">Restitution validée pour Emma D.</strong>
                        <span class="text-[#6B7280]">Fiche publiée et audio généré • Il y a 25 min</span>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="h-7 w-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div class="flex-1">
                        <strong class="text-[#0F1035] block">Extraction IA terminée : Lucas M.</strong>
                        <span class="text-[#6B7280]">17 pages analysées, 7 faits à contrôler • Il y a 2 h</span>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div class="flex-1">
                        <strong class="text-[#0F1035] block">Rendez-vous préparé : Aïcha D.</strong>
                        <span class="text-[#6B7280]">5 questions clés enregistrées • Hier à 16:30</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Répartition des dossiers (Donut SVG - 4 colonnes) -->
                <div class="lg:col-span-4 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                  <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
                    <div class="flex items-center gap-2.5">
                      <div class="h-8 w-8 rounded-xl bg-purple-50 text-[#7C3AED] ring-1 ring-purple-100 flex items-center justify-center">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                      <h3 class="text-base font-extrabold text-[#0F1035]">Répartition</h3>
                    </div>
                    <span class="text-xs font-bold text-[#7C3AED]">24 dossiers</span>
                  </div>

                  <div class="flex items-center justify-center gap-4 py-1">
                    <!-- SVG Donut Chart -->
                    <div class="relative w-28 h-28 flex-shrink-0">
                      <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#F0EDFA" stroke-width="4.5" />
                        <!-- Publiés (18/24 = 75%) -->
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" stroke-width="4.5" stroke-dasharray="66 100" stroke-dashoffset="0" stroke-linecap="round" />
                        <!-- À valider (4/24 = 17%) -->
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" stroke-width="4.5" stroke-dasharray="15 100" stroke-dashoffset="-66" stroke-linecap="round" />
                        <!-- Extraction (2/24 = 8%) -->
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#7C3AED" stroke-width="4.5" stroke-dasharray="7 100" stroke-dashoffset="-81" stroke-linecap="round" />
                      </svg>
                      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span class="text-xl font-black text-[#0F1035]">24</span>
                        <span class="text-[9px] text-[#6B7280] font-bold uppercase">Total</span>
                      </div>
                    </div>

                    <!-- Légende du Donut -->
                    <div class="space-y-1.5 text-xs">
                      <div class="flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        <span class="text-[#0F1035] font-semibold">Publiés (18)</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                        <span class="text-[#0F1035] font-semibold">À valider (4)</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full bg-[#7C3AED]"></span>
                        <span class="text-[#0F1035] font-semibold">Extraction (2)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Évolution (30 jours) (Courbe SVG - 3 colonnes) -->
                <div class="lg:col-span-3 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                  <div class="flex items-center justify-between pb-2 border-b border-[#F0EDFA]">
                    <div class="flex items-center gap-2">
                      <div class="h-8 w-8 rounded-xl bg-purple-50 text-[#7C3AED] ring-1 ring-purple-100 flex items-center justify-center">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h3 class="text-base font-extrabold text-[#0F1035]">Évolution</h3>
                    </div>
                    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-bold">
                      +20 %
                    </span>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-baseline justify-between">
                      <span class="text-2xl font-black text-[#0F1035]">18</span>
                      <span class="text-xs text-[#6B7280]">Restitutions ce mois</span>
                    </div>

                    <!-- Sparkline SVG -->
                    <div class="h-16 w-full pt-1">
                      <svg class="w-full h-full overflow-visible" viewBox="0 0 160 50">
                        <defs>
                          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#8B3DFF" stop-opacity="0.35" />
                            <stop offset="100%" stop-color="#8B3DFF" stop-opacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M 0 45 Q 30 40 50 32 T 100 24 T 130 14 T 160 8 L 160 50 L 0 50 Z" fill="url(#purpleGrad)" />
                        <path d="M 0 45 Q 30 40 50 32 T 100 24 T 130 14 T 160 8" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" />
                        <circle cx="160" cy="8" r="3.5" fill="#7C3AED" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                    </div>
                    <span class="text-[11px] text-[#6B7280] block text-center">Progression continue • +3 dossiers cette semaine</span>
                  </div>
                </div>
              </div>

              <!-- Carte Suivi des Immersions Pro en entreprise (Module Immersion Pro) -->
              <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0EDFA]">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center text-lg shadow-sm">
                      <mb-icon name="briefcase"></mb-icon>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Suivi des immersions pro en entreprise</h3>
                        <span class="rounded-full bg-purple-50 text-[#7C3AED] px-2.5 py-0.5 text-xs font-bold border border-purple-200">
                          1 immersion en cours
                        </span>
                      </div>
                      <p class="text-xs text-[#6B7280]">
                        Supervisez les stages d'observation terrain (PMSMP), validez les conventions et accompagnez les débriefings.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    (click)="activePortal = 'YOUNG'; selectYoungTab('IMMERSION_PRO')"
                    class="rounded-full bg-[#F3EFFE] text-[#7C3AED] hover:bg-[#E9D5FF] px-4 py-2 text-xs font-extrabold transition flex items-center gap-1.5"
                  >
                    <span><mb-icon name="eye"></mb-icon></span>
                    <span>Voir comme le jeune</span>
                  </button>
                </div>

                <!-- Immersion active d'Emma D. -->
                <div class="rounded-2xl bg-[#FAF8FF] border border-[#E4E0F5] p-4.5 space-y-4">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div aria-hidden="true" class="h-12 w-12 shrink-0 rounded-xl border border-[#E4E0F5] bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-2xl">
                        <mb-icon name="palette"></mb-icon>
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <strong class="text-sm font-black text-[#0F1035]">Emma D. (16 ans)</strong>
                          <span class="text-xs text-[#6B7280]">• Dossier Rdv 2187</span>
                        </div>
                        <span class="text-xs font-bold text-[#7C3AED] block mt-0.5">
                          <mb-icon name="palette"></mb-icon> Peintre décorateur (Zone 1 • p. 8) chez Atelier Décors & Patines Riviera (Nice)
                        </span>
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                      <span class="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 text-xs font-bold flex items-center gap-1">
                        <span><mb-icon name="hourglass"></mb-icon></span>
                        <span>Étape 2/6 : Préparation & Convention</span>
                      </span>
                      <span class="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold">
                        ✓ Éligible PMSMP (1-3 jours)
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                    <div class="rounded-xl bg-white border border-[#E4E0F5] p-3 space-y-1">
                      <span class="text-[10px] font-bold text-[#6B7280] uppercase">Entreprise d'accueil</span>
                      <p class="font-extrabold text-[#0F1035]">Atelier Décors & Patines Riviera</p>
                      <p class="text-[11px] text-[#42466B]">Nice Centre • Contact : Laurent M.</p>
                    </div>
                    <div class="rounded-xl bg-white border border-[#E4E0F5] p-3 space-y-1">
                      <span class="text-[10px] font-bold text-[#6B7280] uppercase">Statut administratif</span>
                      <p class="font-extrabold text-amber-700">Convention à éditer</p>
                      <p class="text-[11px] text-[#42466B]">Assurance responsabilité civile validée</p>
                    </div>
                    <div class="rounded-xl bg-white border border-[#E4E0F5] p-3 space-y-1">
                      <span class="text-[10px] font-bold text-[#6B7280] uppercase">Objectif entretien</span>
                      <p class="font-extrabold text-[#0F1035]">Confirmer intérêt Artistique / Réaliste</p>
                      <p class="text-[11px] text-[#42466B]">Tester l'habileté manuelle et la précision</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VUE CONSEILLER 2 : DOSSIERS JEUNES (Maquette "Tableau de bord des dossiers jeunes.webp") -->
            <div *ngIf="activeCounselorTab === 'DOSSIERS_JEUNES'" class="space-y-6">
              <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex gap-2 text-xs font-extrabold">
                    <span class="rounded-full bg-[#7C3AED] text-white px-4 py-2">Tous (4)</span>
                    <span class="rounded-full bg-[#F4F2FF] text-[#0F1035] px-4 py-2">À valider (1)</span>
                    <span class="rounded-full bg-[#F4F2FF] text-[#0F1035] px-4 py-2">Publiés (2)</span>
                  </div>
                  <button
                    type="button"
                    (click)="activeCounselorTab = 'IMPORTER_RAPPORT'"
                    class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-5 py-2 text-xs font-extrabold shadow"
                  >
                    + Importer un rapport
                  </button>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr class="border-b border-[#E4E0F5] text-xs text-[#42466B] uppercase">
                        <th class="py-3 pr-4">Jeune</th>
                        <th class="py-3 pr-4">Dossier</th>
                        <th class="py-3 pr-4">Structure</th>
                        <th class="py-3 pr-4">Statut</th>
                        <th class="py-3 pr-4">Date du rapport</th>
                        <th class="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#F0EDFA]">
                      <tr *ngFor="let d of counselorDossiers" class="hover:bg-[#FAF9FF] transition">
                        <td class="py-3.5 pr-4 font-extrabold text-[#0F1035]">
                          <div class="flex items-center gap-3">
                            <img
                              *ngIf="hasAvatar(d.avatarUrl); else dossierTableInitials"
                              [src]="d.avatarUrl"
                              [alt]="d.name"
                              (error)="markAvatarFailed(d.avatarUrl)"
                              class="h-9 w-9 rounded-full object-cover ring-2 ring-purple-100 shadow-2xs flex-shrink-0"
                            />
                            <ng-template #dossierTableInitials>
                              <span
                                [attr.aria-label]="d.name"
                                class="h-9 w-9 rounded-full bg-[#EDE9FE] text-[#6D28D9] ring-2 ring-purple-100 shadow-2xs flex-shrink-0 flex items-center justify-center text-xs font-extrabold"
                              >{{ getInitials(d.name) }}</span>
                            </ng-template>
                            <div>
                              <span class="block leading-tight">{{ d.name }}</span>
                              <span class="text-xs text-[#6B7280] font-normal">{{ d.age }}</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-3.5 pr-4 font-mono text-xs text-[#6D28D9] font-bold">{{ d.rdv }}</td>
                        <td class="py-3.5 pr-4 text-[#42466B]">{{ d.school }}</td>
                        <td class="py-3.5 pr-4">
                          <span [class]="d.badgeClass" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold shadow-2xs">
                            <span *ngIf="d.statusLabel.includes('Publié')" class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span *ngIf="d.statusLabel.includes('valider')" class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            <span *ngIf="d.statusLabel.includes('Extraction')" class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                            <span>{{ d.statusLabel }}</span>
                          </span>
                        </td>
                        <td class="py-3.5 pr-4 text-[#42466B]">{{ d.date }}</td>
                        <td class="py-3.5 flex gap-2">
                          <button
                            type="button"
                            (click)="openDossierWorkflow(1)"
                            class="rounded-full bg-[#F3EFFE] text-[#6D28D9] px-3 py-1 text-xs font-bold"
                          >
                            Faits PDF
                          </button>
                          <button
                            type="button"
                            (click)="openDossierWorkflow(4)"
                            class="rounded-full bg-[#7C3AED] text-white px-3 py-1 text-xs font-bold"
                          >
                            Valider
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- ========================================================== -->
            <!-- VUE CONSEILLER : DOSSIER & WORKFLOW 6 ÉTAPES (MASTER ENGINE) -->
            <!-- ========================================================== -->
            <div *ngIf="activeCounselorTab === 'IMPORTER_RAPPORT' || activeCounselorTab === 'VERIFICATION_DONNEES' || activeCounselorTab === 'VALIDATIONS_PUBLICATIONS'" class="space-y-6">
              <!-- Input natif masqué pour l'import de fichier depuis ordinateur, smartphone ou tablette -->
              <input
                #fileInput
                type="file"
                (change)="onFileInputChange($event)"
                accept="application/pdf,.pdf"
                class="hidden"
              />

              <!-- Alerte succès ou erreur dynamique -->
              <div
                *ngIf="uploadErrorMessage"
                class="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-800 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ uploadErrorMessage }}</span>
                </div>
                <button type="button" (click)="uploadErrorMessage = null" class="text-red-500 hover:text-red-700 font-black">✕</button>
              </div>

              <div
                *ngIf="uploadSuccessNotice"
                class="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ uploadSuccessNotice }}</span>
                </div>
                <button type="button" (click)="uploadSuccessNotice = null" class="text-emerald-500 hover:text-emerald-700 font-black">✕</button>
              </div>

              <!-- En-tête Dossier Emma D. & Stepper 6 Étapes -->
              <div class="rounded-[28px] bg-gradient-to-r from-[#1A1354] via-[#4C1D95] to-[#6D28D9] text-white p-6 sm:p-7 shadow-lg space-y-5">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-3.5">
                    <img
                      *ngIf="hasAvatar('assets/visuals/avatar-emma.png'); else emmaHeaderInitials"
                      src="assets/visuals/avatar-emma.png"
                      alt="Emma D."
                      (error)="markAvatarFailed('assets/visuals/avatar-emma.png')"
                      class="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/30 shadow-md"
                    />
                    <ng-template #emmaHeaderInitials>
                      <span
                        aria-label="Emma D."
                        class="h-14 w-14 rounded-2xl bg-white/20 ring-2 ring-white/30 shadow-md flex items-center justify-center text-xl font-black text-white"
                      >{{ getInitials('Emma D.') }}</span>
                    </ng-template>
                    <div>
                      <div class="flex items-center gap-2">
                        <h2 class="text-xl sm:text-2xl font-black text-white">Dossier Emma D. (16 ans)</h2>
                        <span class="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-mono font-bold text-white">Rdv 2187</span>
                      </div>
                      <p class="text-xs text-[#E7E8FB] mt-0.5">
                        Centre des Possibles (Nice) • Conseillère : Sarah Dupont • Rapport 17 pages
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span
                      [class]="isRestitutionPublishedToYoung ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-amber-500/20 text-amber-200 border-amber-400/40'"
                      class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold border"
                    >
                      <span [class]="isRestitutionPublishedToYoung ? 'bg-emerald-400' : 'bg-amber-400'" class="h-2 w-2 rounded-full animate-pulse"></span>
                      <span>{{ isRestitutionPublishedToYoung ? 'Restitution publiée au jeune' : 'Validation en cours' }}</span>
                    </span>
                    <button
                      type="button"
                      (click)="activePortal = 'JEUNE'; activeYoungTab = 'MON_BILAN'; showAudioFocusSubView = true"
                      class="rounded-full bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>Voir rendu jeune</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>

                <!-- Notification temporaire -->
                <div *ngIf="workflowNotice" class="rounded-2xl bg-white/95 text-[#0F1035] p-3 text-xs font-extrabold flex items-center justify-between shadow-md">
                  <span class="flex items-center gap-2">
                    <span class="text-emerald-600">✓</span>
                    <span>{{ workflowNotice }}</span>
                  </span>
                  <button type="button" (click)="workflowNotice = null" class="text-gray-400 hover:text-black">✕</button>
                </div>

                <!-- Stepper 6 étapes Master Prompt -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-white/15">
                  <button
                    type="button"
                    (click)="setWorkflowStep(1)"
                    [class]="counselorWorkflowStep === 1
                      ? 'bg-white text-[#0F1035] shadow-lg ring-2 ring-white font-black'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 font-bold'"
                    class="rounded-2xl p-3 text-left transition flex flex-col justify-between gap-1 cursor-pointer"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-mono tracking-wider uppercase opacity-80">Étape 01</span>
                      <span class="text-xs"><mb-icon name="file-text"></mb-icon></span>
                    </div>
                    <div class="text-xs leading-tight font-extrabold">01. Importer</div>
                    <span class="text-[10px] text-emerald-300 font-extrabold">PDF 17p vérifié</span>
                  </button>

                  <button
                    type="button"
                    (click)="setWorkflowStep(2)"
                    [class]="counselorWorkflowStep === 2
                      ? 'bg-white text-[#0F1035] shadow-lg ring-2 ring-white font-black'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 font-bold'"
                    class="rounded-2xl p-3 text-left transition flex flex-col justify-between gap-1 cursor-pointer"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-mono tracking-wider uppercase opacity-80">Étape 02</span>
                      <span class="text-xs"><mb-icon name="pen-line"></mb-icon></span>
                    </div>
                    <div class="text-xs leading-tight font-extrabold">02. Entretien</div>
                    <span class="text-[10px] text-purple-200 font-extrabold">Fiche structurée</span>
                  </button>

                  <button
                    type="button"
                    (click)="setWorkflowStep(3)"
                    [class]="counselorWorkflowStep === 3
                      ? 'bg-white text-[#0F1035] shadow-lg ring-2 ring-white font-black'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 font-bold'"
                    class="rounded-2xl p-3 text-left transition flex flex-col justify-between gap-1 cursor-pointer"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-mono tracking-wider uppercase opacity-80">Étape 03</span>
                      <span class="text-xs"><mb-icon name="zap"></mb-icon></span>
                    </div>
                    <div class="text-xs leading-tight font-extrabold">03. Sélection IA</div>
                    <span class="text-[10px] text-purple-200 font-extrabold">Rapprochement</span>
                  </button>

                  <button
                    type="button"
                    (click)="setWorkflowStep(4)"
                    [class]="counselorWorkflowStep === 4
                      ? 'bg-white text-[#0F1035] shadow-lg ring-2 ring-white font-black'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 font-bold'"
                    class="rounded-2xl p-3 text-left transition flex flex-col justify-between gap-1 cursor-pointer"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-mono tracking-wider uppercase opacity-80">Étape 04</span>
                      <span class="text-xs"><mb-icon name="target"></mb-icon></span>
                    </div>
                    <div class="text-xs leading-tight font-extrabold">04. Métiers</div>
                    <span class="text-[10px] text-emerald-300 font-extrabold">22 validés</span>
                  </button>

                  <button
                    type="button"
                    (click)="setWorkflowStep(5)"
                    [class]="counselorWorkflowStep === 5
                      ? 'bg-white text-[#0F1035] shadow-lg ring-2 ring-white font-black'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 font-bold'"
                    class="rounded-2xl p-3 text-left transition flex flex-col justify-between gap-1 cursor-pointer"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-mono tracking-wider uppercase opacity-80">Étape 05</span>
                      <span class="text-xs"><mb-icon name="headphones"></mb-icon></span>
                    </div>
                    <div class="text-xs leading-tight font-extrabold">05. Épisodes</div>
                    <span class="text-[10px] text-pink-200 font-extrabold">6 épisodes</span>
                  </button>

                  <button
                    type="button"
                    (click)="setWorkflowStep(6)"
                    [class]="counselorWorkflowStep === 6
                      ? 'bg-white text-[#0F1035] shadow-lg ring-2 ring-white font-black'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 font-bold'"
                    class="rounded-2xl p-3 text-left transition flex flex-col justify-between gap-1 cursor-pointer"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-mono tracking-wider uppercase opacity-80">Étape 06</span>
                      <span class="text-xs"><mb-icon name="rocket"></mb-icon></span>
                    </div>
                    <div class="text-xs leading-tight font-extrabold">06. Publication</div>
                    <span class="text-[10px] text-emerald-300 font-extrabold">Espace jeune</span>
                  </button>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- ÉTAPE 01 : IMPORTER LE RAPPORT (PDF)       -->
              <!-- ========================================== -->
              <div *ngIf="counselorWorkflowStep === 1" class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <!-- Zone d'importation glisser-déposer + bouton ordinateur / smartphone -->
                  <div
                    (dragover)="onDragOver($event)"
                    (dragleave)="onDragLeave($event)"
                    (drop)="onFileDropped($event)"
                    [class.border-[#7C3AED]]="isDraggingFile"
                    [class.bg-[#FAF8FF]]="isDraggingFile"
                    class="lg:col-span-7 rounded-[28px] bg-white border-2 border-dashed border-[#C4B5FD] hover:border-[#7C3AED] transition-all p-6 sm:p-8 text-center space-y-5 shadow-sm flex flex-col items-center justify-center relative overflow-hidden"
                  >
                    <div class="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] text-[#7C3AED] ring-8 ring-purple-50 flex items-center justify-center shadow-sm">
                      <svg class="h-10 w-10 text-[#6D28D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>

                    <div class="space-y-1.5 max-w-md">
                      <h2 class="text-xl sm:text-2xl font-black text-[#0F1035] tracking-tight">
                        Glissez-déposez le rapport PDF du Centre des Possibles
                      </h2>
                      <p class="text-xs sm:text-sm text-[#42466B]">
                        Le psychologue importe le rapport d'orientation officiel pour extraire l'intégralité des données.
                      </p>
                    </div>

                    <div class="flex items-center justify-center pt-1">
                      <button
                        type="button"
                        (click)="fileInput.click()"
                        class="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#541fd0] hover:to-[#8228d6] text-white px-7 py-3.5 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all"
                      >
                        <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Importer un fichier sur ordinateur ou téléphone</span>
                      </button>
                    </div>

                    <!-- Fiche du fichier actuellement importé / prêt -->
                    <div
                      *ngIf="uploadedFile"
                      class="w-full max-w-lg rounded-2xl bg-gradient-to-br from-[#FAF8FF] to-[#F3EFFE] border border-[#E4E0F5] p-4 text-left space-y-3 shadow-2xs mt-2"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                          <div class="h-10 w-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center flex-shrink-0">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div class="truncate">
                            <strong class="text-xs sm:text-sm font-extrabold text-[#0F1035] block truncate">
                              {{ uploadedFile.name }}
                            </strong>
                            <span class="text-[11px] text-[#6B7280]">
                              {{ uploadedFile.size }} • Importé le {{ uploadedFile.lastModified }}
                            </span>
                          </div>
                        </div>
                        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 flex-shrink-0">
                          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          Prêt &amp; Analysé
                        </span>
                      </div>

                      <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-[11px] text-[#42466B] font-semibold">
                          <span class="flex items-center gap-1.5">
                            <span *ngIf="isAnalyzingIA" class="h-2 w-2 rounded-full bg-[#7C3AED] animate-ping"></span>
                            <span>{{ analysisStepLabel }}</span>
                          </span>
                          <span class="font-extrabold text-[#7C3AED]">{{ uploadProgress }} %</span>
                        </div>
                        <div class="w-full h-2 rounded-full bg-[#E2DCFA] overflow-hidden">
                          <div
                            class="h-full bg-gradient-to-r from-[#6328E8] to-[#22C55E] transition-all duration-300"
                            [style.width.%]="uploadProgress"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <!-- Garanties techniques sous forme de capsules -->
                    <div class="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-[#42466B]">
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-[#F4F2FF] px-3 py-1 font-semibold text-[#6D28D9]">
                        Format PDF (jusqu’à 25 Mo)
                      </span>
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-[#F4F2FF] px-3 py-1 font-semibold text-[#6D28D9]">
                        Chiffrement AES-256 &amp; Isolation établissement
                      </span>
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 font-semibold text-[#15803D]">
                        Zéro hallucination (RAG sourcé)
                      </span>
                    </div>
                  </div>

                  <!-- Colonne de droite : Traitement par l'IA (5 cols) -->
                  <div class="lg:col-span-5 rounded-[28px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-5 flex flex-col justify-between">
                    <div class="space-y-4">
                      <div class="flex items-center justify-between pb-3 border-b border-[#F0EDFA]">
                        <div class="flex items-center gap-2.5">
                          <div class="h-9 w-9 rounded-xl bg-purple-50 text-[#7C3AED] ring-1 ring-purple-100 flex items-center justify-center">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 class="text-base sm:text-lg font-black text-[#0F1035]">Extraction structurée</h3>
                            <p class="text-xs text-[#6B7280]">Pipeline certifié Centre des Possibles</p>
                          </div>
                        </div>
                        <span class="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-[#7C3AED]">
                          RAG certifié
                        </span>
                      </div>

                      <ul class="space-y-3 text-xs sm:text-sm font-bold text-[#31355B]">
                        <li class="flex items-start gap-3">
                          <div class="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <strong class="text-[#0F1035] block leading-tight">Extraction documentaire intégrale</strong>
                            <span class="text-xs text-[#6B7280] font-normal">Scores, verbatim et pagination des 17 pages du rapport.</span>
                          </div>
                        </li>
                        <li class="flex items-start gap-3">
                          <div class="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <strong class="text-[#0F1035] block leading-tight">Résultats RIASEC (p. 4), Aptitudes (p. 5) &amp; HEXACO (p. 6)</strong>
                            <span class="text-xs text-[#6B7280] font-normal">Positionnement exact des dimensions sans extrapolation.</span>
                          </div>
                        </li>
                        <li class="flex items-start gap-3">
                          <div class="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <strong class="text-[#0F1035] block leading-tight">22 Métiers O*NET exhaustifs</strong>
                            <span class="text-xs text-[#6B7280] font-normal">Chaque métier est extrait fidèlement avec sa zone de préparation.</span>
                          </div>
                        </li>
                        <li class="flex items-start gap-3">
                          <div class="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <strong class="text-[#0F1035] block leading-tight">Réserve méthodologique (p. 17)</strong>
                            <span class="text-xs text-[#6B7280] font-normal">Pistes exploratoires, aucune prédiction déterministe.</span>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div class="rounded-2xl bg-gradient-to-br from-[#FAF8FF] to-[#EDE9FE] border border-purple-100 p-4 flex items-center gap-4">
                      <mb-icon name="bot" class="text-5xl text-[#7C3AED] flex-shrink-0"></mb-icon>
                      <div class="text-xs">
                        <strong class="text-[#0F1035] block font-extrabold">Garantie Zéro-Hallucination</strong>
                        <p class="text-[#6B7280] mt-0.5 leading-relaxed">
                          Toutes les valeurs sont ancrées dans le PDF source avec citation de page vérifiable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tableau de vérification des 7 faits extraits -->
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                  <div class="pb-3 border-b border-[#F0EDFA] flex items-center justify-between">
                    <div>
                      <h2 class="text-lg font-black text-[#0F1035]">
                        Faits extraits vérifiés — Rapport Rdv {{ rdvNumber }} ({{ facts.length }} preuves sourcées)
                      </h2>
                      <p class="text-xs text-[#42466B]">
                        Contrôle de conformité avec les 17 pages du rapport original du Centre des Possibles.
                      </p>
                    </div>
                    <span class="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-black">
                      ✓ {{ facts.length }}/{{ facts.length }} conformes
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div
                      *ngFor="let fact of facts"
                      class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2 hover:bg-[#F3EFFE]/40 transition"
                    >
                      <div class="flex items-center justify-between text-xs">
                        <span class="inline-flex items-center gap-1 rounded-full bg-purple-100 text-[#6D28D9] px-2.5 py-0.5 font-extrabold">
                          Page {{ fact.pageNumber }} / 17 • {{ fact.category }}
                        </span>
                        <label class="inline-flex items-center gap-2 font-bold cursor-pointer select-none">
                          <input type="checkbox" [(ngModel)]="fact.isVerified" class="h-4 w-4 rounded text-[#22C55E] focus:ring-[#22C55E] accent-[#22C55E]" />
                          <span [class.text-emerald-700]="fact.isVerified" [class.text-[#6B7280]="!fact.isVerified">
                            {{ fact.isVerified ? '✓ Vérifié' : 'À contrôler' }}
                          </span>
                        </label>
                      </div>
                      <p class="text-sm font-extrabold text-[#0F1035] leading-snug">{{ fact.label }}</p>
                      <p class="text-xs text-[#42466B] leading-relaxed italic bg-white/80 p-2.5 rounded-xl border border-purple-100/60">
                        « {{ fact.rawExcerpt }} »
                      </p>
                    </div>
                  </div>

                  <!-- Bouton suivant vers étape 2 -->
                  <div class="flex justify-end pt-3 border-t border-[#F0EDFA]">
                    <button
                      type="button"
                      (click)="setWorkflowStep(2)"
                      class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#541fd0] hover:to-[#8228d6] text-white px-7 py-3 text-xs sm:text-sm font-extrabold shadow-md transition"
                    >
                      <span>Passer à l'Étape 02 : Renseigner l'entretien</span>
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- ÉTAPE 02 : RENSEIGNER L'ENTRETIEN          -->
              <!-- ========================================== -->
              <div *ngIf="counselorWorkflowStep === 2" class="space-y-6">
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-6">
                  <div class="pb-4 border-b border-[#F0EDFA] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 class="text-xl font-black text-[#0F1035] flex items-center gap-2">
                        <span><mb-icon name="pen-line"></mb-icon></span>
                        <span>02. Renseigner l'entretien — Compte rendu structuré</span>
                      </h2>
                      <p class="text-xs sm:text-sm text-[#42466B] mt-0.5">
                        Renseignez les intentions exprimées par Emma D. lors du débriefing psychologique. L'absence de mention d'un métier n'est jamais une preuve de désintérêt.
                      </p>
                    </div>
                    <span class="rounded-full bg-purple-100 text-[#6D28D9] px-3 py-1 text-xs font-black">
                      Entretien Rdv 2187 • 18 nov. 2026
                    </span>
                  </div>

                  <!-- Métadonnées de l'entretien -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8F7FF] p-4 rounded-2xl border border-[#E4E0F5]">
                    <div>
                      <label class="block text-xs font-black uppercase tracking-wider text-[#42466B]">Date de l'entretien</label>
                      <input type="text" [(ngModel)]="interviewForm.interviewDate" class="w-full mt-1 rounded-xl bg-white border border-[#D8DCF0] p-2.5 text-xs sm:text-sm font-bold text-[#0F1035]" />
                    </div>
                    <div>
                      <label class="block text-xs font-black uppercase tracking-wider text-[#42466B]">Psychologue responsable</label>
                      <input type="text" [(ngModel)]="interviewForm.counselorName" class="w-full mt-1 rounded-xl bg-white border border-[#D8DCF0] p-2.5 text-xs sm:text-sm font-bold text-[#0F1035]" />
                    </div>
                    <div>
                      <label class="block text-xs font-black uppercase tracking-wider text-[#42466B]">Statut du compte rendu</label>
                      <span class="inline-flex items-center gap-1.5 mt-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-extrabold">
                        ✓ Validé par le professionnel
                      </span>
                    </div>
                  </div>

                  <!-- 1. Intérêts exprimés -->
                  <div class="space-y-4">
                    <h3 class="text-base font-black text-[#0F1035] flex items-center gap-2">
                      <span class="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">1</span>
                      <span>Intérêts exprimés par le jeune</span>
                    </h3>

                    <!-- Domaines d'intérêt -->
                    <div class="space-y-2">
                      <label class="text-xs font-extrabold text-[#31355B]">Domaines et univers professionnels évoqués :</label>
                      <div class="flex flex-wrap gap-2 items-center">
                        <span
                          *ngFor="let domain of interviewForm.expressedInterests; let i = index"
                          class="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] px-3.5 py-1 text-xs font-bold"
                        >
                          <span>{{ domain }}</span>
                          <button type="button" (click)="removeExpressedInterest(i)" class="text-[#7C3AED] hover:text-black font-black">×</button>
                        </span>
                      </div>
                      <div class="flex gap-2 max-w-md pt-1">
                        <input
                          type="text"
                          [(ngModel)]="interviewForm.newInterestInput"
                          (keydown.enter)="addExpressedInterest()"
                          placeholder="Ajouter un domaine..."
                          class="flex-1 rounded-xl bg-white border border-[#D8DCF0] p-2 text-xs"
                        />
                        <button type="button" (click)="addExpressedInterest()" class="rounded-xl bg-[#7C3AED] text-white px-3 py-1.5 text-xs font-bold">+</button>
                      </div>
                    </div>

                    <!-- Métiers explicitement mentionnés -->
                    <div class="space-y-2 pt-2">
                      <label class="text-xs font-extrabold text-[#31355B]">Métiers cités explicitement avec appétence :</label>
                      <div class="flex flex-wrap gap-2 items-center">
                        <span
                          *ngFor="let career of interviewForm.explicitCareers; let i = index"
                          class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3.5 py-1 text-xs font-bold"
                        >
                          <span>★ {{ career }}</span>
                          <button type="button" (click)="removeExplicitCareer(i)" class="text-emerald-700 hover:text-black font-black">×</button>
                        </span>
                      </div>
                      <div class="flex gap-2 max-w-md pt-1">
                        <input
                          type="text"
                          [(ngModel)]="interviewForm.newCareerInput"
                          (keydown.enter)="addExplicitCareer()"
                          placeholder="Ajouter un métier cité..."
                          class="flex-1 rounded-xl bg-white border border-[#D8DCF0] p-2 text-xs"
                        />
                        <button type="button" (click)="addExplicitCareer()" class="rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold">+</button>
                      </div>
                    </div>

                    <!-- Motivations -->
                    <div class="space-y-2 pt-2">
                      <label class="text-xs font-extrabold text-[#31355B]">Motivations et moteurs profonds observés :</label>
                      <div class="flex flex-wrap gap-2 items-center">
                        <span
                          *ngFor="let mot of interviewForm.motivations; let i = index"
                          class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-800 px-3.5 py-1 text-xs font-bold"
                        >
                          <span><mb-icon name="lightbulb"></mb-icon> {{ mot }}</span>
                          <button type="button" (click)="removeMotivation(i)" class="text-blue-700 hover:text-black font-black">×</button>
                        </span>
                      </div>
                      <div class="flex gap-2 max-w-md pt-1">
                        <input
                          type="text"
                          [(ngModel)]="interviewForm.newMotivationInput"
                          (keydown.enter)="addMotivation()"
                          placeholder="Ajouter une motivation..."
                          class="flex-1 rounded-xl bg-white border border-[#D8DCF0] p-2 text-xs"
                        />
                        <button type="button" (click)="addMotivation()" class="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-bold">+</button>
                      </div>
                    </div>
                  </div>

                  <!-- 2. Réserves et freins -->
                  <div class="space-y-4 pt-4 border-t border-[#F0EDFA]">
                    <h3 class="text-base font-black text-[#0F1035] flex items-center gap-2">
                      <span class="h-6 w-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">2</span>
                      <span>Réserves, doutes et pistes différées</span>
                    </h3>

                    <div class="space-y-2">
                      <label class="text-xs font-extrabold text-[#31355B]">Métiers ou conditions expressément écartés pour le moment :</label>
                      <div class="flex flex-wrap gap-2 items-center">
                        <span
                          *ngFor="let res of interviewForm.reservations; let i = index"
                          class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 px-3.5 py-1 text-xs font-bold border border-amber-200"
                        >
                          <span><mb-icon name="triangle-alert"></mb-icon> {{ res }}</span>
                          <button type="button" (click)="removeReservation(i)" class="text-amber-700 hover:text-black font-black">×</button>
                        </span>
                      </div>
                      <div class="flex gap-2 max-w-md pt-1">
                        <input
                          type="text"
                          [(ngModel)]="interviewForm.newReservationInput"
                          (keydown.enter)="addReservation()"
                          placeholder="Ajouter une réserve..."
                          class="flex-1 rounded-xl bg-white border border-[#D8DCF0] p-2 text-xs"
                        />
                        <button type="button" (click)="addReservation()" class="rounded-xl bg-amber-600 text-white px-3 py-1.5 text-xs font-bold">+</button>
                      </div>
                    </div>
                  </div>

                  <!-- 3. Conclusions professionnelles du psychologue -->
                  <div class="space-y-4 pt-4 border-t border-[#F0EDFA]">
                    <h3 class="text-base font-black text-[#0F1035] flex items-center gap-2">
                      <span class="h-6 w-6 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xs font-bold">3</span>
                      <span>Conclusions professionnelles du psychologue</span>
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-bold text-[#42466B]">Pistes prioritaires à approfondir</label>
                        <textarea
                          [(ngModel)]="interviewForm.prioritiesToDeepen"
                          rows="2"
                          class="w-full mt-1 rounded-xl bg-white border border-[#D8DCF0] p-2.5 text-xs text-[#0F1035]"
                        ></textarea>
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-[#42466B]">Pistes ouvertes à explorer sans pression</label>
                        <textarea
                          [(ngModel)]="interviewForm.tracksToExplore"
                          rows="2"
                          class="w-full mt-1 rounded-xl bg-white border border-[#D8DCF0] p-2.5 text-xs text-[#0F1035]"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <!-- Barre d'actions -->
                  <div class="flex items-center justify-between pt-4 border-t border-[#F0EDFA]">
                    <button
                      type="button"
                      (click)="setWorkflowStep(1)"
                      class="text-xs font-bold text-[#42466B] hover:text-[#0F1035]"
                    >
                      ← Revenir à l'étape 01 (Import)
                    </button>
                    <button
                      type="button"
                      (click)="saveInterviewAndRunMatching()"
                      [disabled]="isSavingInterview"
                      class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-7 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                      <span *ngIf="isSavingInterview" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Enregistrer &amp; Rapprocher avec les 22 métiers (Étape 03) →</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- ÉTAPE 03 : PROPOSER UNE SÉLECTION (IA)     -->
              <!-- ========================================== -->
              <div *ngIf="counselorWorkflowStep === 3" class="space-y-6">
                <!-- 4 Compteurs de synthèse du rapprochement -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-xs flex items-center gap-3.5">
                    <div class="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                      {{ countToDeepen }}
                    </div>
                    <div>
                      <strong class="text-sm font-black text-[#0F1035] block">À approfondir</strong>
                      <span class="text-xs text-emerald-700 font-bold">Intérêt vif explicite</span>
                    </div>
                  </div>

                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-xs flex items-center gap-3.5">
                    <div class="h-12 w-12 rounded-xl bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center font-black text-xl">
                      {{ countToExplore }}
                    </div>
                    <div>
                      <strong class="text-sm font-black text-[#0F1035] block">À explorer</strong>
                      <span class="text-xs text-[#6D28D9] font-bold">Pistes ouvertes (non écartées)</span>
                    </div>
                  </div>

                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-xs flex items-center gap-3.5">
                    <div class="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl">
                      {{ countDeferred }}
                    </div>
                    <div>
                      <strong class="text-sm font-black text-[#0F1035] block">Différés</strong>
                      <span class="text-xs text-amber-700 font-bold">Réserves exprimées</span>
                    </div>
                  </div>

                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-5 shadow-xs flex items-center gap-3.5">
                    <div class="h-12 w-12 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-black text-xl">
                      {{ countNeedsReview }}
                    </div>
                    <div>
                      <strong class="text-sm font-black text-[#0F1035] block">À clarifier</strong>
                      <span class="text-xs text-[#6B7280] font-bold">Ambiguïtés levées</span>
                    </div>
                  </div>
                </div>

                <!-- Carte Méthodologie et Règles Non-Négociables -->
                <div class="rounded-[26px] bg-gradient-to-br from-[#FAF8FF] to-[#EDE9FE] border border-purple-200 p-6 space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="text-[#7C3AED] text-lg font-black"><mb-icon name="settings"></mb-icon></span>
                    <h3 class="text-base font-black text-[#0F1035]">Règles du moteur de rapprochement déterministe</h3>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#31355B]">
                    <div class="bg-white/80 p-3 rounded-xl border border-purple-100">
                      <strong class="text-[#0F1035] block font-bold">1. Zéro suppression</strong>
                      <span>Les 22 métiers du rapport 2187 sont conservés sans omission ni ajout fantôme.</span>
                    </div>
                    <div class="bg-white/80 p-3 rounded-xl border border-purple-100">
                      <strong class="text-[#0F1035] block font-bold">2. Absence ≠ Désintérêt</strong>
                      <span>Un métier non mentionné en entretien conserve son statut "À explorer" sans pénalité.</span>
                    </div>
                    <div class="bg-white/80 p-3 rounded-xl border border-purple-100">
                      <strong class="text-[#0F1035] block font-bold">3. Justification sourcée</strong>
                      <span>Chaque statut est motivé par la page du rapport et le verbatim de l'entretien.</span>
                    </div>
                  </div>
                </div>

                <!-- Showcase des rapprochements motivés -->
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                  <h3 class="text-base font-black text-[#0F1035]">
                    Propositions IA motivées par le rapport et l'entretien
                  </h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Technicien du son -->
                    <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div class="flex items-center justify-between">
                        <strong class="text-sm font-black text-emerald-900">Technicien / Technicienne du son</strong>
                        <span class="rounded-full bg-emerald-200 text-emerald-800 px-2.5 py-0.5 text-xs font-black">À approfondir</span>
                      </div>
                      <p class="text-xs text-emerald-800 leading-relaxed">
                        <strong>Justification :</strong> Présent dans le rapport (Page 9, Zone 3) et cité avec grand enthousiasme lors de l'entretien pour la manipulation de consoles audio.
                      </p>
                      <div class="text-[11px] font-mono text-emerald-700 bg-white/70 p-2 rounded-lg">
                        Preuves : Rapport p. 9 • Entretien §2 (Motivations studio)
                      </div>
                    </div>

                    <!-- Graphiste -->
                    <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div class="flex items-center justify-between">
                        <strong class="text-sm font-black text-emerald-900">Graphiste</strong>
                        <span class="rounded-full bg-emerald-200 text-emerald-800 px-2.5 py-0.5 text-xs font-black">À approfondir</span>
                      </div>
                      <p class="text-xs text-emerald-800 leading-relaxed">
                        <strong>Justification :</strong> Présent dans le rapport (Page 9, Zone 3) en adéquation avec le profil Artistique (p. 4). Intérêt fort pour la création graphique.
                      </p>
                      <div class="text-[11px] font-mono text-emerald-700 bg-white/70 p-2 rounded-lg">
                        Preuves : Rapport p. 9 &amp; RIASEC p. 4 • Entretien §2
                      </div>
                    </div>

                    <!-- Développeur web -->
                    <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                      <div class="flex items-center justify-between">
                        <strong class="text-sm font-black text-amber-900">Développeur / Développeuse web</strong>
                        <span class="rounded-full bg-amber-200 text-amber-800 px-2.5 py-0.5 text-xs font-black">Différé</span>
                      </div>
                      <p class="text-xs text-amber-800 leading-relaxed">
                        <strong>Justification :</strong> Présent dans le rapport (Page 9, Zone 3). Emma a formulé une réserve explicite sur le travail solitaire prolongé devant un écran.
                      </p>
                      <div class="text-[11px] font-mono text-amber-700 bg-white/70 p-2 rounded-lg">
                        Preuves : Rapport p. 9 • Entretien §3 (Réserves explicites)
                      </div>
                    </div>

                    <!-- Pistes ouvertes -->
                    <div class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-2">
                      <div class="flex items-center justify-between">
                        <strong class="text-sm font-black text-[#0F1035]">19 Pistes ouvertes (Photographe, Monteur...)</strong>
                        <span class="rounded-full bg-[#EDE9FE] text-[#6D28D9] px-2.5 py-0.5 text-xs font-black">À explorer</span>
                      </div>
                      <p class="text-xs text-[#42466B] leading-relaxed">
                        <strong>Justification :</strong> Métiers du rapport non abordés en détail durant la séance. Ils restent intégralement accessibles dans l'espace jeune.
                      </p>
                      <div class="text-[11px] font-mono text-[#6D28D9] bg-white/70 p-2 rounded-lg">
                        Preuves : Rapport p. 8 à 11 • Statut ouvert préservé
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-4 border-t border-[#F0EDFA]">
                    <button type="button" (click)="setWorkflowStep(2)" class="text-xs font-bold text-[#42466B] hover:text-[#0F1035]">
                      ← Ajuster l'entretien (Étape 02)
                    </button>
                    <button
                      type="button"
                      (click)="setWorkflowStep(4)"
                      class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-7 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                      <span>Passer à la validation des métiers par le psychologue (Étape 04) →</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- ÉTAPE 04 : VALIDER LES MÉTIERS             -->
              <!-- ========================================== -->
              <div *ngIf="counselorWorkflowStep === 4" class="space-y-6">
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
                  <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0EDFA]">
                    <div>
                      <h2 class="text-xl font-black text-[#0F1035] flex items-center gap-2">
                        <span><mb-icon name="target"></mb-icon></span>
                        <span>04. Valider les 22 métiers (Contrôle psychologue)</span>
                      </h2>
                      <p class="text-xs text-[#42466B]">
                        Le professionnel valide ou ajuste les orientations. Chaque métier validé sera restitué au jeune avec son statut.
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        (click)="bulkValidateCareers()"
                        class="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-black shadow transition cursor-pointer"
                      >
                        ✓ Tout valider conforme (22/22)
                      </button>
                    </div>
                  </div>

                  <!-- Grille des 22 fiches métiers -->
                  <div class="space-y-3">
                    <div
                      *ngFor="let a of careerAssessments"
                      class="rounded-2xl border p-4 space-y-2.5 transition"
                      [class.bg-emerald-50]="a.finalStatus === 'TO_DEEPEN'"
                      [class.border-emerald-200]="a.finalStatus === 'TO_DEEPEN'"
                      [class.bg-amber-50]="a.finalStatus === 'DEFERRED'"
                      [class.border-amber-200]="a.finalStatus === 'DEFERRED'"
                      [class.bg-[#FAF8FF]]="a.finalStatus === 'TO_EXPLORE'"
                      [class.border-[#E4E0F5]]="a.finalStatus === 'TO_EXPLORE'"
                    >
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2.5">
                          <span class="rounded-lg bg-white px-2 py-0.5 text-xs font-mono font-bold text-[#6D28D9] border border-purple-100">
                            Zone {{ a.jobZone }} • p. {{ a.sourcePage }}
                          </span>
                          <h4 class="text-sm font-black text-[#0F1035]">{{ a.originalTitle }}</h4>
                          <span *ngIf="a.isModified" class="rounded-full bg-purple-100 text-[#6D28D9] px-2 py-0.5 text-[10px] font-extrabold">
                            Ajusté par conseiller
                          </span>
                        </div>

                        <!-- 4 Boutons de statut interactifs -->
                        <div class="flex flex-wrap gap-1.5 text-xs">
                          <button
                            type="button"
                            (click)="updateCareerStatus(a, 'TO_DEEPEN')"
                            [class]="a.finalStatus === 'TO_DEEPEN'
                              ? 'bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-300'
                              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold'"
                            class="rounded-full px-3 py-1 transition cursor-pointer"
                          >
                            À approfondir
                          </button>
                          <button
                            type="button"
                            (click)="updateCareerStatus(a, 'TO_EXPLORE')"
                            [class]="a.finalStatus === 'TO_EXPLORE'
                              ? 'bg-[#7C3AED] text-white font-black shadow-xs ring-2 ring-purple-300'
                              : 'bg-white text-[#6D28D9] border border-[#DDD6FE] hover:bg-purple-100 font-bold'"
                            class="rounded-full px-3 py-1 transition cursor-pointer"
                          >
                            À explorer
                          </button>
                          <button
                            type="button"
                            (click)="updateCareerStatus(a, 'DEFERRED')"
                            [class]="a.finalStatus === 'DEFERRED'
                              ? 'bg-amber-600 text-white font-black shadow-xs ring-2 ring-amber-300'
                              : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold'"
                            class="rounded-full px-3 py-1 transition cursor-pointer"
                          >
                            Différé
                          </button>
                          <button
                            type="button"
                            (click)="updateCareerStatus(a, 'NEEDS_REVIEW')"
                            [class]="a.finalStatus === 'NEEDS_REVIEW'
                              ? 'bg-gray-700 text-white font-black shadow-xs'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 font-bold'"
                            class="rounded-full px-3 py-1 transition cursor-pointer"
                          >
                            À clarifier
                          </button>
                        </div>
                      </div>

                      <p class="text-xs text-[#42466B] italic bg-white/70 p-2 rounded-xl border border-black/5">
                        {{ a.explanationRationale }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-4 border-t border-[#F0EDFA]">
                    <button type="button" (click)="setWorkflowStep(3)" class="text-xs font-bold text-[#42466B] hover:text-[#0F1035]">
                      ← Retour à la sélection IA (Étape 03)
                    </button>
                    <button
                      type="button"
                      (click)="setWorkflowStep(5)"
                      class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-7 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                      <span>Valider &amp; Générer les 6 épisodes audio (Étape 05) →</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- ÉTAPE 05 : GÉNÉRER LES ÉPISODES AUDIO      -->
              <!-- ========================================== -->
              <div *ngIf="counselorWorkflowStep === 5" class="space-y-6">
                <!-- Barre d'action synthèse globale -->
                <div class="rounded-2xl bg-gradient-to-r from-purple-50 via-white to-pink-50 border border-purple-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div>
                    <h3 class="text-base font-black text-[#0F1035]">6 Épisodes thématiques calibrés à ~2 minutes</h3>
                    <p class="text-xs text-[#42466B]">Volume : ~250 mots par épisode • Synthèse vocale Piper TTS &amp; Transcription synchronisée</p>
                  </div>
                  <button
                    type="button"
                    (click)="generateAllEpisodesAudio()"
                    [disabled]="isGeneratingPiperAudio"
                    class="rounded-full bg-gradient-to-r from-[#EC4899] to-[#9333EA] text-white px-5 py-2 text-xs font-black shadow hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span *ngIf="isGeneratingPiperAudio" class="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span><mb-icon name="zap"></mb-icon> Générer l'audio des 6 épisodes (Piper TTS)</span>
                  </button>
                </div>

                <!-- Sélecteur des 6 épisodes -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <button
                    *ngFor="let ep of audioEpisodes; let idx = index"
                    type="button"
                    (click)="selectEpisode(idx)"
                    [class]="selectedEpisodeIndex === idx
                      ? 'bg-[#7C3AED] text-white shadow-md ring-2 ring-purple-300 font-black'
                      : 'bg-white text-[#0F1035] border border-[#E4E0F5] hover:bg-purple-50 font-bold'"
                    class="rounded-2xl p-3 text-left transition flex flex-col justify-between gap-1 cursor-pointer"
                  >
                    <span class="text-[10px] uppercase font-mono tracking-wider opacity-85">Épisode {{ ep.episodeNumber }}</span>
                    <strong class="text-xs leading-tight line-clamp-1">{{ ep.title }}</strong>
                    <div class="flex items-center justify-between text-[10px] pt-1">
                      <span>{{ ep.wordCount }} mots</span>
                      <span class="text-emerald-300 font-extrabold">✓ Prêt</span>
                    </div>
                  </button>
                </div>

                <!-- Établi de l'épisode sélectionné -->
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-5">
                  <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0EDFA]">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="rounded-full bg-[#EDE9FE] text-[#6D28D9] px-2.5 py-0.5 text-xs font-black">
                          Épisode {{ currentEpisode.episodeNumber }} / 6
                        </span>
                        <h3 class="text-lg font-black text-[#0F1035]">{{ currentEpisode.title }}</h3>
                      </div>
                      <p class="text-xs text-[#42466B] mt-1">
                        Références vérifiables : Pages {{ currentEpisode.sourcePages.join(', ') }} du Rapport du Centre des Possibles
                      </p>
                    </div>

                    <div class="flex items-center gap-2">
                      <span class="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-black">
                        {{ currentEpisode.wordCount }} mots (~2 min)
                      </span>
                      <button
                        type="button"
                        (click)="generateEpisodeAudio(selectedEpisodeIndex)"
                        class="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-1.5 text-xs font-extrabold shadow transition cursor-pointer"
                      >
                        Synthèse vocale Piper TTS
                      </button>
                    </div>
                  </div>

                  <!-- Éditeur du script pédagogique -->
                  <div class="space-y-2">
                    <label class="text-xs font-extrabold text-[#31355B] block">Script audio pédagogique (validé et éditable) :</label>
                    <textarea
                      [(ngModel)]="currentEpisode.script"
                      rows="6"
                      class="w-full rounded-2xl bg-[#F8F7FF] border border-[#D8DCF0] p-4 text-xs sm:text-sm text-[#0F1035] leading-relaxed focus:bg-white transition"
                    ></textarea>
                  </div>

                  <!-- Timeline des segments synchronisés -->
                  <div class="space-y-2">
                    <label class="text-xs font-extrabold text-[#31355B] block">Segments synchronisés (alignement texte/voix) :</label>
                    <div class="space-y-1.5">
                      <div
                        *ngFor="let seg of currentEpisode.segments; let sIdx = index"
                        (click)="activeAudioSegmentIndex = sIdx"
                        [class]="activeAudioSegmentIndex === sIdx ? 'bg-purple-100 border-[#7C3AED]' : 'bg-gray-50 border-transparent'"
                        class="p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer hover:bg-purple-50 transition"
                      >
                        <span class="font-mono text-[#6D28D9] font-bold w-28 flex-shrink-0">
                          [{{ seg.startMs / 1000 | number:'1.0-0' }}s – {{ seg.endMs / 1000 | number:'1.0-0' }}s]
                        </span>
                        <span class="text-[#0F1035] flex-1 px-2 font-medium">{{ seg.text }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-4 border-t border-[#F0EDFA]">
                    <button type="button" (click)="setWorkflowStep(4)" class="text-xs font-bold text-[#42466B] hover:text-[#0F1035]">
                      ← Retour à la validation des métiers (Étape 04)
                    </button>
                    <button
                      type="button"
                      (click)="setWorkflowStep(6)"
                      class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white px-7 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                      <span>Passer au contrôle final et publication (Étape 06) →</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- ÉTAPE 06 : PUBLIER AU JEUNE                -->
              <!-- ========================================== -->
              <div *ngIf="counselorWorkflowStep === 6" class="space-y-6">
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 sm:p-7 shadow-sm space-y-6">
                  <div class="pb-3 border-b border-[#F0EDFA]">
                    <h2 class="text-xl font-black text-[#0F1035] flex items-center gap-2">
                      <span><mb-icon name="rocket"></mb-icon></span>
                      <span>06. Contrôle final et publication au jeune</span>
                    </h2>
                    <p class="text-xs text-[#42466B] mt-0.5">
                      Vérification finale des contrôles d'accès (ABAC &amp; Tenant) et validation de publication.
                    </p>
                  </div>

                  <!-- Checklist de sécurité et de conformité -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-3">
                      <h4 class="text-xs font-black uppercase tracking-wider text-[#42466B]">Contrôles de sécurité &amp; Multi-Tenant</h4>
                      <ul class="space-y-2 text-xs font-bold text-[#0F1035]">
                        <li class="flex items-center gap-2 text-emerald-700">
                          <span>✓</span>
                          <span>Isolation Établissement : Centre des Possibles (Nice)</span>
                        </li>
                        <li class="flex items-center gap-2 text-emerald-700">
                          <span>✓</span>
                          <span>Professionnel autorisé : Sarah Dupont (Psychologue)</span>
                        </li>
                        <li class="flex items-center gap-2 text-emerald-700">
                          <span>✓</span>
                          <span>Destinataire unique : Emma D. (Jeune autorisé)</span>
                        </li>
                        <li class="flex items-center gap-2 text-emerald-700">
                          <span>✓</span>
                          <span>Stockage privé sécurisé sans exposition d'URL brute</span>
                        </li>
                      </ul>
                    </div>

                    <div class="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] space-y-3">
                      <h4 class="text-xs font-black uppercase tracking-wider text-[#42466B]">Contrôles de conformité documentaire</h4>
                      <ul class="space-y-2 text-xs font-bold text-[#0F1035]">
                        <li class="flex items-center gap-2 text-emerald-700">
                          <span>✓</span>
                          <span>22 Métiers O*NET extraits et validés (zéro omission)</span>
                        </li>
                        <li class="flex items-center gap-2 text-emerald-700">
                          <span>✓</span>
                          <span>6 Épisodes audio thématiques calibrés à ~2 minutes</span>
                        </li>
                        <li class="flex items-center gap-2 text-emerald-700">
                          <span>✓</span>
                          <span>Zéro diagnostic psychologique autonome (Centre des Possibles fait foi)</span>
                        </li>
                        <li class="flex items-center gap-2 text-emerald-700">
                          <span>✓</span>
                          <span>Preuves sourcées pages 1 à 17 vérifiées</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Action finale de publication -->
                  <div class="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border border-emerald-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="space-y-1">
                      <strong class="text-base font-black text-emerald-950 block">Prêt pour la restitution au jeune</strong>
                      <p class="text-xs text-emerald-800">
                        La restitution sera instantanément disponible dans l'Espace Jeune d'Emma D.
                      </p>
                    </div>

                    <div class="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        (click)="publishRestitutionToYoung()"
                        class="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs sm:text-sm font-black shadow-md transition cursor-pointer"
                      >
                        {{ isRestitutionPublishedToYoung ? '✓ Restitution publiée' : 'Publier la restitution' }}
                      </button>
                      <button
                        type="button"
                        (click)="activePortal = 'JEUNE'; activeYoungTab = 'MON_BILAN'; showAudioFocusSubView = true"
                        class="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-3 text-xs font-extrabold shadow transition cursor-pointer"
                      >
                        Basculer sur l'Espace Jeune →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VUE CONSEILLER 6 : SUIVI & RENDEZ-VOUS (Maquettes "Suivi des rendez-vous MonBilan+.webp" & "Tableau de suivi des rendez-vous.webp") -->
            <div *ngIf="activeCounselorTab === 'SUIVI_RDV'" class="space-y-6">
              <!-- Barre de sélection entre les 2 maquettes : "Mon agenda (Vue Calendrier)" et "Mes rendez-vous (Vue Liste)" -->
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    (click)="rdvSubView = 'AGENDA'"
                    [class]="rdvSubView === 'AGENDA'
                      ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow'
                      : 'bg-white text-[#0F1035] border border-[#E4E0F5]'"
                    class="rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition"
                  >
                    <mb-icon name="calendar"></mb-icon> Mon agenda (Semaine du 16 au 22 nov. 2026)
                  </button>
                  <button
                    type="button"
                    (click)="rdvSubView = 'LISTE'"
                    [class]="rdvSubView === 'LISTE'
                      ? 'bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white shadow'
                      : 'bg-white text-[#0F1035] border border-[#E4E0F5]'"
                    class="rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition"
                  >
                    <mb-icon name="clipboard-list"></mb-icon> Mes rendez-vous (Tableau de suivi)
                  </button>
                </div>
                <button
                  type="button"
                  (click)="statusBanner = 'Nouveau créneau d’échange programmé au Centre des Possibles (Salle 2).'"
                  class="rounded-full bg-[#6328E8] text-white px-5 py-2.5 text-xs font-extrabold shadow"
                >
                  + Nouveau rendez-vous
                </button>
              </div>

              <!-- SOUS-VUE 6A : MON AGENDA HEBDOMADAIRE (Maquette "Suivi des rendez-vous MonBilan+.webp") -->
              <div *ngIf="rdvSubView === 'AGENDA'" class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <!-- Grille agenda hebdomadaire -->
                  <div class="lg:col-span-7 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                    <div class="flex items-center justify-between">
                      <h2 class="text-lg font-extrabold text-[#0F1035]"><mb-icon name="calendar"></mb-icon> Semaine du 16 au 22 nov. 2026</h2>
                      <span class="rounded-full bg-[#F3EFFE] text-[#6D28D9] px-3 py-1 text-xs font-extrabold">Aujourd’hui</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 text-center text-xs">
                      <div class="p-2.5 rounded-xl bg-[#F8F7FF] space-y-3">
                        <strong class="block text-[#0F1035]">Lun 16</strong>
                        <div class="p-2 rounded-lg bg-[#EDE9FE] text-[#5B21B6] font-bold">09:00 Emma D. (Bilan &amp; pistes)</div>
                        <div class="mt-10 p-2 rounded-lg bg-[#FCE7F3] text-[#BE185D] font-bold">16:00 Noah P. (Questions)</div>
                      </div>
                      <div class="p-2.5 rounded-xl bg-[#F8F7FF]">
                        <strong class="block text-[#0F1035]">Mar 17</strong>
                        <div class="mt-8 p-2 rounded-lg bg-[#FEF3C7] text-[#B45309] font-bold">11:00 Aïcha D. (Orientation)</div>
                      </div>
                      <div class="p-2.5 rounded-xl bg-[#EDE9FE] border border-[#7C3AED]">
                        <strong class="block text-[#6D28D9]">Mer 18</strong>
                        <div class="mt-12 p-2 rounded-lg bg-[#7C3AED] text-white font-bold shadow">14:00 Matéo R. / Rdv 2187</div>
                      </div>
                      <div class="p-2.5 rounded-xl bg-[#F8F7FF]">
                        <strong class="block text-[#0F1035]">Jeu 19</strong>
                        <div class="mt-2 p-2 rounded-lg bg-[#FCE7F3] text-[#BE185D] font-bold">09:00 Lucas M. (Suivi projet)</div>
                      </div>
                      <div class="p-2.5 rounded-xl bg-[#F8F7FF]">
                        <strong class="block text-[#0F1035]">Ven 20</strong>
                        <div class="mt-14 p-2 rounded-lg bg-[#DCFCE7] text-[#15803D] font-bold">15:00 Sofia K. (Choix formation)</div>
                      </div>
                    </div>
                  </div>

                  <!-- Fiche de préparation du RDV -->
                  <div class="lg:col-span-5 rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-lg font-extrabold text-[#0F1035]">Emma D. (Dossier Rdv {{ rdvNumber }})</h3>
                        <p class="text-xs text-[#42466B]">16 ans • Centre des Possibles – Salle 2</p>
                      </div>
                      <span class="rounded-full bg-[#DCFCE7] text-[#15803D] px-3 py-1 text-xs font-extrabold">✓ Rendez-vous confirmé</span>
                    </div>
                    <p class="text-xs text-[#42466B]"><mb-icon name="calendar"></mb-icon> Mer. 18 nov. 2026 • <mb-icon name="clock"></mb-icon> 14h00 – 15h00 (1 h)</p>
                    <div class="flex flex-wrap gap-2">
                      <button type="button" (click)="activeCounselorTab = 'VALIDATIONS_PUBLICATIONS'" class="rounded-full bg-[#7C3AED] text-white px-4 py-1.5 text-xs font-extrabold"><mb-icon name="file-text"></mb-icon> Préparer l’échange</button>
                      <button type="button" (click)="rdvSubView = 'LISTE'" class="rounded-full bg-[#F4F2FF] text-[#6D28D9] px-4 py-1.5 text-xs font-extrabold"><mb-icon name="pencil"></mb-icon> Voir tous les RDV</button>
                    </div>
                    <div class="space-y-2 pt-3 border-t border-[#F0EDFA] text-xs font-bold text-[#31355B]">
                      <p class="text-[#0F1035] font-extrabold"><mb-icon name="sparkles"></mb-icon> Préparation du rendez-vous :</p>
                      <label class="flex items-center gap-2"><input type="checkbox" checked class="accent-[#22C55E]" /> Consulter le bilan Rdv {{ rdvNumber }} et la synthèse</label>
                      <label class="flex items-center gap-2"><input type="checkbox" checked class="accent-[#22C55E]" /> Relire les points clés (intérêts, aptitudes, 22 pistes)</label>
                      <label class="flex items-center gap-2"><input type="checkbox" checked class="accent-[#22C55E]" /> Identifier les {{ questions.length }} questions à approfondir</label>
                      <label class="flex items-center gap-2"><input type="checkbox" class="accent-[#22C55E]" /> Préparer des ressources (formations, stages, liens)</label>
                    </div>
                  </div>
                </div>

                <!-- 4 cartes KPI hebdomadaires du bas -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <span class="text-xs font-bold text-[#42466B]">Cette semaine • Planifiés</span>
                    <p class="text-2xl font-black text-[#0F1035] mt-1">6</p>
                  </div>
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <span class="text-xs font-bold text-[#42466B]">Rendez-vous réalisés</span>
                    <p class="text-2xl font-black text-[#15803D] mt-1">4</p>
                  </div>
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <span class="text-xs font-bold text-[#42466B]">Jeunes à relancer</span>
                    <p class="text-2xl font-black text-[#D97706] mt-1">2</p>
                  </div>
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <span class="text-xs font-bold text-[#42466B]">Suivi post-restitution</span>
                    <p class="text-2xl font-black text-[#6D28D9] mt-1">Actif</p>
                  </div>
                </div>
              </div>

              <!-- SOUS-VUE 6B : TABLEAU DE SUIVI DES RENDEZ-VOUS (Maquette "Tableau de suivi des rendez-vous.webp") -->
              <div *ngIf="rdvSubView === 'LISTE'" class="space-y-6">
                <!-- 5 Compteurs supérieurs -->
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <p class="text-2xl font-black text-[#6D28D9]">1</p>
                    <span class="text-xs font-bold text-[#42466B]">Rendez-vous aujourd’hui</span>
                  </div>
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <p class="text-2xl font-black text-[#D97706]">3</p>
                    <span class="text-xs font-bold text-[#42466B]">À venir</span>
                  </div>
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <p class="text-2xl font-black text-[#15803D]">4</p>
                    <span class="text-xs font-bold text-[#42466B]">Réalisés</span>
                  </div>
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <p class="text-2xl font-black text-[#2563EB]">1</p>
                    <span class="text-xs font-bold text-[#42466B]">À reprogrammer</span>
                  </div>
                  <div class="rounded-2xl bg-white border border-[#E4E0F5] p-4 shadow-sm">
                    <p class="text-2xl font-black text-[#DC2626]">0</p>
                    <span class="text-xs font-bold text-[#42466B]">Annulé</span>
                  </div>
                </div>

                <!-- Rendez-vous du jour -->
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                  <h3 class="text-base font-extrabold text-[#0F1035]"><mb-icon name="calendar"></mb-icon> Rendez-vous du jour — Mer. 18 nov. 2026</h3>
                  <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <div class="rounded-xl bg-[#EDE9FE] text-[#6D28D9] px-3.5 py-2 text-xs font-extrabold">
                        14:30 – 15:30
                      </div>
                      <div>
                        <p class="text-sm font-extrabold text-[#0F1035]">Emma D. (Dossier Rdv {{ rdvNumber }})</p>
                        <p class="text-xs text-[#42466B]">Entretien de suivi — Échanger sur son bilan et ses {{ favoriteCareers.length }} pistes retenues</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="rounded-full bg-[#FEF3C7] text-[#B45309] px-3 py-1 text-xs font-extrabold"><mb-icon name="hourglass"></mb-icon> À venir</span>
                      <button
                        type="button"
                        (click)="activeCounselorTab = 'VALIDATIONS_PUBLICATIONS'"
                        class="rounded-full bg-[#6328E8] text-white px-4 py-2 text-xs font-extrabold shadow"
                      >
                        <mb-icon name="folder"></mb-icon> Ouvrir le dossier
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Prochains rendez-vous -->
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-4">
                  <h3 class="text-base font-extrabold text-[#0F1035]"><mb-icon name="clipboard-list"></mb-icon> Prochains rendez-vous</h3>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                      <thead>
                        <tr class="border-b border-[#E4E0F5] text-[#42466B]">
                          <th class="pb-3 font-extrabold">Date &amp; heure</th>
                          <th class="pb-3 font-extrabold">Jeune</th>
                          <th class="pb-3 font-extrabold">Objet</th>
                          <th class="pb-3 font-extrabold">Statut</th>
                          <th class="pb-3 font-extrabold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-[#F0EDFA] font-bold text-[#0F1035]">
                        <tr>
                          <td class="py-3">Jeu. 19 nov. 14:00 – 15:00</td>
                          <td class="py-3">Lucas M.</td>
                          <td class="py-3 text-[#42466B]">Point d’avancement</td>
                          <td class="py-3"><span class="rounded-full bg-[#FEF3C7] text-[#B45309] px-2.5 py-1 text-[11px] font-extrabold"><mb-icon name="hourglass"></mb-icon> À venir</span></td>
                          <td class="py-3 text-right"><button type="button" (click)="activeCounselorTab = 'DOSSIERS_JEUNES'" class="text-[#6D28D9] font-extrabold hover:underline">Voir →</button></td>
                        </tr>
                        <tr>
                          <td class="py-3">Ven. 20 nov. 10:30 – 11:00</td>
                          <td class="py-3">Aïcha D.</td>
                          <td class="py-3 text-[#42466B]">Restitution du bilan</td>
                          <td class="py-3"><span class="rounded-full bg-[#DCFCE7] text-[#15803D] px-2.5 py-1 text-[11px] font-extrabold">✓ Confirmé</span></td>
                          <td class="py-3 text-right"><button type="button" (click)="activeCounselorTab = 'DOSSIERS_JEUNES'" class="text-[#6D28D9] font-extrabold hover:underline">Voir →</button></td>
                        </tr>
                        <tr>
                          <td class="py-3">Lun. 23 nov. 16:00 – 16:30</td>
                          <td class="py-3">Matéo R.</td>
                          <td class="py-3 text-[#42466B]">Préparation du projet</td>
                          <td class="py-3"><span class="rounded-full bg-[#DCFCE7] text-[#15803D] px-2.5 py-1 text-[11px] font-extrabold">✓ Confirmé</span></td>
                          <td class="py-3 text-right"><button type="button" (click)="activeCounselorTab = 'DOSSIERS_JEUNES'" class="text-[#6D28D9] font-extrabold hover:underline">Voir →</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- VUE CONSEILLER 7 : STATISTIQUES -->
            <div *ngIf="activeCounselorTab === 'STATISTIQUES'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-2">
                  <span class="text-xs font-extrabold text-[#6D28D9]">STRUCTURE DU RAPPORT 2187</span>
                  <p class="text-3xl font-black text-[#0F1035]">17 pages</p>
                  <p class="text-xs text-[#42466B]">100 % des faits personnels reliés à leur page d’origine.</p>
                </div>
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-2">
                  <span class="text-xs font-extrabold text-[#6D28D9]">CHAMPS DES POSSIBLES</span>
                  <p class="text-3xl font-black text-[#0F1035]">22 métiers</p>
                  <p class="text-xs text-[#42466B]">Répartis sur les 5 zones de temps de préparation (O*NET FR).</p>
                </div>
                <div class="rounded-[26px] bg-white border border-[#E4E0F5] p-6 shadow-sm space-y-2">
                  <span class="text-xs font-extrabold text-[#15803D]">CONTRÔLE HUMAIN</span>
                  <p class="text-3xl font-black text-[#0F1035]">Obligatoire</p>
                  <p class="text-xs text-[#42466B]">Aucune publication sans validation d’un professionnel.</p>
                </div>
              </div>
            </div>

            <!-- VUE CONSEILLER 8 : PARAMÈTRES (Fidèle à la maquette officielle Espace Conseiller) -->
            <div *ngIf="activeCounselorTab === 'PARAMETRES'">
              <app-counselor-settings
                [firstName]="counselorFirstName"
                [lastName]="counselorLastName"
                [email]="counselorEmail"
                [roleTitle]="counselorRoleTitle"
                [organization]="counselorOrganization"
                [photoUrl]="counselorPhotoUrl"
                (profileSave)="onCounselorProfileSave($event)"
                (logout)="logout()"
              ></app-counselor-settings>
            </div>
          </ng-container>
        </main>

        <!-- ================================================================== -->
        <!-- BARRE DE NAVIGATION BASSE MOBILE (< lg)                            -->
        <!-- (Fidèle aux smartphones de "Maquette MonBilan+ _ parcours et interfaces mobile.webp") -->
        <!-- ================================================================== -->
        <nav
          aria-label="Navigation rapide mobile"
          class="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E4E0F5] px-2 py-1.5 shadow-[0_-4px_20px_rgba(15,16,53,0.08)]"
        >
          <div *ngIf="activePortal === 'YOUNG' && journeyMode === 'SUPPORTED'" class="grid grid-cols-5 gap-1">
            <button
              type="button"
              (click)="selectYoungTab('ACCUEIL')"
              [class]="activeYoungTab === 'ACCUEIL' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="house"></mb-icon></span>
              <span class="mt-0.5">Accueil</span>
            </button>
            <button
              type="button"
              (click)="selectYoungTab('MON_BILAN')"
              [class]="activeYoungTab === 'MON_BILAN' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="headphones"></mb-icon></span>
              <span class="mt-0.5">Bilan</span>
            </button>
            <button
              type="button"
              (click)="selectYoungTab('IMMERSION_PRO')"
              [class]="(activeYoungTab === 'IMMERSION_PRO' || activeYoungTab === 'EXPLORER_METIERS') ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="briefcase"></mb-icon></span>
              <span class="mt-0.5">Immersion</span>
            </button>
            <button
              type="button"
              (click)="selectYoungTab('MON_PARCOURS')"
              [class]="activeYoungTab === 'MON_PARCOURS' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="map"></mb-icon></span>
              <span class="mt-0.5">Parcours</span>
            </button>
            <button
              type="button"
              (click)="isMobileMenuOpen = true"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] text-[#42466B] font-semibold"
            >
              <span class="text-base leading-none">☰</span>
              <span class="mt-0.5">Plus</span>
            </button>
          </div>

          <div *ngIf="activePortal === 'YOUNG' && journeyMode === 'AUTONOMOUS'" class="grid grid-cols-5 gap-1">
            <button
              type="button"
              (click)="selectYoungTab('ACCUEIL_AUTONOME')"
              [class]="(activeYoungTab === 'ACCUEIL_AUTONOME' || activeYoungTab === 'ACCUEIL') ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="house"></mb-icon></span>
              <span class="mt-0.5">Accueil</span>
            </button>
            <button
              type="button"
              (click)="selectYoungTab('CATALOGUE_METIERS')"
              [class]="(activeYoungTab === 'CATALOGUE_METIERS' || activeYoungTab === 'EXPLORER_METIERS') ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="search"></mb-icon></span>
              <span class="mt-0.5">Métiers</span>
            </button>
            <button
              type="button"
              (click)="selectYoungTab('IMMERSION_PRO')"
              [class]="activeYoungTab === 'IMMERSION_PRO' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="briefcase"></mb-icon></span>
              <span class="mt-0.5">Immersion</span>
            </button>
            <button
              type="button"
              (click)="selectYoungTab('ANNUAIRE_SUPPORT')"
              [class]="activeYoungTab === 'ANNUAIRE_SUPPORT' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="landmark"></mb-icon></span>
              <span class="mt-0.5">Aide</span>
            </button>
            <button
              type="button"
              (click)="isMobileMenuOpen = true"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] text-[#42466B] font-semibold"
            >
              <span class="text-base leading-none">☰</span>
              <span class="mt-0.5">Plus</span>
            </button>
          </div>

          <div *ngIf="activePortal === 'COUNSELOR'" class="grid grid-cols-5 gap-1">
            <button
              type="button"
              (click)="selectCounselorTab('TABLEAU_DE_BORD')"
              [class]="activeCounselorTab === 'TABLEAU_DE_BORD' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="house"></mb-icon></span>
              <span class="mt-0.5">Accueil</span>
            </button>
            <button
              type="button"
              (click)="selectCounselorTab('DOSSIERS_JEUNES')"
              [class]="activeCounselorTab === 'DOSSIERS_JEUNES' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="users"></mb-icon></span>
              <span class="mt-0.5">Dossiers</span>
            </button>
            <button
              type="button"
              (click)="selectCounselorTab('IMPORTER_RAPPORT')"
              [class]="activeCounselorTab === 'IMPORTER_RAPPORT' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="upload"></mb-icon></span>
              <span class="mt-0.5">Import</span>
            </button>
            <button
              type="button"
              (click)="selectCounselorTab('VALIDATIONS_PUBLICATIONS')"
              [class]="activeCounselorTab === 'VALIDATIONS_PUBLICATIONS' ? 'text-[#7C3AED] font-extrabold bg-[#F3EFFE]' : 'text-[#42466B] font-semibold'"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px]"
            >
              <span class="text-base leading-none"><mb-icon name="circle-check"></mb-icon></span>
              <span class="mt-0.5">Valider</span>
            </button>
            <button
              type="button"
              (click)="isMobileMenuOpen = true"
              class="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] text-[#42466B] font-semibold"
            >
              <span class="text-base leading-none">☰</span>
              <span class="mt-0.5">Plus</span>
            </button>
          </div>
        </nav>

        <!-- MODAL DÉFINITION DE LA ZONE DE PRÉPARATION (O*NET) -->
        <div
          *ngIf="showZoneDefinitionModal"
          class="fixed inset-0 z-50 bg-[#0F1035]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div class="rounded-3xl bg-white max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-[#E4E0F5]">
            <div class="flex items-start justify-between gap-3 pb-3 border-b border-[#F0EDFA]">
              <div class="flex items-center gap-3">
                <span class="h-10 w-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xl font-black shrink-0">
                  <mb-icon name="book-open"></mb-icon>
                </span>
                <div>
                  <h3 class="text-lg sm:text-xl font-extrabold text-[#0F1035]">C'est quoi une « Zone » ?</h3>
                  <p class="text-xs text-[#555A8A]">Classification O*NET utilisée par le Centre des Possibles</p>
                </div>
              </div>
              <button
                type="button"
                (click)="showZoneDefinitionModal = false"
                class="h-8 w-8 rounded-full bg-[#F3EFFE] text-[#6D28D9] hover:bg-[#EDE9FE] flex items-center justify-center font-black text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            <div class="space-y-3 text-xs sm:text-sm text-[#31355B] leading-relaxed">
              <p>
                Dans ton rapport d’orientation, le terme <strong>« Zone de préparation »</strong> ne désigne pas une zone géographique, mais <strong>le niveau de formation, d’études et d’expérience nécessaire</strong> pour exercer chaque métier.
              </p>
              <div class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-4 space-y-2.5 text-xs">
                <div class="flex items-start gap-2.5">
                  <span class="rounded-md bg-[#7C3AED] text-white px-2 py-0.5 text-[10px] font-black shrink-0">Zone 1</span>
                  <div>
                    <strong class="text-[#0F1035] block">0 à 6 mois d'accès</strong>
                    <span class="text-[#42466B]">Peu ou pas de formation préalable obligatoire. Idéal pour démarrer rapidement sur le terrain (apprentissage, formation courte).</span>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 border-t border-[#F0EDFA] pt-2">
                  <span class="rounded-md bg-[#7C3AED] text-white px-2 py-0.5 text-[10px] font-black shrink-0">Zone 2</span>
                  <div>
                    <strong class="text-[#0F1035] block">3 mois à 2 ans d'accès</strong>
                    <span class="text-[#42466B]">Niveau CAP, BEP, Bac Professionnel ou CQP. Accès privilégié en contrat d’apprentissage.</span>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 border-t border-[#F0EDFA] pt-2">
                  <span class="rounded-md bg-[#7C3AED] text-white px-2 py-0.5 text-[10px] font-black shrink-0">Zone 3</span>
                  <div>
                    <strong class="text-[#0F1035] block">1 à 4 ans d'accès</strong>
                    <span class="text-[#42466B]">Niveau Bac professionnel approfondi, BTS, DMA ou Titre certifié RNCP niveau 5.</span>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 border-t border-[#F0EDFA] pt-2">
                  <span class="rounded-md bg-[#7C3AED] text-white px-2 py-0.5 text-[10px] font-black shrink-0">Zone 4</span>
                  <div>
                    <strong class="text-[#0F1035] block">2 à 6 ans d'accès</strong>
                    <span class="text-[#42466B]">Études supérieures : Licence, Bachelor, Bac+3 à Bac+4. Métiers à responsabilité technique ou d’encadrement.</span>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 border-t border-[#F0EDFA] pt-2">
                  <span class="rounded-md bg-[#7C3AED] text-white px-2 py-0.5 text-[10px] font-black shrink-0">Zone 5</span>
                  <div>
                    <strong class="text-[#0F1035] block">4 à 10 ans d'accès</strong>
                    <span class="text-[#42466B]">Études longues : Master, Doctorat, diplôme d’État (Bac+5 à Bac+8) et forte expertise spécialisée.</span>
                  </div>
                </div>
              </div>
              <p class="text-xs bg-[#FEF3C7] rounded-xl p-3 border border-[#FDE68A] text-[#92400E]">
                <mb-icon name="lightbulb"></mb-icon> <strong>À retenir :</strong> Une Zone 1 n’a pas « moins de valeur » qu’une Zone 5 ! Elle représente simplement un chemin d’accès plus court et direct vers l’emploi et l’autonomie.
              </p>
            </div>

            <button
              type="button"
              (click)="showZoneDefinitionModal = false"
              class="w-full rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white font-extrabold py-3 text-sm shadow cursor-pointer"
            >
              J’ai compris, fermer
            </button>
          </div>
        </div>
      </div>
      <!-- MODAL DE CHOIX DE PARCOURS (ONBOARDING) -->
      <app-journey-choice-modal
        [isOpen]="isJourneyChoiceModalOpen"
        [currentMode]="journeyMode"
        (modeSelected)="setJourneyMode($event)"
        (closed)="isJourneyChoiceModalOpen = false"
      ></app-journey-choice-modal>
    </div>
  `
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = true;
  currentUserEmail: string = 'emma.d@monbilan.fr';
  currentUserDisplayName: string = 'Emma D.';
  userFirstName: string = 'Emma';
  userLastName: string = 'D.';
  userPhotoUrl: string = 'assets/visuals/profile-emma.png';

  counselorFirstName: string = 'Sophie';
  counselorLastName: string = 'Martin';
  counselorDisplayName: string = 'Sophie Martin';
  counselorEmail: string = 'sophie.martin@centre-possibles.fr';
  counselorRoleTitle: string = 'Conseiller d\'orientation';
  counselorOrganization: string = 'Centre des Possibles';
  counselorPhotoUrl: string = 'assets/visuals/profile-counselor.png';

  activePortal: 'YOUNG' | 'COUNSELOR' = 'YOUNG';

  onUserPhotoChange(photo: string): void {
    this.userPhotoUrl = photo;
  }

  onUserProfileSave(data: { firstName: string; lastName: string; email: string; photoUrl: string }): void {
    this.userFirstName = data.firstName;
    this.userLastName = data.lastName;
    this.currentUserEmail = data.email;
    this.currentUserDisplayName = `${data.firstName} ${data.lastName}`.trim();
    this.userPhotoUrl = data.photoUrl;
  }

  getCounselorInitials(): string {
    const f = (this.counselorFirstName || 'S').trim().charAt(0).toUpperCase();
    const l = (this.counselorLastName || 'M').trim().charAt(0).toUpperCase();
    return `${f}${l}`;
  }

  onCounselorProfileSave(data: CounselorProfileData): void {
    this.counselorFirstName = data.firstName;
    this.counselorLastName = data.lastName;
    this.counselorEmail = data.email;
    this.counselorRoleTitle = data.roleTitle;
    this.counselorOrganization = data.organization;
    this.counselorPhotoUrl = data.photoUrl;
    this.counselorDisplayName = `${data.firstName} ${data.lastName}`.trim();

    try {
      localStorage.setItem('monbilan_counselor_firstname', data.firstName);
      localStorage.setItem('monbilan_counselor_lastname', data.lastName);
      localStorage.setItem('monbilan_counselor_email', data.email);
      localStorage.setItem('monbilan_counselor_role', data.roleTitle);
      localStorage.setItem('monbilan_counselor_photo', data.photoUrl);
    } catch {
      // localStorage fallback
    }
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey(): void {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
    if (this.isProfileMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  onLoginSuccess(event: LoginSuccessEvent): void {
    this.isAuthenticated = true;
    this.activePortal = event.role;
    if (event.role === 'YOUNG') {
      this.currentUserEmail = event.email;
      this.currentUserDisplayName = event.displayName;
      this.selectYoungTab('ACCUEIL');
    } else {
      this.counselorEmail = event.email;
      this.counselorDisplayName = event.displayName;
      this.selectCounselorTab('TABLEAU_DE_BORD');
    }
  }

  logout(): void {
    this.isAuthenticated = false;
  }

  onRegisterYoung(): void {
    this.isAuthenticated = true;
    this.activePortal = 'YOUNG';
    this.journeyMode = 'AUTONOMOUS';
    this.selectYoungTab('ACCUEIL_AUTONOME');
  }
  activeYoungTab: YoungTab = 'ACCUEIL';
  activeCounselorTab: CounselorTab = 'TABLEAU_DE_BORD';

  isMobileMenuOpen = false;
  showMobileCareerFilters = false;
  showZoneDefinitionModal = false;
  isNotificationsOpen = false;
  isProfileMenuOpen = false;
  showAudioFocusSubView = false;

  // Workflow Master 6 Étapes (Restitution Augmentée & Entretien)
  counselorWorkflowStep: CounselorWorkflowStep = 1;
  selectedEpisodeIndex = 0;
  activeAudioSegmentIndex = 0;
  careerFilterInExplorer: 'ALL' | 'TO_DEEPEN' | 'TO_EXPLORE' | 'DEFERRED' = 'ALL';
  isRestitutionPublishedToYoung = true;
  isSavingInterview = false;
  isGeneratingPiperAudio = false;
  workflowNotice: string | null = null;

  interviewForm = { ...INITIAL_INTERVIEW_FORM };
  careerAssessments: UICareerAssessment[] = [...INITIAL_CAREER_ASSESSMENTS];
  audioEpisodes: UIEpisode[] = [...INITIAL_AUDIO_EPISODES];

  youngNotifications = [
    {
      id: 'yn-1',
      icon: 'headphones',
      badgeBg: 'bg-[#EDE9FE] text-[#6D28D9]',
      title: 'Restitution Rdv 2187 disponible',
      message: 'Sarah Dupont a vérifié et validé ta restitution audio et tes 22 pistes de métiers.',
      time: 'Il y a 15 min',
      unread: true,
      targetTab: 'MON_BILAN' as YoungTab
    },
    {
      id: 'yn-2',
      icon: 'message-circle',
      badgeBg: 'bg-[#DCFCE7] text-[#15803D]',
      title: 'Réponse à ta question',
      message: 'Ta conseillère a répondu sur les formations de Peintre décorateur (CAP / Bac pro).',
      time: 'Hier • 16h20',
      unread: false,
      targetTab: 'MES_QUESTIONS' as YoungTab
    },
    {
      id: 'yn-3',
      icon: 'calendar',
      badgeBg: 'bg-[#DBEAFE] text-[#1D4ED8]',
      title: 'Prochain échange confirmé',
      message: 'Mercredi 18 nov. à 14h30 au Centre des Possibles (Nice).',
      time: '12 nov. 2026',
      unread: false,
      targetTab: 'MON_PARCOURS' as YoungTab
    }
  ];

  counselorNotifications = [
    {
      id: 'cn-1',
      icon: 'hourglass',
      badgeBg: 'bg-[#FEF3C7] text-[#B45309]',
      title: 'Restitution en attente de validation',
      message: 'Le dossier de Lucas M. est prêt à être contrôlé avant publication.',
      time: 'Il y a 10 min',
      unread: true,
      targetCounselorTab: 'VALIDATIONS_PUBLICATIONS' as CounselorTab
    },
    {
      id: 'cn-2',
      icon: 'message-circle',
      badgeBg: 'bg-[#EDE9FE] text-[#6D28D9]',
      title: '5 questions préparées par Emma D.',
      message: 'Dossier Rdv 2187 — Emma a noté ses questions pour l’entretien de suivi.',
      time: 'Il y a 1 h',
      unread: true,
      targetCounselorTab: 'SUIVI_RDV' as CounselorTab
    },
    {
      id: 'cn-3',
      icon: 'circle-check',
      badgeBg: 'bg-[#DCFCE7] text-[#15803D]',
      title: 'Rapport Rdv 2187 publié',
      message: '17 pages vérifiées • 22 métiers indexés • Synthèse vocale Piper TTS active.',
      time: 'Aujourd’hui • 09h15',
      unread: false,
      targetCounselorTab: 'DOSSIERS_JEUNES' as CounselorTab
    }
  ];
  showDetailedResultsSubView = false;
  rdvSubView: 'AGENDA' | 'LISTE' = 'AGENDA';
  selectedCareerDetail: UICareer | null = null;
  careerProContactRequested: { [careerId: string]: boolean } = {};
  showOnlyFavorites = false;
  activeChapterIndex = 1;

  searchQuery = '';
  personalNotes = 'Je souhaite demander à mon conseiller comment faire un stage court dans le domaine du son ou de la décoration à Nice.';

  // PARCOURS AUTONOME SANS CONSEILLER
  journeyMode: JourneyMode = 'SUPPORTED';
  isJourneyChoiceModalOpen = false;
  catalogCareers: UICatalogCareer[] = JSON.parse(JSON.stringify(ONET_CAREERS_CATALOG_DATA));
  supportResources: UISupportResource[] = INITIAL_SUPPORT_RESOURCES;
  selectedAutonomousCareerDetail: UICatalogCareer | null = null;
  selectedLocalCareer: string = 'Peintre décorateur';

  handleLocalToCoach(event: { establishmentName: string; career: string }): void {
    this.selectedLocalCareer = event.career;
    this.activeYoungTab = 'COACH_IA';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleLocalToImmersion(event: { companyName: string; career: string }): void {
    if (this.immersionProject) {
      this.immersionProject.customCompanyName = event.companyName;
      this.immersionProject.careerTitle = event.career;
      this.immersionProject.currentStep = 3;
    }
    this.immersionStepActive = 3;
    this.activeYoungTab = 'IMMERSION_PRO';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get catalogFavoritesCount(): number {
    return this.catalogCareers.filter((c) => c.isFavorite).length;
  }

  get currentYoungNavItems(): { id: YoungTab; label: string; icon: string; badge?: string }[] {
    if (this.journeyMode === 'AUTONOMOUS') {
      return [
        { id: 'ACCUEIL_AUTONOME', label: 'Accueil', icon: 'house' },
        { id: 'MON_BILAN', label: 'Mon bilan', icon: 'headphones' },
        { id: 'AUTOUR_DE_MOI', label: 'Autour de moi', icon: 'map-pin', badge: '06' },
        { id: 'IMMERSION_PRO', label: 'Immersion Pro', icon: 'briefcase', badge: 'Nouveau' },
        { id: 'COACH_IA', label: 'Mon Coach IA', icon: 'sparkles', badge: 'Nouveau' },
        { id: 'CATALOGUE_METIERS', label: 'Explorer les métiers', icon: 'search', badge: '721' },
        { id: 'ANNUAIRE_SUPPORT', label: 'Trouver de l’aide', icon: 'landmark' },
        { id: 'PARAMETRES_JEUNE', label: 'Paramètres', icon: 'settings' }
      ];
    }
    return [
      { id: 'ACCUEIL', label: 'Accueil', icon: 'house' },
      { id: 'MON_BILAN', label: 'Mon bilan', icon: 'headphones' },
      { id: 'AUTOUR_DE_MOI', label: 'Autour de moi', icon: 'map-pin', badge: '06' },
      { id: 'IMMERSION_PRO', label: 'Immersion Pro', icon: 'briefcase', badge: 'Nouveau' },
      { id: 'COACH_IA', label: 'Mon Coach IA', icon: 'sparkles', badge: 'Nouveau' },
      { id: 'MON_PARCOURS', label: 'Mon parcours', icon: 'map' },
      { id: 'MES_QUESTIONS', label: 'Mes questions', icon: 'message-circle' },
      { id: 'MES_DOCUMENTS', label: 'Mes documents', icon: 'folder' },
      { id: 'PARAMETRES_JEUNE', label: 'Paramètres', icon: 'settings' }
    ];
  }

  onSaveImmersionMessage(msg: string): void {
    if (this.immersionProject) {
      if (this.immersionProject.applicationDraft) {
        this.immersionProject.applicationDraft.body = msg;
      }
    }
  }

  // MODULE IMMERSION PRO — État réactif
  immersionProject: UIImmersionProject = JSON.parse(JSON.stringify(INITIAL_IMMERSION_PROJECT));
  immersionSteps: UIImmersionStep[] = IMMERSION_STEPS;
  partnerCompanies: UIPartnerCompany[] = PARTNER_COMPANIES_DATA;
  immersionStepActive: number = 2; // Étape 2 en cours par défaut (conforme à la capture)
  newObservationActivityInput = '';
  newQuestionToAskInput = '';
  newCustomCompanyName = '';
  newCustomCompanyCity = '';
  newCustomCompanyContact = '';
  newJournalDiscovered = '';
  newJournalSurprised = '';
  newJournalQuestion = '';
  companySearchTerm = '';
  companySectorFilter = 'ALL';
  isReviewSharedSuccess = false;
  isDraftSavedSuccess = false;

  youngNavItems: { id: YoungTab; label: string; icon: string; badge?: string }[] = [
    { id: 'ACCUEIL', label: 'Accueil', icon: 'house' },
    { id: 'MON_BILAN', label: 'Mon bilan', icon: 'headphones' },
    { id: 'IMMERSION_PRO', label: 'Immersion Pro', icon: 'briefcase', badge: 'Nouveau' },
    { id: 'MON_PARCOURS', label: 'Mon parcours', icon: 'map' },
    { id: 'MES_QUESTIONS', label: 'Mes questions', icon: 'message-circle' },
    { id: 'MES_DOCUMENTS', label: 'Mes documents', icon: 'folder' },
    { id: 'PARAMETRES_JEUNE', label: 'Paramètres', icon: 'settings' }
  ];

  counselorNavItems: { id: CounselorTab; label: string; icon: string; badge?: string }[] = [
    { id: 'TABLEAU_DE_BORD', label: 'Tableau de bord', icon: 'house' },
    { id: 'DOSSIERS_JEUNES', label: 'Dossiers jeunes', icon: 'users', badge: '4' },
    { id: 'IMPORTER_RAPPORT', label: 'Importer un rapport', icon: 'upload' },
    { id: 'SUIVI_RDV', label: 'Suivi & rendez-vous', icon: 'calendar' },
    { id: 'PARAMETRES', label: 'Paramètres', icon: 'settings' }
  ];

  /** Photos de profil qui n'ont pas pu être chargées (fichier absent, URL cassée…). */
  private failedAvatars = new Set<string>();

  /** Vrai si le jeune a une photo de profil utilisable. */
  hasAvatar(url?: string | null): boolean {
    return !!url && !this.failedAvatars.has(url);
  }

  /** Appelé quand une photo ne se charge pas : on bascule sur les initiales. */
  markAvatarFailed(url?: string | null): void {
    if (url) {
      this.failedAvatars.add(url);
    }
  }

  /** Initiales d'un nom, ex. « Emma D. » -> « ED », « Aïcha » -> « A ». */
  getInitials(name: string): string {
    return name
      .split(/\s+/)
      .map(part => part.replace(/[^\p{L}]/gu, '').charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  counselorDossiers = [
    {
      name: 'Emma D.',
      age: '16 ans',
      rdv: 'Rdv 2187',
      school: 'Centre des Possibles — Nice',
      date: '12 nov. 2026',
      statusLabel: 'Publié',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      avatarUrl: 'assets/visuals/avatar-emma.png'
    },
    {
      name: 'Lucas M.',
      age: '16 ans',
      rdv: 'Dossier 2188',
      school: 'Lycée Masséna',
      date: '11 nov. 2026',
      statusLabel: 'À valider',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      avatarUrl: 'assets/visuals/avatar-lucas.png'
    },
    {
      name: 'Aïcha D.',
      age: '18 ans',
      rdv: 'Dossier 2189',
      school: 'Lycée Apollinaire',
      date: '09 nov. 2026',
      statusLabel: 'Publié',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      avatarUrl: 'assets/visuals/avatar-aicha.png'
    },
    {
      name: 'Matéo R.',
      age: '17 ans',
      rdv: 'Dossier 2190',
      school: 'Lycée Simone Veil',
      date: '08 nov. 2026',
      statusLabel: 'Extraction IA',
      badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200/60',
      avatarUrl: 'assets/visuals/avatar-mateo.png'
    }
  ];

  audioChapters = [
    { title: 'Mon profil en résumé (Rdv 2187)', timeRange: '00:00 – 01:02' },
    { title: 'Mes centres d’intérêt (RIASEC, p. 4)', timeRange: '01:02 – 02:18' },
    { title: 'Mes aptitudes cognitives (p. 5)', timeRange: '02:18 – 03:36' },
    { title: 'Ma personnalité (HEXACO, p. 6)', timeRange: '03:36 – 04:54' },
    { title: 'Les 22 pistes de métiers (p. 8–16)', timeRange: '04:54 – 06:08' }
  ];

  // Ordre RIASEC exact de la page 4 du Rapport 2187 (sans jauges chiffrées, encadré soigné pour chaque préférence sélectionnée)
  riasecOrderedDisplay = [
    {
      letter: 'A',
      name: 'Artistique',
      keywords: '(Créativité, expression — p. 4)',
      rank: 1,
      selected: true,
      badgeClass: 'bg-[#EC4899]',
      selectedContainerClass: 'rounded-2xl border-2 border-[#EC4899] bg-gradient-to-r from-[#FDF2F8] via-[#FCE7F3]/40 to-white shadow-xs',
      selectedBadgePillClass: 'bg-[#EC4899]/15 text-[#BE185D] border border-[#EC4899]/30',
      checkBadgeClass: 'bg-[#EC4899] text-white',
      accentColor: '#EC4899'
    },
    {
      letter: 'E',
      name: 'Entreprenant',
      keywords: '(Projet, initiative, convaincre — p. 4)',
      rank: 2,
      selected: true,
      badgeClass: 'bg-[#F59E0B]',
      selectedContainerClass: 'rounded-2xl border-2 border-[#F59E0B] bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-white shadow-xs',
      selectedBadgePillClass: 'bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30',
      checkBadgeClass: 'bg-[#F59E0B] text-white',
      accentColor: '#F59E0B'
    },
    {
      letter: 'R',
      name: 'Réaliste',
      keywords: '(Action, concret, outils — p. 4)',
      rank: 3,
      selected: true,
      badgeClass: 'bg-[#10B981]',
      selectedContainerClass: 'rounded-2xl border-2 border-[#10B981] bg-gradient-to-r from-[#ECFDF5] via-[#D1FAE5]/40 to-white shadow-xs',
      selectedBadgePillClass: 'bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30',
      checkBadgeClass: 'bg-[#10B981] text-white',
      accentColor: '#10B981'
    },
    {
      letter: 'I',
      name: 'Investigateur',
      keywords: '(Analyse, observer, comprendre — p. 4)',
      rank: 4,
      selected: false,
      badgeClass: 'bg-[#3B82F6]',
      selectedContainerClass: 'rounded-2xl border-2 border-[#3B82F6] bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE]/40 to-white shadow-xs',
      selectedBadgePillClass: 'bg-[#3B82F6]/15 text-[#1D4ED8] border border-[#3B82F6]/30',
      checkBadgeClass: 'bg-[#3B82F6] text-white',
      accentColor: '#3B82F6'
    },
    {
      letter: 'S',
      name: 'Social',
      keywords: '(Aide, contact, transmettre — p. 4)',
      rank: 5,
      selected: false,
      badgeClass: 'bg-[#F97316]',
      selectedContainerClass: 'rounded-2xl border-2 border-[#F97316] bg-gradient-to-r from-[#FFF7ED] via-[#FFEDD5]/40 to-white shadow-xs',
      selectedBadgePillClass: 'bg-[#F97316]/15 text-[#C2410C] border border-[#F97316]/30',
      checkBadgeClass: 'bg-[#F97316] text-white',
      accentColor: '#F97316'
    },
    {
      letter: 'C',
      name: 'Conventionnel',
      keywords: '(Organisation, méthode — p. 4)',
      rank: 6,
      selected: false,
      badgeClass: 'bg-[#8B5CF6]',
      selectedContainerClass: 'rounded-2xl border-2 border-[#8B5CF6] bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE]/40 to-white shadow-xs',
      selectedBadgePillClass: 'bg-[#8B5CF6]/15 text-[#6D28D9] border border-[#8B5CF6]/30',
      checkBadgeClass: 'bg-[#8B5CF6] text-white',
      accentColor: '#8B5CF6'
    }
  ];

  toggleRiasecPreference(r: any): void {
    r.selected = !r.selected;
  }

  countSelectedRiasec(): number {
    return this.riasecOrderedDisplay.filter(r => r.selected).length;
  }

  rdvNumber = '2187';
  reportDate = '07/10/2026';
  restitutionStatus: 'DRAFT_REVIEW' | 'APPROVED' | 'READY' | 'PUBLISHED' = 'PUBLISHED';
  restitutionVersion = 1;
  scriptHash = '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e';
  audioReady = true;
  audioSrcUrl = 'assets/demo-restitution.wav';
  apiBaseUrl = 'http://localhost:3000/v1';

  isSpeaking = false;
  isTestingVoice = false;
  speechRate = 1;
  selectedVoiceId: string = 'amelie';
  selectedTone: VoiceTone = 'WARM';
  voicePersonas: VoicePersona[] = VOICE_PERSONAS;
  toneOptions: ToneOption[] = TONE_OPTIONS;
  availableBrowserVoices: SpeechSynthesisVoice[] = [];
  selectedZone = 0;
  statusBanner = '';
  securityTestResult = '';

  get currentVoice(): VoicePersona {
    return this.voicePersonas.find(v => v.id === this.selectedVoiceId) || this.voicePersonas[0];
  }

  get currentToneOption(): ToneOption {
    return this.toneOptions.find(t => t.id === this.selectedTone) || this.toneOptions[0];
  }

  selectVoice(id: string): void {
    this.selectedVoiceId = id;
    const v = this.currentVoice;
    this.selectedTone = v.tone;
    if (this.isSpeaking) {
      this.stopSpeech();
      this.toggleSpeech();
    }
  }

  selectTone(tone: VoiceTone): void {
    this.selectedTone = tone;
    if (this.isSpeaking) {
      this.stopSpeech();
      this.toggleSpeech();
    }
  }

  newQuestionTopic = '';
  newQuestionText = '';

  facts: UIFact[] = [
    {
      id: 'fact-meta-001',
      category: 'METADATA',
      label: 'Ton rapport des possibles – Rdv 2187 (07/10/2026)',
      rankOrder: 1,
      rawExcerpt: 'Ton rapport des possibles – Rdv 2187 | Rapport du 07/10/2026 | Explore ton avenir professionnel (17 pages).',
      pageNumber: 1,
      isVerified: true
    },
    {
      id: 'fact-riasec-01',
      category: 'RIASEC_INTEREST',
      label: '1. Artistique (Page 4)',
      rankOrder: 1,
      rawExcerpt: 'Les personnes de ce type aiment les activités qui leur permettent de s’exprimer : littérature, peinture, musique, graphisme, sculpture…',
      pageNumber: 4,
      isVerified: true
    },
    {
      id: 'fact-riasec-02',
      category: 'RIASEC_INTEREST',
      label: '2. Entreprenant (Page 4)',
      rankOrder: 2,
      rawExcerpt: 'Les personnes de ce type aiment influencer, manager, diriger les autres, les convaincre et défendre leurs idées.',
      pageNumber: 4,
      isVerified: true
    },
    {
      id: 'fact-riasec-03',
      category: 'RIASEC_INTEREST',
      label: '3. Réaliste (Page 4)',
      rankOrder: 3,
      rawExcerpt: 'Les personnes de ce type aiment les tâches concrètes et manuelles, manipuler des outils, machines et appareils.',
      pageNumber: 4,
      isVerified: true
    },
    {
      id: 'fact-cog-04',
      category: 'COGNITIVE_APTITUDE',
      label: 'Mesure d’aptitudes cognitives (9 fonctions — Page 5)',
      rankOrder: 1,
      rawExcerpt: 'Flexibilité des catégories, Partage du temps, Mémorisation, Facilité avec les nombres… (Image à un instant T).',
      pageNumber: 5,
      isVerified: true
    },
    {
      id: 'fact-hexaco-01',
      category: 'HEXACO_PERSONALITY',
      label: 'Mesure de personnalité HEXACO (6 dimensions — Page 6)',
      rankOrder: 1,
      rawExcerpt: 'Ordre de présentation : 1. Émotivité, 2. Ouvert à l’expérience, 3. Agréabilité, 4. Humilité-honnêteté, 5. Extraversion, 6. Caractère consciencieux.',
      pageNumber: 6,
      isVerified: true
    },
    {
      id: 'fact-zones-01',
      category: 'CAREER_ZONE',
      label: '22 métiers proposés répartis sur 5 zones de préparation (Pages 7 à 16)',
      rankOrder: 1,
      rawExcerpt: 'Propositions issues du croisement des jeux cognitifs et du questionnaire d’intérêts avec la base O*NET.',
      pageNumber: 7,
      isVerified: true
    }
  ];

  claims: UIClaim[] = [
    {
      id: 'claim-intro',
      kind: 'PEDAGOGICAL_TIP',
      displayOrder: 1,
      timestamp: '00:15',
      chapterTitle: 'Mon profil en résumé (Rdv 2187)',
      text: 'Bienvenue dans la restitution de ton Rapport des Possibles Rdv 2187 (établi le 07/10/2026). Ce résumé validé par ton conseiller t’aide à retenir tes points d’appui et les 22 pistes de métiers de ton bilan.',
      sourceFactIds: ['fact-meta-001'],
      reviewStatus: 'APPROVED'
    },
    {
      id: 'claim-riasec-top',
      kind: 'PERSONAL_FACT',
      displayOrder: 2,
      timestamp: '01:14',
      chapterTitle: 'Mes centres d’intérêt (RIASEC — Page 4)',
      text: 'Maintenant, parlons de tes centres d’intérêt selon le modèle RIASEC (page 4). Dans ton rapport, tes centres d’intérêt s’expriment à travers les dimensions Artistique, Entreprenant et Réaliste, suivies d’Investigateur, Social et Conventionnel. Tu apprécies créer, porter des idées et voir le résultat concret de ton travail.',
      sourceFactIds: ['fact-riasec-01', 'fact-riasec-02', 'fact-riasec-03'],
      reviewStatus: 'APPROVED'
    },
    {
      id: 'claim-cognitive-top',
      kind: 'PERSONAL_FACT',
      displayOrder: 3,
      timestamp: '02:25',
      chapterTitle: 'Mes aptitudes cognitives (Page 5)',
      text: 'À la page 5, tes jeux cognitifs explorent 9 fonctions clés comme la Flexibilité des catégories (s’adapter à un changement de règle), le Partage du temps et la Mémorisation. Comme le rappelle ton rapport, ces résultats sont une photographie à un instant T pour t’aider à cibler des pistes.',
      sourceFactIds: ['fact-cog-04'],
      reviewStatus: 'APPROVED'
    },
    {
      id: 'claim-hexaco-top',
      kind: 'PERSONAL_FACT',
      displayOrder: 4,
      timestamp: '03:40',
      chapterTitle: 'Ma personnalité (HEXACO — Page 6)',
      text: 'La page 6 présente tes 6 dimensions HEXACO (Émotivité, Ouvert à l’expérience, Agréabilité, Humilité-honnêteté, Extraversion, Caractère consciencieux). Il n’y a ni bon ni mauvais profil : chaque dimension est un repère personnel.',
      sourceFactIds: ['fact-hexaco-01'],
      reviewStatus: 'APPROVED'
    },
    {
      id: 'claim-careers-zones',
      kind: 'CAREER_LINK',
      displayOrder: 5,
      timestamp: '04:55',
      chapterTitle: 'Les 22 pistes de métiers (Pages 8 à 16)',
      text: 'Enfin, des pages 8 à 16, ton rapport propose 22 métiers classés en 5 zones de préparation : de la Zone 1 (0 à 6 mois : Peintre décorateur, Barista…) jusqu’aux Zones 3, 4 et 5 (Technicien du son, Guide touristique, Animateur Radio, Professeur des écoles, Praticien APA…).',
      sourceFactIds: ['fact-zones-01'],
      reviewStatus: 'APPROVED'
    }
  ];

  // Les 22 métiers exacts du Rapport 2187 avec vignettes photos issues des maquettes
  careers: UICareer[] = [
    // Zone 1 (Pages 8-9)
    {
      id: 'c-z1-1',
      jobZone: 1,
      rankInZone: 1,
      titleFr: 'Peintre décorateur',
      sectorTag: 'Arts & Création',
      sectorColor: 'bg-[#F3E8FF] text-[#6D28D9]',
      educationLevel: 'CAP à Bac pro (0 à 6 mois)',
      shortSummary: 'Met en couleur et décore des objets, meubles ou espaces (intérieurs, extérieurs).',
      description: 'Le Peintre décorateur prépare et applique des peintures, vernis et autres revêtements sur des objets comme des meubles, du verre, de la poterie, des bijoux, des jouets ou du cuir. Il prépare les pièces (ponçage, nettoyage), choisit les couleurs et réalise des effets de matière ou des patines en atelier ou chez des artisans.',
      imageUrl: 'assets/visuals/career-peintre.png',
      pageNumber: 8,
      isFavorite: true
    },
    {
      id: 'c-z1-2',
      jobZone: 1,
      rankInZone: 2,
      titleFr: 'Cuisinier en restauration rapide',
      sectorTag: 'Restauration & Services',
      sectorColor: 'bg-[#FCE7F3] text-[#BE185D]',
      educationLevel: 'Accès rapide (0 à 6 mois)',
      shortSummary: 'Prépare et cuit des aliments dans un restaurant à service rapide.',
      description: 'Le Cuisinier en restauration rapide prépare et cuit des aliments selon des recettes simples en utilisant des appareils conçus pour de grosses quantités, dans le respect strict des règles d’hygiène et de sécurité alimentaire.',
      imageUrl: 'assets/visuals/career-barista.png',
      pageNumber: 8,
      isFavorite: false
    },
    {
      id: 'c-z1-3',
      jobZone: 1,
      rankInZone: 3,
      titleFr: 'Barista',
      sectorTag: 'Tourisme & Services',
      sectorColor: 'bg-[#FCE7F3] text-[#BE185D]',
      educationLevel: 'CAP / Formation courte (0 à 6 mois)',
      shortSummary: 'Prépare et sert des cafés spécialisés et boissons dans un café ou restaurant.',
      description: 'Le Barista prépare et sert des cafés spécialisés (espresso, cappuccino, latte) et d’autres boissons chaudes ou froides. Il utilise des machines à espresso, règle la mouture, maîtrise la température du lait et accueille les clients.',
      imageUrl: 'assets/visuals/career-barista.png',
      pageNumber: 8,
      isFavorite: true
    },
    {
      id: 'c-z1-4',
      jobZone: 1,
      rankInZone: 4,
      titleFr: 'Ouvrier agricole',
      sectorTag: 'Nature & Agriculture',
      sectorColor: 'bg-[#DCFCE7] text-[#15803D]',
      educationLevel: 'CAP agricole / Bac Pro (0 à 6 mois)',
      shortSummary: 'Plante, cultive et récolte des légumes, fruits et cultures en plein champ ou serre.',
      description: 'L’ouvrier agricole plante, cultive et récolte des légumes, des fruits et d’autres cultures en plein champ, en pépinière ou en serre. Il assure aussi le tri, le conditionnement et l’entretien des installations.',
      imageUrl: 'assets/visuals/career-guide.png',
      pageNumber: 8,
      isFavorite: false
    },
    {
      id: 'c-z1-5',
      jobZone: 1,
      rankInZone: 5,
      titleFr: 'Ouvrier de carrière',
      sectorTag: 'Artisanat & Matériaux',
      sectorColor: 'bg-[#FEF3C7] text-[#B45309]',
      educationLevel: 'CAP/BEP ou alternance (0 à 6 mois)',
      shortSummary: 'Extrait et découpe des blocs de pierre directement dans la carrière.',
      description: 'L’ouvrier de carrière casse et détache des blocs de pierre, prépare le site, repère les plans de coupe, installe les outils et contrôle la taille et la qualité des blocs en équipe.',
      imageUrl: 'assets/visuals/career-peintre.png',
      pageNumber: 9,
      isFavorite: false
    },

    // Zone 2 (Pages 10-11)
    {
      id: 'c-z2-1',
      jobZone: 2,
      rankInZone: 1,
      titleFr: 'Acteur',
      sectorTag: 'Spectacle & Médias',
      sectorColor: 'bg-[#F3E8FF] text-[#6D28D9]',
      educationLevel: 'Cours / Conservatoire (3 mois à 2 ans)',
      shortSummary: 'Interprète des rôles au théâtre, au cinéma, à la télévision, à la radio ou en vidéo.',
      description: 'Le métier d’Acteur consiste à jouer des rôles au théâtre, à la télévision, à la radio, au cinéma ou dans des vidéos. Il interprète des personnages sérieux ou comiques par la parole, les gestes et les mouvements du corps.',
      imageUrl: 'assets/visuals/career-radio.png',
      pageNumber: 10,
      isFavorite: false
    },
    {
      id: 'c-z2-2',
      jobZone: 2,
      rankInZone: 2,
      titleFr: 'Boucher',
      sectorTag: 'Artisanat Alimentaire',
      sectorColor: 'bg-[#FCE7F3] text-[#BE185D]',
      educationLevel: 'CAP Boucher / BP / Bac Pro',
      shortSummary: 'Prépare, découpe et présente la viande et conseille la clientèle.',
      description: 'Le Boucher sélectionne, découpe et prépare les pièces de viande pour la vente en boutique ou marché, conseille les clients sur les morceaux et les cuissons et respecte des règles strictes d’hygiène.',
      imageUrl: 'assets/visuals/career-barista.png',
      pageNumber: 10,
      isFavorite: false
    },
    {
      id: 'c-z2-3',
      jobZone: 2,
      rankInZone: 3,
      titleFr: "Conducteur d'appareils de levage (palan, treuil)",
      sectorTag: 'Logistique & Chantier',
      sectorColor: 'bg-[#DBEAFE] text-[#1D4ED8]',
      educationLevel: 'Formation pro & Habilitations',
      shortSummary: 'Manœuvre des palans et treuils motorisés pour déplacer des charges en sécurité.',
      description: 'Le Conducteur d’appareils de levage manœuvre des palans et des treuils motorisés dans des usines, sur des chantiers ou dans les ports en communiquant avec les équipes.',
      imageUrl: 'assets/visuals/career-peintre.png',
      pageNumber: 10,
      isFavorite: false
    },
    {
      id: 'c-z2-4',
      jobZone: 2,
      rankInZone: 4,
      titleFr: 'Agent funéraire',
      sectorTag: 'Accompagnement & Services',
      sectorColor: 'bg-[#EDE9FE] text-[#5B21B6]',
      educationLevel: 'Formation habilitée (3 mois à 2 ans)',
      shortSummary: 'Aide à l’organisation des cérémonies et accompagne les familles.',
      description: 'L’Agent funéraire aide à l’organisation et au déroulement des obsèques et accompagne les personnes endeuillées avec respect, discrétion et écoute.',
      imageUrl: 'assets/visuals/career-prof.png',
      pageNumber: 10,
      isFavorite: false
    },
    {
      id: 'c-z2-5',
      jobZone: 2,
      rankInZone: 5,
      titleFr: 'Ouvrier de meulage et de polissage',
      sectorTag: 'Artisanat & Finition',
      sectorColor: 'bg-[#FEF3C7] text-[#B45309]',
      educationLevel: 'CAP/BEP ou Bac Pro (3 mois à 2 ans)',
      shortSummary: 'Façonne et polit des pièces en métal, bois, pierre, verre ou matériaux composites.',
      description: 'L’Ouvrier de meulage et de polissage prépare les surfaces, choisit les abrasifs adaptés et donne la finition aux pièces en atelier avec dextérité et sens de l’observation.',
      imageUrl: 'assets/visuals/career-peintre.png',
      pageNumber: 11,
      isFavorite: false
    },

    // Zone 3 (Pages 12-13)
    {
      id: 'c-z3-1',
      jobZone: 3,
      rankInZone: 1,
      titleFr: 'Esthéticien',
      sectorTag: 'Soin & Bien-être',
      sectorColor: 'bg-[#FCE7F3] text-[#BE185D]',
      educationLevel: 'CAP / BP / BTS Esthétique (1 à 4 ans)',
      shortSummary: 'Réalise des soins du visage et du corps et conseille la clientèle en institut.',
      description: 'L’esthéticien réalise des soins de la peau du visage et du corps, des modelages et conseille les clients sur les routines de soin en institut, spa ou centre spécialisé.',
      imageUrl: 'assets/visuals/career-barista.png',
      pageNumber: 12,
      isFavorite: false
    },
    {
      id: 'c-z3-2',
      jobZone: 3,
      rankInZone: 2,
      titleFr: 'Coach sportif',
      sectorTag: 'Sport & Santé',
      sectorColor: 'bg-[#DCFCE7] text-[#15803D]',
      educationLevel: 'BPJEPS / Licence STAPS (1 à 4 ans)',
      shortSummary: 'Encadre et entraîne des personnes ou des groupes pour améliorer leur forme physique.',
      description: 'Le coach sportif montre les bons gestes, corrige la posture et adapte les séances aux objectifs de chacun (remise en forme, préparation sportive) en salle, en club ou en extérieur.',
      imageUrl: 'assets/visuals/career-guide.png',
      pageNumber: 12,
      isFavorite: false
    },
    {
      id: 'c-z3-3',
      jobZone: 3,
      rankInZone: 3,
      titleFr: 'Guide touristique',
      sectorTag: 'Tourisme & Culture',
      sectorColor: 'bg-[#DBEAFE] text-[#1D4ED8]',
      educationLevel: 'Bac à Bac +3 / BTS Tourisme (1 à 4 ans)',
      shortSummary: 'Fait découvrir un lieu, une ville, un musée ou une région à des visiteurs.',
      description: 'Le Guide touristique accompagne des visiteurs ou des groupes lors de visites de villes, de monuments ou de musées, prépare le parcours et explique l’histoire et l’architecture de façon vivante.',
      imageUrl: 'assets/visuals/career-guide.png',
      pageNumber: 12,
      isFavorite: true
    },
    {
      id: 'c-z3-4',
      jobZone: 3,
      rankInZone: 4,
      titleFr: 'Technicien du son',
      sectorTag: 'Numérique & Audiovisuel',
      sectorColor: 'bg-[#DBEAFE] text-[#1D4ED8]',
      educationLevel: 'Bac pro à Bac +3 / BTS Audiovisuel',
      shortSummary: 'Installe, règle et gère le son lors d’événements, en studio, tournage ou direct.',
      description: 'Le Technicien du son installe, règle et fait fonctionner le matériel pour enregistrer, mixer, synchroniser et restituer le son (musique, voix, bruitages) pour le théâtre, le cinéma, les vidéos, les podcasts ou les concerts.',
      imageUrl: 'assets/visuals/career-son.png',
      pageNumber: 12,
      isFavorite: false
    },
    {
      id: 'c-z3-5',
      jobZone: 3,
      rankInZone: 5,
      titleFr: 'Technicien Solaire Thermique',
      sectorTag: 'Énergie & Environnement',
      sectorColor: 'bg-[#DCFCE7] text-[#15803D]',
      educationLevel: 'CAP / Bac Pro / BTS Énergie (1 à 4 ans)',
      shortSummary: 'Installe, raccorde et entretient des capteurs et systèmes solaires thermiques.',
      description: 'Le Technicien Solaire Thermique pose les capteurs solaires, raccorde les circuits hydrauliques et électriques et assure la mise en service et la maintenance.',
      imageUrl: 'assets/visuals/career-peintre.png',
      pageNumber: 13,
      isFavorite: false
    },

    // Zone 4 (Pages 14-15)
    {
      id: 'c-z4-1',
      jobZone: 4,
      rankInZone: 1,
      titleFr: 'Guide naturaliste / Médiateur environnement',
      sectorTag: 'Nature & Médiation',
      sectorColor: 'bg-[#DCFCE7] text-[#15803D]',
      educationLevel: 'BTS / BUT / Licence pro (2 à 6 ans)',
      shortSummary: 'Anime des visites et ateliers pour faire découvrir la faune, la flore et les parcs naturels.',
      description: 'Le Guide naturaliste conçoit et anime des visites guidées, des ateliers pédagogiques et des actions de sensibilisation à l’environnement dans les parcs naturels.',
      imageUrl: 'assets/visuals/career-guide.png',
      pageNumber: 14,
      isFavorite: false
    },
    {
      id: 'c-z4-2',
      jobZone: 4,
      rankInZone: 2,
      titleFr: 'Animateur Radio',
      sectorTag: 'Communication & Médias',
      sectorColor: 'bg-[#F3E8FF] text-[#6D28D9]',
      educationLevel: 'Bac à Bac +3 / École de journalisme ou radio',
      shortSummary: 'Prépare et anime des émissions radio (infos, musique, chroniques, interviews).',
      description: 'L’Animateur Radio parle ou lit des textes à la radio ou en podcast, présente des chroniques, accueille et interviewe des invités et lance les titres musicaux en studio ou sur le terrain.',
      imageUrl: 'assets/visuals/career-radio.png',
      pageNumber: 14,
      isFavorite: true
    },
    {
      id: 'c-z4-3',
      jobZone: 4,
      rankInZone: 3,
      titleFr: 'Producteur / réalisateur',
      sectorTag: 'Audiovisuel & Création',
      sectorColor: 'bg-[#F3E8FF] text-[#6D28D9]',
      educationLevel: 'BTS / Licence / Master Cinéma & Audiovisuel',
      shortSummary: 'Conçoit et dirige des émissions, films, vidéos, spectacles ou programmes radio.',
      description: 'Le Réalisateur et le Producteur dirigent la création artistique et l’organisation pratique de films, vidéos, spectacles ou émissions en coordonnant les équipes.',
      imageUrl: 'assets/visuals/career-son.png',
      pageNumber: 14,
      isFavorite: false
    },
    {
      id: 'c-z4-4',
      jobZone: 4,
      rankInZone: 4,
      titleFr: 'Professeur du secondaire',
      sectorTag: 'Éducation',
      sectorColor: 'bg-[#FFEDD5] text-[#C2410C]',
      educationLevel: 'Bac +5 (Master + CAPES/Agrégation)',
      shortSummary: 'Enseigne sa discipline aux élèves de collège et de lycée et les accompagne.',
      description: 'Le Professeur du secondaire prépare les cours, enseigne une ou plusieurs matières au collège ou au lycée, évalue les progrès et accompagne les élèves dans leur orientation.',
      imageUrl: 'assets/visuals/career-prof.png',
      pageNumber: 14,
      isFavorite: false
    },
    {
      id: 'c-z4-5',
      jobZone: 4,
      rankInZone: 5,
      titleFr: 'Professeur des écoles',
      sectorTag: 'Éducation',
      sectorColor: 'bg-[#FFEDD5] text-[#C2410C]',
      educationLevel: 'Bac +5 (Master MEEF + CRPE)',
      shortSummary: 'Enseigne les bases (lecture, écriture, mathématiques, sciences) en école primaire.',
      description: 'Le Professeur des écoles enseigne les matières fondamentales aux enfants de 6 à 11 ans, organise des activités pédagogiques et travaille en lien avec les familles.',
      imageUrl: 'assets/visuals/career-prof.png',
      pageNumber: 15,
      isFavorite: false
    },

    // Zone 5 (Page 16)
    {
      id: 'c-z5-1',
      jobZone: 5,
      rankInZone: 1,
      titleFr: "Enseignant en arts, théâtre et musique dans l'enseignement supérieur",
      sectorTag: 'Arts & Enseignement Supérieur',
      sectorColor: 'bg-[#F3E8FF] text-[#6D28D9]',
      educationLevel: 'Master / Doctorat / Conservatoire (4 à 10 ans)',
      shortSummary: 'Enseigne le théâtre, la musique, les arts plastiques ou le design au niveau post-bac.',
      description: 'L’Enseignant en arts, théâtre et musique donne des cours théoriques et pratiques en université, école d’art ou conservatoire et encadre les projets artistiques des étudiants.',
      imageUrl: 'assets/visuals/career-prof.png',
      pageNumber: 16,
      isFavorite: false
    },
    {
      id: 'c-z5-2',
      jobZone: 5,
      rankInZone: 2,
      titleFr: 'Praticien en Activité Physique Adaptée (APA)',
      sectorTag: 'Santé & Sport Adapté',
      sectorColor: 'bg-[#DCFCE7] text-[#15803D]',
      educationLevel: 'Licence / Master STAPS mention APA',
      shortSummary: 'Conçoit des séances d’activité physique adaptée pour la santé et l’autonomie.',
      description: 'Le Praticien en Activité Physique Adaptée évalue les capacités physiques et conçoit des séances adaptées pour des enfants, adolescents ou adultes ayant des besoins particuliers.',
      imageUrl: 'assets/visuals/career-guide.png',
      pageNumber: 16,
      isFavorite: false
    }
  ];

  // Les 5 questions exactes de la maquette "Mes questions (5)"
  questions: UIQuestion[] = [
    {
      id: 'q-1',
      tagLabel: 'Métiers',
      tagColor: 'bg-[#EDE9FE] text-[#6D28D9]',
      relatedTopic: 'Peintre décorateur (p. 8)',
      questionText: 'Quelles formations pour devenir peintre décorateur ?',
      checked: true,
      counselorReply: 'Tu peux viser un CAP Peintre-applicateur de revêtements ou un Bac pro Aménagement et finition du bâtiment, souvent accessibles en alternance.'
    },
    {
      id: 'q-2',
      tagLabel: 'Parcours',
      tagColor: 'bg-[#DBEAFE] text-[#1D4ED8]',
      relatedTopic: 'Barista (p. 8)',
      questionText: 'Existe-t-il des stages pour découvrir le métier de barista ?',
      checked: false,
      counselorReply: null
    },
    {
      id: 'q-3',
      tagLabel: 'Conditions',
      tagColor: 'bg-[#DCFCE7] text-[#15803D]',
      relatedTopic: 'Guide touristique (p. 12)',
      questionText: 'Quelles sont les conditions de travail d’un guide touristique ?',
      checked: false,
      counselorReply: null
    },
    {
      id: 'q-4',
      tagLabel: 'Compétences',
      tagColor: 'bg-[#FCE7F3] text-[#BE185D]',
      relatedTopic: 'Technicien du son (p. 12)',
      questionText: 'Quelles compétences dois-je encore développer ?',
      checked: true,
      counselorReply: null
    },
    {
      id: 'q-5',
      tagLabel: 'Suite',
      tagColor: 'bg-[#FFEDD5] text-[#C2410C]',
      relatedTopic: 'Prochaines étapes',
      questionText: 'Quelles sont les prochaines étapes après ce bilan ?',
      checked: false,
      counselorReply: null
    }
  ];

  async ngOnInit(): Promise<void> {
    this.loadBrowserVoices();
    this.loadPersistedQuestions();
    if (typeof window !== 'undefined') {
      try {
        const savedPhoto = localStorage.getItem('monbilan_user_photo');
        if (savedPhoto) {
          this.userPhotoUrl = savedPhoto;
        }
        const savedFirst = localStorage.getItem('monbilan_user_firstname');
        const savedLast = localStorage.getItem('monbilan_user_lastname');
        if (savedFirst) this.userFirstName = savedFirst;
        if (savedLast) this.userLastName = savedLast;
        if (savedFirst || savedLast) {
          this.currentUserDisplayName = `${this.userFirstName} ${this.userLastName}`.trim();
        }
        const savedEmail = localStorage.getItem('monbilan_user_email');
        if (savedEmail) {
          this.currentUserEmail = savedEmail;
        }

        const savedCounselorFirst = localStorage.getItem('monbilan_counselor_firstname');
        const savedCounselorLast = localStorage.getItem('monbilan_counselor_lastname');
        if (savedCounselorFirst) this.counselorFirstName = savedCounselorFirst;
        if (savedCounselorLast) this.counselorLastName = savedCounselorLast;
        if (savedCounselorFirst || savedCounselorLast) {
          this.counselorDisplayName = `${this.counselorFirstName} ${this.counselorLastName}`.trim();
        }
        const savedCounselorEmail = localStorage.getItem('monbilan_counselor_email');
        if (savedCounselorEmail) {
          this.counselorEmail = savedCounselorEmail;
        }
        const savedCounselorRole = localStorage.getItem('monbilan_counselor_role');
        if (savedCounselorRole) {
          this.counselorRoleTitle = savedCounselorRole;
        }
        const savedCounselorPhoto = localStorage.getItem('monbilan_counselor_photo');
        if (savedCounselorPhoto) {
          this.counselorPhotoUrl = savedCounselorPhoto;
        }
      } catch {
        // LocalStorage fallback
      }
      if (window.location.hash === '#counselor') {
        this.activePortal = 'COUNSELOR';
      }
    }
    await this.trySyncWithBackendApi();
  }

  async trySyncWithBackendApi(): Promise<void> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/health`, { method: 'GET' });
      if (!res.ok) return;
      this.audioSrcUrl = `${this.apiBaseUrl}/restitutions/ffff1111-1111-4111-8111-111111111111/audio-stream`;
    } catch {
      // Mode autonome
    }
  }

  switchPortal(portal: 'YOUNG' | 'COUNSELOR'): void {
    this.activePortal = portal;
    this.isMobileMenuOpen = false;
    this.isNotificationsOpen = false;
    this.isProfileMenuOpen = false;
  }

  selectYoungTab(tab: YoungTab): void {
    if (tab === 'EXPLORER_METIERS') {
      if (this.journeyMode === 'AUTONOMOUS') {
        this.activeYoungTab = 'CATALOGUE_METIERS';
      } else {
        this.activeYoungTab = 'IMMERSION_PRO';
        this.immersionStepActive = 1;
      }
    } else {
      this.activeYoungTab = tab;
    }
    this.showAudioFocusSubView = false;
    this.selectedCareerDetail = null;
    this.selectedAutonomousCareerDetail = null;
    this.isMobileMenuOpen = false;
    this.isNotificationsOpen = false;
    this.isProfileMenuOpen = false;
  }

  setJourneyMode(mode: JourneyMode): void {
    this.journeyMode = mode;
    this.isJourneyChoiceModalOpen = false;
    if (mode === 'AUTONOMOUS') {
      this.activeYoungTab = 'ACCUEIL_AUTONOME';
    } else {
      this.activeYoungTab = 'ACCUEIL';
    }
    this.selectedCareerDetail = null;
    this.selectedAutonomousCareerDetail = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleAutonomousHomeNav(target: 'CATALOG' | 'IMMERSION' | 'SUPPORT'): void {
    if (target === 'CATALOG') {
      this.selectYoungTab('CATALOGUE_METIERS');
    } else if (target === 'IMMERSION') {
      this.selectYoungTab('IMMERSION_PRO');
    } else {
      this.selectYoungTab('ANNUAIRE_SUPPORT');
    }
  }

  startImmersionFromCatalog(career: UICatalogCareer): void {
    if (!career) return;
    this.immersionProject.careerId = career.id;
    this.immersionProject.careerTitle = career.titleFr;
    this.immersionProject.careerZone = career.jobZone;
    this.immersionProject.careerPage = 0;
    this.immersionProject.careerImage = career.imageUrl;
    this.immersionProject.observationActivities = career.suggestedActivities?.length
      ? career.suggestedActivities
      : getDefaultActivitiesForCareer(career.titleFr);
    this.immersionProject.preparedQuestions = career.suggestedQuestions?.length
      ? career.suggestedQuestions
      : getDefaultQuestionsForCareer(career.titleFr);
    this.immersionProject.currentStep = 2;
    this.selectedAutonomousCareerDetail = null;
    this.selectYoungTab('IMMERSION_PRO');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  onCatalogFavoriteToggled(career: UICatalogCareer): void {
    const found = this.catalogCareers.find((c) => c.id === career.id);
    if (found) {
      found.isFavorite = career.isFavorite;
    }
  }

  selectCounselorTab(tab: CounselorTab): void {
    this.activeCounselorTab = tab;
    this.isMobileMenuOpen = false;
    this.isNotificationsOpen = false;
    this.isProfileMenuOpen = false;
  }

  startImmersionForCareer(career: any): void {
    if (!career) return;
    this.immersionProject.careerId = career.id;
    this.immersionProject.careerTitle = career.titleFr;
    this.immersionProject.careerZone = career.jobZone;
    this.immersionProject.careerPage = career.pageNumber;
    this.immersionProject.careerImage = career.imageUrl;
    this.immersionProject.observationActivities = getDefaultActivitiesForCareer(career.titleFr);
    this.immersionProject.preparedQuestions = getDefaultQuestionsForCareer(career.titleFr);
    this.immersionProject.currentStep = 2;
    this.selectedCareerDetail = null;
    this.activeYoungTab = 'IMMERSION_PRO';
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  get currentNotifications(): Array<{
    id: string;
    icon: string;
    badgeBg: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    targetTab?: YoungTab;
    targetCounselorTab?: CounselorTab;
  }> {
    return this.activePortal === 'YOUNG' ? this.youngNotifications : this.counselorNotifications;
  }

  get unreadNotificationsCount(): number {
    return this.currentNotifications.filter((n) => n.unread).length;
  }

  toggleNotificationsPanel(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      this.isNotificationsOpen = false;
    }
  }

  markAllNotificationsRead(): void {
    this.currentNotifications.forEach((n) => (n.unread = false));
  }

  onNotificationClick(notif: {
    unread: boolean;
    targetTab?: YoungTab;
    targetCounselorTab?: CounselorTab;
  }): void {
    notif.unread = false;
    this.isNotificationsOpen = false;
    if (this.activePortal === 'YOUNG' && notif.targetTab) {
      this.selectYoungTab(notif.targetTab);
    } else if (this.activePortal === 'COUNSELOR' && notif.targetCounselorTab) {
      this.selectCounselorTab(notif.targetCounselorTab);
    }
  }

  openSettingsFromProfileMenu(): void {
    this.isProfileMenuOpen = false;
    if (this.activePortal === 'YOUNG') {
      this.selectYoungTab('PARAMETRES_JEUNE');
    } else {
      this.selectCounselorTab('PARAMETRES');
    }
  }

  getCounselorHeaderSubtitle(): string {
    switch (this.activeCounselorTab) {
      case 'TABLEAU_DE_BORD':
        return 'Bienvenue sur votre espace conseiller MonBilan+. Suivez vos jeunes et validez les restitutions.';
      case 'DOSSIERS_JEUNES':
        return 'Consultez, suivez et gérez les parcours d’orientation de vos jeunes accompagnés.';
      case 'IMPORTER_RAPPORT':
        return 'Ajoutez un rapport du Centre des Possibles pour structurer une restitution vérifiée.';
      case 'VERIFICATION_DONNEES':
        return 'Contrôlez chaque information extraite du rapport original (pages 1 à 17).';
      case 'VALIDATIONS_PUBLICATIONS':
        return 'Contrôlez, validez et publiez les rapports et restitutions des jeunes.';
      case 'SUIVI_RDV':
        return 'Planifiez, suivez et préparez vos échanges avec les jeunes.';
      case 'STATISTIQUES':
        return 'Suivez l’activité et l’avancement des restitutions de votre structure.';
      case 'PARAMETRES':
        return 'Gérez votre profil professionnel, votre sécurité et vos préférences.';
    }
  }

  openAudioRestitutionView(): void {
    this.activeYoungTab = 'MON_BILAN';
    this.showAudioFocusSubView = true;
  }

  openCareerDetail(career: UICareer): void {
    this.activeYoungTab = 'EXPLORER_METIERS';
    this.selectedCareerDetail = career;
  }

  handleOpenCareerByName(title: string): void {
    const found = this.careers.find(c => c.titleFr.toLowerCase().includes(title.toLowerCase()));
    if (found) {
      this.openCareerDetail(found);
    } else if (this.careers.length > 0) {
      this.openCareerDetail(this.careers[0]);
    } else {
      this.selectYoungTab('EXPLORER_METIERS');
    }
  }

  openDossierWorkflow(step: CounselorWorkflowStep = 1): void {
    this.activePortal = 'COUNSELOR';
    this.activeCounselorTab = 'IMPORTER_RAPPORT';
    this.setWorkflowStep(step);
  }

  openCounselorValidation(): void {
    this.openDossierWorkflow(4);
  }

  getCounselorHeaderTitle(): string {
    switch (this.activeCounselorTab) {
      case 'TABLEAU_DE_BORD':
        return 'Bonjour, Conseiller !';
      case 'DOSSIERS_JEUNES':
        return 'Dossiers jeunes';
      case 'IMPORTER_RAPPORT':
        return 'Importer un rapport';
      case 'VERIFICATION_DONNEES':
        return 'Vérification des données extraites';
      case 'VALIDATIONS_PUBLICATIONS':
        return 'Validations & publication';
      case 'SUIVI_RDV':
        return 'Suivi & rendez-vous';
      case 'STATISTIQUES':
        return 'Statistiques & impact';
      case 'PARAMETRES':
        return 'Mes paramètres';
    }
  }

  get featuredSixCareers(): UICareer[] {
    return this.careers.filter((c) =>
      ['Peintre décorateur', 'Barista', 'Guide touristique', 'Technicien du son', 'Animateur Radio', 'Professeur des écoles'].includes(c.titleFr)
    );
  }

  get youngClaims(): UIClaim[] {
    return this.claims;
  }

  get fullTranscriptText(): string {
    return this.youngClaims.map((c) => c.text).join('\n\n');
  }

  get filteredCareers(): UICareer[] {
    let list = this.careers;
    if (this.showOnlyFavorites) {
      list = list.filter((c) => c.isFavorite);
    } else if (this.selectedZone !== 0) {
      list = list.filter((c) => c.jobZone === this.selectedZone);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(
        (c) => c.titleFr.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }
    return list;
  }

  get favoriteCareers(): UICareer[] {
    return this.careers.filter((c) => c.isFavorite);
  }

  getZoneDurationLabel(zone: number): string {
    switch (zone) {
      case 1:
        return '0 à 6 mois';
      case 2:
        return '3 mois à 2 ans';
      case 3:
        return '1 à 4 ans';
      case 4:
        return '2 à 6 ans';
      case 5:
        return '4 à 10 ans';
      default:
        return '';
    }
  }

  getCareerSalary(career: UICareer | null): { starter: string; experienced: string; median: string; note: string } {
    if (!career) {
      return {
        starter: '1 800 € à 2 150 € brut / mois',
        experienced: '2 500 € à 3 200 € brut / mois',
        median: '~28 000 € brut / an',
        note: 'Estimations indicatives conventions collectives.'
      };
    }
    const title = career.titleFr.toLowerCase();
    if (title.includes('peintre')) {
      return {
        starter: '1 850 € à 2 200 € brut / mois (~1 450 € à 1 720 € net)',
        experienced: '2 500 € à 3 200 € brut / mois (artisan / chef d’équipe)',
        median: '~28 500 € brut / an',
        note: 'Grille conventionnelle BTP & Finition. En contrat d’apprentissage : rémunération légale de 43 % à 100 % du SMIC selon l’âge. Primes de panier et déplacements de chantier.'
      };
    } else if (title.includes('son') || title.includes('radio')) {
      return {
        starter: '1 950 € à 2 400 € brut / mois ou cachets d’intermittent',
        experienced: '2 800 € à 4 000 € brut / mois (régisseur / chef opérateur)',
        median: '~33 000 € brut / an',
        note: 'Statut intermittent du spectacle ou salarié en studio / régie audiovisuelle. Majoration pour soirées et week-ends.'
      };
    } else if (title.includes('barista')) {
      return {
        starter: '1 800 € à 2 050 € brut / mois + pourboires',
        experienced: '2 200 € à 2 700 € brut / mois (chef barman / responsable café)',
        median: '~25 000 € brut / an',
        note: 'Convention collective HCR (Hôtellerie-Cafés-Restauration), complétée par les pourboires et primes de service.'
      };
    } else if (title.includes('guide')) {
      return {
        starter: '1 850 € à 2 250 € brut / mois',
        experienced: '2 500 € à 3 500 € brut / mois (indépendant / bilingue)',
        median: '~29 000 € brut / an',
        note: 'Secteur touristique Côte d’Azur, primes valorisant les langues étrangères et saisons estivales.'
      };
    } else if (title.includes('professeur') || title.includes('enseignant')) {
      return {
        starter: '2 100 € à 2 400 € net / mois (titularisation)',
        experienced: '3 000 € à 3 800 € net / mois en fin de carrière',
        median: '~35 000 € net / an',
        note: 'Grille indiciaire Fonction Publique d’État (Éducation Nationale) avec indemnités de suivi et congés scolaires.'
      };
    }

    switch (career.jobZone) {
      case 1:
        return {
          starter: '1 800 € à 2 150 € brut / mois',
          experienced: '2 400 € à 3 000 € brut / mois',
          median: '~26 000 € brut / an',
          note: 'SMIC à ~2 150 € brut. Accès rapide avec contrat d’apprentissage rémunéré.'
        };
      case 2:
        return {
          starter: '1 900 € à 2 300 € brut / mois',
          experienced: '2 600 € à 3 400 € brut / mois',
          median: '~29 000 € brut / an',
          note: 'Évolution salariale rapide selon l’expérience de terrain et la spécialisation.'
        };
      case 3:
        return {
          starter: '2 100 € à 2 600 € brut / mois',
          experienced: '2 900 € à 3 900 € brut / mois',
          median: '~34 000 € brut / an',
          note: 'Niveau technicien supérieur qualifié avec primes d’expertise technique.'
        };
      case 4:
        return {
          starter: '2 300 € à 2 900 € brut / mois',
          experienced: '3 200 € à 4 500 € brut / mois',
          median: '~40 000 € brut / an',
          note: 'Niveau cadre ou agent de maîtrise selon la structure.'
        };
      default:
        return {
          starter: '2 600 € à 3 400 € brut / mois',
          experienced: '3 800 € à 5 500 € brut / mois',
          median: '~48 000 € brut / an',
          note: 'Niveau cadre supérieur ou profession libérale spécialisée.'
        };
    }
  }

  getCareerWorkConditions(career: UICareer | null): string[] {
    if (!career) return [];
    const title = career.titleFr.toLowerCase();
    if (title.includes('peintre')) {
      return [
        'Lieux d’exercice : en atelier de décoration, sur chantiers de rénovation ou neufs (intérieurs et extérieurs).',
        'Rythme & Horaires : horaires réguliers de journée (du lundi au vendredi, environ 35h/semaine).',
        'Sécurité & Équipements (EPI) : port obligatoire du masque respiratoire, gants, lunettes de protection et chaussures de sécurité.',
        'Mobilité : déplacements fréquents dans le département selon les chantiers (véhicule d’entreprise souvent mis à disposition).',
        'Travail d’équipe : collaboration étroite avec d’autres corps d’état (menuisiers, architectes d’intérieur, clients particuliers).'
      ];
    } else if (title.includes('son') || title.includes('radio')) {
      return [
        'Lieux d’exercice : régies son, studios d’enregistrement, salles de spectacle ou extérieurs événementiels.',
        'Rythme & Horaires : plannings modulables et décalés selon les représentations et tournages (soirs et week-ends fréquents).',
        'Ergonomie & Équipements : écoute prolongée au casque, consoles numériques et logiciels spécialisés.',
        'Travail d’équipe : coopération permanente avec les artistes, réalisateurs et musiciens.'
      ];
    }

    switch (career.jobZone) {
      case 1:
        return [
          'Lieux d’exercice : en atelier, en magasin ou sur site d’intervention.',
          'Rythme & Horaires : horaires réguliers de journée, plannings généralement stables.',
          'Posture & Gestes : travail actif avec manipulations concrètes de matières et outils.',
          'Environnement : encadrement par un chef d’équipe ou tuteur d’apprentissage.'
        ];
      case 2:
      case 3:
        return [
          'Lieux d’exercice : environnement mixte (atelier, studio, bureau ou contact clientèle).',
          'Rythme & Horaires : rythme régulier avec temps de préparation technique et logistique.',
          'Sécurité & Qualité : application des normes de sécurité et de conformité métier.',
          'Collaboration : travail en équipe pluridisciplinaire et autonomie croissante.'
        ];
      default:
        return [
          'Lieux d’exercice : locaux professionnels, bureaux d’études ou établissements recevant du public.',
          'Rythme & Horaires : gestion de projets, réunions d’équipe et interventions programmées.',
          'Responsabilité : animation de groupes, encadrement ou accompagnement individualisé.'
        ];
    }
  }

  getCareerTrainingAccessibility(career: UICareer | null): { accessLevel: string; pathways: string[]; prerequisites: string; localFunding: string } {
    if (!career) {
      return {
        accessLevel: 'Accessible dès la 3e',
        pathways: ['Filières courtes et qualifiantes'],
        prerequisites: 'Motivation et curiosité',
        localFunding: 'CFA et lycées professionnels locaux'
      };
    }
    const title = career.titleFr.toLowerCase();
    if (title.includes('peintre')) {
      return {
        accessLevel: 'Très accessible — Pas de prérequis de diplôme',
        pathways: [
          'CAP Peintre applicateur de revêtements (1 à 2 ans dès la sortie de 3e)',
          'Bac Professionnel Aménagement-finition du bâtiment (3 ans)',
          'Titre professionnel Peintre en décors (formation certifiante RNCP de 6 à 9 mois en reconversion)',
          'Mention Complémentaire (MC) Peinture décoration (1 an après un premier CAP)'
        ],
        prerequisites: 'Accessible sans condition de diplôme antérieur. Sélection sur motivation, sensibilité aux couleurs et soin du travail manuel.',
        localFunding: 'Formation 100 % gratuite et rémunérée en contrat d’apprentissage. Organismes partenaires locaux : CFA du BTP d’Antibes / Nice, Lycées professionnels du bassin azuréen, Greta Côte d’Azur.'
      };
    }

    switch (career.jobZone) {
      case 1:
        return {
          accessLevel: 'Très accessible — Accès direct sans prérequis',
          pathways: [
            'CAP ou Titre professionnel RNCP (6 mois à 2 ans)',
            'Contrat d’apprentissage en entreprise dès 16 ans',
            'Formations qualifiantes courtes pour démarrer rapidement'
          ],
          prerequisites: 'Aucun diplôme obligatoire requis. Admission basée sur la motivation et l’envie d’apprendre.',
          localFunding: 'Formations prises en charge à 100 % via l’alternance et les financements régionaux PACA.'
        };
      case 2:
        return {
          accessLevel: 'Accessible — Formations courtes de 1 à 2 ans',
          pathways: [
            'CAP, Bac Professionnel ou CQP de branche',
            'Apprentissage en entreprise avec salaire d’apprenti'
          ],
          prerequisites: 'Accessible après la 3e ou avec un premier niveau de qualification.',
          localFunding: 'CFA et centres de formation partenaires dans les Alpes-Maritimes.'
        };
      case 3:
        return {
          accessLevel: 'Accessible avec formation qualifiante (Bac à Bac+2)',
          pathways: [
            'BTS, DMA ou Titre certifié RNCP niveau 5',
            'Cursus spécialisés en alternance'
          ],
          prerequisites: 'Baccalauréat général, technologique ou professionnel.',
          localFunding: 'Lycées techniques et établissements d’enseignement supérieur de Nice Côte d’Azur.'
        };
      default:
        return {
          accessLevel: 'Accessible sur parcours certifié (Bac+2 à Bac+5)',
          pathways: [
            'Licence, Master ou Diplôme d’État',
            'Passerelles en formation continue et validation des acquis (VAE)'
          ],
          prerequisites: 'Baccalauréat et parcours d’études supérieures selon la filière.',
          localFunding: 'Université Côte d’Azur et instituts de formation régionaux.'
        };
    }
  }

  getCareerAdaptationFaculty(career: UICareer | null): { title: string; cognitiveLink: string; concreteRole: string; advice: string } {
    return {
      title: 'Faculté d’adaptation — Un atout clé de ton profil pour ce métier',
      cognitiveLink: 'En lien direct avec ta Flexibilité des catégories et ton Adaptabilité (mesurées à la page 5 de ton bilan)',
      concreteRole: `Sur le terrain, chaque projet, support ou environnement est différent. Ta faculté d’adaptation te permet d’ajuster rapidement tes techniques, de trouver des solutions créatives face aux imprévus et de comprendre immédiatement les attentes précises de tes interlocuteurs.`,
      advice: `Cette souplesse d’esprit et cette agilité face à la nouveauté — mises en valeur dans ton rapport du Centre des Possibles — feront de toi une personne précieuse et autonome au sein de toute équipe.`
    };
  }

  /** Lien vers les expériences VR Métiers360 du secteur le plus proche du métier. */
  getMetiers360Url(career: UICareer | null): string {
    const base = 'https://www.metiers360.com/catalogue';
    if (!career) return `${base}/experiences`;
    const tag = (career.sectorTag || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
    const mapping: Array<[RegExp, string]> = [
      [/restauration|alimentaire/, 'restauration'],
      [/tourisme|sport/, 'tourisme-et-loisirs'],
      [/nature|agricult/, 'nature-et-espaces-verts'],
      [/numerique|audiovisuel|medias|communication/, 'numerique'],
      [/chantier|construction|batiment/, 'construction'],
      [/logistique|transport/, 'transport-et-mobilite'],
      [/energie|environnement/, 'energies'],
      [/education|enfance/, 'petite-enfance-et-education'],
      [/accompagnement|social/, 'accompagnement-social'],
      [/soin|sante|bien-etre/, 'autonomie'],
      [/commerce|vente/, 'commerce-et-vente'],
      [/industri/, 'production-industrielle'],
      [/art|artisanat/, 'artisanat-d-art'],
    ];
    const match = mapping.find(([re]) => re.test(tag));
    return match ? `${base}/secteur/${match[1]}` : `${base}/experiences`;
  }

  requestProContact(career: UICareer): void {
    if (this.careerProContactRequested[career.id]) return;
    this.careerProContactRequested[career.id] = true;
    this.statusBanner = `Demande de mise en relation pour "${career.titleFr}" transmise à ton conseiller Sarah Dupont pour validation.`;
    this.questions.unshift({
      id: `q-pro-${Date.now()}`,
      tagLabel: 'Immersion Pro',
      tagColor: 'bg-[#EDE9FE] text-[#6D28D9]',
      relatedTopic: `Métier : ${career.titleFr}`,
      questionText: `Demande de mise en relation avec un professionnel du secteur ${career.titleFr} (Zone ${career.jobZone}). Soumis à la validation du conseiller.`,
      checked: false,
      counselorReply: 'Demande bien reçue ! Nous organiserons cette mise en relation avec nos partenaires locaux lors de notre prochain rendez-vous.'
    });
  }

  loadBrowserVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const update = () => {
        this.availableBrowserVoices = window.speechSynthesis.getVoices();
      };
      update();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = update;
      }
    }
  }

  getBestBrowserVoice(gender: 'female' | 'male'): SpeechSynthesisVoice | null {
    if (!this.availableBrowserVoices || this.availableBrowserVoices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.availableBrowserVoices = window.speechSynthesis.getVoices();
      }
    }
    const frenchVoices = (this.availableBrowserVoices || []).filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
    if (frenchVoices.length === 0) {
      return (this.availableBrowserVoices && this.availableBrowserVoices.length > 0) ? this.availableBrowserVoices[0] : null;
    }

    if (gender === 'female') {
      const femaleMatch = frenchVoices.find(v =>
        /amelie|amélie|audrey|aurelie|aurélie|denise|julie|marie|celine|céline|female|femme|virginie/i.test(v.name)
      );
      return femaleMatch || frenchVoices[0];
    } else {
      const maleMatch = frenchVoices.find(v =>
        /thomas|nicolas|henri|paul|sebastien|sébastien|pierre|male|homme|mathieu/i.test(v.name)
      );
      return maleMatch || frenchVoices.find(v => !/amelie|amélie|audrey|aurelie|denise|julie|female|virginie/i.test(v.name)) || frenchVoices[0];
    }
  }

  testSelectedVoice(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.statusBanner = 'La synthèse vocale nécessite un navigateur compatible Web Speech API.';
      return;
    }
    this.stopSpeech();
    this.isTestingVoice = true;
    this.toggleSpeech(this.currentVoice.previewSample);
  }

  toggleSpeech(customText?: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.statusBanner = 'Utilisez le lecteur audio WAV ou la transcription synchronisée.';
      return;
    }

    if (this.isSpeaking) {
      this.stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = customText || this.fullTranscriptText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fr-FR';

    const persona = this.currentVoice;
    const voiceObj = this.getBestBrowserVoice(persona.gender);
    if (voiceObj) {
      utterance.voice = voiceObj;
    }

    const toneOpt = this.currentToneOption;
    utterance.pitch = Math.max(0.5, Math.min(2, persona.pitch + toneOpt.pitchOffset));
    utterance.rate = Math.max(0.6, Math.min(2, this.speechRate * persona.rate * toneOpt.rateMultiplier));

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isTestingVoice = false;
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isTestingVoice = false;
    };

    this.isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.isTestingVoice = false;
  }

  setSpeechRate(rate: number): void {
    this.speechRate = rate;
    if (this.isSpeaking) {
      this.stopSpeech();
      this.toggleSpeech();
    }
  }

  cycleSpeechRate(): void {
    const next = this.speechRate === 1 ? 1.15 : this.speechRate === 1.15 ? 0.85 : 1;
    this.setSpeechRate(next);
  }

  prefillQuestionWithCareer(career: UICareer): void {
    this.newQuestionTopic = 'Métiers';
    this.newQuestionText = `Comment explorer la piste ${career.titleFr} (Zone ${career.jobZone}, page ${career.pageNumber}) ?`;
    this.selectedCareerDetail = null;
    this.activeYoungTab = 'MES_QUESTIONS';
  }

  submitYoungQuestion(): void {
    if (!this.newQuestionText.trim()) return;
    this.questions.unshift({
      id: `q-${Date.now()}`,
      tagLabel: this.newQuestionTopic.trim() || 'Question',
      tagColor: 'bg-[#EDE9FE] text-[#6D28D9]',
      relatedTopic: 'Dossier Rdv 2187',
      questionText: this.newQuestionText.trim(),
      checked: false,
      counselorReply: null
    });
    this.newQuestionTopic = '';
    this.newQuestionText = '';
    this.persistQuestions();
    this.statusBanner = '✓ Ta question a bien été ajoutée à ta liste pour ton conseiller.';
  }

  onSaveQuestionFromBilan(evt: { text: string; answer?: string }): void {
    if (!evt || !evt.text.trim()) return;
    this.questions.unshift({
      id: `q-${Date.now()}`,
      tagLabel: 'Bilan Rdv ' + this.rdvNumber,
      tagColor: 'bg-[#EDE9FE] text-[#6D28D9]',
      relatedTopic: 'Mon bilan d\'orientation',
      questionText: evt.text.trim(),
      checked: false,
      counselorReply: evt.answer || null
    });
    this.persistQuestions();
    this.statusBanner = '✓ Ta question a bien été enregistrée dans "Mes questions" pour ton conseiller.';
  }

  persistQuestions(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('monbilan_questions_' + this.rdvNumber, JSON.stringify(this.questions));
      } catch (e) {
        console.warn('LocalStorage non disponible', e);
      }
    }
  }

  loadPersistedQuestions(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('monbilan_questions_' + this.rdvNumber);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.questions = parsed;
          }
        }
      } catch (e) {
        console.warn('LocalStorage parse error', e);
      }
    }
  }

  onCounselorEditClaim(claim: UIClaim): void {
    claim.reviewStatus = 'EDITED';
    this.audioReady = false;
    this.restitutionStatus = 'DRAFT_REVIEW';
    this.scriptHash = `rev-${Date.now().toString(16)}`;
  }

  regenerateAIDraft(): void {
    const unverified = this.facts.filter((f) => !f.isVerified);
    if (unverified.length > 0) {
      this.statusBanner = `Blocage de sécurité : ${unverified.length} fait(s) ne sont pas cochés comme "Vérifié".`;
      return;
    }
    this.restitutionVersion += 1;
    this.restitutionStatus = 'DRAFT_REVIEW';
    this.audioReady = false;
    this.statusBanner = `Brouillon v${this.restitutionVersion} généré avec contrôle des sources (Rdv 2187). État : À VÉRIFIER.`;
  }

  approveCurrentRestitution(): void {
    this.restitutionStatus = 'APPROVED';
    this.claims.forEach((c) => (c.reviewStatus = 'APPROVED'));
    this.statusBanner = `✓ Script v${this.restitutionVersion} validé par le professionnel. Vous pouvez lancer la synthèse vocale Piper TTS.`;
  }

  triggerPiperAudio(): void {
    if (this.restitutionStatus !== 'APPROVED' && this.restitutionStatus !== 'READY') {
      this.statusBanner = 'Validez d’abord le script (étape 2) avant la synthèse vocale.';
      return;
    }
    this.audioReady = true;
    this.restitutionStatus = 'READY';
    this.statusBanner = `Audio WAV généré par Piper TTS pour la version v${this.restitutionVersion}.`;
  }

  confirmPublishToYoung(): void {
    if (!this.audioReady) {
      this.statusBanner = 'L’audio doit être généré pour la version actuelle avant publication.';
      return;
    }
    this.restitutionStatus = 'PUBLISHED';
    this.statusBanner = `Restitution v${this.restitutionVersion} publiée dans l’Espace Jeune !`;
  }

  runSecuritySimulation(kind: 'CROSS_TENANT' | 'UNASSIGNED_COUNSELOR' | 'HALLUCINATION_BLOCK'): void {
    if (kind === 'CROSS_TENANT') {
      this.securityTestResult =
        '[403 FORBIDDEN — PostgreSQL FORCE RLS] Accès inter-établissement refusé : Tenant B (Antibes) != Tenant A (Nice).';
    } else if (kind === 'UNASSIGNED_COUNSELOR') {
      this.securityTestResult =
        '[403 FORBIDDEN — ABAC Assignment] Accès refusé : Conseiller non affecté au dossier Rdv 2187.';
    } else {
      this.securityTestResult =
        '[400 BAD REQUEST — Zero-Hallucination Verifier] Sortie LLM rejetée : toute référence absente du rapport 2187 ou formulation de diagnostic est bloquée.';
    }
  }

  // ==============================================================
  // GESTION DU WORKFLOW D'IMPORT & ANALYSE IA -> VÉRIFICATION -> VALIDATION
  // ==============================================================
  uploadedFile: { name: string; size: string; type: string; lastModified: string } | null = {
    name: 'rapport-des-possibles-2187.pdf',
    size: '1.4 Mo',
    type: 'application/pdf',
    lastModified: '18 nov. 2026'
  };
  isDraggingFile = false;
  isUploading = false;
  isAnalyzingIA = false;
  uploadProgress = 100;
  analysisStepLabel = 'Analyse IA terminée • 17 pages extraites sans hallucination';
  uploadErrorMessage: string | null = null;
  uploadSuccessNotice: string | null = null;

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.processSelectedFile(input.files[0]);
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      this.processSelectedFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = false;
  }

  processSelectedFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      this.uploadErrorMessage = 'Format non supporté. Veuillez importer un document PDF (max 25 Mo).';
      return;
    }
    this.uploadErrorMessage = null;
    const sizeMo = (file.size / (1024 * 1024)).toFixed(1) + ' Mo';
    this.uploadedFile = {
      name: file.name,
      size: sizeMo,
      type: file.type || 'application/pdf',
      lastModified: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    this.runAiAnalysisPipeline(file.name);
  }

  loadSampleReport(): void {
    this.uploadedFile = {
      name: 'rapport-des-possibles-2187.pdf',
      size: '1.4 Mo',
      type: 'application/pdf',
      lastModified: '18 nov. 2026'
    };
    this.uploadErrorMessage = null;
    this.runAiAnalysisPipeline('rapport-des-possibles-2187.pdf');
  }

  runAiAnalysisPipeline(filename: string): void {
    this.isUploading = true;
    this.isAnalyzingIA = true;
    this.uploadProgress = 20;
    this.analysisStepLabel = '1/3 • Découpage OCR et lecture des 17 pages du rapport...';

    setTimeout(() => {
      this.uploadProgress = 60;
      this.analysisStepLabel = '2/3 • Extraction RIASEC (p. 4), HEXACO (p. 6) et 22 métiers O*NET...';
    }, 400);

    setTimeout(() => {
      this.uploadProgress = 90;
      this.analysisStepLabel = '3/3 • Indexation des preuves et contrôle zéro-hallucination...';
    }, 800);

    setTimeout(() => {
      this.uploadProgress = 100;
      this.isUploading = false;
      this.isAnalyzingIA = false;
      this.analysisStepLabel = 'Analyse IA terminée avec succès ! 22 métiers et 7 faits extraits.';
      this.uploadSuccessNotice = `Le rapport "${filename}" a été analysé par l'IA : 22 métiers O*NET et faits sourcés extraits avec succès !`;
      setTimeout(() => {
        this.uploadSuccessNotice = null;
      }, 3500);
    }, 1300);
  }

  resetUploadedFile(): void {
    this.uploadedFile = null;
    this.uploadProgress = 0;
    this.uploadErrorMessage = null;
    this.uploadSuccessNotice = null;
  }

  setWorkflowStep(step: CounselorWorkflowStep): void {
    this.counselorWorkflowStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get countToDeepen(): number {
    return this.careerAssessments.filter((a) => a.finalStatus === 'TO_DEEPEN').length;
  }

  get countToExplore(): number {
    return this.careerAssessments.filter((a) => a.finalStatus === 'TO_EXPLORE').length;
  }

  get countDeferred(): number {
    return this.careerAssessments.filter((a) => a.finalStatus === 'DEFERRED').length;
  }

  get countNeedsReview(): number {
    return this.careerAssessments.filter((a) => a.finalStatus === 'NEEDS_REVIEW').length;
  }

  get currentEpisode(): UIEpisode {
    return this.audioEpisodes[this.selectedEpisodeIndex] ?? this.audioEpisodes[0];
  }

  addExpressedInterest(): void {
    const val = this.interviewForm.newInterestInput.trim();
    if (val) {
      this.interviewForm.expressedInterests.push(val);
      this.interviewForm.newInterestInput = '';
    }
  }

  removeExpressedInterest(idx: number): void {
    this.interviewForm.expressedInterests.splice(idx, 1);
  }

  addExplicitCareer(): void {
    const val = this.interviewForm.newCareerInput.trim();
    if (val) {
      this.interviewForm.explicitCareers.push(val);
      this.interviewForm.newCareerInput = '';
    }
  }

  removeExplicitCareer(idx: number): void {
    this.interviewForm.explicitCareers.splice(idx, 1);
  }

  addMotivation(): void {
    const val = this.interviewForm.newMotivationInput.trim();
    if (val) {
      this.interviewForm.motivations.push(val);
      this.interviewForm.newMotivationInput = '';
    }
  }

  removeMotivation(idx: number): void {
    this.interviewForm.motivations.splice(idx, 1);
  }

  addReservation(): void {
    const val = this.interviewForm.newReservationInput.trim();
    if (val) {
      this.interviewForm.reservations.push(val);
      this.interviewForm.newReservationInput = '';
    }
  }

  removeReservation(idx: number): void {
    this.interviewForm.reservations.splice(idx, 1);
  }

  saveInterviewAndRunMatching(): void {
    this.isSavingInterview = true;
    setTimeout(() => {
      this.isSavingInterview = false;
      this.workflowNotice = 'Compte rendu d’entretien enregistré ! Rapprochement déterministe calculé sur les 22 métiers.';
      this.counselorWorkflowStep = 3;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        this.workflowNotice = null;
      }, 3500);
    }, 450);
  }

  updateCareerStatus(
    assessment: UICareerAssessment,
    status: 'TO_DEEPEN' | 'TO_EXPLORE' | 'DEFERRED' | 'NEEDS_REVIEW'
  ): void {
    assessment.finalStatus = status;
    assessment.isModified = true;
    assessment.isValidated = true;
  }

  bulkValidateCareers(): void {
    for (const a of this.careerAssessments) {
      a.isValidated = true;
    }
    this.workflowNotice = 'L’ensemble des 22 métiers a été validé par le psychologue !';
    setTimeout(() => {
      this.workflowNotice = null;
    }, 3000);
  }

  selectEpisode(idx: number): void {
    this.selectedEpisodeIndex = idx;
    this.activeAudioSegmentIndex = 0;
  }

  generateEpisodeAudio(idx: number): void {
    this.isGeneratingPiperAudio = true;
    setTimeout(() => {
      this.audioEpisodes[idx].validationStatus = 'APPROVED';
      this.isGeneratingPiperAudio = false;
      this.workflowNotice = `Voix de synthèse Piper TTS générée avec succès pour l’Épisode ${idx + 1} !`;
      setTimeout(() => {
        this.workflowNotice = null;
      }, 3000);
    }, 500);
  }

  generateAllEpisodesAudio(): void {
    this.isGeneratingPiperAudio = true;
    setTimeout(() => {
      for (const ep of this.audioEpisodes) {
        ep.validationStatus = 'APPROVED';
      }
      this.isGeneratingPiperAudio = false;
      this.workflowNotice = 'Les 6 épisodes audio ont été générés avec succès via Piper TTS !';
      setTimeout(() => {
        this.workflowNotice = null;
      }, 3500);
    }, 800);
  }

  publishRestitutionToYoung(): void {
    this.isRestitutionPublishedToYoung = true;
    this.workflowNotice = 'La restitution complète (6 épisodes et 22 métiers) est publiée pour Emma D. !';
    setTimeout(() => {
      this.workflowNotice = null;
    }, 4000);
  }

  getAssessmentForCareer(careerTitle: string): UICareerAssessment | undefined {
    return this.careerAssessments.find(
      (a) => a.originalTitle.toLowerCase() === careerTitle.toLowerCase()
    );
  }

  get filteredCareersByStatus(): UICareer[] {
    let list = this.careers;
    if (this.careerFilterInExplorer !== 'ALL') {
      list = list.filter((c) => {
        const assessment = this.getAssessmentForCareer(c.titleFr);
        return assessment?.finalStatus === this.careerFilterInExplorer;
      });
    }
    if (this.showOnlyFavorites) {
      list = list.filter((c) => c.isFavorite);
    } else if (this.selectedZone !== 0) {
      list = list.filter((c) => c.jobZone === this.selectedZone);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(
        (c) => c.titleFr.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }
    return list;
  }
}
