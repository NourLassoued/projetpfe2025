import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationcoursComponent } from './reservationcours.component';

describe('ReservationcoursComponent', () => {
  let component: ReservationcoursComponent;
  let fixture: ComponentFixture<ReservationcoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationcoursComponent]
    });
    fixture = TestBed.createComponent(ReservationcoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
