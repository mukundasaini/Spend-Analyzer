import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup,
  IonAccordion, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonToggle, IonIcon
} from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CardDetails } from "src/app/Models/card-details.model";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";
import { UpdateExpensePage } from "../../expense/update-expense/update-expense.page";
import { LineChartDirective } from "../directives/line-chart.directive";

@Component({
  selector: 'app-month-analytics',
  templateUrl: 'month-analytics.page.html',
  styleUrls: ['month-analytics.page.scss'],
  standalone: true,
  imports: [IonIcon, IonToggle, IonCol, IonRow, IonGrid, IonSelect, IonSelectOption, IonButton, IonLabel, IonItem, IonAccordion, IonAccordionGroup,
    CommonModule, IonContent, IonTitle, IonToolbar, IonHeader, LineChartDirective, UpdateExpensePage],
})
export class MonthAnalyticsPage implements OnInit, OnChanges {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  cardsTotal: number = 0;
  showTransactions: boolean = false;

  inputLabels: string[] = [];
  inputData: number[] = [];
  cardsExpenses: { day: string, total: number, expenses: Expense[] }[] = [];
  expensesTransactions: Expense[] = [];

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(LineChartDirective) lineChart!: LineChartDirective;

  constructor(private logger: LoggerService,
    public utility: UtilityService
  ) {
    this.logger.trackEventCalls(MonthAnalyticsPage.name, "constructor");
    Chart.register(ChartDataLabels);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.trackEventCalls(MonthAnalyticsPage.name, "ngOnChanges");
    if (changes['expenses'].previousValue !== undefined) {
      let currentSelected = (changes['expenses'].currentValue as Expense[])[0];
      let previousSelected = (changes['expenses'].previousValue as Expense[])[0];
      if (currentSelected.month != previousSelected.month
        || currentSelected.year != previousSelected.year) {
        this.loadChartData();
        this.lineChart.chart.data.labels = this.inputLabels;
        this.lineChart.chart.data.datasets[0].data = this.inputData;
        this.lineChart.chart.update();
        this.loadTransactions();
      }
    }
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(MonthAnalyticsPage.name, "ngOnInit");
    this.expensesTransactions = Array.from(this.expenses);
    this.loadChartData();
    this.loadTransactions();
  }

  loadChartData() {
    this.logger.trackEventCalls(MonthAnalyticsPage.name, "loadChartData");
    this.inputData = [];
    this.inputLabels = [];

    var dayGroups = this.utility.expenseGroupBy(this.expenses, 'day');

    for (const key in dayGroups) {
      let total = this.utility.getTotal(dayGroups[key]);
      this.inputData.push(total);
      this.inputLabels.push(key);
    }
  }

  loadTransactions() {
    this.logger.trackEventCalls(MonthAnalyticsPage.name, "loadTransactions");
    this.cardsExpenses = [];
    this.cardsTotal = 0;

    var dayGroups = this.utility.expenseGroupBy(this.expenses, 'day');
    for (const day in dayGroups) {
      let total = this.utility.getTotal(dayGroups[day]);
      this.cardsExpenses.push({ total: total, day: day, expenses: dayGroups[day] });
      this.cardsTotal = this.cardsTotal + total;
    }

    this.cardsExpenses = this.cardsExpenses.sort((a, b) => b.total - a.total);
  }

  onLegendItemClick(legend: any) {
    this.logger.trackEventCalls(MonthAnalyticsPage.name, "onLegendItemClick");
    var labelData = legend.label.split('-');
    var bankName = labelData[0].trim();
    var type = labelData[1].trim();
    var cardId = this.cards.find(c => c.bankName == bankName && c.type == type)?.id;

    if (!legend.display) {
      this.expensesTransactions = this.expensesTransactions.filter(ex => ex.cardTypeId != cardId);
    } else {
      var cardExpenses = this.expenses.filter(ex => ex.cardTypeId == cardId);
      this.expensesTransactions.push(...cardExpenses);
    }
    this.loadTransactions();
  }
}
