import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererdemandeComponent } from './gererdemande.component';

describe('GererdemandeComponent', () => {
  let component: GererdemandeComponent;
  let fixture: ComponentFixture<GererdemandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GererdemandeComponent]
    });
    fixture = TestBed.createComponent(GererdemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
