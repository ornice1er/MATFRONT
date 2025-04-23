import { AppSweetAlert } from "./app-sweet-alert";


export const AppErrorShow:any={

    showError(title:any,err:any){
        let errors="";
        console.log(err.error)
        if (err.error.errorsList != undefined) {
             errors=`<h4><b>${err.error.message}</b></><ul>`
            for (const key in err.error.errorsList) {
            if (Object.prototype.hasOwnProperty.call(err.error.errorsList, key)) {
                const element = err.error.errorsList[key];
                element.forEach((el:any) => {
                errors+=`<li> ${el}</li> `
                });
            }
            }
            errors+=`</ul>`
            AppSweetAlert.simpleAlertWithHtml("error",title,errors)

        } else {
            errors=err.error.message
            AppSweetAlert.simpleAlert("error",title,errors)

        }

    }
}