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
import { InstitutionService } from '../../../../../core/services/institution.service';

import { NatureRequeteService } from '../../../../../core/services/nature-requete.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { TypeService } from '../../../../../core/services/type.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { ConfigService } from '../../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';


@Component({
  selector: 'app-list-stat-prestation',
  standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './list-stat-prestation.component.html',
  styleUrls: ['./list-stat-prestation.component.css']
})
export class ListStatPrestationComponent implements OnInit {


  @Input() cssClasses = '';
  errormessage=""
  erroraffectation=""
  
  searchText=""
  closeResult = '';
   permissions:any[]=[]
  error=""
  data: any[]=[];
  entities: any[]=[];
  _temp: any[]=[];
  collectionSize = 0;
  page = 1;
  pageSize = 10;
  entiteId=1;
  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term) 
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
    private insService:InstitutionService,
    private natureService:NatureRequeteService,
    private thematiqueService:TypeService,
    private usagersService:UsagerService,
    private spinner: NgxSpinnerService,
    private lsService:LocalStorageService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    
    if (this.lsService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName)
      this.init()
    }
   
  }

  init(){
    this._temp=[]
    this.data=[]
    let param={"idUser":this.user.id,"startDate":"all","endDate":"all"}
    this.entiteId=this.user.idEntite;
    this.prestationService.getStat(param,this.entiteId).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.stats
      this.param_stat.stats=this.data
      this.param_stat.startDate="all"
      this.param_stat.endDate="all"
      this._temp=this.data
      this.collectionSize=this.data.length
    })

    this.insService.getAll().subscribe((res:any)=>{
      this.entities=res
    })

  }

  param_stat:any={startDate:"",endDate:"",idUser:'',stats:[]}

  searchStats(){
    this.param_stat.idUser=this.user.id
    this._temp=[]
    this.data=[]
    this.prestationService.getStat(this.param_stat,this.entiteId).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.stats
      this.param_stat.stats=this.data
      this._temp=this.data
      this.collectionSize=this.data.length
    })
  }
  genererPDFStat(){
    this.param_stat.stats=this.data
    this.param_stat['entiteId']=this.entiteId
    this.prestationService.genPdfStat(this.param_stat).subscribe((res:any)=>{
      window.open(ConfigService.toFile('statistiques/'+res.url),'_blank') 
    })
  }

  resetStats(){
    this.init()
    this.param_stat={startDate:"all",endDate:"all",idUser:'',stats:[]}
  }
}
