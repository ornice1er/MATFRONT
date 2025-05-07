import { Component, OnInit,Input } from '@angular/core';
// import { Router } from '@angular/router';
// import { Roles } from '../../../core/_models/roles';
// import { UserService } from '../../../core/_services/user.service';
// import { User } from '../../../core/_models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';


@Component({
  selector: 'kt-profil',
  standalone: true,
            imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  @Input() cssClasses = '';
  error=""
  errormessage=""
  current_role=""
  user:any
  file:File | null | undefined
  
  constructor(private localService:LocalStorageService,private userService:UserService,private router:Router,private localStorageService:LocalStorageService) { }

  ngOnInit(): void {
      this.current_role=localStorage.getItem('mataccueilUserRole')?? ""
      this.user=this.localStorageService.get(GlobalName.userName)
      console.log('-----------------------------------12')     
      console.log(this.user)     
  }
  
  saveUpdateProfil(value:any){
    if(value.newpassword==value.newpasswordconfirm){
      var params = {
        IdUtilisateur:this.user.id,
        newemail:value.newemail,
        newpassword:value.newpassword,
        newcontacts:value.newcontacts,
    }
      this.userService.updateProfil(params).subscribe((res:any)=>{
        this.localService.set(GlobalName.userName,res);
        AppSweetAlert.simpleAlert('Modification profil', 'Votre mise à jour de profil été prise en compte avec succès. A présent nous vous déconnecterons et vous reconnecterez avec votre nouveau mot de passe.', 'success')
        this.signout()
      }, (err:any)=>{
        AppSweetAlert.simpleAlert('Modification profil', 'Une erreur est survenue, verifier votre connexion internet puis reessayer', 'error')
      }) 
    }
  }
  signout(){
    this.localService.remove(GlobalName.tokenName)
    this.localStorageService.clear()
    this.router.navigateByUrl('/login')
  }
 
  updateUser(value:any){

    let formData=new FormData()
    formData.append("username",value.last_name+" "+value.first_name )
    formData.append("last_name",value.last_name)
    formData.append("phone",value.phone)
    formData.append("email",value.email)
    formData.append("first_name",value.first_name)
   
    if(this.file!=null){
      formData.append("profil_image",this.file)
    }
    this.userService.update(value,this.user.id).subscribe((res:any)=>{
      this.localService.set(GlobalName.userName,res);
      AppSweetAlert.simpleAlert('Modification de profil', 'Votre mise à jour de profil été prise en compte avec succès', 'success')

      this.ngOnInit()
    }, (err:any)=>{
      AppSweetAlert.simpleAlert('Modification de profil', 'Une erreur est survenue, verifier votre connexion internet puis reessayer', 'error')
    }) 
  }
  onFileChange(event:any) {
    this.file=null
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    //  this.form.get('avatar').setValue(file);
    }
  }

}
