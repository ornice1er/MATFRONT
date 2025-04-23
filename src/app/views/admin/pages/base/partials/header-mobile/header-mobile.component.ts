import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../../../components/loading/loading.component';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',

      standalone: true,
        imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  styleUrls: ['./header-mobile.component.css']
})
export class HeaderMobileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
