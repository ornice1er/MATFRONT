import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { catchError, tap, map } from 'rxjs/operators';
import { Roles } from '../_models/roles';
 


@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  url=ConfigService.toApiUrl("utilisateur");
  url_act=ConfigService.toApiUrl("acteurcom");
  constructor(private http:HttpClient) { }
 

  getAllMain(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("utilisateurs/all/main")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAll(idEntite){
   
    return this.http.get<any[]>(`${this.url}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllActeur(idEntite){
    return this.http.get<any[]>(`${this.url_act}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  get(id){
   
    return this.http.get<any[]>(`${this.url}/${id}/`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  update_last_logout(id){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("user_last_logout")}/${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
 

  create(ressource){
    return this.http.post<any>(ConfigService.toApiUrl("utilisateur"), ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  soumettreSuggest(ressource){
    return this.http.post<any>(ConfigService.toApiUrl("requetecomment/transmettre"), ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  
  update(ressource,id){
    return this.http.post<any>(`${this.url}/${id}`, ressource,  ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`updated ressource ${ressource}`))
    );
  }
  updateProfil(ressource){
    return this.http.post<any>(`${ConfigService.toApiUrl("utilisateur/profil/update")}`, ressource,  ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`updated ressource ${ressource}`))
    );
  }

  

  set_password(ressource,id){
    return this.http.patch<any>(`${this.url}${id}/set_password/`, ressource,  ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`updated ressource ${ressource}`))
    );
  }
  
  delete(id:number){
    return this.http.delete<any[]>(`${this.url}/${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

 
  change_password(value){
    return this.http.put<any[]>(`${this.url}/change/password`,value,ConfigService.httpHeader());
  }

  setState(id:any,state:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("users-set-state")}/${id}/state/${state}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
}
