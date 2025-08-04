import { Route } from "@angular/router";
import { authGuard } from "../../core/guards/auth-guard";
import { emptyCartGuard } from "../../core/guards/empty-cart-guard";
import { orderCompleteGuard } from "../../core/guards/order-complete-guard";
import { Checkout } from "./checkout";
import { CheckoutSuccess } from "./checkout-success/checkout-success";

export const checkoutRoutes: Route[] = [
        {path: '', component: Checkout, canActivate: [authGuard,emptyCartGuard]},
        {path: 'success', component: CheckoutSuccess, canActivate: [authGuard,orderCompleteGuard]},
]
  