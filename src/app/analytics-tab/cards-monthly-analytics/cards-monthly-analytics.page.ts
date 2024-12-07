import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CardDetails } from "src/app/Models/card-details.model";
import { VerticalBarChartDirective } from "../directives/vertical-bar-chart.directive";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";
import { GROUPBY } from "src/app/app.constants";

@Component({
  selector: 'app-cards-monthly-analytics',
  templateUrl: 'cards-monthly-analytics.page.html',
  styleUrls: ['cards-monthly-analytics.page.scss'],
  standalone: true,
  imports: [CommonModule, VerticalBarChartDirective, IonItem, IonButton, IonLabel, IonAccordion,
    IonAccordionGroup],
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

    let expenses = changes['expenses'];
    let currentSelected = expenses === undefined ? <Expense>{} : (
      expenses.currentValue === undefined ? <Expense>{} : (expenses.currentValue as Expense[])[0]);
    let previousSelected = expenses === undefined ? <Expense>{} : (
      expenses.previousValue === undefined ? undefined : (expenses.previousValue as Expense[])[0]);

    let cards = changes['cards'];
    let currentSelectedCards = cards === undefined ? [] : (cards.currentValue as CardDetails[]);
    let previousSelectedCards = cards === undefined ? undefined : (cards.previousValue as CardDetails[]);

    if ((previousSelected != undefined && currentSelected.year != previousSelected.year)
      || (previousSelectedCards != undefined
        && currentSelectedCards.length != previousSelectedCards.length)) {
      this.loadChartData();
      this.cardBarChart.chart.data.labels = this.inputLabels;
      this.cardBarChart.chart.data.datasets[0].data = this.inputData;
      this.cardBarChart.chart.data.datasets[0].backgroundColor = this.inputBackgroundColor;
      this.cardBarChart.chart.update();
      this.loadTransactions();
    }
  }

  loadChartData() {
    this.logger.trackEventCalls(CardsMonthlyAnalyticsPage.name, "loadChartData");
    this.inputLabels = [];
    this.inputData = [];
    this.inputBackgroundColor = [];

    var monthGroups = this.utility.expenseGroupBy(this.expenses, GROUPBY.month);

    for (const key in monthGroups) {
      let total = this.utility.getTotal(monthGroups[key]);
      let label = this.utility.getMonthName(key);
      this.inputData.push(total);
      if (label !== undefined)
        this.inputLabels.push(label);
    }
    this.inputBackgroundColor = this.utility.getRandomColors(this.inputLabels.length);
  }

  loadTransactions() {
    this.logger.trackEventCalls(CardsMonthlyAnalyticsPage.name, "loadTransactions");
    this.monthlyExpenses = [];
    this.cardsTotal = 0;
    var monthGroups = this.utility.expenseGroupBy(this.expenses, GROUPBY.month);

    for (const monthkey in monthGroups) {
      let total = this.utility.getTotal(monthGroups[monthkey]);
      let monthName = this.utility.getMonthName(monthkey);
      var cardGroups = this.utility.expenseGroupBy(monthGroups[monthkey], GROUPBY.card);
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
