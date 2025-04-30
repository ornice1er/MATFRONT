import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(private http:HttpClient) { }
 

  getAll(OnlyDirection:any,idEntite:any){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("structure")}/${OnlyDirection}/${idEntite}`);
  }

  getStructureParThematique(idtype:any){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("structurethema")}/${idtype}`);
  }

  getStructurePreocEnAttente(idEntite:any){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("structurePreocc")}/${idEntite}`);
  }

  getPfc(){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("lispfc")}`);
  }
  getLisCommune(id:any){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("liscommune")}/${id}`);
  }
  getLisUsersParCommune(id:any){

    return this.http.get<any[]>(`${ConfigService.toApiUrl("lisuser")}/${id}`);
  }

  getAllStructureByUser(idUser:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("structure/get/sub")}/${idUser}`);
  }
  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("structure/getLine/")}${id}`).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("structure")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("structure/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("structure/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
