import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-12">
      <!-- ================================================================== -->
      <!-- EN-TÊTE : MES PARAMÈTRES                                           -->
      <!-- ================================================================== -->
      <div class="flex items-center gap-3.5">
        <div class="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center text-xl sm:text-2xl font-bold border border-[#E9D5FF] shrink-0 shadow-2xs">
          ⚙️
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
                [src]="photoUrl"
                [alt]="firstName + ' ' + lastName"
                class="h-full w-full object-cover"
                (error)="onImgError($event)"
              />
              <button
                type="button"
                (click)="fileInput.click()"
                class="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs shadow-md border-2 border-white hover:bg-[#6D28D9] transition cursor-pointer"
                title="Choisir une photo depuis votre appareil"
              >
                📷
              </button>
            </div>

            <!-- Input fichier masqué pour sélection locale -->
            <input
              #fileInput
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              class="hidden"
              (change)="onFileSelected($event)"
            />

            <div class="space-y-1">
              <h3 class="text-xl font-extrabold text-[#0F1035]">
                {{ firstName }} {{ lastName }}
              </h3>
              <span class="inline-block rounded-full bg-[#F3E8FF] text-[#6D28D9] px-3.5 py-1 text-xs font-bold">
                Espace Jeune
              </span>
            </div>

            <div class="flex flex-col items-center gap-2">
              <button
                type="button"
                (click)="fileInput.click()"
                class="rounded-full border-2 border-[#7C3AED] text-[#7C3AED] font-extrabold text-xs px-4 py-2 hover:bg-[#F5F3FF] transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>📷</span>
                <span>Modifier ma photo</span>
              </button>
              <button
                *ngIf="isCustomPhoto"
                type="button"
                (click)="resetPhoto()"
                class="text-[11px] font-bold text-[#6B7280] hover:text-rose-600 transition underline cursor-pointer"
              >
                Rétablir la photo par défaut
              </button>
            </div>

            <!-- Notifications / Statuts photo -->
            <div *ngIf="photoSuccess" class="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
              <span>✓</span>
              <span>Photo mise à jour avec succès !</span>
            </div>
            <div *ngIf="photoError" class="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
              <span>⚠️</span>
              <span>{{ photoError }}</span>
            </div>
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
                  ✉️
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
              🔒
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
              🔔
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
              ♿
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
              🛡️
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
  @Input() photoUrl = 'assets/visuals/profile-emma.png';

  @Output() logout = new EventEmitter<void>();
  @Output() speechRateChange = new EventEmitter<number>();
  @Output() photoChange = new EventEmitter<string>();
  @Output() profileSave = new EventEmitter<{ firstName: string; lastName: string; email: string; photoUrl: string }>();

  savedSuccess = false;
  activeSection: string | null = null;
  photoSuccess = false;
  photoError: string | null = null;
  isCustomPhoto = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      this.photoError = 'Format non supporté. Veuillez choisir une image (JPEG, PNG, WebP).';
      this.photoSuccess = false;
      return;
    }

    // Validation de la taille (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      this.photoError = 'L\'image est trop volumineuse (maximum 5 Mo).';
      this.photoSuccess = false;
      return;
    }

    this.photoError = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        this.photoUrl = base64;
        this.isCustomPhoto = true;
        this.photoSuccess = true;
        this.photoChange.emit(base64);
        try {
          localStorage.setItem('monbilan_user_photo', base64);
        } catch {
          // LocalStorage fallback
        }
        setTimeout(() => {
          this.photoSuccess = false;
        }, 3500);
      }
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  resetPhoto(): void {
    this.photoUrl = 'assets/visuals/profile-emma.png';
    this.isCustomPhoto = false;
    this.photoError = null;
    this.photoSuccess = true;
    this.photoChange.emit(this.photoUrl);
    try {
      localStorage.removeItem('monbilan_user_photo');
    } catch {}
    setTimeout(() => {
      this.photoSuccess = false;
    }, 3000);
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/visuals/profile-emma.png';
  }

  saveChanges(): void {
    this.savedSuccess = true;
    this.profileSave.emit({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      photoUrl: this.photoUrl
    });
    try {
      localStorage.setItem('monbilan_user_firstname', this.firstName);
      localStorage.setItem('monbilan_user_lastname', this.lastName);
      localStorage.setItem('monbilan_user_email', this.email);
    } catch {}
    setTimeout(() => {
      this.savedSuccess = false;
    }, 3000);
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
