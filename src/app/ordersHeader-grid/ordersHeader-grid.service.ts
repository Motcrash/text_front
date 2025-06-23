import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

@Injectable()
export class DataGridService {
  private apiUrl = 'https://localhost:7229/api/SalesOrderHeader';
  constructor(private http: HttpClient) {}

  getData(): Observable<any[]>{
    var res = this.http.get<any[]>(this.apiUrl);
    return res;
  }

  createDataSource(data: any[]): DataSource {
    return new DataSource({
      store: {
        type: 'array',
        data: data,
        key: 'SalesOrderID',
      },
      paginate: true,
      pageSize: 20
    });
  }
}
