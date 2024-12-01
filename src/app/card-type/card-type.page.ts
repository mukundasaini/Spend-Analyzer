import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { UpdateCardTypePage } from "./update-card-type/update-card-type.page";
import { IonChip } from "@ionic/angular/standalone";
import { UtilityService } from "../services/utility.service";
import { LoggerService } from "../services/logger.service";
import { CardType } from "../Models/card-type.model";

@Component({
  selector: 'app-card-type',
  templateUrl: 'card-type.page.html',
  styleUrls: ['card-type.page.scss'],
  standalone: true,
  imports: [CommonModule, UpdateCardTypePage, IonChip
  ]
})
export class CardTypePage implements OnInit {

  @Input() cardTypes: CardType[] = [];
  colors: string[] = [];
  constructor(private log: LoggerService,
    private utility: UtilityService) {
  }
  ngOnInit(): void {
    this.log.trackEventCalls(CardTypePage.name, 'ngOnInit');

    for (var i in this.cardTypes) {
      this.colors.push(this.utility.getRandomIonColor());
    }
  }
}
