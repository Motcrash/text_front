import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
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

@Injectable()
export class OrdersHeaderService {
  private orderHeaderApi = 'https://localhost:7229/api/SalesOrderHeader';
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
}
