

import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-stoarge-service';
import { GlobalName } from './global-name';

@Injectable({
  providedIn: 'root'
})
export class AppActionCheckService {
  constructor(private localStorageService: LocalStorageService) {}

  check(key: string, action: string): boolean {
    // console.log(`AppActionCheckService.check called with key: ${key}, action: ${action}`);
    const user = this.localStorageService.get(GlobalName.userName);
    // console.log('User:', user);
    // console.log('Windows:', windows);
    const permissions = user?.roles?.[0]?.permissions || [];
   
  return  permissions.find((el:any)=> el.name == `${action} ${key}`)=== undefined ? false : true;
  }

  hasPermission(key: string): boolean {
    const user = this.localStorageService.get(GlobalName.userName);
    const windows = user?.windows || [];
    // console.log(`hasPermission called with key: ${key}, windows:`, windows);
    return !!windows.find((el: any) => el.key === key);
  }

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