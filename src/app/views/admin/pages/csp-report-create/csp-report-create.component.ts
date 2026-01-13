import { Component, ElementRef, NgZone, TemplateRef, ViewChild } from '@angular/core';
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
import { GraphComponent } from '../../components/graph/graph.component';

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
    GraphComponent,
    QuillModule,
  ],
  templateUrl: './csp-report-create.component.html',
  styleUrl: './csp-report-create.component.css',
})
export class CspReportCreateComponent {
  @ViewChild('rapportTable', { static: false }) tableRef!: ElementRef;
  @ViewChild('contentPDF') contentPDF: TemplateRef<any> | undefined;
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';   
  quillEditorInstance: any;
  loading2 = false;
  data: any= [];
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
    summary_report: ``,

    summary_synthese_all: ``,

    conclusion: ``,
  };

  search_text = '';
  errormessage = '';
  user: any;
  year: any;
  month: any;
  years: number[] = [];

  graphMap: { [key: string]: any } = {};

  constructor(
    private reportService: ReportService,
    private reportTransmissionService: ReportTransmissionService,
    private modalService: NgbModal,
    private ngZone: NgZone,
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
  ngOnInit(): void {
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName);
      console.log(this.user);
    }
    this.getReports();

  }

  async insertGraphIntoQuill(quill: any, graphId: string, graphConfig: any) {
  const html = await this.generateGraphHTML(graphConfig, graphId);

  const range = quill.getSelection(true);
  quill.clipboard.dangerouslyPasteHTML(range.index, html);
  quill.setSelection(range.index + 1);
}
generateGraphHTML(graphConfig: any, graphId: string): Promise<string> {
  return new Promise((resolve) => {
    // Création d'un canvas temporaire
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    if (!ctx) return resolve('');

    // On désactive l'animation pour que le rendu soit immédiat
    const config = { ...graphConfig, options: { ...graphConfig.options, animation: false } };

    // Créer le graphique
    const chart = new Chart(ctx, config);

    // Utiliser requestAnimationFrame pour s'assurer que le rendu est terminé
    requestAnimationFrame(() => {
      const imgBase64 = canvas.toDataURL('image/png');
      chart.destroy();

      const html = `<img src="${imgBase64}" alt="${graphId}" style="max-width:100%; display:block; margin:10px 0;" />`;
      resolve(html);
    });
  });
}

setQuillInstance(editor: any) {
  this.quillEditorInstance = editor;
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
          err.error.message
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
        if (this.user.agent_user.categorie_acteur === 'departemental') {
          this.data = res.data;

          this.filteredStats = this.generateTable(this.data);
        } else {
          const dataForStats = res.data?.di_stats?.stats;
          const dataForStats2 = res.data?.plainte_stats?.stats;

          this.graphMap={
             plaintes_stat:{
              type: 'bar',
              data: {
                labels: dataForStats2.map((item: any) => item.structure),
                datasets: [
                   {
                    label: 'Totales Plaintes',
                    data: dataForStats2.map((item: any) => item.total),
                    backgroundColor: 'rgba(75,192,192,0.5)',
                  },
                  {
                    label: 'Plaintes Non Traitées',
                    data: dataForStats2.map((item: any) => item.non_traitees),
                    backgroundColor: 'rgba(153,102,255,0.5)',
                  },
                ],
              },
              options: { responsive: true, animation: false },
            },
            di_stat:{
              type: 'bar',
              data: {
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
              },
              options: { responsive: true, animation: false },
            }
          }
          this.data = res.data.groupedByDepartement;
          this.syntheses = res.data.synthese;
          this.frequentations = res.data.frequentations;
          this.months = res.data.months;
          this.sexData = res.data.groupedByDepartement;
          this.initializeSynthse(this.month, this.year)
        }
        this.modalService.dismissAll();
        this.loading2 = false;
      },
      (err: any) => {
        this.loading2 = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          err.error.message
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

    if (this.user.agent_user.categorie_acteur === 'departemental') {
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
          err.error.message
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
          err.error.message
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
            err.error.message,
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

  initializeSynthse(mois:any,year:any){
      this.formData = {
    summary_report: `Au titre du mois de ${this.getMoisFrancais(mois)}, les rapports mensuels ont été fournis pour la plupart dans les délais aussi bien par les points focaux que par les DDTFP. Tous les DDTFP ont assorti leurs rapports de commentaires analytiques exploitables.`,

    summary_synthese_all: `<p>La&nbsp;compilation&nbsp;des&nbsp;rapports&nbsp;mensuels&nbsp;tels&nbsp;que&nbsp;reçus&nbsp;des&nbsp;points&nbsp;focaux&nbsp;est&nbsp;en&nbsp;annexe&nbsp;1.&nbsp;Le&nbsp;tableau&nbsp;des&nbsp;statistiques&nbsp;comparatives&nbsp;relatives&nbsp;aux&nbsp;taux&nbsp;fréquentation&nbsp;et&nbsp;de&nbsp;satisfaction&nbsp;est&nbsp;en&nbsp;annexe&nbsp;2.&nbsp;Ce&nbsp;tableau&nbsp;comparatif&nbsp;appelle&nbsp;les&nbsp;commentaires&nbsp;analytiques&nbsp;ci-après&nbsp;:&nbsp;</p><p></p><p>2.1.&nbsp;Fréquentation&nbsp;des&nbsp;CCSP&nbsp;et&nbsp;GSRU&nbsp;Au&nbsp;cours&nbsp;du&nbsp;mois&nbsp;de&nbsp;${this.getMoisFrancais(mois)} ${year},&nbsp;....................&nbsp;</p><p>Le&nbsp;graphique&nbsp;ci-après,&nbsp;présente&nbsp;l’évolution&nbsp;des&nbsp;statistiques&nbsp;de&nbsp;fréquentation&nbsp;des&nbsp;CCSP&nbsp;et&nbsp;GSRU&nbsp;:&nbsp;</p><p>(Insérer&nbsp;le&nbsp;graphe&nbsp;de&nbsp;la&nbsp;fréquentation)&nbsp;</p><p></p><p>2.2.&nbsp;Niveau&nbsp;de&nbsp;satisfaction&nbsp;des&nbsp;usagers&nbsp;Au&nbsp;cours&nbsp;du&nbsp;mois&nbsp;de&nbsp;${this.getMoisFrancais(mois)} ${year},&nbsp;le&nbsp;taux&nbsp;global&nbsp;de&nbsp;satisfaction&nbsp;des&nbsp;usagers&nbsp;..................&nbsp;</p><p></p><p>2.3.&nbsp;Principaux&nbsp;motifs&nbsp;d’insatisfaction&nbsp;des&nbsp;usagers&nbsp;</p><p></p><p>2.4.&nbsp;Traitement&nbsp;des&nbsp;plaintes&nbsp;et&nbsp;de&nbsp;préoccupations&nbsp;émises&nbsp;par&nbsp;les&nbsp;usagers&nbsp;Les&nbsp;statistiques&nbsp;des&nbsp;plaintes&nbsp;enregistrées&nbsp;au&nbsp;cours&nbsp;du&nbsp;mois&nbsp;de&nbsp;${this.getMoisFrancais(mois)} ${year}&nbsp;au&nbsp;niveau&nbsp;.......................&nbsp;</p><p>(Insérer&nbsp;le&nbsp;graphe&nbsp;des&nbsp;plaintes)&nbsp;</p><p></p><p>Quant&nbsp;aux&nbsp;demandes&nbsp;d’informations&nbsp;ou&nbsp;requêtes&nbsp;formulées&nbsp;par&nbsp;les&nbsp;usagers,&nbsp;les&nbsp;statistiques&nbsp;au&nbsp;cours&nbsp;du&nbsp;mois&nbsp;de&nbsp;${this.getMoisFrancais(mois)} ${year}&nbsp;se&nbsp;présentent&nbsp;comme&nbsp;indiqué&nbsp;dans&nbsp;le&nbsp;graphique&nbsp;suivant&nbsp;:&nbsp;Ce&nbsp;graphique&nbsp;révèle&nbsp;que&nbsp;pendant&nbsp;le&nbsp;mois&nbsp;de&nbsp;${this.getMoisFrancais(mois)} ${year}&nbsp;...............&nbsp;</p><p></p><p>Au&nbsp;regard&nbsp;de&nbsp;ce&nbsp;qui&nbsp;précède,&nbsp;le&nbsp;taux&nbsp;moyen&nbsp;global&nbsp;de&nbsp;traitement&nbsp;des&nbsp;préoccupations&nbsp;..............................................&nbsp;</p><p>(Insérer&nbsp;le&nbsp;graphe&nbsp;des&nbsp;demandes&nbsp;d&#39;information)&nbsp;</p><p></p><p>2.5&nbsp;Problèmes/difficultés&nbsp;rencontrées&nbsp;par&nbsp;les&nbsp;points&nbsp;focaux&nbsp;Au&nbsp;cours&nbsp;du&nbsp;mois&nbsp;de&nbsp;${this.getMoisFrancais(mois)} ${year},&nbsp;les&nbsp;difficultés&nbsp;signalées&nbsp;concernent&nbsp;essentiellement&nbsp;:&nbsp;</p><p></p><p>2.6.&nbsp;Approches&nbsp;de&nbsp;solutions&nbsp;</p>`,

    conclusion: `Au cours du mois de ${this.getMoisFrancais(mois)} ${year},...............................................`,
  };
  }

  getMoisFrancais(mois: string): string {
  const moisMap: { [key: string]: string } = {
    "01": "Janvier",
    "02": "Février",
    "03": "Mars",
    "04": "Avril",
    "05": "Mai",
    "06": "Juin",
    "07": "Juillet",
    "08": "Août",
    "09": "Septembre",
    "10": "Octobre",
    "11": "Novembre",
    "12": "Décembre"
  };
  return moisMap[mois] || mois;
}

}
