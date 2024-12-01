import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonToolbar, IonContent, IonButton, IonInput, IonItem,
  IonModal,
  IonButtons
  ,
} from '@ionic/angular/standalone';
import { UUID } from 'angular2-uuid';
import { AppConstants } from '../../app.constants';
import { Category } from 'src/app/Models/category.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoggerService } from 'src/app/services/logger.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-create-category',
  templateUrl: 'create-category.page.html',
  styleUrls: ['create-category.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonModal, IonContent, IonToolbar, IonButton, IonButtons, IonInput,
    IonItem
  ]
})
export class CreateCategoryPage {

  categoryFG = new FormGroup({
    name: new FormControl(''),
  });

  @Input() cats: Category[] = [];

  constructor(private logger: LoggerService,
    private firebase: FirebaseService,
    private utility: UtilityService) {
  }

  onSubmit() {
    this.logger.trackEventCalls(CreateCategoryPage.name, "onSubmit");
    var order = this.cats.length + 1;
    let name = this.categoryFG.controls.name.value?.toString()?.trim()?.toUpperCase();

    if (this.cats.find(cat => cat.name == name) === undefined) {
      let category = <Category>{
        id: UUID.UUID(),
        name: name,
        order: order
      };

      this.firebase.saveRecordDetails(AppConstants.collections.category, category);
    } else {
      this.utility.presentToast(AppConstants.alertHeader.WARNING, AppConstants.alertMessage.save.warning);
    }
    this.onClear();
  }

  onClear() {
    this.logger.trackEventCalls(CreateCategoryPage.name, "onClear");
    this.categoryFG.controls.name.reset();
  }
}