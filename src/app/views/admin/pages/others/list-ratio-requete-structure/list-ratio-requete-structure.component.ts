import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { RequeteService } from '../../../../../core/services/requete.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';

@Component({
  selector: 'app-list-ratio-requete-structure',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, SampleSearchPipe, NgxPaginationModule],
  templateUrl: './list-ratio-requete-structure.component.html',
  styleUrls: ['./list-ratio-requete-structure.component.css']
})
export class ListRatioRequeteStructureComponent implements OnInit {

  data: any[] = [];
  data2: any[] = [];
  search_text: string = "";
  user: any;

  pg: any = {
    pageSize: 10,
    p: 1, 
    total: 0
  };

  pg2: any = {
    pageSize: 10,
    p: 1,
    total: 0
  };

  constructor(
    private requeteService: RequeteService,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService,
    private observerService: ObserverService,
    private localService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.observerService.setTitle('Ratio de Performances des Requêtes par Structure');
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName);
      this.init();
    }
  }

  init() {
    this.spinner.show();
    this.data = [];
    this.requeteService.getRationReqStructure({ "startDate": "all", "endDate": "all" }, this.user.idEntite).subscribe((res: any) => {
      this.spinner.hide();
      this.data = res.data || res;
      this.pg.total = this.data.length;
    });

    this.data2 = [];
    this.requeteService.getRationReqStructureEncours({ "startDate": "all", "endDate": "all" }, this.user.idEntite).subscribe((res: any) => {
      this.spinner.hide();
      this.data2 = res.data || res;
      this.pg2.total = this.data2.length;
    });
  }

  getPage(event: any) {
    this.pg.p = event;
  }
  
  getPage2(event: any) {
    this.pg2.p = event;
  }
}