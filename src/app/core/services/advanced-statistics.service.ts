import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';

@Injectable({
  providedIn: 'root'
})
export class AdvancedStatisticsService {
  constructor(private http:HttpClient) { }
 

  getTogetherViews(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-together-views")}`);
  }

  getTogetherViews2(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-together-views2")}`);
  }
  getPerformances(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-performances")}`);
  }
  
  getPerformancesVisits(){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-performances-visists")}`);
  }
  
  getStats(){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("get-advanced-stats")}`);
  }
  
  printView(resource:any){
   
    return this.http.post<any[]>(`${ConfigService.toApiUrl("print-view")}`,resource, );
  }
  
}
