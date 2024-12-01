import { Component, Input } from "@angular/core";
import { DocumentSnapshot } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonButton, IonButtons, IonContent, IonInput, IonItem, IonModal, IonToolbar
} from "@ionic/angular/standalone";
import { AppConstants } from "src/app/app.constants";
import { Bank } from "src/app/Models/bank.model";
import { FirebaseService } from "src/app/services/firebase.service";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-update-bank',
  templateUrl: 'update-bank.page.html',
  styleUrls: ['update-bank.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule,
    IonModal, IonContent, IonToolbar, IonButtons,
    IonButton, IonItem, IonInput]
})
export class UpdateBankPage {
  @Input() inputSelectedItemId: string = '';
  @Input() inputBanks: Bank[] = [];

  updateBankFG = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onUpdateSubmit(id: string) {
    this.logger.trackEventCalls(UpdateBankPage.name, "onUpdateSubmit");
    var name = this.updateBankFG.controls.name.value?.toString()?.trim()?.toUpperCase();
    let bankExisting = this.inputBanks.find(bank => bank.name == name);
    if (bankExisting !== undefined && bankExisting?.id != id) {
      this.utility.presentToast(AppConstants.alertHeader.WARNING, AppConstants.alertMessage.update.warning);
    } else {
      var bank = {
        id: id,
        name: name,
      };
      this.firebase.updateRecordDetails(AppConstants.collections.bank, bank);
    }
  }

  onGetBankDetails(id: string) {
    this.logger.trackEventCalls(UpdateBankPage.name, "onGetBankDetails");
    this.firebase.getRecordDetails(AppConstants.collections.bank, id).then((doc: DocumentSnapshot) => {
      let bank = doc.data() as Bank;
      this.updateBankFG.controls.name.setValue(bank.name);
    }).catch(ex => {
      this.utility.presentToast(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed+' with '+ ex);
    });
  }
  onDelete(id: string) {
    this.logger.trackEventCalls(UpdateBankPage.name, "onDelete");
    this.firebase.deleteRecordDetails(AppConstants.collections.bank, id);
  }
}