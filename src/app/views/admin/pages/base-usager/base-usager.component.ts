import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../../../core/_services/authentification.service';
import { LocalService } from '../../../core/_services/browser-storages/local.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';

@Component({
  selector: 'app-base-usager',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './base-usager.component.html',
  styleUrls: ['./base-usager.component.css']
})
export class BaseUsagerComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private jwtHelper: JwtHelperService,private router: Router, private auth:AuthentificationService,private localStorageService:LocalService) { 

    
  }

  ngOnInit(): void {
  }

}

