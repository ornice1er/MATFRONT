import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }
 

  getAll(idEntite:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getAllEntite(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("ministere")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllAttrib(idEntite:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("attri")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllType(type:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/type")}/${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getServPiece(idSer:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("servicePiece")}/${idSer}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllStatByStrcutre(idEntite:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/prestations-par-structure")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllByStructure(idStructure:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/byStructure")}/${idStructure}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllByCreator(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/byCreator")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getStat(param:any,idEntite: any){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("statistiques/prestations")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  genPdfStat(param:any){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("genererpdfstat")}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  genPdfStatHebdo(param:any){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("genererpdfstathebdo")}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  
  

 

  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("service/getprofil/")}${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }


  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("service")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  savePiece(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("service/savepiece")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("service/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("service/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
