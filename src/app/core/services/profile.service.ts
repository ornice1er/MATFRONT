import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  url = ConfigService.toApiUrl('profile');

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(this.url, ConfigService.addAction('list'));
  }

  store(ressource: object) {
    return this.http.post(this.url, ressource,ConfigService.addAction('add'));
  }

  copyStore(ressource: object) {
    return this.http.post(this.url+'-copy', ressource,ConfigService.addAction('add'));
  }
  show(id: number) {
    return this.http.get(`${this.url}/${id}`, ConfigService.addAction('show'));
  }
  update(ressource: object, id: number) {
    return this.http.patch(`${this.url}/${id}`, ressource, ConfigService.addAction('edit'));
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, ConfigService.addAction('delete'));
  }
  state(id: number) {
    return this.http.get(`${this.url}/${id}/status`, ConfigService.addAction('status'));
  }

}
