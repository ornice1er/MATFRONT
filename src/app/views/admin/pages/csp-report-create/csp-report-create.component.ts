import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-csp-report-create',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,NgxExtendedPdfViewerModule,FontAwesomeModule,RouterModule],
  templateUrl: './csp-report-create.component.html',
  styleUrl: './csp-report-create.component.css'
})
export class CspReportCreateComponent {
@ViewChild('contentPDF') contentPDF:TemplateRef<any> | undefined
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  loading2=false
  data:any[]=[]
  registresReports:any[]=[]
  filteredStats :any[]=[]
  selected_data:any
  closeResult:any
  pg2={
    pageSize:10,
    p:0,
    total:0
  }
  search_text=""
  errormessage=""
  user:any;
  year:any;
  month:any;
  years: number[] = [];

  constructor(
    private  reportService:ReportService,
    private  reportTransmissionService:ReportTransmissionService,
    private modalService: NgbModal,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private localStorageService:LocalStorageService

  ){
 const currentYear = new Date().getFullYear();
    const range = 5;

    this.years = Array.from({ length: 2 * range + 1 }, (_, i) => currentYear - range + i);
  }
  ngOnInit(): void {
    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName)
       console.log(this.user)
    }
    this.getReports()
  }


  
  checkedRegistreReport(el:any){
    this.selected_data=el
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


  openReportModal(content:any){
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  openReportEditModal(content:any,el:any){
    this.selected_data=el
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openReportShowModal(content:any,el:any){
    this.selected_data=el
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  

  

  getReports(){
    this.loading2=true
    this.reportService.getAll().subscribe((res: any) => {
      this.registresReports=res.data 
      this.pg2.pageSize=10
      this.pg2.p=1
      this.pg2.total=res.data.length
      this.modalService.dismissAll()
      this.loading2=false
    }, (err:any) => {
      this.loading2=true
      AppSweetAlert.simpleAlert('error',"Visites", "Erreur, Verifiez que vous avez une bonne connexion internet")
    })
  }
  
  getDataReport(value:any){
    this.loading2=true
    this.reportService.getDataReport(value).subscribe((res: any) => {
      this.data=res.data
      this.filteredStats = this.generateTable(this.data);
      this.modalService.dismissAll()
      this.loading2=false
    }, (err:any) => {
      this.loading2=false
      AppSweetAlert.simpleAlert('error',"Visites", "Erreur, Verifiez que vous avez une bonne connexion internet")
    })
  }

generateTable(data: any[]) {
  const communeMap: any = {};
  let totalReceivedMale = 0;
  let totalReceivedFemale = 0;
  let totalSatisfiedMale = 0;
  let totalSatisfiedFemale = 0;

  data.forEach(item => {
    const structure = item.user?.agent_user?.structure;
    const commune = structure?.libelle || 'Inconnu';

    if (!communeMap[commune]) {
      communeMap[commune] = {
        commune,
        receivedMale: 0,
        receivedFemale: 0,
        satisfiedMale: 0,
        satisfiedFemale: 0
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
    satisfiedTotal: c.satisfiedMale + c.satisfiedFemale
  }));

  // Ajouter la ligne de total global
  tableData.push({
    commune: 'Total général',
    receivedMale: totalReceivedMale,
    receivedFemale: totalReceivedFemale,
    receivedTotal: totalReceivedMale + totalReceivedFemale,
    satisfiedMale: totalSatisfiedMale,
    satisfiedFemale: totalSatisfiedFemale,
    satisfiedTotal: totalSatisfiedMale + totalSatisfiedFemale
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


  storeReport(value:any){
    this.loading2=true
      const summaryHtml = this.generateTableHtml(this.data);
      value['summary_synthese']=summaryHtml
    this.reportService.store(value).subscribe((res: any) => {
      this.router.navigate(['/admin/ccsp/reports/own'])
      this.modalService.dismissAll()
      this.loading2=false
    }, (err:any) => {
      this.loading2=false
      AppSweetAlert.simpleAlert('error',"Visites", "Erreur, Verifiez que vous avez une bonne connexion internet")
    })
  }
  updateReport(value:any){
    this.loading2=true
    this.reportService.update(this.selected_data.id, value).subscribe((res: any) => {
      this.getFile(res.data)
      this.modalService.dismissAll()
      this.loading2=false
      this.getReports()
    }, (err:any) => {
      this.loading2=false
      AppSweetAlert.simpleAlert('error',"Visites", "Erreur, Verifiez que vous avez une bonne connexion internet")
    })
  }
  deleteReport(id:any){
    let confirmed=AppSweetAlert.simpleAlertConfirm('info','Suppression','Voulez vous vraiment retirer cet élément?');
    confirmed.then((result:any)=>{
    if (result.isConfirmed) {
        this.reportService.delete(id).subscribe((res:any)=>{
            this.getReports()
        },
        (err:any)=>{
          console.log(err)
            AppSweetAlert.simpleAlert("error","Type de dossier",err.error.message)
        })
      }
      })
  }
  
    getFile(filename:any){
      this.pdfSrc=ConfigService.toFile(`storage/${filename}`)
      window.open(this.pdfSrc,'_blank')
      console.log(this.pdfSrc)
    //  this.offcanvasService.open(this.contentPDF,{  panelClass: 'details-panel', position: 'end'  });
    }
  
    transmit(id:any){
      this.loading2=true
      this.reportTransmissionService.store({
        report_id:id,
        sens:1
      }).subscribe((res: any) => {
        this.loading2=false
        this.getReports()
      }, (err:any) => {
        this.loading2=false
        AppSweetAlert.simpleAlert("Visites", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
      })
    }
  getPage2(event:any){
    this.pg2.p=event
  }
}
