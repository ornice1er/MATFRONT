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
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { InstitutionService } from '../../../../../core/services/institution.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';



@Component({
  selector: 'app-configrelance',
  standalone: true,
          imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './configrelance.component.html',
  styleUrls: ['./configrelance.component.css']
})
export class ConfigrelanceComponent implements OnInit {

 
  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText=""
  closeResult = '';
   permissions:any[]=[]
  error=""
  selected_iduse=""
  selected_idEntite=""
  selected_Entite=""
  ministere:any[] = []

  data: any[]=[];
  _temp: any[]=[];
  listuser:any[]=[]

  selected = [
  ];
  current_permissions:any[]=[]
  collectionSize = 0;
  selected_data={ordre_relance:"",msg_relance:"",apartir_de:"",id_user:null,idEntite:null,id:0}

  search(){
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term) 
    })
    this.collectionSize=this.data.length
  }
  
  openAddModal(content:any) {
    
    // alert(this.selected_Entite)

    if(this.selected_Entite == '-1' || this.selected_Entite == null || this.selected_Entite == '' ){
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez une institutions", 'error');
      return;
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: "lg"}).result.then((result) => {
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
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: "lg"}).result.then((result) => {
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
    private institutionService:InstitutionService,
    private translate:TranslateService,
    private spinner: NgxSpinnerService,
    private localStorageService:LocalStorageService,
    private activatedRoute: ActivatedRoute,
    ) {}


    user:any
    ngOnInit() {
      if (localStorage.getItem('mataccueilUserData') != null) {
        this.user = this.localStorageService.get("mataccueilUserData")
      }
      this.listuser = []
      // this.selected_idEntite
      this.institutionService.getLisUsersParEntite(1).subscribe((res:any)=>{
        this.listuser = res
      })
      this.ministere = []
      this.institutionService.getAllEntite().subscribe((res: any) => {
        this.ministere = res
      })
     this.init()
    }
    user_prin = false
    checked(event:any, el:any) {
      this.selected_data = el
      if(this.selected_data.id_user == '-1'){
        this.user_prin = true
      }else{
        this.user_prin = false
      }
    }
    
  init(){
    this._temp=[]
    this.data=[]
    this.institutionService.getAll_Relance(this.selected_Entite).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res
      this._temp=this.data
      this.collectionSize=this.data.length
    })
  }
  
  create(value:any){

    if(this.selected_Entite == '-1' || this.selected_Entite == null || this.selected_Entite == '' ){
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez une institutions", 'error');
      return;
    }
    value.idEntite = this.selected_Entite

    this.institutionService.createRelance(value).subscribe((res:any)=>{
     this.modalService.dismissAll()
     AppSweetAlert.simpleAlert("Nouvel ajout","Ajout effectué avec succès" , 'success')
     this.user_prin = false

      // this.init() 
    },(err:any)=>{
      
      if(err.error.detail!=null){    
        AppSweetAlert.simpleAlert("Nouvel ajout", err.error.detail, 'error')
      }else{
        AppSweetAlert.simpleAlert("Nouvel ajout", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      }
    })
  }

  archive(){
    AppSweetAlert.confirmBox("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.institutionService.deleteRelance(this.selected_data.id).subscribe((res:any)=>{
        this.init()
        AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success')
        this.init()
      }, (err:any )=>{
        AppSweetAlert.simpleAlert("Suppression", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
   })
  }
  edit(value:any) {

    if(this.selected_Entite == '-1' || this.selected_Entite == null || this.selected_Entite == '' ){
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez une institutions", 'error');
      return;
    }
    value.idEntite = this.selected_Entite

    value.id=this.selected_data.id
    this.institutionService.updateRelance(value,this.selected_data.id).subscribe((res:any)=>{
      this.modalService.dismissAll()
      this.init()
      AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
    }, (err:any)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
	}


}
