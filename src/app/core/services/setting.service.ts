import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }



  get() {
    return this.http.get<any[]>(`${ConfigService.toApiUrl('settings')}`);
  }


 

  getSettingsByEntity(idEntite: any) {
    return this.http.get<any>(`${ConfigService.toApiUrl(`settings/${idEntite}`)}`);
  }

  create(settings: any) {
    return this.http.post<any>(`${ConfigService.toApiUrl("settings/store")}`, settings,
      ConfigService.httpHeader(localStorage.getItem("mataccueilToken"))).pipe( 
        tap((res: any) => console.log(`Paramètres créés`, res))
      );
  }

  
  update(id: any, settings: any) {
    const payload = { ...settings, '_method': 'patch' };

    return this.http.post<any>(`${ConfigService.toApiUrl(`settings/${id}`)}`, payload,
      ConfigService.httpHeader(localStorage.getItem("mataccueilToken"))).pipe(
        tap((res: any) => console.log(`Paramètres mis à jour`, res))
      );
  }
  getPointDeChuteSettings() {
    return this.http.get<any>(`${ConfigService.toApiUrl('settings2')}`);
  }
  updatePointDeChuteSettings(id: any, data: any) {
    return this.http.put<any>(`${ConfigService.toApiUrl(`settings/${id}`)}`, data,
      ConfigService.httpHeader(localStorage.getItem("mataccueilToken"))
    );
  }
}