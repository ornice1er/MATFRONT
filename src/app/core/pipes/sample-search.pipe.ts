import { Component, Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'sampleSearch',
  standalone:true
})
export class SampleSearchPipe implements PipeTransform {

  transform(value: any, searchText:String,type:String): any {
    
    return (searchText != '') ? value.filter((item:any) => {  
      switch(type){
        case 'personals':
         return this.getPersonalSearch(item,searchText)
        break;
        case 'features':
         return this.getRoomSearch(item,searchText)
        break;
        case 'rooms':
         return this.getRoomSearch(item,searchText)
        break;
        case 'periods':
         return this.getPeriodSearch(item,searchText)
        break;
        case 'users':
         return this.getUserSearch(item,searchText)
        break;
        case 'cycles':
         return this.getCycleSearch(item,searchText)
        break;
        case 'levels':
         return this.getLevelSearch(item,searchText)
        break;
        case 'classrooms':
         return this.getClassroomSearch(item,searchText)
        break;
        case 'documents':
         return this.getDocumentSearch(item,searchText)
        break;
        case 'inscription_files':
         return this.getInscriptionFileSearch(item,searchText)
        break;
        case 'inscription_validations':
         return this.getInscriptionValidationSearch(item,searchText)
        break;
        case 'courses':
         return this.getCourseSearch(item,searchText)
        break;
        case 'profiles':
         return this.getProfiles(item,searchText)
        break;
        case 'permissions':
         return this.getPermissionSearch(item,searchText)
        break;
        case 'professors':
         return this.getProfessorSearch(item,searchText)
        break;
        case 'professors-classrooms':
         return this.getProfessorClassroomSearch(item,searchText)
        break;
        case 'professors-courses':
         return this.getProfessorCourseSearch(item,searchText)
        break;
        case 'bulletins':
         return this.geBulletinsSearch(item,searchText)
        break;
        default:
          return value;
      }   
    }) : value;
  }

  getPersonalSearch(item:any,searchText:any){

    return item?.lastname?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.firstname?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.birthdate?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.birthplace?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.sex?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.address?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.fonction?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.phone?.toLowerCase().includes(searchText.toLowerCase()) 
  }
  getRoomSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())
  }
  getFeaturesSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())
  }
  getPeriodSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())
  }
  getUserSearch(item:any,searchText:any){

    return item?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.space?.toLowerCase().includes(searchText.toLowerCase())
  }

  getCycleSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())|| 
    item?.description?.toLowerCase().includes(searchText.toLowerCase())
  }
  getLevelSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())|| 
    item?.description?.toLowerCase().includes(searchText.toLowerCase())
  }

  
  getClassroomSearch(item:any,searchText:any){
    return item?.name?.toLowerCase().includes(searchText.toLowerCase())|| 
    item?.cycle?.name.toLowerCase().includes(searchText.toLowerCase())|| 
    item?.level?.name.toLowerCase().includes(searchText.toLowerCase())
  }

  getDocumentSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())
  }

  getInscriptionFileSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())
  }
  
  getPermissionSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())
  }

  getInscriptionValidationSearch(item:any,searchText:any){

    return item?.student?.lastname?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.student?.firstname?.toLowerCase().includes(searchText.toLowerCase())
  }
  getCourseSearch(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.color?.toLowerCase().includes(searchText.toLowerCase())
  }
  getProfiles(item:any,searchText:any){

    return item?.name?.toLowerCase().includes(searchText.toLowerCase())
  }
  getProfessorSearch(item:any,searchText:any){

    return item?.lastname?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.firstname?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.email?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.phone?.toLowerCase().includes(searchText.toLowerCase()) 
  }
  getProfessorClassroomSearch(item:any,searchText:any){

    return item?.lastname?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.firstname?.toLowerCase().includes(searchText.toLowerCase()) 
  }
  getProfessorCourseSearch(item:any,searchText:any){

    return item?.professor?.lastname?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.professor?.firstname?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.name?.toLowerCase().includes(searchText.toLowerCase()) 
  }
  geBulletinsSearch(item:any,searchText:any){

    return item?.lastname?.toLowerCase().includes(searchText.toLowerCase())
  }
}