import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesrevunesComponent } from './mesrevunes.component';

describe('MesrevunesComponent', () => {
  let component: MesrevunesComponent;
  let fixture: ComponentFixture<MesrevunesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesrevunesComponent]
    });
    fixture = TestBed.createComponent(MesrevunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
