import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../core/pipes/sample-search.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule,
    LoadingComponent,
    SampleSearchPipe,
    NgSelectModule,
    NgxPaginationModule,
  ],
  styleUrls: ['./recovery-password.component.css'],
})
export class RecoveryPasswordComponent implements OnInit {
  loading: any;
  token: any;
  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token == undefined) {
      this.router.navigate(['/auth/login']);
    }
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  recoverPassword(value: any) {
    if (value.password != value.password_confirmation) {
      this.toastr.error(
        'Nouveaux mots de passe non identique',
        'Mot de passe oublié'
      );
      return;
    }
    this.loading = true;

    const payload = {
      email: value.email,
      password: value.password,
      password_confirmation: value.password_confirmation,
      token: this.token
    };
    this.authService.recoverPassword(payload).subscribe(
      (res: any) => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
        this.toastr.success(
          'Changement de mot passe réussi',
          'Mot de passe oublié'
        );
      },
      (err: any) => {
        this.loading = false;
        this.toastr.error(
          'Changement de mot passe échoué',
          'Mot de passe oublié'
        );
      }
    );
  }
}
