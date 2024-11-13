import { Component, Input, OnInit } from "@angular/core";
import {
  IonChip, IonLabel, IonAvatar, IonButton, IonItem, IonItemDivider,
  IonGrid, IonRow, IonCol, IonButtons, IonList, IonIcon, IonAccordion,
  IonAccordionGroup, IonListHeader, IonSkeletonText, IonContent, IonItemSliding,
  IonItemOptions, IonItemOption, IonTitle, IonCard, IonRippleEffect
} from '@ionic/angular/standalone';
import { Expense } from "../Models/expense-model";
import { CommonModule, formatDate } from '@angular/common';
import { addIcons } from "ionicons";
import { add, cash, copy, create, remove } from "ionicons/icons";
import { CardDetails } from "../Models/card-details.model";
import { Category } from "../Models/category.model";
import { UpdateExpensePage } from "./update-expense/update-expense.page";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { AppConstants } from "../app.constants";
import { UUID } from "angular2-uuid";
import { PascalCasePipe } from "../pipes/pascal-case.pipe";
import { FirebaseService } from "../services/firebase.service";
import { LoggerService } from "../services/logger.service";
import { UtilityService } from "../services/utility.service";

@Component({
  selector: 'app-expense',
  templateUrl: 'expense.page.html',
  styleUrls: ['expense.page.scss'],
  standalone: true,
  imports: [IonRippleEffect, IonCard, IonTitle, IonItemOption, IonItemOptions,
    IonItemSliding, IonContent, IonSkeletonText, IonListHeader, IonAccordionGroup,
    IonAccordion, CommonModule, IonGrid, IonRow, IonCol,
    IonChip, IonItemDivider, IonList, IonIcon, IonButtons,
    IonItem, IonLabel, IonButton, IonAvatar, UpdateExpensePage, PascalCasePipe],
})
export class ExpensePage implements OnInit {

  @Input() expenses: Expense[] = [];
  @Input() cardDetails: CardDetails[] = [];
  @Input() categories: Category[] = [];

  hideExpenseFullDetails: boolean[] = [];

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(ExpensePage.name, "constructor");
    addIcons({ cash, create, copy, add, remove });
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(ExpensePage.name, "ngOnInit");
    this.expenses.forEach(e => {
      this.hideExpenseFullDetails.push(false);
    });
  }

  onClone(id: string) {
    this.logger.trackEventCalls(ExpensePage.name, "onClone");
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
          amount: expenseDetils.amount / months,
          date: dateValues[2],
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
      this.utility.presentAlert(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed, ex);
    });
  }
}

