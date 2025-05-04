import { TestBed } from '@angular/core/testing';

import { NotificationpartuculierServiceService } from './notificationpartuculier-service.service';

describe('NotificationpartuculierServiceService', () => {
  let service: NotificationpartuculierServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationpartuculierServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
