import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';

@Injectable({
  providedIn: 'root'
})
export class UserSettingService {
  url=ConfigService.toApiUrl("user-settings/");

  constructor(private http:HttpClient) { }

    getAll(){
    return this.http.get<any[]>(`${this.url}`,ConfigService.addAction('list'));
  }
 
  getByState(state:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("user-settings-by-state")}/${state}`,ConfigService.addAction('list'));
  }

  store(ressource:any){
    return this.http.post<any>(`${this.url}`, ressource,
     ConfigService.addAction('add'));
  }

  update(id:any,ressource:any){
    ressource['_method']='patch';
    //ressource.append('_method','patch');

    return this.http.post<any>(`${this.url}${id}`, ressource,  ConfigService.addAction('edit'));
  }
  delete(id:any){
    return this.http.delete<any>(`${this.url}${id}`,
     ConfigService.addAction('delete'));
  }

  get(id:any){
    return this.http.get<any>(`${this.url}${id}`,
     ConfigService.addAction('show'));
  }

  setState(id:any,state:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("user-settings-set-state")}/${id}/state/${state}`,ConfigService.addAction('status'));
  }
}
