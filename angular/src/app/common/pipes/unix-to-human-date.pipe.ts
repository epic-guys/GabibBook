import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixToHumanDate'
})
export class UnixToHumanDatePipe implements PipeTransform {

  transform(seconds: any, ...args: unknown[]): any {
    if (!seconds) {
      return '0 seconds';
    }

    const secondsInt = parseInt(seconds);
    const days = Math.floor(secondsInt / (3600 * 24));
    const hours = Math.floor(secondsInt % (3600 * 24) / 3600);
    const minutes = Math.floor(secondsInt % 3600 / 60);
    const secondsLeft = secondsInt % 60;

    let result = '';
    if (days > 0) {
      result += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    if (secondsLeft > 0) {
      result += `${secondsLeft} second${secondsLeft > 1 ? 's' : ''} `;
    }

    return result;
  }

}