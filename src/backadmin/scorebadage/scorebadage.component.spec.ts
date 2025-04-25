import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorebadageComponent } from './scorebadage.component';

describe('ScorebadageComponent', () => {
  let component: ScorebadageComponent;
  let fixture: ComponentFixture<ScorebadageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScorebadageComponent]
    });
    fixture = TestBed.createComponent(ScorebadageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
