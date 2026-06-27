import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeState = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = signal<ThemeState>('light');
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.initTheme();
    }
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('theme') as ThemeState | null;

    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.currentTheme.set(savedTheme);
      this.applyTheme(savedTheme);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      this.currentTheme.set(systemTheme);
      this.applyTheme(systemTheme);
    }
  }

  toggleTheme() {
    this.currentTheme.update((theme) => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      if (this.isBrowser) {
        localStorage.setItem('theme', newTheme);
        this.applyTheme(newTheme);
      }
      return newTheme;
    });
  }

  private applyTheme(theme: ThemeState) {
    if (this.isBrowser) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }
}
