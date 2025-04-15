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
  }
  get(id){
    return this.http.get<any>(`${ConfigService.toApiUrl("userPermissions/")}${id}`).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource){
    return this.http.post<any>(`${ConfigService.toApiUrl("userPermissions/")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource,id){
    return this.http.post<any>(`${ConfigService.toApiUrl("userPermissions/")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number,user_id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("deletePermissions/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
