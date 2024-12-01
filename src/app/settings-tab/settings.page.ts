import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardsPage } from "../cards/cards.page";
import { CategoryPage } from "../category/category.page";
import {
  IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle,
  IonToolbar, IonToggle, IonText } from '@ionic/angular/standalone';
import { CreateCardPage } from '../cards/create-card/create-card.page';
import { CreateCategoryPage } from "../category/create-category/create-category.page";
import { Category } from '../Models/category.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CardDetails } from '../Models/card-details.model';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../services/utility.service';
import { FirebaseService } from '../services/firebase.service';
import { LoggerService } from '../services/logger.service';
import { CreateBankPage } from '../bank/create-bank/create-bank.page';
import { BankPage } from '../bank/bank.page';
import { Bank } from '../Models/bank.model';
import { CreateCardTypePage } from "../card-type/create-card-type/create-card-type.page";
import { CardType } from '../Models/card-type.model';
import { CardTypePage } from "../card-type/card-type.page";

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [IonText, IonToggle, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
    IonButtons, IonButton, CreateBankPage, BankPage, CreateCardPage, CardsPage, CreateCategoryPage, CategoryPage, CreateCardTypePage, CardTypePage]
})
export class SettingsPage implements OnInit, OnDestroy {
  banks$: Observable<Bank[]>;
  cardTypes$: Observable<CardType[]>;
  categories$: Observable<Category[]>;
  cards$: Observable<CardDetails[]>;
  onDestroy$: Subject<void> = new Subject();

  inputCategories: Category[] = [];
  inputCards: CardDetails[] = [];
  inputBanks: Bank[] = [];
  inputCardTypes: CardType[] = [];

  hasCatsData: boolean = false;
  hasCardsData: boolean = false;
  hasBanksData: boolean = false;
  hasCardTypesData: boolean = false;
  isCardsReorderEnabled: boolean = false;
  isCatsReorderEnabled: boolean = false;

  constructor(private logger: LoggerService,
    private utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(SettingsPage.name, "constructor");
    this.banks$ = this.firebase.getBanksOrderByID();
    this.cardTypes$ = this.firebase.getCardTypesOrderByID();
    this.categories$ = this.firebase.getCategoriesOrderByID();
    this.cards$ = this.firebase.getCardsOrderByID();
  }
  ngOnDestroy(): void {
    this.logger.trackEventCalls(SettingsPage.name, "ngOnDestroy");
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(SettingsPage.name, "ngOnInit");

    this.banks$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(banks => {
        this.inputBanks = banks;
        this.hasBanksData = banks.length > 0;
      });

    this.cardTypes$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cardTypes => {
        this.inputCardTypes = cardTypes;
        this.hasCardTypesData = cardTypes.length > 0;
      });

    this.categories$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cats => {
        this.inputCategories = cats;
        this.hasCatsData = cats.length > 0;
      });

    this.cards$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cards => {
        this.inputCards = cards;
        this.hasCardsData = cards.length > 0;
      });

  }

  onCardsReorderEnableToggle(e: any) {
    this.isCardsReorderEnabled = e.target.checked
  }

  onCatsReorderEnableToggle(e: any) {
    this.isCatsReorderEnabled = e.target.checked
  }
}
