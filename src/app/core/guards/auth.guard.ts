import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalName } from '../utils/global-name';
import { LocalStorageService } from '../utils/local-stoarge-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private lsService:LocalStorageService,
    private router:Router,
    private route:ActivatedRoute
    ) {
}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //   if (this.lsService.get(GlobalName.tokenName) != null) {
    //     return true;

    // } else {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    if (this.lsService.get(GlobalName.tokenName) != null) {

        return true;
        // if (this.jwtService.isTokenExpired()) {
        //   this.router.navigate(['//login']);
        //   return false;
        // } else {
        //   return true;
        // }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
