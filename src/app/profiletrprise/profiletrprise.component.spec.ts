import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiletrpriseComponent } from './profiletrprise.component';

describe('ProfiletrpriseComponent', () => {
  let component: ProfiletrpriseComponent;
  let fixture: ComponentFixture<ProfiletrpriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfiletrpriseComponent]
    });
    fixture = TestBed.createComponent(ProfiletrpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
