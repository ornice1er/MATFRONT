import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
// import { AlertNotif } from 'src/app/alert';
// import { LocalStorageService } from 'src/app/core/_services/browser-storages/local.service';
// import { EserviceService } from 'src/app/core/_services/eservice.service';
// import { NatureContractService } from 'src/app/core/_services/nature-contract.service';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';

import { NatureContractService } from '../../../../core/services/nature-contract.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';

@Component({
  selector: 'app-nature-contract',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './nature-contract.component.html',
  styleUrls: ['./nature-contract.component.css']
})
export class NatureContractComponent implements OnInit {

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

  is_active:any
  current_permissions:any[]=[]
  collectionSize = 0;
  selected_data:any
  is_external_service=false

  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.email.toLowerCase().includes(term) ||
      (r.agent_user==null ? '' : r.agent_user.nomprenoms).toLowerCase().includes(term) 
    })
    this.collectionSize=this.data.length
  }
  
  openAddModal(content:any){ {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }}

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
    private ncService: NatureContractService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService : LocalStorageService
    ) {}

    acteurs:[]=[]
    profils:[]=[]

  user:any
  ngOnInit() {
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName)

    }
    this.init()
  }
  checked(event:any, el:any) {
    this.selected_data = el
    this.is_active=el.is_published
  }
  
  init(){
    this._temp=[]
    this.data=[]
    this.ncService.getAll().subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.data
      this._temp=this.data
      this.collectionSize=this.data.length
    })
   
  }
  
  create(value:any){
      this.ncService.create(value).subscribe((res:any)=>{
      
        this.modalService.dismissAll()
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


  archive(){
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    AppSweetAlert.finishConfirm("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.ncService.delete(this.selected_data.id).subscribe((res:any)=>{
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
    if(value.password!=value.conf_password){
      value.password=""
    }
    value.idEntite=this.user.idEntite
    this.ncService.update(value,this.selected_data.id).subscribe((res:any)=>{
      this.modalService.dismissAll()
      this.init()
      AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
    }, (err:any)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
	}


  setState(value:any){
    this.ncService.setState(this.selected_data?.id,value).subscribe((res:any)=>{
    
      this.modalService.dismissAll()
      AppSweetAlert.simpleAlert("Nouvel MAJ","MAJ effectué avec succès" , 'success')
       this.init() 
     },(err:any)=>{
       
       if(err.error.detail!=null){    
         AppSweetAlert.simpleAlert("Nouvel MAJ", err.error.detail, 'error')
       }else{
         AppSweetAlert.simpleAlert("Nouvel MAJ", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
       }
     })

  
}

}
