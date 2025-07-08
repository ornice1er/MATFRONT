import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { RoleService } from '../../../../core/services/role.service';
import { AppErrorShow } from '../../../../core/utils/app-error-show';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  standalone:true,
  imports:[CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,RouterModule],
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @ViewChild('contentAdd') contentAdd:ElementRef | undefined;
  @ViewChild('contentEdit') contentEdit:ElementRef | undefined;
  @ViewChild('contentShow') contentShow:ElementRef | undefined;
  menu:any[]=[]
selectedId: number | null = null;
  is_active=null
  buttonsPermission :any|undefined;


  actionTemplate:any
  selected_data:any
  loading:any=false
  tag="admin-roles"
  title = 'frontend';
  search_text=""
  data:any[]=[]
  pg={
    pageSize:10,
    p:0,
    total:0
  }

  constructor(
    private cdRef:ChangeDetectorRef,
    private roleService:RoleService,
    private router:Router,
    private toastrService:ToastrService,
    private modalService:NgbModal,
    private offcanvasService: NgbOffcanvas,
    ){
    
  }

  ngOnInit(): void {
   this.init()
     this.buttonsPermission = {
      show:false,
      add:true,
      edit:true,
      delete:true
    };
  }

  ngAfterViewInit(): void {
    this.actionTemplate={
      add:{
        type:0,
        path:this.contentAdd
      },
      edit:{
        type:0,
        path:this.contentEdit
      },
      show:{
        type:0,
        path:this.contentShow
      }
    }

    this.cdRef.detectChanges();
  }
  init(){
    this.getAll()
  }

  getAll(){
    this.roleService.getAll().subscribe((res:any)=>{
      this.data=res.data
      this.modalService.dismissAll()
      this.selectedId=null
    },
    (err:any)=>{
AppErrorShow.showError("Gestion des rôles",err)
    })
  }

  
  add(content:any){
    this.modalService.open(content,{size:'lg'});
  }
  
  openMenu(content:any){
    if(!this.verifyIfElementChecked()) return ;
    if(this.selected_data.windows){

      this.menu=this.selected_data.windows
      this.offcanvasService.open(content,{ position: 'end'  });
    }
  }
  
  
  edit(content:any){
    if(!this.verifyIfElementChecked()) return ;
    this.modalService.open(content,{size:'lg'});
  }

  verifyIfElementChecked(){
    console.log(this.selected_data)
    if (this.selected_data==null) {
      this.toastrService.warning("Aucun élément selectionné");
      return false;
    }
    return true;
  }


  checked(el:any){
    this.selected_data=el;

  }

  create(value:any){
    console.log(value);
    this.loading=true
    if(value.canOverwrite=="")value.canOverwrite=false
    value.guard_name="api"
    this.roleService.store(value).subscribe((res:any)=>{
      this.toastrService.success(res.message)
      this.getAll()
      this.loading=false

  },
  (err:any)=>{
    this.loading=false
    AppErrorShow.showError("Gestion des rôles",err)
    
  })
  }

    show(content:any){
    if(!this.verifyIfElementChecked()) return ;
    this.modalService.open(content,{size:'lg'});
  }
  copy(value:any){
    this.loading=true
    value['old_id']=this.selected_data.id
    this.roleService.copy(value).subscribe((res:any)=>{
      this.toastrService.success(res.message)
      this.getAll()
      this.loading=false

  },
  (err:any)=>{
    this.loading=false
    AppErrorShow.showError("Gestion des rôles",err)
    
  })
  }

  update(value:any){
    console.log(value);
    this.loading=true
    if(value.canOverwrite=="")value.canOverwrite=false
    value.guard_name="api"

    this.roleService.update(this.selected_data.id,value).subscribe((res:any)=>{
      this.toastrService.success(res.message)
      this.getAll()
      this.loading=false

  },
  (err:any)=>{
    this.loading=false
    AppErrorShow.showError("Gestion des rôles",err)

  })
  }

  delete(){
    let confirmed=AppSweetAlert.confirmBox('info','Suppression','Voulez vous vraiment retirer cet élément?',);
    confirmed.then((result:any)=>{
       if (result.isConfirmed) {
        this.roleService.delete(this.selected_data.id).subscribe((res:any)=>{
          this.toastrService.success(res.message)
          this.getAll()
      },
      (err:any)=>{
        AppErrorShow.showError("Gestion des rôles",err)
      })
              }
            })

}
  setStatus(value:any){

    this.toastrService.warning("Opération en cours")
      this.loading=true
        this.roleService.setStatus(this.selected_data.id,value).subscribe((res:any)=>{
          this.toastrService.success(res.message)
          this.loading=false
          this.getAll()
      },
      (err:any)=>{
        this.loading=false
        console.log(err)
          AppSweetAlert.simpleAlert("error","Gestion des utilisateurs",err.error.message)
      })
  }

getPage(event:any){
  this.pg.p=event
}

goToWindows(){
  this.router.navigate(['/admin/profiles/'+this.selected_data.id])
}
}
