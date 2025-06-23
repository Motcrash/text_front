import { RoleGridService } from './role-grid.service';
import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import type { ContentReadyEvent } from 'devextreme/ui/data_grid';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-roles-grid',
  templateUrl: './roles-grid.component.html',
  styleUrls: ['./roles-grid.component.css'],
  providers: [RoleGridService],
})
export class RolesGridComponent implements OnInit {
  dataSource!: DataSource;
  collapsed = false;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(private service: RoleGridService) {}

   onRowInserting(e: any): void {
    if (!e.data.roleName || e.data.roleName.trim() === '') {
      e.cancel = true;
      return;
    }

    const existingRoles = this.dataSource.items();
    const isDuplicate = existingRoles.find(
      (role: any) => role.roleName.toLowerCase().trim() === e.data.roleName.toLowerCase().trim()
    );
    console.log(isDuplicate);
    

    if (isDuplicate) {
      e.cancel = true;
      notify('A role with this name already exists. Please choose a different name.', 'error', 3000);
      return;
    }

    const newRole = {
      ...e.data,
      createdBy: 1,
      creationDatetime: new Date(),
      modifiedBy: 1,
      modificationDatetime: new Date(),
    };

    e.promise = this.service
      .create(newRole)
      .toPromise()
      .then((response) => {
        this.loadData();
        return response;
      })
      .catch((error) => {
        e.cancel = true;
        notify(error.error, 'error', 3000);
      });
  }

  onRowUpdating(e: any): void {
    const updatedRole = {
      ...e.oldData,
      ...e.newData,
      modifiedBy: 1,
      modificationDatetime: new Date(),
    };

    e.promise = this.service
      .update(e.key, updatedRole)
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
    const id = e.key || e.data?.idRole;
    e.promise = this.service
      .delete(id)
      .toPromise()
      .then(() => {
        this.loadData();
      })
      .catch((error) => {
        console.error('Delete failed');
        e.cancel = true;
        throw error;
      });
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading = true;
    this.hasError = false;

    this.dataSource = new DataSource({
      store: {
        type: 'array',
        data: [],
        key: 'idRole',
      },
      paginate: true,
      pageSize: 10,
    });

    this.service.getData().subscribe({
      next: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.dataSource = new DataSource({
            store: {
              type: 'array',
              data: data,
              key: 'idRole',
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
        console.error('Error loading data:', error);
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
