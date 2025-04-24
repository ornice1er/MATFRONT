import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, from, map, Observable, of, Subject } from 'rxjs';
// $import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../utils/config-service';
import { LocalStorageService } from '../utils/local-stoarge-service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  url=ConfigService.toApiUrl("auth");
  userLoggedInData = new Subject<any>();
  constructor(private http: HttpClient, private localStorageService:LocalStorageService) {
  }

  GetPath(name:any) {
    return ConfigService.toFile('public/Usager-mail/'+name);
  }
  setUserData(data:any) {
    this.userLoggedInData.next(data);
    console.log(data)
  }

  getUserLoggedInData(): Observable<any> {
    return this.userLoggedInData.asObservable();
  }

  isLoggedIn(){
    return true;
  }
  // Authentication/Authorization
  login(value:any) {
    console.log('value',value)
    return this.http.post(`${this.url}`, value);
  }
  loginUsager(value:any) {

    return this.http.post(`${ConfigService.toApiUrl("authusager")}`, value);
  }
  
  
  getUserSinceGuv(key:any,value:any){
    const userToken = this.localStorageService.get('auth/userdata');
     //return this.http.get(`http://localhost:8001/api/user/data?key=${key}&value=${value}`, ConfigService.httpHeader(this.localStorageService.get("mataccueilToken"),true));
    // return this.http.get(`http://api.guv.sevmtfp.test/api/user/data?key=${key}&value=${value}`, ConfigService.httpHeader(this.localStorageService.get("mataccueilToken"),true));
    return this.http.get(`https://back.guvmtfp.gouv.bj/api/user/data?key=${key}&value=${value}`, ConfigService.httpHeader(this.localStorageService.get("mataccueilToken"),true));
  }

  getUserByToken(){
    const userToken = this.localStorageService.get('auth/userdata');
    return this.http.get(`${ConfigService.toApiUrl('auth/userdata')}`);
  }
  loginV2(code:any): Observable<any> {

    var formData=new FormData()
    formData.append("code",code)
    return this.http.post(`${ConfigService.toApiUrl("auth-me")}`, formData);
  }

  register(user: any): Observable<any> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.url}`, user, {headers: httpHeaders})
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /*
   * Submit forgot password request
   *
   * @param {string} email
   * @returns {Observable<any>}
   */
  public forgotPassword(email: string): Observable<any> {
    return this.http.post(`${ConfigService.toApiUrl("password_reset/")}`,{email:email})
      .pipe(catchError(this.handleError('forgot-password', []))
      );
  }
  public resetPassword(password: string,token:string): Observable<any> {
    return this.http.post(`${ConfigService.toApiUrl("password_reset/confirm/")}`,{password:password,token:token})
      .pipe(catchError(this.handleError('forgot-password', []))
      );
  }

   /*
   * Handle Http operation that failed.
   * Let the app continue.
    *
  * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }


  logout(){
    return this.http.get<any>(`${this.url}`);
  }

}
