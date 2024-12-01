import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonToolbar, IonContent, IonButton, IonInput, IonItem,
  IonModal,
  IonButtons
} from '@ionic/angular/standalone';
import { Bank } from '../../Models/bank.model';
import { UUID } from 'angular2-uuid';
import { AppConstants } from '../../app.constants';
import { UtilityService } from 'src/app/services/utility.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-create-bank',
  templateUrl: 'create-bank.page.html',
  styleUrls: ['create-bank.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonModal, IonContent, IonToolbar, IonButton, IonButtons,
    IonItem, IonInput
  ]
})
export class CreateBankPage {

  newBanksFG = new FormGroup({
    name: new FormControl(''),
  });
  @Input() banks: Bank[] = [];

  constructor(private logger: LoggerService,
    public utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onCreate() {
    this.logger.trackEventCalls(CreateBankPage.name, "onSubmit");
    var name = this.newBanksFG.controls.name.value?.toString()?.toUpperCase()?.trim();

    if (this.banks.find(bank => bank.name == name) === undefined) {
      let bank = <Bank>{
        id: UUID.UUID(),
        name: name,
      };

      this.firebase.saveRecordDetails(AppConstants.collections.bank, bank);
    } else {
      this.utility.presentToast(AppConstants.alertHeader.WARNING, AppConstants.alertMessage.save.warning);
    }
    this.onClear();
  }

  onClear() {
    this.logger.trackEventCalls(CreateBankPage.name, "onClear");
    this.newBanksFG.controls.name.reset();
  }
}