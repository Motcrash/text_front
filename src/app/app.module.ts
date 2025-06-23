import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { DataGridComponent } from './ordersHeader-grid/ordersHeader-grid.component';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RolesGridComponent } from './roles-table/roles-grid.component';
import { UsersTableComponent } from './users-table/users-table.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DataGridComponent,
    SidebarComponent,
    RolesGridComponent,
    UsersTableComponent
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
