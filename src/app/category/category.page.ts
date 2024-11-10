import { Component, Input } from "@angular/core";
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
  @Input() categories: Category[] = [];

  constructor() { 
  }
}
