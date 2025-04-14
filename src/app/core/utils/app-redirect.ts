import { GlobalName } from "./global-name";
import { LocalStorageService } from "./local-stoarge-service";

export const AppRedirect: any = {

    

    redirectLogin(localService: LocalStorageService) {
        let user=localService.get(GlobalName.userName)
       // let spaces=localService.get(GlobalName.features).spaces
        let url="/admin/dashboard"
        console.log(user)

        // switch(user.space){
        //     case spaces[2]:
        //         url='/students-panel/accueil';
        //     break;
        //     case spaces[3]:
        //         url= '/parents-panel/accueil';
        //     break;
        
        //     default:
        //         url= '/404';
        //       break;
        //   }

          return url;
      }
}