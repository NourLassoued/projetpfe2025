import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionprestaitreComponent } from './inscriptionprestaitre.component';

describe('InscriptionprestaitreComponent', () => {
  let component: InscriptionprestaitreComponent;
  let fixture: ComponentFixture<InscriptionprestaitreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionprestaitreComponent]
    });
    fixture = TestBed.createComponent(InscriptionprestaitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
