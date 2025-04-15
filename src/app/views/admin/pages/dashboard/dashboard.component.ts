import { Component } from '@angular/core';
// import { Router } from 'express';
// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../../../core/services/auth.service';
import { GlobalName } from '../../../../core/utils/global-name';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import {NgSelectModule} from '@ng-select/ng-select'
import {NgxPaginationModule} from 'ngx-pagination'


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user:any

 constructor(
    private lsService:LocalStorageService
  ) { }

  ngOnInit(): void {
  
     this.user=this.lsService.get(GlobalName.userName)
    // this.role=this.user.roles[0].name
}

}
