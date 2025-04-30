import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../utils/config-service';

@Injectable({
  providedIn: 'root'
})
export class NatureContractService {
  constructor(private http:HttpClient) { }
 

  getAll(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("nature-contracts")}`, );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("nature-contracts")}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    ressource['_method']="patch"
    return this.http.post<any>(`${ConfigService.toApiUrl("nature-contracts/")}${id}`, ressource,
     ).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("nature-contracts/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }

  setState(id:number, state:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("nature-contracts/")}${id}/state/${state}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
