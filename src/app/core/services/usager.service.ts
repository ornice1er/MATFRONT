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
      return this.http.get<any[]>(`${ConfigService.toApiUrl("usager")}?page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }else{
      return this.http.get<any[]>(`${ConfigService.toApiUrl("usager")}?search=${search}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      
    }
    
  }
  getAllSuggestion(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("suggestion")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllDenonciation(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("denonciation")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllDepartement(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("departement")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  get(id){
    return this.http.get<any>(`${ConfigService.toApiUrl("usager/getprofil/")}${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource){
    return this.http.post<any>(`${ConfigService.toApiUrl("usager")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource,id){
    return this.http.post<any>(`${ConfigService.toApiUrl("usager/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("usager/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
