import { TestBed } from '@angular/core/testing';

import { AbonmmentserviceService } from './abonmmentservice.service';

describe('AbonmmentserviceService', () => {
  let service: AbonmmentserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbonmmentserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
