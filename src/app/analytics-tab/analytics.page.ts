import { CommonModule, formatDate } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonLabel, IonItem, IonRefresher, IonRefresherContent, IonSelect, IonSelectOption,
  IonGrid, IonRow, IonCol, IonToggle, IonButton, IonButtons, IonBadge, IonIcon, IonModal,
  IonSegmentButton, IonCheckbox, IonSegment, IonRadio, IonRadioGroup, IonPopover
} from '@ionic/angular/standalone';
import { CardsAnalyticsPage } from "./cards-analytics/cards-analytics.page";
import { Observable, Subject, takeUntil } from "rxjs";
import { CardDetails } from '../Models/card-details.model';
import { AppConstants } from '../app.constants';
import { Expense } from "../Models/expense-model";
import { CategoriesAnalyticsPage } from "./categories-analytics/categories-analytics.page";
import { Category } from "../Models/category.model";
import { CardsMonthlyAnalyticsPage } from "./cards-monthly-analytics/cards-monthly-analytics.page";
import { CardsYearlyAnalyticsPage } from "./cards-yearly-analytics/cards-yearly-analytics.page";
import { FirebaseService } from "../services/firebase.service";
import { LoggerService } from "../services/logger.service";
import { UtilityService } from "../services/utility.service";
import { DailyAnalyticsPage } from "./daily-analytics/daily-analytics.page";
import { addIcons } from "ionicons";
import { filter } from "ionicons/icons";

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss'],
  standalone: true,
  imports: [IonPopover, IonRadioGroup, IonRadio, IonBadge, IonIcon, IonButtons, IonButton, CommonModule,
    IonHeader, IonToolbar, IonContent, IonTitle,
    IonRefresher, IonRefresherContent, IonItem, IonGrid,
    IonRow, IonCol, IonLabel, IonSelect, IonSelectOption, IonToggle,
    CardsAnalyticsPage, CategoriesAnalyticsPage, CardsMonthlyAnalyticsPage, DailyAnalyticsPage, CardsYearlyAnalyticsPage],
})
export class AnalyticsPage implements OnInit, OnDestroy {
  inputCardDetails: CardDetails[] = [];
  cardDetailsCopy: CardDetails[] = [];
  inputCategories: Category[] = [];
  inputMonthExpenses: Expense[] = [];
  inputCardsYearMonthExpenses: Expense[] = [];
  inputCatsYearMonthExpenses: Expense[] = [];
  inputAllMonthsExpenses: Expense[] = [];
  inputAllYearsExpenses: Expense[] = [];
  expensesCopy: Expense[] = [];

  expenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
  onDestroy$: Subject<void> = new Subject();

  hasCardsData: boolean = false;
  hasCatsData: boolean = false;
  presentMonth!: string;
  presentYear!: string;
  selectedMonth!: string;
  selectedYear!: string;
  selectedCardMonth!: string;
  selectedCardYear!: string;
  selectedCatMonth!: string;
  selectedCatYear!: string;
  selectedAllMonthsYear!: string;
  years: string[] = [];
  debitCardIds: string[] = [];
  creditCardIds: string[] = [];
  months = AppConstants.Months;
  hideMonthAnalytics: boolean = false;
  hideCardsAnalytics: boolean = false;
  hideCatsAnalytics: boolean = false;
  hideAllMonthsAnalytics: boolean = false;
  selectedAnalytics: string = 'A';
  analyticsFilterIndeicator: string = '';

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(AnalyticsPage.name, "constructor");
    addIcons({ filter });
    this.expenses$ = this.firebase.getIncludeExpenses();
    this.cardDetails$ = this.firebase.getCardsOrderByID();
    this.categories$ = this.firebase.getCategoriesOrderByID();
  }

  ngOnDestroy(): void {
    this.logger.trackEventCalls(AnalyticsPage.name, "ngOnDestroy");
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(AnalyticsPage.name, "ngOnInit");
    this.utility.showLoading();
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');
    this.selectedAllMonthsYear = this.selectedCatYear = this.selectedCardYear = this.presentYear = this.selectedYear = dateValues[0];
    this.presentMonth = this.utility.getMonthName(dateValues[1]);
    this.selectedCatMonth = this.selectedCardMonth = this.selectedMonth = dateValues[1];

    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.inputAllYearsExpenses = expenses;
        this.expensesCopy = expenses;
        this.years = this.utility.getYearsCheckBox(this.inputAllYearsExpenses).map(item => item.value);
        this.inputAllMonthsExpenses = this.utility.getCurrentMonthExpenses(this.inputAllYearsExpenses, true);
        this.inputMonthExpenses = this.utility.getCurrentMonthExpenses(this.inputAllYearsExpenses);
        this.inputCardsYearMonthExpenses = Array.from(this.inputMonthExpenses);
        this.inputCatsYearMonthExpenses = Array.from(this.inputMonthExpenses);
      });

    this.cardDetails$.pipe(takeUntil(this.onDestroy$))
      .subscribe(cardTypes => {
        this.inputCardDetails = cardTypes;
        this.cardDetailsCopy = cardTypes;
        this.hasCardsData = this.inputCardDetails.length > 0;
        this.debitCardIds = cardTypes.filter(card => ['DEBIT', 'FOOD']
          .includes(card.type.trim().toUpperCase()))
          .map(card => card.id);
        this.creditCardIds = cardTypes.filter(card => ['CREDIT', 'AMAZON', 'RUPAY']
          .includes(card.type.trim().toUpperCase())).map(card => card.id);
      });

    this.categories$.pipe(takeUntil(this.onDestroy$))
      .subscribe(categories => {
        this.inputCategories = categories;
        this.hasCatsData = this.inputCategories.length > 0;
      });
  }

  onAnalyticsFilterChange(ev: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onAnalyticsFilterChange");
    this.selectedAnalytics = ev.target.value;
    this.analyticsFilterIndeicator = this.selectedAnalytics === 'A' ? '' : '.';
    let expenses = this.setAnalyticsFilter();
    this.inputAllYearsExpenses = expenses;
    this.inputAllMonthsExpenses = this.utility.getCurrentMonthExpenses(expenses, true);
    this.inputMonthExpenses = this.utility.getCurrentMonthExpenses(expenses);
    this.inputCardsYearMonthExpenses = Array.from(this.inputMonthExpenses);
    this.inputCatsYearMonthExpenses = Array.from(this.inputMonthExpenses);
  }

  setAnalyticsFilter() {
    this.logger.trackEventCalls(AnalyticsPage.name, "setAnalyticsFilter");
    let expenses = this.expensesCopy;
    this.inputCardDetails = this.cardDetailsCopy;
    if (this.selectedAnalytics === 'C') {
      expenses = expenses.filter(e => this.creditCardIds.includes(e.cardTypeId));
      this.inputCardDetails = this.inputCardDetails.filter(card => this.creditCardIds.includes(card.id));
    } else if (this.selectedAnalytics === 'D') {
      expenses = expenses.filter(e => this.debitCardIds.includes(e.cardTypeId));
      this.inputCardDetails = this.inputCardDetails.filter(card => this.debitCardIds.includes(card.id));
    }
    return expenses;
  }

  onCardYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardYearChange");
    this.selectedCardYear = event.target.value;
    this.inputCardsYearMonthExpenses = this.getExpensesByMonthYear(this.selectedCardMonth, this.selectedCardYear);
  }

  onCardMonthChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardMonthChange");
    this.selectedCardMonth = event.target.value;
    this.inputCardsYearMonthExpenses = this.getExpensesByMonthYear(this.selectedCardMonth, this.selectedCardYear);
  }

  onCatYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCatYearChange");
    this.selectedCatYear = event.target.value;
    this.inputCatsYearMonthExpenses = this.getExpensesByMonthYear(this.selectedCatMonth, this.selectedCatYear);
  }

  onCatMonthChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCatMonthChange");
    this.selectedCatMonth = event.target.value;
    this.inputCatsYearMonthExpenses = this.getExpensesByMonthYear(this.selectedCatMonth, this.selectedCatYear);
  }

  onYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onMonthYearChange");
    this.selectedYear = event.target.value;
    this.inputMonthExpenses = this.getExpensesByMonthYear(this.selectedMonth, this.selectedYear);
  }

  onMonthChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onMonthMonthChange");
    this.selectedMonth = event.target.value;
    this.inputMonthExpenses = this.getExpensesByMonthYear(this.selectedMonth, this.selectedYear);
  }

  onAllMonthsYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onAllMonthsYearChange");
    this.selectedAllMonthsYear = event.target.value;
    this.inputAllMonthsExpenses= this.setAnalyticsFilter();
    this.inputAllMonthsExpenses = this.inputAllYearsExpenses.filter(
      exp => exp.year == this.selectedAllMonthsYear);
  }

  getExpensesByMonthYear(month: string, year: string) {
    this.inputAllYearsExpenses= this.setAnalyticsFilter();
    return this.inputAllYearsExpenses.filter(
      exp => exp.month == month && exp.year == year);
  }
}
