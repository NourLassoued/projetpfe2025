import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarbackadminComponent } from './navbarbackadmin.component';

describe('NavbarbackadminComponent', () => {
  let component: NavbarbackadminComponent;
  let fixture: ComponentFixture<NavbarbackadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarbackadminComponent]
    });
    fixture = TestBed.createComponent(NavbarbackadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
