import { Component, Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'sampleSearch',
  standalone:true
})
export class SampleSearchPipe implements PipeTransform {

  transform(value: any, searchText:String): any {
    
    return (searchText != '') ? value.filter((item:any) => {  
     return item?.lastname?.toLowerCase().includes(searchText.toLowerCase()) || 
           item?.firstname?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.birthdate?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.birthplace?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.sex?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.address?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.fonction?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.nomprenoms?.toLowerCase().includes(searchText.toLowerCase()) ||
           item?.agent_user?.nomprenoms?.toLowerCase().includes(searchText.toLowerCase()) ||

           item?.phone?.toLowerCase().includes(searchText.toLowerCase()) 
  
    }) : value;
  }

  
}