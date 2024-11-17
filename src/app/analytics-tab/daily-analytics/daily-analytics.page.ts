import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
  IonAccordionGroup,
  IonAccordion, IonItem, IonLabel, IonButton, IonGrid, IonRow, IonCol, IonIcon
} from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CardDetails } from "src/app/Models/card-details.model";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";
import { LineChartDirective } from "../directives/line-chart.directive";
import { addIcons } from "ionicons";
import { remove } from "ionicons/icons";

@Component({
  selector: 'app-daily-analytics',
  templateUrl: 'daily-analytics.page.html',
  styleUrls: ['daily-analytics.page.scss'],
  standalone: true,
  imports: [IonIcon, CommonModule, IonItem, IonButton, IonLabel, IonAccordionGroup, IonAccordion,
    IonGrid, IonRow, IonCol, LineChartDirective],
})
export class DailyAnalyticsPage implements OnInit, OnChanges {

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
    this.logger.trackEventCalls(DailyAnalyticsPage.name, "constructor");
    Chart.register(ChartDataLabels);
    addIcons({ remove });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.trackEventCalls(DailyAnalyticsPage.name, "ngOnChanges");
    if (changes['expenses'].previousValue !== undefined) {
      let currentSelected = (changes['expenses'].currentValue as Expense[])[0];
      let previousSelected = (changes['expenses'].previousValue as Expense[])[0];
      if (currentSelected.month != previousSelected.month
        || currentSelected.year != previousSelected.year) {
        this.updateChartData();
        this.loadTransactions();
      }
    }
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(DailyAnalyticsPage.name, "ngOnInit");
    this.expensesTransactions = Array.from(this.expenses);
    this.loadChartData();
    this.loadTransactions();
  }

  updateChartData() {
    this.loadChartData();
    this.lineChart.chart.data.labels = this.inputLabels;
    this.lineChart.chart.data.datasets[0].data = this.inputData;
    this.lineChart.chart.update();
  }

  loadChartData() {
    this.logger.trackEventCalls(DailyAnalyticsPage.name, "loadChartData");
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
    this.logger.trackEventCalls(DailyAnalyticsPage.name, "loadTransactions");
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

  onGroupExcludeClick(index: number) {
    this.logger.trackEventCalls(DailyAnalyticsPage.name, "onGroupExcludeClick");
    let excludeExpensesIds = this.cardsExpenses[index].expenses.map(e => e.id);
    this.expenses = this.expenses.filter(e => !excludeExpensesIds.includes(e.id));
    this.updateChartData();
    this.loadTransactions();
  }

  onItemExcludeClick(eid: string) {
    this.logger.trackEventCalls(DailyAnalyticsPage.name, "onItemExcludeClick");
    this.expenses = this.expenses.filter(e => e.id != eid);
    this.updateChartData();
    this.loadTransactions();
  }

  onLegendItemClick(legend: any) {
    this.logger.trackEventCalls(DailyAnalyticsPage.name, "onLegendItemClick");
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
