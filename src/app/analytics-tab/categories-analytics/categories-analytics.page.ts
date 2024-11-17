import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
  IonAccordionGroup, IonAccordion,
  IonItem, IonLabel, IonButton} from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CardDetails } from "src/app/Models/card-details.model";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { HorizentalBarChartDirective } from "../directives/horizental-bar-chart.directive";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-categories-analytics',
  templateUrl: 'categories-analytics.page.html',
  styleUrls: ['categories-analytics.page.scss'],
  standalone: true,
  imports: [CommonModule, HorizentalBarChartDirective, IonItem, IonButton, IonLabel, IonAccordionGroup,
    IonAccordion
  ],
})
export class CategoriesAnalyticsPage implements OnInit, OnChanges {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  catsTotal: number = 0;
  showTransactions: boolean = false;

  inputLabels: string[] = [];
  inputBackgroundColor: string[] = [];
  inputData: number[] = [];

  categoriesExpenses: { catId: string, total: number, expenses: Expense[] }[] = [];
  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(HorizentalBarChartDirective) catBarChart!: HorizentalBarChartDirective;

  constructor(private logger: LoggerService,
    public utility: UtilityService
  ) {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "constructor");
    Chart.register(ChartDataLabels);
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "ngOnInit");
    this.loadChartData();
    this.loadTransactions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "ngOnChanges");
    if (changes['expenses'].previousValue !== undefined) {
      let currentSelected = (changes['expenses'].currentValue as Expense[])[0];
      let previousSelected = (changes['expenses'].previousValue as Expense[])[0];
      if (currentSelected.month != previousSelected.month
        || currentSelected.year != previousSelected.year) {
        this.loadChartData();
        this.catBarChart.chart.data.labels = this.inputLabels;
        this.catBarChart.chart.data.datasets[0].data = this.inputData;
        this.catBarChart.chart.data.datasets[0].backgroundColor = this.inputBackgroundColor;
        this.catBarChart.chart.update();
        this.loadTransactions();
      }
    }
  }

  loadChartData() {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "loadChartData");
    this.inputBackgroundColor = [];
    this.inputData = [];
    this.inputLabels = [];
    let catGroups = this.utility.expenseGroupBy(this.expenses, 'cat');
    for (var catkey in catGroups) {
      let total = this.utility.getTotal(catGroups[catkey]);
      let catName = this.utility.getCategory(this.cats, catkey);
      this.inputData.push(total);
      this.inputLabels.push(catName);
      this.inputBackgroundColor.push(this.utility.getRandomColor());
    }
  }

  loadTransactions() {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "loadTransactions");
    this.catsTotal = 0;
    this.categoriesExpenses = [];

    let catGroups = this.utility.expenseGroupBy(this.expenses, 'cat');
    for (var catkey in catGroups) {
      let total = this.utility.getTotal(catGroups[catkey]);
      let cardExpenses: Expense[] = [];
      let cardGroups = this.utility.expenseGroupBy(catGroups[catkey], 'card');
      for (var cardkey in cardGroups) {
        let total = this.utility.getTotal(cardGroups[cardkey]);
        cardExpenses.push(<Expense>{ cardTypeId: cardkey, categoryId: catkey, amount: total });
      }
      this.catsTotal = this.catsTotal + total;
      this.categoriesExpenses.push({ catId: catkey, expenses: cardExpenses, total: total });
    }

    this.categoriesExpenses = this.categoriesExpenses.sort((a, b) => b.total - a.total);
  }
}
