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

  statusDictionary = [
    { id: 1, name: 'In Process' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Backordered' },
    { id: 4, name: 'Rejected' },
    { id: 5, name: 'Shipped' },
    { id: 6, name: 'Cancelled' }
  ];

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

    if (this.newDetails.length == 0) {
      e.cancel = true;
      notify('Order details are required', 'error', 3000);
      return;
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
    
    if (e.data.unitPriceDiscount < 0 || e.data.unitPriceDiscount > 1) {
      e.cancel = true;
      notify('Discount value must be between 0 and 1', 'error', 3000);
      return;
    }

    if (e.data.orderQty <= 0) {
      e.cancel = true;
      notify('Quantity must be greater than zero', 'error', 3000);
      return;
    }

    const productExists = this.newDetails.find(p => p.productId == e.data.productId);
    if (productExists) {
      if (e.data.quantity){
        productExists.quantity += e.data.orderQty;
        e.component.cellValue(e.row.rowIndex, 'orderQty', productExists.orderQty);
      }

      if (e.data.lineTotal){
        productExists.lineTotal += e.data.lineTotal;
        e.component.cellValue(e.row.rowIndex, 'lineTotal', productExists.lineTotal);
      }

      if (e.data.unitPriceDiscount){
        if (productExists.unitPriceDiscount > e.data.unitPriceDiscount) {
          productExists.unitPriceDiscount += e.data.unitPriceDiscount;
          e.component.cellValue(e.row.rowIndex, 'unitPriceDiscount', productExists.unitPriceDiscount);
        }
      }
      e.cancel = true;
      notify('Detail added successfully', 'success', 3000);
      return
    }

    this.newDetails.push({
      ...e.data,
      salesOrderId: null,
      CarrierTrackingNumber: '01F1-4AD5-A5',
      specialOfferId: 1,
      modifiedDate: new Date().toISOString(),
      unitPriceDiscount: parseFloat(e.data.unitPriceDiscount),
    });

    notify('Detail added successfully', 'success', 3000);
  }

  onOrderDetailUpdating(e: any): void {   
    const updatedDetail = {
      ...e.oldData,
      ...e.newData,
    };
    if (updatedDetail.unitPriceDiscount < 0 || updatedDetail.unitPriceDiscount > 1) {
      e.cancel = true;
      notify('Discount value must be between 0 and 1', 'error', 3000);
      return;
    }
    
    e.promise = this.service
      .updateOrderDetail(updatedDetail.salesOrderId, updatedDetail.salesOrderDetailId, updatedDetail)
      .toPromise()
      .then((response) => {
        notify('Order detail updated successfully', 'success', 3000);
        return response;
      })
      .catch((error) => {
        e.cancel = true;
        throw error;
      });
  }

  onOrderDetailRemoving(e: any): void {
  const salesOrderId = e.data.salesOrderId;
  const salesOrderDetailId = e.data.salesOrderDetailId;
  const productId = e.data.productId;
  
  if (this.isEditing) {
    e.promise = this.service
      .deleteOrderDetail(salesOrderId, salesOrderDetailId)
      .toPromise()
      .then(() => {
        notify('Order detail deleted successfully', 'success', 3000);
      })
      .catch((error) => {
        console.error('Delete failed');
        e.cancel = true;
        throw error;
      });
  } else {
    this.newDetails = this.newDetails.filter(detail => 
      detail.productId !== productId && 
      detail.salesOrderDetailId !== salesOrderDetailId
    );
  }
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
  const discount = parseFloat(e.component.cellValue(e.row.rowIndex, 'unitPriceDiscount'));
  
  if (discount < 0 || discount > 1) {
    notify('Discount value must be between 0 and 1', 'error', 3000);
    return;
  }
  const lineTotal = qty * unitPrice * (1 - discount);
  
  e.component.cellValue(e.row.rowIndex, 'lineTotal', lineTotal);
}

  onRowUpdating(e: any): void {
  const orderDate = e.newData.orderDate || e.oldData.orderDate;
  const dueDate = e.newData.dueDate || e.oldData.dueDate;
  const shipDate = e.newData.shipDate || e.oldData.shipDate;
  
  if (new Date(orderDate) > new Date(dueDate)) {
    notify('Order date must be less than or equal to due date', 'error', 3000);
    e.cancel = true;
    return;
  }

  if (new Date(shipDate) > new Date(dueDate)) {
    notify('Ship date must be less than or equal to due date', 'error', 3000);
    e.cancel = true;
    return;
  }
  
  if (new Date(orderDate) > new Date(shipDate)) {
    notify('Ship date must be less than or equal to order date', 'error', 3000);
    e.cancel = true;
    return;
  }

  const updatedOrderHeader = {
    ...e.oldData,
    ...e.newData,
    orderDate: e.newData.orderDate ? this.formatDateForAPI(e.newData.orderDate) : e.oldData.orderDate,
    dueDate: e.newData.dueDate ? this.formatDateForAPI(e.newData.dueDate) : e.oldData.dueDate,
    shipDate: e.newData.shipDate ? this.formatDateForAPI(e.newData.shipDate) : e.oldData.shipDate,
    taxAmt: e.newData.subTotal ? e.newData.subTotal * 0.16 : e.oldData.taxAmt,
    freight: e.newData.subTotal ? e.newData.subTotal * 0.8 : e.oldData.freight,
  }
  e.promise = this.service
    .update(e.key, updatedOrderHeader)
    .toPromise()
    .then((response) => {
      this.loadData();
      notify('Order Header updated successfully', 'success', 3000);
      return response;
    })
    .catch((error) => {
      e.cancel = true;
      notify('Order Header updated failed', 'error', 3000);
      throw error;
    });
}

private formatDateForAPI(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toISOString();
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
