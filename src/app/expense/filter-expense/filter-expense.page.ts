import { CommonModule, formatDate } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { collection, collectionData, Firestore, orderBy, query, where } from "@angular/fire/firestore";
import { IonPopover, IonButton, IonCol, IonGrid, IonContent, IonRow, IonCheckbox, IonList, IonItem, IonModal, IonHeader, IonButtons, IonToolbar, IonLabel, IonNav, IonNavLink, IonSegment, IonSegmentButton } from "@ionic/angular/standalone";
import { map, Observable, Subject, takeUntil, tap } from "rxjs";
import { AppConstants } from "src/app/app.constants";
import { CardDetails } from "src/app/Models/card-details.model";
import { Category } from "src/app/Models/category.model";
import { CheckBox } from "src/app/Models/checkbox.model";
import { Expense } from "src/app/Models/expense-model";
@Component({
  selector: 'app-filter-expense',
  templateUrl: 'filter-expense.page.html',
  styleUrls: ['filter-expense.page.scss'],
  standalone: true,
  imports: [IonSegmentButton, IonSegment, IonNavLink, IonNav, IonLabel, IonToolbar, IonButtons, IonHeader, IonModal, CommonModule, IonItem, IonList, IonCheckbox, IonRow, IonContent, IonGrid, IonCol, IonButton, IonPopover,]
})
export class FilterExpensePage implements OnInit {
  expenses$: Observable<Expense[]>;

  firestore: Firestore = inject(Firestore);

  cardBankNames: CheckBox[] = [];
  cardTypes: CheckBox[] = [];
  categories: CheckBox[] = [];
  months: CheckBox[] = [];

  expenseCollection = AppConstants.collections.expense;
  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;
  constMonths = AppConstants.Months;

  isAllBankNamesChecked: boolean = false;
  isAllCardsChecked: boolean = false;
  isAllCategoriesChecked: boolean = false;
  isAllMonthsChecked: boolean = false;
  isAllyearsChecked: boolean = false;

  slectedBankNames: string[] = [];
  slectedCardTypes: string[] = [];
  slectedCategories: string[] = [];
  selectedMonths: string[] = [];
  selectedYears: string[] = [];
  selectedTab: string = 'years';

  logPrefix: string = 'FILTEREXPENSE_PAGE::: ';

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() years: CheckBox[] = [];

  @Output() onExpenseFilter = new EventEmitter<{ filterIndicator: string, filterdData$: Observable<Expense[]> }>();

  constructor() {
    console.log(this.logPrefix + "constructor");
    this.expenses$ = collectionData(collection(this.firestore, this.expenseCollection)) as Observable<Expense[]>;
  }

  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');
    this.selectedYears.push(dateValues[0]);
    this.selectedMonths.push(dateValues[1]);

    this.cards.map(item => item.bankName)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach(bankName => {
        this.cardBankNames.push({ value: bankName, checked: false });
      });

    this.cards.map(item => item.type)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach(name => {
        this.cardTypes.push({ value: name, checked: false });
      });

    this.cats.forEach(category => {
      this.categories.push({ value: category.id, name: category.name, checked: false });
    });

    this.constMonths.forEach(month => {
      this.months.push({ value: month.value, name: month.name, checked: dateValues[1] == month.value });
    });
  }

  onBankCheckBoxChange(event: any) {
    if (event.detail.checked) {
      this.slectedBankNames.push(event.detail.value);
      let selectdItem = this.cardBankNames.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.slectedBankNames.splice(event.detail.value, 1);
      let selectdItem = this.cardBankNames.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllBankNamesChecked = this.cardBankNames.every(x => x.checked == true);
  }

  onAllBankNamesChange(event: any) {
    if (event.detail.checked) {
      this.slectedBankNames = [];
      this.cardBankNames.forEach(element => {
        this.slectedBankNames.push(element.value);
        element.checked = true;
      });
      this.isAllBankNamesChecked = true;
    } else {
      this.slectedBankNames = [];
      this.cardBankNames.forEach(element => {
        element.checked = false;
      });
      this.isAllBankNamesChecked = false;
    }
  }

  onCardTypeCheckBoxChange(event: any) {
    if (event.detail.checked) {
      this.slectedCardTypes.push(event.detail.value);
      let selectdItem = this.cardTypes.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.slectedCardTypes.splice(event.detail.value, 1);
      let selectdItem = this.cardTypes.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllCardsChecked = this.cardTypes.every(x => x.checked == true);
  }

  onAllCardsChange(event: any) {
    if (event.detail.checked) {
      this.slectedCardTypes = [];
      this.cardTypes.forEach(element => {
        this.slectedCardTypes.push(element.value);
        element.checked = true;
      });
      this.isAllCardsChecked = true;
    } else {
      this.slectedCardTypes = [];
      this.cardTypes.forEach(element => {
        element.checked = false;
      });
      this.isAllCardsChecked = false;
    }
  }

  onCategoryCheckBoxChange(event: any) {
    if (event.detail.checked) {
      this.slectedCategories.push(event.detail.value);
      let selectdItem = this.categories.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.slectedCategories.splice(event.detail.value, 1);
      let selectdItem = this.categories.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllCategoriesChecked = this.categories.every(x => x.checked == true);
  }

  onAllCategoriesChange(event: any) {
    if (event.detail.checked) {
      this.slectedCategories = [];
      this.categories.forEach(element => {
        this.slectedCategories.push(element.value);
        element.checked = true;
      });
      this.isAllCategoriesChecked = true;
    } else {
      this.slectedCategories = [];
      this.categories.forEach(element => {
        element.checked = false;
      });
      this.isAllCategoriesChecked = false;
    }
  }

  onMonthCheckBoxChange(event: any) {
    if (event.detail.checked) {
      this.selectedMonths.push(event.detail.value);
      let selectdItem = this.months.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.selectedMonths.splice(event.detail.value, 1);
      let selectdItem = this.months.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllMonthsChecked = this.months.every(x => x.checked == true);
  }

  onAllMonthsChange(event: any) {
    if (event.detail.checked) {
      this.selectedMonths = [];
      this.months.forEach(element => {
        this.selectedMonths.push(element.value);
        element.checked = true;
      });
      this.isAllMonthsChecked = true;
    } else {
      this.selectedMonths = [];
      this.months.forEach(element => {
        element.checked = false;
      });
      this.isAllMonthsChecked = false;
    }
  }

  onYearCheckBoxChange(event: any) {
    if (event.detail.checked) {
      this.selectedYears.push(event.detail.value);
      let selectdItem = this.years.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.selectedYears.splice(event.detail.value, 1);
      let selectdItem = this.years.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllyearsChecked = this.years.every(x => x.checked == true);
  }

  onAllYearsChange(event: any) {
    if (event.detail.checked) {
      this.selectedYears = [];
      this.years.forEach(element => {
        this.selectedYears.push(element.value);
        element.checked = true;
      });
      this.isAllyearsChecked = true;
    } else {
      this.selectedYears = [];
      this.years.forEach(element => {
        element.checked = false;
      });
      this.isAllyearsChecked = false;
    }
  }

  onApplyFilters(modal: IonModal) {
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');

    let filterdData$ = this.expenses$;
    if (this.selectedYears.length > 0) {
      filterdData$ = filterdData$.pipe(map(expenses => expenses.filter(
        expense => this.selectedYears.includes(expense.year)
      )));
    } else {
      filterdData$ = filterdData$.pipe(map(expenses => expenses.filter(
        expense => expense.year == dateValues[0]
      )));
    }

    if (this.selectedMonths.length > 0) {
      filterdData$ = filterdData$.pipe(map(expenses => expenses.filter(
        expense => this.selectedMonths.includes(expense.month)
      )));
    } else {
      filterdData$ = filterdData$.pipe(map(expenses => expenses.filter(
        expense => expense.year == dateValues[1]
      )));
    }

    if (this.slectedCategories.length > 0) {
      filterdData$ = filterdData$.pipe(map(expenses => expenses.filter(
        expense => this.slectedCategories.includes(expense.categoryId)
      )));
    }

    if (this.slectedBankNames.length > 0) {
      let cardTypeIds: string[] = [];
      this.slectedBankNames.forEach(bname => {
        this.cards.filter(card => card.bankName == bname).forEach(card => {
          cardTypeIds.push(card.id);
        })
      });

      filterdData$ = filterdData$.pipe(map(expenses => expenses.filter(
        expense => cardTypeIds.includes(expense.cardTypeId)
      )));
    }


    if (this.slectedCardTypes.length > 0) {
      let cardTypeIds: string[] = [];
      this.slectedCardTypes.forEach(ctype => {
        this.cards.filter(card => card.type == ctype).forEach(card => {
          cardTypeIds.push(card.id);
        })
      });

      filterdData$ = filterdData$.pipe(map(expenses => expenses.filter(
        expense => cardTypeIds.includes(expense.cardTypeId)
      )));
    }

    this.onExpenseFilter.emit({ filterIndicator: '.', filterdData$: filterdData$ });
    modal.dismiss();
  }

  onClearFilter(modal: IonModal) {
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');

    this.categories.forEach(element => {
      element.checked = false;
    });
    this.cardBankNames.forEach(element => {
      element.checked = false;
    });
    this.cardTypes.forEach(element => {
      element.checked = false;
    });
    this.years.forEach(element => {
      element.checked = dateValues[0] == element.value;
    });
    this.months.forEach(element => {
      element.checked = dateValues[1] == element.value;
    });
    this.isAllCategoriesChecked = false;
    this.isAllBankNamesChecked = false;
    this.isAllCardsChecked = false;
    this.isAllMonthsChecked = false;
    this.isAllyearsChecked = false;
    this.slectedCategories = [];
    this.selectedMonths = [];
    this.selectedYears = [];
    this.slectedBankNames = [];
    this.slectedCardTypes = [];
    this.selectedYears.push(dateValues[0]);
    this.selectedMonths.push(dateValues[1]);

    let expenses$ = collectionData(
      query(collection(this.firestore, this.expenseCollection),
        where('year', '==', dateValues[0]),
        where('month', '==', dateValues[1]),
        orderBy('fullDate', 'desc')
      )) as Observable<Expense[]>;

    this.onExpenseFilter.emit({ filterIndicator: '', filterdData$: expenses$ });
    modal.dismiss();
  }

  onItemClick(selectedTab: string) {
    this.selectedTab = selectedTab;
  }
}