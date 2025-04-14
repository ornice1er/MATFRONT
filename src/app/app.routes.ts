import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { IsAuthedGuard } from './core/guards/is-authed.guard';
import { IsVerifiedAccountStateGuard } from './core/guards/is-verified-account-state.guard';
import { AdminRoutes } from './views/admin/admin-routing.module';
import { AccountActivationComponent } from './views/auth/account-activation/account-activation.component';
import { ForgetPasswordComponent } from './views/auth/forget-password/forget-password.component';
import { LoginComponent } from './views/auth/login/login.component';
import { RecoveryPasswordComponent } from './views/auth/recovery-password/recovery-password.component';
import { UserProfilComponent } from './views/auth/user-profil/user-profil.component';
import { UserSettingComponent } from './views/auth/user-setting/user-setting.component';
import { NotFoundComponent } from './views/not-found-component/not-found-component.component';
import { LayoutComponent } from './views/auth/layout/layout.component';
import { PublicRoutes } from './views/public/public-routing.module';

export const routes: Routes = [
    {path: '', redirectTo: '',pathMatch:'full'},
    ...AdminRoutes,
    ...PublicRoutes,
    {
      path:"auth",
      component:LayoutComponent,
      canActivate:[IsAuthedGuard],
      children:[
        {
          path:"activate-account",
          component:AccountActivationComponent,
          canActivate:[IsVerifiedAccountStateGuard]
        },
        {
          path:"login",
          component:LoginComponent,
          canActivate:[IsAuthedGuard]
        },
        {
          path:"forget-password",
          component:ForgetPasswordComponent
        },
        {
          path:"recovery-password/:token",
          component:RecoveryPasswordComponent
        }
      ]
    },
   
    {
      path:"user-account",
      canActivate:[AuthGuard],
      component:UserProfilComponent
    },
    {
      path:"user-settinngs",
      canActivate:[AuthGuard],
      component:UserSettingComponent
    },
   
    {path: '404', component: NotFoundComponent},
    {path: '**', redirectTo: '/404'}
];
