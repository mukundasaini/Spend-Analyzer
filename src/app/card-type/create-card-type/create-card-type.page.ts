import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonToolbar, IonContent, IonButton, IonInput, IonItem,
  IonModal,
  IonButtons
} from '@ionic/angular/standalone';
import { UUID } from 'angular2-uuid';
import { AppConstants } from '../../app.constants';
import { UtilityService } from 'src/app/services/utility.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoggerService } from '../../services/logger.service';
import { CardType } from 'src/app/Models/card-type.model';

@Component({
  selector: 'app-create-card-type',
  templateUrl: 'create-card-type.page.html',
  styleUrls: ['create-card-type.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonModal, IonContent, IonToolbar, IonButton, IonButtons,
    IonItem, IonInput
  ]
})
export class CreateCardTypePage {

  newCardTypesFG = new FormGroup({
    name: new FormControl(''),
  });
  @Input() cardTypes: CardType[] = [];

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onCreate() {
    this.logger.trackEventCalls(CreateCardTypePage.name, "onSubmit");
    var name = this.newCardTypesFG.controls.name.value?.toString()?.toUpperCase()?.trim();

    if (this.cardTypes.find(cardType => cardType.name == name) === undefined) {
      let cardType = <CardType>{
        id: UUID.UUID(),
        name: name,
      };

      this.firebase.saveRecordDetails(AppConstants.collections.cardType, cardType);
    } else {
      this.utility.presentToast(AppConstants.alertHeader.WARNING, AppConstants.alertMessage.save.warning);
    }
    this.onClear();
  }

  onClear() {
    this.logger.trackEventCalls(CreateCardTypePage.name, "onClear");
    this.newCardTypesFG.controls.name.reset();
  }
}