import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(private http:HttpClient) { }
 

  getAllMain(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("profil")}/main`, );
  }

  getAll(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("profil")}`, );
  }
  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("profil/getprofil/")}${id}`, ).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    
    return this.http.post<any>(`${ConfigService.toApiUrl("profil")}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("profil/")}${id}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("profil/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }  

  addGuideUser(param:any,id:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("profilGuide")}/${id}`,param, );
  }
}
