import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError, retry, throwError } from "rxjs";
import { Router } from "@angular/router";
import { LocalStorageService } from "./local-stoarge-service";
import { GlobalName } from "./global-name";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor( 
    private authService: AuthService,
    private router: Router,
    private lsService:LocalStorageService,
    private modalService:NgbModal,
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getJWTToken();
    req = req.clone({
      url:  req.url,
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: `application/json`
      }
    });
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
              if (error.error instanceof ErrorEvent) {
                console.log("Error Event");
              } else {
                console.log(
                  `error status : ${error.status} ${JSON.stringify(error.error)}`
                );
                switch (error.status) {
                  case 401:
                    this.lsService.remove(GlobalName.tokenName)
                    this.lsService.remove(GlobalName.refreshTokenName)
                    this.lsService.remove(GlobalName.expireIn)
                    this.lsService.remove(GlobalName.userName)
                    this.lsService.remove(GlobalName.exercice)
                    this.modalService.dismissAll()
                    this.router.navigate(['//login'])
                    break;
                  case 403:
                    break;
                  case 0:
                  case 400:
                  case 405:
                  case 406:
                  case 409:
                  case 500:
                    break;
                }
              }
            } else {
              console.error("Une erreur non identifiée s'est produit.");
            }

        return throwError(error);
      })
    );
  }
}