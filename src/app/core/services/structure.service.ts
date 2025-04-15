import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(private http:HttpClient) { }
 

  getAll(OnlyDirection,idEntite){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("structure")}/${OnlyDirection}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getStructureParThematique(idtype){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("structurethema")}/${idtype}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getStructurePreocEnAttente(idEntite){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("structurePreocc")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getPfc(){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("lispfc")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getLisCommune(id){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("liscommune")}/${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getLisUsersParCommune(id){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("lisuser")}/${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getAllStructureByUser(idUser){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("structure/get/sub")}/${idUser}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  get(id){
    return this.http.get<any>(`${ConfigService.toApiUrl("structure/getLine/")}${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource){
    return this.http.post<any>(`${ConfigService.toApiUrl("structure")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource,id){
    return this.http.post<any>(`${ConfigService.toApiUrl("structure/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("structure/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
