import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { NgxPaginationModule } from 'ngx-pagination';

import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';

import { PermissionService } from '../../../../core/services/permission.service';

import { AppErrorShow } from '../../../../core/utils/app-error-show';

import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';

import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';

import { LoadingComponent } from '../../../components/loading/loading.component';

import { GlobalName } from '../../../../core/utils/global-name';

@Component({
  selector: 'app-permission',

  templateUrl: './permission.component.html',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    LoadingComponent,
    SampleSearchPipe,
    NgSelectModule,
    NgxPaginationModule,
  ],

  styleUrls: ['./permission.component.css'],
})
export class PermissionComponent implements OnInit {
  selectedId: number | null = null;

  is_active = null;

  buttonsPermission: any | undefined;

  actionTemplate: any;

  selected_data: any;

  loading: any = false;

  feature: any;

  search_text = '';

  title = 'frontend';

  data: any[] = [];

  features: any[] = [];

  actions: any;

  actions2: any[] = [
    'LISTER',
    'RECUPERER',
    'RECUPERER LISTE',
    'CREER',
    'MODIFIER',
    'SUPPRIMER',
    'CHANGER_STATUT',
    'A VALIDER',
  ];

  actionChosen: any;

  tag = 'admin-permissions';

  pg = {
    pageSize: 10,

    p: 0,

    total: 0,
  };

  role:any

  constructor(
    private cdRef: ChangeDetectorRef,

    private permissionService: PermissionService,

    private toastrService: ToastrService,

    private modalService: NgbModal,

    private localService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.features = this.localService.get(GlobalName.features)?.features;

    this.actions = this.localService.get(GlobalName.features)?.actions;

    this.role= this.localService.get(GlobalName.userName)?.roles[0]?.name


    this.buttonsPermission = {
      show: true,

      add: true,

      edit: true,

      delete: true,
    };

    this.init();
  }

  init() {
    this.getAll();
  }

  getAll() {
    this.permissionService.getAll().subscribe(
      (res: any) => {
        this.data = res.data;

        this.pg.total = res.data.length;

        this.modalService.dismissAll();

        this.selectedId = null;
      },

      (err: any) => {
        AppErrorShow.showError('Gestion des permissions', err);
      }
    );
  }

  add(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  edit(content: any) {
    if (!this.verifyIfElementChecked()) return;

    // let myActions=JSON.parse(this.selected_data.actions)

    // this.actionChosen=this.actions

    // for (const key in myActions) {

    // if (Object.prototype.hasOwnProperty.call(myActions, key)) {

    // this.actionChosen[key]=true;

    // }

    // }

    this.modalService.open(content, { size: 'lg' });
  }

  verifyIfElementChecked() {
    console.log(this.selected_data);

    if (this.selected_data == null) {
      this.toastrService.warning('Aucun élément selectionné');

      return false;
    }

    return true;
  }

  checked(el: any) {
    this.selected_data = el;
  }

  create(value: any) {
    this.loading = true;

    this.permissionService.create(value).subscribe(
      (res: any) => {
        this.toastrService.success(res.message);

        this.getAll();

        this.loading = false;
      },

      (err: any) => {
        this.loading = false;

        AppErrorShow.showError('Gestion des permissions', err);
      }
    );
  }

  getPage(event: any) {
    this.pg.p = event;
  }

  update(value: any) {
    this.loading = true;

    this.permissionService.update(this.selected_data.id, value).subscribe(
      (res: any) => {
        this.toastrService.success(res.message);

        this.getAll();

        this.loading = false;
      },

      (err: any) => {
        this.loading = false;

        AppErrorShow.showError('Gestion des permissions', err);
      }
    );
  }

  delete() {
    let confirmed = AppSweetAlert.confirmBox(
      'info',
      'Suppression',
      'Voulez vous vraiment retirer cet élément?'
    );

    confirmed.then((result: any) => {
      if (result.isConfirmed) {
        this.permissionService.delete(this.selected_data.id).subscribe(
          (res: any) => {
            this.toastrService.success(res.message);

            this.getAll();
          },

          (err: any) => {
            AppErrorShow.showError('Gestion des permissions', err);
          }
        );
      }
    });
  }

  show(content: any) {
    if (!this.verifyIfElementChecked()) return;

    this.modalService.open(content, { size: 'lg' });
  }

  setStatus(value: any) {
    this.toastrService.warning('Opération en cours');

    this.loading = true;

    this.permissionService.setStatus(this.selected_data.id, value).subscribe(
      (res: any) => {
        this.toastrService.success(res.message);

        this.loading = false;

        this.getAll();
      },

      (err: any) => {
        this.loading = false;

        console.log(err);

        AppSweetAlert.simpleAlert(
          'error',
          'Gestion des utilisateurs',
          err.error.message
        );
      }
    );
  }

  getJson(arr: any) {
    return JSON.parse(arr);
  }
}
