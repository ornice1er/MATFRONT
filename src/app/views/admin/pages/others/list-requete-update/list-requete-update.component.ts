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
import { InstitutionService } from '../../../../../core/services/institution.service';

import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';



@Component({
  selector: 'app-list-requete-update',
  standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterModule],
  templateUrl: './list-requete-update.component.html',
  styleUrls: ['./list-requete-update.component.css']
})
export class ListRequeteUpdateComponent implements OnInit {

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

  
  selected = [];
  current_permissions: any[] = []
  selected_data: any
  isSended = false

  search() {
    this.data = []
    this._temp = []
    this.requeteService.getAllRequest(this.user.idEntite,this.searchText, 0, this.user.id, "",
      "", this.page).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res.data;
        // this.data = res.data.filter((e:any)=>{
        //   if(e.lastparcours != null){
        //     return (e.lastparcours.idEtape==1) || 
        //               (e.lastparcours.idEtape==5) || 
        //               (e.lastparcours.idEtape==7 && e.lastparcours.idStructure == this.user.agent_user.idStructure) ||
        //               (e.lastparcours.idEtape==8 && e.lastparcours.idEntite == this.user.idEntite);
        //   }else{
        //     return (e.lastparcours == null);
        //   }
        // })
        this._temp = this.data
        this.subject.next(res);
      })
  }

  openAddModal(content:any) {
    if (this.selected_data != null) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error')
    }
  }

  openEditModal(content:any, el:any) {
    this.selected_data = el
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    // this.selected_data=null
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
    private localStorageService:LocalStorageService,
    private institutionService:InstitutionService,
    private etapeService: EtapeService,
    private requeteService: RequeteService,
    private localService: LocalStorageService,
    private prestationService: ServiceService,
    private structureService: StructureService,
    private usagersService: UsagerService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private observerService:ObserverService
  ) { }


  etapes:any[] = []
  services:any[] = []
  departements = []
  structureservices = []

  isGeneralDirector = false
  usager_full_name=""
  hide_actions=false
  action_transmettre = true
  RelanceAWho = ""
  ValStruRelance = ""
  cpt = 0
  compteData = 0
  
  checked(event:any, el:any) {
    this.selected_data = el
    if(this.selected_data.usager == null){
      this.usager_full_name=" (PFC) "+this.selected_data.email+" Contact : "+this.selected_data.contact
    }else{
      this.usager_full_name=this.selected_data.usager.nom+" "+this.selected_data.usager.prenoms
    }
    console.log(this.selected_data)
    // console.log(this.user)
    // console.log(this.user)
    if (this.selected_data.reponse.length > 0) {
      this.selected_data.reponse.forEach((item:any) => {
        if (item.typeStructure == 'Direction')
          this.selected_data.texteReponseApportee = item.texteReponse;

        if (item.typeStructure == 'Service')
          this.selected_data.reponseService = item.texteReponse;
      });
    }
    this.action_transmettre = true
    if (this.selected_data.reponse.length > 0) {
      let check = this.selected_data.reponse.filter((item:any) => (item.typeStructure=='Direction'));
      if(check.length == 0){
        // AppSweetAlert.simpleAlert("Erreur","Veuillez affecter ou traiter la préoccupation." , 'error') ;
        this.action_transmettre = false
      }
    }else{
      // AppSweetAlert.simpleAlert("Erreur", "Veuillez affecter ou traiter la préoccupation.", 'error');
      this.action_transmettre = false
    }

    this.hide_actions=false
    if (this.selected_data.affectation.length > 0) {
      this.selected_data.affectation.forEach((item:any) => {
        if (item.typeStructure == 'Service'){ this.hide_actions=true;}
      })

    }

    // this.RelanceAWho = ""
    // this.ValStruRelance = ""
    // this.cpt = 0
    // if (this.selected_data.affectation.length > 0) {
    //   this.selected_data.affectation.forEach((item:any) => {
    //     this.cpt++;
    //     // console.log("Cpt : "+this.cpt,"Nombre : "+this.selected_data.affectation.length,"itemStruc : "+item.idStructure,"UserStructure : "+this.user.agent_user.idStructure)
    //     if (this.cpt == this.selected_data.affectation.length && item.idStructure != this.user.agent_user.idStructure){
    //          this.RelanceAWho = item.typeStructure;
    //          this.ValStruRelance = item.idStructure;
    //       }
    //   })
    // }
    // this.cpt = 0
    // if (this.selected_data.parcours.length > 0) {
    //   this.selected_data.parcours.forEach((item:any) => {
    //     this.cpt++;
    //     if (this.cpt == this.selected_data.parcours.length && item.idStructure == this.user.agent_user.idStructure){
    //       this.RelanceAWho = ""
    //       this.ValStruRelance = ""
    //       }
    //   })
    // }
  }
  
  show_step(id:any) {
    return this.etapes.find((e:any) => (e.id == id))
  }
 

  key_type_req = ""

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

  ngOnInit(): void {
    this.observerService.setTitle('')

    this.prepare()
    this.RelanceAWho = ""
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
    }
    this.etapes = []
    this.etapeService.getAll(this.user.idEntite).subscribe((res: any) => {
      this.etapes = res
      this.activatedRoute.queryParams.subscribe((x:any)=> this.init(x.page || 1));
    })
    
    this.subject.subscribe((val) => {
      
      this.pager = val
      this.page = this.pager.current_page

      let pages = []
      if (this.pager.last_page <= 5) {
        for (let index = 1; index <= this.pager.last_page; index++) {
          pages.push(index)
        }
      } else {
        let start = (this.page > 3 ? this.page - 2 : 1)
        let end = (this.page + 2 < this.pager.last_page ? this.page + 2 : this.pager.last_page)
        for (let index = start; index <= end; index++) {
          pages.push(index)
        }
      }

      this.pager.pages = pages
      this.compteData = this.pager.total
    });
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

  institutions:any[]=[]
  _cpt = 0;
  _data_affect = 0


  init(page:any) {
    console.log('eeeeeeeeeeeeeeeeeee')
    console.log(this.user)
    this._temp = []
    this.data = []
    this.requeteService.getAllRequest(this.user.idEntite,null, 0, this.user.id, "", "", page).subscribe((res: any) => {
        this.spinner.hide();
        this.subject.next(res);
        this.data = res.data;
        // this.data = res.data.filter((e:any)=>{
        //   if(e.lastparcours != null){
        //     return (e.lastparcours.idEtape==1) || 
        //               (e.lastparcours.idEtape==5) || 
        //               (e.lastparcours.idEtape==7 && e.lastparcours.idStructure == this.user.agent_user.idStructure) ||
        //               (e.lastparcours.idEtape==8 && e.lastparcours.idEntite == this.user.idEntite);
        //   }else{
        //     return (e.lastparcours == null);
        //   }
        // })
        this._temp = this.data
      })
    
    this.departements = []
    this.usagersService.getAllDepartement().subscribe((res: any) => {
      this.departements = res
    })
    this.services = []
    this.__services=[]
    this.prestationService.getAll(this.user.idEntite).subscribe((res: any) => {
      this.services = res.filter((e:any)=>(e.published==1))
      this.services= this.services
    })

    this.structures = []
    this.structureService.getAll(1,this.user.idEntite).subscribe((res:any)=>{
      this.structures = res
    })

    this.structureservices = []
    this.structureService.getAllStructureByUser(this.user.id).subscribe((res: any) => {
      this.structureservices = res
    })

    this.institutionService.getAll().subscribe((res: any) => {
      this.institutions = res
    })


  }

  Modifier_Requete(value:any) {

    if(value.plainte == null ){
      AppSweetAlert.simpleAlert("Erreur", "Veuillez sélectionner le type", 'error');
      return;
    }

    var val = {
      idRequete: this.selected_data.id,
      plainte: value.plainte,
    };
    this.requeteService.ModifierReque(val).subscribe((res: any) => {

        this.init(this.page)
        this.modalService.dismissAll()
        AppSweetAlert.simpleAlert("Modification", "Modification effectuée avec succès", 'success')
        setTimeout(()=>{                          
          window.location.reload()
      }, 2000);
    })
    
  }


  __services:any=[]
  structures:any=[]
  onEntiteChange(event:any){
 
    this.structures = []
    this.structureService.getAll(1,+event.target.value).subscribe((res:any)=>{
      this.structures = res
    })

    this.services = []
    this.__services=[]
    this.prestationService.getAll(+event.target.value).subscribe((res: any) => {
      this.services = res.filter((e:any)=>(e.published==1))
      this.services= this.services
    }) 

  }

  onStructureChange(event:any){
    this.services=[]
    this.__services.forEach((item:any) => {
      if (item.idParent == event.target.value)
        this.services.push(item);
    });
  }
  
  transferPreocuppation(value:any){
    

    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Réponse déjà transmise à l'usager.", 'error');
      return;
    }

    var param = {
      idStructure: value.idStructure,
      id_user: this.user.id,
      idEntiteReceive: value.idEntiteReceive,
      idPrestation: value.idPrestation,
    };
    AppSweetAlert.confirmBox("Transférer cette préoccupation à un autre ministère/institution",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
        this.requeteService.transfertRequet(param,this.selected_data.id).subscribe((rest: any) => {
          this.init(this.page)
          this.modalService.dismissAll()
          AppSweetAlert.simpleAlert("Transfert préoccupation", "Transfert effectué avec succès", 'success')
        })
      }
    })
  }
  transfertInternePreocuppation(value:any){
      

    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Réponse déjà transmise à l'usager.", 'error');
      return;
    }

    var param = {
      idStructure: value.idStructure,
      idEntite: this.user.idEntite,
      id_user: this.user.id,
      idPrestation: value.idPrestation,
    };
    if (param.idStructure == null || param.idStructure == "") {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez sélectionner la structure", 'error');
      return;
    }else if (param.idPrestation == null || param.idPrestation == "") {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez sélectionner la prestation", 'error');
      return;
    }
    AppSweetAlert.confirmBox("Transférer cette préoccupation à la structure",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
        this.requeteService.transfertRequetInterne(param,this.selected_data.id).subscribe((rest: any) => {
          this.init(this.page)
          this.modalService.dismissAll()
          AppSweetAlert.simpleAlert("Transfert préoccupation", "Transfert effectué avec succès", 'success')
        })
      }
    })
  }
  reorienterPreocuppation(value:any){

    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer ", 'error');
      return;
    }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Réponse déjà transmise à l'usager.", 'error');
      return;
    }
    let idStructure=0
    if(value.idPrestation=="440"){
      idStructure=58
    }
    if(value.idPrestation=="441"){
      idStructure=75
    }
    var param = {
      idStructure: idStructure,
      idEntite: this.user.idEntite,
      idPrestation: value.idPrestation,
    };
    AppSweetAlert.confirmBox("Réorienter cette préoccupation",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
        this.requeteService.transfertRequetInterne(param,this.selected_data.id).subscribe((rest: any) => {
          this.init(this.page)
          this.modalService.dismissAll()
          AppSweetAlert.simpleAlert("Réorientation préoccupation", "Réorientation effectué avec succès", 'success')
        })
      }
    })
  }
}
