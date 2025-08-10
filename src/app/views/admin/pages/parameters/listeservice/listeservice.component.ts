import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe,DatePipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';
import { forkJoin } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { TypeService } from '../../../../../core/services/type.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';


@Component({
  selector: 'app-listeservice',
  standalone: true,
            imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,NgxSpinnerModule],
  templateUrl: './listeservice.component.html',
  styleUrls: ['./listeservice.component.css'],
   providers: [DatePipe]
})
export class ListeserviceComponent implements OnInit {

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
    is_rh: false,
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
  pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""
loading:any=false
  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term)
    })
    this.collectionSize = this.data.length
  }

  openAddModal(content:any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result:any) => {
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
    if (this.selected_data.dateredac) {
        // Transforme la date en 'yyyy-MM-dd', le seul format que <input type="date"> comprend
        this.selected_data.dateredac = this.datePipe.transform(this.selected_data.dateredac, 'yyyy-MM-dd');
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

  types:any[] = []
  listepieces:any[] = []

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
    private datePipe: DatePipe
  ) { }

  structures: any[] = []

  
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
  }
  
  init() {
    this.spinner.show();
    this.loading = true; 
    if(this.user.agent_user!=null && (this.user.profil_user.direction==1)){
      console.log('test 1')
      this.default_data.idParent=this.user.agent_user.idStructure
           
      this.prestationService.getAllByStructure(this.user.agent_user.idStructure,this.pg.pageSize,this.pg.p).subscribe((res: any) => {
      this.loading = false; 
            this.spinner.hide();


        if (res.data.isPaginate) {
          this.data = res.data.data
          this.pg.total=res.data.total
        }else{
          this.data = res.data

        }
        console.log(this.data)
      })
    }else if(this.user.agent_user!=null && this.user.profil_user.pointfocal==1){
            console.log('test 2')

      this.default_data.idParent=this.user.agent_user.structure.idParent
                   this.loading = false; 
            this.spinner.hide();

      this.prestationService.getAllByStructure(this.user.agent_user.structure.idParent,this.pg.pageSize,this.pg.p).subscribe((res: any) => {
              this.loading=false

        this.spinner.hide();
       // this.data = res.filter((e:any)=>((e.submited==0 || e.submited==false)))
        if (res.data.isPaginate) {
          this.data = res.data.data
          this.pg.total=res.data.total
        }else{
          this.data = res.data

        }
      })
     
    }else if(this.user.agent_user!=null && this.user.profil_user.saisie_adjoint==1){
            console.log('test 3')

      this.spinner.show();
      this.loading=true
      this.prestationService.getAllByCreator(this.pg.pageSize,this.pg.p).subscribe((res: any) => {
              this.loading=false
        this.spinner.hide();
        if (res.data.isPaginate) {
          this.data = res.data.data
          this.pg.total=res.data.total
        }else{
          this.data = res.data

        }
      })
    }else{
            console.log('test 4')

        this.spinner.show();
        this.loading=true
      this.prestationService.getAll(this.user.idEntite,this.pg.pageSize,this.pg.p).subscribe((res: any) => {
        this.spinner.hide();
                this.loading=false
                console.log(res.data.isPaginate)
        if (res.isPaginate) {
          this.data = res.data.data
          this.pg.total=res.data.total
        }else{
          this.data = res.data

        }

      })
    }
   
    if (this.pg.p==0) {
      this.structures = []
    this.structureService.getAll(0  ,this.user.idEntite).subscribe((res: any) => {
      this.structures = res.data
    })
    this.types = []
    this.typesService.getAll(this.user.idEntite).subscribe((res: any) => {
      this.types = res.data
    })
    }
    
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
    if(this.user.profil_user.pointfocal==1){
      this.default_data.idParent=this.user.agent_user.structure.idParent
    }
    if(this.user.profil_user.direction==1) {
      this.default_data.idParent=this.user.agent_user.idStructure
    }
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
  // Dans listeservice.component.ts

edit(value: any) {
  // On crée un nouvel objet "payload" en fusionnant les deux sources :
  // 1. On prend toutes les valeurs de l'objet original (comme l'ID).
  // 2. On écrase ces valeurs avec les nouvelles qui viennent du formulaire (comme la nouvelle dateredac).
  const payload = { ...this.selected_data, ...value };

  // Votre logique existante pour les champs conditionnels reste valide, 
  // mais on l'applique sur le nouvel objet "payload".
  if (payload.delaiFixe == true) {
      payload.nbreJours = payload.nbreJours;
  } else {
      payload.nbreJours = 0;
  }

  if (payload.access_online == true) {
      payload.access_url = payload.access_url;
  } else {
      payload.access_url = null;
  }

  this.prestationService.update(payload, payload.id).subscribe({
    next: (res) => {
      this.modalService.dismissAll();
      this.init();
      AppSweetAlert.simpleAlert("Nouvelle modification", "Modification effectuée avec succès", 'success');
    },
    error: (err) => {
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, veuillez vérifier votre connexion internet", 'error');
    }
  });
}
 savePiece() {
    if (!this.listepieces || this.listepieces.length === 0) {
      AppSweetAlert.simpleAlert("Mise à jour pièces", "La liste des pièces est vide.", 'info');
      return;
    }

    this.loading = true;

    const saveRequests = this.listepieces.map(piece => {
      const payload = {
        idService: this.selected_data.id, // On utilise "idService" comme demandé par l'erreur
        libellePiece: piece.libellePiece,
        idEntite: this.user.idEntite
      };
      return this.prestationService.savePiece(payload); // Assurez-vous que votre service attend bien cet objet
    });

    forkJoin(saveRequests).subscribe({
      next: (responses) => {
        this.loading = false;
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert("Mise à jour pièces", "Toutes les pièces ont été enregistrées avec succès", 'success');
        this.init(); // On rafraîchit la liste principale
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.detail) {
          AppSweetAlert.simpleAlert("Mise à jour pièces", err.error.detail, 'error');
        } else {
          AppSweetAlert.simpleAlert("Mise à jour pièces", "Une erreur est survenue lors de l'enregistrement d'une des pièces.", 'error');
        }
      }
    });
  }

  addPiece(value:any) {
    this.listepieces.forEach(function (item) {
      if (item.libellePiece == value.libellePiece)
        AppSweetAlert.simpleAlert("Ajout piece", "Cette pièce a été déjà ajoutée.", 'error')
      return;
    });
    console.log(value)
    value.id = this.listepieces.length + 1,
      this.listepieces.push(value);
  }

  removeRow(i:any) {
    var msgConfirm = "Souhaitez-vous vraiment supprimer la ligne ?";
    var confirmResult = confirm(msgConfirm);
    if (confirmResult === false) return;

    this.listepieces.splice(i, 1)
  }
  getPage(event:any){
    this.pg.p=event
    this.init()
  }
}
