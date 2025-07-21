import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistreService {
url=ConfigService.toApiUrl('');

  constructor(private http: HttpClient) { }

getAll(startDate: string, endDate: string, sex?: string, commune_id?: string[], page: number = 1): Observable<any[]> {
    let url = `${this.url}registre?startDate=${startDate}&endDate=${endDate}&page=${page}`;
    if (sex && sex !== 'all') url += `&sex=${sex}`;
    if (commune_id && commune_id.length > 0 && commune_id[0] !== 'all') {
      url += `&commune_id=${commune_id.join(',')}`;
    }
    return this.http.get<any[]>(url);
  }

  // getStats(resource:any){
  //   return this.http.post<any[]>(`${this.url}registres-reports-stats`,resource);
  // }
  getStats(resource:any){
    return this.http.post<any>(`${this.url}requeteByCom`,resource);
  }

  getStats2(resource:any){
    return this.http.post<any>(`${this.url}registres-reports-stats-comparaison`,resource);
  }
getCommunesByDept(userId: string) {
    return this.http.get<any[]>(`${this.url}getComByDept/${userId}`);
  }
  

}
