import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthentificationService } from '../../../core/services/authentification.service';
import { LocalStorageService } from '../../../core/utils/local-stoarge-service';
import { ObserverService } from '../../../core/utils/observer.service';
import { AppActionCheckService } from '../../../core/utils/app-action-check';
import { GlobalName } from '../../../core/utils/global-name';

interface MenuItem {
  label: string;
  route?: string;
  key?: string;
  action?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  menuOpen = true;
  user: any;
  title = '';
  role = '';

  menuItems: MenuItem[] = [
    {
      label: 'Accueil',
      route: '/admin/dashboard',
      key: 'TABLEAU DE BORD',
      action: 'LISTER'
    },
    {
      label: 'Suggestions',
      route: '/admin/listsuggestions',
      key: 'SUGGESTION',
      action: 'LISTER'
    },
    {
      label: 'Paramètres',
      key: 'PARAMETRE',
      action: 'LISTER',
      children: [
        { label: 'Structure', route: '/admin/liststructure', key: 'STRUCTURE', action: 'LISTER' },
        { label: 'Acteurs', route: '/admin/listacteur', key: 'ACTEUR', action: 'LISTER' },
        { label: 'Utilisateurs', route: '/admin/users-main', key: 'UTILISATEUR', action: 'LISTER' },
        { label: 'Utilisateurs (sectoriel)', route: '/admin/users', key: 'GESTION DES UTILISATEURS', action: 'LISTER' },
        { label: 'Thématique', route: '/admin/listthematique', key: 'STATISTIQUES THÉMATIQUES', action: 'LISTER' },
        { label: 'Gestion des prestations', route: '/admin/listservices', key: 'SERVICE', action: 'LISTER' },
        { label: 'Profils', route: '/admin/listprofils', key: 'PROFIL', action: 'LISTER' },
        { label: 'Etapes', route: '/admin/listetapes', key: 'ÉTAPE COURRIER', action: 'LISTER' },
        { label: 'Nature requetes', route: '/admin/listnature', key: 'NATURE', action: 'LISTER' },
        { label: 'Entités administratives', route: '/admin/institutions', key: 'INSTITUTION', action: 'LISTER' },
        { label: 'Relances', route: '/admin/configrelance', key: 'CONFIGURATION RELANCE', action: 'LISTER' },
        { label: 'Evènements déclencheurs', route: '/admin/events', key: 'ÉVÉNEMENT', action: 'LISTER' },
        { label: 'Attribution communes', route: '/admin/attributcom', key: 'ATTRIBUTION', action: 'LISTER' },
        { label: 'E Services', route: '/admin/e-services', key: 'E-SERVICE', action: 'LISTER' },
        { label: 'Type structure', route: '/admin/type-structures', key: 'TYPE DE STRUCTURE', action: 'LISTER' },
        { label: 'Nature contrat', route: '/admin/nature-contracts', key: 'NATURE DE CONTRAT', action: 'LISTER' },
        { label: 'Centre communaux', route: '/admin/ccsps', key: 'CCSP', action: 'LISTER' },
        { label: 'Paramètre générale', route: '/admin/settings', key: 'PARAMÈTRES', action: 'LISTER' },
                { label: 'Rôles', route: '/admin/roles', key: 'ROLE', action: 'LISTER' },
                { label: 'Permissions', route: '/admin/permissions', key: 'PERMISSION', action: 'LISTER' },
{ label: 'Rôles & Permissions', route: '/admin/profils', key: 'PROFIL', action: 'LISTER' }

      ]
    },
    {
      label: 'Ratio des prestations',
      key: 'STATISTIQUES',
      action: 'LISTER',
      children: [
        { label: 'Plaintes', route: '/admin/ratioplainteprestation', key: 'STATISTIQUES', action: 'LISTER' },
        { label: 'Requêtes', route: '/admin/ratiorequeteprestation', key: 'STATISTIQUES', action: 'LISTER' },
        { label: 'Demande infos', route: '/admin/ratiodemandeinfosprestation', key: 'STATISTIQUES', action: 'LISTER' }
      ]
    },
    {
      label: 'Ratio des structures',
      key: 'STATISTIQUES',
      action: 'LISTER',
      children: [
        { label: 'Plaintes', route: '/admin/ratioplaintestructure', key: 'STATISTIQUES', action: 'LISTER' },
        { label: 'Requêtes', route: '/admin/ratiorequetestructure', key: 'STATISTIQUES', action: 'LISTER' },
        { label: 'Gestion des usagers', route: '/admin/ratiodemandeinfosstructure', key: 'STATISTIQUES', action: 'LISTER' }
      ]
    },
    {
      label: 'Prestations par structure',
      route: '/admin/listservices',
      key: 'SERVICE',
      action: 'LISTER'
    },
    {
      label: 'Toutes les prestations',
      route: '/admin/allservices',
      key: 'SERVICE',
      action: 'LISTER'
    },
    {
      label: 'Statistiques',
      route: '/admin/liststatprestationbystructure',
      key: 'STATISTIQUES',
      action: 'LISTER'
    },
    {
      label: 'Gestion des usagers',
      route: '/admin/listusager',
      key: 'USAGER',
      action: 'LISTER'
    },
     {
      label: 'Requêtes à traiter',
      route: '/admin/list-requete-a-traiter/requetes',
      key: 'REQUÊTE',
      action: 'LISTER'
    },
      {
      label: 'Plaintes à traiter',
      route: '/admin/list-requete-a-traiter/plaintes',
      key: 'REQUÊTE',
      action: 'LISTER'
    },
      {
      label: 'Demandes infos à traiter',
      route: '/admin/list-requete-a-traiter/infos',
      key: 'REQUÊTE',
      action: 'LISTER'
    },
    // {
    //   label: 'Requêtes à traiter',
    //   route: '/admin/listrequeteservice/requetes',
    //   key: 'REQUÊTE',
    //   action: 'LISTER'
    // },
    // {
    //   label: 'Plaintes à traiter',
    //   route: '/admin/listrequetestructures/plaintes',
    //   key: 'REQUÊTE',
    //   action: 'LISTER'
    // },
    // {
    //   label: 'Demandes infos à traiter',
    //   route: '/admin/listrequeteservice/infos',
    //   key: 'REQUÊTE',
    //   action: 'LISTER'
    // },
    // {
    //   label: 'Requêtes à traiter (adjoint)',
    //   route: '/admin/listrequeteajdoint/requetes',
    //   key: 'REQUÊTE',
    //   action: 'LISTER'
    // },
    // {
    //   label: 'Plaintes à traiter (adjoint)',
    //   route: '/admin/listrequeteajdoint/plaintes',
    //   key: 'REQUÊTE',
    //   action: 'LISTER'
    // },
    // {
    //   label: 'Demandes infos à traiter (adjoint)',
    //   route: '/admin/listrequeteajdoint/infos',
    //   key: 'REQUÊTE',
    //   action: 'LISTER'
    // },
    {
      label: 'Modifier une préoccupation',
      route: '/admin/listrequeteupdate',
      key: 'REQUÊTE',
      action: 'Editer'
    },
    {
      label: 'Gestion des rapports',
      route: '/admin/comment',
      key: 'COMMENTAIRE',
      action: 'LISTER'
    },
    {
      label: 'Gestion des rapports CCSP',
      key: 'RAPPORTS CCSP',
      action: 'LISTER',
      children: [
        { label: 'A valider', route: '/admin/ccsp/reports/pending', key: 'RAPPORTS CCSP', action: 'LISTER' },
        { label: 'Mes Rapports', route: '/admin/ccsp/reports/own', key: 'RAPPORTS CCSP', action: 'LISTER' }
      ]
    },
       {
      label: 'Performances',
      key: 'RAPPORTS CCSP',
      action: 'LISTER',
      route: '/admin/performances',

     
    },
    {
      label: 'Historique',
      key: 'PARCOURS REQUETE',
      action: 'LISTER',
      children: [
        { label: 'Requêtes', route: '/admin/listrequeteparcours/requetes', key: 'PARCOURS REQUETE', action: 'LISTER' },
        { label: 'Plaintes', route: '/admin/listrequeteparcours/plaintes', key: 'PARCOURS REQUETE', action: 'LISTER' },
        { label: 'Demandes infos', route: '/admin/listrequeteparcours/infos', key: 'PARCOURS REQUETE', action: 'LISTER' },
        { label: 'Point réponses', route: '/admin/listrequetepointreponse', key: 'PARCOURS REQUETE', action: 'LISTER' },
        { label: 'Régistre de visite', route: '/admin/listregistre', key: 'REGISTRE', action: 'LISTER' },
        { label: 'Statistique e-service', route: '/admin/statglob/all/all', key: 'STATISTIQUES', action: 'LISTER' },
        { label: 'Journal de connexion', route: '/admin/statglob/conn/all', key: 'LOGS', action: 'LISTER' }
      ]
    },
    {
      label: 'Statistiques',
      key: 'STATISTIQUES',
      action: 'LISTER',
      children: [
        { label: 'Prestations', route: '/admin/liststatprestation', key: 'STATISTIQUES', action: 'LISTER' },
        { label: 'Thématiques', route: '/admin/liststattheme/requetes', key: 'STATISTIQUES THÉMATIQUES', action: 'LISTER' },
        { label: 'Structures', route: '/admin/liststatstructure/requetes', key: 'STATISTIQUES', action: 'LISTER' },
        { label: 'Taux digitalisation', route: '/admin/listauxdigit', key: 'STATISTIQUES', action: 'LISTER' },
        { label: 'Avancées', route: '/admin/avanced-statistics', key: 'STATISTIQUES AVANCÉES', action: 'LISTER' },
        { label: 'Suivi traitement', route: '/admin/follow-treatment', key: 'STATISTIQUES', action: 'LISTER' }
      ]
    },
    {
      label: 'Graphiques',
      key: 'STATISTIQUES',
      action: 'LISTER',
      children: [
        { label: 'Thématiques', route: '/admin/grahiquetype/requetes', key: 'STATISTIQUES THÉMATIQUES', action: 'LISTER' },
        { label: 'Structures', route: '/admin/grahiquestructures/requetes', key: 'STATISTIQUES', action: 'LISTER' }
      ]
    }
  ];

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private toastr: ToastrService,
    private lsService: LocalStorageService,
    private observerService: ObserverService,
    private appActionCheck: AppActionCheckService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.observerService.title$.subscribe(newTitle => {
      this.title = newTitle;
      this.cdr.detectChanges();
    });

    if (this.lsService.get(GlobalName.userName) != null) {
      this.user = this.lsService.get(GlobalName.userName);
      this.role = this.user?.roles?.length > 0 ? this.user.roles[0].name : 'N/A';
    } else {
      this.authService.getUserByToken().subscribe({
        next: (res: any) => {
          this.user = res.data;
          this.lsService.set(GlobalName.userName, res);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de l\'utilisateur', err);
          this.toastr.error('Impossible de récupérer les informations de l\'utilisateur', 'Erreur');
        }
      });
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.lsService.remove(GlobalName.tokenName);
        this.lsService.remove(GlobalName.refreshTokenName);
        this.lsService.remove(GlobalName.expireIn);
        this.lsService.remove(GlobalName.userName);
        this.lsService.remove(GlobalName.exercice);
        this.router.navigate(['/auth/login']);
        this.toastr.success('Déconnexion réussie', 'Connexion');
      },
      error: () => this.toastr.error('Déconnexion échouée', 'Connexion')
    });
  }

  canShowItemBloc(item: MenuItem): boolean {
    if (item.children && Array.isArray(item.children)) {
      return item.children.some(child => this.canShowItem(child));
    }
    return this.canShowItem(item);
  }

  canShowItem(item: MenuItem): boolean {
    const result = item.key && item.action ? this.appActionCheck.check(item.key, item.action) : false;
    return result;
  }
}