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
import { filter } from 'ionicons/icons';
import { Settings } from "../Models/settings.model";
import { AnalyticsFiltersPage } from "./analytics-filters/analytics-filters.page";

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss'],
  standalone: true,
  imports: [CommonModule,
    IonHeader, IonToolbar, IonContent, IonTitle,
    IonRefresher, IonRefresherContent, IonItem, IonGrid,
    IonRow, IonCol, IonLabel, IonSelect, IonSelectOption,
    CardsAnalyticsPage, CategoriesAnalyticsPage, AnalyticsFiltersPage,
    CardsMonthlyAnalyticsPage, DailyAnalyticsPage, CardsYearlyAnalyticsPage],
})
export class AnalyticsPage implements OnInit, OnDestroy {
  cardDetails: CardDetails[] = [];
  categories: Category[] = [];
  monthAnalyticsExpenses: Expense[] = [];
  cardsAnalyticsExpenses: Expense[] = [];
  catsAnalyticsExpenses: Expense[] = [];
  yearAnalyticsExpenses: Expense[] = [];
  yearsAnalyticsExpenses: Expense[] = [];
  expenses: Expense[] = [];

  expenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
  settings$: Observable<Settings[]>;
  onDestroy$: Subject<void> = new Subject();

  hasCardsData: boolean = false;
  hasCatsData: boolean = false;
  selectedMonth!: string;
  selectedYear!: string;
  hideMonthAnalytics: boolean = true;
  hideCardsAnalytics: boolean = true;
  hideCatsAnalytics: boolean = true;
  hideAllMonthsAnalytics: boolean = true;
  hideAllYearsAnalytics: boolean = true;
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
    this.selectedYear = this.utility.getCurrentYear();
    this.selectedMonth = this.utility.getCurrentMonth();
    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.expenses = this.yearsAnalyticsExpenses = expenses;
        this.yearAnalyticsExpenses = this.utility.getExpensesByYearOrMonth(expenses, undefined, this.utility.getCurrentYear());
        this.catsAnalyticsExpenses = this.cardsAnalyticsExpenses = this.monthAnalyticsExpenses = this.utility.getExpensesByYearOrMonth(expenses);
      });

    this.cardDetails$.pipe(takeUntil(this.onDestroy$))
      .subscribe(cardTypes => {
        this.cardDetails = cardTypes;
        this.hasCardsData = cardTypes.length > 0;
      });

    this.categories$.pipe(takeUntil(this.onDestroy$))
      .subscribe(categories => {
        this.categories = categories;
        this.hasCatsData = categories.length > 0;
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

  onFiltersApplied(filteredExpenses: Expense[], analyticsType: string) {
    if (analyticsType === 'CAT')
      this.catsAnalyticsExpenses = filteredExpenses;
    else if (analyticsType === 'CARD')
      this.cardsAnalyticsExpenses = filteredExpenses;
    else if (analyticsType === 'MONTH')
      this.monthAnalyticsExpenses = filteredExpenses;
    else if (analyticsType === 'YEAR')
      this.yearAnalyticsExpenses = filteredExpenses;
    else if (analyticsType === 'YEARS')
      this.yearsAnalyticsExpenses = filteredExpenses;
  }
}
