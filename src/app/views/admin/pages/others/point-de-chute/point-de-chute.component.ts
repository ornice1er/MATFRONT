import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { forkJoin } from 'rxjs';

// --- Vos Services ---
import { SettingService } from '../../../../../core/services/setting.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { InstitutionService } from '../../../../../core/services/institution.service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';
import { ObserverService } from '../../../../../core/utils/observer.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';

// --- Vos Composants/Pipes ---
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
    SampleSearchPipe
  ],
  templateUrl: './point-de-chute.component.html',
  styleUrls: ['./point-de-chute.component.css']
})
export class PointDeChuteComponent implements OnInit {
  
  // --- États de chargement ---
  isLoading = true;
  isSavingSettings = false;

  // --- Données pour les paramètres ---
  settings: any = { point_chute_principal: null, point_chute_secondaire: [] };
  settingsId: number | null = null;
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
    private settingService: SettingService,
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

    const settings$ = this.settingService.getPointDeChuteSettings();
    const structures$ = this.structureService.getAll(0, this.user.idEntite);
    const institutions$ = this.institutionService.getAll();
    
    // On appelle la méthode existante avec les bons paramètres pour ce contexte
    const requetes$ = this.requeteService.getAllRequest(
        this.user.idEntite,
        null,       // search: null pour le chargement initial
        0,          // traiteOuiNon: 0 pour les requêtes en instance
        this.user.id,
        "",         // structure: "" pour ne pas filtrer par la structure de l'utilisateur
        null,       // plainte: null car on n'a pas cette information ici
        this.pg.pageSize,
        this.pg.p
    );

    forkJoin([settings$, structures$, institutions$, requetes$]).subscribe({
      next: ([settingsRes, structuresRes, institutionsRes, requetesRes]: any[]) => {
        this.settings = settingsRes.data;
        this.settingsId = settingsRes.data.id;

        this.allStructures = structuresRes.data;
        this.allInstitutions = institutionsRes.data;
        
        this.requetes = requetesRes.data?.data || [];
        // NOTE: La pagination et le total doivent venir de l'API. Assurez-vous que `requetesRes` contient ces infos.
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
    if (!this.settingsId) {
      AppSweetAlert.simpleAlert('error', 'Erreur', 'ID de configuration manquant.');
      return;
    }
    this.isSavingSettings = true;
    this.settingService.updatePointDeChuteSettings(this.settingsId, this.settings).subscribe({
      next: () => {
        this.isSavingSettings = false;
        AppSweetAlert.simpleAlert('success', 'Succès', 'Paramètres des points de chute mis à jour.');
      },
      error: (err) => {
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
    this.modalService.open(content, { size: 'lg' });
  }

  getPage(event: any) {
    this.pg.p = event;
  }
}