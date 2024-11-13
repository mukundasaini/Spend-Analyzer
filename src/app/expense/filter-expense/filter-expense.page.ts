import { CommonModule, formatDate } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import {
  IonPopover, IonButton, IonCol, IonGrid, IonContent, IonRow,
  IonCheckbox, IonList, IonItem, IonModal, IonHeader, IonButtons,
  IonToolbar, IonLabel, IonNav, IonNavLink, IonSegment, IonSegmentButton
} from "@ionic/angular/standalone";
import { Subject } from "rxjs";
import { CardDetails } from "src/app/Models/card-details.model";
import { Category } from "src/app/Models/category.model";
import { CheckBox } from "src/app/Models/checkbox.model";
import { Expense } from "src/app/Models/expense-model";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";
@Component({
  selector: 'app-filter-expense',
  templateUrl: 'filter-expense.page.html',
  styleUrls: ['filter-expense.page.scss'],
  standalone: true,
  imports: [IonSegmentButton, IonSegment, IonNavLink, IonNav,
    IonLabel, IonToolbar, IonButtons, IonHeader, IonModal,
    CommonModule, IonItem, IonList, IonCheckbox, IonRow,
    IonContent, IonGrid, IonCol, IonButton, IonPopover,]
})
export class FilterExpensePage implements OnInit, OnDestroy {
  cardBankNames: CheckBox[] = [];
  cardTypes: CheckBox[] = [];
  categories: CheckBox[] = [];
  months: CheckBox[] = [];
  includeExclude: CheckBox = <CheckBox>{ value: 'Exclude', checked: false };

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
  selectedTab: string = 'cats';
  slectedIsInclude: boolean | undefined;
  filterdData: Expense[] = [];

  onDestroy$: Subject<void> = new Subject();

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() years: CheckBox[] = [];
  @Input() expenses: Expense[] = [];

  @Output() onExpenseFilter = new EventEmitter<{ filterIndicator: string, filterdData: Expense[] }>();

  constructor(private logger: LoggerService,
    private utility: UtilityService) {
  }
  ngOnDestroy(): void {
    this.logger.trackEventCalls(FilterExpensePage.name, "ngOnDestroy");
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(FilterExpensePage.name, "ngOnInit");
    this.cardBankNames = this.utility.getBankNamesCheckBox(this.cards);
    this.cardTypes = this.utility.getCardTypesCheckBox(this.cards);
    this.categories = this.utility.getCategoriesCheckBox(this.cats);
    this.months = this.utility.getMonthsCheckBox();
  }

  onBankCheckBoxChange(event: any) {
    this.logger.trackEventCalls(FilterExpensePage.name, "onBankCheckBoxChange");
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
    this.logger.trackEventCalls(FilterExpensePage.name, "onAllBankNamesChange");
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
    this.logger.trackEventCalls(FilterExpensePage.name, "onCardTypeCheckBoxChange");
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
    this.logger.trackEventCalls(FilterExpensePage.name, "onAllCardsChange");
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
    this.logger.trackEventCalls(FilterExpensePage.name, "onCategoryCheckBoxChange");

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
    this.logger.trackEventCalls(FilterExpensePage.name, "onAllCategoriesChange");

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
    this.logger.trackEventCalls(FilterExpensePage.name, "onMonthCheckBoxChange");

    if (event.detail.checked) {
      this.selectedMonths.push(event.detail.value);
      let selectdItem = this.months.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.selectedMonths = this.selectedMonths.filter(m => m !== event.detail.value);
      let selectdItem = this.months.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }
    this.isAllMonthsChecked = this.months.every(x => x.checked == true);
  }

  onAllMonthsChange(event: any) {
    this.logger.trackEventCalls(FilterExpensePage.name, "onAllMonthsChange");

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
    this.logger.trackEventCalls(FilterExpensePage.name, "onYearCheckBoxChange");

    if (event.detail.checked) {
      this.selectedYears.push(event.detail.value);
      let selectdItem = this.years.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.selectedYears = this.selectedYears.filter(y => y !== event.detail.value);
      let selectdItem = this.years.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllyearsChecked = this.years.every(x => x.checked == true);
  }

  onAllYearsChange(event: any) {
    this.logger.trackEventCalls(FilterExpensePage.name, "onAllYearsChange");

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
    this.logger.trackEventCalls(FilterExpensePage.name, "onApplyFilters");

    this.utility.showLoading();
    var date = new Date();
    const dateValues = formatDate(date, 'yyyy-MM', 'en-US').split('-');
    this.slectedIsInclude = this.slectedIsInclude === undefined ? false : this.slectedIsInclude;
    this.filterdData = this.expenses;
    this.filterdData = this.filterdData.filter(expense => expense.isInclude == !this.slectedIsInclude);

    if (this.selectedYears.length > 0) {
      this.filterdData = this.filterdData.filter(
        expense => this.selectedYears.includes(expense.year)
      );
    } else {
      if (this.selectedMonths.length == 0 && this.slectedBankNames.length == 0 && this.slectedCardTypes.length == 0 && this.slectedCategories.length == 0
        && this.slectedIsInclude === undefined)
        this.filterdData = this.filterdData.filter(
          expense => expense.year == dateValues[0]
        );
    }

    if (this.selectedMonths.length > 0) {
      this.filterdData = this.filterdData.filter(
        expense => this.selectedMonths.includes(expense.month)
      );
    } else {
      if (this.selectedYears.length == 0 && this.slectedBankNames.length == 0 && this.slectedCardTypes.length == 0 && this.slectedCategories.length == 0
        && this.slectedIsInclude === undefined)
        this.filterdData = this.filterdData.filter(
          expense => expense.month == dateValues[1]
        );
    }

    if (this.slectedCategories.length > 0) {
      this.filterdData = this.filterdData.filter(
        expense => this.slectedCategories.includes(expense.categoryId)
      );
    }

    if (this.slectedBankNames.length > 0) {
      let cardTypeIds: string[] = [];
      this.slectedBankNames.forEach(bname => {
        this.cards.filter(card => card.bankName == bname).forEach(card => {
          cardTypeIds.push(card.id);
        })
      });

      this.filterdData = this.filterdData.filter(
        expense => cardTypeIds.includes(expense.cardTypeId)
      );
    }

    if (this.slectedCardTypes.length > 0) {
      let cardTypeIds: string[] = [];
      this.slectedCardTypes.forEach(ctype => {
        this.cards.filter(card => card.type == ctype).forEach(card => {
          cardTypeIds.push(card.id);
        })
      });

      this.filterdData = this.filterdData.filter(
        expense => cardTypeIds.includes(expense.cardTypeId)
      );
    }

    this.filterdData.sort((a, b) => new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime())
    modal.dismiss();
    this.onExpenseFilter.emit({ filterIndicator: '.', filterdData: this.filterdData });
  }

  onClearFilter(modal: IonModal) {
    modal.dismiss();
    if (this.filterdData.length > 0)
      window.location.reload();
  }
}