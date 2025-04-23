import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontprofilComponent } from './frontprofil.component';

describe('FrontprofilComponent', () => {
  let component: FrontprofilComponent;
  let fixture: ComponentFixture<FrontprofilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontprofilComponent]
    });
    fixture = TestBed.createComponent(FrontprofilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
