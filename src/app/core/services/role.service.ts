import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  url=ConfigService.toApiUrl("roles/");

  constructor(private http:HttpClient) { }

    getAll(){
    return this.http.get<any[]>(`${this.url}`,ConfigService.addAction('LISTER'));
  }

  store(ressource:any){
    return this.http.post<any>(`${this.url}`, ressource,
     ConfigService.addAction('CREER'));
  }

  update(id:any,ressource:any){
    //ressource['method']='_patch';

    return this.http.put<any>(`${this.url}${id}/`, ressource,  ConfigService.addAction('LISTER'));
  }
  delete(id:any){
   // ressource['method']='SUPPRIMER';
    return this.http.delete<any>(`${this.url}${id}`,
     ConfigService.addAction('SUPPRIMER'));
  }

  get(id:any){
    return this.http.get<any>(`${this.url}${id}`,
     ConfigService.addAction('RECUPERER'));
  }
  copy(resource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("roles-windows-copy")}`,resource,
     ConfigService.addAction('RECUPERER'));
  }
   setStatus(id:any,status:any){
      return this.http.get<any>(`${this.url}${id}/state/${status}`,
       ConfigService.addAction('CHANGER_STATUT'));
    }
  
}
