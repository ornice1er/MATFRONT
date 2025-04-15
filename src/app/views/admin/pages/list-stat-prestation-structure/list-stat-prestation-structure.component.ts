import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { LocalService } from '../../../../core/services/local.service';
import { ServiceService } from '../../../../core/services/service.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-list-stat-prestation-structure',
  standalone: true,
	imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './list-stat-prestation-structure.component.html',
  styleUrls: ['./list-stat-prestation-structure.component.css']
})
export class ListStatPrestationStructureComponent implements OnInit {

  @Input() cssClasses = '';
  errormessage=""
  erroraffectation=""
  
  searchText=""
  closeResult = '';
  permissions: any[] = [];
  error=""
  data: any[]=[];
  _temp: any[]=[];
  collectionSize = 0;
  page = 1;
  pageSize = 10;



  user:any

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router:Router,
    private localService:LocalService,
    private prestationService:ServiceService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) { }


  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.libelle.toLowerCase().includes(term) 
    })
    this.collectionSize=this.data.length
  }
  ngOnInit(): void {

    if (localStorage.getItem('mataccueilUserData') != null) {
      this.user = this.localService.getJsonValue('mataccueilUserData')
      this.prepare()
     
    }
    

    
  }
  prepare(){
    this.init()    
  
  }

  init(){
    this._temp=[]
    this.data=[]
    this.prestationService.getAllStatByStrcutre(
      this.user.idEntite
    ).subscribe((res:any)=>{
      this.data=res
      this._temp=this.data
      this.collectionSize=this.data.length

    })

   
  }

}
