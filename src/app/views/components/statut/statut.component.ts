import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statut',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './statut.component.html',
  styleUrl: './statut.component.css'
})
export class StatutComponent {
  @Input('status') status:any;
  @Input('message') message:any;  
}
