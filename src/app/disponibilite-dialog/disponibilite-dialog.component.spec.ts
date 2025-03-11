import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibiliteDialogComponent } from './disponibilite-dialog.component';

describe('DisponibiliteDialogComponent', () => {
  let component: DisponibiliteDialogComponent;
  let fixture: ComponentFixture<DisponibiliteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisponibiliteDialogComponent]
    });
    fixture = TestBed.createComponent(DisponibiliteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
