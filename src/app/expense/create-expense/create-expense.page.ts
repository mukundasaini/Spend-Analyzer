import { CommonModule, formatDate } from "@angular/common";
import { Component, inject, Input, OnDestroy, OnInit } from "@angular/core";
import { collection, collectionData, doc, Firestore, orderBy, query, setDoc } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AlertController, IonSelect, IonToggle, IonButton, IonButtons, IonContent, IonItem, IonModal, IonSelectOption, IonTitle, IonToolbar, IonInput } from '@ionic/angular/standalone';
import { UUID } from "angular2-uuid";
import { Observable, Subject } from "rxjs";
import { AppConstants } from "src/app/app.constants";
import { CardDetails } from "src/app/Models/card-details.model";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";

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

  firestore: Firestore = inject(Firestore);

  expenseCollection = AppConstants.collections.expense;
  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;

  logPrefix: string = 'CREATE_EXPENSE_PAGE::: ';

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

  constructor(private alertController: AlertController) {
    console.log(this.logPrefix + "constructor");

    this.expenseFG.controls.cardTypeId.setValue('');
    this.expenseFG.controls.categoryId.setValue('');
    this.expenseFG.controls.amount.setValue('');
    this.expenseFG.controls.note.setValue('');
    this.expenseFG.controls.months.setValue(1);
  }

  onIsIncludedChange(event: any) {
    this.expenseFG.controls.isInclude.setValue(event.target.checked);
  }

  onHasEMIChange(event: any) {
    this.hasEMI = event.target.checked;
  }

  onCardTypeChange(event: any) {
    this.expenseFG.controls.cardTypeId.setValue(event.target.value);
  }

  onCategoryChange(event: any) {
    this.expenseFG.controls.categoryId.setValue(event.target.value);
  }


  onSubmit() {
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
      console.log(fulldate);

      let expense = <Expense>{
        id: UUID.UUID(),
        cardTypeId: cardTypeId,
        categoryId: categoryId,
        amount: amount / months,
        date: dateValues[2],
        month: dateValues[1],
        year: dateValues[0],
        fullDate: fulldate,
        isInclude: isInclude,
        note: note,
        emiMonths: months
      };

      setDoc(doc(this.firestore, this.expenseCollection, expense.id), expense).then(x => {
        console.log("expense saved successfully");
        if (index == months - 1)
          this.presentAlert('Success', "expense saved successfully");
      }).catch(x => {
        if (index == months - 1)
          this.presentAlert('Warning', "expense saving failed");
        console.log("expense saving failed");
      });
    }
    this.onClear();
  }

  onClear() {
    this.expenseFG.controls.amount.setValue('');
    this.expenseFG.controls.cardTypeId.setValue('');
    this.expenseFG.controls.categoryId.setValue('');
    this.expenseFG.controls.note.setValue('');
    this.expenseFG.controls.months.setValue(1);
    this.expenseFG.controls.isInclude.setValue(true);
  }

  onKeyPress() {
    let cardNum = this.expenseFG.controls.amount?.value?.toString() ?? '0';
    if (cardNum.length > 14)
      return false;
    if (parseInt(cardNum) <= 0)
      return false;
    return true;
  }


  async presentAlert(alertHeader: string, alertMessage: string,) {
    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: ['Close'],
      cssClass: 'alert-custom',
    });

    await alert.present();
  }
}