import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import type { ContentReadyEvent } from 'devextreme/ui/data_grid';
import { DataGridService } from './data-grid.service';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css'],
  providers: [DataGridService],
})
export class DataGridComponent implements OnInit {
  dataSource!: DataSource;
  collapsed = false;
  isLoading = true; 
  hasError = false; 
  errorMessage = ''; 

  constructor(private service: DataGridService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.isLoading = true;
    this.hasError = false;
    
    this.dataSource = new DataSource({
      store: {
        type: 'array',
        data: [],
        key: 'salesOrderId'
      },
      paginate: true,
      pageSize: 10
    });

    this.service.getData().subscribe({
      next: (data) => {
        console.log('Datos cargados:', data.length, 'registros');
        
        if (data && Array.isArray(data) && data.length > 0) {
          this.dataSource = new DataSource({
            store: {
              type: 'array',
              data: data,
              key: 'salesOrderId'
            },
            paginate: true,
            pageSize: 20
          });
          
          this.isLoading = false;
        } else {
          this.hasError = true;
          this.errorMessage = 'No data available';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.hasError = true;
        this.errorMessage = 'There was an error loading the data. Please try again later';
        this.isLoading = false;
      }
    });
  }

  retryLoad() {
    this.loadData();
  }

  contentReady = (e: ContentReadyEvent) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow([1]);
    }
  };

  customizeTooltip = ({ originalValue }: Record<string, string>) => ({
     text: `${parseInt(originalValue)}%` 
  });
}