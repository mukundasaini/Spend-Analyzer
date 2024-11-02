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
  selector: 'app-cards-monthly-analytics',
  templateUrl: 'cards-monthly-analytics.page.html',
  styleUrls: ['cards-monthly-analytics.page.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonButton, IonLabel, IonItem, IonAccordion, IonAccordionGroup,
    CommonModule, IonContent, IonTitle, IonToolbar, IonHeader, CardBarChartPageDirective],
})
export class CardsMonthlyAnalyticsPage implements OnInit, OnChanges {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  cardsTotal: number = 0;
  showTransactions: boolean = false;

  firestore: Firestore = inject(Firestore);

  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;
  expenseCollection = AppConstants.collections.expense;

  logPrefix: string = 'CARDS_MONTHLY_ANALYTICS_PAGE::: ';

  inputLabels: string[] = [];
  inputDatasets: ChartDataset[] = [];
  cardsExpenses: { month: string, total: number, expenses: Expense[] }[] = [];

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(CardBarChartPageDirective) cardBarChart!: CardBarChartPageDirective;

  constructor() {
    console.log(this.logPrefix + "constructor");
    Chart.register(ChartDataLabels);
  }
  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.loadChartTransData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.logPrefix + "ngOnChanges");
    if (changes['expenses'].previousValue !== undefined) {
      let currentSelected = (changes['expenses'].currentValue as Expense[])[0];
      let previousSelected = (changes['expenses'].previousValue as Expense[])[0];
      if (currentSelected.year != previousSelected.year) {
        this.loadChartTransData();
        this.cardBarChart.chart.data.labels = this.inputLabels;
        this.cardBarChart.chart.data.datasets = this.inputDatasets;
        this.cardBarChart.chart.update();
      }
    }
  }

  loadChartTransData() {
    this.inputLabels = [];
    this.cardsTotal = 0;
    this.cardsExpenses = [];
    this.inputDatasets = [];
    AppConstants.Months.forEach(m => this.inputLabels.push(m.name));
    var monthlyTrans: { month: string, expense: Expense }[] = [];
    this.cards.forEach(card => {
      var cardTotals: number[] = [];
      var cardBgColors: string[] = [];
      AppConstants.Months.forEach(month => {
        let total: number = 0;
        let filterData = this.expenses.filter(expense => expense.month == month.value && expense.cardTypeId == card.id);
        let amounts = filterData.map(e => e.amount);
        amounts.forEach(amount => {
          amount = typeof (amount) == 'string' ? parseInt(amount) : amount;
          total = total + amount;
        });
        cardTotals.push(total);
        cardBgColors.push(this.getRGB(this.getRandomColor()));
        this.cardsTotal = this.cardsTotal + total;
        if (total > 0)
          monthlyTrans.push({ month: month.name, expense: <Expense>{ cardTypeId: card.id, amount: total } });
      });
      this.inputDatasets.push({ data: cardTotals, backgroundColor: cardBgColors, label: `${card.bankName} - ${card.type}` })
    });
    AppConstants.Months.forEach(month => {
      let expenses = monthlyTrans.filter(mt => mt.month == month.name).map(mt => mt.expense);
      let total = expenses.reduce((sum, e) => sum + e.amount, 0);
      let monthValue = AppConstants.Months.filter(m => m.value == month.value).map(m => m.name);
      if (total > 0)
        this.cardsExpenses.push({ month: monthValue[0], total: total, expenses: expenses });
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
