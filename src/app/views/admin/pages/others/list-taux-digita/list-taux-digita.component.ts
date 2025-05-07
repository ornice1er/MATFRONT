import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { EtapeService } from '../../../../../core/services/etape.service';

import { NatureRequeteService } from '../../../../../core/services/nature-requete.service';
import { RelanceService } from '../../../../../core/services/relance.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { TypeService } from '../../../../../core/services/type.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { ConfigService } from '../../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';



@Component({
  selector: 'app-list-taux-digita',
  standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './list-taux-digita.component.html',
  styleUrls: ['./list-taux-digita.component.css']
})
export class ListauxDigitComponent implements OnInit {

  @Input() cssClasses = '';
  errormessage = ""
  erroraffectation = ""

  searchText = ""
  closeResult = '';
  permissions: any[]=[]
  error = ""
  data: any[] = [];
  _temp: any[] = [];
  collectionSize = 0;
  page = 1;
  pageSize = 20;



  data2: any[] = [];
  _temp2: any[] = [];
  collectionSize2 = 0;
  page2 = 1;
  pageSize2 = 20;


  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term)
    })
    this.collectionSize = this.data.length
  }
  SelectedidStructure = null

  user: any

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private etapeService: EtapeService,
    private requeteService: RequeteService,
    private relanceService: RelanceService,
    private localService: LocalStorageService,
    private prestationService: ServiceService,
    private structureService: StructureService,
    private natureService: NatureRequeteService,
    private thematiqueService: TypeService,
    private usagersService: UsagerService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
        private localStorageService:LocalStorageService
    
  ) { }



  ngOnInit(): void {

    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName)
      this.prepare()

      this.router.events
        .subscribe(event => {

          if (event instanceof NavigationStart) {
            this.prepare()
          }
        })
    }
  }
  subject = new Subject<any>();
  subject2 = new Subject<any>();

  prepare() {
    this.init()
    // this.activatedRoute.queryParams.subscribe((x:any)=> this.init());
    // this.subject.subscribe((val) => {
    //   this.data = val
    // })
  }

  all_structures=[]

  init() {
    if(this.selected_type == ""){
      this.selected_type = "0"
    }
    this.structures = []
    this.requeteService.getAll_Structure(this.user.idEntite).subscribe((res: any) => {
      this.spinner.hide();
      this.data = res
      this._temp = this.data
      this.subject.next(res);
      this.collectionSize = this.data.length
      console.log('-------------')
      console.log(res)
    })
    // this.all_structures = []
    // this.structureService.getAll(0, this.user.idEntite).subscribe((list: any) => {
    //   this.all_structures = list
    //   list.forEach((e:any) => { 
    //     if (e.services.length!=0) { this.structures.push(e) } 
    //   })
    //   this._temp = []
    //   this.data = []
      
    // })

  }

  structures = []
  selected_type = ""

  selected_Struct = ""
  filterAll(event:any) {
    if (event.target.value != "all") {
      this.data = []
      this.data = this._temp.filter((e:any) => e.id == +event.target.value)
      this.collectionSize = this.data.length
    }
  }
  print(){
    var url= ConfigService.toApiUrl('structure/'+this.user.idEntite)
    if(this.user) url+="?imp=giwu" 
    window.open(url, "_blank")  
  }
  
  searchStats() {
    this._temp = []
    this.data = []
    this.requeteService.filterStatByStructure('','').subscribe((res: any) => {
      this.spinner.hide();
      res.forEach((e:any) => { if (e.idParent == 0) { this.data.push(e) } })
      this._temp = this.data
      this.collectionSize = this.data.length
    })
  }



  resetStats() {
    this.init()
  }

}
