import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemenagementComponent } from './demenagement.component';

describe('DemenagementComponent', () => {
  let component: DemenagementComponent;
  let fixture: ComponentFixture<DemenagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemenagementComponent]
    });
    fixture = TestBed.createComponent(DemenagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
