import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarcompteComponent } from './navbarcompte.component';

describe('NavbarcompteComponent', () => {
  let component: NavbarcompteComponent;
  let fixture: ComponentFixture<NavbarcompteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarcompteComponent]
    });
    fixture = TestBed.createComponent(NavbarcompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
