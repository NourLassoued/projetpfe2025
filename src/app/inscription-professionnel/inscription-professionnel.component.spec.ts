import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionProfessionnelComponent } from './inscription-professionnel.component';

describe('InscriptionProfessionnelComponent', () => {
  let component: InscriptionProfessionnelComponent;
  let fixture: ComponentFixture<InscriptionProfessionnelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionProfessionnelComponent]
    });
    fixture = TestBed.createComponent(InscriptionProfessionnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
