import { CardDetails } from "../Models/card-details.model";
import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { UpdateCardPage } from "./update-card/update-card.page";
import { IonButton, IonChip, IonReorderGroup, IonReorder, IonItem } from "@ionic/angular/standalone";
import { ItemReorderEventDetail } from '@ionic/angular';
import { AppConstants } from "../app.constants";
import { LoggerService } from "../services/logger.service";
import { FirebaseService } from "../services/firebase.service";
import { UtilityService } from "../services/utility.service";

@Component({
  selector: 'app-cards',
  templateUrl: 'cards.page.html',
  styleUrls: ['cards.page.scss'],
  standalone: true,
  imports: [IonItem, IonReorder, IonReorderGroup, CommonModule, UpdateCardPage, IonChip
  ]
})
export class CardsPage {

  @Input() cards: CardDetails[] = [];

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {

  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.logger.trackEventCalls(CardsPage.name, "handleReorder");
    ev.detail.complete();
    let from = ev.detail.from;
    let to = ev.detail.to;

    var fromCard = this.cards[from];
    fromCard.order = from < to ? to + 1 : (from == 1 ? from : to + 1);
    this.updateCardOrder(fromCard);

    var toCard = this.cards[to];
    toCard.order = from < to ? to : from + 1;
    this.updateCardOrder(toCard);

    if (from < to) {
      let middleOrder = to;
      for (let index = from + 1; index < to; index++) {
        middleOrder = middleOrder - 1;
        let middleCard = this.cards[index];
        middleCard.order = middleOrder;
        this.updateCardOrder(middleCard);
      }
    } else {
      for (let index = to + 1; index < from; index++) {
        let middleCard = this.cards[index];
        middleCard.order = index + 1;
        this.updateCardOrder(middleCard);
      }
    }

  }

  updateCardOrder(card: CardDetails) {
    this.firebase.updateRecordDetails(AppConstants.collections.cards, card, false);
  }
}
