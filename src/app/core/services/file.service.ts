import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http:HttpClient) { }

  
  get(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("get-file")}`, ressource,
     ConfigService.addAction('list'));
  }
  get2(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("get-file2")}`, ressource,
     ConfigService.addAction('list'));
  }
}
