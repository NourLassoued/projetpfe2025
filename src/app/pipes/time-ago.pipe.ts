import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe  implements PipeTransform {
  transform(value: number[] | Date | string): string {
    let date: Date;

    // Si value est un tableau, on crée une date avec ses composants
    if (Array.isArray(value)) {
      const [year, month, day, hour, minute, second] = value;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(value);
    }

    // Vérifie si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide'; // Retourne une valeur par défaut en cas de date invalide
    }

    // Si la date est valide, on calcule la distance temporelle
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }

}
