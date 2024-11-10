import { CardDetails } from "../Models/card-details.model";
import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { UpdateCardPage } from "./update-card/update-card.page";
import { IonButton, IonChip, IonSkeletonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-cards',
  templateUrl: 'cards.page.html',
  styleUrls: ['cards.page.scss'],
  standalone: true,
  imports: [IonSkeletonText, CommonModule, UpdateCardPage,
    IonChip,
    IonButton
  ]
})
export class CardsPage {
 
  @Input() cards: CardDetails[] = [];

  constructor() {
  }

}
