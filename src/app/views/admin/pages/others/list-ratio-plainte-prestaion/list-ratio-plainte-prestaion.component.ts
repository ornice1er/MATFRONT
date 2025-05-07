import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { EtapeService } from '../../../../../core/services/etape.service';
import { NatureRequeteService } from '../../../../../core/services/nature-requete.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { TypeService } from '../../../../../core/services/type.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';



@Component({
  selector: 'app-list-ratio-plainte-prestaion',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './list-ratio-plainte-prestaion.component.html',
  styleUrls: ['./list-ratio-plainte-prestaion.component.css']
})
export class ListRatioPlaintePrestaionComponent implements OnInit {

  errormessage=""
  erroraffectation=""
  
  searchText=""
  closeResult = '';
   permissions:any[]=[]
  error=""
  data: any[]=[];
  _temp: any[]=[];
  collectionSize = 0;
  page = 1;
  pageSize = 10;

  data2: any[]=[];
  _temp2: any[]=[];
  collectionSize2 = 0;
  page2 = 1;
  pageSize2 = 10;

  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.question.toLowerCase().includes(term) 
    })
    this.collectionSize=this.data.length
  }
  

  user:any

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router:Router,
    private etapeService:EtapeService,
    private requeteService:RequeteService,
    private localService:LocalStorageService,
    private prestationService:ServiceService,
    private structureService:StructureService,
    private natureService:NatureRequeteService,
    private thematiqueService:TypeService,
    private usagersService:UsagerService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
        private localStorageService:LocalStorageService
    
  ) { }



  ngOnInit(): void {

    
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName)
      this.init()
    }
   
  }

  init(){
    this._temp=[]
    this.data=[]
    this.requeteService.getRationPlaintePrestation({"startDate":"all","endDate":"all"},this.user.idEntite).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res
      this._temp=this.data
      this.collectionSize=this.data.length
    })


    this._temp2=[]
    this.data2=[]
    this.requeteService.getRationPlaintePrestationEncours({"startDate":"all","endDate":"all"},this.user.idEntite).subscribe((res:any)=>{
      this.spinner.hide();
      this.data2=res
      this._temp2=this.data2
      this.collectionSize2=this.data2.length
    })

  }



}
