import { Component, OnInit, Input } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../core/_services/user.service';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { ActeurService } from '../../../../core/services/acteur.service';

import { ProfilService } from '../../../../core/services/profil.service';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/utils/local-stoarge-service';
import { GlobalName } from '../../../../core/utils/global-name';
import { ObserverService } from '../../../../core/utils/observer.service';
import { InstitutionService } from '../../../../core/services/institution.service';
import { RoleService } from '../../../../core/services/role.service';
import { AppErrorShow } from '../../../../core/utils/app-error-show';


@Component({
  selector: 'app-users',
  standalone: true,
            imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule,NgxSpinnerModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @Input() cssClasses = '';
  page = 1;
  pageSize = 10;
  searchText=""
  closeResult = '';
   permissions:any[]=[]=[]
  error=""
  data: any[]=[];
  _temp: any[]=[];

  selected = [
  ];
  current_permissions:any[]=[]
  collectionSize = 0;
  selected_data:any
  loading:any=false
  is_active=null
  pg:any={
    pageSize:10,
    p:1,
    total:0
  }
isPaginate:any=false
search_text:any=""

  search(){ 
    this.data=this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.email.toLowerCase().includes(term) ||
      (r.agent_user==null ? '' : r.agent_user.nomprenoms).toLowerCase().includes(term) 
    })
    this.collectionSize=this.data.length
  }
  
  openAddModal(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditModal(content:any){
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert('error',"Erreur", "Veuillez selectionnez un élément puis réessayer");
      return;
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router:Router,
    private profilService:ProfilService,
    private acteursService:ActeurService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorageService : LocalStorageService,
    private observerService:ObserverService,
    private institutionService:InstitutionService,
    private roleService: RoleService
    ) {}

    acteurs:any[]=[]
    profils:any[]=[]
    institutions:any[]=[]
    role:any[]=[]

  user:any
  ngOnInit() {
    this.observerService.setTitle('PARAMETRES - UTILISATEURS')

    if (this.localStorageService.get(GlobalName.userName) != null) {
      this.user = this.localStorageService.get(GlobalName.userName)

    }
    this.init()
  }
  checked(event:any, el:any) {
    this.selected_data = el
    this.is_active=el.is_active
  }
  
  init(){
    this.data=[]
          this.spinner.show();

    this.userService.getAll(this.user?.idEntite).subscribe((res:any)=>{
      this.spinner.hide();
      this.data=res.data
      this.pg.total=res.data.length

    })
    this.profils=[]
    this.profilService.getAll().subscribe((res:any)=>{
      this.profils=res.data
      console.log('profils',this.profils)
    })
    this.acteurs=[]
    this.acteursService.getAll(this.user?.idEntite).subscribe((res:any)=>{
      this.acteurs=res.data
      console.log('acteurs',this.acteurs)
    })
      this.institutions=[]
    this.institutionService.getAll().subscribe((res:any)=>{
      this.institutions=res.data
      console.log('institution',this.institutions)
    })
       this.role=[]
    this.roleService.getAll().subscribe((res:any)=>{
      this.role=res.data
      console.log('role',this.role)
    })
  }
  
  create(value:any){
    value.idEntite=this.user.idEntite
    if(value.password==value.conf_password){
      this.loading=true
      this.userService.create(value).subscribe((res:any)=>{
      this.loading=false
        this.modalService.dismissAll()
        //this.translate.instant('HOME.TITLE')
        AppSweetAlert.simpleAlert('success',"Nouvel ajout","Ajout effectué avec succès")
         this.init() 
       },(err:any)=>{
        this.loading=false
         
         if(err.error.detail!=null){    
           AppSweetAlert.simpleAlert('error',"Nouvel ajout", err.error.detail)
         }else{
           AppSweetAlert.simpleAlert('error',"Nouvel ajout", "Erreur, Verifiez que vous avez une bonne connexion internet")
         }
       })
    }else{
      this.error="Les deux mot de passe doivent être identique"
    }
    
  }


  archive(){

      let confirmed=AppSweetAlert.confirmBox('info','Suppression','Voulez vous vraiment retirer cet élément?',);
        confirmed.then((result:any)=>{
           if (result.isConfirmed) {
            this.userService.delete(this.selected_data.id).subscribe((res:any)=>{
              this.init()
          },
          (err:any)=>{
            AppErrorShow.showError("Gestion des utilisateurs",err)
    
          })
                  }
                })
  }

  
  edit(value:any) {
    value.id=this.selected_data.id
    this.loading=true
    this.userService.update(value,this.selected_data.id).subscribe((res:any)=>{
      this.loading=false
      this.modalService.dismissAll()
      this.init()
      AppSweetAlert.simpleAlert('success',"Nouvelle modification",  "Motification effectué avec succès")
    }, (err:any)=>{
      this.loading=false
      AppSweetAlert.simpleAlert('error',"Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet")
    })
	}

  setStatus(value:any){
  
        this.userService.setState(this.selected_data.id,value).subscribe((res:any)=>{
          AppSweetAlert.simpleAlert('success',"Nouvelle modification", res.message)

          this.init()
      },
      (err:any)=>{
        console.log(err)
        AppSweetAlert.simpleAlert("error","Utilisateur",err.error.message)
      })
  }

  getPage(event:any){
    this.pg.p=event
  }

}
