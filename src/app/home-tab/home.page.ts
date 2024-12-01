import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon,
  IonContent, IonFab, IonFabButton, IonBadge, IonRefresherContent, IonRefresher
} from "@ionic/angular/standalone";
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
import { Bank } from "../Models/bank.model";
import { CardType } from "../Models/card-type.model";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonBadge, FilterExpensePage, IonContent, IonRefresher, IonRefresherContent, ExpensePage,
    IonFab, IonFabButton, CreatEexpensePage
  ],
})
export class HomePage implements OnInit, OnDestroy {

  inputCardDetails: CardDetails[] = [];
  inputCategories: Category[] = [];
  inputPresetMonthExpenses: Expense[] = [];
  inputYears: CheckBox[] = [];
  inputFilterExpenses: Expense[] = [];
  inputBanks: Bank[] = [];
  inputCardTypes: CardType[] = [];

  expenseFilterIndeicator: string = '';

  hasPresetMonthExpenseData: boolean = false;
  hasExpensesData: boolean = false;
  hasCardsData: boolean = false;
  hasCatsData: boolean = false;
  hasBanksData: boolean = false;
  hasCardTypesData: boolean = false;
  
  banks$: Observable<Bank[]>;
  cardTypes$: Observable<CardType[]>;
  expenses$: Observable<Expense[]>;
  cardDetails$: Observable<CardDetails[]>;
  categories$: Observable<Category[]>;
  onDestroy$: Subject<void> = new Subject();

  constructor(private logger: LoggerService,
    private utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(HomePage.name, "constructor");
    addIcons({ filter, add });
    this.banks$ = this.firebase.getBanksOrderByID();
    this.cardTypes$ = this.firebase.getCardTypesOrderByID();
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
    this.banks$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(banks => {
        this.inputBanks = banks;
        this.hasBanksData = banks.length > 0;
      });

    this.cardTypes$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cardTypes => {
        this.inputCardTypes = cardTypes;
        this.hasCardTypesData = cardTypes.length > 0;
      });

    this.expenses$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(expenses => {
        this.inputFilterExpenses = expenses;
        this.hasExpensesData = this.inputFilterExpenses.length > 0;
        this.inputPresetMonthExpenses = this.utility.getCurrentMonthExpenses(expenses);
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

