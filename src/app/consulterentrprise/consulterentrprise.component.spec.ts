import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterentrpriseComponent } from './consulterentrprise.component';

describe('ConsulterentrpriseComponent', () => {
  let component: ConsulterentrpriseComponent;
  let fixture: ComponentFixture<ConsulterentrpriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsulterentrpriseComponent]
    });
    fixture = TestBed.createComponent(ConsulterentrpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
