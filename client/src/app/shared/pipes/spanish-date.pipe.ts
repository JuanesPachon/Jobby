import { Pipe, PipeTransform } from '@angular/core';

export type DateFormat = 'full' | 'short' | 'medium';

@Pipe({
  name: 'spanishDate',
  standalone: true
})
export class SpanishDatePipe implements PipeTransform {

  transform(value: string | Date | null | undefined, format: DateFormat = 'short'): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (isNaN(date.getTime())) {
      return '';
    }

    switch (format) {
      case 'full':
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      
      case 'medium':
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      
      case 'short':
      default:
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long'
        });
    }
  }
}