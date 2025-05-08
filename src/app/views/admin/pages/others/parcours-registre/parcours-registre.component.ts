import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, NavigationStart, RouterModule } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { EtapeService } from '../../../../../core/services/etape.service';

import { NatureRequeteService } from '../../../../../core/services/nature-requete.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { TypeService } from '../../../../../core/services/type.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { ConfigService } from '../../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';




@Component({
  selector: 'app-parcours-registre',
    standalone: true,
        imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule, RouterModule],
  
  templateUrl: './parcours-registre.component.html',
  styleUrls: ['./parcours-registre.component.css']
})
export class ParcoursRegistreComponent implements OnInit {


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
  pageSize = 10;
  cpt = 0;
  nbr = 0;
  selected = [];
  current_permissions: any[] = []
  selected_data: any
  isSended = false
  selected_Status=""
  nbre: number = 0

  etapes : any[]= []
  services: any[] = []
  departements : any[]= []
  structureservices : any[]= []
  listpfc : any[]= []
  listComm : any[] = []
  listuser : any[] = []
  list_parcours :any[]=[]
  // themes = []
  // natures = []

  isGeneralDirector = false
  isAdmin = false
  RelanceAWho = ""
  ValStruRelance = ""
   pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""

  // checked(event, el) {
  //   console.log(el)
  //   this.selected_data = el
  //   // this.usager_full_name=this.selected_data.usager.nom+" "+this.selected_data.usager.prenoms
  //   this.RelanceAWho = ""
  //   this.ValStruRelance = ""
  //   if (this.selected_data.finalise == 1) {
  //     return;
  //   }
  //   this.cpt = 0
  //   if (this.selected_data.affectation.length > 0) {
  //     this.selected_data.affectation.forEach((item:any) => {
  //       this.cpt++;
  //       if (this.cpt == this.selected_data.affectation.length && item.idStructure != this.selected_pfc){
  //            this.RelanceAWho = item.typeStructure;
  //            this.ValStruRelance = item.idStructure;
  //         }
  //     })
  //   }
  //   this.cpt = 0
  //   if (this.selected_data.parcours.length > 0) {
  //     this.selected_data.parcours.forEach((item:any) => {
  //       this.cpt++;
  //       if (this.cpt == this.selected_data.parcours.length && item.idStructure == this.selected_pfc){
  //         this.RelanceAWho = ""
  //         this.ValStruRelance = ""
  //         }
  //     })
  //   }
  // }

  search() {
    this.data = []
    this._temp = []
    this.requeteService.getParcoursRegistre(this.user.idEntite,this.searchText, this.selected_idcom,this.pg.pageSize,this.page,this.selected_Status,null,null,this.selected_iduse).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res.data
        this._temp = this.data
        this.subject.next(res);
      })
  }

  

  openEditModal(content:any,el:any){
    this.list_parcours=el
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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



  
  show_step(id:any) {
    return this.etapes.find((e:any) => (e.id == id))
  }

  key_type_req = ""

  apercuImage(){
    //Controle si les dates sont identiques 
    if(this.selected_idcom == "" ){
      AppSweetAlert.simpleAlert("Erreur", "Veuillez choisir la commune concernée", 'error');
      return
    }
    if(this.selected_iduse == "" ){
      AppSweetAlert.simpleAlert("Erreur", "Veuillez choisir l'acteur concerné'", 'error');
      return
    }
    if((this.select_date_start != this.select_date_end) || this.select_date_start == "" || this.select_date_end == ""){
      AppSweetAlert.simpleAlert("Erreur", "La date début et fin doivent être identique pour faire un aperçu du régistre physique d'une journée", 'error');
      return
    }
    var url= ConfigService.toApiUrl('apercuimage')
    if(this.selected_idcom) url+="?idcom="+this.selected_idcom //Statut de satisfaction
    if(this.select_date_start) url+="&date="+this.select_date_start //Entite
    if(this.selected_iduse) url+="&iduser="+this.selected_iduse //Rechercher 
    window.open(url, "_blank")  
  }

  print(){
    var url= ConfigService.toApiUrl('print-registre')
    if(this.user) url+="?ie="+this.user.idEntite //Entite
    if(this.selected_iduse) url+="&iduser="+this.selected_iduse //Rechercher 
    if(this.selected_idcom) url+="&ic="+this.selected_idcom //
    if(this.selected_Status) url+="&s="+this.selected_Status //Statut de satisfaction
    if(this.select_date_start) url+="&db="+this.select_date_start // Date debut 
    if(this.select_date_end) url+="&df="+this.select_date_end  //Date fin 
    window.open(url, "_blank")  
  }

  printstat(){
    var url= ConfigService.toApiUrl('print-registre-stat')
    // if(this.user) url+="?ie="+this.user.idEntite //ie = Entite
    // if(this.searchText) url+="&se="+this.searchText //Rechercher
    if(this.user) url+="?u="+this.user.idagent //id_user
    // if(this.selected_Status) url+="&s="+this.selected_Status //Statut de satisfaction
    if(this.select_date_start) url+="&db="+this.select_date_start // Date debut 
    if(this.select_date_end) url+="&df="+this.select_date_end  //Date fin 
    if(this.selected_idcom) url+="&ic="+this.selected_idcom //
    window.open(url, "_blank")  
  }


  ngOnInit(): void {
    this.observerService.setTitle('REGISTRE DE VISITE')

    this.prepare()
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.prepare()
        }
      })
  }

  prepare() {
   
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName)
      if (this.user.profil_user.CodeProfil === 12) {
        this.isGeneralDirector = true;
      } else {
        this.isGeneralDirector = false;
      }
      if (this.user.profil_user.CodeProfil === 2) { //Administrateur
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }


    this.subject.subscribe((val) => {
      this.pager = val
      this.page = this.pager.current_page

      let pages = []
      if (this.pager.last_page <= 5) {
        for (let index = 1; index <= this.pager.last_page; index++) {
          pages.push(index)
        }
      }else{
        let start = (this.page > 3 ? this.page - 2 : 1)
        let end = (this.page + 2 < this.pager.last_page ? this.page + 2 : this.pager.last_page)
        for (let index = start; index <= end; index++) {
          pages.push(index)
        }
      }

      this.pager.pages = pages
    });
    this.listComm = []
    this.structureService.getLisCommune(this.user.idagent).subscribe((res:any)=>{
      this.listComm = res
    })

    // this.listpfc = []
    // this.structureService.getPfc().subscribe((res:any)=>{
    //   this.listpfc = res
    // })
 
  }

  onUserChange(event:any){
    this.listuser = []
    this.structureService.getLisUsersParCommune(+event.target.value).subscribe((res:any)=>{
      this.listuser = res
    })
  }
  pager: any = {
    current_page: 0,
    data: [],
    last_page: 0,
    per_page: 0,
    to: 0,
    total: 0
  }
  subject = new Subject<any>();
  Null = null

  init(page:any) {
    this._temp = []
    this.data = []
    this.requeteService.getParcoursRegistre(this.user.idEntite,null, this.selected_idcom,this.pg.pageSize,page,this.selected_Status,null,null,this.selected_iduse).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res.data
        this._temp = this.data
        this.subject.next(res);
      })


    // this.listpfc = []
    // this.structureService.getPfc().subscribe((res:any)=>{
    //   this.listpfc = res
    // })
    this.listComm = []
    this.structureService.getLisCommune(this.user.idagent).subscribe((res:any)=>{
      this.listComm = res
    })
    console.log(this.user)
  }

  selected_idcom=""
  selected_iduse=""
  select_date_start=""
  select_date_end=""
  filter(value:any){
    
    this.data = []

    this.requeteService.getParcoursRegistre(this.user.idEntite,null,value.listComm,this.pg.pageSize,this.page,value.statut,this.select_date_start,this.select_date_end,value.listuser).subscribe((res: any) => {
      this.spinner.hide();
      this.data = res.data
      this._temp = this.data
      this.subject.next(res);
    })
  }
  reset(){
    this.selected_idcom=""
    this.selected_iduse=""
    this.select_date_start=""
    this.select_date_end=""
   this.init(this.page) 
  }

  decomposeDate(datetime:any){
    let full_date=datetime.split(' ')[0]
    return {
      month:+full_date.split('/')[1] - 1,
      day:+full_date.split('/')[0],
      year:+full_date.split('/')[2]
    }
  }
  decomposeReverseDate(datetime:any){
    let full_date=datetime.split(' ')[0]
    return {
      month:+full_date.split('/')[1] - 1,
      day:+full_date.split('/')[2],
      year:+full_date.split('/')[0]
    }
  }
  daysTodayFromDate(checkdate:any) {
    let timeDiff = 0
    const date = new Date(this.decomposeDate(checkdate).year,this.decomposeDate(checkdate).month,this.decomposeDate(checkdate).day);
    timeDiff = (new Date()).getTime() - date.getTime();

    let daysdiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysdiff;
  }
  daysBetweenTwoDate(date2:any, date1:any) {
    let timeDiff = 0
    var date4 = new Date(this.decomposeReverseDate(date2).year,this.decomposeReverseDate(date2).month,this.decomposeReverseDate(date2).day);
    var date3 = new Date(this.decomposeDate(date1).year,this.decomposeDate(date1).month,this.decomposeDate(date1).day);

    timeDiff = date3.getTime() - date4.getTime();
    let daysdiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysdiff;
  }

  ratioBetweenTwoDate(delaiTh:any, date2:any, date1:any) {
    var date4 = new Date(this.decomposeReverseDate(date2).year,this.decomposeReverseDate(date2).month,this.decomposeReverseDate(date2).day);
    var date3 = new Date(this.decomposeDate(date1).year,this.decomposeDate(date1).month,this.decomposeDate(date1).day);

    var timeDiff = Math.abs(date4.getTime() - date3.getTime());
    var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var ratio = dayDifference / delaiTh;
    return ratio;
  }
  ratioTodayFromDate(delaiTh:any, date:any) {
    var date2 = new Date();
    var date1 = new Date(this.decomposeDate(date).year,this.decomposeDate(date).month,this.decomposeDate(date).day);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var ratio = dayDifference / delaiTh;

    return ratio;
  }

     getPage(event:any){
    this.pg.p=event
    this.init(this.pg.p)
  }
}
