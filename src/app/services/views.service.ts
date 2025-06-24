import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

interface IViews {
  idView: number;
  idGroup: number;
  viewName: string;
  urlPath: string;
  createdBy: string;
  creationDatetime: Date;
  modifiedBy: number;
  modificationDatetime: Date;
}

@Injectable()
export class ViewsService {
  private apiUrl = 'https://localhost:7229/api/view';
  constructor(private http: HttpClient) {}

  getData(): Observable<IViews[]>{
    var res = this.http.get<IViews[]>(this.apiUrl);
    return res;
  }

  create(role: IViews): Observable<IViews> {
    return this.http.post<IViews>(this.apiUrl, role)
      .pipe(
        tap(),
        catchError(error => {
          console.error('Create Error');
          throw error;
        })
      );
  }

  update(id: number, role: Partial<IViews>): Observable<IViews> {
    return this.http.put<IViews>(`${this.apiUrl}/${id}`, role)
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
