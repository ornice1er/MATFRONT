import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { StructureService } from '../../../../../core/services/structure.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { InstitutionService } from '../../../../../core/services/institution.service';

@Component({
  selector: 'app-listestructures',
  standalone: true,
            imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,NgxSpinnerModule, SharedModule],
  templateUrl: './listestructures.component.html',
  styleUrls: ['./listestructures.component.css']
})
export class ListestructuresComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText=""
  closeResult = '';
   permissions:any[]=[]
  error=""
  data: any[]=[];
  entities: any[]=[];

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
selectedEntity:any
  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term) ||
      r.sigle.toLowerCase().includes(term)
    })
    this.collectionSize=this.data.length
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
      AppSweetAlert.simpleAlert('error',"Erreur", "Veuillez selectionnez un élément puis réessayer");
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
  
role:any
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private institutionService:InstitutionService,
    private router:Router,
    private structureService:StructureService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private observerService:ObserverService,
    private localStorageService : LocalStorageService
    ) {}


  user:any
  isSuperAdmin=false
  ngOnInit() {
    this.observerService.setTitle('PARAMETRES - STRUCTURES')

    this.user = this.localStorageService.get(GlobalName.userName)
    this.role=this.user.roles[0]?.name
    this.isSuperAdmin= this.role ==="Super Admin" ?true:false
    this.init()
  }
  init(){
    this._temp=[]
    this.data=[]
    this.spinner.show();
    this.structureService.getAll(0,this.user?.idEntite).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.data
    })

     this.institutionService.getAll().subscribe((res:any)=>{
      this.spinner.hide();
      this.entities=res.data
    })
  }
  checked(event:any, el:any) {
    this.selected_data = el
  }
  
  create(value:any){
    value.idEntite=this.user?.idEntite
    if (value.point_de_chute == 1) {
        const existing = this.data.find(s => s.point_de_chute);
        if (existing) {
            AppSweetAlert.simpleAlert('error', "Opération impossible", `La structure "${existing.libelle}" est déjà définie comme point de chute.`);
            return;
        }
    }
    if (value.point_de_chute_transverse == 1) {
        const existing = this.data.find(s => s.point_de_chute_transverse);
        if (existing) {
            AppSweetAlert.simpleAlert('error', "Opération impossible", `La structure "${existing.libelle}" est déjà définie comme point de chute transverse.`);
            return;
        }
    }
    this.loading=true
    this.structureService.create(value).subscribe((res:any)=>{
          this.loading=false

     this.modalService.dismissAll()
     //this.translate.instant('HOME.TITLE')
     AppSweetAlert.simpleAlert('success',"Nouvel ajout","Ajout effectué avec succès")
      this.init() 
    },(err:any)=>{
          this.loading=false

      if(err.error.detail!=null){    
        AppSweetAlert.simpleAlert('error',"Nouvel ajout", err.error.detail)
      }else{
        AppSweetAlert.simpleAlert('error',"Nouvel ajout", "Erreur, Verifiez que vous avez une bonne connexion internet")
      }
    })
  }


  archive(){
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("error","Erreur", "Veuillez selectionnez un élément puis réessayer");
      return;
    }
    AppSweetAlert.confirmBox("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.structureService.delete(this.selected_data.id).subscribe((res:any)=>{
       this.init()
        AppSweetAlert.simpleAlert('success',"Suppression", "Suppression effectuée avec succès")
        this.init()
      }, (err:any)=>{
        AppSweetAlert.simpleAlert("error","Suppression", "Erreur, Verifiez que vous avez une bonne connexion internet")
      })
    }
   })
  }
  edit(value:any) {
    value.id=this.selected_data.id
    value.idEntite=this.user.idEntite
    if (value.point_de_chute == 1) {
        const existing = this.data.find(s => s.point_de_chute && s.id !== this.selected_data.id);
        if (existing) {
            AppSweetAlert.simpleAlert('error', "Opération impossible", `La structure "${existing.libelle}" est déjà définie comme point de chute.`);
            return;
        }
    }

    if (value.point_de_chute_transverse == 1) {
        const existing = this.data.find(s => s.point_de_chute_transverse && s.id !== this.selected_data.id);
        if (existing) {
            AppSweetAlert.simpleAlert('error', "Opération impossible", `La structure "${existing.libelle}" est déjà définie comme point de chute transverse.`);
            return;
        }
    }
        this.loading=true

    this.structureService.update(value,this.selected_data.id).subscribe((res:any)=>{
        this.loading=false

      this.modalService.dismissAll()
      this.init()
      AppSweetAlert.simpleAlert('success',"Nouvelle modification",  "Motification effectué avec succès")
    }, (err:any)=>{
        this.loading=false

      AppSweetAlert.simpleAlert( 'error',"Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet")
    })
	}

  getPage(event:any){
    this.pg.p=event
  }

}
