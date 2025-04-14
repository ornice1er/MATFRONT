import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url=ConfigService.toApiUrl("notifications/");

  constructor(private http:HttpClient) { }

    getAll(){
    return this.http.get<any[]>(`${this.url}`,ConfigService.addAction('recup'));
  }
 
  getByState(state:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("notifications-by-state")}/${state}`,ConfigService.addAction('list'));
  }

  getStudents(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("notifications-students")}`,ConfigService.addAction('list'));
  }
  updateAccount(id:any,resource:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("notifications-account-update")}/${id}`,resource,ConfigService.addAction('list'));
  }


  store(ressource:any){
    return this.http.post<any>(`${this.url}`, ressource,
     ConfigService.addAction('add'));
  }

  update(id:any,ressource:any){
    ressource['_method']='patch';
    //ressource.append('_method','patch');

    return this.http.post<any>(`${this.url}${id}`, ressource,  ConfigService.addAction('edit'));
  }
  delete(id:any){
    return this.http.delete<any>(`${this.url}${id}`,
     ConfigService.addAction('delete'));
  }

  get(id:any){
    return this.http.get<any>(`${this.url}${id}`,
     ConfigService.addAction('show'));
  }

  setState(id:any,state:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("notifications-set-state")}/${id}/state/${state}`,ConfigService.addAction('status'));
  }
}
