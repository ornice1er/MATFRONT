// import { CommonModule } from '@angular/common';
// import { ChangeDetectorRef, Component } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatListModule } from '@angular/material/list';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../../core/services/auth.service';
// import { GlobalName } from '../../../core/utils/global-name';
// import { LocalStorageService } from '../../../core/utils/local-stoarge-service';
// import { AuthentificationService } from '../../../core/services/authentification.service';
// import { ObserverService } from '../../../core/utils/observer.service';

// @Component({
//   selector: 'app-layout',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     RouterModule,
//     CommonModule,
//     MatToolbarModule,
//     MatSidenavModule,
//     MatIconModule,
//     MatListModule,
//     MatButtonModule,
//     MatExpansionModule,
//   ],
//   templateUrl: './layout.component.html',
//   styleUrl: './layout.component.css'
// })
// export class LayoutComponent {
//   menuOpen = true;
//   user:any
//   role:any
//   current_user_role:any=''
//   get_user: any;
//   title:any=""

//   constructor(
    
//     private authService:AuthentificationService,
//     private router: Router,
//     private toastr:ToastrService,
//     private lsService:LocalStorageService,
//     private observerService:ObserverService,
//     private cdr: ChangeDetectorRef
//   ) { }

//   ngOnInit(): void {
    
//     this.observerService.title$.subscribe(newTitle => {
//       this.title = newTitle;
//       this.cdr.detectChanges(); // Force Angular à mettre à jour le DOM correctement
//     });

//     this.current_user_role=this.lsService.get(GlobalName.userRole)
    
    
//     if (this.lsService.get(GlobalName.userName) != null) {
//        this.user = this.lsService.get(GlobalName.userName)
//      }else{
//       // this.getUser()
//      }
// }


// getUser(){
//   this.authService.getUserByToken().subscribe((res: any) => {
//     console.log(res)
//    this.user=res.data
//    this.lsService.set(GlobalName.userName, res)
//   })
// }

// toggleMenu() {
//   this.menuOpen = !this.menuOpen;
// }

//   logout(){
//     this.authService.logout().subscribe((res:any)=>{
//       this.lsService.remove(GlobalName.tokenName)
//       this.lsService.remove(GlobalName.refreshTokenName)
//       this.lsService.remove(GlobalName.expireIn)
//       this.lsService.remove(GlobalName.userName)
//       this.lsService.remove(GlobalName.exercice)
//       this.router.navigate(['/auth/login'])
//       this.toastr.success('Déconnexion réussie', 'Connexion');
//     }),
//     (err:any)=>{
//       console.log(err)
//       this.toastr.success('Déconnexion échouée', 'Connexion');

//     } ;
//   }
// }

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

  menuItems: MenuItem[] = [
    {
      label: 'Accueil',
      route: '/admin/dashboard',
      key: 'dashboard',
      action: 'Consulter'
    },
    {
      label: 'Suggestions',
      route: '/admin/listsuggestions',
      key: 'listsuggestions',
      action: 'Consulter'
    },
    {
      label: 'Paramètres',
      key: 'parametres',
      action: 'Consulter',
      children: [
        { label: 'Structure', route: '/admin/liststructure', key: 'liststructure', action: 'Consulter' },
        { label: 'Acteurs', route: '/admin/listacteur', key: 'listacteur', action: 'Consulter' },
        { label: 'Utilisateurs', route: '/admin/users-main', key: 'users-main', action: 'Consulter' },
        { label: 'Utilisateurs (sectoriel)', route: '/admin/users', key: 'users', action: 'Consulter' },
        { label: 'Thématique', route: '/admin/listthematique', key: 'listthematique', action: 'Consulter' },
        { label: 'Gestion des prestations', route: '/admin/listservices', key: 'listservices', action: 'Consulter' },
        { label: 'Profils', route: '/admin/listprofils', key: 'listprofils', action: 'Consulter' },
        { label: 'Etapes', route: '/admin/listetapes', key: 'listetapes', action: 'Consulter' },
        { label: 'Nature requetes', route: '/admin/listnature', key: 'listnature', action: 'Consulter' },
        { label: 'Entités administratives', route: '/admin/institutions', key: 'institutions', action: 'Consulter' },
        { label: 'Relances', route: '/admin/configrelance', key: 'configrelance', action: 'Consulter' },
        { label: 'Evènements déclencheurs', route: '/admin/events', key: 'events', action: 'Consulter' },
        { label: 'Attribution communes', route: '/admin/attributcom', key: 'attributcom', action: 'Consulter' },
        { label: 'E Services', route: '/admin/e-services', key: 'e-services', action: 'Consulter' },
        { label: 'Type structure', route: '/admin/type-structures', key: 'type-structures', action: 'Consulter' },
        { label: 'Nature contrat', route: '/admin/nature-contracts', key: 'nature-contracts', action: 'Consulter' },
        { label: 'Centre communaux', route: '/admin/ccsps', key: 'ccsps', action: 'Consulter' },
        { label: 'Paramètre générale', route: '/admin/settings', key: 'settings', action: 'Consulter' }
      ]
    },
    {
      label: 'Ratio des prestations',
      key: 'ratio-prestations',
      action: 'Consulter',
      children: [
        { label: 'Plaintes', route: '/admin/ratioplainteprestation', key: 'ratioplainteprestation', action: 'Consulter' },
        { label: 'Requêtes', route: '/admin/ratiorequeteprestation', key: 'ratiorequeteprestation', action: 'Consulter' },
        { label: 'Demande infos', route: '/admin/ratiodemandeinfosprestation', key: 'ratiodemandeinfosprestation', action: 'Consulter' }
      ]
    },
    {
      label: 'Ratio des structures',
      key: 'ratio-structures',
      action: 'Consulter',
      children: [
        { label: 'Plaintes', route: '/admin/ratioplaintestructure', key: 'ratioplaintestructure', action: 'Consulter' },
        { label: 'Requêtes', route: '/admin/ratiorequetestructure', key: 'ratiorequetestructure', action: 'Consulter' },
        { label: 'Gestion des usagers', route: '/admin/ratiodemandeinfosstructure', key: 'ratiodemandeinfosstructure', action: 'Consulter' }
      ]
    },
    {
      label: 'Prestations par structure',
      route: '/admin/listservices',
      key: 'listservices',
      action: 'Consulter'
    },
    {
      label: 'Toutes les prestations',
      route: '/admin/allservices',
      key: 'allservices',
      action: 'Consulter'
    },
    {
      label: 'Statistiques',
      route: '/admin/liststatprestationbystructure',
      key: 'liststatprestationbystructure',
      action: 'Consulter'
    },
    {
      label: 'Gestion des usagers',
      route: '/admin/listusager',
      key: 'listusager',
      action: 'Consulter'
    },
    {
      label: 'Requêtes à traiter',
      route: '/admin/listrequeteservice/requetes',
      key: 'listrequeteservice-requetes',
      action: 'Consulter'
    },
    {
      label: 'Plaintes à traiter',
      route: '/admin/listrequetestructures/plaintes',
      key: 'listrequetestructures-plaintes',
      action: 'Consulter'
    },
    {
      label: 'Demandes infos à traiter',
      route: '/admin/listrequeteservice/infos',
      key: 'listrequeteservice-infos',
      action: 'Consulter'
    },
    {
      label: 'Requêtes à traiter (adjoint)',
      route: '/admin/listrequeteajdoint/requetes',
      key: 'listrequeteajdoint-requetes',
      action: 'Consulter'
    },
    {
      label: 'Plaintes à traiter (adjoint)',
      route: '/admin/listrequeteajdoint/plaintes',
      key: 'listrequeteajdoint-plaintes',
      action: 'Consulter'
    },
    {
      label: 'Demandes infos à traiter (adjoint)',
      route: '/admin/listrequeteajdoint/infos',
      key: 'listrequeteajdoint-infos',
      action: 'Consulter'
    },
    {
      label: 'Modifier une préoccupation',
      route: '/admin/listrequeteupdate',
      key: 'listrequeteupdate',
      action: 'Editer'
    },
    {
      label: 'Gestion des rapports',
      route: '/admin/comment',
      key: 'comment',
      action: 'Consulter'
    },
    {
      label: 'Gestion des rapports CCSP',
      key: 'ccsp-reports',
      action: 'Consulter',
      children: [
        { label: 'A valider', route: '/admin/ccsp/reports/pending', key: 'ccsp-reports-pending', action: 'Consulter' },
        { label: 'Mes Rapports', route: '/admin/ccsp/reports/own', key: 'ccsp-reports-own', action: 'Consulter' }
      ]
    },
    {
      label: 'Historique',
      key: 'historique',
      action: 'Consulter',
      children: [
        { label: 'Requêtes', route: '/admin/listrequeteparcours/requetes', key: 'listrequeteparcours-requetes', action: 'Consulter' },
        { label: 'Plaintes', route: '/admin/listrequeteparcours/plaintes', key: 'listrequeteparcours-plaintes', action: 'Consulter' },
        { label: 'Demandes infos', route: '/admin/listrequeteparcours/infos', key: 'listrequeteparcours-infos', action: 'Consulter' },
        { label: 'Point réponses', route: '/admin/listrequetepointreponse', key: 'listrequetepointreponse', action: 'Consulter' },
        { label: 'Régistre de visite', route: '/admin/listregistre', key: 'listregistre', action: 'Consulter' },
        { label: 'Statistique e-service', route: '/admin/statglob/all/all', key: 'statglob-all', action: 'Consulter' },
        { label: 'Journal de connexion', route: '/admin/statglob/conn/all', key: 'statglob-conn', action: 'Consulter' }
      ]
    },
    {
      label: 'Statistiques',
      key: 'statistiques',
      action: 'Consulter',
      children: [
        { label: 'Prestations', route: '/admin/liststatprestation', key: 'liststatprestation', action: 'Consulter' },
        { label: 'Thématiques', route: '/admin/liststattheme/requetes', key: 'liststattheme-requetes', action: 'Consulter' },
        { label: 'Structures', route: '/admin/liststatstructure/requetes', key: 'liststatstructure-requetes', action: 'Consulter' },
        { label: 'Taux digitalisation', route: '/admin/listauxdigit', key: 'listauxdigit', action: 'Consulter' },
        { label: 'Avancées', route: '/admin/avanced-statistics', key: 'avanced-statistics', action: 'Consulter' },
        { label: 'Suivi traitement', route: '/admin/follow-treatment', key: 'follow-treatment', action: 'Consulter' }
      ]
    },
    {
      label: 'Graphiques',
      key: 'graphiques',
      action: 'Consulter',
      children: [
        { label: 'Thématiques', route: '/admin/grahiquetype/requetes', key: 'grahiquetype-requetes', action: 'Consulter' },
        { label: 'Structures', route: '/admin/grahiquestructures/requetes', key: 'grahiquestructures-requetes', action: 'Consulter' }
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
    } else {
      this.authService.getUserByToken().subscribe({
        next: (res: any) => {
          this.user = res.data;
          this.lsService.set(GlobalName.userName, res);
        },
        error: (err) => console.error('Erreur lors de la récupération de l\'utilisateur', err)
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

 canShowItem(item: MenuItem): boolean {
  const result = item.key && item.action ? this.appActionCheck.check(item.key, item.action) : false;
  console.log(`canShowItem(${item.key}, ${item.action}) => ${result}`);
  return result;
}
}