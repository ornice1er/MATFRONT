
<<<<<<< HEAD
=======
import { TranslateService } from '@ngx-translate/core';
>>>>>>> eaace58d9d0de27e263457452c62d9d9a052a476
// import { Roles } from '../../../core/_models/roles';
// import { AuthentificationService } from '../../../core/_services/authentification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { AuthentificationService } from '../../../../core/services/authentification.service';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { Component } from '@angular/core';
import { FooterComponent } from './partials/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from './partials/aside/aside.component';
import { HeaderComponent } from './partials/header/header.component';


@Component({
  selector: 'app-base',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,FooterComponent,RouterOutlet,AsideComponent,HeaderComponent],
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent  {

  user: any
<<<<<<< HEAD
  constructor(private userService: UserService, private authService: AuthentificationService, private localService: LocalStorageService) { }
=======
  constructor(private userService: UserService, private authService: AuthentificationService, private localService: LocalStorageService, private translateService: TranslateService) { }
>>>>>>> eaace58d9d0de27e263457452c62d9d9a052a476

  ngOnInit(): void {
    if (localStorage.getItem('mataccueilUserData') != null) {
      this.user = this.localService.get('mataccueilUserData')
    }else{
      this.authService.getUserByToken().subscribe((res: any) => {
        console.log(res)
       this.user=res
       this.localService.set('mataccueilUserData', res)
      })

    }
  }

}
