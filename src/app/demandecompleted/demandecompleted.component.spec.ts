import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandecompletedComponent } from './demandecompleted.component';

describe('DemandecompletedComponent', () => {
  let component: DemandecompletedComponent;
  let fixture: ComponentFixture<DemandecompletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandecompletedComponent]
    });
    fixture = TestBed.createComponent(DemandecompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
