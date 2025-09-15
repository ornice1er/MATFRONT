import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import {
  NgbModal,
  NgbOffcanvas,
  ModalDismissReasons,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ReportTransmissionService } from '../../../../core/services/report-transmission.service';
import { ReportService } from '../../../../core/services/report.service';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { ConfigService } from '../../../../core/utils/config-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-csp-report-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    LoadingComponent,
    SampleSearchPipe,
    NgSelectModule,
    NgxPaginationModule,
    NgxExtendedPdfViewerModule,
    FontAwesomeModule,
    RouterModule,
    QuillModule,
  ],
  templateUrl: './csp-report-create.component.html',
  styleUrl: './csp-report-create.component.css',
})
export class CspReportCreateComponent {
  @ViewChild('rapportTable', { static: false }) tableRef!: ElementRef;
  @ViewChild('contentPDF') contentPDF: TemplateRef<any> | undefined;
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  loading2 = false;
  data: any[] = [];
  syntheses: any[] = [];
  frequentations: any[] = [];
  months: any[] = [];
  registresReports: any[] = [];
  filteredStats: any[] = [];
  sexData: any[] = [];
  selected_data: any;
  closeResult: any;
  pg2 = {
    pageSize: 10,
    p: 0,
    total: 0,
  };

  formData: any = {
    summary_report: `Au titre du mois de juillet, les rapports mensuels ont été fournis pour la plupart dans les délais aussi bien par les points focaux que par les DDTFP. Tous les DDTFP ont assorti leurs rapports de commentaires analytiques exploitables.`,

    summary_synthese_all: `La compilation des rapports mensuels tels que reçus des points focaux est en annexe 1.
Le tableau des statistiques comparatives relatives aux taux fréquentation et de satisfaction est en annexe 2. Ce tableau comparatif appelle les commentaires analytiques ci-après :
[GRAPH:di_stat]
... (contenu que tu m’as donné précédemment) ...
`,

    conclusion: `Au cours du mois de juillet 2025, tous les centres de service en ligne (CCSP et GSRU) sont restés opérationnels.
On note une reprise spectaculaire de la tendance haussière de la fréquentation rompue depuis trois mois et la majorité des usagers visiteurs ont été satisfaits.
Il convient de noter que (i) l’organisation de la session du comité technique de gestion des CCSP et GSRU, (ii) la tournée foraine organisée par la DGFP dans les départements des Collines et de la Donga ainsi que (iii) la participation du MTFP à la 1ère Conférence des Préfets au titre de 2025, qui a consacré l’implication effective des Préfets dans la supervision du fonctionnement des CCSP et GSRU, ont contribué à cette performance. La récente lettre d’instructions et de rappel du Ministre aux DDTFP (5 août 2025) sur le rôle qui leur revient dans la coordination départementale de la gestion desdits centres permettra sûrement d’améliorer durablement cette performance.

Au regard de ce qui précède, les recommandations suivantes sont formulées :

- DGFP:
  Exécuter diligemment la mission d’appui et d’assistance aux ministères à gros effectifs pour l’élaboration, la prise et la mise en ligne des actes de carrières de leurs personnels respectifs.

- DSI, PRMP, DNP/PARMAP:
  * Accélérer la mise en place de l’accord cadre de maintenance corrective et préventive des CCSP et GSRU ;
  * Promouvoir le traitement automatique des plaintes et préoccupations adressées aussi bien aux structures du MTFP qu’à celles des ministères sectoriels et institutions de la République ;
  * Faire aboutir diligemment le marché d’acquisition des fournitures et matériels de bureau au profit des CCSP et GSRU.

- PFCom:
  * Élaborer et mettre en œuvre un programme spécial de communication intensive sur les CCSP et GSRU à l’endroit des populations.

- Toutes structures du MTFP:
  * Poursuivre le traitement diligent des plaintes et des demandes d’information exprimées par les usagers de l’Administration publique à travers les plateformes des CCSP/GSRU et du Centre de service du Ministère.`,
  };

  search_text = '';
  errormessage = '';
  user: any;
  year: any;
  month: any;
  years: number[] = [];

  graphMap: { [key: string]: any } = {
    di_stat: {
      type: 'bar',
      data: {
        labels: ['Juin', 'Juillet', 'Juilletrt', 'Juilletd', 'Juilletg'],
        datasets: [
          {
            label: 'Totales DI',
            data: [0, 40, 67, 89, 90],
            backgroundColor: 'rgba(75,192,192,0.5)',
          },
          {
            label: 'DI Non Traitées',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(153,102,255,0.5)',
          },
        ],
      },
      options: { responsive: true },
    },
  };

  constructor(
    private reportService: ReportService,
    private reportTransmissionService: ReportTransmissionService,
    private modalService: NgbModal,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private localStorageService: LocalStorageService
  ) {
    const currentYear = new Date().getFullYear();
    const range = 5;

    this.years = Array.from(
      { length: 2 * range + 1 },
      (_, i) => currentYear - range + i
    );
  }
  async ngOnInit(): Promise<void> {
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName);
      console.log(this.user);
    }
    this.getReports();
    // this.formData.summary_synthese_all= this.replaceGraphsInText(this.formData.summary_synthese_all);
    console.log(await this.replaceGraphsInText(this.formData.summary_synthese_all));
  }

  async replaceGraphsInText(text: string): Promise<string> {
    const regex = /\[GRAPH:([a-zA-Z0-9_]+)\]/g;
    const promises: Promise<string>[] = [];

    text.replace(regex, (match, graphId) => {
      promises.push(
        new Promise((resolve) => {
          const graph = this.graphMap[graphId];
          if (!graph) return resolve('');

          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve('');

          const chart = new Chart(ctx, {
            ...graph,
            options: {
              ...graph.options,
              animation: {
                onComplete: () => {
                  const imgBase64 = canvas.toDataURL('image/png');
                  chart.destroy();
                  resolve(
                    `<img src="${imgBase64}" alt="${graphId}" style="max-width:100%; display:block; margin:10px 0;" />`
                  );
                },
              },
            },
          });
        })
      );
      return match;
    });

    const results = await Promise.all(promises);
    return text.replace(regex, () => results.shift() || '');
  }

  checkedRegistreReport(el: any) {
    this.selected_data = el;
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

  openReportModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openReportEditModal(content: any, el: any) {
    this.selected_data = el;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  openReportShowModal(content: any, el: any) {
    this.selected_data = el;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  getReports() {
    this.loading2 = true;
    this.reportService.getAll().subscribe(
      (res: any) => {
        this.registresReports = res.data;
        this.pg2.pageSize = 10;
        this.pg2.p = 1;
        this.pg2.total = res.data.length;
        this.modalService.dismissAll();
        this.loading2 = false;
      },
      (err: any) => {
        this.loading2 = true;
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          'Erreur, Verifiez que vous avez une bonne connexion internet'
        );
      }
    );
  }

  getTotal(arr: any[], key: string): number {
    return arr.reduce((sum, item) => {
      const val = parseFloat(item[key]);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }

  getDataReport(value: any) {
    this.loading2 = true;
    this.reportService.getDataReport(value).subscribe(
      (res: any) => {
        if (this.user.agent_user.categorie_acteur === 'Departemental') {
          this.data = res.data;

          this.filteredStats = this.generateTable(this.data);
        } else {
          const dataForStats = res.data?.di_stats?.stats;
          this.graphMap['di_stat'].data = {
            labels: dataForStats.map((item: any) => item.structure),
            datasets: [
              {
                label: 'Totales DI',
                data: dataForStats.map((item: any) => item.total),
                backgroundColor: 'rgba(75,192,192,0.5)',
              },
              {
                label: 'DI Non Traitées',
                data: dataForStats.map((item: any) => item.non_traitees),
                backgroundColor: 'rgba(153,102,255,0.5)',
              },
            ],
          };

          this.formData.summary_synthese_all = this.replaceGraphsInText(
            this.formData.summary_synthese_all
          );
          this.data = res.data.groupedByDepartement;
          this.syntheses = res.data.synthese;
          this.frequentations = res.data.frequentations;
          this.months = res.data.months;

          this.sexData = res.data.groupedByDepartement;
        }
        this.modalService.dismissAll();
        this.loading2 = false;
      },
      (err: any) => {
        this.loading2 = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          'Erreur, Verifiez que vous avez une bonne connexion internet'
        );
      }
    );
  }

  generateTable(data: any[]) {
    const communeMap: any = {};
    let totalReceivedMale = 0;
    let totalReceivedFemale = 0;
    let totalSatisfiedMale = 0;
    let totalSatisfiedFemale = 0;

    data.forEach((item) => {
      const structure = item.user?.agent_user?.structure;
      const commune = structure?.libelle || 'Inconnu';

      if (!communeMap[commune]) {
        communeMap[commune] = {
          commune,
          receivedMale: 0,
          receivedFemale: 0,
          satisfiedMale: 0,
          satisfiedFemale: 0,
        };
      }

      const receivedMale = item.customer_recieved_male || 0;
      const receivedFemale = item.customer_recieved_female || 0;
      const satisfiedMale = item.customer_satisfied_male || 0;
      const satisfiedFemale = item.customer_satisfied_female || 0;

      communeMap[commune].receivedMale += receivedMale;
      communeMap[commune].receivedFemale += receivedFemale;
      communeMap[commune].satisfiedMale += satisfiedMale;
      communeMap[commune].satisfiedFemale += satisfiedFemale;

      totalReceivedMale += receivedMale;
      totalReceivedFemale += receivedFemale;
      totalSatisfiedMale += satisfiedMale;
      totalSatisfiedFemale += satisfiedFemale;
    });

    const tableData = Object.values(communeMap).map((c: any) => ({
      ...c,
      receivedTotal: c.receivedMale + c.receivedFemale,
      satisfiedTotal: c.satisfiedMale + c.satisfiedFemale,
    }));

    // Ajouter la ligne de total global
    tableData.push({
      commune: 'Total général',
      receivedMale: totalReceivedMale,
      receivedFemale: totalReceivedFemale,
      receivedTotal: totalReceivedMale + totalReceivedFemale,
      satisfiedMale: totalSatisfiedMale,
      satisfiedFemale: totalSatisfiedFemale,
      satisfiedTotal: totalSatisfiedMale + totalSatisfiedFemale,
    });

    return tableData;
  }

  generateTableHtml(data: any[]): string {
    const rows = this.generateTable(data); // utilise ta méthode existante

    let html = `
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Commune</th>
          <th>Reçus (H)</th>
          <th>Reçus (F)</th>
          <th>Total reçus</th>
          <th>Satisfaits (H)</th>
          <th>Satisfaits (F)</th>
          <th>Total satisfaits</th>
        </tr>
      </thead>
      <tbody>
  `;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const isTotal = i === rows.length - 1;
      html += `
      <tr style="${isTotal ? 'font-weight:bold;background-color:#eee;' : ''}">
        <td>${r.commune}</td>
        <td>${r.receivedMale}</td>
        <td>${r.receivedFemale}</td>
        <td>${r.receivedTotal}</td>
        <td>${r.satisfiedMale}</td>
        <td>${r.satisfiedFemale}</td>
        <td>${r.satisfiedTotal}</td>
      </tr>
    `;
    }

    html += `
      </tbody>
    </table>
  `;

    return html;
  }

  storeReport(value: any) {
    this.loading2 = true;

    value.summary_report = this.formData.summary_report;
    value.summary_synthese_all = this.formData.summary_synthese_all;
    value.conclusion = this.formData.conclusion;

    if (this.user.agent_user.categorie_acteur === 'Departemental') {
      const summaryHtml = this.generateTableHtml(this.data);
      value['summary_synthese'] = summaryHtml;
    } else {
      const htmlTable = this.tableRef.nativeElement.outerHTML;
      value['summary_synthese'] = htmlTable;
    }

    this.reportService.store(value).subscribe(
      (res: any) => {
        this.router.navigate(['/admin/ccsp/reports/own']);
        this.modalService.dismissAll();
        this.loading2 = false;
      },
      (err: any) => {
        this.loading2 = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          'Erreur, Vérifiez que vous avez une bonne connexion internet'
        );
      }
    );
  }

  updateReport(value: any) {
    this.loading2 = true;
    this.reportService.update(this.selected_data.id, value).subscribe(
      (res: any) => {
        this.getFile(res.data);
        this.modalService.dismissAll();
        this.loading2 = false;
        this.getReports();
      },
      (err: any) => {
        this.loading2 = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          'Erreur, Verifiez que vous avez une bonne connexion internet'
        );
      }
    );
  }
  deleteReport(id: any) {
    let confirmed = AppSweetAlert.simpleAlertConfirm(
      'info',
      'Suppression',
      'Voulez vous vraiment retirer cet élément?'
    );
    confirmed.then((result: any) => {
      if (result.isConfirmed) {
        this.reportService.delete(id).subscribe(
          (res: any) => {
            this.getReports();
          },
          (err: any) => {
            console.log(err);
            AppSweetAlert.simpleAlert(
              'error',
              'Type de dossier',
              err.error.message
            );
          }
        );
      }
    });
  }

  getFile(filename: any) {
    this.pdfSrc = ConfigService.toFile(`storage/${filename}`);
    window.open(this.pdfSrc, '_blank');
    console.log(this.pdfSrc);
    //  this.offcanvasService.open(this.contentPDF,{  panelClass: 'details-panel', position: 'end'  });
  }

  transmit(id: any) {
    this.loading2 = true;
    this.reportTransmissionService
      .store({
        report_id: id,
        sens: 1,
      })
      .subscribe(
        (res: any) => {
          this.loading2 = false;
          this.getReports();
        },
        (err: any) => {
          this.loading2 = false;
          AppSweetAlert.simpleAlert(
            'Visites',
            'Erreur, Verifiez que vous avez une bonne connexion internet',
            'error'
          );
        }
      );
  }
  getPage2(event: any) {
    this.pg2.p = event;
  }

  getTotal2(dep: { key: string; value: any[] }, field: string): number {
    return dep.value.reduce((acc, item) => {
      return acc + (Number(item?.[field]) || 0);
    }, 0);
  }
}
