import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRequeteComponent } from './performance-requete.component';

describe('PerformanceRequeteComponent', () => {
  let component: PerformanceRequeteComponent;
  let fixture: ComponentFixture<PerformanceRequeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceRequeteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceRequeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
