import { CommonModule, formatDate } from "@angular/common";
import { Component, Input } from "@angular/core";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonDatetimeButton, IonDatetime, IonSelect, IonToggle, IonButtons, IonContent, IonInput, IonItem, IonModal, IonTitle, IonToolbar, IonSelectOption } from '@ionic/angular/standalone';
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
  imports: [CommonModule, ReactiveFormsModule,
    IonModal, IonContent, IonToggle, IonToolbar, IonTitle, IonButtons, IonSelect,
    IonButton, IonDatetime, IonDatetimeButton, IonItem, IonInput, IonSelectOption]
})
export class UpdateExpensePage {

  updateExpenseFG = new FormGroup({
    cardTypeId: new FormControl(''),
    categoryId: new FormControl(''),
    amount: new FormControl(),
    fulldate: new FormControl(),
    isInclude: new FormControl(),
    note: new FormControl(''),
  });

  @Input() cardDetails: CardDetails[] = [];
  @Input() categories: Category[] = [];
  @Input() inputSelectedItemId: string = '';

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onGetExpense(id: string) {
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
      this.updateExpenseFG.controls.fulldate.setValue(new Date(formatDate(expenseDetils.fullDate, 'yyyy-MM-ddThh:mm:ss.sss', 'en-US') + 'Z').toISOString());
      this.updateExpenseFG.controls.note.setValue(expenseDetils.note == undefined ? '' : expenseDetils.note);

    }).catch(x => {
      this.utility.presentAlert(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed);
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

  onDelete(id: string) {
    this.logger.trackEventCalls(UpdateExpensePage.name, "onDelete");
    this.firebase.deleteRecordDetails(AppConstants.collections.expense, id);
  }
}