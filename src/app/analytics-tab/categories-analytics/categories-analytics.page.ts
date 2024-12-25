import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
  IonAccordionGroup, IonAccordion,
  IonItem, IonLabel, IonButton, IonIcon, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CardDetails } from "src/app/Models/card-details.model";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";
import { GROUPBY } from "src/app/app.constants";
import { PieChartDirective } from "../directives/pie-chart.directive";
import { addIcons } from "ionicons";
import { remove } from "ionicons/icons";

@Component({
  selector: 'app-categories-analytics',
  templateUrl: 'categories-analytics.page.html',
  styleUrls: ['categories-analytics.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonIcon, CommonModule, PieChartDirective, IonItem, IonButton, IonLabel, IonAccordionGroup,
    IonAccordion
  ],
})
export class CategoriesAnalyticsPage implements OnInit, OnChanges {

  chartData: ChartData = <ChartData>{};
  chart!: Chart;
  config!: ChartConfiguration;

  catsTotal: number = 0;
  showTransactions: boolean = true;
  expensesTransactions: Expense[] = [];

  categoriesExpenses: {
    catId: string, total: number,
    expenses: { cardTypeId: string, categoryId: string, amount: number, transactions: Expense[] }[]
  }[] = [];
  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(PieChartDirective) catChart!: PieChartDirective;

  constructor(private logger: LoggerService,
    public utility: UtilityService
  ) {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "constructor");
    Chart.register(ChartDataLabels);
    addIcons({ remove });
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "ngOnInit");
    this.expensesTransactions = Array.from(this.expenses);
    this.loadChartData();
    this.loadTransactions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "ngOnChanges");

    let expenses = changes['expenses'];
    let currentSelected = expenses === undefined ? <Expense>{} : (
      expenses.currentValue === undefined ? <Expense>{} : (expenses.currentValue as Expense[])[0]);
    let previousSelected = expenses === undefined ? <Expense>{} : (
      expenses.previousValue === undefined ? undefined : (expenses.previousValue as Expense[])[0]);

    let cards = changes['cards'];
    let currentSelectedCards = cards === undefined ? [] : (cards.currentValue as CardDetails[]);
    let previousSelectedCards = cards === undefined ? undefined : (cards.previousValue as CardDetails[]);

    if ((previousSelected != undefined &&
      (currentSelected.month != previousSelected.month || currentSelected.year != previousSelected.year))
      || (previousSelectedCards != undefined
        && currentSelectedCards.length != previousSelectedCards.length)) {
      this.expensesTransactions = Array.from(this.expenses);
      this.updateChartData();
      this.loadTransactions();
    }
  }

  updateChartData() {
    this.loadChartData();
    this.catChart.chart.update();
  }

  loadChartData() {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "loadChartData");
    let data = [];
    let labels = [];
    this.chartData.datasets = [];
    let catGroups = this.utility.expenseGroupBy(this.expenses, GROUPBY.cat);
    for (var catkey in catGroups) {
      let total = this.utility.getTotal(catGroups[catkey]);
      let catName = this.utility.getCategory(this.cats, catkey);
      data.push(total);
      labels.push(catName);
    }

    this.chartData.datasets.push({
      data: data,
      backgroundColor: this.utility.getRandomRGBAColors(labels.length, 0.5),
      label: 'Rs',
      hoverOffset: 20,
      borderColor: this.utility.getRandomColor()
    });

    this.chartData.labels = labels;
  }

  loadTransactions() {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "loadTransactions");
    this.catsTotal = 0;
    this.categoriesExpenses = [];

    let catGroups = this.utility.expenseGroupBy(this.expensesTransactions, GROUPBY.cat);
    for (var catkey in catGroups) {
      let total = this.utility.getTotal(catGroups[catkey]);
      let cardExpenses: { cardTypeId: string, categoryId: string, amount: number, transactions: Expense[] }[] = [];
      let cardGroups = this.utility.expenseGroupBy(catGroups[catkey], GROUPBY.card);
      for (var cardkey in cardGroups) {
        let total = this.utility.getTotal(cardGroups[cardkey]);
        cardExpenses.push({ cardTypeId: cardkey, categoryId: catkey, amount: total, transactions: cardGroups[cardkey] });
      }
      this.catsTotal = this.catsTotal + total;
      this.categoriesExpenses.push({ catId: catkey, expenses: cardExpenses, total: total });
    }

    this.categoriesExpenses = this.categoriesExpenses.sort((a, b) => b.total - a.total);
  }

  onCatExcludeClick(index: number) {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "onCatExcludeClick");
    let excludeExpensesIds = this.categoriesExpenses[index].expenses.map(e => e.transactions)
      .reduce((p, c) => p.concat(c), []).map(e => e.id);
    this.expensesTransactions = this.expensesTransactions.filter(e => !excludeExpensesIds.includes(e.id));
    this.expenses = this.expenses.filter(e => !excludeExpensesIds.includes(e.id));
    this.updateChartData();
    this.loadTransactions();
  }

  onCardExcludeClick(index: number, cardId: string) {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "onCardExcludeClick");
    let excludeExpensesIds = this.categoriesExpenses[index].expenses
      .filter(e => e.cardTypeId == cardId)
      .map(e => e.transactions).reduce((p, c) => p.concat(c), []).map(e => e.id);
    this.expensesTransactions = this.expensesTransactions.filter(e => !excludeExpensesIds.includes(e.id));
    this.expenses = this.expenses.filter(e => !excludeExpensesIds.includes(e.id));

    this.updateChartData();
    this.loadTransactions();
  }

  onItemExcludeClick(id: string) {
    this.logger.trackEventCalls(CategoriesAnalyticsPage.name, "onItemExcludeClick");
    this.expensesTransactions = this.expensesTransactions.filter(e => e.id != id);
    this.expenses = this.expenses.filter(e => e.id != id);
    this.updateChartData();
    this.loadTransactions();
  }
}
