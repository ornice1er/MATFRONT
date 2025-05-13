import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { ConfigService } from '../../../../core/utils/config-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { ReportService } from '../../../../core/services/report.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ReportTransmissionService } from '../../../../core/services/report-transmission.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-csp-report-own',
  standalone: true,
     imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,NgxExtendedPdfViewerModule,FontAwesomeModule],
  templateUrl: './csp-report-own.component.html',
  styleUrl: './csp-report-own.component.css'
})
export class CspReportOwnComponent {
 @ViewChild('contentPDF') contentPDF:TemplateRef<any> | undefined
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  loading2=false
  registresReports:any[]=[]
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
  years: number[] = [];

  constructor(
    private  reportService:ReportService,
    private  reportTransmissionService:ReportTransmissionService,
    private modalService: NgbModal,
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
  
  storeReport(value:any){
    this.loading2=true
    this.reportService.store(value).subscribe((res: any) => {
      this.getFile(res.data)
      this.modalService.dismissAll()
      this.loading2=false
      this.getReports()
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
