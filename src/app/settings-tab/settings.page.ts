import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CardsPage } from "../cards/cards.page";
import { CategoryPage } from "../category/category.page";
import { IonBadge, IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonList, IonModal, IonPopover, IonRow, IonTitle, IonToolbar, IonChip, IonSkeletonText } from '@ionic/angular/standalone';
import { CreateCardPage } from '../cards/create-card/create-card.page';
import { FilterCardPage } from '../cards/filter-card/filter-card.page';
import { CreateCategoryPage } from "../category/create-category/create-category.page";
import { FilterCategoryPage } from "../category/filter-category/filter-category.page";
import { Category } from '../Models/category.model';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { collection, collectionData, docData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { AppConstants } from '../app.constants';
import { CardDetails } from '../Models/card-details.model';
import { addIcons } from 'ionicons';
import { filter } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [CommonModule, IonSkeletonText, IonChip, CardsPage, IonBadge, IonInput, IonModal, IonButtons, IonButton, IonIcon, IonPopover, IonCheckbox,
    IonList, IonItem, CreateCardPage, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CategoryPage, FilterCardPage, CreateCategoryPage, FilterCategoryPage]
})
export class SettingsPage implements OnInit, OnDestroy {
  categories$: Observable<Category[]>;
  cards$: Observable<CardDetails[]>;
  onDestroy$: Subject<void> = new Subject();
  loading!: HTMLIonLoadingElement;

  logPrefix: string = 'SETTINGS_PAGE::: ';

  firestore: Firestore = inject(Firestore);
  categoryCollection = AppConstants.collections.category;
  cardCollection = AppConstants.collections.cards;
  cardsFilterIndeicator: string = '';
  categoriesFilterIndeicator: string = '';

  inputCategories: Category[] = [];
  inputCards: CardDetails[] = [];

  hasCardsData: boolean = false;
  hasCatsData: boolean = false;

  constructor(private loadingCtrl: LoadingController) {
    console.log(this.logPrefix + "constructor");
    this.showLoading();
    addIcons({ filter });
    this.categories$ = collectionData(
      query(collection(this.firestore, this.categoryCollection),
        orderBy('id', 'desc'))) as Observable<Category[]>;
    this.cards$ = collectionData(
      query(collection(this.firestore, this.cardCollection),
        orderBy('id', 'desc'))) as Observable<CardDetails[]>;
  }
  ngOnDestroy(): void {
    console.log(this.logPrefix + "ngOnDestroy");
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.categories$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cats => {
        this.inputCategories = cats;
        this.hasCatsData = cats.length > 0;
        this.loading.dismiss();
      });

    this.cards$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cards => {
        this.inputCards = cards;
        this.hasCardsData = cards.length > 0;
      });

  }

  onApplyCardFilters(data: { filterIndicator: string, filterdData$: Observable<CardDetails[]> }) {
    this.cards$ = data.filterdData$;
    this.cardsFilterIndeicator = data.filterIndicator;
    this.cards$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cards => {
        this.inputCards = cards;
      });
  }

  onApplyCategoryFilters(data: { filterIndicator: string, filterdData$: Observable<Category[]> }) {
    this.categories$ = data.filterdData$;
    this.categoriesFilterIndeicator = data.filterIndicator;
    this.categories$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cats => {
        this.inputCategories = cats;
      });

  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Fetcing data...',
      // duration: 3000,
      cssClass: 'custom-loading'
    });
    this.loading.present();
  }
}
