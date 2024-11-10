import { Component, OnDestroy, OnInit } from "@angular/core";
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonFab, IonFabButton, IonBadge, IonItem, IonGrid, IonRow, IonCol, IonChip, IonSkeletonText, IonLabel, IonRefresherContent, IonRefresher, IonSearchbar } from "@ionic/angular/standalone";
import { FilterExpensePage } from "../expense/filter-expense/filter-expense.page";
import { ExpensePage } from "../expense/expense.page";
import { CreatEexpensePage } from "../expense/create-expense/create-expense.page";
import { Observable, Subject, takeUntil, tap } from "rxjs";
import { Expense } from "../Models/expense-model";
import { CommonModule } from '@angular/common';
import { CardDetails } from "../Models/card-details.model";
import { Category } from "../Models/category.model";
import { addIcons } from "ionicons";
import { add, filter } from "ionicons/icons";
import { CheckBox } from "../Models/checkbox.model";
import { FirebaseService } from "../services/firebase.service";
import { LoggerService } from "../services/logger.service";
import { UtilityService } from "../services/utility.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonRefresher, IonRefresherContent, IonLabel,
    IonSkeletonText, IonChip, IonCol, IonRow, IonGrid, IonItem, CommonModule,
    IonBadge, IonFabButton, IonFab, IonContent, IonIcon, IonButton, IonButtons,
    IonToolbar, IonTitle, IonHeader, FilterExpensePage, ExpensePage, CreatEexpensePage],
})
export class HomePage implements OnInit, OnDestroy {

  inputCardDetails: CardDetails[] = [];
  inputCategories: Category[] = [];
  inputPresetMonthExpenses: Expense[] = [];
  inputYears: CheckBox[] = [];
  inputFilterExpenses: Expense[] = [];

  expenseFilterIndeicator: string = '';

  hasPresetMonthExpenseData: boolean = false;
  hasExpensesData: boolean = false;
  hasCardsData: boolean = false;
  hasCatsData: boolean = false;

  expenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
  onDestroy$: Subject<void> = new Subject();

  constructor(private logger: LoggerService,
    private utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(HomePage.name, "constructor");
    addIcons({ filter, add });
    this.expenses$ = this.firebase.getExpensesOrderByID();
    this.cardDetails$ = this.firebase.getCardsOrderByID();
    this.categories$ = this.firebase.getCategoriesOrderByID();
  }

  ngOnDestroy(): void {
    this.logger.trackEventCalls(HomePage.name, "ngOnDestroy");
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(HomePage.name, "ngOnInit");
    this.utility.showLoading();

    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.inputFilterExpenses = expenses;
        this.hasExpensesData = this.inputFilterExpenses.length > 0;
        this.inputPresetMonthExpenses =this.utility.getCurrentMonthExpenses(expenses);
         this.hasPresetMonthExpenseData = this.inputPresetMonthExpenses.length > 0;
        this.inputYears = this.utility.getYearsCheckBox(expenses);
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
    this.logger.trackEventCalls(HomePage.name, "onApplyExpenseFilters");
    this.inputPresetMonthExpenses = data.filterdData;
    this.expenseFilterIndeicator = data.filterIndicator;
  }

  handleRefresh(event: any) {
    this.logger.trackEventCalls(HomePage.name, "handleRefresh");
    this.utility.handleRefresh(event);
  }
}

