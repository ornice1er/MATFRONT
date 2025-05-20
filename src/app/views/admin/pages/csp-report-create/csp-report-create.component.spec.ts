import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CspReportCreateComponent } from './csp-report-create.component';

describe('CspReportCreateComponent', () => {
  let component: CspReportCreateComponent;
  let fixture: ComponentFixture<CspReportCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CspReportCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CspReportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
