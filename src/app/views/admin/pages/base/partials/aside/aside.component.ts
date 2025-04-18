import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from 'express';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../../core/pipes/sample-search.pipe';
import { AuthentificationService } from '../../../../../../core/services/authentification.service';
import { LocalService } from '../../../../../../core/services/local.service';
import { ProfilService } from '../../../../../../core/services/profil.service';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import { Roles } from '../../../../../../core/utils/global-name';

declare var $: any;

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
    standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  admin_r=Roles.Admin
  sub_admin_r=Roles.SubAdmin
  agence_location_r=Roles.AgenceLocationVoiture
  restaurant_r=Roles.Restaurant
  hotel_r=Roles.Hotel
  tour_operator_r=Roles.TourOperateur
  current_user_role:any=''
  constructor(private router:Router,private localStorageService:LocalService,private authService:AuthentificationService,private profilService:ProfilService) { }

  @Input()
  get_user: any;

  user:any

  ngOnInit(): void {
    this.current_user_role=localStorage.getItem('mataccueilUserRole')
    
    if(this.get_user!=null && this.get_user!=undefined){
      this.user=this.get_user
    }

    if (localStorage.getItem('mataccueilUserData') != null) {
      this.user = this.localStorageService.getJsonValue("mataccueilUserData")
      // console.log(this.user)
    }
 
    // $.getScript('assets/js/jquery.min.js')
    // $.getScript('assets/js/bootstrap.bundle.min.js')
    // $.getScript('assets/js/metismenu.min.js')
    // $.getScript('assets/js/jquery.slimscroll.js')
    // $.getScript('assets/js/waves.min.js')
    // $.getScript('assets/js/app.js') 
    $.getScript('assets/js/compiled.min.js')
    // $.getScript('assets/js/testside.js')
  }

  apercuGuide(){
    this.profilService.get(this.user.idprofil).subscribe((res:any)=>{
      // console.log('------------------------------------')
      // console.log(res.fichier_guide)
      if(res.fichier_guide == null || res.fichier_guide == ''){
        alert("Aucune documentation n'est associée à ce profil")
      }else{
        var url= 'https://api.mataccueil.gouv.bj/rapports/'+res.fichier_guide
        window.open(url, "_blank")  
      }
    })
  }


}
