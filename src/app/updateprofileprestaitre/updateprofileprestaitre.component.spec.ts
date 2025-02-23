import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateprofileprestaitreComponent } from './updateprofileprestaitre.component';

describe('UpdateprofileprestaitreComponent', () => {
  let component: UpdateprofileprestaitreComponent;
  let fixture: ComponentFixture<UpdateprofileprestaitreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateprofileprestaitreComponent]
    });
    fixture = TestBed.createComponent(UpdateprofileprestaitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
