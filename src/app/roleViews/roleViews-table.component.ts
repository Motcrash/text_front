import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import type { ContentReadyEvent } from 'devextreme/ui/data_grid';
import { RoleGridService } from '../roles-table/role-grid.service';
import notify from 'devextreme/ui/notify';
import { RoleViewsService } from './roleViews.service';
import { ViewsService } from '../services/views.service';

@Component({
  selector: 'app-roles-grid',
  templateUrl: './roleViews-table.component.html',
  styleUrls: ['./roleViews-table.component.css'],
  providers: [RoleViewsService, RoleGridService, ViewsService],
})
export class RoleViewsComponent implements OnInit {
  dataSource!: DataSource;
  rolesDataSource: any[] = [];
  roles: any[] = [];
  viewsDataSource: any[] = []
  views: any[] = []
  collapsed = false;
  selectedRoleName: string = '';
  selectedRoleId: number = 0;
  selectedViewName: string = '';
  selectedViewId: number = 0;
  isLoading = true;
  hasError = false;
  errorMessage = '';
  viewDropdownOptions = {
    valueExpr: 'idView',
    displayExpr: 'viewName',
    placeholder: 'Select a view...',
    searchEnabled: false,
    acceptCustomValue: false
  };

  isEditing: boolean = false;


  constructor(
    private service: RoleViewsService,
    private roleService: RoleGridService,
    private viewsService: ViewsService
  ) {}


  onEditingStart(e: any) {
    this.isEditing = true;
  }

  onInitNewRow(e: any) {
    this.isEditing = false;
  }


   onRowInserting(e: any): void {
    const newRoleView = {
      ...e.data,
      idRole: this.selectedRoleId,
      createdBy: 1,
      creationDatetime: new Date(),
      modifiedBy: 1,
      modificationDatetime: new Date(),
    };
  
    e.promise = this.service
      .create(newRoleView)
      .toPromise()
      .then((response) => {
        this.loadData();
        return response;
      })
      .catch((error) => {
        e.cancel = true;
        throw error;
      });
  }

  onRowUpdating(e: any): void {
    const updatedRoleView = {
      ...e.oldData,
      ...e.newData,
      modificationDatetime: new Date(),
    };
    
    e.promise = this.service
      .update(updatedRoleView.idRole,
          updatedRoleView.idView,
          updatedRoleView)
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        e.cancel = true;
        throw error;
      });
  }

  onRowRemoving(e: any): void {
    e.promise = this.service
      .delete(e.data.idRole, e.data.idView)
      .toPromise()
      .then(() => {
        this.loadData();
      })
      .catch((error) => {
        e.cancel = true;
        throw error;
      });
  }

  selectStatus(e: any): void {
  
  this.selectedRoleId = e.value;
  const selectedRole = this.roles.find(r => r.idRole === this.selectedRoleId);
  this.selectedRoleName = selectedRole?.roleName || '';

  if (!this.selectedRoleId) return;


  this.service.getViewsByRole(this.selectedRoleId).subscribe({
    next: (views) => {
      this.dataSource = new DataSource({
        store: {
          type: 'array',
          data: views,
          key: ['idView', 'idRole'],
        },
        paginate: true,
        pageSize: 20,
      });
      this.viewsDataSource = views;
    },
    error: (error) => {
      notify('Error al cargar las vistas del rol', 'error', 3000);
      console.error(error);
    }
  });
}

  ngOnInit() {
    this.loadRoles();
    this.loadViews();
    this.loadData();
  }

  private loadViews(){
    this.viewsService.getData().subscribe({
      next: (views) => {
        views.map(view => {
          this.views.push({idView: view.idView, viewName: view.viewName})
        })
        this.selectedViewId = views[0].idView;
        this.viewsDataSource = views;
      },
      error: (error) => {
        notify('Error loading views', 'error', 3000)
      }
    })
  }

  private loadRoles(){
    this.roleService.getData().subscribe({
      next: (roles) => {
        roles.map(role => {
          this.roles.push({idRole: role.idRole, roleName: role.roleName})
        })
        this.selectedRoleId = roles[0].idRole;
        this.rolesDataSource = roles;
      },
      error: (error) => {
        notify('Error loading roles', 'error', 3000)
      }
    })
  }

  private loadData() {
    this.isLoading = true;
    this.hasError = false;
    this.dataSource = new DataSource({
      store: {
        type: 'array',
        data: [],
        key: ['idView', 'idRole'],
      },
      paginate: true,
      pageSize: 10,
    });

    this.service.getViewsByRole(this.selectedRoleId).subscribe({
      next: (data) => {
        
        if (data && Array.isArray(data)) {          
          this.dataSource = new DataSource({
            store: {
              type: 'array',
              data: data,
              key: ['idView', 'idRole'],
            },
            paginate: true,
            pageSize: 20,
          });

          this.isLoading = false;
        } else {
          this.hasError = true;
          this.errorMessage = 'No data available';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.hasError = true;
        this.errorMessage =
          'There was an error loading the data. Please try again later';
        this.isLoading = false;
      },
    });
  }

  retryLoad() {
    this.loadData();
  }

  contentReady = (e: ContentReadyEvent) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow([1]);
    }
  };

  customizeTooltip = ({ originalValue }: Record<string, string>) => ({
    text: `${parseInt(originalValue)}%`,
  });
}
