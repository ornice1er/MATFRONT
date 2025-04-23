import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SampleSearchPipe } from '../../../core/pipes/sample-search.pipe';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  standalone: true,
    imports: [CommonModule,FormsModule,NgbModule,LoadingComponent,SampleSearchPipe,NgSelectModule,NgxPaginationModule],
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() isVisible=false;

  constructor() { }

  ngOnInit(): void {
  }

}
