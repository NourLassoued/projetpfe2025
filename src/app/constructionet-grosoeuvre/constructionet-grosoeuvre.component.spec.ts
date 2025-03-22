import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionetGrosoeuvreComponent } from './constructionet-grosoeuvre.component';

describe('ConstructionetGrosoeuvreComponent', () => {
  let component: ConstructionetGrosoeuvreComponent;
  let fixture: ComponentFixture<ConstructionetGrosoeuvreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionetGrosoeuvreComponent]
    });
    fixture = TestBed.createComponent(ConstructionetGrosoeuvreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
