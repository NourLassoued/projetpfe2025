import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesevolutionentrpriseComponent } from './mesevolutionentrprise.component';

describe('MesevolutionentrpriseComponent', () => {
  let component: MesevolutionentrpriseComponent;
  let fixture: ComponentFixture<MesevolutionentrpriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesevolutionentrpriseComponent]
    });
    fixture = TestBed.createComponent(MesevolutionentrpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
