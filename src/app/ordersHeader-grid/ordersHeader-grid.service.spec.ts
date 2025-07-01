import { TestBed } from '@angular/core/testing';

import { OrdersHeaderService } from '../services/ordersHeader.service';

describe('Service', () => {
  let service: OrdersHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
