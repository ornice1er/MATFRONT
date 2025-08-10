import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }


  /**
   * @deprecated Renommée en getAllSettings(). Gardée pour référence.
   * Récupère TOUS les paramètres. Utilisé par d'autres parties de l'application.
   */
  get() {
    return this.http.get<any[]>(`${ConfigService.toApiUrl('settings')}`);
  }


 
  /**
   * Récupère les paramètres spécifiques à UNE SEULE entité.
   * @param idEntite L'ID de l'entité.
   */
  getSettingsByEntity(idEntite: any) {
    return this.http.get<any>(`${ConfigService.toApiUrl(`settings/${idEntite}`)}`);
  }

  /**
   * Crée de nouveaux paramètres.
   * @param settings L'objet contenant les données des paramètres.
   */
  create(settings: any) {
    // La route est 'settings/store' comme demandé
    return this.http.post<any>(`${ConfigService.toApiUrl("settings/store")}`, settings,
      ConfigService.httpHeader(localStorage.getItem("mataccueilToken"))).pipe( // Le 'true' pour FormData n'est plus nécessaire
        tap((res: any) => console.log(`Paramètres créés`, res))
      );
  }

  /**
   * @param id L'ID des paramètres à mettre à jour.
   * @param settings L'objet contenant les données des paramètres.
   */
  update(id: any, settings: any) {
    // On ajoute '_method' directement à l'objet
    const payload = { ...settings, '_method': 'patch' };

    return this.http.post<any>(`${ConfigService.toApiUrl(`settings/${id}`)}`, payload,
      ConfigService.httpHeader(localStorage.getItem("mataccueilToken"))).pipe(
        tap((res: any) => console.log(`Paramètres mis à jour`, res))
      );
  }
}