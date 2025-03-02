import { TestBed } from '@angular/core/testing';

import { DisponibliteService } from './disponiblite.service';

describe('DisponibliteService', () => {
  let service: DisponibliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisponibliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
