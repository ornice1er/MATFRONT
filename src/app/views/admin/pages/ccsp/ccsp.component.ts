import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { MultiSelectModule } from 'primeng/multiselect';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { CcspServiceService } from '../../../../core/services/ccsp-service.service';
import { UsagerService } from '../../../../core/services/usager.service';
import { ServiceService } from '../../../../core/services/service.service';
import { InstitutionService } from '../../../../core/services/institution.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { ObserverService } from '../../../../core/utils/observer.service';
import { ActeurService } from '../../../../core/services/acteur.service';

interface Departement {
  id: string;
  libelle: string;
}

interface Institution {
  id: string;
  libelle: string;
}

interface Commune {
  id: string;
  libellecom: string;
}

interface Service {
  id: number;
  libelle: string;
}

interface Ccsp {
  id?: number;
  title: string;
  address: string;
  email: string;
  phone: string;
  departement: string;
  commune: string;
  institution: string;
  horaire: string;
  services: string[];
  geolocalisation: string;
  is_published?: boolean;
}

@Component({
  selector: 'app-ccsp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    MultiSelectModule,
    LoadingComponent,
    SampleSearchPipe,
    NgSelectModule,
    NgxPaginationModule,
    NgxSpinnerModule
  ],
  templateUrl: './ccsp.component.html',
  styleUrls: ['./ccsp.component.css']
})
export class CcspComponent implements OnInit {
  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText = '';
  closeResult = '';
  error = '';
  data: Ccsp[] = [];
  _temp: Ccsp[] = [];
  collectionSize = 0;
  selected_data: Ccsp = {
    title: '',
    address: '',
    email: '',
    phone: '',
    departement: '',
    commune: '',
    institution: '',
    horaire: '',
    services: [],
    geolocalisation: ''
  };
  pg = { pageSize: 10, p: 1, total: 0 };
  isPaginate = false;
  search_text = '';
  is_active?: boolean;
  user: any;
  departements: Departement[] = [];
  institutions: Institution[] = [];
  commune: Commune[] = [];
  availableServices: Service[] = [];

  constructor(
    private modalService: NgbModal,
    private ccspService: CcspServiceService,
    private usagersService: UsagerService,
    private serviceService: ServiceService,
    private institutionService: InstitutionService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private observerService: ObserverService,
    private acteursService: ActeurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.observerService.setTitle('PARAMETRES - CCSP');
    this.user = this.localStorageService.get(GlobalName.userName) || {};
    this.loadDepartements();
    this.loadServices();
    this.loadInstitutions();
    this.init();
  }

  loadDepartements() {
    this.usagersService.getAllDepartement().subscribe({
      next: (res: any) => {
        this.departements = res.data || res;
        console.log('Départements chargés:', this.departements);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement départements:', err);
        AppSweetAlert.simpleAlert('error', 'Erreur', 'Impossible de charger les départements');
      }
    });
  }

  loadInstitutions() {
    this.institutionService.getAll().subscribe({
      next: (res: any) => {
        this.institutions = res.data || res;
        console.log('Institutions chargées:', this.institutions);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement institutions:', err);
        AppSweetAlert.simpleAlert('error', 'Erreur', 'Impossible de charger les institutions');
      }
    });
  }

  loadServices() {
    const idEntite = this.user.idEntite || 0;
    if (!idEntite) {
      console.error('ID entité manquant');
      AppSweetAlert.simpleAlert('error', 'Erreur', 'ID de l\'entité manquant');
      return;
    }
    this.serviceService.getAll(idEntite).subscribe({
      next: (res: any) => {
        this.availableServices = res.data || res;
        console.log('Services chargés:', this.availableServices);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement services:', err);
        AppSweetAlert.simpleAlert('error', 'Erreur', 'Impossible de charger les services');
      }
    });
  }

  onDepartementChange(departementLibelle: string) {
    console.log('Département sélectionné:', departementLibelle);
    const departement = this.departements.find(d => d.libelle === departementLibelle);
    const idDepartement = departement ? departement.id : '';
    console.log('ID département:', idDepartement);
    this.chargerCommune(idDepartement);
  }

  chargerCommune(idDepartement: string) {
    if (!idDepartement) {
      this.commune = [];
      this.selected_data.commune = '';
      this.cdr.detectChanges();
      return;
    }
    this.acteursService.getAllCommune(idDepartement).subscribe({
      next: (res: any) => {
        this.commune = res.data || res;
        console.log('Communes chargées:', this.commune);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement communes:', err);
        AppSweetAlert.simpleAlert('error', 'Erreur', 'Impossible de charger les communes');
      }
    });
  }

  init() {
    this.spinner.show();
    this._temp = [];
    this.data = [];
    this.ccspService.getAll().subscribe({
      next: (res: any) => {
        this.data = res.data || res;
        this._temp = this.data;
        this.collectionSize = this.data.length;
        this.pg.total = this.data.length;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.spinner.hide();
        AppSweetAlert.simpleAlert('error', 'Erreur', 'Impossible de charger les CCSP');
        console.error('Erreur CCSP:', err);
      }
    });
  }

  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.title.toLowerCase().includes(term) ||
             r.email.toLowerCase().includes(term) ||
             r.phone.toLowerCase().includes(term) ||
             r.departement.toLowerCase().includes(term) ||
             r.commune.toLowerCase().includes(term) ||
             r.institution.toLowerCase().includes(term);
    });
    this.collectionSize = this.data.length;
    this.pg.p = 1;
    this.cdr.detectChanges();
  }

  checked(event: any, el: Ccsp) {
    this.selected_data = { 
      ...el, 
      services: el.services || [], 
      departement: el.departement || '', 
      commune: el.commune || '',
      institution: el.institution || '',
      geolocalisation: el.geolocalisation || ''
    };
    console.log('Selected CCSP:', this.selected_data);
    this.is_active = el.is_published;
    if (this.selected_data.departement) {
      this.onDepartementChange(this.selected_data.departement);
    }
    this.cdr.detectChanges();
  }

  create(value: Ccsp) {
    console.log('Données envoyées (create):', value);
    if (!value.services || value.services.length === 0) {
      this.error = 'Au moins un service est requis';
      return;
    }
    if (!value.departement) {
      this.error = 'Veuillez sélectionner un département';
      return;
    }
    if (!value.commune) {
      this.error = 'Veuillez sélectionner une commune';
      return;
    }
    if (!value.institution) {
      this.error = 'Veuillez sélectionner une institution';
      return;
    }
    if (!value.geolocalisation) {
      this.error = 'Veuillez entrer une géolocalisation';
      return;
    }
    this.ccspService.create(value).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert('success', 'Nouvel ajout', 'Ajout effectué avec succès');
        this.init();
      },
      error: (err: any) => {
        const message = err.error?.detail || 'Erreur, vérifiez votre connexion internet';
        AppSweetAlert.simpleAlert('error', 'Nouvel ajout', message);
      }
    });
  }

  edit(value: Ccsp) {
    console.log('Données envoyées (edit):', value);
    if (!value.services || value.services.length === 0) {
      this.error = 'Au moins un service est requis';
      return;
    }
    if (!value.departement) {
      this.error = 'Veuillez sélectionner un département';
      return;
    }
    if (!value.commune) {
      this.error = 'Veuillez sélectionner une commune';
      return;
    }
    if (!value.institution) {
      this.error = 'Veuillez sélectionner une institution';
      return;
    }
    if (!value.geolocalisation) {
      this.error = 'Veuillez entrer une géolocalisation';
      return;
    }
    value.id = this.selected_data.id;
    this.ccspService.update(value, this.selected_data.id).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert('success', 'Nouvelle modification', 'Modification effectuée avec succès');
        this.init();
      },
      error: (err: any) => {
        AppSweetAlert.simpleAlert('error', 'Nouvelle modification', 'Erreur, vérifiez votre connexion internet');
      }
    });
  }

  archive() {
    if (!this.selected_data || !this.selected_data.id) {
      AppSweetAlert.simpleAlert('error', 'Erreur', 'Veuillez sélectionner un élément puis réessayer');
      return;
    }
    AppSweetAlert.confirmBox('Suppression', 'Cette action est irréversible. Voulez-vous continuer ?').then((result: any) => {
      if (result.value) {
        this.ccspService.delete(this.selected_data!.id!).subscribe({
          next: (res: any) => {
            AppSweetAlert.simpleAlert('success', 'Suppression', 'Suppression effectuée avec succès');
            this.init();
          },
          error: (err: any) => {
            AppSweetAlert.simpleAlert('error', 'Suppression', 'Erreur, vérifiez votre connexion internet');
          }
        });
      }
    });
  }

  setState(state: number) {
    if (!this.selected_data || !this.selected_data.id) {
      AppSweetAlert.simpleAlert('error', 'Erreur', 'Veuillez sélectionner un élément puis réessayer');
      return;
    }
    this.ccspService.setState(this.selected_data.id, state).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert('success', 'Mise à jour', 'Mise à jour effectuée avec succès');
        this.init();
      },
      error: (err: any) => {
        const message = err.error?.detail || 'Erreur, vérifiez votre connexion internet';
        AppSweetAlert.simpleAlert('error', 'Mise à jour', message);
      }
    });
  }

  openAddModal(content: any) {
    this.error = '';
    this.selected_data = {
      title: '',
      address: '',
      email: '',
      phone: '',
      departement: '',
      commune: '',
      institution: '',
      horaire: '',
      services: [],
      geolocalisation: ''
    };
    this.commune = [];
    this.loadServices();
    this.loadInstitutions();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.cdr.detectChanges();
  }

  openEditModal(content: any) {
    if (!this.selected_data || !this.selected_data.id) {
      AppSweetAlert.simpleAlert('error', 'Erreur', 'Veuillez sélectionner un élément puis réessayer');
      return;
    }
    this.error = '';
    this.loadServices();
    this.loadInstitutions();
    if (this.selected_data.departement) {
      this.onDepartementChange(this.selected_data.departement);
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.cdr.detectChanges();
  }

  getPage(event: any) {
    this.pg.p = event;
    this.cdr.detectChanges();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
    if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
    return `with: ${reason}`;
  }
}