import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeterminneComponent } from './demandeterminne.component';

describe('DemandeterminneComponent', () => {
  let component: DemandeterminneComponent;
  let fixture: ComponentFixture<DemandeterminneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeterminneComponent]
    });
    fixture = TestBed.createComponent(DemandeterminneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
