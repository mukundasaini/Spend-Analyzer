import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { UpdateBankPage } from "./update-bank/update-bank.page";
import { IonChip } from "@ionic/angular/standalone";
import { Bank } from "../Models/bank.model";
import { UtilityService } from "../services/utility.service";
import { LoggerService } from "../services/logger.service";

@Component({
  selector: 'app-bank',
  templateUrl: 'bank.page.html',
  styleUrls: ['bank.page.scss'],
  standalone: true,
  imports: [CommonModule, UpdateBankPage, IonChip
  ]
})
export class BankPage implements OnInit {

  @Input() banks: Bank[] = [];
  colors: string[] = [];

  constructor(private log: LoggerService,
    private utility: UtilityService) {
  }

  ngOnInit(): void {
    this.log.trackEventCalls(BankPage.name, 'ngOnInit');
    for (var i in this.banks) {
      this.colors.push(this.utility.getRandomIonColor());
    }
  }
}
