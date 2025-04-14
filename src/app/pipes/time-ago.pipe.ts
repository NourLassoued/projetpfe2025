import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe  implements PipeTransform {
  transform(value: number[] | Date | string): string {
    let date: Date;

    if (Array.isArray(value)) {
      const [year, month, day, hour, minute, second] = value;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(value);
    }

    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }
}
