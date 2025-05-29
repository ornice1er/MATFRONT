import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowTreatmentComponent } from './follow-treatment.component';

describe('FollowTreatmentComponent', () => {
  let component: FollowTreatmentComponent;
  let fixture: ComponentFixture<FollowTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowTreatmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
