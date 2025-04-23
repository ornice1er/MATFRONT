import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { AuthService } from '../../../../core/services/auth.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';

@Component({
  selector: 'app-base-usager',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterOutlet],
  templateUrl: './base-usager.component.html',
  styleUrls: ['./base-usager.component.css']
})
export class BaseUsagerComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router: Router, private auth:AuthService,private localStorageService:LocalStorageService) { 

    
  }

  ngOnInit(): void {
  }

}

