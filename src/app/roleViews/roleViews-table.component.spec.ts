import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleViewsComponent } from './roleViews-table.component';


describe('ViewsRoleTableComponent', () => {
  let component: RoleViewsComponent;
  let fixture: ComponentFixture<RoleViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleViewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
