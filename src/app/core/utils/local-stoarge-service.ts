import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class LocalStorageService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    
    set(key: string, value: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    get(key: string) {
        let el:any=""
        if (isPlatformBrowser(this.platformId)) {
             el=localStorage.getItem(key)
             return el !=null ? JSON.parse(el):null;

         }

         return null
    }

    remove(key: string) {
        if (isPlatformBrowser(this.platformId)) {

        localStorage.removeItem(key);
        }
    }
}