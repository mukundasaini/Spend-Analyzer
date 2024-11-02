import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonFab, IonFabButton, IonBadge, IonItem, IonGrid, IonRow, IonCol, IonChip, IonSkeletonText, IonLabel, IonRefresherContent, IonRefresher, IonSearchbar } from "@ionic/angular/standalone";
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
import { add, card, filter, infinite } from "ionicons/icons";
import { CheckBox } from "../Models/checkbox.model";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonRefresher, IonRefresherContent, IonLabel, IonSkeletonText, IonChip, IonCol, IonRow, IonGrid, IonItem, CommonModule, IonBadge, IonFabButton, IonFab, IonContent, IonIcon, IonButton, IonButtons, IonToolbar, IonTitle, IonHeader, FilterExpensePage, ExpensePage, CreatEexpensePage],
})
export class HomePage implements OnInit, OnDestroy {

  firestore: Firestore = inject(Firestore);
  inputCardDetails: CardDetails[] = [];
  inputCategories: Category[] = [];
  inputExpenses: Expense[] = [];
  inputYears: CheckBox[] = [];
  inputFilterExpenses: Expense[] = [];

  expenseCollection = AppConstants.collections.expense;
  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;

  expenseFilterIndeicator: string = '';

  hasExpenseData: boolean = false;
  hasFilterExpenseData: boolean = false;
  hasCardsData: boolean = false;
  hasCatsData: boolean = false;

  expenses$: Observable<Expense[]>;
  filterExpenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
  logPrefix: string = 'HOME_PAGE::: ';
  onDestroy$: Subject<void> = new Subject();

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

      this.filterExpenses$ = collectionData(
        query(collection(this.firestore, this.expenseCollection),
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
      });

      this.filterExpenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.inputFilterExpenses = expenses;
        this.hasFilterExpenseData = this.inputFilterExpenses.length > 0;
        this.inputYears = [];
        this.inputFilterExpenses.map(item => item.year)
          .filter((value, index, self) => self.indexOf(value) === index).forEach(year => {
            this.inputYears.push({ value: year, checked: false });
          });
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
}

