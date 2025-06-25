import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import type { ContentReadyEvent } from 'devextreme/ui/data_grid';
import { OrdersHeaderService } from './ordersHeader-grid.service';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-data-grid',
  templateUrl: './ordersHeader-grid.component.html',
  styleUrls: ['./ordersHeader-grid.component.css'],
  providers: [OrdersHeaderService],
})

export class OrdersHeaderComponent implements OnInit {
  dataSource!: DataSource;
  collapsed = false;
  isLoading = true; 
  hasError = false; 
  errorMessage = '';
  isAdding = false;
  isEditing = false;

  constructor(private service: OrdersHeaderService) {}

  contentReady = (e: ContentReadyEvent) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow([1]);
    }
  };

  onEditingStart(e: any): void {
    this.isEditing = true;
    this.isAdding = false;
  }

  onInitNewRow(e: any): void {
    this.isAdding = true;
    this.isEditing = false;
  }

  onRowInserting(e: any): void {
    
    if (e.data.orderDate >= e.data.dueDate) {
      notify('Order date must be less than due date', 'error', 3000);
      e.cancel = true;
      return;
    }

    if(e.data.shipDate >= e.data.dueDate) {
      notify('Ship date must be less than due date', 'error', 3000);
      e.cancel = true;
      return;
    }

    const newOrder = {
      ...e.data,
      "revisionNumber": 8,
      "orderDate": e.data.orderDate+"Z",
      "dueDate": e.data.dueDate+"Z",
      "shipDate": e.data.shipDate+"Z",
      "onlineOrderFlag": true,
      "purchaseOrderNumber": "SO43662",
      "accountNumber": "PO18444174044",
      "customerId": 29994,
      "salesPersonId": 282,
      "territoryId": 6,
      "billToAddressId": 482,
      "shipToAddressId": 482,
      "shipMethodId": 5,
      "creditCardId": 10456,
      "creditCardApprovalCode": "125295Vi53935",
      "currencyRateId": 4,
      "subTotal": 28832.5289,
      "taxAmt": 2775.1646,
      "freight": 867.2389,
      "comment": "string"
    }
    

    e.promise = this.service
      .create(newOrder)
      .toPromise()
      .then((response) => {
        this.loadData();
        return response;
      })
      .catch((error) => {
        e.cancel = true;
        notify(error, 'error', 10000);
      });
  }

  onRowUpdating(e: any): void {
    
    
    // const updatedRole = {
    //   ...e.oldData,
    //   ...e.newData,
    //   modifiedBy: 1,
    //   modificationDatetime: new Date(),
    // };

    // e.promise = this.service
    //   .update(e.key, updatedRole)
    //   .toPromise()
    //   .then((response) => {
    //     return response;
    //   })
    //   .catch((error) => {
    //     e.cancel = true;
    //     throw error;
    //   });
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
        key: 'salesOrderId'
      },
      paginate: true,
      pageSize: 10
    });

    this.service.getData().subscribe({
      next: (data) => {
        console.log('Datos cargados:', data.length, 'registros');
        
        if (data && Array.isArray(data) && data.length > 0) {
          this.dataSource = new DataSource({
            store: {
              type: 'array',
              data: data,
              key: 'salesOrderId'
            },
            paginate: true,
            pageSize: 20
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
        this.errorMessage = 'There was an error loading the data. Please try again later';
        this.isLoading = false;
      }
    });
  }

  retryLoad() {
    this.loadData();
  }

  customizeTooltip = ({ originalValue }: Record<string, string>) => ({
     text: `${parseInt(originalValue)}%` 
  });
}