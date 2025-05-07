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

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { NatureRequeteService } from '../../../../../core/services/nature-requete.service';
import { ProfilService } from '../../../../../core/services/profil.service';
import { RdvCreneauService } from '../../../../../core/services/rdv-creneau.service';
import { RdvService } from '../../../../../core/services/rdv.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { TypeService } from '../../../../../core/services/type.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';


@Component({
  selector: 'app-listusager',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterModule],
  templateUrl: './listusager.component.html',
  styleUrls: ['./listusager.component.css']
})
export class ListusagerComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;

  errormessage=""
  pageSize = 10;
  searchText=""
  closeResult = '';
   permissions:any[]=[]
  error=""
  data: any[]=[];
  dataNT: any[] = [];
  _temp: any[]=[];

  selected = [
  ];
  current_permissions:any[]=[]
  collectionSize = 0;
  selected_data:any
  link_to_prestation=1
  selected_type_preoccupation=0
  structures:any[]=[] 

  search(){ 
    this.data=[]
    this._temp=[]
    this.usagersService.getAll(this.searchText,this.page).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.data
      this._temp=this.data
      this.subject.next(res);
    })
  }
  
  openAddModal(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditModal(content:any){
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  requetes=[]
  openRdvModal(content:any){
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    this.requeteService.getAllForUsager(
      this.selected_data.id
      , 1).subscribe((res: any) => {
          this.requetes = res
          this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
      })
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
    private router:Router,
    private profilService:ProfilService,
    private usagersService:UsagerService,
    private prestationService:ServiceService,
    private natureService:NatureRequeteService,
    private structureService:StructureService,
    private spinner: NgxSpinnerService,
    private requeteService:RequeteService,
    private activatedRoute: ActivatedRoute,
    private rdvService:RdvService,
    private rdvCreneauService:RdvCreneauService,
    private thematiqueService:TypeService,
    private localStorageService:LocalStorageService
    ) {}

    departements:any[]=[]
    profils:[]=[]
  
  user:any
  ngOnInit() {

    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName)
    }

    this.activatedRoute.queryParams.subscribe((x:any)=> this.init(x['page'] || 1));

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
    checked(event:any, el:any) {
    this.selected_data = el
    console.log(el)
    
    this.requeteService.getAllForUsagerNT(el.id,1).subscribe((res: any) => {
      this.dataNT = res
    })
    
  }
  

  natures:any[]=[]
  services:any[]=[]
  detailpiece:any[]=[]
  descrCarr=[]
  __services:any[]=[]
  themes:any[]=[]
    pager: any = {current_page: 0,
    data:[],
    last_page: 0,
    per_page: 0,
    to: 0,
    total: 0
  }
  subject = new Subject<any>();
  Null=null
  rdvcreneaus:any[]=[]

  init(page:any){

    this._temp=[]
    this.data=[]
    this.usagersService.getAll(null,page).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.data
      this._temp=this.data
      this.subject.next(res);
    })
 
    this.departements=[]
    this.usagersService.getAllDepartement().subscribe((res:any)=>{
      this.departements=res
    })

 
    this.structures = []
    this.structureService.getAll(1,this.user.idEntite).subscribe((res:any)=>{
      this.structures = res
    })

    this.rdvcreneaus = []
    this.rdvCreneauService.getAll(this.user.idEntite).subscribe((res: any) => {
      this.rdvcreneaus = res
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
  
  create(value:any){
    if(value.password!=value.conf_password && value.password != ""){
      this.error="Les deux mot de passe doivent être identique"
    }else{
      this.usagersService.create(value).subscribe((res:any)=>{
      
        this.modalService.dismissAll()
        //this.translate.instant('HOME.TITLE')
        AppSweetAlert.simpleAlert("Nouvel ajout","Ajout effectué avec succès" , 'success')
         this.init(this.page) 
       },(err:any)=>{
         
         if(err.error.detail!=null){    
           AppSweetAlert.simpleAlert("Nouvel ajout", err.error.detail, 'error')
         }else{
           AppSweetAlert.simpleAlert("Nouvel ajout", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
         }
       })
    }
    
  }


  archive(){
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    AppSweetAlert.confirmBox("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.usagersService.delete(this.selected_data.id).subscribe((res:any)=>{
       this.init(this.page)
        AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success')
     
      }, (err:any)=>{
        AppSweetAlert.simpleAlert("Suppression", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
   })
  }

  edit(value:any) {
    value.id=this.selected_data.id
    value.code=this.selected_data.code
    value.codeComplet=this.selected_data.codeComplet
    if(value.password!=value.conf_password){
      value.password=""
      this.error="Le  mot de passe n'a pas été pris en compte car les deux ne sont pas identique"
    }else{
      this.usagersService.update(value,this.selected_data.id).subscribe((res:any)=>{
        this.modalService.dismissAll()
        this.init(this.page)
        AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
      }, (err:any)=>{
        AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
    
	}

  chargerPrestation(event:any){
    this.services=[]
    this.prestationService.getAllType(event.target.value).subscribe((res:any)=>{
      this.services=res
    })
    
    this.thematiqueService.get(event.target.value).subscribe((res:any)=>{
      this.descrCarr = res.descr
    })
    
  }

  openDetailModal(event:any,content:any){

    this.detailpiece=[]
    console.log(event.target.value)
    this.prestationService.getServPiece(event.target.value).subscribe((res:any)=>{
      this.detailpiece=res
    })
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  addRequeteusager(value:any){
    let service = null
    if (this.link_to_prestation==1 || this.selected_type_preoccupation==0) {
      service = this.services.filter((e:any) => (e.id == value.idPrestation))[0]
    }else{
      service=this.services.filter((e:any) => (e.hide_for_public == 1))[0]
    }
    
    if(!value.objet){
      AppSweetAlert.simpleAlert("Renseigner l'objet", "Champ obligatoire", 'error')
    }else if(!value.msgrequest){
      AppSweetAlert.simpleAlert("Renseigner le message", "Champ obligatoire", 'error')
    }else{
      var param = {
        objet: value.objet,
        idPrestation: this.link_to_prestation==0  ? service.id : value.idPrestation,
        nbreJours: service == null ? 0 : service.nbreJours,
        msgrequest: value.msgrequest,
        email:this.selected_data.email,
        nom:this.selected_data.nom,
        tel:this.selected_data.tel,
        idDepartement:this.selected_data.idDepartement,
        interfaceRequete: this.link_to_prestation==1 ? "USAGER"  : "SRU" ,
        idUser:this.user.id,
        plainte: value.plainte,
        visible:1
     };
     this.requeteService.create(param).subscribe((rest:any)=>{
      this.modalService.dismissAll()
      AppSweetAlert.simpleAlert("Ajout requête",  "Requête ajoutée avec succès", 'success')
    })     

    }
  }

  statut=1

  saveRdv(value:any) {
    var param = {
      idUsager: this.user.id,
      objet: this.selected_el_obj,
      idRdvCreneau: value.idRdvCreneau,
      codeRequete: value.codeRequete,
      dateRdv: value.dateRdv,
      idEntite:this.user.idEntite,
      idStructure:value.idStructure,
      statut: this.statut,
      attente: value.attente,
    }
    this.rdvService.create(param).subscribe((res: any) => {
      this.modalService.dismissAll()
      AppSweetAlert.simpleAlert("Prise de rdv", "RDV envoyé avec succès", 'succes');
    })
  }

  selected_el_obj = ""


  show_structures=false
  selectRequest(event:any) {
    if(event.target.value!="0"){
      this.show_structures=false
      this.selected_el_obj = this.data.find((e:any) => (e.codeRequete == event.target.value)).objet
    }else{
      this.show_structures=true
      this.selected_el_obj = ""
    }
  }
}
