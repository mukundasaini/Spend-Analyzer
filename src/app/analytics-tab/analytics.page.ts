import { CommonModule, formatDate } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonRefresher, IonRefresherContent, IonAccordionGroup, IonAccordion, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonToggle } from '@ionic/angular/standalone';
import { CardsAnalyticsPage } from "./cards-analytics/cards-analytics.page";
import { collection, collectionData, Firestore, orderBy, query, where } from "@angular/fire/firestore";
import { Observable, of, Subject, takeUntil, tap } from "rxjs";
import { CardDetails } from '../Models/card-details.model';
import { AppConstants } from "../app.constants";
import { Expense } from "../Models/expense-model";
import { CategoriesAnalyticsPage } from "./categories-analytics/categories-analytics.page";
import { Category } from "../Models/category.model";
import { LoadingController } from '@ionic/angular';
import { CardsMonthlyAnalyticsPage } from "./cards-monthly-analytics/cards-monthly-analytics.page";
import { CardsYearlyAnalyticsPage } from "./cards-yearly-analytics/cards-yearly-analytics.page";

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss'],
  standalone: true,
  imports: [IonToggle, IonCol, IonRow, IonGrid, IonAccordion, IonAccordionGroup, IonSelect, IonSelectOption, IonRefresherContent, IonRefresher, IonItem, IonLabel,
    CommonModule, IonContent, IonTitle, IonToolbar, IonHeader,
    CardsAnalyticsPage, CategoriesAnalyticsPage, CardsMonthlyAnalyticsPage, CardsYearlyAnalyticsPage],
})
export class AnalyticsPage implements OnInit, OnDestroy {
  firestore: Firestore = inject(Firestore);
  inputCardDetails: CardDetails[] = [];
  inputCategories: Category[] = [];
  inputCardsYearMonthExpenses: Expense[] = [];
  inputCatsYearMonthExpenses: Expense[] = [];
  inputAllMonthsExpenses: Expense[] = [];
  inputAllYearsExpenses: Expense[] = [];

  expenseCollection = AppConstants.collections.expense;
  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;
  months = AppConstants.Months;
  expenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
  logPrefix: string = 'ANALYTICS_PAGE::: ';
  onDestroy$: Subject<void> = new Subject();

  hasCardsData: boolean = false;
  hasCatsData: boolean = false;
  presentMonth!: string;
  presentYear!: string;
  selectedCardMonth!: string;
  selectedCardYear!: string;
  selectedCatMonth!: string;
  selectedCatYear!: string;
  selectedAllMonthsYear!: string;
  years: string[] = [];
  hideCardsAnalytics: boolean = false;
  hideCatsAnalytics: boolean = false;
  hideAllMonthsAnalytics: boolean = false;

  constructor(private loadingCtrl: LoadingController) {
    console.log(this.logPrefix + "constructor");
    // this.showLoading();
    this.expenses$ = collectionData(
      query(collection(this.firestore, this.expenseCollection),
        where('isInclude', '==', true),
      )) as Observable<Expense[]>;

    this.cardDetails$ = (collectionData(
      query(collection(this.firestore, this.cardCollection),
        orderBy('id', 'desc')
      )) as Observable<CardDetails[]>);

    this.categories$ = (collectionData(
      query(
        collection(this.firestore, this.categoryCollection),
        orderBy('id', 'desc')
      )) as Observable<Category[]>);
  }
  ngOnDestroy(): void {
    console.log(this.logPrefix + "ngOnDestroy");
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');
    this.presentYear = dateValues[0];
    this.presentMonth = this.months.find(m => m.value == dateValues[1])?.name ?? "JAN";
    this.selectedCardMonth = dateValues[1];
    this.selectedCardYear = dateValues[0];
    this.selectedCatMonth = dateValues[1];
    this.selectedCatYear = dateValues[0];
    this.selectedAllMonthsYear = dateValues[0];
    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.inputAllYearsExpenses = expenses;
        this.years = this.inputAllYearsExpenses.map(item => item.year)
          .filter((value, index, self) => self.indexOf(value) === index).sort();
        this.inputAllMonthsExpenses = this.inputAllYearsExpenses.filter(exp => exp.year == dateValues[0]);
        this.inputCardsYearMonthExpenses = this.inputAllYearsExpenses.filter(exp => exp.year == dateValues[0] && exp.month == dateValues[1]);
        this.inputCatsYearMonthExpenses = this.inputCardsYearMonthExpenses;
      });

    this.cardDetails$.pipe(takeUntil(this.onDestroy$))
      .subscribe(cardTypes => {
        this.inputCardDetails = cardTypes;
        this.hasCardsData = this.inputCardDetails.length > 0;
      });

    this.categories$.pipe(takeUntil(this.onDestroy$))
      .subscribe(categories => {
        this.inputCategories = categories;
        this.hasCatsData = this.inputCategories.length > 0;
      });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Fetcing data...',
      duration: 3000,
      cssClass: 'custom-loading'
    });
    loading.present();
  }

  handleRefresh(event: any) {
    event.target.complete();
    window.location.reload();
  }

  onCardYearChange(event: any) {
    this.selectedCardYear = event.target.value;
    this.inputCardsYearMonthExpenses = this.inputAllYearsExpenses.filter(
      exp => exp.month == this.selectedCardMonth && exp.year == this.selectedCardYear);
  }

  onCardMonthChange(event: any) {
    this.selectedCardMonth = event.target.value;
    this.inputCardsYearMonthExpenses = this.inputAllYearsExpenses.filter(
      exp => exp.month == this.selectedCardMonth && exp.year == this.selectedCardYear);
  }

  onCatYearChange(event: any) {
    this.selectedCatYear = event.target.value;
    this.inputCatsYearMonthExpenses = this.inputAllYearsExpenses.filter(
      exp => exp.month == this.selectedCatMonth && exp.year == this.selectedCatYear);
  }

  onCatMonthChange(event: any) {
    this.selectedCatMonth = event.target.value;
    this.inputCatsYearMonthExpenses = this.inputAllYearsExpenses.filter(
      exp => exp.month == this.selectedCatMonth && exp.year == this.selectedCatYear);
  }

  onAllMonthsYearChange(event: any) {
    this.selectedAllMonthsYear = event.target.value;
    this.inputAllMonthsExpenses = this.inputAllYearsExpenses.filter(
      exp => exp.year == this.selectedAllMonthsYear);
  }

  showOrHideCardsAnalytics(event: any) {
    this.hideCardsAnalytics = event.target.checked;
  }

  showOrHideCatsAnalytics(event: any) {
    this.hideCatsAnalytics = event.target.checked;
  }

  showOrHideAllMonthsAnalytics(event: any) {
    this.hideAllMonthsAnalytics = event.target.checked;
  }
}
