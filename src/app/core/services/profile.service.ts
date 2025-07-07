import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  url = ConfigService.toApiUrl('profiles');

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(this.url, ConfigService.addAction('LISTER'));
  }

  store(ressource: object) {
    return this.http.post(this.url, ressource,ConfigService.addAction('CREER'));
  }

  copyStore(ressource: object) {
    return this.http.post(this.url+'-copy', ressource,ConfigService.addAction('CREER'));
  }
  show(id: number) {
    return this.http.get(`${this.url}/${id}`, ConfigService.addAction('RECUPERER'));
  }
  update(ressource: object, id: number) {
    return this.http.patch(`${this.url}/${id}`, ressource, ConfigService.addAction('MODIFIER'));
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, ConfigService.addAction('SUPPRIMER'));
  }
  state(id: number) {
    return this.http.get(`${this.url}/${id}/status`, ConfigService.addAction('CHANGER_STATUT'));
  }
  setStatus(id:any,status:any){
      return this.http.get<any>(`${this.url}${id}/state/${status}`,
       ConfigService.addAction('CHANGER_STATUT'));
    }
}
