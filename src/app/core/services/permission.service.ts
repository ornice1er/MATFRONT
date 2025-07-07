import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  url=ConfigService.toApiUrl("permissions/");
  constructor(private http:HttpClient) { }
 

  getAll(){
   

    return this.http.get<any[]>(`${this.url}`,ConfigService.httpHeader());
    console.log("get all permissions" );
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
