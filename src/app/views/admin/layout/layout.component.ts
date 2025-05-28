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
import { AuthService } from '../../../core/services/auth.service';
import { GlobalName } from '../../../core/utils/global-name';
import { LocalStorageService } from '../../../core/utils/local-stoarge-service';
import { AuthentificationService } from '../../../core/services/authentification.service';
import { ObserverService } from '../../../core/utils/observer.service';

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
  user:any
  role:any
  current_user_role:any=''
  get_user: any;
  title:any=""

  constructor(
    
    private authService:AuthentificationService,
    private router: Router,
    private toastr:ToastrService,
    private lsService:LocalStorageService,
    private observerService:ObserverService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
    this.observerService.title$.subscribe(newTitle => {
      this.title = newTitle;
      this.cdr.detectChanges(); // Force Angular à mettre à jour le DOM correctement
    });

    this.current_user_role=this.lsService.get(GlobalName.userRole)
    
    
    if (this.lsService.get(GlobalName.userName) != null) {
       this.user = this.lsService.get(GlobalName.userName)
     }else{
      // this.getUser()
     }
}


getUser(){
  this.authService.getUserByToken().subscribe((res: any) => {
    console.log(res)
   this.user=res.data
   this.lsService.set(GlobalName.userName, res)
  })
}

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

  logout(){
    this.authService.logout().subscribe((res:any)=>{
      this.lsService.remove(GlobalName.tokenName)
      this.lsService.remove(GlobalName.refreshTokenName)
      this.lsService.remove(GlobalName.expireIn)
      this.lsService.remove(GlobalName.userName)
      this.lsService.remove(GlobalName.exercice)
      this.router.navigate(['/auth/login'])
      this.toastr.success('Déconnexion réussie', 'Connexion');
    }),
    (err:any)=>{
      console.log(err)
      this.toastr.success('Déconnexion échouée', 'Connexion');

    } ;
  }
}
