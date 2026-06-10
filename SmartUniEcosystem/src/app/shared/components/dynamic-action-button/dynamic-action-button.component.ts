import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DynamicAction, IconResolverService } from '../../../core/services/icon-resolver.service';

@Component({
  selector: 'app-dynamic-action-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container *ngIf="action">
      <a *ngIf="action.externalUrl && !action.route"
         [href]="action.externalUrl"
         target="_blank"
         rel="noreferrer"
         [attr.title]="action.tooltip"
         [attr.aria-label]="action.ariaLabel || action.label"
         [ngClass]="buttonClasses"
         class="dynamic-action-button inline-flex items-center justify-center gap-2 transition-all"
         >
        <ng-container *ngIf="hasIcon && iconPosition === 'left'">
          <span [innerHTML]="iconSvg"></span>
        </ng-container>
        <span>{{ action.label }}</span>
        <ng-container *ngIf="hasIcon && iconPosition === 'right'">
          <span [innerHTML]="iconSvg"></span>
        </ng-container>
      </a>

      <button *ngIf="!action.externalUrl || action.route"
              type="button"
              [routerLink]="action.route"
              [disabled]="action.disabled"
              [attr.title]="action.tooltip"
              [attr.aria-label]="action.ariaLabel || action.label"
              [ngClass]="buttonClasses"
              class="dynamic-action-button inline-flex items-center justify-center gap-2 transition-all"
              (click)="handleClick($event)">
        <ng-container *ngIf="hasIcon && iconPosition === 'left'">
          <span [innerHTML]="iconSvg"></span>
        </ng-container>
        <span>{{ action.label }}</span>
        <ng-container *ngIf="hasIcon && iconPosition === 'right'">
          <span [innerHTML]="iconSvg"></span>
        </ng-container>
      </button>
    </ng-container>
  `,
  styles: [
    `
      .dynamic-action-button {
        border-radius: 9999px;
        font-weight: 700;
        white-space: nowrap;
      }

      .dynamic-action-button svg {
        width: 1em;
        height: 1em;
        stroke-width: 2px;
      }

      .dynamic-action-button.disabled,
      .dynamic-action-button[disabled] {
        opacity: 0.55;
        cursor: not-allowed;
      }
    `
  ]
})
export class DynamicActionButtonComponent {
  @Input() action?: DynamicAction | any;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Output() clicked = new EventEmitter<Event>();

  private router = inject(Router);
  private iconResolver = inject(IconResolverService);

  get hasIcon(): boolean {
    return !!this.action?.icon;
  }

  get buttonClasses(): string {
    const type = this.iconResolver.resolveButtonType(this.action?.type);
    const size = this.action?.size ?? 'md';
    const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950';
    const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-5 py-2.5 text-base' : 'px-4 py-2 text-sm';
    const typeClass = {
      primary: 'bg-mit-red text-white hover:bg-primary-700 dark:bg-mit-red dark:hover:bg-red-700',
      danger: 'bg-rose-600 text-white hover:bg-rose-700',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700',
      outline: 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
      ghost: 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900',
      secondary: 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800'
    }[type];

    return [base, sizeClass, typeClass, this.action?.disabled ? 'opacity-60 cursor-not-allowed' : ''].filter(Boolean).join(' ');
  }

  get iconSvg(): string {
    return this.iconResolver.resolveIcon(this.action?.icon);
  }

  handleClick(event: Event) {
    if (this.action?.disabled) {
      event.preventDefault();
      return;
    }

    if (this.action?.externalUrl && !this.action?.route) {
      return;
    }

    this.clicked.emit(event);
  }
}
