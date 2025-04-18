import { Component, OnInit } from '@angular/core';
// import { Color, Label, MultiDataSet } from 'ng2-charts';
// import { ChartDataSets, ChartType } from 'chart.js';
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

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ActeurService } from '../../../../core/services/acteur.service';
import { EtapeService } from '../../../../core/services/etape.service';

import { NatureRequeteService } from '../../../../core/services/nature-requete.service';
import { RequeteService } from '../../../../core/services/requete.service';
import { ServiceService } from '../../../../core/services/service.service';
import { StructureService } from '../../../../core/services/structure.service';
import { TypeService } from '../../../../core/services/type.service';
import { UsagerService } from '../../../../core/services/usager.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


 /* lineChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0], label: 'Nbre réservation par mois' },
  ];
  
  lineChartLabels: Label[] = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin','Juil',"Août","Sept","Oct","Nov","Dec"];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
 //
  doughnutChartLabels: Label[] = ['Réservations valider', 'Réservations rejeter', 'Réservations en attente'];
  doughnutChartData: MultiDataSet = [
    [89, 14, 5]
  ];
 
  doughnutChartType: ChartType = 'doughnut';


  //
  current_role="" 
  */


  stats=[]
  statsCour=[]
  stats1=[]
  stats2=[]
  isAdmin = false
  isDecisionel = false
  constructor(
  private modalService: NgbModal,
  private userService: UsagerService,
  private router:Router,
  private translate:TranslateService,
  private etapeService:EtapeService,
  private requeteService:RequeteService,
  private localService:LocalStorageService,
  private prestationService:ServiceService,
  private structureService:StructureService,
  private acteurService: ActeurService,
  private natureService:NatureRequeteService,
  private thematiqueService:TypeService,
  private usagersService:UsagerService,
  private spinner: NgxSpinnerService,
  private activatedRoute: ActivatedRoute,
) { }


typeRequete=""
user:any


checkType(){
  if(this.activatedRoute.snapshot.paramMap.get('type_req')=="plaintes"){
    return {id:1,name:"plainte"}
  }
  if(this.activatedRoute.snapshot.paramMap.get('type_req')=="requetes"){
    return {id:0,name:"requête"}
  }
  if(this.activatedRoute.snapshot.paramMap.get('type_req')=="infos"){
    return {id:2,name:"demande d'information"}
  }
}

ngOnInit(): void {

  if (localStorage.getItem('mataccueilUserData') != null) {
    this.user = this.localService.get('mataccueilUserData')
      console.log('ssssssssssssssss')
      console.log(this.user)
      this.isAdmin = true;
    if (this.user.idprofil == '19' || this.user.idprofil == '20' || this.user.idprofil == '21' || this.user.idprofil == '36' ) { //Décisionnel : Ministre - DC - SGM - Super admin et admin  || this.user?.agent_user?.structure?.type_s == 'dg'
      this.isDecisionel = true;
    } else {
       this.isDecisionel = false;
    }
    this.init()
  }
  console.log(this.user)
}
total_e = 0
traite_e = 0
non_traite_e_news = 0
rejete_e = 0
pending_e = 0

statEservice = []


init(){
  this.stats=[]
  this.requeteService.getStat(this.user.id,0,this.user.idEntite).subscribe((res:any)=>{
    this.spinner.hide();
    if(res){
      this.stats=res
    }
  })
  this.statsCour=[]
  this.requeteService.getStatCour(this.user.id,0,this.user.idEntite).subscribe((res:any)=>{
    this.spinner.hide();
    if(res){
      this.statsCour=res
    }
  })

  this.stats1=[]
  this.requeteService.getStat(
    this.user.id,
   1,this.user.idEntite
  ).subscribe((res:any)=>{
    this.spinner.hide();
    if(res){
      this.stats1=res
    }
  })
  this.stats2=[]
  this.requeteService.getStat(
    this.user.id,
   2,this.user.idEntite
  ).subscribe((res:any)=>{
    this.spinner.hide();
    if(res){
      this.stats2=res
    }
  })

  this.statEservice = []
  this.acteurService.Recup_Stat_E_Service("").subscribe((res:any)=>{
    this.statEservice = res.data.stats.forEach((e:any)=>{
      this.total_e += e.total
      this.traite_e += e.treated
      this.non_traite_e_news += e.news
      this.rejete_e += e.rejected
      this.pending_e += e.pending
    })
  })
}


}
