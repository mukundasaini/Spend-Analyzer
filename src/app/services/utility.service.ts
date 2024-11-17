import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AppConstants } from '../app.constants';
import { LoggerService } from './logger.service';
import { Category } from '../Models/category.model';
import { CardDetails } from '../Models/card-details.model';
import { Expense } from '../Models/expense-model';
import { formatDate } from '@angular/common';
import { CheckBox } from '../Models/checkbox.model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;
  loading: Promise<HTMLIonLoadingElement>;

  constructor(private logger: LoggerService, loadingCtrl: LoadingController,
    private alertController: AlertController) {
    this.loading = loadingCtrl.create({
      message: 'Fetcing data...',
      duration: 2000,
      cssClass: 'custom-loading'
    });
  }


  /** Business logic */
  getPercentage(value: number, total: number) {
    return ((value / total) * 100).toFixed(2) + '%';
  }

  onKeyPress(value: string, minLength: number) {
    if (value.length > minLength)
      return false;
    return true;
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getCategory(cats: Category[], id: string) {
    return cats?.find(x => x.id == id)?.name ?? '';
  }

  getcard(cards: CardDetails[], id: string) {
    let card = cards?.find(x => x.id == id);
    return `${card?.bankName} - ${card?.type}`;
  }

  getCardDetails(cards: CardDetails[], id: string) {
    return cards?.find(x => x.id == id);
  }

  getMonthName(value: string) {
    return AppConstants.Months.find(m => m.value == value)?.name ?? '';
  }

  getCurrentMonthExpenses(expenses: Expense[], onlyYear: boolean = false): Expense[] {
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');
    let result = onlyYear ? expenses.filter(ex => ex.year == dateValues[0])
      : expenses.filter(ex => ex.year == dateValues[0] && ex.month == dateValues[1]);
    return result.sort((a, b) => new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime());
  }

  getYearsCheckBox(expenses: Expense[]) {
    let years: CheckBox[] = [];
    expenses.map(item => item.year)
      .filter((value, index, self) => self.indexOf(value) === index).forEach(year => {
        years.push({ value: year, checked: false });
      });
    years = years.sort((a, b) => parseInt(a.value) - parseInt(b.value));
    return years;
  }

  getBankNamesCheckBox(cards: CardDetails[]) {
    let bankNames: CheckBox[] = [];
    cards.map(item => item.bankName)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach(bankName => {
        bankNames.push({ value: bankName, checked: false });
      });
    return bankNames;
  }

  getCardTypesCheckBox(cards: CardDetails[]) {
    let cardTypes: CheckBox[] = [];
    cards.map(item => item.type)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach(bankName => {
        cardTypes.push({ value: bankName, checked: false });
      });
    return cardTypes;
  }

  getCategoriesCheckBox(cats: Category[]) {
    let categories: CheckBox[] = [];
    cats.forEach(category => {
      categories.push({ value: category.id, name: category.name, checked: false });
    });
    return categories;
  }

  getMonthsCheckBox() {
    let months: CheckBox[] = [];
    AppConstants.Months.forEach(month => {
      months.push({ value: month.value, name: month.name, checked: false });
    });
    return months;
  }

  getTotal(expenses: Expense[]) {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  expenseGroupBy(expenses: Expense[], option: string) {
    var groups: Record<string, Expense[]> = <Record<string, Expense[]>>{};
    switch (option) {
      case 'card':
        groups = this.groupBy(expenses, e => e.cardTypeId);
        break;
      case 'cat':
        groups = this.groupBy(expenses, e => e.categoryId);
        break;
      case 'month':
        groups = this.groupBy(expenses, e => e.month);
        break;
      case 'year':
        groups = this.groupBy(expenses, e => e.year);
        break;
      case 'day':
        groups = this.groupBy(expenses, e => e.date);
        break;
    }
    return groups;
  }


  /** Business logic */

  /** Ionic */
  async showLoading() {
    this.logger.trackEventCalls(UtilityService.name, 'showLoading');
   // (await this.loading).present();
  }

  async presentAlert(alertHeader: string, alertMessage: string, exption?: any) {
    this.logger.trackEventCalls(UtilityService.name, 'presentAlert');
    this.logger.trackEventCalls(UtilityService.name, alertMessage);

    if (exption != undefined)
      this.logger.trackErrors(UtilityService.name, exption);

    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: ['Close'],
      cssClass: 'alert-custom',

    });

    await alert.present();
  }

  handleRefresh(event: any) {
    this.logger.trackEventCalls(UtilityService.name, 'handleRefresh');
    event.target.complete();
    window.location.reload();
  }
  /** Ionic */
}
