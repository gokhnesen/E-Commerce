import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { ProductDetails } from './features/products/product-details/product-details';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';
import { Login } from './features/account/login/login';
import { Register } from './features/account/register/register';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'product', component: Products},
    {path: 'product/:id', component: ProductDetails},
    {path: 'cart', component: Cart},
    {path: 'checkout', component: Checkout},
    {path: 'account/login', component: Login},
    {path: 'account/register', component: Register},



    {path: '**', redirectTo: '', pathMatch: 'full'},

];
