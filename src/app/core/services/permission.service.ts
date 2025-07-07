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
   
    return this.http.get<any[]>(`${this.url}`,ConfigService.httpHeader());
  }

  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("userPermissions/")}${id}`).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("userPermissions/")}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("userPermissions/")}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number,user_id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("deletePermissions/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
