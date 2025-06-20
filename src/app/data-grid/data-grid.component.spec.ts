import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import DataSource from 'devextreme/data/data_source';
import { DxBulletModule, DxTemplateModule } from 'devextreme-angular';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import type { ContentReadyEvent } from 'devextreme/ui/data_grid';
import { DataGridService } from './data-grid.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css'],
  providers: [DataGridService],
})
export class AppComponent {
retryLoad() {
throw new Error('Method not implemented.');
}
  dataSource!: DataSource;

  collapsed = false;
  contentReady = (e: ContentReadyEvent) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow(['EnviroCare']);
    }
  };

  customizeTooltip = ({ originalValue }: Record<string, string>) => ({ text: `${parseInt(originalValue)}%` });
hasError: any;
isLoading: any;
errorMessage: any;

  constructor(service: DataGridService) {
    this.dataSource = service.getDataSource();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
