import { Routes } from "@angular/router";
import { LoginComponent } from "../auth/login/login.component";
import { LayoutComponent } from "./layout/layout.component";
import { AllServicesComponent } from "./pages/all-services/all-services.component";
import { ForgotPasswordComponent } from "./pages/auth/forgot-password/forgot-password.component";
import { LoginCheckComponent } from "./pages/auth/login-check/login-check.component";
import { LoginUsagerComponent } from "./pages/auth/login-usager/login-usager.component";
import { LoginV2Component } from "./pages/auth/login-v2/login-v2.component";
import { ResetPasswordComponent } from "./pages/auth/reset-password/reset-password.component";
import { AvancedStatisticsComponent } from "./pages/avanced-statistics/avanced-statistics.component";
import { PerformanceRequeteComponent } from "./pages/performance-requete/performance-requete.component";
import { BaseUsagerComponent } from "./pages/base-usager/base-usager.component";
import { RecoveryPasswordComponent } from "../auth/recovery-password/recovery-password.component";
import { BaseComponent } from "./pages/base/base.component";
import { CcspComponent } from "./pages/ccsp/ccsp.component";
import { CrudComponent } from "./pages/crud/crud.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { EservicesComponent } from "./pages/eservices/eservices.component";
import { ListStatPrestationStructureComponent } from "./pages/list-stat-prestation-structure/list-stat-prestation-structure.component";
import { NatureContractComponent } from "./pages/nature-contract/nature-contract.component";
import { ComplementInformationComponent } from "./pages/others/complement-information/complement-information.component";
import { EspacepointfocalcomComponent } from "./pages/others/espacepointfocalcom/espacepointfocalcom.component";
import { GraphiqueevolutionComponent } from "./pages/others/graphiqueevolution/graphiqueevolution.component";
import { GraphiquestructureComponent } from "./pages/others/graphiquestructure/graphiquestructure.component";
import { GraphiquetypeComponent } from "./pages/others/graphiquetype/graphiquetype.component";
import { GuideComponent } from "./pages/others/guide/guide.component";
import { ListDenonciationComponent } from "./pages/others/list-denonciation/list-denonciation.component";
import { RapCommentComponent } from "./pages/others/list-rap-comment/listrapcom.component";
import { ListRatioDemandeInfosPrestationComponent } from "./pages/others/list-ratio-demande-infos-prestation/list-ratio-demande-infos-prestation.component";
import { ListRatioDemandeInfosStructureComponent } from "./pages/others/list-ratio-demande-infos-structure/list-ratio-demande-infos-structure.component";
import { ListRatioPlaintePrestaionComponent } from "./pages/others/list-ratio-plainte-prestaion/list-ratio-plainte-prestaion.component";
import { ListRatioPlainteStructureComponent } from "./pages/others/list-ratio-plainte-structure/list-ratio-plainte-structure.component";
import { ListRatioRequeteStructureComponent } from "./pages/others/list-ratio-requete-structure/list-ratio-requete-structure.component";
import { ListRatioRquetePrestaionComponent } from "./pages/others/list-ratio-rquete-prestaion/list-ratio-rquete-prestaion.component";
import { ListRdvComponent } from "./pages/others/list-rdv/list-rdv.component";
import { ListRequeteATraiterComponent } from "./pages/others/list-requete-a-traiter/list-requete-a-traiter.component";
import { ListRequeteAdjointComponent } from "./pages/others/list-requete-adjoint/list-requete-adjoint.component";
import { ListRequeteDivisionComponent } from "./pages/others/list-requete-division/list-requete-division.component";
import { ListRequeteServicesComponent } from "./pages/others/list-requete-services/list-requete-services.component";
import { ListRequeteStructuresComponent } from "./pages/others/list-requete-structures/list-requete-structures.component";
import { ListRequeteUpdateComponent } from "./pages/others/list-requete-update/list-requete-update.component";
import { ListRequeteUsagerComponent } from "./pages/others/list-requete-usager/list-requete-usager.component";
import { ListStatPrestationComponent } from "./pages/others/list-stat-prestation/list-stat-prestation.component";
import { ListStatStructureComponent } from "./pages/others/list-stat-structure/list-stat-structure.component";
import { ListStatThemeComponent } from "./pages/others/list-stat-theme/list-stat-theme.component";
import { ListSuggestionComponent } from "./pages/others/list-suggestion/list-suggestion.component";
import { ListauxDigitComponent } from "./pages/others/list-taux-digita/list-taux-digita.component";
import { ManageRequeteUsagerComponent } from "./pages/others/manage-requete-usager/manage-requete-usager.component";
import { ParcoursRegistreComponent } from "./pages/others/parcours-registre/parcours-registre.component";
import { ParcoursRequeteComponent } from "./pages/others/parcours-requete/parcours-requete.component";
import { PointPreoccupationComponent } from "./pages/others/point-preoccupation/point-preoccupation.component";
import { PointReponseComponent } from "./pages/others/point-reponse/point-reponse.component";
import { RelanceComponent } from "./pages/others/relance/relance.component";
import { ParameterValuesComponent } from "./pages/parameter-values/parameter-values.component";
import { StatspreocComponent } from "./pages/others/stats-preoc/stats-preoc.component";
import { AttributcomComponent } from "./pages/parameters/attributcom/attributcom.component";
import { ConfigrelanceComponent } from "./pages/parameters/configrelance/configrelance.component";
import { EventsComponent } from "./pages/parameters/events/events.component";
import { ListacteursComponent } from "./pages/parameters/listacteurs/listacteurs.component";
import { ListdaterdvComponent } from "./pages/parameters/listdaterdv/listdaterdv.component";
import { ListeinstitutionComponent } from "./pages/parameters/listeinstitution/listeinstitution.component";
import { ListenatureComponent } from "./pages/parameters/listenature/listenature.component";
import { ListeprofilsComponent } from "./pages/parameters/listeprofils/listeprofils.component";
import { ListerdvcrenauxComponent } from "./pages/parameters/listerdvcrenaux/listerdvcrenaux.component";
import { ListerdvparametreComponent } from "./pages/parameters/listerdvparametre/listerdvparametre.component";
import { ListeserviceComponent } from "./pages/parameters/listeservice/listeservice.component";
import { ListestructuresComponent } from "./pages/parameters/listestructures/listestructures.component";
import { ListetapesComponent } from "./pages/parameters/listetapes/listetapes.component";
import { ListserviceatraiterComponent } from "./pages/parameters/listserviceatraiter/listserviceatraiter.component";
import { ListtypeComponent } from "./pages/parameters/listtype/listtype.component";
import { ListusagerComponent } from "./pages/parameters/listusager/listusager.component";
import { ProfilComponent } from "./pages/profil/profil.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { TypeStructureComponent } from "./pages/type-structure/type-structure.component";
import { UsersMainComponent } from "./pages/users-main/users-main.component";
import { UsersComponent } from "./pages/users/users.component";
import { CspReportPendingComponent } from "./pages/csp-report-pending/csp-report-pending.component";
import { CspReportOwnComponent } from "./pages/csp-report-own/csp-report-own.component";
import { CspReportCreateComponent } from "./pages/csp-report-create/csp-report-create.component";
import { FollowTreatmentComponent } from "./pages/follow-treatment/follow-treatment.component";
import { PermissionComponent } from "./pages/permission/permission.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { RoleComponent } from "./pages/role/role.component";
import { AuthGuard } from "../../core/guards/auth.guard";

export const PublicAuthRoutes: Routes = [

  // {
  //   path: 'reset-password/:token', // <-- VOTRE ROUTE, MAINTENANT PUBLIQUE
  //   component: RecoveryPasswordComponent
  // },
]



export const AdminRoutes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { key: 'TABLEAU DE BORD', action: 'Consulter' }
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'login-check/:email',
        component: LoginCheckComponent
      },
      {
        path: 'login-usager',
        component: LoginUsagerComponent
      },
      {
        path: 'login-v2',
        component: LoginV2Component
      },
      {
        path: 'login-v2/:code',
        component: LoginV2Component
      },
      // {
      //   path: 'reset-password/:token',
      //   component: ResetPasswordComponent
      // },
      //   {
      //   path: 'reset-password/:token',
      //   component: RecoveryPasswordComponent
      // },
      {
        path: 'forgot-password/:lang',
        component: ForgotPasswordComponent
      },
      {
        path: 'requete-usager/complement-information/:id/:codeRequete',
        component: ComplementInformationComponent,
        canActivate: [AuthGuard],
        data: { key: 'REQUÊTE', action: 'Consulter' }
      },
      {
        path: 'login/:lang',
        component: LoginComponent
      },

      {
        path: 'reset-password/:lang/:token',
        component: ResetPasswordComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'crud',
        component: CrudComponent,
        canActivate: [AuthGuard],
        data: { key: 'PARAMETRE', action: 'Consulter' }
      },
      {
        path: 'listprofils',
        component: ListeprofilsComponent,
        canActivate: [AuthGuard],
        data: { key: 'PROFIL', action: 'Consulter' }
      },
      {
        path: 'roles',
        component: RoleComponent,
        canActivate: [AuthGuard],
        data: { key: 'RÔLE', action: 'Consulter' }
      },
      {
        path: 'permissions',
        component: PermissionComponent,
        canActivate: [AuthGuard],
        data: { key: 'PERMISSION', action: 'Consulter' }
      },
      {
        path: 'profils',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { key: 'PROFIL', action: 'Consulter' }
      },
      {
        path: 'pointfocalcom',
        component: EspacepointfocalcomComponent,
        canActivate: [AuthGuard],
        data: { key: 'AFFECTATION', action: 'Consulter' }
      },
      {
        path: 'listservices',
        component: ListeserviceComponent,
        canActivate: [AuthGuard],
        data: { key: 'SERVICE', action: 'Consulter' }
      },
      {
        path: 'attributcom',
        component: AttributcomComponent,
        canActivate: [AuthGuard],
        data: { key: 'ATTRIBUTION', action: 'Consulter' }
      },
      {
        path: 'listservicesatraiter',
        component: ListserviceatraiterComponent,
        canActivate: [AuthGuard],
        data: { key: 'SERVICE', action: 'Consulter' }
      },
      {
        path: 'allservices',
        component: AllServicesComponent,
        canActivate: [AuthGuard],
        data: { key: 'SERVICE', action: 'Consulter' }
      },
      {
        path: 'avanced-statistics',
        component: AvancedStatisticsComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES AVANCÉES', action: 'Consulter' }
      },
      {
        path: 'managerequeteusager',
        component: ManageRequeteUsagerComponent,
        canActivate: [AuthGuard],
        data: { key: 'REQUÊTE', action: 'Consulter' }
      },
      {
        path: 'listdenonciations',
        component: ListDenonciationComponent,
        canActivate: [AuthGuard],
        data: { key: 'DÉNONCIATION', action: 'Consulter' }
      },
      {
        path: 'listsuggestions',
        component: ListSuggestionComponent,
        canActivate: [AuthGuard],
        data: { key: 'SUGGESTION', action: 'Consulter' }
      },
      {
        path: 'docs',
        component: GuideComponent,
        canActivate: [AuthGuard],
        data: { key: 'FAQ', action: 'Consulter' }
      },
      {
        path: 'liststructure',
        component: ListestructuresComponent,
        canActivate: [AuthGuard],
        data: { key: 'STRUCTURE', action: 'Consulter' }
      },
      {
        path: 'listcreneaux',
        component: ListerdvcrenauxComponent,
        canActivate: [AuthGuard],
        data: { key: 'CRÉNEAU RENDEZ-VOUS', action: 'Consulter' }
      },
      {
        path: 'rdvparam',
        component: ListerdvparametreComponent,
        canActivate: [AuthGuard],
        data: { key: 'PARAMÈTRES RENDEZ-VOUS', action: 'Consulter' }
      },
      {
        path: 'listdaterdv',
        component: ListdaterdvComponent,
        canActivate: [AuthGuard],
        data: { key: 'JOUR RENDEZ-VOUS', action: 'Consulter' }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: { key: 'GESTION DES UTILISATEURS', action: 'Consulter' }
      },
      {
        path: 'e-services',
        component: EservicesComponent,
        canActivate: [AuthGuard],
        data: { key: 'E-SERVICE', action: 'Consulter' }
      },
      {
        path: 'type-structures',
        component: TypeStructureComponent,
        canActivate: [AuthGuard],
        data: { key: 'TYPE DE STRUCTURE', action: 'Consulter' }
      },
      {
        path: 'nature-contracts',
        component: NatureContractComponent,
        canActivate: [AuthGuard],
        data: { key: 'NATURE DE CONTRAT', action: 'Consulter' }
      },
      {
        path: 'ccsps',
        component: CcspComponent,
        canActivate: [AuthGuard],
        data: { key: 'CCSP', action: 'Consulter' }
      },
        {
        path: 'parameter-values',
        component: ParameterValuesComponent,
        canActivate: [AuthGuard],
        data: { key: 'CCSP', action: 'Consulter' }
      },
        {
        path: 'performances',
        component: PerformanceRequeteComponent,
        canActivate: [AuthGuard],
        data: { key: 'CCSP', action: 'Consulter' }
      },
      {
        path: 'ccsp/reports/pending',
        component: CspReportPendingComponent,
        canActivate: [AuthGuard],
        data: { key: 'RAPPORTS CCSP', action: 'Consulter' }
      },
      {
        path: 'ccsp/reports/own',
        component: CspReportOwnComponent,
        canActivate: [AuthGuard],
        data: { key: 'RAPPORTS CCSP', action: 'Consulter' }
      },
      {
        path: 'ccsp/reports/create',
        component: CspReportCreateComponent,
        canActivate: [AuthGuard],
        data: { key: 'RAPPORTS CCSP', action: 'Ajouter' }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { key: 'PARAMÈTRES', action: 'Consulter' }
      },
      {
        path: 'users-main',
        component: UsersMainComponent,
        canActivate: [AuthGuard],
        data: { key: 'UTILISATEUR', action: 'Consulter' }
      },
      {
        path: 'listusager',
        component: ListusagerComponent,
        canActivate: [AuthGuard],
        data: { key: 'USAGER', action: 'Consulter' }
      },
      {
        path: 'listacteur',
        component: ListacteursComponent,
        canActivate: [AuthGuard],
        data: { key: 'ACTEUR', action: 'Consulter' }
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivate: [AuthGuard],
        data: { key: 'ÉVÉNEMENT', action: 'Consulter' }
      },
      {
        path: 'relances',
        component: RelanceComponent,
        canActivate: [AuthGuard],
        data: { key: 'CONFIGURATION RELANCE', action: 'Consulter' }
      },
      {
        path: 'institutions',
        component: ListeinstitutionComponent,
        canActivate: [AuthGuard],
        data: { key: 'INSTITUTION', action: 'Consulter' }
      },
      {
        path: 'configrelance',
        component: ConfigrelanceComponent,
        canActivate: [AuthGuard],
        data: { key: 'CONFIGURATION RELANCE', action: 'Consulter' }
      },
      {
        path: 'listthematique',
        component: ListtypeComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES THÉMATIQUES', action: 'Consulter' }
      },
      {
        path: 'listetapes',
        component: ListetapesComponent,
        canActivate: [AuthGuard],
        data: { key: 'ÉTAPE COURRIER', action: 'Consulter' }
      },
      {
        path: 'comment',
        component: RapCommentComponent,
        canActivate: [AuthGuard],
        data: { key: 'COMMENTAIRE', action: 'Consulter' }
      },
      {
        path: 'listnature',
        component: ListenatureComponent,
        canActivate: [AuthGuard],
        data: { key: 'NATURE', action: 'Consulter' }
      },
      {
        path: 'profil',
        component: ProfilComponent,
        canActivate: [AuthGuard],
        data: { key: 'PROFIL', action: 'Consulter' }
      },
      {
        path: 'listrequeteupdate',
        component: ListRequeteUpdateComponent,
        canActivate: [AuthGuard],
        data: { key: 'REQUÊTE', action: 'Editer' }
      },
       {
        path: 'list-requete-a-traiter/:type_req',
        component: ListRequeteATraiterComponent,
        canActivate: [AuthGuard],
        data: { key: 'REQUÊTE', action: 'Consulter' }
      },
      // {
      //   path: 'listrequetestructures/:type_req',
      //   component: ListRequeteStructuresComponent,
      //   canActivate: [AuthGuard],
      //   data: { key: 'REQUÊTE', action: 'Consulter' }
      // },
      // {
      //   path: 'listrequeteservice/:type_req',
      //   component: ListRequeteServicesComponent,
      //   canActivate: [AuthGuard],
      //   data: { key: 'REQUÊTE', action: 'Consulter' }
      // },
      {
        path: 'listrequetedivision/:type_req',
        component: ListRequeteDivisionComponent,
        canActivate: [AuthGuard],
        data: { key: 'REQUÊTE', action: 'Consulter' }
      },
      // {
      //   path: 'listrequeteusager/:type_req',
      //   component: ListRequeteUsagerComponent,
      //   canActivate: [AuthGuard],
      //   data: { key: 'REQUÊTE', action: 'Consulter' }
      // },
      {
        path: 'listrequeteparcours/:type_req',
        component: ParcoursRequeteComponent,
        canActivate: [AuthGuard],
        data: { key: 'PARCOURS REQUETE', action: 'Consulter' }
      },
      {
        path: 'listregistre',
        component: ParcoursRegistreComponent,
        canActivate: [AuthGuard],
        data: { key: 'REGISTRE', action: 'Consulter' }
      },
      {
        path: 'statglob/:type_req/:col',
        component: StatspreocComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'listrequetepointreponse',
        component: PointReponseComponent,
        canActivate: [AuthGuard],
        data: { key: 'PARCOURS REQUETE', action: 'Consulter' }
      },
      {
        path: 'listrequetepointpreoccupation',
        component: PointPreoccupationComponent,
        canActivate: [AuthGuard],
        data: { key: 'PARCOURS REQUETE', action: 'Consulter' }
      },


      {
        path: 'listrdvs',
        component: ListRdvComponent,
        canActivate: [AuthGuard],
        data: { key: 'RENDEZ-VOUS', action: 'Consulter' }
      },
      {
        path: 'liststatprestation',
        component: ListStatPrestationComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'liststatprestationbystructure',
        component: ListStatPrestationStructureComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'liststattheme/:type_req',
        component: ListStatThemeComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES THÉMATIQUES', action: 'Consulter' }
      },
      {
        path: 'liststatstructure/:type_req',
        component: ListStatStructureComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'listauxdigit',
        component: ListauxDigitComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'grahiqueevolution/:type_req',
        component: GraphiqueevolutionComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'grahiquetype/:type_req',
        component: GraphiquetypeComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES THÉMATIQUES', action: 'Consulter' }
      },
      {
        path: 'grahiquestructures/:type_req',
        component: GraphiquestructureComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'listrequeteajdoint/:type_req',
        component: ListRequeteAdjointComponent,
        canActivate: [AuthGuard],
        data: { key: 'REQUÊTE', action: 'Consulter' }
      },
      {
        path: 'ratioplainteprestation',
        component: ListRatioPlaintePrestaionComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'ratiorequeteprestation',
        component: ListRatioRquetePrestaionComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'ratioplaintestructure',
        component: ListRatioPlainteStructureComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'ratiorequetestructure',
        component: ListRatioRequeteStructureComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'ratiodemandeinfosprestation',
        component: ListRatioDemandeInfosPrestationComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'ratiodemandeinfosstructure',
        component: ListRatioDemandeInfosStructureComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      },
      {
        path: 'follow-treatment',
        component: FollowTreatmentComponent,
        canActivate: [AuthGuard],
        data: { key: 'STATISTIQUES', action: 'Consulter' }
      }
    ]
  }
];
