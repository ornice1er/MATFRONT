import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class RdvService {

  constructor(private http:HttpClient) { }
 

  getAll(idEntite:any,seach:any,page:any){
    if(seach==null){
      return this.http.get<any[]>(`${ConfigService.toApiUrl("rdv")}/${idEntite}?page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }else{
    return this.http.get<any[]>(`${ConfigService.toApiUrl("rdv")}/${idEntite}?seach=${seach}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }
  }
  getAllByStructure(idStructure:any,page:any){
      return this.http.get<any[]>(`${ConfigService.toApiUrl("rdv/byStructure")}/${idStructure}?page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  getAllForUsager(idUsager:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("rdv/usager")}/${idUsager}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("rdv/getprofil/")}${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("rdv")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  saveRdvStatut(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("rdv/statut")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("rdv/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("rdv/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
