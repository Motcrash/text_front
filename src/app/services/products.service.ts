import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

interface IProduct {
  productId: number;
  name: number;
  productName: string;
  makeFlag: boolean;
  finishedGoodsFlag: boolean;
  color: string;
  safetyStockLevel: number;
  reorderPoint: number;
  standardCost: number;
  listPrice: number;
  size: string;
  sizeUnitMeasure: string;
  weightUnitMeasure: string;
  weight: number;
  daysToManufacture: number;
  productLine: string;
  class: string;
  style: string;
  productSubcategory: number;
  productModelId: number;
  sellStartDate: Date;
  sellEndDate: Date;
  discontinuedDate: Date;
  rowguid: string;
  modifiedDate: Date;
}

@Injectable()
export class ProductsService {
  private apiUrl = 'https://localhost:7229/api/products';
  constructor(private http: HttpClient) {}

  getData(): Observable<IProduct[]>{
    var res = this.http.get<IProduct[]>(this.apiUrl);
    return res;
  }

  create(role: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, role)
      .pipe(
        tap(),
        catchError(error => {
          console.error('Create Error');
          throw error;
        })
      );
  }

  update(id: number, role: Partial<IProduct>): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, role)
      .pipe(
        tap(),
        catchError(error => {
          console.error('Patch Error');
          throw error;
        })
      );
  }

  delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`)
    .pipe(
      tap(),
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
        key: 'idUser',
      },
      paginate: true,
      pageSize: 20
    });
  }
}
