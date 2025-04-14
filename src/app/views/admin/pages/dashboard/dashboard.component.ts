import { Component } from '@angular/core';
import { Router } from 'express';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { GlobalName } from '../../../../core/utils/global-name';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
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
