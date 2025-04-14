import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';

@Injectable({
  providedIn: 'root'
})
export class DashService {

  url=ConfigService.toApiUrl("dash/");

  constructor(private http:HttpClient) { }

  
  getDash(){
    return this.http.get<any>(`${this.url}`,
     ConfigService.addAction('list'));
  }
}
