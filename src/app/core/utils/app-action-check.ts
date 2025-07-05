// import { GlobalName } from "./global-name";
// import { LocalStorageService } from "./local-stoarge-service";

// export const AppActionCheck: any = {
    
//     hasPermission(key:any){
//         let localService=new LocalStorageService();
//         let user=localService.get(GlobalName.userName)
//         let permissions=user.roles[0]?.permissions;
//         let windows=user.windows;
//         let checkWindow=windows.find((el:any)=> el.key==key);
//         return checkWindow==null?false:true

//     },
//     check(key:any,action:any) {
//         let localService=new LocalStorageService();
//         let user=localService.get(GlobalName.userName)
//         let permissions=user.roles[0]?.permissions;
//         let windows=user.windows;
//         let checkWindow=windows.find((el:any)=> el.key==key);
//         let featureChecked=permissions.filter((el:any)=>el.feature_id=checkWindow?.id)
//         let check=featureChecked.find((el:any)=>el.action==action)
//          return check==null?false:true
//       }
// }


import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-stoarge-service';
import { GlobalName } from './global-name';

@Injectable({
  providedIn: 'root'
})
export class AppActionCheckService {
  constructor(private localStorageService: LocalStorageService) {}

  hasPermission(key: string): boolean {
    const user = this.localStorageService.get(GlobalName.userName);
    const windows = user?.windows || [];
    return !!windows.find((el: any) => el.key === key);
  }

  check(key: string, action: string): boolean {
    const user = this.localStorageService.get(GlobalName.userName);
    const windows = user?.windows || [];
    const permissions = user?.roles?.[0]?.permissions || [];
    const checkWindow = windows.find((el: any) => el.key === key);
    if (!checkWindow) return false;
    const featureChecked = permissions.filter((el: any) => el.feature_id === checkWindow.id);
    return !!featureChecked.find((el: any) => el.action === action);
  }

  // Méthode pour récupérer les actions disponibles pour une clé
  getActions(key: string): { [key: string]: boolean } {
    return {
      show: this.check(key, 'Consulter'),
      add: this.check(key, 'Ajouter'),
      edit: this.check(key, 'Editer'),
      delete: this.check(key, 'Supprimer'),
      status: this.check(key, 'Mettre un statut'),
      print: this.check(key, 'Imprimer/Télécharger'),
      transUp: this.check(key, 'Transmettre'),
      transDown: this.check(key, 'Affecter'),
      sign: this.check(key, 'Signer'),
      viewer: this.check(key, 'Visualiser Fichier'),
      return: this.check(key, 'Retouner pour correction')
    };
  }
}