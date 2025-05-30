import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdvancedStatisticsService } from '../../../../core/services/advanced-statistics.service';
import { ConfigService } from '../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { ObserverService } from '../../../../core/utils/observer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { GlobalName } from '../../../../core/utils/global-name';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  FileChild
  } from 'docx';
Chart.register(ChartDataLabels);


@Component({
  selector: 'app-follow-treatment',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,BaseChartDirective],
  templateUrl: './follow-treatment.component.html',
  styleUrl: './follow-treatment.component.css'
})
export class FollowTreatmentComponent implements OnInit {
  idEntite:any
  evolution:any
  pendings:any
  data:any
  data3:any[]=[]
  data4:any
  elements:any


  //BAR CHARTS
   @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;
    @ViewChild('exportContentRef', { static: false }) exportContentRef!: ElementRef;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Cumul des préoccupations reçues', 'Cumul des préoccupations traitées'],
    datasets: [],
  };

  //BAR CHART 2
    @ViewChild(BaseChartDirective) chart2: BaseChartDirective<'bar'> | undefined;

  public barChartOptions2: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType2 = 'bar' as const;

  public barChartData2: ChartData<'bar'> = {
    labels: ['Cumul des Pl.NT reçues', 'Cumul des DI.NT traitées', 'Total instance'],
    datasets: [],
  };

  constructor(
    
    private modalService: NgbModal,
    private statisticService: AdvancedStatisticsService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService : LocalStorageService,
    private observerService:ObserverService
  ) { }

  ngOnInit(): void {
    this.observerService.setTitle('Point Suivi Traitement')
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.idEntite=this.localStorageService.get(GlobalName.userName)?.idEntite
    }
    this.getStats()
    this.getStatsRapport()
    this.getPerformancesVisits()
  }

  getStats(){
    this.spinner.show();
    this.statisticService.getStats(this.idEntite).subscribe((res:any)=>{
      this.spinner.hide();
      this.data4=res.data
    },
    (error:any)=>{
      this.spinner.hide();
    }
    )
   
  }
  getStatsRapport(){
    this.spinner.show();
    this.statisticService.getStatsRapport(this.idEntite).subscribe((res:any)=>{
      this.spinner.hide();
      this.evolution=res.data.evolution
      this.barChartData.datasets.push({ data: [this.evolution?.semaine_1.nb_req, this.evolution?.semaine_1.nb_req_treated, this.evolution?.semaine_1.taux], label: `${ this.evolution?.semaine_1.du} au ${ this.evolution?.semaine_1.au}` })
      this.barChartData.datasets.push({ data: [this.evolution?.semaine_2.nb_req, this.evolution?.semaine_2.nb_req_treated, this.evolution?.semaine_2.taux], label: `${ this.evolution?.semaine_2.du} au ${ this.evolution?.semaine_2.au}` })

        this.evolution=res.data.evolution
      this.barChartData2.datasets.push({ data: [this.evolution?.semaine_1.nb_req_pl_nt, this.evolution?.semaine_1.nb_req_info_nt, this.evolution?.semaine_1.total], label: `${ this.evolution?.semaine_1.du} au ${ this.evolution?.semaine_1.au}` })
      this.barChartData2.datasets.push({ data: [this.evolution?.semaine_2.nb_req_pl_nt, this.evolution?.semaine_2.nb_req_info_nt, this.evolution?.semaine_2.total], label: `${ this.evolution?.semaine_2.du} au ${ this.evolution?.semaine_2.au}` })
    
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


  get totalRequetes(): number {
  return this.data4?.dataMoyPrestation?.reduce((sum:any, item:any) => sum + (item.total_requetes_traitees || 0), 0) || 0;
}

get totalNotes(): number {
  return this.data4?.dataMoyPrestation?.reduce((sum:any, item:any) => sum + (item.nb_notes_non_nulles || 0), 0) || 0;
}

get sommeTotaleNotes(): number {
  return this.data4?.dataMoyPrestation?.reduce((sum:any, item:any) => sum + (item.somme_notes || 0), 0) || 0;
}

get noteGlobaleMoyenne(): number {
  const totalNotes = this.totalNotes;
  return totalNotes > 0 ? this.sommeTotaleNotes / totalNotes : 0;
}


  get totalRequetes2(): number {
  return this.data4?.dataMoyStructure?.reduce((sum:any, item:any) => sum + (item.total_requetes_traitees || 0), 0) || 0;
}

get totalNotes2(): number {
  return this.data4?.dataMoyStructure?.reduce((sum:any, item:any) => sum + (item.nb_notes_non_nulles || 0), 0) || 0;
}

get sommeTotaleNotes2(): number {
  return this.data4?.dataMoyStructure?.reduce((sum:any, item:any) => sum + (item.somme_notes || 0), 0) || 0;
}

get noteGlobaleMoyenne2(): number {
  const totalNotes2 = this.totalNotes2;
  return totalNotes2 > 0 ? this.sommeTotaleNotes2 / totalNotes2 : 0;
}

calculateEvolution(oldValue: number, newValue: number, isPercentage: boolean = false): string {
  if (oldValue === undefined || newValue === undefined) return 'N/A';

  const diff = newValue - oldValue;
  const symbol = diff > 0 ? '+' : (diff < 0 ? '−' : '');
  const absValue = Math.abs(diff).toFixed(isPercentage ? 2 : 0);
  return `${symbol}${absValue}${isPercentage ? ' %' : ''}`;
}

  printView(){
    // this.spinner.show();
    // this.statisticService.printView({
    // }).subscribe((res:any)=>{
    //   this.spinner.hide();
    //   window.open(`${ConfigService.toFile("")}/${res.data}`,'_blank')

    // },
    // (error:any)=>{
    //   this.spinner.hide();
    // }
    // )
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

  async exportToWord() {
    const node = this.exportContentRef.nativeElement;

    const node1 = document.querySelector('#chart1') as HTMLElement;
    const node2 = document.querySelector('#chart1') as HTMLElement;

    const blobImage1 = await htmlToImage.toBlob(node1!);
    const blobImage2 = await htmlToImage.toBlob(node2!);

    const children: any[] = [];
    children.push(
      new Paragraph({
        text: '1. PERFORMANCE GLOBALE ET ÉVOLUTION',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: 'A. Volume et traitement des préoccupations :',
        heading: HeadingLevel.HEADING_2,
      }),
      blobImage1
        ? new Paragraph({
            children: [new TextRun("Niveau de plaintes et demandes d'information traitées")],
            alignment: AlignmentType.CENTER,
          })
        : null,
      blobImage2
        ? new Paragraph({
            children: [new TextRun('Niveau des instances non traitées')],
            alignment: AlignmentType.CENTER,
          })
        : null
    );

   // Filtrage ici pour éviter l'erreur
const doc = new Document({
      sections: [
        {
          children: children.filter(Boolean) as FileChild[],
        },
      ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, 'rapport-performance.docx');
  }
}
