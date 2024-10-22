import { Component, inject, Input } from "@angular/core";
import { deleteDoc, doc, DocumentSnapshot, Firestore, getDoc, updateDoc } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { IonButton, IonButtons, IonContent, IonInput, IonItem, IonModal, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { AppConstants } from "src/app/app.constants";
import { CardDetails } from "src/app/Models/card-details.model";

@Component({
  selector: 'app-update-card',
  templateUrl: 'update-card.page.html',
  styleUrls: ['update-card.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule,
    IonModal, IonContent, IonToolbar, IonTitle, IonButtons,
    IonButton, IonItem, IonInput]
})
export class UpdateCardPage {
  firestore: Firestore = inject(Firestore);
  cardTypeCollection = AppConstants.collections.cards;
  logPrefix: string = 'UPDATECARD_PAGE::: ';
  @Input() inputSelectedItemId: string = '';

  updateCardFG = new FormGroup({
    bankName: new FormControl(''),
    cardNumber: new FormControl(''),
    type: new FormControl('')
  });

  constructor(private alertController: AlertController) {
    console.log(this.logPrefix + "constructor");
  }

  onKeyPress() {
    let cardNum = this.updateCardFG.controls.cardNumber?.value?.toString() ?? '';
    if (cardNum.length > 3)
      return false;
    return true;
  }

  onUpdateSubmit(id: string) {
    if (id !== '' || id != null || id !== undefined) {
      var bankName = this.updateCardFG.controls.bankName.value?.toString()?.trim()?.toUpperCase();
      var cardNumber = this.updateCardFG.controls.cardNumber.value ?? 0;
      var type = this.updateCardFG.controls.type.value?.toString()?.trim()?.toUpperCase();
      updateDoc(doc(this.firestore, this.cardTypeCollection, id),
        {
          id: id,
          bankName: bankName,
          cardNumber: cardNumber,
          type: type,
          cardType: `${bankName}-${cardNumber}-${type}`
        }).then(() => {
          this.presentAlert('Success', "card type updaed successfully");
          console.log("card type updaed successfully");
        }).catch(x => {
          this.presentAlert('Warning', "card type updating failed");
          console.log("card type updating failed");
        });
    }
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

  onGetCardDetails(id: string) {
    if (id !== '' || id != null || id !== undefined) {
      getDoc(doc(this.firestore, this.cardTypeCollection, id)).then((doc: DocumentSnapshot) => {
        let cardDetails = doc.data() as CardDetails;
        this.updateCardFG.controls.bankName.setValue(cardDetails.bankName);
        this.updateCardFG.controls.cardNumber.setValue(cardDetails.cardNumber.toString());
        this.updateCardFG.controls.type.setValue(cardDetails.type);

      }).catch(x => {
        this.presentAlert('Warning', "card type updating failed");
        console.log("Category updating failed");
      });
    }
  }
  onDelete(id: string) {
    deleteDoc(doc(this.firestore, this.cardTypeCollection, id)).then(() => {
      this.presentAlert('Success', "card type deleted successfully");
      console.log("card type deleted successfully");
    }).catch(x => {
      this.presentAlert('Warning', "card type updating failed");
      console.log("card type deleting failed");
    });
  }

}