import { CommonModule, formatDate } from "@angular/common";
import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from "@angular/core";
import { collection, collectionData, Firestore, orderBy, query, where } from "@angular/fire/firestore";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData, ChartDataset } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable, of } from "rxjs";
import { AppConstants } from "src/app/app.constants";
import { CardDetails } from "src/app/Models/card-details.model";
import { Category } from "src/app/Models/category.model";
import { Expense } from "src/app/Models/expense-model";
import { CatPieChartPageDirective } from "../directives/cat-pie-chart.page.directive";
import { CatBarChartPageDirective } from "../directives/cat-bar-chart.page.directive";

@Component({
  selector: 'app-categories-analytics',
  templateUrl: 'categories-analytics.page.html',
  styleUrls: ['categories-analytics.page.scss'],
  standalone: true,
  imports: [IonButton, IonSelect, IonSelectOption, IonLabel, IonItem, IonAccordion, IonAccordionGroup, CommonModule,
    IonContent, IonTitle, IonToolbar, IonHeader, CatPieChartPageDirective, CatBarChartPageDirective],
})
export class CategoriesAnalyticsPage implements OnInit, OnChanges {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  catsTotal: number = 0;
  showTransactions: boolean = false;

  firestore: Firestore = inject(Firestore);
  logPrefix: string = 'CATEGORIESANALYTICS_PAGE::: ';

  cardCollection = AppConstants.collections.cards;
  categoryCollection = AppConstants.collections.category;
  expenseCollection = AppConstants.collections.expense;

  inputLabels: string[] = [];
  inputBackgroundColor: string[] = [];
  inputData: number[] = [];

  categoriesExpenses: { catId: string, expenses: Expense[] }[] = [];
  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(CatBarChartPageDirective) catBarChart!: CatBarChartPageDirective;

  constructor() {
    console.log(this.logPrefix + "constructor");
    Chart.register(ChartDataLabels);
  }
  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.loadChartTransData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.logPrefix + "ngOnChanges");
    if (changes['expenses'].previousValue !== undefined) {
      let currentSelected = (changes['expenses'].currentValue as Expense[])[0];
      let previousSelected = (changes['expenses'].previousValue as Expense[])[0];
      if (currentSelected.month != previousSelected.month
        || currentSelected.year != previousSelected.year) {
        this.loadChartTransData();
        this.catBarChart.chart.data.labels = this.inputLabels;
        this.catBarChart.chart.data.datasets[0].data = this.inputData;
        this.catBarChart.chart.data.datasets[0].backgroundColor = this.inputBackgroundColor;
        this.catBarChart.chart.update();
      }
    }
  }

  loadChartTransData() {
    this.inputBackgroundColor = [];
    this.inputData = [];
    this.inputLabels = [];
    this.catsTotal = 0;
    this.categoriesExpenses = [];

    this.cats.forEach(category => {
      let total: number = 0;
      let filterData = this.expenses.filter(expense => expense.categoryId == category.id);
      let amounts = filterData.map(e => e.amount);
      amounts.forEach(amount => {
        amount = typeof (amount) == 'string' ? parseInt(amount) : amount;
        total = total + amount;
      })
      if (total > 0) {
        this.inputData.push(total);
        this.inputLabels.push(category.name);
        this.inputBackgroundColor.push(this.getRGB(this.getRandomColor()));
      }
      let catsFilterData: Expense[] = [];
      let cardIds = filterData.map(e => e.cardTypeId).filter((v, i, a) => a.indexOf(v) == i);
      cardIds.forEach(cardId => {
        let total: number = 0;
        let cardExpenses = filterData.filter(e => e.cardTypeId == cardId);
        let amounts = cardExpenses.map(e => e.amount);
        amounts.forEach(amount => {
          amount = typeof (amount) == 'string' ? parseInt(amount) : amount;
          total = total + amount;
        });
        if (total > 0)
          catsFilterData.push(<Expense>{ cardTypeId: cardId, categoryId: category.id, amount: total });
      });
      if (catsFilterData.length > 0)
        this.categoriesExpenses.push({ catId: category.id, expenses: catsFilterData });
      this.catsTotal = this.catsTotal + total;
    });
  }

  getCardBankName(cardTypeId: string) {
    let card = this.cards.find(x => x.id == cardTypeId);
    return `${card?.bankName}-${card?.type}`;
  }
  setShowTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  getRGB(colorHex: string) {
    let r = parseInt(colorHex.slice(1, 3), 16);
    let g = parseInt(colorHex.slice(3, 5), 16);
    let b = parseInt(colorHex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
