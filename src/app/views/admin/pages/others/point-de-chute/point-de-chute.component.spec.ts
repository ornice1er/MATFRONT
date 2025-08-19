import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointDeChuteComponent } from './point-de-chute.component';

describe('PointDeChuteComponent', () => {
  let component: PointDeChuteComponent;
  let fixture: ComponentFixture<PointDeChuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointDeChuteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointDeChuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
