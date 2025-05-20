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
import { BaseUsagerComponent } from "./pages/base-usager/base-usager.component";
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


export const AdminRoutes: Routes = [ // ✅ Doit être un tableau
    {
      path: 'admin',
      component: LayoutComponent,
      // canActivate: [AuthRoleGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent },
        {
          path:"login",
          component:LoginComponent,
          //canActivate:[IsAuthGuard]
        },
        {
          path:"login-check/:email",
          component:LoginCheckComponent
        },
        {
          path:"login-usager",
          component:LoginUsagerComponent
        },
        {
          path:"login-v2",
          component:LoginV2Component
        },
        {
          path:"login-v2/:code",
          component:LoginV2Component
        },
        {
          path:"reset-password/:token",
          component:ResetPasswordComponent
        },
        {
          path:"forgot-password",
          component:ForgotPasswordComponent
        },
        {
          path: 'requete-usager/complement-information/:id/:codeRequete',
          component:ComplementInformationComponent
        },
        {
          path:"login/:lang",
          component:LoginComponent
        },
        {
          path:"reset-password/:lang/:token",
          component:ResetPasswordComponent
        },
        {
          path:"forgot-password/:lang",
          component:ForgotPasswordComponent
        },
       
    
          
            {
              path: 'crud',
              component:CrudComponent
            },
            {
              path: 'listprofils',
              component:ListeprofilsComponent
            },
            {
              path: 'pointfocalcom',
              component:EspacepointfocalcomComponent
            },
            {
              path: 'listservices',
              component:ListeserviceComponent
            },
            {
              path: 'attributcom',
              component:AttributcomComponent
            },
            {
              path: 'listservicesatraiter',
              component:ListserviceatraiterComponent
            },
            {
              path: 'allservices',
              component:AllServicesComponent
            },
            {
              path: 'avanced-statistics',
              component:AvancedStatisticsComponent
            },
            {
              path: 'managerequeteusager',
              component:ManageRequeteUsagerComponent
            },
          
            {
              path: 'listdenonciations',
              component:ListDenonciationComponent
            },
            {
              path: 'listsuggestions',
              component:ListSuggestionComponent
            },
            {
              path: 'docs',
              component:GuideComponent
            },
            {
              path: 'liststructure',
              component:ListestructuresComponent
            },
            {
              path: 'listcreneaux',
              component:ListerdvcrenauxComponent
            },
            {
              path: 'rdvparam',
              component:ListerdvparametreComponent
            },
            {
              path: 'listdaterdv',
              component:ListdaterdvComponent
            },
            {
              path: 'users',
              component:UsersComponent
            },
            {
              path: 'e-services',
              component:EservicesComponent
            },
            {
              path: 'type-structures',
              component:TypeStructureComponent
            },
            {
              path: 'nature-contracts',
              component:NatureContractComponent
            },
            {
              path: 'ccsps',
              component:CcspComponent
            },
            {
              path: 'ccsp/reports/pending',
              component:CspReportPendingComponent
            },
            {
              path: 'ccsp/reports/own',
              component:CspReportOwnComponent
            },
            {
              path: 'ccsp/reports/create',
              component:CspReportCreateComponent
            },
            {
              path: 'settings',
              component:SettingsComponent
            },
            {
              path: 'users-main',
              component:UsersMainComponent
            },
            {
              path: 'listusager',
              component:ListusagerComponent
            },
            {
              path: 'listacteur',
              component:ListacteursComponent
            },
            {
              path: 'events',
              component:EventsComponent
            },
            {
              path: 'relances',
              component:RelanceComponent
            },
            {
              path: 'institutions',
              component:ListeinstitutionComponent
            },
            {
              path: 'configrelance',
              component:ConfigrelanceComponent
            },
            {
              path: 'listthematique',
              component:ListtypeComponent
            },
            {
              path: 'listetapes',
              component:ListetapesComponent
            },
            {
              path: 'comment',
              component:RapCommentComponent
            },
            {
              path: 'listnature',
              component:ListenatureComponent
            },
            {
              path: 'dashboard',
              component:DashboardComponent
            },
            {
              path: 'profil',
              component:ProfilComponent
            },
            {
              path: 'listrequeteupdate',
              component:ListRequeteUpdateComponent
            },
            {
              path: 'listrequetestructures/:type_req',
              component:ListRequeteStructuresComponent
            },
            {
              path: 'listrequeteservice/:type_req',
              component:ListRequeteServicesComponent
            },
            {
              path: 'listrequetedivision/:type_req',
              component:ListRequeteDivisionComponent
            },
            {
              path: 'listrequeteusager/:type_req',
              component:ListRequeteUsagerComponent
            },
            {
              path: 'listrequeteparcours/:type_req',
              component:ParcoursRequeteComponent
            },
            {
              path: 'listregistre',
              component:ParcoursRegistreComponent
            },
            {
              path: 'statglob/:type_req/:col',
              component:StatspreocComponent
            },
            {
              path: 'listrequetepointreponse',
              component:PointReponseComponent
            },
            {
              path: 'listrequetepointpreoccupation',
              component:PointPreoccupationComponent
            },
            
            {
              path: 'listrdvs',
              component:ListRdvComponent
            },
            {
              path: 'liststatprestation',
              component:ListStatPrestationComponent
            },
            {
              path: 'liststatprestationbystructure',
              component:ListStatPrestationStructureComponent
            },
            {
              path: 'liststattheme/:type_req',
              component:ListStatThemeComponent
            },
            {
              path: 'liststatstructure/:type_req',
              component:ListStatStructureComponent
            },
            {
              path: 'listauxdigit',
              component:ListauxDigitComponent
            },
            {
              path: 'grahiqueevolution/:type_req',
              component:GraphiqueevolutionComponent
            },
            {
              path: 'grahiquetype/:type_req',
              component:GraphiquetypeComponent
            },
            {
              path: 'grahiquestructures/:type_req',
              component:GraphiquestructureComponent
            },
            {
              path: 'listrequeteajdoint/:type_req',
              component:ListRequeteAdjointComponent
            },
            
            {
              path: 'ratioplainteprestation',
              component:ListRatioPlaintePrestaionComponent
            },
            {
              path: 'ratiorequeteprestation',
              component:ListRatioRquetePrestaionComponent
            },
            {
              path: 'ratioplaintestructure',
              component:ListRatioPlainteStructureComponent
            },
            {
              path: 'ratiorequetestructure',
              component:ListRatioRequeteStructureComponent
            },
            {
              path: 'ratiodemandeinfosprestation',
              component:ListRatioDemandeInfosPrestationComponent
            },
            {
              path: 'ratiodemandeinfosstructure',
              component:ListRatioDemandeInfosStructureComponent
            }
          
        
      ]
    }
  ]
