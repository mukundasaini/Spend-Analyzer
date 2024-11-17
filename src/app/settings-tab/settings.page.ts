import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardsPage } from "../cards/cards.page";
import { CategoryPage } from "../category/category.page";
import {
  IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { CreateCardPage } from '../cards/create-card/create-card.page';
import { CreateCategoryPage } from "../category/create-category/create-category.page";
import { Category } from '../Models/category.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CardDetails } from '../Models/card-details.model';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../services/utility.service';
import { FirebaseService } from '../services/firebase.service';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
    IonButtons, IonButton, CreateCardPage, CardsPage, CreateCategoryPage, CategoryPage
  ]
})
export class SettingsPage implements OnInit, OnDestroy {
  categories$: Observable<Category[]>;
  cards$: Observable<CardDetails[]>;
  onDestroy$: Subject<void> = new Subject();

  inputCategories: Category[] = [];
  inputCards: CardDetails[] = [];

  hasCardsData: boolean = false;
  hasCatsData: boolean = false;

  constructor(private logger: LoggerService,
    private utility: UtilityService,
    private firebase: FirebaseService) {
    this.logger.trackEventCalls(SettingsPage.name, "constructor");
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
    this.utility.showLoading();
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
}
