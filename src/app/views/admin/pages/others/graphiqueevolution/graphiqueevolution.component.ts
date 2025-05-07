import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { EtapeService } from '../../../../../core/services/etape.service';

import { NatureRequeteService } from '../../../../../core/services/nature-requete.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { TypeService } from '../../../../../core/services/type.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';


@Component({
  selector: 'app-graphiqueevolution',
   standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './graphiqueevolution.component.html',
  styleUrls: ['./graphiqueevolution.component.css']
})
export class GraphiqueevolutionComponent implements OnInit {

  @Input() cssClasses = '';
  errormessage=""
  erroraffectation=""
  
  searchText=""
  closeResult = '';
   permissions:any[]=[] = []
  error=""
  data: any[]=[];
  _temp: any[]=[];
  collectionSize = 0;
  page = 1;
  pageSize = 10;
  years:any[]=[]

  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.question.toLowerCase().includes(term) 
    })
    this.collectionSize=this.data.length
  }
  

  user:any

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router:Router,
    private etapeService:EtapeService,
    private requeteService:RequeteService,
    private localService:LocalStorageService,
    private prestationService:ServiceService,
    private structureService:StructureService,
    private natureService:NatureRequeteService,
    private thematiqueService:TypeService,
    private usagersService:UsagerService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
        private localStorageService:LocalStorageService
    
  ) { }

    lineChartData: any[] = [
    { data: [], label: 'Evolution des requetes' },
  ];
  
  linearData:any[]=[]
  lineChartLabels: any[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: any[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];


  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
 

  selected_year=null

  typeRequete:any=""

  checkType(){
    if(this.activatedRoute.snapshot.paramMap.get('type_req')=="plaintes"){
      return {id:1,name:"plaintes"}
    }
    if(this.activatedRoute.snapshot.paramMap.get('type_req')=="requetes"){
      return {id:0,name:"requetes"}
    }
    if(this.activatedRoute.snapshot.paramMap.get('type_req')=="infos"){
      return {id:2,name:"demandes d'informations"}
    }
    return
  }
  
  ngOnInit(): void {

    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localService.get(GlobalName.userName)
      this.prepare()

      this.router.events
        .subscribe(event => {
  
          if (event instanceof NavigationStart) {
            this.prepare()
          }
        })
    }
   
    
  }
     subject = new Subject<any>();

     prepare(){
       for (let index = 2018; index <= 2040; index++) {
         this.years.push(index)
       }
   
       this.init()   
   
     
       this.activatedRoute.queryParams.subscribe((x:any)=> this.init());

      this.typeRequete = this.checkType()?.name;

      
       this.subject.subscribe((val) => {
         this.typeRequete = this.checkType()?.name;
         this.lineChartLabels=[]
         this.linearData=[]
         this.lineChartData=  [
          {
            data: [], label: ''
          },
  
        ]
         val.forEach((e:any)=>{
          this.lineChartLabels.push(e.periode.toString())
          this.linearData.push(e.nbre)
        })
        this.lineChartData=[
          { data:  this.linearData, label: 
            'Evolution des '+this.checkType()?.name},
        ]
       })
     }
  init(){
    this._temp=[]
    this.data=[]
    this.lineChartLabels=[]
    this.linearData=[]
    this.lineChartData=  [
      {
        data: [], label: ''
      },

    ]
    this.requeteService.getGraphiqueStatEvolutionReq(
      this.checkType()?.id
      ,"all",this.user.idEntite).subscribe((res:any)=>{
      this.subject.next(res);
      /*res.forEach((e:any)=>{
        this.lineChartLabels.push(e.periode.toString())
        this.linearData.push(e.nbre)
      })
      this.lineChartData=[
        { data:  this.linearData, label: 
          'Evolution des '+this.checkType()?.name},
      ]*/
    })

  }

  resetStats(){
    this.init()
    this.selected_year=null
  }

  loadGraphe(){
    if(this.selected_year!=null && this.selected_year!=""){
      this.requeteService.getGraphiqueStatEvolutionReq(
        this.checkType()?.id
        ,this.selected_year,this.user.idEntite).subscribe((res:any)=>{
        res.forEach((e:any)=>{
          this.lineChartLabels.push(e.periode.toString())
          this.linearData.push(e.nbre)
        })
        this.lineChartData=[
          { data:  this.linearData, label: 
            'Evolution des '+this.checkType()?.name},
        ]
      })
    }
    
  }
}
