import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../core/_services/user.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ActeurService } from '../../../../core/services/acteur.service';
import { InstitutionService } from '../../../../core/services/institution.service';
import { LocalService } from '../../../../core/services/local.service';
import { ProfilService } from '../../../../core/services/profil.service';
import { UserService } from '../../../../core/services/user.service';


@Component({
  selector: 'app-users-main',
  standalone: true,
            imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './users-main.component.html',
  styleUrls: ['./users-main.component.css']
})
export class UsersMainComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText=""
  closeResult = '';
   permissions:any[]=[]=[]
  error=""
  data: any[]=[];
  _temp: any[]=[];

  selected = [
  ];
  current_permissions:any[]=[]
  collectionSize = 0;
  selected_data:any

  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.email.toLowerCase().includes(term) ||
      (r.agent_user==null ? '' : r.agent_user.nomprenoms).toLowerCase().includes(term) 
    })
    this.collectionSize=this.data.length
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
    private profilService:ProfilService,
    private acteursService:ActeurService,
    private translate:TranslateService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private institutionService:InstitutionService,
    private localStorageService : LocalService
    ) {}

    acteurs:any[]=[]
    profils:any[]=[]

  user:any
  ngOnInit() {
    if (localStorage.getItem('mataccueilUserData') != null) {
      this.user = this.localStorageService.getJsonValue("mataccueilUserData")

    }
    this.init()
  }

  institutions:any[]=[]

  init(){
    this._temp=[]
    this.data=[]
    this.userService.getAllMain().subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res
      this._temp=this.data
      this.collectionSize=this.data.length
    })
    this.profils=[]
    this.profilService.getAllMain().subscribe((res:any)=>{
      this.profils=res
    })
    this.institutions=[]
    this.institutionService.getAll().subscribe((res:any)=>{
      this.institutions=res
    })
  
  }
  checked(event:any, el:any) {
    this.selected_data = el
  }
  

  loadActeur(event:any){
    this.acteurs=[]
    this.acteursService.getAll(+event.target.value).subscribe((res:any)=>{
      this.acteurs=res
    })
  }
  
  hide_actors=false

  changeProfil(event:any){
    let profil:any=this.profils.filter((e:any)=>(+event.target.value==e.id))[0];
    if(profil.admin_sectoriel==1){
      this.hide_actors=true
    }else{
      this.hide_actors=false
    }
  }

  create(value:any){
    if(value.password==value.conf_password){
      this.userService.create(value).subscribe((res:any)=>{
      
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
    }else{
      this.error="Les deux mot de passe doivent être identique"
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
      this.userService.delete(this.selected_data.id).subscribe((res:any)=>{
        this.init()
        AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success')
        this.init()
      }, (err:any)=>{
        AppSweetAlert.simpleAlert("Suppression", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
   })
  }
  edit(value:any) {
    value.id=this.selected_data.id
    if(value.password!=value.conf_password){
      value.password=""
    }
    this.error="Le  mot de passe n'a pas été pris en compte car les deux ne sont pas identique"
    this.userService.update(value,this.selected_data.id).subscribe((res:any)=>{
      this.modalService.dismissAll()
      this.init()
      AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
    }, (err:any)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
	}


}
