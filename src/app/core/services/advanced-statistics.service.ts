import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';

@Injectable({
  providedIn: 'root'
})
export class AdvancedStatisticsService {
  constructor(private http:HttpClient) { }
 

  getTogetherViews(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-together-views")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getTogetherViews2(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-together-views2")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getPerformances(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-performances")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  getPerformancesVisits(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-performances-visists")}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  printView(resource:any){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("print-view")}`,resource, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
}
