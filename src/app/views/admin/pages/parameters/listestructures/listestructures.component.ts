import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { StructureService } from '../../../../../core/services/structure.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { InstitutionService } from '../../../../../core/services/institution.service';

@Component({
  selector: 'app-listestructures',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    LoadingComponent,
    NgSelectModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    SharedModule,
  ],
  templateUrl: './listestructures.component.html',
  styleUrls: ['./listestructures.component.css'],
})
export class ListestructuresComponent implements OnInit {
  @Input() cssClasses = '';

  page = 1;
  pageSize = 10;
  search_text = '';
  closeResult = '';
  error = '';
  data: any[] = [];
  entities: any[] = [];
  selected_data: any = null;
  loading = false;
  selectedEntity: any;

  readonly Math = Math;

  role: any;
  user: any;
  isSuperAdmin = false;

  get filteredData(): any[] {
    const term = this.search_text.trim().toLowerCase();
    if (!term) return this.data;
    return this.data.filter(
      (r) =>
        r.libelle?.toLowerCase().includes(term) ||
        r.sigle?.toLowerCase().includes(term) ||
        r.contact?.toLowerCase().includes(term)
    );
  }

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private institutionService: InstitutionService,
    private router: Router,
    private structureService: StructureService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private observerService: ObserverService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.observerService.setTitle('PARAMETRES - STRUCTURES');
    this.user = this.localStorageService.get(GlobalName.userName);
    this.role = this.user.roles[0]?.name;
    this.isSuperAdmin = this.role === 'Super Admin';
    this.init();
  }

  init() {
    this.data = [];
    this.spinner.show();
    this.structureService
      .getAll(0, this.isSuperAdmin ? this.selectedEntity : this.user?.idEntite)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.data = res.data ?? [];
        this.page = 1;
      });

    this.institutionService.getAll().subscribe((res: any) => {
      this.entities = res.data ?? [];
    });
  }

  loadData(ev: any) {
    this.init();
  }

  onSearchChange() {
    this.page = 1;
  }

  checked(event: any, el: any) {
    this.selected_data = el;
  }

  openAddModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openEditModal(content: any) {
    if (!this.selected_data) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer'
      );
      return;
    }
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
    if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
    return `with: ${reason}`;
  }

  create(value: any) {
    value.idEntite = this.user?.idEntite;
    if (value.point_de_chute == 1) {
      const existing = this.data.find((s) => s.point_de_chute);
      if (existing) {
        AppSweetAlert.simpleAlert(
          'error',
          'Opération impossible',
          `La structure "${existing.libelle}" est déjà définie comme point de chute.`
        );
        return;
      }
    }
    if (value.point_de_chute_dsi == 1) {
      const existing = this.data.find((s) => s.point_de_chute_dsi);
      if (existing) {
        AppSweetAlert.simpleAlert(
          'error',
          'Opération impossible',
          `La structure "${existing.libelle}" est déjà définie comme point de chute DSI.`
        );
        return;
      }
    }
    if (value.point_de_chute_transverse == 1) {
      const existing = this.data.find((s) => s.point_de_chute_transverse);
      if (existing) {
        AppSweetAlert.simpleAlert(
          'error',
          'Opération impossible',
          `La structure "${existing.libelle}" est déjà définie comme point de chute transverse.`
        );
        return;
      }
    }
    this.loading = true;
    this.structureService.create(value).subscribe(
      (res: any) => {
        this.loading = false;
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert('success', 'Nouvel ajout', 'Ajout effectué avec succès');
        this.init();
      },
      (err: any) => {
        this.loading = false;
        AppSweetAlert.simpleAlert(
          'error',
          'Nouvel ajout',
          err.error?.detail ?? err.error?.message
        );
      }
    );
  }

  archive() {
    if (!this.selected_data) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer'
      );
      return;
    }
    AppSweetAlert.confirmBox(
      'Suppression',
      'Cette action est irréversible. Voulez-vous continuer ?'
    ).then((result: any) => {
      if (result.value) {
        this.structureService.delete(this.selected_data.id).subscribe(
          (res: any) => {
            this.selected_data = null;
            AppSweetAlert.simpleAlert('success', 'Suppression', 'Suppression effectuée avec succès');
            this.init();
          },
          (err: any) => {
            AppSweetAlert.simpleAlert('error', 'Suppression', err.error?.message);
          }
        );
      }
    });
  }

  edit(value: any) {
    value.id = this.selected_data.id;
    value.idEntite = this.user.idEntite;
    if (value.point_de_chute == 1) {
      const existing = this.data.find(
        (s) => s.point_de_chute && s.id !== this.selected_data.id
      );
      if (existing) {
        AppSweetAlert.simpleAlert(
          'error',
          'Opération impossible',
          `La structure "${existing.libelle}" est déjà définie comme point de chute.`
        );
        return;
      }
    }
    if (value.point_de_chute_dsi == 1) {
      const existing = this.data.find(
        (s) => s.point_de_chute_dsi && s.id !== this.selected_data.id
      );
      if (existing) {
        AppSweetAlert.simpleAlert(
          'error',
          'Opération impossible',
          `La structure "${existing.libelle}" est déjà définie comme point de chute DSI.`
        );
        return;
      }
    }
    if (value.point_de_chute_transverse == 1) {
      const existing = this.data.find(
        (s) => s.point_de_chute_transverse && s.id !== this.selected_data.id
      );
      if (existing) {
        AppSweetAlert.simpleAlert(
          'error',
          'Opération impossible',
          `La structure "${existing.libelle}" est déjà définie comme point de chute transverse.`
        );
        return;
      }
    }
    this.loading = true;
    this.structureService.update(value, this.selected_data.id).subscribe(
      (res: any) => {
        this.loading = false;
        this.modalService.dismissAll();
        this.init();
        AppSweetAlert.simpleAlert('success', 'Modification', 'Modification effectuée avec succès');
      },
      (err: any) => {
        this.loading = false;
        AppSweetAlert.simpleAlert('error', 'Modification', err.error?.message);
      }
    );
  }
}
