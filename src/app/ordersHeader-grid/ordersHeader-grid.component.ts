import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import type { ContentReadyEvent } from 'devextreme/ui/data_grid';
import { OrdersHeaderService } from './ordersHeader-grid.service';
import notify from 'devextreme/ui/notify';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-data-grid',
  templateUrl: './ordersHeader-grid.component.html',
  styleUrls: ['./ordersHeader-grid.component.css'],
  providers: [OrdersHeaderService, ProductsService],
})

export class OrdersHeaderComponent implements OnInit {
  dataSource!: DataSource;
  orderDetailsDataSource: any[] = [];
  productsDataSource: any[] = [];
  selectedOrderId: number | null = null;
  expandedRowKey: any = null;

  newDetails: any[] = [];

  collapsed = false;
  isLoading = true; 
  hasError = false; 
  errorMessage = '';
  isAdding = false;
  isEditing = false;


  constructor(
    private service: OrdersHeaderService,
    private productService: ProductsService
  ) {}

  contentReady = (e: ContentReadyEvent) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow([1]);
    }
  };

  onRowExpanding(e: any): void {
    const grid = e.component;
    
    
    if (this.expandedRowKey !== null && this.expandedRowKey !== e.key) {
      
      grid.collapseRow(this.expandedRowKey);
    }
    
    
    this.expandedRowKey = e.key;
    
    
    this.selectedOrderId = e.key;
    this.loadOrderDetails(this.selectedOrderId!);
  }

  onEditingStart(e: any): void {
    
    this.isEditing = true;
    console.log(this.isEditing);
    this.isAdding = false;

    this.selectedOrderId = e.data.salesOrderId;
    
    this.loadOrderDetails(this.selectedOrderId!);
  }

  onInitNewRow(e: any): void {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedOrderId = null;

    e.data.orderQty = 1;
    e.data.unitPriceDiscount = 0;

    if (this.newDetails.length === 0) this.orderDetailsDataSource = [];
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
      revisionNumber: 8,
      orderDate: e.data.orderDate+"Z",
      dueDate: e.data.dueDate+"Z",
      shipDate: e.data.shipDate+"Z",
      onlineOrderFlag: true,
      purchaseOrderNumber: "SO43662",
      accountNumber: "PO18444174044",
      customerId: 29994,
      salesPersonId: 282,
      territoryId: 6,
      billToAddressId: 482,
      shipToAddressId: 482,
      shipMethodId: 5,
      creditCardId: 10456,
      creditCardApprovalCode: "125295Vi53935",
      currencyRateId: 4,
      taxAmt: e.data.subTotal * 0.16,
      freight: e.data.subTotal * 0.8,
    }

  e.promise = this.service
    .create(newOrder)
    .toPromise()
    .then((createResponse) => {
      return this.service.getLastDetail().toPromise();
    })
    .then((lastDetailResponse) => {
      this.newDetails = this.newDetails.map((detail) => ({
        ...detail,
        salesOrderId: lastDetailResponse!.salesOrderId
      }));
    
      if (this.newDetails.length > 0) {
        return this.service.createOrderDetails(this.newDetails).toPromise();
      } else {
        return Promise.resolve([]);
      }
    })
    .then((orderDetailsResponse) => {
      this.clearNewDetails();
      this.loadData();
      notify('Order created successfully', 'success', 3000);
      return orderDetailsResponse;
    })
    .catch((error) => {
      console.error('Error in order creation process:', error);
      e.cancel = true;
      notify('Error creating order', 'error', 10000);
      throw error;
    });
  }

  private clearNewDetails(): void {
  this.newDetails = [];
  this.orderDetailsDataSource = [];
}

  onRowClick(e: any) {
    const salesOrderId = e.data.salesOrderId;
    if (!salesOrderId) {
        notify('Cannot load details without Sales Order Id', 'error', 3000);
        return;
    }

    this.loadOrderDetails(salesOrderId);
}
  onOrderDetailInserting(e: any): void {
    console.log(e);
    
    const productExists = this.newDetails.find(p => p.productId == e.data.productId);
    if (productExists) {
      e.cancel = true;
      notify('Product already exists in the order details', 'error', 3000);
      return;
    }

    if (e.data.unitPriceDiscount < 0 || e.data.unitPriceDiscount > 100) {
      e.cancel = true;
      notify('Unit Price Discount must be between 0 and 100', 'error', 3000);
      return;
    }

    if (e.data.orderQty <= 0) {
      e.cancel = true;
      notify('Quantity must be greater than zero', 'error', 3000);
      return;
    }

    this.newDetails.push({
      ...e.data,
      salesOrderId: null,
      CarrierTrackingNumber: '01F1-4AD5-A5',
      specialOfferId: 1,
      rowguid: crypto.randomUUID(),
      modifiedDate: new Date().toISOString(),
      unitPriceDiscount: e.data.unitPriceDiscount / 100,
    });
  }

  onOrderDetailUpdating(e: any): void {
    console.log('Updating');
  }
  onOrderDetailRemoving(e: any): void {
    console.log('Removing');
  }

  onEditorPreparing(e: any): void {
  if (e.dataField === 'productId' && e.parentType === 'dataRow') {
    e.editorOptions.onValueChanged = (args: any) => {
      const selectedProduct = this.productsDataSource.find(p => p.productId === args.value);
      e.component.cellValue(e.row.rowIndex, 'productId', selectedProduct.productId);
      e.component.cellValue(e.row.rowIndex, 'unitPrice', selectedProduct.listPrice || selectedProduct.standardCost || 0);
      this.recalculateLineTotal(e);
    };
  }
  
  if (e.dataField === 'orderQty' && e.parentType === 'dataRow') {
    
    e.editorOptions.onValueChanged = (args: any) => {
      e.component.cellValue(e.row.rowIndex, 'orderQty', args.value);
      this.recalculateLineTotal(e);
    };
  }

  if (e.dataField === 'unitPriceDiscount' && e.parentType === 'dataRow') {
    
    e.editorOptions.onValueChanged = (args: any) => {
      e.component.cellValue(e.row.rowIndex, 'unitPriceDiscount', args.value);
      this.recalculateLineTotal(e);
    };
  }
  }

  private recalculateLineTotal(e: any): void {
  const qty = e.component.cellValue(e.row.rowIndex, 'orderQty') || 1;
  const unitPrice = e.component.cellValue(e.row.rowIndex, 'unitPrice') || 0;
  const discount = e.component.cellValue(e.row.rowIndex, 'unitPriceDiscount') || 0;
  const lineTotal = qty * unitPrice * (1 - discount / 100);
  e.component.cellValue(e.row.rowIndex, 'lineTotal', lineTotal);
}

  onRowUpdating(e: any): void {
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
    this.loadProducts();
  }

  private loadOrderDetails(orderId: number): void {
    this.service.getOrderDetails(orderId).subscribe({
      next: (data) => {
        this.orderDetailsDataSource = data;
      }
    });
  }

  private loadProducts(): void {
    this.productService.getData().subscribe({
      next: (data) => {
        this.productsDataSource = data;
      }
    });
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