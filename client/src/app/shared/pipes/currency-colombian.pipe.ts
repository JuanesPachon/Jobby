import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyColombianPipe',
  standalone: true
})
export class CurrencyColombianPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '$0';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }
}