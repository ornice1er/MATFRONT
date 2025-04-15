import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../utils/config-service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http:HttpClient) { }

  get(){
  
    return this.http.get<any[]>(`${ConfigService.toApiUrl("settings")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  create(ressource){
    console.log(ressource)

    return this.http.post<any>(`${ConfigService.toApiUrl("settings")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  update(id,ressource){
    ressource['_method']="patch"
    return this.http.post<any>(`${ConfigService.toApiUrl("settings")}/${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
}
