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
// import { User } from '../../../core/_models/user.model';
// import { Roles } from '../../../core/_models/roles';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { UserService } from '../../../../core/services/user.service';


@Component({
  selector: 'app-crud',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;
  pageSize = 4;
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
  selected_data=new User()

  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.first_name.toLowerCase().includes(term) ||
       r.last_name.toString().includes(term) || 
       r.email.toString().includes(term)
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
    private translate:TranslateService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    ) {}


  ngOnInit() {
    this._temp=[]
    this.data=[
      {first_name:"Paul",last_name:"MBIA",phone:"00000000",email:"mbpaul@gmail.com",is_active:true},
      {first_name:"Paul",last_name:"MBIA",phone:"00000000",email:"mbpaul@gmail.com",is_active:true},
      {first_name:"Paul",last_name:"MBIA",phone:"00000000",email:"mbpaul@gmail.com",is_active:true},
      {first_name:"Paul",last_name:"MBIA",phone:"00000000",email:"mbpaul@gmail.com",is_active:true},
      {first_name:"Paul",last_name:"MBIA",phone:"00000000",email:"mbpaul@gmail.com",is_active:true},
    ]
    this._temp=this.data
    this.collectionSize=this.data.length
    /*
    this.userService.getAll().subscribe((res:any)=>{
      this.spinner.hide();
      res.forEach((e)=>{if(e.deleted==false && e.role==Roles.Admin) this.data.push(new User(e))})
      this._temp=this.data
      this.collectionSize=this.data.length
    })*/
   
  }
  
  create(value:any){
    value.username=value.last_name+" "+value.first_name 
    value.role=Roles.SubAdmin
    value.permissions=this.selected
    value.password="default"
    this.userService.create(value).subscribe((res:any)=>{
      
     this.modalService.dismissAll()
     //this.translate.instant('HOME.TITLE')
     AppSweetAlert.simpleAlert("Nouvel ajout","Ajout effectué avec succès" , 'success')
      this.ngOnInit() 
    },(err)=>{
      
      if(err.error.detail!=null){    
        AppSweetAlert.simpleAlert("Nouvel ajout", err.error.detail, 'error')
      }else{
        AppSweetAlert.simpleAlert("Nouvel ajout", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      }
    })
  }
  lock(id,index) {
    this.userService.update(id,{is_active:false}).subscribe((res:any)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", this.translate.instant('back.account_success_lock'), 'success')
      this.ngOnInit()
    }, (err)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
   
   }
    unlock(id,index){
      this.userService.update(id,{is_active:true}).subscribe((res)=>{
        AppSweetAlert.simpleAlert("Nouvelle modification",  this.translate.instant('back.account_success_unlock'), 'success')
        this.ngOnInit()
      }, (err)=>{
        AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
   }
  archive(id,index){
    AppSweetAlert.confirmBox("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.userService.delete(id).subscribe((res:any)=>{
        this.data.splice(index,1)
        AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success')
        this.ngOnInit()
      }, (err)=>{
        AppSweetAlert.simpleAlert("Suppression", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
   })
  }
  edit(value:any) {
    this.userService.update(value,value.id).subscribe((res)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
      this.ngOnInit()
    }, (err)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
	}


}
