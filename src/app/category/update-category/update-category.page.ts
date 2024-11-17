import { Component, Input } from "@angular/core";
import { DocumentSnapshot, } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonButton, IonButtons, IonContent, IonInput, IonItem, IonModal, IonTitle, IonToolbar
} from "@ionic/angular/standalone";
import { AppConstants } from "src/app/app.constants";
import { Category } from "src/app/Models/category.model";
import { FirebaseService } from "src/app/services/firebase.service";
import { LoggerService } from "src/app/services/logger.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: 'app-update-category',
  templateUrl: 'update-category.page.html',
  styleUrls: ['update-category.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonModal, IonContent, IonToolbar, IonButton, IonButtons,
    IonItem, IonInput
  ]
})
export class UpdateCategoryPage {
  @Input() inputSelectedItemId: string = '';
  updateCategoryFG = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private logger: LoggerService,
    private utility: UtilityService,
    private firebase: FirebaseService) {
  }

  onGetCategoryDetails(id: string) {
    this.logger.trackEventCalls(UpdateCategoryPage.name, "onGetCategoryDetails");
    this.firebase.getRecordDetails(AppConstants.collections.category, id).then((doc: DocumentSnapshot) => {
      let categoryDetils = doc.data() as Category;
      this.updateCategoryFG.controls.name.setValue(categoryDetils.name);
    }).catch(x => {
      this.utility.presentAlert(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.get.failed);
    });
  }

  onUpdateSubmit(id: string) {
    this.logger.trackEventCalls(UpdateCategoryPage.name, "onUpdateSubmit");
    var categoryDetails = {
      id: id,
      name: this.updateCategoryFG.controls.name.value?.toString()?.toUpperCase()
    };

    this.firebase.updateRecordDetails(AppConstants.collections.category, categoryDetails);
  }

  onDelete(id: string) {
    this.logger.trackEventCalls(UpdateCategoryPage.name, "onDelete");
    this.firebase.deleteRecordDetails(AppConstants.collections.category, id);
  }
}