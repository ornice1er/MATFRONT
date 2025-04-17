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
import { ProfilService } from '../../../../../core/services/profil.service';
import { UserService } from '../../../../../core/services/user.service';



@Component({
  selector: 'app-listeprofils',
  standalone: true,
          imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './listeprofils.component.html',
  styleUrls: ['./listeprofils.component.css']
})
export class ListeprofilsComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText=""
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

  file: string | Blob =""
  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.LibelleProfil.toLowerCase().includes(term) 
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

  ChangerFile(file:any){
    window.location.href="https://api.mataccueil.gouv.bj/api/downloadFileGuide?file="+file
    // window.location.href="http://localhost:8003/api/downloadFileGuide?file="+file
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
    private translate:TranslateService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    ) {}


  ngOnInit() {
    
   this.init()
  }
  init(){
    this._temp=[]
    this.data=[]
    this.profilService.getAll().subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res
      this._temp=this.data
      this.collectionSize=this.data.length
    })
  }
    checked(event:any, el:any) {
    this.selected_data = el
  }
  
  create(value:any){
    this.profilService.create(value).subscribe((res:any)=>{
      
     this.modalService.dismissAll()
     //this.translate.instant('HOME.TITLE')
     AppSweetAlert.simpleAlert("Nouvel ajout","Ajout effectué avec succès" , 'success')
      this.init() 
    },(err)=>{
      
      if(err.error.detail!=null){    
        AppSweetAlert.simpleAlert("Nouvel ajout", err.error.detail, 'error')
      }else{
        AppSweetAlert.simpleAlert("Nouvel ajout", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      }
    })
  }
  
  addGuide(value:any){

    let formData = new FormData()
    formData.append('fichier', this.file)

    this.profilService.addGuideUser(formData,this.selected_data.id).subscribe((res:any)=>{
      if(res.status == 'error'){
        AppSweetAlert.simpleAlert("Ajout guide",res.message , 'error')
      }else{
        this.modalService.dismissAll()
        AppSweetAlert.simpleAlert("Ajout guide","Guide ajouté avec succès" , 'success')
         this.init() 
      }
     
    },(err)=>{
      
      if(err.error.detail!=null){    
        AppSweetAlert.simpleAlert("Ajout guide", err.error.detail, 'error')
      }else{
        AppSweetAlert.simpleAlert("Ajout guide", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      }
    })
  }


  archive(){
    AppSweetAlert.confirmBox("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.profilService.delete(this.selected_data.id).subscribe((res:any)=>{
        this.init()
        AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success')
      }, (err)=>{
        AppSweetAlert.simpleAlert("Suppression", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
   })
  }
  edit(value:any) {
    value.code=this.selected_data.CodeProfil
    value.id=this.selected_data.id
    this.profilService.update(value,this.selected_data.id).subscribe((res)=>{
      this.modalService.dismissAll()
      this.init()
      AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
    }, (err)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
	}


}
