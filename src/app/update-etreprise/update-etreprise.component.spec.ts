import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEtrepriseComponent } from './update-etreprise.component';

describe('UpdateEtrepriseComponent', () => {
  let component: UpdateEtrepriseComponent;
  let fixture: ComponentFixture<UpdateEtrepriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEtrepriseComponent]
    });
    fixture = TestBed.createComponent(UpdateEtrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
