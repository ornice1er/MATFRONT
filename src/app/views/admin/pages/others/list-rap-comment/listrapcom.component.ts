import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { CommentaireService } from '../../../../../core/services/commentaire.service';

import { UserService } from '../../../../../core/services/user.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { ConfigService } from '../../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';

@Component({
  selector: 'app-listrapcom',
  templateUrl: './listrapcom.component.html',
  standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  styleUrls: ['./listrapcom.component.css']
})
export class RapCommentComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;
  pageSize = 50;
  searchText=""
  closeResult = '';
  permissions:any[] =[]
  error=""
  data: any[]=[];
  _temp: any[]=[];

  selected = [
  ];
  current_permissions:any[]=[]
  collectionSize = 0;
  selected_data:any
  dated:any=''
  datef:any=''
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
      return r.commentaire.toLowerCase().includes(term) || r.num_enreg.toLowerCase().includes(term) 
    })
    this.collectionSize=this.data.length
  }
  print_rapp(libdate:any){
    var url= ConfigService.toApiUrl('rapportconsult?date='+libdate)
    window.open(url, "_blank")  
  }
  print_rapp_periode(){
    if(this.dated && this.datef){
      var url= ConfigService.toApiUrl('rapportconsult?date='+this.dated+'&datef='+this.datef+'&idEntite='+this.user.idEntite)
      window.open(url, "_blank")  
    }else{
      AppSweetAlert.finish("Error", "Date début et fin sont obligatoire", 'error')
    }
  }
  print_graphe_periode(){
    if(this.dated && this.datef){
      var url= ConfigService.toApiUrl('rapportGraph?date='+this.dated+'&datef='+this.datef+'&idEntite='+this.user.idEntite)
      window.open(url, "_blank")  
    }else{
      AppSweetAlert.finish("Error", "Date début et fin sont obligatoire", 'error')
    }
  }

  graphe_rapp(libdate:any){
    var url= ConfigService.toApiUrl('rapportGraph?date='+libdate)
    window.open(url, "_blank")  
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
      AppSweetAlert.finish("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
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
    // private etapeService:EtapeService,
    private commentaireService:CommentaireService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService : LocalStorageService,
    private observerService:ObserverService
    ) {}


  user:any
  ngOnInit() {
    this.observerService.setTitle("Gestion des rapports d'exploitation")

    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName)

    }
    this.init()
  }
  init(){
    this._temp=[]
    this.data=[]
    this.commentaireService.getAll().subscribe((res:any)=>{
      console.log( this.data)
      this.spinner.hide();
      this.data=res.data
      this._temp=this.data
      this.collectionSize=this.data.length
    })
  }
    checked(event:any, el:any) {
      console.log(this.user,el)
      this.selected_data = el
  }

  ChangerFile(file:any){
    // window.location.href="http://api.mataccueil.sevmtfp.test/api/downloadFileCom?file="+file
    window.location.href="https://api.mataccueil.gouv.bj/api/downloadFileCom?file="+file
    // window.location.href="http://localhost:8003/api/downloadFileCom?file="+file
  }
  
  file: string | Blob =""
  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  create(value:any){

    let formData = new FormData()
    formData.append('date_debut_com', value.datedebut)
    formData.append('date_fin_com', value.datefin)
    formData.append('commentaire', value.comment)
    formData.append('fichier', this.file)
    formData.append('id_init', this.user.id)

    this.commentaireService.create(formData).subscribe((res:any)=>{
      if(res.status == 'error'){
        AppSweetAlert.finish("Nouvel ajout",res.message , 'error')
      }else{
        this.modalService.dismissAll()
        AppSweetAlert.finish("Nouvel ajout","Ajout effectué avec succès" , 'success')
         this.init() 
      }
    },(err:any)=>{
      if(err.error.detail!=null){    
        AppSweetAlert.finish("Nouvel ajout", err.error.detail, 'error')
      }else{
        AppSweetAlert.finish("Nouvel ajout", err.error.message, 'error')
      }
    })
  }

  edit(value:any) {
    
    let formData = new FormData()
    formData.append('date_debut_com', value.datedebut)
    formData.append('date_fin_com', value.datefin)
    formData.append('id_comment', this.selected_data.id_comment)
    formData.append('commentaire', value.comment)

    this.commentaireService.update(formData,this.selected_data.id_comment).subscribe((res:any)=>{
      if(res.status == 'error'){
        AppSweetAlert.finish("Nouvelle modification",res.message , 'error')
      }else{
        this.modalService.dismissAll()
        AppSweetAlert.finish("Nouvelle modification",  "Motification effectué avec succès", 'success')
         this.init() 
      }
    }, (err:any)=>{
      AppSweetAlert.finish("Nouvelle modification", err.error.message, 'error')
    })
	}

  archive(){
    if (this.selected_data == null) {
      AppSweetAlert.finish("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    AppSweetAlert.finishConfirm("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.commentaireService.delete(this.selected_data.id_comment).subscribe((res:any)=>{
      
        AppSweetAlert.finish("Suppression", "Suppression effectuée avec succès", 'success')
        this.init()
      }, (err:any)=>{
        AppSweetAlert.finish("Suppression", err.error.message, 'error')
      })
    }
   })
  }
    getPage(event:any){
    this.pg.p=event
  }

}
