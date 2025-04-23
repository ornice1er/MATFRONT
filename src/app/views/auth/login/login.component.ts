import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalName } from '../../../core/utils/global-name';
import { LocalStorageService } from '../../../core/utils/local-stoarge-service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthentificationService } from '../../../core/services/authentification.service';
import { SettingService } from '../../../core/services/setting.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone:true,
  imports:[ CommonModule,LoadingComponent,FormsModule,RouterModule,TranslateModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  returnUrl=''
  loading=false
  error=''
  constructor(
    private activatedRoute:ActivatedRoute,
    private localStorageService:LocalStorageService,
    private route:ActivatedRoute,
    private router:Router, 
    private auth:AuthentificationService, 
    private settingService: SettingService ) { }
  lang="fr"
  ngOnInit(): void {
    
  this.lang=this.activatedRoute.snapshot.paramMap.get('lang') ?? "" ;
  
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/dashboard';
    });
  if (this.localStorageService.get('mataccueilToken')!=null) {
    this.router.navigate(['/dashboard']);
  }	
  }

  submit(value:any,event?: Event):any {
   // if (event) event.preventDefault();

    this.localStorageService.remove("mataccueilToken")
    this.localStorageService.remove("mataccueilUserData")
    this.loading = true;
    this.auth
      .login(value)
      .subscribe((res:any) => {
        this.loading = false;
        if (res) {
            this.settingService.get().subscribe((result:any)=>{
             this.localStorageService.set(GlobalName.settingName,JSON.stringify(result.data));
             this.localStorageService.set(GlobalName.tokenName,res.token);
              this.router.navigateByUrl("/admin/dashboard"); 
              setTimeout(function(){
                window.location.reload()
              },1000)	
            })
        
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
