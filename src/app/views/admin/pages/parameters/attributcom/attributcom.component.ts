import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { ActeurService } from '../../../../../core/services/acteur.service';

import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { TypeService } from '../../../../../core/services/type.service';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';


@Component({
  selector: 'app-attributcom',
    standalone: true,
        imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  
  templateUrl: './attributcom.component.html',
  styleUrls: ['./attributcom.component.css']
})
export class AttributcomComponent implements OnInit {

  activeTab = 1;
  activeTab2=1;
  
  @Input() cssClasses = '';
  errormessage = ""
  page = 1;
  pageSize = 10;
  searchText = ""
  closeResult = '';
  errorajout = ""
  permissions: any[]=[]
  def_cost=0
  error = ""
  listComm = []
  listUsers: any[] = []
  data: any[] = [];
  _temp: any[] = [];
  showNbreJour = false
  show_access_online=false
  selected = [
  ];
  current_permissions: any[] = []
  collectionSize = 0;
  selected_data: any
  selected_iduser: any
  default_data:any={
    access_online: 0,
    access_url: null,
    view_url: null,
    consiste: "",
    contactPresidentSG: null,
    cout: 0,
    dateredac: "",
    delai: "",
    delaiFixe: 0,
    echeance: "",
    hide_for_public: 0,
    idEntite: null,
    idParent: null,
    idType: null,
    interetDemanderTot: "",
    interetDemandeur: "",
    libelle: "",
    submited: 0,
    textesRegissantPrestation: ""
  }
  pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""

  search() {
    
    this.data = []
    this.prestationService.getAllAttrib(this.selected_iduser).subscribe((res: any) => {
      this.spinner.hide();
      this.data = res
      this._temp = this.data
      this.collectionSize = this.data.length
    })
  }

  openAddModal(content:any) {
    if(this.selected_iduser == "" || this.selected_iduser == null){
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un acteur", 'error');
      return;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditModal(content:any) {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if(this.selected_data.id==440 || this.selected_data.id==441){
      AppSweetAlert.simpleAlert("Modification", "Impossible de modifié cet élément", 'error')
      return
    }
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  types = []
  listepieces = []
  departement:any[]=[]

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private acteursService:ActeurService,
    private prestationService: ServiceService,
    private structureService: StructureService,
    private typesService: TypeService,

    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService:LocalStorageService,
    private observerService:ObserverService
  ) { }

  structures: [] = []
  selectedDepart:any
  commune:any = []
  idDepa:any

  user:any
  ngOnInit() {
    this.observerService.setTitle('')

    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName)
      this.init()
    }
  }
  checked(event:any, el:any) {
    
    this.selected_data = el
    this.idDepa = el.commune.depart_id
    this.chargerCommune(this.idDepa)
  }
  onDepartChange(event:any){
    this.selectedDepart=+event.target.value
    this.chargerCommune(this.selectedDepart)
  }
  chargerCommune(idDepartt:any){
    this.commune = []
    this.acteursService.getAllCommune(idDepartt).subscribe((res: any) => {
      this.commune = res
    })
  }
  init() {
    
    this._temp = []
    this.data = []
      this.prestationService.getAllAttrib(this.user.id).subscribe((res: any) => {
        this.spinner.hide();
        if (res.data.isPaginate) {
          this.data = res.data.data
          this.pg.total=res.data.total
        }else{
          this.data = res.data

        }
      })
      this.listUsers = []
      this.userService.getAllActeur(this.user.idEntite).subscribe((res:any)=>{
        this.listUsers = res
      })
      this.departement=[]
        this.acteursService.getAllDepart().subscribe((res:any)=>{
          this.departement=res
      })
  }

  create(value:any) {
    
    if(value.idDepart == null || value.idDepart == ""){
      AppSweetAlert.simpleAlert("Erreur","Veuillez choisir un département.", 'error')
    }else if(value.idComm == null || value.idComm == ""){
      AppSweetAlert.simpleAlert("Erreur","Veuillez choisir une commune.", 'error')
    }else{
      value.id_user = this.selected_iduser
      this.acteursService.createAttri(value).subscribe((res:any)=>{
        if(res.success == false){
          AppSweetAlert.simpleAlert("Erreur","Cette commune est déjà ajouté à cet acteur", 'error')
        }else{
          AppSweetAlert.simpleAlert("Nouvel ajout","Ajout effectué avec succès" , 'success')
        }
       this.selected_data = null
       this.modalService.dismissAll() 
       this.search() 
      },(err:any)=>{
        if(err.error.detail!=null){    
          AppSweetAlert.simpleAlert("Nouvel ajout", err.error.detail, 'error')
        }else{
          AppSweetAlert.simpleAlert("Nouvel ajout", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
        }
      })
    }
  }


  archive() {
    if(this.selected_data.id==440 || this.selected_data.id==441){
      AppSweetAlert.simpleAlert("Suppression", "Impossible de supprimé cet élément", 'error')
      return
    }
    AppSweetAlert.confirmBox("Suppression",
      "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
        if (result.value) {
          this.prestationService.delete(this.selected_data.id).subscribe((res: any) => {
            this.init()
            AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success')
           
          }, (err) => {
            AppSweetAlert.simpleAlert("Suppression", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
          })
        }
      })
  }
  submit() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if(this.selected_data.submited==1 || this.selected_data.submited==true){
      AppSweetAlert.simpleAlert("Soumettre cette prestation", "Erreur, Cette prestation a déjà été publiée", 'error')
    }
    this.selected_data.submited=true
    this.selected_data.published=false
    AppSweetAlert.confirmBox("Soummettre cette prestation",
      "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
        if (result.value) {
          this.prestationService.update(this.selected_data,this.selected_data.id).subscribe((res: any) => {
            AppSweetAlert.simpleAlert("Soumettre cette prestation", "Soumission effectuée avec succès", 'success')
            this.init()
          }, (err) => {
            AppSweetAlert.simpleAlert("Soumettre cette prestation", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
          })
        }
      })
  }

  edit(value:any) {
    
    if(value.idDepart == null || value.idDepart == ""){
      AppSweetAlert.simpleAlert("Erreur","Veuillez choisir un département.", 'error')
    }else if(value.idComm == null || value.idComm == ""){
      AppSweetAlert.simpleAlert("Erreur","Veuillez choisir une commune.", 'error')
    }else{
      value.id= this.selected_data.id
      value.id_user= this.selected_data.id_user
      this.acteursService.updateAttri(value,this.selected_data.id).subscribe((res:any)=>{
        if(res.success == false){
          AppSweetAlert.simpleAlert("Erreur","Cette commune est déjà ajouté à cet acteur", 'error')
        }else{
          AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
        }
        this.selected_data = null
        this.modalService.dismissAll()
        this.search()
      }, (err:any)=>{
        AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
  }

  removeRow(i:any) {
    var msgConfirm = "Souhaitez-vous vraiment supprimer la ligne ?";
    var confirmResult = confirm(msgConfirm);
    if (confirmResult === false) return;

    this.listepieces.splice(i, 1)
  }

  getPage(event:any){
    this.pg.p=event
  }
}
