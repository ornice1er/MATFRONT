import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../../../core/pipes/sample-search.pipe';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { ObserverService } from '../../../../../core/utils/observer.service';

@Component({
  selector: 'app-listplainte',
  standalone: true,
      imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  templateUrl: './listplainte.component.html',
  styleUrls: ['./listplainte.component.css']
})
export class ListplainteComponent implements OnInit {

  constructor(
    private observerService:ObserverService
  ) { }

  ngOnInit(): void {
    this.observerService.setTitle('')

  }

}
