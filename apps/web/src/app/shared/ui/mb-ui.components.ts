// ============================================================================
// Bibliothèque de composants MonBilan+ Design System (§5 de DESIGN_SYSTEM.md)
// Composants : MbButton, MbCard, MbBadge, MbAudioPlayer, MbSourceLink,
//              MbCareerCard, MbProgress, MbEmptyState, MbDialog, MbFormField
// ============================================================================

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MbIconComponent } from './mb-icon.component';

// ----------------------------------------------------------------------------
// 1. MbButton — Zone tactile min-h-11 (44px), variantes primary/secondary/text/danger
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="pressed.emit($event)"
      [class]="computedClasses"
    >
      <span *ngIf="loading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true"></span>
      <ng-content></ng-content>
    </button>
  `
})
export class MbButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'text' | 'danger' = 'primary';
  @Input() pill = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() pressed = new EventEmitter<MouseEvent>();

  get computedClasses(): string {
    const base =
      'min-h-11 px-5 py-2.5 text-[16px] font-semibold leading-snug inline-flex items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mb-focus)] disabled:opacity-50 disabled:cursor-not-allowed';
    const radius = this.pill ? 'rounded-full' : 'rounded-md';

    switch (this.variant) {
      case 'primary':
        return `${base} ${radius} bg-[var(--mb-brand-primary)] text-white hover:opacity-95 shadow-sm`;
      case 'secondary':
        return `${base} ${radius} bg-[var(--mb-surface)] text-[var(--mb-text)] border border-[var(--mb-border)] hover:bg-[var(--mb-surface-soft)]`;
      case 'danger':
        return `${base} ${radius} bg-[var(--mb-danger)] text-white hover:opacity-95`;
      case 'text':
        return `${base} ${radius} bg-transparent text-[var(--mb-brand-primary)] hover:bg-[var(--mb-surface-soft)]`;
    }
  }
}

// ----------------------------------------------------------------------------
// 2. MbCard — Variantes standard, interactive, highlighted (pas de dégradé sur long texte)
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class MbCardComponent {
  @Input() variant: 'standard' | 'interactive' | 'highlighted' = 'standard';

  get computedClasses(): string {
    const base = 'rounded-lg p-6 shadow-card transition';
    switch (this.variant) {
      case 'standard':
        return `${base} bg-[var(--mb-surface)] border border-[var(--mb-border)] text-[var(--mb-text)]`;
      case 'interactive':
        return `${base} bg-[var(--mb-surface)] border-2 border-[var(--mb-border)] hover:border-[var(--mb-brand-primary)] cursor-pointer text-[var(--mb-text)]`;
      case 'highlighted':
        return `${base} bg-[var(--mb-surface-soft)] border-2 border-[var(--mb-brand-primary)] text-[var(--mb-text)]`;
    }
  }
}

// ----------------------------------------------------------------------------
// 3. MbBadge — États explicites en texte (draft, pending, approved, published)
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="computedClasses">
      <span class="w-2 h-2 rounded-full bg-current mr-1.5" aria-hidden="true"></span>
      {{ label }}
    </span>
  `
})
export class MbBadgeComponent {
  @Input() status: 'draft' | 'pending' | 'approved' | 'published' = 'draft';
  @Input() customText?: string;

  get label(): string {
    if (this.customText) return this.customText;
    switch (this.status) {
      case 'draft':
        return 'BROUILLON';
      case 'pending':
        return 'À VÉRIFIER';
      case 'approved':
        return 'VALIDÉ';
      case 'published':
        return 'PUBLIÉ';
    }
  }

  get computedClasses(): string {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border';
    switch (this.status) {
      case 'draft':
        return `${base} bg-[var(--mb-surface-soft)] text-[var(--mb-text)] border-[var(--mb-border)]`;
      case 'pending':
        return `${base} bg-[var(--mb-warning-bg)] text-[var(--mb-warning)] border-current`;
      case 'approved':
        return `${base} bg-[var(--mb-surface-soft)] text-[var(--mb-brand-primary)] border-current`;
      case 'published':
        return `${base} bg-[var(--mb-success-bg)] text-[var(--mb-success)] border-current`;
    }
  }
}

// ----------------------------------------------------------------------------
// 4. MbSourceLink — Preuve vérifiable du rapport (page, document, extrait)
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-source-link',
  standalone: true,
  imports: [CommonModule, MbIconComponent],
  template: `
    <button
      type="button"
      (click)="inspect.emit()"
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[var(--mb-surface-soft)] text-[var(--mb-text)] border border-[var(--mb-border)] hover:border-[var(--mb-brand-primary)] text-xs font-semibold transition"
      [attr.aria-label]="'Voir la preuve page ' + pageNumber + ' : ' + label"
    >
      <span aria-hidden="true"><mb-icon name="file-text"></mb-icon></span>
      <span>Rapport p. {{ pageNumber }} — {{ label }}</span>
    </button>
  `
})
export class MbSourceLinkComponent {
  @Input() pageNumber = 1;
  @Input() label = '';
  @Output() inspect = new EventEmitter<void>();
}

// ----------------------------------------------------------------------------
// 5. MbAudioPlayer — Play/Pause, Vitesse, Progression & Transcription intégrale
//    Aucun audio automatique (§8 Accessibilité WCAG 2.2 AA)
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-audio-player',
  standalone: true,
  imports: [CommonModule, MbIconComponent],
  template: `
    <section
      aria-label="Lecteur audio de ta restitution et transcription"
      class="rounded-xl p-6 bg-[var(--mb-brand-navy)] text-white border border-[#5156a0] shadow-card space-y-4"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-[#e7e8fb]">
            Restitution vocale vérifiée (Piper TTS)
          </span>
          <h3 class="text-xl font-bold text-white">{{ title }}</h3>
        </div>

        <!-- Contrôle de vitesse (44x44px min) -->
        <div class="flex items-center gap-1.5" role="group" aria-label="Vitesse de lecture audio">
          <span class="text-xs text-[#e7e8fb] mr-1">Vitesse :</span>
          <button
            *ngFor="let r of [0.85, 1, 1.15]"
            type="button"
            (click)="changeRate.emit(r)"
            [class]="rate === r
              ? 'bg-[var(--mb-brand-primary)] text-white border-white'
              : 'bg-white/10 text-[#e7e8fb] border-white/20 hover:bg-white/20'"
            class="min-h-11 min-w-11 px-3 rounded-md border text-xs font-bold transition"
          >
            {{ r }}x
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          (click)="togglePlay.emit()"
          class="min-h-11 px-6 py-2.5 rounded-full bg-[var(--mb-brand-primary)] hover:bg-[var(--mb-brand-violet)] text-white font-bold text-sm border border-white transition"
        >
          <mb-icon [name]="isPlaying ? 'pause' : 'play'"></mb-icon> {{ isPlaying ? 'Mettre en pause' : 'Écouter mon bilan' }}
        </button>

        <button
          *ngIf="isPlaying"
          type="button"
          (click)="stop.emit()"
          class="min-h-11 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-sm border border-white/30"
        >
          <mb-icon name="square" [filled]="true"></mb-icon> Arrêter
        </button>

        <button
          type="button"
          (click)="showTranscript = !showTranscript"
          [attr.aria-expanded]="showTranscript"
          class="min-h-11 px-4 py-2.5 rounded-md bg-white/10 hover:bg-white/20 text-[#e7e8fb] text-sm font-semibold border border-white/20 ml-auto"
        >
          {{ showTranscript ? 'Masquer la transcription écrite' : 'Afficher la transcription écrite' }}
        </button>
      </div>

      <!-- Fichier WAV natif téléchargeable/écoutable au clavier -->
      <div class="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs text-[#e7e8fb]">Lecteur audio standard (compatible lecteur d'écran) :</span>
        <audio controls preload="none" [src]="audioUrl" class="h-9 w-full sm:w-80"></audio>
      </div>

      <!-- Transcription accessible sans son (§1 Principe 4 & §8) -->
      <div
        *ngIf="showTranscript"
        class="p-4 rounded-lg bg-[#11113a] border border-[#5156a0] text-[#ffffff] space-y-2 max-w-[75ch]"
      >
        <p class="text-xs font-bold uppercase tracking-wider text-[#e7e8fb]">
          Transcription textuelle intégrale :
        </p>
        <p class="text-base leading-relaxed whitespace-pre-line">{{ transcript }}</p>
      </div>
    </section>
  `
})
export class MbAudioPlayerComponent {
  @Input() title = 'Ton bilan expliqué simplement';
  @Input() transcript = '';
  @Input() audioUrl = 'assets/demo-restitution.wav';
  @Input() isPlaying = false;
  @Input() rate = 1;
  @Input() showTranscript = true;
  @Output() togglePlay = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();
  @Output() changeRate = new EventEmitter<number>();
}

// ----------------------------------------------------------------------------
// 6. MbCareerCard — Métier, Zone de préparation, Source, Action Explorer
//    Règle stricte : Jamais « compatibilité garantie » ni classement nouveau
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-career-card',
  standalone: true,
  imports: [CommonModule, MbIconComponent],
  template: `
    <article
      class="rounded-lg p-6 bg-[var(--mb-surface)] border border-[var(--mb-border)] shadow-card flex flex-col justify-between h-full space-y-4"
    >
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="px-3 py-1 rounded-full bg-[var(--mb-surface-soft)] text-[var(--mb-brand-navy)] dark:text-white text-xs font-bold">
            Zone {{ jobZone }} — Préparation : {{ zoneDurationLabel }}
          </span>
          <span class="text-xs font-semibold text-[var(--mb-text-secondary)]">
            <mb-icon name="file-text"></mb-icon> Rapport p. {{ pageNumber }}
          </span>
        </div>

        <h3 class="text-xl font-bold text-[var(--mb-text)]">{{ titleFr }}</h3>
        <p class="text-base text-[var(--mb-text-secondary)] leading-relaxed max-w-[68ch]">
          {{ description }}
        </p>
      </div>

      <div class="pt-4 border-t border-[var(--mb-border)] flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          (click)="toggleBookmark.emit()"
          [class]="isBookmarked
            ? 'bg-[var(--mb-brand-primary)] text-white border-[var(--mb-brand-primary)]'
            : 'bg-[var(--mb-surface)] text-[var(--mb-text)] border-[var(--mb-border)] hover:bg-[var(--mb-surface-soft)]'"
          class="min-h-11 px-4 py-2 rounded-md border text-sm font-semibold transition"
        >
          <mb-icon name="star" [filled]="isBookmarked"></mb-icon> {{ isBookmarked ? 'Piste retenue' : 'Retenir cette piste' }}
        </button>

        <button
          type="button"
          (click)="askQuestion.emit()"
          class="min-h-11 px-3 py-2 rounded-md text-sm font-semibold text-[var(--mb-brand-primary)] hover:bg-[var(--mb-surface-soft)] transition"
        >
          Noter une question →
        </button>
      </div>
    </article>
  `
})
export class MbCareerCardComponent {
  @Input() titleFr = '';
  @Input() description = '';
  @Input() jobZone = 1;
  @Input() zoneDurationLabel = '';
  @Input() pageNumber = 8;
  @Input() isBookmarked = false;
  @Output() toggleBookmark = new EventEmitter<void>();
  @Output() askQuestion = new EventEmitter<void>();
}

// ----------------------------------------------------------------------------
// 7. MbProgress — Étapes nommées du workflow (ne simule jamais un score d'orientation)
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Étapes de validation de la restitution" class="py-2">
      <ol class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <li
          *ngFor="let step of steps; let i = index"
          [class]="i <= activeStepIndex
            ? 'border-[var(--mb-brand-primary)] bg-[var(--mb-surface-soft)] text-[var(--mb-text)]'
            : 'border-[var(--mb-border)] bg-[var(--mb-surface)] text-[var(--mb-text-secondary)]'"
          class="p-3 rounded-md border-2 flex items-center gap-2.5 text-xs font-bold"
        >
          <span
            [class]="i <= activeStepIndex
              ? 'bg-[var(--mb-brand-primary)] text-white'
              : 'bg-[var(--mb-border)] text-[var(--mb-text-secondary)]'"
            class="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-extrabold shrink-0"
          >
            {{ i + 1 }}
          </span>
          <span>{{ step }}</span>
        </li>
      </ol>
    </nav>
  `
})
export class MbProgressComponent {
  @Input() steps: string[] = ['BROUILLON', 'À VÉRIFIER', 'VALIDÉ', 'PUBLIÉ'];
  @Input() activeStepIndex = 0;
}

// ----------------------------------------------------------------------------
// 8. MbEmptyState — États loading, empty, error, unauthorized (§5)
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-empty-state',
  standalone: true,
  imports: [CommonModule, MbIconComponent],
  template: `
    <div
      role="status"
      class="rounded-lg p-8 bg-[var(--mb-surface)] border border-[var(--mb-border)] shadow-card text-center max-w-xl mx-auto my-6 space-y-4"
    >
      <mb-icon [name]="icon" class="text-3xl text-[var(--mb-brand-primary)]"></mb-icon>
      <h3 class="text-xl font-bold text-[var(--mb-text)]">{{ title }}</h3>
      <p class="text-base text-[var(--mb-text-secondary)] leading-relaxed">{{ description }}</p>
      <div *ngIf="actionLabel" class="pt-2">
        <button
          type="button"
          (click)="action.emit()"
          class="min-h-11 px-5 py-2.5 rounded-md bg-[var(--mb-brand-primary)] text-white font-semibold text-sm"
        >
          {{ actionLabel }}
        </button>
      </div>
    </div>
  `
})
export class MbEmptyStateComponent {
  @Input() icon = 'clipboard-list';
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}

// ----------------------------------------------------------------------------
// 9. MbDialog — Modale de confirmation accessible avec gestion du focus
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="open"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="'dialog-title'"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div class="bg-[var(--mb-surface)] border border-[var(--mb-border)] rounded-lg max-w-lg w-full p-6 shadow-card space-y-4">
        <h3 id="dialog-title" class="text-xl font-bold text-[var(--mb-text)]">{{ title }}</h3>
        <p class="text-base text-[var(--mb-text-secondary)]">{{ message }}</p>
        <div class="flex justify-end gap-3 pt-3 border-t border-[var(--mb-border)]">
          <button
            type="button"
            (click)="cancel.emit()"
            class="min-h-11 px-4 py-2 rounded-md border border-[var(--mb-border)] text-[var(--mb-text)] font-semibold text-sm"
          >
            Annuler
          </button>
          <button
            type="button"
            (click)="confirm.emit()"
            class="min-h-11 px-5 py-2 rounded-md bg-[var(--mb-brand-primary)] text-white font-semibold text-sm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class MbDialogComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() message = '';
  @Input() confirmLabel = 'Confirmer';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

// ----------------------------------------------------------------------------
// 10. MbFormField — Libellé toujours visible, aide et message d'erreur associé
// ----------------------------------------------------------------------------
@Component({
  selector: 'mb-form-field',
  standalone: true,
  imports: [CommonModule, MbIconComponent, FormsModule],
  template: `
    <div class="space-y-1.5">
      <label [for]="fieldId" class="block text-sm font-bold text-[var(--mb-text)]">
        {{ label }}
        <span *ngIf="required" class="text-[var(--mb-danger)]" aria-hidden="true">*</span>
      </label>
      <ng-content></ng-content>
      <p *ngIf="hint && !error" class="text-xs text-[var(--mb-text-secondary)]">{{ hint }}</p>
      <p *ngIf="error" role="alert" class="text-xs font-semibold text-[var(--mb-danger)]">
        <mb-icon name="triangle-alert"></mb-icon> {{ error }}
      </p>
    </div>
  `
})
export class MbFormFieldComponent {
  @Input() fieldId = '';
  @Input() label = '';
  @Input() hint?: string;
  @Input() error?: string;
  @Input() required = false;
}
