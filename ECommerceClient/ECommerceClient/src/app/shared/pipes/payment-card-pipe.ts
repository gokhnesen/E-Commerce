import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paymentCard' })
export class PaymentCardPipe implements PipeTransform {
  transform(paymentData: any): string {
    console.log('Pipe Girdisi:', paymentData);

    if (!paymentData) return 'Ödeme bilgisi bekleniyor...';

    const card = paymentData.card || paymentData.payment_method?.card;
    if (!card?.last4) return 'Kart bilgisi eksik';

    return `💳 ${card.brand?.toUpperCase()} **** ${card.last4} (${card.exp_month}/${card.exp_year})`;
  }
}