import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionEntrpriseComponent } from './inscription-entrprise.component';

describe('InscriptionEntrpriseComponent', () => {
  let component: InscriptionEntrpriseComponent;
  let fixture: ComponentFixture<InscriptionEntrpriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionEntrpriseComponent]
    });
    fixture = TestBed.createComponent(InscriptionEntrpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
