import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

interface IRoleView {
  idRole: number;
  idView: number;
  canAccess: boolean;
  canView: boolean;
  createdBy: string;
  creationDatetime: Date;
  modifiedBy: number;
  modificationDatetime: Date;
}

@Injectable()
export class RoleViewsService {
  private apiUrl = 'https://localhost:7229/api/roleviews';
  constructor(private http: HttpClient) {}

  getData(): Observable<any[]>{
    var res = this.http.get<IRoleView[]>(this.apiUrl);
    return res;
  }

  create(roleView: IRoleView): Observable<IRoleView> {
    return this.http.post<IRoleView>(this.apiUrl, roleView)
      .pipe(
        tap(),
        catchError(error => {
          console.error('Create Error');
          throw error;
        })
      );
  }

  update(idRole: number, idView: number, role: Partial<IRoleView>): Observable<IRoleView> {
    return this.http.patch<IRoleView>(`${this.apiUrl}/${idRole}/${idView}`, role)
      .pipe(
        tap(),
        catchError(error => {
          console.error('Patch Error');
          throw error;
        })
      );
  }

  delete(idRole: number, idView: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${idRole}/${idView}`)
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
        key: ['idView', 'idRole'],
      },
      paginate: true,
      pageSize: 20
    });
  }

  getViewsByRole(id: number): Observable<any[]>{
    var res = this.http.get<IRoleView[]>(`${this.apiUrl}/${id}`);
    return res;
  }
}
