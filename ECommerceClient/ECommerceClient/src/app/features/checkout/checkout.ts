import { Component, inject, OnInit, AfterViewInit, OnDestroy, signal, ChangeDetectorRef } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripeService';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/accountService';
import { Address } from '../../shared/models/user';
import { CheckoutDelivery } from "./checkout-delivery/checkout-delivery";
import { CheckoutReview } from "./checkout-review/checkout-review";
import { CartService } from '../../core/services/cartService';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule}  from '@angular/material/progress-spinner'

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummary,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDelivery,
    CheckoutReview,
    CurrencyPipe,
    JsonPipe,
    MatProgressSpinnerModule
],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit, OnDestroy {

  private stripeService = inject(StripeService);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router)
  private accountService = inject(AccountService);
  cartService = inject(CartService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  completionStatus = signal<{address : boolean, card: boolean, delivery: boolean,}>({address: false, card:false, delivery:false})
  confirmationToken = signal<ConfirmationToken | undefined>(undefined);
  loading = false;

  constructor() {
    this.handleAddressChange = this.handleAddressChange.bind(this);
    
  }

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change',this.handleAddressChange);

      this.paymentElement = await this.stripeService.createPaymentElement()
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change',this.handlePaymentChange);
    } catch (error: any) {
      this.snackbar.open(error.message);
    }
  }

handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => ({
        ...state,
        address: event.complete  
    }));
}

handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => ({
        ...state,
        card: event.complete  
    }));
}

handleDeliveryChange(event: boolean) {
    this.completionStatus.update(state => ({
        ...state,
        delivery: event
    }));
}

  async getConfirmationToken(){
    try {
      if(Object.values(this.completionStatus()).every(status => status === true)){
        const result = await this.stripeService.createConfirmationToken();
        if(result.error) throw new Error(result.error.message);
        
        this.confirmationToken.set(result.confirmationToken);
        console.log('Token set:', this.confirmationToken());
      }
    } catch(error: any){
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
    if(event.selectedIndex === 3){
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper)
  {
    this.loading = true;
    try {
      if(this.confirmationToken){
        const result = await this.stripeService.confirmPayment(this.confirmationToken()!);
        if(result.error){
          throw new Error(result.error.message);
        } else{
          this.cartService.deleteCart();
          this.cartService.selectedDelivery.set(null);
          this.router.navigateByUrl('/checkout/success');

        }
      }
    } catch (error: any)  {
      this.snackbar.open(error.message || 'something went wrong');
      stepper.previous();
      
    } finally{
          this.loading = false;

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
