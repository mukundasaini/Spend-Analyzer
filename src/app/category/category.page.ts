import { Component, Input } from "@angular/core";
import { Category } from "../Models/category.model";
import { IonChip, IonReorderGroup, IonReorder, IonItem, IonCard, IonLabel } from "@ionic/angular/standalone";
import { UpdateCategoryPage } from "./update-category/update-category.page";
import { CommonModule } from "@angular/common";
import { ItemReorderEventDetail } from '@ionic/angular';
import { FirebaseService } from "../services/firebase.service";
import { LoggerService } from "../services/logger.service";
import { UtilityService } from "../services/utility.service";
import { AppConstants } from "../app.constants";

@Component({
  selector: 'app-category',
  templateUrl: 'category.page.html',
  styleUrls: ['category.page.scss'],
  standalone: true,
  imports: [IonLabel, IonCard, IonItem, IonReorder, IonReorderGroup, CommonModule, IonChip, UpdateCategoryPage],
})
export class CategoryPage{

  @Input() categories: Category[] = [];
  @Input() isEnabledReorder: boolean = false;
  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.logger.trackEventCalls(CategoryPage.name, "handleReorder");
    ev.detail.complete();
    let from = ev.detail.from;
    let to = ev.detail.to;

    var fromCat = this.categories[from];
    fromCat.order = from < to ? to + 1 : (from == 1 ? from : to + 1);
    this.updateCatOrder(fromCat);

    var toCat = this.categories[to];
    toCat.order = from < to ? to : from + 1;
    this.updateCatOrder(toCat);

    if (from < to) {
      let middleOrder = to;
      for (let index = from + 1; index < to; index++) {
        middleOrder = middleOrder - 1;
        let middleCat = this.categories[index];
        middleCat.order = middleOrder;
        this.updateCatOrder(middleCat);
      }
    } else {
      for (let index = to + 1; index < from; index++) {
        let middleCat = this.categories[index];
        middleCat.order = index + 1;
        this.updateCatOrder(middleCat);
      }
    }
  }
  updateCatOrder(cat: Category) {
    this.firebase.updateRecordDetails(AppConstants.collections.category, cat, false);
  }

}
