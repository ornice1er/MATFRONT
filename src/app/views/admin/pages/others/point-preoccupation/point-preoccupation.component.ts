import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
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
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';


@Component({
  selector: 'app-point-preoccupation',
    standalone: true,
        imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterModule],
  
  templateUrl: './point-preoccupation.component.html',
  styleUrls: ['./point-preoccupation.component.css']
})
export class PointPreoccupationComponent implements OnInit {

  @Input() cssClasses = '';
  errormessage=""
  erroraffectation:any[]=[];
  
  searchText:any="";
  closeResult = '';
   permissions:any[]=[];
  error=""
  data: any[]=[];
  _temp: any[]=[];
  collectionSize = 0;
  page = 1;
  pageSize = 10;

   selected = [];
  current_permissions:any[]=[];
  selected_data:any
  isSended=false
  
  search(){ 
    this.data=[]
    this._temp=[]
    if(this.user.agent_user!=null && (this.user.profil_user.direction==1)){
    this.requeteService.getAllPointStructure(this.searchText,this.user.id,this.page,this.user.idEntite,this.user.agent_user.idStructure,0).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.data
      this._temp=this.data
      this.subject.next(res);
    })
    }else{
      this.requeteService.getAllPoint(this.searchText,this.user.id,this.page,this.user.idEntite,0).subscribe((res:any)=>{
        this.spinner.hide();
        this.data=res.data
        this._temp=this.data
        this.subject.next(res);
      })
    }
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
        private localStorageService:LocalStorageService,
        private observerService:ObserverService
    
  ) { }
  
  
  etapes=[]
  services=[]
  departements=[]
  structureservices=[]
  themes=[]
  natures=[]

  isGeneralDirector=false

  show_step(id:any){
    return this.etapes.find((e:any)=>(e.id==id))
  }

  ngOnInit(): void {

    this.observerService.setTitle('POINTS DES PREOCCUPATIONS EN COURS DE TRAITEMENT')

    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName)
      if(this.user.profil_user.CodeProfil === 12){
        this.isGeneralDirector=true;
      }else{
        this.isGeneralDirector=false;
      }
    }
    this.etapes=[]
    this.etapeService.getAll(this.user.idEntite).subscribe((res:any)=>{
      this.etapes=res
      this.activatedRoute.queryParams.subscribe((x:any)=> this.init(x['page'] || 1));
    })
    this.subject.subscribe((val) => {
     this.pager=val
     this.page=this.pager.current_page

     let pages=[]
     if(this.pager.last_page  <= 5){
      for (let index = 1; index <= this.pager.last_page; index++) {
        pages.push(index)
      }
     }else{
       let start=(this.page >3 ? this.page-2 : 1 )
       let end=(this.page+2 < this.pager.last_page ? this.page+2 : this.pager.last_page )
      for (let index = start; index <= end; index++) {
        pages.push(index)
      }
     }
    
     this.pager.pages=pages
  });
  }

    pager: any = {current_page: 0,
    data:[],
    last_page: 0,
    per_page: 0,
    to: 0,
    total: 0
  }
  subject = new Subject<any>();
  Null=null

  init(page:any){
   
    this._temp=[]
    this.data=[]
    if(this.user.agent_user!=null && (this.user.profil_user.direction==1)){
      this.requeteService.getAllPointStructure(null,this.user.id,page,this.user.idEntite,this.user.agent_user.idStructure,0).subscribe((res:any)=>{
        this.spinner.hide();
        this.data=res.data
        this._temp=this.data
        this.subject.next(res);
      })
    }else{
      this.requeteService.getAllPoint(null,this.user.id,page,this.user.idEntite,0).subscribe((res:any)=>{
        this.spinner.hide();
        this.data=res.data
        this._temp=this.data
        this.subject.next(res);
      })
    }

  
    this.departements=[]
    this.usagersService.getAllDepartement().subscribe((res:any)=>{
      this.departements=res
    })
    this.services=[]
    this.prestationService.getAll(this.user.idEntite).subscribe((res:any)=>{
      this.services=res
    })

    this.structureservices=[]
    this.structureService.getAllStructureByUser(this.user.id).subscribe((res:any)=>{
      this.structureservices=res
    })
    this.natures=[]
    this.natureService.getAll(this.user.idEntite).subscribe((res:any)=>{
      this.natures=res
    })
    this.themes=[]
    this.thematiqueService.getAll(this.user.idEntite).subscribe((res:any)=>{
      this.themes=res
    })

    
  }


  daysBetweenTwoDate (date2:any,date1:any){
    let timeDiff=0
    const date4 = new Date(date2);
    const date3 = new Date(date1);
    timeDiff = date3.getTime() - date4.getTime();
    let daysdiff=Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysdiff;
  }

  daysTodayFromDate(checkdate:any){
    let timeDiff=0
    const date = new Date(checkdate);
    timeDiff = (new Date()).getTime() - date.getTime();
    let daysdiff=Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysdiff;
  }
  ratioBetweenTwoDate(delaiTh:any,date2:any,date1:any){
    var date4 = new Date(date2);
    var date3 = new Date(date1);

    var timeDiff = Math.abs(date4.getTime() - date3.getTime());
    var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var ratio = dayDifference/delaiTh;
    return ratio;
  }
  ratioTodayFromDate (delaiTh:any,date:any){
    var date2 = new Date();
    var date1 = new Date(date);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var ratio = dayDifference/delaiTh;

    return ratio;
  }

  checked(event:any, el:any) {
    this.selected_data = el
  }
  relancerPreocuppation(){
  

    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
  
    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Réponse déjà transmise à l'usager.", 'error');
      return;
    }
  
    this.requeteService.relanceRequet(this.selected_data.id).subscribe((rest: any) => {
      this.init(this.page)
      this.modalService.dismissAll()
      AppSweetAlert.simpleAlert("Relancer la structure en charge de la préoccupation", "Relance envoyée avec succès", 'success')
    })
     
  }
  
}
