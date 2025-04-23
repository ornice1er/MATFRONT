import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';

import { StructureService } from '../../../../../core/services/structure.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';

@Component({
  selector: 'app-list-suggestion',
  standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {

  
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

  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.nomEmetteur.toLowerCase().includes(term) 
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
    private structureService:StructureService,
    private suggestionService:UsagerService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService:LocalStorageService
    ) {}

    // structures:[]=[]

    user:any
    ngOnInit() {
      if (localStorage.getItem('mataccueilUserData') != null) {
        this.user = this.localStorageService.get("mataccueilUserData")
  
      }
     this.init()
    }
  init(){
    this._temp=[]
    this.data=[]
    this.suggestionService.getAllSuggestion().subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res
      this._temp=this.data
      this.collectionSize=this.data.length
    })
   
  }
  
 

  archive(id:any,index:any){
    AppSweetAlert.confirmBox("Suppression",
    "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
      if (result.value) {
      this.suggestionService.delete(id).subscribe((res:any)=>{
        this.data.splice(index,1)
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
    value.idEntite=this.user.idEntite
    this.suggestionService.update(value,this.selected_data.id).subscribe((res:any)=>{
      this.modalService.dismissAll()
      this.init()
      AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
    }, (err:any)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
	}



}
