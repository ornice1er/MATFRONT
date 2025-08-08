import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { ObserverService } from '../../../../core/utils/observer.service';

@Component({
  selector: 'kt-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, LoadingComponent, NgSelectModule, NgxPaginationModule, RouterModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  errormessage = "";
  user: any;
  loading = false;

  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private observerService: ObserverService
  ) {}

  ngOnInit(): void {
    this.observerService.setTitle('Mon Profil');
    this.user = this.localStorageService.get(GlobalName.userName);
    console.log("ProfilComponent user:", this.user);
    if (!this.user) {
      this.signout(); 
    }
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  saveUpdateProfil(value: any) {
    if (value.newpassword && value.newpassword !== value.newpasswordconfirm) {
      this.errormessage = "Les nouveaux mots de passe ne sont pas identiques.";
      return;
    }

    this.errormessage = ""; 
    this.loading = true;

    const payload: any = {
      IdUtilisateur: this.user.id
    };

    if (value.newemail) {
      payload.newemail = value.newemail;
    }
    if (value.newpassword) {
      payload.newpassword = value.newpassword;
    }
    if (value.newcontacts) {
      payload.newcontacts = value.newcontacts;
    }

    this.userService.updateProfil(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.localStorageService.set(GlobalName.userName, res);
        



        AppSweetAlert.simpleAlert(
          'success',
          'Profil mis à jour',
          'Votre profil a été modifié avec succès. Vous allez être déconnecté pour appliquer les changements.',
        );
        setTimeout(() => this.signout(), 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.errormessage = err.error?.message || "Une erreur est survenue lors de la mise à jour.";
        AppSweetAlert.simpleAlert('Erreur', this.errormessage, 'error');
      }
    });
  }

  signout() {
    this.localStorageService.clear();
    this.router.navigateByUrl('/auth/login');
  }
}