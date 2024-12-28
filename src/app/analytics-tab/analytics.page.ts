import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonLabel, IonItem, IonRefresher, IonRefresherContent, IonSelect, IonSelectOption,
  IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';
import { CardsAnalyticsPage } from "./cards-analytics/cards-analytics.page";
import { Observable, Subject, takeUntil } from "rxjs";
import { CardDetails } from '../Models/card-details.model';
import { AppConstants } from '../app.constants';
import { Expense } from '../Models/expense-model';
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
import { Settings } from "../Models/settings.model";

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss'],
  standalone: true,
  imports: [CommonModule,
    IonHeader, IonToolbar, IonContent, IonTitle,
    IonRefresher, IonRefresherContent, IonItem, IonGrid,
    IonRow, IonCol, IonLabel, IonSelect, IonSelectOption,
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
  settings$: Observable<Settings[]>;
  onDestroy$: Subject<void> = new Subject();

  hasCardsData: boolean = false;
  hasCatsData: boolean = false;
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
  cardTypes = AppConstants.CardTypes;
  hideMonthAnalytics: boolean = true;
  hideCardsAnalytics: boolean = true;
  hideCatsAnalytics: boolean = true;
  hideAllMonthsAnalytics: boolean = true;
  hideAllYearsAnalytics: boolean = true;
  selectedCardTypeCat: string = 'ALL';
  selectedCardTypeCard: string = 'ALL';
  selectedCardTypeMonth: string = 'ALL';
  selectedCardTypeYear: string = 'ALL';
  selectedCardTypeYears: string = 'ALL';
  selectedAllyearsMonth: string = 'ALL';
  settings: Settings[] = [];

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(AnalyticsPage.name, "constructor");
    addIcons({ filter });
    this.expenses$ = this.firebase.getIncludeExpenses();
    this.cardDetails$ = this.firebase.getCardsOrderByID();
    this.categories$ = this.firebase.getCategoriesOrderByID();
    this.settings$ = this.firebase.getSettings();
  }

  ngOnDestroy(): void {
    this.logger.trackEventCalls(AnalyticsPage.name, "ngOnDestroy");
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(AnalyticsPage.name, "ngOnInit");
    this.selectedAllMonthsYear = this.selectedCatYear = this.selectedCardYear = this.selectedYear = this.utility.getCurrentYear();
    this.selectedCatMonth = this.selectedCardMonth = this.selectedMonth = this.utility.getCurrentMonth();
    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.expensesCopy = this.inputAllYearsExpenses = expenses;
        this.years = this.utility.getYearsCheckBox(expenses).map(item => item.value);
        this.inputAllMonthsExpenses = this.utility.getExpensesByYearOrMonth(expenses, undefined, this.utility.getCurrentYear());
        this.inputMonthExpenses = this.utility.getExpensesByYearOrMonth(expenses);
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

    this.settings$.pipe(takeUntil(this.onDestroy$))
      .subscribe(settings => {
        this.settings = settings;
        this.hideMonthAnalytics = !this.settings.find(s => s.key == AppConstants.settings.EDA)?.value;
        this.hideCardsAnalytics = !this.settings.find(s => s.key == AppConstants.settings.ECDA)?.value;
        this.hideCatsAnalytics = !this.settings.find(s => s.key == AppConstants.settings.ECTA)?.value;
        this.hideAllMonthsAnalytics = !this.settings.find(s => s.key == AppConstants.settings.EMA)?.value;
        this.hideAllYearsAnalytics = !this.settings.find(s => s.key == AppConstants.settings.EYA)?.value;
      });
  }

  onCardTypeChangeCat(ev: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardTypeChangeCat");
    this.selectedCardTypeCat = ev.target.value;
    this.inputCatsYearMonthExpenses = this.utility.getExpensesByYearOrMonth(
      this.setAnalyticsFilter(this.selectedCardTypeCat), this.selectedCatMonth, this.selectedCatYear);
  }

  onCardTypeChangeCard(ev: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardTypeChangeCard");
    this.selectedCardTypeCard = ev.target.value;
    this.inputCardsYearMonthExpenses = this.utility.getExpensesByYearOrMonth(
      this.setAnalyticsFilter(this.selectedCardTypeCard), this.selectedCardMonth, this.selectedCardYear);
  }

  onCardTypeChangeMonth(ev: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardTypeChangeMonth");
    this.selectedCardTypeMonth = ev.target.value;
    this.inputMonthExpenses = this.utility.getExpensesByYearOrMonth(
      this.setAnalyticsFilter(this.selectedCardTypeMonth), this.selectedMonth, this.selectedYear);
  }

  onCardTypeChangeYear(ev: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardTypeChangeYear");
    this.selectedCardTypeYear = ev.target.value;
    this.inputAllMonthsExpenses = this.utility.getExpensesByYearOrMonth(
      this.setAnalyticsFilter(this.selectedCardTypeYear), undefined, this.selectedAllMonthsYear);
  }

  onCardTypeChangeYears(ev: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardTypeChangeYears");
    this.selectedCardTypeYears = ev.target.value;
    this.inputAllYearsExpenses = this.selectedAllyearsMonth === 'ALL' ? this.setAnalyticsFilter(this.selectedCardTypeYears)
      : this.utility.getExpensesByYearOrMonth(
        this.setAnalyticsFilter(this.selectedCardTypeYears), this.selectedAllyearsMonth, undefined);
  }

  setAnalyticsFilter(cardType: string) {
    this.logger.trackEventCalls(AnalyticsPage.name, "setAnalyticsFilter");
    let expenses = this.expensesCopy;
    this.inputCardDetails = this.cardDetailsCopy;
    if (cardType === 'C') {
      expenses = expenses.filter(e => this.creditCardIds.includes(e.cardTypeId));
      this.inputCardDetails = this.inputCardDetails.filter(card => this.creditCardIds.includes(card.id));
    } else if (cardType === 'D') {
      expenses = expenses.filter(e => this.debitCardIds.includes(e.cardTypeId));
      this.inputCardDetails = this.inputCardDetails.filter(card => this.debitCardIds.includes(card.id));
    }
    return expenses;
  }

  onCardYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardYearChange");
    this.selectedCardYear = event.target.value;
    this.inputCardsYearMonthExpenses = this.utility.getExpensesByYearOrMonth(this.setAnalyticsFilter(this.selectedCardTypeCard),
      this.selectedCardMonth, this.selectedCardYear);
  }

  onCardMonthChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCardMonthChange");
    this.selectedCardMonth = event.target.value;
    this.inputCardsYearMonthExpenses = this.utility.getExpensesByYearOrMonth(this.setAnalyticsFilter(this.selectedCardTypeCard),
      this.selectedCardMonth, this.selectedCardYear);
  }

  onCatYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCatYearChange");
    this.selectedCatYear = event.target.value;
    this.inputCatsYearMonthExpenses = this.utility.getExpensesByYearOrMonth(this.setAnalyticsFilter(this.selectedCardTypeCat),
      this.selectedCatMonth, this.selectedCatYear);
  }

  onCatMonthChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onCatMonthChange");
    this.selectedCatMonth = event.target.value;
    this.inputCatsYearMonthExpenses = this.utility.getExpensesByYearOrMonth(this.setAnalyticsFilter(this.selectedCardTypeCat),
      this.selectedCatMonth, this.selectedCatYear);
  }

  onYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onMonthYearChange");
    this.selectedYear = event.target.value;
    this.inputMonthExpenses = this.utility.getExpensesByYearOrMonth(this.setAnalyticsFilter(this.selectedCardTypeMonth),
      this.selectedMonth, this.selectedYear);
  }

  onMonthChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onMonthMonthChange");
    this.selectedMonth = event.target.value;
    this.inputMonthExpenses = this.utility.getExpensesByYearOrMonth(this.setAnalyticsFilter(this.selectedCardTypeMonth),
      this.selectedMonth, this.selectedYear);
  }

  onAllYearsMonthChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onAllYearsMonthChange");
    this.selectedAllyearsMonth = event.target.value;
    this.inputAllYearsExpenses = this.selectedAllyearsMonth === "ALL" ? this.setAnalyticsFilter(this.selectedCardTypeYears)
      : this.utility.getExpensesByYearOrMonth(this.setAnalyticsFilter(this.selectedCardTypeYears),
        this.selectedAllyearsMonth, undefined);
  }

  onAllMonthsYearChange(event: any) {
    this.logger.trackEventCalls(AnalyticsPage.name, "onAllMonthsYearChange");
    this.selectedAllMonthsYear = event.target.value;
    this.inputAllMonthsExpenses = this.utility.getExpensesByYearOrMonth(this.setAnalyticsFilter(this.selectedCardTypeYear),
      undefined, this.selectedAllMonthsYear);
  }
}
