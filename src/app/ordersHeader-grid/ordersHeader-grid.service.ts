import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, concatMap, delay, forkJoin, from, Observable, retry, tap, throwError, toArray } from 'rxjs';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

interface IOrdersHeader {
  salesOrderId: number,
  revisionNumber: number,
  orderDate: Date,
  dueDate: Date,
  shipDate: Date,
  status: number,
  onlineOrderFlag: true,
  purchaseOrderNumber: string,
  accountNumber: string,
  customerId: number,
  salesPersonId: number,
  territoryId: number,
  billToAddressId: number,
  shipToAddressId: number,
  shipMethodId: number,
  creditCardId: number,
  creditCardApprovalCode: string,
  currencyRateId: number,
  subTotal: number,
  taxAmt: number,
  freight: number,
  comment: string
}

interface IDetails {
  salesOrderId: number,
  salesOrderDetailId: number,
  carrierTrackingNumber: string,
  orderQty: number,
  productId: number,
  specialOfferId: number,
  unitPrice: number,
  unitPriceDiscount: number,
  lineTotal: number,
  rowguid: string,
  modifiedDate: Date,
  salesOrder: any[],
  specialOfferProduct: any[]
}

@Injectable()
export class OrdersHeaderService {
  private orderHeaderApi = 'https://localhost:7229/api/SalesOrderHeader';
  private orderDetailsApi = 'https://localhost:7229/api/SalesOrderDetail';
  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    var res = this.http.get<IOrdersHeader[]>(this.orderHeaderApi);
    
    return res;
  }

  getLastDetail(): Observable<IOrdersHeader> {
    return this.http.get<IOrdersHeader>(`${this.orderHeaderApi}/last`);
  }

  create(order: IOrdersHeader): Observable<IOrdersHeader> {
    return this.http.post<IOrdersHeader>(this.orderHeaderApi, order).pipe(
      tap(() => console.log('POST Success')),
      catchError((error) => {
        throw error;
      })
    );
  }

  update(id: number, role: Partial<IOrdersHeader>): Observable<IOrdersHeader> {
    return this.http.patch<IOrdersHeader>(`${this.orderHeaderApi}/${id}`, role).pipe(
      
      tap(() => console.log('Patch Success')),
      catchError((error) => {
        console.error('Patch Error');
        throw error;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.orderHeaderApi}/${id}`).pipe(
      
      tap(() => console.log('Delete Success')),
      catchError((error: HttpErrorResponse): Observable<never> => {
        console.error('Delete Error');
        let errorMessage = `Error deleting role: ${error.status} ${error.statusText}`;
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  createDataSource(data: any[]): DataSource {
    return new DataSource({
      store: {
        type: 'array',
        data: data,
        key: 'SalesOrderID',
      },
      paginate: true,
      pageSize: 20,
    });
  }

  getOrderDetails(orderId: number): Observable<IDetails[]> {
    return this.http.get<IDetails[]>(`${this.orderDetailsApi}/${orderId}`);
  }

  createOrderDetails(orderDetails: IDetails[]): Observable<IDetails[]> {
    return from(orderDetails).pipe(
      concatMap((detail, index) => 
        this.http.post<IDetails>(this.orderDetailsApi, detail).pipe(
          delay(index * 100),
          tap(() => console.log('POST Success for detail:', detail)),
          catchError((error) => {
            console.error('POST Error for detail:', detail, error);
            throw error;
          })
        )
      ),
      toArray()
    );
  }

  
  deleteOrderDetail(saleOrderId: Number, saleOrderDetailId: Number){
    return this.http.delete<void>(`${this.orderDetailsApi}/${saleOrderId}/${saleOrderDetailId}`).pipe(
      tap(() => console.log('Delete Success for detail:', saleOrderDetailId)),
      catchError((error) => {
        console.error('Delete Error for detail:', saleOrderDetailId, error);
        throw error;
      })
    );
  }

  updateOrderDetail(saleOrderId: Number, saleOrderDetailId: Number, detail: Partial<IDetails>): Observable<IDetails> {
    return this.http.patch<IDetails>(`${this.orderDetailsApi}/${saleOrderId}/${saleOrderDetailId}`, detail).pipe(
      tap(() => console.log('Patch Success for detail:', saleOrderDetailId)),
      catchError((error) => {
        console.error('Patch Error for detail:', saleOrderDetailId, error);
        throw error;
      })
    );
  }
}
