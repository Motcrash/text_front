import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

interface Role {
  idRole: number;
  roleName: string;
  description: string;
  active: boolean;
  createdBy: number;
  creationDatetime: Date;
  modifiedBy: number;
  modificationDatetime: Date;
}

@Injectable()
export class RolesService {
  private apiUrl = 'https://localhost:7229/api/Roles';
  constructor(private http: HttpClient) {}

  getData(): Observable<any[]>{
    var res = this.http.get<any[]>(this.apiUrl);
    return res;
  }

  create(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role)
      .pipe(
        tap(() => console.log('POST Success')),
        catchError(error => {
          throw error;
        })
      );
  }

  update(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}`, role)
      .pipe(
        tap(() => console.log('Patch Success')),
        catchError(error => {
          console.error('Patch Error');
          throw error;
        })
      );
  }

  delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`)
    .pipe(
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
        key: 'idRole',
      },
      paginate: true,
      pageSize: 20
    });
  }
}
