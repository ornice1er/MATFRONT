import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class EtapeService {

  constructor(private http:HttpClient) { }
 

  getAll(idEntite:any){
    //  ok
    return this.http.get<any[]>(`${ConfigService.toApiUrl("etape")}/${idEntite}`);
  }
  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("etape/getprofil/")}${id}`, ).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("etape")}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("etape/")}${id}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("etape/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
