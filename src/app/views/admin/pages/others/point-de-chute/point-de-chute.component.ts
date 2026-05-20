import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Settings, List, Save, Bell, UserPlus } from 'lucide-angular';

import { RequeteService } from '../../../../../core/services/requete.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { InstitutionService } from '../../../../../core/services/institution.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { ObserverService } from '../../../../../core/utils/observer.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';

import { LoadingComponent } from '../../../../components/loading/loading.component';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { GlobalName } from '../../../../../core/utils/global-name';

@Component({
  selector: 'app-point-de-chute',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxSpinnerModule,
    NgSelectModule,
    NgxPaginationModule,
    LoadingComponent,
    SampleSearchPipe,
    LucideAngularModule,
  ],
  templateUrl: './point-de-chute.component.html',
  styleUrls: ['./point-de-chute.component.css']
})
export class PointDeChuteComponent implements OnInit {

  // Lucide icons
  readonly settingsIcon = Settings;
  readonly listIcon     = List;
  readonly saveIcon     = Save;
  readonly bellIcon     = Bell;
  readonly userPlusIcon = UserPlus;

  readonly Math = Math;

  isLoading = true;
  isSavingSettings = false;
  selectedAffectationStructureId: number | null = null;

  // --- Sélection points de chute (liés aux structures) ---
  selectedPointDeChuteMain: number | null = null;
  selectedPointDeChuteSecondaires: number[] = [];

  page = 1;
  // --- Données pour les listes et filtres ---
  requetes: any[] = [];
  filteredRequetes: any[] = [];
  allStructures: any[] = [];
  allInstitutions: any[] = [];
  user: any;

  // --- Modèles pour les filtres ---
  filterInstitutionId: number | null = null;
  filterStructureId: number | null = null;
  search_text = '';

  // --- Données pour la sélection et la pagination ---
  selectedRequete: any = null;
  pg = { pageSize: 10, p: 1, total: 0 };

  constructor(
    private requeteService: RequeteService,
    private structureService: StructureService,
    private institutionService: InstitutionService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private observerService: ObserverService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.observerService.setTitle('GESTION DES POINTS DE CHUTE');
    this.user = this.localStorageService.get(GlobalName.userName);
    this.loadInitialData();
  }

   loadInitialData(page: number = 1) {
    this.spinner.show();
    this.isLoading = true;
    this.pg.p = page;

    const structures$ = this.structureService.getAll(0, this.user.idEntite);
    const institutions$ = this.institutionService.getAll();

    const requetes$ = this.requeteService.getAllRequest(
        this.user.idEntite,
        null,
        0,
        this.user.id,
        "",
        null,
        this.pg.pageSize,
        this.pg.p
    );

    forkJoin([structures$, institutions$, requetes$]).subscribe({
      next: ([structuresRes, institutionsRes, requetesRes]: any[]) => {
        this.allStructures = structuresRes.data;
        this.allInstitutions = institutionsRes.data;

        // Initialiser les sélections depuis les flags sur les structures
        const principal = this.allStructures.find((s: any) => s.point_de_chute == 1 || s.point_de_chute === true);
        this.selectedPointDeChuteMain = principal?.id ?? null;
        this.selectedPointDeChuteSecondaires = this.allStructures
          .filter((s: any) => s.point_de_chute_dsi == 1 || s.point_de_chute_dsi === true)
          .map((s: any) => s.id);

        this.requetes = requetesRes.data?.data || [];
        this.pg.total = requetesRes.data?.total || this.requetes.length;
        this.applyFilters();
        
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (err) => {
        this.isLoading = false;
        this.spinner.hide();
        AppSweetAlert.simpleAlert('error', 'Erreur de chargement', 'Impossible de charger toutes les données.');
        console.error(err);
      }
    });
  }

  applyFilters() {
    let tempRequetes = [...this.requetes];

    if (this.filterInstitutionId) {
      tempRequetes = tempRequetes.filter(r => r.idEntite === this.filterInstitutionId);
    }
    if (this.filterStructureId) {
      // Note: adaptez cette logique si la structure est dans un objet imbriqué
      tempRequetes = tempRequetes.filter(r => r.idStructure === this.filterStructureId);
    }
    
    this.filteredRequetes = tempRequetes;
    this.pg.total = this.filteredRequetes.length;
    this.pg.p = 1; // Revenir à la première page après un filtre
  }

  resetFilters() {
    this.filterInstitutionId = null;
    this.filterStructureId = null;
    this.applyFilters();
  }

  saveSettings() {
    this.isSavingSettings = true;

    // Pour chaque structure, recalculer ses flags point_de_chute / point_de_chute_dsi
    const updates = this.allStructures.map((s: any) => {
      const isMain      = s.id === this.selectedPointDeChuteMain;
      const isSecondary = this.selectedPointDeChuteSecondaires.includes(s.id);
      return this.structureService.update(
        { ...s, point_de_chute: isMain ? 1 : 0, point_de_chute_dsi: isSecondary ? 1 : 0 },
        s.id
      );
    });

    forkJoin(updates).subscribe({
      next: () => {
        this.isSavingSettings = false;
        AppSweetAlert.simpleAlert('success', 'Succès', 'Points de chute mis à jour.');
      },
      error: () => {
        this.isSavingSettings = false;
        AppSweetAlert.simpleAlert('error', 'Erreur', 'La mise à jour a échoué.');
      }
    });
  }

  checked(requete: any) {
    this.selectedRequete = requete;
  }
  
  relancer() {
    if (!this.selectedRequete) return;
    AppSweetAlert.simpleAlert('info', 'Action', 'Logique de relance à implémenter ici.');
  }

  openAffectationModal(content: any) {
    if (!this.selectedRequete) {
      AppSweetAlert.simpleAlert('error', 'Erreur', 'Veuillez sélectionner une requête à affecter.');
      return;
    }
    this.selectedAffectationStructureId = null;
    this.modalService.open(content, { size: 'lg' });
  }

  saveAffectation() {
    if (!this.selectedAffectationStructureId) {
      AppSweetAlert.simpleAlert('error', 'Erreur', 'Veuillez sélectionner une structure.');
      return;
    }
    AppSweetAlert.simpleAlert('info', 'Action', 'Logique d\'affectation à implémenter ici.');
    this.modalService.dismissAll();
  }

  getPage(event: any) {
    this.pg.p = event;
  }
}