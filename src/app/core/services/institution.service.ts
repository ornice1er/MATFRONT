import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  constructor(private http:HttpClient) { }
 

  getAll(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("institution")}`, );
  }

  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("institution/")}${id}`, ).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("institution")}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
      );
    }
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("institution/")}${id}`, ressource,
    ).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
      );
  }
  delete(id:any){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("institution/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
  // -- Relance 

  getAll_Relance(id:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("relanceconfig")}/${id}`, );
  }
  getLisUsersParEntite(id:any){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("lisuserRelance")}/${id}`, );
  }
  createRelance(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("relanceconfig")}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
      );
    }
    
  getAllEntite(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("allministere")}`, );
  }
  updateRelance(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("relanceconfig/")}${id}`, ressource,
    ).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
      );
  }
  deleteRelance(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("relanceconfig/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
