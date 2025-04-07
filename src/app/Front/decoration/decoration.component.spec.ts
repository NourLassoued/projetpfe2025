import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecorationComponent } from './decoration.component';

describe('DecorationComponent', () => {
  let component: DecorationComponent;
  let fixture: ComponentFixture<DecorationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecorationComponent]
    });
    fixture = TestBed.createComponent(DecorationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
