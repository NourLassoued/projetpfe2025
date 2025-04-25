import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceavisComponent } from './espaceavis.component';

describe('EspaceavisComponent', () => {
  let component: EspaceavisComponent;
  let fixture: ComponentFixture<EspaceavisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaceavisComponent]
    });
    fixture = TestBed.createComponent(EspaceavisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
