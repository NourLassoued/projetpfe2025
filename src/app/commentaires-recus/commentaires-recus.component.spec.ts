import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentairesRecusComponent } from './commentaires-recus.component';

describe('CommentairesRecusComponent', () => {
  let component: CommentairesRecusComponent;
  let fixture: ComponentFixture<CommentairesRecusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentairesRecusComponent]
    });
    fixture = TestBed.createComponent(CommentairesRecusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
