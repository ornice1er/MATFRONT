import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';
import { LocalStorageService } from '../utils/local-stoarge-service';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url :string =ConfigService.toApiUrl("logout");
  url2 :string =ConfigService.toFile('');

  constructor(private appLocalStorage: LocalStorageService, private http:HttpClient) { }


  getJWTToken(){
    return this.appLocalStorage.get(GlobalName.tokenName)
  }
  setJWTToken(token:any){
    return this.appLocalStorage.set(GlobalName.tokenName,token)
  }
  setJWTRefreshToken(token:any){
    return this.appLocalStorage.set(GlobalName.refreshTokenName,token)
  }

  me(){
    return this.http.get<any>(`${this.url2}api/user`);
  }

  login(ressource:any){

    /*ressource['grant_type']=LoginParamProd.grantType;
    ressource['client_id']=LoginParamProd.clientId;
    ressource['client_secret']=LoginParamProd.clientSecret;
    ressource['scope']=LoginParamProd.scope;*/

    return this.http.post<any>(`${this.url2}api/login`, ressource);
  }

  sendMail(ressource:any){
    return this.http.post<any>(`${this.url2}api/send-reset-password-link`, ressource);
  }


  
  update(ressource:any){
    return this.http.post<any>(`${this.url2}api/update-profile`, ressource,ConfigService.addAction('edit'));
  }

  recoverPassword(ressource:any){
    return this.http.post<any>(`${this.url2}api/recovery-password`, ressource);
  }


  logout(){
    return this.http.get<any>(`${this.url}`);
  }

  changePassword(ressource:any){

    return this.http.post<any>(`${this.url2}api/change-password`, ressource,ConfigService.addAction('edit'));
    }
    changeFirstPassword(ressource:any){

    return this.http.post<any>(`${this.url2}api/change-first-password`, ressource);
    }

    saveDB(){

      return this.http.get<any>(`${this.url2}api/save-db`,ConfigService.addAction('add'));
      }

      getBackups(){

        return this.http.get<any>(`${this.url2}api/backups`,ConfigService.addAction('list'));
        }

        resetPassword(password: string,token:string): Observable<any> {
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
}
