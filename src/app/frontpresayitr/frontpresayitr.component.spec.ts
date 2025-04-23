import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontpresayitrComponent } from './frontpresayitr.component';

describe('FrontpresayitrComponent', () => {
  let component: FrontpresayitrComponent;
  let fixture: ComponentFixture<FrontpresayitrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontpresayitrComponent]
    });
    fixture = TestBed.createComponent(FrontpresayitrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
