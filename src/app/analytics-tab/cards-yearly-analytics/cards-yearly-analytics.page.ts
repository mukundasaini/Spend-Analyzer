import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
  IonAccordionGroup,
  IonAccordion, IonItem, IonLabel, IonButton
} from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CardDetails } from "src/app/Models/card-details.model";
import { VerticalBarChartDirective } from "../directives/vertical-bar-chart.directive";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-cards-yearly-analytics',
  templateUrl: 'cards-yearly-analytics.page.html',
  styleUrls: ['cards-yearly-analytics.page.scss'],
  standalone: true,
  imports: [CommonModule, VerticalBarChartDirective, IonItem, IonButton, IonLabel, IonAccordion,
    IonAccordionGroup
  ],
})
export class CardsYearlyAnalyticsPage implements OnInit, OnChanges {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  total: number = 0;
  showTransactions: boolean = false;

  inputLabels: string[] = [];
  inputData: number[] = [];
  inputBackgroundColor: string[] = [];
  transactions: { year: string, total: number, monthsTotals: { month: string, total: number }[] }[] = [];

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @Input() years: string[] = [];

  @ViewChild(VerticalBarChartDirective) cardBarChart!: VerticalBarChartDirective;

  constructor(private logger: LoggerService,
    public utility: UtilityService
  ) {
    this.logger.trackEventCalls(CardsYearlyAnalyticsPage.name, "constructor");
    Chart.register(ChartDataLabels);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.trackEventCalls(CardsYearlyAnalyticsPage.name, "ngOnChanges");
    let cards = changes['cards'];
    let currentSelectedCards = cards === undefined ? [] : (cards.currentValue as CardDetails[]);
    let previousSelectedCards = cards === undefined ? undefined : (cards.previousValue as CardDetails[]);

    if (previousSelectedCards != undefined && currentSelectedCards.length != previousSelectedCards.length) {
      this.updateChartData();
      this.loadTransactions();
    }
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(CardsYearlyAnalyticsPage.name, "ngOnInit");
    this.loadChartData();
    this.loadTransactions();
  }

  updateChartData() {
    this.loadChartData();
    this.cardBarChart.chart.data.labels = this.inputLabels;
    this.cardBarChart.chart.data.datasets[0].data = this.inputData;
    this.cardBarChart.chart.update();
  }

  loadChartData() {
    this.logger.trackEventCalls(CardsYearlyAnalyticsPage.name, "loadChartData");
    this.inputLabels = [];
    this.inputData = [];
    this.inputBackgroundColor = [];
    var yearGroups = this.utility.expenseGroupBy(this.expenses, 'year');
    for (var yearKey in yearGroups) {
      let total = this.utility.getTotal(yearGroups[yearKey]);
      this.inputData.push(total);
      this.inputLabels.push(yearKey);
    }
    this.inputBackgroundColor = this.utility.getRandomColors(this.inputLabels.length);
  }

  loadTransactions() {
    this.logger.trackEventCalls(CardsYearlyAnalyticsPage.name, "loadTransactions");
    this.transactions = [];
    this.total = 0;

    let yearGroups = this.utility.expenseGroupBy(this.expenses, 'year');
    for (var yearKey in yearGroups) {
      let yearTotal = this.utility.getTotal(yearGroups[yearKey]);
      let monthsTotals: { month: string, total: number }[] = [];
      let monthGroups = this.utility.expenseGroupBy(yearGroups[yearKey], 'month');
      for (var monthKey in monthGroups) {
        let total = this.utility.getTotal(monthGroups[monthKey]);
        let monthName = this.utility.getMonthName(monthKey);
        monthsTotals.push({ month: monthName, total: total });
      }
      monthsTotals = monthsTotals.sort((a, b) => b.total - a.total);
      this.total = this.total + yearTotal;
      this.transactions.push({ year: yearKey, total: yearTotal, monthsTotals: monthsTotals });
    }
  }
}
