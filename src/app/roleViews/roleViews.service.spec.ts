import { TestBed } from '@angular/core/testing';
import { RoleViewsService } from './roleViews.service';


describe('ViewsRoleService', () => {
  let service: RoleViewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleViewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
