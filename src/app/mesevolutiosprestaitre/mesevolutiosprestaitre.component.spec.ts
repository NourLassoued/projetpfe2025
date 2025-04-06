import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesevolutiosprestaitreComponent } from './mesevolutiosprestaitre.component';

describe('MesevolutiosprestaitreComponent', () => {
  let component: MesevolutiosprestaitreComponent;
  let fixture: ComponentFixture<MesevolutiosprestaitreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesevolutiosprestaitreComponent]
    });
    fixture = TestBed.createComponent(MesevolutiosprestaitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
