import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor(private http:HttpClient) { }
 

  getAll(idEntite:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("type")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("type/getLine/")}${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("type")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("type/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("type/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
