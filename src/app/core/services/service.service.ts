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
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service")}/${idEntite}`);
  }

  getAllEntite(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("ministere")}`);
  }
  getAllAttrib(idEntite:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("attri")}/${idEntite}`);
  }
  getAllType(type:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/type")}/${type}`);
  }
  getServPiece(idSer:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("servicePiece")}/${idSer}`);
  }
  getAllStatByStrcutre(idEntite:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/prestations-par-structure")}/${idEntite}`);
  }
  getAllByStructure(idStructure:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/byStructure")}/${idStructure}`);
  }
  getAllByCreator(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("service/byCreator")}`);
  }
  getStat(param:any,idEntite: any){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("statistiques/prestations")}/${idEntite}`,param);
  }
  genPdfStat(param:any){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("genererpdfstat")}`,param);
  }
  
  genPdfStatHebdo(param:any){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("genererpdfstathebdo")}`,param);
  }
  
  
  

 

  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("service/getprofil/")}${id}`).pipe(
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
