import { CommonModule, formatDate } from "@angular/common";
import { Component, Input, } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonSelect, IonToggle, IonButton, IonButtons, IonContent,
  IonItem, IonModal, IonSelectOption, IonTitle, IonToolbar, IonInput
} from '@ionic/angular/standalone';
import { UUID } from "angular2-uuid";
import { AppConstants } from "src/app/app.constants";
import { CardDetails } from "src/app/Models/card-details.model";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { FirebaseService } from "src/app/services/firebase.service";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-create-expense',
  templateUrl: 'create-expense.page.html',
  styleUrls: ['create-expense.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    IonModal, IonContent, IonToggle, IonToolbar, IonTitle, IonButtons, IonButton,
    IonItem, IonSelectOption, IonInput, IonSelect
  ]
})
export class CreatEexpensePage {

  hasEMI: boolean = false;

  expenseFG = new FormGroup({
    cardTypeId: new FormControl(''),
    categoryId: new FormControl(''),
    amount: new FormControl(''),
    isInclude: new FormControl(true),
    note: new FormControl(''),
    months: new FormControl(1)
  });

  @Input() cardDetails: CardDetails[] = [];
  @Input() categories: Category[] = [];

  constructor(private logger: LoggerService,
    private utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(CreatEexpensePage.name, "constructor");
    this.expenseFG.controls.cardTypeId.setValue('');
    this.expenseFG.controls.categoryId.setValue('');
    this.expenseFG.controls.amount.setValue('');
    this.expenseFG.controls.note.setValue('');
    this.expenseFG.controls.months.setValue(1);
  }

  onSubmit() {
    this.logger.trackEventCalls(CreatEexpensePage.name, "onSubmit");
    var cardTypeId = this.expenseFG.controls.cardTypeId.value?.toString();
    var categoryId = this.expenseFG.controls.categoryId.value?.toString();
    var amount: number = parseInt(this.expenseFG.controls.amount.value == null ? '1'
      : this.expenseFG.controls.amount.value.toString());
    var isInclude = this.expenseFG.controls.isInclude.value;
    var note = this.expenseFG.controls.note.value;
    var months = this.expenseFG.controls.months.value ?? 1;
    for (let index = 0; index < months; index++) {
      var oldDate = new Date();
      var date = new Date(oldDate.setMonth(oldDate.getMonth() + index));
      const fulldate = formatDate(date, 'yyyy-MM-dd hh:mm:ss.sss a Z', 'en-US');
      const dateValues = fulldate.split('-');

      let expense = <Expense>{
        id: UUID.UUID(),
        cardTypeId: cardTypeId,
        categoryId: categoryId,
        amount: amount / months,
        date: dateValues[2].substring(0,2),
        month: dateValues[1],
        year: dateValues[0],
        fullDate: fulldate,
        isInclude: isInclude,
        note: note,
        emiMonths: months
      };

      this.firebase.saveRecordDetails(AppConstants.collections.expense, expense);
    }
    this.onClear();
  }

  onClear() {
    this.logger.trackEventCalls(CreatEexpensePage.name, "onClear");
    this.expenseFG.controls.amount.setValue('');
    this.expenseFG.controls.cardTypeId.setValue('');
    this.expenseFG.controls.categoryId.setValue('');
    this.expenseFG.controls.note.setValue('');
    this.expenseFG.controls.months.setValue(1);
    this.expenseFG.controls.isInclude.setValue(true);
  }

  onKeyPress() {
    this.logger.trackEventCalls(CreatEexpensePage.name, "onKeyPress");
    let amount = this.expenseFG.controls.amount?.value?.toString() ?? '0';
    return this.utility.onKeyPress(amount, 10);
  }
}