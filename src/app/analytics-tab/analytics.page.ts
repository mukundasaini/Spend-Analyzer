import { CommonModule, formatDate } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonLabel, IonItem, IonRefresher, IonRefresherContent, IonAccordionGroup,
  IonAccordion, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonToggle
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

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss'],
  standalone: true,
  imports: [IonToggle, IonCol, IonRow, IonGrid, IonAccordion, IonAccordionGroup,
    IonSelect, IonSelectOption, IonRefresherContent, IonRefresher, IonItem, IonLabel,
    CommonModule, IonContent, IonTitle, IonToolbar, IonHeader,
    CardsAnalyticsPage, CategoriesAnalyticsPage, CardsMonthlyAnalyticsPage, CardsYearlyAnalyticsPage],
})
export class AnalyticsPage implements OnInit, OnDestroy {
  inputCardDetails: CardDetails[] = [];
  inputCategories: Category[] = [];
  inputCardsYearMonthExpenses: Expense[] = [];
  inputCatsYearMonthExpenses: Expense[] = [];
  inputAllMonthsExpenses: Expense[] = [];
  inputAllYearsExpenses: Expense[] = [];

  expenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
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
  months = AppConstants.Months;
  hideCardsAnalytics: boolean = false;
  hideCatsAnalytics: boolean = false;
  hideAllMonthsAnalytics: boolean = false;

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(AnalyticsPage.name, "constructor");
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
    this.selectedAllMonthsYear = this.selectedCatYear = this.selectedCardYear = this.presentYear = dateValues[0];
    this.presentMonth = this.utility.getMonthName(dateValues[1]);
    this.selectedCatMonth = this.selectedCardMonth = dateValues[1];

    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.inputAllYearsExpenses = expenses;
        this.years = this.utility.getYearsCheckBox(this.inputAllYearsExpenses).map(item => item.value);
        this.inputAllMonthsExpenses = this.utility.getCurrentMonthExpenses(this.inputAllYearsExpenses, true);
        this.inputCardsYearMonthExpenses = this.utility.getCurrentMonthExpenses(this.inputAllYearsExpenses);
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

  onAllMonthsYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onAllMonthsYearChange");
    this.selectedAllMonthsYear = event.target.value;
    this.inputAllMonthsExpenses = this.inputAllYearsExpenses.filter(
      exp => exp.year == this.selectedAllMonthsYear);
  }

  getExpensesByMonthYear(month: string, year: string) {
    return this.inputAllYearsExpenses.filter(
      exp => exp.month == month && exp.year == year);
  }
}
