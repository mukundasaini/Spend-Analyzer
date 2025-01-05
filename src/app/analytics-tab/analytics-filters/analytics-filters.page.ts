import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CardDetails } from "src/app/Models/card-details.model";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";
import { AppConstants } from "src/app/app.constants";
import { IonItem, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-analytics-filters',
  templateUrl: 'analytics-filters.page.html',
  styleUrls: ['analytics-filters.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonItem, FormsModule, CommonModule, IonSelect, IonSelectOption
  ],
})
export class AnalyticsFiltersPage implements OnInit {

  selectedCardType: string = 'ALL';
  selectedCard: string = 'ALL';
  selectedCategory: string = 'ALL';

  months = AppConstants.Months;
  cardTypes = AppConstants.CardTypes;

  cardDetails: CardDetails[] = [];
  categories: Category[] = [];
  expenses: Expense[] = [];
  debitCardIds: string[] = [];
  creditCardIds: string[] = [];
  allCardIds: string[] = [];
  years: string[] = [];

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() xpenses: Expense[] = [];
  @Input() selectedMonth: string = 'ALL';
  @Input() selectedYear: string = 'ALL';
  @Input() disableMonth: boolean = false;
  @Input() disableYear: boolean = false;
  @Output() filteredExpenses = new EventEmitter<Expense[]>();
  constructor(private logger: LoggerService,
    public utility: UtilityService
  ) {
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(AnalyticsFiltersPage.name, "ngOnInit");
    this.allCardIds = this.utility.getCardIds(this.cards, 'A');
    this.creditCardIds = this.utility.getCardIds(this.cards, 'C');
    this.debitCardIds = this.utility.getCardIds(this.cards, 'D');
    this.expenses = Array.from(this.xpenses);
    this.cardDetails = this.utility.getCardsByExpense(this.expenses, this.cards);
    this.categories = this.utility.getCatsByExpense(this.expenses, this.cats);
    this.years = this.utility.getYearsCheckBox(this.expenses).map(item => item.value);
    this.months = this.utility.getMonths(this.expenses);
  }

  onYearChange(ev: any) {
    this.logger.trackEventCalls(AnalyticsFiltersPage.name, "onYearChange");
    this.selectedYear = ev.target.value;

    if (this.selectedYear === 'ALL')
      this.expenses = this.xpenses;
    else
      this.expenses = this.utility.getExpensesByYearOrMonth(this.xpenses, undefined, this.selectedYear);
    this.months = this.utility.getMonths(this.expenses);
    this.cardDetails = this.utility.getCardsByExpense(this.expenses, this.cards);
    this.categories = this.utility.getCatsByExpense(this.expenses, this.cats);
    this.selectedMonth = 'ALL';
    this.selectedCardType = 'ALL';
    this.selectedCard = 'ALL';
    this.selectedCategory = 'ALL';
    this.filteredExpenses.emit(this.expenses);
  }

  onMonthChange(ev: any) {
    this.logger.trackEventCalls(AnalyticsFiltersPage.name, "onMonthChange");
    this.selectedMonth = ev.target.value;
    this.yearMonthChange();
    this.cardDetails = this.utility.getCardsByExpense(this.expenses, this.cards);
    this.categories = this.utility.getCatsByExpense(this.expenses, this.cats);
    this.selectedCardType = 'ALL';
    this.selectedCard = 'ALL';
    this.selectedCategory = 'ALL';
    this.filteredExpenses.emit(this.expenses);
  }

  onCardTypeChange(ev: any) {
    this.logger.trackEventCalls(AnalyticsFiltersPage.name, "onCardTypeChange");
    this.selectedCardType = ev.target.value;
    this.yearMonthChange();
    let cardIds = this.selectedCardType === 'C' ? this.creditCardIds : (this.selectedCardType === 'D' ? this.debitCardIds : this.allCardIds);
    this.expenses = this.expenses.filter(e => cardIds.includes(e.cardTypeId));
    this.cardDetails = this.utility.getCardsByExpense(this.expenses, this.cards);
    this.categories = this.utility.getCatsByExpense(this.expenses, this.cats);
    this.selectedCard = 'ALL';
    this.selectedCategory = 'ALL';
    this.filteredExpenses.emit(this.expenses);
  }

  onCardChange(ev: any) {
    this.logger.trackEventCalls(AnalyticsFiltersPage.name, "onCardChange");
    this.selectedCard = ev.target.value;
    this.yearMonthChange();
    let cardIds = this.selectedCardType === 'C' ? this.creditCardIds : (this.selectedCardType === 'D' ? this.debitCardIds : this.allCardIds);
    this.expenses = this.expenses.filter(e => cardIds.includes(e.cardTypeId));
    if (this.selectedCard !== 'ALL')
      this.expenses = this.expenses.filter(e => e.cardTypeId === this.selectedCard);
    this.categories = this.utility.getCatsByExpense(this.expenses, this.cats);
    this.selectedCategory = 'ALL';
    this.filteredExpenses.emit(this.expenses);
  }

  onCategoryChange(ev: any) {
    this.logger.trackEventCalls(AnalyticsFiltersPage.name, "onCategoryChange");
    this.selectedCategory = ev.target.value;
    this.yearMonthChange();
    let cardIds = this.selectedCardType === 'C' ? this.creditCardIds : (this.selectedCardType === 'D' ? this.debitCardIds : this.allCardIds);
    this.expenses = this.expenses.filter(e => cardIds.includes(e.cardTypeId));

    if (this.selectedCard !== 'ALL')
      this.expenses = this.expenses.filter(e => e.cardTypeId === this.selectedCard);

    if (this.selectedCategory !== 'ALL')
      this.expenses = this.expenses.filter(e => e.categoryId === this.selectedCategory);

    this.filteredExpenses.emit(this.expenses);
  }

  yearMonthChange() {
    if (this.selectedYear == 'ALL' && this.selectedMonth === 'ALL')
      this.expenses = this.xpenses;
    else if (this.selectedYear == 'ALL' && this.selectedMonth !== 'ALL')
      this.expenses = this.utility.getExpensesByYearOrMonth(this.xpenses, this.selectedMonth);
    else if (this.selectedYear !== 'ALL' && this.selectedMonth !== 'ALL')
      this.expenses = this.utility.getExpensesByYearOrMonth(this.xpenses, this.selectedMonth, this.selectedYear);
    else if (this.selectedYear !== 'ALL' && this.selectedMonth === 'ALL')
      this.expenses = this.utility.getExpensesByYearOrMonth(this.xpenses, undefined, this.selectedYear);
  }
}
