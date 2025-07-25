import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // private _activeSection = signal('accueil');
  // private _sidebarOpen = signal(true);
  private _expandedMenus = signal<Set<string>>(new Set());

  // get activeSection() {
  //   return this._activeSection.asReadonly();
  // }

  // get sidebarOpen() {
  //   return this._sidebarOpen.asReadonly();
  // }

  get expandedMenus() {
    return this._expandedMenus.asReadonly();
  }

  // setActiveSection(section: string) {
  //   this._activeSection.set(section);
  // }

  // toggleSidebar() {
  //   this._sidebarOpen.update(open => !open);
  // }

  toggleSubmenu(menuId: string) {
    this._expandedMenus.update(expanded => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(menuId)) {
        newExpanded.delete(menuId);
      } else {
        newExpanded.add(menuId);
      }
      return newExpanded;
    });
  }
}
