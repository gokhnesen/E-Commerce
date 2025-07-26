import { Pipe, PipeTransform } from "@angular/core";
import { ConfirmationToken } from "@stripe/stripe-js";

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  transform(value?: ConfirmationToken['shipping']): string {
    if (!value?.address || !value.name) {
      return 'Bilinmeyen adres';
    }

    const { line1, line2, city, country, postal_code } = value.address;
    
    if (!line1 || !city) {
      return 'Eksik adres bilgisi';
    }
    const addressParts = [
      value.name,
      line1,
      ...(line2 ? [line2] : []),
      ...(postal_code ? [`${postal_code} ${city}`] : [city]),
      ...(country && country !== 'TR' ? [country] : []) 
    ];

    return addressParts.join(', ');
  }
}