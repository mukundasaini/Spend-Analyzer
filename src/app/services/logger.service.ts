import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;

  constructor() { }

  trackEventCalls(title: string, value: any) {
    console.info(`${title}:`, value);
  }

  trackErrors(title: string, error: any) {
    console.error(`${title}:`, error);
  }
}
