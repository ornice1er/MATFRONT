import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthentificationService } from '../../../../core/_services/authentification.service';
// import { LocalStorageService } from '../../../../core/_services/browser-storages/local.service';
// import { UserService } from '../../../../core/_services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { AuthentificationService } from '../../../../../core/services/authentification.service';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';

@Component({
  selector: 'app-login-check',
  standalone: true,
	imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './login-check.component.html',
  styleUrls: ['./login-check.component.css']
})
export class LoginCheckComponent implements OnInit {

	returnUrl = ''
	loading = false
	error = ''
  constructor(private route:ActivatedRoute,private userService: UserService, private localService: LocalStorageService, private router: Router, private auth: AuthentificationService) { 

  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('email');
    console.log(id);
    if (localStorage.getItem('mataccueilToken')!=null) {
      this.router.navigate(['/dashboard']);
    }else{
      this.submit({email:id,password:'123'});
    }
    
  }
  submit(value:any) {
		localStorage.removeItem("mataccueilToken")
		localStorage.removeItem("mataccueilUserData")
		this.loading = true;
		this.auth
			.login(value)
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
