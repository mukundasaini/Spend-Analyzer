import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../Models/category.model";
import { IonButton, IonChip, IonSkeletonText } from "@ionic/angular/standalone";
import { UpdateCategoryPage } from "./update-category/update-category.page";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-category',
  templateUrl: 'category.page.html',
  styleUrls: ['category.page.scss'],
  standalone: true,
  imports: [IonSkeletonText, CommonModule, IonButton, IonChip, UpdateCategoryPage],
})
export class CategoryPage {
  logPrefix: string = 'Category_PAGE::: ';

  @Input() categories: Category[] = [];

  constructor() { 
    console.log(this.logPrefix + "constructor");
  }

}
