import { CommonModule, formatDate } from "@angular/common";
import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild } from "@angular/core";
import { collection, collectionData, Firestore, orderBy, query, where } from "@angular/fire/firestore";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, ChartData, ChartDataset } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable, of } from "rxjs";
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
export class CardsAnalyticsPage implements OnInit {

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
  cardsExpenses: { cardId: string, expenses: Expense[] }[] = [];
  @Input() cards: CardDetails[] = [];
  @Input() cats: Category[] = [];
  @Input() expenses: Expense[] = [];
  @ViewChild(CardPieChartPageDirective) cardPieChart!: CardPieChartPageDirective;

  constructor() {
    console.log(this.logPrefix + "constructor");
    Chart.register(ChartDataLabels);
  }
  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.loadChartTransData(this.expenses);
  }

  loadChartTransData(expenses: Expense[]) {
    this.inputBackgroundColor = [];
    this.inputData = [];
    this.inputLabels = [];
    this.cardsTotal = 0;
    this.cardsExpenses = [];

    this.cards.forEach(card => {
      let total: number = 0;
      let filterData = expenses.filter(expense => expense.cardTypeId == card.id);
      let amounts = filterData.map(e => e.amount);
      amounts.forEach(amount => {
        amount = typeof (amount) == 'string' ? parseInt(amount) : amount;
        total = total + amount;
      })
      if (total > 0) {
        this.inputData.push(total);
        this.inputLabels.push(`${card.bankName}-${card.type}`);
        this.inputBackgroundColor.push(this.getRGB(this.getRandomColor()));
      }
      let cardsFilterData: Expense[] = [];
      let catIds = filterData.map(e => e.categoryId).filter((v, i, a) => a.indexOf(v) == i);
      catIds.forEach(catId => {
        let total: number = 0;
        let catExpenses = filterData.filter(e => e.categoryId == catId);
        let amounts = catExpenses.map(e => e.amount);
        amounts.forEach(amount => {
          amount = typeof (amount) == 'string' ? parseInt(amount) : amount;
          total = total + amount;
        });
        if (total > 0)
          cardsFilterData.push(<Expense>{ cardTypeId: card.id, categoryId: catId, amount: total });
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

  onCategoryChange(event: any) {
    let catExpenses = event.target.value == 'ALL' ? this.expenses : this.expenses.filter(e => e.categoryId == event.target.value);
    this.loadChartTransData(catExpenses);
    this.cardPieChart.chart.data.labels = this.inputLabels;
    this.cardPieChart.chart.data.datasets[0].data = this.inputData;
    this.cardPieChart.chart.data.datasets[0].backgroundColor = this.inputBackgroundColor;
    this.cardPieChart.chart.update();
  }
}
