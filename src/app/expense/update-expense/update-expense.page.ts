import { CommonModule, formatDate } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { collection, collectionData, deleteDoc, doc, DocumentSnapshot, Firestore, getDoc, orderBy, query, updateDoc } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { IonButton, IonDatetimeButton, IonDatetime, IonSelect, IonToggle, IonButtons, IonContent, IonInput, IonItem, IonModal, IonTitle, IonToolbar, IonSelectOption } from '@ionic/angular/standalone';
import { Observable } from "rxjs";
import { AppConstants } from "src/app/app.constants";
import { CardDetails } from "src/app/Models/card-details.model";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";

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
  firestore: Firestore = inject(Firestore);

  logPrefix: string = 'UPDATEEXPENSE_PAGE::: ';

  @Input() inputSelectedItemId: string = '';

  expenseCollection = AppConstants.collections.expense;
  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;

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

  constructor(private alertController: AlertController) {
    console.log(this.logPrefix + "constructor");
  }

  onIsIncludedChange(event: any) {
    this.updateExpenseFG.controls.isInclude.setValue(event.target.checked);
  }

  onCardTypeChange(event: any) {
    this.updateExpenseFG.controls.cardTypeId.setValue(event.target.value);
  }

  onCategoryChange(event: any) {
    this.updateExpenseFG.controls.categoryId.setValue(event.target.value);
  }

  onGetExpense(id: string) {
    getDoc(doc(this.firestore, this.expenseCollection, id)).then((doc: DocumentSnapshot) => {
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
      this.presentAlert('Warning', "expense fetching failed");
      console.log("Expense fetching failed");
    });
  }

  onUpdateSubmit(id: string,) {
    if (id !== '' || id != null || id !== undefined) {
      var cardType = this.updateExpenseFG.controls.cardTypeId.value?.toString();
      var category = this.updateExpenseFG.controls.categoryId.value?.toString();
      var amount = this.updateExpenseFG.controls.amount.value;
      var isInclude = this.updateExpenseFG.controls.isInclude.value;
      var fullDate = this.updateExpenseFG.controls.fulldate.value;
      var note = this.updateExpenseFG.controls.note.value;

      updateDoc(doc(this.firestore, this.expenseCollection, id),
        {
          id: id,
          cardTypeId: cardType,
          categoryId: category,
          amount: amount,
          isInclude: isInclude,
          fullDate: fullDate,
          note: note
        }).then(() => {
          this.presentAlert('Success', "expense update successfully");
          console.log("expense updaed successfully");
        }).catch(x => {
          this.presentAlert('Warning', "expense updating failed");
          console.log("expense updating failed");
        });
    }
  }

  onDelete(id: string) {
    deleteDoc(doc(this.firestore, this.expenseCollection, id)).then(() => {
      this.presentAlert('Success', "expense deleted successfully");
      console.log("expense deleted successfully");
    }).catch(x => {
      this.presentAlert('Warning', "expense deleted failed");
      console.log("expense deleting failed");
    });
  }

  onKeyPress() {
    let cardNum = this.updateExpenseFG.controls.amount?.value?.toString() ?? '';
    if (cardNum.length > 14)
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