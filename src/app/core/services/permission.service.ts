import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';
import { LocalStorageService } from '../utils/local-stoarge-service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  url=ConfigService.toApiUrl("permissions/");
  permissions:any[]=[]

  constructor(private http:HttpClient,    private lsService:LocalStorageService
  ) { }

    getAll(){
    return this.http.get<any[]>(`${this.url}`,ConfigService.addAction('LISTER'));
  }

  store(ressource:any){
    return this.http.post<any>(`${this.url}`, ressource,
     ConfigService.addAction('CREER'));
  }

  update(id:any,ressource:any){
    ressource['_method']='patch';

    return this.http.post<any>(`${this.url}${id}/`, ressource,  ConfigService.addAction('MODIFIER'));
  }
  delete(id:any){
   // ressource['method']='SUPPRIMER';
    return this.http.delete<any>(`${this.url}${id}`,
     ConfigService.addAction('SUPPRIMER'));
  }

  get(id:any){
    return this.http.get<any>(`${this.url}`,
     ConfigService.addAction('RECUPERER'));
  }

     setStatus(id:any,status:any){
      return this.http.get<any>(`${this.url}${id}/state/${status}`,
       ConfigService.addAction('CHANGER_STATUT'));
    }

  canShow(tags: string[], action = 'LISTER'): boolean {
    this.permissions=this.lsService.get(GlobalName.userName)?.roles[0]?.permissions;
    return tags.some(tag =>
      this.permissions.some(p => p.name === `${action} ${tag}`)
    );
  }
}
