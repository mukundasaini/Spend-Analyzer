import { Component, Input } from "@angular/core";
import { IonChip, IonLabel, IonAvatar, IonButton, IonItem, IonItemDivider, IonGrid, IonRow, IonCol, IonButtons, IonList, IonIcon, IonAccordion, IonAccordionGroup, IonListHeader, IonSkeletonText, IonContent } from '@ionic/angular/standalone';
import { Expense } from "../Models/expense-model";
import { Observable, tap } from "rxjs";
import { CommonModule } from '@angular/common';
import { addIcons } from "ionicons";
import { cash } from "ionicons/icons";
import { CardDetails } from "../Models/card-details.model";
import { Category } from "../Models/category.model";
import { UpdateExpensePage } from "./update-expense/update-expense.page";

@Component({
  selector: 'app-expense',
  templateUrl: 'expense.page.html',
  styleUrls: ['expense.page.scss'],
  standalone: true,
  imports: [IonContent, IonSkeletonText, IonListHeader, IonAccordionGroup, IonAccordion, CommonModule,
    IonGrid, IonRow, IonCol,
    IonChip, IonItemDivider, IonList, IonIcon, IonButtons, IonItem, IonLabel, IonButton, IonAvatar, UpdateExpensePage],
})
export class ExpensePage {

  @Input() expenses: Expense[] = [];
  @Input() cardDetails: CardDetails[] = [];
  @Input() categories: Category[] = [];

  logPrefix: string = 'EXPENSE_PAGE::: ';
  constructor() {
    console.log(this.logPrefix + "constructor");
    addIcons({ cash });
  }

  getCardType(cardTypeId: string) {
    let cardType = this.cardDetails?.find(x => x.id == cardTypeId)?.type;
    return cardType?.charAt(0);
  }

  getCardBankName(cardTypeId: string) {
    return this.cardDetails?.find(x => x.id == cardTypeId)?.bankName;
  }
  getBackgroundBankName(cardTypeId: string) {
    return this.cardDetails?.find(x => x.id == cardTypeId)?.bankName + '_BG';
  }


  getCategory(categoryId: string) {
    return this.categories?.find(x => x.id == categoryId)?.name;
  }
}

