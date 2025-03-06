import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateparticulierComponent } from './updateparticulier.component';

describe('UpdateparticulierComponent', () => {
  let component: UpdateparticulierComponent;
  let fixture: ComponentFixture<UpdateparticulierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateparticulierComponent]
    });
    fixture = TestBed.createComponent(UpdateparticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
