import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonToolbar, IonContent, IonButton, IonItem,
  IonModal, IonSelect,
  IonButtons, IonSelectOption
} from '@ionic/angular/standalone';
import { CardDetails } from '../../Models/card-details.model';
import { UUID } from 'angular2-uuid';
import { AppConstants } from '../../app.constants';
import { UtilityService } from 'src/app/services/utility.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoggerService } from '../../services/logger.service';
import { CardType } from 'src/app/Models/card-type.model';
import { Bank } from 'src/app/Models/bank.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-card',
  templateUrl: 'create-card.page.html',
  styleUrls: ['create-card.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonModal, IonContent, IonToolbar, IonButton, IonButtons,
    IonItem, IonSelect, IonSelectOption
  ]
})
export class CreateCardPage {

  newCardsFG = new FormGroup({
    bankName: new FormControl(''),
    type: new FormControl('')
  });

  @Input() banks: Bank[] = [];
  @Input() cardTypes: CardType[] = [];
  @Input() cards: CardDetails[] = [];
  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onCreate() {
    this.logger.trackEventCalls(CreateCardPage.name, "onSubmit");
    var bankName = this.newCardsFG.controls.bankName.value?.toString()?.toUpperCase();
    var type = this.newCardsFG.controls.type.value?.toString()?.toUpperCase();
    var order = this.cards.length + 1;

    if (this.cards.find(card => card.bankName == bankName && card.type == type) === undefined) {
      let cardDetails = <CardDetails>{
        id: UUID.UUID(),
        bankName: bankName,
        type: type,
        cardType: `${bankName}-${type}`,
        order: order
      };

      this.firebase.saveRecordDetails(AppConstants.collections.cards, cardDetails);
    } else {
      this.utility.presentToast(AppConstants.alertHeader.WARNING, AppConstants.alertMessage.save.warning);
    }
    this.onClear();
  }

  onClear() {
    this.logger.trackEventCalls(CreateCardPage.name, "onClear");
    this.newCardsFG.controls.bankName.reset();
    this.newCardsFG.controls.type.reset();
  }
}