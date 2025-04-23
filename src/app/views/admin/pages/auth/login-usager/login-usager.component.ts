import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
// import { AuthentificationService } from '../../../../core/_services/authentification.service';
// import { LocalStorageService } from '../core/_services/browser-storages/local.service';
import {TranslateService} from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { AuthentificationService } from '../../../../../core/services/authentification.service';

import { LoadingComponent } from '../../../../components/loading/loading.component';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';

@Component({
  selector: 'app-login-usager',
  templateUrl: './login-usager.component.html',
  styleUrls: ['./login-usager.component.css'],
    standalone: true,
	imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
})
export class LoginUsagerComponent implements OnInit {

  returnUrl=''
  loading=false
  error=''

  constructor(private activatedRoute:ActivatedRoute,private translateService: TranslateService,private localStorageService:LocalStorageService,private route:ActivatedRoute,private router:Router, private auth:AuthentificationService) { }
  lang="fr"
  ngOnInit(): void {

  }

  submit(value:any) {
		this.loading = true;
		this.auth
			.loginUsager(value)
			.subscribe((res:any) => {
				console.log(res)
				this.loading = false;
				if (res) {
          this.localStorageService.set('mataccueilUserData',res);
          
					this.router.navigateByUrl('/usager/espace'); 
				}
				
			},err => {
				console.log(err)
				this.loading = false; 
				if(err.error.non_field_errors!=null){
					this.error=err.error.non_field_errors[0]
				}
				});
	}


}
