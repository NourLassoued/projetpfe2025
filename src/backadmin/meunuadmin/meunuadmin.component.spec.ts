import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeunuadminComponent } from './meunuadmin.component';

describe('MeunuadminComponent', () => {
  let component: MeunuadminComponent;
  let fixture: ComponentFixture<MeunuadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeunuadminComponent]
    });
    fixture = TestBed.createComponent(MeunuadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
