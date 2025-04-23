import { ModelInterface } from "../Interfaces/model-interface";

export class ZoneModel  implements ModelInterface{

    id:number | undefined;
    name:string | undefined;
    isActive:string | undefined;


    constructor(attrs: any = null) {
        if (attrs) {
          this.build(attrs);
        }
      }


    build(attrs: any): void {
        this.id=attrs.id;
        this.name=attrs.name;
        this.isActive=attrs.isActive;
    }
    toJson(): Object {

        return {
            "id":this.id,
            "name":this.name,
            "isActive":this.isActive,
        }
    }
}
