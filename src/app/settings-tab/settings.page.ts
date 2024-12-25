import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CardsPage } from "../cards/cards.page";
import { CategoryPage } from "../category/category.page";
import {
  IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle,
  IonToolbar, IonToggle, IonText, IonItem } from '@ionic/angular/standalone';
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
import { Settings } from '../Models/settings.model';
import { AppConstants } from '../app.constants';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [IonItem, IonText, IonToggle, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
    IonButtons, IonButton, CreateBankPage, BankPage, CreateCardPage, CardsPage, CreateCategoryPage, CategoryPage, CreateCardTypePage, CardTypePage]
})
export class SettingsPage implements OnInit, OnChanges, OnDestroy {
  banks$: Observable<Bank[]>;
  cardTypes$: Observable<CardType[]>;
  categories$: Observable<Category[]>;
  cards$: Observable<CardDetails[]>;
  settings$: Observable<Settings[]>;
  onDestroy$: Subject<void> = new Subject();

  inputCategories: Category[] = [];
  inputCards: CardDetails[] = [];
  inputBanks: Bank[] = [];
  inputCardTypes: CardType[] = [];
  settings: Settings[] = [];
  settingsCount: number | undefined;

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
    this.settings$ = this.firebase.getSettings();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('settingsCount after', this.settingsCount);

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

    this.settings$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(settings => {
        this.settings = settings;
        if (this.settings.length == 0) {
          let settings: Settings[] = [];
          settings.push(<Settings>{
            key: AppConstants.settings.EDA,
            value: false,
          });
          settings.push(<Settings>{
            key: AppConstants.settings.EMA,
            value: false,
          });
          settings.push(<Settings>{
            key: AppConstants.settings.EYA,
            value: false,
          });
          settings.push(<Settings>{
            key: AppConstants.settings.ECDA,
            value: false,
          });
          settings.push(<Settings>{
            key: AppConstants.settings.ECTA,
            value: true,
          });

          settings.forEach(element => {
            element.id = UUID.UUID();
            this.firebase.saveRecordDetails(AppConstants.collections.settings, element, 0);
          });
        }
      });
  }

  onCardsReorderEnableToggle(e: any) {
    this.isCardsReorderEnabled = e.target.checked
  }

  onCatsReorderEnableToggle(e: any) {
    this.isCatsReorderEnabled = e.target.checked
  }

  onSettingsToggle(e: any, id: string) {
    var settings = {
      id: id,
      value: e.target.checked
    };
    this.firebase.updateRecordDetails(AppConstants.collections.settings, settings, false);
  }
}
