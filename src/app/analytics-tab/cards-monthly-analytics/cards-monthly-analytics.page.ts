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
import { PieChartDirective } from "../directives/pie-chart.directive";
import { CardDetails } from "src/app/Models/card-details.model";
import { VerticalBarChartDirective } from "../directives/vertical-bar-chart.directive";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-cards-monthly-analytics',
  templateUrl: 'cards-monthly-analytics.page.html',
  styleUrls: ['cards-monthly-analytics.page.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonButton, IonLabel, IonItem, IonAccordion, IonAccordionGroup,
    CommonModule, IonContent, IonTitle, IonToolbar, IonHeader, VerticalBarChartDirective],
})
export class CardsMonthlyAnalyticsPage implements OnInit, OnChanges {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  cardsTotal: number = 0;
  showTransactions: boolean = false;

  inputLabels: string[] = [];
  inputData: number[] = [];
  inputBackgroundColor: string[] = [];
  monthlyExpenses: { month: string, total: number, expenses: Expense[] }[] = [];

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(VerticalBarChartDirective) cardBarChart!: VerticalBarChartDirective;

  constructor(private logger: LoggerService,
    public utility: UtilityService
  ) {
    this.logger.trackEventCalls(CardsMonthlyAnalyticsPage.name, "constructor");
    Chart.register(ChartDataLabels);
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(CardsMonthlyAnalyticsPage.name, "ngOnInit");
    this.loadChartData();
    this.loadTransactions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.trackEventCalls(CardsMonthlyAnalyticsPage.name, "ngOnChanges");
    if (changes['expenses'].previousValue !== undefined) {
      let currentSelected = (changes['expenses'].currentValue as Expense[])[0];
      let previousSelected = (changes['expenses'].previousValue as Expense[])[0];
      if (currentSelected.year != previousSelected.year) {
        this.loadChartData();
        this.cardBarChart.chart.data.labels = this.inputLabels;
        this.cardBarChart.chart.data.datasets[0].data = this.inputData;
        this.cardBarChart.chart.data.datasets[0].backgroundColor = this.inputBackgroundColor;
        this.cardBarChart.chart.update();
        this.loadTransactions();
      }
    }
  }

  loadChartData() {
    this.logger.trackEventCalls(CardsMonthlyAnalyticsPage.name, "loadChartData");
    this.inputLabels = [];
    this.inputData = [];
    this.inputBackgroundColor = [];

    var monthGroups = this.utility.expenseGroupBy(this.expenses, 'month');

    for (const key in monthGroups) {
      let total = this.utility.getTotal(monthGroups[key]);
      let label = this.utility.getMonthName(key);
      this.inputData.push(total);
      if (label !== undefined)
        this.inputLabels.push(label);
      this.inputBackgroundColor.push(this.utility.getRandomColor());
    }
  }

  loadTransactions() {
    this.logger.trackEventCalls(CardsMonthlyAnalyticsPage.name, "loadTransactions");
    this.monthlyExpenses = [];

    var monthGroups = this.utility.expenseGroupBy(this.expenses, 'month');

    for (const monthkey in monthGroups) {
      let total = this.utility.getTotal(monthGroups[monthkey]);
      let monthName = this.utility.getMonthName(monthkey);
      var cardGroups = this.utility.expenseGroupBy(monthGroups[monthkey], 'card');
      var transactions: Expense[] = [];
      for (const cardkey in cardGroups) {
        let total = this.utility.getTotal(cardGroups[cardkey]);
        transactions.push(<Expense>{ cardTypeId: cardkey, amount: total });
      }
      transactions = transactions.sort((a, b) => b.amount - a.amount);
      this.monthlyExpenses.push({ month: monthName, total: total, expenses: transactions });
      this.cardsTotal = this.cardsTotal + total;
    }
  }

}
