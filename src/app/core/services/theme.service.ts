import { Injectable, effect, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  darkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('finance-flow-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (saved) {
        this.darkMode.set(saved === 'dark');
      } else {
        this.darkMode.set(prefersDark);
      }

      effect(() => {
        const isDark = this.darkMode();
        const html = document.documentElement;

        if (isDark) {
          html.classList.add('dark');
          localStorage.setItem('finance-flow-theme', 'dark');
        } else {
          html.classList.remove('dark');
          localStorage.setItem('finance-flow-theme', 'light');
        }
      });
    }
  }

  toggle() {
    this.darkMode.update((v) => !v);
  }
}
