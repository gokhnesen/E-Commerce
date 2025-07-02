import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { ProductDetails } from './features/products/product-details/product-details';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'product', component: Products},
    {path: 'product/:id', component: ProductDetails},
    {path: '**', redirectTo: '', pathMatch: 'full'},

];
