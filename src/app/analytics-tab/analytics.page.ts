import { CommonModule, formatDate } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonRefresher, IonRefresherContent, IonAccordionGroup, IonAccordion } from "@ionic/angular/standalone";
import { CardsAnalyticsPage } from "./cards-analytics/cards-analytics.page";
import { collection, collectionData, Firestore, orderBy, query, where } from "@angular/fire/firestore";
import { Observable, of, Subject, takeUntil, tap } from "rxjs";
import { CardDetails } from '../Models/card-details.model';
import { AppConstants } from "../app.constants";
import { Expense } from "../Models/expense-model";
import { CategoriesAnalyticsPage } from "./categories-analytics/categories-analytics.page";
import { Category } from "../Models/category.model";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss'],
  standalone: true,
  imports: [IonAccordion, IonAccordionGroup, IonRefresherContent, IonRefresher, IonItem, IonLabel, CommonModule, IonContent, IonTitle, IonToolbar, IonHeader,
    CardsAnalyticsPage, CategoriesAnalyticsPage],
})
export class AnalyticsPage implements OnInit, OnDestroy {
  firestore: Firestore = inject(Firestore);
  inputCardDetails: CardDetails[] = [];
  inputCategories: Category[] = [];
  inputExpenses: Expense[] = [];

  expenseCollection = AppConstants.collections.expense;
  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;

  expenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
  logPrefix: string = 'ANALYTICS_PAGE::: ';
  onDestroy$: Subject<void> = new Subject();

  hasExpenseData: boolean = false;
  hasCardsData: boolean = false;
  hasCatsData: boolean = false;
  loading!: HTMLIonLoadingElement;

  constructor(private loadingCtrl: LoadingController) {
    console.log(this.logPrefix + "constructor");
    this.showLoading();
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');
    this.expenses$ = collectionData(
      query(collection(this.firestore, this.expenseCollection),
        where('year', '==', dateValues[0]),
        where('month', '==', dateValues[1]),
        where('isInclude', '==', true),
        orderBy('fullDate', 'desc')
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
    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.inputExpenses = expenses;
        this.hasExpenseData = this.inputExpenses.length > 0;
        if (this.loading != undefined)
          this.loading.dismiss();
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
    this.loading = await this.loadingCtrl.create({
      message: 'Fetcing data...',
      duration: Number.MAX_VALUE,
      cssClass: 'custom-loading'
    });
    this.loading.present();
  }

  handleRefresh(event: any) {
    event.target.complete();
    window.location.reload();
  }
}
