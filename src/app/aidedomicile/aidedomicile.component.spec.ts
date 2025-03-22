import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidedomicileComponent } from './aidedomicile.component';

describe('AidedomicileComponent', () => {
  let component: AidedomicileComponent;
  let fixture: ComponentFixture<AidedomicileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AidedomicileComponent]
    });
    fixture = TestBed.createComponent(AidedomicileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
