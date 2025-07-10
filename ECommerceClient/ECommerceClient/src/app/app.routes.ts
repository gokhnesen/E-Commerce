import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { ProductDetails } from './features/products/product-details/product-details';
import { Cart } from './features/cart/cart';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'product', component: Products},
    {path: 'product/:id', component: ProductDetails},
    {path: 'cart', component: Cart},

    {path: '**', redirectTo: '', pathMatch: 'full'},

];
