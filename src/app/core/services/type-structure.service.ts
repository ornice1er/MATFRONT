import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../utils/config-service';

@Injectable({
  providedIn: 'root'
})
export class TypeStructureService {
  constructor(private http:HttpClient) { }
 

  getAll(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("type-structures")}`);
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("type-structures")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    ressource['_method']="patch"
    return this.http.post<any>(`${ConfigService.toApiUrl("type-structures/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("type-structures/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }

  setState(id:number, state:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("type-structures/")}${id}/state/${state}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
