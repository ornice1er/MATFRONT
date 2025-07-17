import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterValuesComponent } from './parameter-values.component';

describe('ParameterValuesComponent', () => {
  let component: ParameterValuesComponent;
  let fixture: ComponentFixture<ParameterValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterValuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
