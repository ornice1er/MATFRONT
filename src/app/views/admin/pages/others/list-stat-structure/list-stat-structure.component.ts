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
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { ConfigService } from '../../../../../core/utils/config-service';
import { animate } from '@angular/animations';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';



@Component({
  selector: 'app-list-stat-structure',
  standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './list-stat-structure.component.html',
  styleUrls: ['./list-stat-structure.component.css']
})
export class ListStatStructureComponent implements OnInit {

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

  pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""

  data2: any[] = [];
  _temp2: any[] = [];
  collectionSize2 = 0;
  page2 = 1;
  pageSize2 = 20;


  default_msg = " Votre structure dont vous avez la charge a reçue des préoccupations venant de la part des usagers du MTFP. Vous êtes priez de traiter ses préoccupations dans les plus bref délais. Merci !"

  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term)
    })
    this.collectionSize = this.data.length
  }
  SelectedidStructure = null

  openAddModal(content:any, idStructure:any) {
    this.SelectedidStructure = idStructure
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

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
        private localStorageService:LocalStorageService,
        private observerService:ObserverService
  
  ) { }


  typeRequete = ""

  checkType() {
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == "plaintes") {
      return { id: 1, name: "Plaintes" }
    }
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == "requetes") {
      return { id: 0, name: "Requetes" }
    }
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == "infos") {
      return { id: 2, name: "Demandes d'informations" }
    }
    return
  }

  ngOnInit(): void {
    this.observerService.setTitle('STATISTIQUES - STRUCTURES')

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

    // this.typeRequete = this.checkType()?.name;
    if(this.selected_type =="0"){
      this.typeRequete = 'Requetes'
    }else if(this.selected_type =="1"){
      this.typeRequete = 'Plaintes'
    }else if(this.selected_type =="2"){
      this.typeRequete = "Demandes d'informations"
    }

    this.activatedRoute.queryParams.subscribe((x:any)=> this.init());
    this.subject.subscribe((val) => {
      console.log('val',val)
      this.data = []
      val?.data?.forEach((e:any) => { 
        if (this.checkStructureHaveService(e.id, this.all_structures)) { this.data.push(e) } 
      })
      // this.typeRequete = this.checkType()?.name;

    })
    this.subject2.subscribe((val) => {
      this.data2 = []
      this.data2 = val.data
      // this.typeRequete = this.checkType()?.name;

    })
  }

  param_stat_hebdo: any = { "user": "all", startDate: "all", endDate: "all", stats: [], typeRequete: this.typeRequete, sended: 0, typeStat: "Structure" }

  checkStructureHaveService(idCheck:any, list:any) {
    let result: any = list.filter((e: any) => (e.id == idCheck && e.services.length != 0))
    if (result.length!=0) {
      return true
    } else {
      return false;
    }
  }
  all_structures=[]

  init() {
    if(this.selected_type == ""){
      this.selected_type = "0"
    }
    this.structures = []
    /*
    this.structureService.getAll(1, this.user.idEntite).subscribe((list: any) => {
      this.structures = list
    })*/
    this.all_structures = []
    this.structureService.getAll(0, this.user.idEntite).subscribe((list: any) => {
      this.all_structures = list.data
      list.data.forEach((e:any) => { 
        if (e.services.length!=0) { this.structures.push(e) } 
      })
      this._temp = []
      this.data = []
      this.requeteService.getStatByStructure(
        this.selected_type, this.user.idEntite
      ).subscribe((res: any) => {
        this.spinner.hide();
        //e.idParent==0
        res.data.forEach((e:any) => { 
          if (this.checkStructureHaveService(e.id, list)) { this.data.push(e) } 
        })
        this._temp = this.data
        this.subject.next(res);
        this.param_stat_hebdo.stats = this.data
        this.param_stat_hebdo.startDate = "all"
        this.param_stat_hebdo.endDate = "all"
        if (res.data.isPaginate) {
          this.data = res.data.data
          this.pg.total=res.data.total
        }else{
          this.data = res.data

        }

      })

      this._temp2 = []
      this.data2 = []
      this.requeteService.getStatAllStructure(
        this.selected_type, this.user.idEntite
      ).subscribe((res: any) => {
        this.data2 = res
        this.subject2.next(res);
        this._temp2 = this.data2
        this.collectionSize2 = this.data2.length

      })

    })

  }

  structures:any[] = []
  selected_type = ""
  param_stat = { "user": "all", "plainte": this.selected_type, startDate: "", endDate: "" }

  selected_Struct = ""
  filterAll(event:any) {
    if (event.target.value != "all") {
      this.data = []
      this.data = this._temp.filter((e:any) => e.id == +event.target.value)
      this.collectionSize = this.data.length
      this.data2 = []
      this.data2 = this._temp2.filter((e:any) => e.idParent == +event.target.value)
      this.collectionSize2 = this.data2.length
    } else {
      this.data = []
      this.data = this._temp
      this.collectionSize = this.data.length
      this.data2 = []
      this.data2 = this._temp2
      this.collectionSize2 = this.data2.length
    }

  }
  searchStats() {
    this._temp = []
    this.data = []
    this.param_stat.plainte = this.selected_type
    this.requeteService.filterStatByStructure(
      this.param_stat, this.user.idEntite
    ).subscribe((res: any) => {
      this.spinner.hide();
      res.forEach((e:any) => { if (e.idParent == 0) { this.data.push(e) } })
      this._temp = this.data
      this.param_stat_hebdo.stats = this.data
      this.param_stat_hebdo.startDate = this.param_stat.startDate
      this.param_stat_hebdo.endDate = this.param_stat.endDate
      this.collectionSize = this.data.length

      this.data2 = []
      res.forEach((e: any) => { if (e.idParent != 0) { this.data2.push(e) } })
      this.collectionSize2 = this.data2.length
    })
  }



  resetStats() {
    this.init()
    this.param_stat = { "user": "all", "plainte": this.selected_type, startDate: "all", endDate: "all" }
  }

  genererPDFStat(sended:any) {
    this.param_stat_hebdo.sended = sended
    this.prestationService.genPdfStatHebdo(this.param_stat_hebdo).subscribe((res: any) => {
      window.open(ConfigService.toFile('statistiques/' + res.url))
    })
  }
  genererPDFStatDetails(sended:any) {
    this.param_stat_hebdo.sended = sended
    this.param_stat_hebdo.stats = this.data2
    this.prestationService.genPdfStatHebdo(this.param_stat_hebdo).subscribe((res: any) => {
      window.open(ConfigService.toFile('statistiques/' + res.url))
    })
  }

  sendRelance(value:any) {
    value.idEntite = this.user.idEntite
    value.idStructure = this.SelectedidStructure
    this.relanceService.create(value).subscribe((res) => {
      this.modalService.dismissAll()
      AppSweetAlert.simpleAlert("Relance", "Relance envoyée avec succès", 'success');
    })

  }

  getPage(event:any){
    this.pg.p=event
  }
}
