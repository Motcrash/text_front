import { TestBed } from '@angular/core/testing';

import { RoleGridService } from './role-grid.service';

describe('RoleGridService', () => {
  let service: RoleGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
