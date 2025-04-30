import { PublicLayoutComponent } from "./public-layout/public-layout.component";
import { WelcomeComponent } from "./pages/welcome/welcome.component";
import { EspaceusagerComponent } from "./pages/espaceusager/espaceusager.component";

export const PublicRoutes: any = [ // ✅ Doit être un tableau
    {
      path: 'espace-usager',
      component: PublicLayoutComponent,
      children: [
        { path: '', component: EspaceusagerComponent },
        { path: ':token', component: EspaceusagerComponent },
      ]
    }
  ]