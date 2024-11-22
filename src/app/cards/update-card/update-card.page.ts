import { Component, Input } from "@angular/core";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonButton, IonButtons, IonContent, IonInput, IonItem, IonModal, IonToolbar
} from "@ionic/angular/standalone";
import { AppConstants } from "src/app/app.constants";
import { CardDetails } from "src/app/Models/card-details.model";
import { FirebaseService } from "src/app/services/firebase.service";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-update-card',
  templateUrl: 'update-card.page.html',
  styleUrls: ['update-card.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule,
    IonModal, IonContent, IonToolbar, IonButtons,
    IonButton, IonItem, IonInput]
})
export class UpdateCardPage {
  @Input() inputSelectedItemId: string = '';

  updateCardFG = new FormGroup({
    bankName: new FormControl(''),
    cardNumber: new FormControl(''),
    type: new FormControl('')
  });

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onUpdateSubmit(id: string) {
    this.logger.trackEventCalls(UpdateCardPage.name, "onUpdateSubmit");
    var bankName = this.updateCardFG.controls.bankName.value?.toString()?.trim()?.toUpperCase();
    var cardNumber = this.updateCardFG.controls.cardNumber.value ?? 0;
    var type = this.updateCardFG.controls.type.value?.toString()?.trim()?.toUpperCase();

    var cardDetails = {
      id: id,
      bankName: bankName,
      cardNumber: cardNumber,
      type: type,
      cardType: `${bankName}-${cardNumber}-${type}`,
    };

    this.firebase.updateRecordDetails(AppConstants.collections.cards, cardDetails);
  }

  onGetCardDetails(id: string) {
    this.logger.trackEventCalls(UpdateCardPage.name, "onGetCardDetails");
    this.firebase.getRecordDetails(AppConstants.collections.cards, id).then((doc: DocumentSnapshot) => {
      let cardDetails = doc.data() as CardDetails;
      this.updateCardFG.controls.bankName.setValue(cardDetails.bankName);
      this.updateCardFG.controls.cardNumber.setValue(cardDetails.cardNumber.toString());
      this.updateCardFG.controls.type.setValue(cardDetails.type);
    }).catch(ex => {
      this.utility.presentAlert(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed, ex);
    });
  }
  onDelete(id: string) {
    this.logger.trackEventCalls(UpdateCardPage.name, "onDelete");
    this.firebase.deleteRecordDetails(AppConstants.collections.cards, id);
  }
}