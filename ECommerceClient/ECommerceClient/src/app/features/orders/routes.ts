import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { OrderComponent } from './order';
import { OrderDetailed } from './order-detailed/order-detailed';
export const orderRoutes: Routes = [
    { path: ':id', component: OrderDetailed, canActivate: [authGuard] },
    { path: '', component: OrderComponent, canActivate: [authGuard] },
];
