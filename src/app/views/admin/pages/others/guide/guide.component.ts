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
import { ProfilService } from '../../../../../core/services/profil.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';


@Component({
  selector: 'app-guide',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {

  
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


  

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router:Router,
    private structureService:StructureService,
    private suggestionService:UsagerService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService:LocalStorageService,
    private profilService:ProfilService
    ) {}

    // structures:[]=[]

    user:any
    ngOnInit() {
      if (this.localStorageService.get(GlobalName.userName) != null) {
        this.user = this.localStorageService.get(GlobalName.userName)
        
      }
     this.init()
    }
  init(){

    this._temp=[]
    this.data=[]
    this.profilService.get(this.user.idprofil).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res 
    })

  }
  
 



}
