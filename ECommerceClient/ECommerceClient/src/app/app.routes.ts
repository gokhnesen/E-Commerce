import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { ProductDetails } from './features/products/product-details/product-details';
import { Cart } from './features/cart/cart';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'product', component: Products},
    {path: 'product/:id', component: ProductDetails},
    {path: 'cart', component: Cart},
    {path: 'checkout', loadChildren: () => import('./features/checkout/routes').then(m => m.checkoutRoutes)},
    {path: 'order', loadChildren: () => import('./features/orders/routes').then(m => m.orderRoutes)},
    {path: 'admin', loadComponent: () => import('./features/admin/admin').then(c => c.Admin),
        canActivate: [authGuard, adminGuard]},
    {path: 'account', loadChildren: () => import('./features/account/routes').then(m => m.accountRoutes)},

    {path: '**', redirectTo: '', pathMatch: 'full'},

];
