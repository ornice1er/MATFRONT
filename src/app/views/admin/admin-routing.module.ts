import { LayoutComponent } from "./layout/layout.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";


export const AdminRoutes: any = [ // ✅ Doit être un tableau
    {
      path: 'admin',
      component: LayoutComponent,
      children: [
        { path: 'dashboard', component: DashboardComponent },
      ]
    }
  ]