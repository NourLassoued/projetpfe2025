import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesevolutiosComponent } from './mesevolutios.component';

describe('MesevolutiosComponent', () => {
  let component: MesevolutiosComponent;
  let fixture: ComponentFixture<MesevolutiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesevolutiosComponent]
    });
    fixture = TestBed.createComponent(MesevolutiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
