import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../../../../core/services/requete.service';
import { AppSweetAlert } from '../../../../../core/utils/app-sweet-alert';

@Component({
  selector: 'app-complement-information',
  templateUrl: './complement-information.component.html',
  styleUrls: ['./complement-information.component.css']
})
export class ComplementInformationComponent implements OnInit {

  constructor(private requeteService:RequeteService,private activatedRoute:ActivatedRoute) { }
  data:any={
    message:"",
    id:""
  }
  Null=null
  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('id') !=null) {
      this.requeteService.getReponseRapide(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
        this.data=res.data
      })
    }
    
  }

  loading=false
  save(value:any) {
    var param = {
      complement: value.complement,
      id: this.data.id,
    };
    this.loading=true
    this.requeteService.complementReponse(param).subscribe((rest: any) => {
   
      this.loading=false
        this.ngOnInit()
        AppSweetAlert.simpleAlert("RENSEIGNEMENTS", "Renseignements envoyé avec succès ", 'success')
     
    })
  }


}
