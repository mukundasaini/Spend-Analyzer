import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonFab, IonFabButton, IonBadge, IonItem, IonGrid, IonRow, IonCol, IonChip, IonSkeletonText, IonLabel, IonRefresherContent, IonRefresher } from "@ionic/angular/standalone";
import { FilterExpensePage } from "../expense/filter-expense/filter-expense.page";
import { ExpensePage } from "../expense/expense.page";
import { CreatEexpensePage } from "../expense/create-expense/create-expense.page";
import { Observable, Subject, takeUntil, tap } from "rxjs";
import { Expense } from "../Models/expense-model";
import { formatDate, CommonModule } from '@angular/common';
import { collection, collectionData, Firestore, orderBy, query, where } from "@angular/fire/firestore";
import { AppConstants } from "../app.constants";
import { CardDetails } from "../Models/card-details.model";
import { Category } from "../Models/category.model";
import { addIcons } from "ionicons";
import { add, filter, infinite } from "ionicons/icons";
import { CheckBox } from "../Models/checkbox.model";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonRefresher, IonRefresherContent, IonLabel, IonSkeletonText, IonChip, IonCol, IonRow, IonGrid, IonItem, CommonModule, IonBadge, IonFabButton, IonFab, IonContent, IonIcon, IonButton, IonButtons, IonToolbar, IonTitle, IonHeader, FilterExpensePage, ExpensePage, CreatEexpensePage],
})
export class HomePage implements OnInit, OnDestroy {

  firestore: Firestore = inject(Firestore);
  inputCardDetails: CardDetails[] = [];
  inputCategories: Category[] = [];
  inputExpenses: Expense[] = [];
  inputYears: CheckBox[] = [];

  expenseCollection = AppConstants.collections.expense;
  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;

  expenseFilterIndeicator: string = '';

  hasExpenseData: boolean = false;
  hasCardsData: boolean = false;
  hasCatsData: boolean = false;

  expenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
  logPrefix: string = 'HOME_PAGE::: ';
  onDestroy$: Subject<void> = new Subject();
  loading!: HTMLIonLoadingElement;

  constructor(private loadingCtrl: LoadingController) {
    console.log(this.logPrefix + "constructor");

    this.showLoading();
    addIcons({ filter, add });
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');
    this.expenses$ = collectionData(
      query(collection(this.firestore, this.expenseCollection),
        where('year', '==', dateValues[0]),
        where('month', '==', dateValues[1]),
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
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');

    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.inputExpenses = expenses;
        this.inputYears = [];
        expenses.map(item => item.year)
          .filter((value, index, self) => self.indexOf(value) === index).forEach(year => {
            this.inputYears.push({ value: year, checked: dateValues[0] == year });
          });
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

  onApplyExpenseFilters(data: { filterIndicator: string, filterdData: Expense[] }) {
    this.inputExpenses = data.filterdData;
    this.expenseFilterIndeicator = data.filterIndicator;
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

