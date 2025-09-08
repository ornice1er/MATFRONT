import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner'; // Assurez-vous d'importer et d'installer ngx-spinner
import { SettingService } from '../../../../core/services/setting.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { ObserverService } from '../../../../core/utils/observer.service';
import { ConfigService } from '../../../../core/utils/config-service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { Editor, NgxEditorModule } from 'ngx-editor'; 
import { MultiSelectModule } from 'primeng/multiselect'; 
import { RoleService } from '../../../../core/services/role.service'; 

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxEditorModule,
    MultiSelectModule,
    LoadingComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  isLoading = false;
  user: any;
  roles: any[] = [];
  headerEditor: Editor = new Editor();
  footerEditor: Editor = new Editor();

  setting: any = {
    entite_id: null,
    delai_relance: 3,
    groupe_acteur_controle_primaire: [],
    logo_entite: null,
    entete_entite: '',
    pied_page_entite: '',
  };
  settingId: number | null = null;
  logoPreview: string | null = null;
  logoFile: File | null = null;
  headerFile: File | null = null;
  footerFile: File | null = null;

  headerPreview: string | ArrayBuffer | null = null;
  footerPreview: string | ArrayBuffer | null = null;

  constructor(
    private settingService: SettingService,
    private observerService: ObserverService,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService, 
    private roleService: RoleService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.observerService.setTitle('PARAMÈTRES - Généraux');
    this.user = this.localStorageService.get(GlobalName.userName);
    console.log('Utilisateur connecté :', this.user);
    if (this.user && this.user.idEntite) {
      this.loadSettings();
      this.loadRoles();
    } else {
      AppSweetAlert.simpleAlert(
        'error',
        'Erreur',
        'Utilisateur non identifié ou entité non trouvée. Reconnectez-vous.',
        
      );
    }
  }
  ngOnDestroy(): void {
    this.headerEditor.destroy();
    this.footerEditor.destroy();
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (res: any) => {
        this.roles = res.data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des rôles :", err);
      }
    });
  }
 
  loadSettings(): void {
    this.isLoading = true;
    this.spinner.show();
    this.settingService.getSettingsByEntity(this.user.idEntite).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.setting = res.data;
          if (typeof res.data.groupe_acteur_controle_primaire === 'string') {
            this.setting.groupe_acteur_controle_primaire = JSON.parse(
              res.data.groupe_acteur_controle_primaire
            );
          }
          this.settingId = res.data.id; 
        } else {
          this.settingId = null;
          this.setting.entite_id = this.user.idEntite;
        }
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des paramètres :', err);
        AppSweetAlert.simpleAlert(
          'Erreur',
          'Impossible de charger les paramètres.',
          'error'
        );
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  /**
   * @param event L'événement du champ input file.
   * @param type Le type d'image (logo, header, footer).
   */
  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
      this.setting.logo_entite = this.logoPreview;
    };
    reader.readAsDataURL(file);
  }

  saveSettings(): void {
    this.isLoading = true;
    this.spinner.show();

    const formData = new FormData();

    const payload = { ...this.setting };

    const action = this.settingId 
      ? this.settingService.update(this.settingId, payload) 
      : this.settingService.create(payload);

    action.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.spinner.hide();
        localStorage.setItem('mataccueilSettings', JSON.stringify(res.data)); 
        this.settingId = res.data.id; 
        AppSweetAlert.simpleAlert(
          'Succès',
          'Paramètres mis à jour avec succès !',
          'success'
        );
        this.resetFiles();
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde :', err);
        this.isLoading = false;
        this.spinner.hide();
        AppSweetAlert.simpleAlert(
          'Erreur',
          'Une erreur est survenue lors de la sauvegarde.',
          'error'
        );
      },
    });
  }

  toFileUrl(path: string): string {
    if (path && path.startsWith('data:image')) {
      return path;
    }
    return ConfigService.toFile(path);
  }

  private resetFiles(): void {
    this.logoFile = null;
    this.headerFile = null;
    this.footerFile = null;
  }
}
