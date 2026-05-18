import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  animations: [
    trigger('themeAnimation', [
      state('light', style({ transform: 'rotate(0deg) scale(1)', opacity: 1 })),
      state('dark', style({ transform: 'rotate(180deg) scale(1)', opacity: 1 })),
      transition('light <=> dark', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
