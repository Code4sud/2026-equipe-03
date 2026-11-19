import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MbIconComponent } from '../../shared/ui/mb-icon.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MbIconComponent, CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-12">
      <!-- ================================================================== -->
      <!-- EN-TÊTE : MES PARAMÈTRES                                           -->
      <!-- ================================================================== -->
      <div class="flex items-center gap-3.5">
        <div class="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-xl sm:text-2xl font-bold border border-[#E9D5FF] shrink-0 shadow-2xs">
          <mb-icon name="settings"></mb-icon>
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0F1035] tracking-tight">
            Mes paramètres
          </h2>
          <p class="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Personnalise ton expérience et garde le contrôle sur tes informations.
          </p>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- CARTE PRINCIPALE : PROFIL & IDENTITÉ                               -->
      <!-- ================================================================== -->
      <div class="rounded-[28px] sm:rounded-[32px] bg-white border border-[#E4E0F5] p-6 sm:p-8 shadow-sm space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <!-- Colonne Gauche : Photo de profil + Nom + Badge -->
          <div class="md:col-span-4 flex flex-col items-center text-center space-y-3">
            <div class="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-[#EDE9FE] bg-[#F3E8FF] flex items-center justify-center">
              <img
                src="assets/visuals/profile-emma.png"
                alt="Emma D."
                class="h-full w-full object-cover"
                onerror="this.src='assets/visuals/avatar-emma.png'"
              />
              <button
                type="button"
                (click)="onPhotoClick()"
                class="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs shadow-md border-2 border-white hover:bg-[#6D28D9] transition"
                title="Modifier la photo"
              >
                <mb-icon name="camera"></mb-icon>
              </button>
            </div>

            <div class="space-y-1">
              <h3 class="text-xl font-extrabold text-[#0F1035]">
                {{ firstName }} {{ lastName }}
              </h3>
              <span class="inline-block rounded-full bg-[#F3E8FF] text-[#6D28D9] px-3.5 py-1 text-xs font-bold">
                Espace Jeune
              </span>
            </div>

            <button
              type="button"
              (click)="onPhotoClick()"
              class="rounded-full border-2 border-[#7C3AED] text-[#7C3AED] font-extrabold text-xs px-4 py-2 hover:bg-[#F5F3FF] transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span><mb-icon name="camera"></mb-icon></span>
              <span>Modifier ma photo</span>
            </button>
          </div>

          <!-- Colonne Droite : Formulaire d'informations personnelles -->
          <div class="md:col-span-8 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-[#42466B] mb-1.5">
                  Prénom <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="firstName"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] px-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition shadow-2xs"
                  placeholder="Ton prénom"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-[#42466B] mb-1.5">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="lastName"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] px-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition shadow-2xs"
                  placeholder="Ton nom ou initiale"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#42466B] mb-1.5">
                Adresse email <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7C3AED]">
                  <mb-icon name="mail"></mb-icon>
                </span>
                <input
                  type="email"
                  [(ngModel)]="email"
                  class="w-full rounded-2xl bg-white border border-[#E4E0F5] pl-11 pr-4 py-3 text-sm font-semibold text-[#0F1035] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition shadow-2xs"
                  placeholder="ton.adresse@exemple.fr"
                />
              </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                (click)="saveChanges()"
                class="rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] hover:from-[#5320C6] hover:to-[#7E22CE] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <span>✓</span>
                <span>Enregistrer les modifications</span>
              </button>
              <span *ngIf="savedSuccess" class="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                <span>✓</span>
                <span>Enregistré avec succès !</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- LISTE DES RUBRIQUES DE CONFIGURATION                               -->
      <!-- ================================================================== -->
      <div class="space-y-3">
        <!-- Rubrique 1 : Sécurité et mot de passe -->
        <div
          (click)="toggleSection('SECURITY')"
          class="rounded-2xl sm:rounded-[22px] bg-white border border-[#E4E0F5] p-4.5 sm:p-5 shadow-xs hover:border-[#7C3AED] transition cursor-pointer flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <div class="h-11 w-11 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-lg shrink-0 shadow-2xs">
              <mb-icon name="lock"></mb-icon>
            </div>
            <div>
              <h4 class="text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Sécurité et mot de passe
              </h4>
              <p class="text-xs text-[#6B7280]">
                Modifier mon mot de passe et sécuriser mon compte
              </p>
            </div>
          </div>
          <span class="text-[#7C3AED] font-black text-xl group-hover:translate-x-1 transition">›</span>
        </div>

        <!-- Rubrique 2 : Notifications -->
        <div
          (click)="toggleSection('NOTIFICATIONS')"
          class="rounded-2xl sm:rounded-[22px] bg-white border border-[#E4E0F5] p-4.5 sm:p-5 shadow-xs hover:border-[#7C3AED] transition cursor-pointer flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <div class="h-11 w-11 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-lg shrink-0 shadow-2xs">
              <mb-icon name="bell"></mb-icon>
            </div>
            <div>
              <h4 class="text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Notifications
              </h4>
              <p class="text-xs text-[#6B7280]">
                Choisir les alertes et rappels que je souhaite recevoir
              </p>
            </div>
          </div>
          <span class="text-[#7C3AED] font-black text-xl group-hover:translate-x-1 transition">›</span>
        </div>

        <!-- Rubrique 3 : Accessibilité et préférences -->
        <div
          (click)="toggleSection('ACCESSIBILITY')"
          class="rounded-2xl sm:rounded-[22px] bg-white border border-[#E4E0F5] p-4.5 sm:p-5 shadow-xs hover:border-[#7C3AED] transition cursor-pointer flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <div class="h-11 w-11 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-lg shrink-0 shadow-2xs">
              <mb-icon name="accessibility"></mb-icon>
            </div>
            <div>
              <h4 class="text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Accessibilité et préférences
              </h4>
              <p class="text-xs text-[#6B7280]">
                Adapter l’affichage, la taille du texte et les options de lecture
              </p>
            </div>
          </div>
          <span class="text-[#7C3AED] font-black text-xl group-hover:translate-x-1 transition">›</span>
        </div>

        <!-- Panneau déplié pour l'accessibilité / audio -->
        <div *ngIf="activeSection === 'ACCESSIBILITY'" class="rounded-2xl bg-[#F8F7FF] border border-[#E4E0F5] p-5 space-y-4 animate-fade-in">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold text-[#0F1035]">Vitesse de lecture audio par défaut</span>
            <div class="flex gap-2">
              <button
                type="button"
                (click)="onSpeechRateChange(0.85)"
                [class]="speechRate === 0.85 ? 'bg-[#7C3AED] text-white shadow-xs' : 'bg-white text-[#0F1035] border border-[#E4E0F5]'"
                class="rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer"
              >
                0.85x
              </button>
              <button
                type="button"
                (click)="onSpeechRateChange(1.0)"
                [class]="speechRate === 1.0 ? 'bg-[#7C3AED] text-white shadow-xs' : 'bg-white text-[#0F1035] border border-[#E4E0F5]'"
                class="rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer"
              >
                1x
              </button>
              <button
                type="button"
                (click)="onSpeechRateChange(1.15)"
                [class]="speechRate === 1.15 ? 'bg-[#7C3AED] text-white shadow-xs' : 'bg-white text-[#0F1035] border border-[#E4E0F5]'"
                class="rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer"
              >
                1.15x
              </button>
            </div>
          </div>
        </div>

        <!-- Rubrique 4 : Confidentialité et compte -->
        <div
          (click)="toggleSection('PRIVACY')"
          class="rounded-2xl sm:rounded-[22px] bg-white border border-[#E4E0F5] p-4.5 sm:p-5 shadow-xs hover:border-[#7C3AED] transition cursor-pointer flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <div class="h-11 w-11 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-lg shrink-0 shadow-2xs">
              <mb-icon name="shield-check"></mb-icon>
            </div>
            <div>
              <h4 class="text-sm font-extrabold text-[#0F1035] group-hover:text-[#7C3AED] transition">
                Confidentialité et compte
              </h4>
              <p class="text-xs text-[#6B7280]">
                Gérer mes données personnelles et mon compte
              </p>
            </div>
          </div>
          <span class="text-[#7C3AED] font-black text-xl group-hover:translate-x-1 transition">›</span>
        </div>
      </div>

      <!-- ================================================================== -->
      <!-- BOUTON DÉCONNEXION                                                 -->
      <!-- ================================================================== -->
      <button
        type="button"
        (click)="onLogoutClick()"
        class="w-full rounded-2xl border-2 border-red-200 bg-red-50/60 hover:bg-red-50 text-red-600 font-extrabold text-sm py-4 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
      >
        <span class="text-base">↪</span>
        <span>Déconnexion</span>
      </button>
    </div>
  `
})
export class SettingsComponent {
  @Input() firstName = 'Emma';
  @Input() lastName = 'D.';
  @Input() email = 'emma.d@exemple.fr';
  @Input() speechRate = 1.0;

  @Output() logout = new EventEmitter<void>();
  @Output() speechRateChange = new EventEmitter<number>();

  savedSuccess = false;
  activeSection: string | null = null;

  saveChanges(): void {
    this.savedSuccess = true;
    setTimeout(() => {
      this.savedSuccess = false;
    }, 3000);
  }

  onPhotoClick(): void {
    alert('Modification de la photo : fonctionnalité à venir prochainement.');
  }

  toggleSection(section: string): void {
    this.activeSection = this.activeSection === section ? null : section;
  }

  onSpeechRateChange(rate: number): void {
    this.speechRate = rate;
    this.speechRateChange.emit(rate);
  }

  onLogoutClick(): void {
    this.logout.emit();
  }
}
