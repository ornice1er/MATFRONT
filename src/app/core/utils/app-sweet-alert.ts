import Swal from 'sweetalert2';


export const AppSweetAlert:any={
    simpleAlert(icon?:any,title?:any,message?:any,footer?:any){  
        Swal.fire({  
            icon: icon,  
            title: title,  
            text: message,  
            footer: footer  
          })  
      },  
        
      simpleAlertWithHtml(icon?:any,title?:any,message?:any,footer?:any){  
        Swal.fire({  
            icon: icon,  
            title: title,  
            html: message,  
            footer: footer  
          })  
      },  
    
      positionned(icon?:any,title?:any,timer=1500,position?:any)  
      {  
        Swal.fire({  
          position: position,  
          icon: icon,  
          title: title,  
          showConfirmButton: false,  
          timer: 1500  
        })  
      } ,

      confirmBox(icon?:any,title?:any,message?:any){  
        return Swal.fire({  
          title: title,  
          text: message,  
          icon: icon,  
          showCancelButton: true,  
          confirmButtonText: 'Oui, continuer',  
          cancelButtonText: 'Annuler'  
        })
        // .then((result) => {  
        //   if (result.value) {  
        //     Swal.fire(  
        //       'Deleted!',  
        //       'Your imaginary file has been deleted.',  
        //       'success'  
        //     )  
        //   } else if (result.dismiss === Swal.DismissReason.cancel) {  
        //     Swal.fire(  
        //       'Cancelled',  
        //       'Your imaginary file is safe :)',  
        //       'error'  
        //     )  
        //   }  
        // })  
      }  
}