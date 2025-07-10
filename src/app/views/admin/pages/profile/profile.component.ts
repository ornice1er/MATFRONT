import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { ProfileService } from '../../../../core/services/profile.service';
import { AppErrorShow } from '../../../../core/utils/app-error-show';
import { GlobalName } from '../../../../core/utils/global-name';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  
  standalone:true,
  imports:[CommonModule,FormsModule,MultiSelectModule,NgbModule,LoadingComponent,SampleSearchPipe,NgxPaginationModule, NgSelectModule],
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selected_data:any
  selectedId: number | null = null;
  is_active=null
  buttonsPermission :any|undefined;
  selectedRoleId: number | null = null;
  data:any[]=[]
  permissionsChosen: number[] = [];
  user:any
  actions:any
  features:any[]=[]
  permissions:any[]=[]
  loading=false
  loading2=false
  tag="admin-profiles"
  search_text=""

      constructor(
        private locService:LocalStorageService, 
        private profileService:ProfileService,
        private toastrService:ToastrService,
        private dialogService:NgbModal,
        private modalService:NgbModal,
        private spinnerService:NgxSpinnerService

        ){
  
      } 
  
    ngOnInit(): void {
      this.all();
      this.user=this.locService.get(GlobalName.userName);
      this.permissions=this.user.roles[0]?.permissions;
         this.buttonsPermission = {
              show:true,
              add:true,
              edit:true,
              delete:true
            };
    }
  

    all() {
      this.permissionsChosen=[]
      this.loading2=true;
      this.spinnerService.show()
      this.profileService.getAll().subscribe((res:any)=>{
        this.data=res.data?.roles
        this.permissions=res.data?.permissions
        this.loading2=false;
        this.spinnerService.hide()
        this.selectedId=null

      },
      (error:any)=>{
        this.spinnerService.hide()

        this.loading2=false;
      })
    }
  
    getJson(arr:any){
      return JSON.parse(arr)
    }
    checked(el:any){
      this.selected_data=el
    }
  
    
    open(dialog: TemplateRef<any>,el:any) {
      this.selected_data=el
      this.dialogService.open(
        dialog,{size:"lg"});
        
    }

  
  
    store(value:any,ref:any) {
      this.toastrService.info("Profil","Ajout de Opération en cours")

      this.loading=true;
      value['id']=this.selected_data.id      
     
        this.profileService.store(value).subscribe(
            (res:any)=>{
            this.loading=false;
            this.modalService.dismissAll()
            this.all();
            this.toastrService.success("Profil","Ajout de droit")

        },
        (err:any)=>{
            this.loading=false;
            AppErrorShow.showError("Gestion des profils",err)

        })
  
  }
  copyStore(value:any,ref:any) {
      this.toastrService.info("Profil","Ajout de Opération en cours")
      value['id']=this.selected_data.id      

      this.loading=true;     
        this.profileService.copyStore(value).subscribe(
            (res:any)=>{
            this.loading=false;
            this.modalService.dismissAll()
            this.all();
            this.toastrService.success("Profil","Ajout de droit")

        },
        (err:any)=>{
            this.loading=false;
            AppErrorShow.showError("Gestion des profils",err)

        })
  
  }
  hasPermission(permission:any){
    var check= this.permissions.find((e:any)=>e.name ==permission)
    if(check) return true;
    return false
  }

  revoke(id:any,id2:any){
    this.loading=true;
    if(confirm("Voulez vous retirer ce droit ?")){
      this.toastrService.info("Profil","Ajout de Opération en cours")
         this.profileService.update({id:id2},id).subscribe(
          (res:any)=>{
          this.loading=false;
          this.all();
          this.toastrService.success("Profil","Retrait de droit")


      },
      (err:any)=>{
          this.loading=false;
          AppErrorShow.showError("Gestion des profils",err)

      })
    }
   
  }

  getActions(event:any){
    console.log(event)
    this.actions= JSON.parse(this.permissions.find((el:any)=>el.id==event)?.actions ?? "")
    console.log(this.actions)
  }

    setStatus(value:any){
  
      this.toastrService.warning("Opération en cours")
        this.loading=true
          this.profileService.setStatus(this.selected_data.id,value).subscribe((res:any)=>{
            this.toastrService.success(res.message)
            this.loading=false
            this.all()
        },
        (err:any)=>{
          this.loading=false
          console.log(err)
            AppSweetAlert.simpleAlert("error","Gestion des utilisateurs",err.error.message)
        })
    }
}
