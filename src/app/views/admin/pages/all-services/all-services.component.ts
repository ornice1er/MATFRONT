import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../core/_services/user.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
// import { ServiceService } from '../../../core/_services/service.service';
// import { TypeService } from '../../../core/_services/type.service';
// import { StructureService } from '../../../core/_services/structure.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { NgSelectModule } from '@ng-select/ng-select';
import { ServiceService } from '../../../../core/services/service.service';
import { StructureService } from '../../../../core/services/structure.service';
import { TypeService } from '../../../../core/services/type.service';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { ObserverService } from '../../../../core/utils/observer.service';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
    standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  
})
export class AllServicesComponent implements OnInit {

  activeTab = 1;
  activeTab2=1;
  
  @Input() cssClasses = '';
  errormessage = ""
  page = 1;
  pageSize = 10;
  searchText = ""
  closeResult = '';
  errorajout = ""
  permissions!: any[];
  def_cost=0
  error = ""
  data: any[] = [];
  _temp: any[] = [];
  showNbreJour = false
  show_access_online=false
  selected = [
  ];
  current_permissions: any[] = []
  collectionSize = 0;
  selected_data: any
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
    lieuDepot: "",
    lieuRetrait: "",
    listepieces: [],
    nbreJours: 0,
    nomPresidentSG: null,
    nomSousG: null,
    obligatoire: "",
    piecesAFournir: null,
    published: 0,
    published_at: null,
    published_by: null,
    submited: 0,
    textesRegissantPrestation: ""
  }
  types:any[] = []
  listepieces:any[] = []
  structures: any[] = []
  user:any

  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term)
    })
    this.collectionSize = this.data.length
  }

  openAddModal(content:any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason({ reason })}`;
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
    this.listepieces = []
    for (var i = 0; i < this.selected_data.listepieces.length; i++) {
      var piece = {
        id: this.listepieces.length + 1,
        libellePiece: this.selected_data.listepieces[i].libellePiece,
      };
      this.listepieces.push(piece);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason({ reason })}`;
    });
  }
  }

  private getDismissReason({ reason }: { reason: any; }): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

 
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private prestationService: ServiceService,
    private structureService: StructureService,
    private typesService: TypeService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService:LocalStorageService,
        private observerService:ObserverService,
  
  ) { }


  ngOnInit() {
    this.observerService.setTitle('TOUS LES SERVICES')
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName)
      this.init()
    }
  }
  checked(event:any, el:any) {
    this.selected_data = el
  }
  
  init() {
    this._temp = []
    this.data = []
    if(this.user.agent_user!=null && (this.user.profil_user.direction==1)){
      this.default_data.idParent=this.user.agent_user.idStructure
      this.prestationService.getAllByStructure(this.user.agent_user.idStructure).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res
        this._temp = this.data
        this.collectionSize = this.data.length
      })
    }else if(this.user.agent_user!=null && this.user.profil_user.pointfocal==1){
      this.default_data.idParent=this.user.agent_user.structure.idParent
      this.prestationService.getAllByStructure(this.user.agent_user.structure.idParent).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res.filter((e:any)=>((e.submited==1 || e.submited==true)))
        this._temp = this.data
        this.collectionSize = this.data.length
      })
    }else if(this.user.agent_user!=null && this.user.profil_user.saisie_adjoint==1){
      this.prestationService.getAllByCreator().subscribe((res: any) => {
        this.spinner.hide();
        this.data = res
        this._temp = this.data
        this.collectionSize = this.data.length
      })
    }else{
      this.prestationService.getAll(this.user.idEntite).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res
        this._temp = this.data
        this.collectionSize = this.data.length
      })
    }
   
    this.structures = []
    this.structureService.getAll(0  ,this.user.idEntite).subscribe((res: any) => {
      this.spinner.hide();
      this.structures = res
    })
    this.types = []
    this.typesService.getAll(this.user.idEntite).subscribe((res: any) => {
      this.spinner.hide();
      this.types = res
    })
  }

  create(value:any) {
    var getNbreJours=0;
    if(this.default_data.delaiFixe==true){getNbreJours=this.default_data.nbreJours;}
    this.default_data.nbreJours=getNbreJours
    var geturl=null
    if(this.default_data.access_online==true){geturl=this.default_data.access_url;}
    this.default_data.access_url=geturl,
    this.default_data.cout=this.default_data.cout=="" ? 0 : +this.default_data.cout  
    this.default_data.cout=this.default_data.cout=="" ? 0 : +this.default_data.cout  
    this.default_data.idEntite=this.user.idEntite
    this.prestationService.create(this.default_data).subscribe((res: any) => {

      this.modalService.dismissAll()
      this.init()

      //this.translate.instant('HOME.TITLE')
      AppSweetAlert.simpleAlert("Nouvel ajout", "Ajout effectué avec succès", 'success')
    }, (err) => {

      if (err.error.detail != null) {
        AppSweetAlert.simpleAlert("Nouvel ajout", err.error.detail, 'error')
      } else {
        AppSweetAlert.simpleAlert("Nouvel ajout", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      }
    })
  }
  filter(event:any){
    let state=event.target.value
    this.data = []
    if(state=="all"){
      this.data=this._temp
    }else{
      this.data=this._temp.filter((e:any)=>(e.published==+state))
    }
    this.collectionSize = this.data.length
  }

  archive() {
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
  publish() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if(this.selected_data.published==1 || this.selected_data.published==true){
      AppSweetAlert.simpleAlert("Publier cette prestation", "Erreur, Cette prestation a déjà été publiée", 'error')
    }
    this.selected_data.published=true
    this.selected_data.submited=true
    AppSweetAlert.confirmBox("Publier cette prestation",
      "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
        if (result.value) {
          this.prestationService.update(this.selected_data,this.selected_data.id).subscribe((res: any) => {
            AppSweetAlert.simpleAlert("Publier cette prestation", "Publication effectuée avec succès", 'success')
            this.init()
          }, (err) => {
            AppSweetAlert.simpleAlert("Publier cette prestation", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
          })
        }
      })
  }
  edit(value:any) {
   // value.id = this.selected_data.id
    var getNbreJours=0;
    var geturl=null;
    if(this.selected_data.delaiFixe==true){getNbreJours=this.selected_data.nbreJours;}

    if(this.selected_data.access_online==true){geturl=this.selected_data.access_url;}
    this.selected_data.access_url=geturl,
    this.selected_data.nbreJours=getNbreJours,
   //   value.published=this.selected_data.published
    this.selected_data.idEntite=this.user.idEntite
        this.prestationService.update(this.selected_data, this.selected_data.id).subscribe((res) => {
          this.modalService.dismissAll()
          this.init()
          AppSweetAlert.simpleAlert("Nouvelle modification", "Motification effectué avec succès", 'success')
        }, (err) => {
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
  }

  savePiece() {
  
    var param = {
      id: this.selected_data.id,
      libelle: this.selected_data.libelle,
      listepieces: this.listepieces,
      idEntite:this.user.idEntite
    };

    this.prestationService.savePiece(param).subscribe((res: any) => {
      this.modalService.dismissAll()
      AppSweetAlert.simpleAlert("Mise à jour pieces", "Mise à jour effectué avec succès", 'success')
      this.init()
    }, (err) => {

      if (err.error.detail != null) {
        AppSweetAlert.simpleAlert("Mise à jour pieces", err.error.detail, 'error')
      } else {
        AppSweetAlert.simpleAlert("Mise à jour pieces", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      }
    })
  }
  addPiece(value:any) {
    this.listepieces.forEach(function (item) {
      if (item.libellePiece == value.libellePiece)
        AppSweetAlert.simpleAlert("Ajout piece", "Cette pièce a été déjà ajoutée.", 'error')
      return;
    });

    value.id = this.listepieces.length + 1,
      this.listepieces.push(value);
    value.id = this.listepieces.length + 1;
    this.listepieces.push(value);
  let msgConfirm :any= "Confirmation suppression ?";
    var confirmResult = confirm(msgConfirm);
    if (confirmResult === false) return;

   // this.listepieces.splice(i, 1)
  }


  removeRow(i:any){

  }

}