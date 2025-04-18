import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../utils/config-service';
import { tap } from 'rxjs/internal/operators/tap';
@Injectable({
  providedIn: 'root'
})
export class RequeteService {

  constructor(private http:HttpClient) { }
 
  getGraphiqueStatEvolutionReq(plainte:any,year="all",idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/")}year/${plainte}/${year}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllGraphiqueStatStructure(plainte:any,idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("stats/nbre/all/")}${plainte}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  filterAllGraphiqueStatStructure(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("stats/nbre")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  
  getAllGraphiqueStatSTheme(plainte:any,idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/type/all/")}${plainte}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  filterAllGraphiqueStatSTheme(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("statistiques/type")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getAllRequest(idEntite:any,search:any,traiteOuiNon:any,idUser:any,structure:any,plainte:any,page:any){
    // ok &typeStructure=${type}
    if(structure == ""){
      if(search==null){
       return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?traiteOuiNon=${traiteOuiNon}&idUser=${idUser}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }else{
       return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?traiteOuiNon=${traiteOuiNon}&idUser=${idUser}&search=${search}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }
    }else{
      if(search==null){
       return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?traiteOuiNon=${traiteOuiNon}&idUser=${idUser}&structure=${structure}&plainte=${plainte}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }else{
       return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?traiteOuiNon=${traiteOuiNon}&idUser=${idUser}&structure=${structure}&plainte=${plainte}&search=${search}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }
    }

  }

  getAllRequest_stat(idEntite:any,idUser:any,structure:any,id_connUse:any){
    // ok &typeStructure=${type} plainte
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get_stat")}/${idEntite}?idUser=${idUser}&structure=${structure}&id_connUse=${id_connUse}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getStatByTheme(plainte:any,idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/get/stat/all")}/${plainte}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  filterStatByTheme(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("statistiques/get/stat")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  
  getStatByStructure(plainte:any,idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/nbre/all")}/${plainte}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  getAll_Structure(idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("structure")}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getStatAllStructure(plainte:any,idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/all-strucuture")}/${plainte}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  

  filterStatByStructure(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("statistiques/nbre")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  

  getRationReqPrestationEncours(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/requeteprestationsencours")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationReqPrestation(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/requeteprestations")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationInfosPrestationEncours(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/demandesinfosprestationsencours")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationInfosPrestation(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/demandesinfosprestations")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationPlaintePrestationEncours(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/plainteprestationsencours")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationPlaintePrestation(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/plainteprestations")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getRationReqStructureEncours(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/requeteservicesencours")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationReqStructure(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/requeteservices")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationInfosStructureEncours(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/demandesinfosservicesencours")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationInfosStructure(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/demandesinfosservices")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationPlainteStructureEncours(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/plainteservicesencours")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getRationPlainteStructure(param:any,idEntite:any){
    return this.http.post<any[]>(`${ConfigService.toApiUrl("ratio/plainteservices")}/${idEntite}`,param, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }


  

  
  getStat(idUser:any,plainte:any,idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/nbre")}/${idUser}/${plainte}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  getStatCour(idUser:any,plainte:any,idEntite:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("statistiques/nbreCour")}/${idUser}/${plainte}/${idEntite}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }

  getAllPointReponse(search=null,idUser:any,page:any,idEntite:any){
   if(search==null){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
   }else{
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&search=${search}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
   }
  }
  getAllPoint(search=null,idUser:any,page:any,idEntite:any,traiteOuiNon:any){
    if(search==null){
     return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&page=${page}&traiteOuiNon=${traiteOuiNon}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }else{

     return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&search=${search}&page=${page}&traiteOuiNon=${traiteOuiNon}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }
   }
   getAllPointStructure(search=null,idUser:any,page:any,idEntite:any,structure:any,traiteOuiNon:any){
    if(search==null){
     return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&page=${page}&traiteOuiNon=${traiteOuiNon}&structure=${structure}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }else{

     return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&search=${search}&page=${page}&traiteOuiNon=${traiteOuiNon}&structure=${structure}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }
   } 
  getAllParcours(idEntite:any,search:any,idUser:any,plainte:any,page:any,idStructure:any,statut:any,startDate:any,endDate:any,type:any){
   if(search==null){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&structure=${idStructure}&page=${page}&parc=oui&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
   }else{
      if(idStructure!=null && statut!=null){
        if(startDate==null){
          return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&structure=${idStructure}&traiteOuiNon=${statut}&page=${page}&parc=oui&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
        }else{
          return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&structure=${idStructure}&traiteOuiNon=${statut}&page=${page}&parc=oui&startDate=${startDate}&endDate=${endDate}&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
        }
      }else if(idStructure==null && statut!=null){
      if(startDate==null){
        return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&traiteOuiNon=${statut}&page=${page}&parc=oui&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }else{
        return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&traiteOuiNon=${statut}&page=${page}&parc=oui&startDate=${startDate}&endDate=${endDate}&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }
     }else if(idStructure!=null && statut==null){
      if(startDate==null){
        return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&structure=${idStructure}&page=${page}&parc=oui&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));       
      }else{
        return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&structure=${idStructure}&page=${page}&parc=oui&startDate=${startDate}&endDate=${endDate}&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));       
      }
     }else{
        if(startDate==null){
          return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&page=${page}&parc=oui&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
        }else{
          return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&page=${page}&parc=oui&startDate=${startDate}&endDate=${endDate}&type=${type}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
        }
     }
   }
  }
  getParcoursRegistre(idEntite:any,search:any,idcomm:any,page:any,statut:any,startDate:any,endDate:any,iduserCom:any){
   if(search==null){
    if(startDate==null){
      return this.http.get<any[]>(`${ConfigService.toApiUrl("registreusager/get")}/${idEntite}?communue=${idcomm}&page=${page}&statut=${statut}&iduserCom=${iduserCom}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }else{
      return this.http.get<any[]>(`${ConfigService.toApiUrl("registreusager/get")}/${idEntite}?communue=${idcomm}&page=${page}&startDate=${startDate}&endDate=${endDate}&statut=${statut}&iduserCom=${iduserCom}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }
   }else{
      if(startDate==null){
        return this.http.get<any[]>(`${ConfigService.toApiUrl("registreusager/get")}/${idEntite}?communue=${idcomm}&search=${search}&page=${page}&statut=${statut}&iduserCom=${iduserCom}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }else{
        return this.http.get<any[]>(`${ConfigService.toApiUrl("registreusager/get")}/${idEntite}?communue=${idcomm}&search=${search}&page=${page}&startDate=${startDate}&endDate=${endDate}&statut=${statut}&iduserCom=${iduserCom}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }
   }
  }
  getInfosPrint(idEntite:any,search:any,idUser:any,plainte:any,page:any,idStructure:any,statut:any,startDate:any,endDate:any){
   if(search==null){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&structure=${idStructure}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
   }else{
      if(idStructure!=null && statut!=null){
        if(startDate==null){
          return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&structure=${idStructure}&traiteOuiNon=${statut}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
        }else{
          return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&structure=${idStructure}&traiteOuiNon=${statut}&page=${page}&startDate=${startDate}&endDate=${endDate}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
        }
      }else if(idStructure==null && statut!=null){
      if(startDate==null){
        return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&traiteOuiNon=${statut}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }else{
        return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&traiteOuiNon=${statut}&page=${page}&startDate=${startDate}&endDate=${endDate}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
      }
     }else if(idStructure!=null && statut==null){
      if(startDate==null){
        return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&structure=${idStructure}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));       
      }else{
        return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&structure=${idStructure}&page=${page}&startDate=${startDate}&endDate=${endDate}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));       
      }
     }else{
        if(startDate==null){
          return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
        }else{
          return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?idUser=${idUser}&plainte=${plainte}&search=${search}&page=${page}&startDate=${startDate}&endDate=${endDate}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
        }
     }
   }
  }
  getAll(idEntite:any,search:any,plainte:any,page:any){
   if(search==null){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager")}/${idEntite}?plainte=${plainte}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
   }else{
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager")}/${idEntite}?plainte=${plainte}&search=${search}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
   }
  }
  getAllForUser(idEntite:any,search:any,byUser:any,idUser:any,page:any){
    if(search==null){
     return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?byUser=${byUser}&idUser=${idUser}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }else{
     return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/get")}/${idEntite}?byUser=${byUser}&idUser=${idUser}&search=${search}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
    }
   }
  getAllForUsager(idUsager:any,page:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/getrequetebyusager")}/${idUsager}?page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  getAllForUsagerNT(idUsager:any,page:any){
    return this.http.get<any[]>(`${ConfigService.toApiUrl("requeteusager/getrequetebyusagerNT")}/${idUsager}?page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  
  getAllAffectation(idUser:any,typeStructure:any,plainte:any,page:any){
   
    return this.http.get<any[]>(`${ConfigService.toApiUrl("affectation/get")}?idUser=${idUser}&typeStructure=${typeStructure}&plainte=${plainte}&page=${page}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true));
  }
  createAffectation(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("affectation")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  saveReponse(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/savereponse")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  archiverReque(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/archivereque")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  ModifierReque(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/modifierReque")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  noterRequete(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("noter")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  transmettreRequeteExterne(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/transmettre/externe")}`, ressource,
    ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
     tap((ressource: any) => console.log(`added ressource ${ressource}`))
   );
  }
  
  
  genPdf(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("genererpdf")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  
  transmettreReponse(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/transmettre/reponse")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
   
  
  mailrelance(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/transmettre/relance")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
   
  transfertRequet(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/transfert/entite")}/${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  transfertRequetInterne(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/transfert/structure")}/${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  relanceRequet(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("requeteusager/relance")}/${id}`,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  relanceRequetType(id:any,idStru:any,idStrRelan:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("requeteusager/relanceType")}/${id}/${idStru}/${idStrRelan}`,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }

  mailUsager(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/transmettre/reponse/rapide")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  getReponseRapide(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("requeteusager/mail/rapide/reponse")}/${id}/get`,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  
  mailStructure(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/mail/rapide/structure")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  complementReponse(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/mail/rapide/reponse/complement")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  
  
  
  get(id:any){
    return this.http.get<any>(`${ConfigService.toApiUrl("requeteusager/getprofil/")}${id}`, ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`get ressource ${ressource}`))
    );
  }
  create(ressource:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager")}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`added ressource ${ressource}`))
    );
  }
  update(ressource:any,id:any){
    return this.http.post<any>(`${ConfigService.toApiUrl("requeteusager/")}${id}`, ressource,
     ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),true)).pipe(
      tap((ressource: any) => console.log(`upadted ressource ${ressource}`))
    );
  }
  delete(id:number){
    return this.http.delete<any[]>(`${ConfigService.toApiUrl("requeteusager/")}${id}`,ConfigService.httpHeader(localStorage.getItem("mataccueilToken"),false));
  }
}
