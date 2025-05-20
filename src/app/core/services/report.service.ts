import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
url=ConfigService.toApiUrl("ccsp-reports/");

  constructor(private http:HttpClient) { }

    getAll(type?:any){
    return this.http.get<any[]>(`${this.url}?type=${type}`);
  }

  getPending() {
    return this.http.get<any[]>(`${ConfigService.toApiUrl("ccsp-reports-pending/")}`);
  }
 
  validate(id:any) {
    return this.http.get<any[]>(`${ConfigService.toApiUrl("ccsp-reports-validation/")}${id}`);
  }
 

  store(ressource:any){
    return this.http.post<any>(`${this.url}`, ressource,
      );
  }

  getDataReport(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("ccsp-reports-data")}`, ressource,
      );
  }

  update(id:any,ressource:any){
    ressource['_method']='patch';
    //ressource.append('_method','patch');

    return this.http.post<any>(`${this.url}${id}`, ressource);
  }
  delete(id:any){
    return this.http.delete<any>(`${this.url}${id}`,
      );
  }

  get(id:any){
    return this.http.get<any>(`${this.url}${id}`,
      );
  }

}
