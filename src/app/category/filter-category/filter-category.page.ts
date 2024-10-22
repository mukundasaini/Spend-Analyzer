import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { IonButton, IonCheckbox, IonCol, IonContent, IonGrid, IonItem, IonItemDivider, IonList, IonPopover, IonRow } from "@ionic/angular/standalone";
import { map, Observable, Subject, takeUntil, tap } from "rxjs";
import { AppConstants } from "src/app/app.constants";
import { Category } from "src/app/Models/category.model";
import { CheckBox } from "src/app/Models/checkbox.model";

@Component({
  selector: 'app-filter-category',
  templateUrl: 'filter-category.page.html',
  styleUrls: ['filter-category.page.scss'],
  standalone: true,
  imports: [CommonModule, IonPopover, IonItemDivider,
    IonContent, IonGrid, IonRow, IonCol, IonCheckbox,
    IonList, IonItem, IonButton]
})

export class FilterCategoryPage implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  categories$: Observable<Category[]>;

  logPrefix: string = 'FILTERCATEGORY_PAGE::: ';

  firestore: Firestore = inject(Firestore);

  categoryCollection = AppConstants.collections.category;

  slectedCategories: string[] = [];

  categoryNames: CheckBox[] = [];

  @Output() onCategoryFilter = new EventEmitter<{ filterIndicator: string, filterdData$: Observable<Category[]> }>();
  @Input() categories: Category[] = [];

  isAllCategoriesChecked: boolean = false;

  constructor() {
    console.log(this.logPrefix + "constructor");
    this.categories$ = collectionData(collection(this.firestore, this.categoryCollection)) as Observable<Category[]>;
  }

  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.categories.forEach(category => {
      this.categoryNames.push({ value: category.name, checked: false });
    });
  }

  onCateryNameChange(event: any) {
    if (event.detail.checked) {
      this.slectedCategories.push(event.detail.value);
      let selectdItem = this.categoryNames.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = true;
    } else {
      this.slectedCategories.splice(event.detail.value, 1);
      let selectdItem = this.categoryNames.find(x => x.value == event.detail.value);
      if (selectdItem != undefined)
        selectdItem.checked = false;
    }

    this.isAllCategoriesChecked = this.categoryNames.every(x => x.checked == true);
  }

  onAllCateryNameChange(event: any) {
    if (event.detail.checked) {
      this.slectedCategories = [];
      this.categoryNames.forEach(element => {
        this.slectedCategories.push(element.value);
        element.checked = true;
      });
      this.isAllCategoriesChecked = true;
    } else {
      this.slectedCategories = [];
      this.categoryNames.forEach(element => {
        element.checked = false;
      });
      this.isAllCategoriesChecked = false;
    }
  }

  onApplyFilters() {
    let filterdData$ = this.categories$.pipe(map(categories => categories.filter(category => this.slectedCategories.includes(category.name))));
    this.onCategoryFilter.emit({ filterIndicator: '.', filterdData$: filterdData$ });
  }

  onClearFilter() {
    this.categoryNames.forEach(element => {
      element.checked = false;
    });
    this.isAllCategoriesChecked = false;
    this.slectedCategories = [];
    this.onCategoryFilter.emit({ filterIndicator: '', filterdData$: this.categories$ });
  }

}