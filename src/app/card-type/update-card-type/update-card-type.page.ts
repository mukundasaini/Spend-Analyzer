import { Component, Input } from "@angular/core";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonButton, IonButtons, IonContent, IonInput, IonItem, IonModal, IonToolbar
} from "@ionic/angular/standalone";
import { AppConstants } from "src/app/app.constants";
import { CardType } from "src/app/Models/card-type.model";
import { FirebaseService } from "src/app/services/firebase.service";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-update-card-type',
  templateUrl: 'update-card-type.page.html',
  styleUrls: ['update-card-type.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule,
    IonModal, IonContent, IonToolbar, IonButtons,
    IonButton, IonItem, IonInput]
})
export class UpdateCardTypePage {
  @Input() inputSelectedItemId: string = '';
  @Input() inputCardTypes: CardType[] = [];

  updateCardTypeFG = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onUpdateSubmit(id: string) {
    this.logger.trackEventCalls(UpdateCardTypePage.name, "onUpdateSubmit");
    var name = this.updateCardTypeFG.controls.name.value?.toString()?.trim()?.toUpperCase();
    let cardTypeExisting = this.inputCardTypes.find(cardType => cardType.name == name);
    if (cardTypeExisting !== undefined && cardTypeExisting?.id != id) {
      this.utility.presentToast(AppConstants.alertHeader.WARNING, AppConstants.alertMessage.update.warning);
    } else {
      var cardType = {
        id: id,
        name: name,
      };
      this.firebase.updateRecordDetails(AppConstants.collections.cardType, cardType);
    }
  }

  onGetCardTypeDetails(id: string) {
    this.logger.trackEventCalls(UpdateCardTypePage.name, "onGetCardTypeDetails");
    this.firebase.getRecordDetails(AppConstants.collections.cardType, id).then((doc: DocumentSnapshot) => {
      let cardType = doc.data() as CardType;
      this.updateCardTypeFG.controls.name.setValue(cardType.name);
    }).catch(ex => {
      this.utility.presentToast(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed+' with '+ ex);
    });
  }
  onDelete(id: string) {
    this.logger.trackEventCalls(UpdateCardTypePage.name, "onDelete");
    this.firebase.deleteRecordDetails(AppConstants.collections.cardType, id);
  }
}