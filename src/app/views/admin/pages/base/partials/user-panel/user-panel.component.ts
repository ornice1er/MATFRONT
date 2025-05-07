import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../../core/pipes/sample-search.pipe';
import { UserService } from '../../../../../../core/services/user.service';
import { GlobalName, Roles } from '../../../../../../core/utils/global-name';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import { LocalStorageService } from '../../../../../../core/utils/local-stoarge-service';



@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',

      standalone: true,
        imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {

  constructor(private userService:UserService,private router:Router,private localStorageService:LocalStorageService,private translateService: TranslateService) { }
  
  current_role:any=""
  user:any
 
  ngOnInit(): void {
    this.current_role=localStorage.getItem('mataccueilUserRole')
      this.user=this.localStorageService.get(GlobalName.userName)
      if(this.current_role!=Roles.Admin && this.current_role!=Roles.SubAdmin){
      }
     
    
        this.translateService.use(this.user.default_language);
  }


  

  signout(){
    this.localStorageService.remove(GlobalName.tokenName)
    this.localStorageService.clear()
    this.router.navigateByUrl('/auht/login')
  }

}
