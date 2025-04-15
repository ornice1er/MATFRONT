import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalName } from '../utils/global-name';
import { LocalStorageService } from '../utils/local-stoarge-service';

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
          let url='/admin/dashboard'
          this.router.navigate([url]);
          return false;

        } else {
          return true;
        }
    
  }
  
}
