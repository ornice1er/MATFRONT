import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { AuthService } from '../../../../../core/services/auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  token:any=""
  error:any=""
  loading=false
  constructor(private translateService: TranslateService,private activatedRoute:ActivatedRoute,private authService:AuthService) { }

  ngOnInit(): void {
    let lang=this.activatedRoute.snapshot.paramMap.get('lang');
    this.translateService.use(lang ?? "");
    this.token=this.activatedRoute.snapshot.paramMap.get('token');
  }

  submit(value:any){
    this.loading=true
    if(value.password_c==value.password){
      this.loading=false

      this.authService.resetPassword(value.password,this.token).subscribe((res:any)=>{
        AppSweetAlert.simpleAlert('Felicitation', 'Votre mot de passe a été mise à jour avec succès', 'success')
         window.location.reload();
      },(err:any)=>{   
        this.loading=false
         AppSweetAlert.simpleAlert('Erreur', 'Une erreur est survenue, verifier votre connexion internet puis reessayer', 'error')})
    }else{
      this.loading=false
      this.error="les deux mot de passe ne sont pas  identiques"
    }
     
  }

}
