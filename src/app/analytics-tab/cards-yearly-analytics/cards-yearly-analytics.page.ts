import { CommonModule, formatDate } from "@angular/common";
import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { collection, collectionData, Firestore, orderBy, query, where } from "@angular/fire/firestore";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData, ChartDataset } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable, of } from "rxjs";
import { AppConstants } from "src/app/app.constants";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CardPieChartPageDirective } from "../directives/card-pie-chart.page.directive";
import { CardDetails } from "src/app/Models/card-details.model";
import { CardBarChartPageDirective } from "../directives/card-bar-chart.page.directive";

@Component({
  selector: 'app-cards-yearly-analytics',
  templateUrl: 'cards-yearly-analytics.page.html',
  styleUrls: ['cards-yearly-analytics.page.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonButton, IonLabel, IonItem, IonAccordion, IonAccordionGroup,
    CommonModule, IonContent, IonTitle, IonToolbar, IonHeader, CardBarChartPageDirective],
})
export class CardsYearlyAnalyticsPage implements OnInit {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  total: number = 0;
  showTransactions: boolean = false;

  firestore: Firestore = inject(Firestore);

  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;
  expenseCollection = AppConstants.collections.expense;

  logPrefix: string = 'CARDS_MONTHLY_ANALYTICS_PAGE::: ';

  inputLabels: string[] = [];
  inputData: number[] = [];
  inputBackgroundColor: string[] = [];
  transactions: { year: string, total: number, monthsTotals: { month: string, total: number }[] }[] = [];

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @Input() years: string[] = [];

  @ViewChild(CardBarChartPageDirective) cardBarChart!: CardBarChartPageDirective;

  constructor() {
    console.log(this.logPrefix + "constructor");
    Chart.register(ChartDataLabels);
  }
  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.loadChartTransData();
  }

  loadChartTransData() {
    this.inputLabels = [];
    this.inputData = [];
    this.inputBackgroundColor = [];
    this.transactions = [];
    this.total = 0;

    this.years.forEach(year => {
      let expenses = this.expenses.filter(ex => ex.year == year);
      let total = expenses.reduce((sum, e) => sum + e.amount, 0);

      if (total > 0) {
        this.inputData.push(total);
        this.inputLabels.push(year);
        this.inputBackgroundColor.push(this.getRGB(this.getRandomColor()));
        let monthsTotals: { month: string, total: number }[] = [];

        AppConstants.Months.forEach(month => {
          let expenses = this.expenses.filter(ex => ex.year == year && ex.month == month.value);
          let total = expenses.reduce((sum, e) => sum + e.amount, 0);
          if (total > 0) {
            monthsTotals.push({ month: month.name, total: total });
          }
        });
        this.total = this.total + total;
        this.transactions.push({ year: year, total: total, monthsTotals: monthsTotals });
      }
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getRGB(colorHex: string) {
    let r = parseInt(colorHex.slice(1, 3), 16);
    let g = parseInt(colorHex.slice(3, 5), 16);
    let b = parseInt(colorHex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  getcard(cardTypeId: string) {
    let card = this.cards?.find(x => x.id == cardTypeId);
    return `${card?.bankName} - ${card?.type}`;
  }

  setShowTransactions() {
    this.showTransactions = !this.showTransactions;
  }
}
