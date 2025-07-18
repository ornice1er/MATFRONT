import {
  Component,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-csp-report-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    QuillModule,
    LoadingComponent,
    SampleSearchPipe,
    NgSelectModule,
    NgxPaginationModule,
    NgxExtendedPdfViewerModule,
    FontAwesomeModule,
    RouterModule,
  ],
  templateUrl: './csp-report-create.component.html',
  styleUrl: './csp-report-create.component.css',
})
export class CspReportCreateComponent {
  @ViewChildren('editor') editor: QueryList<QuillEditorComponent> | undefined;

  isBrowser = false;
  summary = '';
  quillModules: any = null; // Initialisé à null
  quillReady = false; // Flag pour savoir si Quill est prêt

  @ViewChild('contentPDF') contentPDF: TemplateRef<any> | undefined;
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  loading2 = false;
  data: any[] = [];
  registresReports: any[] = [];
  selected_data: any;
  closeResult: any;
  pg2 = {
    pageSize: 10,
    p: 0,
    total: 0,
  };
  search_text = '';
  errormessage = '';
  user: any;
  years: number[] = [];

  constructor(
    private reportService: ReportService,
    private reportTransmissionService: ReportTransmissionService,
    private modalService: NgbModal,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const currentYear = new Date().getFullYear();
    const range = 5;

    this.years = Array.from(
      { length: 2 * range + 1 },
      (_, i) => currentYear - range + i
    );
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName);
      console.log(this.user);
    }

    if (this.isBrowser) {
      this.initializeQuillModules();
    }
    
    this.getReports();
  }

  private initializeQuillModules() {
    // Configuration de base d'abord
    this.quillModules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    };
    this.quillReady = true;

    // Ensuite, essayer de charger better-table
    import('quill-better-table')
      .then((tableModule) => {
        const Quill = require('quill');
        Quill.register(
          {
            'modules/better-table': tableModule.default,
          },
          true
        );

        // Mise à jour de la configuration avec better-table
        this.quillModules = {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['insertTable'],
              ['clean'],
            ],
            handlers: {
              insertTable: this.insertTableHandler.bind(this),
            },
          },
          'better-table': {
            operationMenu: {
              items: {
                unmergeCells: { text: 'Unmerge cells' },
              },
            },
          },
          clipboard: {
            matchVisual: false,
          },
        };
      })
      .catch((err) => {
        console.error("Erreur lors de l'import de quill-better-table :", err);
        // Garder la configuration de base
      });
  }

  insertTableHandler() {
    const editorArray = this.editor?.toArray();
    const firstEditor = editorArray && editorArray[0];

    if (firstEditor) {
      const tableModule = firstEditor.quillEditor.getModule(
        'better-table'
      ) as any;
      if (tableModule && typeof tableModule.insertTable === 'function') {
        tableModule.insertTable(3, 3);
      } else {
        console.error(
          'Module better-table non chargé ou insertTable non disponible'
        );
      }
    }
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
        this.loading2 = false; // Correction: c'était true
        AppSweetAlert.simpleAlert(
          'error',
          'Visites',
          'Erreur, Verifiez que vous avez une bonne connexion internet'
        );
      }
    );
  }

  getDataReport(value: any) {
    this.loading2 = true;
    this.reportService.getDataReport(value).subscribe(
      (res: any) => {
        this.data = res.data;
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

  storeReport(value: any) {
    value.summary = this.summary;
    this.loading2 = true;
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
          'Erreur, Verifiez que vous avez une bonne connexion internet'
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
}