import { TestBed } from '@angular/core/testing';

import { NotificationuserService } from './notificationuser.service';

describe('NotificationuserService', () => {
  let service: NotificationuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
