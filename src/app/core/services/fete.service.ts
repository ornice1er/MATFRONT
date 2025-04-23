import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';

@Injectable({
  providedIn: 'root'
})
export class FeteService {

  url=ConfigService.toApiUrl("fetes/");

  constructor(private http:HttpClient) { }

    getAll(){
    return this.http.get<any[]>(`${this.url}`,ConfigService.addAction('list'));
  }

  store(ressource:any){
    return this.http.post<any>(`${this.url}`, ressource,
     ConfigService.addAction('add'));
  }
  verifyLink(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("fetes-verify")}`, ressource,
     ConfigService.addAction('add'));
  }
  partipate(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("fetes-participate")}`, ressource,
     ConfigService.addAction('add'));
  }

  update(id:any,ressource:any){
    //ressource['method']='_patch';
    ressource.append('_method','patch')
    return this.http.post<any>(`${this.url}${id}/`, ressource,  ConfigService.addAction('list'));
  }
  generateLink(id:any,ressource:any){
    //ressource['method']='_patch';

    return this.http.post<any>(`${ConfigService.toApiUrl("fetes-generate-link")}/${id}`, ressource,  ConfigService.addAction('list'));
  }
  delete(id:any){
   // ressource['method']='delete';
    return this.http.delete<any>(`${this.url}${id}`,
     ConfigService.addAction('delete'));
  }

  get(id:any){
    return this.http.get<any>(`${this.url}${id}`,
     ConfigService.addAction('show'));
  }
  generateMediaLink(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("fetes-generate-media-link")}/${id}`,
     ConfigService.addAction('show'));
  }
  setState(id:any,state:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("fetes")}/${id}/state/${state}`,
     ConfigService.addAction('show'));
  }
}
