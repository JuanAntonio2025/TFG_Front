import { TestBed } from '@angular/core/testing';

import { AdminOrders } from './admin-orders';

describe('AdminOrders', () => {
  let service: AdminOrders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminOrders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
