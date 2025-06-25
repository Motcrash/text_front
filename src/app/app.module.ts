import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { OrdersHeaderComponent } from './ordersHeader-grid/ordersHeader-grid.component';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RolesGridComponent } from './roles-table/roles-grid.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { RoleViewsComponent } from './roleViews/roleViews-table.component';

import { DxBulletModule,
  DxDataGridModule,
  DxSelectBoxModule,
  DxTemplateModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OrdersHeaderComponent,
    SidebarComponent,
    RolesGridComponent,
    UsersTableComponent,
    RoleViewsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
    DxSelectBoxModule,
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }