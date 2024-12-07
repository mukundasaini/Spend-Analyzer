import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { APPCOLORS, AppConstants, GROUPBY } from '../app.constants';
import { LoggerService } from './logger.service';
import { Category } from '../Models/category.model';
import { CardDetails } from '../Models/card-details.model';
import { Expense } from '../Models/expense-model';
import { formatDate } from '@angular/common';
import { CheckBox } from '../Models/checkbox.model';
import { Bank } from '../Models/bank.model';
import { CardType } from '../Models/card-type.model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;

  constructor(private logger: LoggerService,
    private toastController: ToastController) {
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

  getRandomColor(): string {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getRandomColors(count: number): string[] {
    let colors: string[] = [];
    for (let index = 0; index < count; index++) {
      colors.push(this.getRandomColor());
    }
    return colors;
  }

  getRandomColorRGBA(opacity: number) {
    let hexCode = this.getRandomColor();
    var r = parseInt(hexCode.slice(1, 3), 16),
      g = parseInt(hexCode.slice(3, 5), 16),
      b = parseInt(hexCode.slice(5, 7), 16);

    if (opacity > 0) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  getCategory(cats: Category[], id: string) {
    return cats?.find(x => x.id == id)?.name ?? '';
  }

  getcard(cards: CardDetails[], id: string) {
    return cards?.find(x => x.id == id)?.cardType ?? '';
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

  getBankNamesCheckBox(cards: Bank[]) {
    let bankNames: CheckBox[] = [];
    cards.map(item => item.name)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach(bankName => {
        bankNames.push({ value: bankName, checked: false });
      });
    return bankNames;
  }

  getCardTypesCheckBox(cards: CardType[]) {
    let cardTypes: CheckBox[] = [];
    cards.map(item => item.name)
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

  expenseGroupBy(expenses: Expense[], option: GROUPBY) {
    var groups: Record<string, Expense[]> = <Record<string, Expense[]>>{};
    switch (option) {
      case GROUPBY.card:
        groups = this.groupBy(expenses, e => e.cardTypeId);
        break;
      case GROUPBY.cat:
        groups = this.groupBy(expenses, e => e.categoryId);
        break;
      case GROUPBY.month:
        groups = this.groupBy(expenses, e => e.month);
        break;
      case GROUPBY.year:
        groups = this.groupBy(expenses, e => e.year);
        break;
      case GROUPBY.day:
        groups = this.groupBy(expenses, e => e.date);
        break;
    }
    return groups;
  }

  getRandomIonColor() {
    let colors = [APPCOLORS.primary, APPCOLORS.secondary, APPCOLORS.success, APPCOLORS.danger,
    APPCOLORS.warning, APPCOLORS.medium, APPCOLORS.dark, APPCOLORS.tertiary, APPCOLORS.light];
    return colors[Math.floor(Math.random() * 9)]
  }


  /** Business logic */

  /** Ionic */
  async presentToast(messageType: string, message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      cssClass: 'custom-toast-' + messageType,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        },
      ]
    });

    await toast.present();
  }

  handleRefresh(event: any) {
    this.logger.trackEventCalls(UtilityService.name, 'handleRefresh');
    event.target.complete();
    window.location.reload();
  }

  getRandomStyleChip() {
    let background = this.getRandomColorRGBA(0.8);
    return { background: background, color: 'white' };
  }
  /** Ionic */
}
