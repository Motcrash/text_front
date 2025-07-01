import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, concatMap, delay, from, Observable, tap, toArray } from 'rxjs';
import 'devextreme/data/odata/store';

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
export class ordersDetailService {
  private orderDetailsApi = 'https://localhost:7229/api/SalesOrderDetail';
  constructor(private http: HttpClient) {}

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
