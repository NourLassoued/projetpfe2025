import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacereservationComponent } from './espacereservation.component';

describe('EspacereservationComponent', () => {
  let component: EspacereservationComponent;
  let fixture: ComponentFixture<EspacereservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspacereservationComponent]
    });
    fixture = TestBed.createComponent(EspacereservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
