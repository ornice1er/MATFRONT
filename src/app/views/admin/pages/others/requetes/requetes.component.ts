
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../../components/loading/loading.component';


@Component({
  selector: 'app-requetes',
    standalone: true,
        imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  
  templateUrl: './requetes.component.html',
  styleUrls: ['./requetes.component.css']
})
export class RequetesComponent implements OnInit {

  constructor(
    
  ) { }
  

  ngOnInit(): void {

    
  }


}
