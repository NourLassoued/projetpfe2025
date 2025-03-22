import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimauxComponent } from './animaux.component';

describe('AnimauxComponent', () => {
  let component: AnimauxComponent;
  let fixture: ComponentFixture<AnimauxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimauxComponent]
    });
    fixture = TestBed.createComponent(AnimauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
