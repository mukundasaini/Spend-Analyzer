import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
  IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonGrid,
  IonRow, IonCol, IonIcon
} from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { PieChartDirective } from "../directives/pie-chart.directive";
import { CardDetails } from "src/app/Models/card-details.model";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";
import { addIcons } from "ionicons";
import { remove } from "ionicons/icons";

@Component({
  selector: 'app-cards-analytics',
  templateUrl: 'cards-analytics.page.html',
  styleUrls: ['cards-analytics.page.scss'],
  standalone: true,
  imports: [IonIcon, CommonModule, PieChartDirective, IonItem, IonButton, IonLabel, IonAccordion,
    IonAccordionGroup, IonGrid, IonRow, IonCol,
  ],
})
export class CardsAnalyticsPage implements OnInit, OnChanges {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  cardsTotal: number = 0;
  showTransactions: boolean = false;

  inputLabels: string[] = [];
  inputData: number[] = [];
  inputBackgroundColor: string[] = [];
  cardsExpenses: {
    cardTotal: number, cardId: string,
    expenses: {
      transactions: Expense[], cardTypeId: string,
      categoryId: string, amount: number
    }[]
  }[] = [];
  expensesTransactions: Expense[] = [];

  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(PieChartDirective) cardPieChart!: PieChartDirective;

  constructor(private logger: LoggerService,
    public utility: UtilityService
  ) {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "constructor");
    Chart.register(ChartDataLabels);
    addIcons({ remove });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "ngOnChanges");
    if (changes['expenses'].previousValue !== undefined) {
      let currentSelected = (changes['expenses'].currentValue as Expense[])[0];
      let previousSelected = (changes['expenses'].previousValue as Expense[])[0];
      let currentSelectedCards = (changes['cards'].currentValue as CardDetails[]);
      let previousSelectedCards = (changes['cards'].previousValue as CardDetails[]);

      if (currentSelected.month != previousSelected.month
        || currentSelected.year != previousSelected.year
        || currentSelectedCards.length != previousSelectedCards.length) {
        this.updateChartData();
        this.loadTransactions();
      }
    }
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "ngOnInit");
    this.expensesTransactions = Array.from(this.expenses);
    this.loadChartData();
    this.loadTransactions();
  }

  updateChartData() {
    this.loadChartData();
    this.cardPieChart.chart.data.labels = this.inputLabels;
    this.cardPieChart.chart.data.datasets[0].data = this.inputData;
    this.cardPieChart.chart.data.datasets[0].backgroundColor = this.inputBackgroundColor;
    this.cardPieChart.chart.update();
  }

  loadChartData() {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "loadChartData");
    this.inputBackgroundColor = [];
    this.inputData = [];
    this.inputLabels = [];

    var cardGroups = this.utility.expenseGroupBy(this.expenses, 'card');
    for (const key in cardGroups) {
      let total = this.utility.getTotal(cardGroups[key]);
      let label = this.utility.getcard(this.cards, key);
      this.inputData.push(total);
      this.inputLabels.push(label);
      this.inputBackgroundColor.push(this.utility.getRandomColor());
    }
  }

  loadTransactions() {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "loadTransactions");
    this.cardsExpenses = [];
    this.cardsTotal = 0;

    var cardGroups = this.utility.expenseGroupBy(this.expensesTransactions, 'card');

    for (const cardId in cardGroups) {
      let total = this.utility.getTotal(cardGroups[cardId]);
      let cardsFilterData: {
        transactions: Expense[], cardTypeId: string,
        categoryId: string, amount: number
      }[] = [];
      var catGroups = this.utility.expenseGroupBy(cardGroups[cardId], 'cat');
      for (const catId in catGroups) {
        let total = this.utility.getTotal(catGroups[catId]);
        cardsFilterData.push({
          transactions: catGroups[catId],
          cardTypeId: cardId, categoryId: catId, amount: total
        });
      }
      cardsFilterData = cardsFilterData.sort((a, b) => b.amount - a.amount);
      this.cardsExpenses.push({ cardTotal: total, cardId: cardId, expenses: cardsFilterData });
      this.cardsTotal = this.cardsTotal + total;
    }

    this.cardsExpenses = this.cardsExpenses.sort((a, b) => b.cardTotal - a.cardTotal);
  }

  onCardExcludeClick(index: number, cardId: string) {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "onGroupExcludeClick");
    let excludeExpensesIds = this.cardsExpenses[index].expenses
      .filter(e => e.cardTypeId == cardId)
      .map(e => e.transactions).reduce((p, c) => p.concat(c), []).map(e => e.id);
    this.expensesTransactions = this.expensesTransactions.filter(e => !excludeExpensesIds.includes(e.id));
    this.expenses = this.expenses.filter(e => !excludeExpensesIds.includes(e.id));

    this.updateChartData();
    this.loadTransactions();
  }

  onCatExcludeClick(index: number, catId: string) {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "onCatExcludeClick");
    let excludeExpensesIds = this.cardsExpenses[index].expenses
      .filter(e => e.categoryId == catId)
      .map(e => e.transactions).reduce((p, c) => p.concat(c), []).map(e => e.id);
    this.expensesTransactions = this.expensesTransactions.filter(e => !excludeExpensesIds.includes(e.id));
    this.expenses = this.expenses.filter(e => !excludeExpensesIds.includes(e.id));
    this.updateChartData();
    this.loadTransactions();
  }

  onItemExcludeClick(id: string) {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "onItemExcludeClick");
    this.expensesTransactions = this.expensesTransactions.filter(e => e.id != id);
    this.expenses = this.expenses.filter(e => e.id != id);
    this.updateChartData();
    this.loadTransactions();
  }

  onLegendItemClick(legend: any) {
    this.logger.trackEventCalls(CardsAnalyticsPage.name, "onLegendItemClick");
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
