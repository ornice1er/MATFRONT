import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
// import { AlertNotif } from 'src/app/alert';
// import { SettingService } from 'src/app/core/_services/setting.service';
import { SampleSearchPipe } from '../../../../core/pipes/sample-search.pipe';
import { AppSweetAlert } from '../../../../core/utils/app-sweet-alert';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { animate } from '@angular/animations';
import { SettingService } from '../../../../core/services/setting.service';
import { ObserverService } from '../../../../core/utils/observer.service';

@Component({
  selector: 'app-settings',
  standalone: true,
            imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
setting:any={
  header_text:""
}
settingRecup:any
  constructor(  
  private settingService:SettingService,
  private observerService:ObserverService
  ) { }

  ngOnInit(): void {
    this.observerService.setTitle('PARAMETRES - Générale')

  }

  set(value:any){
  this.settingService.update( this.setting.id,value).subscribe((res:any)=>{
        localStorage.setItem('mataccueilSettings',JSON.stringify(res.data))
          AppSweetAlert.simpleAlert("Paramètre général","Paramètre mis à jour avec succès")
      })

  }

}
