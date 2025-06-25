import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesGridComponent } from './roles-table/roles-grid.component';
import { OrdersHeaderComponent } from './ordersHeader-grid/ordersHeader-grid.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { RoleViewsComponent } from './roleViews/roleViews-table.component';

const routes: Routes = [
  { path: 'orders-header', component: OrdersHeaderComponent},
  { path: 'roles', component: RolesGridComponent},
  { path: 'users', component: UsersTableComponent},
  { path: 'role-views', component: RoleViewsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
