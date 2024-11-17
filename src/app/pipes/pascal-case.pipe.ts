import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    standalone: true,
    name: 'pascalcase',
})
export class PascalCasePipe implements PipeTransform {
    transform(value: string | undefined): string {
        if (value === undefined || value == null || value == '')
            return '';
        if (value.length <= 1)
            return value;
        value = value.trim();

        if (value.indexOf(' ') > -1) {
            let words = value.split(' ');
            value = words.reduce((p, c) => p + this.toPascalCase(c) + ' ', '');
            value = value.substring(0, value.length - 1);
            return value;
        }

        if (value.indexOf('/') > -1) {
            let words = value.split('/');
            value = words.reduce((p, c) => p + this.toPascalCase(c) + '/', '');
            value = value.substring(0, value.length - 1);
            return value;
        }

        return this.toPascalCase(value);
    }

    toPascalCase(value: string): string {
        let firstChar = value[0];
        let remaingChars = value.substring(1, value.length);
        return `${firstChar.toUpperCase() + remaingChars.toLowerCase()}`;
    }
}