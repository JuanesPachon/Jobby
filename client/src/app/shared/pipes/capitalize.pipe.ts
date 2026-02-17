import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalize',
    standalone: true,
})
export class CapitalizePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';

        const lowerCased = value.toLowerCase();

        return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
    }
}
