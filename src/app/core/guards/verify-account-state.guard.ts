import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSweetAlert } from '../utils/app-sweet-alert';
import { GlobalName } from '../utils/global-name';
import { LocalStorageService } from '../utils/local-stoarge-service';
import { AppStudentSelected } from '../utils/app-student-selected';

@Injectable({
  providedIn: 'root'
})
export class VerifyAccountStateGuard implements CanActivate {
  constructor(
    private lsService:LocalStorageService,
    private selectedStudentObserver:AppStudentSelected,
    private router:Router) {
}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user = this.lsService.get(GlobalName.userName)
    if ( user.first_signin) {
          
          this.router.navigate(['/activate-account']);
          return false;
        } else  if (!user.is_active) {
          AppSweetAlert.simpleAlert("error","Compte bloqué","Veuillez contacter l'administrateur !")

          return false;
        }else {
          if(this.lsService.get(GlobalName.childName))this.selectedStudentObserver.setStudentSelected(this.lsService.get(GlobalName.childName))

          return true;
        }  }
  
}
