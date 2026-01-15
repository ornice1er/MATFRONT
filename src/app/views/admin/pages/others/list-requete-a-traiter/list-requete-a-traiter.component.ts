import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  RouterModule,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { EtapeService } from '../../../../../core/services/etape.service';
import { InstitutionService } from '../../../../../core/services/institution.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { UserService } from '../../../../../core/services/user.service';
import { ConfigService } from '../../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../../core/utils/global-name';
import { ObserverService } from '../../../../../core/utils/observer.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-list-requete-a-traiter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SampleSearchPipe,
    NgSelectModule,
    NgxPaginationModule,
    RouterModule,
    DropdownModule,
  ],
  templateUrl: './list-requete-a-traiter.component.html',
  styleUrl: './list-requete-a-traiter.component.css',
})
export class ListRequeteATraiterComponent implements OnInit {
  @Input() cssClasses = '';
  errormessage = '';
  erroraffectation = '';
  searchText = '';
  closeResult = '';
  permissions: any[] = [];
  error = '';
  data: any[] = [];
  _temp: any[] = [];
  collectionSize = 0;
  page = 1;
  pageSize = 10;
  selectedServiceId: string | null = null;
  data2: any[] = [];
  _temp2: any[] = [];
  collectionSize2 = 0;
  mailTypes = [
    { label: 'SIMPLE', value: 'SIMPLE' },
    { label: "DEMANDE D'INFORMATION", value: "DEMANDE D'INFORMATION" },
  ];
  page2 = 1;
  pageSize2 = 10;
  selected = [];
  current_permissions: any[] = [];

  selected_data: any;
  isSended = false;
  pg: any = {
    pageSize: 10,
    p: 0,
    total: 0,
  };
  servicesForStructure: any[] = [];
  isPaginate: any = false;
  search_text: any = '';
  isLoading = false;
  institutionSelected:any


  search() {
    this.isLoading = true;
    this.spinner.show();
    this.data = [];
    this._temp = [];
    this.requeteService
      .getAllRequest(
        this.user.idEntite,
        this.searchText,
        0,
        this.user.id,
        this.user.agent_user.idStructure,
        this.checkType()?.id,
        this.pg.pageSize,
        this.page
      )
      .subscribe({
        next: (res: any) => {
          this.data = res.data?.data?.filter((e: any) => {
            if (e.lastparcours != null) {
              return (
                e.lastparcours.idEtape == 1 ||
                e.lastparcours.idEtape == 5 ||
                (e.lastparcours.idEtape == 7 &&
                  e.lastparcours.idStructure ==
                    this.user.agent_user.idStructure) ||
                (e.lastparcours.idEtape == 8 &&
                  e.lastparcours.idEntite == this.user.idEntite)
              );
            } else {
              return e.lastparcours == null;
            }
          });
          this._temp = this.data;
          this.subject.next(res);
        },
        error: (err) => {
          console.error('Erreur lors de la recherche:', err);
          AppSweetAlert.simpleAlert(
            'error',
            'Erreur',
            'Une erreur est survenue lors de la recherche.',
            undefined
          );
        },
        complete: () => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });
  }

  openAddModal(content: any) {
    if (this.selected_data != null && this.getTypeStructure()!="Division") {
      this.isLoading = true;
      this.spinner.show();

      this.servicesForStructure = [];
      this.prestationService
        .getServicesStructure(this.user.agent_user.idStructure)
        .subscribe({
          next: (res: any) => {
            this.servicesForStructure =
              res.data?.filter((e: any) => e.active == 1) || [];
            console.log(
              'Services for user structure:',
              this.servicesForStructure
            );
            this.cdr.detectChanges();
            if (this.servicesForStructure.length === 0) {
              // AppSweetAlert.simpleAlert(
              //   'error',
              //   'Erreur',
              //   'Aucun service actif trouvé pour cette structure.',
              //   undefined
              // );
              this.isLoading = false;
              this.spinner.hide();
             // return;
            }
            this.modalService
              .open(content, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
              })
              .result.then(
                (result) => {
                  this.closeResult = `Closed with: ${result}`;
                },
                (reason) => {
                  this.closeResult = `Dismissed ${this.getDismissReason(
                    reason
                  )}`;
                }
              );
          },
          error: (err) => {
            console.error(
              'Erreur lors du chargement des services pour la structure:',
              err
            );
            AppSweetAlert.simpleAlert(
              'error',
              'Erreur',
              'Impossible de charger les services pour la structure.',
              undefined
            );
            this.cdr.detectChanges();
          },
          complete: () => {
            this.isLoading = false;
            this.spinner.hide();
          },
        });
    } else if(this.selected_data == null ) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer',
        undefined
      );
    }else{
           this.modalService
              .open(content, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
              })
              .result.then(
                (result) => {
                  this.closeResult = `Closed with: ${result}`;
                },
                (reason) => {
                  this.closeResult = `Dismissed ${this.getDismissReason(
                    reason
                  )}`;
                }
              );
    }
  }

  openEditModal(content: any, el: any) {
    this.selected_data = el;
    this.isLoading = true;
    this.spinner.show();
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      )
      .finally(() => {
        this.isLoading = false;
        this.spinner.hide();
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

  user: any;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private institutionService: InstitutionService,
    private etapeService: EtapeService,
    private requeteService: RequeteService,
    private localService: LocalStorageService,
    private prestationService: ServiceService,
    private structureService: StructureService,
    private usagersService: UsagerService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private observerService: ObserverService,
    private cdr: ChangeDetectorRef
  ) {}

  etapes: any[] = [];
  services: any[] = [];
  departements: any[] = [];
  structureservices: any[] = [];
  isGeneralDirector = false;
  typeRequete: any = 'requetes';
  usager_full_name = '';
  hide_actions = false;
  action_transmettre = true;
  RelanceAWho = '';
  ValStruRelance = '';
  cpt = 0;
  compteData = 0;
structureSelected:any
  checked(event: any, el: any) {
    this.selected_data = el;
    if (this.selected_data.usager == null) {
      this.usager_full_name =
        ' (PFC) ' +
        this.selected_data.email +
        ' Contact : ' +
        this.selected_data.contact;
    } else {
      this.usager_full_name =
        this.selected_data.usager.nom + ' ' + this.selected_data.usager.prenoms;
    }
    console.log(this.selected_data);
    if (this.selected_data.reponse.length > 0) {
      this.selected_data.reponse.forEach((item: any) => {
        if (item.typeStructure == 'Direction')
          this.selected_data.texteReponseApportee = item.texteReponse;
        if (item.typeStructure == 'Service')
          this.selected_data.reponseService = item.texteReponse;
      });
    }
    this.action_transmettre = true;
    if (this.selected_data.reponse.length > 0) {
      let check = this.selected_data.reponse.filter(
        (item: any) => item.typeStructure == 'Direction'
      );
      if (check.length == 0) {
        this.action_transmettre = false;
      }
    } else {
      this.action_transmettre = false;
    }
    this.hide_actions = false;
    this.RelanceAWho = '';
    this.ValStruRelance = '';
    this.cpt = 0;
    if (this.selected_data.affectation.length > 0) {
      this.selected_data.affectation.forEach((item: any) => {
        this.cpt++;
        if (
          this.cpt == this.selected_data.affectation.length &&
          item.idStructure != this.user.agent_user.idStructure
        ) {
          this.RelanceAWho = item.typeStructure;
          this.ValStruRelance = item.idStructure;
        }
      });
    }
    this.cpt = 0;
    if (this.selected_data.parcours.length > 0) {
      this.selected_data.parcours.forEach((item: any) => {
        this.cpt++;
        if (
          this.cpt == this.selected_data.parcours.length &&
          item.idStructure == this.user.agent_user.idStructure
        ) {
          this.RelanceAWho = '';
          this.ValStruRelance = '';
        }
      });
    }
  }
  relancerPreocuppationType() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer',
        undefined
      );
      return;
    }
    this.cpt = 0;
    if (this.selected_data.parcours.length > 0) {
      this.selected_data.parcours.forEach((item: any) => {
        this.cpt++;
        if (
          this.cpt == this.selected_data.parcours.length &&
          item.idStructure == this.user.agent_user.idStructure
        ) {
          AppSweetAlert.simpleAlert(
            'error',
            'Erreur',
            'Impossible de faire une relance car le responsable structure a déjà donné sa réponse',
            undefined
          );
          return;
        }
      });
    }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        "Réponse déjà transmise à l'usager.",
        undefined
      );
      return;
    }
    if (this.ValStruRelance == '') {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Impossible de relancer sur cette requête.',
        undefined
      );
      return;
    } else {
      this.isLoading = true;
      this.spinner.show();
      this.requeteService
        .relanceRequetType(
          this.selected_data.id,
          this.ValStruRelance,
          this.selected_data.lastaffectation == null
            ? ''
            : this.selected_data.lastaffectation.idStructure
        )
        .subscribe({
          next: (rest: any) => {
            if (rest.status == 'error') {
              AppSweetAlert.simpleAlert(
                'error',
                'Erreur',
                rest.message,
                undefined
              );
            } else {
              this.init(this.page);
              this.modalService.dismissAll();
              AppSweetAlert.simpleAlert(
                'success',
                'Relancer ' +
                  this.RelanceAWho +
                  ' en charge de la préoccupation',
                "Relance envoyée avec succès à l'adresse : " + rest.message,
                undefined
              );
              this.selected_data = null;
            }
          },
          error: (err) => {
            console.error('Erreur lors de la relance:', err);
            AppSweetAlert.simpleAlert(
              'error',
              'Erreur',
              'Une erreur est survenue lors de la relance.',
              undefined
            );
          },
          complete: () => {
            this.isLoading = false;
            this.spinner.hide();
          },
        });
    }
  }

  show_step(id: any) {
    return this.etapes.find((e: any) => e.id == id);
  }

  key_type_req = '';

  checkType() {
    this.key_type_req =
      this.activatedRoute.snapshot.paramMap.get('type_req') ?? '';
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == 'plaintes') {
      return { id: 1, name: 'Plaintes' };
    }
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == 'requetes') {
      return { id: 0, name: 'Requetes' };
    }
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == 'infos') {
      return { id: 2, name: "Demandes d'informations" };
    }
    return;
  }

  ngOnInit(): void {
    this.observerService.setTitle(`Gestion des ${this.typeRequete}`);
    this.RelanceAWho = '';
    this.prepare();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.prepare();
      }
    });
  }

  prepare() {
    this.user = this.localStorageService.get(GlobalName.userName);
    console.log('user in prepare:', this.user);
    console.log('idEntite in prepare:', this.user?.idEntite);

    // if (!this.user || !this.user.idEntite) {
    //   console.error('Utilisateur ou idEntite manquant dans prepare');
    //   AppSweetAlert.simpleAlert(
    //     'error',
    //     'Erreur',
    //     'Utilisateur non connecté. Veuillez vous reconnecter.',
    //     undefined
    //   );
    //   this.router.navigate(['/auth/login']);
    //   return;
    // }

   // this.isGeneralDirector = this.user.profil_user.CodeProfil === 12;

    this.isLoading = true;
    this.spinner.show();
    this.etapes = [];
    this.etapeService.getAll(this.user.idEntite).subscribe({
      next: (res: any) => {
        this.etapes = res.data || [];
        console.log('etapes chargées:', this.etapes);
        this.activatedRoute.queryParams.subscribe((x: any) => {
          this.init(x['page'] || 1);
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des étapes:', err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          'Impossible de charger les étapes.',
          undefined
        );
      },
      complete: () => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });

    this.typeRequete = this.checkType()?.name;
    this.subject.subscribe((val) => {
      this.typeRequete = this.checkType()?.name;
      this.pager = val;
      this.page = this.pager.current_page;

      let pages = [];
      if (this.pager.last_page <= 5) {
        for (let index = 1; index <= this.pager.last_page; index++) {
          pages.push(index);
        }
      } else {
        let start = this.page > 3 ? this.page - 2 : 1;
        let end =
          this.page + 2 < this.pager.last_page
            ? this.page + 2
            : this.pager.last_page;
        for (let index = start; index <= end; index++) {
          pages.push(index);
        }
      }

      this.pager.pages = pages;
      this.compteData = this.pager.total;
    });

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     this.prepare();
    //   }
    // });
  }

  pager: any = {
    current_page: 0,
    data: [],
    last_page: 0,
    per_page: 0,
    to: 0,
    total: 0,
  };
  subject = new Subject<any>();
  Null = null;
  institutions: any[] = [];
  _cpt = 0;
  _data_affect = 0;

  init(page: any) {
    if (!this.user || !this.user.idEntite) {
      console.error('Utilisateur ou idEntite manquant dans init');
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Utilisateur non connecté. Veuillez vous reconnecter.',
        undefined
      );
      this.router.navigate(['/login']);
      return;
    }
    this.isLoading = true;
    this.spinner.show();
    this._temp = [];
    this.data = [];

    this.requeteService
      .getAllRequest(
        this.user.idEntite,
        null,
        0,
        this.user.id,
        this.user.agent_user.idStructure,
        this.checkType()?.id,
        this.pg.pageSize,
        page
      )
      .subscribe({
        next: (res: any) => {
          this.subject.next(res);
          this.data = res.data?.data?.filter((e: any) => {
            const hasServiceAffectation = e.affectation?.some(
              (aff: any) => aff.typeStructure === 'Service'
            );
            const isFinalized = e.finalise === 1;
            const isArchived = e.archiver === 1;
            if (hasServiceAffectation || isFinalized || isArchived) {
              return false;
            }
            if (e.lastparcours != null) {
              return (
                e.lastparcours.idEtape == 1 ||
                e.lastparcours.idEtape == 5 ||
                (e.lastparcours.idEtape == 7 &&
                  e.lastparcours.idStructure ==
                    this.user.agent_user.idStructure) ||
                (e.lastparcours.idEtape == 8 &&
                  e.lastparcours.idEntite == this.user.idEntite)
              );
            } else {
              return e.lastparcours == null;
            }
          });
          this._temp = this.data;
          this.data = res.data?.data?.map((e: any) => {
            e.etat = e.finalise === 1 ? 'Répondu' : 'En attente';
            return e;
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement des requêtes:', err);
          AppSweetAlert.simpleAlert(
            'error',
            'Erreur',
            'Impossible de charger les requêtes.',
            undefined
          );
        },
        complete: () => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });

    this._temp2 = [];
    this.getAffectations(page)

    this.departements = [];
    this.usagersService.getAllDepartement().subscribe({
      next: (res: any) => {
        this.departements = res;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des départements:', err);
      },
    });

    this.services = [];
    this.__services = [];
    if (!this.user || !this.user.idEntite) {
      console.error('Utilisateur ou idEntite manquant');
      return;
    }

    this.prestationService.getAll(this.user.idEntite).subscribe({
      next: (res: any) => {
        this.services = res.data?.filter((e: any) => e.published == 1) || [];
        this.__services = this.services;
        console.log('services chargés:', this.services);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des services:', err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          'Impossible de charger les services.',
          undefined
        );
      },
    });

    this.structures = [];
    console.log(
      'Appel de structureService.getAll avec idEntite:',
      this.user.idEntite
    );
    this.structureService.getAll(1, this.user.idEntite).subscribe({
      next: (res: any) => {
        console.log('Structures response:', res);
        this.structures = Array.isArray(res) ? res : res?.data || [];
        console.log('Structures chargées:', this.structures);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des structures:', err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          'Impossible de charger les structures.',
          undefined
        );
        this.structures = [];
        this.cdr.detectChanges();
      },
    });

    this.structureservices = [];
    this.structureService.getAllStructureByUser(this.user.id).subscribe({
      next: (res: any) => {
        console.log('user.structure', this.user.id);
        this.structureservices = res.data;
        console.log('Structureservices chargées:', this.structureservices);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des structureservices:', err);
      },
    });

    this.institutionService.getAll().subscribe({
      next: (res: any) => {
        this.institutions = res.data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des institutions:', err);
      },
    });
  }

  getAffectations(page:any){
    this.data2 = [];
    this.requeteService
      .getAllAffectation(
        this.user.id,
        this.getTypeStructure2(),
        this.checkType()?.id,
        this.pg.pageSize,
        page
      )
      .subscribe({
        next: (res: any) => {
          console.log('Affectations response:', res);
          if (Array.isArray(res)) {
            this.data2 = res;
          } else {
            this.data2 = res.data?.data;
          }
          this._temp2 = this.data2;
        },

        error: (err) => {
          console.error('Erreur lors du chargement des affectations:', err);
          AppSweetAlert.simpleAlert(
            'error',
            'Erreur',
            'Impossible de charger les affectations.',
            undefined
          );
        },
        complete: () => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });
  }

  file: string | Blob = '';
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  saveAffectation(value: any) {
    let val = {
      idRequete: this.selected_data.id,
      idStructure: this.user.agent_user.idStructure,
      idService: this.selectedServiceId,
      listeemails: this.structureservices.find(
        (e: any) => e.id == this.user.agent_user.idStructure
      ).contact,
      typeStructure: this.getTypeStructure2(),
      idEntite: this.user.idEntite,
      idEtape: 2,
    };

    if (this.selected_data.reponse.length > 0) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Vous ne pouvez plus affecter cette requête car une réponse a été déjà proposée.',
        undefined
      );
      return;
    }

    if (!this.selectedServiceId) {
      // J'ai amélioré la vérification ici
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un service.',
        undefined
      );
      return;
    }

    this.isLoading = true;
    this.spinner.show();
    this.requeteService.createAffectation(val).subscribe({
      next: (res: any) => {
        this.data = this.data.filter(
          (item) => item.id !== this.selected_data.id
        );

        this.selected_data = null;

        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert(
          'success',
          'Nouvelle affectation',
          'Affectation effectuée avec succès'
        );
        this.getAffectations(this.page)
      },
      error: (err) => {
        console.error("Erreur lors de l'affectation:", err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          "Une erreur est survenue lors de l'affectation."
        );
        this.isLoading = false;
        this.spinner.hide();
      },
      complete: () => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  updateSelectedService(newServiceId: any) {
    if (this.selected_data) {
      if (!this.selected_data.service) {
        this.selected_data.service = {};
      }
      this.selected_data.service.id = newServiceId;
    }
  }

  getUserDisplay(requete: any): string {
    let displayName = '';

    if (
      requete.usager &&
      requete.usager.nom &&
      requete.usager.nom.trim() !== ''
    ) {
      displayName = requete.usager.nom + ' ' + requete.usager.prenoms;
    } else if (requete.usager && requete.usager.email) {
      displayName = requete.usager.email;
    } else {
      const contactInfo = [requete.contact, requete.email]
        .filter(Boolean)
        .join(' ');
      displayName = contactInfo;
    }

    if (requete.matricule) {
      displayName += ` / Matricule : ${requete.matricule}`;
    }

    return displayName.trim();
  }

  saveReponse(value: any) {
    if (
      value.texteReponseApportee == null ||
      value.texteReponseApportee == ''
    ) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez saisir votre réponse',
        undefined
      );
      this.isLoading = false;
      this.spinner.hide();
      return;
    }
    let complementReponse = '';
    if (value.interrompu == true)
      complementReponse =
        "\n\nRaison de l'interruption: " + '\n' + value.raisonRejet;
    else if (value.rejete == true)
      complementReponse = '\n\nRaison du rejet: ' + '\n' + value.raisonRejet;

    if (value.interrompu == true)
      if (value.texteReponseApportee.indexOf("Raison de l'interruption:") == -1)
        value.texteReponseApportee += complementReponse;

    if (value.rejete == true)
      if (value.texteReponseApportee.indexOf('Raison du rejet:') == -1)
        value.texteReponseApportee += complementReponse;

    let formData = new FormData();
    formData.append('idRequete', this.selected_data.id);
    formData.append('typeStructure', this.getTypeStructure());
    formData.append('texteReponse', value.texteReponseApportee);
    formData.append('idEntite', this.user.idEntite);
    formData.append('interrompu', value.interrompu ? '1' : '0');
    formData.append('rejete', value.rejete ? '1' : '0');
    formData.append('raisonRejet', value.raisonRejet);
    formData.append('fichier', this.file);

    this.isLoading = true;
    this.spinner.show();
    this.requeteService.saveReponse(formData).subscribe({
      next: (res: any) => {
        if (this.isSended) {
          var paramInternal = {
            idRequete: this.selected_data.id,
            texteReponse: value.texteReponseApportee,
            typeStructure: this.getTypeStructure(),
            idEntite: this.user.idEntite,
            typeSuperieur: 'Usager',
            idEtape: 6,
          };
          this.requeteService.transmettreReponse(paramInternal).subscribe({
            next: (rest: any) => {
              this.init(this.page);
              this.modalService.dismissAll();
              this.file = '';
              AppSweetAlert.simpleAlert(
                'success',
                'Nouvelle réponse',
                'Réponse envoyée et transmise avec succès',
                undefined
              );
              // setTimeout(() => {
              //   window.location.reload();
              // }, 2000);
            },
            error: (err) => {
              console.error('Erreur lors de la transmission:', err);
              AppSweetAlert.simpleAlert(
                'error',
                'Erreur',
                'Une erreur est survenue lors de la transmission.',
                undefined
              );
              this.isLoading = false;
              this.spinner.hide();
            },
            complete: () => {
              this.isLoading = false;
              this.spinner.hide();
            },
          });
        } else {
          this.init(this.page);
          this.modalService.dismissAll();
          this.file = '';
          AppSweetAlert.simpleAlert(
            'success',
            'Nouvelle réponse',
            'Réponse envoyée avec succès',
            undefined
          );
          // setTimeout(() => {
          //   window.location.reload();
          // }, 2000);
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'enregistrement de la réponse:", err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          "Une erreur est survenue lors de l'enregistrement de la réponse.",
          undefined
        );
        this.isLoading = false;
        this.spinner.hide();
      },
      complete: () => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  Archiver_Requete(value: any) {
    if (value.texteArchive == null || value.texteArchive.trim() == '') {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez saisir votre motif',
        undefined
      );
      return;
    }

    var val = {
      idRequete: this.selected_data.id,
      texteReponse: value.texteArchive,
      typeStructure: this.getTypeStructure(),
      idEntite: this.user.idEntite,
    };
    this.isLoading = true;
    this.spinner.show();
    this.requeteService.archiverReque(val).subscribe({
      next: (res: any) => {
        this.init(this.page);
        this.modalService.dismissAll();
        AppSweetAlert.simpleAlert(
          'success',
          'Archive',
          'Préoccupation archivée avec succès',
          undefined
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.error("Erreur lors de l'archivage:", err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          "Une erreur est survenue lors de l'archivage.",
          undefined
        );
        this.isLoading = false;
        this.spinner.hide();
      },
      complete: () => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  transmettreReponseRapide(value: any) {
    var param = {
      codeRequete: this.selected_data.codeRequete,
      emailusager:
        this.selected_data.usager == null
          ? this.selected_data.email
          : this.selected_data.usager.email,
      emailstructure: this.user.email,
      idEntite: this.user.idEntite,
      message: value.message,
      nomprenomsusager:
        this.selected_data.usager == null
          ? this.selected_data.identity
          : this.selected_data.usager.nom,
      type: value.type,
    };
    this.isLoading = true;
    this.spinner.show();
    this.requeteService.mailUsager(param).subscribe({
      next: (rest: any) => {
        this.init(this.page);
        this.modalService.dismissAll();
        if (rest.status == 'error') {
          AppSweetAlert.simpleAlert('error', 'Erreur', rest.message, undefined);
        } else {
          AppSweetAlert.simpleAlert(
            'success',
            'Mail Usager',
            'Mail envoyé avec succès au ' + rest.message,
            undefined
          );
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'envoi du mail:", err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          "Une erreur est survenue lors de l'envoi du mail.",
          undefined
        );
        this.isLoading = false;
        this.spinner.hide();
      },
      complete: () => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  mailStructure(value: any) {
    var param = {
      codeRequete: this.selected_data.codeRequete,
      receiverId: value.receiverId,
      emailstructure: this.user.email,
      emailusager:
        this.selected_data.usager == null
          ? this.selected_data.email
          : this.selected_data.usager.email,
      idEntite: this.user.idEntite,
      message: value.message,
      type: value.type,
      nomprenomsusager:
        this.selected_data.usager == null
          ? this.selected_data.identity
          : this.selected_data.usager.nom,
    };
    this.isLoading = true;
    this.spinner.show();
    this.requeteService.mailStructure(param).subscribe({
      next: (rest: any) => {
        this.init(this.page);
        this.modalService.dismissAll();
        if (rest.status == 'error') {
          AppSweetAlert.simpleAlert('error', 'Erreur', rest.message, undefined);
        } else {
          AppSweetAlert.simpleAlert(
            'success',
            'Mail Structure',
            'Mail envoyé avec succès au ' + rest.message,
            undefined
          );
          this.isLoading = false;
          this.spinner.hide();
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'envoi du mail à la structure:", err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          "Une erreur est survenue lors de l'envoi du mail.",
          undefined
        );
        this.isLoading = false;
        this.spinner.hide();
      },
      complete: () => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  transmettreReponse() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer',
        undefined
      );
      return;
    }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        "Réponse déjà transmise à l'usager.",
        undefined
      );
      return;
    }

    if (this.selected_data.reponse.length > 0) {
      let check = this.selected_data.reponse.filter(
        (item: any) => item.typeStructure == 'Direction'
      );
      if (check.length == 0) {
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          'Veuillez affecter ou traiter la préoccupation.',
          undefined
        );
        return;
      }
    } else {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez affecter ou traiter la préoccupation.',
        undefined
      );
      return;
    }

    if (
      this.selected_data.reponseStructure == '' ||
      this.selected_data.reponseStructure == null
    ) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez valider la réponse de votre structure avant de transmettre.',
        undefined
      );
      return;
    }

    var msgConfirm = 'Voulez-vous transmettre la réponse ?';
    this.isLoading = true;
    this.spinner.show();
    AppSweetAlert.confirmBox('Confirmer', msgConfirm).then((result: any) => {
      if (result.value) {
        var param = {
          idRequete: this.selected_data.id,
          texteReponse: this.selected_data.reponseStructure,
          typeStructure: this.getTypeStructure(),
          typeSuperieur: 'Usager',
          idEntite: this.user.idEntite,
          idEtape: 6,
        };
        this.requeteService.transmettreReponse(param).subscribe({
          next: (rest: any) => {
            this.init(this.page);
            this.modalService.dismissAll();
            AppSweetAlert.simpleAlert(
              'success',
              'Nouvelle réponse',
              'Réponse envoyée et transmise avec succès',
              undefined
            );
          },
          error: (err) => {
            console.error('Erreur lors de la transmission:', err);
            AppSweetAlert.simpleAlert(
              'error',
              'Erreur',
              'Une erreur est survenue lors de la transmission.',
              undefined
            );
            this.isLoading = false;
            this.spinner.hide();
          },
          complete: () => {
            this.isLoading = false;
            this.spinner.hide();
          },
        });
      } else {
        this.isLoading = false;
        this.spinner.hide();
      }
    });
  }

  displayResource() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer',
        undefined
      );
      return;
    }

    if (this.selected_data.fichier_joint.length == 0) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Aucun fichier attaché.',
        undefined
      );
      return;
    }
    this.isLoading = true;
    this.spinner.show();
    var filePath = ConfigService.toFile(this.selected_data.fichier_joint);
    window.open(filePath);
    setTimeout(() => {
      this.isLoading = false;
      this.spinner.hide();
    }, 1000);
  }

  __services: any[] = [];
  structures: any[] = [];

  onEntiteChange(event: any) {
    const idEntite = event.value;

    if (!idEntite) {
      this.structures = [];
      this.services = [];
      return;
    }

    this.isLoading = true;
    this.spinner.show();

    this.structures = [];
    this.structureService.getAll(1, idEntite).subscribe({
      next: (res: any) => {
        this.structures = Array.isArray(res) ? res : res?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching structures:', err);
        this.structures = [];
        this.cdr.detectChanges();
      },
    });

    this.services = [];
    this.__services = [];
    this.prestationService.getAll(idEntite).subscribe({
      next: (res: any) => {
        const servicesData = Array.isArray(res) ? res : res?.data || [];
        this.services = servicesData.filter((e: any) => e.published == 1) || [];
        this.__services = this.services;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching services:', err);
        this.services = [];
        this.__services = [];
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  onStructureChange(event: any) {
    const selectedStructureId = event.value;

    this.isLoading = true;
    this.spinner.show();

    if (selectedStructureId) {
      this.services = this.__services.filter(
        (service: any) =>
          service.idParent == selectedStructureId && service.published == 1
      );
    } else {
      this.services = this.__services.filter((e: any) => e.published == 1);
    }

    this.isLoading = false;
    this.spinner.hide();
    this.cdr.detectChanges();
  }

  transferPreocuppation(value: any) {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer',
        undefined
      );
      return;
    }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        "Réponse déjà transmise à l'usager.",
        undefined
      );
      return;
    }

    var param = {
      idStructure: value.idStructure,
      id_user: this.user.id,
      idEntiteReceive: value.idEntiteReceive,
      idPrestation: value.idPrestation,
    };
    this.isLoading = true;
    this.spinner.show();
    AppSweetAlert.confirmBox(
      'Transférer cette préoccupation à un autre ministère/institution',
      'Cette action est irréversible. Voulez-vous continuer ?'
    ).then((result: any) => {
      if (result.value) {
        this.requeteService
          .transfertRequet(param, this.selected_data.id)
          .subscribe({
            next: (rest: any) => {
              this.init(this.page);
              this.modalService.dismissAll();
              AppSweetAlert.simpleAlert(
                'success',
                'Transfert préoccupation',
                'Transfert effectué avec succès',
                undefined
              );
            },
            error: (err) => {
              console.error('Erreur lors du transfert:', err);
              AppSweetAlert.simpleAlert(
                'error',
                'Erreur',
                'Une erreur est survenue lors du transfert.',
                undefined
              );
              this.isLoading = false;
              this.spinner.hide();
            },
            complete: () => {
              this.isLoading = false;
              this.spinner.hide();
            },
          });
      } else {
        this.isLoading = false;
        this.spinner.hide();
      }
    });
  }

  transfertInternePreocuppation(value: any) {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer',
        undefined
      );
      return;
    }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        "Réponse déjà transmise à l'usager.",
        undefined
      );
      return;
    }

    var param = {
      idStructure: value.idStructure,
      idEntite: this.user.idEntite,
      id_user: this.user.id,
      idPrestation: value.idPrestation,
    };
    if (param.idStructure == null || param.idStructure == '') {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner la structure',
        undefined
      );
      return;
    } else if (param.idPrestation == null || param.idPrestation == '') {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner la prestation',
        undefined
      );
      return;
    }
    this.isLoading = true;
    this.spinner.show();
    AppSweetAlert.confirmBox(
      'Transférer cette préoccupation à la structure',
      'Cette action est irréversible. Voulez-vous continuer ?'
    ).then((result: any) => {
      if (result.value) {
        this.requeteService
          .transfertRequetInterne(param, this.selected_data.id)
          .subscribe({
            next: (rest: any) => {
              this.init(this.page);
              this.modalService.dismissAll();
              AppSweetAlert.simpleAlert(
                'success',
                'Transfert préoccupation',
                'Transfert effectué avec succès',
                undefined
              );
            },
            error: (err) => {
              console.error('Erreur lors du transfert interne:', err);
              AppSweetAlert.simpleAlert(
                'error',
                'Erreur',
                'Une erreur est survenue lors du transfert interne.',
                undefined
              );
              this.isLoading = false;
              this.spinner.hide();
            },
            complete: () => {
              this.isLoading = false;
              this.spinner.hide();
            },
          });
      } else {
        this.isLoading = false;
        this.spinner.hide();
      }
    });
  }

  reorienterPreocuppation(value: any) {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Veuillez sélectionner un élément puis réessayer',
        undefined
      );
      return;
    }

    if (this.selected_data.finalise == 1) {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        "Réponse déjà transmise à l'usager.",
        undefined
      );
      return;
    }
    let idStructure = 0;
    if (value.idPrestation == '440') {
      idStructure = 58;
    }
    if (value.idPrestation == '441') {
      idStructure = 75;
    }
    var param = {
      idStructure: idStructure,
      idEntite: this.user.idEntite,
      idPrestation: value.idPrestation,
    };
    this.isLoading = true;
    this.spinner.show();
    AppSweetAlert.confirmBox(
      'Réorienter cette préoccupation',
      'Cette action est irréversible. Voulez-vous continuer ?'
    ).then((result: any) => {
      if (result.value) {
        this.requeteService
          .transfertRequetInterne(param, this.selected_data.id)
          .subscribe({
            next: (rest: any) => {
              this.init(this.page);
              this.modalService.dismissAll();
              AppSweetAlert.simpleAlert(
                'success',
                'Réorientation préoccupation',
                'Réorientation effectué avec succès',
                undefined
              );
            },
            error: (err) => {
              console.error('Erreur lors de la réorientation:', err);
              AppSweetAlert.simpleAlert(
                'error',
                'Erreur',
                'Une erreur est survenue lors de la réorientation.',
                undefined
              );
              this.isLoading = false;
              this.spinner.hide();
            },
            complete: () => {
              this.isLoading = false;
              this.spinner.hide();
            },
          });
      } else {
        this.isLoading = false;
        this.spinner.hide();
      }
    });
  }

  getPage(event: any) {
    this.isLoading = true;
    this.spinner.show();
    this.pg.p = event;
    this.init(this.pg.p);
    this.isLoading = false;
    this.spinner.hide();
  }

  onStructureChangeForServices(event: any) {
    const idStructure = event.target.value;
    if (idStructure) {
      this.isLoading = true;
      this.spinner.show();
      this.prestationService.getServicesStructure(idStructure).subscribe({
        next: (res: any) => {
          this.servicesForStructure =
            res.data?.filter((e: any) => e.published == 1) || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des services:', err);
          AppSweetAlert.simpleAlert(
            'error',
            'Erreur',
            'Impossible de charger les services.',
            undefined
          );
        },
        complete: () => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });
    } else {
      this.servicesForStructure = [];
      this.cdr.detectChanges();
    }
    console.log('Services for structure:', this.servicesForStructure);
  }
 getTypeStructure() {
  let key=this.user?.agent_user?.structure?.type_s
    switch (key) {
        case 'dt':
        return 'Direction'
        break;
      case 'se':
        return 'Service'
        break;
        case 'di':
        return 'Division'
        break;
      default:
        return 'Direction'
        break;
    }
  }

   getTypeStructure2() {
  let key=this.user?.agent_user?.structure?.type_s
    switch (key) {
        case 'dt':
        return 'Service'
        break;
      case 'se':
        return 'Division'
        break;
      default:
        return 'Direction'
        break;
    }
  }


  filterByInstitution() {
   this.requeteService
      .getAllRequest(
        this.institutionSelected,
        null,
        0,
        this.user.id,
        "",
        this.checkType()?.id,
        this.pg.pageSize,
        1
      )
      .subscribe({
        next: (res: any) => {
          this.subject.next(res);
          this.data = res.data?.data?.filter((e: any) => {
            const hasServiceAffectation = e.affectation?.some(
              (aff: any) => aff.typeStructure === 'Service'
            );
            const isFinalized = e.finalise === 1;
            const isArchived = e.archiver === 1;
            if (hasServiceAffectation || isFinalized || isArchived) {
              return false;
            }
            if (e.lastparcours != null) {
              return (
                e.lastparcours.idEtape == 1 ||
                e.lastparcours.idEtape == 5 ||
                (e.lastparcours.idEtape == 7) ||
                (e.lastparcours.idEtape == 8 &&
                  e.lastparcours.idEntite == this.user.idEntite)
              );
            } else {
              return e.lastparcours == null;
            }
          });
          this._temp = this.data;
          this.data = res.data?.data?.map((e: any) => {
            e.etat = e.finalise === 1 ? 'Répondu' : 'En attente';
            return e;
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement des requêtes:', err);
          AppSweetAlert.simpleAlert(
            'error',
            'Erreur',
            'Impossible de charger les requêtes.',
            undefined
          );
        },
        complete: () => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });


       this.structureService.getAll(1, this.institutionSelected).subscribe({
      next: (res: any) => {
        console.log('Structures response:', res);
        this.structures = Array.isArray(res) ? res : res?.data || [];
        console.log('Structures chargées:', this.structures);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des structures:', err);
        AppSweetAlert.simpleAlert(
          'error',
          'Erreur',
          'Impossible de charger les structures.',
          undefined
        );
        this.structures = [];
        this.cdr.detectChanges();
      },
    });

}

filterByStructure() {
 this.requeteService
      .getAllRequest(
        this.institutionSelected,
        null,
        0,
        this.user.id,
        this.structureSelected,
        this.checkType()?.id,
        this.pg.pageSize,
        1
      )
      .subscribe({
        next: (res: any) => {
          this.subject.next(res);
          this.data = res.data?.data?.filter((e: any) => {
            const hasServiceAffectation = e.affectation?.some(
              (aff: any) => aff.typeStructure === 'Service'
            );
            const isFinalized = e.finalise === 1;
            const isArchived = e.archiver === 1;
            if (hasServiceAffectation || isFinalized || isArchived) {
              return false;
            }
            if (e.lastparcours != null) {
              return (
                e.lastparcours.idEtape == 1 ||
                e.lastparcours.idEtape == 5 ||
                (e.lastparcours.idEtape == 7) ||
                (e.lastparcours.idEtape == 8 &&
                  e.lastparcours.idEntite == this.user.idEntite)
              );
            } else {
              return e.lastparcours == null;
            }
          });
          this._temp = this.data;
          this.data = res.data?.data?.map((e: any) => {
            e.etat = e.finalise === 1 ? 'Répondu' : 'En attente';
            return e;
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement des requêtes:', err);
          AppSweetAlert.simpleAlert(
            'error',
            'Erreur',
            'Impossible de charger les requêtes.',
            undefined
          );
        },
        complete: () => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });

}
}
