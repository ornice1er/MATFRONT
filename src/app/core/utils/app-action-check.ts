import { GlobalName } from "./global-name";
import { LocalStorageService } from "./local-stoarge-service";

export const AppActionCheck: any = {
    
    hasPermission(key:any){
        let localService=new LocalStorageService();
        let user=localService.get(GlobalName.userName)
        let permissions=user.roles[0]?.permissions;
        let windows=user.windows;
        let checkWindow=windows.find((el:any)=> el.key==key);
        return checkWindow==null?false:true

    },
    check(key:any,action:any) {
        let localService=new LocalStorageService();
        let user=localService.get(GlobalName.userName)
        let permissions=user.roles[0]?.permissions;
        let windows=user.windows;
        let checkWindow=windows.find((el:any)=> el.key==key);
        let featureChecked=permissions.filter((el:any)=>el.feature_id=checkWindow?.id)
        let check=featureChecked.find((el:any)=>el.action==action)
         return check==null?false:true
      }
}




