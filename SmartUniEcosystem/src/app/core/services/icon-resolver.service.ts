import { Injectable } from '@angular/core';

export type DynamicActionType =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'outline'
  | 'ghost'
  | 'success';
export type DynamicActionSize = 'sm' | 'md' | 'lg';

export interface DynamicAction {
  label: string;
  icon?: string;
  type?: DynamicActionType;
  size?: DynamicActionSize;
  route?: string;
  externalUrl?: string;
  tooltip?: string;
  disabled?: boolean;
  ariaLabel?: string;
  iconPosition?: 'left' | 'right';
}

@Injectable({
  providedIn: 'root',
})
export class IconResolverService {
  resolveIcon(iconName?: string): string {
    const icons: Record<string, string> = {
      'arrow-right':
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      check:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
      'external-link':
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      download:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
      edit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    };
    return icons[iconName ?? 'arrow-right'] ?? this.getFallbackIcon();
  }

  resolveButtonType(type?: string): DynamicActionType {
    return type === 'primary' ||
      type === 'danger' ||
      type === 'outline' ||
      type === 'ghost' ||
      type === 'success'
      ? type
      : 'secondary';
  }

  getFallbackIcon(): string {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  }
}
