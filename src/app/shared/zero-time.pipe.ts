import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroTime'
})
export class ZeroTimePipe implements PipeTransform {

  transform(value: Date | string): string {
    const date = new Date(value);
    return date.toISOString().split('T')[0];
  }

}
