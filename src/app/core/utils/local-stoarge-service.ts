import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  set(key: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  get(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      const el = localStorage.getItem(key);
      if (el == null) return null;
      try {
        return JSON.parse(el);
      } catch {
        // Valeur corrompue (ex. JWT stocké sans JSON.stringify) → on purge et on retourne null
        localStorage.removeItem(key);
        return null;
      }
    }
    return null;
  }

  remove(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clear() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
}
