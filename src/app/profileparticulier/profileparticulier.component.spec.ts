import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileparticulierComponent } from './profileparticulier.component';

describe('ProfileparticulierComponent', () => {
  let component: ProfileparticulierComponent;
  let fixture: ComponentFixture<ProfileparticulierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileparticulierComponent]
    });
    fixture = TestBed.createComponent(ProfileparticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
