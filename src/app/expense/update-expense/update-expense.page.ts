import { CommonModule, formatDate } from "@angular/common";
import { Component, Input } from "@angular/core";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonButton, IonDatetimeButton, IonDatetime,
  IonButtons, IonContent, IonInput, IonItem, IonSelect, IonModal, IonToolbar, IonSelectOption, IonToggle
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
  selector: 'app-update-expense',
  templateUrl: 'update-expense.page.html',
  styleUrls: ['update-expense.page.scss'],
  standalone: true,
  imports: [IonToggle, CommonModule, ReactiveFormsModule, IonModal, IonContent, IonButton,
    IonToolbar, IonButtons, IonItem, IonSelect, IonSelectOption, IonDatetimeButton, IonDatetime,
    IonInput]
})
export class UpdateExpensePage {

  showClone: boolean = false;

  updateExpenseFG = new FormGroup({
    cardTypeId: new FormControl(''),
    categoryId: new FormControl(''),
    amount: new FormControl(),
    fulldate: new FormControl(),
    isInclude: new FormControl(),
    note: new FormControl(''),
    months: new FormControl('')
  });

  @Input() cardDetails: CardDetails[] = [];
  @Input() categories: Category[] = [];
  @Input() inputSelectedItemId: string = '';

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onGetExpense(id: string) {
    this.showClone = false;
    this.logger.trackEventCalls(UpdateExpensePage.name, "onGetExpense");
    this.firebase.getRecordDetails(AppConstants.collections.expense, id).then((doc: DocumentSnapshot) => {
      let expenseDetils = doc.data() as Expense;
      this.updateExpenseFG.controls.cardTypeId.setValue(expenseDetils.cardTypeId,
        { emitEvent: true });
      this.updateExpenseFG.controls.categoryId.setValue(expenseDetils.categoryId);
      this.updateExpenseFG.controls.amount.setValue(expenseDetils.amount);
      var isInclude = document.getElementById("isInclude") as HTMLIonToggleElement;
      isInclude.checked = expenseDetils.isInclude;
      this.updateExpenseFG.controls.isInclude.setValue(expenseDetils.isInclude);
      this.updateExpenseFG.controls.fulldate.setValue(expenseDetils.fullDate);
      this.updateExpenseFG.controls.months.setValue(expenseDetils.emiMonths.toString());
      this.updateExpenseFG.controls.note.setValue(expenseDetils.note == undefined ? '' : expenseDetils.note);
      this.showClone = expenseDetils.emiMonths == 1;
    }).catch(x => {
      this.utility.presentToast(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed + ' with ' + x);
    });
  }

  onUpdateSubmit(id: string,) {
    this.logger.trackEventCalls(UpdateExpensePage.name, "onUpdateSubmit");

    let expense = {
      id: id,
      cardTypeId: this.updateExpenseFG.controls.cardTypeId.value?.toString(),
      categoryId: this.updateExpenseFG.controls.categoryId.value?.toString(),
      amount: this.updateExpenseFG.controls.amount.value,
      isInclude: this.updateExpenseFG.controls.isInclude.value,
      fullDate: this.updateExpenseFG.controls.fulldate.value,
      note: this.updateExpenseFG.controls.note.value
    }

    this.firebase.updateRecordDetails(AppConstants.collections.expense, expense);
  }

  onClone(id: string) {
    this.logger.trackEventCalls(UpdateExpensePage.name, "onClone");
    this.firebase.getRecordDetails(AppConstants.collections.expense, id).then((document: DocumentSnapshot) => {
      let expenseDetils = document.data() as Expense;
      var months = expenseDetils.emiMonths ?? 1;
      for (let index = 0; index < months; index++) {
        var oldDate = new Date();
        var date = new Date(oldDate.setMonth(oldDate.getMonth() + index));
        const fulldate = formatDate(date, 'yyyy-MM-dd hh:mm:ss.sss a Z', 'en-US');
        const dateValues = fulldate.split('-');

        let expense = <Expense>{
          id: UUID.UUID(),
          cardTypeId: expenseDetils.cardTypeId,
          categoryId: expenseDetils.categoryId,
          amount: +(expenseDetils.amount / months).toFixed(2),
          date: dateValues[2].substring(0, 2),
          month: dateValues[1],
          year: dateValues[0],
          fullDate: fulldate,
          isInclude: expenseDetils.isInclude,
          note: expenseDetils.note,
          emiMonths: months
        };

        this.firebase.saveRecordDetails(AppConstants.collections.expense, expense, index)
      }

    }).catch(ex => {
      this.utility.presentToast(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed + ' with ' + ex);
    });
  }

  onDelete(id: string) {
    this.logger.trackEventCalls(UpdateExpensePage.name, "onDelete");
    this.firebase.deleteRecordDetails(AppConstants.collections.expense, id);
  }
}