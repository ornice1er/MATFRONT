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

import { RdvService } from '../../../../../core/services/rdv.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';


@Component({
  selector: 'app-list-rdv',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterModule],
  templateUrl: './list-rdv.component.html',
  styleUrls: ['./list-rdv.component.css']
})
export class ListRdvComponent implements OnInit {

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
  pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""
loading:any=false
  search(){ 
    this.data=[]
    this._temp=[]
    this.rdvService.getAll(this.user.idEntite,this.searchText,this.page).subscribe((res:any)=>{
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

  openEditModal(content:any,el:any){
    this.selected_data=el
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
    private rdvService:RdvService,
    private spinner: NgxSpinnerService,
    private localService : LocalStorageService,
    private activatedRoute: ActivatedRoute,
        private localStorageService:LocalStorageService,
        private observerService:ObserverService
    
    ) {}


  user:any
  ngOnInit() {
    this.observerService.setTitle('')


    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName)
    }

    this.activatedRoute.queryParams.subscribe((x:any)=> this.init(x.page || 1));

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

    pager: any = {current_page: 0,
    data:[],
    last_page: 0,
    per_page: 0,
    to: 0,
    total: 0
  }
  subject = new Subject<any>();
  Null=null

  init(page:any){
    this._temp=[]
    this.data=[]
    if(this.user.agent_user!=null && this.user.profil_user.direction==1){
      this.rdvService.getAllByStructure(this.user.agent_user.idStructure,page).subscribe((res:any)=>{
        this.spinner.hide();
        res.data.forEach((e:any)=>{
          e.check=false
          if(e.statut!=0){
            this.data.push(e)
          }
        })
        this._temp=this.data
        this.subject.next(res);
      })
    }else{
      this.rdvService.getAll(this.user.idEntite,null,page).subscribe((res:any)=>{
        this.spinner.hide();
        res.data.forEach((e:any)=>{
          e.check=false
          if(e.statut!=0){
            this.data.push(e)
          }
        })
        this._temp=this.data
        this.subject.next(res);
      })
    }
  }
  
  setRdvStatut(pos:any){
    let checked:any=[]
    this.data.forEach((e:any)=>{
      if(e.check==true){
        checked.push(e.id)
      }
    })
    if(checked.length==0){
      AppSweetAlert.simpleAlert("RDV", "Aucun élément selectionnés", 'error')
    }else{
      var msgConfirm = "Confirmation changement statut ?";
      var confirmResult = confirm(msgConfirm);
      if (confirmResult === false) return;
  
      var param = {
       listerdv: checked,
       statut: pos,
       idEntite:this.user.idEntite,
      }
      
      this.rdvService.saveRdvStatut(param).subscribe((res:any)=>{
        
        this.modalService.dismissAll()
        //this.translate.instant('HOME.TITLE')
        AppSweetAlert.simpleAlert("Prise de rdv","Les statut des rdv selectionnés on été modifié" , 'success')
         this.init(this.page) 
       },(err:any)=>{
        AppSweetAlert.simpleAlert("Prise de rdv", "Une erreur est survenue", 'error')
       }) 
  
    }
   
  }

  create(value:any){
    value.idEntite=this.user.idEntite
    this.rdvService.create(value).subscribe((res:any)=>{
      
     this.modalService.dismissAll()
     //this.translate.instant('HOME.TITLE')
     AppSweetAlert.simpleAlert("Nouvel ajout","Ajout effectué avec succès" , 'success')
      this.init(this.page) 
    },(err:any)=>{
      
      if(err.error.detail!=null){    
        AppSweetAlert.simpleAlert("Nouvel ajout", err.error.detail, 'error')
      }else{
        AppSweetAlert.simpleAlert("Nouvel ajout", err.error.message, 'error')
      }
    })
  }


  archive(id:any,index:any){
    AppSweetAlert.confirmBox("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.rdvService.delete(id).subscribe((res:any)=>{
        this.data.splice(index,1)
        AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success')
        this.init(this.page)
      }, (err:any)=>{
        AppSweetAlert.simpleAlert("Suppression", err.error.message, 'error')
      })
    }
   })
  }
  edit(value:any) {
    value.id=this.selected_data.id
    this.rdvService.update(value,this.selected_data.id).subscribe((res:any)=>{
      this.modalService.dismissAll()
      this.init(this.page)
      AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
    }, (err:any)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", err.error.message, 'error')
    })
	}

}
