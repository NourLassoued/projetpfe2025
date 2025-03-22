import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursparticuliersComponent } from './coursparticuliers.component';

describe('CoursparticuliersComponent', () => {
  let component: CoursparticuliersComponent;
  let fixture: ComponentFixture<CoursparticuliersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursparticuliersComponent]
    });
    fixture = TestBed.createComponent(CoursparticuliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
