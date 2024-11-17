import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonToolbar, IonContent, IonButton, IonInput, IonItem, 
  IonModal,
  IonButtons
  } from '@ionic/angular/standalone';
import { CardDetails } from '../../Models/card-details.model';
import { UUID } from 'angular2-uuid';
import { AppConstants } from '../../app.constants';
import { UtilityService } from 'src/app/services/utility.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-create-card',
  templateUrl: 'create-card.page.html',
  styleUrls: ['create-card.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonModal, IonContent, IonToolbar, IonButton, IonButtons,
    IonItem, IonInput
  ]
})
export class CreateCardPage {

  newCardsFG = new FormGroup({
    bankName: new FormControl(''),
    cardNumber: new FormControl(''),
    type: new FormControl('')
  });

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onSubmit() {
    this.logger.trackEventCalls(CreateCardPage.name, "onSubmit");
    var bankName = this.newCardsFG.controls.bankName.value?.toString()?.toUpperCase();
    var cardNumber = this.newCardsFG.controls.cardNumber.value ?? 0;
    var type = this.newCardsFG.controls.type.value?.toString()?.toUpperCase();

    let cardDetails = <CardDetails>{
      id: UUID.UUID(),
      bankName: bankName,
      cardNumber: cardNumber,
      type: type,
      cardType: `${bankName}-${cardNumber}-${type}`
    };

    this.firebase.saveRecordDetails(AppConstants.collections.cards, cardDetails);
    this.onClear();
  }

  onClear() {
    this.logger.trackEventCalls(CreateCardPage.name, "onClear");
    this.newCardsFG.controls.bankName.setValue('');
    this.newCardsFG.controls.cardNumber.setValue('');
    this.newCardsFG.controls.type.setValue('');
  }
}