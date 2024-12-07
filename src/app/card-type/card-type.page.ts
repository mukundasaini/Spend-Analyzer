import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { UpdateCardTypePage } from "./update-card-type/update-card-type.page";
import { IonChip } from "@ionic/angular/standalone";
import { CardType } from "../Models/card-type.model";
import { UtilityService } from "../services/utility.service";

@Component({
  selector: 'app-card-type',
  templateUrl: 'card-type.page.html',
  styleUrls: ['card-type.page.scss'],
  standalone: true,
  imports: [CommonModule, UpdateCardTypePage, IonChip
  ]
})
export class CardTypePage {

  @Input() cardTypes: CardType[] = [];
  constructor(public utility: UtilityService) {
  }
}
