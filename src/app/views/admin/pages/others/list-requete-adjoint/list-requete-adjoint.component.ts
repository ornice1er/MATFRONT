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

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { EtapeService } from '../../../../../core/services/etape.service';

import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { ConfigService } from '../../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';


@Component({
  selector: 'app-list-requete-adjoint',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterModule],
  templateUrl: './list-requete-adjoint.component.html',
  styleUrls: ['./list-requete-adjoint.component.css']
})
export class ListRequeteAdjointComponent implements OnInit {

  @Input() cssClasses = '';
  errormessage = ""
  erroraffectation = ""
  searchText = ""
  closeResult = '';
  permissions: any[] =[]
  error = ""
  data: any[] = [];
  _temp: any[] = [];
  collectionSize = 0;
  page = 1;
  pageSize = 10;

  data2: any[] = [];
  _temp2: any[] = [];
  collectionSize2 = 0;
  page2 = 1;
  pageSize2 = 10;

  selected = [];
  current_permissions: any[] = []
  selected_data: any
  pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""
  search() {
    this.data = []
    this._temp = []
    this.requeteService.getAllRequest(this.user.idEntite,this.searchText, 0, this.user.id, "Division",
      this.checkType()?.id, this.pg.pageSize,this.page).subscribe((res: any) => {
        this.spinner.hide();
        // this.data = res.data
        // this._temp = this.data
        // this.subject.next(res);
        console.log('Réponse API brute:', res);
       if (res && res.data) {
      if (res.data.isPaginate) {
        this.data = res.data.data; // Utiliser res.data.data pour les données paginées
        this.pg.total = res.data.total;
        this.pg.p = res.data.current_page;
      } else if (typeof res.data === 'object' && !Array.isArray(res.data)) {
        this.data = Object.values(res.data);
        this.pg.total = this.data.length;
      } else if (Array.isArray(res.data)) {
        this.data = res.data;
        this.pg.total = this.data.length;
      } else {
        this.data = [];
        this.pg.total = 0;
      }
    } else {
      this.data = [];
      this.pg.total = 0;
    }
    console.log('Données après conversion:', this.data);
    console.log('Nombre d\'éléments:', this.data.length);
    console.log('Premier élément:', this.data[0]);
    this._temp = this.data;
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
    private requeteService: RequeteService,
    private localService: LocalStorageService,
    private prestationService: ServiceService,
    private structureService: StructureService,
    private usagersService: UsagerService,

    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private etapeService: EtapeService,
        private localStorageService:LocalStorageService,
        private observerService:ObserverService
    
  ) { }

  etapes:any[] = []
  services:any[] = []
  departements = []
  structureservices = []
  user: any
  isGeneralDirector = false
  isSended = false
  typeRequete:any = "requetes"
  usager_full_name=""

  checked(event:any, el:any) {
    this.selected_data = el

    if(this.selected_data.usager == null){
      this.usager_full_name=" (PFC) "+this.selected_data.email+" Contact : "+this.selected_data.contact
    }else{
      this.usager_full_name=this.selected_data.usager.nom+" "+this.selected_data.usager.prenoms
    }
    if (this.selected_data.reponse.length > 0) {
      this.selected_data.reponse.forEach((item:any) => {
        if (item.typeStructure == 'SRU Secondaire')
          this.selected_data.texteReponseApportee = item.texteReponse;

        /*if (item.typeStructure == '')
          this.selected_data.reponseService = item.texteReponse;*/
      });
    }


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
    this.etapeService.getAll(this.user.idEntite).subscribe((res: any) => {
      this.etapes = res
      this.activatedRoute.queryParams.subscribe((x:any)=> this.init(x.page || 1));
    })

    this.typeRequete = this.checkType()?.name;
    
    this.subject.subscribe((val) => {

      this.typeRequete = this.checkType()?.name;
    
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

  init(page:any) {
    this._temp = []
    this.data = []
    this.requeteService.getAllRequest(this.user.idEntite,null, 0, this.user.id, this.user.agent_user.idStructure,
      this.checkType()?.id
      
      ,this.pg.pageSize, page).subscribe((res: any) => {
        this.spinner.hide();
        this.subject.next(res);
        // if (res.data.isPaginate) {
        //   this.data = res.data.data
        //   this.pg.total=res.data.total
        // }else{
        //   this.data = res.data

        // }
        console.log('Réponse API brute:', res);
if (res && res.data) {
      if (res.data.isPaginate) {
        this.data = res.data.data; 
        this.pg.total = res.data.total;
        this.pg.p = res.data.current_page;
      } else if (typeof res.data === 'object' && !Array.isArray(res.data)) {
        this.data = Object.values(res.data);
        this.pg.total = this.data.length;
      } else if (Array.isArray(res.data)) {
        this.data = res.data;
        this.pg.total = this.data.length;
      } else {
        this.data = [];
        this.pg.total = 0;
      }
    } else {
      this.data = [];
      this.pg.total = 0;
    }
    console.log('Données après conversion:', this.data);
    console.log('Nombre d\'éléments:', this.data.length);
    console.log('Premier élément:', this.data[0]);
    this._temp = this.data;
    this.subject.next(res);
      })
    this.departements = []
    this.usagersService.getAllDepartement().subscribe((res: any) => {
      this.departements = res
    })
    this.services = []
    this.prestationService.getAll(this.user.idEntite).subscribe((res: any) => {
      this.services = res.filter((e:any)=>(e.published==1))
    })

    this.structureservices = []
    this.structureService.getAllStructureByUser(this.user.id).subscribe((res: any) => {
      this.structureservices = res
    })

  }
  saveReponse(value:any) {

    if(value.texteReponseApportee == null || value.texteReponseApportee == ""){
      AppSweetAlert.simpleAlert("Erreur", "Veuillez saisir votre réponse", 'error');
      return;
    }
    let complementReponse = "";
    if (value.interrompu == true)
      complementReponse = "\n\nRaison de l'interruption: " + "\n" + value.raisonRejet;
    else
      if (value.rejet == true)
        complementReponse = "\n\nRaison du rejet: " + "\n" + value.raisonRejet;

    if (value.interrompu == true)
      if (value.texteReponseApportee.indexOf("Raison de l'interruption:") == -1)
        value.texteReponseApportee += complementReponse;

    if (value.rejet == true)
      if (value.texteReponseApportee.indexOf("Raison du rejet:") == -1)
        value.texteReponseApportee += complementReponse;

    var val = {
      idRequete: this.selected_data.id,
      typeStructure: 'SRU Secondaire',
      texteReponse: value.texteReponseApportee,
      idEtape: 5,
      interrompu: value.interrompu,
      rejete: value.rejete,
      idEntite:this.user.idEntite,
      raisonRejet: value.raisonRejet
    };
    this.requeteService.saveReponse(val).subscribe((res: any) => {
      if (this.isSended) {
        var paramInternal = {
          idRequete: this.selected_data.id,
          typeStructure: 'SRU Secondaire',
          typeSuperieur: 'SRU',
          idEntite:this.user.idEntite,
          idEtape: 5,
        };
        this.requeteService.transmettreReponse(paramInternal).subscribe((rest: any) => {
          this.init(this.page)
          this.modalService.dismissAll()
          AppSweetAlert.simpleAlert("Nouvelle réponse", "Réponse envoyée et transmise avec succès", 'success')
        })
      } else {
        this.init(this.page)
        this.modalService.dismissAll()
        AppSweetAlert.simpleAlert("Nouvelle réponse", "Réponse envoyée avec succès", 'success')
      }

    })
  }


  transmettreReponse() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Réponse déjà transmise à l'usager.", 'error');
      return;
    }


    if (this.selected_data.reponse.length > 0) {
      let check = this.selected_data.reponse.filter((item:any) => (item.typeStructure=='SRU Secondaire'));
      if(check.length == 0){
        AppSweetAlert.simpleAlert("Erreur","Veuillez affecter ou traiter la préoccupation." , 'error') ;
      }
    }else{
    AppSweetAlert.simpleAlert("Erreur", "Veuillez affecter ou traiter la préoccupation.", 'error');

    }


    if (this.selected_data.reponseSRUSecondaire == '' || this.selected_data.reponseSRUSecondaire == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez valider la réponse de votre structure avant de transmettre.", 'error');
      return;
    }

    if (this.selected_data.reponse.length > 0) {
      let check = this.selected_data.reponse.filter((item:any) => (item.typeStructure=='SRU Secondaire' && item.siTransmis==1));
      if(check.length != 0){
        AppSweetAlert.simpleAlert("Erreur","Votre réponse à déjà été transmise à votre supérieur" , 'error') ;
      }
    }

    var msgConfirm = "Voulez-vous transmettre la réponse ?";
    var confirmResult = confirm(msgConfirm);
    if (confirmResult === false) return;
    var param = {
      idRequete: this.selected_data.id,
      typeStructure: 'SRU Secondaire',
      idEntite:this.user.idEntite,
      typeSuperieur: 'SRU',
      idEtape: 5,
    };
    this.requeteService.transmettreReponse(param).subscribe((rest: any) => {
      this.init(this.page)
      this.modalService.dismissAll()
      AppSweetAlert.simpleAlert("Nouvelle réponse", "Réponse envoyée et transmise avec succès", 'success')
    })
  }

  displayResource() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }

    if (this.selected_data.fichier_joint.length == 0) {
      AppSweetAlert.simpleAlert("Erreur", "Aucun fichier attaché.", 'error');
      return;
    }
    var filePath = ConfigService.toFile(this.selected_data.fichier_joint);
    window.open(filePath);
  }

  getPage(event:any){
    this.pg.p=event
this.init(this.pg.p);  }
}
