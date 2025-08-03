import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../../../core/services/service.service';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { ObserverService } from '../../../../core/utils/observer.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-list-stat-prestation-structure',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, LoadingComponent, SampleSearchPipe, NgSelectModule, NgxPaginationModule],
  templateUrl: './list-stat-prestation-structure.component.html',
  styleUrls: ['./list-stat-prestation-structure.component.css']
})
export class ListStatPrestationStructureComponent implements OnInit {

  searchText: string = "";
  data: any[] = [];
  _temp: any[] = [];
  search_text: string = "";
  user: any;

  pg: any = {
    pageSize: 10,
    p: 1, 
    total: 0
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private localService: LocalStorageService,
    private prestationService: ServiceService,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService,
    private observerService: ObserverService
  ) { }

  ngOnInit(): void {
    this.observerService.setTitle('Liste des prestations par structure');
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName);
      this.init();
    }
  }

  init() {
    this.spinner.show();
    this.data = [];
    this.prestationService.getAllStatByStrcutre(this.user.idEntite).subscribe((res: any) => {
      this.spinner.hide();
      
      this.data = res.data || res;
      this._temp = this.data;
      
      this.pg.total = this.data.length;
    });
  }

  getPage(event: any) {
    this.pg.p = event;
  }
  
  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term);
    });
  }
}