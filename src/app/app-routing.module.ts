import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesGridComponent } from './roles-table/roles-grid.component';
import { DataGridComponent } from './ordersHeader-grid/ordersHeader-grid.component';
import { UsersTableComponent } from './users-table/users-table.component';

const routes: Routes = [
  { path: 'orders-header', component: DataGridComponent},
  { path: 'roles', component: RolesGridComponent},
  { path: 'users', component: UsersTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
