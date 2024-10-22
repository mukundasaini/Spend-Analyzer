import { CommonModule } from '@angular/common';
import { Component, inject, } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonToolbar, IonIcon, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel,
  IonModal,
  IonAlert,
  IonButtons,
  IonText,
  IonFabButton,
  IonFab,
  IonItemSliding,
  IonItemOptions,
  IonGrid,
  IonRow,
  IonCol,
  IonItemOption, IonChip,
  IonPopover,
  IonCheckbox,
  AlertController
} from '@ionic/angular/standalone';
import { CardDetails } from '../../Models/card-details.model';
import { UUID } from 'angular2-uuid';
import { AppConstants } from '../../app.constants';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { addIcons } from 'ionicons';
import { business } from 'ionicons/icons';

@Component({
  selector: 'app-create-card',
  templateUrl: 'create-card.page.html',
  styleUrls: ['create-card.page.scss'],
  standalone: true,
  imports: [IonHeader, IonGrid, IonPopover, IonCol, IonRow, IonChip,
    IonText, IonItemOptions, IonItemOption, IonCheckbox,
    IonFabButton, IonFab, IonButtons, IonAlert, IonModal, IonIcon, IonList, CommonModule, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
    IonCardTitle, IonItemSliding, IonCardSubtitle, IonCardContent, IonButton, IonItem, IonInput, IonLabel, ReactiveFormsModule]
})
export class CreateCardPage {
  firestore: Firestore = inject(Firestore);
  cardTypeCollection = AppConstants.collections.cards;
  logPrefix: string = 'CREATECARD_PAGE::: ';

  constructor(private alertController: AlertController) {
    console.log(this.logPrefix + "constructor");
    addIcons({ business });
  }

  newCardsFG = new FormGroup({
    bankName: new FormControl(''),
    cardNumber: new FormControl(''),
    type: new FormControl('')
  });

  onSubmit() {
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

    setDoc(doc(this.firestore, this.cardTypeCollection, cardDetails.id), cardDetails).then(x => {
      console.log(`${this.logPrefix}Saved successfully.`);
      this.presentAlert('Success', "card type saved successfully");
    }).catch(x => {
      console.log(`${this.logPrefix}Saving failed. Reason ${x}`);
      this.presentAlert('Warning', "card type saving failed");
    });
    this.onClear();
  }

  onClear() {
    this.newCardsFG.controls.bankName.setValue('');
    this.newCardsFG.controls.cardNumber.setValue('');
    this.newCardsFG.controls.type.setValue('');
  }

  async presentAlert(alertHeader: string, alertMessage: string,) {
    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: ['Close'],
      cssClass: 'alert-custom',
    });

    await alert.present();
  }

  onKeyPress() {
    let cardNum = this.newCardsFG.controls.cardNumber?.value?.toString() ?? '';
    if (cardNum.length > 3)
      return false;
    return true;
  }
}