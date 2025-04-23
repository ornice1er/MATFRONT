import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { AuthentificationService } from '../../../../../core/services/authentification.service';
import { PORTAL_CONFIG } from '../../../../../core/utils/eservice.config';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';

@Component({
  selector: 'app-login-v2',
   standalone: true,
	  imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
	
  templateUrl: './login-v2.component.html',
  styleUrls: ['./login-v2.component.css']
})
export class LoginV2Component implements OnInit {

 
  returnUrl=''
  loading=false
  error=''
  code:any
  constructor(private userService: UserService, private localService: LocalStorageService,private activatedRoute:ActivatedRoute,private localStorageService:LocalStorageService,private route:ActivatedRoute,private router:Router, private auth:AuthentificationService) { }
  lang="fr"
  ngOnInit(): void {
	  this.code=this.activatedRoute.snapshot.paramMap.get('code');
		if (this.code != null && this.code != undefined) {
			this.submit()
		}
    this.route.queryParams.subscribe(params => {
		console.log(params)
			this.returnUrl = params['returnUrl'] || '/dashboard';
		});
	
  }

  goToLdap(){
	  console.log(PORTAL_CONFIG.getRedirectPprodUri())
	window.location=PORTAL_CONFIG.getRedirectPprodUri() ;
  }

  submit() {
    localStorage.removeItem("mataccueilToken")
		localStorage.removeItem("mataccueilUserData")
		this.loading = true;
		this.auth
			.loginV2(this.code)
			.subscribe((res:any) => {
				console.log(res)
				this.loading = false;
				if (res) {
					localStorage.setItem('mataccueilToken',res.token);
					this.router.navigateByUrl("/dashboard"); 
					setTimeout(function(){
						window.location.reload()
					},1000)	
				}
				
			},err => {
				console.log(err)
				this.loading = false; 
				if(err.error.error=="invalid_credentials"){
					this.error="Email ou mot de passe incorrect"
				}else{
					this.error="Erreur de connexion ou paramètres incorrects"
				}
				});
	}


}
