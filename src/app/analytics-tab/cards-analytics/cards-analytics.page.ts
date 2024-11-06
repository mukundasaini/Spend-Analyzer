import { CommonModule, formatDate } from "@angular/common";
import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { collection, collectionData, Firestore, orderBy, query, where } from "@angular/fire/firestore";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData, ChartDataset } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable, of, map } from 'rxjs';
import { AppConstants } from "src/app/app.constants";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CardPieChartPageDirective } from "../directives/card-pie-chart.page.directive";
import { CardDetails } from "src/app/Models/card-details.model";

@Component({
  selector: 'app-cards-analytics',
  templateUrl: 'cards-analytics.page.html',
  styleUrls: ['cards-analytics.page.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonButton, IonLabel, IonItem, IonAccordion, IonAccordionGroup,
    CommonModule, IonContent, IonTitle, IonToolbar, IonHeader, CardPieChartPageDirective],
})
export class CardsAnalyticsPage implements OnInit, OnChanges {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  cardsTotal: number = 0;
  showTransactions: boolean = false;

  firestore: Firestore = inject(Firestore);

  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;
  expenseCollection = AppConstants.collections.expense;

  logPrefix: string = 'CARDSANALYTICS_PAGE::: ';

  inputLabels: string[] = [];
  inputData: number[] = [];
  inputBackgroundColor: string[] = [];
  cardsExpenses: { cardId: string, expenses: { transactions: Expense[], totalExpense: Expense }[] }[] = [];
  cardsCopy: CardDetails[] = [];
  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(CardPieChartPageDirective) cardPieChart!: CardPieChartPageDirective;

  constructor() {
    console.log(this.logPrefix + "constructor");
    Chart.register(ChartDataLabels);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.logPrefix + "ngOnChanges");
    if (changes['expenses'].previousValue !== undefined) {
      let currentSelected = (changes['expenses'].currentValue as Expense[])[0];
      let previousSelected = (changes['expenses'].previousValue as Expense[])[0];
      if (currentSelected.month != previousSelected.month
        || currentSelected.year != previousSelected.year) {
        this.loadChartTransData();
        this.cardPieChart.chart.data.labels = this.inputLabels;
        this.cardPieChart.chart.data.datasets[0].data = this.inputData;
        this.cardPieChart.chart.data.datasets[0].backgroundColor = this.inputBackgroundColor;
        this.cardPieChart.chart.update();
      }
    }
  }
  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.cardsCopy = Array.from(this.cards);
    this.loadChartTransData();
  }

  loadChartTransData() {
    this.inputBackgroundColor = [];
    this.inputData = [];
    this.inputLabels = [];
    this.cardsTotal = 0;
    this.cardsExpenses = [];

    this.cards.forEach(card => {
      let filterData = this.expenses.filter(expense => expense.cardTypeId == card.id);
      let total = filterData.reduce((sum, e) => sum + e.amount, 0);
      if (total > 0) {
        this.inputData.push(total);
        this.inputLabels.push(`${card.bankName}-${card.type}`);
        this.inputBackgroundColor.push(this.getRGB(this.getRandomColor()));
      }
      let cardsFilterData: { transactions: Expense[], totalExpense: Expense }[] = [];
      let catIds = filterData.map(e => e.categoryId).filter((v, i, a) => a.indexOf(v) == i);
      catIds.forEach(catId => {
        let catExpenses = filterData.filter(e => e.categoryId == catId);
        let total = catExpenses.reduce((sum, e) => sum + e.amount, 0);
        if (total > 0)
          cardsFilterData.push({ transactions: catExpenses, totalExpense: <Expense>{ cardTypeId: card.id, categoryId: catId, amount: total } });
      });
      if (cardsFilterData.length > 0)
        this.cardsExpenses.push({ cardId: card.id, expenses: cardsFilterData });
      this.cardsTotal = this.cardsTotal + total;
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

  getCategory(categoryId: string) {
    return this.cats?.find(x => x.id == categoryId)?.name;
  }
  setShowTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  onLegendItemClick(legend: any) {
    var labelData = legend.label.split('-');
    var bankName = labelData[0].trim();
    var type = labelData[1].trim();
    var card = this.cards.find(c => c.bankName == bankName && c.type == type);

    if (!legend.display) {
      let index = card === undefined ? -1 : this.cards.indexOf(card);
      this.cards.splice(index, 1);
    } else {
      if (card === undefined) {
        var cardCopy = this.cardsCopy.find(c => c.bankName == bankName && c.type == type);
        if (cardCopy != undefined)
          this.cards.push(cardCopy);
      }
    }
    this.loadChartTransData();
  }
}
