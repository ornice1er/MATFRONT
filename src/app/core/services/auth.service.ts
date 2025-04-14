import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../utils/config-service';
import { GlobalName } from '../utils/global-name';
import { LocalStorageService } from '../utils/local-stoarge-service';

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
    return this.http.get<any>(`${this.url2}api/user`,
     ConfigService.httpHeader(null,true));
  }

  login(ressource:any){

    /*ressource['grant_type']=LoginParamProd.grantType;
    ressource['client_id']=LoginParamProd.clientId;
    ressource['client_secret']=LoginParamProd.clientSecret;
    ressource['scope']=LoginParamProd.scope;*/

    return this.http.post<any>(`${this.url2}api/login`, ressource,
     ConfigService.httpHeader(null,true));
  }

  sendMail(ressource:any){
    return this.http.post<any>(`${this.url2}api/send-reset-password-link`, ressource,
     ConfigService.httpHeader(null,true));
  }


  
  update(ressource:any){
    return this.http.post<any>(`${this.url2}api/update-profile`, ressource,ConfigService.addAction('edit'));
  }

  recoverPassword(token:any,ressource:any){
    return this.http.post<any>(`${this.url2}api/recovery-password/${token}`, ressource,
     ConfigService.httpHeader(null,true));
  }


  logout(){
    return this.http.get<any>(`${this.url}`);
  }

  changePassword(ressource:any){

    return this.http.post<any>(`${this.url2}api/change-password`, ressource,ConfigService.addAction('edit'));
    }
    changeFirstPassword(ressource:any){

    return this.http.post<any>(`${this.url2}api/change-first-password`, ressource,
    ConfigService.httpHeader(null,true));
    }

    saveDB(){

      return this.http.get<any>(`${this.url2}api/save-db`,ConfigService.addAction('add'));
      }

      getBackups(){

        return this.http.get<any>(`${this.url2}api/backups`,ConfigService.addAction('list'));
        }
}
