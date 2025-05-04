import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MespublicationComponent } from './mespublication.component';

describe('MespublicationComponent', () => {
  let component: MespublicationComponent;
  let fixture: ComponentFixture<MespublicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MespublicationComponent]
    });
    fixture = TestBed.createComponent(MespublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
