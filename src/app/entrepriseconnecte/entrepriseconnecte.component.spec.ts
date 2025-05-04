import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseconnecteComponent } from './entrepriseconnecte.component';

describe('EntrepriseconnecteComponent', () => {
  let component: EntrepriseconnecteComponent;
  let fixture: ComponentFixture<EntrepriseconnecteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepriseconnecteComponent]
    });
    fixture = TestBed.createComponent(EntrepriseconnecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
