import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalName } from '../utils/global-name';
import { LocalStorageService } from '../utils/local-stoarge-service';
import { AppRedirect } from '../utils/app-redirect';

@Injectable({
  providedIn: 'root'
})
export class IsAuthedGuard implements CanActivate {
  constructor(
    private lsService:LocalStorageService,
    private router:Router) {
}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.lsService.get(GlobalName.tokenName) != null) {
          let url=AppRedirect.redirectLogin(this.lsService)
          this.router.navigate([url]);
          return false;

        } else {
          return true;
        }
    
  }
  
}
