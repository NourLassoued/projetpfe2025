import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewinstructionssendComponent } from './newinstructionssend.component';

describe('NewinstructionssendComponent', () => {
  let component: NewinstructionssendComponent;
  let fixture: ComponentFixture<NewinstructionssendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewinstructionssendComponent]
    });
    fixture = TestBed.createComponent(NewinstructionssendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
