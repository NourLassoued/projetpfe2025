import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationprestaitreComponent } from './reservationprestaitre.component';

describe('ReservationprestaitreComponent', () => {
  let component: ReservationprestaitreComponent;
  let fixture: ComponentFixture<ReservationprestaitreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationprestaitreComponent]
    });
    fixture = TestBed.createComponent(ReservationprestaitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
