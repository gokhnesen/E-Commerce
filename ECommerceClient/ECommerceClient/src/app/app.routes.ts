import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { ProductDetails } from './features/products/product-details/product-details';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';
import { Login } from './features/account/login/login';
import { Register } from './features/account/register/register';
import { authGuard } from './core/guards/auth-guard';
import { emptyCartGuard } from './core/guards/empty-cart-guard';
import { CheckoutSuccess } from './features/checkout/checkout-success/checkout-success';
import { OrderComponent } from './features/orders/order';
import { OrderDetailed } from './features/orders/order-detailed/order-detailed';
import { orderCompleteGuard } from './core/guards/order-complete-guard';
import { Admin } from './features/admin/admin';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'product', component: Products},
    {path: 'product/:id', component: ProductDetails},
    {path: 'cart', component: Cart},
    {path: 'checkout', component: Checkout, canActivate: [authGuard,emptyCartGuard]},
    {path: 'checkout/success', component: CheckoutSuccess, canActivate: [authGuard,orderCompleteGuard]},
    {path: 'order/:id', component: OrderDetailed, canActivate: [authGuard]},
    {path: 'orders', component: OrderComponent, canActivate: [authGuard]},
    {path: 'admin', component: Admin, canActivate: [authGuard, adminGuard]},



    {path: 'account/login', component: Login},
    {path: 'account/register', component: Register},



    {path: '**', redirectTo: '', pathMatch: 'full'},

];
