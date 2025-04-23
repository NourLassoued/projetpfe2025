import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvissectionComponent } from './avissection.component';

describe('AvissectionComponent', () => {
  let component: AvissectionComponent;
  let fixture: ComponentFixture<AvissectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvissectionComponent]
    });
    fixture = TestBed.createComponent(AvissectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
