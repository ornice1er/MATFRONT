import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { ActeurService } from '../../../../../core/services/acteur.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';


@Component({
  selector: 'app-listacteurs',
  standalone: true,
          imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './listacteurs.component.html',
  styleUrls: ['./listacteurs.component.css']
})
export class ListacteursComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText=""
  commune:any[]=[]
  selectedDepart:any
  closeResult = '';
   permissions:any[]=[]
  error=""
  data: any[]=[];
  _temp: any[]=[];

  selected = [
  ];
  current_permissions:any[]=[]
  collectionSize = 0;
  selected_data:any
  pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""

  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.nomprenoms.toLowerCase().includes(term) ||
      (r.structure==null ? '' : r.structure.libelle).toString().toLowerCase().includes(term)
    })
    this.collectionSize=this.data.length
  }
  
  onDepartChange(event:any){
    console.log(event.target.value)
    this.selectedDepart=+event.target.value
    this.chargerCommune(this.selectedDepart)
  }
  chargerCommune(idDepartt:any){
    
  
    this.commune = []
    this.acteursService.getAllCommune(idDepartt).subscribe((res: any) => {
      this.commune = res
    })
  }
  openAddModal(content:any) {
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {
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
    private router:Router,
    private structureService:StructureService,
    private acteursService:ActeurService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService:LocalStorageService,
    private observerService:ObserverService
    ) {}

    structures:any
    departement:any[]=[]

    user:any
    idDepa:any
    ngOnInit() {
      this.observerService.setTitle('')

      if (this.localStorageService.get(GlobalName.userName) != null) {
        this.user = this.localStorageService.get(GlobalName.userName)
      }
     this.init()
    }
    checked(event:any, el:any) {
      this.selected_data = el
      console.log(el)
      this.idDepa = el.commune.depart_id
      this.chargerCommune(this.idDepa)
    }
    
  init(){
    this._temp=[]
    this.data=[]
    this.acteursService.getAll(this.user.idEntite).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res
      this._temp=this.data
      this.collectionSize=this.data.length
    })
    
    this.structures=[]
    this.structureService.getAll(0,this.user.idEntite).subscribe((res:any)=>{
      this.spinner.hide();
      this.structures=res
    })
    this.departement=[]
    this.acteursService.getAllDepart().subscribe((res:any)=>{
      this.departement=res
    })
  }
  
  create(value:any){
    value.idEntite=this.user.idEntite

    if(value.idDepart == null || value.idDepart == ""){
      AppSweetAlert.simpleAlert("Erreur","Veuillez choisir un département.", 'error')
    }else if(value.idComm == null || value.idComm == ""){
      AppSweetAlert.simpleAlert("Erreur","Veuillez choisir une commune.", 'error')
    }else{
      this.acteursService.createGra(value).subscribe((res:any)=>{
        
       this.modalService.dismissAll()
       //this.translate.instant('HOME.TITLE')
       AppSweetAlert.simpleAlert("Nouvel ajout","Ajout effectué avec succès" , 'success')
        this.init() 
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
      this.acteursService.delete(this.selected_data.id).subscribe((res:any)=>{
        this.init()
        AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success')
        
      }, (err:any)=>{
        AppSweetAlert.simpleAlert("Suppression", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
   })
  }
  edit(value:any) {
    value.id=this.selected_data.id
    value.idEntite=this.user.idEntite
    
    if(value.idDepart == null || value.idDepart == ""){
      AppSweetAlert.simpleAlert("Erreur","Veuillez choisir un département.", 'error')
    }else if(value.idComm == null || value.idComm == ""){
      AppSweetAlert.simpleAlert("Erreur","Veuillez choisir une commune.", 'error')
    }else{
      this.acteursService.update(value,this.selected_data.id).subscribe((res:any)=>{
        this.modalService.dismissAll()
        this.init()
        AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
      }, (err:any)=>{
        AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
	}
  getPage(event:any){
    this.pg.p=event
  }

}
