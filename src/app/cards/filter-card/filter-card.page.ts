import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { collection, collectionData, Firestore } from "@angular/fire/firestore";
import { IonButton, IonCheckbox, IonCol, IonContent, IonGrid, IonItem, IonList, IonPopover, IonRow } from "@ionic/angular/standalone";
import { map, Observable, Subject, takeUntil } from "rxjs";
import { AppConstants } from "src/app/app.constants";
import { CardDetails } from "src/app/Models/card-details.model";
import { CheckBox } from '../../Models/checkbox.model';

@Component({
  selector: 'app-filter-card',
  templateUrl: 'filter-card.page.html',
  styleUrls: ['filter-card.page.scss'],
  standalone: true,
  imports: [CommonModule, IonPopover, IonContent, IonGrid, IonRow, IonCol, IonCheckbox, IonList, IonItem, IonButton]
})
export class FilterCardPage implements OnInit {
  bankNames: CheckBox[] = [];
  cardTypes: CheckBox[] = [];

  slectedBankNames: string[] = [];
  slectedCardTypes: string[] = [];

  isAllBankNamesChecked: boolean = false;
  isAllCardTypesChecked: boolean = false;

  cards$: Observable<CardDetails[]>;
  onDestroy$: Subject<void> = new Subject();
  firestore: Firestore = inject(Firestore);
  logPrefix: string = 'FILTERCARD_PAGE::: ';

  cardTypeCollection = AppConstants.collections.cards;

  @Output() onCardFilter = new EventEmitter<{ filterIndicator: string, filterdData$: Observable<CardDetails[]> }>();
  @Input() cards: CardDetails[] = [];

  constructor() {
    console.log(this.logPrefix + "constructor");
    this.cards$ = collectionData(collection(this.firestore, this.cardTypeCollection)) as Observable<CardDetails[]>;
  }

  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.cards.map(item => item.bankName)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach(bankName => {
        this.bankNames.push({ value: bankName, checked: false });
      });
    this.cards.map(item => item.type)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach(name => {
        this.cardTypes.push({ value: name, checked: false });
      });
  }

  onBankNameChange(event: any) {
    if (event.detail.checked) {
      this.slectedBankNames.push(event.detail.value);
      let selectdItem = this.bankNames.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.slectedBankNames.splice(event.detail.value, 1);
      let selectdItem = this.bankNames.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllBankNamesChecked = this.bankNames.every(x => x.checked == true);
  }

  onCardTypeChange(event: any) {
    if (event.detail.checked) {
      this.slectedCardTypes.push(event.detail.value);
      let selectdItem = this.cardTypes.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.slectedCardTypes.splice(event.detail.value, 1);
      let selectdItem = this.cardTypes.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllCardTypesChecked = this.cardTypes.every(x => x.checked == true);
  }

  onAllBankNamesChange(event: any) {
    if (event.detail.checked) {
      this.slectedBankNames = [];
      this.bankNames.forEach(element => {
        this.slectedBankNames.push(element.value);
        element.checked = true;
      });
      this.isAllBankNamesChecked = true;
    } else {
      this.slectedBankNames = [];
      this.bankNames.forEach(element => {
        element.checked = false;
      });
      this.isAllBankNamesChecked = false;
    }
  }

  onAllCardTypesChange(event: any) {
    if (event.detail.checked) {
      this.slectedCardTypes = [];
      this.cardTypes.forEach(element => {
        this.slectedCardTypes.push(element.value);
        element.checked = true;
      });
      this.isAllCardTypesChecked = true;
    } else {
      this.slectedCardTypes = [];
      this.cardTypes.forEach(element => {
        element.checked = false;
      });
      this.isAllCardTypesChecked = false;
    }
  }

  onApplyFilters() {
    let filterData$!: Observable<CardDetails[]>;

    if (this.slectedBankNames.length > 0) {
      filterData$ = this.cards$.pipe(map(cards => cards.filter(card => this.slectedBankNames.includes(card.bankName))));
      if (this.slectedCardTypes.length > 0) {
        filterData$ = filterData$.pipe(map(cards => cards.filter(card => this.slectedCardTypes.includes(card.type))));
      }
    } else {
      filterData$ = this.cards$.pipe(map(cards => cards.filter(card => this.slectedCardTypes.includes(card.type))));
    }

    this.onCardFilter.emit({ filterIndicator: '.', filterdData$: filterData$ });
  }

  onClearFilter() {
    this.bankNames.forEach(element => {
      element.checked = false;
    });
    this.cardTypes.forEach(element => {
      element.checked = false;
    });
    this.isAllBankNamesChecked = false;
    this.isAllCardTypesChecked = false;
    this.slectedBankNames = [];
    this.slectedCardTypes = [];
    this.onCardFilter.emit({ filterIndicator: '', filterdData$: this.cards$ });
  }
}