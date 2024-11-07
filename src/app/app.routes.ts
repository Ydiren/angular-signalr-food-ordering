import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { KitchenComponent } from './kitchen/kitchen.component';

export const routes: Routes = [
  { path: 'customers', component: CustomersComponent },
  { path: 'kitchen', component: KitchenComponent }
];
