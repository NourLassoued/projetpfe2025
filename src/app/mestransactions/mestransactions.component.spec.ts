import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MestransactionsComponent } from './mestransactions.component';

describe('MestransactionsComponent', () => {
  let component: MestransactionsComponent;
  let fixture: ComponentFixture<MestransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MestransactionsComponent]
    });
    fixture = TestBed.createComponent(MestransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
