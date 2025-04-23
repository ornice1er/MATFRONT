import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

    constructor(private http:HttpClient) { }
  
 get(){
  
    return this.http.get<any[]>(`${ConfigService.toApiUrl("settings")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  create(ressource:any){
    console.log(ressource)

    return this.http.post<any>(`${ConfigService.toApiUrl("settings")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  update(id:any,ressource:any){
    ressource['_method']="patch"
    return this.http.post<any>(`${ConfigService.toApiUrl("settings")}/${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
}
