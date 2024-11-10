import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup,
  IonAccordion, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AppConstants } from "src/app/app.constants";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CardDetails } from "src/app/Models/card-details.model";
import { CardBarChartPageDirective } from "../directives/card-bar-chart.page.directive";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

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

  inputLabels: string[] = [];
  inputData: number[] = [];
  inputBackgroundColor: string[] = [];
  transactions: { year: string, total: number, monthsTotals: { month: string, total: number }[] }[] = [];

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @Input() years: string[] = [];

  @ViewChild(CardBarChartPageDirective) cardBarChart!: CardBarChartPageDirective;

  constructor(private logger: LoggerService,
    private utility: UtilityService
  ) {
    this.logger.trackEventCalls(CardsYearlyAnalyticsPage.name, "constructor");
    Chart.register(ChartDataLabels);
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(CardsYearlyAnalyticsPage.name, "ngOnInit");
    this.loadChartData();
    this.loadTransactions();
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
      this.inputBackgroundColor.push(this.utility.getRandomColor());
    }
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
