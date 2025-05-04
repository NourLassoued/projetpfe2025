import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionentrpriseComponent } from './sectionentrprise.component';

describe('SectionentrpriseComponent', () => {
  let component: SectionentrpriseComponent;
  let fixture: ComponentFixture<SectionentrpriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionentrpriseComponent]
    });
    fixture = TestBed.createComponent(SectionentrpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
