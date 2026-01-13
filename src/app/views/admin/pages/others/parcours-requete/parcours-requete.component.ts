import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, NavigationStart, RouterModule } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

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
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { ConfigService } from '../../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';



@Component({
  selector: 'app-parcours-requete',
    standalone: true,
        imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterModule,NgxSpinnerModule],
  
  templateUrl: './parcours-requete.component.html',
  styleUrls: ['./parcours-requete.component.css']
})
export class  ParcoursRequeteComponent implements OnInit {


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
  list_parcours: any[]=[]
  pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""

  
  ChangerFile(file:any){
    window.location.href="https://api.mataccueil.gouv.bj/api/downloadFile?file="+file
  }

  checked(event:any, el:any) {
    console.log(el)
    console.log(this.user)
    this.selected_data = el
    // this.usager_full_name=this.selected_data.usager.nom+" "+this.selected_data.usager.prenoms
    this.RelanceAWho = ""
    this.ValStruRelance = ""
    if (this.selected_data.finalise == 1) {
      return;
    }
    if(this.isAdmin == false){
      this.cpt = 0
      if (this.selected_data.affectation.length > 0) {
        this.selected_data.affectation.forEach((item:any) => {
          this.cpt++;
          if (this.cpt == this.selected_data.affectation.length && item.idStructure != this.selected_Struct){
               this.RelanceAWho = item.typeStructure;
               this.ValStruRelance = item.idStructure;
            }
        })
      }
      this.cpt = 0
      if (this.selected_data.parcours.length > 0) {
        this.selected_data.parcours.forEach((item:any) => {
          this.cpt++;
          if (this.cpt == this.selected_data.parcours.length && item.idStructure == this.selected_Struct){
            this.RelanceAWho = ""
            this.ValStruRelance = ""
            }
        })
      }
    }else{ //Administrateur ou directeur

      this.cpt = 0
      if (this.selected_data.affectation.length > 0) {
        this.selected_data.affectation.forEach((item:any) => {
          this.cpt++;
          if (this.cpt == this.selected_data.affectation.length && item.idStructure != this.user.agent_user.idStructure){
               this.RelanceAWho = item.typeStructure;
               this.ValStruRelance = item.idStructure;
            }
        })
      }
      this.cpt = 0
      if (this.selected_data.parcours.length > 0) {
        this.selected_data.parcours.forEach((item:any) => {
          this.cpt++;
          if (this.cpt == this.selected_data.parcours.length && item.idStructure == this.user.agent_user.idStructure){
            this.RelanceAWho = ""
            this.ValStruRelance = ""
            }
        })
      }

    }
  }

  search() {
    this.data = []
    this._temp = []
    this.selected_Status=""
    this.requeteService.getAllParcours(this.selected_Entite,this.searchText, this.user.id,
      this.checkType()?.id,this.pg.pageSize, this.page,this.selected_Struct,null,null,null,this.type_).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res.data?.data
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
    private observerService:ObserverService
  ) { }


  etapes:any[]=[]
  services:any[]=[]
  departements:any[]=[]
  structureservices:any[]=[]
  structures:any[]=[]
  structures_pre:any[]=[]
  ministere:any[]=[]
  themes :any[]=[]
  natures:any[]=[]

  isGeneralDirector = false
  isAdmin = false
  isSuperieur = false
  typeRequete:any = "requetes"
  RelanceAWho = ""
  ValStruRelance = ""
  
  show_step(id:any) {
    return this.etapes.find((e:any) => (e.id == id))
  }

  key_type_req = ""

  relancerPreocuppationType(){
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    // this.cpt = 0
    // if (this.selected_data.parcours.length > 0) {
    //   this.selected_data.parcours.forEach((item:any) => {
    //     this.cpt++;
    //     if (this.cpt == this.selected_data.parcours.length && item.idStructure == this.selected_Struct){
    //         AppSweetAlert.simpleAlert("Erreur", "Impossible de faire une relance car le responsable structure a déjà donnée sa réponse", 'error');
    //         return;
    //       }
    //   })
    // }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Réponse déjà transmise à l'usager.", 'error');
      return;
    }
    if(this.ValStruRelance == ""){
      AppSweetAlert.simpleAlert("Erreur", "Impossible de relancer sur cette requête.", 'error');
      return;
    }else{
      let idstrRel
      idstrRel = this.user.agent_user == null ? '' : this.user.agent_user.idStructure
      if(idstrRel == ''){
        AppSweetAlert.simpleAlert("Erreur", "Impossible de faire une relance car cet utilisateur n'est associé à aucune structure.", 'error');
        return;
      }
      this.requeteService.relanceRequetType(this.selected_data.id, this.ValStruRelance,idstrRel).subscribe((rest: any) => {
        if(rest.status == "error"){
          AppSweetAlert.simpleAlert("Erreur",rest.message, 'error');
        }else{
          this.init(this.page)
          this.modalService.dismissAll()
          AppSweetAlert.simpleAlert("Relancer "+this.RelanceAWho+" en charge de la préoccupation", "Relance envoyée avec succès à l'adresse : "+rest.message, 'success')
          this.selected_data = null
        }
      })

    }
    
  }
  checkType() {
    
    this.key_type_req = this.activatedRoute.snapshot.paramMap.get('type_req') ?? "" 
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
  print(){
    var url= ConfigService.toApiUrl('print-requete')
    if(this.user) url+="?ie="+this.selected_Entite
    if(this.searchText) url+="&se="+this.searchText
    if(this.user) url+="&u="+this.user.id
    if(this.checkType()) url+="&pdir="+this.checkType()?.id
    if(this.selected_Status) url+="&s="+this.selected_Status
    if(this.select_date_start) url+="&db="+this.select_date_start
    if(this.select_date_end) url+="&df="+this.select_date_end
    if(this.selected_Struct) url+="&is="+this.selected_Struct
    
    window.open(url, "_blank")  
  }
  relanceReponse() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }

    var msgConfirm = "Voulez-vous relancer l'éxcution de cette requête ? \n Si oui un mail sera envoyé à la structure concernée.";
    var confirmResult = confirm(msgConfirm);
    if (confirmResult === false) return;
    
    this.cpt = this.selected_data.affectation.length;
    if(this.cpt >= 2){
      this.selected_data.affectation.forEach((element:any) => {
        this.nbr +=1
        if(this.nbr == this.cpt){
          var param = {
            idStructure: element.idStructure,          
            idRequete: element.idRequete,          
          };
          this.requeteService.mailrelance(param).subscribe((rest: any) => {
            this.init(this.page)
            this.modalService.dismissAll()
            AppSweetAlert.simpleAlert("Relance effectuée", "Relance envoyée avec succès", 'success')
          })
        }
      });

    }else{
      AppSweetAlert.simpleAlert("Erreur", "Impossible de relancer cette requête elle n'est pas affecté à une entité externe.", 'error');
    }
   
  }

  ngOnInit(): void {
    this.observerService.setTitle(`Parcours des ${this.typeRequete}`)
    this.prepare()
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.prepare()
        }
      })
  }
  
  relancerPreocuppation(){
    

    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }

    if (this.selected_data.traiteOuiNon == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Réponse déjà transmise à l'usager.", 'error');
      return;
    }
    if (this.selected_data.service == null) {
      AppSweetAlert.simpleAlert("Erreur", "Impossible de relancer cette demande. Elle n'est relié à aucun service.", 'error');
      return;
    }

    this.requeteService.relanceRequet(this.selected_data.id).subscribe((rest: any) => {
      this.init(this.page)
      this.modalService.dismissAll()
      AppSweetAlert.simpleAlert("Relancer la structure en charge de la préoccupation", "Relance envoyée avec succès", 'success')
    })
    
  }

  onEntiteChange(event:any){
    console.log(event.target.value)
    this.themes = []
    this.thematiqueService.getAll(event.target.value).subscribe((res: any) => {
      this.themes = res
    })
  }
  selected_Idtype = ''

  onThematiqueChange(event:any){
    this.selected_Idtype = event.target.value
    this.structures = []
    this.structureService.getStructureParThematique(this.selected_Idtype).subscribe((res:any)=>{
      this.structures = res.data
    })
  }
  prepare() {
   

    if (this.localService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName)
      // console.log('eeeeeeeeeeee') 
      // console.log(this.user)
      if (this.user.profil_user?.CodeProfil === 12) {
        this.isGeneralDirector = true;
      } else {
        this.isGeneralDirector = false;
      }
      if (this.user.profil_user?.CodeProfil === 2 || this.user?.agent_user?.structure?.type_s == 'dg') { //Administrateur - SGM - DC -MINISTRE
        this.isAdmin = true;
        this.selected_Struct = '-1'
        this.selected_Entite = '-1'
      } else {
        this.isAdmin = false;
        this.selected_Struct = this.user.agent_user.idStructure
        this.selected_Entite = this.user.idEntite
      }
      if (this.user.profil_user?.CodeProfil === 5 || this.user.profil_user.CodeProfil === 6 || this.user.profil_user.CodeProfil === 7) { //SGM - DC -MINISTRE
        this.isSuperieur = true;
        this.selected_Struct = '-1'
      } else {
        this.isSuperieur = false;
        this.selected_Struct = this.user?.agent_user?.idStructure
      }
    }
    this.selected_Entite=this.user?.idEntite
    this.etapes = []
    this.etapeService.getAll(this.selected_Entite).subscribe((res: any) => {
      this.etapes = res.data
      this.activatedRoute.queryParams.subscribe((x:any) => this.init(x.page || 1));
    })
    

    this.subject.subscribe((val) => {
      this.typeRequete = this.checkType()?.name ?? "";
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
    this.ministere = []
    this.prestationService.getAllEntite().subscribe((res: any) => {
      this.ministere = res.data
    })

    this.structures_pre = []
    this.structureService.getStructurePreocEnAttente(this.user?.idEntite).subscribe((res:any)=>{
      this.structures_pre = res.data
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
    this.spinner.show();
    this.requeteService.getAllParcours(this.selected_Entite,null, this.user.id,
      this.checkType()?.id
      ,this.pg.pageSize, page,this.selected_Struct,null,null,null,"").subscribe((res: any) => {
        this.spinner.hide();
        if (res.isPaginate) {
          this.data = res.data.data
          this.pg.total=res.data.total
        }else{
          this.data = res.data
        }
        console.log( this.data)
        this.subject.next(res);
      })
      this.RelanceAWho = ''

    // this.departements = []
    // this.usagersService.getAllDepartement().subscribe((res: any) => {
    //   this.departements = res
    // })
    // this.services = []
    // this.prestationService.getAll(this.selected_Entite).subscribe((res: any) => {
    //   this.services = res
    // })
    // this.structureservices = []
    // this.structureService.getAllStructureByUser(this.user.id).subscribe((res: any) => {
    //   this.structureservices = res
    // })
    // this.natures = []
    // this.natureService.getAll(this.selected_Entite).subscribe((res: any) => {
    //   this.natures = res
    // })
    // this.structures = []
    // this.structureService.getAll(1,this.selected_Entite).subscribe((res:any)=>{
    //   this.structures = res
    // })

    if (this.selected_Idtype) {
      this.structures = []
      this.structureService.getStructureParThematique(this.selected_Idtype).subscribe((res:any)=>{
        this.structures = res.data
      })
    }
   
    this.themes = []
    this.thematiqueService.getAll(this.selected_Entite).subscribe((res: any) => {
      this.themes = res.data
    })


  }

  selected_Struct=""

  type_=""
  selected_Entite=""
  select_date_start=""
  select_date_end=""
  filter(value:any){
    // console.log(this.user)
    if (this.user.profil_user?.CodeProfil === 2 || this.user.profil_user.CodeProfil === 5 || this.user.profil_user.CodeProfil === 6 || this.user.profil_user.CodeProfil === 7 || this.user.id === 98) { //Administrateur et directeur
      this.selected_Struct = value.structure
      this.type_ = value.idType
    } else {
      this.type_ = ""
      this.selected_Struct = this.user?.agent_user?.idStructure
    }
    this.data = []
    this.requeteService.getAllParcours(this.selected_Entite,this.searchText, this.user.id,
      this.checkType()?.id,this.pg.pageSize,0,this.selected_Struct,value.statut=="" ? null : value.statut,value.startDate,value.endDate,this.type_).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res.data?.data
        this.subject.next(res);
    })
  }
  reset(){
    this.selected_Struct=""
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
daysTodayFromDate(checkdate: any) {
  const d = this.decomposeDate(checkdate);

  if (!d || !d.year || !d.month || !d.day) return "-";

  // Attention : mois en JS commence à 0
  const date = new Date(d.year, d.month - 1, d.day);

  const timeDiff = new Date().getTime() - date.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
}

daysBetweenTwoDate(date2: any, date1: any) {
  const d2 = this.decomposeReverseDate(date2);
  const d1 = this.decomposeDate(date1);

  if (!d1 || !d2) return "-";

  const date4 = new Date(d2.year, d2.month - 1, d2.day);
  const date3 = new Date(d1.year, d1.month - 1, d1.day);

  const timeDiff = date3.getTime() - date4.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
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
