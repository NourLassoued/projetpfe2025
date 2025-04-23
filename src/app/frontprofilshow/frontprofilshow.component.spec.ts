import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontprofilshowComponent } from './frontprofilshow.component';

describe('FrontprofilshowComponent', () => {
  let component: FrontprofilshowComponent;
  let fixture: ComponentFixture<FrontprofilshowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontprofilshowComponent]
    });
    fixture = TestBed.createComponent(FrontprofilshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
