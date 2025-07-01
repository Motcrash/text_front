import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

interface User {
  idUser: number;
  firstName: string;
  lastName: string;
  active: boolean;
  vbadge: string;
  email: string;
  idRole: number;
  createdBy: string;
  creationDatetime: Date;
  modifiedBy: number;
  modificationDatetime: Date;
}

@Injectable()
export class UsersTableService {
  private apiUrl = 'https://localhost:7229/api/users';
  constructor(private http: HttpClient) {}

  getData(): Observable<any[]>{
    var res = this.http.get<any[]>(this.apiUrl);
    return res;
  }

  create(role: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, role)
      .pipe(
        tap(() => console.log('POST Success')),
        catchError(error => {
          console.error('Create Error');
          throw error;
        })
      );
  }

  update(id: number, role: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, role)
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
        key: 'idUser',
      },
      paginate: true,
      pageSize: 20
    });
  }
}
