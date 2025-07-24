import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequeteATraiterComponent } from './list-requete-a-traiter.component';

describe('ListRequeteATraiterComponent', () => {
  let component: ListRequeteATraiterComponent;
  let fixture: ComponentFixture<ListRequeteATraiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRequeteATraiterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRequeteATraiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
