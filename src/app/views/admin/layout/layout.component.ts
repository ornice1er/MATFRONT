import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalName } from '../../../core/utils/global-name';
import { LocalStorageService } from '../../../core/utils/local-stoarge-service';

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
    MatButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  menuOpen = false;
  user:any
  role:any


  constructor(
    
    private authService:AuthService,
    private router: Router,
    private toastr:ToastrService,
    private lsService:LocalStorageService
  ) { }

  ngOnInit(): void {
  
     this.user=this.lsService.get(GlobalName.userName)
    // this.role=this.user.roles[0].name
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
