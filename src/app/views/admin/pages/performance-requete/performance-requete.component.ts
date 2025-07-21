import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModule,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, formatDate } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  Chart,
  registerables,
  ChartConfiguration,
  ChartType,
  ChartData,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { GlobalName } from '../../../../core/utils/global-name';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { StatutComponent } from '../../../components/statut/statut.component';
import { RegistreService } from '../../../../core/services/registre.service';
import { TitleService } from '../../../../core/utils/title.service';
import { SharedModule } from '../../../../shared/shared.module';

Chart.register(...registerables, annotationPlugin, ChartDataLabels);

@Component({
  selector: 'app-performance-requete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    LoadingComponent,
    SampleSearchPipe,
    NgSelectModule,
    NgxPaginationModule,
    StatutComponent,
    BaseChartDirective,
    SharedModule,
  ],
  templateUrl: './performance-requete.component.html',
  styleUrls: ['./performance-requete.component.css'],
})
export class PerformanceRequeteComponent {
  @ViewChild('contentRetraite') contentRetraite: any;
  @ViewChild('contentCarriere') contentCarriere: any;
  @ViewChild('contentPDF') contentPDF: TemplateRef<any> | undefined;
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  pg = {
    pageSize: 10,
    p: 1, // Changé de 0 à 1 pour correspondre à la pagination de l'API
    total: 0,
  };
  page = 1;
  pagerv = 1;
  loading2: boolean = false;
  year_stats: any[] = [];
  monthly_stats: any[] = [];
  registres: any[] = [];
  communes: any[] = [];
  loading: boolean = false;
  id: any;
  data: any;
  graphData: any[] = [];

  user: any;
  access_token: any;
  error = '';
  pg2 = {
    pageSize: 10,
    p: 1, // Changé de 0 à 1 pour la cohérence
    total: 0,
  };

paginatedData: any[] = [];

currentPage: number = 1;
itemsPerPage: number = 10;
totalPages: number = 1;

  search_text: string = '';
  selected_data: any;
  onglet_What = false;
  mat_aff = false;
  endDate: Date = new Date();
  selectedDate: Date[] = [new Date(new Date().getFullYear(), 0, 1), new Date()];
  selectedType: Date = new Date();
  searchForm: FormGroup;

  private newLabel? = 'New label';
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild(BaseChartDirective) chart2?: BaseChartDirective;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Évolution de la fréquentation',
        backgroundColor: 'rgba(17, 132, 90, 0.2)',
        borderColor: '#11845A',
        pointBackgroundColor: '#11845A',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(17, 132, 90, 0.8)',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      y: {
        position: 'left',
        grid: {
          color: '#162233',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {},
      y: {
        min: 0,
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
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total',
        backgroundColor: '#FFC107',
        borderColor: '#11845A',
        borderWidth: 1,
      },
      {
        data: [],
        label: 'Satisfait',
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        borderWidth: 1,
      },
      {
        data: [],
        label: 'Non Satisfait',
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
        borderWidth: 1,
      },
    ],
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'en appuyant sur Échap';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'en cliquant sur l’arrière-plan';
    } else {
      return `avec : ${reason}`;
    }
  }

  constructor(
    private user_auth_service: AuthService,
    private local_service: LocalStorageService,
    private router: Router,
    private registreService: RegistreService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private titleService: TitleService,
    private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas
  ) {
    this.searchForm = new FormGroup({
      dates: new FormControl<Date[] | null>(this.selectedDate, [Validators.required]),
      sex: new FormControl<string | null>('all'),
      commune_id: new FormControl<string[] | null>([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Espace Point Focal Communal');

    if (localStorage.getItem(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName);
      console.log('Utilisateur connecté:', this.user);
      this.onglet_What = this.user?.attribu_com != null;
    }

    this.loadCommunes();
    this.getStats();
  }

  loadCommunes() {
    this.loading2 = true;
    if (!this.user?.id) {
      this.loading2 = false;
      AppSweetAlert.simpleAlert('error', 'Communes', 'Utilisateur non authentifié.');
      return;
    }
    this.registreService.getCommunesByDept(this.user.id).subscribe(
      (res: any) => {
        console.log('Réponse API complète:', res);
        console.log('Communes récupérées:', res.data.original.communes);
        this.communes = [
          { name: 'Toutes', id: 'all' },
          ...res.data.original.communes.map((commune: any) => ({
            name: commune.libellecom,
            id: commune.id.toString(),
          })),
        ];
        console.log('Communes mappées:', this.communes);
        this.searchForm.patchValue({ commune_id: [] });
        this.loading2 = false;
      },
      (err) => {
        console.error('Erreur lors du chargement des communes:', err);
        this.loading2 = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Communes',
          'Erreur lors de la récupération des communes. Vérifiez votre connexion internet.'
        );
      }
    );
  }

  getStats() {
    const { dates, sex, commune_id } = this.searchForm.value;
    console.log('Valeurs du formulaire:', { dates, sex, commune_id });

    if (!dates || dates.length !== 2) {
      AppSweetAlert.simpleAlert(
        'error',
        'Visites',
        'Veuillez sélectionner un intervalle de dates valide.'
      );
      return;
    }

    const start_date = this.onFormatDate(dates[0]);
    const end_date = this.onFormatDate(dates[1]);

    if (end_date < start_date) {
      this.error = 'La date de fin ne peut être antérieure à la date de début';
      AppSweetAlert.simpleAlert('error', 'Visites', this.error);
      return;
    }

    const resource = {
      start_date,
      end_date,
      commune_id: Array.isArray(commune_id)
  ? (commune_id.includes('all') ? [] : commune_id)
  : (commune_id && commune_id !== 'all' ? [commune_id] : []),

      
      sex: sex && sex !== 'all' ? sex : undefined,
    };

    console.log('Ressource envoyée:', resource);

    this.lineChartData.datasets[0].data = [];
    this.lineChartData.labels = [];
    this.barChartData.labels = [];
    this.barChartData.datasets[0].data = [];
    this.barChartData.datasets[1].data = [];
    this.barChartData.datasets[2].data = [];
    this.registres = [];
    this.loading2 = true;

    this.registreService.getStats(resource).subscribe(
      (res: any) => {
        console.log('Données requeteByCom:', res.data);

        // Mise à jour du graphique à barres avec graphData
        this.barChartData.labels = res.data.graphData?.map((item: any) => item.commune) || [];
        this.barChartData.datasets[0].data = res.data.graphData?.map((item: any) => item.total) || [];
        this.barChartData.datasets[1].data = res.data.graphData?.map((item: any) => item.satisfait) || [];
        this.barChartData.datasets[2].data = res.data.graphData?.map((item: any) => item.non_satisfait) || [];

        // Mise à jour du tableau avec tableData.data
        this.registres = res.data.tableData?.data || [];
        this.graphData = res.data.graphData || [];
        this.currentPage = 1;
        this.paginate()

        // Mise à jour de la pagination
        this.pg.pageSize = res.data.tableData?.per_page || 10;
        this.pg.p = res.data.tableData?.current_page || 1;
        this.pg.total = res.data.tableData?.total || 0;

        this.chart?.update();
        this.chart2?.update();
        this.loading2 = false;
      },
      (err) => {
        console.error('Erreur getStats:', err);
        this.loading2 = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          'Erreur, Vérifiez que vous avez une bonne connexion internet'
        );
      }
    );

    this.registreService.getStats2(resource).subscribe(
      (res: any) => {
        console.log('Données getStats2:', res);
        this.year_stats = res.data.year_stats || [];
        this.monthly_stats = res.data.month_stats || [];
        this.year_stats.forEach((el: any) => {
          this.lineChartData.datasets[0].data.push(el.total);
          this.lineChartData.labels?.push(el.mois);
        });

        this.chart?.update();
        this.chart2?.update();
        this.loading2 = false;
      },
      (err) => {
        console.error('Erreur getStats2:', err);
        this.loading2 = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          'Erreur, Vérifiez que vous avez une bonne connexion internet'
        );
      }
    );
  }

  getRegistres() {
    const { dates, sex, commune_id } = this.searchForm.value;
    if (!dates || dates.length !== 2) {
      AppSweetAlert.simpleAlert(
        'error',
        'Visites',
        'Veuillez sélectionner un intervalle de dates valide.'
      );
      return;
    }

    const start_date = this.onFormatDate(dates[0]);
    const end_date = this.onFormatDate(dates[1]);

    if (end_date < start_date) {
      this.error = 'La date de fin ne peut être antérieure à la date de début';
      AppSweetAlert.simpleAlert('error', 'Visites', this.error);
      return;
    }

    const communeIdArray = Array.isArray(commune_id) ? commune_id : (commune_id && commune_id !== 'all' ? [commune_id] : []);

    this.loading2 = true;
    this.registreService.getAll(start_date, end_date, sex, communeIdArray).subscribe(
      (res: any) => {
        console.log('Données getAll:', res);
        // Vérifier si l'API renvoie tableData.data ou directement data
        this.registres = res.data.tableData?.data || res.data || [];
        this.pg.pageSize = res.data.tableData?.per_page || 10;
        this.pg.p = res.data.tableData?.current_page || 1;
        this.pg.total = res.data.tableData?.total || this.registres.length;
        this.modalService.dismissAll();
        this.loading2 = false;
      },
      (err) => {
        console.error('Erreur getRegistres:', err);
        this.loading2 = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          'Erreur, Vérifiez que vous avez une bonne connexion internet'
        );
      }
    );
  }

  paginate() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedData = this.graphData.slice(start, end);
  this.totalPages = Math.ceil(this.graphData.length / this.itemsPerPage);
}
goToPreviousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.paginate();
  }
}

goToNextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.paginate();
  }
}



  getPage(event: any) {
    this.pg.p = event;
    // Appeler getRegistres pour recharger les données de la nouvelle page
    this.getRegistres();
  }

  getPage2(event: any) {
    this.pg2.p = event;
  }

  onFormatDate(event: Date): string {
    const year = event.getFullYear();
    const month = (event.getMonth() + 1).toString().padStart(2, '0');
    const day = event.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}