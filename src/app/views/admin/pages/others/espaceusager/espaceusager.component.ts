import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../../core/_services/user.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { TranslateService } from '@ngx-translate/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { AuthentificationService } from '../../../../../core/services/authentification.service';
import { DateRdvService } from '../../../../../core/services/date-rdv.service';
import { EtapeService } from '../../../../../core/services/etape.service';
import { InstitutionService } from '../../../../../core/services/institution.service';

import { NatureRequeteService } from '../../../../../core/services/nature-requete.service';
import { RdvCreneauService } from '../../../../../core/services/rdv-creneau.service';
import { RdvService } from '../../../../../core/services/rdv.service';
import { RequeteService } from '../../../../../core/services/requete.service';
import { ServiceService } from '../../../../../core/services/service.service';
import { StructureService } from '../../../../../core/services/structure.service';
import { TypeService } from '../../../../../core/services/type.service';
import { UsagerService } from '../../../../../core/services/usager.service';
import { UserService } from '../../../../../core/services/user.service';
import { ConfigService } from '../../../../../core/utils/config-service';
import { LocalStorageService } from '../../../../../core/utils/local-stoarge-service';

@Component({
  selector: 'app-espaceusager',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './espaceusager.component.html',
  styleUrls: ['./espaceusager.component.css']
})
export class EspaceusagerComponent implements OnInit {
  @ViewChild('note') note : TemplateRef<any> | undefined
  @Input() cssClasses = '';
  errormessage = ""
  erroraffectation = ""

  searchText = ""
  closeResult = '';
  permissions: any[]=[]
  error = ""
  data: any[] = [];
  dataNT: any[] = [];
  _temp: any[] = [];
  collectionSize = 0;
  page = 1;
  pageSize = 10;

  selected = [];
  descrCarr = [];
  current_permissions: any[] = []
  selected_data: any 
  selected_data_note: any
  isSended = false
  notes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  daterdvs : any[] = []
  rdvcreneaus : any[] = []
  visible = 0
  selected_service: any
  link_to_prestation=1
  selected_type_preoccupation=0
  structures:any=[]
  entities: any[] =[]
  selectedIdEntite:any=null
  NULL:any=null
  loading=false
  entite_vis = false
  mat_aff = false
  idEntite:any
  canSentNew=false
  
  search() {
    this.data = this._temp.filter(r => {
      const term = this.searchText.toLowerCase();
      return r.objet.toLowerCase().includes(term) ||
      r.msgrequest.toLowerCase().includes(term)
    })
    this.collectionSize = this.data.length
  }

  openAddModal(content:any) {
    this.loading=false
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  openEditModal(content:any) {
    this.loading=false
    if (this.selected_data != null) {
      this.prepare(this.selectedEntie)
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error')
    }
  }
  openEditModal2(content:any) {
    this.loading=false
    if (this.selected_data2 != null) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {

      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error')
    }
  }
  openNoteModal(content:any, el:any) {
    this.selected_data_note = el
    this.loading=false
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
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

  user: any

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,

    private rdvService: RdvService,
    private etapeService: EtapeService,
    private requeteService: RequeteService,
    private localService: LocalStorageService,
    private prestationService: ServiceService,
    private structureService: StructureService,
    private natureService: NatureRequeteService,
    private thematiqueService: TypeService,
    private usagersService: UsagerService,
    private rdvCreneauService: RdvCreneauService,
    private daterdvService: DateRdvService,
    private spinner: NgxSpinnerService,
    private authService: AuthentificationService,
    private activatedRoute: ActivatedRoute,
    private institutionService:InstitutionService
  ) { }

  ChangerFile(file:any){
    // window.location.href="http://api.mataccueil.sevmtfp.test/api/downloadFile?file="+file
    window.location.href="https://api.mataccueil.gouv.bj/api/downloadFile?file="+file
    // window.location.href="http://localhost:8003/api/downloadFile?file="+file
  }
  etapes:any[] = []
  services:any[] = []
  g_services:any[]  = []
  __services:any[]  = []
  departements:any [] = []
  structureservices:any[]  = []
  themes:any [] = []
  natures:any[]  = []
  institutions:any [] = []
  rdvs:any[] = []
  detailpiece:any[] =[]

  isGeneralDirector = false
  typeRequete = "Préoccupation"

  checkType() {
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == "plaintes") {
      return { id: 1, name: "Plaintes" }
    }
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == "requetes") {
      return { id: 0, name: "Requetes" }
    }
    if (this.activatedRoute.snapshot.paramMap.get('type_req') == "infos") {
      return { id: 2, name: "Demandes d'informations" }
    }

    return
  }

  setVisible() {
    this.visible = 1
  }
  selected_data2:any=null

  show_actions2=true;
  checked2(event:any, el:any){
    this.selected_data2 = el
    this.selected_data2.full_name=this.selected_data2.nom+" "+this.selected_data2.prenoms
    
    if(el.archiver == 1){
      this.canSentNew=true
    }else{
      let check=this.data.filter((el:any)=> el.traiteOuiNon==1 && el.noteUsager==null)
      console.log(check.length)
      if(check.length==0){
        this.canSentNew = true;
      }else{
        this.canSentNew = false
        AppSweetAlert.confirmBox("Important", " Nous vous prions de nous laisser votre appréciation sur votre dernière préoccupation satisfait ").then((res:any)=>
        {
          if(res.isConfirmed){
              this.openNoteModal(this.note, el)
          }
        })
      }
      this.canSentNew = check.length==0?true:false;
    }
    if(el.statut==0 && this.canSentNew){
      this.show_actions2=true
    }else{
      this.show_actions2=false
    }
  }

  show_actions=true;
  checked(event:any, el:any) {
    this.selected_data = el
    this.mat_aff = false
    console.log(this.selected_data)

    if(el.archiver == 1){
      this.canSentNew=true
    }else{
      let check=this.data.find((el:any)=> el.traiteOuiNon==1 && el.noteUsager==null)
      console.log(check.length)
      if(check==undefined || check==null){
        this.canSentNew = true;
      }else{
        this.canSentNew = false
        AppSweetAlert.confirmBox("Important", " Nous vous prions de nous laisser votre appréciation sur la prise en charge de votre dernière préoccupation.").then((res:any)=>
        {
          if(res.isConfirmed){
              this.openNoteModal(this.note, check)
          }
        })
      }
      this.canSentNew = check.length==0?true:false;
    }

    if ( this.canSentNew) {
      if(el.visible==0){
        this.show_actions=true
        if(this.selected_data.service.type.libelle== "Formation" || this.selected_data.service.type.libelle == "Carrière"){
          this.mat_aff = true
        }
      }else{
        this.show_actions=false
      }
    }
  
    this.selectedEntie=el.idEntite
    
    this.thematiqueService.getAll(this.selected_data.idEntite).subscribe((res: any) => {
      this.themes = res
    })

    this.thematiqueService.get(this.selected_data).subscribe((res:any)=>{
      this.descrCarr = res.descr
    })
    this.prestationService.getAllType(this.selected_data.service.idType).subscribe((res:any)=>{
      this.services=res
    })

  }

  show_step(id:any) {
    return this.etapes.find((e:any) => (e.id == id))
  }

  url="https://demarchesmtfp.gouv.bj?client_id=26d9d6be-d676-465f-b92c-369b72442c7f&client_secret=f5034b6c80a13d411fa03a8d1f14"
  


  logout() {
    localStorage.removeItem('guvUserToken')
    localStorage.removeItem('guvUserData')
    localStorage.removeItem('mataccueilUserData')
    window.location.href =this.url;
  }

  selectedEntie:any=null

  ngOnInit(): void {
    
    console.log(localStorage.getItem('mataccueilUserData'))
    
    if (localStorage.getItem('mataccueilUserData') != null) {
      this.user = this.localService.get('mataccueilUserData')
      this.user.full_name=this.user.nom+" "+this.user.prenoms
      this.selectedEntie=this.user.institu_id
      //Controle ajouter pour les premiers users qui n'ont pas renseigné leur identite
      if(this.selectedEntie == null || this.selectedEntie == "null"){
        this.selectedEntie = 1 //MTFP par défaut 
      }
      if(this.selectedEntie != null && this.selectedEntie != "" ){
        this.prepare(this.selectedEntie)
      }
      this.institutions=[]
      this.institutionService.getAll().subscribe((res: any) => {
       this.institutions = res
       this.init()
       })
    } 
    
  }
  
  loadRequest() {
    this._temp = []
    this.data = []
    this.dataNT = []
    
    this.requeteService.getAllForUsagerNT(
      this.user.id
      , 1).subscribe((res: any) => {
        this.dataNT = res
      })
    this.requeteService.getAllForUsager(
      this.user.id
      , 1).subscribe((res: any) => {
        this.spinner.hide();
        this.data = res
        this._temp = this.data
        this.collectionSize = this.data.length
      })
      
      this.ChechEtape();
  }
  loadRdv() {
    this.rdvs = []
    this.rdvService.getAllForUsager(this.user.id).subscribe((res: any) => {
      this.rdvs = res
    })
  }
  init() {
    this.loadRequest()
    this.departements = []
    this.usagersService.getAllDepartement().subscribe((res: any) => {
      this.departements = res
    })
    this.prepare(this.user.institu_id)
    this.loadRdv()
  }

  onEntiteChange(event:any){
    console.log(event.target.value)
    this.selectedEntie=+event.target.value
    this.prepare(this.selectedEntie)

  }

  ChechEtape(){
    this.etapes = []
    this.etapeService.getAll(0).subscribe((res: any) => {
      this.etapes = res
    })
  }
  prepare(idEntite:any){
    //COntrole ajouter pour les premiers users qui n'ont pas renseigné leur identite
    if(idEntite == null || idEntite == "null"){
      idEntite = 1 //MTFP par défaut 
    }
    this.g_services = []
    this.prestationService.getAll(idEntite).subscribe((res: any) => {
      this.g_services = res
    })
    
      // alert();
      // this.themes=[]
      // this.thematiqueService.getAll().subscribe((res:any)=>{
      //   this.themes=res
      // })
  
    this.structures = []
    this.structureService.getAll(1,idEntite).subscribe((res:any)=>{
      this.structures = res
    })
    this.themes = []
    this.thematiqueService.getAll(idEntite).subscribe((res: any) => {
      this.themes = res
    })
    this.daterdvs = []
    this.daterdvService.getAllActif(idEntite).subscribe((res: any) => {
      this.daterdvs = res
    })

    this.rdvcreneaus = []
    this.rdvCreneauService.getAll(idEntite).subscribe((res: any) => {
      this.rdvcreneaus = res
    })
  }

  addRequeteusager(value: any) {
    
    let service = null
    if (this.link_to_prestation==1 || this.selected_type_preoccupation==0) {
      service = this.services.filter((e:any) => (e.id == value.idPrestation))[0]
    }else{
      service=this.g_services.filter((e:any) => (e.hide_for_public == 1))[0]
    }
    if(service == null){
      AppSweetAlert.simpleAlert("Erreur","Aucune prestation (Service Usager) par défaut n'est lié à cet entité", 'error')
      return;
    }
      var param = {
        objet: value.objet,
        idPrestation: this.link_to_prestation==0  ? service.id : value.idPrestation,
        nbreJours: service == null ? 0 : service.nbreJours,
        msgrequest: value.msgrequest,
        email: this.user.email,
        idEntite:this.selectedEntie,
        nom: this.user.nom,
        tel: this.user.tel,
        link_to_prestation:this.link_to_prestation,
        idDepartement: this.user.idDepartement,
        interfaceRequete: this.link_to_prestation==1 ? "USAGER"  : "SRU" ,
        idUser: this.user.id,
        plainte: value.plainte,
        matricule: this.mat_aff == true ? value.matricule : '',
        visible: this.visible
      };
      // fichierJoint
      
      if(param.idEntite == null || param.idEntite == ""){
        AppSweetAlert.simpleAlert("Erreur","Veuillez choisir une structure destrinatrice.", 'error')
      }else if(param.plainte == null || param.plainte == "0"){
        AppSweetAlert.simpleAlert("Erreur","Veuillez choisir un type de préoccupation.", 'error')
      }else if(this.mat_aff == true && param.matricule.trim() == ''){
        AppSweetAlert.simpleAlert("Renseigner le matricule", "Champ obligatoire", 'error')
      }else if(param.idPrestation == null || param.idPrestation == ""){
        AppSweetAlert.simpleAlert("Erreur","Veuillez choisir une prestation.", 'error')
      }else if(!param.objet){
        AppSweetAlert.simpleAlert("Renseigner l'objet", "Champ obligatoire", 'error')
      }else if(!param.msgrequest){
        AppSweetAlert.simpleAlert("Renseigner le message", "Champ obligatoire", 'error')
      }else{
        this.loading=true
        this.requeteService.create(param).subscribe((rest: any) => {
          this.init()
          this.visible=0
          this.modalService.dismissAll()
          this.loading=false
          if(rest.status=="error"){
            AppSweetAlert.simpleAlert("Erreur",rest.message, 'error')
          }else{
            if(param.visible==0){
              AppSweetAlert.simpleAlert("Ajout requête", "Requête ajoutée avec succès", 'success')
            }else{
              AppSweetAlert.simpleAlert("Ajout requête", "Requete ajouté et transmis avec succès", 'success')
            }
          }
        })
      }
  }

  openDetailModal(event:any,content:any){

    this.detailpiece=[]
    this.prestationService.getServPiece(event.target.value).subscribe((res:any)=>{
      this.detailpiece=res
    })
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  saveRequeteusager(value:any) {
    let service = null
    if ( this.selected_data.link_to_prestation==1) {
      service = this.services.filter((e:any) => (e.id == value.idPrestation))[0]
    }else{
      service=this.services.filter((e:any) => (e.hide_for_public == 1))[0]
    }
      var param = {
        id: this.selected_data.id,
        objet: this.selected_data.objet,
        link_to_prestation: this.selected_data.link_to_prestation,
        idPrestation: this.selected_data.link_to_prestation==0 ? service.id : value.idPrestation,
        nbreJours: service == null ? 0 : service.nbreJours,
        msgrequest: this.selected_data.msgrequest,
        email: value.email,
        idEntite:this.selectedEntie,
        nom: this.selected_data.nom,
        tel: this.selected_data.tel,
        idDepartement: this.selected_data.usager.idDepartement,
        interfaceRequete:  "USAGER" ,
        natureRequete: value.natureRequete,
        idUser: this.selected_data.usager.id,
        matricule: this.mat_aff == true ? value.matricul : '',
        plainte: value.plainte
      };
      // 
      if(param.idEntite == null || param.idEntite == ""){
        AppSweetAlert.simpleAlert("Erreur","Veuillez choisir une structure destrinatrice.", 'error')
      }else if(param.plainte == null || param.plainte == "0"){
        AppSweetAlert.simpleAlert("Erreur","Veuillez choisir un type de préoccupation.", 'error')
      }else if(this.mat_aff == true && param.matricule.trim() == ''){
        AppSweetAlert.simpleAlert("Renseigner le matricule", "Champ obligatoire", 'error')
      }else if(param.idPrestation == null || param.idPrestation == ""){
        AppSweetAlert.simpleAlert("Erreur","Veuillez choisir une prestation.", 'error')
      }else if(!param.objet){
        AppSweetAlert.simpleAlert("Renseigner l'objet", "Champ obligatoire", 'error')
      }else if(!param.msgrequest){
        AppSweetAlert.simpleAlert("Renseigner le message", "Champ obligatoire", 'error')
      }else{
        this.loading=true
        this.requeteService.update(param, this.selected_data.id).subscribe((rest: any) => {
          this.init()
          this.visible = 0
          this.modalService.dismissAll()
          this.loading=false
          if(rest.status=="error"){
            AppSweetAlert.simpleAlert("Erreur",rest.message, 'error')
          }else{
            AppSweetAlert.simpleAlert("Modification requete", "Requête modifiée avec succès", 'success')
          }
        })
      }
  }
  chargerPrestation(event:any) {
    // this.services=[]
    // this.__services.forEach((item:any) => {
    //   if (item.idType == event.target.value)
    //     this.services.push(item);
    // });
    this.services=[]
    this.prestationService.getAllType(event.target.value).subscribe((res:any)=>{
      this.services=res
    })
      
    this.thematiqueService.get(event.target.value).subscribe((res:any)=>{
      this.descrCarr = res.descr
      if(res.libelle== "Formation" || res.libelle == "Carrière"){
        this.mat_aff = true
      }else{
        this.mat_aff = false
      }
    })
  }
  genererPDF() {
    var param = {
      id: this.selected_data.id,
    };
    this.requeteService.genPdf(param).subscribe((res: any) => {
      console.log('pdf generated')
    })

  }
  dropRequeteusager() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if (this.selected_data.visible == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Vous ne pouvez plus supprimer cette requête. Elle est déjà en cours de traitement.", 'error');
      return;
    }
    AppSweetAlert.confirmBox("Suppression requete",
      "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
        if (result.value) {
          this.requeteService.delete(this.selected_data.id).subscribe((res: any) => {
            this.init()
            AppSweetAlert.simpleAlert("Suppression requete", "Suppression effectuée avec succès", 'success')
          }, (err) => {
            AppSweetAlert.simpleAlert("Suppression requete", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
          })
        }
      })
  }
  editRDV(value:any) {
    value.statut=this.selected_data2.statut
    value.id=this.selected_data2.id
    this.loading=true
    this.rdvService.update(value,this.selected_data2.id).subscribe((res:any)=>{
      this.modalService.dismissAll()
      this.init()
      this.loading=false
      if(res.status=="error"){
        AppSweetAlert.simpleAlert("Erreur",res.message, 'error')
      }else{
        AppSweetAlert.simpleAlert("Nouvelle modification",  "Motification effectué avec succès", 'success')
      }
    }, (err:any)=>{
      AppSweetAlert.simpleAlert("Nouvelle modification", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
    })
	}

  sendRDV() {
    if (this.selected_data2 == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if (this.selected_data2.statut != 0) {
      AppSweetAlert.simpleAlert("Erreur", "Votre de demande est déjà en cours de traitement.", 'error');
      return;
    }
    AppSweetAlert.confirmBox("Transmettre rdv",
      "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
        if (result.value) {
          var param = {
            listerdv: [ this.selected_data2.id],
            statut: 1,  // 1: transmis à la structure
            idEntite:this.selected_data2.idEntite,
           }
           
          this.rdvService.saveRdvStatut(param).subscribe((res: any) => {
            this.init()
            AppSweetAlert.simpleAlert("Transmettre rdv", "Suppression effectuée avec succès", 'success')
          }, (err) => {
            AppSweetAlert.simpleAlert("Transmettre rdv", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
          })
        }
      })
  }
  
  dropRDV() {
    if (this.selected_data2 == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if (this.selected_data2.statut != 0) {
      AppSweetAlert.simpleAlert("Erreur", "Vous ne pouvez plus supprimer cet element. Elle est déjà en cours de traitement.", 'error');
      return;
    }
    AppSweetAlert.confirmBox("Suppression rdv",
      "Cette action est irreversible. Voulez-vous continuer ?").then((result:any) => {
        if (result.value) {
          this.rdvService.delete(this.selected_data2.id).subscribe((res: any) => {
            this.init()
            AppSweetAlert.simpleAlert("Suppression rdv", "Suppression effectuée avec succès", 'success')
          }, (err) => {
            AppSweetAlert.simpleAlert("Suppression rdv", "Erreur, Verifiez que vous avez une bonne connexion internet", 'error')
          })
        }
      })
  }
  displayResource() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if (this.selected_data.fichier_joint.length == 0) {
      AppSweetAlert.simpleAlert("Erreur", "Aucun fichier attaché.", 'error');
      return;
    }
    var filePath = ConfigService.toFile(this.selected_data.fichier_joint);
    window.open(filePath);
  }

  saveUsager(value:any) {
    var param = {
      id: this.user.id,
      email: value.email,
      nom: value.nom,
      prenoms: value.prenoms,
      password:"", //value.password
      confirm: "",//value.confirm
      tel: value.tel,
      idEntite:this.selectedEntie,
      idDepartement: value.idDepartement,
      interfaceRequete: "USAGER",
      visible: this.visible
    };
    this.usagersService.update(param, this.user.id).subscribe((res: any) => {
      this.modalService.dismissAll()
      this.visible = 0
      this.init()
      AppSweetAlert.simpleAlert("Mise à jour", "Profile mis à jour avec succès", 'succes');
    })
    
    /*if (value.password != value.confirm) {
      AppSweetAlert.simpleAlert("Erreur", "Mot de passe non identique", 'error');
    } else {
     
    }*/

  }
  noterRequete(value:any) {
    var param = {
      codeRequete: this.selected_data_note.codeRequete,
      noteDelai: value.noteDelai,
      noteResultat: value.noteResultat,
      idEntite:this.selectedEntie,
      commentaireNotation: value.commentaireNotation,
    };
    this.loading=true
    this.requeteService.noterRequete(param).subscribe((res: any) => {
      this.modalService.dismissAll()
      this.loadRequest()
      this.loading=false
      if(res.status=="error"){
        AppSweetAlert.simpleAlert("Erreur",res.message, 'error')
      }else{
        AppSweetAlert.simpleAlert("Appreciation", "Appreciation envoyé avec succès", 'succes');
      }
    })
  }

  transmettreRequete() {
    if (this.selected_data == null) {
      AppSweetAlert.simpleAlert("Erreur", "Veuillez selectionnez un élément puis réessayer", 'error');
      return;
    }
    if (this.selected_data.visible == 1) {
      AppSweetAlert.simpleAlert("Erreur", "Vous avez déjà transmis cette requête.", 'error');
      return;
    }
    var msgConfirm = "Voulez-vous transmettre la requête ?";
    var confirmResult = confirm(msgConfirm);
    if (confirmResult === false) return;

    var param = {
      idRequete: this.selected_data.id,
      idEntite:this.selectedEntie,
      fichier_requete: this.selected_data.request_file_data,
    };

    this.requeteService.transmettreRequeteExterne(param).subscribe((res: any) => {
      this.modalService.dismissAll()
      this.loadRequest()
      AppSweetAlert.simpleAlert("Transmission requete", "Requete transmise avec succès", 'succes');
    })
  }

  setStatut() {
    this.statut = 1
  }
  show_structures=false
  statut=0
  saveRdv(value:any) {
    var param = {
      idUsager: this.user.id,
      objet: this.selected_el_obj,
      idRdvCreneau: value.idRdvCreneau,
      codeRequete: value.codeRequete,
      dateRdv: value.dateRdv,
      idEntite:this.selectedEntie,
      idStructure:value.idStructure,
      statut: this.statut,
      attente: value.attente,
    }
    if(param.idStructure==undefined){
      delete param.idStructure
    }
    this.show_structures=false
    this.loading=true
    this.rdvService.create(param).subscribe((res: any) => {
      this.modalService.dismissAll()
      this.loadRdv()
      this.statut=0
      this.loading=false
      if(res.status=="error"){
        AppSweetAlert.simpleAlert("Erreur",res.message, 'error')
      }else{
        if(param.statut==0){
          AppSweetAlert.simpleAlert("Prise de rdv", "RDV enregistré avec succès", 'succes');
        }else{
          AppSweetAlert.simpleAlert("Prise de rdv", "RDV enregistré et transmis avec succès", 'succes');
        }
      }
     
    })
  }
  selected_el_obj = ""

  selectRequest(event:any) {
    if(event.target.value!="0"){
      this.show_structures=false
      this.selected_el_obj = this.data.find((e:any) => (e.codeRequete == event.target.value)).objet
    }else{
      this.show_structures=true
      this.selected_el_obj = ""
    }
  }

}
