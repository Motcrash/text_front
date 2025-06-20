import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

@Injectable()
export class DataGridService {
  private apiUrl = 'https://localhost:7229/api/SalesOrderHeader';
  constructor(private http: HttpClient) {}

  getData(): Observable<any[]>{
    var res = this.http.get<any[]>(this.apiUrl);
    console.log('Llamada a la API:', res);
    return res;
    
  }

  // Método para crear DataSource con datos
  createDataSource(data: any[]): DataSource {
    return new DataSource({
      store: {
        type: 'array',
        data: data, // Aquí van los datos reales
        key: 'SalesOrderID', // Asegúrate de que coincida con tu campo ID
      },
      paginate: true,
      pageSize: 20
    });
  }
}
