import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { UpdateBankPage } from "./update-bank/update-bank.page";
import { IonChip } from "@ionic/angular/standalone";
import { Bank } from "../Models/bank.model";
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-bank',
  templateUrl: 'bank.page.html',
  styleUrls: ['bank.page.scss'],
  standalone: true,
  imports: [CommonModule, UpdateBankPage, IonChip
  ]
})
export class BankPage {

  @Input() banks: Bank[] = [];

  constructor(public utility: UtilityService) {
  }
}
