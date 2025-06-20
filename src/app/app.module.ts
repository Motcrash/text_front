import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { DataGridComponent } from './data-grid/data-grid.component';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DataGridComponent,
    SidebarComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
