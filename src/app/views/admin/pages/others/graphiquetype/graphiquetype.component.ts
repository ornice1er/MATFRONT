import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

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
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';


@Component({
  selector: 'app-graphiquetype',standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,BaseChartDirective],

  templateUrl: './graphiquetype.component.html',
  styleUrls: ['./graphiquetype.component.css']
})
export class GraphiquetypeComponent implements OnInit {


  @Input() cssClasses = '';
  errormessage = ""
  erroraffectation = ""

  searchText = ""
  closeResult = '';
  permissions: any[] =[]
  error = ""
  data: any[] = [];
  _temp: any[] = [];
  collectionSize = 0;
  page = 1;
  pageSize = 10;
  years: any[] = []
  typeGraphe="Histogramme"

  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.question.toLowerCase().includes(term)
    })
    this.collectionSize = this.data.length
  }


  user: any

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private translate: TranslateService,
    private etapeService: EtapeService,
    private requeteService: RequeteService,
    private localService: LocalStorageService,
    private prestationService: ServiceService,
    private structureService: StructureService,
    private natureService: NatureRequeteService,
    private thematiqueService: TypeService,
    private usagersService: UsagerService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) { }


  barChartOptions: any = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  barChartLabels: any[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: any[] = [
    { data: [], label: '' }
  ];
  barData:any []= []
  selected_year = null


  doughnutChartLabels: any[] = [];
  doughnutChartData: any = [
    []
  ];

  doughnutChartType: ChartType = 'doughnut';
  typeRequete=""


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

    
    if (localStorage.getItem('mataccueilUserData') != null) {
      this.user = this.localService.get('mataccueilUserData')
      this.prepare()
      
      // alert('eeeeee')
      this.router.events
        .subscribe(event => {
          if (event instanceof NavigationStart) {
            // alert('okokok')
            this.prepare()
          }
        })
    }
  }


  subject = new Subject<any>();
  selected_type = ""

  prepare(){
    for (let index = 2018; index <= 2040; index++) {
      this.years.push(index)
    }

    this.init()   

    this.activatedRoute.queryParams.subscribe((x:any)=> this.init());

    // this.typeRequete = this.checkType()?.name;
    if(this.selected_type =="0"){
      this.typeRequete = 'de requêtes'
    }else if(this.selected_type =="1"){
      this.typeRequete = 'de plaintes'
    }else if(this.selected_type =="2"){
      this.typeRequete = "de demandes d'informations"
    }else {
      this.typeRequete = "de tous les types"
    }

    this.subject.subscribe((val) => {
      // this.typeRequete = this.checkType()?.name;
      this.barChartLabels = []
      this.doughnutChartLabels = []
      this.barData=[]
      this.barChartData = [
        {
          data: [], label: ''
        },

      ]
      val.forEach((e:any) => {
        this.barChartLabels.push(e.libelle)
        this.doughnutChartLabels.push(e.libelle)
        this.barData.push(e.total)
      })
      this.barChartData = [
        {
          data: this.barData, label:
          'Nombre '+this.typeRequete+' par thématique'
        },
      ]
      this.doughnutChartData=[this.barData]
    })
    
  }

  init() {
    this.barChartLabels = []
    this.doughnutChartLabels = []
    this.barData=[]
    this.barChartData = [
      {
        data: [], label: ''
      },

    ]
    if(this.selected_type == ""){
      this.selected_type = "0"
    }
    this.requeteService.getAllGraphiqueStatSTheme(
      this.selected_type,this.user.idEntite
    ).subscribe((res: any) => {
      this.subject.next(res);
      /*res.forEach((e:any) => {
        this.barChartLabels.push(e.libelle)
        this.doughnutChartLabels.push(e.libelle)
        this.barData.push(e.total)
      })
      this.barChartData = [
        {
          data: this.barData, label:
          'Nombre  de '+this.checkType()?.name+' par thématique'
        },

      ]
      this.doughnutChartData=[this.barData]  */ 
    })


  }


  param_stat={"type":"all","plainte":this.selected_type,startDate:"",endDate:""}


  searchStats(){

    if(this.selected_type == ""){
      this.selected_type = "0"
    }

    this._temp=[]
    this.data=[]
    this.param_stat.plainte = this.selected_type
    this.requeteService.filterAllGraphiqueStatSTheme(
      this.param_stat,this.user.idEntite
    ).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res
      this._temp=this.data
      this.collectionSize=this.data.length

      this.subject.next(res);
        // --------
      
    })
  }
 

  resetStats(){
    this.init()
    this.selected_year = null

    this.param_stat={"type":"all","plainte":this.selected_type,startDate:"",endDate:""}
  }
}
