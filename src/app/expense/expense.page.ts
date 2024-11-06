import { Component, inject, Input, OnInit } from "@angular/core";
import { IonChip, IonLabel, IonAvatar, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonButtons, IonList, IonIcon, IonAccordion, IonAccordionGroup, IonListHeader, IonSkeletonText, IonContent, IonItemSliding, IonItemOptions, IonItemOption, IonTitle, IonCard, IonRippleEffect } from '@ionic/angular/standalone';
import { Expense } from "../Models/expense-model";
import { Observable, tap } from "rxjs";
import { CommonModule, formatDate } from '@angular/common';
import { addIcons } from "ionicons";
import { add, cash, copy, create, remove } from "ionicons/icons";
import { CardDetails } from "../Models/card-details.model";
import { Category } from "../Models/category.model";
import { UpdateExpensePage } from "./update-expense/update-expense.page";
import { doc, DocumentSnapshot, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { AppConstants } from "../app.constants";
import { UUID } from "angular2-uuid";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-expense',
  templateUrl: 'expense.page.html',
  styleUrls: ['expense.page.scss'],
  standalone: true,
  imports: [IonRippleEffect, IonCard, IonTitle, IonItemOption, IonItemOptions, IonItemSliding, IonContent, IonSkeletonText, IonListHeader, IonAccordionGroup, IonAccordion, CommonModule,
    IonGrid, IonRow, IonCol,
    IonChip, IonItemDivider, IonList, IonIcon, IonButtons, IonItem, IonLabel, IonButton, IonAvatar, UpdateExpensePage],
})
export class ExpensePage implements OnInit {

  @Input() expenses: Expense[] = [];
  @Input() cardDetails: CardDetails[] = [];
  @Input() categories: Category[] = [];

  firestore: Firestore = inject(Firestore);
  expenseCollection = AppConstants.collections.expense;
  hideExpenseFullDetails: boolean[] = [];
  logPrefix: string = 'EXPENSE_PAGE::: ';

  constructor(private alertController: AlertController) {
    console.log(this.logPrefix + "constructor");
    addIcons({ cash, create, copy, add, remove });
  }
  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.expenses.forEach(e => { this.hideExpenseFullDetails.push(false) });
  }

  getCardType(cardTypeId: string) {
    let cardType = this.cardDetails?.find(x => x.id == cardTypeId)?.type;
    return cardType?.charAt(0);
  }

  getCardTypeFull(cardTypeId: string) {
    var card = this.cardDetails?.find(x => x.id == cardTypeId);
    return `${card?.bankName} - ${card?.type}`;
  }

  getCardBankName(cardTypeId: string) {
    return this.cardDetails?.find(x => x.id == cardTypeId)?.bankName;
  }
  getBackgroundBankName(cardTypeId: string) {
    return `${this.cardDetails?.find(x => x.id == cardTypeId)?.bankName}_BG`;
  }


  getCategory(categoryId: string) {
    return this.categories?.find(x => x.id == categoryId)?.name;
  }

  onClone(id: string) {

    getDoc(doc(this.firestore, this.expenseCollection, id)).then((document: DocumentSnapshot) => {
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
          amount: expenseDetils.amount / months,
          date: dateValues[2],
          month: dateValues[1],
          year: dateValues[0],
          fullDate: fulldate,
          isInclude: expenseDetils.isInclude,
          note: expenseDetils.note,
          emiMonths: months
        };

        setDoc(doc(this.firestore, this.expenseCollection, expense.id), expense).then(() => {
          console.log("expense saved successfully");
          if (index == months - 1)
            this.presentAlert('Success', "expense saved successfully");
        }).catch(x => {
          console.log("expense saving failed");
          if (index == months - 1)
            this.presentAlert('Warning', "expense saving failed");
        });
      }

    }).catch(x => {
      console.log("Expense fetching failed");
    });
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

