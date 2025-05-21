import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonnementpayeComponent } from './abonnementpaye.component';

describe('AbonnementpayeComponent', () => {
  let component: AbonnementpayeComponent;
  let fixture: ComponentFixture<AbonnementpayeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbonnementpayeComponent]
    });
    fixture = TestBed.createComponent(AbonnementpayeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
