import { Component, Input, OnInit } from "@angular/core";
import {
  IonLabel, IonItem, IonGrid, IonRow, IonCol, IonCard, IonRippleEffect
} from '@ionic/angular/standalone';
import { Expense } from "../Models/expense-model";
import { CommonModule } from '@angular/common';
import { addIcons } from "ionicons";
import { add, cash, copy, create, remove } from "ionicons/icons";
import { CardDetails } from "../Models/card-details.model";
import { Category } from "../Models/category.model";
import { UpdateExpensePage } from "./update-expense/update-expense.page";
import { PascalCasePipe } from '../pipes/pascal-case.pipe';
import { LoggerService } from "../services/logger.service";
import { UtilityService } from "../services/utility.service";

@Component({
  selector: 'app-expense',
  templateUrl: 'expense.page.html',
  styleUrls: ['expense.page.scss'],
  standalone: true,
  imports: [CommonModule, UpdateExpensePage, IonCard, IonItem, IonRippleEffect, IonGrid,
    IonRow, IonCol, IonLabel, PascalCasePipe,
  ],
})
export class ExpensePage implements OnInit {

  @Input() expenses: Expense[] = [];
  @Input() cardDetails: CardDetails[] = [];
  @Input() categories: Category[] = [];

  constructor(private logger: LoggerService,
    public utility: UtilityService) {
    this.logger.trackEventCalls(ExpensePage.name, "constructor");
    addIcons({ cash, create, copy, add, remove });
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(ExpensePage.name, "ngOnInit");
  }
}

