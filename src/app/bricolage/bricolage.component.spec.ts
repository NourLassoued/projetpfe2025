import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BricolageComponent } from './bricolage.component';

describe('BricolageComponent', () => {
  let component: BricolageComponent;
  let fixture: ComponentFixture<BricolageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BricolageComponent]
    });
    fixture = TestBed.createComponent(BricolageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
