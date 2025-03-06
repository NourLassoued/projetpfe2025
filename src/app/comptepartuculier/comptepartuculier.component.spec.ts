import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptepartuculierComponent } from './comptepartuculier.component';

describe('ComptepartuculierComponent', () => {
  let component: ComptepartuculierComponent;
  let fixture: ComponentFixture<ComptepartuculierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComptepartuculierComponent]
    });
    fixture = TestBed.createComponent(ComptepartuculierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
