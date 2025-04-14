import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { FileService } from '../../../core/services/file.service';
import { UserSettingService } from '../../../core/services/user-setting.service';
import { AppErrorShow } from '../../../core/utils/app-error-show';
import { GlobalName } from '../../../core/utils/global-name';
import { LocalStorageService } from '../../../core/utils/local-stoarge-service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  standalone:true,
  imports:[LoadingComponent,CommonModule,FormsModule],
  styleUrls: ['./user-profil.component.css']
})
export class UserProfilComponent implements OnInit {
  fileSrc:any="https://placehold.co/200x200"
  loading=false
  fileInput:any
  user:any;
  tag="admin-user-account"

  constructor(
    private spinnerService:NgxSpinnerService,
    private fileService:FileService,
    private authService:AuthService,
    private usService:UserSettingService,
    private lsService:LocalStorageService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.user=this.lsService.get(GlobalName.userName)
    if(this.user?.user_setting !=null || this.user?.user_setting!=undefined)this.getFile('local','director',this.user?.user_setting?.signature)

  }
  getFile(disk:any,folder:any,filename:any){
    //this.pdfViewLoader=true
    this.spinnerService.show()
    this.fileService.get({
      folder:folder,
      disk:disk,
      filename:filename
    }).subscribe((res:any)=>{
     // this.pdfViewLoader=false
     this.spinnerService.hide()
      this.fileSrc=res[0]
     // this.offcanvasService.open(this.contentPDF,{  panelClass: 'details-panel', position: 'end'  });

    },
    (err:any)=>{
      this.spinnerService.hide()
      AppErrorShow.showError("Profil utilisateur connecté",err)

    })
  }


  
  update(value:any){

    this.loading=true
    this.authService.update(value).subscribe((res:any)=>{
      this.loading=false
      this.lsService.set(GlobalName.userName,res.data);
      this.user=res.data
      this.toastr.success('Sauvegarde des informations du compte', 'Mon compte');
    },
    (err:any)=>{
      this.loading=false
      this.toastr.success('Sauvegarde des informations échouée', 'Mon compte');

    });
  }

  changePassword(value:any){
    this.loading=true
    this.authService.changePassword(value).subscribe((res:any)=>{
      this.loading=false
      this.toastr.success(res.message, 'Mon compte');
      this.logout()
    },
    (err:any)=>{
      this.loading=false
      this.toastr.error('Changement de mot de passe échouée', 'Mon compte');

    });
  }
  readFile(){
    var reader = new FileReader();

    reader.readAsDataURL(this.fileInput); // read file as data url

    reader.onload = (event) => { // called once readAsDataURL is completed
      this.fileSrc = event.target?.result;
    }
  }

  loadImg(event:any){
    if(event.target.files.length!=0){
      this.fileInput=event.target.files[0]
      this.readFile()
    }
  }
  storeSign(value:any){
    let formData= new FormData()

    if (this.fileInput!=undefined) {
      formData.append("signature",this.fileInput)
    }
    
    if(this.user?.userSetting!=null || this.user?.userSetting!=undefined){
      this.loading=true
      this.usService.update(this.user?.id,formData).subscribe((res:any)=>{
        this.loading=false
        this.toastr.success(res.message, 'Mon compte');
      },
      (err:any)=>{
        this.loading=false
        this.toastr.error('Changement de mot de passe échouée', 'Mon compte');
  
      });
    }else{
      this.loading=true
      this.usService.store(formData).subscribe((res:any)=>{
        this.loading=false
        this.toastr.success(res.message, 'Mon compte');
      },
      (err:any)=>{
        this.loading=false
        this.toastr.error('Changement de mot de passe échouée', 'Mon compte');
  
      });
    }

    
  }

  logout(){
    this.authService.logout().subscribe((res:any)=>{
      this.lsService.remove(GlobalName.tokenName)
      this.lsService.remove(GlobalName.refreshTokenName)
      this.lsService.remove(GlobalName.expireIn)
      this.router.navigate(['/admin/login'])
      this.toastr.success('Déconnexion réussie', 'Connexion');
    }),
    ((err:any)=>{
      console.log(err)
      this.toastr.success('Déconnexion échouée', 'Connexion');

    });
  }
}
