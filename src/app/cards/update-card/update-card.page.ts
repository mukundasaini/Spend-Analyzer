import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonButton, IonButtons, IonContent, IonSelectOption, IonItem, IonModal, IonToolbar,
  IonSelect
} from "@ionic/angular/standalone";
import { AppConstants } from "src/app/app.constants";
import { Bank } from "src/app/Models/bank.model";
import { CardDetails } from "src/app/Models/card-details.model";
import { CardType } from "src/app/Models/card-type.model";
import { FirebaseService } from "src/app/services/firebase.service";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-update-card',
  templateUrl: 'update-card.page.html',
  styleUrls: ['update-card.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    IonModal, IonContent, IonToolbar, IonButtons,
    IonButton, IonItem, IonSelect, IonSelectOption]
})
export class UpdateCardPage {

  updateCardFG = new FormGroup({
    bankName: new FormControl(''),
    type: new FormControl('')
  });

  @Input() inputSelectedItemId: string = '';
  @Input() inputCards: CardDetails[] = [];
  @Input() banks: Bank[] = [];
  @Input() cardTypes: CardType[] = [];
  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onUpdateSubmit(id: string) {
    this.logger.trackEventCalls(UpdateCardPage.name, "onUpdateSubmit");
    var bankName = this.updateCardFG.controls.bankName.value?.toString()?.trim()?.toUpperCase();
    var type = this.updateCardFG.controls.type.value?.toString()?.trim()?.toUpperCase();
    let cardExisting = this.inputCards.find(card => card.bankName == bankName && card.type == type);
    if (cardExisting !== undefined && cardExisting?.id != id) {
      this.utility.presentToast(AppConstants.alertHeader.WARNING, AppConstants.alertMessage.update.warning);
    } else {
      var cardDetails = {
        id: id,
        bankName: bankName,
        type: type,
        cardType: `${bankName}-${type}`,
      };

      this.firebase.updateRecordDetails(AppConstants.collections.cards, cardDetails);
    }
  }

  onGetCardDetails(id: string) {
    this.logger.trackEventCalls(UpdateCardPage.name, "onGetCardDetails");
    this.firebase.getRecordDetails(AppConstants.collections.cards, id).then((doc: DocumentSnapshot) => {
      let cardDetails = doc.data() as CardDetails;
      this.updateCardFG.controls.bankName.setValue(cardDetails.bankName);
      this.updateCardFG.controls.type.setValue(cardDetails.type);
    }).catch(ex => {
      this.utility.presentToast(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed + ' with ' + ex);
    });
  }
  onDelete(id: string) {
    this.logger.trackEventCalls(UpdateCardPage.name, "onDelete");
    this.firebase.deleteRecordDetails(AppConstants.collections.cards, id);
  }
}