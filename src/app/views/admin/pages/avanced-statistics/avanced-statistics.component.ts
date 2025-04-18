import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
// import { Config } from 'src/app/app.config';
// import { AdvancedStatisticsService } from 'src/app/core/_services/advanced-statistics.service';
// import { LocalService } from 'src/app/core/_services/browser-storages/local.service';
// import { CcspServiceService } from 'src/app/core/_services/ccsp-service.service';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { AdvancedStatisticsService } from '../../../../core/services/advanced-statistics.service';
import { LocalService } from '../../../../core/services/local.service';
import { ConfigService } from '../../../../core/utils/config-service';

@Component({
  selector: 'app-avanced-statistics',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './avanced-statistics.component.html',
  styleUrls: ['./avanced-statistics.component.css']
})
export class AvancedStatisticsComponent implements OnInit {
  data:any
  data1:any
  data2:any
  data3:any[]=[]
  elements:any

  constructor(
    
    private modalService: NgbModal,
    private statisticService: AdvancedStatisticsService,
    private router:Router,
    private translate:TranslateService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService : LocalService
  ) { }

  ngOnInit(): void {
    this.getTogetherViews()
    this.getTogetherViews2()
    this.getPerformances()
    this.getPerformancesVisits()
  }

  getTogetherViews(){
    this.spinner.show();
    this.statisticService.getTogetherViews().subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.data
    },
    (error:any)=>{
      this.spinner.hide();
    }
    )
   
  }
  getTogetherViews2(){
    this.spinner.show();
    this.statisticService.getTogetherViews2().subscribe((res:any)=>{
      this.spinner.hide();
      this.data1=res.data
    },
    (error:any)=>{
      this.spinner.hide();
    }
    )
   
  }
  getPerformances(){
    this.spinner.show();
    this.statisticService.getPerformances().subscribe((res:any)=>{
      this.spinner.hide();
      this.data2=res.data
    },
    (error:any)=>{
      this.spinner.hide();
    }
    )
   
  }
  getPerformancesVisits(){
    this.spinner.show();
    this.statisticService.getPerformancesVisits().subscribe((res:any)=>{
      this.spinner.hide();
      this.data3=res.data
    },
    (error:any)=>{
      this.spinner.hide();
    }
    )
   
  }

  open(content:any,elements?:any){
    this.elements=elements
    this.modalService.open(content)
  }

  printView(){
    this.spinner.show();
    this.statisticService.printView({
      data:this.data,
      data1:this.data1,
      data2:this.data2,
      data3:this.data3,
      elements:this.data2?.bad_notes,
    }).subscribe((res:any)=>{
      this.spinner.hide();
      window.open(`${ConfigService.toFile("")}/${res.data}`,'_blank')

    },
    (error:any)=>{
      this.spinner.hide();
    }
    )
  }
}
