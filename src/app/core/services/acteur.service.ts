import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class ActeurService {

  constructor(private http:HttpClient) { }
 

  getAll(idEntite:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("acteur")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getAllDepart(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("departement")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getAllCommune(idDepar:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("commune")}/${idDepar}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("acteur/getprofil/")}${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  Recup_Stat_E_Service(ressource:any){
    return this.http.post<any>(`https://api.managemtfp.gouv.bj/api/e-services/stats`, ressource,
    {headers: new HttpHeaders({'Authorization': 'Basic ' + btoa('adminmtfp@gouv.bj:123')})}).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
    // return this.http.post<any>(`https://api.sollicitation.hebergeappli.bj/api/e-services/stats`, ressource,
    // {headers: new HttpHeaders({'Authorization': 'Basic ' + btoa('adminmtfp@gouv.bj:123')})}).pipe(
    //   tap((ressource: any) => console.log(`added ressource ${ressource}`))
    // );
  }

  getAllConnection(idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("acteur_stat")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }


  createGra(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("acteur")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  createAttri(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("attri")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("acteur/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  updateAttri(ressource:any,id:any){
    
    return this.http.post<any>(`${ConfigService.toApiUrl("attri/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("acteur/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
