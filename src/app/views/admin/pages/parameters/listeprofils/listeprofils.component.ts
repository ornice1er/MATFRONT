import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { ProfilService } from '../../../../../core/services/profil.service';
import { UserService } from '../../../../../core/services/user.service';
import { ObserverService } from '../../../../../core/utils/observer.service';

@Component({
  selector: 'app-listeprofils',
  standalone: true,
          imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './listeprofils.component.html',
  styleUrls: ['./listeprofils.component.css']
})
export class ListeprofilsComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText=""
  closeResult = '';
   permissions:any[]=[]
  error=""
  data: any[]=[];
  _temp: any[]=[];

  selected = [
  ];
  current_permissions:any[]=[]
  collectionSize = 0;
  selected_data:any
  pg:any={
    pageSize:10,
    p:0,
    total:0
  }
isPaginate:any=false
search_text:any=""
  file: string | Blob =""

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router:Router,
    private profilService:ProfilService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private observerService:ObserverService
    ) {}

  ngOnInit() {
    this.observerService.setTitle('PARAMETRES - GESTION DES PROFILS') // Titre plus clair
    this.init()
  }

  init(){
    this.spinner.show(); 
    this.profilService.getProfil().subscribe({
      next: (res: any) => {
        this.data = res;
        this._temp = res;
        this.collectionSize = this.data.length;
        this.spinner.hide();
      },
      error: (err: any) => {
        console.error("Erreur lors de la récupération des profils :", err);
        this.spinner.hide(); 
        AppSweetAlert.simpleAlert("Erreur de chargement", "Impossible de récupérer la liste des profils.", 'error');
      }
    });
  }

  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  
  search(){ 
    if (!this.searchText) {
      this.data = [...this._temp];
      return;
    }
    this.data = this._temp.filter(r => 
      r.LibelleProfil && r.LibelleProfil.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  
  openAddModal(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  openEditModal(content:any){
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  ChangerFile(file:any){
    const url = `https://api.mataccueil.gouv.bj/api/downloadFileGuide?file=${encodeURIComponent(file)}`;
    window.open(url, '_blank');
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
    if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
    return `with: ${reason}`;
  }

  checked(event:any, el:any) {
    this.selected_data = el
  }
  
  create(value:any){
    this.profilService.create(value).subscribe({
      next: (res:any) => {
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert("Nouvel ajout","Ajout effectué avec succès", 'success');
        this.init();
      },
      error: (err:any) => {
        const message = err.error?.detail || err.error.message;
        AppSweetAlert.simpleAlert("Erreur d'ajout", message, 'error');
      }
    });
  }
  
  addGuide(value:any){
    if (!this.selected_data) {
        AppSweetAlert.simpleAlert("Erreur", "Aucun profil sélectionné.", 'error');
        return;
    }
    if (!this.file) {
        AppSweetAlert.simpleAlert("Erreur", "Aucun fichier sélectionné.", 'error');
        return;
    }

    let formData = new FormData();
    formData.append('fichier', this.file);

    this.profilService.addGuideUser(formData, this.selected_data.id).subscribe({
      next: (res:any) => {
        if(res.status === 'error'){
          AppSweetAlert.simpleAlert("Ajout guide", res.message, 'error');
        } else {
          this.modalService.dismissAll();
          AppSweetAlert.simpleAlert("Ajout guide", "Guide ajouté avec succès", 'success');
          this.init();
        }
      },
      error: (err:any) => {
        const message = err.error?.detail || err.error.message;
        AppSweetAlert.simpleAlert("Erreur d'ajout du guide", message, 'error');
      }
    });
  }

  archive(){
    if (!this.selected_data) {
        AppSweetAlert.simpleAlert("Erreur", "Aucun profil sélectionné.", 'error');
        return;
    }
    AppSweetAlert.confirmBox("Suppression", "Cette action est irreversible. Voulez-vous continuer ?")
      .then((result:any) => {
        if (result.isConfirmed) { 
          this.profilService.deleteProfil(this.selected_data.id).subscribe({
            next: (res:any) => {
              AppSweetAlert.simpleAlert("Suppression", "Suppression effectuée avec succès", 'success');
              this.init();
            },
            error: (err:any) => {
              AppSweetAlert.simpleAlert("Erreur de suppression", err.error.message, 'error');
            }
          });
        }
    });
  }
  
  edit(value:any) {
    this.profilService.updateProfil(value, this.selected_data.id).subscribe({
      next: (res:any) => {
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert("Modification", "Modification effectuée avec succès", 'success');
        this.init();
      },
      error: (err:any) => {
        AppSweetAlert.simpleAlert("Erreur de modification", err.error.message, 'error');
      }
    });
  }

  getPage(event:any){
    this.pg.p = event;
  }
}