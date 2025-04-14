import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  standalone:true,
  imports:[CommonModule],
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() isVisible=false;

  constructor() { }

  ngOnInit(): void {
  }

}
