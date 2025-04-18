import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../../core/pipes/sample-search.pipe';
import { LocalService } from '../../../../../../core/services/local.service';
import { UserService } from '../../../../../../core/services/user.service';
import { Roles } from '../../../../../../core/utils/global-name';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import { AppSweetAlert } from '../../../../../../core/utils/app-sweet-alert';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',

      standalone: true,
        imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private localStorageService: LocalService,
    private userService: UserService
  ) { }
  current_role:any = ""
  user: any

  Fr = "fr"
  En = "en"
  default_lang = ""
  closeResult=""

  logout(){
    //Mettre a jour dans la table activity_log la derniere deconnection 
    this.userService.update_last_logout(this.user.id).subscribe((res) => {
      localStorage.removeItem("mataccueilToken")
      localStorage.removeItem("mataccueilUserData")
      this.router.navigateByUrl('/login-v2')
    })

  }

  openAddModal(content:any) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:"lg"}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    
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

  ngOnInit(): void {

    this.current_role = localStorage.getItem('mataccueilUserRole')
    if (localStorage.getItem('mataccueilUserData') != null) {
      this.user = this.localStorageService.getJsonValue("mataccueilUserData")
    }

    if (this.current_role != Roles.Admin && this.current_role != Roles.SubAdmin) {

    }
    // $.getScript('assets/js/compiled.min.js')
    // $.getScript('assets/js/testside.js')
  }

  useLanguage(lang: string) {
    this.userService.update({ default_language: lang }, this.user.id).subscribe((res) => {
      this.localStorageService.setJsonValue("mataccueilUserData", res);
      //this.ngOnInit()
      window.location.reload();
    })

  }

  transmettreComment(value:any){
    if( this.user.agent_user!=null){
      var param= {
        name: this.user.agent_user.nomprenoms,  
        email:  this.user.email,
        structure: this.user.agent_user.structure.libelle,  
        commentaire: value.commentaire,
       
     };
     this.userService.soumettreSuggest(param).subscribe((res) => {
      this.modalService.dismissAll()
        AppSweetAlert.simpleAlert("Suggestion","Suggestion envoyé avec succès" , 'success') ;
      })
    }
   
   
  }
}
