import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteprestaitreComponent } from './compteprestaitre.component';

describe('CompteprestaitreComponent', () => {
  let component: CompteprestaitreComponent;
  let fixture: ComponentFixture<CompteprestaitreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompteprestaitreComponent]
    });
    fixture = TestBed.createComponent(CompteprestaitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
