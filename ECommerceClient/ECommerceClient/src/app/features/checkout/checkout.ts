import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripeService';
import { StripeAddressElement } from '@stripe/stripe-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/accountService';
import { Address } from '../../shared/models/user';
import { CheckoutDelivery } from "./checkout-delivery/checkout-delivery";

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummary,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDelivery
],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit, OnDestroy {

  private stripeService = inject(StripeService);
  private snackbar = inject(MatSnackBar);
  private accountService = inject(AccountService);
  addressElement?: StripeAddressElement;
  saveAddress = false;

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
    } catch (error: any) {
      this.snackbar.open(error.message);
    }
  }

  async onStepChange(event: StepperSelectionEvent){
    if(event.selectedIndex === 1){
      if(this.saveAddress){
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));

      }
    }
    if(event.selectedIndex === 2){
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
  }
  private async getAddressFromStripeAddress() : Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if(address){
      return{
        line1: address.line1,
        line2: address.line2 || '',
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postal_code || ''

      }
    } else return null;
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange){
    this.saveAddress = event.checked;

  }

  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }

}
