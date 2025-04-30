import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class UsagerService {

  constructor(private http:HttpClient) { }
 

  getAll(search:any,page:any){
    if(search==null){
      return this.http.get<any[]>(`${ConfigService.toApiUrl("usager")}?page=${page}`);
    }else{
      return this.http.get<any[]>(`${ConfigService.toApiUrl("usager")}?search=${search}&page=${page}`);
      
    }
    
  }
  getAllSuggestion(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("suggestion")}`);
  }
  getAllDenonciation(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("denonciation")}`);
  }
  getAllDepartement(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("departement")}`);
  }
  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("usager/getprofil/")}${id}`).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("usager")}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("usager/")}${id}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("usager/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }


  getToken(uuid:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("usager/get-token")}`, uuid);
  }
}
