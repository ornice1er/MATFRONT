import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ActeurService } from '../../../../core/services/acteur.service';
import { InstitutionService } from '../../../../core/services/institution.service';
import { ProfilService } from '../../../../core/services/profil.service';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { ObserverService } from '../../../../core/utils/observer.service';
import { RoleService } from '../../../../core/services/role.service';

interface Institution { id: number; libelle: string; }
interface Profil { id: number; LibelleProfil: string; admin_sectoriel?: number; }
interface Acteur { id: number; nomprenoms: string; }

@Component({
  selector: 'app-users-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    LoadingComponent,
    SampleSearchPipe,
    NgSelectModule,
    NgxPaginationModule,
    NgxSpinnerModule
  ],
  templateUrl: './users-main.component.html',
  styleUrls: ['./users-main.component.css']
})
export class UsersMainComponent implements OnInit {
  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText = '';
  loading = false;
  closeResult = '';
  error = '';
  data: any[] = [];
  _temp: any[] = [];
  collectionSize = 0;
  selected_data: any;
  pg = { pageSize: 10, p: 1, total: 0 };
  isPaginate = false;
  search_text = '';
  institutions: Institution[] = [];
  profils: Profil[] = [];
  acteurs: Acteur[] = [];
  hide_actors = false;
  user: any;
  role:any[]=[]


  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private profilService: ProfilService,
    private acteursService: ActeurService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private institutionService: InstitutionService,
    private localStorageService: LocalStorageService,
    private observerService: ObserverService,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService
    
  ) {}

  ngOnInit() {
    this.observerService.setTitle('');
    this.user = this.localStorageService.get(GlobalName.userName) || {};
    this.init();
  }

  init() {
    this.spinner.show();
    this._temp = [];
    this.data = [];
    this.userService.getAllMain().subscribe({
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
        AppSweetAlert.simpleAlert('error', 'Erreur', 'Impossible de charger les utilisateurs');
        console.error('Erreur utilisateurs:', err);
      }
    });

 

    this.institutions = [];
    this.institutionService.getAll().subscribe({
      next: (res: any) => {
        console.log('Réponse institutions:', res);
        this.institutions = res.data || res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur institutions:', err);
        AppSweetAlert.simpleAlert('error', 'Erreur', 'Impossible de charger les institutions');
      }
    });

     this.role = [];
    this.roleService.getAll().subscribe({
      next: (res: any) => {
        console.log('Réponse rôles:', res);
        this.role = res.data || res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur rôles:', err);
      }
    });
  
  }

  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.email.toLowerCase().includes(term) ||
        (r.agent_user?.nomprenoms || '').toLowerCase().includes(term);
    });
    this.collectionSize = this.data.length;
    this.pg.p = 1;
    this.cdr.detectChanges();
  }

  loadActeur(event: any) {
    const idEntite = +event.target.value;
    if (!idEntite) return;
    this.acteurs = [];
    this.acteursService.getAll(idEntite).subscribe({
      next: (res: any) => {
        console.log('Réponse acteurs:', res);
        this.acteurs = res.data || res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur acteurs:', err);
        AppSweetAlert.simpleAlert('error', 'Erreur', 'Impossible de charger les acteurs');
      }
    });
  }

  changeProfil(event: any) {
    const profilId = +event.target.value;
    const profil = this.profils.find((e: any) => e.id === profilId);
    this.hide_actors = profil?.admin_sectoriel === 1;
    this.cdr.detectChanges();
  }

  checked(event: any, el: any) {
    this.selected_data = { ...el };
  }

  create(value: any) {
  
    this.userService.create(value).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert('success', 'Nouvel ajout', 'Ajout effectué avec succès');
        this.init();
      },
      error: (err: any) => {
        const message = err.error?.detail || err.error.message;
        AppSweetAlert.simpleAlert('error', 'Nouvel ajout', message);
      }
    });
  }

  archive() {
    if (!this.selected_data) {
      AppSweetAlert.simpleAlert('error', 'Erreur', 'Veuillez sélectionner un élément puis réessayer');
      return;
    }
    AppSweetAlert.confirmBox('Suppression', 'Cette action est irréversible. Voulez-vous continuer ?').then((result: any) => {
      if (result.value) {
        this.userService.delete(this.selected_data.id).subscribe({
          next: (res: any) => {
            AppSweetAlert.simpleAlert('success', 'Suppression', 'Suppression effectuée avec succès');
            this.init();
          },
          error: (err: any) => {
            AppSweetAlert.simpleAlert('error', 'Suppression', err.error.message);
          }
        });
      }
    });
  }

   edit(value: any) {
    if (!this.selected_data) return;

    this.loading = true; // <-- On active le loader avant l'appel API

    const payload = { ...this.selected_data, ...value };
    payload.agent_user_id = value.idAgent;

    this.userService.update(payload, this.selected_data.id).subscribe({
      next: (res: any) => {
        this.loading = false; // <-- On désactive le loader en cas de succès
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert('success', 'Modification', 'Modification effectuée avec succès');
        this.init();
      },
      error: (err: any) => {
        this.loading = false; // <-- On désactive AUSSI le loader en cas d'erreur
        const message = err.error?.error_list || err.error.message;
        AppSweetAlert.simpleAlert('error', 'Nouvelle modification', JSON.stringify(message));
      }
    });
  }

  openAddModal(content: any) {
    this.error = '';
    this.selected_data = { idEntite: this.user.idEntite || null, email: '', idagent: null, profil: null, role: null, statut: false };
    this.acteurs = [];
    
    this.hide_actors = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openEditModal(content: any) {
    if (!this.selected_data) {
      AppSweetAlert.simpleAlert('error', 'Erreur', 'Veuillez sélectionner un élément puis réessayer');
      return;
    }
    this.error = '';
    if (!this.selected_data.agent_user) {
      this.selected_data.agent_user = { id: null }; // Objet de secours
    }
    if (!this.selected_data.roles || this.selected_data.roles.length === 0) {
      this.selected_data.roles = [{ name: null }]; // Objet de secours
    }
    this.loadActeur({ target: { value: this.selected_data.idEntite } });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
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