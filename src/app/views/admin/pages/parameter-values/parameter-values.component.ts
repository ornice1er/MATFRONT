import { Component } from '@angular/core';
import { NgxPaginationModule } from "ngx-pagination";

@Component({
  selector: 'app-parameter-values',
  standalone: true,
  imports: [NgxPaginationModule],
  templateUrl: './parameter-values.component.html',
  styleUrl: './parameter-values.component.css'
})
export class ParameterValuesComponent {

}
