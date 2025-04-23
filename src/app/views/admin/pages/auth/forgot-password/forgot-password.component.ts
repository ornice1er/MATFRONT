import { Component, OnInit } from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { AuthentificationService } from '../../../../../core/services/authentification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl:'./forgot-password.component.html',
    standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterModule],
  styleUrls: ['./forgot-password.component.css'],
})

export class ForgotPasswordComponent implements OnInit {

  error=""
  loading=false
  constructor(private activatedRoute:ActivatedRoute,private router:Router,private translateService: TranslateService,private authService:AuthentificationService) { }
  lang="fr"
  ngOnInit(): void {
    this.lang=this.activatedRoute.snapshot.paramMap.get('lang') ?? '';
    if(this.lang=="fr" || this.lang=="en"){
      this.translateService.use(this.lang);
    }else{
     
      this.router.navigateByUrl('/forgot-password');
    }
    if(this.lang==null){
      this.lang="fr"
      this.translateService.use("fr");
    }
  }

  submit(value:any){
    this.loading=true
      this.authService.forgotPassword(value.eamil).subscribe((res:any)=>{
        this.loading=false
        AppSweetAlert.simpleAlert('Informations', 'Votre processus de reinitialisation de mot de passe a bien été enclencher. Veuillez consulter votre adresse E-mail continuer', 'success')
         window.location.reload();
      },(err:any)=>{  
        this.loading=false
        AppSweetAlert.simpleAlert('Erreur', 'Une erreur est survenue, verifier votre connexion internet puis reessayer', 'error')})
     
  }

}
