import { PublicLayoutComponent } from "./public-layout/public-layout.component";
import { WelcomeComponent } from "./pages/welcome/welcome.component";

export const PublicRoutes: any = [ // ✅ Doit être un tableau
    {
      path: 'public',
      component: PublicLayoutComponent,
      children: [
        { path: '', component: WelcomeComponent }
      ]
    }
  ]