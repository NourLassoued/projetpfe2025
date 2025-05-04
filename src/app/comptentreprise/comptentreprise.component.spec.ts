import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptentrepriseComponent } from './comptentreprise.component';

describe('ComptentrepriseComponent', () => {
  let component: ComptentrepriseComponent;
  let fixture: ComponentFixture<ComptentrepriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComptentrepriseComponent]
    });
    fixture = TestBed.createComponent(ComptentrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
