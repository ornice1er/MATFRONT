import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }
 

  getAll(idEntite){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getAllEntite(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("ministere")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllAttrib(idEntite){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("attri")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllType(type){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/type")}/${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getServPiece(idSer){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("servicePiece")}/${idSer}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllStatByStrcutre(idEntite){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/prestations-par-structure")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllByStructure(idStructure){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/byStructure")}/${idStructure}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllByCreator(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/byCreator")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getStat(param,idEntite){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("statistiques/prestations")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  genPdfStat(param){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("genererpdfstat")}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  genPdfStatHebdo(param){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("genererpdfstathebdo")}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  
  

 

  get(id){
    return this.http.get<any>(`${ConfigService.toApiUrl("service/getprofil/")}${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }


  create(ressource){
    return this.http.post<any>(`${ConfigService.toApiUrl("service")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  savePiece(ressource){
    return this.http.post<any>(`${ConfigService.toApiUrl("service/savepiece")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  
  update(ressource,id){
    return this.http.post<any>(`${ConfigService.toApiUrl("service/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("service/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
